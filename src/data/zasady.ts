// Zasady pracy na lekcjach jezyka polskiego - jedno zrodlo prawdy.
// Ta sama tresc zasila wydruk A4 (src/pages/RulesPrint.tsx) i slajdy lekcji
// zapoznawczej (src/data/intro.ts) - nie duplikowac tekstu w dwoch miejscach.
//
// UWAGA na indeksy: src/data/intro.ts siega do niektorych elementow tablic
// `items` po numerze indeksu (np. sekcja "Gramy w kolo fortuny" - items[1],
// sekcja "Pasy" - items[0], sekcja "Kiedy ktos przeszkadza" - items.slice(0,3)
// i items[3]). Nowe punkty dopisywac tak, zeby tych konkretnych indeksow nie
// przesunac (patrz komentarze przy kazdej sekcji nizej).

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
      'Każda lekcja zaczyna się i kończy kołem: na początku wracamy do ostatniego tematu, na końcu sprawdzamy nowy.',
      'W czasie jednego tematu koło kręci się 2-3 razy.',
      'Na początku może być stresująco. To normalne. Po kilku lekcjach się przyzwyczaicie i będzie dobrze.',
    ],
  },
  {
    title: 'Co można wygrać, a co przegrać',
    items: [
      'Plus - za bardzo dobrą odpowiedź.',
      'Kropka - za odpowiedź częściową. Zaliczone, ale bez plusa.',
      'Plomba - za złą odpowiedź albo za jej brak.',
      '3 plusy = piątka. 3 plomby = jedynka.',
      'Za podpowiadanie koledze albo koleżance - plomba dla podpowiadającego.',
    ],
  },
  {
    title: 'Pasy',
    items: [
      // indeks 0 - wykorzystywany wprost w intro.ts, nie przesuwac
      'Każdy ma 3 pasy w miesiącu. Pas znaczy "dzisiaj nie odpowiadam" - bez plomby.',
      'Limit pasów odnawia się na początku każdego miesiąca.',
    ],
  },
  {
    title: 'Plomby da się odrobić',
    items: [
      'Kto zbierze 3 plomby, dostaje 3 zadania naprawcze - dokładnie z tych pytań, na które nie umiał odpowiedzieć.',
      'Przyniesiesz rozwiązania na następną lekcję - plomby znikają.',
      'Nie przyniesiesz - jedynka.',
    ],
  },
  // Sekcja wstawiona PRZED "Kiedy ktos przeszkadza" - najpierw nazywamy zachowanie,
  // dopiero potem mowimy o konsekwencjach. Wstawienie calej sekcji nie przesuwa
  // indeksow ITEMOW, po ktore siega intro.ts (te sa liczone w obrebie sekcji).
  {
    title: 'Co liczy się jako przeszkadzanie',
    items: [
      // Punkty sa celowo laczone po kilka zachowan - polowka A4 miesci ograniczona
      // liczbe wierszy, a rozbicie tego na osiem osobnych punktow ucinalo na
      // wydruku koncowke sekcji "Kiedy ktos przeszkadza".
      'Krzyk, gadanie i przekrzykiwanie, kiedy ktoś odpowiada albo kiedy tłumaczę temat.',
      'Podpowiadanie - kolega traci szansę na plusa, a podpowiadający dostaje plombę.',
      'Ściągawki, odpisywanie na sprawdzianie, telefon na ławce albo w ręce.',
      'Śmianie się z czyjejś odpowiedzi, przezywanie, chodzenie po klasie, rzucanie rzeczami.',
      'To NIE jest przeszkadzanie: zła odpowiedź, "nie wiem", pytanie do mnie albo prośba o powtórzenie.',
    ],
  },
  {
    title: 'Kiedy ktoś przeszkadza',
    items: [
      // indeksy 0-3 - wykorzystywane wprost w intro.ts (slice(0,3) oraz [3]),
      // nowe punkty dopisywac wylacznie na koncu listy
      'Pierwszy raz: ostrzeżenie.',
      'Drugi raz: tracisz możliwość zdobywania plusów.',
      'Trzeci raz: trafiasz do koła podwójnie - dwa razy większa szansa, że to ty odpowiadasz.',
      'Każde dodatkowe wejście do koła to jedno pytanie więcej dla całej klasy. Im więcej przeszkadzania, tym więcej odpytywania.',
      'Uwagi zerują się z początkiem każdego miesiąca - nowy miesiąc, czysta kartka.',
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
      'Każda lekcja zaczyna się i kończy kołem fortuny.',
      'Najpierw powtórka z ostatniego tematu - kręcimy kołem.',
      'Potem nowy temat: prezentacja i zadania.',
      'Na koniec koło fortuny sprawdza to, czego się dzisiaj nauczyliście.',
      'Notatka do zeszytu - zapisujecie i jesteście wolni.',
    ],
  },
  // Nowa sekcja dopisana NA KONCU tablicy - zgodnie z uwaga na gorze pliku,
  // zeby nie przesunac indeksow, po ktore siega src/data/intro.ts.
  {
    title: 'Zeszyt i sprawdziany',
    items: [
      'Każda lekcja ma numer i temat. Zapisujemy je w zeszycie w linie.',
      'W zeszycie robimy notatki i zapisujemy podpowiedzi. Pracujemy na nich na bieżąco.',
      'Przed sprawdzianem dostajecie całe powtórzenie na kartkach.',
      // Progi 33/50/75 podal nauczyciel wprost. Progi 90 i 98 to typowe
      // uzupelnienie do skali 1-6 - WSTEPNE, do potwierdzenia przez nauczyciela.
      'Sprawdziany oceniamy w procentach: od 33% dwójka, od 50% trójka, od 75% czwórka, od 90% piątka, od 98% szóstka.',
    ],
  },
];
