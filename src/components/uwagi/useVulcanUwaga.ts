// "Wpisz do VULCANA" dla jednej uwagi: buduje paczke (src/lib/vulcanUwaga.ts),
// wysyla ja do dodatku (src/lib/vulcanBridge.ts) i trzyma krotki stan do
// pokazania pod przyciskiem. Dodatek otwiera formularz i ZATRZYMUJE sie przed
// zapisem - odhaczenie "wpisane" przychodzi osobno, przez useVulcanUwagaSaved.

import { useCallback, useEffect, useState } from 'react';
import { useStore } from '../../data/store';
import type { RecapEvent } from '../../data/types';
import { onVulcanUwagaSaved, sendUwagaToVulcan, type VulcanSendResult } from '../../lib/vulcanBridge';
import { buildVulcanUwagaTransfer } from '../../lib/vulcanUwaga';

export type VulcanUwagaState = 'idle' | 'sending' | VulcanSendResult | 'no-student';

export const VULCAN_STATE_LABEL: Record<VulcanUwagaState, string> = {
  idle: '',
  sending: 'Wysyłam do VULCANA…',
  sent: 'Przekazano do pomocnika VULCAN - zapis trwa…',
  missing: 'Brak pomocnika Chrome. Zainstaluj folder vulcan-extension i odśwież kartę.',
  error: 'Pomocnik nie odpowiedział. Odśwież kartę apki i VULCANA.',
  'no-student': 'Nie ma tego ucznia albo klasy - wpisz uwagę ręcznie.',
};

export function useVulcanUwaga() {
  const [state, setState] = useState<VulcanUwagaState>('idle');

  const send = useCallback(async (event: RecapEvent) => {
    const s = useStore.getState();
    const student = s.students.find((st) => st.id === event.studentId);
    const schoolClass = s.classes.find((c) => c.id === event.classId);
    if (!student || !schoolClass) {
      setState('no-student');
      return;
    }
    setState('sending');
    const result = await sendUwagaToVulcan(buildVulcanUwagaTransfer({ event, student, schoolClass, periods: s.periods }));
    setState(result);
  }, []);

  return { state, send, reset: () => setState('idle') };
}

/**
 * Globalny nasluch (jedno miejsce - AppShell): zapis w VULCANIE odhacza
 * uwage jako wpisana, zeby nie wisiala w zakladce Uwagi i w popupie.
 */
export function useVulcanUwagaSaved(): void {
  const updateRecapEvent = useStore((s) => s.updateRecapEvent);
  useEffect(() => onVulcanUwagaSaved((eventId) => updateRecapEvent(eventId, { wpisane: true })), [updateRecapEvent]);
}
