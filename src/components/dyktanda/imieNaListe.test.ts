import { describe, expect, it } from 'vitest';
import { imieNaListe } from './DyktandaPanel';
import type { Student } from '../../data/types';

const uczen = (id: string, firstName: string, lastName: string): Student => ({
  id, classId: 'k', firstName, lastName, number: 1, active: true,
});

describe('imieNaListe', () => {
  const a = uczen('1', 'Daniel', 'Kowal');
  const b = uczen('2', 'Daniel', 'Nowak');
  const c = uczen('3', 'Emma', 'Lis');

  it('samo imie, gdy jest jedno takie', () => {
    expect(imieNaListe(c, [a, b, c], [])).toBe('Emma');
  });
  it('litera nazwiska, gdy imie sie powtarza w klasie albo na liscie', () => {
    expect(imieNaListe(a, [a, b, c], [])).toBe('Daniel K.');
    expect(imieNaListe(c, [c], ['Emma'])).toBe('Emma L.');
  });
});
