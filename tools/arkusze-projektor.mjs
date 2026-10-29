// Arkusze wyrownawcze na projektor: tekst obok pytan, "Odpowiedz" przy kazdym zadaniu,
// klikniecie zdania w tekscie zaznacza je (dowod z tekstu). Dane z arkusze.json
// (zapisuje je build_worksheets.py razem z kluczem). Przy wybranych zadaniach "Slajd"
// pokazuje odpowiedz jako obrazek na caly ekran (tools/arkusze-wizualizacje.mjs),
// a "Punktacja" przelicza dobre zadania na plusy.
// Uzycie: node tools/arkusze-projektor.mjs <folder z arkusze.json>
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { WIZUALIZACJE } from './arkusze-wizualizacje.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public', 'materialy', 'wyrownawcze', 'projektor');
mkdirSync(OUT, { recursive: true });
const arkusze = JSON.parse(readFileSync(join(process.argv[2], 'arkusze.json'), 'utf8'));

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const nl = (s) => esc(s).replace(/\n/g, '<br>');
const bezKropki = (s) => s.trim().replace(/\.$/, '');

/** Znaczniki z arkusze-wizualizacje.mjs: [wyraz|klasa|etykieta], ==x==, **x**, ~~x~~. */
const md = (s) => esc(s)
  .replace(/\[([^\]|]+)\|([a-z]+)(?:\|([^\]]+))?\]/g, (_, w, k, lab) =>
    `<span class="t t-${k}">${lab ? `<span class="t-lab">${lab}</span>` : ''}${w}</span>`)
  .replace(/==(.+?)==/g, '<mark>$1</mark>')
  .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
  .replace(/~~(.+?)~~/g, '<s>$1</s>');

const STRZALKA = '<svg viewBox="0 0 100 24" aria-hidden="true"><path d="M2 12h82" /><path d="M80 3l16 9-16 9z" class="grot" /></svg>';
const SAMOGLOSKI = /([aąeęioóuy])/gi;

