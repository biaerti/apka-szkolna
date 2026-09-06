// Definicje typow danych aplikacji - zgodnie z docs/SPEC.md

export type ID = string;

export interface SchoolClass {
  id: ID;
  name: string; // np. "IV A"
  order: number;
}

export interface Student {
  id: ID;
  classId: ID;
  firstName: string;
  lastName: string;
  number: number;
  note?: string; // np. "orzeczenie"
  active: boolean; // false = usuniety/przeniesiony, nie kasujemy historii
}

/**
 * Wynik pojedynczego zdarzenia w kole fortuny.
 *
 * Slownictwo jest celowo "klasowe" - dokladnie takie, jakim Bartek mowi do dzieci,
 * zeby kod dalo sie czytac razem z wydrukiem zasad (`src/data/zasady.ts`):
 * - `plus`         - bardzo dobra odpowiedz,
 * - `kropka`       - odpowiedz czesciowa; zaliczone, ale bez plusa (ani plus, ani plomba),
 * - `plomba`       - zla odpowiedz albo jej brak (dawniej "minus" - nazwa zmieniona,
 *                    zeby nie budzic negatywnych skojarzen),
 * - `pass`         - uczen korzysta z pasa (limit tygodniowy w ustawieniach),
 * - `hint_plomba`  - plomba dla ucznia, ktory podpowiadal,
 * - `uwaga`        - niegrzeczne zachowanie; kolejne uwagi eskaluja konsekwencje w kole,
 * - `rozliczenie`  - uczen oddal zadania naprawcze; zeruje licznik plomb od tej chwili,
 * - `jedynka`      - adnotacja: plomby zamienione na ocene niedostateczna,
 * - `piatka`       - adnotacja: plusy zamienione na ocene bardzo dobra.
 */
export type RecapResult =
  | 'plus'
  | 'kropka'
  | 'plomba'
  | 'pass'
  | 'hint_plomba'
  | 'uwaga'
  | 'rozliczenie'
  | 'jedynka'
  | 'piatka';

export interface RecapEvent {
  id: ID;
  studentId: ID;
  classId: ID;
  questionSetId?: ID;
  questionId?: ID;
  result: RecapResult;
  note?: string; // adnotacja (np. przy jedynce/piatce/rozliczeniu)
  at: string; // ISO
}

export interface QuestionSet {
  id: ID;
  name: string;
  topic?: string;
  classIds: ID[];
  createdAt: string;
}

export interface Question {
  id: ID;
  setId: ID;
  text: string;
  answer?: string;
  order: number;
}

export type LessonStatus = 'planned' | 'in_progress' | 'done' | 'skipped';

/** Postep jednej klasy w jednej lekcji. Brak wpisu w `Lesson.progress` = 'planned'. */
export interface LessonProgress {
  status: LessonStatus;
  doneDate?: string; // YYYY-MM-DD
}

/**
 * Lekcje = moduly tematyczne, niekoniecznie 1 lekcja = 45 min.
 *
 * Lekcja nalezy do ROCZNIKA (`grade`), nie do pojedynczej klasy: wszystkie czwarte
 * klasy maja te same lekcje i te same pytania, a osobno liczony jest tylko postep
 * (`progress`, klucz = classId). Rocznik to pierwszy wyraz nazwy klasy
 * ("IV A" -> "IV"), patrz src/lib/grade.ts. Nauczyciel: "te same lekcje sa dla
 * 4a, 4b i 4c; dla 5 beda inne" - kopiowanie lekcji miedzy klasami rownoleglymi
 * bylo zbednym krokiem.
 */
