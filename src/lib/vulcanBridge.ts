// Most miedzy karta apki a dodatkiem Chrome "pomocnik VULCAN" (vulcan-extension/
// app-bridge.js). Rozmowa idzie przez window.postMessage: apka wysyla
// { source: 'apka-szkolna', type, payload }, dodatek odpowiada
// { source: 'vulcan-pomocnik', type, detail }.
//
// Dziennik (src/pages/Journal.tsx) ma swoj wlasny, starszy kod na to samo -
// tu jest wersja dla uwag, uzywana z popupu (IncomingUwagaToast) i z karty w
// zakladce Uwagi, gdzie nie ma miejsca na osobny stan mostu w kazdym miejscu.

import type { VulcanUwagaTransfer } from './vulcanUwaga';

const APP = 'apka-szkolna';
const HELPER = 'vulcan-pomocnik';

export type VulcanSendResult = 'sent' | 'missing' | 'error';

/**
 * Wysyla uwage do dodatku. 'missing' = dodatek nie odpowiedzial (nie ma go
 * w tej przegladarce albo karta nie zostala odswiezona po instalacji).
 */
export function sendUwagaToVulcan(payload: VulcanUwagaTransfer, timeoutMs = 1500): Promise<VulcanSendResult> {
  return new Promise((resolve) => {
    let done = false;
    const finish = (result: VulcanSendResult) => {
      if (done) return;
      done = true;
      window.removeEventListener('message', onMessage);
      window.clearTimeout(timer);
      resolve(result);
    };
    function onMessage(event: MessageEvent) {
      if (event.source !== window || !event.data || event.data.source !== HELPER) return;
      if (event.data.type === 'VULCAN_UWAGA_ACCEPTED') finish('sent');
      if (event.data.type === 'VULCAN_UWAGA_ERROR') finish('error');
    }
    const timer = window.setTimeout(() => finish('missing'), timeoutMs);
    window.addEventListener('message', onMessage);
    window.postMessage({ source: APP, type: 'VULCAN_UWAGA', payload }, '*');
  });
}

/**
 * Nasluch "zapisane w VULCANIE": dodatek odsyla eventId po tym, jak Bartek
 * kliknal Zapisz w formularzu (albo potwierdzil w panelu pomocnika). Zwraca
 * funkcje odpinajaca.
 */
export function onVulcanUwagaSaved(callback: (eventId: string) => void): () => void {
  function onMessage(event: MessageEvent) {
    if (event.source !== window || !event.data || event.data.source !== HELPER) return;
    if (event.data.type !== 'VULCAN_UWAGA_SAVED') return;
    const id = event.data.detail?.eventId;
    if (typeof id === 'string' && id) callback(id);
  }
  window.addEventListener('message', onMessage);
  return () => window.removeEventListener('message', onMessage);
}
