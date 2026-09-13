// Czytanki z lektorem - glowne teksty z kolejnych lekcji podrecznika, nagrane
// przez ElevenLabs (audio-czytanki/generuj.py).
//
// Mp3 nie leza w repo (repo jest publiczne, a teksty/nagrania sa objete prawami
// autorskimi). W produkcji sa w PRYWATNYM buckecie Supabase Storage "czytanki"
// i odtwarzamy je przez podpisany URL, wiec slucha tylko zalogowany nauczyciel.
// W dev ida z public/audio/czytanki/ (tez gitignorowane).

import { getSupabase, isSupabaseConfigured } from './supabase';

export type Czytanka = {
  /** Nazwa pliku mp3 bez rozszerzenia - musi zgadzac sie z teksty/NN-<id>.txt. */
  id: string;
  /** Numer lekcji z podrecznika, np. "1-2" dla tematu na dwie godziny. */
  lekcja: string;
  temat: string;
  title: string;
  author?: string;
  pages: string; // np. "12-13" - strony w podreczniku
};

export const CZYTANKI: Czytanka[] = [
  { id: 'moje-lato-z-szablozebnym', lekcja: '1-2', temat: 'Krok po kroku tworzymy pierwszą wspólną opowieść', title: 'Moje lato z szablozębnym - całość', author: 'Weronika Kurosz', pages: '12-14' },
  { id: 'ja-rusinek', lekcja: '3', temat: 'Być sobą, czyli kim?', title: 'Ja', author: 'Michał Rusinek', pages: '16' },
  { id: 'notatka-kluczem-do-sukcesu', lekcja: '4', temat: 'Notatka kluczem do sukcesu', title: 'Każdy z nas ma niezwykłe narzędzie - to mózg', pages: '18' },
  { id: 'alfabet', lekcja: '5-6', temat: 'Sekrety wyrazów - głoski, litery i sylaby', title: 'Alfabet to zbiór liter', pages: '22' },
  { id: 'autoportret-chotomska', lekcja: '7', temat: 'Malujemy pędzlem i słowem', title: 'Autoportret', author: 'Wanda Chotomska', pages: '26' },
  { id: 'nauki-medrca', lekcja: '8', temat: 'Dlaczego warto być sobą?', title: 'Nauki mędrca', author: 'Michel Piquemal', pages: '29-30' },
  { id: 'dzien-kropki', lekcja: '9-10', temat: 'Dzień tematyczny: Międzynarodowy Dzień Kropki', title: 'Czym jest Dzień Kropki', pages: '33' },
  { id: 'kropka', lekcja: '9-10', temat: 'Dzień tematyczny: Międzynarodowy Dzień Kropki', title: 'Kropka', author: 'Peter H. Reynolds', pages: '33-34' },
  { id: 'wielka-historia-malej-kreski', lekcja: '9-10', temat: 'Dzień tematyczny: Międzynarodowy Dzień Kropki', title: 'Wielka historia małej kreski', author: 'Serge Bloch', pages: '35' },
  { id: 'co-robisz-z-pomyslem', lekcja: '9-10', temat: 'Dzień tematyczny: Międzynarodowy Dzień Kropki', title: 'Co robisz z pomysłem?', author: 'Kobi Yamada', pages: '36' },
  { id: 'historia-o-akceptacji', lekcja: '15', temat: 'Tworzymy plan ramowy', title: 'Historia o akceptacji. Stoję murem za Bartkiem', author: 'Marek Michalak', pages: '46-47' },
  { id: 'ksiaze-ktory-chcial-byc-zaba', lekcja: '16', temat: 'Co już wiesz? Co umiesz?', title: 'Książę, który chciał być żabą', author: 'Àlex Rovira, Francesc Miralles', pages: '50-52' },
];

export type GrupaCzytanek = { lekcja: string; temat: string; czytanki: Czytanka[] };

/** Czytanki w kolejnosci z rejestru, zgrupowane po lekcji - tak jak w podreczniku. */
export function grupujWgLekcji(czytanki: Czytanka[]): GrupaCzytanek[] {
  const grupy: GrupaCzytanek[] = [];
  for (const c of czytanki) {
    const ostatnia = grupy[grupy.length - 1];
    if (ostatnia && ostatnia.lekcja === c.lekcja) ostatnia.czytanki.push(c);
    else grupy.push({ lekcja: c.lekcja, temat: c.temat, czytanki: [c] });
  }
  return grupy;
}

const WAZNOSC_URL_S = 8 * 60 * 60; // caly dzien lekcji bez ponownego podpisywania

/** Adres mp3 do odtworzenia. Rzuca blad z czytelnym komunikatem, gdy nie da sie go dostac. */
export async function czytankaUrl(c: Czytanka): Promise<string> {
  const plik = `${c.id}.mp3`;
  if (import.meta.env.DEV || !isSupabaseConfigured()) return `/audio/czytanki/${plik}`;
  const { data, error } = await getSupabase().storage.from('czytanki').createSignedUrl(plik, WAZNOSC_URL_S);
  if (error || !data) throw new Error('Brak nagrania w chmurze albo nie jesteś zalogowany.');
  return data.signedUrl;
}
