// Mapowanie lekcji z VULCANA <-> wiersze Supabase. Schemat:
// supabase/migrations/0029_vulcan_lessons.sql.

import type { VulcanLesson } from '../types';

export interface VulcanLessonRow {
  id: string;
  date: string;
  period: number;
  class_id: string | null;
  class_name: string;
  subject: string;
  replacement: string | null;
}

export function vulcanLessonToRow(l: VulcanLesson): VulcanLessonRow {
  return {
    id: l.id,
    date: l.date,
    period: l.period,
    class_id: l.classId ?? null,
    class_name: l.className,
    subject: l.subject,
    replacement: l.replacement ?? null,
  };
}

export function rowToVulcanLesson(row: VulcanLessonRow): VulcanLesson {
  return {
    id: row.id,
    date: row.date,
    period: row.period,
    classId: row.class_id ?? undefined,
    className: row.class_name,
    subject: row.subject ?? '',
    replacement: row.replacement ?? undefined,
  };
}
