import { describe, expect, it } from 'vitest';
import type { Lesson } from '../data/types';
import { nextLessons, overdue } from './queue';

function lesson(partial: Partial<Lesson> & { id: string; order: number }): Lesson {
  return {
    classId: 'c1',
    title: 'Lekcja',
    status: 'planned',
    slides: [],
    ...partial,
  };
}

describe('nextLessons', () => {
  it('zwraca lekcje planned/in_progress posortowane wg order, ograniczone do n', () => {
    const lessons: Lesson[] = [
      lesson({ id: 'a', order: 2, status: 'planned' }),
      lesson({ id: 'b', order: 0, status: 'done' }),
      lesson({ id: 'c', order: 1, status: 'in_progress' }),
      lesson({ id: 'd', order: 3, status: 'planned' }),
      lesson({ id: 'e', order: 4, status: 'skipped' }),
    ];
    const result = nextLessons(lessons, 'c1', 2);
    expect(result.map((l) => l.id)).toEqual(['c', 'a']);
  });

  it('ignoruje lekcje innych klas', () => {
    const lessons: Lesson[] = [
      lesson({ id: 'a', order: 0, classId: 'c1' }),
      lesson({ id: 'b', order: 0, classId: 'c2' }),
    ];
    expect(nextLessons(lessons, 'c1', 5).map((l) => l.id)).toEqual(['a']);
  });

  it('zwraca pusta liste, gdy brak lekcji', () => {
    expect(nextLessons([], 'c1', 3)).toEqual([]);
  });
});

describe('overdue', () => {
  it('zwraca planned lekcje z plannedDate wczesniejsza niz dzisiaj', () => {
    const today = new Date(2026, 8, 2);
    const lessons: Lesson[] = [
      lesson({ id: 'a', order: 0, status: 'planned', plannedDate: '2026-09-01' }),
      lesson({ id: 'b', order: 1, status: 'planned', plannedDate: '2026-09-02' }),
      lesson({ id: 'c', order: 2, status: 'planned', plannedDate: '2026-08-15' }),
      lesson({ id: 'd', order: 3, status: 'done', plannedDate: '2026-08-01' }),
      lesson({ id: 'e', order: 4, status: 'planned' }),
    ];
    const result = overdue(lessons, today);
    expect(result.map((l) => l.id).sort()).toEqual(['a', 'c']);
  });

  it('zwraca pusta liste, gdy nic nie zalega', () => {
    const today = new Date(2026, 8, 2);
    const lessons: Lesson[] = [lesson({ id: 'a', order: 0, plannedDate: '2026-09-10' })];
    expect(overdue(lessons, today)).toEqual([]);
  });
});
