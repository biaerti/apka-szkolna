import { describe, expect, it } from 'vitest';
import type { SchoolClass, Student } from '../data/types';
import { buildFrekwencjaTransfer, checkRoster, rosterSummary, rowMatchesStudent, type FrekwencjaJob } from './vulcanFrekwencja';

const st = (id: string, number: number, lastName: string, firstName: string, active = true): Student => ({
  id,
  classId: 'c1',
  number,
  lastName,
  firstName,
  active,
});

describe('rowMatchesStudent', () => {
  it('lapie drugie imie i wielkosc liter', () => {
    expect(rowMatchesStudent('Staroń Oliwia Julia', { lastName: 'Staroń', firstName: 'Oliwia' })).toBe(true);
    expect(rowMatchesStudent('staroń  oliwia', { lastName: 'Staroń', firstName: 'Oliwia' })).toBe(true);
  });
  it('nie myli imion zaczynajacych sie tak samo', () => {
    expect(rowMatchesStudent('Nowak Anna', { lastName: 'Nowak', firstName: 'An' })).toBe(false);
  });
});

describe('checkRoster', () => {
  const students = [st('a', 6, 'Kowalska', 'Paulina'), st('b', 21, 'Niewiadomska', 'Zofia'), st('c', 12, 'Odszedł', 'Jan')];
  const rows = [
    { number: 6, name: 'Kowalska Paulina Joanna' },
    { number: 20, name: 'Niewiadomska Zofia' },
    { number: 7, name: 'Nowy Uczeń' },
  ];
  it('poprawia numery i wypisuje roznice', () => {
    const check = checkRoster(rows, students);
    expect(check.numberFixes).toEqual([{ studentId: 'b', from: 21, to: 20 }]);
    expect(check.missingInApp.map((r) => r.number)).toEqual([7]);
    expect(check.missingInVulcan.map((s) => s.id)).toEqual(['c']);
    expect(rosterSummary(check)).toBe('poprawione numery: 21→20; w VULCANIE, brak w apce: nr 7; w apce, brak w VULCANIE: nr 12');
  });
  it('pomija nieaktywnych', () => {
    expect(checkRoster([], [st('x', 9, 'A', 'B', false)]).missingInVulcan).toEqual([]);
  });
});

describe('buildFrekwencjaTransfer', () => {
  it('dokleja nazwiska tylko lokalnie i mapuje statusy na legende VULCANA', () => {
    const job: FrekwencjaJob = {
      id: 'vf-1',
      date: '2026-09-24',
      period: 1,
      classId: 'c1',
      marks: [
        { studentId: 'a', status: 'absent' },
        { studentId: 'b', status: 'late' },
        { studentId: 'z', status: 'present' },
      ],
      topic: ' Temat ',
      status: 'pending',
      createdAt: '',
    };
    const cls: SchoolClass = { id: 'c1', name: 'V A' } as SchoolClass;
    const t = buildFrekwencjaTransfer(job, cls, [st('b', 2, 'B', 'b'), st('a', 1, 'A', 'a')]);
    expect(t.vulcanClassName).toBe('5A');
    expect(t.topic).toBe('Temat');
    expect(t.students.map((s) => [s.number, s.legend])).toEqual([
      [1, 'nieobecność'],
      [2, 'spóźnienie'],
    ]);
  });
});
