import { describe, expect, it } from 'vitest';
import { dyzuryNa } from '../data/dyzury';
import { DEFAULT_PERIODS } from '../data/timetableSeed';
import { dutyStatus } from './dyzury';

// 2026-10-01 to czwartek, 2026-10-02 piatek.
const at = (day: number, h: number, m: number) => new Date(2026, 9, day, h, m);

describe('dutyStatus', () => {
  it('w czwartek na 1. lekcji zapowiada dyzur po lekcji', () => {
    expect(dutyStatus(dyzuryNa(at(1, 8, 30)), DEFAULT_PERIODS, at(1, 8, 30))).toMatchObject({ kind: 'after-lesson' });
  });
  it('w czwartek na przerwie po 1. i po 2. lekcji dyzur trwa', () => {
    expect(dutyStatus(dyzuryNa(at(1, 8, 47)), DEFAULT_PERIODS, at(1, 8, 47))).toMatchObject({ kind: 'now', duty: { place: 'Pawilon 3, parter' } });
    expect(dutyStatus(dyzuryNa(at(1, 9, 37)), DEFAULT_PERIODS, at(1, 9, 37)).kind).toBe('now');
  });
  it('po 3. lekcji i w piatek dyzuru nie ma', () => {
    expect(dutyStatus(dyzuryNa(at(1, 10, 0)), DEFAULT_PERIODS, at(1, 10, 0)).kind).toBe('none');
    expect(dutyStatus(dyzuryNa(at(1, 10, 30)), DEFAULT_PERIODS, at(1, 10, 30)).kind).toBe('none');
    expect(dutyStatus(dyzuryNa(at(2, 8, 47)), DEFAULT_PERIODS, at(2, 8, 47)).kind).toBe('none');
  });
});

describe('grafik 1.2 od 2026-10-05', () => {
  it('w poniedzialek po 4. lekcji dyzur na Pawilonie 3', () => {
    expect(dutyStatus(dyzuryNa(at(5, 11, 0)), DEFAULT_PERIODS, at(5, 11, 0))).toMatchObject({
      kind: 'after-lesson',
      duty: { place: 'Pawilon 3, parter' },
    });
  });
  it('w czwartek 8.10 po 1. lekcji juz bez dyzuru, po 2. pietro', () => {
    expect(dyzuryNa(at(8, 8, 0)).some((d) => d.weekday === 4 && d.afterPeriod === 1)).toBe(false);
    expect(dyzuryNa(at(8, 8, 0)).find((d) => d.weekday === 4 && d.afterPeriod === 2)?.place).toBe('Pawilon 3, piętro');
  });
});
