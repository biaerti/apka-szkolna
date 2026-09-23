// Obecnosc na telefonie -> VULCAN. Lista po numerach z dziennika, tap w ucznia
// przestawia: obecny -> nieobecny -> spozniony -> obecny. Kazdy tap od razu
// trafia do store (kolo na komputerze przestaje losowac nieobecnych), a
// "Zapisz w VULCANIE" wysyla zlecenie do komputera z dodatkiem, ktory wpisuje
// frekwencje w dzienniku sam, w tle (patrz src/lib/vulcanFrekwencja.ts).
// Spoznialskiego zaznacza sie potem jednym tapem i wysyla poprawke.

import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { useStore } from '../../data/store';
import type { Student } from '../../data/types';
import { attendanceForLesson, type AttendanceStatus } from '../../lib/attendance';
import { suggestedJournalLesson } from '../../lib/vulcan';
import { frekwencjaJobId, type FrekwencjaJob } from '../../lib/vulcanFrekwencja';
import { fetchFrekwencjaJobs, submitFrekwencjaJob, subscribeFrekwencjaJobs } from '../../data/remote/frekwencjaJobs';

const NEXT: Record<AttendanceStatus, AttendanceStatus> = { present: 'absent', absent: 'late', late: 'present' };

export interface LessonOption {
  period: number;
  label: string;
}

