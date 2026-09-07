// Czysta logika planu lekcji: parsowanie godzin "HH:MM", co jest teraz (lekcja /
// przerwa / poza planem) i ktory wpis planu trwa. Wszystko liczone w czasie
// lokalnym z jawnie podanym `now`, zeby dalo sie testowac bez zegara.

import type { LessonPeriod, TimetableEntry } from '../data/types';

/** Nazwy dni roboczych indeksowane weekday 1-5 (indeks 0 nieuzywany). */
export const WEEKDAY_NAMES = ['', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek'];
export const WEEKDAY_SHORT = ['', 'pon', 'wt', 'śr', 'czw', 'pt'];

/** "8:05" / "08:05" -> minuty od polnocy (485). Niepoprawny tekst -> NaN. */
export function parseHm(text: string): number {
  const m = /^\s*(\d{1,2}):(\d{2})\s*$/.exec(text);
  if (!m) return NaN;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return NaN;
  return h * 60 + min;
}

/** Minuty od polnocy -> "8:05" (bez zera wiodacego w godzinie, jak na dzwonkach). */
export function formatHm(minutes: number): string {
  const total = Math.max(0, Math.round(minutes));
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  return `${h}:${String(m).padStart(2, '0')}`;
}

/** Dzien tygodnia planu: 1-5 dla pon-pt, 0 dla soboty i niedzieli (brak planu). */
export function weekdayOf(date: Date): number {
  const d = date.getDay();
  return d >= 1 && d <= 5 ? d : 0;
}

/** Minuty od polnocy dla podanej chwili (czas lokalny). */
function minutesOfDay(now: Date): number {
  return now.getHours() * 60 + now.getMinutes();
}

function secondsOfDay(now: Date): number {
  return minutesOfDay(now) * 60 + now.getSeconds();
}

/**
 * Id komorki planu wyliczane z (dzien, lekcja), a nie losowe: ta sama komorka
 * ma zawsze to samo id, wiec "usun i ustaw ponownie" to dla synca zwykly
 * upsert, a nie upsert + delete, ktory wpadlby na unique(weekday, period).
 */
export function timetableCellId(weekday: number, period: number): string {
  return `tt-${weekday}-${period}`;
}

/** Nazwa klasy sprowadzona do klucza porownania: "iv a" == "IV A" == "IVA". */
export function normalizeClassName(name: string): string {
  return name.replace(/\s+/g, '').toLowerCase();
}

/** Godziny posortowane po numerze, bez tych z niepoprawnym czasem. */
export function validPeriods(periods: LessonPeriod[]): LessonPeriod[] {
  return periods
    .filter((p) => !Number.isNaN(parseHm(p.start)) && !Number.isNaN(parseHm(p.end)))
    .sort((a, b) => a.no - b.no);
}

export type PeriodStatus =
  | { kind: 'lesson'; period: LessonPeriod; endsAtMin: number; remainingSec: number }
  | { kind: 'break'; nextPeriod: LessonPeriod; startsAtMin: number; remainingSec: number }
  | { kind: 'none' };

/**
 * Co jest teraz wedlug dzwonkow: trwajaca lekcja (z czasem do konca), przerwa
 * (z czasem do nastepnej lekcji) albo nic (przed pierwsza lekcja, po ostatniej,
 * brak godzin). Sekundy liczone z dokladnoscia do sekundy `now`.
 */
export function periodStatus(periods: LessonPeriod[], now: Date): PeriodStatus {
  const sorted = validPeriods(periods);
  const nowSec = secondsOfDay(now);
  for (let i = 0; i < sorted.length; i += 1) {
    const p = sorted[i];
    const startSec = parseHm(p.start) * 60;
    const endSec = parseHm(p.end) * 60;
    if (nowSec >= startSec && nowSec < endSec) {
      return { kind: 'lesson', period: p, endsAtMin: endSec / 60, remainingSec: endSec - nowSec };
    }
    // Przerwa: miedzy koncem poprzedniej a poczatkiem tej godziny.
    if (i > 0 && nowSec < startSec && nowSec >= parseHm(sorted[i - 1].end) * 60) {
      return { kind: 'break', nextPeriod: p, startsAtMin: startSec / 60, remainingSec: startSec - nowSec };
    }
  }
  return { kind: 'none' };
}

/** "23 min" dla >= 60 s (zaokraglone w gore), "45 s" ponizej minuty. */
export function formatRemaining(sec: number): string {
  const s = Math.max(0, Math.ceil(sec));
  if (s >= 60) return `${Math.ceil(s / 60)} min`;
  return `${s} s`;
}

/** Wpisy planu z danego dnia, posortowane po numerze godziny. */
export function entriesForDay(timetable: TimetableEntry[], weekday: number): TimetableEntry[] {
  return timetable.filter((e) => e.weekday === weekday).sort((a, b) => a.period - b.period);
}

/** Wpis planu trwajacej wlasnie lekcji (wg dzwonkow), albo undefined. */
export function currentEntry(timetable: TimetableEntry[], periods: LessonPeriod[], now: Date): TimetableEntry | undefined {
  const status = periodStatus(periods, now);
  if (status.kind !== 'lesson') return undefined;
  const weekday = weekdayOf(now);
  if (weekday === 0) return undefined;
  return timetable.find((e) => e.weekday === weekday && e.period === status.period.no);
}

/**
 * Wpis "biezacy albo najblizszy" na dzis: trwajaca lekcja, a jesli jej nie ma
 * (przerwa / przed lekcjami) - pierwsza jeszcze nierozpoczeta. Po ostatniej
 * lekcji dnia undefined. Uzywane na pulpicie do podswietlenia.
 */
export function currentOrNextEntry(
  timetable: TimetableEntry[],
  periods: LessonPeriod[],
  now: Date,
): TimetableEntry | undefined {
  const weekday = weekdayOf(now);
  if (weekday === 0) return undefined;
  const current = currentEntry(timetable, periods, now);
  if (current) return current;
  const nowMin = minutesOfDay(now);
  const startOf = new Map(validPeriods(periods).map((p) => [p.no, parseHm(p.start)]));
  return entriesForDay(timetable, weekday).find((e) => {
    const start = startOf.get(e.period);
    return start !== undefined && start > nowMin;
  });
}
