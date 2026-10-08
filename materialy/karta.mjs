// Karta pracy na 2 strony A4: karta.mjs w folderze działu -> dwa PDF-y.
// Uzycie: node materialy/karta.mjs klasa4-rozdzial1
// Wynik w output/materialy/: <plik>.pdf (puste luki, do druku dla uczniów)
// i <plik>-rozwiazania.pdf (ta sama karta z wpisanymi odpowiedziami, do wyświetlenia).
// Oba idą do prywatnego bucketu: python materialy/wyslij.py <folder>.
// Sprawdzian w tej samej szacie: node materialy/karta.mjs klasa4-rozdzial1 sprawdzian-karta.mjs
// (KARTA.wersje = grupy A, B..., tematy bez ramki wiedzy, punkty przy zadaniach;
// plik z treścią jest w .gitignore, bo repo jest publiczne).
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { drukujPdf, znaczniki as z, STYL_BAZOWY, ROOT } from './pdf.mjs';

const folder = process.argv[2] || 'klasa4-rozdzial1';
const plikDanych = process.argv[3] || 'karta.mjs';
const { KARTA } = await import(pathToFileURL(join(ROOT, 'materialy', folder, plikDanych)).href);

const KOLORY = ['#8A4FD0', '#1FA58A', '#E0679A', '#D98A1F', '#2A8C9E', '#B5562B', '#D6336C', '#2F7D5B', '#1B6E8F', '#C2410C'];

/** Luki [[...]], wybór {{a|*b}}, podkreślenia ((...)), kółka <<...>> + zwykłe znaczniki. */
function linia(tekst, rozw, wLinii = false) {
  const czesci = [];
  const re = /\[\[(.+?)(?:\|(\d+))?\]\]|\{\{(.+?)\}\}|\(\((.+?)\)\)|<<(.+?)>>/g;
  let ostatni = 0;
  for (const m of tekst.matchAll(re)) {
    czesci.push(z(tekst.slice(ostatni, m.index)));
    if (m[1] !== undefined) {
      const szer = m[2] ? `${m[2]}mm` : '20mm';
      const dluga = !wLinii && m[2] && Number(m[2]) >= 60;
      czesci.push(`<span class="luka${dluga ? ' dluga' : ''}" style="min-width:${szer}">${rozw ? `<span class="pis">${z(m[1])}</span>` : ''}</span>`);
    } else if (m[3] !== undefined) {
      czesci.push(`<span class="wybor">${m[3].split('|').map((o) => {
        const dobra = o.startsWith('*');
        return `<span class="opc${rozw && dobra ? ' zakr' : ''}">${z(dobra ? o.slice(1) : o)}</span>`;
      }).join('')}</span>`);
    } else if (m[4] !== undefined) {
      czesci.push(`<span class="${rozw ? 'podkr' : ''}">${z(m[4])}</span>`);
    } else {
      czesci.push(`<span class="${rozw ? 'kolko' : ''}">${z(m[5])}</span>`);
    }
    ostatni = m.index + m[0].length;
  }
  czesci.push(z(tekst.slice(ostatni)));
  return czesci.join('');
}

