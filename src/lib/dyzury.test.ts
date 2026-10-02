import { describe, expect, it } from 'vitest';
import { dyzuryNa } from '../data/dyzury';
import { DEFAULT_PERIODS } from '../data/timetableSeed';
import { dutyStatus } from './dyzury';
import { nextRoom } from './timetable';
import type { TimetableEntry } from '../data/types';

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

describe('nextRoom', () => {
  // Wtorek 2026-10-06: 1-2 sala 31, 4 sala 35, 5 sala 30.
  const tt: TimetableEntry[] = [
    { id: 'a', weekday: 2, period: 1, classId: 'k', room: '31' },
    { id: 'b', weekday: 2, period: 2, classId: 'k', room: '31' },
    { id: 'c', weekday: 2, period: 4, classId: 'k', room: '35' },
    { id: 'd', weekday: 2, period: 5, classId: 'k', room: '30' },
  ];
  it('na lekcji w tej samej sali co nastepna - nic', () => {
    expect(nextRoom(tt, DEFAULT_PERIODS, at(6, 8, 30))).toBeUndefined();
  });
  it('na lekcji przed zmiana sali - zapowiedz', () => {
    expect(nextRoom(tt, DEFAULT_PERIODS, at(6, 9, 0))).toEqual({ kind: 'after-lesson', room: '35' });
    expect(nextRoom(tt, DEFAULT_PERIODS, at(6, 11, 0))).toEqual({ kind: 'after-lesson', room: '30' });
  });
  it('w okienku i na przerwie - sala najblizszej lekcji', () => {
    expect(nextRoom(tt, DEFAULT_PERIODS, at(6, 10, 0))).toEqual({ kind: 'next', room: '35' });
    expect(nextRoom(tt, DEFAULT_PERIODS, at(6, 11, 22))).toEqual({ kind: 'next', room: '30' });
  });
});
