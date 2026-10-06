// Kahoot - klasa 5, dział 1: dialog, opowiadanie, głoski, formy nieosobowe, tryby i „by”, rymy.
// node materialy/klasa5-dzial1/kahoot.mjs -> output/kahoot/klasa5-dzial1-kahoot.pdf
// PDF wrzucamy w Kahoot: Utwórz -> „PDF na kahoota”. Limity Kahoota: pytanie 120 znaków, odpowiedź 75.
// Przykłady własne (nie z filmików i nie z podręcznika). `ok` = numer poprawnej odpowiedzi (od 1).
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { drukujPdf, ROOT, STYL_BAZOWY } from '../pdf.mjs';

const PYTANIA = [
  // Dialog
  { t: 'Od czego zaczyna się każda wypowiedź bohatera w dialogu?', o: ['Od cudzysłowu', 'Od myślnika w nowej linijce', 'Od dwukropka', 'Od nawiasu'], ok: 2 },
  { t: 'Który zapis dialogu jest poprawny?', o: ['– Idę już. – powiedziała Ola.', '– Idę już – Powiedziała Ola.', '– Idę już – powiedziała Ola.', '– Idę już, powiedziała Ola.'], ok: 3, czas: 30 },
  { t: 'Który zapis dialogu jest poprawny?', o: ['– Gdzie byłeś? – zapytała mama.', '– Gdzie byłeś – zapytała mama?', '– Gdzie byłeś? – Zapytała mama.', '– Gdzie byłeś. – zapytała mama?'], ok: 1, czas: 30 },
  { t: 'Który zapis dialogu jest poprawny?', o: ['– Cześć – mruknął Tymek – idziesz na boisko?', '– Cześć – mruknął Tymek. Idziesz na boisko?', '– Cześć, mruknął Tymek. – Idziesz na boisko?', '– Cześć – mruknął Tymek. – Idziesz na boisko?'], ok: 4, czas: 30 },
  { t: 'Słowa narratora po wypowiedzi bohatera („– Pomóż mi – … Kuba”) zaczynamy…', o: ['wielką literą', 'małą literą', 'od kropki', 'od dwukropka'], ok: 2 },
  // Opowiadanie
  { t: 'Na jakie pytania odpowiada wstęp opowiadania?', o: ['Jak to się skończyło?', 'Co się nagle stało?', 'Kto? Gdzie? Kiedy?', 'Czego mnie to nauczyło?'], ok: 3 },
  { t: '„Nagle z szafy wyskoczył kot sąsiadów!” - do której części opowiadania pasuje to zdanie?', o: ['Wstęp', 'Rozwinięcie', 'Zakończenie', 'Tytuł'], ok: 2 },
  { t: '„Od tamtej pory nigdy nie gubię kluczy.” - do której części opowiadania pasuje to zdanie?', o: ['Wstęp', 'Rozwinięcie', 'Zakończenie', 'Dialog'], ok: 3 },
  { t: 'Która część opowiadania jest najdłuższa?', o: ['Wstęp', 'Rozwinięcie', 'Zakończenie', 'Wszystkie są równe'], ok: 2 },
  // Głoski
  { t: 'Ile liter i ile głosek ma wyraz „czapka”?', o: ['6 liter, 6 głosek', '5 liter, 5 głosek', '6 liter, 5 głosek', '5 liter, 6 głosek'], ok: 3 },
  { t: 'Ile głosek ma wyraz „chrząszcz”?', o: ['9', '7', '4', '5'], ok: 4 },
  { t: 'Które spółgłoski są miękkie?', o: ['sz, ż, cz, dż', 'ć, ś, ź, ń, dź', 's, z, c, dz', 'b, d, g, w'], ok: 2 },
  { t: 'Kiedy piszemy „ni”, a kiedy „ń”? „ni” piszemy…', o: ['przed samogłoską', 'na końcu wyrazu', 'przed spółgłoską', 'zawsze'], ok: 1 },
  { t: 'Który wyraz zapisano BŁĘDNIE?', o: ['koń', 'ćma', 'ciasto', 'śano'], ok: 4 },
  { t: 'Pierwsza głoska w wyrazie „szalik” jest…', o: ['sycząca', 'szumiąca', 'cisząca', 'samogłoską'], ok: 2 },
  { t: 'Kasa, kasza, Kasia. W którym wyrazie jest głoska cisząca?', o: ['kasa', 'kasza', 'Kasia', 'w żadnym'], ok: 3 },
  { t: 'Która para to głoska dźwięczna i jej bezdźwięczna para?', o: ['b - d', 's - sz', 'k - t', 'b - p'], ok: 4 },
  { t: 'Który wyraz zapisano poprawnie?', o: ['chlep', 'ogród', 'nósz', 'grzyp'], ok: 2 },
  // Formy nieosobowe czasownika
  { t: 'Która forma czasownika jest nieosobowa?', o: ['sprzątano', 'sprzątam', 'sprzątasz', 'sprzątali'], ok: 1 },
  { t: 'Który wyraz jest bezokolicznikiem?', o: ['czytam', 'czytaj', 'czytali', 'czytać'], ok: 4 },
  { t: '„Ktoś zamknął drzwi.” Jak to powiedzieć formą nieosobową?', o: ['Zamknąłem drzwi.', 'Zamknięto drzwi.', 'Zamknij drzwi.', 'Zamknęli drzwi.'], ok: 2 },
  { t: '„Mówi się, że w zamku straszy.” Czy wiemy, kto to mówi?', o: ['Tak, zamek', 'Tak, duchy', 'Nie, to forma nieosobowa', 'Tak, narrator'], ok: 3 },
  { t: 'Każdy czasownik ze słowem „się” jest formą nieosobową.', o: ['Prawda', 'Fałsz - w „Ola się śmieje” wiemy, kto się śmieje'], ok: 2 },
  // Tryby czasownika i pisownia „by”
  { t: '„Posprzątaj swój pokój!” - w jakim trybie jest czasownik?', o: ['oznajmującym', 'rozkazującym', 'przypuszczającym', 'nieosobowym'], ok: 2 },
  { t: '„Pojechałabym nad morze.” - w jakim trybie jest czasownik?', o: ['przypuszczającym', 'oznajmującym', 'rozkazującym', 'bezokolicznik'], ok: 1 },
  { t: '„Wczoraj gotowaliśmy zupę.” - w jakim trybie jest czasownik?', o: ['rozkazującym', 'przypuszczającym', 'oznajmującym', 'nieosobowym'], ok: 3 },
  { t: '„Niech Ola przeczyta ten wiersz.” - w jakim trybie jest czasownik?', o: ['oznajmującym', 'przypuszczającym', 'to bezokolicznik', 'rozkazującym'], ok: 4 },
  { t: 'Po czym najłatwiej rozpoznać tryb przypuszczający?', o: ['Po wykrzykniku', 'Po cząstce -by-', 'Po końcówce -no, -to', 'Po słowie „niech”'], ok: 2 },
  { t: 'Który zapis jest poprawny?', o: ['zagrał bym', 'zagrałbym', 'zagrał-bym', 'zagrałby m'], ok: 2 },
  { t: 'Który zapis jest poprawny?', o: ['trzebaby', 'gdy by', 'trzeba by', 'zrobił byś'], ok: 3 },
  // Rymy
  { t: 'Rymy w schemacie AABB to rymy…', o: ['krzyżowe', 'okalające', 'parzyste', 'wewnętrzne'], ok: 3 },
  { t: 'Rymy w schemacie ABAB to rymy…', o: ['krzyżowe', 'parzyste', 'okalające', 'niedokładne'], ok: 1 },
  { t: 'Rymy w schemacie ABBA to rymy…', o: ['parzyste', 'krzyżowe', 'męskie', 'okalające'], ok: 4 },
  { t: '„Skacze - płacze” to rym gramatyczny. Dlaczego?', o: ['Bo brzmi identycznie', 'Bo oba wyrazy to czasowniki', 'Bo jest na końcu wersu', 'Bo ma akcent na końcu'], ok: 2 },
  { t: '„Rzeka - czeka” to rym…', o: ['gramatyczny', 'niegramatyczny', 'wewnętrzny', 'okalający'], ok: 2 },
  { t: 'Który rym jest niedokładny?', o: ['dom - tom', 'koc - noc', 'kot - kos', 'mama - brama'], ok: 3 },
  { t: '„Kot - płot” to rym męski, bo…', o: ['akcent pada na ostatnią sylabę', 'akcent pada na przedostatnią sylabę', 'oba to rzeczowniki', 'jest w środku wersu'], ok: 1 },
  { t: 'Rym wewnętrzny to rym…', o: ['tylko na końcu wersów', 'w jednym wyrazie', 'w tym samym miejscu w różnych wersach', 'z wyrazem obcym'], ok: 3 },
];

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
<h1>Kahoot - klasa 5, dział 1</h1>
<p class="pod">Quiz: dialog, opowiadanie, głoski, formy nieosobowe i tryby czasownika, pisownia „by”, rymy. ${PYTANIA.length} pytań, przy każdym poprawna odpowiedź i limit czasu.</p>
${PYTANIA.map((p, i) => `<div class="p">
<h3>Pytanie ${i + 1}. ${esc(p.t)}</h3>
<ul>${p.o.map((o, j) => `<li>${LIT[j]}. ${esc(o)}</li>`).join('')}</ul>
<p class="ok">Poprawna odpowiedź: ${LIT[p.ok - 1]}. ${esc(p.o[p.ok - 1])} · Czas: ${p.czas ?? 20} s</p>
</div>`).join('\n')}
</body></html>`;

const out = join(ROOT, 'output', 'kahoot');
mkdirSync(out, { recursive: true });
const htmlPath = join(out, 'klasa5-dzial1-kahoot.html');
writeFileSync(htmlPath, html);
await drukujPdf(htmlPath, join(out, 'klasa5-dzial1-kahoot.pdf'), 9371);
console.log(`OK: ${PYTANIA.length} pytań -> output/kahoot/klasa5-dzial1-kahoot.pdf`);
