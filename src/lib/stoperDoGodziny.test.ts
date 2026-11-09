import { describe, expect, it } from 'vitest';
import type { LessonPeriod } from '../data/types';
import { domyslnaGodzina, formatZostalo, sekundyDoGodziny } from './stoperDoGodziny';

// Poniedzialek 9.11.2026
const o = (h: number, m: number, s = 0) => new Date(2026, 10, 9, h, m, s);

const periods = [
  { no: 1, start: '8:00', end: '8:45' },
  { no: 2, start: '8:55', end: '9:40' },
] as LessonPeriod[];

describe('sekundyDoGodziny', () => {
  it('liczy do godziny dzisiaj', () => {
    expect(sekundyDoGodziny(9 * 60 + 40, o(9, 0))).toBe(40 * 60);
    expect(sekundyDoGodziny(9 * 60 + 40, o(9, 39, 30))).toBe(30);
  });
  it('po czasie daje 0', () => {
    expect(sekundyDoGodziny(9 * 60 + 40, o(9, 41))).toBe(0);
  });
});

describe('formatZostalo', () => {
  it('minuty i sekundy, a od godziny z godzinami', () => {
    expect(formatZostalo(2700)).toBe('45:00');
    expect(formatZostalo(59)).toBe('0:59');
    expect(formatZostalo(4500)).toBe('1:15:00');
  });
});

describe('domyslnaGodzina', () => {
  it('na lekcji - jej koniec', () => {
    expect(domyslnaGodzina(periods, o(9, 5))).toBe(9 * 60 + 40);
  });
  it('na przerwie - koniec nastepnej lekcji', () => {
    expect(domyslnaGodzina(periods, o(8, 50))).toBe(9 * 60 + 40);
  });
  it('poza planem - za 45 minut, w gore do 5 minut', () => {
    expect(domyslnaGodzina(periods, o(12, 2))).toBe(12 * 60 + 50);
  });
});