export function FrekwencjaView({
  classId,
  students,
  date,
  lessons,
  defaultPeriod,
}: {
  classId: string;
  students: Student[];
  date: string;
  lessons: LessonOption[];
  defaultPeriod?: number;
}) {
  const absences = useStore((s) => s.absences);
  const setAttendance = useStore((s) => s.setAttendance);
  const [period, setPeriod] = useState<number | undefined>(defaultPeriod ?? lessons[0]?.period);
  const [topic, setTopic] = useState('');
  const [topicTouched, setTopicTouched] = useState(false);
  const [job, setJob] = useState<FrekwencjaJob | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lessonsKey = lessons.map((l) => l.period).join(',');
  useEffect(() => {
    setPeriod(defaultPeriod ?? lessons[0]?.period);
    // lessons liczy sie od nowa przy kazdym odswiezeniu z chmury - wystarczy klucz.
  }, [classId, defaultPeriod, lessonsKey]);

  const jobId = period === undefined ? null : frekwencjaJobId(date, period, classId);

  // Status zlecenia: realtime + zapasowy polling co 4 s.
  useEffect(() => {
    if (!jobId) return;
    let stopped = false;
    const load = () =>
      fetchFrekwencjaJobs(date)
        .then((jobs) => {
          if (!stopped) setJob(jobs.find((j) => j.id === jobId) ?? null);
        })
        .catch(() => {});
    void load();
    const timer = window.setInterval(load, 4000);
    const unsubscribe = subscribeFrekwencjaJobs(load);
    return () => {
      stopped = true;
      window.clearInterval(timer);
      unsubscribe();
    };
  }, [jobId, date]);

  // Temat: z wyslanego zlecenia, a gdy go nie ma - podpowiedz z tematow apki.
  useEffect(() => {
    if (topicTouched) return;
    if (job?.topic) {
      setTopic(job.topic);
      return;
    }
    const { lessons: all, classes } = useStore.getState();
    setTopic(period === undefined ? '' : suggestedJournalLesson(all, classes, classId, date, period)?.title ?? '');
  }, [job?.topic, period, classId, date, topicTouched]);

  const statuses = useMemo(
    () => (period === undefined ? new Map<string, AttendanceStatus>() : attendanceForLesson(absences, classId, date, period)),
    [absences, classId, date, period],
  );

  if (lessons.length === 0 || period === undefined) {
    return (
      <p className="rounded-lg border border-gray-200 bg-white px-4 py-6 text-center text-sm text-gray-600">
        Dziś ta klasa nie ma lekcji w planie z VULCANA - nie ma gdzie wpisać obecności.
      </p>
    );
  }

  const status = (st: Student): AttendanceStatus => statuses.get(st.id) ?? 'present';
  const absent = students.filter((st) => status(st) === 'absent').length;
  const late = students.filter((st) => status(st) === 'late').length;
  const marks = students.map((st) => ({ studentId: st.id, status: status(st) }));
  const sentKey = job ? JSON.stringify([...job.marks].sort((a, b) => a.studentId.localeCompare(b.studentId))) : '';
  const nowKey = JSON.stringify([...marks].sort((a, b) => a.studentId.localeCompare(b.studentId)));
  const changedSinceSend = !!job && (sentKey !== nowKey || job.topic !== topic.trim());

  async function send() {
    if (period === undefined || !jobId) return;
    setSending(true);
    setError(null);
    try {
      await submitFrekwencjaJob({ id: jobId, date, period, classId, marks, topic: topic.trim() });
      setJob({ id: jobId, date, period, classId, marks, topic: topic.trim(), status: 'pending', createdAt: new Date().toISOString() });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Nie udało się wysłać.');
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <select
          value={period}
          onChange={(e) => setPeriod(Number(e.target.value))}
          aria-label="Lekcja"
          className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900"
        >
          {lessons.map((l) => (
            <option key={l.period} value={l.period}>
              {l.label}
            </option>
          ))}
        </select>
        <span className="ml-auto text-sm tabular-nums text-gray-600">
          nieob. <strong className="text-red-600">{absent}</strong> · spóźn. <strong className="text-amber-600">{late}</strong>
        </span>
      </div>

      <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
        {students.map((st) => {
          const s = status(st);
          return (
            <li key={st.id}>
              <button
                type="button"
                onClick={() => setAttendance({ studentId: st.id, classId, date, period, status: NEXT[s] })}
                className={clsx(
                  'flex w-full items-center gap-3 px-3 py-3 text-left text-base active:bg-accent-50',
                  s === 'absent' && 'bg-red-50',
                  s === 'late' && 'bg-amber-50',
                )}
              >
                <span className="w-7 shrink-0 text-right text-lg font-semibold tabular-nums text-gray-500">{st.number}</span>
                <span className={clsx('min-w-0 flex-1 truncate text-gray-900', s === 'absent' && 'text-gray-500 line-through')}>
                  <span className="font-medium">{st.lastName}</span> {st.firstName}
                </span>
                <span
                  className={clsx(
                    'w-20 shrink-0 rounded px-2 py-0.5 text-center text-xs font-semibold',
                    s === 'present' && 'text-gray-400',
                    s === 'absent' && 'bg-red-600 text-white',
                    s === 'late' && 'bg-amber-500 text-white',
                  )}
                >
                  {s === 'present' ? 'obecny' : s === 'absent' ? 'nieobecny' : 'spóźniony'}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <label className="mt-4 block text-sm text-gray-600">
        Temat (potrzebny, gdy lekcji nie ma jeszcze w VULCANIE)
        <input
          value={topic}
          onChange={(e) => {
            setTopicTouched(true);
            setTopic(e.target.value);
          }}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900"
        />
      </label>

      <div className="sticky bottom-3 mt-4">
        <button
          type="button"
          disabled={sending || (!!job && !changedSinceSend && job.status !== 'error')}
          onClick={() => void send()}
          className="w-full rounded-lg bg-accent-600 px-4 py-3 text-base font-semibold text-white shadow-lg disabled:opacity-50"
        >
          {sending ? 'Wysyłam…' : job && changedSinceSend ? 'Wyślij poprawkę do VULCANA' : job?.status === 'error' ? 'Spróbuj jeszcze raz' : 'Zapisz w VULCANIE'}
        </button>
        <JobStatus job={job} error={error} />
      </div>
    </div>
  );
}

function JobStatus({ job, error }: { job: FrekwencjaJob | null; error: string | null }) {
  if (error) return <p className="mt-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>;
  if (!job) return null;
  const tone =
    job.status === 'done' ? 'bg-emerald-50 text-emerald-800' : job.status === 'error' ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-700';
  const text =
    job.status === 'pending'
      ? 'Czeka na komputer z VULCANEM…'
      : job.status === 'sending'
        ? 'Komputer wpisuje do VULCANA…'
        : job.message || (job.status === 'done' ? 'Zapisane w VULCANIE.' : 'Nie udało się.');
  return <p className={clsx('mt-2 rounded-md px-3 py-2 text-sm', tone)}>{text}</p>;
}
