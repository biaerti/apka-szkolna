import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useStore } from '../data/store';
import { attendanceForLesson, type AttendanceStatus } from '../lib/attendance';
import { toDateKey } from '../lib/dates';
import { curriculumByCode } from '../data/podstawa';
import { buildVulcanTransfer, lessonsForJournal, suggestedJournalLesson, vulcanClassName, type VulcanScheduleEntry } from '../lib/vulcan';
import { matchVulcanAttendance, requestVulcanAttendance } from '../lib/vulcanAttendance';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';

type BridgeState = 'checking' | 'ready' | 'sent' | 'missing' | 'error';
type ScheduleState = 'idle' | 'loading' | 'ready' | 'error';

function dateFromKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day, 12);
}

function weekdayFromDate(key: string): number {
  const day = dateFromKey(key).getDay();
  return day >= 1 && day <= 5 ? day : 0;
}

function dateLabel(key: string): string {
  return dateFromKey(key).toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' });
}

function attendanceButtonClass(status: AttendanceStatus, selected: boolean): string {
  const base = 'h-9 w-10 border-r border-gray-200 text-sm font-semibold last:border-r-0 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent-500';
  if (!selected) return `${base} bg-white text-gray-600 hover:bg-gray-50`;
  if (status === 'present') return `${base} bg-emerald-600 text-white`;
  if (status === 'absent') return `${base} bg-red-600 text-white`;
  return `${base} bg-amber-400 text-amber-950`;
}

