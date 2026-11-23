import { describe, expect, it } from 'vitest';
import { cegielki, porownajSlowo, porownajZdanie, punktyZdania } from './dyktando';
import { DYKTANDA, maksPunktow, polski, slugAudio } from '../data/dyktanda';

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
      expect(l.test.slowa.length + l.test.zdania.length).toBeGreaterThanOrEqual(5);
      expect(maksPunktow(l)).toBeGreaterThan(10);
      const wszystkie = [
        ...l.slowa, ...l.zdania, ...l.cwiczenie, ...l.test.slowa, ...l.test.zdania,
        ...l.wstep.flatMap((r) => r.przyklady),
      ];
      const teksty = new Set(wszystkie.map((p) => p.pl));
      const slugi = new Set([...teksty].map(slugAudio));
      expect(slugi.size).toBe(teksty.size);
    }
  });

  it('kazdy tekst ma tlumaczenie ukrainskie i hiszpanskie', () => {
    for (const l of DYKTANDA) {
      const teksty = [
        l.intro, ...l.wstep, ...l.slowa, ...l.zdania, ...l.cwiczenie, ...l.test.slowa, ...l.test.zdania,
        ...l.zapamietaj.punkty, ...l.wstep.flatMap((r) => r.przyklady),
      ];
      for (const t of teksty) {
        expect(t.ua, t.pl).toBeTruthy();
        expect(t.es, t.pl).toBeTruthy();
      }
      expect(l.tematUa && l.tematEs).toBeTruthy();
      for (const r of l.wstep) expect(r.dzwiek && r.dzwiekEs && r.lektor).toBeTruthy();
    }
  });

  it('hiszpanskojezyczny nie widzi cyrylicy ani wzmianki o ukrainskim', () => {
    for (const l of DYKTANDA) {
      for (const t of [l.intro, ...l.wstep, ...l.zapamietaj.punkty]) {
        expect(polski(t, 'es'), t.pl).not.toMatch(/[\u0400-\u04FF]|ukrai/i);
      }
    }
  });

  it('w cwiczeniu luka jest w slowie i jest jedna z liter lekcji', () => {
    for (const l of DYKTANDA) {
      const litery = l.wstep.map((r) => r.litery);
      for (const c of l.cwiczenie) {
        expect(c.pl.toLowerCase(), c.pl).toContain(c.luka);
        expect(litery).toContain(c.luka);
      }
    }
  });

  it('lektorka nie czyta golych liter ani nawiasow (TTS czyta je zle)', () => {
    for (const l of DYKTANDA) {
      for (const t of [l.intro.lektor, l.zapamietaj.lektor, ...l.wstep.map((r) => r.lektor)]) {
        expect(t).not.toMatch(/[[\]+=]/);
        for (const r of l.wstep) expect(t.split(/[\s.,:!?]+/)).not.toContain(r.litery);
      }
    }
  });
});
