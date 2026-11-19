// Kolejnosc lekcji dla pojedynczej klasy. Lekcje sa wspolne dla rocznika i maja
// jedna kolejnosc (`order`), ale klasa moze przerobic dwie lekcje odwrotnie -
// wtedy na jej liscie, w "Nastepna / Dalej" i w kolejce lekcja `przed` stoi
// tuz przed lekcja `za`. Kody do zeszytu (lessonCode.ts) zostaja bez zmian:
// dzieci juz zapisaly nimi tematy.

import type { Lesson } from '../data/types';
import { klasaKlucz } from './recap';

export interface KolejnoscKlasy {
  klasy: string[];
  /** Tytul lekcji przesuwanej wyzej. */
  przed: string;
  /** Tytul lekcji, przed ktora ja stawiamy. */
  za: string;
}

export const KOLEJNOSC_KLAS: KolejnoscKlasy[] = [
  // Bartek 2026-11-19: 4a i 4c zrobily bitwe przed Gerebem (lektura, src/data/lekturaChlopcy.ts).
  { klasy: ['4a', '4c'], przed: '5. Bitwa o Plac Broni', za: '4. Gereb - czy zdradę można wybaczyć?' },
];

/** Lekcje (juz posortowane wg `order`) w kolejnosci, w jakiej przerabia je dana klasa. */
export function wKolejnosciKlasy(lessons: Lesson[], className?: string, reguly: KolejnoscKlasy[] = KOLEJNOSC_KLAS): Lesson[] {
  if (!className) return lessons;
  const klucz = klasaKlucz(className);
  let wynik = lessons;
  for (const r of reguly) {
    if (!r.klasy.some((k) => klasaKlucz(k) === klucz)) continue;
    const iPrzed = wynik.findIndex((l) => l.title === r.przed);
    const iZa = wynik.findIndex((l) => l.title === r.za);
    if (iPrzed < 0 || iZa < 0 || iPrzed < iZa) continue;
    const bez = wynik.filter((_, i) => i !== iPrzed);
    wynik = [...bez.slice(0, iZa), wynik[iPrzed], ...bez.slice(iZa)];
  }
  return wynik;
}
