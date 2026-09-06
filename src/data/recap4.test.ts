import { describe, expect, it } from 'vitest';
import { buildRecap4 } from './recap4';
import { buildRecap13 } from './recap13';
import { titleMatchKey } from '../components/lessons/refreshMaterials';

const CLASS_ID = 'klasa-testowa';

describe('buildRecap4', () => {
  it('tworzy szesc lekcji i szesc zestawow pytan (jeden zestaw na lekcje - bez osobnych zestawow powtorkowych)', () => {
    const bundle = buildRecap4('V', [CLASS_ID]);
    expect(bundle.lessons).toHaveLength(6);
    expect(bundle.questionSets).toHaveLength(6);
    for (const lesson of bundle.lessons) {
      expect(lesson.grade).toBe('V');
      expect(lesson.progress).toEqual({});
      expect(lesson.dzial).toBe('Powtórka klasy 4');
      // reviewQuestionSetId wskazuje na WLASNY zestaw lekcji (patrz src/lib/recap.ts).
      expect(lesson.reviewQuestionSetId).toBe(lesson.questionSetId);
    }
    for (const set of bundle.questionSets) {
      expect(set.classIds).toEqual([CLASS_ID]);
    }
  });

  it('kazda lekcja ma zamykajacy slajd recap (mode po-lekcji) na wlasnym zestawie i, od drugiej lekcji, otwierajacy slajd (mode powtorzeniowe) na zestawie poprzedniej lekcji', () => {
    const bundle = buildRecap4('V', [CLASS_ID]);
    bundle.lessons.forEach((lesson, idx) => {
      const recapSlides = lesson.slides.filter((s) => s.kind === 'recap');
      const closing = recapSlides[recapSlides.length - 1];
      if (closing.kind !== 'recap') throw new Error('spodziewany slajd recap');
      expect(closing.questionSetId).toBe(lesson.questionSetId);
      expect(closing.mode).toBe('po-lekcji');
      expect(bundle.questionSets.some((qs) => qs.id === closing.questionSetId)).toBe(true);

      if (idx === 0) {
        expect(recapSlides).toHaveLength(1);
      } else {
        expect(recapSlides).toHaveLength(2);
        const opening = recapSlides[0];
        if (opening.kind !== 'recap') throw new Error('spodziewany slajd recap');
        const previousLesson = bundle.lessons[idx - 1];
        expect(opening.questionSetId).toBe(previousLesson.questionSetId);
        expect(opening.mode).toBe('powtorzeniowe');
      }
    });
  });

  it('kazde pytanie ma odpowiedz i nalezy do istniejacego zestawu', () => {
    const bundle = buildRecap4('V', [CLASS_ID]);
    const setIds = new Set(bundle.questionSets.map((qs) => qs.id));
    expect(bundle.questions.length).toBeGreaterThan(0);
    for (const question of bundle.questions) {
      expect(question.text.trim()).not.toBe('');
      expect(question.answer?.trim()).toBeTruthy();
      expect(setIds.has(question.setId)).toBe(true);
    }
  });

  // Odswiezanie gotowych materialow dopasowuje lekcje po znormalizowanym tytule
  // (refreshMaterials.titleMatchKey). Gdyby ktorys tytul powtorki klasy 4 zderzyl
  // sie z tytulem z powtorki 1-3, "Odswiez gotowe materialy" podmienialoby lekcji
  // tresc na tresc z drugiego zestawu.
  it('tytuly lekcji nie kolidują z powtorka klas 1-3', () => {
    const klucze4 = buildRecap4('V', [CLASS_ID]).lessons.map((l) => titleMatchKey(l.title));
    const klucze13 = buildRecap13('IV', [CLASS_ID]).lessons.map((l) => titleMatchKey(l.title));
    expect(new Set([...klucze4, ...klucze13]).size).toBe(klucze4.length + klucze13.length);
  });

  it('tytuly lekcji sa unikalne wewnatrz powtorki', () => {
    const klucze = buildRecap4('V', [CLASS_ID]).lessons.map((l) => titleMatchKey(l.title));
    expect(new Set(klucze).size).toBe(klucze.length);
  });

  it('kolejne wywolania generuja nowe identyfikatory', () => {
    const a = buildRecap4('V', [CLASS_ID]);
    const b = buildRecap4('V', [CLASS_ID]);
    expect(a.questionSets[0].id).not.toBe(b.questionSets[0].id);
  });
});

describe('buildRecap13', () => {
  it('tworzy szesc lekcji i szesc zestawow pytan (jeden zestaw na lekcje - bez osobnych zestawow powtorkowych)', () => {
    const bundle = buildRecap13('IV', [CLASS_ID]);
    expect(bundle.lessons).toHaveLength(6);
    expect(bundle.questionSets).toHaveLength(6);
    for (const lesson of bundle.lessons) {
      expect(lesson.dzial).toBe('Powtórka 1-3');
      expect(lesson.reviewQuestionSetId).toBe(lesson.questionSetId);
    }
  });

  it('kazda lekcja ma zamykajacy slajd recap (mode po-lekcji) na wlasnym zestawie i, od drugiej lekcji, otwierajacy slajd (mode powtorzeniowe) na zestawie poprzedniej lekcji', () => {
    const bundle = buildRecap13('IV', [CLASS_ID]);
    bundle.lessons.forEach((lesson, idx) => {
      const recapSlides = lesson.slides.filter((s) => s.kind === 'recap');
      const closing = recapSlides[recapSlides.length - 1];
      if (closing.kind !== 'recap') throw new Error('spodziewany slajd recap');
      expect(closing.questionSetId).toBe(lesson.questionSetId);
      expect(closing.mode).toBe('po-lekcji');
      expect(bundle.questionSets.some((qs) => qs.id === closing.questionSetId)).toBe(true);

      if (idx === 0) {
        expect(recapSlides).toHaveLength(1);
      } else {
        expect(recapSlides).toHaveLength(2);
        const opening = recapSlides[0];
        if (opening.kind !== 'recap') throw new Error('spodziewany slajd recap');
        const previousLesson = bundle.lessons[idx - 1];
        expect(opening.questionSetId).toBe(previousLesson.questionSetId);
        expect(opening.mode).toBe('powtorzeniowe');
      }
    });
  });

  it('kazde pytanie ma odpowiedz i nalezy do istniejacego zestawu', () => {
    const bundle = buildRecap13('IV', [CLASS_ID]);
    const setIds = new Set(bundle.questionSets.map((qs) => qs.id));
    expect(bundle.questions.length).toBeGreaterThan(0);
    for (const question of bundle.questions) {
      expect(question.text.trim()).not.toBe('');
      expect(question.answer?.trim()).toBeTruthy();
      expect(setIds.has(question.setId)).toBe(true);
    }
  });

  it('tytuly lekcji sa unikalne wewnatrz powtorki', () => {
    const klucze = buildRecap13('IV', [CLASS_ID]).lessons.map((l) => titleMatchKey(l.title));
    expect(new Set(klucze).size).toBe(klucze.length);
  });
});
