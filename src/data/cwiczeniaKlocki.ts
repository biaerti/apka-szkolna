// Wspolne klocki do cwiczen "Ćwiczymy razem" (cwiczenia4.ts, cwiczenia5.ts):
// naglowki tabel odmiany i skroty, ktore skladaja znaczniki z
// src/lib/cwiczenia.ts, zeby nie pisac gwiazdek i nawiasow recznie.

import type { CwiczenieTabela } from './cwiczenia';

export type Wyraz = CwiczenieTabela['wyrazy'][number];

export const PRZYPADKI: Array<[string, string]> = [
  ['Mianownik', 'kto? co? (jest)'],
  ['Dopełniacz', 'kogo? czego? (nie ma)'],
  ['Celownik', 'komu? czemu? (się przyglądam)'],
  ['Biernik', 'kogo? co? (widzę)'],
  ['Narzędnik', 'z kim? z czym? (idę)'],
  ['Miejscownik', 'o kim? o czym? (mówię)'],
  ['Wołacz', 'o! (wołam)'],
];

export const OSOBY: Array<[string, string]> = [
  ['1. osoba', 'ja / my'],
  ['2. osoba', 'ty / wy'],
  ['3. osoba', 'on, ona, ono / oni, one'],
];

const luka = (forma: string) => `[[${forma}]]`;
const formy = (lista: string) => lista.split(',').map((s) => s.trim());

/** Wybor z listy: wybor(['fakt', 'opinia'], 'opinia') -> "{{fakt|*opinia}}". */
export function wybor(opcje: string[], dobra: string): string {
  if (!opcje.includes(dobra)) throw new Error(`Brak dobrej odpowiedzi „${dobra}” w ${opcje.join('/')}`);
  return `{{${opcje.map((o) => (o === dobra ? `*${o}` : o)).join('|')}}}`;
}

/**
 * Odmiana przez przypadki: kazda kolumna to 7 form po przecinku (warianty
 * przez |). Mianownik liczby pojedynczej jest podany, reszta to luki.
 */
export function odmiana(haslo: string, ...kolumny: string[]): Wyraz {
  const kol = kolumny.map(formy);
  const komorki = PRZYPADKI.map((_, w) => kol.map((k, c) => (w === 0 && c === 0 ? k[w] : luka(k[w]))));
  return { haslo, komorki };
}

/** Czas terazniejszy: 1-3 osoba w liczbie pojedynczej i mnogiej, wszystko do wpisania. */
export function osoby(haslo: string, lp: string, lm: string): Wyraz {
  const [p, m] = [formy(lp), formy(lm)];
  return { haslo, komorki: OSOBY.map((_, w) => [luka(p[w]), luka(m[w])]) };
}

/** Czas przeszly: kolumny rodzaj meski i zenski (lp.), meskoosobowy i niemeskoosobowy (lm.). */
export function przeszly(haslo: string, m: string, z: string, mos: string, nmos: string): Wyraz {
  const kol = [m, z, mos, nmos].map(formy);
  return { haslo, komorki: OSOBY.map((_, w) => kol.map((k) => luka(k[w]))) };
}

/** Regularny czas przeszly z jednego tematu: czyta- -> czytałem, czytaliśmy... */
export function przeszlyRegularny(haslo: string, temat: string, tematMos = temat): Wyraz {
  return przeszly(
    haslo,
    `${temat}łem, ${temat}łeś, ${temat}ł`,
    `${temat}łam, ${temat}łaś, ${temat}ła`,
    `${tematMos}liśmy, ${tematMos}liście, ${tematMos}li`,
    `${temat}łyśmy, ${temat}łyście, ${temat}ły`,
  );
}
