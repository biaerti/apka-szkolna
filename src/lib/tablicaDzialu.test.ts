import { describe, expect, it } from 'vitest';
import { mapaWiedzy, numerDzialu } from '../data/mapaWiedzy';
import { stanPunktu, szkicTablicy, zawin } from './tablicaDzialu';

describe('numerDzialu', () => {
  it('czyta rzymski numer rozdzialu i arabski numer dzialu', () => {
    expect(numerDzialu('Rozdział III. Od pomysłu do działania')).toBe(3);
    expect(numerDzialu('Rozdział II. Pośród słów i znaczeń')).toBe(2);
    expect(numerDzialu('Dział 2 - Uwaga, uczucia!')).toBe(2);
    expect(numerDzialu('Powtórka 1-3')).toBeNull();
    expect(numerDzialu(undefined)).toBeNull();
  });
});

describe('szkicTablicy', () => {
  const punkty = mapaWiedzy('IV');
  const opis = { klasa: 'Klasa IV', dzial: 'Rozdział III. Od pomysłu do działania', numer: 3, punkty };

  it('pusta tablica nie ma elementow', () => {
    expect(szkicTablicy({ ...opis, tryb: 'pusta' })).toEqual([]);
  });

  it('dzial przed nami jest zolty, wczesniejsze zielone, pozniejsze w jednej karcie "Potem"', () => {
    const elementy = szkicTablicy({ ...opis, tryb: 'przed' });
    const karty = elementy.filter((e) => e.type === 'rectangle');
    const przymiotnik = karty.find((k) => k.label.text.startsWith('Przymiotnik\n'));
    const czasownik = karty.find((k) => k.label.text.startsWith('Czasownik\n'));
    expect(przymiotnik?.backgroundColor).toBe('#ffec99');
    expect(czasownik?.backgroundColor).toBe('#d3f9d8');
    expect(karty.some((k) => k.label.text.startsWith('Przyimek'))).toBe(false);
    const potem = karty.filter((k) => k.label.text.startsWith('Potem:'));
    expect(potem.find((k) => k.label.text.includes('przyimek'))).toBeDefined();
  });

  it('po dziale nowe punkty maja ptaszek', () => {
    const karty = szkicTablicy({ ...opis, tryb: 'po' }).filter((e) => e.type === 'rectangle');
    expect(karty.some((k) => k.label.text.startsWith('✓ Ó i u'))).toBe(true);
  });

  it('kazdy punkt mapy ma nazwe, przyklad i stan wzgledem dzialu', () => {
    for (const grade of ['IV', 'V']) {
      for (const punkt of mapaWiedzy(grade)) {
        expect(punkt.nazwa.length).toBeGreaterThan(0);
        expect(punkt.przyklad.length).toBeGreaterThan(0);
        expect(stanPunktu(punkt, punkt.dzial)).toBe('teraz');
      }
    }
  });
});

describe('zawin', () => {
  it('lamie po slowach i zostawia istniejace nowe linie', () => {
    expect(zawin('ala ma kota i psa', 8)).toBe('ala ma\nkota i\npsa');
    expect(zawin('Czasownik\nco robi?', 20)).toBe('Czasownik\nco robi?');
  });
});
