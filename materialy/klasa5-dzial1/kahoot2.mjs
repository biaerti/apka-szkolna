// Kahoot 2 - klasa 5, dział 1: te same tematy co kahoot.mjs, nowe przykłady (druga runda gry) + kilka pytań z mapy działu.
// node materialy/kahoot.mjs klasa5-dzial1 kahoot2 -> output/kahoot/klasa5-dzial1-kahoot2.pdf
// `ok` = numer poprawnej odpowiedzi (od 1), `czas` domyślnie 20 s, `img` = hasło do zdjęcia z Unsplash w Kahoocie.

export const KAHOOT = {
  plik: 'klasa5-dzial1-kahoot2',
  tytul: 'Kahoot 2 - klasa 5, dział 1',
  opis: 'dialog, opowiadanie, głoski, formy nieosobowe i tryby czasownika, pisownia „by”, rymy, wiersz i teksty, które uczą',
  pytania: [
    // Dialog
    { t: 'Zdanie, które wprowadza dialog („Wtedy Ola zapytała…”), kończymy…', o: ['kropką', 'dwukropkiem', 'myślnikiem', 'przecinkiem'], ok: 2, img: 'conversation' },
    { t: 'Który zapis dialogu jest poprawny?', o: ['– Zaraz wracam. – zawołał tata.', '– Zaraz wracam – Zawołał tata.', '– Zaraz wracam – zawołał tata.', '– Zaraz wracam, zawołał tata.'], ok: 3, czas: 30, img: 'father' },
    { t: 'Który zapis dialogu jest poprawny?', o: ['– Uważaj – krzyknęła Zosia!', '– Uważaj! – krzyknęła Zosia.', '– Uważaj! – Krzyknęła Zosia.', '– Uważaj. – krzyknęła Zosia!'], ok: 2, czas: 30, img: 'warning sign' },
    { t: 'Który zapis dialogu jest poprawny?', o: ['– Masz gumkę – spytał Antek?', '– Masz gumkę? – Spytał Antek.', '– Masz gumkę. – spytał Antek?', '– Masz gumkę? – spytał Antek.'], ok: 4, czas: 30, img: 'eraser' },
    { t: '„– Spóźnię się – westchnęła Ola” Gdzie postawić kropkę?', o: ['po „Spóźnię się”', 'po słowach narratora, na samym końcu', 'w obu miejscach', 'nigdzie'], ok: 2, img: 'clock' },
    // Opowiadanie
    { t: '„W mroźną sobotę poszłam z bratem na lodowisko.” Do której części opowiadania pasuje to zdanie?', o: ['Rozwinięcie', 'Wstęp', 'Zakończenie', 'Dialog'], ok: 2, img: 'ice skating' },
    { t: 'Które słowo najczęściej zapowiada zwrot akcji?', o: ['nagle', 'zawsze', 'pewnego dnia', 'od tamtej pory'], ok: 1, img: 'surprise' },
    { t: 'Co piszemy w zakończeniu opowiadania?', o: ['Kto? Gdzie? Kiedy?', 'Wszystkie wydarzenia po kolei', 'Jak się skończyło i czego to nauczyło', 'Spis bohaterów'], ok: 3, img: 'sunset' },
    { t: 'W jakim czasie piszemy opowiadanie?', o: ['Raz w przeszłym, raz w teraźniejszym', 'W jednym czasie, zwykle przeszłym', 'Tylko w przyszłym', 'W trybie rozkazującym'], ok: 2, img: 'notebook writing' },
    // Głoski
    { t: 'Ile liter i ile głosek ma wyraz „szkoła”?', o: ['6 liter, 6 głosek', '6 liter, 5 głosek', '5 liter, 5 głosek', '5 liter, 6 głosek'], ok: 2, img: 'school' },
    { t: 'Ile głosek ma wyraz „dziewczynka”?', o: ['11', '9', '8', '10'], ok: 3, czas: 30, img: 'girl' },
    { t: 'Który wyraz zapisano BŁĘDNIE?', o: ['jesień', 'sianko', 'ńiebo', 'dźwig'], ok: 3, img: 'sky' },
    { t: 'Kiedy miękką głoskę piszemy z kreską (ś, ć, ń)?', o: ['Przed samogłoską', 'Przed spółgłoską i na końcu wyrazu', 'Tylko na początku wyrazu', 'Zawsze po „i”'], ok: 2, img: 'pencil' },
    { t: 'Która głoska jest szumiąca?', o: ['s', 'ś', 'ż', 'z'], ok: 3, img: 'wind' },
    { t: 'Jaka głoska jest bezdźwięczną parą głoski „w”?', o: ['f', 'b', 'p', 'm'], ok: 1, img: 'sound' },
    { t: 'Który wyraz zapisano poprawnie?', o: ['ksiąszka', 'żabka', 'gołomp', 'śnieck'], ok: 2, img: 'frog' },
    // Formy nieosobowe czasownika
    { t: 'Która forma czasownika jest nieosobowa?', o: ['malowaliśmy', 'maluje', 'malowano', 'malujesz'], ok: 3, img: 'painting' },
    { t: 'Który wyraz jest bezokolicznikiem?', o: ['pływać', 'pływam', 'pływaj', 'pływali'], ok: 1, img: 'swimming' },
    { t: '„Ktoś umył okna.” Jak to powiedzieć formą nieosobową?', o: ['Umyto okna.', 'Umyłem okna.', 'Umyj okna.', 'Okna są czyste.'], ok: 1, img: 'window' },
    { t: 'W którym zdaniu NIE wiemy, kto wykonuje czynność?', o: ['Bartek zjadł obiad.', 'W szkole zbiera się makulaturę.', 'Ola się śmieje.', 'Psy szczekały.'], ok: 2, img: 'recycling paper' },
    { t: 'Formy na -no, -to (np. „zbudowano”) mówią o czynności w czasie…', o: ['przyszłym', 'przeszłym', 'teraźniejszym', 'to tryb rozkazujący'], ok: 2, img: 'building' },
    // Tryby czasownika i pisownia „by”
    { t: '„Zamknij okno, proszę.” - w jakim trybie jest czasownik?', o: ['oznajmującym', 'przypuszczającym', 'rozkazującym', 'nieosobowym'], ok: 3, img: 'open window' },
    { t: '„Chętnie zjadłbym pizzę.” - w jakim trybie jest czasownik?', o: ['rozkazującym', 'przypuszczającym', 'oznajmującym', 'to bezokolicznik'], ok: 2, img: 'pizza' },
    { t: '„Jutro pojedziemy na wycieczkę.” - w jakim trybie jest czasownik?', o: ['oznajmującym', 'rozkazującym', 'przypuszczającym', 'nieosobowym'], ok: 1, img: 'school trip bus' },
    { t: 'Która forma jest w trybie rozkazującym?', o: ['czytałbyś', 'czytasz', 'czytaj', 'czytano'], ok: 3, img: 'reading' },
    { t: 'Który zapis jest poprawny?', o: ['pomogła bym', 'pomogłabym', 'pomogła-bym', 'pomogłab ym'], ok: 2, img: 'helping hand' },
    { t: 'Który zapis jest poprawny?', o: ['gdy byś', 'można by', 'możnaby', 'chciał byś'], ok: 2, img: 'question' },
    { t: 'Który zapis jest poprawny?', o: ['Gdybyś przyszedł, zagralibyśmy.', 'Gdy byś przyszedł, zagrali byśmy.', 'Gdybyś przyszedł, zagrali byśmy.', 'Gdy byś przyszedł, zagralibyśmy.'], ok: 1, czas: 30, img: 'board game' },
    // Rymy
    { t: 'Wers 1 rymuje się z 3, a wers 2 z 4 (ABAB). Jakie to rymy?', o: ['parzyste', 'krzyżowe', 'okalające', 'wewnętrzne'], ok: 2, img: 'poetry book' },
    { t: 'Wers 1 rymuje się z 4, a wers 2 z 3 (ABBA). Jakie to rymy?', o: ['krzyżowe', 'parzyste', 'okalające', 'męskie'], ok: 3, img: 'poem' },
    { t: 'Który rym jest gramatyczny?', o: ['rzeka - czeka', 'czyta - pyta', 'mała - skała', 'tam - sam'], ok: 2, img: 'books' },
    { t: 'Który rym jest niedokładny?', o: ['noga - woda', 'sok - rok', 'rak - mak', 'lato - tato'], ok: 1, img: 'water' },
    { t: '„Rzeka - czeka” to rym żeński, bo…', o: ['akcent pada na ostatnią sylabę', 'akcent pada na przedostatnią sylabę', 'oba wyrazy mają po 5 liter', 'tak mówi dziewczynka'], ok: 2, img: 'river' },
    // Wiersz i teksty, które uczą
    { t: 'Kto mówi w wierszu?', o: ['narrator', 'podmiot liryczny', 'autor książki', 'bohater dialogu'], ok: 2, img: 'microphone' },
    { t: 'W którym zdaniu jest porównanie?', o: ['Kot śpi na kanapie.', 'Kot jest miękki jak poduszka.', 'Kot ma szare futro.', 'Mój kot to Mruczek.'], ok: 2, img: 'cat' },
    { t: 'Co powinno być w tekście informacyjnym?', o: ['opinie autora', 'fakty, które da się sprawdzić', 'dialog bohaterów', 'rymy'], ok: 2, img: 'encyclopedia' },
    { t: 'Informacja z Wikipedii. Co warto z nią zrobić?', o: ['Od razu przepisać', 'Sprawdzić w drugim źródle', 'Nic, Wikipedia zawsze ma rację', 'Wyrzucić'], ok: 2, img: 'laptop' },
    { t: 'Gdzie w e-mailu wpisujemy, o czym jest wiadomość?', o: ['w podpisie', 'w temacie', 'w pożegnaniu', 'nigdzie'], ok: 2, img: 'email' },
  ],
};
