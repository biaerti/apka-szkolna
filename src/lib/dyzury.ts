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

/** Ile przed koncem lekcji dzwoni alarm dyzuru. */
export const DUTY_ALARM_LEAD_SEC = 3 * 60;

export interface DutyAlarm {
  /** Jeden alarm na dyzur: data + numer lekcji, po ktorej jest przerwa. */
  key: string;
  duty: Duty;
  /** 'soon' - koncowka lekcji przed dyzurem; 'now' - przerwa z dyzurem trwa. */
  phase: 'soon' | 'now';
  /** Do dzwonka (soon) albo do konca przerwy (now). */
  remainingSec: number;
}

/**
 * Alarm dyzuru: ostatnie minuty lekcji, po ktorej jest dyzur, i cala przerwa
 * z dyzurem (jesli apka zostala otwarta dopiero na przerwie).
 */
export function dutyAlarm(
  duties: Duty[],
  periods: LessonPeriod[],
  now: Date,
  leadSec = DUTY_ALARM_LEAD_SEC,
): DutyAlarm | null {
  const status = dutyStatus(duties, periods, now);
  if (status.kind === 'none') return null;
  const period = periodStatus(periods, now);
  if (period.kind === 'none') return null;
  if (status.kind === 'after-lesson' && period.remainingSec > leadSec) return null;
  const day = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  return {
    key: `${day}-${status.duty.afterPeriod}`,
    duty: status.duty,
    phase: status.kind === 'after-lesson' ? 'soon' : 'now',
    remainingSec: period.remainingSec,
  };
}
