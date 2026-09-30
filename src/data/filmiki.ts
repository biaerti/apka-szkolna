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
  // Wszystko w jednym: 4 zadania bez sprawdzania - odpowiedzi rozlicza kolo fortuny po filmie.
  { id: 'czasownik-film3', lekcja: '11-13', title: 'Czasownik w całości - 4 zadania + koło fortuny' },
  { id: 'wypowiedzenia-film1', lekcja: '14', title: 'Zdanie i równoważnik zdania - 4 zadania' },
  { id: 'opowiadanie-film1', lekcja: 'V.3', title: 'Opowiadanie - co to jest i jak je napisać' },
  // Przypomnienie z s. 23 + miekkie/twarde, syczace/szumiace/ciszace, dzwieczne - 5 zadan pod kolo fortuny.
  { id: 'gloski-film1', lekcja: 'V.4', title: 'Głoski - miękkie, syczące, dźwięczne (5 zadań)' },
  { id: 'tryby-czasownika-film1', lekcja: 'V.13', title: 'Tryby czasownika - informacja, polecenie i przypuszczenie' },
  { id: 'wikipedia-film1', lekcja: 'V.15', title: 'Wikipedia - czy można jej wierzyć? (3 zadania)' },
  // Podsumowanie s. 56 - caly dzial 1 kl. 5 w 10 min, 8 zadan ze sprawdzeniem po kazdym.
  { id: 'podsumowanie5-dzial1-film1', lekcja: 'V.16', title: 'Podsumowanie działu 1 - To wiem! To potrafię! (8 zadań)' },
  // Dzial 2 kl. 5: filmik do kazdej lekcji, zadania ze sprawdzeniem + podsumowanie na koncu.
  { id: 'przenosnia-film1', lekcja: 'V.17', title: 'Przenośnia - porównanie, przenośnia, jak ją odczytać (4 zadania)' },
  { id: 'frazeologizmy-film1', lekcja: 'V.18', title: 'Związki frazeologiczne - czuć miętę, serce, uczucia (4 zadania)' },
  { id: 'zdrobnienia-film1', lekcja: 'V.19', title: 'Zdrobnienia i zgrubienia, siła uczuć (4 zadania)' },
  { id: 'zlosc-film1', lekcja: 'V.20', title: '„Lwy” - co robić ze złością? (4 zadania)' },
  { id: 'recytacja-film1', lekcja: 'V.21', title: 'Jak recytować? (2 zadania na głos)' },
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
