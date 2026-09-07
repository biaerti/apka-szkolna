// Zasady pracy na lekcjach jezyka polskiego - jedno zrodlo prawdy.
// Ta sama tresc zasila wydruk A4 (src/pages/RulesPrint.tsx) i slajdy lekcji
// zapoznawczej (src/data/intro.ts) - nie duplikowac tekstu w dwoch miejscach.
//
// UWAGA na indeksy: src/data/intro.ts szuka sekcji PO TYTULE (ruleSection),
// nie po pozycji w tej tablicy - kolejnosc sekcji mozna wiec zmieniac. W
// obrebie pojedynczej sekcji intro.ts czasem siega do konkretnego elementu
// `items` po numerze indeksu (np. sekcja "Gramy w kolo fortuny" - items[1]).
// Nowe punkty w takiej sekcji dopisywac na koncu listy, zeby nie przesunac
// indeksu, po ktory siega intro.ts. Reszta sekcji jest dzielona funkcja
// `partitionItems` (dopasowanie po tresci/regex, nie po indeksie) - tam
// kolejnosc i liczba punktow moze sie zmieniac swobodnie.
//
// Kolejnosc sekcji w tej tablicy = kolejnosc omawiania zasad na lekcji
// zapoznawczej i w wydruku. Rozdzial o zachowaniu jest celowo w kolejnosci:
// najpierw "Specjalne utrudnienia za zachowanie" (eskalacja - co sie stanie),
// dopiero potem "Co liczy sie jako przeszkadzanie" (jasna definicja, co
// dokladnie jest karane) - dzieci maja najpierw poczuc powage tematu, a potem
// dostac precyzyjne granice.

export interface RuleSection {
  title: string;
  items: string[];
}

