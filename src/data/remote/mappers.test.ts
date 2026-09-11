import { describe, expect, it } from 'vitest';
import type {
  Lesson,
  LessonPeriod,
  Meeting,
  Question,
  QuestionSet,
  Quiz,
  RecapEvent,
  SchoolClass,
  Settings,
  Student,
  TimetableEntry,
} from '../types';
import {
  meetingToRow,
  quizToRow,
  rowToMeeting,
  rowToQuiz,
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
import { periodToRow, rowToPeriod, rowToTimetableEntry, timetableEntryToRow } from './timetableMappers';

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
  it('pelna lekcja ze slajdami, datami i postepem kilku klas', () => {
    const l: Lesson = {
      id: 'l1',
      grade: 'IV',
      title: 'Lekcja 1',
      code: '4.3',
      topic: 'Wstep',
      order: 0,
      progress: {
        c1: { status: 'done', doneDate: '2026-09-05' },
        c2: { status: 'in_progress' },
      },
      plannedDate: '2026-09-05',
      questionSetId: 'qs1',
      slides: [
        { id: 'sl1', kind: 'title', title: 'Tytul', subtitle: 'Podtytul' },
        { id: 'sl2', kind: 'text', body: 'Tresc' },
        { id: 'sl4', kind: 'topic', topic: 'Temat do zeszytu' },
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
      grade: 'IV',
      title: 'Lekcja 2',
      order: 1,
      progress: {},
      slides: [],
    };
    const row = lessonToRow(l);
    expect(row.topic).toBeNull();
    expect(row.planned_date).toBeNull();
    expect(row.question_set_id).toBeNull();
    expect(row.register_topic).toBeNull();
    expect(row.curriculum).toEqual([]);
    expect(rowToLesson(row)).toEqual(l);
  });

  it('progress null/undefined w wierszu daje pusty obiekt', () => {
    const row = lessonToRow({
      id: 'l3',
      grade: 'V',
      title: 'Lekcja 3',
      order: 0,
      progress: {},
      slides: [],
    });
    expect(rowToLesson({ ...row, progress: null as unknown as Record<string, never> }).progress).toEqual({});
    expect(rowToLesson({ ...row, progress: undefined as unknown as Record<string, never> }).progress).toEqual({});
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
      answerTimerSec: 30,
      plusesForFive: 3,
      plombyForOne: 3,
      reviewQuestionCount: 7,
      slideFontPercent: 110,
    };
    const row = settingsToRow(settings);
    expect(row.id).toBe('default');
    expect(row.pluses_for_five).toBe(3);
    expect(row.plomby_for_one).toBe(3);
    expect(row.review_question_count).toBe(7);
    expect(rowToSettings(row)).toEqual(settings);
  });

  it('brak review_question_count w wierszu (kolumna sprzed migracji) spada na domyslne 5', () => {
    const row = settingsToRow({
      passesPerMonth: 3,
      hintGivesMinus: true,
      wheelSpinSec: 4,
      answerTimerSec: 30,
      plusesForFive: 3,
      plombyForOne: 3,
      reviewQuestionCount: 5,
      slideFontPercent: 100,
    });
    expect(rowToSettings({ ...row, review_question_count: null }).reviewQuestionCount).toBe(5);
    expect(rowToSettings({ ...row, slide_font_percent: null }).slideFontPercent).toBe(100);
  });
});

describe('meetings', () => {
  const meeting: Meeting = {
    id: 'm1',
    title: 'Pierwsze zebranie',
    date: '2026-09-09',
    time: '17:30',
    place: 'sala 24',
    script: ['## Obiady', '', '- umowa w portierni'].join('\n'),
    order: 0,
  };

  it('mapuje zebranie tam i z powrotem', () => {
    expect(rowToMeeting(meetingToRow(meeting))).toEqual(meeting);
  });

  it('puste miejsce zapisuje jako NULL i wraca jako undefined', () => {
    const row = meetingToRow({ ...meeting, place: undefined });
    expect(row.place).toBeNull();
    expect(rowToMeeting(row).place).toBeUndefined();
  });
});

describe('quizzes', () => {
  const quiz: Quiz = {
    id: 'q1',
    classId: 'c1',
    kind: 'kartkowka',
    title: 'Kartkówka 07.09.2026',
    date: '2026-09-07',
    questions: [
      { id: 'qq1', text: 'Ile jest samogłosek?', answer: '8', sourceQuestionId: 'src1', order: 0 },
      { id: 'qq2', text: 'Podaj przykład dwuznaku.', order: 1 },
    ],
    note: 'za hałas',
    createdAt: '2026-09-07T08:00:00.000Z',
  };

  it('mapuje kartkowke tam i z powrotem', () => {
    expect(rowToQuiz(quizToRow(quiz))).toEqual(quiz);
  });

  it('brak daty i notatki zapisuje jako NULL i wraca jako undefined', () => {
    const row = quizToRow({ ...quiz, date: undefined, note: undefined });
    expect(row.date).toBeNull();
    expect(row.note).toBeNull();
    const back = rowToQuiz(row);
    expect(back.date).toBeUndefined();
    expect(back.note).toBeUndefined();
  });

  it('wiersz bez pytan (NULL z bazy) wraca z pusta lista', () => {
    const row = { ...quizToRow(quiz), questions: null as unknown as Quiz['questions'] };
    expect(rowToQuiz(row).questions).toEqual([]);
  });
});

describe('lesson periods round-trip', () => {
  it('id wiersza to numer godziny jako tekst', () => {
    const p: LessonPeriod = { no: 3, start: '9:40', end: '10:25' };
    const row = periodToRow(p);
    expect(row).toEqual({ id: '3', no: 3, start_time: '9:40', end_time: '10:25' });
    expect(rowToPeriod(row)).toEqual(p);
  });
});

describe('timetable entries round-trip', () => {
  it('z sala', () => {
    const e: TimetableEntry = { id: 't1', weekday: 1, period: 2, classId: 'c1', room: '31' };
    expect(rowToTimetableEntry(timetableEntryToRow(e))).toEqual(e);
  });
  it('bez sali (undefined <-> null)', () => {
    const e: TimetableEntry = { id: 't2', weekday: 5, period: 6, classId: 'c2' };
    const row = timetableEntryToRow(e);
    expect(row.room).toBeNull();
    expect(rowToTimetableEntry(row)).toEqual(e);
  });
  it('sam dopisek bez klasy (class_id null)', () => {
    const e: TimetableEntry = { id: 't3', weekday: 3, period: 4, note: 'Jagoda ma lekcję' };
    const row = timetableEntryToRow(e);
    expect(row.class_id).toBeNull();
    expect(row.note).toBe('Jagoda ma lekcję');
    expect(rowToTimetableEntry(row)).toEqual(e);
  });
});
