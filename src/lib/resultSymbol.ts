// Jeden zestaw symboli ocen z kola fortuny - ten sam na przyciskach, w liscie
// uczniow i w historii pytan. Dzieci maja rozpoznawac znak, a nie czytac slowo:
//
//   +   plus (dobra odpowiedz)      .   kropka (odpowiedz czesciowa)
//   ▣   plomba (zla odpowiedz)      P   pas ("dzisiaj nie odpowiadam")
//
// Plomba to znak "zaplombowanego" pola - celowo nie minus, bo w dzienniku minus
// znaczy co innego, a nazwa "plomba" ma nie kojarzyc sie z kara.
// Znaki trzymamy w podstawowym Unicode, zeby narysowaly sie tez na szkolnym
// Chrome 109 na Windows.

import type { RecapResult } from '../data/types';

export interface ResultSymbol {
  /** Znak na ekranie - krotki, czytelny z ostatniej lawki. */
  symbol: string;
  /** Nazwa uzywana w rozmowie z klasa. */
  label: string;
  /** Klasa Tailwind z kolorem tekstu. */
  color: string;
  /** Klasa Tailwind z tlem odznaki. */
  bg: string;
}

export const RESULT_SYMBOLS: Record<RecapResult, ResultSymbol> = {
  plus: { symbol: '+', label: 'plus', color: 'text-emerald-300', bg: 'bg-emerald-900/60' },
  kropka: { symbol: '•', label: 'kropka', color: 'text-sky-300', bg: 'bg-sky-900/60' },
  plomba: { symbol: '▣', label: 'plomba', color: 'text-red-300', bg: 'bg-red-900/60' },
  hint_plomba: {
    symbol: '▣',
    label: 'plomba za podpowiadanie',
    color: 'text-red-300',
    bg: 'bg-red-900/40',
  },
  pass: { symbol: 'P', label: 'pas', color: 'text-amber-300', bg: 'bg-amber-900/60' },
  uwaga: { symbol: '!', label: 'uwaga', color: 'text-orange-300', bg: 'bg-orange-900/60' },
  rozliczenie: { symbol: '✓', label: 'rozliczenie', color: 'text-gray-300', bg: 'bg-gray-800' },
  jedynka: { symbol: '1', label: 'jedynka', color: 'text-red-300', bg: 'bg-red-900/60' },
  piatka: { symbol: '5', label: 'piątka', color: 'text-emerald-300', bg: 'bg-emerald-900/60' },
};

export function resultSymbol(result: RecapResult): ResultSymbol {
  return RESULT_SYMBOLS[result];
}
