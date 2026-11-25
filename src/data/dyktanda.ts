// Dyktanda z pisowni dla uczniow z innym jezykiem ojczystym - zadanie domowe pod /dyktando.
// Podpowiedzi i tlumaczenia po ukrainsku albo hiszpansku (jezyk ucznia ustawia
// Bartek w zakladce Zadania domowe).
// Tresc lekcji: src/data/dyktanda/NN-*.json (wlasne przyklady, bez podrecznika).
// Audio: python tools/dyktanda-audio.py -> public/audio/dyktanda/<slug>.mp3.
// Plan serii: docs/dyktanda-plan.md.

// Wszystkie lekcje z folderu - nowa lekcja to nowy plik NN-temat.json.
const PLIKI = import.meta.glob<DyktandoLekcja>('./dyktanda/*.json', { eager: true, import: 'default' });

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
  /**
   * Dlaczego tak piszemy - wymiana albo regula, np. "stół, bo stoły".
   * Uczen widzi to po bledzie i po odpowiedzi w cwiczeniu z luka (lekcje z regulami).
   */
  dlaczego?: Tekst;
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

export interface DyktandoLuka extends DyktandoPrzyklad {
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

export const DYKTANDA: DyktandoLekcja[] = Object.values(PLIKI).sort((a, b) => a.nr - b.nr);

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

/** Ile slow na powtorke z poprzednich lekcji na poczatku lekcji (od lekcji 2). */
export const ILE_POWTORKI = 5;

function losowe<T>(lista: T[], ile: number, los: () => number): T[] {
  const kopia = [...lista];
  for (let i = kopia.length - 1; i > 0; i--) {
    const k = Math.floor(los() * (i + 1));
    [kopia[i], kopia[k]] = [kopia[k], kopia[i]];
  }
  return kopia.slice(0, ile);
}

/**
 * Powtorka na start lekcji: 3 slowa z poprzedniej lekcji i 2 ze starszych
 * (zeby wczesniejsze reguly wracaly), za kazdym razem inne. Lekcja 1 nie ma powtorki.
 */
export function powtorkaDla(lekcja: DyktandoLekcja, los: () => number = Math.random): DyktandoPrzyklad[] {
  const wczesniejsze = DYKTANDA.filter((l) => l.nr < lekcja.nr);
  if (wczesniejsze.length === 0) return [];
  const slowaLekcji = (l: DyktandoLekcja) => [...l.slowa, ...l.test.slowa];
  const poprzednia = wczesniejsze[wczesniejsze.length - 1];
  const starsze = wczesniejsze.slice(0, -1).flatMap(slowaLekcji);
  const zPoprzedniej = losowe(slowaLekcji(poprzednia), starsze.length ? 3 : ILE_POWTORKI, los);
  const zeStarszych = losowe(starsze, ILE_POWTORKI - zPoprzedniej.length, los);
  return losowe([...zPoprzedniej, ...zeStarszych], ILE_POWTORKI, los);
}

const slowaZdan = (zdania: DyktandoPrzyklad[]) =>
  zdania.reduce((suma, z) => suma + z.pl.split(/\s+/).filter(Boolean).length, 0);

/** Punkty za powtorke, cwiczenia (slowa + slowa w zdaniach) i test. */
export function punktyLekcji(lekcja: DyktandoLekcja): { powtorka: number; cwiczenia: number; test: number } {
  return {
    powtorka: DYKTANDA.some((l) => l.nr < lekcja.nr) ? ILE_POWTORKI : 0,
    cwiczenia: lekcja.slowa.length + slowaZdan(lekcja.zdania),
    test: lekcja.test.slowa.length + slowaZdan(lekcja.test.zdania),
  };
}

export function maksPunktow(lekcja: DyktandoLekcja): number {
  const p = punktyLekcji(lekcja);
  return p.powtorka + p.cwiczenia + p.test;
}
