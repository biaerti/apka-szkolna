import { describe, expect, it } from 'vitest';
import { cegielki, porownajSlowo, porownajZdanie, punktyZdania } from './dyktando';
import { DYKTANDA, maksPunktow, slugAudio } from '../data/dyktanda';

const litery = (s: string) => cegielki(s).map((c) => c.litery);

describe('cegielki', () => {
  it('dzieli na polskie dwuznaki i miekkie spolgloski', () => {
    expect(litery('szkoła')).toEqual(['sz', 'k', 'o', 'ł', 'a']);
    expect(litery('chleb')).toEqual(['ch', 'l', 'e', 'b']);
    expect(litery('siedzi')).toEqual(['si', 'e', 'dz', 'i']);
    expect(litery('obiad')).toEqual(['o', 'b', 'ia', 'd']);
    expect(litery('rzeka')).toEqual(['rz', 'e', 'k', 'a']);
  });
});

describe('porownajSlowo', () => {
  it('poprawne slowo', () => {
    const w = porownajSlowo('szkoła', 'szkoła');
    expect(w.ok).toBe(true);
    expect(w.wskazowki).toEqual([]);
  });

  it('sh zamiast sz - podpowiedz sz = ш', () => {
    const w = porownajSlowo('shkoła', 'szkoła');
    expect(w.ok).toBe(false);
    expect(w.znaki[1].status).toBe('zly');
    expect(w.wskazowki.map((x) => x.litery)).toEqual(['sz']);
  });

  it('brak kreski w ł', () => {
    const w = porownajSlowo('szkola', 'szkoła');
    expect(w.znaki[4]).toEqual({ znak: 'ł', status: 'zly' });
    expect(w.wskazowki.map((x) => x.litery)).toEqual(['ł']);
  });

  it('ch zamiast cz', () => {
    const w = porownajSlowo('chapka', 'czapka');
    expect(w.wskazowki.map((x) => x.litery)).toEqual(['cz']);
  });

  it('s zamiast sz - brakujaca litera', () => {
    const w = porownajSlowo('mys', 'mysz');
    expect(w.znaki[3].status).toBe('brak');
    expect(w.wskazowki.map((x) => x.litery)).toEqual(['sz']);
  });

  it('dopisana litera', () => {
    const w = porownajSlowo('dachh', 'dach');
    expect(w.ok).toBe(false);
    expect(w.wskazowki.map((x) => x.litery)).toEqual(['ch']);
  });

  it('wielka litera nie psuje slowa, ale jest zaznaczona', () => {
    const w = porownajSlowo('to', 'To');
    expect(w.ok).toBe(true);
    expect(w.wielkaLitera).toBe(true);
  });
});

describe('porownajZdanie', () => {
  it('ignoruje interpunkcje', () => {
    const w = porownajZdanie('To jest moja szkoła', 'To jest moja szkoła.');
    expect(punktyZdania(w)).toBe(4);
  });

  it('pominiete i bledne slowo', () => {
    const w = porownajZdanie('Mucha sedzi na dahu', 'Mucha siedzi na dachu.');
    expect(w.map((x) => x.ok)).toEqual([true, false, true, false]);
    expect(w[3].wskazowki.map((x) => x.litery)).toEqual(['ch']);
  });

  it('pominiete slowo', () => {
    const w = porownajZdanie('Kot szare uszy', 'Kot ma szare uszy.');
    expect(w.map((x) => x.wpisane)).toEqual(['Kot', null, 'szare', 'uszy']);
    expect(punktyZdania(w)).toBe(3);
  });

  it('dopisane slowo', () => {
    const w = porownajZdanie('Czas na na obiad', 'Czas na obiad.');
    expect(w.filter((x) => !x.wzor)).toHaveLength(1);
    expect(punktyZdania(w)).toBe(3);
  });
});

describe('dane dyktand', () => {
  it('slug audio', () => {
    expect(slugAudio('To jest moja szkoła.')).toBe('to-jest-moja-szkola');
  });

  it('kazda lekcja ma tresc i unikalne pliki audio', () => {
    for (const l of DYKTANDA) {
      expect(l.slowa.length).toBeGreaterThanOrEqual(6);
      expect(l.zdania.length).toBeGreaterThanOrEqual(4);
      expect(maksPunktow(l)).toBeGreaterThan(10);
      const teksty = new Set([...l.slowa, ...l.zdania, ...l.wstep.flatMap((r) => r.przyklady)].map((p) => p.pl));
      const slugi = new Set([...teksty].map(slugAudio));
      expect(slugi.size).toBe(teksty.size);
    }
  });
});
