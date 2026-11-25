// Zadania domowe z lekcji (portal ucznia /uczen): robia sie same z tego, co bylo
// na lekcji - notatka do zeszytu + kilka przykladow z kart "Ćwiczymy razem"
// (src/data/cwiczenia*.ts), za kazdym razem inne. Jeden przyklad = jeden ekran
// z "Sprawdź", jak w aplikacjach do nauki. Sprawdzanie: src/lib/cwiczenia.ts.

import { cwiczenieById, type Cwiczenie } from '../data/cwiczenia';
import { jestPole, parsujLinie, type Kawalek } from './cwiczenia';

/** Slajd lekcji tak, jak zwraca go portal_zadania (tylko notatka i karty). */
export type SlajdZadania =
  | { kind: 'note'; title?: string; body: string }
  | { kind: 'cwiczenie'; cwiczenieId: string }
  | { kind: string; [k: string]: unknown };

export interface LekcjaZadania {
  lekcja_id: string;
  tytul: string;
  kod: string | null;
  data: string | null;
  slajdy: SlajdZadania[];
}

export type PytanieZadania =
  | {
      typ: 'luki';
      cw: Cwiczenie;
      /** Jeden przyklad z karty, w znacznikach ([[odp]], {{a|*b}}, " | "). */
      linia: string;
      punkty: number;
    }
  | {
      typ: 'tabela';
      cw: Extract<Cwiczenie, { typ: 'tabela' }>;
      /** Ktory wyraz z karty (odmiana jednego wyrazu = jeden ekran). */
      wyraz: number;
      punkty: number;
    };

/** Na ile pol z punktami (otwarte luki "sprawdz sam" sie nie licza). */
export function polaZPunktami(kawalki: Kawalek[]): number {
  return kawalki.filter((k) => jestPole(k) && !(k.t === 'luka' && k.otwarta)).length;
}

export function notatkaLekcji(l: LekcjaZadania): string | null {
  const n = l.slajdy.find((s): s is { kind: 'note'; body: string } => s.kind === 'note' && typeof s.body === 'string');
  return n?.body ?? null;
}

export function kartyLekcji(l: LekcjaZadania): Cwiczenie[] {
  return l.slajdy
    .filter((s): s is { kind: 'cwiczenie'; cwiczenieId: string } => s.kind === 'cwiczenie' && typeof s.cwiczenieId === 'string')
    .map((s) => cwiczenieById(s.cwiczenieId))
    .filter((c): c is Cwiczenie => !!c);
}

/** Lekcja ma zadanie domowe, gdy ma choc jedna karte ze sprawdzanymi polami. */
export function maZadanie(l: LekcjaZadania): boolean {
  return kartyLekcji(l).some((c) => mozliwePytania(c).length > 0);
}

function mozliwePytania(cw: Cwiczenie): PytanieZadania[] {
  if (cw.typ === 'tabela') {
    return cw.wyrazy.map((w, wyraz) => ({
      typ: 'tabela' as const,
      cw,
      wyraz,
      punkty: w.komorki.flat().reduce((s, k) => s + polaZPunktami(parsujLinie(k)), 0),
    })).filter((p) => p.punkty > 0);
  }
  return cw.przyklady
    .map((linia) => ({ typ: 'luki' as const, cw, linia, punkty: polaZPunktami(parsujLinie(linia)) }))
    .filter((p) => p.punkty > 0);
}

function wymieszaj<T>(lista: T[], los: () => number): T[] {
  const kopia = [...lista];
  for (let i = kopia.length - 1; i > 0; i--) {
    const k = Math.floor(los() * (i + 1));
    [kopia[i], kopia[k]] = [kopia[k], kopia[i]];
  }
  return kopia;
}

/**
 * Pytania do zadania: z kazdej karty kilka losowych przykladow (odmiana: jeden
 * wyraz), w kolejnosci kart z lekcji. Razem ok. 10 ekranow - na 10-15 minut.
 */
export function pytaniaZadania(l: LekcjaZadania, los: () => number = Math.random, naKarte = 4): PytanieZadania[] {
  return kartyLekcji(l).flatMap((cw) => {
    const mozliwe = mozliwePytania(cw);
    return wymieszaj(mozliwe, los).slice(0, cw.typ === 'tabela' ? 1 : naKarte);
  });
}

/** Klucz wyniku w dyktando_wyniki. */
export const kluczZadania = (lekcjaId: string) => `zd:${lekcjaId}`;
