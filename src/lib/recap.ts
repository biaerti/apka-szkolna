// Czyste funkcje modulu powtorki (kolo fortuny): limity pasow, budowa puli
// losowania, bilans miesieczny ucznia, rozliczanie plomb oraz obliczanie
// docelowego kata obrotu kola.
//
// Zasady gry (patrz `src/data/zasady.ts` i wydruk /zasady/druk):
// - dwa kola: KOLO NA LEKCJI (po kazdym zadaniu losuje, kto pokazuje
//   rozwiazanie - mozna tylko zyskac: plus albo kropka, patrz sekcja "kolo na
//   lekcji" nizej) i KOLO POWTORZENIOWE (na poczatku nastepnej lekcji, z
//   wlasnymi pytaniami - gra sie o wszystko: plus / kropka / plomba / pas),
// - odpowiedz oceniamy jako plus / kropka / plomba, mozna tez wziac pas,
// - podpowiadanie = plomba dla podpowiadajacego,
// - niegrzeczne zachowanie = UWAGA DO DZIENNIKA, od razu i bez ostrzezen.
//   Uwaga nie ma juz zadnych skutkow w grze (nie blokuje plusa, nie mnozy
//   sektorow) - jest przypominajka dla nauczyciela, zeby po lekcjach wpisac ja
//   do dziennika (zakladka "Uwagi", src/pages/Uwagi.tsx). Dawna eskalacja
//   (1. ostrzezenie, 2. brak plusow do konca miesiaca) jest WYCOFANA,
// - wszystko rozliczamy pelnymi miesiacami kalendarzowymi: pasy, uwagi i statystyki
//   zeruja sie 1. dnia miesiaca,
// - na koniec miesiaca rozliczamy tez plusy, kropki i plomby: uzbierany komplet
//   plomb zamienia sie na jedynke, uzbierany komplet plusow na piatke (patrz
//   src/data/zasady.ts - zadnych zadan naprawczych, to prosta zamiana licznika
//   na ocene).

import type { RecapEvent, RecapResult, Settings, Slide, Student } from '../data/types';
import { monthKey as toMonthKey } from './week';
import { toDateKey } from './dates';

// --- tryb rundy (slajd 'recap') ----------------------------------------------

/**
 * Tryb rundy slajdu `recap`:
 * - 'powtorzeniowe' - kolo na poczatku lekcji z pytaniami z poprzedniego tematu,
 *   pelne ocenianie; to JEDYNY tryb, jaki tworza dzis gotowe materialy,
 * - 'demo' - lekcja zapoznawcza,
 * - 'po-lekcji' - HISTORYCZNY: kolo na koncu lekcji z tymi samymi pytaniami
 *   (mozna bylo tylko zyskac). Wycofane, bo dzieci odpowiadaly dwa razy na to
 *   samo - zastapione kolem NA LEKCJI, ktore losuje osobe do kazdego zadania
 *   (patrz sekcja "kolo na lekcji" nizej, bez slajdu recap). Wartosc zostaje w
 *   typie tylko dla starych, nieodswiezonych lekcji w bazie.
 */
export type RecapMode = 'po-lekcji' | 'powtorzeniowe' | 'demo';

/**
 * Tryb rundy slajdu recap: `mode` decyduje, a przy jego braku (stare dane) -
 * `variant: 'demo'` (lekcja zapoznawcza) albo domyslnie 'po-lekcji' (tak
 * dzialal KAZDY recap na koncu lekcji, zanim wprowadzono to rozroznienie).
 */
export function resolveRecapMode(slide: Extract<Slide, { kind: 'recap' }>): RecapMode {
  if (slide.mode) return slide.mode;
  if (slide.variant === 'demo') return 'demo';
  return 'po-lekcji';
}

// --- pula losowania ---------------------------------------------------------

/**
 * Jedno wejscie do kola. Kazdy uczen ma dokladnie jedno wejscie (`copy` zawsze
 * 0) - uwagi za zachowanie nie ruszaja kola w zaden sposob (patrz naglowek
 * pliku: uwaga idzie do dziennika, nie do gry). Pole `copy` zostaje w typie dla
 * stabilnosci klucza `key`.
 */
export interface PoolEntry {
  /** Stabilny klucz wejscia (uczen + numer kopii) - React key i indeks sektora. */
  key: string;
  student: Student;
  copy: number;
  /**
   * true = to wejscie juz odpowiadalo w tej rundzie. Wpis NIE znika z kola -
   * zostaje na nim na czerwono, zeby klasa widziala, ze ta osoba juz byla i
   * wiecej jej nie wylosujemy. Z losowania wypada (patrz drawableEntries).
   */
  done: boolean;
}

