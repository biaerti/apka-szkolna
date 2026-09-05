// Czyste funkcje kolejki lekcji: "co dalej" dla klasy oraz lekcje zalegle.

import type { Lesson, SchoolClass } from '../data/types';
import { toDateKey } from './dates';
import { lessonProgress, lessonsForClass } from './grade';

/**
 * Kolejne `n` lekcji rocznika danej klasy, ktorych ta klasa jeszcze nie skonczyla
 * (status 'planned' lub 'in_progress'), wg kolejnosci (`order`) rosnaco.
 */
export function nextLessons(lessons: Lesson[], classes: SchoolClass[], classId: string, n: number): Lesson[] {
  return lessonsForClass(lessons, classes, classId)
    .filter((l) => {
      const status = lessonProgress(l, classId).status;
      return status === 'planned' || status === 'in_progress';
    })
    .slice(0, Math.max(0, n));
}

/** Lekcje z `plannedDate` wczesniejszym niz dzisiaj, ktorych zadna klasa nie skonczyla. */
export function overdue(lessons: Lesson[], today: Date): Lesson[] {
  const todayKey = toDateKey(today);
  return lessons.filter(
    (l) =>
      l.plannedDate !== undefined &&
      l.plannedDate < todayKey &&
      !Object.values(l.progress).some((p) => p.status === 'done' || p.status === 'skipped'),
  );
}
