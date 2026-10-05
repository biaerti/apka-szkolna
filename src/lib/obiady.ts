// Czy klasa z planu idzie po tej lekcji na obiad - dla zegara prezentacji
// i paska "Dziś". Klase bierzemy z planu (zakladka "Plan"), nie z lekcji
// wyswietlanej na projektorze.

import { OBIADOWICZE, OBIADY, OBIADY_OD, type Obiad } from '../data/obiady';
import type { LessonPeriod, SchoolClass, TimetableEntry } from '../data/types';
import { periodStatus, validPeriods, weekdayOf } from './timetable';

const ROMAN: Record<string, number> = { iv: 4, v: 5, vi: 6, vii: 7, viii: 8 };

/** 'IV C' / '4 c' / '4c' -> '4c'; nierozpoznane -> undefined. */
export function shortClassName(name: string): string | undefined {
  const m = name.replace(/\s+/g, '').toLowerCase().match(/^(viii|vii|vi|iv|v|\d)([a-z])$/);
  if (!m) return undefined;
  const year = ROMAN[m[1]] ?? Number(m[1]);
  return `${year}${m[2]}`;
}

function dayKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/** Wyjscie na obiad klasy `className` po lekcji `period` w dniu `date`. */
export function obiadAfter(date: Date, period: number, className: string): Obiad | undefined {
  if (dayKey(date) < OBIADY_OD) return undefined;
  const klasa = shortClassName(className);
  const weekday = weekdayOf(date);
  return OBIADY.find((o) => o.weekday === weekday && o.afterPeriod === period && o.klasa === klasa);
}

/** "4c · 10 os. · sami" */
export function obiadLabel(o: Obiad): string {
  const ile = OBIADOWICZE[o.klasa];
  return [o.klasa, ile ? `${ile} os.` : '', o.mode === 'sami' ? 'sami' : o.mode].filter(Boolean).join(' · ');
}

/** Pelny opis do podpowiedzi. */
export function obiadTitle(o: Obiad): string {
  const ile = OBIADOWICZE[o.klasa];
  const kto = o.who ? ` (${o.who})` : '';
  const jak =
    o.mode === 'sami'
      ? 'kończą zajęcia i idą sami, min. 15 min po dzwonku'
      : `idą ${o.mode}${kto}, czekają w pawilonie 1`;
  return `Po tej lekcji obiad: ${o.klasa}${ile ? `, ${ile} os.` : ''} - ${jak}. Nie przetrzymywać po dzwonku.`;
}

export type ObiadStatus =
  | { kind: 'after-lesson'; obiad: Obiad }
  | { kind: 'now'; obiad: Obiad }
  | { kind: 'none' };

/** Trwa lekcja klasy, ktora potem idzie na obiad -> 'after-lesson'; przerwa po niej -> 'now'. */
export function obiadStatus(
  timetable: TimetableEntry[],
  classes: SchoolClass[],
  periods: LessonPeriod[],
  now: Date,
): ObiadStatus {
  const status = periodStatus(periods, now);
  let period: number | undefined;
  if (status.kind === 'lesson') period = status.period.no;
  else if (status.kind === 'break') {
    const sorted = validPeriods(periods);
    period = sorted[sorted.findIndex((p) => p.no === status.nextPeriod.no) - 1]?.no;
  }
  if (period === undefined) return { kind: 'none' };
  const weekday = weekdayOf(now);
  const entry = timetable.find((e) => e.weekday === weekday && e.period === period);
  const cls = entry?.classId ? classes.find((c) => c.id === entry.classId) : undefined;
  const obiad = cls && obiadAfter(now, period, cls.name);
  if (!obiad) return { kind: 'none' };
  return status.kind === 'lesson' ? { kind: 'after-lesson', obiad } : { kind: 'now', obiad };
}