export interface BuildPoolArgs {
  students: Student[];
  /** Ile razy uczen juz odpowiadal w biezacej rundzie. */
  usedFor: (studentId: string) => number;
  /** true = ignoruj "juz odpowiadal", nikt nie jest `done` i wszyscy wracaja do losowania. */
  allowRepeats?: boolean;
}

/**
 * Wszystkie wejscia do kola w tej rundzie - razem z tymi, ktore juz odpowiadaly
 * (`done: true`). Lista jest stala przez cala runde (zmienia ja tylko obecnosc),
 * wiec sektory na kole nie przeskakuja po kazdej ocenie.
 */
export function buildRoundEntries({ students, usedFor, allowRepeats = false }: BuildPoolArgs): PoolEntry[] {
  const entries: PoolEntry[] = [];
  for (const student of students) {
    const used = allowRepeats ? 0 : usedFor(student.id);
    entries.push({ key: `${student.id}#0`, student, copy: 0, done: used > 0 });
  }
  return entries;
}

/** Wejscia, ktore biora udzial w losowaniu - czyli te, ktore jeszcze nie odpowiadaly. */
export function drawableEntries(entries: PoolEntry[]): PoolEntry[] {
  return entries.filter((entry) => !entry.done);
}

/** Ile losowan (a wiec i pytan) przewiduje pelna runda - kazdy uczen raz. */
export function plannedDraws(students: Student[]): number {
  return students.length;
}

// --- pasy i uwagi w miesiacu -------------------------------------------------

/** Ile zdarzen danego typu uczen ma w miesiacu zawierajacym date `now`. */
function countInMonth(events: RecapEvent[], studentId: string, result: RecapEvent['result'], now: Date): number {
  const key = toMonthKey(now);
  return events.filter(
    (e) => e.studentId === studentId && e.result === result && toMonthKey(new Date(e.at)) === key,
  ).length;
}

/** Liczba pasow wykorzystanych przez ucznia w miesiacu zawierajacym date `now`. */
export function passesUsedThisMonth(events: RecapEvent[], studentId: string, now: Date): number {
  return countInMonth(events, studentId, 'pass', now);
}

/** Czy uczen moze jeszcze skorzystac z pasa w tym miesiacu. */
export function canPass(events: RecapEvent[], studentId: string, settings: Settings, now: Date): boolean {
  return passesUsedThisMonth(events, studentId, now) < settings.passesPerMonth;
}

/**
 * Liczba uwag ucznia w miesiacu zawierajacym date `now`. Sluzy JUZ TYLKO do
 * pokazania licznika przy nazwisku - uwaga nie ma zadnych skutkow w grze
 * (patrz naglowek pliku). Liczymy ja z zapisanych RecapEvent, a nie ze stanu
 * sesji, zeby przeladowanie strony w srodku lekcji nic nie gubilo.
 */
export function warningsThisMonth(events: RecapEvent[], studentId: string, now: Date): number {
  return countInMonth(events, studentId, 'uwaga', now);
}

/** Losuje jeden element z puli. Zwraca undefined dla pustej puli. */
export function pickRandom<T>(pool: T[], rng: () => number = Math.random): T | undefined {
  if (pool.length === 0) return undefined;
  const idx = Math.floor(rng() * pool.length);
  const clamped = Math.min(pool.length - 1, Math.max(0, idx));
  return pool[clamped];
}

// --- bilans i rozliczenia ---------------------------------------------------

export interface MonthBalance {
  plus: number;
  kropka: number;
  plomba: number;
  pass: number;
  /** Plomby za podpowiadanie (liczone osobno, ale wchodza do `plombyTotal`). */
  hint: number;
  uwaga: number;
  /** plomba + hint - tyle plomb uczen zebral w miesiacu. */
  plombyTotal: number;
}

/** Bilans zdarzen ucznia w danym miesiacu (klucz "RRRR-MM"). */
export function monthBalance(events: RecapEvent[], studentId: string, monthKey: string): MonthBalance {
  const forStudent = events.filter((e) => e.studentId === studentId && toMonthKey(new Date(e.at)) === monthKey);
  const count = (result: RecapEvent['result']) => forStudent.filter((e) => e.result === result).length;
  const plomba = count('plomba');
  const hint = count('hint_plomba');
  return {
    plus: count('plus'),
    kropka: count('kropka'),
    plomba,
    pass: count('pass'),
    hint,
    uwaga: count('uwaga'),
    plombyTotal: plomba + hint,
  };
}

/** Jedna odpowiedz na konkretne pytanie - kto i z jakim wynikiem. */
export interface QuestionAnswer {
  studentId: string;
  result: Extract<RecapResult, 'plus' | 'kropka' | 'plomba' | 'pass'>;
  at: string;
}

