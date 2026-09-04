import { describe, expect, it } from 'vitest';
import type { Lesson, Question, QuestionSet, RecapEvent, SchoolClass, Settings, Student } from '../types';
import {
  classToRow,
  lessonToRow,
  questionSetToRow,
  questionToRow,
  recapEventToRow,
  rowToClass,
  rowToLesson,
  rowToQuestion,
  rowToQuestionSet,
  rowToRecapEvent,
  rowToSettings,
  rowToStudent,
  settingsToRow,
  studentToRow,
} from './mappers';

describe('classes round-trip', () => {
  it('encja -> wiersz -> encja', () => {
    const c: SchoolClass = { id: 'c1', name: 'IV A', order: 2 };
    expect(rowToClass(classToRow(c))).toEqual(c);
  });
});

describe('students round-trip', () => {
  it('z opcjonalnym note', () => {
    const s: Student = {
      id: 's1',
      classId: 'c1',
      firstName: 'Jan',
      lastName: 'Kowalski',
      number: 3,
      note: 'orzeczenie',
      active: true,
    };
    expect(rowToStudent(studentToRow(s))).toEqual(s);
  });

  it('bez note (undefined <-> null)', () => {
    const s: Student = { id: 's2', classId: 'c1', firstName: 'Ala', lastName: 'Nowak', number: 1, active: false };
    const row = studentToRow(s);
    expect(row.note).toBeNull();
    expect(rowToStudent(row)).toEqual(s);
  });
});

describe('question sets round-trip', () => {
  it('z topic i classIds', () => {
    const qs: QuestionSet = {
      id: 'qs1',
      name: 'Zestaw 1',
      topic: 'Ortografia',
      classIds: ['c1', 'c2'],
      createdAt: '2026-09-01T10:00:00.000Z',
    };
    expect(rowToQuestionSet(questionSetToRow(qs))).toEqual(qs);
  });

  it('bez topic, pusta lista klas', () => {
    const qs: QuestionSet = { id: 'qs2', name: 'Zestaw 2', classIds: [], createdAt: '2026-09-01T10:00:00.000Z' };
    expect(rowToQuestionSet(questionSetToRow(qs))).toEqual(qs);
  });
});

describe('questions round-trip', () => {
  it('z odpowiedzia', () => {
    const q: Question = { id: 'q1', setId: 'qs1', text: 'Pytanie?', answer: 'Odpowiedz', order: 0 };
    expect(rowToQuestion(questionToRow(q))).toEqual(q);
  });

  it('bez odpowiedzi', () => {
    const q: Question = { id: 'q2', setId: 'qs1', text: 'Pytanie?', order: 1 };
    expect(rowToQuestion(questionToRow(q))).toEqual(q);
  });
});

describe('lessons round-trip', () => {
  it('pelna lekcja ze slajdami i datami', () => {
    const l: Lesson = {
      id: 'l1',
      classId: 'c1',
      title: 'Lekcja 1',
      topic: 'Wstep',
      order: 0,
      status: 'planned',
      plannedDate: '2026-09-05',
      doneDate: undefined,
      questionSetId: 'qs1',
      slides: [
        { id: 'sl1', kind: 'title', title: 'Tytul', subtitle: 'Podtytul' },
        { id: 'sl2', kind: 'text', body: 'Tresc' },
        { id: 'sl3', kind: 'recap', questionSetId: 'qs1' },
      ],
      registerTopic: 'Temat do dziennika',
      curriculum: ['II.1.1', 'II.4.1'],
    };
    expect(rowToLesson(lessonToRow(l))).toEqual(l);
  });

  it('lekcja minimalna, bez opcjonalnych pol', () => {
    const l: Lesson = {
      id: 'l2',
      classId: 'c1',
      title: 'Lekcja 2',
      order: 1,
      status: 'done',
      slides: [],
    };
    const row = lessonToRow(l);
    expect(row.topic).toBeNull();
    expect(row.planned_date).toBeNull();
    expect(row.done_date).toBeNull();
    expect(row.question_set_id).toBeNull();
    expect(row.register_topic).toBeNull();
    expect(row.curriculum).toEqual([]);
    expect(rowToLesson(row)).toEqual(l);
  });
});

describe('recap events round-trip', () => {
  it('z opcjonalnymi polami (w tym note)', () => {
    const e: RecapEvent = {
      id: 'e1',
      studentId: 's1',
      classId: 'c1',
      questionSetId: 'qs1',
      questionId: 'q1',
      result: 'plus',
      note: 'adnotacja nauczyciela',
      at: '2026-09-01T12:00:00.000Z',
    };
    expect(rowToRecapEvent(recapEventToRow(e))).toEqual(e);
  });

  it('bez questionSetId/questionId/note (undefined <-> null)', () => {
    const e: RecapEvent = {
      id: 'e2',
      studentId: 's1',
      classId: 'c1',
      result: 'hint_plomba',
      at: '2026-09-01T12:00:00.000Z',
    };
    const row = recapEventToRow(e);
    expect(row.note).toBeNull();
    expect(rowToRecapEvent(row)).toEqual(e);
  });

  it('nowe wyniki (kropka, uwaga, rozliczenie, jedynka, piatka) przechodza bez zmian', () => {
    const results: RecapEvent['result'][] = ['kropka', 'uwaga', 'rozliczenie', 'jedynka', 'piatka'];
    for (const result of results) {
      const e: RecapEvent = { id: `e-${result}`, studentId: 's1', classId: 'c1', result, at: '2026-09-01T12:00:00.000Z' };
      expect(rowToRecapEvent(recapEventToRow(e))).toEqual(e);
    }
  });
});

describe('settings round-trip', () => {
  it('encja -> wiersz -> encja', () => {
    const settings: Settings = {
      passesPerMonth: 3,
      hintGivesMinus: true,
      wheelSpinSec: 4,
      plusesForFive: 3,
      plombyForOne: 3,
    };
    const row = settingsToRow(settings);
    expect(row.id).toBe('default');
    expect(row.pluses_for_five).toBe(3);
    expect(row.plomby_for_one).toBe(3);
    expect(rowToSettings(row)).toEqual(settings);
  });
});