const WIDOKI = {
  para: (w) => `<div class="v-para">${w.wiersze.map(({ lewy, lacznik, prawy }) => `
    <div class="v-para-w">
      <div class="box ${lewy[0] === 'SKUTEK' ? 'b-sk' : 'b-pr'}"><div class="etyk">${esc(lewy[0])}</div><div>${md(lewy[1])}</div></div>
      <div class="strz">${lacznik ? `<span>${esc(lacznik)}</span>` : ''}${STRZALKA}</div>
      <div class="box ${prawy[0] === 'PRZYCZYNA' ? 'b-pr' : 'b-sk'}"><div class="etyk">${esc(prawy[0])}</div><div>${md(prawy[1])}</div></div>
    </div>`).join('')}</div>${w.wynik ? `<p class="v-wynik">${md(w.wynik)}</p>` : ''}`,
  czasy: (w) => `<div class="v-czasy"><div class="os"></div>${w.items.map((c) => `
    <div class="czas${c.tag === 'odpowiedź' ? ' odp-c' : ''}${c.tag === 'w zadaniu' ? ' zad-c' : ''}">
      <div class="kiedy">${esc(c.kiedy)}</div><div class="kropka"></div>
      <div class="karta">${c.tag ? `<span class="tag">${esc(c.tag)}</span>` : ''}
        <div class="nazwa">czas ${esc(c.nazwa)}</div><div class="opis">${esc(c.opis)}</div>
        <div class="przyklad">${md(c.przyklad)}</div>${c.extra ? `<div class="opis">${md(c.extra)}</div>` : ''}</div>
    </div>`).join('')}</div>`,
  kolumny: (w) => `<div class="v-kolumny">${w.kolumny.map((k) => `
    <div class="kolumna k-${k.kolor || 'niebieski'}">
      <div class="k-tyt">${esc(k.tytul)}${k.znak ? ` <span class="znak">${esc(k.znak)}</span>` : ''}</div>
      ${k.opis ? `<div class="k-opis">${esc(k.opis)}</div>` : ''}
      ${k.items.map((i) => `<div class="k-item${i.ok ? ' ok' : ''}">${md(i.t)}${i.uw ? `<small>${md(i.uw)}</small>` : ''}</div>`).join('')}
    </div>`).join('')}</div>`,
  kroki: (w) => {
    const litery = w.alfabet ? new Set(w.items.map((i) => i.t[0].toLowerCase())) : null;
    const pasek = litery ? `<div class="alfabet">${[...'aąbcćdeęfghijklłmnńoóprsśtuwyzźż'].map((l) => `<span${litery.has(l) ? ' class="on"' : ''}>${l}</span>`).join('')}</div>` : '';
    return `${pasek}<div class="v-kroki${w.items.length > 4 ? ' dlugie' : ''}">${w.items.map((i, n) => `${n ? `<div class="strz">${STRZALKA}</div>` : ''}
      <div class="krok${i.hl ? ' hl' : ''}"><div class="nr">${esc(i.nr || n + 1)}</div><div>${litery ? `<b class="pierwsza">${esc(i.t[0])}</b>${esc(i.t.slice(1))}` : md(i.t)}</div></div>`).join('')}</div>${w.dopisek ? `<p class="v-wynik">${md(w.dopisek)}</p>` : ''}`;
  },
  tabela: (w) => `<table class="v-tabela"><tr>${w.naglowki.map((h) => `<th>${esc(h)}</th>`).join('')}</tr>${w.wiersze.map((r) => `<tr>${r.map((c, i) => (i === 0 ? `<th>${md(c)}</th>` : `<td>${md(c)}</td>`)).join('')}</tr>`).join('')}</table>`,
  wybor: (w) => `<div class="v-wybor">${w.wiersze.map((r) => `
    <div class="dobrze">✔ ${esc(r.dobrze)}</div><div class="zle">✘ <s>${esc(r.zle)}</s></div><div class="czemu">${md(r.czemu)}</div>`).join('')}</div>`,
  mapa: (w) => `<div class="v-mapa"><div class="srodek">${esc(w.srodek)}</div><div class="galezie">${w.galezie.map((g) => `<div class="galaz">${esc(g)}</div>`).join('')}</div></div>`,
  sylaby: (w) => `<div class="v-sylaby">${w.sylaby.map((s) => `<span class="syl">${esc(s).replace(SAMOGLOSKI, '<b>$1</b>')}</span>`).join('<span class="kreska">-</span>')}</div>
    <p class="v-wynik">samogłoski: ${w.sylaby.map((s) => (s.match(SAMOGLOSKI) || []).map((l) => `<b class="sam">${l}</b>`).join(', ')).join(', ')}</p>`,
  notatka: (w) => `<div class="v-notatka"><div class="n-tyt">${esc(w.kartka)}</div>${w.bezNumerow
    ? w.punkty.map((p) => `<div class="n-p">${md(p)}</div>`).join('')
    : `<ol>${w.punkty.map((p) => `<li>${md(p)}</li>`).join('')}</ol>`}</div>`,
  zdanie: (w) => `${w.przed ? `<p class="v-przed">${md(w.przed)}</p>` : ''}<p class="v-zdanie">${md(w.tekst)}</p>${w.legenda ? `<div class="legenda">${w.legenda.map((l) => `<span><span class="t t-${l.klasa}">${esc(l.nazwa)}</span> <small>${esc(l.pytanie)}</small></span>`).join('')}</div>` : ''}`,
};

function slajd(id, n, w) {
  const widok = WIDOKI[w.typ];
  if (!widok) throw new Error(`Nieznany typ slajdu: ${w.typ}`);
  return `<div class="slajd" id="${id}" role="dialog" aria-label="${esc(w.tytul)}">
  <div class="s-gora"><span class="s-nr">Zadanie ${n}</span><h2>${esc(w.tytul)}</h2><button type="button" class="s-zamknij" aria-label="Zamknij slajd">✕</button></div>
  <div class="s-tresc">${widok(w)}</div>
  ${w.zapamietaj ? `<div class="s-zap"><b>Zapamiętaj!</b> ${md(w.zapamietaj)}</div>` : ''}
</div>`;
}

/** Zadania z numerem; wiersze bez numeru (np. zdania P/F) doklejamy do poprzedniego. */
function grupuj(zadania) {
  const out = [];
  for (const [n, prompt, , options] of zadania) {
    if (!n && out.length) out[out.length - 1].extra.push(prompt);
    else out.push({ n, prompt, options, extra: [] });
  }
  return out;
}

function zadanie({ n, prompt, options, extra }, odp, slajdId) {
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
  if (odp) {
    html += `<div class="akcje"><button type="button" class="pokaz">Odpowiedź</button>`
      + (slajdId ? `<button type="button" class="na-ekran" data-slajd="${slajdId}">Slajd ⛶</button>` : '')
      + `</div><div class="odp">${nl(odp)}</div>`;
  }
  return html + '</div>';
}

