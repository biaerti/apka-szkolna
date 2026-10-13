import { describe, expect, it } from 'vitest';
import { CWICZENIA } from '../data/cwiczenia';
import { liczbaPol, liczbaStron, normalizuj, parsujLinie, podzielNaKomorki, sprawdzLuke, sprawdzWybor, stronaPrzykladow, szerokosciKolumn } from './cwiczenia';

describe('parsujLinie', () => {
  it('rozbija linie na tekst, luki i wybory', () => {
    expect(parsujLinie('kot → [[koty|kotki]] i {{ten|*ta}} mysz')).toEqual([
      { t: 'tekst', v: 'kot → ' },
      { t: 'luka', odp: ['koty', 'kotki'], otwarta: false },
      { t: 'tekst', v: ' i ' },
      { t: 'wybor', opcje: ['ten', 'ta'], dobra: 1 },
      { t: 'tekst', v: ' mysz' },
    ]);
  });

  it('" | " poza znacznikami dzieli przyklad na kolumny, wewnatrz wyboru nie', () => {
    const k = parsujLinie('dzień - noc | {{synonimy|*antonimy}}');
    expect(podzielNaKomorki(k)).toEqual([[{ t: 'tekst', v: 'dzień - noc' }], [{ t: 'wybor', opcje: ['synonimy', 'antonimy'], dobra: 1 }]]);
  });

  it('pola w kolumnie maja jedna szerokosc z calego cwiczenia', () => {
    expect(szerokosciKolumn(['kot | [[koty]]', 'księżniczka | [[księżniczki]]'])).toEqual([undefined, 13]);
  });

  it('znak zapytania oznacza luke otwarta', () => {
    expect(parsujLinie('zimny jak [[?lód|sopel]]')[1]).toEqual({ t: 'luka', odp: ['lód', 'sopel'], otwarta: true });
  });
});

describe('sprawdzLuke', () => {
  const luka = { odp: ['kocie'], otwarta: false };

  it('ignoruje wielkosc liter, spacje i kropki', () => {
    expect(sprawdzLuke('  Kocie. ', luka)).toBe('dobrze');
    expect(normalizuj('„Ala”  ma!')).toBe('ala ma');
  });

  it('przyjmuje forme z przyimkiem albo pomocnikiem z tabeli', () => {
    expect(sprawdzLuke('o kocie', luka)).toBe('dobrze');
    expect(sprawdzLuke('kotem', luka)).toBe('zle');
    expect(sprawdzLuke('', luka)).toBe('puste');
  });

  it('ortografia sie liczy: "u" to nie "ó"', () => {
    expect(sprawdzLuke('kurtka', { odp: ['kórtka'], otwarta: false })).toBe('zle');
  });

  it('luka otwarta spoza listy czeka na decyzje klasy', () => {
    const otwarta = { odp: ['lód'], otwarta: true };
    expect(sprawdzLuke('lód', otwarta)).toBe('dobrze');
    expect(sprawdzLuke('lodówka', otwarta)).toBe('otwarta');
  });

  it('w cwiczeniach o wielkiej literze wielkosc sie liczy', () => {
    expect(sprawdzLuke('kraków', { odp: ['Kraków'], otwarta: false }, true)).toBe('zle');
    // Nazwa wlasna spoza listy, ale mala litera - to blad, nie "sprawdz sam".
    expect(sprawdzLuke('pilica', { odp: ['Wisła'], otwarta: true }, true)).toBe('zle');
    expect(sprawdzLuke('Pilica', { odp: ['Wisła'], otwarta: true }, true)).toBe('otwarta');
  });

  it('przecinki w kolejnosci alfabetycznej nie sa obowiazkowe', () => {
    expect(sprawdzLuke('chata kasa ziomek', { odp: ['chata, kasa, ziomek'], otwarta: false })).toBe('dobrze');
  });
});

describe('sprawdzWybor i strony', () => {
  it('ocenia wybor', () => {
    expect(sprawdzWybor(undefined, 1)).toBe('puste');
    expect(sprawdzWybor(1, 1)).toBe('dobrze');
    expect(sprawdzWybor(0, 1)).toBe('zle');
  });

  it('dzieli przyklady na strony', () => {
    expect(stronaPrzykladow([1, 2, 3, 4, 5], 1, 2)).toEqual([3, 4]);
    expect(liczbaStron(5, 2)).toBe(3);
    expect(liczbaStron(0, 6)).toBe(1);
  });
});

describe('rejestr cwiczen', () => {
  it('ma unikalne id', () => {
    const ids = CWICZENIA.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('kazdy przyklad ma pole do uzupelnienia, a kazdy wybor jedna gwiazdke', () => {
    for (const c of CWICZENIA) {
      const linie = c.typ === 'luki' ? c.przyklady : c.wyrazy.flatMap((w) => w.komorki.flat());
      if (c.typ === 'luki') {
        for (const l of linie) expect(liczbaPol(parsujLinie(l)), `${c.id}: ${l}`).toBeGreaterThan(0);
      }
      for (const l of linie) {
        for (const m of l.matchAll(/\{\{(.+?)\}\}/g)) {
          expect(m[1].split('|').filter((o) => o.startsWith('*')), `${c.id}: ${l}`).toHaveLength(1);
        }
        expect(l.includes('[[') || l.includes('{{') ? parsujLinie(l).some((k) => k.t !== 'tekst') : true).toBe(true);
      }
    }
  });

  it('miesci sie na kartce: najwyzej 6 wierszy w kolumnie i 3 strony przykladow', () => {
    for (const c of CWICZENIA) {
      if (c.typ !== 'luki') continue;
      const naRaz = c.naRaz ?? 6;
      expect(c.kolumny === 2 ? naRaz / 2 : naRaz, c.id).toBeLessThanOrEqual(6);
      expect(Math.ceil(c.przyklady.length / naRaz), c.id).toBeLessThanOrEqual(3);
    }
  });

  it('tabele maja tyle komorek, ile wierszy i kolumn', () => {
    for (const c of CWICZENIA) {
      if (c.typ !== 'tabela') continue;
      for (const w of c.wyrazy) {
        expect(w.komorki, `${c.id}: ${w.haslo}`).toHaveLength(c.wiersze.length);
        for (const r of w.komorki) expect(r, `${c.id}: ${w.haslo}`).toHaveLength(c.kolumny.length);
        expect(w.komorki.flat().every((k) => !k.includes('undefined')), `${c.id}: ${w.haslo}`).toBe(true);
      }
    }
  });
});
