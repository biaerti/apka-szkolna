import { describe, expect, it } from 'vitest';
import type { Lesson } from '../data/types';
import { assignedLessonForSlot, lessonAssignmentUpdates, lessonTitleWithPart } from './dashboardPlan';

const lesson: Lesson = {
  id: 'l1', grade: 'IV', title: 'Czasownik', order: 1, slides: [],
  progress: { c1: { status: 'planned', lessonSlots: [
    { id: '2026-10-05-1', date: '2026-10-05', period: 1 },
    { id: '2026-10-07-3', date: '2026-10-07', period: 3 },
  ] } },
};

describe('dashboard plan', () => {
  it('numeruje kolejne użycie tego samego materiału', () => {
    expect(assignedLessonForSlot([lesson], 'c1', '2026-10-07', 3)?.part).toBe(2);
    expect(lessonTitleWithPart('Czasownik', 2)).toBe('Czasownik cz. 2');
  });

  it('nie dopisuje części do pierwszego użycia', () => {
    expect(lessonTitleWithPart('Czasownik', 1)).toBe('Czasownik');
  });

  it('ten sam materiał pozostawia w trakcie i dodaje jako kolejną część', () => {
    const inProgress = { ...lesson, progress: { c1: { ...lesson.progress.c1, status: 'in_progress' as const } } };
    const updates = lessonAssignmentUpdates(
      [inProgress],
      'c1',
      { id: '2026-10-09-2', date: '2026-10-09', period: 2 },
      inProgress.id,
    );

    expect(updates[0].progress.status).toBe('in_progress');
    expect(updates[0].progress.lessonSlots).toHaveLength(3);
  });

  it('wybór następnego materiału kończy poprzedni i ustawia nowy w trakcie', () => {
    const previous = {
      ...lesson,
      progress: { c1: { ...lesson.progress.c1, status: 'in_progress' as const } },
    };
    const next: Lesson = { id: 'l2', grade: 'IV', title: 'Zdanie', order: 2, slides: [], progress: {} };
    const updates = lessonAssignmentUpdates(
      [previous, next],
      'c1',
      { id: '2026-10-09-2', date: '2026-10-09', period: 2 },
      next.id,
    );

    expect(updates.find((item) => item.lessonId === previous.id)?.progress.status).toBe('done');
    expect(updates.find((item) => item.lessonId === previous.id)?.progress.doneDate).toBe('2026-10-09');
    expect(updates.find((item) => item.lessonId === next.id)?.progress.status).toBe('in_progress');
  });
});
