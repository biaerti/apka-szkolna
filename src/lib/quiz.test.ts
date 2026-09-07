import { describe, expect, it } from 'vitest';
import type { Lesson, Question, QuestionSet, QuizQuestion, SchoolClass } from '../data/types';
import {
  defaultQuizTitle,
  formatQuizDate,
  lessonQuestionOptions,
  moveQuizQuestion,
  ownQuizQuestion,
  quizKindLabel,
  quizKindTitle,
  quizQuestionFromLessonItem,
  renumber,
} from './quiz';

const CLASSES: SchoolClass[] = [
  { id: 'a', name: 'IV A', order: 0 },
  { id: 'v', name: 'V A', order: 1 },
];

function lesson(partial: Partial<Lesson> & { id: string; grade: string; order: number }): Lesson {
  return { title: 'Lekcja', progress: {}, slides: [], ...partial };
}

function qq(id: string, order: number): QuizQuestion {
  return { id, text: id, order };
}

describe('quizKindLabel / quizKindTitle', () => {
  it('daje polskie etykiety', () => {
    expect(quizKindLabel('kartkowka')).toBe('kartkówka');
    expect(quizKindLabel('klasowka')).toBe('klasówka');
    expect(quizKindTitle('kartkowka')).toBe('Kartkówka');
  });
});

describe('formatQuizDate / defaultQuizTitle', () => {
  it('formatuje date dd.mm.rrrr, brak daty zostawia pusty', () => {
    expect(formatQuizDate('2026-09-07')).toBe('07.09.2026');
    expect(formatQuizDate(undefined)).toBe('');
  });

  it('buduje tytul z rodzaju, daty i tytulow lekcji', () => {
    expect(defaultQuizTitle('kartkowka', '2026-09-07')).toBe('Kartkówka 07.09.2026');
    expect(defaultQuizTitle('klasowka')).toBe('Klasówka');
    expect(defaultQuizTitle('klasowka', '2026-09-07', ['Części mowy', ' ', 'Przypadki'])).toBe(
      'Klasówka 07.09.2026 - Części mowy, Przypadki',
    );
  });
});

describe('quizQuestionFromLessonItem / ownQuizQuestion', () => {
  const src = lesson({ id: 'l', grade: 'IV', order: 0, code: '4.2' });

  it('kopiuje tresc i odpowiedz, zostawia slad do zrodla, etykiete i nadaje nowe id', () => {
    const copy = quizQuestionFromLessonItem(
      src,
      { id: 'q7', kind: 'powtorzeniowe', code: 'PZ2', text: 'Ile samogłosek?', answer: '8' },
      1,
    );
    expect(copy).toMatchObject({
      text: 'Ile samogłosek?',
      answer: '8',
      sourceQuestionId: 'q7',
      sourceLabel: '4.2 PZ2',
      order: 1,
    });
    expect(copy.id).not.toBe('q7');
  });

  it('zadanie z lekcji dostaje etykiete "kod lekcji + kod zadania" i nie ma pola answer', () => {
    const copy = quizQuestionFromLessonItem(src, { id: 'x', kind: 'zadanie', code: 'Z1', text: 't' }, 0);
    expect(copy.sourceLabel).toBe('4.2 Z1');
    expect('answer' in copy).toBe(false);
  });

  it('wlasne pytanie przycina spacje i pomija pusta odpowiedz', () => {
    const own = ownQuizQuestion('  Co to jest rym?  ', '   ', 2);
    expect(own).toMatchObject({ text: 'Co to jest rym?', order: 2 });
    expect(own.answer).toBeUndefined();
    expect(own.sourceQuestionId).toBeUndefined();
  });
});

