// Kartkowki i klasowki - czyste funkcje (bez store'u), testowane jednostkowo.
//
// Kartkowka jest per KLASA (konkretne wydarzenie: kara za halas albo termin
// klasowki), a pytania bierze z zestawow LEKCJI ROCZNIKA tej klasy - stad
// lessonQuestionOptions laczy jedno z drugim przez src/lib/grade.ts.

import type { Lesson, Question, QuestionSet, QuizKind, QuizQuestion, SchoolClass } from '../data/types';
import { newId } from '../data/id';
import { lessonsForClass } from './grade';
import { lessonQuestionLabel, lessonReviewQuestions, lessonTasks, type LessonQuestionItem } from './lessonQuestions';

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
 * KOPIA pytania lekcji (zadania Z1 albo pytania powtorzeniowego PZ1) do
 * kartkowki: tresc i odpowiedz z chwili dodania, nowe id, slad
 * `sourceQuestionId` (patrz komentarz przy QuizQuestion) i etykieta
 * pochodzenia `sourceLabel` ("4.2 Z1") - po niej nauczyciel widzi na liscie
 * kartkowki, ktore pytania byly zadaniem na lekcji, a ktore powtorka.
 */
export function quizQuestionFromLessonItem(lesson: Lesson, item: LessonQuestionItem, order: number): QuizQuestion {
  const out: QuizQuestion = {
    id: newId(),
    text: item.text,
    sourceQuestionId: item.id,
    sourceLabel: lessonQuestionLabel(lesson, item),
    order,
  };
  if (item.answer !== undefined) out.answer = item.answer;
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

export interface LessonQuestionOption {
  lesson: Lesson;
  /** Zestaw pytan powtorzeniowych, jesli lekcja go ma i nie zostal usuniety. */
  set?: QuestionSet;
  /** Zadania ze slajdow lekcji (Z1, Z2...). */
  tasks: LessonQuestionItem[];
  /** Pytania powtorzeniowe zestawu (PZ1, PZ2...). */
  review: LessonQuestionItem[];
}

/**
 * Lekcje rocznika tej klasy, z ktorych da sie wziac pytania do kartkowki -
 * do pickera "Dodaj z pytań lekcji". Lekcja wchodzi na liste, gdy ma
 * cokolwiek: zadania ze slajdow ALBO pytania powtorzeniowe (dawniej liczyl
 * sie tylko zestaw pytan, wiec lekcja z samymi zadaniami byla niewidoczna).
 * Kolejnosc lekcji jak w roczniku.
 */
export function lessonQuestionOptions(
  lessons: Lesson[],
  questionSets: QuestionSet[],
  questions: Question[],
  classId: string,
  classes: SchoolClass[],
): LessonQuestionOption[] {
  const out: LessonQuestionOption[] = [];
  for (const lesson of lessonsForClass(lessons, classes, classId)) {
    const set = lesson.questionSetId ? questionSets.find((s) => s.id === lesson.questionSetId) : undefined;
    const tasks = lessonTasks(lesson);
    const review = set ? lessonReviewQuestions(lesson, questions) : [];
    if (tasks.length === 0 && review.length === 0) continue;
    const option: LessonQuestionOption = { lesson, tasks, review };
    if (set) option.set = set;
    out.push(option);
  }
  return out;
}
