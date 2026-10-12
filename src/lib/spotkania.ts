// Spotkania w planie tygodnia: co jest danego dnia, gdzie stoi miedzy
// lekcjami i link "dodaj do Kalendarza Google". Czyste funkcje, dane
// trzyma src/data/spotkania.ts.

import type { LessonPeriod } from '../data/types';
import { parseHm } from './timetable';

export interface Spotkanie {
  id: string;
  tytul: string;
  /** RRRR-MM-DD */
  data: string;
  /** "HH:MM" */
  od: string;
  /** "HH:MM"; null = bez konca (w Google domyslnie godzina). */
  do: string | null;
  tag: string | null;
  /** Dodane juz do Kalendarza Google. */
  wGoogle: boolean;
  createdAt: string;
}

/** Spotkania danego dnia, po godzinie. */
export function spotkaniaDnia(list: Spotkanie[], date: string): Spotkanie[] {
  return list.filter((s) => s.data === date).sort((a, b) => parseHm(a.od) - parseHm(b.od) || a.createdAt.localeCompare(b.createdAt));
}

/**
 * Po ktorej lekcji pokazac spotkanie w kolumnie dnia: 0 = przed pierwsza,
 * N = po lekcji N (zaczyna sie po starcie lekcji N, a przed startem N+1),
 * `lastPeriod` = po ostatniej lekcji dnia.
 */
export function spotkaniePoLekcji(od: string, periods: LessonPeriod[], lastPeriod: number): number {
  const at = parseHm(od);
  let after = 0;
  for (const period of periods) {
    if (period.no > lastPeriod) break;
    if (parseHm(period.start) <= at) after = Math.max(after, period.no);
  }
  return after;
}

/** Tagi juz uzyte - do podpowiedzi w polu tagu, najczesciej uzywane pierwsze. */
export function znaneTagi(list: Spotkanie[]): string[] {
  const count = new Map<string, number>();
  for (const s of list) if (s.tag) count.set(s.tag, (count.get(s.tag) ?? 0) + 1);
  return [...count.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'pl')).map(([tag]) => tag);
}

/** "13:00" albo "13:00-14:30". */
export function godzinySpotkania(s: Pick<Spotkanie, 'od' | 'do'>): string {
  return s.do ? `${s.od}-${s.do}` : s.od;
}

/**
 * Link otwierajacy w Kalendarzu Google gotowe wydarzenie do zapisania.
 * Czas lokalny (Europe/Warsaw); bez konca spotkanie trwa godzine.
 */
export function googleCalendarUrl(s: Pick<Spotkanie, 'tytul' | 'data' | 'od' | 'do' | 'tag'>): string {
  const day = s.data.replace(/-/g, '');
  const start = parseHm(s.od);
  const end = s.do && parseHm(s.do) > start ? parseHm(s.do) : start + 60;
  const stamp = (minutes: number) => {
    // Koniec po polnocy przechodzi na nastepny dzien.
    const extraDays = Math.floor(minutes / 1440);
    const date = extraDays === 0 ? day : nextDayKey(s.data, extraDays);
    const inDay = minutes % 1440;
    return `${date}T${String(Math.floor(inDay / 60)).padStart(2, '0')}${String(inDay % 60).padStart(2, '0')}00`;
  };
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: s.tytul,
    dates: `${stamp(start)}/${stamp(end)}`,
    ctz: 'Europe/Warsaw',
  });
  if (s.tag) params.set('details', `Tag: ${s.tag}`);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function nextDayKey(dateKey: string, days: number): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + days));
  return date.toISOString().slice(0, 10).replace(/-/g, '');
}
