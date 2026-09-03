// Definicje typow danych aplikacji - zgodnie z docs/SPEC.md

export type ID = string;

export interface SchoolClass {
  id: ID;
  name: string; // np. "IV A"
  order: number;
}

export interface Student {
  id: ID;
  classId: ID;
  firstName: string;
  lastName: string;
  number: number;
  note?: string; // np. "orzeczenie"
  active: boolean; // false = usuniety/przeniesiony, nie kasujemy historii
}

// Zdarzenie na recapie - jedyne zrodlo prawdy dla statystyk
export type RecapResult = 'plus' | 'minus' | 'pass' | 'hint_minus';

export interface RecapEvent {
  id: ID;
  studentId: ID;
  classId: ID;
  questionSetId?: ID;
  questionId?: ID;
  result: RecapResult;
  at: string; // ISO
}

export interface QuestionSet {
  id: ID;
  name: string;
  topic?: string;
  classIds: ID[];
  createdAt: string;
}

export interface Question {
  id: ID;
  setId: ID;
  text: string;
  answer?: string;
  order: number;
}

// Lekcje = moduly tematyczne, niekoniecznie 1 lekcja = 45 min
export interface Lesson {
  id: ID;
  classId: ID;
  title: string;
  topic?: string;
  order: number;
  status: 'planned' | 'in_progress' | 'done' | 'skipped';
  plannedDate?: string;
  doneDate?: string;
  questionSetId?: ID; // recap na start (opcjonalny)
  slides: Slide[];
  // Pod dziennik elektroniczny (Vulcan): temat do wpisania i kody podstawy programowej (np. II.1.1).
  registerTopic?: string;
  curriculum?: string[];
}

export type Slide =
  | { id: ID; kind: 'title'; title: string; subtitle?: string }
  | { id: ID; kind: 'text'; title?: string; body: string } // markdown-lite: akapity, listy
  | {
      id: ID;
      kind: 'task';
      code: string;
      title?: string;
      body: string;
      page?: number;
      exerciseNo?: string;
      timerSec?: number;
    }
  | { id: ID; kind: 'recap'; questionSetId: ID } // slajd uruchamia kolo fortuny
  | { id: ID; kind: 'image'; url: string; caption?: string };

export interface Settings {
  passesPerWeek: number; // domyslnie 2
  hintGivesMinus: boolean; // domyslnie true
  wheelSpinSec: number; // domyslnie 4
}
