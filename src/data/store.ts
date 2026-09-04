// Jeden store zustand (persist -> localStorage, klucz "apka-szkolna").
// Komponenty korzystaja WYLACZNIE z tego hooka - dzieki temu warstwa danych
// da sie pozniej podmienic na Supabase bez ruszania UI.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { newId } from './id';
import { buildSeedData } from './seed';
import type {
  Lesson,
  Question,
  QuestionSet,
  RecapEvent,
  SchoolClass,
  Settings,
  Student,
} from './types';

export const STORAGE_KEY = 'apka-szkolna';

interface AppState {
  classes: SchoolClass[];
  students: Student[];
  questionSets: QuestionSet[];
  questions: Question[];
  lessons: Lesson[];
  recapEvents: RecapEvent[];
  settings: Settings;

  // Klasy
  addClass: (name: string) => SchoolClass;
  updateClass: (id: string, patch: Partial<Omit<SchoolClass, 'id'>>) => void;
  removeClass: (id: string) => void;

  // Uczniowie
  addStudent: (student: Omit<Student, 'id'>) => Student;
  updateStudent: (id: string, patch: Partial<Omit<Student, 'id'>>) => void;
  removeStudent: (id: string) => void;
  setActive: (id: string, active: boolean) => void;

  // Zestawy pytan
  addQuestionSet: (set: Omit<QuestionSet, 'id' | 'createdAt'>) => QuestionSet;
  updateQuestionSet: (id: string, patch: Partial<Omit<QuestionSet, 'id'>>) => void;
  removeQuestionSet: (id: string) => void;

  // Pytania
  addQuestion: (question: Omit<Question, 'id' | 'order'>) => Question;
  updateQuestion: (id: string, patch: Partial<Omit<Question, 'id'>>) => void;
  removeQuestion: (id: string) => void;
  reorderQuestion: (id: string, direction: 'up' | 'down') => void;

  // Lekcje
  addLesson: (lesson: Omit<Lesson, 'id' | 'order'>) => Lesson;
  updateLesson: (id: string, patch: Partial<Omit<Lesson, 'id'>>) => void;
  removeLesson: (id: string) => void;
  reorderLesson: (id: string, direction: 'up' | 'down') => void;

  // Zdarzenia recapu
  addRecapEvent: (event: Omit<RecapEvent, 'id' | 'at'>) => RecapEvent;
  removeRecapEvent: (id: string) => void;

  // Ustawienia
  updateSettings: (patch: Partial<Settings>) => void;

  // Reset / import calego stanu
  replaceAll: (data: Pick<AppState, 'classes' | 'students' | 'questionSets' | 'questions' | 'lessons' | 'recapEvents' | 'settings'>) => void;
  resetToSeed: () => void;
}

