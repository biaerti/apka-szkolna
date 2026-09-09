// Uwagi za zachowanie jako lista rzeczy DO WPISANIA DO DZIENNIKA.
//
// Uwaga nie ma juz zadnych skutkow w kole (patrz src/lib/recap.ts) - jest
// notatka nauczyciela: "ta osoba przeszkadzala, wpisz jej to po lekcjach".
// Zakladka "Uwagi" (src/pages/Uwagi.tsx) uklada je w tydzien, zeby po ostatniej
// lekcji dalo sie usiasc i przepisac wszystko do Vulcana za jednym razem.
//
// Tu siedza same obliczenia: filtrowanie po tygodniu i grupowanie po dniach.

import type { RecapEvent } from '../data/types';
import { toDateKey } from './dates';

/** Uwagi z podanego zakresu dni, pogrupowane po dacie ("RRRR-MM-DD"). */
export function uwagiByDay(events: RecapEvent[], days: Date[]): Map<string, RecapEvent[]> {
  const keys = new Set(days.map(toDateKey));
  const out = new Map<string, RecapEvent[]>();
  for (const key of keys) out.set(key, []);
  for (const e of events) {
    if (e.result !== 'uwaga') continue;
    const key = toDateKey(new Date(e.at));
    const list = out.get(key);
    if (list) list.push(e);
  }
  for (const list of out.values()) {
    list.sort((a, b) => a.at.localeCompare(b.at));
  }
  return out;
}

/** Ile uwag z podanej listy czeka jeszcze na wpisanie do dziennika. */
export function doWpisania(events: RecapEvent[]): number {
  return events.filter((e) => e.result === 'uwaga' && !e.wpisane).length;
}

/** Godzina uwagi ("HH:MM") - w kalendarzu wystarczy, zeby odtworzyc, ktora to byla lekcja. */
export function uwagaTime(event: RecapEvent): string {
  const d = new Date(event.at);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/**
 * Gotowe tresci uwag - jednym klikiem, bo uwage wpisuje sie w trakcie lekcji,
 * miedzy jednym a drugim zadaniem. Kolejnosc od najczestszej.
 */
export const UWAGA_PRESETS = [
  'Przeszkadza na lekcji',
  'Rozmawia i przekrzykuje',
  'Nie wykonuje poleceń',
  'Telefon na lekcji',
  'Wyśmiewa kolegów',
];

/** Etykieta uwagi na liscie - wlasna tresc albo domyslna, gdy nauczyciel jej nie wpisal. */
export function uwagaLabel(event: RecapEvent): string {
  return event.note?.trim() || 'Przeszkadza na lekcji';
}
