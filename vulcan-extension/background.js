const VULCAN_URL = 'https://dziennik-dziennik.vulcan.net.pl/wroclaw/003013/App.mvc#_ribbon-biezacalekcja-tab/ribbonBiezacaLekcjaButton';

async function deliver(tabId, payload) {
  await chrome.storage.session.set({ pendingVulcanTransfer: payload });
  try {
    await chrome.tabs.sendMessage(tabId, { type: 'VULCAN_TRANSFER', payload });
  } catch {
    // Content script odbierze paczkę po pełnym załadowaniu karty.
  }
}

const APP_URLS = ['https://szkola.klippi.pl/*', 'http://localhost:5173/*', 'http://127.0.0.1:5173/*'];
const SYNC_STATE_KEY = 'vulcanSyncState';

async function appTabsBroadcast(message) {
  const tabs = await chrome.tabs.query({ url: APP_URLS });
  for (const tab of tabs) {
    if (!tab.id) continue;
    try { await chrome.tabs.sendMessage(tab.id, message); } catch { /* karta bez mostu albo w trakcie odświeżania */ }
  }
}

async function readSyncState() {
  const stored = await chrome.storage.local.get(SYNC_STATE_KEY);
  const value = stored[SYNC_STATE_KEY];
  return value && typeof value === 'object' ? value : { savedUwagi: [], attendanceChangedAt: 0 };
}

async function rememberSavedUwaga(eventId) {
  const state = await readSyncState();
  const now = Date.now();
  const savedUwagi = [
    { eventId, at: now },
    ...(Array.isArray(state.savedUwagi) ? state.savedUwagi : []).filter((item) => item?.eventId !== eventId && now - Number(item?.at || 0) < 7 * 24 * 60 * 60 * 1000),
  ].slice(0, 100);
  await chrome.storage.local.set({ [SYNC_STATE_KEY]: { ...state, savedUwagi } });
}

async function deliverUwaga(tabId, payload) {
  await chrome.storage.session.set({ pendingVulcanUwaga: payload });
  try {
    await chrome.tabs.sendMessage(tabId, { type: 'VULCAN_UWAGA', payload });
  } catch {
    // Content script odbierze paczkę po pełnym załadowaniu karty.
  }
}

async function vulcanTab() {
  const tabs = await chrome.tabs.query({ url: 'https://dziennik-dziennik.vulcan.net.pl/*' });
  return tabs.find((candidate) => candidate.id && candidate.url?.includes('/wroclaw/003013/')) ?? tabs[0];
}

