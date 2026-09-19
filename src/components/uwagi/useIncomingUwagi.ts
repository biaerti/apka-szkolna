// Uwagi, ktore wlasnie przyszly z INNEGO urzadzenia (telefon, widok "Sala").
//
// Po co: Bartek daje uwage z telefonu w trakcie lekcji i nie chce podchodzic
// do komputera. Komputer ma sam pokazac popup "Kowalski - przeszkadza" z
// przyciskami Pozniej / Cofnij, a docelowo "Wpisz do VULCANA".
//
// Jak: store dostaje nowe zdarzenia z chmury (pullTodayRecapEvents, realtime).
// Hook pamieta id, ktore juz widzial, i zglasza tylko NOWE zdarzenia typu
// `uwaga` z dzisiaj, z innym deviceId niz nasz i jeszcze nie wpisane. Przy
// pierwszym renderze wszystko, co juz jest w store, uchodzi za widziane -
// odswiezenie strony nie ma wysypac popupow z calego dnia.

import { useEffect, useRef, useState } from 'react';
import { useStore } from '../../data/store';
import type { RecapEvent } from '../../data/types';
import { getDeviceId } from '../../lib/device';
import { toDateKey } from '../../lib/dates';

/** Czy zdarzenie jest uwaga z dzisiaj, z innego urzadzenia i jeszcze niewpisana. */
export function isIncomingUwaga(event: RecapEvent, ownDeviceId: string, todayKey: string): boolean {
  if (event.result !== 'uwaga' || event.wpisane) return false;
  if (!event.deviceId || event.deviceId === ownDeviceId) return false;
  return toDateKey(new Date(event.at)) === todayKey;
}

export function useIncomingUwagi(): { pending: RecapEvent[]; dismiss: (id: string) => void } {
  const recapEvents = useStore((s) => s.recapEvents);
  const seen = useRef<Set<string> | null>(null);
  const [pending, setPending] = useState<RecapEvent[]>([]);

  useEffect(() => {
    if (!seen.current) {
      seen.current = new Set(recapEvents.map((e) => e.id));
      return;
    }
    const own = getDeviceId();
    const today = toDateKey(new Date());
    const fresh: RecapEvent[] = [];
    for (const e of recapEvents) {
      if (seen.current.has(e.id)) continue;
      seen.current.add(e.id);
      if (isIncomingUwaga(e, own, today)) fresh.push(e);
    }
    if (fresh.length > 0) setPending((list) => [...list, ...fresh]);
  }, [recapEvents]);

  // Uwaga cofnieta na telefonie (albo juz wpisana) znika tez z kolejki.
  useEffect(() => {
    const alive = new Map(recapEvents.map((e) => [e.id, e]));
    setPending((list) => {
      const next = list.filter((e) => {
        const cur = alive.get(e.id);
        return cur && !cur.wpisane;
      });
      return next.length === list.length ? list : next;
    });
  }, [recapEvents]);

  function dismiss(id: string) {
    setPending((list) => list.filter((e) => e.id !== id));
  }

  return { pending, dismiss };
}
