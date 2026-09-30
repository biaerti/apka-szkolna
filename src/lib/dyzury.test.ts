import { describe, expect, it } from 'vitest';
import { DYZURY } from '../data/dyzury';
import { DEFAULT_PERIODS } from '../data/timetableSeed';
import { dutyStatus } from './dyzury';

// 2026-10-01 to czwartek, 2026-10-02 piatek.
const at = (day: number, h: number, m: number) => new Date(2026, 9, day, h, m);

describe('dutyStatus', () => {
  it('w czwartek na 1. lekcji zapowiada dyzur po lekcji', () => {
    expect(dutyStatus(DYZURY, DEFAULT_PERIODS, at(1, 8, 30))).toMatchObject({ kind: 'after-lesson' });
  });
  it('w czwartek na przerwie po 1. i po 2. lekcji dyzur trwa', () => {
    expect(dutyStatus(DYZURY, DEFAULT_PERIODS, at(1, 8, 47))).toMatchObject({ kind: 'now', duty: { place: 'Pawilon 3, parter' } });
    expect(dutyStatus(DYZURY, DEFAULT_PERIODS, at(1, 9, 37)).kind).toBe('now');
  });
  it('po 3. lekcji i w piatek dyzuru nie ma', () => {
    expect(dutyStatus(DYZURY, DEFAULT_PERIODS, at(1, 10, 0)).kind).toBe('none');
    expect(dutyStatus(DYZURY, DEFAULT_PERIODS, at(1, 10, 30)).kind).toBe('none');
    expect(dutyStatus(DYZURY, DEFAULT_PERIODS, at(2, 8, 47)).kind).toBe('none');
  });
});