export function Journal() {
  const [params, setParams] = useSearchParams();
  const classes = useStore((s) => s.classes);
  const students = useStore((s) => s.students);
  const lessons = useStore((s) => s.lessons);
  const timetable = useStore((s) => s.timetable);
  const absences = useStore((s) => s.absences);
  const setAttendance = useStore((s) => s.setAttendance);

  const date = params.get('data') ?? toDateKey(new Date());
  const [vulcanSchedule, setVulcanSchedule] = useState<VulcanScheduleEntry[]>([]);
  const [scheduleState, setScheduleState] = useState<ScheduleState>('idle');
  const localEntries = useMemo(
    () => timetable.filter((entry) => entry.weekday === weekdayFromDate(date) && entry.classId).sort((a, b) => a.period - b.period),
    [timetable, date],
  );
  const vulcanEntries = useMemo(
    () => vulcanSchedule
      .filter((item) => item.date === date && item.subject.toLocaleLowerCase('pl').includes('język polski'))
      .map((item) => {
        const normalizedClass = item.className.replace(/\s+/g, '').toLocaleLowerCase('pl');
        const cls = classes.find((candidate) => vulcanClassName(candidate.name).toLocaleLowerCase('pl') === normalizedClass);
        return cls ? { id: `vulcan-${item.date}-${item.period}-${cls.id}`, weekday: weekdayFromDate(date), period: item.period, classId: cls.id, replacement: item.replacement } : null;
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .sort((a, b) => a.period - b.period),
    [vulcanSchedule, date, classes],
  );
  const entries = vulcanEntries.length > 0 ? vulcanEntries : localEntries;
  const requestedPeriod = Number(params.get('lekcja'));
  const requestedClassId = params.get('klasa');
  const entry =
    entries.find((item) => item.period === requestedPeriod && (!requestedClassId || item.classId === requestedClassId)) ?? entries[0];
  const schoolClass = classes.find((item) => item.id === entry?.classId);
  const candidateLessons = useMemo(
    () => (schoolClass ? lessonsForJournal(lessons, classes, schoolClass.id) : []),
    [lessons, classes, schoolClass],
  );
  const suggestedLesson = schoolClass ? suggestedJournalLesson(lessons, classes, schoolClass.id, date, entry?.period) : undefined;
  const requestedMaterialId = params.get('material');
  const [lessonId, setLessonId] = useState('');
  const selectedLesson = candidateLessons.find((item) => item.id === lessonId) ?? suggestedLesson ?? candidateLessons[0];
  const [topic, setTopic] = useState('');
  const [bridge, setBridge] = useState<BridgeState>('checking');
  // "Pobierz z VULCANA" przy frekwencji: stan i krotki komunikat wyniku.
  const [attPull, setAttPull] = useState<'idle' | 'loading'>('idle');
  const [attPullInfo, setAttPullInfo] = useState('');

  function checkBridge() {
    setBridge('checking');
    window.postMessage({ source: 'apka-szkolna', type: 'VULCAN_BRIDGE_PING' }, '*');
    window.setTimeout(() => setBridge((state) => (state === 'checking' ? 'missing' : state)), 1200);
  }

  useEffect(() => {
    setLessonId(candidateLessons.some((lesson) => lesson.id === requestedMaterialId) ? requestedMaterialId ?? '' : suggestedLesson?.id ?? candidateLessons[0]?.id ?? '');
  }, [schoolClass?.id, date, requestedMaterialId, suggestedLesson?.id, candidateLessons]);

  useEffect(() => {
    setTopic(selectedLesson?.registerTopic ?? selectedLesson?.topic ?? selectedLesson?.title ?? '');
  }, [selectedLesson?.id]);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.source !== window || !event.data || event.data.source !== 'vulcan-pomocnik') return;
      if (event.data.type === 'VULCAN_BRIDGE_READY') setBridge('ready');
      if (event.data.type === 'VULCAN_TRANSFER_ACCEPTED') setBridge('sent');
      if (event.data.type === 'VULCAN_TRANSFER_ERROR') setBridge('error');
      if (event.data.type === 'VULCAN_SCHEDULE_RESULT') {
        const received = Array.isArray(event.data.detail?.entries) ? event.data.detail.entries as VulcanScheduleEntry[] : [];
        setVulcanSchedule(received);
        setScheduleState('ready');
      }
      if (event.data.type === 'VULCAN_SCHEDULE_ERROR') setScheduleState('error');
    }
    window.addEventListener('message', onMessage);
    window.postMessage({ source: 'apka-szkolna', type: 'VULCAN_BRIDGE_PING' }, '*');
    const timer = window.setTimeout(() => setBridge((state) => (state === 'checking' ? 'missing' : state)), 1200);
    return () => {
      window.removeEventListener('message', onMessage);
      window.clearTimeout(timer);
    };
  }, []);

  function readVulcanSchedule() {
    setScheduleState('loading');
    window.postMessage({ source: 'apka-szkolna', type: 'VULCAN_SCHEDULE_REQUEST' }, '*');
    window.setTimeout(() => setScheduleState((state) => (state === 'loading' ? 'error' : state)), 4000);
  }

  const attendance = useMemo<Map<string, AttendanceStatus>>(
    () => (schoolClass && entry ? attendanceForLesson(absences, schoolClass.id, date, entry.period) : new Map<string, AttendanceStatus>()),
    [absences, schoolClass, date, entry],
  );
  const classStudents = useMemo(
    () => students.filter((student) => student.classId === schoolClass?.id && student.active).sort((a, b) => a.number - b.number),
    [students, schoolClass],
  );
  const counts = classStudents.reduce(
    (result, student) => {
      const status = attendance.get(student.id) ?? 'present';
      result[status] += 1;
      return result;
    },
    { present: 0, absent: 0, late: 0 },
  );

  async function pullAttendanceFromVulcan() {
    if (!entry || !schoolClass) return;
    setAttPull('loading');
    setAttPullInfo('');
    try {
      const rows = await requestVulcanAttendance(entry.period);
      const { matched, unmatched } = matchVulcanAttendance(rows, classStudents);
      for (const item of matched) {
        setAttendance({ studentId: item.studentId, classId: schoolClass.id, date, period: entry.period, status: item.status });
      }
      const absent = matched.filter((m) => m.status === 'absent').length;
      const late = matched.filter((m) => m.status === 'late').length;
      setAttPullInfo(`Naniesiono z VULCANA: ${absent} nieobecnych, ${late} spóźnionych${unmatched.length > 0 ? ` · bez pary: ${unmatched.join(', ')}` : ''}`);
    } catch (error) {
      setAttPullInfo(error instanceof Error ? error.message : 'Nie udało się odczytać frekwencji.');
    } finally {
      setAttPull('idle');
    }
  }

  function updateSelection(value: string) {
    const next = entries.find((item) => item.id === value);
    if (!next?.classId) return;
    setParams({ data: date, lekcja: String(next.period), klasa: next.classId });
  }

  function changeDate(nextDate: string) {
    setParams({ data: nextDate });
  }

  function sendToVulcan() {
    if (!entry || !schoolClass || !selectedLesson || !topic.trim()) return;
    if (bridge === 'missing') {
      setBridge('missing');
      return;
    }
    setBridge('checking');
    window.postMessage(
      {
        source: 'apka-szkolna',
        type: 'VULCAN_TRANSFER',
        payload: buildVulcanTransfer({ date, entry, schoolClass, lesson: selectedLesson, topic, students: classStudents, attendance }),
      },
      '*',
    );
    window.setTimeout(() => setBridge((state) => (state === 'checking' ? 'error' : state)), 3000);
  }

  if (!entry || !schoolClass) {
    return (
      <div>
        <Link to="/" className="mb-4 inline-block text-sm text-gray-500 hover:text-accent-700">Wróć na pulpit</Link>
        <EmptyState title="Brak lekcji w planie" description={`W planie na ${dateLabel(date)} nie ma żadnej klasy.`} />
      </div>
    );
  }

  return (
    <div className="journal-frame mx-auto box-border w-full min-w-0 max-w-5xl pb-24">
      <Link to="/" className="mb-3 inline-flex text-sm text-gray-500 hover:text-accent-700">Wróć na pulpit</Link>
      <div className="mb-6 flex flex-col gap-4 border-b border-gray-200 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-950">Dziennik lekcji</h1>
          <p className="mt-1 text-sm text-gray-500">Wybierz godzinę, sprawdź temat i zaznacz tylko wyjątki.</p>
        </div>
        <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="min-w-0 text-xs font-medium text-gray-600">
            Data
            <input type="date" value={date} onChange={(event) => changeDate(event.target.value)} className="mt-1 block w-full min-w-0 max-w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm" />
          </label>
          <label className="min-w-0 text-xs font-medium text-gray-600">
            Godzina z planu
            <select value={entry.id} onChange={(event) => updateSelection(event.target.value)} className="mt-1 block w-full min-w-0 max-w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
              {entries.map((item) => {
                const cls = classes.find((candidate) => candidate.id === item.classId);
                return <option key={item.id} value={item.id}>{item.period}. lekcja - {cls?.name ?? '?'}</option>;
              })}
            </select>
          </label>
          <div className="flex flex-wrap items-center justify-end gap-2 text-xs text-gray-500 sm:col-span-2">
            <span>{vulcanEntries.length > 0 ? 'Godziny z VULCANA' : 'Godziny z planu aplikacji'}</span>
            <button type="button" onClick={readVulcanSchedule} disabled={bridge !== 'ready' || scheduleState === 'loading'} className="min-h-9 rounded-md border border-gray-300 bg-white px-3 font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
              {scheduleState === 'loading' ? 'Pobieram…' : 'Pobierz z VULCANA'}
            </button>
            {scheduleState === 'error' && <span className="text-red-600">Otwórz dziennik na widoku lekcji i spróbuj ponownie.</span>}
          </div>
        </div>
      </div>

      {'replacement' in entry && entry.replacement && <p className="mb-5 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">Zastępstwo w VULCANIE: {entry.replacement}</p>}

      <section className="mb-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div>
          {candidateLessons.length === 0 ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-950">
              <p className="text-sm font-semibold">Brak materiałów dla {schoolClass.name}</p>
              <p className="mt-1 text-sm text-amber-900">Najpierw wstaw gotowe lekcje rocznika albo utwórz własną. Frekwencję możesz już zaznaczyć poniżej.</p>
              <Link to={`/lekcje?klasa=${schoolClass.id}`} className="mt-3 inline-flex rounded-md bg-amber-900 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-950">Przejdź do materiałów</Link>
            </div>
          ) : (
          <>
          <label className="block text-sm font-semibold text-gray-900">
            Lekcja z materiałów
            <select value={selectedLesson?.id ?? ''} onChange={(event) => setLessonId(event.target.value)} className="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm">
              {candidateLessons.map((lesson) => <option key={lesson.id} value={lesson.id}>{lesson.code ? `${lesson.code} · ` : ''}{lesson.title}</option>)}
            </select>
          </label>
          <label className="mt-4 block text-sm font-semibold text-gray-900">
            Temat do VULCANA
            <textarea value={topic} onChange={(event) => setTopic(event.target.value)} rows={3} className="mt-2 block w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm leading-6 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-200" />
          </label>
          </>
          )}
        </div>
        <div className="border-t border-gray-200 pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <p className="text-sm font-semibold text-gray-900">Podstawa programowa</p>
          {!selectedLesson ? (
            <p className="mt-2 text-sm text-gray-600">Wybierz lub dodaj materiał lekcji, aby zobaczyć kody.</p>
          ) : selectedLesson.curriculum?.length ? (
            <ul className="mt-2 space-y-2">
              {selectedLesson.curriculum.map((code) => <li key={code} className="text-xs leading-5 text-gray-600"><strong className="text-gray-900">{code}</strong> {curriculumByCode(code)?.text}</li>)}
            </ul>
          ) : <p className="mt-2 text-sm text-amber-700">Ta lekcja nie ma jeszcze przypisanych kodów.</p>}
          {selectedLesson && <Link to={`/lekcje?klasa=${schoolClass.id}`} className="mt-3 inline-block text-xs font-medium text-accent-700 hover:underline">Popraw materiał lekcji</Link>}
        </div>
      </section>

      <section>
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-950">Frekwencja - {schoolClass.name}</h2>
            <p className="mt-1 text-sm text-gray-500">Każdy zaczyna jako obecny. Kliknij „-” albo „s”, gdy trzeba.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm tabular-nums text-gray-600"><strong className="text-emerald-700">{counts.present} obecnych</strong> · {counts.absent} nieobecnych · {counts.late} spóźnionych</p>
            <button
              type="button"
              onClick={pullAttendanceFromVulcan}
              disabled={bridge !== 'ready' || attPull === 'loading'}
              title="Odczytaj frekwencję tej godziny z otwartej karty VULCANA"
              className="min-h-9 rounded-md border border-gray-300 bg-white px-3 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {attPull === 'loading' ? 'Pobieram…' : 'Pobierz z VULCANA'}
            </button>
          </div>
        </div>
        {attPullInfo && <p className="mb-3 text-xs text-gray-600">{attPullInfo}</p>}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          {classStudents.map((student) => {
            const value = attendance.get(student.id) ?? 'present';
            return (
              <div key={student.id} className="flex min-h-14 items-center gap-3 border-b border-gray-100 px-3 py-2 last:border-b-0 sm:px-4">
                <span className="w-6 shrink-0 text-right text-xs tabular-nums text-gray-400">{student.number}</span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900">{student.lastName} {student.firstName}</span>
                <div className="grid shrink-0 grid-cols-3 overflow-hidden rounded-lg border border-gray-200" role="group" aria-label={`Frekwencja: ${student.firstName} ${student.lastName}`}>
                  {([
                    ['present', '.', 'Obecny'],
                    ['absent', '-', 'Nieobecny'],
                    ['late', 's', 'Spóźniony'],
                  ] as const).map(([status, symbol, label]) => (
                    <button key={status} type="button" onClick={() => setAttendance({ studentId: student.id, classId: schoolClass.id, date, period: entry.period, status })} aria-label={label} aria-pressed={value === status} title={label} className={attendanceButtonClass(status, value === status)}>{symbol}</button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-gray-200 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur md:left-56">
        <div className="journal-frame mx-auto box-border flex w-full min-w-0 max-w-5xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
            {bridge === 'ready' && 'Pomocnik Chrome jest gotowy.'}
            {bridge === 'sent' && 'Paczka otwarta w VULCANIE - sprawdź podgląd w tamtej karcie.'}
            {bridge === 'missing' && <>Brak dodatku Chrome. Zainstaluj folder <code className="rounded bg-gray-100 px-1">vulcan-extension</code>.</>}
            {bridge === 'error' && 'Pomocnik nie odpowiedział. Odśwież kartę aplikacji i VULCANA.'}
            {bridge === 'checking' && 'Sprawdzam połączenie z Chrome…'}
            {(bridge === 'missing' || bridge === 'error') && <button type="button" onClick={checkBridge} className="font-semibold text-accent-700 hover:underline">Sprawdź ponownie</button>}
          </div>
          <Button onClick={sendToVulcan} disabled={!selectedLesson || !topic.trim() || bridge === 'checking' || bridge === 'missing' || bridge === 'error'}>Wyślij do VULCANA</Button>
        </div>
      </div>
    </div>
  );
}
