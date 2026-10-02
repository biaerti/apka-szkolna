import { describe, expect, it } from 'vitest';
import type { RecapEvent, Settings, Student } from '../data/types';
import { classBalance, findLatestEventId, toCsv, unsettledBalance } from './stats';

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

const at = (m: number, d: number) => new Date(2026, m, d, 10).toISOString();

describe('classBalance', () => {
  it('sumuje plusy ze wszystkich miesiecy i pokazuje, ile piatek do rozliczenia', () => {
    const events: RecapEvent[] = [
      ev({ result: 'plus', at: at(8, 1) }),
      ev({ result: 'plus', at: at(8, 20) }),
      ev({ result: 'plus', at: at(9, 2) }),
      ev({ result: 'plus', at: at(9, 3) }),
      ev({ result: 'kropka', at: at(8, 3) }),
    ];
    const [row] = classBalance(events, [student({})], settings(), new Date(2026, 9, 5));
    expect(row).toMatchObject({ plus: 4, doPiatki: 1, kropka: 1 });
  });

  it('rozliczona piatka zabiera 3 plusy, reszta zostaje', () => {
    const events: RecapEvent[] = [
      ...[1, 2, 3, 4, 5, 6].map((d) => ev({ result: 'plus', at: at(8, d) })),
      ev({ result: 'piatka', at: at(9, 2) }),
    ];
    const [row] = classBalance(events, [student({})], settings(), new Date(2026, 9, 5));
    expect(row).toMatchObject({ plus: 3, doPiatki: 1 });
  });

  it('plomby (tez za podpowiadanie) i jedynka', () => {
    const events: RecapEvent[] = [
      ev({ result: 'plomba', at: at(8, 1) }),
      ev({ result: 'hint_plomba', at: at(8, 2) }),
      ev({ result: 'plomba', at: at(9, 1) }),
    ];
    expect(classBalance(events, [student({})], settings())[0]).toMatchObject({ plomba: 3, doJedynki: 1 });
    const after = [...events, ev({ result: 'jedynka', at: at(9, 2) })];
    expect(classBalance(after, [student({})], settings())[0]).toMatchObject({ plomba: 0, doJedynki: 0 });
  });

  it('pasy liczy tylko z biezacego miesiaca (limit jest miesieczny)', () => {
    const events: RecapEvent[] = [ev({ result: 'pass', at: at(8, 1) }), ev({ result: 'pass', at: at(9, 1) })];
    expect(classBalance(events, [student({})], settings(), new Date(2026, 9, 5))[0].pass).toBe(1);
  });

  it('sortuje po numerze z dziennika', () => {
    const rows = classBalance([], [student({ id: 's2', number: 2 }), student({ id: 's1', number: 1 })], settings());
    expect(rows.map((r) => r.studentId)).toEqual(['s1', 's2']);
  });
});

describe('unsettledBalance', () => {
  it('piatka na wyrost nie zjada przyszlych plusow', () => {
    const events: RecapEvent[] = [
      ev({ result: 'plus', at: at(8, 1) }),
      ev({ result: 'piatka', at: at(9, 1) }),
      ev({ result: 'plus', at: at(9, 2) }),
    ];
    expect(unsettledBalance(events, 's1', 3, 3).plusy).toBe(1);
  });
});

describe('findLatestEventId', () => {
  it('zwraca najnowsze zdarzenie danych typow, niezaleznie od miesiaca', () => {
    const events: RecapEvent[] = [
      ev({ id: 'e1', result: 'plus', at: at(8, 1) }),
      ev({ id: 'e2', result: 'plus', at: at(9, 1) }),
      ev({ id: 'e3', result: 'kropka', at: at(9, 5) }),
    ];
    expect(findLatestEventId(events, 's1', ['plus'])).toBe('e2');
    expect(findLatestEventId(events, 's1', ['plus'], '2026-09')).toBe('e1');
    expect(findLatestEventId(events, 's2', ['plus'])).toBeUndefined();
  });
});

describe('toCsv', () => {
  it('generuje naglowek i wiersze, escapuje przecinki', () => {
    const rows = classBalance([ev({ result: 'plus' })], [student({ lastName: 'Kowal,ski' })], settings());
    const lines = toCsv(rows).split('\n');
    expect(lines[0]).toBe('Nr,Nazwisko,Imię,Plusy,Kropki,Plomby,Pasy (ten miesiąc),Uwagi');
    expect(lines[1]).toBe('1,"Kowal,ski",Jan,1,0,0,0,0');
  });
});