function reorderList<T extends { id: string; order: number }>(
  list: T[],
  id: string,
  direction: 'up' | 'down',
): T[] {
  const sorted = [...list].sort((a, b) => a.order - b.order);
  const idx = sorted.findIndex((item) => item.id === id);
  if (idx === -1) return list;
  const swapWith = direction === 'up' ? idx - 1 : idx + 1;
  if (swapWith < 0 || swapWith >= sorted.length) return list;

  const a = sorted[idx];
  const b = sorted[swapWith];

  return list.map((item) => {
    if (item.id === a.id) return { ...item, order: b.order };
    if (item.id === b.id) return { ...item, order: a.order };
    return item;
  });
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      classes: [],
      students: [],
      questionSets: [],
      questions: [],
      lessons: [],
      recapEvents: [],
      settings: {
        passesPerMonth: 3,
        hintGivesMinus: true,
        wheelSpinSec: 4,
        plusesForFive: 3,
        plombyForOne: 3,
      },

      addClass: (name) => {
        const order = get().classes.length;
        const item: SchoolClass = { id: newId(), name, order };
        set((s) => ({ classes: [...s.classes, item] }));
        return item;
      },
      updateClass: (id, patch) => {
        set((s) => ({
          classes: s.classes.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        }));
      },
      removeClass: (id) => {
        // Kasujemy kaskadowo, zeby nie zostawiac osieroconych odwolan (klucze obce w bazie).
        set((s) => ({
          classes: s.classes.filter((c) => c.id !== id),
          students: s.students.filter((st) => st.classId !== id),
          lessons: s.lessons.filter((l) => l.classId !== id),
          recapEvents: s.recapEvents.filter((e) => e.classId !== id),
          questionSets: s.questionSets.map((qs) => ({ ...qs, classIds: qs.classIds.filter((c) => c !== id) })),
        }));
      },

      addStudent: (student) => {
        const item: Student = { ...student, id: newId() };
        set((s) => ({ students: [...s.students, item] }));
        return item;
      },
      updateStudent: (id, patch) => {
        set((s) => ({
          students: s.students.map((st) => (st.id === id ? { ...st, ...patch } : st)),
        }));
      },
      removeStudent: (id) => {
        set((s) => ({
          students: s.students.filter((st) => st.id !== id),
          recapEvents: s.recapEvents.filter((e) => e.studentId !== id),
        }));
      },
      setActive: (id, active) => {
        set((s) => ({
          students: s.students.map((st) => (st.id === id ? { ...st, active } : st)),
        }));
      },

      addQuestionSet: (set_) => {
        const item: QuestionSet = { ...set_, id: newId(), createdAt: new Date().toISOString() };
        set((s) => ({ questionSets: [...s.questionSets, item] }));
        return item;
      },
      updateQuestionSet: (id, patch) => {
        set((s) => ({
          questionSets: s.questionSets.map((qs) => (qs.id === id ? { ...qs, ...patch } : qs)),
        }));
      },
      removeQuestionSet: (id) => {
        set((s) => ({
          questionSets: s.questionSets.filter((qs) => qs.id !== id),
          questions: s.questions.filter((q) => q.setId !== id),
          lessons: s.lessons.map((l) => (l.questionSetId === id ? { ...l, questionSetId: undefined } : l)),
        }));
      },

      addQuestion: (question) => {
        const existing = get().questions.filter((q) => q.setId === question.setId);
        const order = existing.length;
        const item: Question = { ...question, id: newId(), order };
        set((s) => ({ questions: [...s.questions, item] }));
        return item;
      },
      updateQuestion: (id, patch) => {
        set((s) => ({
          questions: s.questions.map((q) => (q.id === id ? { ...q, ...patch } : q)),
        }));
      },
      removeQuestion: (id) => {
        set((s) => ({ questions: s.questions.filter((q) => q.id !== id) }));
      },
      reorderQuestion: (id, direction) => {
        set((s) => ({ questions: reorderList(s.questions, id, direction) }));
      },

      addLesson: (lesson) => {
        const existing = get().lessons.filter((l) => l.classId === lesson.classId);
        const order = existing.length;
        const item: Lesson = { ...lesson, id: newId(), order };
        set((s) => ({ lessons: [...s.lessons, item] }));
        return item;
      },
      updateLesson: (id, patch) => {
        set((s) => ({
          lessons: s.lessons.map((l) => (l.id === id ? { ...l, ...patch } : l)),
        }));
      },
      removeLesson: (id) => {
        set((s) => ({ lessons: s.lessons.filter((l) => l.id !== id) }));
      },
      reorderLesson: (id, direction) => {
        set((s) => ({ lessons: reorderList(s.lessons, id, direction) }));
      },

      addRecapEvent: (event) => {
        const item: RecapEvent = { ...event, id: newId(), at: new Date().toISOString() };
        set((s) => ({ recapEvents: [...s.recapEvents, item] }));
        return item;
      },
      removeRecapEvent: (id) => {
        set((s) => ({ recapEvents: s.recapEvents.filter((e) => e.id !== id) }));
      },

      updateSettings: (patch) => {
        set((s) => ({ settings: { ...s.settings, ...patch } }));
      },

      replaceAll: (data) => {
        set(() => ({ ...data }));
      },
      resetToSeed: () => {
        const seed = buildSeedData();
        set(() => ({
          classes: seed.classes,
          students: seed.students,
          questionSets: seed.questionSets,
          questions: seed.questions,
          lessons: [],
          recapEvents: [],
          settings: seed.settings,
        }));
      },
    }),
    {
      name: STORAGE_KEY,
      version: 3,
      // v1 -> v2: nazewnictwo "minus" -> "plomba" (zasady kola, zeby nie budzic
      // negatywnych skojarzen u dzieci) oraz nowe pola ustawien pod przeliczanie
      // plusow/plomb na oceny.
      // v2 -> v3: pasy przechodza z limitu tygodniowego (passesPerWeek) na
      // miesieczny (passesPerMonth, nowa domyslna wartosc 3). Jesli nauczyciel
      // mial dawna wartosc domyslna (2, nieruszana recznie) - dostaje nowa
      // domyslna (3). Jesli mial cokolwiek innego (zmienione recznie) - ta sama
      // liczba zostaje, tylko pod nowym polem/znaczeniem (miesiac zamiast tygodnia).
      migrate: (persistedState, version) => {
        const state = persistedState as {
          recapEvents?: Array<{ result?: string; [key: string]: unknown }>;
          settings?: (Partial<Settings> & { passesPerWeek?: number }) | undefined;
          [key: string]: unknown;
        };
        if (version < 2) {
          if (Array.isArray(state.recapEvents)) {
            state.recapEvents = state.recapEvents.map((e) => {
              if (e.result === 'minus') return { ...e, result: 'plomba' };
              if (e.result === 'hint_minus') return { ...e, result: 'hint_plomba' };
              return e;
            });
          }
          state.settings = {
            passesPerWeek: 2,
            hintGivesMinus: true,
            wheelSpinSec: 4,
            plusesForFive: 3,
            plombyForOne: 3,
            ...state.settings,
          };
        }
        if (version < 3) {
          const oldSettings = state.settings ?? {};
          const oldPassesPerWeek = oldSettings.passesPerWeek;
          const passesPerMonth = oldPassesPerWeek === undefined || oldPassesPerWeek === 2 ? 3 : oldPassesPerWeek;
          state.settings = {
            hintGivesMinus: oldSettings.hintGivesMinus ?? true,
            wheelSpinSec: oldSettings.wheelSpinSec ?? 4,
            plusesForFive: oldSettings.plusesForFive ?? 3,
            plombyForOne: oldSettings.plombyForOne ?? 3,
            passesPerMonth,
          };
        }
        return state as unknown as AppState;
      },
      onRehydrateStorage: () => (state) => {
        // Jesli po hydratacji store jest calkowicie pusty (pierwsze uruchomienie),
        // zaladuj dane startowe.
        if (state && state.classes.length === 0 && state.students.length === 0) {
          state.resetToSeed();
        }
      },
    },
  ),
);
