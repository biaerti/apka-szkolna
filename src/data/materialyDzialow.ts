// Materialy po dziale (materialy/<folder>/): zeszyt powtorzeniowy, sprawdzian i karta pracy.
// Zeszyt jest publiczny (public/materialy/, link dla uczniow do VULCANA).
// Sprawdzian, klucz i karta pracy z rozwiazaniami NIE moga byc w publicznym repo - leza w prywatnym buckecie
// Supabase "materialy" (wrzuca je materialy/wyslij.py) i otwieramy je przez podpisany URL.

import { getSupabase, isSupabaseConfigured } from './supabase';

export type MaterialyDzialu = {
  grade: string;
  /** Dokladnie taki jak Lesson.dzial - po nim pasek trafia do zakladki. */
  dzial: string;
  /** Folder w materialy/ i przedrostek plikow PDF. */
  folder: string;
  /** Jest karta pracy na 2 strony (materialy/karta.mjs) - wersja do druku i z rozwiazaniami. */
  karta?: boolean;
  /** false = dzial ma tylko karte pracy, bez zeszytu powtorzeniowego i sprawdzianu. */
  zeszytISprawdzian?: boolean;
};

export const MATERIALY_DZIALOW: MaterialyDzialu[] = [
  { grade: 'IV', dzial: 'Rozdział I. Poznajemy siebie i innych', folder: 'klasa4-rozdzial1', karta: true },
  { grade: 'IV', dzial: 'Rozdział II. Pośród słów i znaczeń', folder: 'klasa4-rozdzial2' },
  { grade: 'V', dzial: 'Dział 1 - W poszukiwaniu przyjaźni', folder: 'klasa5-dzial1', karta: true, zeszytISprawdzian: false },
  { grade: 'V', dzial: 'Dział 2 - Uwaga, uczucia!', folder: 'klasa5-dzial2' },
];

export function materialyDzialu(grade: string, dzial: string | undefined): MaterialyDzialu | undefined {
  if (!dzial) return undefined;
  return MATERIALY_DZIALOW.find((m) => m.grade.toUpperCase() === grade.toUpperCase() && m.dzial === dzial);
}

/** Publiczny link do zeszytu - ten wklejamy w VULCANIE. */
export function zeszytUrl(folder: string): string {
  return `https://szkola.klippi.pl/materialy/${folder}-powtorka.pdf`;
}

/** Pliki w prywatnym buckecie: <folder>-<rodzaj>.pdf */
export type PrywatnyPlik = 'sprawdzian' | 'sprawdzian-klucz' | 'karta' | 'karta-rozwiazania';

/** Podpisany adres sprawdzianu, klucza albo karty pracy z prywatnego bucketu. */
export async function prywatnyUrl(folder: string, rodzaj: PrywatnyPlik): Promise<string> {
  if (!isSupabaseConfigured()) throw new Error('Plik jest w chmurze - zaloguj się.');
  const { data, error } = await getSupabase().storage.from('materialy').createSignedUrl(`${folder}-${rodzaj}.pdf`, 60 * 60);
  if (error || !data) throw new Error('Brak pliku w chmurze albo nie jesteś zalogowany.');
  return data.signedUrl;
}
