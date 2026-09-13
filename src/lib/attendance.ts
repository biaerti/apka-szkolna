// Obecnosc: kto jest dzis nieobecny w klasie. Czyste funkcje - store trzyma
// liste Absence (patrz src/data/types.ts), a kola licza z niej pule.

import type { Absence } from '../data/types';

/** Id nieobecnosci wyliczane z dnia i ucznia - jeden wpis na ucznia dziennie. */
export function absenceId(date: string, studentId: string): string {
  return `abs-${date}-${studentId}`;
}

/** Id uczniow nieobecnych w klasie `classId` w dniu `date` ("RRRR-MM-DD"). */
export function absentOnDay(absences: Absence[], classId: string, date: string): Set<string> {
  const out = new Set<string>();
  for (const a of absences) {
    if (a.classId === classId && a.date === date) out.add(a.studentId);
  }
  return out;
}