export interface Lesson {
  id: ID;
  grade: string;
  title: string;
  /**
   * Kod lekcji do zeszytu, np. "4.3" (rocznik.numer). Nadawany raz, przy
   * tworzeniu lekcji, i juz sie nie zmienia - dziecko ma po nim odnalezc temat
   * w zeszycie nawet wtedy, gdy nauczyciel przestawi kolejnosc lekcji. Kody
   * zadan w slajdach (Z1, Z2...) numeruja sie osobno, wewnatrz lekcji.
   */
  code?: string;
  topic?: string;
  order: number; // kolejnosc w obrebie rocznika
  progress: Record<ID, LessonProgress>;
  plannedDate?: string;
  questionSetId?: ID; // zestaw pytan do kola wpiety w lekcje (opcjonalny)
  /**
   * Dzial (grupa) lekcji do naglowka na liscie, np. "Powtorka 1-3" albo
   * "Powtorka klasy 4" - lekcje bez dzialu (zwykle lekcje tematyczne wlasne
   * nauczyciela) nie dostaja naglowka. Grupowanie idzie po kolejnosci lekcji
   * w roczniku, nie po osobnej licie dzialow.
   */
  dzial?: string;
  /**
   * Zestaw pytan powtorkowy TEJ lekcji - wskazuje na JEJ WLASNY `questionSetId`
   * (te same pytania sluza i kolu po lekcji, i kolu powtorzeniowemu na
   * poczatku nastepnej lekcji, patrz src/lib/recap.ts: RecapMode). Dawniej byl
   * to osobny, lustrzany zestaw pytan - wycofany, zeby nauczyciel nie musial
   * przygotowywac dwoch kompletow pytan na ten sam material. Zostaje jako
   * osobne pole (kolumna w Supabase juz istnieje) - starsze, jeszcze
   * nieodswiezone lekcje moga wciaz wskazywac na prawdziwie osobny zestaw.
   * Odpytywany na kole NA POCZATKU NASTEPNEJ lekcji ("wracamy do ostatniego
   * tematu"), zanim zacznie sie nowy material. Opcjonalny - lekcja
   * zapoznawcza (intro.ts) go nie ma.
   */
  reviewQuestionSetId?: ID;
  slides: Slide[];
  // Pod dziennik elektroniczny (Vulcan): temat do wpisania i kody podstawy programowej (np. II.1.1).
  registerTopic?: string;
  curriculum?: string[];
}

/**
 * Klucz wbudowanej ilustracji SVG rysowanej w kodzie (src/components/slides/art).
 * Slajd tekstowy bez grafiki to na projektorze pusta czarna plansza - `art`
 * pozwala dolozyc schemat, ktory tlumaczy to samo obrazkiem. Rysujemy w SVG,
 * a nie wstawiamy plikow, zeby dzialalo offline i dalo sie latwo poprawic.
 */
