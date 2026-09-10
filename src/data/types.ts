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
 * - `uwaga`        - niegrzeczne zachowanie. NIE ma zadnych skutkow w kole (dawna
 *                    eskalacja "1. ostrzezenie, 2. bez plusow" jest wycofana) - to
 *                    przypominajka dla nauczyciela, zeby po lekcjach wpisac uwage
 *                    do dziennika. Tresc siedzi w `note`, a `wpisane` mowi, czy
 *                    juz trafila do dziennika (zakladka "Uwagi"),
 * - `rozliczenie`  - HISTORYCZNE zdarzenie ze starszej wersji zasad (byly zadania
 *                    naprawcze) - zerowalo licznik plomb od tej chwili. UI go juz
 *                    nie tworzy, ale stare zdarzenia tego typu moga wciaz byc w
 *                    Supabase, wiec typ i logika zerowania licznika (patrz
 *                    src/lib/recap.ts: eventsSinceReset) musza je nadal obslugiwac,
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
  /**
   * Adnotacja: przy jedynce/piatce/rozliczeniu - komentarz nauczyciela; przy
   * plusie/kropce z KOLA NA LEKCJI - kod lekcji i zadania, np. "4.3 Z2"
   * (patrz src/lib/recap.ts: lessonWheelNote). Zdarzenia z kola na lekcji nie
   * maja questionSetId ani questionId, bo "pytaniem" jest samo zadanie ze
   * slajdu, nie pytanie z zestawu. Przy UWADZE - jej tresc, np. "przeszkadza
   * na lekcji": to ona ma potem trafic do dziennika.
   */
  note?: string;
  /**
   * Tylko dla `result: 'uwaga'`: uwaga zostala juz przepisana do dziennika
   * (papierowego albo Vulcana). Odhaczane w zakladce "Uwagi" - kalendarz ma
   * pokazywac, co jeszcze zostalo do wpisania po lekcjach. Brak pola = nie.
   */
  wpisane?: boolean;
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
   * (pytania zestawu sluza WYLACZNIE kolu powtorzeniowemu na poczatku
   * nastepnej lekcji; na samej lekcji kolo losuje osobe do zadan ze slajdow
   * `task`, bez pytan - patrz src/lib/recap.ts: "kolo na lekcji"). Dawniej byl
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
  // Klucz historyczny (dawna eskalacja) - dzis rysuje uwage wpisywana wprost do
  // dziennika. Zostaje pod stara nazwa, bo siedzi w lekcjach zapisanych w bazie.
  | 'eskalacja' // przeszkadzanie -> uwaga do dziennika, bez ostrzezen
  | 'zleZachowania' // co liczy sie jako przeszkadzanie, a za co nigdy nie ma uwagi
  | 'pas' // pas: dzis nie odpowiadam
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
  | 'czat' // ta sama rozmowa: dymki w komunikatorze i dialog na kartce
  | 'wiadomosc' // wiadomosc do doroslego: powitanie, prosba, podziekowanie, podpis
  | 'email' // pola e-maila: do kogo, temat, tresc, podpis, zalacznik
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
  // `zeszyt` (text i task): ikonka zeszytu na slajdzie - umowa z klasa "widzisz
  // ikonke = zapisujesz do zeszytu; nie ma ikonki = sluchasz". Dzieci ciagle
  // pytaly, czy trzeba przepisywac - ikonka odpowiada za nauczyciela. Slajdy
  // `topic` i `note` maja ikonke zawsze (jasna kartka w liniaturze i tak znaczy
  // "to sie przepisuje" - ikonka tylko domyka te sama umowe).
  | { id: ID; kind: 'text'; title?: string; body: string; art?: SlideArt; zeszyt?: boolean } // markdown-lite: akapity, listy
  // Temat lekcji do zapisania w zeszycie: kod lekcji (np. 4.3) + krotka wersja
  // tematu do zeszytu (celowo krotsza niz `registerTopic` w dzienniku Vulcan -
  // dzieci pisza wolno, wiec zeszytowy temat ma byc jak najkrotszy). Pusty
  // `topic` znaczy "wez temat z lekcji" (registerTopic), zeby wpis do dziennika
  // i wpis w zeszycie nie rozjechaly sie ze soba, gdy nikt nie ustawil krotszej
  // wersji. Bez `timerSec`: na zapisanie tematu domyslnie nie ma stopera, a
  // gdy trzeba, nauczyciel wlacza go kolkiem wprost na slajdzie (patrz
  // src/components/slides/TopicSlideView.tsx). Stare dane moga jeszcze miec to
  // pole w JSON-ie - jest po prostu ignorowane.
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
      // Ikonka "do zeszytu" - patrz komentarz przy slajdzie 'text'.
      zeszyt?: boolean;
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
  // `mode` (nazewnictwo nauczyciela):
  // - 'powtorzeniowe' - kolo NA POCZATKU lekcji (albo wejscie "Koło powt."):
  //                    pelne ocenianie plus/kropka/plomba/pas, uczen z >=2
  //                    uwagami w miesiacu nie moze dostac plusa. Jedyny tryb,
  //                    jaki tworza dzis gotowe materialy.
  // - 'po-lekcji'    - HISTORYCZNY: kolo NA KONCU lekcji z tymi samymi
  //                    pytaniami (mozna bylo tylko zyskac). Wycofane - dzieci
  //                    odpowiadaly dwa razy na to samo. Zastapione KOLEM NA
  //                    LEKCJI, ktore nie jest slajdem: losuje osobe do kazdego
  //                    zadania wprost na slajdzie `task` (patrz
  //                    src/components/lessons/useTaskWheel.ts). Wartosc zostaje
  //                    dla starych, nieodswiezonych lekcji w bazie.
  // Brak pola (stare dane sprzed tego rozroznienia) = 'po-lekcji', bo do tej
  // pory KAZDY recap na koncu lekcji dzialal tak jak dawne 'po-lekcji'
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
   * Domyslnie 5.
   */
  reviewQuestionCount: number;
  /**
   * Ile sekund ma wylosowany uczen na odpowiedz. Stoper startuje sam po
   * wylosowaniu i tylko pokazuje czas - niczego nie ocenia i nie przelacza
   * ucznia. 0 = bez stopera. Domyslnie 30.
   */
  answerTimerSec: number;
  /**
   * Wielkosc liter na ekranach projektora (slajdy lekcji, kartkowki) w
   * procentach: 100 = tak, jak wyliczy fitText.ts, 125 = o cwierc wiekszej.
   * Sala jest dluga, a ostatnia lawka daleko - nauczyciel podbija to sobie sam,
   * bez ruszania kodu. Patrz src/components/slides/useSlideFontScale.ts.
   * Domyslnie 100.
   */
  slideFontPercent: number;
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

