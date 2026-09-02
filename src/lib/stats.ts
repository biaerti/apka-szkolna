// Agregacja statystyk miesiecznych per uczen oraz eksport do CSV.

import type { RecapEvent, Student } from '../data/types';
import { monthBalance } from './recap';

export interface StudentStatsRow {
  studentId: string;
  firstName: string;
  lastName: string;
  number: number;
  plus: number;
  minus: number;
  pass: number;
  hint: number;
  bilans: number;
}

/** Agreguje zdarzenia recapu per uczen danej klasy w danym miesiacu ("RRRR-MM"). */
export function aggregateMonth(events: RecapEvent[], students: Student[], monthKey: string): StudentStatsRow[] {
  return students
    .map((student) => {
      const { plus, minus, pass, hint } = monthBalance(events, student.id, monthKey);
      return {
        studentId: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        number: student.number,
        plus,
        minus,
        pass,
        hint,
        bilans: plus - minus - hint,
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
  const header = ['Nr', 'Nazwisko', 'Imię', 'Plus', 'Minus', 'Pas', 'Podpowiedzi', 'Bilans'];
  const lines = [header.join(',')];
  for (const row of rows) {
    lines.push(
      [row.number, row.lastName, row.firstName, row.plus, row.minus, row.pass, row.hint, row.bilans]
        .map(csvEscape)
        .join(','),
    );
  }
  return lines.join('\n');
}
