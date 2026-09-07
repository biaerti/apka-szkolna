// Pytania lekcji widziane jako DWIE grupy - dokladnie tak, jak mysli o nich
// nauczyciel:
// - ZADANIA (Z1, Z2...) - polecenia ze slajdow `task`, robione na lekcji;
//   kolo na lekcji losuje do nich osobe (patrz src/components/lessons/useTaskWheel.ts),
// - PYTANIA POWTORZENIOWE (PZ1, PZ2...) - zestaw pytan wpiety w lekcje,
//   odpytywany kolem na poczatku nastepnej lekcji (patrz src/lib/recap.ts).
//
// Jedne i drugie moga trafic do kartkowki, ale nauczyciel musi widziec, ktore
// sa ktore - stad wspolny typ z kodem (`code`) i rodzajem (`kind`).

import type { Lesson, Question } from '../data/types';

export type LessonQuestionKind = 'zadanie' | 'powtorzeniowe';

export interface LessonQuestionItem {
  /** id slajdu (zadanie) albo id pytania z zestawu (powtorzeniowe). */
  id: string;
  kind: LessonQuestionKind;
  /** Kod widoczny dla nauczyciela: "Z1" dla zadania, "PZ1" dla powtorzeniowego. */
  code: string;
  /** Tresc polecenia / pytania. */
  text: string;
  /** Odpowiedz - tylko pytania powtorzeniowe ja maja. */
  answer?: string;
  /** Tytul slajdu zadania (zadania go maja, pytania nie). */
  title?: string;
}

/** Zadania ze slajdow lekcji, w kolejnosci slajdow. Kod bierzemy ze slajdu (Z1, Z2...). */
export function lessonTasks(lesson: Lesson): LessonQuestionItem[] {
  const out: LessonQuestionItem[] = [];
  for (const slide of lesson.slides) {
    if (slide.kind !== 'task') continue;
    const item: LessonQuestionItem = {
      id: slide.id,
      kind: 'zadanie',
      code: slide.code.trim() || `Z${out.length + 1}`,
      // Polecenie siedzi w `body`; tytul jest naglowkiem slajdu, wiec sluzy
      // tylko za zapasowa tresc, gdy polecenie jeszcze nie zostalo wpisane.
      text: slide.body.trim() || (slide.title ?? '').trim(),
    };
    if (slide.title) item.title = slide.title;
    out.push(item);
  }
  return out;
}

/** Pytania powtorzeniowe zestawu wpietego w lekcje, wg `order`; kody PZ1, PZ2... */
export function lessonReviewQuestions(lesson: Lesson, questions: Question[]): LessonQuestionItem[] {
  if (!lesson.questionSetId) return [];
  return questions
    .filter((q) => q.setId === lesson.questionSetId)
    .sort((a, b) => a.order - b.order)
    .map((q, idx) => {
      const item: LessonQuestionItem = { id: q.id, kind: 'powtorzeniowe', code: `PZ${idx + 1}`, text: q.text };
      if (q.answer) item.answer = q.answer;
      return item;
    });
}

export const LESSON_QUESTION_GROUP_LABELS: Record<LessonQuestionKind, string> = {
  zadanie: 'Zadania z lekcji',
  powtorzeniowe: 'Pytania powtórzeniowe',
};

/**
 * Etykieta pochodzenia pytania w kartkowce, np. "4.2 Z1". Kod lekcji jest ten
 * sam, ktory dzieci maja w zeszytach - po nim nauczyciel poznaje, skad pytanie.
 */
export function lessonQuestionLabel(lesson: Lesson, item: LessonQuestionItem): string {
  return lesson.code ? `${lesson.code} ${item.code}` : item.code;
}
