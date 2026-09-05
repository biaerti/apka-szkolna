import { beforeAll, describe, expect, it } from 'vitest';
import type { Lesson, SchoolClass } from './types';

// zustand/persist czyta localStorage juz przy tworzeniu store'a (rehydratacja),
// a to srodowisko testowe dziala w Node bez jsdom - stad brak globalnego
// localStorage. Polyfill (prosta Mapa) musi byc zaladowany PRZED importem
// store.ts, wiec import jest dynamiczny i wykonany w beforeAll.
let migrateLessonsToGrades: typeof import('./store')['migrateLessonsToGrades'];
let moveLessonInGrade: typeof import('./store')['moveLessonInGrade'];
let removeClassFromLessons: typeof import('./store')['removeClassFromLessons'];

beforeAll(async () => {
  if (typeof globalThis.localStorage === 'undefined') {
    const mem = new Map<string, string>();
    const polyfill: Storage = {
      getItem: (key: string) => (mem.has(key) ? (mem.get(key) as string) : null),
      setItem: (key: string, value: string) => {
        mem.set(key, value);
      },
      removeItem: (key: string) => {
        mem.delete(key);
      },
      clear: () => mem.clear(),
      key: (index: number) => Array.from(mem.keys())[index] ?? null,
      get length() {
        return mem.size;
      },
    };
    (globalThis as unknown as { localStorage: Storage }).localStorage = polyfill;
  }
  const mod = await import('./store');
  migrateLessonsToGrades = mod.migrateLessonsToGrades;
  moveLessonInGrade = mod.moveLessonInGrade;
  removeClassFromLessons = mod.removeClassFromLessons;
});

function lesson(partial: Partial<Lesson> & { id: string; grade: string; order: number }): Lesson {
  return { title: 'Lekcja', progress: {}, slides: [], ...partial };
}

const CLASSES: SchoolClass[] = [
  { id: 'a', name: 'IV A', order: 0 },
  { id: 'b', name: 'IV B', order: 1 },
  { id: 'v1', name: 'V A', order: 2 },
];

describe('migrateLessonsToGrades', () => {
  it('skleja te sama lekcje wstawiona osobno do klas rownoleglych w jedna, z polaczonym postepem', () => {
    const raw = [
      {
        id: 'l1',
        classId: 'a',
        title: 'Lekcja zapoznawcza',
        order: 0,
        status: 'done',
        doneDate: '2026-09-05',
        slides: [],
      },
      {
        id: 'l2',
        classId: 'b',
        title: 'Lekcja zapoznawcza',
        order: 0,
        status: 'planned',
        slides: [],
      },
      {
        id: 'l3',
        classId: 'v1',
        title: 'Lekcja zapoznawcza',
        order: 0,
        status: 'planned',
        slides: [],
      },
    ];

    const result = migrateLessonsToGrades(raw, CLASSES);

    const ivLessons = result.filter((l) => l.grade === 'IV');
    expect(ivLessons).toHaveLength(1);
    expect(ivLessons[0].progress).toEqual({
      a: { status: 'done', doneDate: '2026-09-05' },
      b: { status: 'planned' },
    });
    expect(ivLessons[0]).not.toHaveProperty('classId');
    expect(ivLessons[0]).not.toHaveProperty('status');
    expect(ivLessons[0]).not.toHaveProperty('doneDate');

    const vLessons = result.filter((l) => l.grade === 'V');
    expect(vLessons).toHaveLength(1);
    expect(vLessons[0].progress).toEqual({ v1: { status: 'planned' } });
  });

  it('kolejnosc w obrebie rocznika zaczyna sie od zera i nie ma dziur', () => {
    const raw = [
      { id: 'l1', classId: 'a', title: 'Pierwsza', order: 0, status: 'planned', slides: [] },
      { id: 'l2', classId: 'a', title: 'Druga', order: 1, status: 'planned', slides: [] },
      { id: 'l3', classId: 'v1', title: 'Trzecia', order: 5, status: 'planned', slides: [] },
    ];

    const result = migrateLessonsToGrades(raw, CLASSES);

    const ivOrders = result.filter((l) => l.grade === 'IV').map((l) => l.order).sort();
    expect(ivOrders).toEqual([0, 1]);
    const vOrders = result.filter((l) => l.grade === 'V').map((l) => l.order);
    expect(vOrders).toEqual([0]);
  });

  it('lekcja z classId nieistniejacej klasy dostaje rocznik IV', () => {
    const raw = [
      { id: 'l1', classId: 'nieistniejaca', title: 'Zagubiona', order: 0, status: 'planned', slides: [] },
    ];

    const result = migrateLessonsToGrades(raw, CLASSES);

    expect(result).toHaveLength(1);
    expect(result[0].grade).toBe('IV');
  });
});

describe('moveLessonInGrade', () => {
  const lessons: Lesson[] = [
    lesson({ id: 'a', grade: 'IV', order: 0 }),
    lesson({ id: 'b', grade: 'IV', order: 1 }),
    lesson({ id: 'c', grade: 'IV', order: 2 }),
    lesson({ id: 'd', grade: 'IV', order: 3 }),
    lesson({ id: 'x', grade: 'V', order: 0 }),
  ];

  it('przenosi lekcje z indeksu 3 na 0, przesuwajac reszte', () => {
    const result = moveLessonInGrade(lessons, 'd', 0);
    const byId = new Map(result.map((l) => [l.id, l.order]));
    expect(byId.get('d')).toBe(0);
    expect(byId.get('a')).toBe(1);
    expect(byId.get('b')).toBe(2);
    expect(byId.get('c')).toBe(3);
  });

  it('nie rusza lekcji innego rocznika', () => {
    const result = moveLessonInGrade(lessons, 'd', 0);
    const x = result.find((l) => l.id === 'x');
    expect(x?.order).toBe(0);
  });

  it('przycina toIndex poza zakresem', () => {
    const result = moveLessonInGrade(lessons, 'a', 99);
    const byId = new Map(result.map((l) => [l.id, l.order]));
    expect(byId.get('a')).toBe(3);
  });

  it('from === to zwraca te sama tablice', () => {
    const result = moveLessonInGrade(lessons, 'b', 1);
    expect(result).toBe(lessons);
  });
});

describe('removeClassFromLessons', () => {
  it('usuwa tylko postep usuwanej klasy, lekcje zostaja jesli rocznik ma inne klasy', () => {
    const lessons: Lesson[] = [
      lesson({
        id: 'l1',
        grade: 'IV',
        order: 0,
        progress: { a: { status: 'done' }, b: { status: 'planned' } },
      }),
    ];
    const result = removeClassFromLessons(lessons, CLASSES, 'b');
    expect(result).toHaveLength(1);
    expect(result[0].progress).toEqual({ a: { status: 'done' } });
  });

  it('usuwa lekcje rocznika, gdy to byla jego jedyna klasa', () => {
    const lessons: Lesson[] = [
      lesson({ id: 'l1', grade: 'V', order: 0, progress: { v1: { status: 'planned' } } }),
    ];
    const result = removeClassFromLessons(lessons, CLASSES, 'v1');
    expect(result).toEqual([]);
  });
});
