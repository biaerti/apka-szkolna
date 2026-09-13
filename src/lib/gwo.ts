// Linki do multipodrecznikow GWO.
//
// Otwieramy zawsze spis tresci (page=3), a numer strony tematu tylko
// wyswietlamy obok linku. Numer `page` w adresie nie zgadza sie z numerem
// wydrukowanym na stronie, wiec Bartek woli przejsc ze spisu sam.

const TEXTBOOK_BASE = 'https://multipodreczniki.apps.gwo.pl/textbooks/1a5ce8d8-4655-48d8-a693-b58ea3e2427b?accessId=4323406';
const EXERCISES_BASE = 'https://multipodreczniki.apps.gwo.pl/textbooks/58c40602-7376-4221-ba33-2149d9a1af0a?accessId=4326859';

const SPIS_TRESCI = 3;

export const gwoTextbookUrl = () => `${TEXTBOOK_BASE}&page=${SPIS_TRESCI}`;
export const gwoExercisesUrl = () => `${EXERCISES_BASE}&page=${SPIS_TRESCI}`;
