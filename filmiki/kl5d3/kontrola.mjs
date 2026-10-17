// Kontrola ukladu filmu: kazda scena w stanie koncowym (po narracji i pauzie)
// -> zrzut + pomiar, czy cos nie wychodzi poza kadr 1280x720 i czy linie nie
// zawijaja sie. Zrzuty laduja w tmp/kontrola-<nazwa>/, arkusz zbiorczy robi
// arkusz.py. Uzycie: node filmiki/kl5d3/kontrola.mjs epitet5 [port]
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const TU = dirname(fileURLToPath(import.meta.url));
const ROOT = join(TU, '..', '..');
const nazwa = process.argv[2];
const PORT = Number(process.argv[3] || 9429);
const dir = join(ROOT, 'tmp', `kontrola-${nazwa}`);
rmSync(dir, { recursive: true, force: true });
mkdirSync(dir, { recursive: true });

const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${join(ROOT, 'tmp', `chrome-kontrola-${PORT}`)}`,
  '--window-size=1280,720', '--hide-scrollbars', '--force-device-scale-factor=1', '--disable-gpu', 'about:blank',
], { stdio: 'ignore' });
const czekaj = (ms) => new Promise(r => setTimeout(r, ms));
let msgId = 0; const ocz = new Map(); let ws;
const cdp = (method, params = {}) => new Promise((resolve, reject) => { const id = ++msgId; ocz.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params })); });
const ev = async (expression) => (await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result.value;

async function main() {
  let url;
  for (let i = 0; i < 50 && !url; i++) {
    try { url = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).find(x => x.type === 'page')?.webSocketDebuggerUrl; } catch {}
    if (!url) await czekaj(200);
  }
  ws = new WebSocket(url);
  await new Promise(r => ws.addEventListener('open', r));
  ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && ocz.has(m.id)) { const p = ocz.get(m.id); ocz.delete(m.id); m.error ? p.reject(new Error(m.error.message)) : p.resolve(m.result); } });
  await cdp('Page.enable');
  await cdp('Emulation.setDeviceMetricsOverride', { width: 1280, height: 720, deviceScaleFactor: 1, mobile: false });
  await cdp('Page.navigate', { url: pathToFileURL(join(ROOT, 'filmiki', nazwa, 'film1.html')).href });
  await czekaj(1500);
  await ev('document.fonts.ready.then(() => 1)');
  await ev('document.getElementById("playBtn").style.display = "none"');
  console.log('Brak slow:', await ev('JSON.stringify(window.__brakSlow)'));
  const sceny = await ev('JSON.stringify(TIMELINE.sceny.map(s => [s.id, s.start, s.dur, s.pauza || 0]))');
  let problemy = 0;
  for (const [id, start, dur, pauza] of JSON.parse(sceny)) {
    const t = (start + dur + Math.min(pauza, 2) + 0.4) * 1000;
    await ev(`window.__seek(${t})`);
    const raport = await ev(`(() => {
      const sc = document.querySelector('.scena[data-id="${id}"]');
      const out = [];
      sc.querySelectorAll('*').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.width && (r.bottom > 716 || r.right > 1276 || r.left < 4)) out.push('poza kadrem: ' + (el.className || el.tagName) + ' ' + Math.round(r.bottom) + '/' + Math.round(r.right));
      });
      sc.querySelectorAll('.linia, .chip, .karta .nazwa').forEach(el => {
        const lh = parseFloat(getComputedStyle(el).lineHeight) || 36;
        if (el.classList.contains('linia') && el.getBoundingClientRect().height > lh * 1.6 + 30) out.push('zawija: ' + el.textContent.slice(0, 50));
        if (el.classList.contains('chip') && el.getBoundingClientRect().height > 80) out.push('chip zawija: ' + el.textContent.slice(0, 40));
      });
      return out.slice(0, 6);
    })()`);
    const shot = await cdp('Page.captureScreenshot', { format: 'png' });
    writeFileSync(join(dir, `${id.replace('+', '_')}.png`), Buffer.from(shot.data, 'base64'));
    if (raport.length) { problemy += raport.length; console.log(id, '\n  ' + raport.join('\n  ')); }
  }
  console.log(problemy ? `PROBLEMY: ${problemy}` : 'Uklad OK');
  ws.close(); chrome.kill();
}
main().catch(e => { console.error(e); chrome.kill(); process.exit(1); });
