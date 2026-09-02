// Czyste funkcje modulu powtorki (kolo fortuny): limity pasow, losowanie,
// bilans miesieczny ucznia oraz obliczanie docelowego kata obrotu kola.

import type { RecapEvent, Settings } from '../data/types';
import { isSameWeek, monthKey as toMonthKey } from './week';

/** Liczba pasow wykorzystanych przez ucznia w tygodniu zawierajacym date `now`. */
export function passesUsedThisWeek(events: RecapEvent[], studentId: string, now: Date): number {
  return events.filter(
    (e) => e.studentId === studentId && e.result === 'pass' && isSameWeek(new Date(e.at), now),
  ).length;
}

/** Czy uczen moze jeszcze skorzystac z pasa w tym tygodniu. */
export function canPass(events: RecapEvent[], studentId: string, settings: Settings, now: Date): boolean {
  return passesUsedThisWeek(events, studentId, now) < settings.passesPerWeek;
}

/** Losuje jeden element z puli. Zwraca undefined dla pustej puli. */
export function pickRandom<T>(pool: T[], rng: () => number = Math.random): T | undefined {
  if (pool.length === 0) return undefined;
  const idx = Math.floor(rng() * pool.length);
  const clamped = Math.min(pool.length - 1, Math.max(0, idx));
  return pool[clamped];
}

export interface MonthBalance {
  plus: number;
  minus: number;
  pass: number;
  hint: number;
}

/** Bilans zdarzen ucznia w danym miesiacu (klucz "RRRR-MM"). */
export function monthBalance(events: RecapEvent[], studentId: string, monthKey: string): MonthBalance {
  const forStudent = events.filter((e) => e.studentId === studentId && toMonthKey(new Date(e.at)) === monthKey);
  return {
    plus: forStudent.filter((e) => e.result === 'plus').length,
    minus: forStudent.filter((e) => e.result === 'minus').length,
    pass: forStudent.filter((e) => e.result === 'pass').length,
    hint: forStudent.filter((e) => e.result === 'hint_minus').length,
  };
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
