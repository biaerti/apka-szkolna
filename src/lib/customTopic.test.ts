import { describe, expect, it } from 'vitest';
import type { Lesson } from '../data/types';
import { CUSTOM_DZIAL, reusableCustomLesson } from './customTopic';

function lesson(id: string, patch: Partial<Lesson> = {}): Lesson {
  return { id, grade: 'IV', title: 'Sprawdzian', order: 0, progress: {}, slides: [], dzial: CUSTOM_DZIAL, ...patch };
}

describe('reusableCustomLesson', () => {
  it('daje wlasny temat o tej samej nazwie, jesli klasa go jeszcze nie miala', () => {
    const lessons = [lesson('a', { progress: { b: { status: 'in_progress', lessonSlots: [{ id: '2026-10-12-3', date: '2026-10-12', period: 3 }] } } })];
    expect(reusableCustomLesson(lessons, 'IV', 'a-klasa', '  sprawdzian ')?.id).toBe('a');
  });

  it('nie bierze tematu, ktory ta klasa juz miala, ani lekcji z podrecznika', () => {
    const lessons = [
      lesson('a', { progress: { k: { status: 'in_progress', lessonSlots: [{ id: '2026-10-12-3', date: '2026-10-12', period: 3 }] } } }),
      lesson('b', { dzial: 'Rozdział I' }),
      lesson('c', { grade: 'V' }),
    ];
    expect(reusableCustomLesson(lessons, 'IV', 'k', 'Sprawdzian')).toBeUndefined();
  });
});
