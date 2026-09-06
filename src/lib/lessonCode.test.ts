import { describe, expect, it } from 'vitest';
import type { Lesson } from '../data/types';
import { backfillLessonCodes, gradeNumber, nextLessonCode } from './lessonCode';

function lesson(patch: Partial<Lesson>): Lesson {
  return { id: 'l1', grade: 'IV', title: 'Lekcja', order: 0, progress: {}, slides: [], ...patch };
}

describe('gradeNumber', () => {
  it('zamienia rzymski rocznik na cyfre', () => {
    expect(gradeNumber('IV')).toBe('4');
    expect(gradeNumber('viii')).toBe('8');
  });

  it('zostawia rocznik zapisany cyfra', () => {
    expect(gradeNumber('5')).toBe('5');
  });
});

describe('nextLessonCode', () => {
  it('pierwsza lekcja rocznika dostaje numer 1', () => {
    expect(nextLessonCode([], 'IV')).toBe('4.1');
  });

  it('bierze najwyzszy uzyty numer, nie liczbe lekcji', () => {
    const lessons = [
      lesson({ id: 'a', code: '4.1' }),
      lesson({ id: 'b', code: '4.7' }),
      lesson({ id: 'c', grade: 'V', code: '5.9' }),
    ];
    expect(nextLessonCode(lessons, 'IV')).toBe('4.8');
    expect(nextLessonCode(lessons, 'V')).toBe('5.10');
  });

  it('pomija lekcje bez kodu', () => {
    expect(nextLessonCode([lesson({ id: 'a' })], 'IV')).toBe('4.1');
  });
});

describe('backfillLessonCodes', () => {
  it('numeruje stare lekcje wg kolejnosci, nie ruszajac tych z kodem', () => {
    const lessons = [
      lesson({ id: 'a', order: 0 }),
      lesson({ id: 'b', order: 1, code: '4.5' }),
      lesson({ id: 'c', order: 2 }),
    ];
    expect(backfillLessonCodes(lessons)).toEqual([
      { id: 'a', code: '4.6' },
      { id: 'c', code: '4.7' },
    ]);
  });

  it('nic nie zwraca, gdy wszystkie lekcje maja kody', () => {
    expect(backfillLessonCodes([lesson({ code: '4.1' })])).toEqual([]);
  });
});
