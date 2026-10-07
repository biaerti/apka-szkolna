// Kahoot 2 - klasa 4, rozdział I: te same tematy co kahoot.mjs, nowe przykłady (druga runda gry).
// node materialy/kahoot.mjs klasa4-rozdzial1 kahoot2 -> output/kahoot/klasa4-rozdzial1-kahoot2.pdf
// `ok` = numer poprawnej odpowiedzi (od 1), `img` = hasło do zdjęcia z Unsplash w Kahoocie.

export const KAHOOT = {
  plik: 'klasa4-rozdzial1-kahoot2',
  tytul: 'Kahoot 2 - klasa 4, rozdział I',
  opis: 'świat przedstawiony, kto mówi w tekście, notatka, głoski i sylaby, epitet, czasownik, zdanie i równoważnik, plan ramowy',
  pytania: [
    // Świat przedstawiony
    { t: '„Rano Tomek znalazł w parku małego jeża.” Kto jest głównym bohaterem?', o: ['rano', 'w parku', 'Tomek', 'znalezienie'], ok: 3, img: 'hedgehog' },
    { t: '„Zimą dzieci lepiły bałwana przed szkołą.” Co jest miejscem wydarzeń?', o: ['zima', 'dzieci', 'przed szkołą', 'bałwan'], ok: 3, img: 'snowman' },
    { t: 'Który element NIE należy do świata przedstawionego?', o: ['bohaterowie', 'miejsce akcji', 'czas akcji', 'cena książki'], ok: 4, img: 'books' },
    // Kto mówi w tekście?
    { t: '„Wbiegłam na boisko i strzeliłam gola.” Kto tu mówi?', o: ['narrator-obserwator', 'narrator-bohater', 'podmiot liryczny', 'autor'], ok: 2, img: 'soccer goal' },
    { t: '„Kasia długo czekała na autobus.” Kto tu mówi?', o: ['narrator-bohater', 'Kasia', 'narrator-obserwator', 'podmiot liryczny'], ok: 3, img: 'bus stop' },
    { t: '„Patrzę w okno, / liczę gwiazdy, / marzę o lecie.” Kto tu mówi?', o: ['narrator', 'podmiot liryczny', 'narrator-obserwator', 'autor'], ok: 2, img: 'stars night' },
    { t: 'Po czym poznasz wiersz?', o: ['Ma wersy i strofy', 'Ma rozdziały', 'Nie ma tytułu', 'Zawsze jest długi'], ok: 1, img: 'poem' },
    { t: 'Narrator-bohater opowiada…', o: ['o sobie: poszedłem, zobaczyłam', 'tylko o innych', 'zawsze wierszem', 'w czasie przyszłym'], ok: 1, img: 'boy telling story' },
    // Notatka
    { t: 'Dobra notatka jest…', o: ['długa i dokładna', 'krótka, konkretna i czytelna', 'przepisana z podręcznika', 'pisana ołówkiem'], ok: 2, img: 'notebook' },
    { t: 'Porównujesz dwa zwierzęta: wielkość, jedzenie, dom. Jaką notatkę wybierzesz?', o: ['tabelę', 'notatkę punktową', 'opowiadanie', 'list'], ok: 1, img: 'animals' },
    { t: 'Zapisujesz kolejne kroki przepisu na naleśniki. Jaka notatka pasuje najlepiej?', o: ['mapa myśli', 'tabela', 'notatka punktowa', 'rysunek'], ok: 3, img: 'pancakes' },
    { t: 'Hasło „JESIEŃ” na środku, a wokół skojarzenia. Co to za notatka?', o: ['tabela', 'mapa myśli', 'notatka punktowa', 'notatka tradycyjna'], ok: 2, img: 'autumn leaves' },
    // Głoski, litery, sylaby
    { t: 'Ile liter i ile głosek ma wyraz „czajnik”?', o: ['7 liter, 7 głosek', '6 liter, 6 głosek', '7 liter, 6 głosek', '6 liter, 7 głosek'], ok: 3, img: 'kettle' },
    { t: 'Które dwie litery oznaczają jedną głoskę?', o: ['sz', 'sk', 'st', 'kr'], ok: 1, img: 'alphabet' },
    { t: 'Ile sylab ma wyraz „biedronka”?', o: ['2', '3', '4', '9'], ok: 2, img: 'ladybug' },
    { t: 'Który wyraz ma więcej liter niż głosek?', o: ['dom', 'las', 'rzeka', 'kot'], ok: 3, img: 'river' },
    { t: 'Jak poprawnie przenieść wyraz „telefon” do nowej linii?', o: ['tel-efon', 'te-lefon', 't-elefon', 'telef-on'], ok: 2, img: 'telephone' },
    // Epitet
    { t: '„Ciepły, puszysty kocyk.” Które wyrazy są epitetami?', o: ['ciepły, puszysty', 'kocyk', 'ciepły, kocyk', 'tylko puszysty'], ok: 1, img: 'blanket' },
    { t: 'Który epitet pasuje do wesołego opowiadania? „… poranek”', o: ['ponury', 'słoneczny', 'straszny', 'mroczny'], ok: 2, img: 'sunny morning' },
    { t: 'Epitet to najczęściej…', o: ['czasownik', 'przymiotnik', 'liczebnik', 'przyimek'], ok: 2, img: 'colorful' },
    // Czasownik
    { t: 'Który wyraz jest czasownikiem?', o: ['zielony', 'drzewo', 'rośnie', 'wysoko'], ok: 3, img: 'tree' },
    { t: 'Który zapis jest poprawny?', o: ['niewiem', 'nie wiem', 'nie-wiem', 'nieWiem'], ok: 2, img: 'question mark' },
    { t: '„Biegniesz” - jaka to osoba i liczba?', o: ['1. osoba, liczba pojedyncza', '2. osoba, liczba pojedyncza', '3. osoba, liczba mnoga', '2. osoba, liczba mnoga'], ok: 2, img: 'running' },
    { t: '„Zbudowali” - w jakim to czasie?', o: ['teraźniejszym', 'przeszłym', 'przyszłym', 'to bezokolicznik'], ok: 2, img: 'building blocks' },
    { t: 'Która forma jest w czasie teraźniejszym?', o: ['czytałem', 'przeczytam', 'czytam', 'będę czytać'], ok: 3, img: 'reading book' },
    { t: 'Który wyraz jest bezokolicznikiem?', o: ['skacze', 'skakać', 'skakali', 'skacz'], ok: 2, img: 'jumping' },
    // Zdanie i równoważnik zdania
    { t: 'Które wypowiedzenie jest zdaniem?', o: ['Cisza w klasie.', 'Dzieci piszą dyktando.', 'Koniec lekcji.', 'Nie rozmawiać.'], ok: 2, img: 'classroom' },
    { t: 'Które wypowiedzenie jest równoważnikiem zdania?', o: ['Mama gotuje obiad.', 'Pada śnieg.', 'Wesołych świąt!', 'Otwórz okno.'], ok: 3, img: 'christmas' },
    { t: 'Jak zamienić „Burza nad miastem.” w zdanie?', o: ['Burza nad miastem!', 'Nad miastem szaleje burza.', 'Wielka burza nad miastem.', 'Burza, miasto.'], ok: 2, img: 'storm' },
    // Plan ramowy
    { t: 'W jakiej kolejności zapisujemy punkty planu ramowego?', o: ['Tak, jak działy się wydarzenia', 'Alfabetycznie', 'Od końca', 'Dowolnie'], ok: 1, img: 'clock' },
    { t: 'Który punkt planu ramowego jest zapisany poprawnie?', o: ['Kuba zgubił piłkę.', 'Zgubienie piłki przez Kubę.', 'Kuba gubi piłkę.', 'Zgubił piłkę.'], ok: 2, img: 'ball' },
    { t: 'Który punkt NIE pasuje do planu ramowego urodzin?', o: ['Przyjście gości.', 'Zdmuchnięcie świeczek.', 'Niebieski obrus na stole.', 'Pożegnanie gości.'], ok: 3, img: 'birthday cake' },
  ],
};
