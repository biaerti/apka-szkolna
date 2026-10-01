// Sprawdzian z grupami losowanymi z puli: sprawdzian-pula.mjs -> PDF grup + klucz.
// Uzycie: node materialy/sprawdzian.mjs klasa5-dzial2 [--grupy A,B,C,D]
// Wynik (poza repo): output/materialy/<plik>.pdf (wszystkie grupy, każda od nowej
// strony) i <plik>-klucz.pdf. Ziarno losowania = nazwa grupy, więc ponowne
// uruchomienie daje te same grupy (można dodrukować).
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { drukujPdf, znaczniki as z, STYL_BAZOWY, ROOT } from './pdf.mjs';

const folder = process.argv[2] || 'klasa5-dzial2';
const { SPRAWDZIAN } = await import(pathToFileURL(join(ROOT, 'materialy', folder, 'sprawdzian-pula.mjs')).href);
const argGrupy = process.argv.indexOf('--grupy');
const GRUPY = argGrupy > 0 ? process.argv[argGrupy + 1].split(',') : SPRAWDZIAN.grupy;

// Deterministyczny generator (mulberry32) z ziarnem z nazwy grupy.
function rng(ziarno) {
  let h = 2166136261;
  for (const c of ziarno) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h |= 0; h = (h + 0x6D2B79F5) | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function losuj(pula, ile, los) {
  const kopia = [...pula];
  for (let i = kopia.length - 1; i > 0; i--) {
    const j = Math.floor(los() * (i + 1));
    [kopia[i], kopia[j]] = [kopia[j], kopia[i]];
  }
  return kopia.slice(0, ile);
}

const suma = SPRAWDZIAN.zadania.reduce((s, zad) => s + zad.punkty, 0);

function wylosujGrupe(grupa) {
  const los = rng(`${SPRAWDZIAN.plik}-${grupa}`);
  return SPRAWDZIAN.zadania.map((zad) => ({
    ...zad,
    wybrane: zad.typ === 'jeden' ? losuj(zad.pula, 1, los) : losuj(zad.pula, zad.ile, los),
  }));
}

function zadanieHtml(zad, nr) {
  let srodek = '';
  if (zad.typ === 'wybor') {
    srodek = `<ol class="poz">${zad.wybrane.map((p) => `<li><span class="t">${z(p.t)}</span><span class="opcje">${zad.opcje.map(z).join(' / ')}</span></li>`).join('')}</ol>`;
  } else if (zad.typ === 'lista') {
    const linia = zad.linia === 'brak' ? '' : `<span class="linia ${zad.linia}">${zad.wzor ? z(zad.wzor) : ''}</span>`;
    srodek = `<ol class="poz${zad.linia === 'brak' ? ' bez' : ''}">${zad.wybrane.map((p) => `<li><span class="t">${z(p.t)}</span>${linia}</li>`).join('')}</ol>`;
  } else {
    const p = zad.wybrane[0];
    srodek = `<p class="jeden">${z(p.t)}</p>${'<div class="lin"></div>'.repeat(zad.linie)}`;
  }
  return `<div class="zad"><h3><span class="nr">${nr}.</span> ${z(zad.polecenie)} <span class="pkt">${zad.punkty} pkt</span></h3>${srodek}</div>`;
}

const STYL = `${STYL_BAZOWY}
@page { size: A4; margin: 11mm 13mm 12mm; }
body { font-size: 11pt; }
.arkusz { break-after: page; }
.arkusz:last-child { break-after: auto; }
.glowa { display: flex; align-items: center; gap: 5mm; border-bottom: 3px solid var(--ciemny); padding-bottom: 2.5mm; }
.glowa h1 { font-size: 17pt; flex: 1; }
.glowa .grupa { font-family: 'Baloo 2'; font-size: 22pt; font-weight: 800; color: #fff; background: var(--roz); border-radius: 3mm; padding: 0 5mm; }
.dane { display: flex; gap: 6mm; margin-top: 2.5mm; font-size: 10.5pt; color: var(--szary); }
.dane span { flex: 1; border-bottom: 1px dotted var(--szary); padding-bottom: 1mm; }
.zad { margin-top: 3.5mm; break-inside: avoid; }
.zad h3 { font-family: 'Nunito'; font-size: 11pt; font-weight: 800; }
.zad .nr { font-family: 'Baloo 2'; color: var(--roz); font-size: 13pt; }
.zad .pkt { float: right; font-weight: 700; color: var(--szary); border: 1px solid var(--ramka); border-radius: 2mm; padding: 0 2mm; font-size: 9.5pt; }
.poz { margin: 1.5mm 0 0 7mm; }
.poz li { margin: 1.8mm 0; }
.poz .t { display: inline-block; min-width: 55mm; }
.poz.bez .t { min-width: 0; }
.poz .opcje { margin-left: 6mm; color: var(--szary); letter-spacing: .3px; }
.linia { display: inline-block; border-bottom: 1px solid #999; margin-left: 3mm; color: var(--szary); font-size: 9.5pt; }
.linia.krotka { width: 60mm; }
.linia.dluga { width: 105mm; }
.jeden { margin: 1.5mm 0 0 2mm; font-style: italic; }
.lin { border-bottom: 1px solid #999; height: 8mm; margin-left: 2mm; }
.stopka { margin-top: 5mm; text-align: right; font-family: 'Baloo 2'; font-size: 14pt; font-weight: 800; }
.klucz h2 { font-size: 16pt; margin: 4mm 0 1mm; color: var(--roz); }
.klucz ol { margin-left: 6mm; font-size: 10.5pt; }
.klucz li { margin: .8mm 0; }
.klucz .odp { color: var(--ziel); font-weight: 800; }
`;

const wylosowane = GRUPY.map((g) => ({ grupa: g, zadania: wylosujGrupe(g) }));

const arkusze = wylosowane.map(({ grupa, zadania }) => `<section class="arkusz">
  <div class="glowa"><h1>${z(SPRAWDZIAN.tytul)}</h1><span class="grupa">Grupa ${grupa}</span></div>
  <div class="dane"><span>Imię i nazwisko:</span><span>Klasa:</span><span>Data:</span></div>
  ${zadania.map((zad, i) => zadanieHtml(zad, i + 1)).join('')}
  <div class="stopka">Wynik: ……… / ${suma} pkt</div>
</section>`).join('');

const klucz = wylosowane.map(({ grupa, zadania }) => `<section class="klucz arkusz">
  <h2>Klucz - grupa ${grupa}</h2>
  <ol>${zadania.map((zad) => `<li>${zad.wybrane.map((p) => `${z(p.t)} ➜ <span class="odp">${z(p.o)}</span>`).join(' · ')} <i>(${zad.punkty} pkt)</i></li>`).join('')}</ol>
</section>`).join('');

const outDir = join(ROOT, 'output', 'materialy');
mkdirSync(outDir, { recursive: true });
for (const [nazwa, tresc] of [[SPRAWDZIAN.plik, arkusze], [`${SPRAWDZIAN.plik}-klucz`, klucz]]) {
  const htmlPath = join(outDir, `${nazwa}.html`);
  writeFileSync(htmlPath, `<!DOCTYPE html><html lang="pl"><head><meta charset="utf-8"><title>${z(SPRAWDZIAN.tytul)}</title><style>${STYL}</style></head><body>${tresc}</body></html>`, 'utf-8');
  await drukujPdf(htmlPath, join(outDir, `${nazwa}.pdf`), 9361);
  console.log('Gotowe:', join(outDir, `${nazwa}.pdf`));
}
console.log(`Suma punktów: ${suma}, grupy: ${GRUPY.join(', ')}`);
