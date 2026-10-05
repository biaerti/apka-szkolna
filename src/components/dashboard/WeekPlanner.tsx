import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import type { Lesson, LessonPeriod, LessonProgress, SchoolClass, TimetableEntry, VulcanLesson } from '../../data/types';
import { classGrade, lessonProgress } from '../../lib/grade';
import { toDateKey, weekDays } from '../../lib/dates';
import { assignedLessonForSlot, lessonAssignmentUpdates, lessonTitleWithPart } from '../../lib/dashboardPlan';
import { dyzuryNa } from '../../data/dyzury';
import { dutyAfter, dutyStatus } from '../../lib/dyzury';
import { obiadAfter, obiadLabel, obiadStatus, obiadTitle } from '../../lib/obiady';
import { classBadgeClasses } from '../calendar/classColor';
import { LessonAssignmentPicker } from './LessonAssignmentPicker';

interface Props {
  anchor: Date;
  now: Date;
  classes: SchoolClass[];
  lessons: Lesson[];
  periods: LessonPeriod[];
  timetable: TimetableEntry[];
  vulcanLessons: VulcanLesson[];
  setLessonProgress: (lessonId: string, classId: string, progress: LessonProgress) => void;
}

interface DayEntry {
  id: string;
  period: number;
  classId?: string;
  className?: string;
  room?: string;
  replacement?: string;
}