// --- Kartkowki i klasowki ----------------------------------------------------

export type QuizKind = 'kartkowka' | 'klasowka';

/**
 * Pytanie kartkowki - KOPIA tresci z chwili dodania, a nie odwolanie do
 * `Question`. Zestaw pytan lekcji moze sie potem zmienic (nauczyciel poprawi
 * tresc, usunie pytanie, przestawi kolejnosc), a kartkowka ma zostac taka,
 * jaka byla pisana - dzieci maja ja na kartkach, a nauczyciel sprawdza po
 * tym, co bylo na projektorze. `sourceQuestionId` to tylko slad, skad
 * pytanie pochodzi (blokuje ponowne dodanie tego samego pytania w pickerze);
 * pytania wlasne go nie maja.
 */
export interface QuizQuestion {
  id: ID;
  text: string;
  answer?: string;
  sourceQuestionId?: ID;
  /**
   * Skad pytanie przyszlo, w jezyku nauczyciela: "4.2 Z1" (zadanie robione na
   * lekcji) albo "4.2 PZ3" (pytanie powtorzeniowe z zestawu tej lekcji).
   * Sama etykieta, nie odwolanie - jak cala reszta pytania jest to kopia z
   * chwili dodania. Brak pola = pytanie wlasne albo dodane, zanim
   * rozroznienie powstalo.
   */
  sourceLabel?: string;
  /**
   * Ile punktow jest warte zadanie. Brak pola = 1 punkt (tak wygladaly
   * wszystkie kartkowki, zanim punktacja powstala).
   * - 1 pkt - jedno polecenie: zrobione albo nie,
   * - 2 pkt - zadanie z kilkoma przykladami: wiecej niz polowa dobrze = 1 pkt,
   *   wszystko dobrze = 2 pkt (patrz src/lib/quiz.ts: POINTS_RULE).
   */
  points?: number;
  order: number;
}

/**
 * Kartkowka albo klasowka. Nalezy do KLASY (`classId`), a nie do rocznika jak
 * lekcje: to konkretne wydarzenie w konkretnej klasie - kartkowka "karna" za
 * halas pisana przez IV A w ten wtorek, klasowka po dziale w terminie
 * ustalonym z IV B. Klasy rownolegle pisza w rozne dni i z roznym zestawem
 * pytan, wiec wspolna encja dla rocznika nie mialaby sensu. Pytania sie
 * bierze z zestawow lekcji rocznika tej klasy (patrz src/lib/quiz.ts:
 * lessonQuestionOptions) albo dopisuje wlasne.
 */
export interface Quiz {
  id: ID;
  classId: ID;
  kind: QuizKind;
  title: string;
  date?: string; // YYYY-MM-DD
  questions: QuizQuestion[];
  note?: string;
  createdAt: string; // ISO
}

// --- Plan lekcji ---------------------------------------------------------------

/**
 * Godzina lekcyjna wg dzwonkow: numer (0, 1, 2...) i czas "HH:MM". Lista
 * godzin jest globalna (jeden dzwonek dla calej szkoly), edytowalna w zakladce
 * "Plan" - domyslnie dzwonki SP97 (patrz src/data/timetableSeed.ts). Numer jest
 * jednoczesnie kluczem: dwie godziny o tym samym `no` nie maja sensu.
 */
export interface LessonPeriod {
  no: number;
  start: string; // "HH:MM"
  end: string; // "HH:MM"
}

/**
 * Jedna komorka tygodniowego planu nauczyciela: dzien tygodnia 1-5 (pon-pt),
 * numer godziny lekcyjnej (LessonPeriod.no), klasa i sala. Para (weekday,
 * period) jest unikalna - nauczyciel nie moze byc w dwoch klasach naraz.
 * Plan sluzy pulpitowi ("co dzis mam") i zegarowi na projektorze ("ile
 * zostalo do konca tej lekcji"), nie jest powiazany z kolejka lekcji.
 */
export interface TimetableEntry {
  id: ID;
  weekday: number; // 1 = poniedzialek ... 5 = piatek
  period: number; // LessonPeriod.no
  classId: ID;
  room?: string; // np. "31"
}
