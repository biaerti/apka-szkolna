// Materialy po dziale (materialy/<folder>/): zeszyt powtorzeniowy i sprawdzian.
// Zeszyt jest publiczny (public/materialy/, link dla uczniow do VULCANA).
// Sprawdzian i klucz NIE moga byc w publicznym repo - leza w prywatnym buckecie
// Supabase "materialy" (wrzuca je materialy/wyslij.py) i otwieramy je przez podpisany URL.

import { getSupabase, isSupabaseConfigured } from './supabase';

export type MaterialyDzialu = {
  grade: string;
  /** Dokladnie taki jak Lesson.dzial - po nim pasek trafia do zakladki. */
  dzial: string;
  /** Folder w materialy/ i przedrostek plikow PDF. */
  folder: string;
};

export const MATERIALY_DZIALOW: MaterialyDzialu[] = [
  { grade: 'IV', dzial: 'Rozdział I. Poznajemy siebie i innych', folder: 'klasa4-rozdzial1' },
  { grade: 'IV', dzial: 'Rozdział II. Pośród słów i znaczeń', folder: 'klasa4-rozdzial2' },
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

/** Podpisany adres sprawdzianu albo klucza z prywatnego bucketu. */
export async function sprawdzianUrl(folder: string, klucz = false): Promise<string> {
  const plik = `${folder}-sprawdzian${klucz ? '-klucz' : ''}.pdf`;
  if (!isSupabaseConfigured()) throw new Error('Sprawdzian jest w chmurze - zaloguj się.');
  const { data, error } = await getSupabase().storage.from('materialy').createSignedUrl(plik, 60 * 60);
  if (error || !data) throw new Error('Brak sprawdzianu w chmurze albo nie jesteś zalogowany.');
  return data.signedUrl;
}
