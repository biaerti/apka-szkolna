const VULCAN_URL = 'https://dziennik-dziennik.vulcan.net.pl/wroclaw/003013/App.mvc#_ribbon-biezacalekcja-tab/ribbonBiezacaLekcjaButton';

async function deliver(tabId, payload) {
  await chrome.storage.session.set({ pendingVulcanTransfer: payload });
  try {
    await chrome.tabs.sendMessage(tabId, { type: 'VULCAN_TRANSFER', payload });
  } catch {
    // Content script odbierze paczkę po pełnym załadowaniu karty.
  }
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
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
  const { pendingVulcanTransfer } = await chrome.storage.session.get('pendingVulcanTransfer');
  if (pendingVulcanTransfer) await deliver(tabId, pendingVulcanTransfer);
});
