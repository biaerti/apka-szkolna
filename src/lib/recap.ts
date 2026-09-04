// Czyste funkcje modulu powtorki (kolo fortuny): limity pasow, eskalacja uwag,
// budowa puli losowania, bilans miesieczny ucznia, rozliczanie plomb oraz
// obliczanie docelowego kata obrotu kola.
//
// Zasady gry (patrz `src/data/zasady.ts` i wydruk /zasady/druk):
// - odpowiedz oceniamy jako plus / kropka / plomba, mozna tez wziac pas,
// - podpowiadanie = plomba dla podpowiadajacego,
// - niegrzeczne zachowanie eskaluje: 1. ostrzezenie, 2. brak plusow, 3. podwojne
//   wejscie do kola (a wiec i dodatkowe pytanie dla klasy),
// - wszystko rozliczamy pelnymi miesiacami kalendarzowymi: pasy, uwagi i statystyki
//   zeruja sie 1. dnia miesiaca,
// - uzbierane plomby zamieniaja sie na zadania naprawcze -> rozliczenie albo jedynke,
//   uzbierane plusy na piatke.

import type { RecapEvent, Settings, Student } from '../data/types';
import { monthKey as toMonthKey } from './week';

// --- eskalacja uwag ---------------------------------------------------------

/** Od tylu uwag w miesiacu uczen traci mozliwosc zdobywania plusow. */
export const WARN_NO_PLUS_AT = 2;
/** Od tylu uwag w miesiacu uczen trafia do kola podwojnie. */
export const WARN_DOUBLE_AT = 3;

export type WarnLevel = 'none' | 'warned' | 'no_plus' | 'doubled';

/** Poziom eskalacji dla podanej liczby uwag w biezacym miesiacu. */
export function warnLevel(warnings: number): WarnLevel {
  if (warnings >= WARN_DOUBLE_AT) return 'doubled';
  if (warnings >= WARN_NO_PLUS_AT) return 'no_plus';
  if (warnings >= 1) return 'warned';
  return 'none';
}

/** Ile razy uczen trafia do kola przy podanej liczbie uwag w miesiacu (1 lub 2). */
export function wheelEntriesFor(warnings: number): number {
  return warnings >= WARN_DOUBLE_AT ? 2 : 1;
}

/** Czy uczen z taka liczba uwag moze jeszcze zdobyc plusa. */
export function canEarnPlus(warnings: number): boolean {
  return warnings < WARN_NO_PLUS_AT;
}

/** Krotki opis konsekwencji dla poziomu eskalacji - do pokazania nauczycielowi. */
export function warnLevelLabel(level: WarnLevel): string {
  switch (level) {
    case 'warned':
      return 'ostrzeżenie';
    case 'no_plus':
      return 'bez plusów';
    case 'doubled':
      return 'bez plusów, podwójnie w kole';
    default:
      return '';
  }
}

// --- pula losowania ---------------------------------------------------------

/**
 * Jedno wejscie do kola. Uczen z trzema uwagami ma dwa wejscia (`copy` 0 i 1),
 * dzieki czemu jego sektor pojawia sie na kole dwa razy - i o jedno pytanie
 * wiecej przypada na cala klase.
 */
export interface PoolEntry {
  /** Stabilny klucz wejscia (uczen + numer kopii) - React key i indeks sektora. */
  key: string;
  student: Student;
  copy: number;
}

export interface BuildPoolArgs {
  students: Student[];
  /** Liczba uwag ucznia w biezacym miesiacu. */
  warningsFor: (studentId: string) => number;
  /** Ile razy uczen juz odpowiadal w biezacej rundzie. */
  usedFor: (studentId: string) => number;
  /** true = ignoruj "juz odpowiadal" i wystawiaj wszystkie wejscia. */
  allowRepeats?: boolean;
}

/** Buduje liste wejsc do kola dla biezacej rundy (z duplikatami za uwagi). */
export function buildPool({ students, warningsFor, usedFor, allowRepeats = false }: BuildPoolArgs): PoolEntry[] {
  const entries: PoolEntry[] = [];
  for (const student of students) {
    const total = wheelEntriesFor(warningsFor(student.id));
    const remaining = allowRepeats ? total : Math.max(0, total - usedFor(student.id));
    for (let copy = 0; copy < remaining; copy++) {
      entries.push({ key: `${student.id}#${copy}`, student, copy });
    }
  }
  return entries;
}

/** Ile losowan (a wiec i pytan) przewiduje pelna runda dla podanych uczniow. */
export function plannedDraws(students: Student[], warningsFor: (studentId: string) => number): number {
  return students.reduce((sum, st) => sum + wheelEntriesFor(warningsFor(st.id)), 0);
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
 * Liczba uwag ucznia w miesiacu zawierajacym date `now` - podstawa eskalacji.
 * Uwagi zeruja sie 1. dnia miesiaca razem z pasami i statystykami; liczymy je
 * z zapisanych RecapEvent, a nie ze stanu sesji, zeby przeladowanie strony w
 * srodku lekcji nie kasowalo konsekwencji.
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

/** Zdarzenia ucznia posortowane rosnaco po dacie. */
function studentEventsAsc(events: RecapEvent[], studentId: string): RecapEvent[] {
  return events
    .filter((e) => e.studentId === studentId)
    .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
}

/**
 * Zwraca zdarzenia ucznia od ostatniego zdarzenia zerujacego licznik. Uzywane do
 * "nierozliczonych" plomb (zeruje `rozliczenie` albo `jedynka`) i plusow (zeruje `piatka`).
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
  /** Id pytan, na ktore uczen nie odpowiedzial - podstawa zadan naprawczych. */
  questionIds: string[];
}

/**
 * Nierozliczone plomby ucznia: wszystkie plomby (w tym za podpowiadanie) zapisane
 * po ostatnim rozliczeniu albo jedynce.
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
export function owesTasks(events: RecapEvent[], studentId: string, settings: Settings): boolean {
  return outstandingPlomby(events, studentId).count >= settings.plombyForOne;
}

/** Czy uczen uzbieral komplet plusow na piatke (domyslnie 3). */
export function earnedFive(events: RecapEvent[], studentId: string, settings: Settings): boolean {
  return outstandingPlusy(events, studentId).count >= settings.plusesForFive;
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
