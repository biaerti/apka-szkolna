// Plan dnia z VULCANA (z zastepstwami) zamiast planu tygodniowego.
//
// Plan tygodniowy (zakladka "Plan") nie wie o zastepstwach ani zamianach.
// Dodatek "pomocnik VULCAN" czyta drzewo lekcji nauczyciela z karty dziennika
// (vulcan-bot.js: readScheduleFromPage), apka zapisuje to jako VulcanLesson na
// konkretny dzien, a panel i zegar - gdy na dzis sa takie wpisy - licza "ktora
// lekcja i jaka klasa" z nich, a nie z planu tygodniowego.

import type { SchoolClass, TimetableEntry, VulcanLesson } from '../data/types';
import { toDateKey } from './dates';
import { weekdayOf } from './timetable';
import { vulcanClassName, type VulcanScheduleEntry } from './vulcan';

export function vulcanLessonId(date: string, period: number): string {
  return `vl-${date}-${period}`;
}

function classKey(name: string): string {
  return name.replace(/\s+/g, '').toUpperCase();
}

/**
 * Wpisy odczytane z drzewa VULCANA -> lekcje apki. Klasa dopasowana po nazwie
 * ("4B" z VULCANA == "IV B" w apce); klasa spoza apki zostaje z sama nazwa.
 * Na jedna godzine jedna lekcja (pierwsza wygrywa).
 */
export function vulcanLessonsFromSchedule(entries: VulcanScheduleEntry[], classes: SchoolClass[]): VulcanLesson[] {
  const byName = new Map(classes.map((c) => [classKey(vulcanClassName(c.name)), c.id]));
  const out = new Map<string, VulcanLesson>();
  for (const e of entries) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(e.date) || !Number.isInteger(e.period) || e.period < 0) continue;
    const id = vulcanLessonId(e.date, e.period);
    if (out.has(id)) continue;
    const lesson: VulcanLesson = {
      id,
      date: e.date,
      period: e.period,
      className: classKey(e.className),
      subject: e.subject ?? '',
    };
    const classId = byName.get(classKey(e.className));
    if (classId) lesson.classId = classId;
    if (e.replacement) lesson.replacement = e.replacement;
    out.set(id, lesson);
  }
  return [...out.values()];
}

/** Lekcje z VULCANA na dany dzien, po numerze godziny. */
export function vulcanLessonsForDate(lessons: VulcanLesson[], date: string): VulcanLesson[] {
  return lessons.filter((l) => l.date === date).sort((a, b) => a.period - b.period);
}

/**
 * Plan tygodniowy z dzisiejszym dniem podmienionym na plan z VULCANA - o ile
 * na dzis cokolwiek z VULCANA przyszlo. Wynik mozna podac wprost do
 * currentOrNextEntry / entriesForDay. Lekcje w klasach spoza apki pomijamy
 * (TimetableEntry bez klasy to tylko dopisek) - pokazuje je vulcanLessonsForDate.
 */
export function effectiveTimetable(timetable: TimetableEntry[], vulcan: VulcanLesson[], now: Date): TimetableEntry[] {
  const weekday = weekdayOf(now);
  if (weekday === 0) return timetable;
  const today = vulcanLessonsForDate(vulcan, toDateKey(now));
  if (today.length === 0) return timetable;
  const fromVulcan: TimetableEntry[] = today
    .filter((l) => l.classId)
    .map((l) => ({
      id: l.id,
      weekday,
      period: l.period,
      classId: l.classId,
      ...(l.replacement ? { note: l.replacement } : {}),
    }));
  return [...timetable.filter((e) => e.weekday !== weekday), ...fromVulcan];
}
