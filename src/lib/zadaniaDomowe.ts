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
 * Tasuje kolejnosc odpowiedzi w {{a|*b|c}} - w kartach dobra czesto stoi
 * pierwsza (na lekcji to nie szkodzi, w domu dziecko szybko by to wylapalo).
 */
export function przetasujWybory(linia: string, los: () => number): string {
  return linia.replace(/\{\{(.+?)\}\}/g, (_, srodek: string) => `{{${wymieszaj(srodek.split('|'), los).join('|')}}}`);
}

/** Najwiecej ekranow w jednym zadaniu (powtorka dzialu ma nawet 11 kart). */
export const MAKS_PYTAN = 12;

/**
 * Pytania do zadania: z kazdej karty kilka losowych przykladow (odmiana: jeden
 * wyraz), w kolejnosci kart z lekcji. Razem do 12 ekranow - na 10-15 minut.
 */
export function pytaniaZadania(l: LekcjaZadania, los: () => number = Math.random): PytanieZadania[] {
  const karty = kartyLekcji(l).filter((c) => mozliwePytania(c).length > 0);
  const naKarte = Math.max(1, Math.min(4, Math.floor(MAKS_PYTAN / Math.max(1, karty.length))));
  return karty.flatMap((cw) => {
    const mozliwe = mozliwePytania(cw);
    return wymieszaj(mozliwe, los)
      .slice(0, cw.typ === 'tabela' ? 1 : naKarte)
      .map((p) => (p.typ === 'luki' ? { ...p, linia: przetasujWybory(p.linia, los) } : p));
  });
}

/** Klucz wyniku w dyktando_wyniki. */
export const kluczZadania = (lekcjaId: string) => `zd:${lekcjaId}`;
