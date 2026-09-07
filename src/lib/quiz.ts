// Kartkowki i klasowki - czyste funkcje (bez store'u), testowane jednostkowo.
//
// Kartkowka jest per KLASA (konkretne wydarzenie: kara za halas albo termin
// klasowki), a pytania bierze z zestawow LEKCJI ROCZNIKA tej klasy - stad
// lessonsWithQuestionSets laczy jedno z drugim przez src/lib/grade.ts.

import type { Lesson, Question, QuestionSet, QuizKind, QuizQuestion, SchoolClass } from '../data/types';
import { newId } from '../data/id';
import { lessonsForClass } from './grade';

export function quizKindLabel(kind: QuizKind): string {
  return kind === 'klasowka' ? 'klasówka' : 'kartkówka';
}

/** "Kartkówka" / "Klasówka" - do naglowkow i tytulow. */
export function quizKindTitle(kind: QuizKind): string {
  const label = quizKindLabel(kind);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/** "2026-09-07" -> "07.09.2026" (format, jakim nauczyciel podpisuje kartki). */
export function formatQuizDate(date?: string): string {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return date ?? '';
  const [y, m, d] = date.split('-');
  return `${d}.${m}.${y}`;
}

/**
 * KOPIA pytania z zestawu do kartkowki (tresc i odpowiedz z chwili dodania,
 * nowe id, slad `sourceQuestionId` - patrz komentarz przy QuizQuestion).
 */
export function quizQuestionFromQuestion(q: Question, order: number): QuizQuestion {
  const out: QuizQuestion = { id: newId(), text: q.text, sourceQuestionId: q.id, order };
  if (q.answer !== undefined) out.answer = q.answer;
  return out;
}

/** Pytanie wpisane recznie - bez sladu do zestawu. */
export function ownQuizQuestion(text: string, answer: string | undefined, order: number): QuizQuestion {
  const out: QuizQuestion = { id: newId(), text: text.trim(), order };
  const trimmed = answer?.trim();
  if (trimmed) out.answer = trimmed;
  return out;
}

/** Sortuje po `order` i nadaje kolejnosc od zera, bez dziur. */
export function renumber(questions: QuizQuestion[]): QuizQuestion[] {
  return [...questions]
    .sort((a, b) => a.order - b.order)
    .map((q, idx) => (q.order === idx ? q : { ...q, order: idx }));
}

/** Zamienia pytanie miejscami z sasiadem; poza zakresem - bez zmian. */
export function moveQuizQuestion(questions: QuizQuestion[], id: string, direction: 'up' | 'down'): QuizQuestion[] {
  const sorted = renumber(questions);
  const idx = sorted.findIndex((q) => q.id === id);
  const swap = direction === 'up' ? idx - 1 : idx + 1;
  if (idx === -1 || swap < 0 || swap >= sorted.length) return sorted;
  const out = [...sorted];
  [out[idx], out[swap]] = [out[swap], out[idx]];
  return out.map((q, i) => ({ ...q, order: i }));
}

/**
 * Domyslny tytul: "Kartkówka 07.09.2026", a gdy podano tytuly lekcji -
 * "Klasówka 07.09.2026 - Części mowy, Przypadki".
 */
export function defaultQuizTitle(kind: QuizKind, date?: string, lessonTitles?: string[]): string {
  const parts = [quizKindTitle(kind)];
  const d = formatQuizDate(date);
  if (d) parts.push(d);
  const lessons = (lessonTitles ?? []).map((t) => t.trim()).filter((t) => t.length > 0);
  const head = parts.join(' ');
  return lessons.length > 0 ? `${head} - ${lessons.join(', ')}` : head;
}

export interface LessonWithQuestions {
  lesson: Lesson;
  set: QuestionSet;
  /** Pytania zestawu posortowane wg `order`. */
  questions: Question[];
}

/**
 * Lekcje rocznika tej klasy, ktore maja zestaw pytan z co najmniej jednym
 * pytaniem - do pickera "Dodaj z pytań lekcji". Kolejnosc lekcji jak w
 * roczniku; lekcje bez zestawu albo z pustym zestawem nie maja czego
 * pokazac, wiec ich nie ma na liscie.
 */
export function lessonsWithQuestionSets(
  lessons: Lesson[],
  questionSets: QuestionSet[],
  questions: Question[],
  classId: string,
  classes: SchoolClass[],
): LessonWithQuestions[] {
  const bySet = new Map<string, Question[]>();
  for (const q of questions) {
    const list = bySet.get(q.setId);
    if (list) list.push(q);
    else bySet.set(q.setId, [q]);
  }
  const out: LessonWithQuestions[] = [];
  for (const lesson of lessonsForClass(lessons, classes, classId)) {
    if (!lesson.questionSetId) continue;
    const set = questionSets.find((s) => s.id === lesson.questionSetId);
    const list = bySet.get(lesson.questionSetId);
    if (!set || !list || list.length === 0) continue;
    out.push({ lesson, set, questions: [...list].sort((a, b) => a.order - b.order) });
  }
  return out;
}