describe('renumber / moveQuizQuestion', () => {
  it('sortuje po order i numeruje od zera bez dziur', () => {
    const out = renumber([qq('c', 7), qq('a', 1), qq('b', 4)]);
    expect(out.map((q) => [q.id, q.order])).toEqual([
      ['a', 0],
      ['b', 1],
      ['c', 2],
    ]);
  });

  it('przesuwa pytanie w gore i w dol, na krancach bez zmian', () => {
    const list = [qq('a', 0), qq('b', 1), qq('c', 2)];
    expect(moveQuizQuestion(list, 'c', 'up').map((q) => q.id)).toEqual(['a', 'c', 'b']);
    expect(moveQuizQuestion(list, 'a', 'down').map((q) => q.id)).toEqual(['b', 'a', 'c']);
    expect(moveQuizQuestion(list, 'a', 'up').map((q) => q.id)).toEqual(['a', 'b', 'c']);
    expect(moveQuizQuestion(list, 'zzz', 'up').map((q) => q.id)).toEqual(['a', 'b', 'c']);
    expect(moveQuizQuestion(list, 'c', 'up').map((q) => q.order)).toEqual([0, 1, 2]);
  });
});

describe('lessonQuestionOptions', () => {
  const sets: QuestionSet[] = [
    { id: 's1', name: 'Zestaw 1', classIds: [], createdAt: '' },
    { id: 's2', name: 'Zestaw 2', classIds: [], createdAt: '' },
    { id: 'sEmpty', name: 'Pusty', classIds: [], createdAt: '' },
  ];
  const questions: Question[] = [
    { id: 'q2', setId: 's1', text: 'drugie', order: 1 },
    { id: 'q1', setId: 's1', text: 'pierwsze', order: 0 },
    { id: 'q3', setId: 's2', text: 'piate', order: 0 },
  ];
  const lessons: Lesson[] = [
    lesson({ id: 'l2', grade: 'IV', order: 1, title: 'Druga', questionSetId: 's1' }),
    lesson({
      id: 'l1',
      grade: 'IV',
      order: 0,
      title: 'Same zadania',
      slides: [
        { id: 'sl1', kind: 'task', code: 'Z1', body: 'Podziel na sylaby' },
        { id: 'sl2', kind: 'text', body: 'nie zadanie' },
        { id: 'sl3', kind: 'task', code: 'Z2', body: 'Podkresl czasowniki' },
      ],
    }),
    lesson({ id: 'l3', grade: 'IV', order: 2, title: 'Pusty zestaw, bez zadan', questionSetId: 'sEmpty' }),
    lesson({ id: 'l4', grade: 'IV', order: 3, title: 'Zestaw usuniety', questionSetId: 'brak' }),
    lesson({ id: 'l5', grade: 'V', order: 0, title: 'Piata', questionSetId: 's2' }),
  ];

  it('bierze lekcje rocznika klasy, ktore maja zadania ALBO pytania, w kolejnosci lekcji', () => {
    const out = lessonQuestionOptions(lessons, sets, questions, 'a', CLASSES);
    expect(out.map((o) => o.lesson.id)).toEqual(['l1', 'l2']);
  });

  it('zadania biora kody ze slajdow, pytania powtorzeniowe dostaja PZ1, PZ2... wg order', () => {
    const out = lessonQuestionOptions(lessons, sets, questions, 'a', CLASSES);
    const [tasksOnly, withSet] = out;
    expect(tasksOnly.tasks.map((t) => t.code)).toEqual(['Z1', 'Z2']);
    expect(tasksOnly.review).toEqual([]);
    expect(tasksOnly.set).toBeUndefined();
    expect(withSet.set?.id).toBe('s1');
    expect(withSet.review.map((q) => [q.code, q.id])).toEqual([
      ['PZ1', 'q1'],
      ['PZ2', 'q2'],
    ]);
  });

  it('inna klasa (rocznik V) widzi swoje lekcje', () => {
    const out = lessonQuestionOptions(lessons, sets, questions, 'v', CLASSES);
    expect(out.map((o) => o.lesson.id)).toEqual(['l5']);
  });

  it('nieznana klasa - pusta lista', () => {
    expect(lessonQuestionOptions(lessons, sets, questions, 'nope', CLASSES)).toEqual([]);
  });
});