export type SlideArt =
  | 'gra' // czym jest gra: kostka, pionek, zasady
  | 'kolo' // schemat kola fortuny z imionami
  | 'oceny' // plus / kropka / plomba
  | 'stopnie' // 3 plusy = piatka, 3 plomby = jedynka
  | 'eskalacja' // 1. ostrzezenie, 2. bez plusow, 3. podwojnie w kole
  | 'zleZachowania' // co liczy sie jako przeszkadzanie, a za co nigdy nie ma uwagi
  | 'pas' // pas: dzis nie odpowiadam
  | 'zadania' // zadania naprawcze z pytan, ktorych uczen nie umial
  | 'lawki' // plan klasy: siadamy w najblizszych lawkach
  | 'przebieg' // przebieg lekcji: powtorka - temat - kolo - notatka
  | 'zeszyt' // notatka do zeszytu
  | 'procenty' // progi procentowe ocen ze sprawdzianow
  // Ilustracje przedmiotowe do powtorki 1-3 (src/data/recap13.ts).
  | 'samogloski' // 8 samoglosek na tle spolglosek
  | 'sylaby' // podzial wyrazu na sylaby
  | 'dwuznak' // jedna gloska zapisana dwiema literami
  | 'wymianaOu' // o wymienia sie na o, e, a
  | 'wymianaRzCh' // rz na r, z na g/z, ch na sz
  | 'rzeczownik' // kto? co?
  | 'czasownik' // co robi? co sie z nim dzieje?
  | 'przymiotnik' // jaki? jaka? jakie?
  | 'rodzajeZdan' // oznajmujace, pytajace, rozkazujace
  | 'wielkaLitera' // poczatek zdania, imie, nazwa miejscowosci
  | 'przecinek' // przecinek przed ze, ale, bo
  | 'wiersz' // wiersz kontra proza, rymy
  | 'basn' // basn, legenda i bohater glowny
  | 'opowiadanie' // wstep - rozwiniecie - zakonczenie
  | 'opis' // przymiotniki opisujace przedmiot
  | 'zaproszenie' // kogo, na co, kiedy, dokad, kto zaprasza
  | 'alfabet' // 32 litery i porzadek alfabetyczny
  | 'slownik' // jak szukac wyrazu w slowniku ortograficznym
  | 'bliskoznaczne' // wyrazy bliskoznaczne i przeciwstawne
  | 'rodzinaWyrazow' // wspolna czastka i wyrazy pokrewne
  | 'zmiekczenia' // c z kreska kontra ci, s kontra si...
  | 'nosowki' // a i e z ogonkiem kontra om, on, em, en
  | 'znakiInterpunkcyjne' // kropka, pytajnik, wykrzyknik, przecinek, dwukropek, myslnik
  | 'dialog' // zapis rozmowy: nowa linia i myslnik
  | 'zyczenia' // zyczenia i podziekowanie
  | 'kolejnoscZdarzen' // najpierw - potem - nagle - na koniec
  | 'tematTekstu' // o czym jest tekst + szukanie informacji lupa
  | 'bohaterowie' // bohater glowny w kazdej scenie, drugoplanowy tylko w niektorych
  | 'cechyBohatera' // przymiotniki opisujace bohatera + uzasadnienie z tekstu
  | 'nastroj' // wesoly, smutny, straszny - po slowach w tekscie
  | 'koperta' // adres nadawcy i odbiorcy na kopercie
  | 'przeproszenie' // za co, ze przykro, co zrobie inaczej
  | 'przeksztalcanieZdan' // to samo zdanie: oznajmujace, pytajace, wykrzyknienie, rownowaznik
  | 'liczebnikSlownie' // 600 = szescset, 400 = czterysta
  // Ilustracje przedmiotowe do powtorki klasy 4 (src/data/recap4.ts).
  | 'przypadki' // 7 przypadkow z pytaniami
  | 'czasownikOdmiana' // osoba, liczba, czas
  | 'stopniowanie' // rowny, wyzszy, najwyzszy
  | 'liczebnik' // glowny (ile?) i porzadkowy (ktory z kolei?)
  | 'podmiotOrzeczenie' // kto? co? i co robi?
  | 'zdanieZlozone' // jedno orzeczenie kontra dwa
  | 'nieodmienne' // przyslowek, przyimek, spojnik
  | 'nieZCzesciami' // "nie" osobno z czasownikiem, razem z rzeczownikiem i przymiotnikiem
  | 'srodkiPoetyckie' // epitet, porownanie, przenosnia, wyraz dzwiekonasladowczy
  | 'strofa' // wers, strofa, rym, refren
  | 'narrator' // podmiot liryczny kontra narrator 1. i 3. osoby
  | 'list' // data, naglowek, tresc, podpis
  | 'ogloszenie' // co, kiedy i gdzie, kto
  | 'wieloznaczne' // jeden wyraz, kilka znaczen (zamek)
  | 'frazeologizm' // staly zwrot i jego znaczenie przenosne
  | 'zdrobnienieZgrubienie' // domek - dom - domisko
  | 'nazwyWlasne' // pospolite mala litera, wlasne wielka
  | 'skroty' // np., itd., ul., dr
  | 'swiatPrzedstawiony' // czas, miejsce, bohaterowie, wydarzenia
  | 'gatunki' // basn, legenda, mit, bajka
  | 'teatrFilm'; // elementy spektaklu i filmu

