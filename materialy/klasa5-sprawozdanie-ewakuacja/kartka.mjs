// Kartka „Wielka ewakuacja” (kl. 5, sprawozdanie): jedna strona A4 na ucznia - polecenie i linie.
// Obrazek do zadania jest na ostatnim slajdzie public/prezentacje/sprawozdanie-przypomnienie.html.
// node materialy/klasa5-sprawozdanie-ewakuacja/kartka.mjs  ->  output/materialy/wielka-ewakuacja-kartka.pdf
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { drukujPdf, ROOT } from '../pdf.mjs';

const html = `<!doctype html><html lang="pl"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;800&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Nunito, sans-serif; color: #1d1d1f; font-size: 12pt; line-height: 1.45; }
  .strona { width: 210mm; height: 297mm; padding: 11mm 14mm 10mm; display: flex; flex-direction: column; gap: 4mm; overflow: hidden; }
  .gora { display: flex; flex-direction: column; gap: 3mm; }
  h1 { margin: 0; font-size: 22pt; line-height: 1.1; }
  h1 span { color: #b3261e; }
  .imie { font-size: 10pt; color: #444; }
  .polecenie { background: #fff5d6; border-radius: 2.5mm; padding: 3mm 4mm; }
  .linie { flex: 1; min-height: 0; overflow: hidden; } .linie > div { height: 9mm; border-bottom: 0.6pt solid #a8a8a8; }
  .pamietaj { font-size: 9.4pt; color: #555; text-align: center; }
</style></head><body>
  <div class="strona">
    <div class="gora">
      <h1>Sprawozdanie: <span>Wielka ewakuacja</span></h1>
      <div class="imie">Imię i nazwisko: ........................................................................ klasa: ..........</div>
    </div>
    <div class="polecenie">W naszej szkole zawył alarm i wszyscy musieli wyjść ze szkoły. <b>Napisz sprawozdanie z tej ewakuacji.</b>
      Powód, dla którego była ewakuacja, <b>wymyśl sam(a)</b>.</div>
    <div class="linie">${'<div></div>'.repeat(40)}</div>
    <div class="pamietaj">Trzy akapity: wstęp (kto? co? kiedy? gdzie?), rozwinięcie (po kolei), zakończenie (jak się skończyło + opinia) · czas przeszły · bez dialogów</div>
  </div>
</body></html>`;

mkdirSync(join(ROOT, 'tmp'), { recursive: true });
const htmlPath = join(ROOT, 'tmp', 'wielka-ewakuacja-kartka.html');
writeFileSync(htmlPath, html);
const pdfPath = join(ROOT, 'output', 'materialy', 'wielka-ewakuacja-kartka.pdf');
await drukujPdf(htmlPath, pdfPath, 9366);
console.log(pdfPath);