// Dziala w SWIECIE STRONY (world: MAIN przez chrome.scripting) - jedyna
// droga do window.Ext, ktorej CSP VULCANA nie moze zablokowac. Elementy
// docelowe sa oznaczone atrybutem data-apka-bot przez vulcan-bot.js.
// kind 'transfer': zaznacz rekord po nazwisku i odpal handler przycisku ">".
// kind 'button': odpal handler przycisku (np. Zapisz).
function extMain(kind, lastName, payload) {
  try {
    if (!window.Ext || !Ext.getCmp) return 'no-ext';
    const cmpUp = (el, test) => {
      for (; el; el = el.parentElement) {
        if (el.id) {
          const c = Ext.getCmp(el.id);
          if (c && test(c)) return c;
        }
      }
      return null;
    };
    const isButton = (c) => c.isButton || (c.isXType && c.isXType('button'));
    if (kind === 'uwaga-fields') {
      const norm = (value) => String(value || '').replace(/\s+/g, ' ').trim().toLocaleLowerCase('pl');
      const categoryInput = document.getElementById('cmbKategorieId-inputEl');
      const contentInput = document.getElementById('idTresc-inputEl');
      const combo = (categoryInput && cmpUp(categoryInput, (c) => !!c.setValue && !!c.getStore)) || Ext.getCmp('cmbKategorieId');
      const textField = (contentInput && cmpUp(contentInput, (c) => !!c.setValue && !c.getStore)) || Ext.getCmp('idTresc');
      if (!combo || !textField) return { error: !combo ? 'no-category-component' : 'no-content-component' };

      const wanted = norm(payload && payload.category);
      const store = combo.getStore && combo.getStore();
      let record = null;
      if (store) {
        store.each((candidate) => {
          if (record) return;
          const values = Object.values(candidate.data || {}).map(norm);
          if (values.includes(wanted) || values.some((value) => value.includes(wanted))) record = candidate;
        });
      }
      if (!record) return { error: 'no-category-record' };

      if (combo.select) combo.select(record);
      const valueField = combo.valueField || 'Id';
      const categoryValue = record.get ? record.get(valueField) : record.data?.[valueField];
      if (categoryValue !== undefined && categoryValue !== null) combo.setValue(categoryValue);
      if (combo.fireEvent) {
        combo.fireEvent('select', combo, [record]);
        combo.fireEvent('change', combo, combo.getValue(), null);
      }
      textField.setValue(String(payload && payload.content || ''));
      if (textField.fireEvent) textField.fireEvent('change', textField, textField.getValue(), '');

      return {
        categoryModel: String(combo.getValue?.() ?? '').trim(),
        categoryText: String(categoryInput?.value ?? '').trim(),
        contentModel: String(textField.getValue?.() ?? '').trim(),
        contentText: String(contentInput?.value ?? '').trim(),
      };
    }
    if (kind === 'transfer') {
      const rowEl = document.querySelector('[data-apka-bot="row"]');
      const grid = rowEl && cmpUp(rowEl, (c) => !!c.getSelectionModel);
      if (grid) {
        const store = grid.getStore ? grid.getStore() : null;
        if (store && store.getCount() > 0) {
          const wanted = String(lastName || '').toLowerCase();
          let record = null;
          store.each((r) => {
            if (!record && JSON.stringify(r.data).toLowerCase().indexOf(wanted) !== -1) record = r;
          });
          grid.getSelectionModel().select(record || store.getAt(0));
        }
      }
      const arrowEl = document.querySelector('[data-apka-bot="arrow"]');
      const arrow = arrowEl && cmpUp(arrowEl, isButton);
      if (!arrow) return grid ? 'no-btn' : 'no-grid';
      if (arrow.handler) arrow.handler.call(arrow.scope || arrow, arrow, {});
      else arrow.fireEvent('click', arrow, {});
      return 'ok';
    }
    const btnEl = document.querySelector('[data-apka-bot="button"]');
    const btn = btnEl && cmpUp(btnEl, isButton);
    if (!btn) return 'no-btn';
    if (btn.handler) btn.handler.call(btn.scope || btn, btn, {});
    else btn.fireEvent('click', btn, {});
    return 'ok';
  } catch (error) {
    return 'ERR: ' + error;
  }
}

// PRAWDZIWE klikniecia myszy przez protokol DevTools (chrome.debugger) -
// dla strony nieodroznialne od reki. Ostatnia deska ratunku na przyciski
// VULCANA, ktore ignoruja syntetyczne zdarzenia i handlery przez API.
// Chrome pokazuje przy tym pasek "debugowanie" nad karta - znika po detach.
// Mierzy w karcie AKTUALNE srodki elementow [data-apka-bot-click="0..n-1"].
// Musi to sie dziac PO chrome.debugger.attach: zolty pasek "rozpoczal
// debugowanie" spycha strone w dol i uniewaznia wspolrzedne zmierzone
// wczesniej (przez to klikniecia 0.6.0 ladowaly nad celem).
function measureClickTargets(count) {
  const points = [];
  for (let i = 0; i < count; i += 1) {
    const el = document.querySelector(`[data-apka-bot-click="${i}"]`);
    if (!el) return { error: `Brak elementu nr ${i}.` };
    el.scrollIntoView({ block: 'center', inline: 'center' });
    const rect = el.getBoundingClientRect();
    points.push({ x: Math.round(rect.left + rect.width / 2), y: Math.round(rect.top + rect.height / 2) });
  }
  return { points };
}