function tekst(akapity) {
  return akapity.map((a) => {
    const dialog = a.startsWith('–');
    const zdania = a.split(/(?<=[.!?])\s+(?=[A-ZĄĆĘŁŃÓŚŹŻ–])/);
    return `<p${dialog ? ' class="dialog"' : ''}>${zdania.map((z) => `<span class="zd">${esc(z)}</span>`).join(' ')}</p>`;
  }).join('');
}

// Przelicznik Bartka: 12 zadan, kazde dobrze = 1 punkt, punkty -> plusy do dziennika.
const PROGI = [
  { od: 0, do: 3, plusy: 0 },
  { od: 4, do: 8, plusy: 1 },
  { od: 9, do: 10, plusy: 2 },
  { od: 11, do: 12, plusy: 3 },
];

const PUNKTACJA = `<div class="slajd" id="punktacja" role="dialog" aria-label="Punktacja">
  <div class="s-gora"><span class="s-nr">12 zadań · każde dobrze = 1 punkt</span><h2>Punktacja</h2><button type="button" class="s-zamknij" aria-label="Zamknij">✕</button></div>
  <div class="s-tresc">
    <div class="pkt-wybor" role="group" aria-label="Ile zadań dobrze?">${Array.from({ length: 13 }, (_, i) => `<button type="button" data-pkt="${i}">${i}</button>`).join('')}</div>
    <div class="pkt-progi">${PROGI.map((p) => `<div class="prog" data-od="${p.od}" data-do="${p.do}"><div class="zakres">${p.od}-${p.do} pkt</div><div class="plusy">${p.plusy ? '+'.repeat(p.plusy) : '–'}</div><div class="opis">${p.plusy ? (p.plusy === 1 ? 'jeden plus' : `${p.plusy} plusy`) : 'bez plusa'}</div></div>`).join('')}</div>
  </div>
</div>`;

