import { describe, expect, it } from 'vitest';
import type { RecapEvent, Settings, Student } from '../data/types';
import { aggregateMonth, findLatestEventId, settlementRows, toCsv } from './stats';

function student(partial: Partial<Student>): Student {
  return {
    id: partial.id ?? 's1',
    classId: partial.classId ?? 'c1',
    firstName: partial.firstName ?? 'Jan',
    lastName: partial.lastName ?? 'Kowalski',
    number: partial.number ?? 1,
    active: partial.active ?? true,
  };
}

function ev(partial: Partial<RecapEvent>): RecapEvent {
  return {
    id: partial.id ?? Math.random().toString(36),
    studentId: partial.studentId ?? 's1',
    classId: partial.classId ?? 'c1',
    result: partial.result ?? 'plus',
    at: partial.at ?? new Date(2026, 8, 2).toISOString(),
    ...partial,
  };
}

function settings(partial: Partial<Settings> = {}): Settings {
  return {
    passesPerMonth: 3,
    hintGivesMinus: true,
    wheelSpinSec: 4,
    answerTimerSec: 30,
    plusesForFive: 3,
    plombyForOne: 3,
    reviewQuestionCount: 7,
    slideFontPercent: 100,
    salaWarningsResetDaily: false,
    salaStudentSort: 'lastName',
    ...partial,
  };
}

describe('aggregateMonth', () => {
  it('agreguje wiersze posortowane po numerze, w nowym slowniku', () => {
    const students = [
      student({ id: 's2', number: 2, firstName: 'Ala', lastName: 'Nowak' }),
      student({ id: 's1', number: 1, firstName: 'Jan', lastName: 'Kowalski' }),
    ];
    const events: RecapEvent[] = [
      ev({ studentId: 's1', result: 'plus' }),
      ev({ studentId: 's1', result: 'plomba' }),
      ev({ studentId: 's1', result: 'kropka' }),
      ev({ studentId: 's2', result: 'pass' }),
      ev({ studentId: 's2', result: 'hint_plomba' }),
      ev({ studentId: 's2', result: 'uwaga' }),
    ];
    const rows = aggregateMonth(events, students, '2026-09');
    expect(rows.map((r) => r.studentId)).toEqual(['s1', 's2']);
    expect(rows[0]).toMatchObject({
      plus: 1,
      kropka: 1,
      plomba: 1,
      pass: 0,
      hint: 0,
      uwaga: 0,
      plombyTotal: 1,
      bilans: 0,
    });
    expect(rows[1]).toMatchObject({
      plus: 0,
      kropka: 0,
      plomba: 0,
      pass: 1,
      hint: 1,
      uwaga: 1,
      plombyTotal: 1,
      bilans: -1,
    });
  });

  it('zwraca zera dla ucznia bez zdarzen', () => {
    const rows = aggregateMonth([], [student({})], '2026-09');
    expect(rows[0]).toMatchObject({
      plus: 0,
      kropka: 0,
      plomba: 0,
      pass: 0,
      hint: 0,
      uwaga: 0,
      plombyTotal: 0,
      bilans: 0,
    });
  });
});

describe('toCsv', () => {
  it('generuje naglowek i wiersze w nowym slowniku (bez slowa minus)', () => {
    const rows = aggregateMonth(
      [ev({ studentId: 's1', result: 'plus' })],
      [student({ number: 3, firstName: 'Ola', lastName: 'Kowal-Nowak' })],
      '2026-09',
    );
    const csv = toCsv(rows);
    const lines = csv.split('\n');
    expect(lines[0]).toBe('Nr,Nazwisko,Imię,Plusy,Kropki,Plomby,Podpowiedzi,Pasy,Uwagi,Bilans');
    expect(lines[1]).toBe('3,Kowal-Nowak,Ola,1,0,0,0,0,0,1');
    expect(csv.toLowerCase()).not.toContain('minus');
  });

  it('escapuje wartosci z przecinkiem', () => {
    const rows = aggregateMonth([], [student({ lastName: 'Kowal,ski' })], '2026-09');
    const csv = toCsv(rows);
    expect(csv).toContain('"Kowal,ski"');
  });
});

