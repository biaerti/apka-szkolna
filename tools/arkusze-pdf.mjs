// Arkusze wyrownawcze -> PDF A4 (2 strony) przez headless Chrome.
// Dane z output/documents/arkusze-wyrownawcze/arkusze.json (zapisuje je build_worksheets.py),
// uklad jak w DOCX. Word na tym komputerze jest bez licencji i nie eksportuje PDF-ow.
// Uzycie: node tools/arkusze-pdf.mjs <folder z arkusze.json>
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { drukujPdf } from '../materialy/pdf.mjs';

const dir = process.argv[2];
const arkusze = JSON.parse(readFileSync(join(dir, 'arkusze.json'), 'utf8'));
const pdfDir = join(dir, 'pdf');
mkdirSync(pdfDir, { recursive: true });

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const nl = (s) => esc(s).replace(/\n/g, '<br>');
const linie = (n) => '<div class="linia"></div>'.repeat(n);

function zadanie([n, prompt, lines, options]) {
  let html = `<p class="zad">${n ? `<b class="nr">${n}.</b> ` : ''}${nl(prompt)}</p>`;
  if (Array.isArray(options)) html += options.map((o) => `<p class="opcja">□ ${esc(o)}</p>`).join('');
  if (options && options.table) {
    const [naglowek, wiersze] = options.table;
    html += `<table class="siatka"><tr>${naglowek.map((h) => `<th class="${h ? 'kol' : ''}">${esc(h)}</th>`).join('')}</tr>`
      + wiersze.map((w) => `<tr>${w.map((c, i) => (i === 0 ? `<th>${esc(c)}</th>` : `<td>${esc(c)}</td>`)).join('')}</tr>`).join('')
      + '</table>';
  }
  return html + linie(lines || 0);
}

function strona(ark) {
  const poziom = ark.level ? `${ark.level}  |  ` : '';
  const stopka = `Arkusz ${ark.number}${ark.level ? `  |  ${ark.level.toLowerCase()}` : ''}  |  język polski  |  klasa IV`;
  const jak = ark.level
    ? 'odpowiedzi nie zawsze są zapisane wprost. Szukaj wskazówek, łącz informacje z różnych akapitów i sprawdzaj, czy tekst naprawdę o czymś mówi.'
    : 'najpierw przeczytaj cały tekst, potem wracaj do niego przy każdym pytaniu. Podkreślaj słowa, które pomagają znaleźć odpowiedź.';
  return `
<section class="strona">
  <h1>Arkusz ${ark.number}  ${esc(ark.title)}</h1>
  <p class="focus">${esc(poziom + ark.focus)}</p>
  <table class="dane"><tr><td style="width:10cm">Imię i nazwisko</td><td style="width:4cm">Data</td><td>Grupa</td></tr></table>
  <p class="jak"><b>Jak pracować:</b> ${jak}</p>
  <h2>Przeczytaj tekst</h2>
  ${ark.text.map((t) => `<p class="tekst">${esc(t)}</p>`).join('')}
  <h2>Sprawdź, co rozumiesz</h2>
  ${ark.reading.map(zadanie).join('')}
  <p class="stopka">${esc(stopka)}</p>
</section>
<section class="strona">
  <p class="naglowek2">Arkusz ${ark.number}  ${esc(ark.title)}  |  strona 2</p>
  <h2>Poćwicz język</h2>
  ${ark.language.map(zadanie).join('')}
  <h2>Napisz krótko</h2>
  <p class="zad"><b class="nr">12.</b> ${esc(ark.writing)}</p>
  ${linie(ark.writing_lines)}
  <h3>Popraw jedno zadanie</h3>
  <p class="zad">Po wspólnym sprawdzeniu wybierz jedno zadanie, w którym był błąd. Zapisz poprawną odpowiedź i krótkie wyjaśnienie.</p>
  ${linie(3)}
  <h3>Na koniec</h3>
  <p class="zad"><b>Zaznacz:</b> □ pracowałem samodzielnie   □ potrzebowałem podpowiedzi   □ chcę przećwiczyć to jeszcze raz</p>
  <p class="zad"><b>Jedno zadanie, które teraz rozumiem lepiej:</b></p>
  ${linie(2)}
  <p class="stopka">${esc(stopka)}</p>
</section>`;
}

const STYL = `
@page { size: A4; margin: 0; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Segoe UI', Calibri, sans-serif; color: #1F2937; font-size: 10.5pt; line-height: 1.25; }
.strona { width: 210mm; min-height: 297mm; padding: 13.5mm 15.5mm 14mm; position: relative; page-break-after: always; }
.strona:last-child { page-break-after: auto; }
h1 { font-size: 19pt; color: #000; margin-bottom: 3pt; white-space: pre-wrap; }
h2 { font-size: 13pt; color: #000; margin: 8pt 0 4pt; }
h3 { font-size: 11.5pt; color: #000; margin: 7pt 0 3pt; }
.focus { color: #374151; margin-bottom: 7pt; white-space: pre-wrap; }
.dane { width: 100%; border-collapse: collapse; margin-bottom: 8pt; }
.dane td { background: #F3F4F6; border: 1px solid #D9D9D9; font-size: 8.5pt; font-weight: 700; color: #4B5563; padding: 3pt 5pt 16pt; vertical-align: top; }
.jak { font-size: 9.5pt; margin-bottom: 4pt; white-space: normal; }
.jak b { color: #1F4E78; }
.tekst { text-indent: 5.5mm; margin-bottom: 4pt; line-height: 1.3; white-space: normal; text-align: justify; }
.zad { margin: 3pt 0 2pt; font-size: 10.3pt; white-space: pre-wrap; }
.nr { color: #1F4E78; }
.opcja { margin-left: 5.5mm; font-size: 10.1pt; margin-bottom: 1pt; white-space: pre-wrap; }
.linia { height: 7.2mm; border-bottom: 1.2px dotted #9CA3AF; }
.siatka { border-collapse: collapse; margin: 3pt auto 4pt; }
.siatka th, .siatka td { border: 1px solid #D9D9D9; padding: 4pt 6pt; height: 9.5mm; font-size: 9.8pt; text-align: left; }
.siatka th:first-child { width: 36mm; }
.siatka td { width: 69mm; }
.siatka th.kol { background: #EAF3F8; }
.naglowek2 { font-size: 9pt; font-weight: 700; color: #4B5563; margin-bottom: 4pt; }
.stopka { position: absolute; bottom: 6mm; left: 0; right: 0; text-align: center; font-size: 8pt; color: #6B7280; }
`;

for (const ark of arkusze) {
  const html = `<!doctype html><html lang="pl"><head><meta charset="utf-8"><style>${STYL}</style></head><body>${strona(ark)}</body></html>`;
  const htmlPath = join(pdfDir, `${ark.stem}.html`);
  writeFileSync(htmlPath, html);
  await drukujPdf(htmlPath, join(pdfDir, `${ark.stem}.pdf`), 9402);
  console.log(`${ark.stem}.pdf`);
}
