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
import { parseHm, periodStatus } from '../../lib/timetable';
import { isTopicSent, topicItemForSlot, topicKey, type TopicItem, type TopicSendState } from '../../lib/vulcanTemat';
import { vulcanClassName } from '../../lib/vulcan';
import { vulcanAttendanceCheckKey, type VulcanAttendanceCheck } from '../../lib/vulcanAttendance';
import { classBadgeClasses } from '../calendar/classColor';
import { zadaniaDnia, zadaniaLekcji, zadaniaZalegle, type Zadanie } from '../../lib/zadania';
import type { UseZadaniaResult } from '../../data/zadania';
import { LessonAssignmentPicker } from './LessonAssignmentPicker';
import type { VulcanTopics } from './useVulcanTopics';
import { DodajZadanie, ZadaniaLista } from './Zadania';

interface Props {
  anchor: Date;
  now: Date;
  classes: SchoolClass[];
  lessons: Lesson[];
  periods: LessonPeriod[];
  timetable: TimetableEntry[];
  vulcanLessons: VulcanLesson[];
  attendanceChecks: VulcanAttendanceCheck[];
  setLessonProgress: (lessonId: string, classId: string, progress: LessonProgress) => void;
  topics: VulcanTopics;
  zadania: UseZadaniaResult;
}

const WEEKDAY = ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'];
const WEEKDAY_SHORT = ['nd', 'pon', 'wt', 'śr', 'czw', 'pt', 'sob'];

