// Agregacja statystyk miesiecznych per uczen, eksport do CSV oraz zestawienie
// "do rozliczenia" (nierozliczone plomby -> zadania naprawcze/jedynka, plusy -> piatka).

import type { RecapEvent, Settings, Student } from '../data/types';
import { monthBalance, outstandingPlomby, outstandingPlusy } from './recap';

export interface StudentStatsRow {
  studentId: string;
  firstName: string;
  lastName: string;
  number: number;
  plus: number;
  kropka: number;
  plomba: number;
  pass: number;
  hint: number;
  uwaga: number;
  /** plomba + hint - laczna liczba plomb w miesiacu (do wyliczenia bilansu). */
  plombyTotal: number;
  bilans: number;
}

/** Agreguje zdarzenia recapu per uczen danej klasy w danym miesiacu ("RRRR-MM"). */
export function aggregateMonth(events: RecapEvent[], students: Student[], monthKey: string): StudentStatsRow[] {
  return students
    .map((student) => {
      const { plus, kropka, plomba, pass, hint, uwaga, plombyTotal } = monthBalance(events, student.id, monthKey);
      return {
        studentId: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        number: student.number,
        plus,
        kropka,
        plomba,
        pass,
        hint,
        uwaga,
        plombyTotal,
        bilans: plus - plombyTotal,
      };
    })
    .sort((a, b) => a.number - b.number);
}

function csvEscape(value: string | number): string {
  const str = String(value);
  if (/[",;\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/** Zamienia wiersze statystyk na tekst CSV (nagłowek + dane, separator przecinek). */
export function toCsv(rows: StudentStatsRow[]): string {
  const header = ['Nr', 'Nazwisko', 'Imię', 'Plusy', 'Kropki', 'Plomby', 'Podpowiedzi', 'Pasy', 'Uwagi', 'Bilans'];
  const lines = [header.join(',')];
  for (const row of rows) {
    lines.push(
      [row.number, row.lastName, row.firstName, row.plus, row.kropka, row.plomba, row.hint, row.pass, row.uwaga, row.bilans]
        .map(csvEscape)
        .join(','),
    );
  }
  return lines.join('\n');
}

export interface SettlementRow {
  student: Student;
  /** Nierozliczone plomby (outstandingPlomby().count) - zebrane po ostatnim rozliczeniu/jedynce. */
  plomby: number;
  /** Id pytan, na ktore uczen nie odpowiedzial - podstawa zadan naprawczych. */
  plombyQuestionIds: string[];
  /** Nierozliczone plusy (outstandingPlusy().count) - zebrane po ostatniej piatce. */
  plusy: number;
  /** Uczen ma komplet plomb (>= settings.plombyForOne) - czeka na zadania naprawcze albo jedynke. */
  owesTasks: boolean;
  /** Uczen ma komplet plusow (>= settings.plusesForFive) - czeka na piatke. */
  earnedFive: boolean;
}

/**
 * Uczniowie klasy wymagajacy reakcji nauczyciela: komplet plomb (zadania naprawcze
 * albo jedynka) lub komplet plusow (piatka). Posortowani po numerze z dziennika.
 */
export function settlementRows(events: RecapEvent[], students: Student[], settings: Settings): SettlementRow[] {
  return students
    .map((student) => {
      const plomby = outstandingPlomby(events, student.id);
      const plusy = outstandingPlusy(events, student.id);
      const owesTasks = plomby.count >= settings.plombyForOne;
      const earnedFive = plusy.count >= settings.plusesForFive;
      return {
        student,
        plomby: plomby.count,
        plombyQuestionIds: plomby.questionIds,
        plusy: plusy.count,
        owesTasks,
        earnedFive,
      };
    })
    .filter((row) => row.owesTasks || row.earnedFive)
    .sort((a, b) => a.student.number - b.student.number);
}
