// Mapowanie planu lekcji (dzwonki + siatka) <-> wiersze Supabase.
// Schemat: supabase/migrations/0012_plan_lekcji.sql. Osobny plik, bo mappers.ts
// przekroczyl juz limit dlugosci.

import type { LessonPeriod, TimetableEntry } from '../types';

// --- lesson_periods (dzwonki) -----------------------------------------------
// Encja nie ma wlasnego id (kluczem jest numer godziny), a silnik sync (diff.ts)
// wymaga tekstowego `id` do upsertu/delete - wiec id wiersza to numer jako tekst.

export interface LessonPeriodRow {
  id: string;
  no: number;
  start_time: string;
  end_time: string;
}

export function periodToRow(p: LessonPeriod): LessonPeriodRow {
  return { id: String(p.no), no: p.no, start_time: p.start, end_time: p.end };
}

export function rowToPeriod(row: LessonPeriodRow): LessonPeriod {
  return { no: row.no, start: row.start_time, end: row.end_time };
}

// --- timetable_entries (plan tygodniowy) ------------------------------------

export interface TimetableEntryRow {
  id: string;
  weekday: number;
  period: number;
  class_id: string;
  room: string | null;
}

export function timetableEntryToRow(e: TimetableEntry): TimetableEntryRow {
  return { id: e.id, weekday: e.weekday, period: e.period, class_id: e.classId, room: e.room ?? null };
}

export function rowToTimetableEntry(row: TimetableEntryRow): TimetableEntry {
  return { id: row.id, weekday: row.weekday, period: row.period, classId: row.class_id, room: row.room ?? undefined };
}
