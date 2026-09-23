import { describe, expect, it } from 'vitest';
import type { Lesson, Slide } from '../data/types';
import { removeLessonWithRecapFallback, repairOrphanedLessonRecaps } from './lessonDeletion';

function lesson(partial: Partial<Lesson> & { id: string; order: number }): Lesson {
  return {
    grade: 'IV',
    title: partial.id,
    materialType: 'textbook',
    progress: {},
    slides: [],
    ...partial,
  };
}

function recap(id: string, questionSetId: string): Slide {
  return { id, kind: 'recap', questionSetId, mode: 'powtorzeniowe' };
}

describe('removeLessonWithRecapFallback', () => {
  it('po usunieciu srodkowej lekcji przepina powtorke nastepnej na poprzedni temat', () => {
    const lessons = [
      lesson({ id: 'before', order: 0, questionSetId: 'set-before', reviewQuestionSetId: 'set-before' }),
      lesson({ id: 'removed', order: 1, questionSetId: 'set-removed', reviewQuestionSetId: 'set-removed' }),
      lesson({ id: 'next', order: 2, slides: [recap('recap', 'set-removed')] }),
    ];

    const result = removeLessonWithRecapFallback(lessons, 'removed');

    expect(result.map((item) => item.id)).toEqual(['before', 'next']);
    expect(result[1].slides[0]).toMatchObject({ kind: 'recap', questionSetId: 'set-before' });
  });

  it('po usunieciu pierwszej lekcji usuwa jej powtorke z nastepnej', () => {
    const lessons = [
      lesson({ id: 'removed', order: 0, questionSetId: 'set-removed' }),
      lesson({ id: 'next', order: 1, slides: [recap('recap', 'set-removed')] }),
    ];

    const result = removeLessonWithRecapFallback(lessons, 'removed');

    expect(result[0].slides).toEqual([]);
  });

  it('nie nadpisuje recznie wybranego zestawu ani powtorki z innej serii', () => {
    const lessons = [
      lesson({ id: 'before', order: 0, questionSetId: 'set-before' }),
      lesson({ id: 'removed', order: 1, questionSetId: 'set-removed' }),
      lesson({ id: 'next', order: 2, slides: [recap('custom', 'set-custom')] }),
      lesson({
        id: 'review',
        order: 3,
        materialType: 'review',
        slides: [recap('other-series', 'set-removed')],
      }),
    ];

    const result = removeLessonWithRecapFallback(lessons, 'removed');

    expect(result.find((item) => item.id === 'next')?.slides[0]).toMatchObject({ questionSetId: 'set-custom' });
    expect(result.find((item) => item.id === 'review')?.slides[0]).toMatchObject({ questionSetId: 'set-removed' });
  });

  it('nie zmienia tablicy, gdy lekcja nie istnieje', () => {
    const lessons = [lesson({ id: 'only', order: 0 })];
    expect(removeLessonWithRecapFallback(lessons, 'missing')).toBe(lessons);
  });
});

describe('repairOrphanedLessonRecaps', () => {
  it('naprawia zapis po wczesniejszym usunieciu tematu z lancucha', () => {
    const lessons = [
      lesson({ id: 'warto-byc-soba', order: 0, questionSetId: 'set-before' }),
      lesson({ id: 'czasownik', order: 2, slides: [recap('old-recap', 'set-usuniety-dzien-kropki')] }),
    ];

    const result = repairOrphanedLessonRecaps(lessons);

    expect(result[1].slides[0]).toMatchObject({ questionSetId: 'set-before' });
  });

  it('zostawia powtorke, gdy jej zestaw nadal nalezy do lekcji w serii', () => {
    const lessons = [
      lesson({ id: 'before', order: 0, questionSetId: 'set-before' }),
      lesson({ id: 'next', order: 1, slides: [recap('recap', 'set-before')] }),
    ];

    const result = repairOrphanedLessonRecaps(lessons);

    expect(result[1]).toBe(lessons[1]);
  });

  it('nie zmienia osieroconego zestawu w lekcji edytowanej recznie', () => {
    const lessons = [
      lesson({ id: 'before', order: 0, questionSetId: 'set-before' }),
      lesson({ id: 'manual', order: 1, slides: [recap('custom', 'standalone-set')] }),
    ];

    const result = repairOrphanedLessonRecaps(lessons, { manual: true });

    expect(result[1]).toBe(lessons[1]);
    expect(result[1].slides[0]).toMatchObject({ questionSetId: 'standalone-set' });
  });
});