/** Wyniki, ktore znacza "uczen odpowiadal" (w odroznieniu od uwagi, podpowiedzi i adnotacji o ocenie). */
export const GRADED_RESULTS: RecapResult[] = ['plus', 'kropka', 'plomba', 'pass'];

/**
 * Historia odpowiedzi klasy per pytanie: kto juz to pytanie dostal i jak mu
 * poszlo. Uzywane w panelu "wybierz pytanie", zeby nauczyciel widzial, czy
 * pytanie juz padlo i czy klasa je umiala. Kolejnosc: od najstarszej odpowiedzi.
 */
export function answersByQuestion(events: RecapEvent[], classId: string): Map<string, QuestionAnswer[]> {
  const out = new Map<string, QuestionAnswer[]>();
  const sorted = events
    .filter((e) => e.classId === classId && e.questionId && GRADED_RESULTS.includes(e.result))
    .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
  for (const e of sorted) {
    const list = out.get(e.questionId as string) ?? [];
    list.push({ studentId: e.studentId, result: e.result as QuestionAnswer['result'], at: e.at });
    out.set(e.questionId as string, list);
  }
  return out;
}

/** Zdarzenia ucznia posortowane rosnaco po dacie. */
function studentEventsAsc(events: RecapEvent[], studentId: string): RecapEvent[] {
  return events
    .filter((e) => e.studentId === studentId)
    .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
}

/**
 * Zwraca zdarzenia ucznia od ostatniego zdarzenia zerujacego licznik. Uzywane do
 * "nierozliczonych" plomb (zeruje `jedynka`, a historycznie tez `rozliczenie` -
 * patrz komentarz przy RecapResult w src/data/types.ts) i plusow (zeruje `piatka`).
 */
function eventsSinceReset(
  events: RecapEvent[],
  studentId: string,
  resetResults: RecapEvent['result'][],
): RecapEvent[] {
  const asc = studentEventsAsc(events, studentId);
  let lastReset = -1;
  for (let i = 0; i < asc.length; i++) {
    if (resetResults.includes(asc[i].result)) lastReset = i;
  }
  return asc.slice(lastReset + 1);
}

export interface Outstanding {
  count: number;
  /** Id pytan, na ktore uczen nie odpowiedzial - historia do ewentualnego wgladu nauczyciela. */
  questionIds: string[];
}

/**
 * Nierozliczone plomby ucznia: wszystkie plomby (w tym za podpowiadanie) zapisane
 * po ostatniej jedynce (albo po historycznym zdarzeniu `rozliczenie` - patrz
 * eventsSinceReset powyzej).
 */
export function outstandingPlomby(events: RecapEvent[], studentId: string): Outstanding {
  const since = eventsSinceReset(events, studentId, ['rozliczenie', 'jedynka']);
  const plomby = since.filter((e) => e.result === 'plomba' || e.result === 'hint_plomba');
  const questionIds: string[] = [];
  for (const e of plomby) {
    if (e.questionId && !questionIds.includes(e.questionId)) questionIds.push(e.questionId);
  }
  return { count: plomby.length, questionIds };
}

/** Nierozliczone plusy ucznia: plusy zapisane po ostatniej piatce. */
export function outstandingPlusy(events: RecapEvent[], studentId: string): Outstanding {
  const since = eventsSinceReset(events, studentId, ['piatka']);
  const plusy = since.filter((e) => e.result === 'plus');
  const questionIds: string[] = [];
  for (const e of plusy) {
    if (e.questionId && !questionIds.includes(e.questionId)) questionIds.push(e.questionId);
  }
  return { count: plusy.length, questionIds };
}

/** Czy uczen uzbieral komplet plomb na jedynke (domyslnie 3). */
export function earnedOne(events: RecapEvent[], studentId: string, settings: Settings): boolean {
  return outstandingPlomby(events, studentId).count >= settings.plombyForOne;
}

/** Czy uczen uzbieral komplet plusow na piatke (domyslnie 3). */
export function earnedFive(events: RecapEvent[], studentId: string, settings: Settings): boolean {
  return outstandingPlusy(events, studentId).count >= settings.plusesForFive;
}

// --- kolo na lekcji (zadania) ------------------------------------------------
//
// Po kazdym zadaniu ze slajdu `task` nauczyciel kreci kolem i wylosowana osoba
// pokazuje swoje rozwiazanie. To NIE jest slajd recap i nie ma pytan z zestawu
// - "pytaniem" jest samo zadanie (Z1, Z2...). Mozna tylko zyskac.

/**
 * Ocena z kola NA LEKCJI: plus za dobrze zrobione zadanie, kropka za zadanie
 * zrobione slabo albo wcale. Plomby ani pasa tu nie ma - na lekcji nie da sie
 * nic stracic (tak jak kiedys na kole po lekcji).
 */
export type LessonWheelResult = Extract<RecapResult, 'plus' | 'kropka'>;

