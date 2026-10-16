// Arkusze wyrownawcze na projektor: tekst obok pytan, "Odpowiedz" przy kazdym zadaniu,
// klikniecie zdania w tekscie zaznacza je (dowod z tekstu). Dane z arkusze.json
// (zapisuje je build_worksheets.py razem z kluczem).
// Uzycie: node tools/arkusze-projektor.mjs <folder z arkusze.json>
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public', 'materialy', 'wyrownawcze', 'projektor');
mkdirSync(OUT, { recursive: true });
const arkusze = JSON.parse(readFileSync(join(process.argv[2], 'arkusze.json'), 'utf8'));

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const nl = (s) => esc(s).replace(/\n/g, '<br>');
const bezKropki = (s) => s.trim().replace(/\.$/, '');

/** Zadania z numerem; wiersze bez numeru (np. zdania P/F) doklejamy do poprzedniego. */
function grupuj(zadania) {
  const out = [];
  for (const [n, prompt, , options] of zadania) {
    if (!n && out.length) out[out.length - 1].extra.push(prompt);
    else out.push({ n, prompt, options, extra: [] });
  }
  return out;
}

function zadanie({ n, prompt, options, extra }, odp) {
  let html = `<div class="zad"><div class="pol"><span class="nr">${n}</span><span>${nl(prompt)}</span></div>`;
  for (const e of extra) html += `<p class="extra">${nl(e)}</p>`;
  if (Array.isArray(options)) {
    html += '<ul class="opcje">' + options.map((o) => {
      const dobra = odp && odp.split(/;\s*/).some((c) => bezKropki(c) === bezKropki(o));
      return `<li${dobra ? ' class="dobra"' : ''}>${esc(o)}</li>`;
    }).join('') + '</ul>';
  }
  if (options && options.table) {
    const [naglowek, wiersze] = options.table;
    html += `<table class="siatka"><tr>${naglowek.map((h) => `<th>${esc(h)}</th>`).join('')}</tr>`
      + wiersze.map((w) => `<tr>${w.map((c, i) => (i === 0 ? `<th>${esc(c)}</th>` : '<td></td>')).join('')}</tr>`).join('')
      + '</table>';
  }
  if (odp) html += `<button type="button" class="pokaz">Odpowiedź</button><div class="odp">${nl(odp)}</div>`;
  return html + '</div>';
}

function tekst(akapity) {
  return akapity.map((a) => {
    const dialog = a.startsWith('–');
    const zdania = a.split(/(?<=[.!?])\s+(?=[A-ZĄĆĘŁŃÓŚŹŻ–])/);
    return `<p${dialog ? ' class="dialog"' : ''}>${zdania.map((z) => `<span class="zd">${esc(z)}</span>`).join(' ')}</p>`;
  }).join('');
}

const STYL = `
:root { --fs: 22px; --ink: #1F2937; --blue: #1F4E78; --pale: #EAF3F8; --line: #D9DEE5; --ok: #15803D; --okbg: #E8F6EC; --mark: #FFE066; }
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { height: 100%; }
body { font-family: 'Segoe UI', Calibri, Arial, sans-serif; color: var(--ink); background: #F8FAFC; font-size: var(--fs); line-height: 1.45; display: flex; flex-direction: column; }
header { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 16px; padding: 10px 24px; background: #fff; border-bottom: 1px solid var(--line); font-size: 16px; }
header h1 { font-size: 22px; margin-right: auto; }
header h1 small { font-weight: 600; color: #6B7280; font-size: 15px; margin-left: 8px; }
button { font: inherit; cursor: pointer; }
.przyc { border: 1px solid #CBD5E1; background: #fff; border-radius: 8px; padding: 6px 12px; font-size: 15px; font-weight: 600; color: #374151; }
.przyc:hover { background: #F1F5F9; }
.przyc[aria-pressed="true"] { background: var(--blue); border-color: var(--blue); color: #fff; }
main { flex: 1; min-height: 0; }
.widok { display: none; height: 100%; }
.widok.on { display: grid; }
#czytanie { grid-template-columns: 1.1fr 1fr; }
.kol { overflow-y: auto; padding: 24px 32px 48px; }
.kol + .kol { border-left: 1px solid var(--line); background: #fff; }
#jezyk .kol { max-width: 1100px; width: 100%; margin: 0 auto; background: #fff; }
h2 { font-size: 1.05em; color: var(--blue); margin-bottom: 12px; }
.tekst p { text-indent: 1.4em; margin-bottom: .6em; }
.tekst p.dialog { text-indent: 0; padding-left: 1.4em; }
.zd { cursor: pointer; border-radius: 4px; transition: background .15s; }
.zd:hover { background: #F1F5F9; }
.zd.zazn { background: var(--mark); }
.zad { padding: 14px 0 16px; border-bottom: 1px dashed var(--line); }
.pol { display: flex; gap: 12px; }
.nr { flex: none; background: var(--blue); color: #fff; border-radius: 99px; min-width: 1.6em; height: 1.6em; display: inline-flex; align-items: center; justify-content: center; font-size: .8em; font-weight: 700; margin-top: .15em; }
.extra { margin: 6px 0 0 calc(1.6em + 12px); white-space: pre-wrap; }
.opcje { list-style: none; margin: 6px 0 0 calc(1.6em + 12px); }
.opcje li { padding: 3px 10px; border-radius: 6px; margin-bottom: 3px; border: 1px solid transparent; }
.opcje li::before { content: '□  '; white-space: pre; }
.zad.otw .opcje li.dobra { background: var(--okbg); border-color: var(--ok); color: var(--ok); font-weight: 700; }
.zad.otw .opcje li.dobra::before { content: '☑  '; }
.siatka { border-collapse: collapse; margin: 8px 0 0 calc(1.6em + 12px); font-size: .85em; }
.siatka th, .siatka td { border: 1px solid #CBD5E1; padding: 6px 12px; text-align: left; min-width: 7em; height: 2em; }
.siatka tr:first-child th { background: var(--pale); }
.pokaz { display: block; margin: 10px 0 0 calc(1.6em + 12px); border: 1px solid var(--ok); color: var(--ok); background: #fff; border-radius: 8px; padding: 3px 12px; font-size: .7em; font-weight: 700; }
.zad.otw .pokaz { background: var(--ok); color: #fff; }
.odp { display: none; margin: 8px 0 0 calc(1.6em + 12px); padding: 10px 14px; background: var(--okbg); border-left: 4px solid var(--ok); border-radius: 0 8px 8px 0; color: #14532D; }
.zad.otw .odp { display: block; }
@media (max-width: 900px) { #czytanie { grid-template-columns: 1fr; } .widok.on { height: auto; } .kol { overflow: visible; } }
`;

