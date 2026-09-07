// Jeden store zustand (persist -> localStorage, klucz "apka-szkolna").
// Komponenty korzystaja WYLACZNIE z tego hooka - dzieki temu warstwa danych
// da sie pozniej podmienic na Supabase bez ruszania UI.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { newId } from './id';
import { buildSeedData } from './seed';
import { buildSeedMeetings } from './meetings';
import { DEFAULT_PERIODS, buildSeedTimetable } from './timetableSeed';
import { classGrade } from '../lib/grade';
import { nextLessonCode } from '../lib/lessonCode';
import { titleMatchKey } from '../lib/titleMatchKey';
import { timetableCellId } from '../lib/timetable';
import { monthKey as recapMonthKey } from '../lib/week';
import type {
  Lesson,
  LessonPeriod,
  LessonProgress,
  Meeting,
  Question,
  QuestionSet,
  Quiz,
  RecapEvent,
  SchoolClass,
  Settings,
  Student,
  TimetableEntry,
} from './types';

export const STORAGE_KEY = 'apka-szkolna';

/**
 * Lekcje zapisane wprost z LessonEditor (patrz updateLessonFromEditor),
 * kluczowane id lekcji - flaga "nauczyciel edytowal ta lekcje recznie".
 * Sluzy refreshMaterials.ts (classifyMatch) do odroznienia "kod ma nowsza
 * wersje" od "nauczyciel edytowal lekcje recznie", zeby "Odswiez wstawione
 * materialy" nie nadpisywalo cicho recznych zmian. Ustawiana WYLACZNIE przez
 * updateLessonFromEditor (a nie zwykle updateLesson, ktorego uzywa refresh i
 * wstawianie gotowych materialow) i czyszczona przy kazdym odswiezeniu danej
 * lekcji (patrz clearManualEdit w useReadyMaterials.refresh). Typ trzymany
 * lokalnie (nie w types.ts), bo to szczegol implementacyjny odswiezania
 * gotowych materialow, a nie ksztalt danych domenowych.
 */
type ManuallyEditedLessonIds = Record<string, true>;

interface AppState {
  classes: SchoolClass[];
  students: Student[];
  questionSets: QuestionSet[];
  questions: Question[];
  lessons: Lesson[];
  recapEvents: RecapEvent[];
  meetings: Meeting[];
  quizzes: Quiz[];
  periods: LessonPeriod[];
  timetable: TimetableEntry[];
  settings: Settings;
  manuallyEditedLessonIds: ManuallyEditedLessonIds;

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

  // Lekcje (naleza do rocznika; postep per klasa w `progress`)
  addLesson: (lesson: Omit<Lesson, 'id' | 'order'>) => Lesson;
  updateLesson: (id: string, patch: Partial<Omit<Lesson, 'id'>>) => void;
  /**
   * Jak `updateLesson`, ale oznacza lekcje jako "edytowana recznie" - uzywane
   * WYLACZNIE przez LessonEditor (zapis z ekranu edycji lekcji). Refresh i
   * wstawianie gotowych materialow musza uzywac zwyklego `updateLesson`, zeby
   * nie ustawiac tej flagi samym sobie - patrz ManuallyEditedLessonIds.
   */
  updateLessonFromEditor: (id: string, patch: Partial<Omit<Lesson, 'id'>>) => void;
  /** Czysci flage "edytowana recznie" - wywolywane przy odswiezeniu danej lekcji z gotowych materialow. */
  clearManualEdit: (id: string) => void;
  removeLesson: (id: string) => void;
  /** Przenosi lekcje na pozycje `toIndex` w kolejce jej rocznika (przeciaganie). */
  moveLesson: (id: string, toIndex: number) => void;
  reorderLesson: (id: string, direction: 'up' | 'down') => void;
  /** Ustawia postep jednej klasy w lekcji (status + data wykonania). */
  setLessonProgress: (lessonId: string, classId: string, progress: LessonProgress) => void;

  // Zdarzenia recapu
  addRecapEvent: (event: Omit<RecapEvent, 'id' | 'at'>) => RecapEvent;
  removeRecapEvent: (id: string) => void;
  /**
   * "Wyzeruj bilans": kasuje zdarzenia recapu (plusy, kropki, plomby, pasy, uwagi)
   * calej klasy - albo jednego ucznia, gdy podano `studentId` - zapisane w danym
   * miesiacu ("RRRR-MM"). Tylko biezacy miesiac, bo bilans i tak liczy sie
   * miesiacami (patrz src/lib/recap.ts) - poprzednie miesiace zostaja nietkniete.
   */
  resetBalance: (classId: string, month: string, studentId?: string) => void;

