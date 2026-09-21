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
function extMain(kind, lastName) {
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

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === 'EXT_RUN') {
    (async () => {
      const tabId = _sender.tab?.id;
      if (!tabId) throw new Error('Brak karty nadawcy.');
      const [res] = await chrome.scripting.executeScript({
        target: { tabId },
        world: 'MAIN',
        func: extMain,
        args: [message.kind || 'button', message.lastName || ''],
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
      const tabs = await chrome.tabs.query({ url: APP_URLS });
      for (const tab of tabs) {
        if (!tab.id) continue;
        try { await chrome.tabs.sendMessage(tab.id, { type: 'VULCAN_UWAGA_SAVED', eventId: message.eventId }); } catch { /* karta bez mostu */ }
      }
      sendResponse({ ok: true });
    })();
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
