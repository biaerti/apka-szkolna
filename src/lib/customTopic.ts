// Wlasne tematy z planu lekcji ("Sprawdzian", "Omówienie sprawdzianu"...):
// zwykla lekcja rocznika bez slajdow, w osobnym dziale. Dzieki temu dziala
// jak kazdy temat - godzina na planie, dziennik, wysylka tematu do VULCANA -
// a nie miesza sie z numeracja lekcji z podrecznika.

import type { Lesson } from '../data/types';
import { lessonProgress } from './grade';
import { slotsFromProgress } from './lessonSlots';

export const CUSTOM_DZIAL = 'Własne tematy';

export function isCustomLesson(lesson: Lesson): boolean {
  return lesson.dzial === CUSTOM_DZIAL;
}

const normalize = (title: string) => title.trim().replace(/\s+/g, ' ').toLocaleLowerCase('pl');

/**
 * Wlasny temat o tej samej nazwie, ktorego ta klasa jeszcze nie miala - np.
 * "Sprawdzian" wpisany dla IV A trafia potem do IV B jako ta sama lekcja.
 * Jesli klasa juz go miala, to nowy sprawdzian, a nie "cz. 2" starego.
 */
export function reusableCustomLesson(lessons: Lesson[], grade: string, classId: string, title: string): Lesson | undefined {
  const wanted = normalize(title);
  return lessons.find((lesson) => {
    if (lesson.grade !== grade || !isCustomLesson(lesson) || normalize(lesson.title) !== wanted) return false;
    const progress = lessonProgress(lesson, classId);
    return progress.status !== 'done' && slotsFromProgress(progress).length === 0;
  });
}
