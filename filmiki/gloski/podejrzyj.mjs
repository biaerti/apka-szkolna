// Zrzuty wybranych momentow filmu do tmp/ - do kontroli scen bez renderu.
// Uzycie: node filmiki/gloski/podejrzyj.mjs film1 5.0 20.1 40.0 ...
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const TU = dirname(fileURLToPath(import.meta.url));
const ROOT = join(TU, '..', '..');
const film = process.argv[2];
const czasy = process.argv.slice(3).map(Number);
const PORT = 9334;

const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${join(TU, '..', '..', 'tmp', 'chrome-podglad-profile')}`,
  '--window-size=1280,720', '--hide-scrollbars', '--force-device-scale-factor=1',
  '--disable-gpu', 'about:blank',
], { stdio: 'ignore' });
const czekaj = (ms) => new Promise(r => setTimeout(r, ms));

let msgId = 0; const oczekujace = new Map(); let ws;
function cdp(method, params = {}) {
  const id = ++msgId;
  return new Promise((resolve, reject) => {
    oczekujace.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function main() {
  let url;
  for (let i = 0; i < 50 && !url; i++) {
    try {
      const t = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      url = t.find(x => x.type === 'page')?.webSocketDebuggerUrl;
    } catch {}
    if (!url) await czekaj(200);
  }
  ws = new WebSocket(url);
  await new Promise(r => ws.addEventListener('open', r));
  ws.addEventListener('message', (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && oczekujace.has(msg.id)) {
      const { resolve, reject } = oczekujace.get(msg.id);
      oczekujace.delete(msg.id);
      msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
    }
  });
  await cdp('Page.enable');
  await cdp('Emulation.setDeviceMetricsOverride', { width: 1280, height: 720, deviceScaleFactor: 1, mobile: false });
  await cdp('Page.navigate', { url: pathToFileURL(join(TU, `${film}.html`)).href });
  await czekaj(1500);
  await cdp('Runtime.evaluate', { expression: 'document.fonts.ready.then(() => "ok")', awaitPromise: true });
  await cdp('Runtime.evaluate', { expression: 'document.getElementById("playBtn").style.display = "none"' });
  mkdirSync(join(ROOT, 'tmp'), { recursive: true });
  for (const t of czasy) {
    await cdp('Runtime.evaluate', { expression: `window.__seek(${t * 1000})` });
    const shot = await cdp('Page.captureScreenshot', { format: 'png' });
    const cel = join(ROOT, 'tmp', `gloski-${film}-${t.toFixed(1)}s.png`);
    writeFileSync(cel, Buffer.from(shot.data, 'base64'));
    console.log(cel);
  }
  ws.close(); chrome.kill();
}
main().catch(e => { console.error(e); chrome.kill(); process.exit(1); });
