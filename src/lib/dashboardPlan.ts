import type { Lesson, LessonProgress, LessonSlot } from '../data/types';
import { lessonProgress } from './grade';
import { progressWithoutSlot, slotsFromProgress } from './lessonSlots';

export interface AssignedLessonSlot {
  lesson: Lesson;
  slot: LessonSlot;
  part: number;
}

export function assignedLessonForSlot(
  lessons: Lesson[],
  classId: string,
  date: string,
  period: number,
): AssignedLessonSlot | undefined {
  for (const lesson of lessons) {
    const slots = slotsFromProgress(lessonProgress(lesson, classId));
    const index = slots.findIndex((slot) => slot.date === date && slot.period === period);
    if (index >= 0) return { lesson, slot: slots[index], part: index + 1 };
  }
  return undefined;
}

export function lessonTitleWithPart(title: string, part: number): string {
  return part > 1 ? `${title} cz. ${part}` : title;
}

export interface LessonProgressUpdate {
  lessonId: string;
  progress: LessonProgress;
}

/**
 * Jedna decyzja na planie aktualizuje wszystkie powiązane stany:
 * - slot ma tylko jednego właściciela,
 * - wybrany materiał przechodzi na „w trakcie”,
 * - poprzedni materiał „w trakcie” kończy się dopiero po wybraniu innego,
 * - ponowny wybór tego samego materiału zachowuje go jako cz. 2, cz. 3 itd.
 */
export function lessonAssignmentUpdates(
  lessons: Lesson[],
  classId: string,
  slot: LessonSlot,
  selectedLessonId: string,
): LessonProgressUpdate[] {
  const updates = new Map<string, LessonProgress>();
  const readProgress = (lesson: Lesson) => updates.get(lesson.id) ?? lessonProgress(lesson, classId);

  for (const lesson of lessons) {
    const progress = readProgress(lesson);
    if (slotsFromProgress(progress).some((item) => item.id === slot.id)) {
      updates.set(lesson.id, progressWithoutSlot(progress, slot.id));
    }
  }

  if (!selectedLessonId) {
    return [...updates].map(([lessonId, progress]) => ({ lessonId, progress }));
  }

  for (const lesson of lessons) {
    if (lesson.id === selectedLessonId) continue;
    const progress = readProgress(lesson);
    if (progress.status !== 'in_progress') continue;
    const previousSlots = slotsFromProgress(progress);
    const latest = previousSlots[previousSlots.length - 1];
    const newSlotIsLater = !latest || latest.date < slot.date || (latest.date === slot.date && latest.period < slot.period);
    if (newSlotIsLater) {
      updates.set(lesson.id, { ...progress, status: 'done', doneDate: slot.date });
    }
  }

  const selected = lessons.find((lesson) => lesson.id === selectedLessonId);
  if (!selected) return [...updates].map(([lessonId, progress]) => ({ lessonId, progress }));
  const current = readProgress(selected);
  const existing = slotsFromProgress(current);
  const lessonSlots = existing.some((item) => item.id === slot.id)
    ? existing
    : [...existing, slot].sort((a, b) => a.date.localeCompare(b.date) || a.period - b.period);
  const first = lessonSlots[0];
  updates.set(selected.id, {
    ...current,
    status: 'in_progress',
    doneDate: undefined,
    lessonSlots,
    lessonDate: first?.date,
    lessonPeriod: first?.period,
  });

  return [...updates].map(([lessonId, progress]) => ({ lessonId, progress }));
}
