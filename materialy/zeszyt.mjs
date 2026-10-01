// Zeszyt powtórzeniowy przed sprawdzianem: tresc.mjs -> HTML -> PDF A4.
// Uzycie: node materialy/zeszyt.mjs klasa5-dzial2
// Wynik: output/materialy/<plik>.pdf + kopia w public/materialy/ (link dla uczniów:
// https://szkola.klippi.pl/materialy/<plik>.pdf).
import { writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { drukujPdf, znaczniki as z, STYL_BAZOWY, ROOT } from './pdf.mjs';

const folder = process.argv[2] || 'klasa5-dzial2';
const { ZESZYT } = await import(pathToFileURL(join(ROOT, 'materialy', folder, 'tresc.mjs')).href);

const KOLORY = ['#8A4FD0', '#1FA58A', '#E0679A', '#D98A1F', '#2A8C9E', '#B5562B', '#D6336C', '#2F7D5B', '#1B6E8F', '#C2410C', '#D9480F', '#C2448B'];

function zadanie(zad, nr, kolor) {
  // Krótkie pozycje w dwóch kolumnach, zdania jedna pod drugą.
  const krotkie = Math.max(...zad.tresc.map((t) => t.length)) < 42;
  const lista = zad.tresc.length > 1
    ? `<ol class="tresc${krotkie ? ' kol' : ''}">${zad.tresc.map((t) => `<li>${z(t)}</li>`).join('')}</ol>`
    : `<p class="tresc1">${z(zad.tresc[0] ?? '')}</p>`;
  const dopisek = zad.dopisek ? `<p class="tresc1">${z(zad.dopisek)}</p>` : '';
  const odp = zad.odpowiedz.length > 1
    ? `<ol>${zad.odpowiedz.map((t) => `<li>${z(t)}</li>`).join('')}</ol>`
    : `<p>${z(zad.odpowiedz[0])}</p>`;
  return `<div class="zadanie">
    <h3><span class="nr" style="background:${kolor}">Zadanie ${nr}</span> ${z(zad.polecenie)}</h3>
    ${lista}${dopisek}
    <div class="odp"><div class="odp-tyt">✅ Rozwiązanie</div>${odp}${zad.dlaczego ? `<p class="dlaczego">💡 ${z(zad.dlaczego)}</p>` : ''}</div>
  </div>`;
}

function tabela(t) {
  return `<table class="tab"><thead><tr>${t.naglowki.map((h) => `<th>${z(h)}</th>`).join('')}</tr></thead>
  <tbody>${t.wiersze.map((w) => `<tr>${w.map((c, i) => `<td${i === 0 ? ' class="p"' : ''}>${z(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}

const tematy = ZESZYT.tematy.map((t, i) => {
  const kolor = KOLORY[i % KOLORY.length];
  return `<section class="temat${t.zadania.length ? '' : ' krotki'}" style="--k:${kolor}">
    <header><span class="lekcja">lekcja ${t.lekcja}</span><h2>${i + 1}. ${z(t.tytul)}</h2></header>
    <div class="przyp"><div class="przyp-tyt">🧠 Przypomnij sobie</div><ul>${t.przypomnij.map((p) => `<li>${z(p)}</li>`).join('')}</ul></div>
    ${t.tabela ? tabela(t.tabela) : ''}
    ${t.zadania.length ? `<div class="zad-tyt">✏️ Zadania z filmiku - zasłoń rozwiązanie i spróbuj sam!</div>` : ''}
    ${t.zadania.map((zad, j) => zadanie(zad, j + 1, kolor)).join('')}
  </section>`;
}).join('');

const html = `<!DOCTYPE html><html lang="pl"><head><meta charset="utf-8"><title>${z(ZESZYT.tytul)}</title><style>
${STYL_BAZOWY}
@page { size: A4; margin: 13mm 14mm 14mm; @bottom-center { content: counter(page); } }
.okladka { height: 265mm; display: flex; flex-direction: column; justify-content: center; text-align: center; break-after: page; }
.okladka .klasa { font-family: 'Baloo 2'; font-size: 20pt; color: var(--szary); }
.okladka h1 { font-size: 46pt; color: var(--roz); margin-top: 4mm; }
.okladka .dzial { font-family: 'Baloo 2'; font-size: 24pt; color: var(--pom); margin-top: 2mm; }
.okladka .wstep { margin: 10mm auto 0; max-width: 150mm; font-size: 12.5pt; background: var(--krem); border-radius: 6mm; padding: 6mm 8mm; text-align: left; }
.okladka .spis { margin: 8mm auto 0; max-width: 150mm; text-align: left; columns: 2; column-gap: 8mm; font-weight: 800; font-size: 12pt; }
.okladka .spis div { padding: 1mm 0; break-inside: avoid; }
.okladka .imie { margin: 14mm auto 0; font-size: 13pt; color: var(--szary); }
.temat { break-before: page; }
.temat:first-of-type { break-before: auto; }
.temat.krotki { break-before: auto; margin-top: 8mm; }
.temat header { background: var(--k); color: #fff; border-radius: 5mm; padding: 3mm 6mm; display: flex; align-items: baseline; gap: 4mm; }
.temat header h2 { font-size: 21pt; }
.temat .lekcja { font-family: 'Baloo 2'; font-size: 11pt; opacity: .85; text-transform: uppercase; }
.przyp { margin-top: 4mm; border: 2px solid var(--k); border-radius: 4mm; padding: 3mm 5mm; background: #fff; break-inside: avoid; }
.przyp-tyt, .zad-tyt, .odp-tyt { font-family: 'Baloo 2'; font-weight: 800; font-size: 13pt; color: var(--k); }
.przyp ul { margin: 1.5mm 0 0 5mm; }
.przyp li { margin: 1.2mm 0; }
.zad-tyt { margin-top: 5mm; color: var(--ciemny); }
.zadanie { margin-top: 3.5mm; break-inside: avoid; }
.zadanie h3 { font-size: 13pt; font-weight: 800; }
.zadanie .nr { display: inline-block; color: #fff; border-radius: 99px; padding: 0 3mm; font-size: 11pt; margin-right: 1.5mm; }
.tresc { margin: 1.5mm 0 0 7mm; }
.tresc.kol { columns: 2; column-gap: 8mm; }
.tresc li { padding: .4mm 0; break-inside: avoid; }
.tresc1 { margin: 1.5mm 0 0 2mm; }
.odp { margin-top: 2mm; border-left: 4px solid var(--ziel); background: #eef8f1; border-radius: 2mm; padding: 2mm 4mm; }
.odp .odp-tyt { color: var(--ziel); font-size: 11.5pt; }
.odp ol { margin-left: 5mm; }
.odp .dlaczego { margin-top: 1mm; color: var(--szary); font-weight: 700; }
.tab { margin-top: 4mm; border-collapse: collapse; width: 100%; font-size: 11pt; break-inside: avoid; }
.tab th { background: var(--k); color: #fff; font-family: 'Baloo 2'; padding: 1.2mm 2mm; text-align: left; }
.tab td { border: 1px solid var(--ramka); padding: 1mm 2mm; }
.tab td.p { font-weight: 800; }
</style></head><body>
<section class="okladka">
  <div class="klasa">${z(ZESZYT.klasa)}</div>
  <h1>${z(ZESZYT.tytul)}</h1>
  <div class="dzial">${z(ZESZYT.dzial)}</div>
  <div class="wstep">${z(ZESZYT.wstep)}</div>
  <div class="spis">${ZESZYT.tematy.map((t, i) => `<div>${i + 1}. ${z(t.tytul)}</div>`).join('')}</div>
  <div class="imie">Imię i nazwisko: ...............................................</div>
</section>
${tematy}
</body></html>`;

const outDir = join(ROOT, 'output', 'materialy');
mkdirSync(outDir, { recursive: true });
const htmlPath = join(outDir, `${ZESZYT.plik}.html`);
const pdfPath = join(outDir, `${ZESZYT.plik}.pdf`);
writeFileSync(htmlPath, html, 'utf-8');
await drukujPdf(htmlPath, pdfPath);
mkdirSync(join(ROOT, 'public', 'materialy'), { recursive: true });
copyFileSync(pdfPath, join(ROOT, 'public', 'materialy', `${ZESZYT.plik}.pdf`));
console.log('Gotowe:', pdfPath);
