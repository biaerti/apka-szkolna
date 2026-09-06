import { beforeAll, describe, expect, it } from 'vitest';
import type { Lesson, RecapEvent, SchoolClass } from './types';

// zustand/persist czyta localStorage juz przy tworzeniu store'a (rehydratacja),
// a to srodowisko testowe dziala w Node bez jsdom - stad brak globalnego
// localStorage. Polyfill (prosta Mapa) musi byc zaladowany PRZED importem
// store.ts, wiec import jest dynamiczny i wykonany w beforeAll.
let migrateLessonsToGrades: typeof import('./store')['migrateLessonsToGrades'];
let moveLessonInGrade: typeof import('./store')['moveLessonInGrade'];
let removeClassFromLessons: typeof import('./store')['removeClassFromLessons'];
let recapEventsForReset: typeof import('./store')['recapEventsForReset'];

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
  recapEventsForReset = mod.recapEventsForReset;
});

function recapEvent(partial: Partial<RecapEvent> & { id: string; classId: string; at: string }): RecapEvent {
  return { studentId: 's1', result: 'plus', ...partial };
}

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

describe('recapEventsForReset', () => {
  const events: RecapEvent[] = [
    recapEvent({ id: '1', classId: 'a', studentId: 's1', result: 'plus', at: new Date(2026, 8, 1).toISOString() }),
    recapEvent({ id: '2', classId: 'a', studentId: 's2', result: 'plomba', at: new Date(2026, 8, 5).toISOString() }),
    recapEvent({ id: '3', classId: 'a', studentId: 's1', result: 'uwaga', at: new Date(2026, 7, 20).toISOString() }), // sierpien
    recapEvent({ id: '4', classId: 'b', studentId: 's1', result: 'plus', at: new Date(2026, 8, 2).toISOString() }), // inna klasa
  ];

  it('wybiera zdarzenia calej klasy z podanego miesiaca, pomija inne miesiace i inne klasy', () => {
    const result = recapEventsForReset(events, 'a', '2026-09');
    expect(result.map((e) => e.id).sort()).toEqual(['1', '2']);
  });

  it('z podanym studentId zawęża do zdarzeń jednego ucznia', () => {
    const result = recapEventsForReset(events, 'a', '2026-09', 's1');
    expect(result.map((e) => e.id)).toEqual(['1']);
  });

  it('zwraca pusta liste, gdy nic nie pasuje do miesiaca', () => {
    expect(recapEventsForReset(events, 'a', '2026-01')).toEqual([]);
  });

  it('nie rusza zdarzen innej klasy nawet dla tego samego ucznia i miesiaca', () => {
    const result = recapEventsForReset(events, 'b', '2026-09', 's1');
    expect(result.map((e) => e.id)).toEqual(['4']);
  });
});
