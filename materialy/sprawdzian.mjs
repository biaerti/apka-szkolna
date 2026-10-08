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
    wybrane: zad.stale
      ? zad.pula.slice(0, zad.ile ?? 1)
      : zad.typ === 'jeden' ? losuj(zad.pula, 1, los) : losuj(zad.pula, zad.ile, los),
  }));
}

function zadanieHtml(zad, nr) {
  let srodek = '';
  if (zad.typ === 'wybor') {
    srodek = `<ol class="poz${zad.kolumny ? ` kolumny-${zad.kolumny}` : ''}">${zad.wybrane.map((p) => `<li><span class="t">${z(p.t)}</span><span class="opcje">${zad.opcje.map(z).join(' / ')}</span></li>`).join('')}</ol>`;
  } else if (zad.typ === 'lista') {
    const linia = zad.linia === 'brak' ? '' : `<span class="linia ${zad.linia}">${zad.wzor ? z(zad.wzor) : ''}</span>`;
    srodek = `<ol class="poz${zad.linia === 'brak' ? ' bez' : ''}${zad.kolumny ? ` kolumny-${zad.kolumny}` : ''}">${zad.wybrane.map((p) => `<li><span class="t">${z(p.t)}</span>${linia}</li>`).join('')}</ol>`;
  } else {
    const p = zad.wybrane[0];
    const pola = zad.pola?.length
      ? `<div class="pola">${zad.pola.map((pole) => `<div><span>${z(pole)}</span></div>`).join('')}</div>`
      : '';
    srodek = `<p class="jeden${zad.prosty ? ' prosty' : ''}">${z(p.t)}</p>${pola}${'<div class="lin"></div>'.repeat(zad.linie ?? 0)}`;
  }
  return `<div class="zad"><h3><span class="nr">${nr}.</span><span class="polecenie">${z(zad.polecenie)}</span><span class="pkt">${zad.punkty} pkt</span></h3>${srodek}</div>`;
}

const KOLORY = ['#8A4FD0', '#1FA58A', '#E0679A', '#D98A1F', '#2A8C9E', '#B5562B', '#D6336C', '#2F7D5B'];

function arkuszeKartowe(grupa, zadania) {
  const tematy = [];
  for (const zad of zadania) {
    let temat = tematy.find((t) => t.tytul === zad.temat);
    if (!temat) {
      temat = { tytul: zad.temat, strona: zad.strona ?? 1, zadania: [] };
      tematy.push(temat);
    }
    temat.zadania.push(zad);
  }

  const liczbaStron = Math.max(...tematy.map((t) => t.strona), 1);
  return Array.from({ length: liczbaStron }, (_, indeksStrony) => {
    const strona = indeksStrony + 1;
    const sekcje = tematy
      .map((temat, indeksTematu) => ({ temat, indeksTematu }))
      .filter(({ temat }) => temat.strona === strona)
      .map(({ temat, indeksTematu }) => `<section class="temat" style="--k:${KOLORY[indeksTematu % KOLORY.length]}">
        <h2><span>${indeksTematu + 1}</span>${z(temat.tytul)}</h2>
        ${temat.zadania.map((zad, indeksZadania) => zadanieHtml(zad, `${indeksTematu + 1}.${indeksZadania + 1}`)).join('')}
      </section>`)
      .join('');
    const ostatnia = strona === liczbaStron;
    return `<section class="arkusz karta-arkusz">
      <div class="glowa${strona > 1 ? ' druga' : ''}"><h1>${z(SPRAWDZIAN.tytul)}</h1><span class="grupa">Grupa ${grupa}</span></div>
      ${strona === 1 ? '<div class="dane"><span>Imię i nazwisko:</span><span>Klasa:</span><span>Data:</span></div>' : ''}
      ${sekcje}
      <div class="stopka"><span>Strona ${strona} z ${liczbaStron}</span>${ostatnia ? `<strong>Wynik: ……… / ${suma} pkt</strong>` : ''}</div>
    </section>`;
  }).join('');
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
.poz.kolumny-2 { display: grid; grid-template-columns: 1fr 1fr; column-gap: 9mm; }
.poz.kolumny-2 .t { min-width: 0; }
.linia { display: inline-block; border-bottom: 1px solid #999; margin-left: 3mm; color: var(--szary); font-size: 9.5pt; }
.linia.krotka { width: 60mm; }
.linia.dluga { width: 105mm; }
.jeden { margin: 1.5mm 0 0 2mm; font-style: italic; }
.jeden.prosty { font-style: normal; }
.lin { border-bottom: 1px solid #999; height: 8mm; margin-left: 2mm; }
.pola { display: grid; grid-template-columns: repeat(4, 1fr); margin: 2mm 0 0 2mm; }
.pola div { min-height: 14mm; border: 1px solid var(--ramka); border-right: 0; }
.pola div:last-child { border-right: 1px solid var(--ramka); }
.pola span { display: block; background: #f6efe4; padding: .7mm 1.5mm; color: var(--szary); font-size: 8.5pt; font-weight: 800; }
.stopka { margin-top: 5mm; text-align: right; font-family: 'Baloo 2'; font-size: 14pt; font-weight: 800; }
.karta-arkusz { min-height: 273mm; display: flex; flex-direction: column; }
.karta-arkusz .glowa { padding-bottom: 1.8mm; }
.karta-arkusz .glowa.druga h1 { font-size: 14.5pt; }
.karta-arkusz .glowa.druga .grupa { font-size: 16pt; }
.karta-arkusz .temat { padding: 3.2mm 0 2.5mm; border-bottom: 1px dashed var(--ramka); break-inside: avoid; }
.karta-arkusz .temat h2 { display: flex; align-items: center; gap: 2mm; color: var(--k); font-size: 13.5pt; }
.karta-arkusz .temat h2 > span { display: inline-flex; min-width: 6mm; height: 6mm; align-items: center; justify-content: center; border-radius: 99px; background: var(--k); color: #fff; font-size: 9.5pt; }
.karta-arkusz .zad { margin-top: 2.3mm; }
.karta-arkusz .zad h3 { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: start; gap: .8mm; line-height: 1.3; }
.karta-arkusz .zad .nr { color: var(--k); }
.karta-arkusz .pkt { float: none; border: 0; padding-right: 0; white-space: nowrap; }
.karta-arkusz .poz { margin-top: 1mm; }
.karta-arkusz .poz li { margin: 1.35mm 0; }
.karta-arkusz .lin { height: 8.3mm; }
.karta-arkusz .stopka { display: flex; justify-content: space-between; align-items: flex-end; margin-top: auto; padding-top: 3mm; font-size: 9pt; color: var(--szary); }
.karta-arkusz .stopka strong { color: var(--ciemny); font-size: 13pt; }
.klucz h2 { font-size: 16pt; margin: 4mm 0 1mm; color: var(--roz); }
.klucz ol { margin-left: 6mm; font-size: 10.5pt; }
.klucz li { margin: .8mm 0; }
.klucz .odp { color: var(--ziel); font-weight: 800; }
`;

const wylosowane = GRUPY.map((g) => ({ grupa: g, zadania: wylosujGrupe(g) }));

const arkusze = SPRAWDZIAN.uklad === 'karta'
  ? wylosowane.map(({ grupa, zadania }) => arkuszeKartowe(grupa, zadania)).join('')
  : wylosowane.map(({ grupa, zadania }) => `<section class="arkusz">
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
