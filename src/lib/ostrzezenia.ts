// Ostrzezenia - krok przed uwaga.
//
// Bartek najpierw ostrzega ucznia, a uwage wpisuje dopiero przy powtorce.
// W odroznieniu od plusa czy plomby ostrzezenie NIE jest zdarzeniem jednego
// dnia: zostaje przy uczniu z lekcji na lekcje, zeby na nastepnej lekcji bylo
// widac, ze rozmowa juz byla. Znika dopiero, gdy Bartek je zdejmie albo gdy
// zamieni je w uwage - jedno i drugie kasuje wiersz (store.removeRecapEvent).
//
// Dzieki temu "aktywne ostrzezenie" to po prostu istniejace zdarzenie
// result = 'ostrzezenie'; nie trzeba ani flagi w bazie, ani sprzatania po
// czasie. Uczen ma najwyzej jedno - przycisk "Ostrzezenie" jest wyszarzony,
// gdy jakies wisi - ale gdyby ze starych danych wyszlo kilka, bierzemy
// najnowsze.

import type { RecapEvent } from '../data/types';

/** Aktywne ostrzezenie ucznia albo undefined. */
export function activeWarning(events: RecapEvent[], studentId: string): RecapEvent | undefined {
  let last: RecapEvent | undefined;
  for (const e of events) {
    if (e.result !== 'ostrzezenie' || e.studentId !== studentId) continue;
    if (!last || e.at > last.at) last = e;
  }
  return last;
}

/** Ostrzezenia calej klasy po uczniu - do znaczkow w lawkach i na liscie. */
export function warningsByStudent(events: RecapEvent[], classId: string): Map<string, RecapEvent> {
  const out = new Map<string, RecapEvent>();
  for (const e of events) {
    if (e.result !== 'ostrzezenie' || e.classId !== classId) continue;
    const last = out.get(e.studentId);
    if (!last || e.at > last.at) out.set(e.studentId, e);
  }
  return out;
}
