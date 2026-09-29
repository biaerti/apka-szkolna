import type { Lesson, LessonMaterialType } from '../data/types';
import { resolveRecapMode } from './recap';

/** Wsteczna zgodnosc dla lekcji zapisanych przed dodaniem jawnego typu materialu. */
export function lessonMaterialType(lesson: Lesson): LessonMaterialType {
  if (lesson.materialType) return lesson.materialType;
  if (lesson.dzial?.toLocaleLowerCase('pl').startsWith('powtórka')) return 'review';
  if (lesson.slides.some((slide) => slide.kind === 'recap' && resolveRecapMode(slide) === 'demo')) return 'review';
  return 'textbook';
}

/** Zakladka listy lekcji: powtorki albo jeden dzial podrecznika. */
export interface LessonSection {
  key: string;
  type: LessonMaterialType;
  /** Krotka etykieta na zakladce ("Dział 2"), pelna nazwa idzie do title. */
  label: string;
  title: string;
  lessons: Lesson[];
}

export const REVIEW_SECTION = 'review';
const NO_DZIAL = 'textbook';

/** "Dział 2 - Uwaga, uczucia!" -> "Dział 2", "Rozdział I. Poznajemy siebie" -> "Rozdział I". */
export function shortDzialLabel(dzial: string): string {
  const beforeDash = dzial.split(' - ')[0].trim();
  const beforeDot = beforeDash.split('. ')[0].trim();
  return beforeDot || dzial;
}

/**
 * Powtorki jako jedna zakladka, lekcje z podrecznika rozbite na dzialy
 * w kolejnosci rocznika. Lekcje z podrecznika bez dzialu (wlasne) trafiaja
 * na koniec, do zakladki "Inne".
 */
export function lessonSections(lessons: Lesson[]): LessonSection[] {
  const review = lessons.filter((lesson) => lessonMaterialType(lesson) === 'review');
  const byDzial = new Map<string, Lesson[]>();
  for (const lesson of lessons) {
    if (lessonMaterialType(lesson) !== 'textbook') continue;
    const key = lesson.dzial ? `dzial:${lesson.dzial}` : NO_DZIAL;
    byDzial.set(key, [...(byDzial.get(key) ?? []), lesson]);
  }
  const sections: LessonSection[] = [];
  if (review.length > 0) sections.push({ key: REVIEW_SECTION, type: 'review', label: 'Powtórzeniowe', title: 'Lekcje powtórzeniowe', lessons: review });
  const keys = [...byDzial.keys()].sort((a, b) => Number(a === NO_DZIAL) - Number(b === NO_DZIAL));
  for (const key of keys) {
    const dzial = key.slice('dzial:'.length);
    sections.push(
      key === NO_DZIAL
        ? { key, type: 'textbook', label: byDzial.size > 1 ? 'Inne' : 'Z podręcznika', title: 'Lekcje z podręcznika bez działu', lessons: byDzial.get(key)! }
        : { key, type: 'textbook', label: shortDzialLabel(dzial), title: dzial, lessons: byDzial.get(key)! },
    );
  }
  return sections;
}

/**
 * Ktora zakladka: typ z adresu (powrot z prezentacji) ma pierwszenstwo, dzial
 * bierzemy z zapamietanego wyboru; bez niczego - pierwszy dzial podrecznika.
 */
export function pickLessonSection(sections: LessonSection[], requestedType: string | null, stored: string | null): LessonSection | undefined {
  const storedSection = sections.find((section) => section.key === stored);
  if (requestedType === 'review' || requestedType === 'textbook') {
    if (storedSection?.type === requestedType) return storedSection;
    return sections.find((section) => section.type === requestedType) ?? sections[0];
  }
  return storedSection ?? sections.find((section) => section.type === 'textbook') ?? sections[0];
}
