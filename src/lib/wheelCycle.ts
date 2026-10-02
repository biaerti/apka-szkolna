// Pamiec kola "do wyczerpania" (Bartek, od 5.10.2026): kto zostal wylosowany i
// odpowiadal, nie wraca na kolo - ani dzis, ani w kolejne dni - dopoki nie
// odpowie cala klasa. Wtedy kolo sie zeruje i wszyscy wracaja.
//
// Liczone wylacznie z zapisanych zdarzen (plus, kropka, plomba, pas), tak jak
// dawne answeredOnDay: przeladowanie strony nikogo nie wraca na kolo, cofniecie
// oceny zwalnia sektor, a kolo na lekcji, kolo powtorzeniowe i plywajacy panel
// widza ta sama liste. Przed WHEEL_CYCLE_START kolo pamieta tylko biezacy dzien.

import type { RecapEvent, Student } from '../data/types';
import { answeredOnDay, GRADED_RESULTS } from './recap';
import { toDateKey } from './dates';

/** Od tego dnia (lokalnie) kolo pamieta do wyczerpania, wczesniej - tylko dzien. */
export const WHEEL_CYCLE_START = '2026-10-05';

export interface WheelCycle {
  /** Ile razy uczen odpowiadal w biezacym obiegu kola. */
  answered: Map<string, number>;
  /** Ktory to obieg (0 = pierwszy). Rosnie, gdy cala klasa juz odpowiadala. */
  cycle: number;
}

/**
 * Biezacy obieg kola klasy. `students` = aktywni uczniowie klasy - obieg konczy
 * sie, gdy kazdy z nich odpowiedzial (nieobecni tez musza, wiec czekaja na
 * kole do powrotu). `sinceIso` = reczny "Reset skreslen": nowy obieg od tej chwili.
 */
export function wheelCycle(
  events: RecapEvent[],
  classId: string,
  students: Student[],
  now: Date = new Date(),
  sinceIso?: string,
): WheelCycle {
  const today = toDateKey(now);
  if (today < WHEEL_CYCLE_START) {
    return { answered: answeredOnDay(events, classId, today, sinceIso), cycle: 0 };
  }

  const ids = new Set(students.filter((s) => s.active && s.classId === classId).map((s) => s.id));
  const sinceMs = sinceIso ? new Date(sinceIso).getTime() : null;
  const relevant = events
    .filter(
      (e) =>
        e.classId === classId &&
        GRADED_RESULTS.includes(e.result) &&
        toDateKey(new Date(e.at)) >= WHEEL_CYCLE_START &&
        (sinceMs === null || new Date(e.at).getTime() >= sinceMs),
    )
    .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());

  let answered = new Map<string, number>();
  let covered = 0;
  let cycle = 0;
  for (const e of relevant) {
    const prev = answered.get(e.studentId) ?? 0;
    answered.set(e.studentId, prev + 1);
    if (prev === 0 && ids.has(e.studentId)) covered++;
    if (ids.size > 0 && covered === ids.size) {
      answered = new Map();
      covered = 0;
      cycle++;
    }
  }
  return { answered, cycle };
}
