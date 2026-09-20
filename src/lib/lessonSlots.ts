import type { LessonPeriod, LessonProgress, LessonSlot, TimetableEntry } from '../data/types';
import { addDays, toDateKey } from './dates';
import { periodStatus, weekdayOf } from './timetable';

export interface LessonSlotOption extends LessonSlot {
  label: string;
  isNow: boolean;
}

export function lessonSlotId(date: string, period: number): string {
  return `${date}-${period}`;
}

export function slotsFromProgress(progress: LessonProgress): LessonSlot[] {
  const slots = progress.lessonSlots ?? [];
  if (slots.length > 0) return [...slots].sort(compareSlots);
  if (progress.lessonDate && progress.lessonPeriod) {
    return [{ id: lessonSlotId(progress.lessonDate, progress.lessonPeriod), date: progress.lessonDate, period: progress.lessonPeriod }];
  }
  return [];
}

export function progressWithoutSlot(progress: LessonProgress, slotId: string): LessonProgress {
  const lessonSlots = slotsFromProgress(progress).filter((slot) => slot.id !== slotId);
  const first = lessonSlots[0];
  return {
    ...progress,
    lessonSlots,
    lessonDate: first?.date,
    lessonPeriod: first?.period,
  };
}

export function classSlotOptions(args: {
  timetable: TimetableEntry[];
  periods: LessonPeriod[];
  classId: string;
  now: Date;
  days?: number;
}): LessonSlotOption[] {
  const { timetable, periods, classId, now, days = 21 } = args;
  const byNumber = new Map(periods.map((period) => [period.no, period]));
  const active = periodStatus(periods, now);
  const today = toDateKey(now);
  const options: LessonSlotOption[] = [];

  for (let offset = 0; offset <= days; offset += 1) {
    const date = addDays(now, offset);
    const dateKey = toDateKey(date);
    const entries = timetable
      .filter((entry) => entry.classId === classId && entry.weekday === weekdayOf(date))
      .sort((a, b) => a.period - b.period);
    for (const entry of entries) {
      const period = byNumber.get(entry.period);
      if (!period) continue;
      const isNow = dateKey === today && active.kind === 'lesson' && active.period.no === entry.period;
      options.push({
        id: lessonSlotId(dateKey, entry.period),
        date: dateKey,
        period: entry.period,
        isNow,
        label: `${isNow ? 'Teraz' : dayLabel(date, offset)} · ${period.start}`,
      });
    }
  }
  return options.sort((a, b) => Number(b.isNow) - Number(a.isNow) || compareSlots(a, b));
}

export function slotDisplayLabel(slot: LessonSlot, periods: LessonPeriod[], now: Date): string {
  const period = periods.find((item) => item.no === slot.period);
  return `${slotDayLabel(slot.date, now)} · ${period?.start ?? `${slot.period}. godz.`}`;
}

export function slotDayLabel(dateKey: string, now: Date): string {
  const date = new Date(`${dateKey}T12:00:00`);
  const today = toDateKey(now);
  const tomorrow = toDateKey(addDays(now, 1));
  if (dateKey === today) return 'Dzisiaj';
  if (dateKey === tomorrow) return 'Jutro';
  return date.toLocaleDateString('pl-PL', { weekday: 'short', day: 'numeric', month: 'short' });
}

export function isCurrentSlot(slot: LessonSlot, periods: LessonPeriod[], now: Date): boolean {
  const active = periodStatus(periods, now);
  return slot.date === toDateKey(now) && active.kind === 'lesson' && active.period.no === slot.period;
}

function compareSlots(a: LessonSlot, b: LessonSlot): number {
  return a.date.localeCompare(b.date) || a.period - b.period;
}

function dayLabel(date: Date, offset: number): string {
  if (offset === 0) return 'Dziś';
  if (offset === 1) return 'Jutro';
  return date.toLocaleDateString('pl-PL', { weekday: 'short', day: 'numeric', month: 'short' });
}