export function WeekPlanner(props: Props) {
  const [openPicker, setOpenPicker] = useState<string | null>(null);
  // Gdzie jest otwarte pole "+ zadanie": "RRRR-MM-DD" (dzien) albo "RRRR-MM-DD-N" (lekcja).
  const [adding, setAdding] = useState<string | null>(null);
  const { zadania, add, toggle, remove } = props.zadania;
  const todayKey = toDateKey(props.now);
  const zalegle = zadaniaZalegle(zadania, todayKey);
  const removeOne = (id: string) => remove([id]);
  function zaleglePrefix(z: Zadanie): string {
    const date = new Date(`${z.data}T12:00:00`);
    const cls = z.klasaId ? classById.get(z.klasaId)?.name : undefined;
    return [`${WEEKDAY_SHORT[date.getDay()]} ${date.getDate()}.${String(date.getMonth() + 1).padStart(2, '0')}`, cls].filter(Boolean).join(' · ');
  }
  const days = weekDays(props.anchor).slice(0, 5);
  const classById = useMemo(() => new Map(props.classes.map((item) => [item.id, item])), [props.classes]);
  const periodByNo = useMemo(() => new Map(props.periods.map((item) => [item.no, item])), [props.periods]);
  const status = periodStatus(props.periods, props.now);
  const currentPeriod = status.kind === 'lesson' ? status.period.no : undefined;
  const dutyNow = dutyStatus(dyzuryNa(props.now), props.periods, props.now);
  const obiadNow = obiadStatus(props.timetable, props.classes, props.periods, props.now);

  const nowMin = props.now.getHours() * 60 + props.now.getMinutes() + props.now.getSeconds() / 60;
  /** Gdzie miedzy start a end jest teraz (0-1), poza tym odcinkiem undefined. */
  function nowIn(start: string | undefined, end: string | undefined): number | undefined {
    if (!start || !end) return undefined;
    const from = parseHm(start);
    const to = parseHm(end);
    if (!(to > from) || nowMin < from || nowMin >= to) return undefined;
    return (nowMin - from) / (to - from);
  }
  function breakMinutes(no: number): number | undefined {
    const end = periodByNo.get(no)?.end;
    const next = periodByNo.get(no + 1)?.start;
    if (!end || !next) return undefined;
    const minutes = parseHm(next) - parseHm(end);
    return minutes > 0 ? minutes : undefined;
  }

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
        const isToday = dateKey === todayKey;
        const dayTasks = zadaniaDnia(zadania, dateKey);
        const entries = dayEntries(date, props.vulcanLessons, props.timetable);
        const lastPeriod = Math.max(0, ...entries.map((entry) => entry.period));
        const gaps = Array.from({ length: lastPeriod }, (_, index) => index + 1).filter(
          (no) => !entries.some((entry) => entry.period === no),
        );
        const rows = [...entries.map((entry) => ({ no: entry.period, entry })), ...gaps.map((no) => ({ no, entry: undefined }))].sort(
          (a, b) => a.no - b.no,
        );
        return (
          <section key={dateKey} className="min-w-0">
            <header className={clsx('flex items-baseline justify-between border-b-2 pb-2', isToday ? 'border-accent-500' : 'border-gray-200')}>
              <h2 className={clsx('text-sm font-semibold capitalize', isToday ? 'text-accent-700' : 'text-gray-900')}>
                {WEEKDAY[date.getDay()]}
              </h2>
              <div className="flex items-baseline gap-3">
                <AddTaskButton onClick={() => setAdding(dateKey)} title="Zadanie na ten dzień" />
                <span className={clsx('text-xs tabular-nums', isToday ? 'font-medium text-accent-700' : 'text-gray-400')}>
                  {isToday ? 'dziś' : `${date.getDate()}.${String(date.getMonth() + 1).padStart(2, '0')}`}
                </span>
              </div>
            </header>

            {(dayTasks.length > 0 || adding === dateKey || (isToday && zalegle.length > 0)) && (
              <div className="pt-2">
                {isToday && <ZadaniaLista items={zalegle} onToggle={toggle} onRemove={removeOne} prefix={zaleglePrefix} className="mb-1" />}
                <ZadaniaLista items={dayTasks} onToggle={toggle} onRemove={removeOne} />
                {adding === dateKey && (
                  <DodajZadanie
                    placeholder="Na ten dzień - Enter dodaje"
                    onAdd={(tekst) => add({ tekst, data: dateKey, lekcja: null, klasaId: null })}
                    onClose={() => setAdding(null)}
                  />
                )}
              </div>
            )}

            {entries.length === 0 && <p className="py-6 text-sm text-gray-400">Bez lekcji</p>}

            <ol>
              {rows.map(({ no, entry }) => {
                if (!entry) {
                  const gapDuty = dutyAfter(dyzuryNa(date), date.getDay(), no);
                  const gapDutyTeraz = isToday && dutyNow.kind === 'now' && dutyNow.duty === gapDuty;
                  return (
                    <li key={`okienko-${no}`}>
                      <div className="relative -mx-2 flex min-h-[5.25rem] gap-3 px-2 py-3">
                        {isToday && <NowLine at={nowIn(periodByNo.get(no)?.start, periodByNo.get(no)?.end)} />}
                        <div className="w-9 shrink-0 pt-0.5 text-right">
                          <div className="text-lg font-semibold leading-none tabular-nums text-gray-200">{no}</div>
                          <div className="mt-1 text-[11px] leading-none tabular-nums text-gray-300">{periodByNo.get(no)?.start}</div>
                        </div>
                        <p className="pt-0.5 text-xs text-gray-300">okienko</p>
                      </div>
                      {no < lastPeriod && (
                        <BreakRow minutes={breakMinutes(no)} nowAt={isToday ? nowIn(periodByNo.get(no)?.end, periodByNo.get(no + 1)?.start) : undefined}>
                          {gapDuty && (
                            <BreakNote teraz={gapDutyTeraz} tone="amber" title={`Przerwa po ${no}. lekcji: dyżur`}>
                              dyżur · {gapDuty.place}
                            </BreakNote>
                          )}
                        </BreakRow>
                      )}
                    </li>
                  );
                }
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
                const lessonTasks = zadaniaLekcji(zadania, dateKey, entry.period);
                const addingHere = adding === pickerId;
                const attendanceCheck = cls ? props.attendanceChecks.find((check) => vulcanAttendanceCheckKey(check) === vulcanAttendanceCheckKey({
                  date: dateKey,
                  period: entry.period,
                  className: vulcanClassName(cls.name),
                })) : undefined;

                return (
                  <li key={entry.id}>
                    <article
                      className={clsx(
                        'relative -mx-2 flex gap-3 rounded-lg px-2 py-3',
                        current && 'bg-accent-50',
                      )}
                    >
                      {current && <span aria-hidden className="absolute inset-y-2 left-0 w-0.5 rounded bg-accent-500" />}
                      {isToday && <NowLine at={nowIn(period?.start, period?.end)} />}
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
                          <span className="ml-auto flex items-baseline gap-2">
                            {current && <span className="text-[11px] font-medium text-accent-700">teraz</span>}
                            <AddTaskButton onClick={() => setAdding(pickerId)} title={`Zadanie na tę lekcję (${cls?.name ?? entry.className ?? ''})`} />
                          </span>
                        </div>
                        {entry.replacement && <p className="mt-1 text-xs text-amber-700">{entry.replacement}</p>}

                        {!cls ? (
                          <p className="mt-1.5 text-xs text-gray-400">Klasy nie ma w aplikacji</p>
                        ) : (
                          <>
                            {assigned ? (
                              <div className="mt-1.5">
                                <Link
                                  to={`/dziennik?data=${dateKey}&lekcja=${entry.period}&klasa=${cls.id}&material=${assigned.lesson.id}&czesc=${assigned.part}`}
                                  className={clsx(
                                    'block text-sm leading-snug hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-500',
                                    done ? 'text-gray-400' : 'font-medium text-gray-900',
                                  )}
                                  title="Otwórz temat lekcji"
                                >
                                  {done && <span className="mr-1 text-emerald-600">✓</span>}
                                  {lessonTitleWithPart(assigned.lesson.title, assigned.part)}
                                </Link>
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
                            <div className="mt-1 flex gap-3 text-xs">
                              <AttendanceCheckedStatus checked={attendanceCheck?.checked ?? false} />
                              {assigned && (
                              <button type="button" onClick={togglePicker} aria-expanded={openPicker === pickerId} className="text-gray-400 hover:text-gray-700">
                                zmień
                              </button>
                              )}
                              {topicItem && (
                                <VulcanTopicButton item={topicItem} state={props.topics.states[topicKey(topicItem)]} onSend={() => props.topics.send([topicItem])} />
                              )}
                            </div>
                            {topicItem && props.topics.states[topicKey(topicItem)]?.status === 'error' && (
                              <p className="mt-1 text-xs text-red-600">{props.topics.states[topicKey(topicItem)]?.message}</p>
                            )}
                          </>
                        )}

                        {(lessonTasks.length > 0 || addingHere) && (
                          <div className="mt-2">
                            <ZadaniaLista items={lessonTasks} onToggle={toggle} onRemove={removeOne} />
                            {addingHere && (
                              <DodajZadanie
                                placeholder="Na tę lekcję - Enter dodaje"
                                onAdd={(tekst) => add({ tekst, data: dateKey, lekcja: entry.period, klasaId: cls?.id ?? null })}
                                onClose={() => setAdding(null)}
                              />
                            )}
                          </div>
                        )}

                        {cls && openPicker === pickerId && (
                          <LessonAssignmentPicker
                            label={`${cls.name} · ${WEEKDAY[date.getDay()]} ${date.getDate()}.${String(date.getMonth() + 1).padStart(2, '0')} · ${entry.period}. lekcja`}
                            lessons={available}
                            classId={cls.id}
                            selectedLessonId={assigned?.lesson.id}
                            onSelect={(lessonId) => assign(cls.id, dateKey, entry.period, lessonId)}
                            onClear={assigned ? () => assign(cls.id, dateKey, entry.period, '') : undefined}
                            slotId={pickerId}
                            onClose={() => setOpenPicker(null)}
                          />
                        )}
                      </div>
                    </article>

                    {entry.period < lastPeriod && (
                      <BreakRow minutes={breakMinutes(entry.period)} nowAt={isToday ? nowIn(period?.end, periodByNo.get(entry.period + 1)?.start) : undefined}>
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
                      </BreakRow>
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

function AddTaskButton({ onClick, title }: { onClick: () => void; title: string }) {
  return (
    <button type="button" onClick={onClick} title={title} className="text-[11px] text-gray-300 hover:text-accent-700 focus-visible:text-accent-700">
      + zadanie
    </button>
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

function AttendanceCheckedStatus({ checked }: { checked: boolean }) {
  if (checked) {
    return <span className="font-medium text-emerald-700" title="Frekwencja sprawdzona w VULCANIE">☑ obecność</span>;
  }
  return <span className="text-gray-400" title="Frekwencja jeszcze niesprawdzona w VULCANIE">☐ obecność</span>;
}

// Przerwa miedzy lekcjami: cienka linia z dlugoscia, pod nia dyzur i obiad.
function BreakRow({ minutes, nowAt, children }: { minutes: number | undefined; nowAt: number | undefined; children?: React.ReactNode }) {
  return (
    <div className="relative space-y-1 py-1.5 pl-12">
      {nowAt !== undefined && <NowLine at={nowAt} />}
      {minutes !== undefined && <p className="text-[11px] leading-none text-gray-400">przerwa {minutes} min</p>}
      {children}
    </div>
  );
}

// "Jestes tutaj": pozioma kreska z trojkatem na wysokosci biezacej chwili
// w wierszu lekcji albo przerwy (procent uplynietego czasu tego odcinka).
function NowLine({ at }: { at: number | undefined }) {
  if (at === undefined) return null;
  return (
    <div aria-hidden className="pointer-events-none absolute -left-3 right-0 z-10 flex items-center" style={{ top: `${at * 100}%` }}>
      <svg viewBox="0 0 8 10" className="-my-[5px] h-2.5 w-2 shrink-0 fill-red-500"><path d="M0 0 8 5 0 10z" /></svg>
      <span className="h-px flex-1 bg-red-500" />
    </div>
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
