import { describe, expect, it } from 'vitest';
import { losujMikolajki } from './mikolajki';

describe('losujMikolajki', () => {
  it('kazdy daje raz i dostaje raz, nikt nie losuje siebie', () => {
    for (let n = 2; n <= 30; n++) {
      const ids = Array.from({ length: n }, (_, i) => `u${i}`);
      for (let proba = 0; proba < 20; proba++) {
        const pary = losujMikolajki(ids);
        expect(pary).toHaveLength(n);
        expect(new Set(pary.map((p) => p.kto))).toEqual(new Set(ids));
        expect(new Set(pary.map((p) => p.komu))).toEqual(new Set(ids));
        expect(pary.every((p) => p.kto !== p.komu)).toBe(true);
      }
    }
  });

  it('od 3 osob nie ma par wzajemnych', () => {
    const ids = Array.from({ length: 25 }, (_, i) => `u${i}`);
    const pary = losujMikolajki(ids);
    const komu = new Map(pary.map((p) => [p.kto, p.komu]));
    expect(pary.every((p) => komu.get(p.komu) !== p.kto)).toBe(true);
  });

  it('jedna osoba albo nikt - brak losowania', () => {
    expect(losujMikolajki([])).toEqual([]);
    expect(losujMikolajki(['a'])).toEqual([]);
  });
});