async function realClicks(tabId, count) {
  const target = { tabId };
  await chrome.debugger.attach(target, '1.3');
  try {
    // Chwila na przelozenie strony po pojawieniu sie paska debugowania.
    await new Promise((resolve) => setTimeout(resolve, 400));
    const [measured] = await chrome.scripting.executeScript({ target: { tabId }, func: measureClickTargets, args: [count] });
    if (!measured?.result?.points) throw new Error(measured?.result?.error || 'Nie udało się zmierzyć celów kliknięć.');
    for (const point of measured.result.points) {
      await chrome.debugger.sendCommand(target, 'Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: point.x,
        y: point.y,
        pointerType: 'mouse',
      });
      for (const type of ['mousePressed', 'mouseReleased']) {
        await chrome.debugger.sendCommand(target, 'Input.dispatchMouseEvent', {
          type,
          x: point.x,
          y: point.y,
          button: 'left',
          buttons: 1,
          clickCount: 1,
          pointerType: 'mouse',
        });
      }
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
  } finally {
    try { await chrome.debugger.detach(target); } catch { /* juz odpieta */ }
  }
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === 'REAL_CLICKS') {
    (async () => {
      const tabId = _sender.tab?.id;
      if (!tabId) throw new Error('Brak karty nadawcy.');
      await realClicks(tabId, Number(message.count) || 0);
      sendResponse({ ok: true });
    })().catch((error) => sendResponse({ ok: false, error: String(error?.message || error) }));
    return true;
  }
  if (message?.type === 'EXT_RUN') {
    (async () => {
      const tabId = _sender.tab?.id;
      if (!tabId) throw new Error('Brak karty nadawcy.');
      const [res] = await chrome.scripting.executeScript({
        target: { tabId },
        world: 'MAIN',
        func: extMain,
        args: [message.kind || 'button', message.lastName || '', message.payload || null],
      });
      sendResponse({ ok: true, result: res?.result });
    })().catch((error) => sendResponse({ ok: false, error: String(error?.message || error) }));
    return true;
  }
  if (message?.type === 'OPEN_VULCAN_UWAGA') {
    (async () => {
      // background = auto-wpis w tle (uwaga z telefonu w trakcie lekcji):
      // karta VULCANA NIE wyskakuje na wierzch, np. w trakcie prezentacji.
      const wTle = !!message.payload?.background;
      let tab = await vulcanTab();
      if (!tab?.id) tab = await chrome.tabs.create({ url: VULCAN_URL, active: !wTle });
      else if (!wTle) await chrome.tabs.update(tab.id, { active: true });
      if (!tab.id) throw new Error('Nie udało się otworzyć karty VULCANA.');
      await deliverUwaga(tab.id, message.payload);
      sendResponse({ ok: true });
    })().catch((error) => sendResponse({ ok: false, error: String(error?.message || error) }));
    return true;
  }
  if (message?.type === 'VULCAN_UWAGA_SAVED') {
    // Z karty VULCANA do wszystkich kart apki: uwaga zapisana, odhacz ją.
    (async () => {
      await chrome.storage.session.remove('pendingVulcanUwaga');
      await rememberSavedUwaga(message.eventId);
      await appTabsBroadcast({ type: 'VULCAN_UWAGA_SAVED', eventId: message.eventId });
      sendResponse({ ok: true });
    })().catch((error) => sendResponse({ ok: false, error: String(error?.message || error) }));
    return true;
  }
  if (message?.type === 'VULCAN_ATTENDANCE_CHANGED') {
    (async () => {
      const state = await readSyncState();
      const changedAt = Date.now();
      await chrome.storage.local.set({ [SYNC_STATE_KEY]: { ...state, attendanceChangedAt: changedAt } });
      await appTabsBroadcast({ type: 'VULCAN_ATTENDANCE_CHANGED', changedAt });
      sendResponse({ ok: true });
    })().catch((error) => sendResponse({ ok: false, error: String(error?.message || error) }));
    return true;
  }
  if (message?.type === 'GET_VULCAN_SYNC_STATE') {
    (async () => {
      const state = await readSyncState();
      const now = Date.now();
      const savedUwagaEventIds = (Array.isArray(state.savedUwagi) ? state.savedUwagi : [])
        .filter((item) => item?.eventId && now - Number(item?.at || 0) < 7 * 24 * 60 * 60 * 1000)
        .map((item) => item.eventId);
      sendResponse({ ok: true, savedUwagaEventIds, attendanceChangedAt: Number(state.attendanceChangedAt || 0) });
    })().catch((error) => sendResponse({ ok: false, error: String(error?.message || error) }));
    return true;
  }
  if (message?.type === 'READ_VULCAN_SCHEDULE') {
    (async () => {
      const tabs = await chrome.tabs.query({ url: 'https://dziennik-dziennik.vulcan.net.pl/*' });
      const tab = tabs.find((candidate) => candidate.id && candidate.url?.includes('/wroclaw/003013/')) ?? tabs[0];
      if (!tab?.id) throw new Error('Najpierw otwórz zalogowany dziennik VULCAN.');
      const result = await chrome.tabs.sendMessage(tab.id, { type: 'READ_VULCAN_SCHEDULE' });
      sendResponse({ ok: true, entries: result?.entries ?? [] });
    })().catch((error) => sendResponse({ ok: false, error: String(error?.message || error) }));
    return true;
  }
  if (message?.type === 'READ_VULCAN_ATTENDANCE') {
    (async () => {
      const tabs = await chrome.tabs.query({ url: 'https://dziennik-dziennik.vulcan.net.pl/*' });
      const tab = tabs.find((candidate) => candidate.id && candidate.url?.includes('/wroclaw/003013/')) ?? tabs[0];
      if (!tab?.id) throw new Error('Najpierw otwórz zalogowany dziennik VULCAN.');
      const result = await chrome.tabs.sendMessage(tab.id, { type: 'READ_VULCAN_ATTENDANCE', period: message.period });
      if (result?.error) throw new Error(result.error);
      sendResponse({ ok: true, rows: result?.rows ?? [] });
    })().catch((error) => sendResponse({ ok: false, error: String(error?.message || error) }));
    return true;
  }
  if (message?.type !== 'OPEN_VULCAN_TRANSFER') return false;
  (async () => {
    const tabs = await chrome.tabs.query({ url: 'https://dziennik-dziennik.vulcan.net.pl/*' });
    let tab = tabs.find((candidate) => candidate.id && candidate.url?.includes('/wroclaw/003013/')) ?? tabs[0];
    if (!tab?.id) tab = await chrome.tabs.create({ url: VULCAN_URL, active: true });
    else await chrome.tabs.update(tab.id, { active: true });
    if (!tab.id) throw new Error('Nie udało się otworzyć karty VULCANA.');
    await deliver(tab.id, message.payload);
    sendResponse({ ok: true });
  })().catch((error) => sendResponse({ ok: false, error: String(error?.message || error) }));
  return true;
});

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  if (info.status !== 'complete' || !tab.url?.startsWith('https://dziennik-dziennik.vulcan.net.pl/')) return;
  const { pendingVulcanTransfer, pendingVulcanUwaga } = await chrome.storage.session.get(['pendingVulcanTransfer', 'pendingVulcanUwaga']);
  if (pendingVulcanTransfer) await deliver(tabId, pendingVulcanTransfer);
  if (pendingVulcanUwaga) await deliverUwaga(tabId, pendingVulcanUwaga);
});
