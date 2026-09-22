// Auto-wpis uwag do VULCANA - montowany RAZ, w App.tsx, czyli dziala tez
// podczas prezentacji (LessonPresent, QuizPresent), gdzie AppShell z popupem
// jest odmontowany. Bartek prowadzi lekcje z rzutnika, daje uwage z telefonu,
// a formularz w VULCANIE wypelnia sie sam, bez wyskakiwania czegokolwiek.
//
// Gdy z INNEGO urzadzenia przyjdzie nowa uwaga (te same reguly co popup -
// isIncomingUwaga), komputer od razu wysyla ja do pomocnika Chrome z flaga
// `background`: dodatek wypelnia formularz w karcie VULCANA BEZ wyciagania
// jej na wierzch i jak zawsze zatrzymuje sie przed "Zapisz" - zapis klika
// Bartek (zasada z PRODUCT.md: czlowiek zatwierdza).
//
// localStorage (klucz vulcan-uwaga-auto) pamieta, ktore uwagi juz poszly:
// apka i plywajacy panel to dwa okna tej samej domeny i bez tego obie
// wypelnilyby formularz, a dwa "Dodaj" to dwie uwagi w dzienniku.
// Na telefonie (APK) nie ma dodatku - sendUwagaToVulcan konczy sie cicho
// jako 'missing' i nic sie nie dzieje.
//
// Tu tez mieszka globalny pull zdarzen i nasluch "zapisane w VULCANIE"
// (przeniesione z AppShell) - musza dzialac na kazdym ekranie.

import { useEffect, useRef } from 'react';
import { useStore } from '../../data/store';
import { getDeviceId } from '../../lib/device';
import { toDateKey } from '../../lib/dates';
import { sendUwagaToVulcan } from '../../lib/vulcanBridge';
import { buildVulcanUwagaTransfer } from '../../lib/vulcanUwaga';
import { useTodayEventsPull } from '../../data/remote/useTodayEventsPull';
import { useVulcanUwagaSaved } from './useVulcanUwaga';
import { isIncomingUwaga } from './useIncomingUwagi';

const LS_KEY = 'vulcan-uwaga-auto';
/** Po tylu ms wpis w pamieci "juz poszlo" jest sprzatany (2 dni). */
const KEEP_MS = 2 * 24 * 60 * 60 * 1000;
/** Po restarcie/odświeżeniu komputera nadrabiamy tylko świeże uwagi. */
const CATCH_UP_MS = 15 * 60 * 1000;

function readSent(): Record<string, number> {
  try {
    const raw = JSON.parse(localStorage.getItem(LS_KEY) ?? '{}');
    return raw && typeof raw === 'object' ? raw : {};
  } catch {
    return {};
  }
}

/** true = ta uwaga jeszcze nie szla; oznacza ja i kaze wysylac. */
export function claimAutoSend(eventId: string, now = Date.now()): boolean {
  const sent = readSent();
  if (sent[eventId]) return false;
  const next: Record<string, number> = { [eventId]: now };
  for (const [id, at] of Object.entries(sent)) {
    if (typeof at === 'number' && now - at < KEEP_MS) next[id] = at;
  }
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  } catch {
    // localStorage niedostepny - wysylamy mimo to, uwaga wazniejsza niz dubel.
  }
  return true;
}

export function AutoVulcanUwaga() {
  useTodayEventsPull();
  useVulcanUwagaSaved();

  const recapEvents = useStore((s) => s.recapEvents);
  const seen = useRef<Set<string> | null>(null);

  useEffect(() => {
    if (!seen.current) {
      // Nie ignorujemy całego stanu początkowego. Jeśli uwaga przyszła z
      // telefonu chwilę przed odświeżeniem karty, aktywna sesja komputera ma
      // ją podjąć. Limit czasu chroni przed automatycznym wysłaniem starego
      // backlogu z całego dnia.
      seen.current = new Set();
    }
    const own = getDeviceId();
    const today = toDateKey(new Date());
    for (const e of recapEvents) {
      if (seen.current.has(e.id)) continue;
      seen.current.add(e.id);
      if (!isIncomingUwaga(e, own, today)) continue;
      if (Date.now() - new Date(e.at).getTime() > CATCH_UP_MS) continue;
      if (!claimAutoSend(e.id)) continue;
      const s = useStore.getState();
      const student = s.students.find((st) => st.id === e.studentId);
      const schoolClass = s.classes.find((c) => c.id === e.classId);
      if (!student || !schoolClass) continue;
      const transfer = buildVulcanUwagaTransfer({ event: e, student, schoolClass, periods: s.periods });
      // Wynik ignorujemy: popup i zakladka Uwagi maja przycisk na wypadek,
      // gdyby dodatku nie bylo albo cos nie wyszlo.
      void sendUwagaToVulcan({ ...transfer, background: true });
    }
  }, [recapEvents]);

  return null;
}
