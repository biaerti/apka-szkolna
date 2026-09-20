// Obecnosc: kto jest dzis nieobecny w klasie. Czyste funkcje - store trzyma
// liste Absence (patrz src/data/types.ts), a kola licza z niej pule.

import type { Absence } from '../data/types';

/** Id nieobecnosci wyliczane z dnia i ucznia - jeden wpis na ucznia dziennie. */
export function absenceId(date: string, studentId: string): string {
  return `abs-${date}-${studentId}`;
}

/** Id wpisu frekwencji dla konkretnej godziny. Stare wpisy dzienne zachowują dawny identyfikator. */
export function attendanceId(date: string, period: number, studentId: string): string {
  return `att-${date}-${period}-${studentId}`;
}

/** Id uczniow nieobecnych w klasie `classId` w dniu `date` ("RRRR-MM-DD"). */
export function absentOnDay(absences: Absence[], classId: string, date: string, period?: number): Set<string> {
  const out = new Set<string>();
  for (const a of absences) {
    if (
      a.classId === classId &&
      a.date === date &&
      (a.status ?? 'absent') === 'absent' &&
      (period === undefined || a.period === undefined || a.period === period)
    ) {
      out.add(a.studentId);
    }
  }
  return out;
}

export type AttendanceStatus = 'present' | 'absent' | 'late';

/** Stan ucznia na konkretnej godzinie. Brak wpisu jest celowo równoznaczny z obecnością. */
export function attendanceForLesson(
  records: Absence[],
  classId: string,
  date: string,
  period: number,
): Map<string, AttendanceStatus> {
  const out = new Map<string, AttendanceStatus>();
  for (const record of records) {
    if (record.classId !== classId || record.date !== date) continue;
    if (record.period !== undefined && record.period !== period) continue;
    out.set(record.studentId, record.status === 'late' ? 'late' : 'absent');
  }
  return out;
}
