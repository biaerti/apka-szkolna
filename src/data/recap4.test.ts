import { describe, expect, it } from 'vitest';
import { buildRecap4 } from './recap4';
import { buildRecap13 } from './recap13';
import { titleMatchKey } from '../components/lessons/refreshMaterials';

const CLASS_ID = 'klasa-testowa';

describe('buildRecap4', () => {
  it('tworzy trzy lekcje i trzy zestawy pytan', () => {
    const bundle = buildRecap4('V', [CLASS_ID]);
    expect(bundle.lessons).toHaveLength(3);
    expect(bundle.questionSets).toHaveLength(3);
    for (const lesson of bundle.lessons) {
      expect(lesson.grade).toBe('V');
      expect(lesson.progress).toEqual({});
    }
    for (const set of bundle.questionSets) {
      expect(set.classIds).toEqual([CLASS_ID]);
    }
  });

  it('kazda lekcja ma slajd powtorki wskazujacy na wlasny zestaw pytan', () => {
    const bundle = buildRecap4('V', [CLASS_ID]);
    for (const lesson of bundle.lessons) {
      const recapSlides = lesson.slides.filter((s) => s.kind === 'recap');
      expect(recapSlides).toHaveLength(1);
      const recap = recapSlides[0];
      if (recap.kind !== 'recap') throw new Error('spodziewany slajd recap');
      expect(recap.questionSetId).toBe(lesson.questionSetId);
      expect(bundle.questionSets.some((qs) => qs.id === recap.questionSetId)).toBe(true);
    }
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
