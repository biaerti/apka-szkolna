// Czy teraz (albo zaraz po tej lekcji) jest dyzur - dla zegara prezentacji.

import type { Duty } from '../data/dyzury';
import type { LessonPeriod } from '../data/types';
import { periodStatus, validPeriods, weekdayOf } from './timetable';

export type DutyStatus =
  | { kind: 'after-lesson'; duty: Duty }
  | { kind: 'now'; duty: Duty }
  | { kind: 'none' };

export function dutyAfter(duties: Duty[], weekday: number, period: number): Duty | undefined {
  return duties.find((d) => d.weekday === weekday && d.afterPeriod === period);
}

/** Trwa lekcja, po ktorej jest dyzur -> 'after-lesson'; trwa przerwa z dyzurem -> 'now'. */
export function dutyStatus(duties: Duty[], periods: LessonPeriod[], now: Date): DutyStatus {
  const weekday = weekdayOf(now);
  const status = periodStatus(periods, now);
  if (status.kind === 'lesson') {
    const duty = dutyAfter(duties, weekday, status.period.no);
    return duty ? { kind: 'after-lesson', duty } : { kind: 'none' };
  }
  if (status.kind === 'break') {
    const sorted = validPeriods(periods);
    const prev = sorted[sorted.findIndex((p) => p.no === status.nextPeriod.no) - 1];
    const duty = prev && dutyAfter(duties, weekday, prev.no);
    return duty ? { kind: 'now', duty } : { kind: 'none' };
  }
  return { kind: 'none' };
}
