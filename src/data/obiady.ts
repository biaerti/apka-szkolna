// Harmonogram wyjsc na obiady - z PDF-a "Obiady rozkład". Klasa to krotka
// nazwa ('4c'), `afterPeriod` - lekcja, po ktorej uczniowie ida na stolowke.
// Zasady szkoly: po 5. i 6. lekcji nie przetrzymywac obiadowiczow po dzwonku;
// "z nauczycielem" czekaja na niego w pawilonie 1 (wracaja na lekcje),
// "sami" koncza zajecia i ida min. 15 min po dzwonku. Bartek nikogo nie
// odprowadza - to przypomnienie, ktora klase puscic na czas.

export type ObiadMode = 'z nauczycielem' | 'sami' | 'z trenerem';

export interface Obiad {
  /** Dzien 1-5 (pon-pt). */
  weekday: number;
  /** Numer lekcji, po ktorej klasa idzie na obiad. */
  afterPeriod: number;
  /** Krotka nazwa klasy, np. '4c'. */
  klasa: string;
  mode: ObiadMode;
  /** Kto prowadzi (inicjaly z grafiku albo nazwisko). */
  who?: string;
}

/** Ile osob w klasie je obiady. */
export const OBIADOWICZE: Record<string, number> = {
  '4a': 6, '4b': 18, '4c': 10,
  '5a': 5, '5b': 18, '5c': 5,
  '6a': 5, '6b': 4,
  '7a': 5, '7b': 17, '7c': 6,
  '8a': 4, '8c': 4,
};

const z = (weekday: number, afterPeriod: number, who: string, klasy: string[]): Obiad[] =>
  klasy.map((klasa) => ({ weekday, afterPeriod, klasa, mode: 'z nauczycielem', who }));

/** "4a6 4c6" - indeks to numer lekcji, po ktorej klasa konczy zajecia. */
const sami = (weekday: number, wpisy: string): Obiad[] =>
  wpisy.split(/\s+/).map((w) => ({ weekday, afterPeriod: Number(w.slice(2)), klasa: w.slice(0, 2), mode: 'sami' }));

const trener = (weekday: number, afterPeriod: number, klasa: string, who: string): Obiad => ({
  weekday, afterPeriod, klasa, mode: 'z trenerem', who,
});

export const OBIADY_OD = '2026-10-05';

export const OBIADY: Obiad[] = [
  // poniedzialek
  ...z(1, 5, 'K. Kubiak', ['7b', '6a']),
  ...z(1, 6, 'M. Ligęzka', ['7a', '7c', '8c']),
  ...sami(1, '4a6 4c6 5a5 5c5 6b6 8a6'),
  trener(1, 4, '4b', 'NB, JA'),
  trener(1, 6, '5b', 'AW, FK'),
  // wtorek
  ...z(2, 5, 'M. Gawkowska', ['4b', '5b', '7c']),
  ...z(2, 6, 'M. Siegieńczuk', ['7b', '4c', '7a', '8a', '8c']),
  ...sami(2, '4a5 5a6 5c6 5b5 6a6 6b5'),
  // sroda
  ...z(3, 5, 'M. Gawkowska', ['4c', '8a', '8c', '7a']),
  ...z(3, 6, 'A. Kłosińska', ['4b', '6a', '7c']),
  ...sami(3, '4a5 5a6 5c6 6b5'),
  trener(3, 5, '5b', 'AW, FK'),
  trener(3, 4, '7b', 'TM, JA'),
  // czwartek
  ...z(4, 5, 'E. Bąkowska', ['4b', '5b', '8c', '7a']),
  ...z(4, 6, 'P. Studenny', ['7c', '6a']),
  ...sami(4, '4a6 4c6 5a6 5c6 6b4 8a6'),
  trener(4, 6, '6a', 'KU, NB'),
  trener(4, 6, '7b', 'TM, JA'),
  // piatek
  ...z(5, 5, 'K. Wieliczko', ['4a', '5b', '6b']),
  ...z(5, 6, 'B. Gibasiewicz', ['7b', '7c', '7a']),
  ...sami(5, '4c5 5a6 5c6 6a6 8a6 8c5'),
  trener(5, 5, '4b', 'NB, JA'),
];
