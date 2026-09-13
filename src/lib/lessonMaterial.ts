import type { Lesson, LessonMaterialType } from '../data/types';
import { resolveRecapMode } from './recap';

/** Wsteczna zgodnosc dla lekcji zapisanych przed dodaniem jawnego typu materialu. */
export function lessonMaterialType(lesson: Lesson): LessonMaterialType {
  if (lesson.materialType) return lesson.materialType;
  if (lesson.dzial?.toLocaleLowerCase('pl').startsWith('powtórka')) return 'review';
  if (lesson.slides.some((slide) => slide.kind === 'recap' && resolveRecapMode(slide) === 'demo')) return 'review';
  return 'textbook';
}