const STYL = `
:root { --fs: 22px; --ink: #1F2937; --blue: #1F4E78; --pale: #EAF3F8; --line: #D9DEE5; --ok: #15803D; --okbg: #E8F6EC; --mark: #FFE066; --sk: #B45309; --skbg: #FEF3E2; }
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
.akcje { display: flex; flex-wrap: wrap; gap: 8px; margin: 10px 0 0 calc(1.6em + 12px); }
.pokaz, .na-ekran { border: 1px solid var(--ok); color: var(--ok); background: #fff; border-radius: 8px; padding: 3px 12px; font-size: .7em; font-weight: 700; }
.na-ekran { border-color: var(--blue); color: var(--blue); }
.na-ekran:hover { background: var(--pale); }
.zad.otw .pokaz { background: var(--ok); color: #fff; }
.odp { display: none; margin: 8px 0 0 calc(1.6em + 12px); padding: 10px 14px; background: var(--okbg); border-left: 4px solid var(--ok); border-radius: 0 8px 8px 0; color: #14532D; }
.zad.otw .odp { display: block; }
@media (max-width: 900px) { #czytanie { grid-template-columns: 1fr; } .widok.on { height: auto; } .kol { overflow: visible; } }

/* Slajd na caly ekran */
.slajd { position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 50; background: #fff; display: none; flex-direction: column; padding: 3vh 4vw; font-size: clamp(20px, 2.5vw, 56px); line-height: 1.3; }
.slajd.on { display: flex; }
.s-gora { display: flex; align-items: baseline; gap: .8em; border-bottom: 2px solid var(--line); padding-bottom: .4em; }
.s-gora h2 { font-size: 1.5em; margin: 0; color: var(--blue); }
.s-nr { font-size: .65em; font-weight: 700; color: #6B7280; text-transform: uppercase; letter-spacing: .05em; }
.s-zamknij { margin-left: auto; border: 0; background: none; color: #6B7280; font-size: 1em; padding: 0 .3em; }
.s-zamknij:hover { color: var(--ink); }
.s-tresc { flex: 1; min-height: 0; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 4vh; padding: 3vh 0; }
.s-zap { background: #FFF7D6; border-left: .3em solid #F59E0B; padding: .5em .9em; border-radius: 0 .4em .4em 0; font-size: .85em; }
.s-zap b:first-child { color: #92400E; margin-right: .3em; }
.slajd mark { background: var(--mark); color: inherit; padding: 0 .1em; border-radius: .15em; }
.slajd s { color: #B91C1C; }
.v-wynik { font-size: 1em; text-align: center; }
.strz { display: flex; flex-direction: column; align-items: center; justify-content: center; font-weight: 700; color: #6B7280; font-size: .8em; min-width: 4em; }
.strz svg { width: 3.5em; height: 1em; }
.strz path { stroke: #94A3B8; stroke-width: 4; fill: none; }
.strz path.grot { fill: #94A3B8; stroke: none; }
.v-para { display: flex; flex-direction: column; gap: 3vh; width: 100%; }
.v-para-w { display: grid; grid-template-columns: 1fr auto 1fr; gap: 1em; align-items: stretch; }
.box { border-radius: .5em; padding: .6em .9em; border: 3px solid; display: flex; flex-direction: column; justify-content: center; }
.box .etyk { font-size: .6em; font-weight: 800; letter-spacing: .08em; margin-bottom: .2em; }
.b-pr { border-color: var(--blue); background: var(--pale); }
.b-pr .etyk { color: var(--blue); }
.b-sk { border-color: var(--sk); background: var(--skbg); }
.b-sk .etyk { color: var(--sk); }
.v-czasy { position: relative; display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.2em; width: 100%; }
.v-czasy .os { position: absolute; left: 4%; right: 4%; top: 2.05em; height: 4px; background: #CBD5E1; }
.czas { display: flex; flex-direction: column; align-items: center; position: relative; }
.kiedy { font-weight: 800; color: #6B7280; font-size: .8em; height: 1.6em; }
.kropka { width: .9em; height: .9em; border-radius: 50%; background: #94A3B8; margin: .2em 0 .7em; position: relative; z-index: 1; }
.karta { width: 100%; border: 2px solid var(--line); border-radius: .5em; padding: .6em .8em; text-align: center; position: relative; }
.karta .nazwa { font-weight: 800; color: var(--blue); }
.karta .opis { font-size: .75em; color: #4B5563; }
.karta .przyklad { margin-top: .4em; }
.tag { position: absolute; top: -.75em; left: 50%; transform: translateX(-50%); font-size: .55em; font-weight: 800; text-transform: uppercase; background: #64748B; color: #fff; padding: .15em .6em; border-radius: 99px; white-space: nowrap; }
.odp-c .karta { border-color: var(--ok); background: var(--okbg); border-width: 4px; }
.odp-c .kropka { background: var(--ok); }
.odp-c .tag { background: var(--ok); }
.zad-c .karta { border-style: dashed; }
.v-kolumny { display: flex; gap: 1em; width: 100%; justify-content: center; }
.kolumna { flex: 1; max-width: 30em; border-radius: .5em; border-top: .35em solid; background: #F8FAFC; padding: .6em .8em; display: flex; flex-direction: column; gap: .4em; }
.k-tyt { font-size: 1.3em; font-weight: 800; text-align: center; }
.k-tyt .znak { display: inline-block; min-width: 1em; color: #fff; border-radius: .2em; padding: 0 .2em; }
.k-opis { font-size: .7em; color: #4B5563; text-align: center; margin-bottom: .2em; }
.k-item { background: #fff; border: 1px solid var(--line); border-radius: .35em; padding: .35em .6em; }
.k-item small { display: block; font-size: .65em; color: #6B7280; }
.k-item.ok { border: 3px solid var(--ok); }
.k-niebieski { border-color: var(--blue); } .k-niebieski .k-tyt { color: var(--blue); } .k-niebieski .znak { background: var(--blue); }
.k-pomaranczowy { border-color: var(--sk); } .k-pomaranczowy .k-tyt { color: var(--sk); } .k-pomaranczowy .znak { background: var(--sk); }
.k-zielony { border-color: var(--ok); } .k-zielony .k-tyt { color: var(--ok); }
.k-czerwony { border-color: #B91C1C; } .k-czerwony .k-tyt { color: #B91C1C; }
.k-szary { border-color: #64748B; } .k-szary .k-tyt { color: #64748B; }
.v-kroki { display: flex; justify-content: center; align-items: stretch; width: 100%; }
.v-kroki.dlugie { font-size: .8em; }
.krok { display: flex; flex-direction: column; align-items: center; gap: .3em; border: 2px solid var(--line); border-radius: .5em; padding: .5em .7em; flex: 1 1 0; min-width: 0; max-width: 9em; text-align: center; background: #F8FAFC; }
.krok .nr { margin: 0; font-size: .7em; min-width: 1.8em; height: 1.8em; padding: 0 .5em; }
.krok.hl { border: 3px solid var(--ok); background: var(--okbg); }
.v-kroki .strz { min-width: 2em; flex: none; }
.v-kroki .strz svg { width: 2em; }
.pierwsza { color: #fff; background: var(--blue); border-radius: .15em; padding: 0 .1em; }
.alfabet { display: flex; justify-content: center; gap: .1em; font-size: .6em; }
.alfabet span { width: 1.3em; text-align: center; color: #94A3B8; border-bottom: 2px solid #E2E8F0; }
.alfabet span.on { color: #fff; background: var(--blue); border-radius: .2em; font-weight: 800; }
.v-tabela { border-collapse: collapse; font-size: .9em; }
.v-tabela th, .v-tabela td { border: 2px solid #CBD5E1; padding: .35em .8em; text-align: left; }
.v-tabela tr:first-child th { background: var(--pale); color: var(--blue); }
.v-wybor { display: grid; grid-template-columns: auto auto 1fr; gap: .5em 1.2em; align-items: center; }
.v-wybor .dobrze { font-weight: 800; color: var(--ok); font-size: 1.2em; }
.v-wybor .zle { color: #B91C1C; font-size: 1em; }
.v-wybor .czemu { font-size: .75em; color: #4B5563; }
.v-mapa { display: flex; flex-direction: column; align-items: center; gap: 1.2em; }
.srodek { font-size: 1.5em; font-weight: 800; color: #fff; background: var(--blue); border-radius: 99px; padding: .2em 1em; position: relative; }
.galezie { display: flex; flex-wrap: wrap; justify-content: center; gap: .6em; max-width: 34em; }
.galaz { border: 2px solid var(--blue); border-radius: 99px; padding: .25em .8em; background: var(--pale); }
.v-sylaby { font-size: 3em; font-weight: 800; letter-spacing: .02em; }
.v-sylaby .syl { background: #F1F5F9; border-radius: .2em; padding: 0 .2em; }
.v-sylaby b, .sam { color: #DC2626; }
.v-sylaby .kreska { color: #94A3B8; margin: 0 .1em; }
.v-notatka { font-size: 1.1em; min-width: 18em; max-width: 34em; background: #fff repeating-linear-gradient(#fff 0 1.55em, #BFDBFE 1.55em calc(1.55em + 2px)); border: 2px solid var(--line); border-left: .3em solid #F87171; border-radius: .3em; padding: .4em 1em 1em 1.4em; line-height: calc(1.55em + 2px); }
.n-tyt { font-weight: 800; text-align: center; color: var(--blue); }
.v-notatka ol { padding-left: 1.4em; }
.v-zdanie { font-size: 1.4em; line-height: 2.6; text-align: center; }
.v-przed { font-size: 1.1em; color: #6B7280; }
.t { position: relative; display: inline-block; line-height: 1.3; }
.t-lab { position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%); font-size: .45em; font-weight: 800; color: var(--sk); white-space: nowrap; }
.t-p { text-decoration: underline; text-decoration-thickness: .1em; text-underline-offset: .15em; text-decoration-color: var(--blue); }
.t-o { border: .08em solid var(--sk); border-radius: 50%; padding: 0 .25em; }
.t-f { text-decoration: underline wavy var(--ok); text-decoration-thickness: .07em; text-underline-offset: .15em; }
.t-h { background: var(--mark); border-radius: .15em; padding: 0 .15em; }
.t-k { color: #DC2626; font-weight: 800; transform: scale(1.3); margin: 0 .1em; }
.legenda { display: flex; flex-wrap: wrap; justify-content: center; gap: .5em 2em; font-size: .9em; }
.legenda small { color: #6B7280; font-size: .8em; }
.pkt-wybor { display: flex; flex-wrap: wrap; justify-content: center; gap: .3em; }
.pkt-wybor button { width: 2.2em; height: 2.2em; border: 2px solid #CBD5E1; border-radius: .4em; background: #fff; font-weight: 800; color: var(--ink); }
.pkt-wybor button[aria-pressed="true"] { background: var(--blue); border-color: var(--blue); color: #fff; }
.pkt-progi { display: grid; grid-template-columns: repeat(4, 1fr); gap: .8em; width: 100%; max-width: 40em; }
.prog { border: 2px solid var(--line); border-radius: .5em; padding: .5em; text-align: center; transition: transform .15s; }
.prog .zakres { font-size: .75em; font-weight: 700; color: #6B7280; }
.prog .plusy { font-size: 2.2em; font-weight: 800; color: var(--ok); line-height: 1.1; letter-spacing: .05em; }
.prog .opis { font-size: .7em; color: #4B5563; }
.prog.on { border: 4px solid var(--ok); background: var(--okbg); transform: scale(1.06); }
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

  // Slajdy: strzalki przechodza do sasiedniego slajdu, Esc zamyka.
  var otwarty = null;
  function otworz(id) {
    if (otwarty) otwarty.classList.remove('on');
    otwarty = document.getElementById(id);
    if (otwarty) otwarty.classList.add('on');
  }
  function zamknij() { if (otwarty) otwarty.classList.remove('on'); otwarty = null; }
  function sasiedni(krok) {
    var lista = Array.prototype.map.call(document.querySelectorAll('.na-ekran'), function (b) { return b.dataset.slajd; });
    var i = lista.indexOf(otwarty && otwarty.id);
    if (i < 0 || !lista[i + krok]) return;
    otworz(lista[i + krok]);
  }
  document.addEventListener('keydown', function (e) {
    if (!otwarty) return;
    if (e.key === 'Escape') zamknij();
    else if (otwarty.id !== 'punktacja' && (e.key === 'ArrowRight' || e.key === 'PageDown')) sasiedni(1);
    else if (otwarty.id !== 'punktacja' && (e.key === 'ArrowLeft' || e.key === 'PageUp')) sasiedni(-1);
  });

  function ustawPunkty(n) {
    document.querySelectorAll('[data-pkt]').forEach(function (b) { b.setAttribute('aria-pressed', String(+b.dataset.pkt === n)); });
    document.querySelectorAll('.prog').forEach(function (p) { p.classList.toggle('on', n >= +p.dataset.od && n <= +p.dataset.do); });
  }
  document.getElementById('punkty').onclick = function () { otworz('punktacja'); };
  // #slajd-4 w adresie otwiera slajd od razu (podglad zrzutow, zakladka w przegladarce).
  var start = location.hash && document.getElementById(location.hash.slice(1));
  if (start && start.classList.contains('slajd')) otworz(start.id);

  document.addEventListener('click', function (e) {
    var p = e.target.closest('.pokaz');
    if (p) p.closest('.zad').classList.toggle('otw');
    var s = e.target.closest('.na-ekran');
    if (s) otworz(s.dataset.slajd);
    if (e.target.closest('.s-zamknij')) zamknij();
    var pkt = e.target.closest('[data-pkt]');
    if (pkt) ustawPunkty(+pkt.dataset.pkt);
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
    ustawPunkty(-1);
  };
})();
`;

