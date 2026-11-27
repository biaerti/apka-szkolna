// Tresc kursu "Polski od zera" (szkola.klippi.pl/od-zera). Kazdy dzial to plik
// dzial-NN.json w tym folderze - wczytuja sie same. JSON (nie TS), bo czyta go
// tez skrypt nagran tools/odzera-audio.py. Plan roku: docs/kurs-od-zera-plan.md.
// Pilnuje test: src/lib/odzera.test.ts.

export type JezykOZ = 'ru' | 'ua';

export interface Tlumaczenie {
  ru: string;
  ua: string;
}

export interface SlowoOZ {
  /** Polskie slowo albo zwrot, tak jak widzi je uczen ("Cześć!", "szkoła"). */
  pl: string;
  /** Obrazek (emoji). Unikalny w lekcji. */
  e: string;
  ru: string;
  ua: string;
  /** Poprawka wymowy cyrylica, gdy automat (src/lib/odzeraWymowa.ts) sie myli. */
  wym?: Partial<Tlumaczenie>;
  /** Tekst dla lektorki, gdy ma przeczytac co innego niz `pl` (np. bez skrotu). */
  lektor?: string;
}

export interface ZasadaOZ {
  /** Litery albo koncowka, np. "sz" albo "rz, ż". Pokazywane tylko na ekranie. */
  litery: string;
  /** Jak brzmi (cyrylica), np. "ш". */
  dzwiek: Tlumaczenie;
  /** Jedno-dwa krotkie zdania wyjasnienia w jezyku ucznia. */
  opis: Tlumaczenie;
  /** Przyklady - polskie slowa z `slowa` tej lekcji. */
  przyklady: string[];
}

export interface ZdanieOZ {
  pl: string;
  ru: string;
  ua: string;
  e?: string;
  lektor?: string;
}

export interface LekcjaOZ {
  /** Numer w calym kursie (1, 2, 3...). */
  nr: number;
  tytul: { pl: string } & Tlumaczenie;
  /** Czego sie nauczysz - jedno zdanie w jezyku ucznia. */
  cel: Tlumaczenie;
  slowa: SlowoOZ[];
  zasady?: ZasadaOZ[];
  zdania?: ZdanieOZ[];
  /** Linijki do przepisania (polskie slowa/zdania z lekcji - tlumaczenie dokleja silnik). */
  zeszyt?: string[];
  /** Lekcja "Sprawdź się": bez nowych slow, powtorka i test calego dzialu. */
  test?: boolean;
}

export interface DzialOZ {
  nr: number;
  tytul: { pl: string } & Tlumaczenie;
  /** Emoji na kaflu dzialu. */
  e: string;
  /** Kolor dzialu (hex). */
  kolor: string;
  lekcje: LekcjaOZ[];
}

const pliki = import.meta.glob<DzialOZ>('./dzial-*.json', { eager: true, import: 'default' });

export const DZIALY: DzialOZ[] = Object.values(pliki).sort((a, b) => a.nr - b.nr);

export const LEKCJE: LekcjaOZ[] = DZIALY.flatMap((d) => d.lekcje).sort((a, b) => a.nr - b.nr);

export function dzialLekcji(nr: number): DzialOZ | undefined {
  return DZIALY.find((d) => d.lekcje.some((l) => l.nr === nr));
}

export const NAZWY_JEZYKOW: Record<JezykOZ, string> = { ru: 'rosyjski', ua: 'ukraiński' };
