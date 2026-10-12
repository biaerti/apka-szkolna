// Spotkania w planie tygodnia: co jest danego dnia i gdzie stoi miedzy
// lekcjami. Czyste funkcje, dane trzyma src/data/spotkania.ts.

import type { LessonPeriod } from '../data/types';
import { parseHm } from './timetable';

export interface Spotkanie {
  id: string;
  tytul: string;
  /** RRRR-MM-DD */
  data: string;
  /** "HH:MM" */
  od: string;
  /** "HH:MM"; null = bez konca. */
  do: string | null;
  tag: string | null;
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
