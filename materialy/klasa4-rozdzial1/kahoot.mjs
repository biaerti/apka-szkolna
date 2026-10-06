// Kahoot - klasa 4, rozdział I „Poznajemy siebie i innych”: świat przedstawiony, kto mówi, notatka,
// głoski i sylaby, epitet, czasownik, zdanie i równoważnik, plan ramowy.
// node materialy/kahoot.mjs klasa4-rozdzial1 -> output/kahoot/klasa4-rozdzial1-kahoot.pdf
// Przykłady własne (inne niż w filmikach i zeszycie). `ok` = numer poprawnej odpowiedzi (od 1), `czas` domyślnie 20 s.

export const KAHOOT = {
  plik: 'klasa4-rozdzial1-kahoot',
  tytul: 'Kahoot - klasa 4, rozdział I',
  opis: 'świat przedstawiony, kto mówi w tekście, notatka, głoski i sylaby, epitet, czasownik, zdanie i równoważnik, plan ramowy',
  pytania: [
    // Świat przedstawiony
    { t: 'Co to jest świat przedstawiony?', o: ['Ilustracje w książce', 'Wszystko, czego dowiadujemy się o świecie utworu', 'Życiorys autora', 'Spis treści'], ok: 2 },
    { t: '„Latem Zosia pojechała do babci na wieś.” Co jest miejscem wydarzeń?', o: ['lato', 'Zosia', 'wieś u babci', 'wyjazd'], ok: 3 },
    { t: '„W nocy Bartek zobaczył na strychu sowę.” Co jest czasem wydarzeń?', o: ['noc', 'strych', 'Bartek', 'sowa'], ok: 1 },
    // Kto mówi w tekście?
    { t: 'Kto opowiada historię w opowiadaniu?', o: ['podmiot liryczny', 'czytelnik', 'narrator', 'ilustrator'], ok: 3 },
    { t: 'Kto mówi w wierszu?', o: ['narrator', 'podmiot liryczny', 'bohater bajki', 'wydawca'], ok: 2 },
    { t: '„Zjadłam ostatnie ciastko i schowałam talerz.” Kto tu mówi?', o: ['narrator-obserwator', 'podmiot liryczny', 'autor', 'narrator-bohater'], ok: 4 },
    { t: '„Marek długo szukał swojego psa.” Kto tu mówi?', o: ['narrator-obserwator', 'narrator-bohater', 'podmiot liryczny', 'Marek'], ok: 1 },
    { t: 'Kim jest autor?', o: ['Bohaterem, który mówi w tekście', 'Narratorem', 'Prawdziwym człowiekiem, który napisał tekst', 'Postacią z okładki'], ok: 3 },
    // Notatka
    { t: 'Co oznacza zasada 3K przy notatce?', o: ['kolorowo, ładnie, długo', 'krótko, konkretnie, czytelnie', 'kopiuj, klej, koniec', 'kartka, kredka, książka'], ok: 2 },
    { t: 'Chcesz porównać dwa telefony: cenę, aparat i baterię. Jaką notatkę wybierzesz?', o: ['tabelę', 'mapę myśli', 'notatkę tradycyjną', 'rysunek'], ok: 1 },
    { t: 'Spisujesz rzeczy do spakowania na wycieczkę. Jaka notatka pasuje najlepiej?', o: ['tabela', 'mapa myśli', 'notatka punktowa', 'opowiadanie'], ok: 3 },
    { t: 'W której notatce od jednego hasła rozchodzą się skojarzenia?', o: ['w tabeli', 'w notatce punktowej', 'w notatce tradycyjnej', 'w mapie myśli'], ok: 4 },
    // Głoski, litery, sylaby
    { t: 'Głoskę…', o: ['widzimy i piszemy', 'słyszymy i wymawiamy', 'tylko rysujemy', 'zawsze piszemy wielką literą'], ok: 2 },
    { t: 'Ile liter i ile głosek ma wyraz „szkoła”?', o: ['6 liter, 6 głosek', '5 liter, 5 głosek', '6 liter, 5 głosek', '5 liter, 6 głosek'], ok: 3 },
    { t: 'Który wyraz ma tyle samo liter co głosek?', o: ['szafa', 'kot', 'chata', 'rzeka'], ok: 2 },
    { t: 'Ile sylab ma wyraz „samochody”?', o: ['3', '4', '5', '9'], ok: 2 },
    { t: 'Który podział na sylaby jest poprawny?', o: ['ko-mpu-ter', 'komp-u-ter', 'kom-pu-ter', 'ko-mp-uter'], ok: 3 },
    // Epitet
    { t: 'Na jakie pytania odpowiada epitet?', o: ['co robi?', 'jaki? jaka? jakie?', 'kto? co?', 'gdzie? kiedy?'], ok: 2 },
    { t: '„Stary, skrzypiący most.” Które wyrazy są epitetami?', o: ['stary, skrzypiący', 'most', 'stary, most', 'tylko skrzypiący'], ok: 1 },
    { t: 'Który epitet najlepiej buduje nastrój grozy? „… zamek”', o: ['fajny', 'super', 'ponury', 'ładny'], ok: 3 },
    // Czasownik
    { t: 'Który wyraz jest czasownikiem?', o: ['szybki', 'rower', 'szybko', 'jedzie'], ok: 4 },
    { t: 'Który zapis jest poprawny?', o: ['nielubię', 'nie lubię', 'nie-lubię', 'nieLubię'], ok: 2 },
    { t: '„Śpiewamy” - jaka to osoba i liczba?', o: ['1. osoba, liczba mnoga', '2. osoba, liczba pojedyncza', '3. osoba, liczba mnoga', '1. osoba, liczba pojedyncza'], ok: 1 },
    { t: '„Narysowała” - jaki to czas i rodzaj?', o: ['teraźniejszy, żeński', 'przeszły, męski', 'przyszły, nijaki', 'przeszły, żeński'], ok: 4 },
    { t: 'Która forma jest w czasie przyszłym?', o: ['grałem', 'gram', 'będę grać', 'grajmy'], ok: 3 },
    { t: 'Który wyraz jest bezokolicznikiem?', o: ['pływać', 'pływam', 'pływali', 'pływaj'], ok: 1 },
    // Zdanie i równoważnik zdania
    { t: 'Czym zdanie różni się od równoważnika zdania?', o: ['Zdanie ma kropkę', 'Zdanie ma czasownik w formie osobowej', 'Zdanie jest dłuższe', 'Zdanie ma rzeczownik'], ok: 2 },
    { t: 'Które wypowiedzenie jest zdaniem?', o: ['Piękna pogoda.', 'Spacer w parku.', 'Słońce świeci.', 'Nie hałasować.'], ok: 3 },
    { t: 'Które wypowiedzenie jest równoważnikiem zdania?', o: ['Ola rysuje.', 'Nie deptać trawników.', 'Zamknij okno.', 'Pies szczeka.'], ok: 2 },
    // Plan ramowy
    { t: 'Co zapisujemy w planie ramowym?', o: ['Najważniejsze wydarzenia po kolei', 'Wszystkie szczegóły', 'Wygląd bohaterów', 'Dialogi'], ok: 1 },
    { t: 'Który punkt planu ramowego jest zapisany poprawnie?', o: ['Ola znalazła kotka.', 'Ola znajduje kotka.', 'Znalazła kotka.', 'Znalezienie kotka przez Olę.'], ok: 4 },
    { t: 'Który punkt NIE pasuje do planu ramowego wycieczki?', o: ['Wyjazd autokarem.', 'Zwiedzanie zamku.', 'Czerwone siedzenia w autokarze.', 'Powrót do domu.'], ok: 3 },
  ],
};
