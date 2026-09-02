import { describe, expect, it } from 'vitest';
import type { RecapEvent, Student } from '../data/types';
import { aggregateMonth, toCsv } from './stats';

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
  };
}

describe('aggregateMonth', () => {
  it('agreguje wiersze posortowane po numerze', () => {
    const students = [
      student({ id: 's2', number: 2, firstName: 'Ala', lastName: 'Nowak' }),
      student({ id: 's1', number: 1, firstName: 'Jan', lastName: 'Kowalski' }),
    ];
    const events: RecapEvent[] = [
      ev({ studentId: 's1', result: 'plus' }),
      ev({ studentId: 's1', result: 'minus' }),
      ev({ studentId: 's2', result: 'pass' }),
      ev({ studentId: 's2', result: 'hint_minus' }),
    ];
    const rows = aggregateMonth(events, students, '2026-09');
    expect(rows.map((r) => r.studentId)).toEqual(['s1', 's2']);
    expect(rows[0]).toMatchObject({ plus: 1, minus: 1, pass: 0, hint: 0, bilans: 0 });
    expect(rows[1]).toMatchObject({ plus: 0, minus: 0, pass: 1, hint: 1, bilans: -1 });
  });

  it('zwraca zera dla ucznia bez zdarzen', () => {
    const rows = aggregateMonth([], [student({})], '2026-09');
    expect(rows[0]).toMatchObject({ plus: 0, minus: 0, pass: 0, hint: 0, bilans: 0 });
  });
});

describe('toCsv', () => {
  it('generuje naglowek i wiersze', () => {
    const rows = aggregateMonth(
      [ev({ studentId: 's1', result: 'plus' })],
      [student({ number: 3, firstName: 'Ola', lastName: 'Kowal-Nowak' })],
      '2026-09',
    );
    const csv = toCsv(rows);
    const lines = csv.split('\n');
    expect(lines[0]).toBe('Nr,Nazwisko,Imię,Plus,Minus,Pas,Podpowiedzi,Bilans');
    expect(lines[1]).toBe('3,Kowal-Nowak,Ola,1,0,0,0,1');
  });

  it('escapuje wartosci z przecinkiem', () => {
    const rows = aggregateMonth([], [student({ lastName: 'Kowal,ski' })], '2026-09');
    const csv = toCsv(rows);
    expect(csv).toContain('"Kowal,ski"');
  });
});
