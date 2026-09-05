import { describe, expect, it } from 'vitest';
import type { Lesson, SchoolClass } from '../data/types';
import { nextLessons, overdue } from './queue';

function lesson(partial: Partial<Lesson> & { grade: string; title: string; order: number }): Lesson {
  return {
    id: `l-${partial.title}-${partial.grade}`,
    progress: {},
    slides: [],
    ...partial,
  };
}

const CLASSES: SchoolClass[] = [
  { id: 'c1', name: 'IV A', order: 0 },
  { id: 'c2', name: 'IV B', order: 1 },
  { id: 'c3', name: 'V A', order: 2 },
];

describe('nextLessons', () => {
  it('zwraca lekcje rocznika klasy planned/in_progress wg jej postepu, posortowane wg order, ograniczone do n', () => {
    const lessons: Lesson[] = [
      lesson({ grade: 'IV', title: 'a', order: 2, progress: { c1: { status: 'planned' } } }),
      lesson({ grade: 'IV', title: 'b', order: 0, progress: { c1: { status: 'done' } } }),
      lesson({ grade: 'IV', title: 'c', order: 1, progress: { c1: { status: 'in_progress' } } }),
      lesson({ grade: 'IV', title: 'd', order: 3, progress: { c1: { status: 'planned' } } }),
      lesson({ grade: 'IV', title: 'e', order: 4, progress: { c1: { status: 'skipped' } } }),
    ];
    const result = nextLessons(lessons, CLASSES, 'c1', 2);
    expect(result.map((l) => l.title)).toEqual(['c', 'a']);
  });

  it('ta sama lekcja moze byc done dla jednej klasy i planned dla rownoleglej', () => {
    const lessons: Lesson[] = [
      lesson({
        grade: 'IV',
        title: 'wspolna',
        order: 0,
        progress: { c1: { status: 'done', doneDate: '2026-09-01' }, c2: { status: 'planned' } },
      }),
    ];
    expect(nextLessons(lessons, CLASSES, 'c1', 5)).toEqual([]);
    expect(nextLessons(lessons, CLASSES, 'c2', 5).map((l) => l.title)).toEqual(['wspolna']);
  });

  it('brak wpisu w progress oznacza planned', () => {
    const lessons: Lesson[] = [lesson({ grade: 'IV', title: 'a', order: 0, progress: {} })];
    expect(nextLessons(lessons, CLASSES, 'c1', 5).map((l) => l.title)).toEqual(['a']);
  });

  it('lekcje innego rocznika sa niewidoczne dla klasy', () => {
    const lessons: Lesson[] = [
      lesson({ grade: 'IV', title: 'a', order: 0 }),
      lesson({ grade: 'V', title: 'b', order: 0 }),
    ];
    expect(nextLessons(lessons, CLASSES, 'c1', 5).map((l) => l.title)).toEqual(['a']);
  });

  it('zwraca pusta liste, gdy brak lekcji', () => {
    expect(nextLessons([], CLASSES, 'c1', 3)).toEqual([]);
  });
});

describe('overdue', () => {
  it('zwraca lekcje z plannedDate wczesniejsza niz dzisiaj, ktorych zadna klasa nie skonczyla', () => {
    const today = new Date(2026, 8, 2);
    const lessons: Lesson[] = [
      lesson({ grade: 'IV', title: 'a', order: 0, plannedDate: '2026-09-01' }),
      lesson({ grade: 'IV', title: 'b', order: 1, plannedDate: '2026-09-02' }),
      lesson({ grade: 'IV', title: 'c', order: 2, plannedDate: '2026-08-15' }),
      lesson({
        grade: 'IV',
        title: 'd',
        order: 3,
        plannedDate: '2026-08-01',
        progress: { c1: { status: 'done', doneDate: '2026-08-01' } },
      }),
      lesson({ grade: 'IV', title: 'e', order: 4 }),
    ];
    const result = overdue(lessons, today);
    expect(result.map((l) => l.title).sort()).toEqual(['a', 'c']);
  });

  it('zwraca pusta liste, gdy nic nie zalega', () => {
    const today = new Date(2026, 8, 2);
    const lessons: Lesson[] = [lesson({ grade: 'IV', title: 'a', order: 0, plannedDate: '2026-09-10' })];
    expect(overdue(lessons, today)).toEqual([]);
  });
});