export function WeekPlanner(props: Props) {
  const [openPicker, setOpenPicker] = useState<string | null>(null);
  const days = weekDays(props.anchor).slice(0, 5);
  const classById = useMemo(() => new Map(props.classes.map((item) => [item.id, item])), [props.classes]);
  const periodByNo = useMemo(() => new Map(props.periods.map((item) => [item.no, item])), [props.periods]);
  // Przerwa z dyzurem / wyjsciem na obiad, ktora trwa teraz - chip "teraz".
  const dutyNow = dutyStatus(dyzuryNa(props.now), props.periods, props.now);
  const obiadNow = obiadStatus(props.timetable, props.classes, props.periods, props.now);

  function entriesFor(date: Date): DayEntry[] {
    const dateKey = toDateKey(date);
    const vulcan = props.vulcanLessons.filter((item) => item.date === dateKey);
    if (vulcan.length > 0) {
      return [...vulcan].sort((a, b) => a.period - b.period).map((item) => {
        const local = props.timetable.find((entry) => entry.weekday === date.getDay() && entry.period === item.period);
        return { ...item, room: local?.room };
      });
    }
    return props.timetable
      .filter((item) => item.weekday === date.getDay() && item.classId)
      .sort((a, b) => a.period - b.period);
  }

  function assign(classId: string, date: string, period: number, lessonId: string) {
    const slot = { id: `${date}-${period}`, date, period };
    for (const update of lessonAssignmentUpdates(props.lessons, classId, slot, lessonId)) {
      props.setLessonProgress(update.lessonId, classId, update.progress);
    }
    setOpenPicker(null);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      {days.map((date) => {
        const dateKey = toDateKey(date);
        const isToday = dateKey === toDateKey(props.now);
        const entries = entriesFor(date);
        return (
          <section key={dateKey} className={clsx('min-w-0 rounded-xl border bg-white', isToday ? 'border-accent-300 ring-2 ring-accent-100' : 'border-gray-200')}>
            <header className={clsx('border-b px-3 py-3', isToday ? 'border-accent-200 bg-accent-50' : 'border-gray-200')}>
              <h2 className={clsx('text-sm font-semibold capitalize', isToday ? 'text-accent-800' : 'text-gray-900')}>
                {date.toLocaleDateString('pl-PL', { weekday: 'long' })}
              </h2>
              <p className="mt-0.5 text-xs text-gray-500">{date.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' })}</p>
            </header>
            <div className="divide-y divide-gray-100">
              {entries.length === 0 && <p className="px-3 py-8 text-center text-sm text-gray-400">Brak lekcji</p>}
              {entries.map((entry) => {
                const cls = entry.classId ? classById.get(entry.classId) : undefined;
                const available = cls
                  ? props.lessons.filter((lesson) => lesson.grade === classGrade(cls.name)).sort((a, b) => a.order - b.order)
                  : [];
                const assigned = cls ? assignedLessonForSlot(props.lessons, cls.id, dateKey, entry.period) : undefined;
                const assignedProgress = cls && assigned ? lessonProgress(assigned.lesson, cls.id) : undefined;
                const assignedDone = assignedProgress?.status === 'done';
                const period = periodByNo.get(entry.period);
                const current = Boolean(isToday && period && props.now >= new Date(`${dateKey}T${period.start}:00`) && props.now < new Date(`${dateKey}T${period.end}:00`));
                const pickerId = `${dateKey}-${entry.period}`;
                const duty = dutyAfter(dyzuryNa(date), date.getDay(), entry.period);
                const obiad = cls ? obiadAfter(date, entry.period, cls.name) : undefined;
                const dutyTeraz = isToday && dutyNow.kind === 'now' && dutyNow.duty === duty;
                const obiadTeraz = isToday && obiadNow.kind === 'now' && obiadNow.obiad === obiad;
                const suggested = cls
                  ? available.find((lesson) => lessonProgress(lesson, cls.id).status === 'planned')
                    ?? available.find((lesson) => lessonProgress(lesson, cls.id).status === 'in_progress')
                  : undefined;
                return (
                  <article key={entry.id} className={clsx('px-3 py-3', current && 'bg-accent-50/70', assignedDone && !current && 'bg-gray-50/80')}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="text-xs font-semibold tabular-nums text-gray-500">{entry.period}.</span>
                        <span className={clsx('rounded border px-1.5 py-0.5 text-xs font-semibold', cls ? classBadgeClasses(cls.order) : 'border-gray-200 text-gray-500')}>
                          {cls?.name ?? entry.className ?? '?'}
                        </span>
                      </div>
                      <span className="shrink-0 text-[11px] tabular-nums text-gray-500">{period ? `${period.start}-${period.end}` : ''}</span>
                    </div>
                    {(entry.room || entry.replacement) && (
                      <p className="mt-1.5 truncate text-xs text-gray-500">{entry.room ? `s. ${entry.room}` : ''}{entry.room && entry.replacement ? ' · ' : ''}{entry.replacement}</p>
                    )}
                    {(duty || obiad) && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {duty && (
                          <span
                            className={clsx('rounded border px-1.5 py-0.5 text-[11px] font-medium', dutyTeraz ? 'border-amber-500 bg-amber-400 text-amber-950' : 'border-amber-300 bg-amber-50 text-amber-800')}
                            title={`Po tej lekcji dyżur: ${duty.place}`}
                          >
                            {dutyTeraz ? 'Dyżur teraz' : 'Potem dyżur'}: {duty.place}
                          </span>
                        )}
                        {obiad && (
                          <span
                            className={clsx('rounded border px-1.5 py-0.5 text-[11px] font-medium', obiadTeraz ? 'border-emerald-500 bg-emerald-400 text-emerald-950' : 'border-emerald-300 bg-emerald-50 text-emerald-800')}
                            title={obiadTitle(obiad)}
                          >
                            {obiadTeraz ? 'Obiad teraz' : 'Potem obiad'}: {obiadLabel(obiad)}
                          </span>
                        )}
                      </div>
                    )}
                    {cls ? (
                      <>
                        {assigned ? (
                          <div className="mt-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className={clsx('text-xs font-semibold leading-5', assignedDone ? 'text-gray-500' : 'text-gray-900')}>{lessonTitleWithPart(assigned.lesson.title, assigned.part)}</p>
                                <p className={clsx('text-[11px] font-medium', assignedDone ? 'text-gray-500' : 'text-accent-700')}>{assignedDone ? 'Zrobiona' : 'W trakcie'}</p>
                              </div>
                              <button
                                type="button"
                                aria-expanded={openPicker === pickerId}
                                onClick={() => setOpenPicker((value) => value === pickerId ? null : pickerId)}
                                className="min-h-10 shrink-0 rounded-lg px-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
                              >
                                Zmień
                              </button>
                            </div>
                            <Link
                              className={clsx(
                                'mt-2 flex min-h-11 w-full items-center justify-center rounded-lg px-3 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500',
                                assignedDone ? 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100' : 'bg-accent-600 text-white hover:bg-accent-700',
                              )}
                              to={`/dziennik?data=${dateKey}&lekcja=${entry.period}&klasa=${cls.id}&material=${assigned.lesson.id}&czesc=${assigned.part}`}
                            >
                              Sprawdź obecność
                            </Link>
                          </div>
                        ) : (
                          <button
                            type="button"
                            aria-expanded={openPicker === pickerId}
                            onClick={() => setOpenPicker((value) => value === pickerId ? null : pickerId)}
                            className="mt-3 min-h-11 w-full rounded-lg border border-dashed border-amber-400 bg-amber-50 px-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
                          >
                            <span className="block text-xs font-semibold text-amber-900">Wybierz temat</span>
                            <span className="mt-0.5 block truncate text-[11px] text-amber-700">{suggested ? `Następna: ${suggested.title}` : 'Brak lekcji do wyboru'}</span>
                          </button>
                        )}
                        {openPicker === pickerId && (
                          <LessonAssignmentPicker
                            lessons={available}
                            classId={cls.id}
                            selectedLessonId={assigned?.lesson.id}
                            onSelect={(lessonId) => assign(cls.id, dateKey, entry.period, lessonId)}
                            onClear={assigned ? () => assign(cls.id, dateKey, entry.period, '') : undefined}
                            onClose={() => setOpenPicker(null)}
                          />
                        )}
                      </>
                    ) : (
                      <p className="mt-2 text-xs text-amber-700">Klasa z VULCANA nie jest dodana w aplikacji</p>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
