import { describe, expect, it } from 'vitest';
import type { Lesson } from '../data/types';
import { lessonMaterialType, lessonSections, pickLessonSection, shortDzialLabel } from './lessonMaterial';

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

describe('lessonSections', () => {
  const lessons = [
    lesson({ id: 'r1', materialType: 'review', dzial: 'Powtórka 1-3' }),
    lesson({ id: 'a', materialType: 'textbook', dzial: 'Dział 1 - W poszukiwaniu przyjaźni' }),
    lesson({ id: 'w', materialType: 'textbook' }),
    lesson({ id: 'b', materialType: 'textbook', dzial: 'Dział 2 - Uwaga, uczucia!' }),
    lesson({ id: 'a2', materialType: 'textbook', dzial: 'Dział 1 - W poszukiwaniu przyjaźni' }),
  ];

  it('powtorki, potem dzialy w kolejnosci, lekcje bez dzialu na koncu', () => {
    const sections = lessonSections(lessons);
    expect(sections.map((s) => s.label)).toEqual(['Powtórzeniowe', 'Dział 1', 'Dział 2', 'Inne']);
    expect(sections[1].lessons.map((l) => l.id)).toEqual(['a', 'a2']);
  });

  it('skraca nazwy dzialow', () => {
    expect(shortDzialLabel('Dział 2 - Uwaga, uczucia!')).toBe('Dział 2');
    expect(shortDzialLabel('Rozdział I. Poznajemy siebie i innych')).toBe('Rozdział I');
  });

  it('pamieta dzial, a typ z adresu ma pierwszenstwo', () => {
    const sections = lessonSections(lessons);
    const d2 = 'dzial:Dział 2 - Uwaga, uczucia!';
    expect(pickLessonSection(sections, null, d2)?.label).toBe('Dział 2');
    expect(pickLessonSection(sections, 'textbook', d2)?.label).toBe('Dział 2');
    expect(pickLessonSection(sections, 'review', d2)?.label).toBe('Powtórzeniowe');
    expect(pickLessonSection(sections, 'textbook', 'review')?.label).toBe('Dział 1');
    expect(pickLessonSection(sections, null, null)?.label).toBe('Dział 1');
  });
});
