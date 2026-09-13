// Mapowanie nieobecnosci <-> wiersze Supabase. Schemat:
// supabase/migrations/0021_obecnosc.sql. Osobny plik, bo mappers.ts
// przekroczyl juz limit dlugosci.

import type { Absence } from '../types';

export interface AbsenceRow {
  id: string;
  student_id: string;
  class_id: string;
  date: string;
  period: number | null;
  at: string;
}

export function absenceToRow(a: Absence): AbsenceRow {
  return {
    id: a.id,
    student_id: a.studentId,
    class_id: a.classId,
    date: a.date,
    period: a.period ?? null,
    at: a.at,
  };
}

export function rowToAbsence(row: AbsenceRow): Absence {
  return {
    id: row.id,
    studentId: row.student_id,
    classId: row.class_id,
    date: row.date,
    period: row.period ?? undefined,
    at: row.at,
  };
}
