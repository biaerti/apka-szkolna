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
  { id: 'plan-ramowy-film1', lekcja: '15', title: 'Plan ramowy - najważniejsze wydarzenia po kolei (4 zadania)' },
  { id: 'podsumowanie4-dzial1-film1', lekcja: '16', title: 'Podsumowanie rozdziału I - Co już wiesz? Co umiesz? (5 zadań)' },
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
  { id: 'rzeczownik-film1', lekcja: 'V.22', title: 'Rzeczownik - rodzaj, przypadki, własne i pospolite (4 zadania)' },
  { id: 'nietypowe-film1', lekcja: 'V.23', title: 'Nietypowa odmiana - muzeum, jedne drzwi (4 zadania)' },
  { id: 'ogonki-film1', lekcja: 'V.24', title: 'Ę i ą na końcu wyrazu (3 zadania)' },
  { id: 'temat-film1', lekcja: 'V.25', title: 'Temat i końcówka, trik na ó (3 zadania)' },
  { id: 'sprawozdanie-film1', lekcja: 'V.26', title: 'Sprawozdanie - części, fakty, słowa porządkujące (4 zadania)' },
  { id: 'dwukropek-film1', lekcja: 'V.27', title: 'Dwukropek i piszemy sprawozdanie (4 zadania)' },
  { id: 'reklama-film1', lekcja: 'V.28', title: 'Tekst reklamowy - słowa, sztuczki, prawda (4 zadania)' },
  { id: 'podsumowanie5-dzial2-film1', lekcja: 'V.29', title: 'Podsumowanie działu 2 - To wiem! To potrafię! (5 zadań)' },
  // Klasa 4, rozdzial II "Pośród słów i znaczeń" - plan: docs/klasa4-rozdzial2-posrod-slow.md
  { id: 'potoczne-film1', lekcja: '18', title: 'Wyrazy potoczne - kiedy wolno, a kiedy nie (4 zadania)' },
  { id: 'porownanie-film1', lekcja: '19', title: 'Porównanie - jak, jakby, niczym, niby (4 zadania)' },
  { id: 'synonimy-film1', lekcja: '20', title: 'Synonimy i antonimy (4 zadania)' },
  { id: 'list-film1', lekcja: '21', title: 'Jak się pisze list? (4 zadania)' },
  { id: 'rzeczownik4-film1', lekcja: '22', title: 'Rzeczownik - co nazywa, liczba i rodzaj (4 zadania)' },
  { id: 'przypadki-film1', lekcja: '23', title: 'Przypadki - drużyna siedmiu pomocników (4 zadania)' },
  { id: 'przypadki-mnoga-film1', lekcja: '24', title: 'Przypadki w liczbie mnogiej (4 zadania)' },
  { id: 'opinia-film1', lekcja: '25', title: 'Opinia i argument (4 zadania)' },
  { id: 'asertywnosc-film1', lekcja: '26', title: 'Asertywność - jak grzecznie powiedzieć NIE (4 zadania)' },
  { id: 'wielka-litera-film1', lekcja: '27', title: 'Wielka czy mała litera? (4 zadania)' },
  { id: 'nie-rzeczownik-film1', lekcja: '28', title: 'Nie z rzeczownikami (4 zadania)' },
  { id: 'podsumowanie4-dzial2-film1', lekcja: '29', title: 'Podsumowanie rozdziału II - Pośród słów i znaczeń' },
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