  // Zebrania z rodzicami
  addMeeting: (meeting: Omit<Meeting, 'id' | 'order'>) => Meeting;
  updateMeeting: (id: string, patch: Partial<Omit<Meeting, 'id'>>) => void;
  removeMeeting: (id: string) => void;

  // Kartkowki i klasowki (per klasa; pytania to kopie tresci - patrz types.ts)
  addQuiz: (quiz: Omit<Quiz, 'id' | 'createdAt'>) => Quiz;
  updateQuiz: (id: string, patch: Partial<Omit<Quiz, 'id'>>) => void;
  removeQuiz: (id: string) => void;

  // Plan lekcji (dzwonki + tygodniowa siatka; patrz types.ts)
  /** Zamienia cala liste godzin lekcyjnych (zapisywana posortowana po `no`). */
  setPeriods: (list: LessonPeriod[]) => void;
  /** Upsert komorki planu po (weekday, period); pusty classId = usuniecie komorki. */
  setTimetableEntry: (entry: Omit<TimetableEntry, 'id'>) => void;
  removeTimetableEntry: (id: string) => void;

  // Ustawienia
  updateSettings: (patch: Partial<Settings>) => void;

  // Reset / import calego stanu
  replaceAll: (
    data: Pick<
      AppState,
      | 'classes'
      | 'students'
      | 'questionSets'
      | 'questions'
      | 'lessons'
      | 'recapEvents'
      | 'meetings'
      | 'quizzes'
      | 'periods'
      | 'timetable'
      | 'settings'
    >,
  ) => void;
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

/** Przenosi lekcje `id` na pozycje `toIndex` w obrebie jej rocznika; reszta listy bez zmian. */
export function moveLessonInGrade(lessons: Lesson[], id: string, toIndex: number): Lesson[] {
  const lesson = lessons.find((l) => l.id === id);
  if (!lesson) return lessons;
  const gradeLessons = lessons.filter((l) => l.grade === lesson.grade).sort((a, b) => a.order - b.order);
  const from = gradeLessons.findIndex((l) => l.id === id);
  const to = Math.max(0, Math.min(gradeLessons.length - 1, toIndex));
  if (from === -1 || from === to) return lessons;
  const reordered = [...gradeLessons];
  const [moved] = reordered.splice(from, 1);
  reordered.splice(to, 0, moved);
  const orderById = new Map(reordered.map((l, idx) => [l.id, idx]));
  return lessons.map((l) => {
    const order = orderById.get(l.id);
    return order === undefined || order === l.order ? l : { ...l, order };
  });
}

/** Usuwa postep klasy z lekcji; lekcje rocznika znikaja tylko, gdy to byla jego ostatnia klasa. */
export function removeClassFromLessons(lessons: Lesson[], classes: SchoolClass[], classId: string): Lesson[] {
  const removed = classes.find((c) => c.id === classId);
  if (!removed) return lessons;
  const grade = classGrade(removed.name);
  const gradeStillHasClasses = classes.some((c) => c.id !== classId && classGrade(c.name) === grade);
  return lessons
    .filter((l) => gradeStillHasClasses || l.grade !== grade)
    .map((l) => {
      if (!(classId in l.progress)) return l;
      const progress = { ...l.progress };
      delete progress[classId];
      return { ...l, progress };
    });
}

/**
 * Zdarzenia recapu, ktore znikaja przy "Wyzeruj bilans": cala klasa (lub jeden
 * uczen, gdy podano `studentId`) w danym miesiacu ("RRRR-MM"). Wydzielona jako
 * czysta funkcja, zeby dalo sie ja przetestowac bez dotykania store'u/localStorage.
 */
export function recapEventsForReset(
  events: RecapEvent[],
  classId: string,
  month: string,
  studentId?: string,
): RecapEvent[] {
  return events.filter(
    (e) =>
      e.classId === classId &&
      (studentId === undefined || e.studentId === studentId) &&
      recapMonthKey(new Date(e.at)) === month,
  );
}

interface LegacyLesson {
  id: string;
  classId?: string;
  grade?: string;
  title: string;
  order: number;
  status?: LessonProgress['status'];
  doneDate?: string;
  progress?: Record<string, LessonProgress>;
  [key: string]: unknown;
}

/** Migracja store v3 -> v4 (eksportowana do testow). */
export function migrateLessonsToGrades(raw: Array<Record<string, unknown>>, classes: SchoolClass[]): Lesson[] {
  const byKey = new Map<string, Lesson>();
  const out: Lesson[] = [];
  const sorted = [...(raw as LegacyLesson[])].sort((a, b) => a.order - b.order);
  for (const old of sorted) {
    const cls = old.classId ? classes.find((c) => c.id === old.classId) : undefined;
    const grade = old.grade ?? (cls ? classGrade(cls.name) : 'IV');
    const progress: Record<string, LessonProgress> = { ...(old.progress ?? {}) };
    if (old.classId && old.status) {
      progress[old.classId] = old.doneDate ? { status: old.status, doneDate: old.doneDate } : { status: old.status };
    }
    const rest: Record<string, unknown> = { ...old };
    delete rest.classId;
    delete rest.status;
    delete rest.doneDate;
    const key = `${grade}|${titleMatchKey(old.title)}`;
    const existing = byKey.get(key);
    if (existing) {
      existing.progress = { ...existing.progress, ...progress };
      continue;
    }
    const lesson = { ...rest, grade, progress } as unknown as Lesson;
    byKey.set(key, lesson);
    out.push(lesson);
  }
  // Kolejnosc w obrebie rocznika od zera, bez dziur.
  const counters = new Map<string, number>();
  return out.map((l) => {
    const n = counters.get(l.grade) ?? 0;
    counters.set(l.grade, n + 1);
    return { ...l, order: n };
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
      meetings: [],
      quizzes: [],
      periods: [],
      timetable: [],
      settings: {
        passesPerMonth: 2,
        hintGivesMinus: true,
        wheelSpinSec: 4,
        plusesForFive: 3,
        plombyForOne: 3,
        reviewQuestionCount: 5,
        answerTimerSec: 30,
      },
      manuallyEditedLessonIds: {},

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
          // Lekcje naleza do rocznika - kasujemy tylko postep tej klasy, a cale
          // lekcje dopiero wtedy, gdy w roczniku nie zostala zadna klasa.
          lessons: removeClassFromLessons(s.lessons, s.classes, id),
          recapEvents: s.recapEvents.filter((e) => e.classId !== id),
          quizzes: s.quizzes.filter((q) => q.classId !== id),
          timetable: s.timetable.filter((e) => e.classId !== id),
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
        const existing = get().lessons.filter((l) => l.grade === lesson.grade);
        const order = existing.reduce((max, l) => Math.max(max, l.order + 1), 0);
        // Kod do zeszytu ("4.3") nadajemy raz, przy tworzeniu - patrz src/lib/lessonCode.ts.
        const code = lesson.code ?? nextLessonCode(get().lessons, lesson.grade);
        const item: Lesson = { ...lesson, id: newId(), order, code };
        set((s) => ({ lessons: [...s.lessons, item] }));
        return item;
      },
      updateLesson: (id, patch) => {
        set((s) => ({
          lessons: s.lessons.map((l) => (l.id === id ? { ...l, ...patch } : l)),
        }));
      },
      updateLessonFromEditor: (id, patch) => {
        set((s) => ({
          lessons: s.lessons.map((l) => (l.id === id ? { ...l, ...patch } : l)),
          manuallyEditedLessonIds: { ...s.manuallyEditedLessonIds, [id]: true },
        }));
      },
      clearManualEdit: (id) => {
        set((s) => {
          if (!(id in s.manuallyEditedLessonIds)) return {};
          const manuallyEditedLessonIds = { ...s.manuallyEditedLessonIds };
          delete manuallyEditedLessonIds[id];
          return { manuallyEditedLessonIds };
        });
      },
      removeLesson: (id) => {
        set((s) => {
          const manuallyEditedLessonIds = { ...s.manuallyEditedLessonIds };
          delete manuallyEditedLessonIds[id];
          return { lessons: s.lessons.filter((l) => l.id !== id), manuallyEditedLessonIds };
        });
      },
      moveLesson: (id, toIndex) => {
        set((s) => ({ lessons: moveLessonInGrade(s.lessons, id, toIndex) }));
      },
      reorderLesson: (id, direction) => {
        set((s) => {
          const lesson = s.lessons.find((l) => l.id === id);
          if (!lesson) return {};
          const gradeLessons = s.lessons.filter((l) => l.grade === lesson.grade).sort((a, b) => a.order - b.order);
          const idx = gradeLessons.findIndex((l) => l.id === id);
          return { lessons: moveLessonInGrade(s.lessons, id, direction === 'up' ? idx - 1 : idx + 1) };
        });
      },
      setLessonProgress: (lessonId, classId, progress) => {
        set((s) => ({
          lessons: s.lessons.map((l) =>
            l.id === lessonId ? { ...l, progress: { ...l.progress, [classId]: progress } } : l,
          ),
        }));
      },
      addRecapEvent: (event) => {
        const item: RecapEvent = { ...event, id: newId(), at: new Date().toISOString() };
        set((s) => ({ recapEvents: [...s.recapEvents, item] }));
        return item;
      },
      removeRecapEvent: (id) => {
        set((s) => ({ recapEvents: s.recapEvents.filter((e) => e.id !== id) }));
      },
      resetBalance: (classId, month, studentId) => {
        set((s) => {
          const toRemove = new Set(recapEventsForReset(s.recapEvents, classId, month, studentId).map((e) => e.id));
          if (toRemove.size === 0) return {};
          return { recapEvents: s.recapEvents.filter((e) => !toRemove.has(e.id)) };
        });
      },

      addMeeting: (meeting) => {
        const order = get().meetings.reduce((max, m) => Math.max(max, m.order), -1) + 1;
        const created: Meeting = { ...meeting, id: newId(), order };
        set((s) => ({ meetings: [...s.meetings, created] }));
        return created;
      },
      updateMeeting: (id, patch) => {
        set((s) => ({ meetings: s.meetings.map((m) => (m.id === id ? { ...m, ...patch } : m)) }));
      },
      removeMeeting: (id) => {
        set((s) => ({ meetings: s.meetings.filter((m) => m.id !== id) }));
      },

      addQuiz: (quiz) => {
        const created: Quiz = { ...quiz, id: newId(), createdAt: new Date().toISOString() };
        set((s) => ({ quizzes: [...s.quizzes, created] }));
        return created;
      },
      updateQuiz: (id, patch) => {
        set((s) => ({ quizzes: s.quizzes.map((q) => (q.id === id ? { ...q, ...patch } : q)) }));
      },
      removeQuiz: (id) => {
        set((s) => ({ quizzes: s.quizzes.filter((q) => q.id !== id) }));
      },

      setPeriods: (list) => {
        set(() => ({ periods: [...list].sort((a, b) => a.no - b.no) }));
      },
      setTimetableEntry: ({ weekday, period, classId, room }) => {
        set((s) => {
          const rest = s.timetable.filter((e) => !(e.weekday === weekday && e.period === period));
          if (!classId) return { timetable: rest };
          const entry: TimetableEntry = {
            id: timetableCellId(weekday, period),
            weekday,
            period,
            classId,
            room: room && room.trim() !== '' ? room.trim() : undefined,
          };
          return { timetable: [...rest, entry] };
        });
      },
      removeTimetableEntry: (id) => {
        set((s) => ({ timetable: s.timetable.filter((e) => e.id !== id) }));
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
          meetings: buildSeedMeetings(),
          quizzes: [],
          periods: DEFAULT_PERIODS,
          timetable: buildSeedTimetable(seed.classes),
          settings: seed.settings,
          manuallyEditedLessonIds: {},
        }));
      },
    }),
    {
      name: STORAGE_KEY,
      version: 13,
      // v1 -> v2: nazewnictwo "minus" -> "plomba" (zasady kola, zeby nie budzic
      // negatywnych skojarzen u dzieci) oraz nowe pola ustawien pod przeliczanie
      // plusow/plomb na oceny.
      // v2 -> v3: pasy przechodza z limitu tygodniowego (passesPerWeek) na
      // miesieczny (passesPerMonth, nowa domyslna wartosc 3). Jesli nauczyciel
      // mial dawna wartosc domyslna (2, nieruszana recznie) - dostaje nowa
      // domyslna (3). Jesli mial cokolwiek innego (zmienione recznie) - ta sama
      // liczba zostaje, tylko pod nowym polem/znaczeniem (miesiac zamiast tygodnia).
      // v4 -> v5: limit pasow spada z 3 do 2 na miesiac (decyzja nauczyciela,
      // spojna z tekstem zasad). Wartosc 3 (dawna domyslna) przechodzi na 2;
      // inna wartosc (zmieniona recznie) zostaje.
      // v3 -> v4: lekcje przechodza z pojedynczej klasy (classId + status) na
      // rocznik (grade + progress per klasa). Lekcje tej samej tresci, ktore
      // nauczyciel wstawil osobno do klas rownoleglych, sa sklejane w jedna
      // (dopasowanie po znormalizowanym tytule), a ich postep - laczony.
      // v5 -> v6: dochodzily fingerprinty wstawionych wersji gotowych
      // materialow (usuniete w v9 - patrz nizej).
      // v6 -> v7: dochodzi reviewQuestionCount (miekki limit pytan kola
      // powtorzeniowego) - domyslnie 7, edytowalne w Ustawieniach.
      // v7 -> v8: dochodzi kolekcja meetings (zakladka "Zebrania"). Stare dane
      // dostaja skrypt pierwszego zebrania z buildSeedMeetings().
      // v8 -> v9: fingerprinty (klasyfikacja "kod nowszy" vs "recznie
      // edytowane" w refreshMaterials.ts) zastapione jawna flaga
      // manuallyEditedLessonIds, ustawiana tylko przy zapisie z LessonEditor -
      // fingerprinty potrafily falszywie oznaczyc lekcje jako "recznie
      // edytowana" przy bugu w samym mechanizmie odswiezania. Stare dane
      // dostaja pusta mape (zadna lekcja nie jest oznaczona jako edytowana
      // recznie - nauczyciel przy okazji odswiezy i zobaczy realny stan).
      // v9 -> v10: domyslny reviewQuestionCount spada z 7 na 5 (nauczyciel
      // upraszcza kolo powtorzeniowe). Stara domyslna wartosc (7, nieruszana
      // recznie) dostaje nowa domyslna (5); inna wartosc (zmieniona recznie)
      // zostaje bez zmian.
      // v11 -> v12: dochodzi kolekcja quizzes (zakladka "Kartkowki"). Stare
      // dane dostaja pusta liste - kartkowki nie maja zadnego seeda.
      // v12 -> v13: dochodza periods (dzwonki) i timetable (plan tygodniowy,
      // zakladka "Plan"). Stare dane dostaja domyslne dzwonki SP97 i plan
      // nauczyciela dopasowany po nazwach klas (patrz timetableSeed.ts).
      migrate: (persistedState, version) => {
        const state = persistedState as {
          classes?: SchoolClass[];
          lessons?: Array<Record<string, unknown>>;
          recapEvents?: Array<{ result?: string; [key: string]: unknown }>;
          settings?: (Partial<Settings> & { passesPerWeek?: number }) | undefined;
          manuallyEditedLessonIds?: ManuallyEditedLessonIds;
          meetings?: Array<Record<string, unknown>>;
          quizzes?: Array<Record<string, unknown>>;
          periods?: LessonPeriod[];
          timetable?: TimetableEntry[];
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
        if (version < 4 && Array.isArray(state.lessons)) {
          state.lessons = migrateLessonsToGrades(state.lessons, state.classes ?? []) as unknown as Array<Record<string, unknown>>;
        }
        if (version < 5 && state.settings && state.settings.passesPerMonth === 3) {
          state.settings = { ...state.settings, passesPerMonth: 2 };
        }
        if (version < 7 && state.settings) {
          state.settings = { ...state.settings, reviewQuestionCount: state.settings.reviewQuestionCount ?? 7 };
        }
        if (version < 8) {
          // Zakladka "Zebrania" doszla pozniej niz reszta store - istniejace dane
          // (localStorage / chmura) nie maja jej wcale. Skrypt pierwszego zebrania
          // wstawiamy raz, przy migracji; od tej chwili nalezy do nauczyciela.
          if (!Array.isArray(state.meetings)) {
            state.meetings = buildSeedMeetings() as unknown as Array<Record<string, unknown>>;
          }
        }
        if (version < 9) {
          delete state.insertedFingerprints;
          state.manuallyEditedLessonIds = state.manuallyEditedLessonIds ?? {};
        }
        if (version < 10 && state.settings && state.settings.reviewQuestionCount === 7) {
          state.settings = { ...state.settings, reviewQuestionCount: 5 };
        }
        if (version < 11 && state.settings) {
          // Stoper odpowiedzi doszedl pozniej - istniejace instalacje dostaja
          // domyslne 30 s (0 = nauczyciel go wylaczyl, tego nie ruszamy).
          state.settings = { ...state.settings, answerTimerSec: state.settings.answerTimerSec ?? 30 };
        }
        if (version < 12 && !Array.isArray(state.quizzes)) {
          state.quizzes = [];
        }
        if (version < 13) {
          if (!Array.isArray(state.periods)) state.periods = DEFAULT_PERIODS;
          if (!Array.isArray(state.timetable)) state.timetable = buildSeedTimetable(state.classes ?? []);
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
