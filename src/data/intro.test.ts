// Lekcja zapoznawcza jest budowana z RULE_SECTIONS (zasady.ts) i z kodow podstawy
// programowej (podstawa.ts). Oba powiazania sa "po stringach", a Lessons.tsx lapie
// wyjatek z buildIntroLesson w try/catch - czyli literowka w tytule sekcji albo w
// kodzie podstawy nie wywalilaby aplikacji, tylko po cichu ukryla przycisk
// "Lekcja zapoznawcza". Te testy sa po to, zeby taka zmiana wysypala sie tutaj.

import { describe, expect, it } from 'vitest';
import { buildIntroLesson } from './intro';
import { curriculumByCode } from './podstawa';
import { RULE_SECTIONS } from './zasady';

describe('buildIntroLesson', () => {
  const CLASS_ID = 'class-1';

  it('buduje sie bez wyjatku - wszystkie sekcje zasad, do ktorych siega, istnieja', () => {
    expect(() => buildIntroLesson('IV', [CLASS_ID])).not.toThrow();
  });

  it('zwraca zestaw 20 pytan przypisany do wskazanych klas', () => {
    const { questionSet, questions } = buildIntroLesson('IV', [CLASS_ID]);
    expect(questionSet.classIds).toEqual([CLASS_ID]);
    expect(questions).toHaveLength(20);
    expect(questions.every((q) => q.setId === questionSet.id)).toBe(true);
  });

  it('lekcja nalezy do rocznika i nie ma jeszcze postepu w zadnej klasie', () => {
    const { lesson } = buildIntroLesson('IV', [CLASS_ID]);
    expect(lesson.grade).toBe('IV');
    expect(lesson.progress).toEqual({});
  });

  it('slajdy recap wskazuja na zbudowany zestaw pytan', () => {
    const { lesson, questionSet } = buildIntroLesson('IV', [CLASS_ID]);
    const recapSlides = lesson.slides.filter((s) => s.kind === 'recap');
    // Dwa kola: pierwsze na pokazanie ("zobaczcie, to wasze imiona"), drugie na
    // wlasciwa runde zapoznawcza.
    expect(recapSlides).toHaveLength(2);
    for (const slide of recapSlides) {
      expect(slide.kind === 'recap' && slide.questionSetId).toBe(questionSet.id);
    }
  });

  it('konczy sie notatka do zeszytu, a potem slajdem pozegnalnym', () => {
    const { lesson } = buildIntroLesson('IV', [CLASS_ID]);
    const kinds = lesson.slides.map((s) => s.kind);
    expect(kinds).toContain('note');
    expect(kinds.indexOf('note')).toBe(kinds.length - 2);
    expect(kinds[kinds.length - 1]).toBe('title');
  });

  it('uzywa wylacznie kodow podstawy programowej, ktore naprawde istnieja', () => {
    const { lesson } = buildIntroLesson('IV', [CLASS_ID]);
    expect(lesson.curriculum && lesson.curriculum.length).toBeTruthy();
    for (const code of lesson.curriculum ?? []) {
      expect(curriculumByCode(code), `nieznany kod podstawy: ${code}`).toBeDefined();
    }
  });

  it('ma wypelniony temat pod dziennik Vulcan', () => {
    const { lesson } = buildIntroLesson('IV', [CLASS_ID]);
    expect(lesson.registerTopic).toBeTruthy();
  });

  it('ma slajd z ilustracja "procenty"', () => {
    const { lesson } = buildIntroLesson('IV', [CLASS_ID]);
    const hasProcenty = lesson.slides.some((s) => 'art' in s && s.art === 'procenty');
    expect(hasProcenty).toBe(true);
  });
});

describe('RULE_SECTIONS', () => {
  it('nie ma pustych sekcji ani pustych punktow', () => {
    expect(RULE_SECTIONS.length).toBeGreaterThan(0);
    for (const section of RULE_SECTIONS) {
      expect(section.title.trim()).not.toBe('');
      expect(section.items.length).toBeGreaterThan(0);
      for (const item of section.items) {
        expect(item.trim()).not.toBe('');
      }
    }
  });

  it('nie zawiera slowa "minus" - w zasadach obowiazuje "plomba"', () => {
    const all = RULE_SECTIONS.map((s) => `${s.title} ${s.items.join(' ')}`)
      .join(' ')
      .toLowerCase();
    expect(all).not.toContain('minus');
  });

  it('sekcja "Zeszyt i sprawdziany" istnieje i jest ostatnia w tablicy', () => {
    expect(RULE_SECTIONS[RULE_SECTIONS.length - 1].title).toBe('Zeszyt i sprawdziany');
  });

  it('progi procentowe ocen (33, 50, 75, 90, 98) wystepuja w tresci zasad', () => {
    const all = RULE_SECTIONS.map((s) => s.items.join(' ')).join(' ');
    for (const percent of [33, 50, 75, 90, 98]) {
      expect(all, `brak progu ${percent}% w tresci zasad`).toContain(`${percent}%`);
    }
  });
});