export type Slide =
  | { id: ID; kind: 'title'; title: string; subtitle?: string; art?: SlideArt }
  | { id: ID; kind: 'text'; title?: string; body: string; art?: SlideArt } // markdown-lite: akapity, listy
  // Temat lekcji do zapisania w zeszycie: kod lekcji (np. 4.3) + jedno zdanie
  // tematu. Pusty `topic` znaczy "wez temat z lekcji" (registerTopic), zeby
  // wpis do dziennika i wpis w zeszycie nie rozjechaly sie ze soba.
  | { id: ID; kind: 'topic'; topic?: string; note?: string }
  | {
      id: ID;
      kind: 'task';
      code: string;
      title?: string;
      body: string;
      page?: number;
      exerciseNo?: string;
      timerSec?: number;
      // Ta sama ilustracja, co na slajdzie z regula tuz przed zadaniem - dziecko
      // pisze w zeszycie i ma wzor przed oczami, zamiast patrzec na sama liste
      // polecen. Szczegolnie wazne w klasach 1-3.
      art?: SlideArt;
    }
  // Praca z tekstem: strona i czas na przeczytanie musza byc widoczne od razu,
  // duzymi cyframi - uczen ma wiedziec CO czyta i ILE MA CZASU bez pytania.
  | {
      id: ID;
      kind: 'read';
      title?: string;
      source?: string; // np. "Podręcznik", "Lektura: Akademia pana Kleksa"
      page?: number;
      pageTo?: number; // zakres stron: s. 124-126
      body?: string; // na co zwrocic uwage podczas czytania
      timerSec?: number; // czas na przeczytanie
    }
  // Notatka do zeszytu - zamyka lekcje ("zapisujecie notatkę i jesteście wolni").
  | { id: ID; kind: 'note'; title?: string; body: string }
  // slajd uruchamia kolo fortuny; variant 'demo' = pierwsze pokazanie kola w
  // lekcji zapoznawczej - dziala jak zwykla runda (bez naglowka "Przedstaw się"
  // i bez "dodatkowego pytania"), tryb intro/przedstawiania wynika z topicu
  // zestawu ORAZ braku tego pola. `variant` zostaje tylko dla lekcji
  // zapoznawczej (src/data/intro.ts) - nowe rozroznienie zasad oceniania
  // zaladowanych z `mode` (patrz nizej).
  //
  // `mode` rozroznia DWA WLASCIWE tryby rundy (nazewnictwo nauczyciela):
  // - 'po-lekcji'    - kolo NA KONCU lekcji: mozna tylko zyskac (plus/Dalej,
  //                    plomba tylko dla ucznia z >=3 uwagami w miesiacu),
  // - 'powtorzeniowe' - kolo NA POCZATKU lekcji (albo wejscie "Koło powt."):
  //                    pelne ocenianie plus/kropka/plomba/pas, uczen z >=2
  //                    uwagami w miesiacu nie moze dostac plusa.
  // Brak pola (stare dane sprzed tego rozroznienia) = 'po-lekcji', bo do tej
  // pory KAZDY recap na koncu lekcji dzialal tak jak dzisiejsze 'po-lekcji'
  // (patrz src/lib/recap.ts: resolveRecapMode). Odczyt starych danych nie moze
  // sie wywalic - stad pole opcjonalne, a nie wymagane.
  | { id: ID; kind: 'recap'; questionSetId: ID; variant?: 'demo'; mode?: 'po-lekcji' | 'powtorzeniowe' | 'demo' }
  // `title`/`body` opcjonalne: pozwalaja polaczyc zdjecie z krotkim tekstem na
  // jednym slajdzie (np. "Kim jestem" - zdjecie + dwa zdania obok) albo dac
  // sam naglowek nad zdjeciem (np. "Znacie teleturniej Kolo Fortuny?").
  // `caption` zostaje jako podpis pod zdjeciem dla prostszych slajdow.
  | { id: ID; kind: 'image'; url: string; caption?: string; title?: string; body?: string };

export interface Settings {
  // Wszystko rozliczamy pelnymi miesiacami kalendarzowymi: pasy, uwagi i statystyki
  // zeruja sie 1. dnia miesiaca. Jeden rytm, zeby nie trzeba bylo pamietac dwoch.
  passesPerMonth: number; // domyslnie 2
  hintGivesMinus: boolean; // podpowiadanie = plomba dla podpowiadajacego; domyslnie true
  wheelSpinSec: number; // domyslnie 4
  plusesForFive: number; // ile plusow zamienia sie na piatke; domyslnie 3
  plombyForOne: number; // ile plomb zamienia sie na jedynke; domyslnie 3
  /**
   * Miekki limit pytan w kole POWTORZENIOWYM (na poczatku lekcji): licznik w
   * sesji pokazuje "pytanie X/limit" i po jego osiagnieciu proponuje
   * zakonczenie rundy - nauczyciel moze kreic dalej, to nie jest blokada.
   * Domyslnie 7.
   */
  reviewQuestionCount: number;
}

/**
 * Zebranie z rodzicami. Cala tresc siedzi w jednym polu `script` (markdown-lite:
 * naglowki "## ", punkty "- ", **pogrubienie**) - nauczyciel edytuje je jak
 * notatke, bez rozbijania na osobne encje punktow. Kafelek na liscie pokazuje
 * `title` + `date`/`time`, reszta jest w widoku zebrania.
 */
export interface Meeting {
  id: ID;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  place?: string; // np. "sala 24"
  script: string;
  order: number;
}
