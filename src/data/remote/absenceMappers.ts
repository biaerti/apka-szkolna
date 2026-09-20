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
  status?: 'absent' | 'late' | null;
  at: string;
}

export function absenceToRow(a: Absence): AbsenceRow {
  const row: AbsenceRow = {
    id: a.id,
    student_id: a.studentId,
    class_id: a.classId,
    date: a.date,
    period: a.period ?? null,
    at: a.at,
  };
  // Nieobecność jest domyślnym stanem również w starszym schemacie 0021.
  // Pominięcie pola pozwala jej synchronizować się przed wdrożeniem 0022;
  // tylko spóźnienie wymaga nowej kolumny `status`.
  if (a.status === 'late') row.status = 'late';
  return row;
}

export function rowToAbsence(row: AbsenceRow): Absence {
  return {
    id: row.id,
    studentId: row.student_id,
    classId: row.class_id,
    date: row.date,
    period: row.period ?? undefined,
    status: row.status ?? 'absent',
    at: row.at,
  };
}
