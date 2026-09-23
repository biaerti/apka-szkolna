import { describe, expect, it } from 'vitest';
import type { SchoolClass, TimetableEntry } from '../data/types';
import { effectiveTimetable, vulcanLessonsFromSchedule } from './vulcanPlan';

const classes = [
  { id: 'c4b', name: 'IV B', order: 1 },
  { id: 'c4c', name: 'IV C', order: 2 },
] as SchoolClass[];

// Sroda 23.09.2026, 9:00.
const now = new Date(2026, 8, 23, 9, 0);
const weekly: TimetableEntry[] = [
  { id: 'tt-3-2', weekday: 3, period: 2, classId: 'c4c' },
  { id: 'tt-4-1', weekday: 4, period: 1, classId: 'c4b' },
];

describe('vulcanPlan', () => {
  it('dopasowuje klasy po nazwie VULCANA i zostawia obce klasy z sama nazwa', () => {
    const lessons = vulcanLessonsFromSchedule(
      [
        { date: '2026-09-23', period: 2, className: '4B', subject: 'Język polski' },
        { date: '2026-09-23', period: 3, className: '6a', subject: 'Matematyka', replacement: 'zastępstwo' },
      ],
      classes,
    );
    expect(lessons).toEqual([
      { id: 'vl-2026-09-23-2', date: '2026-09-23', period: 2, className: '4B', subject: 'Język polski', classId: 'c4b' },
      { id: 'vl-2026-09-23-3', date: '2026-09-23', period: 3, className: '6A', subject: 'Matematyka', replacement: 'zastępstwo' },
    ]);
  });

  it('podmienia dzisiejszy dzien planu, gdy jest plan z VULCANA', () => {
    const lessons = vulcanLessonsFromSchedule([{ date: '2026-09-23', period: 2, className: '4B', subject: 'Język polski' }], classes);
    const plan = effectiveTimetable(weekly, lessons, now);
    expect(plan.filter((e) => e.weekday === 3).map((e) => [e.period, e.classId])).toEqual([[2, 'c4b']]);
    expect(plan.some((e) => e.id === 'tt-4-1')).toBe(true);
  });

  it('bez planu z VULCANA na dzis zostaje plan tygodniowy', () => {
    const lessons = vulcanLessonsFromSchedule([{ date: '2026-09-22', period: 1, className: '4B', subject: 'Język polski' }], classes);
    expect(effectiveTimetable(weekly, lessons, now)).toBe(weekly);
  });
});
