// Rejestr cwiczen do slajdu "Ćwiczymy razem" (kind: 'cwiczenie'). Slajd
// trzyma tylko id, a tresc zyje tutaj - jak filmiki i czytanki - zeby
// poprawka przykladu nie wymagala odswiezania lekcji w bazie.
//
// Bartek (2026-10-13): na prezentacji brakowalo zadan robionych wspolnie, na
// wielu przykladach naraz, z "Sprawdź". Dwa typy:
// - `luki`: lista przykladow ze znacznikami z src/lib/cwiczenia.ts
//   ([[odp]], [[?otwarta]], {{a|*b}}), pokazywana stronami po `naRaz`,
// - `tabela`: odmiana (przypadki, osoby) - wiersze x kolumny, w kazdej
//   komorce tekst podany albo luka; "Następny wyraz" przewija zestaw.

import { CWICZENIA4 } from './cwiczenia4';

export interface CwiczenieLuki {
  id: string;
  typ: 'luki';
  tytul: string;
  polecenie: string;
  przyklady: string[];
  /**
   * Naglowki kolumn, gdy przyklady sa podzielone " | " na komorki - wtedy
   * cwiczenie rysuje sie jako rowna tabela (np. wyraz / synonim / antonim).
   */
  naglowki?: string[];
  /** Ile przykladow na jednym ekranie (domyslnie 6). */
  naRaz?: number;
  /** Krotkie przyklady w dwoch tabelach obok siebie (np. "kot | [[koty]]"). */
  kolumny?: 1 | 2;
  /** Luki sprawdzane z wielkoscia liter (cwiczenia o wielkiej literze). */
  wielkoscLiter?: boolean;
}

export interface CwiczenieTabela {
  id: string;
  typ: 'tabela';
  tytul: string;
  polecenie: string;
  /** Naglowki wierszy: [nazwa, podpowiedz], np. ['Dopełniacz', 'kogo? czego? (nie ma)']. */
  wiersze: Array<[string, string]>;
  kolumny: string[];
  /** Kazdy wyraz to osobny zestaw: komorki[wiersz][kolumna] w znacznikach. */
  wyrazy: Array<{ haslo: string; komorki: string[][] }>;
}

export type Cwiczenie = CwiczenieLuki | CwiczenieTabela;

export const CWICZENIA: Cwiczenie[] = [...CWICZENIA4];

export function cwiczenieById(id: string): Cwiczenie | undefined {
  return CWICZENIA.find((c) => c.id === id);
}
