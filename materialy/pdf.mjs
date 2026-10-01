// Wspólny drukarz: plik HTML -> PDF A4 przez headless Chrome (CDP Page.printToPDF).
// Używają go zeszyt.mjs i sprawdzian.mjs. Fonty z Google Fonts - potrzebny internet.
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const TU = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(TU, '..');
const czekaj = (ms) => new Promise((r) => setTimeout(r, ms));

export async function drukujPdf(htmlPath, pdfPath, port = 9360) {
  const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
    '--headless=new', `--remote-debugging-port=${port}`,
    `--user-data-dir=${join(ROOT, 'tmp', `chrome-pdf-${port}`)}`,
    '--disable-gpu', '--hide-scrollbars', 'about:blank',
  ], { stdio: 'ignore' });
  let msgId = 0; const oczekujace = new Map(); let ws;
  const cdp = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++msgId; oczekujace.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
  try {
    let url;
    for (let i = 0; i < 50 && !url; i++) {
      try {
        const t = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
        url = t.find((x) => x.type === 'page')?.webSocketDebuggerUrl;
      } catch {}
      if (!url) await czekaj(200);
    }
    if (!url) throw new Error('Chrome nie wstał');
    ws = new WebSocket(url);
    await new Promise((r) => ws.addEventListener('open', r));
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && oczekujace.has(msg.id)) {
        const { resolve, reject } = oczekujace.get(msg.id);
        oczekujace.delete(msg.id);
        msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
      }
    });
    await cdp('Page.enable');
    await cdp('Page.navigate', { url: pathToFileURL(htmlPath).href });
    await czekaj(1500);
    await cdp('Runtime.evaluate', { expression: 'document.fonts.ready.then(() => "ok")', awaitPromise: true });
    const pdf = await cdp('Page.printToPDF', { printBackground: true, preferCSSPageSize: true });
    mkdirSync(dirname(pdfPath), { recursive: true });
    writeFileSync(pdfPath, Buffer.from(pdf.data, 'base64'));
  } finally {
    try { ws?.close(); } catch {}
    chrome.kill();
  }
}

/** **pogrubienie**, ==zaznaczenie==, __podkreślenie__, ~~skreślenie~~ -> HTML (z ucieczką znaków). */
export function znaczniki(tekst) {
  return String(tekst)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/==(.+?)==/g, '<mark>$1</mark>')
    .replace(/__(.+?)__/g, '<u>$1</u>')
    .replace(/~~(.+?)~~/g, '<s>$1</s>');
}

export const STYL_BAZOWY = `
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&family=Nunito:wght@500;700;800&display=swap&subset=latin-ext');
:root { --krem: #FFF7EA; --pom: #F58220; --roz: #E8425A; --ciemny: #4A3B32; --szary: #7a6a5c; --ramka: #e2d3bd; --ziel: #2E9E5B; --nieb: #3C7DD9; --fiol: #8A4FD0; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Nunito', sans-serif; color: var(--ciemny); font-size: 11.5pt; line-height: 1.4; }
h1, h2, h3 { font-family: 'Baloo 2', sans-serif; line-height: 1.1; }
mark { background: #ffe066; border-radius: 3px; padding: 0 2px; color: inherit; }
s { color: var(--roz); }
`;