export const RULE_SECTIONS: RuleSection[] = [
  {
    title: 'Gramy w koło fortuny',
    items: [
      'Po każdym zagadnieniu kręcimy kołem. Na kole są wasze imiona.',
      // indeks 1 - wykorzystywany wprost w intro.ts, nie przesuwac
      'Kto się wylosuje, ten odpowiada. Nie zgłaszamy się - losuje koło. To jest gra.',
      // Dwa kola - nomenklatura kluczowa dla calego systemu, patrz tez sekcja
      // "Specjalne utrudnienia za zachowanie" i slajd "Przyklad rundy" w intro.ts.
      'Koło po lekcji kręcimy zaraz po omówieniu tematu, na tej samej lekcji - tu można tylko zyskać: dobra odpowiedź to plus, słabsza albo brak odpowiedzi - nic się nie dzieje.',
      'Koło powtórzeniowe kręcimy na początku następnej lekcji, z pytaniami z poprzedniego tematu - tu gra się o wszystko: plus, kropkę i plombę.',
      'Uwagi za zachowanie można dostać zawsze, niezależnie od tego, które koło akurat kręcimy.',
      'Na każdym kole - po lekcji i powtórzeniowym - losujemy od 3 do 5 osób.',
      'Na początku może być stresująco. To normalne. Po kilku lekcjach się przyzwyczaicie i będzie dobrze.',
    ],
  },
  {
    title: 'Co można wygrać, a co przegrać',
    items: [
      'Plus - za bardzo dobrą odpowiedź.',
      'Kropka - za odpowiedź częściową. Zaliczone, ale bez plusa.',
      'Plomba - za złą odpowiedź albo za jej brak.',
      'Plusy, kropki i plomby rozliczamy na koniec miesiąca: 3 plusy = piątka, 3 plomby = jedynka.',
      'Za podpowiadanie koledze albo koleżance - plomba dla podpowiadającego.',
    ],
  },
  {
    title: 'Pasy',
    items: [
      // indeks 0 - wykorzystywany wprost w intro.ts, nie przesuwac
      'Każdy ma 2 pasy w miesiącu. Pas znaczy "dzisiaj nie odpowiadam" - bez plomby.',
      'Limit pasów odnawia się na początku każdego miesiąca.',
    ],
  },
  // Sekcja eskalacji PRZED "Co liczy sie jako przeszkadzanie" - patrz uwaga na
  // gorze pliku. Dawny tytul: "Kiedy ktos przeszkadza".
  {
    title: 'Specjalne utrudnienia za zachowanie',
    items: [
      'Pierwszy raz: ostrzeżenie.',
      'Drugi raz i każdy kolejny: do końca miesiąca nie możesz już dostać plusa - ani na kole po lekcji, ani na kole powtórzeniowym.',
      'Uwagi zerują się z początkiem każdego miesiąca - nowy miesiąc, czysta kartka.',
    ],
  },
  {
    title: 'Co liczy się jako przeszkadzanie',
    items: [
      // Punkty sa celowo laczone po kilka zachowan - polowka A4 miesci ograniczona
      // liczbe wierszy, a rozbicie tego na osiem osobnych punktow ucinalo na
      // wydruku koncowke sekcji.
      'Krzyk, gadanie i przekrzykiwanie, kiedy ktoś odpowiada albo kiedy tłumaczę temat.',
      'Podpowiadanie - kolega traci szansę na plusa, a podpowiadający dostaje plombę.',
      'Ściągawki, odpisywanie na sprawdzianie, **telefon** na ławce albo w ręce.',
      'Śmianie się z czyjejś odpowiedzi, przezywanie, chodzenie po klasie, rzucanie rzeczami.',
      'To NIE jest przeszkadzanie: zła odpowiedź, "nie wiem", pytanie do mnie albo prośba o powtórzenie.',
    ],
  },
  {
    title: 'Gdzie siedzimy',
    items: [
      'Nie siadamy w ostatnich ławkach. Siadamy wszyscy w najbliższych, jak się da.',
      'Po co? Żebym nie musiał krzyczeć, a wy nie musieli przekrzykiwać. Mniej hałasu i mniej bodźców to łatwiejsze skupienie.',
    ],
  },
  {
    title: 'Jak wygląda nasza lekcja',
    items: [
      // Trzy kroki lekcji - intro.ts renderuje je jako liste numerowana
      // (RULE_SECTIONS trzyma sama tresc, bez cyfr - numeracja to sprawa
      // widoku/wydruku, nie danych).
      'Koło powtórzeniowe - z poprzedniego tematu.',
      'Nowy temat - prezentacja i zadania na czas, ze stoperem. Rozwiązania zapisujemy do zeszytu.',
      'Koło po lekcji z nowego tematu i notatka do zeszytu.',
      'Każda lekcja i każde zadanie ma swój kod - zapisujecie go przy notatce.',
    ],
  },
  // Nowa sekcja dopisana NA KONCU tablicy - zgodnie z uwaga na gorze pliku,
  // zeby nie przesunac indeksow, po ktore siega src/data/intro.ts.
  {
    title: 'Zeszyt i sprawdziany',
    items: [
      'Każda lekcja ma numer i temat. Zapisujemy je w zeszycie w linie.',
      // Trzy ponizsze punkty tlumacza system kodow lekcji - wszystkie zawieraja
      // slowo "kod", zeby intro.ts moglo je wydzielic na osobny slajd przez
      // partitionItems(items, /kod/i) bez lamania sie na indeksach.
      'Kod lekcji, np. 4.1, znaczy: 4 - klasa czwarta, 1 - pierwsza lekcja.',
      'Na pierwszej stronie zeszytu robimy spis tematów - legenda z kodami, np. 4.5 - temat, 4.6 - temat.',
      'Zaczynając nową stronę, piszemy w rogu kod tematu, który się na niej zaczyna. Łatwo wrócić: patrzysz w legendę i kartkujesz do kodu.',
      'W zeszycie robimy notatki i zapisujemy podpowiedzi. Pracujemy na nich na bieżąco.',
      'Przed sprawdzianem dostajecie całe powtórzenie na kartkach.',
      // Progi procentowe zgodne z WZO szkoly.
      'Sprawdziany oceniamy w procentach: 0-30% niedostateczny, 31-50% dopuszczający, 51-72% dostateczny, 73-85% dobry, 86-96% bardzo dobry, 97-100% celujący.',
    ],
  },
];
