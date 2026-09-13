import { describe, expect, it } from 'vitest';
import type { Lesson } from '../data/types';
import { lessonMaterialType } from './lessonMaterial';

function lesson(patch: Partial<Lesson>): Lesson {
  return { id: 'l1', grade: 'IV', title: 'Lekcja', order: 0, progress: {}, slides: [], ...patch };
}

describe('lessonMaterialType', () => {
  it('szanuje jawnie zapisany rodzaj', () => {
    expect(lessonMaterialType(lesson({ materialType: 'review' }))).toBe('review');
  });

  it('rozpoznaje starsze powtorki i lekcje zapoznawcza', () => {
    expect(lessonMaterialType(lesson({ dzial: 'Powtórka 1-3' }))).toBe('review');
    expect(lessonMaterialType(lesson({ slides: [{ id: 's1', kind: 'recap', questionSetId: 'q', variant: 'demo' }] }))).toBe('review');
  });

  it('starsza zwykla lekcja trafia do podrecznika', () => {
    expect(lessonMaterialType(lesson({}))).toBe('textbook');
  });
});
