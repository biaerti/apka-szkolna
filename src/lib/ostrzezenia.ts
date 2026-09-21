// Ostrzezenia - krok przed uwaga.
//
// Bartek najpierw ostrzega ucznia, a uwage wpisuje dopiero przy powtorce.
// W odroznieniu od plusa czy plomby ostrzezenie NIE jest zdarzeniem jednego
// dnia: zostaje przy uczniu z lekcji na lekcje, zeby na nastepnej lekcji bylo
// widac, ze rozmowa juz byla. Znika dopiero, gdy Bartek je zdejmie albo gdy
// wpisze uwage - uwaga zdejmuje WSZYSTKIE wiszace ostrzezenia ucznia
// (store.removeRecapEvent na kazdym).
//
// Uczen moze miec kilka ostrzezen naraz (decyzja Bartka z 2026-09-21):
// pierwsze "uwazaj", drugie "to juz naprawde ostatni raz", a dopiero potem
// uwaga. Dlatego "aktywne ostrzezenia" to po prostu wszystkie istniejace
// zdarzenia result = 'ostrzezenie' - bez flagi w bazie i bez sprzatania
// po czasie.

import type { RecapEvent } from '../data/types';

/** Wiszace ostrzezenia calej klasy po uczniu, od najstarszego - do znaczkow w lawkach i arkusza akcji. */
export function warningsByStudent(events: RecapEvent[], classId: string): Map<string, RecapEvent[]> {
  const out = new Map<string, RecapEvent[]>();
  for (const e of events) {
    if (e.result !== 'ostrzezenie' || e.classId !== classId) continue;
    const list = out.get(e.studentId) ?? [];
    list.push(e);
    out.set(e.studentId, list);
  }
  for (const list of out.values()) list.sort((a, b) => a.at.localeCompare(b.at));
  return out;
}
