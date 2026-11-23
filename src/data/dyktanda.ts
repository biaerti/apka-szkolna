// Dyktanda z pisowni dla uczniow z Ukrainy - zadanie domowe pod /dyktando.
// Tresc lekcji: src/data/dyktanda/NN-*.json (wlasne przyklady, bez podrecznika).
// Audio: python tools/dyktanda-audio.py -> public/audio/dyktanda/<slug>.mp3.
// Plan serii: docs/dyktanda-plan.md.

import lekcja01 from './dyktanda/01-sz-cz-ch.json';

export interface DyktandoPrzyklad {
  pl: string;
  ua: string;
}

export interface DyktandoRegula {
  /** Litery, np. "sz". */
  litery: string;
  /** Ukrainski odpowiednik dzwieku, np. "ш". */
  dzwiek: string;
  pl: string;
  ua: string;
  przyklady: DyktandoPrzyklad[];
}

export interface DyktandoLekcja {
  id: string;
  nr: number;
  /** Od kiedy lekcja jest dostepna (poniedzialek, YYYY-MM-DD). */
  od: string;
  temat: string;
  tematUa: string;
  wstep: DyktandoRegula[];
  slowa: DyktandoPrzyklad[];
  zdania: DyktandoPrzyklad[];
}

export const DYKTANDA: DyktandoLekcja[] = [lekcja01];

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

/** Lekcje dostepne w danym dniu (od <= dzis) i najblizsza zablokowana. */
export function dostepneLekcje(dzis: string): { dostepne: DyktandoLekcja[]; nastepna: DyktandoLekcja | null } {
  const posortowane = [...DYKTANDA].sort((a, b) => a.nr - b.nr);
  return {
    dostepne: posortowane.filter((l) => l.od <= dzis),
    nastepna: posortowane.find((l) => l.od > dzis) ?? null,
  };
}

/** Liczba punktow do zdobycia: slowa + wszystkie slowa w zdaniach. */
export function maksPunktow(lekcja: DyktandoLekcja): number {
  const slowaWZdaniach = lekcja.zdania.reduce((suma, z) => suma + z.pl.split(/\s+/).filter(Boolean).length, 0);
  return lekcja.slowa.length + slowaWZdaniach;
}
