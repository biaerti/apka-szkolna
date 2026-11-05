// Kartka „Sprawa złotego gwizdka” (kl. 5): str. 1 - akta sprawy z zeznaniami dwóch świadków,
// str. 2 - linie na sprawozdanie detektywa. Druk dwustronny, jedna kartka na ucznia.
// node materialy/klasa5-sprawozdanie-detektyw/kartka.mjs  ->  output/materialy/sprawa-zlotego-gwizdka-kartka.pdf
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { drukujPdf, ROOT } from '../pdf.mjs';

const ZOSIA = `No więc tak. To było w środę, chyba. Nie, na pewno w środę, 4 listopada, bo wtedy ciocia Karolina ma imieniny i mama kazała mi kupić kwiaty, ale zapomniałam. Ale to nieważne. To było na dużej przerwie, tej o 10.35, bo zawsze wtedy jem kanapkę z serem, chociaż wolę z dżemem. Szłam korytarzem na pierwszym piętrze koło pokoju pana Gwizdalskiego, tego od WF-u. Drzwi były uchylone, a pan Gwizdalski stał na korytarzu i rozmawiał z panią dyrektor o turnieju piłki nożnej, który miał być o dwunastej. Zajrzałam do środka. Na parapecie leżał jego złoty gwizdek, ten, co tak błyszczy, a okno było otwarte na oścież. W listopadzie! I wtedy za oknem mignęło mi coś czarno-białego. Od razu pomyślałam: Kuba z 6b! On zawsze chodzi w bluzie w czarno-białe paski. A we wtorek na WF-ie mówił: „Oby ten gwizdek zniknął na zawsze!”. Słyszałam na własne uszy. Aha, i w poniedziałek zgubiłam srebrną spinkę z motylkiem. Położyłam ją na ławce pod kasztanowcem, jak skakałyśmy w gumę, i już jej nie było. Ale to pewnie nie ma związku. Potem zadzwonił dzwonek i poszłam na matmę. Mieliśmy kartkówkę z ułamków, dostałam czwórkę. O jedenastej usłyszałam, jak pan Gwizdalski krzyczy na cały korytarz: „Gdzie jest mój gwizdek?!”. To na pewno Kuba. Na sto procent.`;

const HENRYK = `Panie detektywie, ja w tej szkole pracuję trzydzieści lat i niejedno widziałem. W środę od początku dużej przerwy naprawiałem lodówkę w sklepiku. Ta lodówka psuje się co tydzień, mówię pani dyrektor, żeby kupiła nową, ale kto by mnie słuchał. Kuba z 6b stał obok mnie i wybierał drożdżówkę. Piętnaście minut wybierał! Z serem czy z budyniem, z serem czy z budyniem... W końcu kupił obie. Sklepik jest na parterze, a pokój pana od WF-u na pierwszym piętrze. Okno tego pokoju wychodzi na boisko i na stary kasztanowiec. Pan Gwizdalski otwiera je po każdej lekcji, bo pachnie tam skarpetkami. Około 10.50 wyszedłem przed szkołę po narzędzia i usłyszałem z kasztanowca skrzeczenie, a potem gwizdanie. Takie krzywe, jakby ktoś pierwszy raz w życiu trzymał gwizdek. Myślałem, że dzieciaki się wygłupiają. O jedenastej pan Gwizdalski zawołał mnie do swojego pokoju. Na parapecie leżało piórko: czarno-białe, z niebieskim połyskiem. I powiem panu jeszcze jedno: od miesiąca ze stołówki giną łyżeczki. Kucharki myślą, że to ja. Ja! Po trzydziestu latach pracy!`;

const protokol = (nr, kto, opis, tekst) => `
  <div class="protokol">
    <div class="ph"><b>PROTOKÓŁ PRZESŁUCHANIA nr ${nr}</b><span>Świadek: <b>${kto}</b>, ${opis}</span></div>
    <p>${tekst}</p>
  </div>`;