/**
 * Adnotacja zdarzenia z kola na lekcji - zamiast questionId (zadanie nie jest
 * pytaniem z zestawu): kod lekcji i kod zadania, np. "4.3 Z2". Jedno miejsce,
 * zeby bilans i ewentualny przyszly wglad "za co plus" czytaly to samo.
 */
export function lessonWheelNote(lessonCode: string | undefined, taskCode: string): string {
  return lessonCode ? `${lessonCode} ${taskCode}` : taskCode;
}

/**
 * Ile razy kazdy uczen klasy juz DZIS odpowiadal (dowolny wynik z
 * GRADED_RESULTS: plus, kropka, plomba, pas) - podstawa puli kola na lekcji.
 * Liczone z zapisanych zdarzen, nie ze stanu sesji: przeladowanie strony w
 * srodku lekcji nie wraca tej samej osoby na kolo, a cofniecie oceny
 * (usuniecie zdarzenia) samo zwalnia jej sektor. Wlicza tez kolo powtorzeniowe
 * z poczatku tej samej lekcji - kto juz dzis odpowiadal, nie jest losowany do
 * zadan, dopoki reszta klasy nie byla. `dayKey` = "RRRR-MM-DD" lokalnie
 * (toDateKey), zdarzenia porownywane po lokalnej dacie `at`.
 *
 * `sinceIso` (opcjonalne) obcina liczenie do zdarzen NIE STARSZYCH niz podana
 * chwila - tak dziala "Reset skreslen" w plywajacym panelu: nauczyciel zaczyna
 * nowa runde w srodku dnia, a wczesniejsze odpowiedzi zostaja w bilansie
 * miesiaca, tylko przestaja skreslac ludzi z kola.
 */
export function answeredOnDay(
  events: RecapEvent[],
  classId: string,
  dayKey: string,
  sinceIso?: string,
): Map<string, number> {
  // Daty ze store i z chmury maja rozny zapis strefy ("...Z" kontra "...+00:00"),
  // wiec porownujemy chwile, a nie napisy.
  const sinceMs = sinceIso ? new Date(sinceIso).getTime() : null;
  const out = new Map<string, number>();
  for (const e of events) {
    if (e.classId !== classId || !GRADED_RESULTS.includes(e.result)) continue;
    if (toDateKey(new Date(e.at)) !== dayKey) continue;
    if (sinceMs !== null && new Date(e.at).getTime() < sinceMs) continue;
    out.set(e.studentId, (out.get(e.studentId) ?? 0) + 1);
  }
  return out;
}

// --- kolejnosc i losowanie --------------------------------------------------

/** Zwraca kolejne wejscie wg numeru z dziennika - pierwsze z puli (tryb "po kolei"). */
export function nextSequential<T>(pool: T[]): T | undefined {
  return pool[0];
}

/** Tasuje tablice (Fisher-Yates) przy pomocy dostarczonego generatora liczb losowych. */
export function shuffle<T>(items: T[], rng: () => number = Math.random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Zwraca kolejny indeks pytania w potasowanej liscie pytan. Gdy nastepny indeks
 * wypadlby poza zakresem (lista wyczerpana), sygnalizuje potrzebe ponownego
 * potasowania (`reshuffle: true`, indeks 0). Uzywane w trybie losowych pytan, gdzie
 * pytanie ma sie zmieniac automatycznie przy kazdym nowym uczniu, az do wyczerpania
 * calego zestawu, po czym nastepuje nowe tasowanie.
 */
export function nextRandomIndex(currentIndex: number, total: number): { index: number; reshuffle: boolean } {
  if (total <= 0) return { index: 0, reshuffle: true };
  const next = currentIndex + 1;
  if (next >= total) return { index: 0, reshuffle: true };
  return { index: next, reshuffle: false };
}

/**
 * Wylicza docelowy kat obrotu kola fortuny (w stopniach, rosnaco = zgodnie z ruchem
 * wskazowek zegara), tak aby po animacji wskaznik (u gory, kat 0) trafil w sektor
 * o podanym indeksie. Sektory sa ulozone od kata 0 zgodnie z ruchem wskazowek zegara.
 * `spins` to liczba dodatkowych pelnych obrotow (dla efektu wizualnego).
 */
export function wheelTargetAngle(
  index: number,
  count: number,
  spins: number,
  rng: () => number = Math.random,
): number {
  if (count <= 0) return 0;
  const segment = 360 / count;
  // Losowy punkt wewnatrz sektora, z marginesem od krawedzi, zeby nie trafiac dokladnie na granice.
  const margin = segment * 0.15;
  const offset = margin + rng() * (segment - margin * 2);
  const sectorPoint = index * segment + offset;
  const base = (360 - sectorPoint) % 360;
  return base + Math.max(0, spins) * 360;
}
