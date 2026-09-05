import { describe, expect, it } from 'vitest';
import type { Lesson, SchoolClass } from '../data/types';
import { allGrades, classesOfGrade, classGrade, gradeLabel, lessonProgress } from './grade';

describe('classGrade', () => {
  it('pierwszy wyraz nazwy klasy to rocznik', () => {
    expect(classGrade('IV A')).toBe('IV');
    expect(classGrade('V A')).toBe('V');
  });

  it('nazwa bez spacji jest sama swoim rocznikiem', () => {
    expect(classGrade('4a')).toBe('4a');
  });

  it('przycina biale znaki wokol nazwy i miedzy wyrazami', () => {
    expect(classGrade('  IV   B ')).toBe('IV');
  });
});

describe('classesOfGrade', () => {
  it('zwraca klasy danego rocznika posortowane wg order', () => {
    const classes: SchoolClass[] = [
      { id: 'c3', name: 'IV C', order: 2 },
      { id: 'c1', name: 'IV A', order: 0 },
      { id: 'c2', name: 'IV B', order: 1 },
      { id: 'v1', name: 'V A', order: 3 },
    ];
    expect(classesOfGrade(classes, 'IV').map((c) => c.id)).toEqual(['c1', 'c2', 'c3']);
  });
});

describe('allGrades', () => {
  it('zachowuje kolejnosc pierwszego wystapienia wg order klas', () => {
    const classes: SchoolClass[] = [
      { id: 'v1', name: 'V A', order: 0 },
      { id: 'c1', name: 'IV A', order: 1 },
      { id: 'c2', name: 'IV B', order: 2 },
    ];
    expect(allGrades(classes)).toEqual(['V', 'IV']);
  });
});

describe('gradeLabel', () => {
  it('kilka klas rocznika daje liczbe mnoga', () => {
    const classes: SchoolClass[] = [
      { id: 'c1', name: 'IV A', order: 0 },
      { id: 'c2', name: 'IV B', order: 1 },
    ];
    expect(gradeLabel(classes, 'IV')).toBe('klasy IV');
  });

  it('jedna klasa rocznika daje liczbe pojedyncza', () => {
    const classes: SchoolClass[] = [{ id: 'v1', name: 'V A', order: 0 }];
    expect(gradeLabel(classes, 'V')).toBe('klasa V');
  });
});

describe('lessonProgress', () => {
  it('brak wpisu domyslnie oznacza planned', () => {
    const lesson: Lesson = { id: 'l1', grade: 'IV', title: 'Lekcja', order: 0, progress: {}, slides: [] };
    expect(lessonProgress(lesson, 'c1')).toEqual({ status: 'planned' });
  });
});