const html = `<!doctype html><html lang="pl"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;800&family=Special+Elite&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Nunito, sans-serif; color: #1d1d1f; font-size: 10.8pt; line-height: 1.42; }
  .strona { width: 210mm; height: 297mm; padding: 10mm 13mm 11mm; display: flex; flex-direction: column; gap: 3mm; page-break-after: always; overflow: hidden; }
  .strona:last-child { page-break-after: auto; }
  .gora { display: flex; justify-content: space-between; align-items: center; }
  .akta { font-family: 'Special Elite', monospace; font-size: 22pt; letter-spacing: .02em; }
  .akta small { display: block; font-size: 11pt; color: #555; }
  .pieczatka { font-family: 'Special Elite', monospace; color: #b3261e; border: 2.5px solid #b3261e; border-radius: 2mm; padding: 1.5mm 3mm; transform: rotate(-6deg); font-size: 12pt; text-align: center; line-height: 1.2; }
  .detektyw { font-size: 10pt; color: #444; }
  .polecenie { background: #fff5d6; border-radius: 2.5mm; padding: 2.2mm 3.5mm; font-size: 10.4pt; }
  .protokol { border: 1.3px solid #6b5a3a; border-radius: 2mm; padding: 2.4mm 4mm 1mm; background: #fffdf7; }
  .ph { display: flex; justify-content: space-between; gap: 4mm; font-size: 9.6pt; color: #6b5a3a; border-bottom: 1px dashed #b9a77f; padding-bottom: 1.2mm; margin-bottom: 1.4mm; }
  .ph b:first-child { font-family: 'Special Elite', monospace; font-weight: 400; font-size: 10.5pt; }
  .protokol p { margin: 0 0 1.4mm; text-align: justify; font-size: 12.2pt; line-height: 1.6; }
  .stopka { margin-top: auto; font-size: 9pt; color: #777; text-align: center; }
  h1 { margin: 0; font-family: 'Special Elite', monospace; font-weight: 400; font-size: 20pt; }
  .temat { font-size: 11.5pt; }
  .linie { flex: 1; min-height: 0; overflow: hidden; } .linie > div { height: 8.6mm; border-bottom: 0.6pt solid #a8a8a8; }
  .pamietaj { font-size: 9.4pt; color: #555; text-align: center; }
</style></head><body>
  <div class="strona">
    <div class="gora">
      <div class="akta">AKTA SPRAWY nr 97/11<small>Zaginięcie złotego gwizdka</small></div>
      <div class="pieczatka">ŚCIŚLE<br>TAJNE</div>
    </div>
    <div class="detektyw">Detektyw: .................................................................... klasa: ...........</div>
    <div class="polecenie"><b>Detektywie!</b> Przeczytaj zeznania dwóch świadków. Świadkowie mówią chaotycznie i nie wszystko jest ważne.
      <b>Podkreśl</b> fakty (kto? co? kiedy? gdzie?), <b>skreśl</b> to, co nie ma związku ze sprawą, i <b>ustal</b>, kto ukradł gwizdek.</div>
    ${protokol(1, 'Zosia Trajkotek', 'uczennica kl. 5c', ZOSIA)}
    ${protokol(2, 'pan Henryk Miotła', 'woźny szkolny', HENRYK)}
    <div class="stopka">Rozwiązanie zagadki zapisz w sprawozdaniu na drugiej stronie.</div>
  </div>
  <div class="strona">
    <h1>SPRAWOZDANIE DETEKTYWA</h1>
    <div class="temat">Sprawozdanie ze śledztwa w sprawie zaginięcia złotego gwizdka</div>
    <div class="linie">${'<div></div>'.repeat(40)}</div>
    <div class="pamietaj">Trzy akapity: wstęp, rozwinięcie, zakończenie · czas przeszły · wydarzenia po kolei · bez dialogów · opinia na końcu</div>
  </div>
</body></html>`;

mkdirSync(join(ROOT, 'tmp'), { recursive: true });
const htmlPath = join(ROOT, 'tmp', 'sprawa-zlotego-gwizdka-kartka.html');
writeFileSync(htmlPath, html);
const pdfPath = join(ROOT, 'output', 'materialy', 'sprawa-zlotego-gwizdka-kartka.pdf');
await drukujPdf(htmlPath, pdfPath, 9366);
console.log(pdfPath);