const SKRYPT = `
(function () {
  var root = document.documentElement;
  function zapisz(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function czytaj(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  var fs = parseInt(czytaj('wyr-fs'), 10) || 22;
  function ustawFs() { root.style.setProperty('--fs', fs + 'px'); zapisz('wyr-fs', fs); }
  ustawFs();
  document.getElementById('mniej').onclick = function () { fs = Math.max(14, fs - 2); ustawFs(); };
  document.getElementById('wiecej').onclick = function () { fs = Math.min(40, fs + 2); ustawFs(); };
  var zakladki = document.querySelectorAll('[data-widok]');
  function pokazWidok(id) {
    zakladki.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.widok === id)); });
    document.querySelectorAll('.widok').forEach(function (w) { w.classList.toggle('on', w.id === id); });
  }
  zakladki.forEach(function (b) { b.onclick = function () { pokazWidok(b.dataset.widok); }; });
  document.addEventListener('click', function (e) {
    var p = e.target.closest('.pokaz');
    if (p) p.parentElement.classList.toggle('otw');
    var z = e.target.closest('.zd');
    if (z) z.classList.toggle('zazn');
  });
  document.getElementById('wszystkie').onclick = function () {
    var widok = document.querySelector('.widok.on');
    var zad = widok.querySelectorAll('.zad');
    var wszystkieOtw = Array.prototype.every.call(zad, function (z) { return z.classList.contains('otw'); });
    zad.forEach(function (z) { z.classList.toggle('otw', !wszystkieOtw); });
  };
  document.getElementById('wyczysc').onclick = function () {
    document.querySelectorAll('.zazn').forEach(function (z) { z.classList.remove('zazn'); });
    document.querySelectorAll('.otw').forEach(function (z) { z.classList.remove('otw'); });
  };
})();
`;

for (const ark of arkusze) {
  const odp = ark.answers;
  const czytanie = grupuj(ark.reading).map((z) => zadanie(z, odp[z.n])).join('');
  const jezyk = grupuj(ark.language).map((z) => zadanie(z, odp[z.n])).join('')
    + zadanie({ n: '12', prompt: ark.writing, extra: [] }, odp['12']);
  const html = `<!DOCTYPE html><html lang="pl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Arkusz ${ark.number} - ${esc(ark.title)}</title><style>${STYL}</style></head><body>
<header>
  <h1>Arkusz ${ark.number}  ${esc(ark.title)}${ark.level ? `<small>${esc(ark.level)}</small>` : ''}</h1>
  <button type="button" class="przyc" data-widok="czytanie" aria-pressed="true">Tekst i pytania</button>
  <button type="button" class="przyc" data-widok="jezyk" aria-pressed="false">Język i pisanie</button>
  <button type="button" class="przyc" id="wszystkie">Wszystkie odpowiedzi</button>
  <button type="button" class="przyc" id="wyczysc">Wyczyść</button>
  <button type="button" class="przyc" id="mniej" aria-label="Mniejsze litery">A−</button>
  <button type="button" class="przyc" id="wiecej" aria-label="Większe litery">A+</button>
</header>
<main>
  <section class="widok on" id="czytanie">
    <div class="kol tekst"><h2>Przeczytaj tekst</h2>${tekst(ark.text)}</div>
    <div class="kol"><h2>Sprawdź, co rozumiesz</h2>${czytanie}</div>
  </section>
  <section class="widok" id="jezyk">
    <div class="kol"><h2>Poćwicz język</h2>${jezyk}</div>
  </section>
</main>
<script>${SKRYPT}</script>
</body></html>`;
  writeFileSync(join(OUT, `${ark.stem}.html`), html);
  console.log(`projektor/${ark.stem}.html`);
}
