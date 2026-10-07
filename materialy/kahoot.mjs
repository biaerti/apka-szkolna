// Kahoot z pytań działu: node materialy/kahoot.mjs <folder> [plik] -> output/kahoot/<plik>.pdf
// Pytania w <folder>/kahoot.mjs albo <folder>/<plik>.mjs (export KAHOOT). PDF wrzucamy w Kahoot: Utwórz -> „PDF na kahoota”
// (wyodrębnij pytania). Skrypt pilnuje limitów Kahoota: pytanie 120 znaków, odpowiedź 75, 2-4 odpowiedzi.
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { drukujPdf, ROOT, STYL_BAZOWY } from './pdf.mjs';

const folder = process.argv[2];
if (!folder) { console.error('Użycie: node materialy/kahoot.mjs <folder>'); process.exit(1); }
const { KAHOOT } = await import(pathToFileURL(join(ROOT, 'materialy', folder, `${process.argv[3] || 'kahoot'}.mjs`)).href);
const PYTANIA = KAHOOT.pytania;

const DOZWOLONE_CZASY = [5, 10, 20, 30, 60, 90, 120, 240];
const bledy = [];
PYTANIA.forEach((p, i) => {
  const nr = i + 1;
  if (p.t.length > 120) bledy.push(`${nr}: pytanie ma ${p.t.length} znaków (max 120)`);
  p.o.forEach((o) => o.length > 75 && bledy.push(`${nr}: odpowiedź „${o}” ma ${o.length} znaków (max 75)`));
  if (p.o.length < 2 || p.o.length > 4) bledy.push(`${nr}: ${p.o.length} odpowiedzi`);
  if (!(p.ok >= 1 && p.ok <= p.o.length)) bledy.push(`${nr}: zły numer poprawnej odpowiedzi`);
  if (p.czas && !DOZWOLONE_CZASY.includes(p.czas)) bledy.push(`${nr}: czas ${p.czas} s`);
});
if (bledy.length) { console.error(bledy.join('\n')); process.exit(1); }

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const LIT = 'ABCD';
const html = `<!doctype html><html lang="pl"><head><meta charset="utf-8"><style>${STYL_BAZOWY}
@page { size: A4; margin: 16mm 18mm; }
h1 { font-size: 20pt; margin-bottom: 2mm; }
.pod { color: var(--szary); margin-bottom: 6mm; }
.p { break-inside: avoid; margin-bottom: 5mm; }
.p h3 { font-family: 'Nunito', sans-serif; font-size: 11.5pt; font-weight: 800; margin-bottom: 1mm; }
.p li { list-style: none; margin-left: 4mm; }
.ok { color: var(--ziel); font-weight: 700; margin-left: 4mm; margin-top: 1mm; }
</style></head><body>
<h1>${esc(KAHOOT.tytul)}</h1>
<p class="pod">Quiz: ${esc(KAHOOT.opis)}. ${PYTANIA.length} pytań, przy każdym poprawna odpowiedź i limit czasu.</p>
${PYTANIA.map((p, i) => `<div class="p">
<h3>Pytanie ${i + 1}. ${esc(p.t)}</h3>
<ul>${p.o.map((o, j) => `<li>${LIT[j]}. ${esc(o)}</li>`).join('')}</ul>
<p class="ok">Poprawna odpowiedź: ${LIT[p.ok - 1]}. ${esc(p.o[p.ok - 1])} · Czas: ${p.czas ?? 20} s</p>
</div>`).join('\n')}
</body></html>`;

const out = join(ROOT, 'output', 'kahoot');
mkdirSync(out, { recursive: true });
const htmlPath = join(out, `${KAHOOT.plik}.html`);
writeFileSync(htmlPath, html);
await drukujPdf(htmlPath, join(out, `${KAHOOT.plik}.pdf`), 9371);
console.log(`OK: ${PYTANIA.length} pytań -> output/kahoot/${KAHOOT.plik}.pdf`);
