// Linki do multipodrecznikow GWO otwierane na konkretnej stronie.
//
// Parametr `page` w adresie to numer strony w pliku, a nie numer wydrukowany
// na stronie - kazda ksiazka ma inny przesuw (okladka, strony tytulowe).
// Przesuw ustalony ze zrzutow Bartka (2026-09-13):
// - podrecznik: page=35 otwiera rozkladowke 36-37,
// - cwiczenia: page=14 otwiera rozkladowke 12-13.
// Wczesniej adresy obu ksiazek byly zamienione miejscami.

const TEXTBOOK_BASE = 'https://multipodreczniki.apps.gwo.pl/textbooks/1a5ce8d8-4655-48d8-a693-b58ea3e2427b?accessId=4323406';
const EXERCISES_BASE = 'https://multipodreczniki.apps.gwo.pl/textbooks/58c40602-7376-4221-ba33-2149d9a1af0a?accessId=4326859';

const TEXTBOOK_PAGE_SHIFT = -1;
const EXERCISES_PAGE_SHIFT = 1;

function withPage(base: string, shift: number, page?: number): string {
  return page ? `${base}&page=${Math.max(1, page + shift)}` : base;
}

export const gwoTextbookUrl = (page?: number) => withPage(TEXTBOOK_BASE, TEXTBOOK_PAGE_SHIFT, page);
export const gwoExercisesUrl = (page?: number) => withPage(EXERCISES_BASE, EXERCISES_PAGE_SHIFT, page);
