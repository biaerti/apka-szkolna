// Renderuje filmik do mp4: headless Chrome + CDP (bez zaleznosci, node 22)
// klatka po klatce przez window.__seek(t), potem ffmpeg skleja z audio.
//
// Uzycie: node filmiki/czasownik/renderuj.mjs film1 [--fps 25]

import { spawn, execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const TU = dirname(fileURLToPath(import.meta.url));
const ROOT = join(TU, '..', '..');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9333;

const film = process.argv[2];
if (!film) { console.error('Podaj film, np. film1'); process.exit(1); }
const fps = Number(process.argv[process.argv.indexOf('--fps') + 1]) || 25;

const timeline = JSON.parse(readFileSync(join(TU, `timeline-${film}.json`), 'utf-8'));
const total = timeline.total;
const frames = Math.ceil(total * fps);
// klatki na D: - dysk C: bywa pelny, a to ~350 MB na film
const framesDir = join(ROOT, 'tmp', `klatki-${film}`);
rmSync(framesDir, { recursive: true, force: true });
mkdirSync(framesDir, { recursive: true });

const chrome = spawn(CHROME, [
  '--headless=new', `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${join(ROOT, 'tmp', 'chrome-render-profile')}`,
  '--window-size=1280,720', '--hide-scrollbars', '--force-device-scale-factor=1',
  '--disable-gpu', 'about:blank',
], { stdio: 'ignore' });

const czekaj = (ms) => new Promise(r => setTimeout(r, ms));

async function targetWs() {
  for (let i = 0; i < 50; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const targets = await res.json();
      const page = targets.find(t => t.type === 'page');
      if (page) return page.webSocketDebuggerUrl;
    } catch {}
    await czekaj(200);
  }
  throw new Error('Chrome nie wstal');
}

let msgId = 0;
const oczekujace = new Map();
let ws;

function cdp(method, params = {}) {
  const id = ++msgId;
  return new Promise((resolve, reject) => {
    oczekujace.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function main() {
  ws = new WebSocket(await targetWs());
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
  await cdp('Emulation.setDeviceMetricsOverride',
    { width: 1280, height: 720, deviceScaleFactor: 1, mobile: false });
  await cdp('Page.navigate', { url: pathToFileURL(join(TU, `${film}.html`)).href });
  await czekaj(1500);
  await cdp('Runtime.evaluate', {
    expression: 'document.fonts.ready.then(() => "ok")', awaitPromise: true });
  // schowaj przycisk podgladu
  await cdp('Runtime.evaluate', {
    expression: 'document.getElementById("playBtn").style.display = "none"' });

  const start = Date.now();
  for (let f = 0; f < frames; f++) {
    const t = (f / fps) * 1000;
    await cdp('Runtime.evaluate', { expression: `window.__seek(${t})` });
    const shot = await cdp('Page.captureScreenshot', { format: 'jpeg', quality: 92 });
    writeFileSync(join(framesDir, `k${String(f).padStart(5, '0')}.jpg`),
      Buffer.from(shot.data, 'base64'));
    if (f % 250 === 0) {
      console.log(`klatka ${f}/${frames} (${((Date.now() - start) / 1000).toFixed(0)}s)`);
    }
  }
  ws.close();
  chrome.kill();

  mkdirSync(join(ROOT, 'output', 'filmiki'), { recursive: true });
  const mp4 = join(ROOT, 'output', 'filmiki', `czasownik-${film}.mp4`);
  execFileSync('ffmpeg', [
    '-y', '-loglevel', 'error',
    '-framerate', String(fps), '-i', join(framesDir, 'k%05d.jpg'),
    '-i', join(TU, 'audio', `${film}-sciezka.mp3`),
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '160k', '-shortest', mp4,
  ], { stdio: 'inherit' });
  rmSync(framesDir, { recursive: true, force: true });
  console.log(`Gotowe: ${mp4}`);
}

main().catch(e => { console.error(e); chrome.kill(); process.exit(1); });