for (const ark of arkusze) {
  const odp = ark.answers;
  const wiz = WIZUALIZACJE[ark.number] || {};
  const slajdy = [];
  const zSlajdem = (z) => {
    const w = wiz[z.n];
    if (!w) return zadanie(z, odp[z.n]);
    const id = `slajd-${z.n}`;
    slajdy.push(slajd(id, z.n, w));
    return zadanie(z, odp[z.n], id);
  };
  const czytanie = grupuj(ark.reading).map(zSlajdem).join('');
  const jezyk = grupuj(ark.language).map(zSlajdem).join('')
    + zSlajdem({ n: '12', prompt: ark.writing, extra: [] });
  const html = `<!DOCTYPE html><html lang="pl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Arkusz ${ark.number} - ${esc(ark.title)}</title><style>${STYL}</style></head><body>
<header>
  <h1>Arkusz ${ark.number}  ${esc(ark.title)}${ark.level ? `<small>${esc(ark.level)}</small>` : ''}</h1>
  <button type="button" class="przyc" data-widok="czytanie" aria-pressed="true">Tekst i pytania</button>
  <button type="button" class="przyc" data-widok="jezyk" aria-pressed="false">Język i pisanie</button>
  <button type="button" class="przyc" id="wszystkie">Wszystkie odpowiedzi</button>
  <button type="button" class="przyc" id="punkty">Punktacja</button>
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
${slajdy.join('\n')}
${PUNKTACJA}
<script>${SKRYPT}</script>
</body></html>`;
  writeFileSync(join(OUT, `${ark.stem}.html`), html);
  console.log(`projektor/${ark.stem}.html (slajdy: ${slajdy.length})`);
}
