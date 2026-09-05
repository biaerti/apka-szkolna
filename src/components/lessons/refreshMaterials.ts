// Dopasowanie "starych" lekcji (juz wstawionych do klasy) do "nowych" definicji
// gotowych materialow (buildRecap13 / buildIntroLesson) po tytule - z tolerancja
// na brak polskich znakow diakrytycznych ORAZ na przestawiona kolejnosc slow w
// tytule (np. stara wersja kodu miala "Litery, glosek..." zamiast "Glosek,
// litery..."). Dzieki temu "Odswiez gotowe materialy" w Lessons.tsx znajduje
// pare nawet wtedy, gdy tresc w kodzie zdazyla sie zmienic od czasu wstawienia.

import type { Lesson, Question, QuestionSet, Slide } from '../../data/types';

export { titleMatchKey } from '../../lib/titleMatchKey';
import { titleMatchKey } from '../../lib/titleMatchKey';

/** Paczka "swiezych" danych z kodu (buildRecap13 i/lub buildIntroLesson), gotowa do dopasowania. */
export interface FreshMaterialsBundle {
  lessons: Array<Omit<Lesson, 'id' | 'order'>>;
  questionSets: QuestionSet[]; // tymczasowe id - wygenerowane przez buildXxx, sluza tylko do mapowania
  questions: Question[]; // questionId.setId wskazuje na tymczasowe id powyzej
}

export interface RefreshMatch {
  oldLesson: Lesson;
  newLesson: Omit<Lesson, 'id' | 'order'>;
  newQuestionSet?: QuestionSet;
  newQuestions: Question[];
}

/** Znajduje pary (istniejaca lekcja w klasie <-> nowa definicja) po znormalizowanym tytule. */
export function matchLessonsForRefresh(
  classLessons: Lesson[],
  fresh: FreshMaterialsBundle,
): RefreshMatch[] {
  const matches: RefreshMatch[] = [];
  for (const newLesson of fresh.lessons) {
    const key = titleMatchKey(newLesson.title);
    const oldLesson = classLessons.find((l) => titleMatchKey(l.title) === key);
    if (!oldLesson) continue;
    const tempSetId = newLesson.questionSetId;
    const newQuestionSet = fresh.questionSets.find((qs) => qs.id === tempSetId);
    const newQuestions = fresh.questions
      .filter((q) => q.setId === tempSetId)
      .sort((a, b) => a.order - b.order);
    matches.push({ oldLesson, newLesson, newQuestionSet, newQuestions });
  }
  return matches;
}

/** Id zestawu pytan lekcji: pole questionSetId, a w razie jego braku (starsze dane) pierwszy slajd recap. */
export function lessonQuestionSetId(lesson: Lesson): string | undefined {
  if (lesson.questionSetId) return lesson.questionSetId;
  const recapSlide = lesson.slides.find(
    (s): s is Extract<Slide, { kind: 'recap' }> => s.kind === 'recap',
  );
  return recapSlide?.questionSetId;
}

/** Podmienia w slajdach lekcji tymczasowy id nowego zestawu na juz istniejacy w bazie. */
export function remapRecapSlides(slides: Slide[], fromId: string, toId: string): Slide[] {
  return slides.map((s) =>
    s.kind === 'recap' && s.questionSetId === fromId ? { ...s, questionSetId: toId } : s,
  );
}

/** Usuwa pola `id` ze slajdow - id sa losowane przy kazdym buildXxx, wiec nie moga wchodzic do porownania. */
function slidesFingerprint(slides: Slide[]): string {
  return JSON.stringify(slides.map(({ id: _id, ...rest }) => rest));
}

/**
 * Czy wstawiona lekcja rozni sie trescia od aktualnej definicji w kodzie
 * (tytul, wpis do dziennika, slajdy, pytania). Dopasowanie po tytule mowi tylko
 * "to ten sam material"; dopiero to mowi, czy jest co odswiezac.
 */
export function isMatchStale(match: RefreshMatch, oldQuestions: Question[]): boolean {
  const o = match.oldLesson;
  const n = match.newLesson;
  if (o.title !== n.title) return true;
  if ((o.registerTopic ?? '') !== (n.registerTopic ?? '')) return true;
  if (JSON.stringify(o.curriculum ?? []) !== JSON.stringify(n.curriculum ?? [])) return true;
  if (slidesFingerprint(o.slides) !== slidesFingerprint(n.slides)) return true;
  const oldQ = oldQuestions
    .filter((q) => q.setId === lessonQuestionSetId(o))
    .sort((a, b) => a.order - b.order)
    .map((q) => [q.text, q.answer ?? '']);
  const newQ = match.newQuestions.map((q) => [q.text, q.answer ?? '']);
  return JSON.stringify(oldQ) !== JSON.stringify(newQ);
}
