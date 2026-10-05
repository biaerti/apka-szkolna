// Plan tygodnia na pulpicie: piec kolumn (pon-pt), w kazdej lekcje z planu
// albo z VULCANA. Lekcja to jeden wiersz: numer i godzina z lewej, klasa i
// sala, pod spodem temat (albo "Wybierz temat"). Dyzur i obiad dzieja
// sie na przerwie, wiec stoja jako cienka linia "przerwa" MIEDZY lekcjami,
// a nie jako odznaki na lekcji. Spokojnie: bez ramek w ramkach, kolor tylko
// tam, gdzie cos znaczy (trwajaca lekcja, "teraz" na przerwie).

import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import type { Lesson, LessonPeriod, LessonProgress, SchoolClass, TimetableEntry, VulcanLesson } from '../../data/types';
import { dyzuryNa } from '../../data/dyzury';
import { OBIADOWICZE } from '../../data/obiady';
import { classGrade, lessonProgress } from '../../lib/grade';
import { toDateKey, weekDays } from '../../lib/dates';
import { assignedLessonForSlot, dayEntries, lessonAssignmentUpdates, lessonTitleWithPart } from '../../lib/dashboardPlan';
import { dutyAfter, dutyStatus } from '../../lib/dyzury';
import { obiadAfter, obiadStatus, obiadTitle } from '../../lib/obiady';
import { periodStatus } from '../../lib/timetable';
import { isTopicSent, topicItemForSlot, topicKey, type TopicItem, type TopicSendState } from '../../lib/vulcanTemat';
import { classBadgeClasses } from '../calendar/classColor';
import { LessonAssignmentPicker } from './LessonAssignmentPicker';
import type { VulcanTopics } from './useVulcanTopics';

interface Props {
  anchor: Date;
  now: Date;
  classes: SchoolClass[];
  lessons: Lesson[];
  periods: LessonPeriod[];
  timetable: TimetableEntry[];
  vulcanLessons: VulcanLesson[];
  setLessonProgress: (lessonId: string, classId: string, progress: LessonProgress) => void;
  topics: VulcanTopics;
}

const WEEKDAY = ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'];