describe('settlementRows', () => {
  const sep = (d: number) => new Date(2026, 8, d).toISOString();
  const oct = (d: number) => new Date(2026, 9, d).toISOString();

  it('3 plusy to piatka, reszta przechodzi na nastepny miesiac', () => {
    const events: RecapEvent[] = [1, 2, 3, 4].map((d) => ev({ result: 'plus', at: sep(d) }));
    const [row] = settlementRows(events, [student({})], settings(), '2026-09');
    expect(row).toMatchObject({ plusyIn: 0, plusyMonth: 4, piatki: 1, plusyOut: 1 });
  });

  it('przeniesione plusy dolicza do kolejnego miesiaca', () => {
    const events: RecapEvent[] = [
      ev({ result: 'plus', at: sep(1) }),
      ev({ result: 'plus', at: sep(2) }),
      ev({ result: 'plus', at: oct(1) }),
    ];
    const [row] = settlementRows(events, [student({})], settings(), '2026-10');
    expect(row).toMatchObject({ plusyIn: 2, plusyMonth: 1, piatki: 1, plusyOut: 0 });
  });

  it('plomby (tez za podpowiadanie) daja jedynke i tez przechodza', () => {
    const events: RecapEvent[] = [
      ev({ result: 'plomba', at: sep(1) }),
      ev({ result: 'hint_plomba', at: sep(2) }),
    ];
    const [sepRow] = settlementRows(events, [student({})], settings(), '2026-09');
    expect(sepRow).toMatchObject({ plombyMonth: 2, jedynki: 0, plombyOut: 2 });
    const [octRow] = settlementRows(events, [student({})], settings(), '2026-10');
    expect(octRow).toMatchObject({ plombyIn: 2, plombyMonth: 0, jedynki: 0, plombyOut: 2 });
  });

  it('przenosi przez miesiac bez zdarzen i przez nowy rok', () => {
    const events: RecapEvent[] = [
      ev({ result: 'plus', at: new Date(2026, 10, 3).toISOString() }),
      ev({ result: 'plus', at: new Date(2027, 0, 5).toISOString() }),
    ];
    const [row] = settlementRows(events, [student({})], settings(), '2027-01');
    expect(row).toMatchObject({ plusyIn: 1, plusyMonth: 1, piatki: 0, plusyOut: 2 });
  });

  it('respektuje progi z ustawien i sortuje po numerze', () => {
    const events: RecapEvent[] = [ev({ studentId: 's2', result: 'plus', at: sep(1) }), ev({ studentId: 's2', result: 'plus', at: sep(2) })];
    const rows = settlementRows(
      events,
      [student({ id: 's2', number: 2 }), student({ id: 's1', number: 1 })],
      settings({ plusesForFive: 2 }),
      '2026-09',
    );
    expect(rows.map((r) => r.student.id)).toEqual(['s1', 's2']);
    expect(rows[1].piatki).toBe(1);
  });
});

describe('findLatestEventId', () => {
  it('zwraca id najnowszego zdarzenia danego typu w danym miesiacu', () => {
    const older = ev({ id: 'e1', studentId: 's1', result: 'plus', at: new Date(2026, 8, 1).toISOString() });
    const newer = ev({ id: 'e2', studentId: 's1', result: 'plus', at: new Date(2026, 8, 10).toISOString() });
    const events = [older, newer];
    expect(findLatestEventId(events, 's1', 'plus', '2026-09')).toBe('e2');
  });

  it('ignoruje zdarzenia innego typu, innego ucznia i spoza miesiaca', () => {
    const events: RecapEvent[] = [
      ev({ id: 'e1', studentId: 's1', result: 'kropka', at: new Date(2026, 8, 5).toISOString() }),
      ev({ id: 'e2', studentId: 's2', result: 'plus', at: new Date(2026, 8, 5).toISOString() }),
      ev({ id: 'e3', studentId: 's1', result: 'plus', at: new Date(2026, 7, 20).toISOString() }),
    ];
    expect(findLatestEventId(events, 's1', 'plus', '2026-09')).toBeUndefined();
  });

  it('zwraca undefined, gdy uczen nie ma zadnego zdarzenia danego typu', () => {
    expect(findLatestEventId([], 's1', 'plomba', '2026-09')).toBeUndefined();
  });

  it('kolejnosc zdarzen w tablicy nie ma znaczenia - wygrywa najnowsza data', () => {
    const events: RecapEvent[] = [
      ev({ id: 'e1', studentId: 's1', result: 'uwaga', at: new Date(2026, 8, 15).toISOString() }),
      ev({ id: 'e2', studentId: 's1', result: 'uwaga', at: new Date(2026, 8, 2).toISOString() }),
      ev({ id: 'e3', studentId: 's1', result: 'uwaga', at: new Date(2026, 8, 20).toISOString() }),
    ];
    expect(findLatestEventId(events, 's1', 'uwaga', '2026-09')).toBe('e3');
  });
});
