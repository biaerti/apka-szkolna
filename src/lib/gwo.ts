const TEXTBOOK_BASE = 'https://multipodreczniki.apps.gwo.pl/textbooks/58c40602-7376-4221-ba33-2149d9a1af0a?accessId=4326859';
const EXERCISES_BASE = 'https://multipodreczniki.apps.gwo.pl/textbooks/1a5ce8d8-4655-48d8-a693-b58ea3e2427b?accessId=4323406';

function withPage(base: string, page?: number): string {
  return page ? `${base}&page=${page}` : base;
}

export const gwoTextbookUrl = (page?: number) => withPage(TEXTBOOK_BASE, page);
export const gwoExercisesUrl = (page?: number) => withPage(EXERCISES_BASE, page);