function tabela(t, rozw) {
  const glowa = t.naglowki ? `<thead><tr>${t.naglowki.map((h) => `<th>${z(h)}</th>`).join('')}</tr></thead>` : '';
  return `<table class="tab">${glowa}
  <tbody>${t.wiersze.map((w) => `<tr>${w.map((c) => `<td>${linia(c, rozw)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}

function strona(rozw) {
  if (KARTA.wersje) return dokument(KARTA.wersje.map((w) => arkusz(w.tematy, rozw, w.grupa)).join(''));
  return dokument(arkusz(KARTA.tematy, rozw));
}

function arkusz(tematyDanych, rozw, grupa) {
  const suma = tematyDanych.reduce((s, t) => s + t.zadania.reduce((s2, zad) => s2 + (zad.punkty ?? 0), 0), 0);
  const tematy = tematyDanych.map((t, i) => {
    let nr = 0;
    const zadania = t.zadania.map((zad) => {
      nr += 1;
      // wLinii: długa luka zostaje w tej samej linii co zdanie (oszczędza miejsce na sprawdzianie).
      const linie = (zad.linie ?? []).map((l) => `<div class="l">${linia(l, rozw, zad.wLinii)}</div>`).join('');
      // Pisanie: puste linie, a w rozwiązaniach przykładowa odpowiedź i kryteria.
      const pisanie = zad.pisanie
        ? (rozw
          ? `<div class="wzor">${linia(zad.wzor ?? '', rozw)}</div>`
          : '<div class="lin"></div>'.repeat(zad.pisanie))
        : '';
      const pkt = zad.punkty ? `<span class="pkt">${zad.punkty} pkt</span>` : '';
      return `<div class="zad">
        <div class="pol">${pkt}<span class="nr">${i + 1}.${nr}</span> ${z(zad.polecenie)}</div>
        ${linie ? `<div class="linie${zad.kolumny ? ` k${zad.kolumny}` : ''}">${linie}</div>` : ''}
        ${zad.tabela ? tabela(zad.tabela, rozw) : ''}
        ${pisanie}
        ${rozw && zad.kryteria ? `<div class="kryt">${z(zad.kryteria)}</div>` : ''}
      </div>`;
    }).join('');
    const kolor = `--k:${KOLORY[i % KOLORY.length]}`;
    if (!t.wiedza) {
      return `<section class="temat bez-wiedzy" style="${kolor}">
      <h2><span>${i + 1}</span>${z(t.tytul)}</h2>
      <div class="zadania">${zadania}</div>
    </section>`;
    }
    return `<section class="temat" style="${kolor}">
      <div class="wiedza"><h2><span>${i + 1}</span>${z(t.tytul)}</h2>${t.wiedza.map((w) => `<p>${z(w)}</p>`).join('')}</div>
      <div class="zadania">${zadania}</div>
    </section>`;
  }).join('');

  // Sprawdzian (grupa): imię, klasa i data w osobnym wierszu, bo w nagłówku jest jeszcze litera grupy.
  const prawa = rozw
    ? '<div class="rozw">Rozwiązania</div>'
    : grupa ? '' : `<div class="imie">Imię i nazwisko: ..........................................</div>`;
  return `<section class="arkusz${grupa ? ' sprawdzian' : ''}">
<div class="gora"><h1>${z(KARTA.tytul)}</h1><div class="pod">${z(KARTA.klasa)} · ${z(KARTA.podtytul)}</div>
${prawa}${grupa ? `<div class="grupa">Grupa ${grupa}</div>` : ''}</div>
${grupa && !rozw ? `<div class="dane"><span>Imię i nazwisko:</span><span>Data:</span><span class="wynik">Wynik: ……… / ${suma} pkt</span></div>` : ''}
${tematy}
</section>`;
}

function dokument(tresc) {
  return `<!DOCTYPE html><html lang="pl"><head><meta charset="utf-8"><title>${z(KARTA.tytul)}</title><style>
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap&subset=latin-ext');
${STYL_BAZOWY}
@page { size: A4; margin: 9mm 10mm 9mm; }
body { font-size: 10pt; line-height: 1.3; }
.gora { display: flex; align-items: flex-end; gap: 5mm; border-bottom: 2.5px solid var(--ciemny); padding-bottom: 1.5mm; }
.gora h1 { font-size: 19pt; }
.gora .pod { font-family: 'Baloo 2'; font-size: 12pt; color: var(--szary); }
.gora h1, .gora .pod { white-space: nowrap; }
.gora .imie { margin-left: auto; font-size: 10pt; color: var(--szary); white-space: nowrap; overflow: hidden; min-width: 0; }
.gora .rozw { margin-left: auto; font-family: 'Caveat'; font-size: 20pt; color: var(--czerw); }
.temat { display: grid; grid-template-columns: 58mm 1fr; gap: 4mm; padding: 2.6mm 0; border-bottom: 1px dashed var(--ramka); break-inside: avoid; }
.wiedza { background: color-mix(in srgb, var(--k) 9%, white); border-left: 3px solid var(--k); border-radius: 0 3mm 3mm 0; padding: 2mm 3mm; font-size: 9.2pt; line-height: 1.3; }
.wiedza h2 { font-size: 12.5pt; color: var(--k); margin-bottom: 1mm; display: flex; align-items: center; gap: 1.8mm; }
.wiedza h2 span { background: var(--k); color: #fff; border-radius: 99px; min-width: 5.5mm; height: 5.5mm; font-size: 10pt; display: inline-flex; align-items: center; justify-content: center; }
.wiedza p + p { margin-top: 1mm; }
.zad + .zad { margin-top: 1.8mm; }
.pol { font-weight: 800; }
.pol .nr { display: inline-block; background: var(--k); color: #fff; border-radius: 99px; padding: 0 1.8mm; font-size: 8.5pt; margin-right: .5mm; }
.linie { margin: .6mm 0 0 2mm; line-height: 2; }
.linie.k2 { display: grid; grid-template-columns: 1fr 1fr; column-gap: 4mm; }
.linie.k3 { display: grid; grid-template-columns: 1fr 1fr 1fr; column-gap: 3mm; }
.linie.k4 { display: grid; grid-template-columns: repeat(4, 1fr); column-gap: 3mm; }
.luka { display: inline-block; border-bottom: 1.3px dotted #8d7b6b; height: 5.2mm; vertical-align: -1.2mm; text-align: center; margin: 0 .8mm; position: relative; }
.luka.dluga { min-width: 0 !important; display: block; margin: .3mm 0 0 0; }
.l:has(.luka.dluga) { margin-bottom: .6mm; }
.pis { font-family: 'Caveat'; font-weight: 700; font-size: 14.5pt; color: var(--czerw); line-height: 1; white-space: nowrap; padding: 0 1mm; }
.luka.dluga .pis { white-space: normal; }
.wybor { display: inline-flex; flex-wrap: wrap; gap: 1.2mm 1.5mm; margin-left: .5mm; }
.opc { white-space: nowrap; padding: 0 1.6mm; border: 1.5px solid transparent; border-radius: 99px; background: #f6efe4; line-height: 1.5; }
.opc.zakr { border-color: var(--czerw); background: #fff; }
.podkr { text-decoration: underline 2px var(--czerw); text-underline-offset: 2px; }
.tab { margin: 1mm 0 0 2mm; border-collapse: collapse; }
.tab th { background: var(--k); color: #fff; font-family: 'Baloo 2'; font-size: 9.5pt; padding: .4mm 2.5mm; text-align: left; }
.tab td { border: 1px solid var(--ramka); padding: .3mm 1.5mm; height: 7mm; }
.tab:not(:has(thead)) td { min-width: 28mm; }
.tab:not(:has(thead)) tr:first-child td { background: color-mix(in srgb, var(--k) 12%, white); }
.tab td .luka { border-bottom: none; }
.stopka { margin-top: 2mm; text-align: center; font-size: 8.5pt; color: var(--szary); }
.arkusz + .arkusz { break-before: page; }
.gora .grupa { margin-left: auto; font-family: 'Baloo 2'; font-weight: 800; font-size: 15pt; color: #fff; background: var(--roz); border-radius: 2mm; padding: 0 3mm; line-height: 1.35; align-self: center; white-space: nowrap; }
.gora .rozw + .grupa { margin-left: 0; }
.dane { display: grid; grid-template-columns: 3fr 1.2fr 1.3fr; gap: 6mm; margin-top: 2mm; font-size: 9.5pt; color: var(--szary); }
.dane span { border-bottom: 1px dotted var(--szary); padding-bottom: .5mm; }
.temat.bez-wiedzy { display: block; break-inside: auto; padding: 1.8mm 0; }
.sprawdzian .linie { line-height: 1.8; }
.temat.bez-wiedzy .zad { break-inside: avoid; }
.temat.bez-wiedzy > h2 { break-after: avoid; font-size: 12.5pt; color: var(--k); display: flex; align-items: center; gap: 1.8mm; margin-bottom: .6mm; }
.temat.bez-wiedzy > h2 span { background: var(--k); color: #fff; border-radius: 99px; min-width: 5.5mm; height: 5.5mm; font-size: 10pt; display: inline-flex; align-items: center; justify-content: center; }
.pol .pkt { float: right; font-weight: 700; font-size: 8.5pt; color: var(--szary); border: 1px solid var(--ramka); border-radius: 2mm; padding: 0 1.5mm; margin-left: 2mm; }
.lin { border-bottom: 1px solid #b9a894; height: 8mm; margin-left: 2mm; }
.sprawdzian .tab td { height: 6.5mm; }
.wzor { margin: 1mm 0 0 2mm; font-family: 'Caveat'; font-weight: 700; font-size: 15pt; color: var(--czerw); line-height: 1.35; }
.kryt { margin: 1mm 0 0 2mm; font-size: 9pt; color: var(--szary); }
.kolko { border: 1.8px solid var(--czerw); border-radius: 50%; padding: 0 1.2mm; }
.dane .wynik { border-bottom: 0; text-align: right; font-family: 'Baloo 2'; font-size: 12pt; font-weight: 800; color: var(--ciemny); }
:root { --czerw: #D62828; }
</style></head><body>
${tresc}
</body></html>`;
}

const outDir = join(ROOT, 'output', 'materialy');
mkdirSync(outDir, { recursive: true });
for (const rozw of [false, true]) {
  const nazwa = rozw ? (KARTA.plikRozwiazania ?? `${KARTA.plik}-rozwiazania`) : KARTA.plik;
  const htmlPath = join(outDir, `${nazwa}.html`);
  writeFileSync(htmlPath, strona(rozw), 'utf-8');
  await drukujPdf(htmlPath, join(outDir, `${nazwa}.pdf`));
  console.log('Gotowe:', join(outDir, `${nazwa}.pdf`));
}
