// Kahoot - klasa 5, dział 1: dialog, opowiadanie, głoski, formy nieosobowe, tryby i „by”, rymy.
// node materialy/kahoot.mjs klasa5-dzial1 -> output/kahoot/klasa5-dzial1-kahoot.pdf
// Przykłady własne (nie z filmików i nie z podręcznika). `ok` = numer poprawnej odpowiedzi (od 1), `czas` domyślnie 20 s.

export const KAHOOT = {
  plik: 'klasa5-dzial1-kahoot',
  tytul: 'Kahoot - klasa 5, dział 1',
  opis: 'dialog, opowiadanie, głoski, formy nieosobowe i tryby czasownika, pisownia „by”, rymy',
  pytania: [
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
  ],
};
