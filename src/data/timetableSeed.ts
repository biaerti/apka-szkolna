// Dane startowe planu lekcji: dzwonki SP97 i tygodniowy plan nauczyciela
// (z dziennika, od 05.10.2026). Plan jest zapisany po NAZWACH
// klas i dopasowywany do klas w store po znormalizowanej nazwie - dzieki temu
// ten sam seed dziala dla danych demo, localStorage i klas pobranych z chmury
// (kazde maja inne id). Klasy, ktorych nie ma w store, sa pomijane.

import { normalizeClassName, timetableCellId } from '../lib/timetable';
import type { LessonPeriod, SchoolClass, TimetableEntry } from './types';

/** Dzwonki: lekcje 1-6. Lekcja 0 i 7+ nieznane - nauczyciel dopisze w UI. */
export const DEFAULT_PERIODS: LessonPeriod[] = [
  { no: 1, start: '8:00', end: '8:45' },
  { no: 2, start: '8:50', end: '9:35' },
  { no: 3, start: '9:40', end: '10:25' },
  { no: 4, start: '10:35', end: '11:20' },
  { no: 5, start: '11:25', end: '12:10' },
  { no: 6, start: '12:30', end: '13:15' },
];

export const DEFAULT_ROOM = '31';

/** Plan nauczyciela: [dzien 1-5, numer lekcji, nazwa klasy, sala?, dopisek?]. */
const TEACHER_PLAN: Array<[number, number, string, string?, string?]> = [
  [1, 1, 'V A'], [1, 2, 'V A'], [1, 3, 'IV A'], [1, 4, 'IV A'], [1, 5, 'IV C'], [1, 6, 'IV C'],
  [2, 1, 'IV B'], [2, 2, 'IV B'], [2, 4, 'IV C'], [2, 5, 'IV A', '30'], [2, 6, 'V A', '30'],
  [3, 2, 'IV C', '13'], [3, 3, 'IV A', '13'], [3, 4, 'IV A', '31', 'Zajęcia z wychowawcą'], [3, 5, 'V A'],
  [4, 1, 'IV B'], [4, 2, 'IV B'],
  [5, 1, 'IV A'], [5, 2, 'V A'], [5, 3, 'IV C'], [5, 4, 'IV B'],
];

/** Buduje wpisy planu dla klas obecnych w `classes` (dopasowanie po nazwie). */
export function buildSeedTimetable(classes: SchoolClass[]): TimetableEntry[] {
  const byName = new Map(classes.map((c) => [normalizeClassName(c.name), c.id]));
  const out: TimetableEntry[] = [];
  for (const [weekday, period, name, room, note] of TEACHER_PLAN) {
    const classId = byName.get(normalizeClassName(name));
    if (!classId) continue;
    out.push({ id: timetableCellId(weekday, period), weekday, period, classId, room: room ?? DEFAULT_ROOM, note });
  }
  return out;
}
