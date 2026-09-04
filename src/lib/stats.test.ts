import { describe, expect, it } from 'vitest';
import type { RecapEvent, Settings, Student } from '../data/types';
import { aggregateMonth, settlementRows, toCsv } from './stats';

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
    plusesForFive: 3,
    plombyForOne: 3,
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
  it('zwraca tylko uczniow z kompletem plomb lub plusow, posortowanych po numerze', () => {
    const students = [
      student({ id: 's2', number: 2 }),
      student({ id: 's1', number: 1 }),
      student({ id: 's3', number: 3 }),
    ];
    const events: RecapEvent[] = [
      // s1: 3 plomby -> owesTasks
      ev({ studentId: 's1', result: 'plomba', questionId: 'q1' }),
      ev({ studentId: 's1', result: 'plomba', questionId: 'q2' }),
      ev({ studentId: 's1', result: 'plomba', questionId: 'q3' }),
      // s2: tylko 1 plomba, 1 plus - nic nie oddaje
      ev({ studentId: 's2', result: 'plomba', questionId: 'q4' }),
      ev({ studentId: 's2', result: 'plus' }),
      // s3: 3 plusy -> earnedFive
      ev({ studentId: 's3', result: 'plus' }),
      ev({ studentId: 's3', result: 'plus' }),
      ev({ studentId: 's3', result: 'plus' }),
    ];
    const rows = settlementRows(events, students, settings());
    expect(rows.map((r) => r.student.id)).toEqual(['s1', 's3']);
    const s1Row = rows.find((r) => r.student.id === 's1')!;
    expect(s1Row.owesTasks).toBe(true);
    expect(s1Row.earnedFive).toBe(false);
    expect(s1Row.plomby).toBe(3);
    expect(s1Row.plombyQuestionIds).toEqual(['q1', 'q2', 'q3']);
    const s3Row = rows.find((r) => r.student.id === 's3')!;
    expect(s3Row.earnedFive).toBe(true);
    expect(s3Row.owesTasks).toBe(false);
    expect(s3Row.plusy).toBe(3);
  });

  it('liczy plomby za podpowiadanie (hint_plomba) do kompletu', () => {
    const events: RecapEvent[] = [
      ev({ studentId: 's1', result: 'plomba' }),
      ev({ studentId: 's1', result: 'hint_plomba' }),
      ev({ studentId: 's1', result: 'plomba' }),
    ];
    const rows = settlementRows(events, [student({})], settings());
    expect(rows).toHaveLength(1);
    expect(rows[0].plomby).toBe(3);
    expect(rows[0].owesTasks).toBe(true);
  });

  it('zdarzenie rozliczenie zeruje licznik plomb', () => {
    const events: RecapEvent[] = [
      ev({ studentId: 's1', result: 'plomba', at: new Date(2026, 8, 1).toISOString() }),
      ev({ studentId: 's1', result: 'plomba', at: new Date(2026, 8, 2).toISOString() }),
      ev({ studentId: 's1', result: 'plomba', at: new Date(2026, 8, 3).toISOString() }),
      ev({ studentId: 's1', result: 'rozliczenie', at: new Date(2026, 8, 4).toISOString() }),
    ];
    const rows = settlementRows(events, [student({})], settings());
    expect(rows).toHaveLength(0);
  });

  it('zdarzenie jedynka zeruje licznik plomb', () => {
    const events: RecapEvent[] = [
      ev({ studentId: 's1', result: 'plomba', at: new Date(2026, 8, 1).toISOString() }),
      ev({ studentId: 's1', result: 'plomba', at: new Date(2026, 8, 2).toISOString() }),
      ev({ studentId: 's1', result: 'plomba', at: new Date(2026, 8, 3).toISOString() }),
      ev({ studentId: 's1', result: 'jedynka', at: new Date(2026, 8, 4).toISOString() }),
    ];
    const rows = settlementRows(events, [student({})], settings());
    expect(rows).toHaveLength(0);
  });

  it('zdarzenie piatka zeruje licznik plusow', () => {
    const events: RecapEvent[] = [
      ev({ studentId: 's1', result: 'plus', at: new Date(2026, 8, 1).toISOString() }),
      ev({ studentId: 's1', result: 'plus', at: new Date(2026, 8, 2).toISOString() }),
      ev({ studentId: 's1', result: 'plus', at: new Date(2026, 8, 3).toISOString() }),
      ev({ studentId: 's1', result: 'piatka', at: new Date(2026, 8, 4).toISOString() }),
    ];
    const rows = settlementRows(events, [student({})], settings());
    expect(rows).toHaveLength(0);
  });

  it('respektuje niestandardowe progi z ustawien', () => {
    const events: RecapEvent[] = [
      ev({ studentId: 's1', result: 'plomba' }),
      ev({ studentId: 's1', result: 'plomba' }),
    ];
    const rows = settlementRows(events, [student({})], settings({ plombyForOne: 2 }));
    expect(rows).toHaveLength(1);
    expect(rows[0].owesTasks).toBe(true);
  });
});
