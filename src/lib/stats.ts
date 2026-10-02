// Agregacja statystyk miesiecznych per uczen, eksport do CSV oraz zestawienie
// "do rozliczenia" (nierozliczone plomby -> jedynka, plusy -> piatka; rozliczamy
// pelnymi miesiacami kalendarzowymi, patrz src/data/zasady.ts).

import type { ID, RecapEvent, Settings, Student } from '../data/types';
import { monthBalance } from './recap';
import { monthKey as toMonthKey } from './week';

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

/** Typy zdarzen, ktore nauczyciel moze recznie skorygowac w bilansie (przyciski +/-). */
export type EditableResult = 'plus' | 'kropka' | 'plomba' | 'hint_plomba' | 'pass' | 'uwaga';

/**
 * Id NAJNOWSZEGO zdarzenia danego typu ucznia w danym miesiacu ("RRRR-MM") - albo
 * undefined, gdy takiego zdarzenia w tym miesiacu nie ma. Uzywane do przycisku "-"
 * w recznej edycji bilansu (StatsTable): cofamy zawsze ostatnio dodane zdarzenie,
 * a nie losowe/najstarsze, zeby korekta odpowiadala temu, co nauczyciel widzial
 * na ekranie przed chwila.
 */
export function findLatestEventId(
  events: RecapEvent[],
  studentId: string,
  result: EditableResult,
  monthKey: string,
): ID | undefined {
  let latest: RecapEvent | undefined;
  for (const e of events) {
    if (e.studentId !== studentId || e.result !== result) continue;
    if (toMonthKey(new Date(e.at)) !== monthKey) continue;
    if (!latest || new Date(e.at).getTime() > new Date(latest.at).getTime()) latest = e;
  }
  return latest?.id;
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
  /** Plusy przeniesione z poprzednich miesiecy (reszta, ktora nie dala piatki). */
  plusyIn: number;
  /** Plusy zdobyte w rozliczanym miesiacu. */
  plusyMonth: number;
  /** Ile piatek wychodzi z (plusyIn + plusyMonth). */
  piatki: number;
  /** Reszta plusow, ktora przechodzi na nastepny miesiac. */
  plusyOut: number;
  /** To samo dla plomb ("minusow"): przeniesione, z miesiaca, jedynki, reszta. */
  plombyIn: number;
  plombyMonth: number;
  jedynki: number;
  plombyOut: number;
}

/** Klucz nastepnego miesiaca: "2026-12" -> "2027-01". */
export function nextMonthKey(key: string): string {
  const [y, m] = key.split('-').map(Number);
  return m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, '0')}`;
}

/**
 * Rozliczenie miesiaca ("RRRR-MM"): kazde pelne `plusesForFive` plusow to piatka,
 * kazde pelne `plombyForOne` plomb to jedynka, a reszta przechodzi na nastepny
 * miesiac. Liczone od pierwszego miesiaca z jakimkolwiek zdarzeniem ucznia, wiec
 * przeniesienia lancuchuja sie same (wrzesien -> pazdziernik -> listopad...).
 * Nic nie zapisuje - ocene nauczyciel wpisuje w dzienniku sam.
 */
export function settlementRows(
  events: RecapEvent[],
  students: Student[],
  settings: Settings,
  monthKey: string,
): SettlementRow[] {
  const perFive = Math.max(1, settings.plusesForFive);
  const perOne = Math.max(1, settings.plombyForOne);
  return students
    .map((student) => {
      const own = events.filter((e) => e.studentId === student.id);
      const months = own.map((e) => toMonthKey(new Date(e.at))).sort();
      let plusCarry = 0;
      let plombaCarry = 0;
      let row: SettlementRow = {
        student,
        plusyIn: 0,
        plusyMonth: 0,
        piatki: 0,
        plusyOut: 0,
        plombyIn: 0,
        plombyMonth: 0,
        jedynki: 0,
        plombyOut: 0,
      };
      if (months.length === 0 || months[0] > monthKey) return row;
      for (let m = months[0]; m <= monthKey; m = nextMonthKey(m)) {
        const bal = monthBalance(own, student.id, m);
        const plusTotal = plusCarry + bal.plus;
        const plombaTotal = plombaCarry + bal.plombyTotal;
        row = {
          student,
          plusyIn: plusCarry,
          plusyMonth: bal.plus,
          piatki: Math.floor(plusTotal / perFive),
          plusyOut: plusTotal % perFive,
          plombyIn: plombaCarry,
          plombyMonth: bal.plombyTotal,
          jedynki: Math.floor(plombaTotal / perOne),
          plombyOut: plombaTotal % perOne,
        };
        plusCarry = row.plusyOut;
        plombaCarry = row.plombyOut;
      }
      return row;
    })
    .sort((a, b) => a.student.number - b.student.number);
}