export function WeekPlanner(props: Props) {
  const [openPicker, setOpenPicker] = useState<string | null>(null);
  const days = weekDays(props.anchor).slice(0, 5);
  const classById = useMemo(() => new Map(props.classes.map((item) => [item.id, item])), [props.classes]);
  const periodByNo = useMemo(() => new Map(props.periods.map((item) => [item.no, item])), [props.periods]);
  const status = periodStatus(props.periods, props.now);
  const currentPeriod = status.kind === 'lesson' ? status.period.no : undefined;
  const dutyNow = dutyStatus(dyzuryNa(props.now), props.periods, props.now);
  const obiadNow = obiadStatus(props.timetable, props.classes, props.periods, props.now);

  function assign(classId: string, date: string, period: number, lessonId: string) {
    const slot = { id: `${date}-${period}`, date, period };
    for (const update of lessonAssignmentUpdates(props.lessons, classId, slot, lessonId)) {
      props.setLessonProgress(update.lessonId, classId, update.progress);
    }
    setOpenPicker(null);
  }

  return (
    <div className="grid gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-5">
      {days.map((date) => {
        const dateKey = toDateKey(date);
        const isToday = dateKey === toDateKey(props.now);
        const entries = dayEntries(date, props.vulcanLessons, props.timetable);
        return (
          <section key={dateKey} className="min-w-0">
            <header className={clsx('flex items-baseline justify-between border-b-2 pb-2', isToday ? 'border-accent-500' : 'border-gray-200')}>
              <h2 className={clsx('text-sm font-semibold capitalize', isToday ? 'text-accent-700' : 'text-gray-900')}>
                {WEEKDAY[date.getDay()]}
              </h2>
              <span className={clsx('text-xs tabular-nums', isToday ? 'font-medium text-accent-700' : 'text-gray-400')}>
                {isToday ? 'dziś' : `${date.getDate()}.${String(date.getMonth() + 1).padStart(2, '0')}`}
              </span>
            </header>

            {entries.length === 0 && <p className="py-6 text-sm text-gray-400">Bez lekcji</p>}

            <ol>
              {entries.map((entry) => {
                const cls = entry.classId ? classById.get(entry.classId) : undefined;
                const available = cls
                  ? props.lessons.filter((lesson) => lesson.grade === classGrade(cls.name)).sort((a, b) => a.order - b.order)
                  : [];
                const assigned = cls ? assignedLessonForSlot(props.lessons, cls.id, dateKey, entry.period) : undefined;
                const done = Boolean(cls && assigned && lessonProgress(assigned.lesson, cls.id).status === 'done');
                const period = periodByNo.get(entry.period);
                const current = isToday && currentPeriod === entry.period;
                const pickerId = `${dateKey}-${entry.period}`;
                const togglePicker = () => setOpenPicker((value) => (value === pickerId ? null : pickerId));
                const duty = dutyAfter(dyzuryNa(date), date.getDay(), entry.period);
                const obiad = cls ? obiadAfter(date, entry.period, cls.name) : undefined;
                const dutyTeraz = isToday && dutyNow.kind === 'now' && dutyNow.duty === duty;
                const obiadTeraz = isToday && obiadNow.kind === 'now' && obiadNow.obiad === obiad;
                const topicItem = cls && assigned ? topicItemForSlot(props.lessons, cls, dateKey, entry.period) : undefined;

                return (
                  <li key={entry.id}>
                    <article
                      className={clsx(
                        'relative -mx-2 flex gap-3 rounded-lg px-2 py-3',
                        current && 'bg-accent-50',
                      )}
                    >
                      {current && <span aria-hidden className="absolute inset-y-2 left-0 w-0.5 rounded bg-accent-500" />}
                      <div className="w-9 shrink-0 pt-0.5 text-right">
                        <div className={clsx('text-lg font-semibold leading-none tabular-nums', current ? 'text-accent-700' : 'text-gray-300')}>
                          {entry.period}
                        </div>
                        <div className="mt-1 text-[11px] leading-none tabular-nums text-gray-400">{period?.start}</div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={clsx('rounded border px-1.5 py-px text-xs font-semibold', cls ? classBadgeClasses(cls.order) : 'border-gray-200 text-gray-500')}>
                            {cls?.name ?? entry.className ?? '?'}
                          </span>
                          {entry.room && <span className="text-xs text-gray-400">s. {entry.room}</span>}
                          {current && <span className="ml-auto text-[11px] font-medium text-accent-700">teraz</span>}
                        </div>
                        {entry.replacement && <p className="mt-1 text-xs text-amber-700">{entry.replacement}</p>}

                        {!cls ? (
                          <p className="mt-1.5 text-xs text-gray-400">Klasy nie ma w aplikacji</p>
                        ) : assigned ? (
                          <div className="mt-1.5">
                            <Link
                              to={`/dziennik?data=${dateKey}&lekcja=${entry.period}&klasa=${cls.id}&material=${assigned.lesson.id}&czesc=${assigned.part}`}
                              className={clsx(
                                'block text-sm leading-snug hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-500',
                                done ? 'text-gray-400' : 'font-medium text-gray-900',
                              )}
                              title="Otwórz obecność z tym tematem"
                            >
                              {done && <span className="mr-1 text-emerald-600">✓</span>}
                              {lessonTitleWithPart(assigned.lesson.title, assigned.part)}
                            </Link>
                            <div className="mt-1 flex gap-3 text-xs">
                              <Link
                                to={`/dziennik?data=${dateKey}&lekcja=${entry.period}&klasa=${cls.id}&material=${assigned.lesson.id}&czesc=${assigned.part}`}
                                className="font-medium text-accent-700 hover:underline"
                              >
                                Obecność
                              </Link>
                              <button type="button" onClick={togglePicker} aria-expanded={openPicker === pickerId} className="text-gray-400 hover:text-gray-700">
                                zmień
                              </button>
                              {topicItem && (
                                <VulcanTopicButton item={topicItem} state={props.topics.states[topicKey(topicItem)]} onSend={() => props.topics.send([topicItem])} />
                              )}
                            </div>
                            {topicItem && props.topics.states[topicKey(topicItem)]?.status === 'error' && (
                              <p className="mt-1 text-xs text-red-600">{props.topics.states[topicKey(topicItem)]?.message}</p>
                            )}
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={togglePicker}
                            aria-expanded={openPicker === pickerId}
                            className="mt-1.5 rounded text-sm font-medium text-accent-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-500"
                          >
                            Wybierz temat
                          </button>
                        )}

                        {cls && openPicker === pickerId && (
                          <LessonAssignmentPicker
                            label={`${cls.name} · ${WEEKDAY[date.getDay()]} ${date.getDate()}.${String(date.getMonth() + 1).padStart(2, '0')} · ${entry.period}. lekcja`}
                            lessons={available}
                            classId={cls.id}
                            selectedLessonId={assigned?.lesson.id}
                            onSelect={(lessonId) => assign(cls.id, dateKey, entry.period, lessonId)}
                            onClear={assigned ? () => assign(cls.id, dateKey, entry.period, '') : undefined}
                            onClose={() => setOpenPicker(null)}
                          />
                        )}
                      </div>
                    </article>

                    {(duty || obiad) && (
                      <div className="space-y-1 py-1 pl-12">
                        {duty && (
                          <BreakNote teraz={dutyTeraz} tone="amber" title={`Przerwa po ${entry.period}. lekcji: dyżur`}>
                            dyżur · {duty.place}
                          </BreakNote>
                        )}
                        {obiad && (
                          <BreakNote teraz={obiadTeraz} tone="emerald" title={obiadTitle(obiad)}>
                            obiad {obiad.klasa}
                            {OBIADOWICZE[obiad.klasa] ? ` · ${OBIADOWICZE[obiad.klasa]} os.` : ''}
                            {obiad.mode === 'sami' ? ' · idą sami' : ` · ${obiad.mode}`}
                          </BreakNote>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}
    </div>
  );
}

function VulcanTopicButton({ item, state, onSend }: { item: TopicItem; state: TopicSendState | undefined; onSend: () => void }) {
  if (isTopicSent(state, item.topic)) {
    return (
      <span className="text-emerald-700" title={state?.message ?? `W VULCANIE: ${item.topic}`}>
        ✓ w VULCANIE
      </span>
    );
  }
  const busy = state?.topic === item.topic.trim() && (state.status === 'queued' || state.status === 'sending');
  if (busy) {
    return <span className="text-gray-500">{state?.status === 'sending' ? 'dodaję do VULCANA…' : 'czeka na VULCANA…'}</span>;
  }
  const failed = state?.status === 'error' && state.topic === item.topic.trim();
  return (
    <button
      type="button"
      onClick={onSend}
      title={failed ? state?.message : `Utwórz w VULCANIE ${item.period}. lekcję ${item.vulcanClassName} z tematem: ${item.topic}`}
      className={clsx('font-medium hover:underline', failed ? 'text-red-600' : 'text-gray-500 hover:text-gray-900')}
    >
      {failed ? 'błąd - ponów' : 'do VULCANA'}
    </button>
  );
}

function BreakNote({ teraz, tone, title, children }: { teraz: boolean; tone: 'amber' | 'emerald'; title: string; children: React.ReactNode }) {
  const dot = tone === 'amber' ? 'bg-amber-400' : 'bg-emerald-500';
  return (
    <p
      title={title}
      className={clsx(
        'flex items-center gap-2 rounded-md text-xs',
        teraz
          ? clsx('-ml-2 px-2 py-1 font-semibold', tone === 'amber' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900')
          : 'text-gray-500',
      )}
    >
      <span aria-hidden className={clsx('h-1.5 w-1.5 shrink-0 rounded-full', dot)} />
      <span className="truncate">
        {teraz ? 'Teraz ' : ''}
        {children}
      </span>
    </p>
  );
}
