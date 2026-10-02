// Bilans klasy bez podzialu na miesiace (Bartek 2026-10-02: "najprosciej jak
// sie da"): plusy i plomby sumuja sie od poczatku, a przycisk "Rozlicz" zapisuje
// piatke (zabiera 3 plusy) albo jedynke (zabiera 3 plomby) - nauczyciel wpisuje
// wtedy ocene do dziennika. Do tego eksport CSV.

import type { ID, RecapEvent, Settings, Student } from '../data/types';
import { monthKey as toMonthKey } from './week';

export interface StudentStatsRow {
  studentId: string;
  firstName: string;
  lastName: string;
  number: number;
  /** Plusy jeszcze nie zamienione na piatke. */
  plus: number;
  kropka: number;
  /** Plomby (tez za podpowiadanie) jeszcze nie zamienione na jedynke. */
  plomba: number;
  /** Pasy w biezacym miesiacu - limit pasow jest miesieczny. */
  pass: number;
  uwaga: number;
  /** Ile piatek / jedynek mozna teraz rozliczyc. */
  doPiatki: number;
  doJedynki: number;
}

/**
 * Nierozliczone plusy i plomby ucznia, liczone po kolei w czasie: plus dodaje 1,
 * piatka zabiera `perFive` plusow (ale nie schodzi ponizej zera - piatka
 * wystawiona "na wyrost" nie zjada przyszlych plusow), tak samo plomby i jedynka.
 */
export function unsettledBalance(
  events: RecapEvent[],
  studentId: string,
  perFive: number,
  perOne: number,
): { plusy: number; plomby: number } {
  const own = events
    .filter((e) => e.studentId === studentId)
    .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
  let plusy = 0;
  let plomby = 0;
  for (const e of own) {
    if (e.result === 'plus') plusy++;
    else if (e.result === 'piatka') plusy = Math.max(0, plusy - perFive);
    else if (e.result === 'plomba' || e.result === 'hint_plomba') plomby++;
    else if (e.result === 'jedynka') plomby = Math.max(0, plomby - perOne);
  }
  return { plusy, plomby };
}

/** Bilans klasy: wiersz na ucznia, posortowany po numerze z dziennika. */
export function classBalance(
  events: RecapEvent[],
  students: Student[],
  settings: Pick<Settings, 'plusesForFive' | 'plombyForOne'>,
  now: Date = new Date(),
): StudentStatsRow[] {
  const perFive = Math.max(1, settings.plusesForFive);
  const perOne = Math.max(1, settings.plombyForOne);
  const thisMonth = toMonthKey(now);
  return students
    .map((student) => {
      const own = events.filter((e) => e.studentId === student.id);
      const count = (result: RecapEvent['result']) => own.filter((e) => e.result === result).length;
      const { plusy, plomby } = unsettledBalance(own, student.id, perFive, perOne);
      return {
        studentId: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        number: student.number,
        plus: plusy,
        kropka: count('kropka'),
        plomba: plomby,
        pass: own.filter((e) => e.result === 'pass' && toMonthKey(new Date(e.at)) === thisMonth).length,
        uwaga: count('uwaga'),
        doPiatki: Math.floor(plusy / perFive),
        doJedynki: Math.floor(plomby / perOne),
      };
    })
    .sort((a, b) => a.number - b.number);
}

/** Typy zdarzen, ktore nauczyciel moze recznie skorygowac w bilansie (przyciski +/-). */
export type EditableResult = 'plus' | 'kropka' | 'plomba' | 'pass' | 'uwaga';

/**
 * Id NAJNOWSZEGO zdarzenia ucznia sposrod `results` - albo undefined. Uzywane
 * do przycisku "-": cofamy zawsze ostatnio dodane zdarzenie. `monthKey`
 * ("RRRR-MM") zaweza do miesiaca (pasy liczone sa miesiecznie).
 */
export function findLatestEventId(
  events: RecapEvent[],
  studentId: string,
  results: RecapEvent['result'][],
  monthKey?: string,
): ID | undefined {
  let latest: RecapEvent | undefined;
  for (const e of events) {
    if (e.studentId !== studentId || !results.includes(e.result)) continue;
    if (monthKey && toMonthKey(new Date(e.at)) !== monthKey) continue;
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

/** Zamienia wiersze bilansu na tekst CSV (nagłowek + dane, separator przecinek). */
export function toCsv(rows: StudentStatsRow[]): string {
  const header = ['Nr', 'Nazwisko', 'Imię', 'Plusy', 'Kropki', 'Plomby', 'Pasy (ten miesiąc)', 'Uwagi'];
  const lines = [header.join(',')];
  for (const row of rows) {
    lines.push(
      [row.number, row.lastName, row.firstName, row.plus, row.kropka, row.plomba, row.pass, row.uwaga]
        .map(csvEscape)
        .join(','),
    );
  }
  return lines.join('\n');
}
