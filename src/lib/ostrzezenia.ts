// Ostrzezenia - krok przed uwaga.
//
// Bartek najpierw ostrzega ucznia, a uwage wpisuje dopiero przy powtorce.
// Ostrzezenie liczy sie tylko w dniu, w ktorym padlo (decyzja Bartka
// 2026-10-08) - nastepnego dnia uczen zaczyna od zera. W ciagu dnia znika,
// gdy Bartek je zdejmie albo wpisze uwage - uwaga zdejmuje WSZYSTKIE wiszace
// ostrzezenia ucznia (store.removeRecapEvent na kazdym). Wczesniej (od
// 2026-09-21) ostrzezenia wisialy z lekcji na lekcje.
//
// Uczen moze miec kilka ostrzezen naraz (decyzja Bartka z 2026-09-21):
// pierwsze "uwazaj", drugie "to juz naprawde ostatni raz", a dopiero potem
// uwaga. Dlatego "aktywne ostrzezenia" to po prostu wszystkie
// dzisiejsze zdarzenia result = 'ostrzezenie' - bez flagi w bazie i bez
// sprzatania; starsze zostaja w historii, ale nie sa juz aktywne.

import type { RecapEvent } from '../data/types';

/**
 * Wiszace ostrzezenia calej klasy po uczniu, od najstarszego - do znaczkow w
 * lawkach i arkusza akcji. `since` (ISO) - tylko od tej chwili, zwykle od
 * dzisiejszej polnocy.
 */
export function warningsByStudent(events: RecapEvent[], classId: string, since?: string): Map<string, RecapEvent[]> {
  const out = new Map<string, RecapEvent[]>();
  for (const e of events) {
    if (e.result !== 'ostrzezenie' || e.classId !== classId) continue;
    if (since && e.at < since) continue;
    const list = out.get(e.studentId) ?? [];
    list.push(e);
    out.set(e.studentId, list);
  }
  for (const list of out.values()) list.sort((a, b) => a.at.localeCompare(b.at));
  return out;
}
