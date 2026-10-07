// Lista zadan na pulpicie: co jest ogolne, co na dany dzien, co na lekcje
// i co zalega z poprzednich dni. Czyste funkcje, dane trzyma src/data/zadania.ts.

export interface Zadanie {
  id: string;
  tekst: string;
  /** RRRR-MM-DD; null = zadanie ogolne, bez dnia. */
  data: string | null;
  /** Numer lekcji w planie; null = na caly dzien. */
  lekcja: number | null;
  /** Klasa lekcji - tylko do podpisu przy zaleglych. */
  klasaId: string | null;
  zrobione: boolean;
  createdAt: string;
}

const byCreated = (a: Zadanie, b: Zadanie) => a.createdAt.localeCompare(b.createdAt);

/** Ogolne: najpierw niezrobione, zrobione na dol. */
export function zadaniaOgolne(list: Zadanie[]): Zadanie[] {
  return list.filter((z) => z.data === null).sort((a, b) => Number(a.zrobione) - Number(b.zrobione) || byCreated(a, b));
}

/** Zadania na caly dzien (bez lekcji). */
export function zadaniaDnia(list: Zadanie[], date: string): Zadanie[] {
  return list.filter((z) => z.data === date && z.lekcja === null).sort(byCreated);
}

/** Zadania przypiete do lekcji o danym numerze w danym dniu. */
export function zadaniaLekcji(list: Zadanie[], date: string, lekcja: number): Zadanie[] {
  return list.filter((z) => z.data === date && z.lekcja === lekcja).sort(byCreated);
}

/** Niezrobione z dni przed `today` - pokazujemy je w kolumnie dzisiaj. */
export function zadaniaZalegle(list: Zadanie[], today: string): Zadanie[] {
  return list
    .filter((z) => !z.zrobione && z.data !== null && z.data < today)
    .sort((a, b) => (a.data ?? '').localeCompare(b.data ?? '') || (a.lekcja ?? 0) - (b.lekcja ?? 0) || byCreated(a, b));
}
