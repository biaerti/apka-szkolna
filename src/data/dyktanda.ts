// Dyktanda z pisowni dla uczniow z innym jezykiem ojczystym - zadanie domowe pod /dyktando.
// Podpowiedzi i tlumaczenia po ukrainsku albo hiszpansku (jezyk ucznia ustawia
// Bartek w zakladce Zadania domowe).
// Tresc lekcji: src/data/dyktanda/NN-*.json (wlasne przyklady, bez podrecznika).
// Audio: python tools/dyktanda-audio.py -> public/audio/dyktanda/<slug>.mp3.
// Plan serii: docs/dyktanda-plan.md.

import lekcja01 from './dyktanda/01-sz-cz-ch.json';

export type Jezyk = 'ua' | 'es';

export const JEZYKI: Array<{ id: Jezyk; nazwa: string }> = [
  { id: 'ua', nazwa: 'ukraiński' },
  { id: 'es', nazwa: 'hiszpański' },
];

/** Tekst po polsku z tlumaczeniem na jezyk ucznia. */
export interface Tekst {
  pl: string;
  /** Polska linijka dla hiszpanskojezycznych, gdy w `pl` jest cyrylica albo mowa o ukrainskim. */
  plEs?: string;
  ua: string;
  es: string;
}

export interface DyktandoPrzyklad extends Tekst {
  /** Obrazek (emoji) we wstepie. */
  obraz?: string;
}

export interface DyktandoRegula extends Tekst {
  /** Litery, np. "sz". */
  litery: string;
  /** Ukrainski odpowiednik dzwieku, np. "ш". */
  dzwiek: string;
  /** To samo dla hiszpanskojezycznych, np. "sh". */
  dzwiekEs: string;
  /** Tekst lektorki do slajdu (bez golych liter - TTS czyta je jako nazwy). */
  lektor: string;
  przyklady: DyktandoPrzyklad[];
}

export interface DyktandoLuka extends Tekst {
  /** Ktore litery w slowie uczen wybiera (pierwsze wystapienie), np. "sz". */
  luka: string;
}

export interface DyktandoLekcja {
  id: string;
  nr: number;
  /** Od kiedy lekcja jest dostepna (poniedzialek, YYYY-MM-DD). */
  od: string;
  temat: string;
  tematUa: string;
  tematEs: string;
  intro: Tekst & { lektor: string };
  wstep: DyktandoRegula[];
  /** Wybierz litery do luki - nauka, bez punktow. */
  cwiczenie: DyktandoLuka[];
  slowa: DyktandoPrzyklad[];
  zdania: DyktandoPrzyklad[];
  zapamietaj: { lektor: string; punkty: Tekst[] };
  /** Na koniec, bez podpowiedzi - poprawki dopiero po calym tescie. */
  test: { slowa: DyktandoPrzyklad[]; zdania: DyktandoPrzyklad[] };
}

export const DYKTANDA: DyktandoLekcja[] = [lekcja01];

export function przeklad(t: Tekst, jezyk: Jezyk): string {
  return t[jezyk] || t.ua;
}

export function polski(t: Tekst, jezyk: Jezyk): string {
  return (jezyk === 'es' && t.plEs) || t.pl;
}

export function tematLekcji(l: DyktandoLekcja, jezyk: Jezyk): string {
  return jezyk === 'es' ? l.tematEs : l.tematUa;
}

const BEZ_OGONKOW: Record<string, string> = {
  ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z',
};

/** Nazwa pliku mp3 dla tekstu - ta sama funkcja jest w tools/dyktanda-audio.py. */
export function slugAudio(tekst: string): string {
  return tekst
    .toLowerCase()
    .replace(/[ąćęłńóśźż]/g, (z) => BEZ_OGONKOW[z])
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function audioUrl(tekst: string): string {
  return `/audio/dyktanda/${slugAudio(tekst)}.mp3`;
}

export function wolnoUrl(zdanie: string): string {
  return `/audio/dyktanda/${slugAudio(zdanie)}-wolno.mp3`;
}

/** Nagrania lektorki do slajdow: <id>-intro, <id>-regula-1..., <id>-zapamietaj. */
export function lektorUrl(lekcja: DyktandoLekcja, czesc: 'intro' | 'zapamietaj' | number): string {
  const nazwa = typeof czesc === 'number' ? `regula-${czesc + 1}` : czesc;
  return `/audio/dyktanda/${lekcja.id}-${nazwa}.mp3`;
}

/** Lekcje dostepne w danym dniu (od <= dzis) i najblizsza zablokowana. */
export function dostepneLekcje(dzis: string): { dostepne: DyktandoLekcja[]; nastepna: DyktandoLekcja | null } {
  const posortowane = [...DYKTANDA].sort((a, b) => a.nr - b.nr);
  return {
    dostepne: posortowane.filter((l) => l.od <= dzis),
    nastepna: posortowane.find((l) => l.od > dzis) ?? null,
  };
}

const slowaZdan = (zdania: DyktandoPrzyklad[]) =>
  zdania.reduce((suma, z) => suma + z.pl.split(/\s+/).filter(Boolean).length, 0);

/** Punkty za cwiczenia (slowa + slowa w zdaniach) i za test. */
export function punktyLekcji(lekcja: DyktandoLekcja): { cwiczenia: number; test: number } {
  return {
    cwiczenia: lekcja.slowa.length + slowaZdan(lekcja.zdania),
    test: lekcja.test.slowa.length + slowaZdan(lekcja.test.zdania),
  };
}

export function maksPunktow(lekcja: DyktandoLekcja): number {
  const p = punktyLekcji(lekcja);
  return p.cwiczenia + p.test;
}
