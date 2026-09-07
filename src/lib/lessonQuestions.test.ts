import { describe, expect, it } from 'vitest';
import type { Lesson, Question } from '../data/types';
import { lessonQuestionLabel, lessonReviewQuestions, lessonTasks } from './lessonQuestions';

function lesson(partial: Partial<Lesson> & { id: string }): Lesson {
  return { grade: 'IV', order: 0, title: 'Lekcja', progress: {}, slides: [], ...partial };
}

describe('lessonTasks', () => {
  it('bierze tylko slajdy zadan, w kolejnosci slajdow, z kodem ze slajdu', () => {
    const out = lessonTasks(
      lesson({
        id: 'l',
        slides: [
          { id: 't1', kind: 'title', title: 'Powtórka' },
          { id: 's2', kind: 'task', code: 'Z1', title: 'Sylaby', body: 'Podziel na sylaby' },
          { id: 's3', kind: 'text', body: 'reguła' },
          { id: 's4', kind: 'task', code: 'Z2', body: 'Podkreśl czasowniki' },
        ],
      }),
    );
    expect(out.map((t) => [t.code, t.text, t.title])).toEqual([
      ['Z1', 'Podziel na sylaby', 'Sylaby'],
      ['Z2', 'Podkreśl czasowniki', undefined],
    ]);
    expect(out.every((t) => t.kind === 'zadanie')).toBe(true);
  });

  it('zadanie bez polecenia zostaje przy tytule, a bez kodu dostaje kolejny numer', () => {
    const out = lessonTasks(
      lesson({ id: 'l', slides: [{ id: 's1', kind: 'task', code: '  ', title: 'Rozgrzewka', body: '' }] }),
    );
    expect(out).toEqual([{ id: 's1', kind: 'zadanie', code: 'Z1', text: 'Rozgrzewka', title: 'Rozgrzewka' }]);
  });
});

describe('lessonReviewQuestions', () => {
  const questions: Question[] = [
    { id: 'q2', setId: 's1', text: 'drugie', order: 1 },
    { id: 'q1', setId: 's1', text: 'pierwsze', answer: 'odp', order: 0 },
    { id: 'qx', setId: 'inny', text: 'obce', order: 0 },
  ];

  it('numeruje pytania zestawu jako PZ1, PZ2... wg order', () => {
    const out = lessonReviewQuestions(lesson({ id: 'l', questionSetId: 's1' }), questions);
    expect(out.map((q) => [q.code, q.id])).toEqual([
      ['PZ1', 'q1'],
      ['PZ2', 'q2'],
    ]);
    expect(out[0].answer).toBe('odp');
    expect('answer' in out[1]).toBe(false);
  });

  it('lekcja bez zestawu nie ma pytan powtorzeniowych', () => {
    expect(lessonReviewQuestions(lesson({ id: 'l' }), questions)).toEqual([]);
  });
});

describe('lessonQuestionLabel', () => {
  it('sklada kod lekcji z kodem pytania, a bez kodu lekcji zostawia sam kod pytania', () => {
    const item = { id: 'x', kind: 'zadanie' as const, code: 'Z3', text: 't' };
    expect(lessonQuestionLabel(lesson({ id: 'l', code: '4.2' }), item)).toBe('4.2 Z3');
    expect(lessonQuestionLabel(lesson({ id: 'l' }), item)).toBe('Z3');
  });
});
