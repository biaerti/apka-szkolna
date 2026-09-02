// Czyste funkcje kolejki lekcji: "co dalej" per klasa oraz lekcje zalegle.

import type { Lesson } from '../data/types';
import { toDateKey } from './dates';

/**
 * Kolejne `n` lekcji danej klasy o statusie 'planned' lub 'in_progress',
 * posortowane wg kolejnosci (`order`) rosnaco.
 */
export function nextLessons(lessons: Lesson[], classId: string, n: number): Lesson[] {
  return lessons
    .filter((l) => l.classId === classId && (l.status === 'planned' || l.status === 'in_progress'))
    .sort((a, b) => a.order - b.order)
    .slice(0, Math.max(0, n));
}

/** Lekcje 'planned' z `plannedDate` wczesniejszym niz dzisiaj. */
export function overdue(lessons: Lesson[], today: Date): Lesson[] {
  const todayKey = toDateKey(today);
  return lessons.filter(
    (l) => l.status === 'planned' && l.plannedDate !== undefined && l.plannedDate < todayKey,
  );
}
