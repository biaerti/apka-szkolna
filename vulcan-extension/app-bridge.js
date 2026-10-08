const PAGE_SOURCE = 'apka-szkolna';
const EXTENSION_SOURCE = 'vulcan-pomocnik';

function reply(type, detail) {
  window.postMessage({ source: EXTENSION_SOURCE, type, detail }, '*');
}

// Wiadomości zwrotne z aktywnej karty VULCANA. Nasłuch musi istnieć od
// załadowania content scriptu, a nie dopiero po pierwszym pingu apki.
chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === 'VULCAN_UWAGA_SAVED' && message.eventId) {
    reply('VULCAN_UWAGA_SAVED', { eventId: message.eventId });
  }
  if (message?.type === 'VULCAN_ATTENDANCE_CHANGED') {
    reply('VULCAN_ATTENDANCE_CHANGED', { changedAt: message.changedAt });
  }
  if (message?.type === 'VULCAN_FREKWENCJA_RESULT' && message.result?.jobId) {
    reply('VULCAN_FREKWENCJA_RESULT', message.result);
  }
});

// Most w karcie apki po przeladowaniu dodatku jest "osierocony": chrome.runtime
// znika i kazde sendMessage rzuca wyjatek, wiec zlecenie przepadalo po cichu.
// Teraz nie zglaszamy gotowosci, a zlecenie wraca z bledem.
const STALE = 'Dodatek został zaktualizowany - odśwież kartę apki (F5) i kartę VULCANA.';
const alive = () => Boolean(globalThis.chrome?.runtime?.id);

window.addEventListener('message', (event) => {
  if (event.source !== window || !event.data || event.data.source !== PAGE_SOURCE) return;
  if (!alive()) {
    if (event.data.type === 'VULCAN_FREKWENCJA') reply('VULCAN_FREKWENCJA_RESULT', { jobId: event.data.payload?.jobId, ok: false, message: STALE });
    if (event.data.type === 'VULCAN_UWAGA') reply('VULCAN_UWAGA_ERROR', STALE);
    if (event.data.type === 'VULCAN_TRANSFER') reply('VULCAN_TRANSFER_ERROR', STALE);
    if (event.data.type === 'VULCAN_SCHEDULE_REQUEST') reply('VULCAN_SCHEDULE_ERROR', STALE);
    if (event.data.type === 'VULCAN_ATTENDANCE_REQUEST') reply('VULCAN_ATTENDANCE_ERROR', STALE);
    if (event.data.type === 'VULCAN_ATTENDANCE_STATUS_REQUEST') reply('VULCAN_ATTENDANCE_STATUS_ERROR', STALE);
    return;
  }
  if (event.data.type === 'VULCAN_BRIDGE_PING') {
    reply('VULCAN_BRIDGE_READY');
    // Odzyskaj potwierdzenia, które przyszły, gdy karta apki spała albo była
    // właśnie odświeżana. Aktualizacja wpisane=true jest idempotentna.
    chrome.runtime.sendMessage({ type: 'GET_VULCAN_SYNC_STATE' }, (response) => {
      if (chrome.runtime.lastError || !response?.ok) return;
      for (const eventId of response.savedUwagaEventIds ?? []) {
        reply('VULCAN_UWAGA_SAVED', { eventId });
      }
      if (response.attendanceChangedAt) {
        reply('VULCAN_ATTENDANCE_CHANGED', { changedAt: response.attendanceChangedAt });
      }
    });
    return;
  }
  if (event.data.type === 'VULCAN_SCHEDULE_REQUEST') {
    chrome.runtime.sendMessage({ type: 'READ_VULCAN_SCHEDULE' }, (response) => {
      if (chrome.runtime.lastError || !response?.ok) {
        reply('VULCAN_SCHEDULE_ERROR', chrome.runtime.lastError?.message || response?.error || 'Nie udało się odczytać planu.');
        return;
      }
      reply('VULCAN_SCHEDULE_RESULT', { entries: response.entries });
    });
    return;
  }
  if (event.data.type === 'VULCAN_ATTENDANCE_REQUEST') {
    chrome.runtime.sendMessage({ type: 'READ_VULCAN_ATTENDANCE', period: event.data.period }, (response) => {
      if (chrome.runtime.lastError || !response?.ok) {
        reply('VULCAN_ATTENDANCE_ERROR', chrome.runtime.lastError?.message || response?.error || 'Nie udało się odczytać frekwencji.');
        return;
      }
      reply('VULCAN_ATTENDANCE_RESULT', { rows: response.rows });
    });
    return;
  }
  if (event.data.type === 'VULCAN_ATTENDANCE_STATUS_REQUEST') {
    chrome.runtime.sendMessage({ type: 'READ_VULCAN_ATTENDANCE_STATUS', targets: event.data.targets }, (response) => {
      if (chrome.runtime.lastError || !response?.ok) {
        reply('VULCAN_ATTENDANCE_STATUS_ERROR', chrome.runtime.lastError?.message || response?.error || 'Nie udało się odczytać stanu obecności.');
        return;
      }
      reply('VULCAN_ATTENDANCE_STATUS_RESULT', { checks: response.checks });
    });
    return;
  }
  if (event.data.type === 'VULCAN_FREKWENCJA') {
    const job = event.data.payload;
    if (!job || job.version !== 1 || job.kind !== 'frekwencja' || !job.jobId || !Array.isArray(job.students)) {
      reply('VULCAN_FREKWENCJA_RESULT', { jobId: job?.jobId, ok: false, message: 'Nieprawidłowa paczka frekwencji.' });
      return;
    }
    chrome.runtime.sendMessage({ type: 'OPEN_VULCAN_FREKWENCJA', payload: job }, (response) => {
      if (chrome.runtime.lastError || !response?.ok) {
        reply('VULCAN_FREKWENCJA_RESULT', {
          jobId: job.jobId,
          ok: false,
          message: chrome.runtime.lastError?.message || response?.error || 'Brak odpowiedzi dodatku.',
        });
      }
    });
    return;
  }
  if (event.data.type === 'VULCAN_UWAGA') {
    const uwaga = event.data.payload;
    if (!uwaga || uwaga.version !== 1 || uwaga.kind !== 'uwaga' || typeof uwaga.content !== 'string' || !uwaga.student) {
      reply('VULCAN_UWAGA_ERROR', 'Nieprawidłowa paczka uwagi.');
      return;
    }
    chrome.runtime.sendMessage({ type: 'OPEN_VULCAN_UWAGA', payload: uwaga }, (response) => {
      if (chrome.runtime.lastError || !response?.ok) {
        reply('VULCAN_UWAGA_ERROR', chrome.runtime.lastError?.message || response?.error || 'Brak odpowiedzi dodatku.');
        return;
      }
      reply('VULCAN_UWAGA_ACCEPTED');
    });
    return;
  }
  if (event.data.type !== 'VULCAN_TRANSFER') return;
  const payload = event.data.payload;
  if (!payload || payload.version !== 1 || typeof payload.topic !== 'string' || !Array.isArray(payload.attendance)) {
    reply('VULCAN_TRANSFER_ERROR', 'Nieprawidłowa paczka danych.');
    return;
  }
  chrome.runtime.sendMessage({ type: 'OPEN_VULCAN_TRANSFER', payload }, (response) => {
    if (chrome.runtime.lastError || !response?.ok) {
      reply('VULCAN_TRANSFER_ERROR', chrome.runtime.lastError?.message || response?.error || 'Brak odpowiedzi dodatku.');
      return;
    }
    reply('VULCAN_TRANSFER_ACCEPTED');
  });
});

reply('VULCAN_BRIDGE_READY');
