// Filmiki lekcyjne (HTML + narracja ElevenLabs -> mp4, patrz filmiki/czasownik/).
// Puszczane w prezentacji jako slajd `video`.
//
// Mp4 nie leza w repo (po kilka MB, generuja sie skryptem renderuj.mjs). W
// produkcji sa w prywatnym buckecie Supabase Storage "filmiki" (wrzuca je
// filmiki/wyslij.py) i odtwarzamy je przez podpisany URL - tak jak czytanki.
// W dev ida z public/filmiki/ (gitignorowane).

import { getSupabase, isSupabaseConfigured } from './supabase';

export type Filmik = {
  /** Nazwa pliku mp4 bez rozszerzenia (output/filmiki/<id>.mp4). */
  id: string;
  /** Numer lekcji z podrecznika, np. "12-13". */
  lekcja: string;
  title: string;
};

export const FILMIKI: Filmik[] = [
  { id: 'czasownik-film1', lekcja: '11', title: 'Czasownik - czynności, stany i „nie”' },
  { id: 'czasownik-film2', lekcja: '12-13', title: 'Odmiana czasownika - osoba, liczba, czas, rodzaj' },
  { id: 'opowiadanie-film1', lekcja: 'V.3', title: 'Opowiadanie - co to jest i jak je napisać' },
];

export function filmikById(id: string): Filmik | undefined {
  return FILMIKI.find((f) => f.id === id);
}

const WAZNOSC_URL_S = 8 * 60 * 60; // caly dzien lekcji bez ponownego podpisywania

/** Adres mp4 do odtworzenia. Rzuca blad z czytelnym komunikatem, gdy nie da sie go dostac. */
export async function filmikUrl(id: string): Promise<string> {
  const plik = `${id}.mp4`;
  if (import.meta.env.DEV || !isSupabaseConfigured()) return `/filmiki/${plik}`;
  const { data, error } = await getSupabase().storage.from('filmiki').createSignedUrl(plik, WAZNOSC_URL_S);
  if (error || !data) throw new Error('Brak filmu w chmurze albo nie jesteś zalogowany.');
  return data.signedUrl;
}
