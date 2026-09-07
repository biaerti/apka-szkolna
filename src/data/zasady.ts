// Zasady pracy na lekcjach jezyka polskiego - jedno zrodlo prawdy.
// Ta sama tresc zasila wydruk A4 (src/pages/RulesPrint.tsx) i slajdy lekcji
// zapoznawczej (src/data/intro.ts) - nie duplikowac tekstu w dwoch miejscach.
//
// UWAGA na indeksy: src/data/intro.ts szuka sekcji PO TYTULE (ruleSection),
// nie po pozycji w tej tablicy - kolejnosc sekcji mozna wiec zmieniac. W
// obrebie pojedynczej sekcji intro.ts czasem siega do konkretnego elementu
// `items` po numerze indeksu (np. sekcja "Gramy w kolo fortuny" - items[1],
// items[2] i items[3]; sekcja "Pasy" - items[0]).
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
      'Po każdym zadaniu kręcimy kołem. Na kole są wasze imiona.',
      // indeks 1 - wykorzystywany wprost w intro.ts, nie przesuwac
      'Kto się wylosuje, ten odpowiada. Nie zgłaszamy się - losuje koło. To jest gra.',
      // Dwa kola - nomenklatura kluczowa dla calego systemu (kolo NA LEKCJI po
      // kazdym zadaniu i kolo POWTORZENIOWE na poczatku nastepnej lekcji), patrz
      // tez sekcja "Specjalne utrudnienia za zachowanie", slajd "Przyklad rundy"
      // w intro.ts i logika w src/lib/recap.ts. Dawne "kolo po lekcji" (te same
      // pytania drugi raz na koncu tematu) USUNIETE - nie przywracac.
      // indeksy 2 i 3 - wykorzystywane wprost w intro.ts (slajd "Dwa kola"), nie przesuwac
      'Koło na lekcji kręcimy po każdym zadaniu - kto się wylosuje, pokazuje swoje rozwiązanie. Tu można tylko zyskać: zadanie zrobione dobrze to plus, zrobione słabo albo wcale - kropka. Plomby na kole na lekcji nie ma.',
      'Koło powtórzeniowe kręcimy na początku następnej lekcji, z pytaniami z poprzedniego tematu - innymi niż zadania z lekcji. Tu gra się o wszystko: plus, kropkę i plombę.',
      'Uwagi za zachowanie można dostać zawsze, niezależnie od tego, które koło akurat kręcimy.',
      'Na kole na lekcji losujemy jedną osobę do każdego zadania. Na kole powtórzeniowym jest tyle pytań, ile było zadań - zwykle od 3 do 5.',
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
      'Drugi raz: do końca miesiąca nie możesz już dostać plusa - ani na kole na lekcji, ani na kole powtórzeniowym.',
      'Kolejne uwagi wpisuję już do dziennika.',
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
      // widoku/wydruku, nie danych). Kolo na lekcji siedzi w kroku 2 (po
      // kazdym zadaniu), lekcja konczy sie notatka - bez osobnego kola na koncu.
      'Koło powtórzeniowe - z poprzedniego tematu.',
      'Nowy temat - prezentacja i zadania na czas, ze stoperem. Po każdym zadaniu koło na lekcji losuje, kto pokazuje rozwiązanie. W zeszycie zapisujemy nazwę zadania i rozwiązanie.',
      'Notatka do zeszytu ze slajdu - i koniec lekcji.',
      'Każda lekcja ma swój kod - zapisujecie go w zeszycie przy temacie.',
    ],
  },
  // Nowa sekcja dopisana NA KONCU tablicy - zgodnie z uwaga na gorze pliku,
  // zeby nie przesunac indeksow, po ktore siega src/data/intro.ts.
  {
    title: 'Zeszyt i sprawdziany',
    items: [
      // W zeszycie laduja tylko trzy rzeczy - swiadomie krotka lista, zeby dzieci
      // nie przepisywaly polowy prezentacji.
      'W zeszycie zapisujemy trzy rzeczy: 1) temat lekcji, 2) nazwę zadania i rozwiązanie, 3) na koniec notatkę ze slajdu.',
      // Punkt o kodzie lekcji zawiera slowo "kod" - po nim intro.ts wydziela go
      // przez partitionItems(items, /kod/i) na osobny slajd, bez lamania sie na
      // indeksach. Dawna legenda tematow na pierwszej stronie i kod w rogu
      // strony USUNIETE - zostaje samo znaczenie kodu.
      'Kod lekcji, np. 4.1, znaczy: 4 - klasa czwarta, 1 - pierwsza lekcja. Zapisujemy go przy temacie.',
      'Przed sprawdzianem dostajecie całe powtórzenie na kartkach.',
      // Progi procentowe zgodne z WZO szkoly.
      'Sprawdziany oceniamy w procentach: 0-30% niedostateczny, 31-50% dopuszczający, 51-72% dostateczny, 73-85% dobry, 86-96% bardzo dobry, 97-100% celujący.',
    ],
  },
];
