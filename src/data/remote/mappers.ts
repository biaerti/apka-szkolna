// Mapowanie encji aplikacji (camelCase) <-> wierszy Supabase (snake_case).
// Schemat bazy: supabase/migrations/0001_init.sql (kontrakt, nie zmieniac).
// Kolumny "updated_at" sa zarzadzane przez baze (trigger) i nie sa czescia
// encji aplikacji, wiec nie sa tu mapowane.

import type { Lesson, Question, QuestionSet, RecapEvent, SchoolClass, Settings, Slide, Student } from '../types';

// --- classes ---------------------------------------------------------------

export interface ClassRow {
  id: string;
  name: string;
  order: number;
}

export function classToRow(c: SchoolClass): ClassRow {
  return { id: c.id, name: c.name, order: c.order };
}

export function rowToClass(row: ClassRow): SchoolClass {
  return { id: row.id, name: row.name, order: row.order };
}

// --- students ----------------------------------------------------------------

export interface StudentRow {
  id: string;
  class_id: string;
  first_name: string;
  last_name: string;
  number: number;
  note: string | null;
  active: boolean;
}

export function studentToRow(s: Student): StudentRow {
  return {
    id: s.id,
    class_id: s.classId,
    first_name: s.firstName,
    last_name: s.lastName,
    number: s.number,
    note: s.note ?? null,
    active: s.active,
  };
}

export function rowToStudent(row: StudentRow): Student {
  return {
    id: row.id,
    classId: row.class_id,
    firstName: row.first_name,
    lastName: row.last_name,
    number: row.number,
    note: row.note ?? undefined,
    active: row.active,
  };
}

// --- question_sets ----------------------------------------------------------

export interface QuestionSetRow {
  id: string;
  name: string;
  topic: string | null;
  class_ids: string[];
  created_at: string;
}

export function questionSetToRow(qs: QuestionSet): QuestionSetRow {
  return {
    id: qs.id,
    name: qs.name,
    topic: qs.topic ?? null,
    class_ids: qs.classIds,
    created_at: qs.createdAt,
  };
}

export function rowToQuestionSet(row: QuestionSetRow): QuestionSet {
  return {
    id: row.id,
    name: row.name,
    topic: row.topic ?? undefined,
    classIds: row.class_ids ?? [],
    createdAt: row.created_at,
  };
}

// --- questions ----------------------------------------------------------------

export interface QuestionRow {
  id: string;
  set_id: string;
  text: string;
  answer: string | null;
  order: number;
}

export function questionToRow(q: Question): QuestionRow {
  return {
    id: q.id,
    set_id: q.setId,
    text: q.text,
    answer: q.answer ?? null,
    order: q.order,
  };
}

export function rowToQuestion(row: QuestionRow): Question {
  return {
    id: row.id,
    setId: row.set_id,
    text: row.text,
    answer: row.answer ?? undefined,
    order: row.order,
  };
}

// --- lessons --------------------------------------------------------------

export interface LessonRow {
  id: string;
  class_id: string;
  title: string;
  topic: string | null;
  order: number;
  status: Lesson['status'];
  planned_date: string | null;
  done_date: string | null;
  question_set_id: string | null;
  slides: Slide[];
  register_topic: string | null;
  curriculum: string[];
}

export function lessonToRow(l: Lesson): LessonRow {
  return {
    id: l.id,
    class_id: l.classId,
    title: l.title,
    topic: l.topic ?? null,
    order: l.order,
    status: l.status,
    planned_date: l.plannedDate ?? null,
    done_date: l.doneDate ?? null,
    question_set_id: l.questionSetId ?? null,
    slides: l.slides,
    register_topic: l.registerTopic ?? null,
    curriculum: l.curriculum ?? [],
  };
}

export function rowToLesson(row: LessonRow): Lesson {
  return {
    id: row.id,
    classId: row.class_id,
    title: row.title,
    topic: row.topic ?? undefined,
    order: row.order,
    status: row.status,
    plannedDate: row.planned_date ?? undefined,
    doneDate: row.done_date ?? undefined,
    questionSetId: row.question_set_id ?? undefined,
    slides: row.slides ?? [],
    registerTopic: row.register_topic ?? undefined,
    curriculum: row.curriculum && row.curriculum.length > 0 ? row.curriculum : undefined,
  };
}

// --- recap_events -----------------------------------------------------------

export interface RecapEventRow {
  id: string;
  student_id: string;
  class_id: string;
  question_set_id: string | null;
  question_id: string | null;
  result: RecapEvent['result'];
  note: string | null;
  at: string;
}

export function recapEventToRow(e: RecapEvent): RecapEventRow {
  return {
    id: e.id,
    student_id: e.studentId,
    class_id: e.classId,
    question_set_id: e.questionSetId ?? null,
    question_id: e.questionId ?? null,
    result: e.result,
    note: e.note ?? null,
    at: e.at,
  };
}

export function rowToRecapEvent(row: RecapEventRow): RecapEvent {
  return {
    id: row.id,
    studentId: row.student_id,
    classId: row.class_id,
    questionSetId: row.question_set_id ?? undefined,
    questionId: row.question_id ?? undefined,
    result: row.result,
    note: row.note ?? undefined,
    at: row.at,
  };
}

// --- settings (jeden wiersz, id = 'default') --------------------------------

export const SETTINGS_ROW_ID = 'default';

export interface SettingsRow {
  id: string;
  passes_per_month: number;
  hint_gives_minus: boolean;
  wheel_spin_sec: number;
  pluses_for_five: number;
  plomby_for_one: number;
}

export function settingsToRow(s: Settings): SettingsRow {
  return {
    id: SETTINGS_ROW_ID,
    passes_per_month: s.passesPerMonth,
    hint_gives_minus: s.hintGivesMinus,
    wheel_spin_sec: s.wheelSpinSec,
    pluses_for_five: s.plusesForFive,
    plomby_for_one: s.plombyForOne,
  };
}

export function rowToSettings(row: SettingsRow): Settings {
  return {
    passesPerMonth: row.passes_per_month,
    hintGivesMinus: row.hint_gives_minus,
    wheelSpinSec: row.wheel_spin_sec,
    plusesForFive: row.pluses_for_five,
    plombyForOne: row.plomby_for_one,
  };
}
