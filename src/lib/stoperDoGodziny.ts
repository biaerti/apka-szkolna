// Czysta logika ekranu "Stoper" (/stoper): odliczanie do KONKRETNEJ godziny,
// np. sprawdzian do 9:40. W odroznieniu od stopera na slajdzie (src/lib/timer.ts)
// nie ma tu pauzy - liczy sie zegar scienny, wiec po odswiezeniu strony albo
// uspieniu komputera czas dalej sie zgadza.

import type { LessonPeriod } from '../data/types';
import { parseHm, periodStatus } from './timetable';

/** Chwila (epoch ms) o godzinie `koniecMin` (minuty od polnocy) w dniu `now`. */
export function chwilaGodziny(koniecMin: number, now: Date): number {
  const d = new Date(now);
  d.setHours(Math.floor(koniecMin / 60), koniecMin % 60, 0, 0);
  return d.getTime();
}

/** Ile sekund zostalo do godziny `koniecMin` dzisiaj (zaokraglone w gore, nie mniej niz 0). */
export function sekundyDoGodziny(koniecMin: number, now: Date): number {
  const ms = chwilaGodziny(koniecMin, now) - now.getTime();
  return Math.max(0, Math.ceil(ms / 1000));
}

/** 2700 -> "45:00", 59 -> "0:59", 4500 -> "1:15:00". */
export function formatZostalo(sec: number): string {
  const s = Math.max(0, Math.round(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = String(s % 60).padStart(2, '0');
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${ss}`;
  return `${m}:${ss}`;
}

/**
 * Godzina, ktora podpowiadamy na start (minuty od polnocy): koniec trwajacej
 * lekcji, na przerwie koniec nastepnej, a poza planem - za 45 minut,
 * zaokraglone w gore do pelnych 5 minut.
 */
export function domyslnaGodzina(periods: LessonPeriod[], now: Date): number {
  const status = periodStatus(periods, now);
  if (status.kind === 'lesson') return status.endsAtMin;
  if (status.kind === 'break') {
    const koniec = parseHm(status.nextPeriod.end);
    if (!Number.isNaN(koniec)) return koniec;
  }
  const za45 = now.getHours() * 60 + now.getMinutes() + 45;
  return Math.min(23 * 60 + 55, Math.ceil(za45 / 5) * 5);
}
