# Apka szkolna - specyfikacja

Aplikacja webowa dla nauczyciela polskiego (SP 97 Wroclaw). Uzywana na dwoch ekranach:
laptop/monitor nauczyciela + projektor. Komputer w szkole: Windows 7, wiec przegladarka to
maksymalnie Chrome 109. Docelowo hosting Vercel, baza Supabase (pozniej). Na razie dane w
localStorage z eksportem/importem JSON.

## Stack (ustalone, nie zmieniac)
- Vite + React 18 + TypeScript (strict)
- Tailwind CSS **v3** (nie v4 - Chrome 109 nie obsluguje nowego CSS)
- react-router-dom v6
- zustand + middleware `persist` (localStorage), klucz `apka-szkolna`
- Build target: `es2020`. Zakaz: `:has()`, `color-mix()`, container queries, jednostki `dvh/svh`,
  `@property`, nested CSS. Uzywac `100vh`.
- Jezyk UI: polski. Bez emoji w UI. Bez lorem ipsum, bez placeholderowych "TODO" komponentow.
- Zero bibliotek UI (bez shadcn, MUI itd.). Proste, wlasne komponenty w `src/components/ui`.

## Warstwa danych
Wszystkie encje w `src/data/types.ts`. Jeden store zustand w `src/data/store.ts` z akcjami.
Warstwa dostepu do danych musi byc odseparowana tak, zeby pozniej podmienic localStorage na
Supabase bez ruszania komponentow (komponenty korzystaja tylko z hookow ze store).
ID: `crypto.randomUUID()` z fallbackiem (Chrome 109 ma randomUUID tylko na https/localhost -
dodac fallback na `Math.random`).

```ts
type ID = string;

interface SchoolClass { id: ID; name: string; /* "IV A" */ order: number; }

interface Student {
  id: ID; classId: ID; firstName: string; lastName: string; number: number;
  note?: string;          // np. "orzeczenie"
  active: boolean;        // false = usuniety/przeniesiony, nie kasujemy historii
}

// Zdarzenie na recapie - jedyne zrodlo prawdy dla statystyk.
// Slownictwo takie, jakim nauczyciel mowi do dzieci (patrz "Zasady gry" nizej).
// UWAGA: "minus" zostal przemianowany na "plomba" - to slowo ma nie wystepowac w UI.
type RecapResult =
  | 'plus'         // bardzo dobra odpowiedz
  | 'kropka'       // odpowiedz czesciowa: zaliczone, ani plus ani plomba
  | 'plomba'       // zla odpowiedz albo jej brak
  | 'pass'         // uczen bierze pas (limit miesieczny)
  | 'hint_plomba'  // plomba dla podpowiadajacego
  | 'uwaga'        // przeszkadzanie - przypominajka do wpisania w dzienniku, bez skutkow w kole
  | 'rozliczenie'  // HISTORYCZNE (dawne zadania naprawcze) - zeruje licznik plomb, UI juz go nie tworzy
  | 'jedynka'      // plomby zamienione na ocene niedostateczna
  | 'piatka';      // plusy zamienione na ocene bardzo dobra
interface RecapEvent {
  id: ID; studentId: ID; classId: ID; questionSetId?: ID; questionId?: ID;
  result: RecapResult; note?: string; at: string; /* ISO */
  wpisane?: boolean;      // tylko dla 'uwaga': juz przepisana do dziennika (zakladka Uwagi)
}

interface QuestionSet { id: ID; name: string; topic?: string; classIds: ID[]; createdAt: string; }
interface Question { id: ID; setId: ID; text: string; answer?: string; order: number; }

// Lekcje = moduly tematyczne, niekoniecznie 1 lekcja = 45 min. Lekcja nalezy do
// ROCZNIKA (grade = pierwszy wyraz nazwy klasy, "IV A" -> "IV"), nie do jednej klasy:
// wszystkie czwarte klasy widza te same lekcje i te same pytania, a osobno liczony
// jest tylko postep kazdej klasy (progress, klucz = classId). Patrz src/lib/grade.ts.
type LessonStatus = 'planned' | 'in_progress' | 'done' | 'skipped';
interface LessonProgress { status: LessonStatus; doneDate?: string; }
interface Lesson {
  id: ID; grade: string; title: string; topic?: string; order: number; // kolejnosc w roczniku
  code?: string;          // kod do zeszytu, "4.3" = rocznik.numer (src/lib/lessonCode.ts);
                          // nadawany raz przy tworzeniu i niezmienny mimo przestawiania lekcji
  progress: Record<ID, LessonProgress>; // brak wpisu = 'planned'
  plannedDate?: string;
  questionSetId?: ID;     // zestaw pytan do kola wpiety w lekcje (opcjonalny)
  slides: Slide[];
  registerTopic?: string; // temat do wpisania w dzienniku Vulcan
  curriculum?: string[];  // kody podstawy programowej (src/data/podstawa.ts)
}

// Wbudowane ilustracje SVG rysowane w kodzie (src/components/slides/art) - slajd tekstowy
// bez grafiki to na projektorze pusta czarna plansza. Rysujemy w SVG, a nie wstawiamy plikow,
// zeby dzialalo offline w szkole i dalo sie latwo poprawic.
// Dwa zestawy: zasady gry (lekcja zapoznawcza, wydruk) i tresci przedmiotowe (powtorka 1-3).
type SlideArt = 'gra' | 'kolo' | 'oceny' | 'stopnie' | 'eskalacja'
              | 'pas' | 'zadania' | 'lawki' | 'przebieg' | 'zeszyt'
              // powtorka 1-3: fonetyka i ortografia
              | 'samogloski' | 'sylaby' | 'dwuznak' | 'wymianaOu' | 'wymianaRzCh'
              // powtorka 1-3: gramatyka i interpunkcja
              | 'rzeczownik' | 'czasownik' | 'przymiotnik' | 'rodzajeZdan'
              | 'wielkaLitera' | 'przecinek'
              // powtorka 1-3: formy wypowiedzi
              | 'wiersz' | 'basn' | 'opowiadanie' | 'opis' | 'zaproszenie'
              // powtorka klasy 4: odmienne czesci mowy
              | 'przypadki' | 'czasownikOdmiana' | 'stopniowanie' | 'liczebnik'
              // powtorka klasy 4: skladnia i wyrazy nieodmienne
              | 'podmiotOrzeczenie' | 'zdanieZlozone' | 'nieodmienne' | 'nieZCzesciami'
              // powtorka klasy 4: srodki poetyckie i formy wypowiedzi
              | 'srodkiPoetyckie' | 'strofa' | 'narrator' | 'list' | 'ogloszenie';

type Slide =
  | { id: ID; kind: 'title'; title: string; subtitle?: string; art?: SlideArt }
  | { id: ID; kind: 'text'; title?: string; body: string; art?: SlideArt } // markdown-lite: akapity, listy
  // Temat lekcji do zeszytu: wielki kod lekcji + jedno zdanie tematu. Pusty `topic`
  // znaczy "wez temat z lekcji" (registerTopic) - zeszyt i dziennik maja mowic to samo.
  | { id: ID; kind: 'topic'; topic?: string; note?: string }
  | { id: ID; kind: 'task'; code: string; title?: string; body: string; page?: number; exerciseNo?: string; timerSec?: number }
  // Praca z tekstem: strona i czas na przeczytanie sa GLOWNA trescia slajdu,
  // widoczne od razu i z ostatniej lawki - nie dodatkiem na marginesie.
  | { id: ID; kind: 'read'; title?: string; source?: string; page?: number; pageTo?: number; body?: string; timerSec?: number }
  | { id: ID; kind: 'note'; title?: string; body: string }               // notatka do zeszytu, zamyka lekcje
  | { id: ID; kind: 'recap'; questionSetId: ID }                        // slajd uruchamia kolo fortuny
  | { id: ID; kind: 'image'; url: string; caption?: string };

interface Settings {
  passesPerMonth: number;         // domyslnie 3
  hintGivesMinus: boolean;        // podpowiadanie = plomba; domyslnie true
  wheelSpinSec: number;           // domyslnie 4
  plusesForFive: number;          // ile plusow daje piatke; domyslnie 3
  plombyForOne: number;           // ile plomb daje jedynke; domyslnie 3
}
```

**Wszystko rozliczamy pelnymi miesiacami kalendarzowymi.** Pasy i statystyki zeruja sie 1. dnia
miesiaca, wg daty lokalnej. Jeden rytm - nauczyciel nie ma pamietac dwoch. Uwagi za zachowanie
nie wchodza juz do tego rozliczenia: nie maja skutkow w grze, tylko czekaja na przepisanie do
dziennika (zakladka Uwagi).

## Moduly / trasy
Menu: Pulpit, Klasy, Lekcje, Uwagi, Kartkowki, Plan, Zebrania, Zasady, Ustawienia. Nauczyciel
wprost prosil o mniej zakladek ("chce byc milionerem na zakladkach, ktorych nie bede uzywal"),
wiec kazda nowa pozycja w menu wymaga uzasadnienia, a nie tylko "bo pasuje".

- `/` - pulpit: gdzie jestem, co dalej.
- `/klasy` - lista klas; `/klasy/:id` - **jedyne miejsce z uczniami**: lista uczniow klasy
  (CRUD, import z tekstu, aktywacja/dezaktywacja) razem z ich bilansem miesiaca, wyborem
  miesiaca, eksportem CSV i sekcja "Do rozliczenia". Nie ma osobnej zakladki Statystyki -
  statystyki sa tam, gdzie uczniowie.
- `/uwagi` - **kalendarz tygodnia z uwagami do przepisania do dziennika**. Uwaga wpisana w
  trakcie lekcji (kolo powtorzeniowe, panel "Klasa" w prezentacji, plywajacy panel) ma tresc
  (`note`, gotowce w `src/lib/uwagi.ts`) i czeka tu na odhaczenie (`wpisane`). Kolumna = dzien,
  zolta karta = do wpisania, szara = juz wpisana; sobota i niedziela pokazuja sie tylko wtedy,
  gdy cos w nich jest. Tresc uwagi edytuje sie w miejscu, klikiem w tekst.
- `/pytania` - lista zestawow pytan, bez menu wlasnego i bez przypisywania do klas (zestaw
  siedzi w wierszu lekcji, ktora go uzywa); `/pytania/:id` - edytor pytan, nazwa zestawu
  edytowalna wprost w naglowku. Wejscie tylko z poziomu lekcji ("dodaj pytania do kola" albo
  "Edytuj pytania" przy juz wpietym zestawie).
- `/lekcje?klasa=<classId>` - lekcje **rocznika** ogladane z perspektywy jednej klasy (zakladki
  IV A / IV B / IV C / V A w adresie, zeby powrot z prezentacji/kola trafial na wlasciwa
  zakladke). Wszystkie klasy rocznika maja te same lekcje i te same pytania, ale **postep jest
  liczony osobno dla kazdej klasy** - uczniowie sa inni. Kolejnosc lekcji zmienia sie
  przeciaganiem (drag&drop). Zamiast kalendarza: lekka informacja "gdzie jestem, co dalej"; bez
  siatki tygodnia i bez planowania dat w naglowku lekcji. Zestaw pytan do kola jest wpiety w
  wiersz lekcji (bez osobnej sekcji/zakladki). "Gotowe materialy" sa w menu obok "Nowa lekcja"
  i tez w pustym stanie rocznika bez lekcji.
- `/lekcje/:id/edytuj?klasa=<classId>` - edytor slajdow (klasa w query, do powrotu na wlasciwa
  zakladke); `/lekcje/:id/pokaz/:classId` (z fallbackiem `/lekcje/:id/pokaz` na pierwsza klase
  rocznika) - **prezentacja**: strzalki/spacja, F fullscreen; slajd `task` ma duzy kod zadania i
  stoper, slajd `read` wielka strone i czas na przeczytanie, slajd `topic` temat z kodem lekcji do
  zeszytu, slajd `note` wyglada jak kartka z zeszytu i zamyka lekcje, slajd `recap` osadza ekran
  powtorki. Kazdy slajd (poza `topic` i `recap`) ma kod lekcji w prawym dolnym rogu. Slajdy sa
  rysowane na kartce 1280x720 i skalowane do ekranu, a rozmiary czcionek dobiera dlugosc tekstu
  (src/components/slides/fitText.ts) - krotki slajd ma byc OGROMNY, dlugi tylko sie miesci. Start prezentacji przestawia
  postep tej klasy w tej lekcji na `in_progress`, zakonczenie - na `done` z data.
  - **Rysowanie po slajdzie** (src/components/slides/AnnotationLayer.tsx): pasek w lewym dolnym rogu,
    domyslnie zwiniety do przycisku "Rysuj". Pioro / zakreslacz / tekst / gumka, piec kolorow, trzy
    grubosci, Cofnij i Wyczysc. Skroty: R = pioro, T = dopisek, Ctrl+Z = cofnij, Esc = schowaj pasek.
    **Pole dopisku ma uchwyt skalowania** w prawym dolnym rogu (AnnotationTextBox): przeciagniecie
    zmienia szerokosc ramki I wielkosc liter w tej samej proporcji (`scaleTextBox`), a klik w gotowy
    dopisek narzedziem "Tekst" otwiera go z powrotem do poprawki. Grubosc z paska daje dopiskowi
    tylko wielkosc STARTOWA.
    Kreski i dopiski maja wspolrzedne w pikselach kartki 1280x720, wiec trzymaja sie tresci slajdu
    niezaleznie od rozdzielczosci. **Zyja tylko w tym pokazie** - nie zapisuja sie do lekcji ani do
    bazy (to zamazania przy klasie, jak na tablicy; nastepna klasa ma czysty slajd). Przy wlaczonym
    pisaku klik w slajd rysuje, a nie przewija. Slajd `recap` (kolo) nie ma warstwy rysowania.
  - **Wielkosc liter** (Ustawienia -> "Wielkosc liter na slajdach", `Settings.slideFontPercent`,
    80-180%, domyslnie 100): mnoznik podawany do fitFontSize jako `scale`. Rusza `max` w calosci,
    `min` o polowe, a wysokosci ramki wcale - krotki slajd rosnie o zadany procent, a slajd gesty od
    tekstu nadal dopasowuje sie do miejsca i nie wychodzi poza kartke. Dziala takze na ekranach
    kartkowek (QuizAllView / QuizOneView). `estimateTextHeight` dolicza odstepy, ktore RichText
    naprawde rysuje miedzy akapitami (0,6 em) i pozycjami listy (0,3 em) - bez tego dluga lista
    wychodzila w oszacowaniu o jakies 20% nizsza, niz jest naprawde.
  - **Stoper zadania** siedzi w prawym dolnym rogu slajdu `task`, poza ukladem kolumnowym
    (`absolute`, na lewo od kodu lekcji) i w wersji `compact` StopwatchBar. Wczesniej stal pod
    trescia i dluzsze polecenie spychalo go poza slajd.
- `/powtorka/:classId/:setId` - **ekran projektora** z kolem fortuny. Nie ma osobnej zakladki
  "Powtorka": kolo uruchamia sie ze slajdu `recap` wpietego w konkretna lekcje, a po zamknieciu
  wraca sie do prezentacji.
  - kolo z obecnymi uczniami; nauczyciel odhacza nieobecnych w pasku bocznym
  - "Kręć" -> animacja obrotu (wynik losowany przed animacja, ale **ujawniany dopiero po
    zatrzymaniu kola**), wylosowana osoba wyrozniona az do kolejnego losowania albo do zmiany
    pytania (nowe pytanie zdejmuje z ekranu ucznia, ktory ma juz ocene)
  - przyciski: Dobrze (plus) / Częściowo (kropka) / Źle (plomba) / Pas / Podpowiadał(a) / Uwaga
  - symbole ocen (src/lib/resultSymbol.ts), te same wszedzie: `+` plus, `•` kropka, `▣` plomba,
    `P` pas - na przyciskach, w pasku bocznym, w historii pytan i w legendzie na dole ekranu
  - lista pytan zestawu do recznego wyboru pytania, z historia: kto juz to pytanie dostal
    i z jakim wynikiem
  - pasek boczny z lista uczniow i czytelnym bilansem miesiaca (plusy / kropki / plomby / pasy)
  - skroty: Spacja = kręć, 1/2/3/4 = plus/kropka/plomba/pas, N = nastepne pytanie,
    O = pokaz/ukryj odpowiedz, Ctrl+Z = cofnij ostatnia akcje, F = fullscreen, Esc = zakoncz
  - **"kto juz dzis odpowiadal" jest wspolne dla calej klasy i calego dnia** (`answeredOnDay`
    + licznik sesji dla trybu bez ocen, patrz `usePool`): kolo powtorzeniowe, kolo na lekcji i
    plywajacy panel nie losuja tej samej osoby drugi raz, dopoki reszta klasy nie byla.
    "Zacznij nowa runde" / "Reset" przesuwa tylko moment, od ktorego liczymy skreslenia - oceny
    zostaja w bilansie miesiaca. Miedzy oknami (apka webowa a panel desktopowy) synchronizuje to
    `pullTodayRecapEvents` z `useTodayEventsPull` - dzisiejsze zdarzenia dociagane z chmury co 15 s
    i przy powrocie do okna.
- `/panel` - **poza AppShell**: plywajace kolo fortuny dla aplikacji desktopowej (`desktop/`).
  Okno zawsze na wierzchu nad multipodrecznikiem GWO. Naglowek: wybor klasy, przelacznik trybu,
  uwagi (z trescia do dziennika). Tryb KOLO: losowanie, plus/kropka, obecnosc, Reset skreslen -
  pamiec puli WSPOLNA z apka webowa (`useTaskWheel` liczy ja ze zdarzen dnia, a
  `useTodayEventsPull` dociaga te zapisane w drugim oknie), wiec kto odpowiadal rano na kole
  powtorzeniowym, nie wraca na kolo przy podreczniku. Tryb STOPER: odliczanie (`useCountdown`) z wlasnym
  poleceniem i edytowalna dlugoscia; leci dalej po zwinieciu do pigulki, ktora pokazuje czas.
  Okno ma rozmiar dopasowany do tego, co pokazuje (ROZMIARY w Panel.tsx): wysokie pod kolo,
  niskie pod stoper, a srodkowy przycisk naglowka sciaga stoper do paska z poleceniem i czasem.
- `/zasady/druk` - **poza AppShell**: strona A4 z dwiema kopiami zasad do przeciecia nozyczkami
  plus strona z rysunkiem kola fortuny. Zrodlo tresci: `src/data/zasady.ts`.
- `/ustawienia` - Settings + eksport/import calej bazy do JSON.

## Zasady gry (kolo fortuny)
Jedno zrodlo prawdy dla tresci: `src/data/zasady.ts` - zasila i wydruk `/zasady/druk`, i slajdy
lekcji zapoznawczej. Logika: `src/lib/recap.ts`.

- **Dwa kola** (nomenklatura kluczowa dla calego systemu, `RecapMode` w `src/lib/recap.ts`):
  - **Kolo na lekcji** - po KAZDYM zadaniu (slajd `task`: Z1, Z2... ze stoperem) nauczyciel kreci
    kolem i wylosowana osoba pokazuje swoje rozwiazanie. Mozna tylko zyskac: **plus** za dobrze
    zrobione zadanie, **kropka** za zrobione slabo albo wcale; plomby ani pasa tu nie ma
    (`LessonWheelResult`). To NIE jest slajd `recap` i nie ma pytan z zestawu - "pytaniem" jest
    samo zadanie; zdarzenie dostaje `note` z kodem lekcji i zadania, np. `"4.3 Z2"`
    (`lessonWheelNote`). Pula kola liczona jest ze zdarzen z DZISIEJSZEGO dnia (kto juz dzis
    odpowiadal - takze na kole powtorzeniowym z poczatku tej lekcji - wypada z losowania, dopoki
    reszta klasy nie byla); przeladowanie strony nie psuje puli, cofniecie oceny zwalnia sektor.
    UI: szuflada kola na slajdzie zadania w prezentacji (`TaskWheelDrawer`, skrot `K`).
  - **Kolo powtorzeniowe** - poczatek nastepnej lekcji, slajd `recap` z pytaniami z poprzedniego
    tematu (INNE niz zadania z lekcji; tyle pytan, ile bylo zadan - zwykle 3-5). Gra sie o
    wszystko: plus / kropka / plomba / pas.
  - Dawne **kolo po lekcji** (`mode: 'po-lekcji'` - recap na koncu lekcji z tymi samymi pytaniami,
    co potem na powtorce, mozna bylo tylko zyskac) jest WYCOFANE: dzieci odpowiadaly dwa razy na
    to samo. Wartosc zostaje w typie wylacznie dla starych, nieodswiezonych lekcji w bazie
    (edytor i pasek powtorki pokazuja ja jako "stary tryb"); nowy slajd `recap` dostaje
    `mode: 'powtorzeniowe'`.
- Odpowiedz oceniamy jako **plus** (bardzo dobra), **kropka** (czesciowa - zaliczone, bez plusa)
  albo **plomba** (zla albo brak). Slowo "minus" nie wystepuje w UI - ma nie budzic negatywnych
  skojarzen u dzieci.
- **3 plusy = piatka, 3 plomby = jedynka** (progi w `Settings.plusesForFive` / `plombyForOne`).
- Rozliczenie na koniec miesiaca (zakladka "Do rozliczenia" w widoku klasy): komplet plomb ->
  `jedynka`, komplet plusow -> `piatka`. Zadnych zadan naprawczych (wycofane; stare zdarzenia
  `rozliczenie` w bazie nadal zeruja licznik plomb).
- Nie zglaszamy sie do odpowiedzi - losuje kolo. To gra.
- Za podpowiadanie plomba dla podpowiadajacego (`hint_plomba`).
- Kazdy ma **2 pasy w miesiacu** (`passesPerMonth`).
- **Za przeszkadzanie - uwaga do dziennika, od razu i bez ostrzezen.** Uwaga nie ma ZADNYCH
  skutkow w grze: nie blokuje plusa, nie mnozy sektorow, nie wyklucza z kola. To przypominajka
  dla nauczyciela - laduje w zakladce `/uwagi` z trescia i data, a tam sie ja odhacza po
  przepisaniu do dziennika. Dawna eskalacja (1. ostrzezenie, 2. brak plusow do konca miesiaca,
  `WARN_NO_PLUS_AT`) jest WYCOFANA - mieszala kare za zachowanie z gra o oceny. Nie przywracac.
- Zasada lawek: nie siadamy w ostatnich lawkach, wszyscy w najblizszych - zeby nie krzyczec
  (mniej halasu i bodzcow).

## Schemat lekcji (uklad tresci)
Kolo powtorzeniowe **otwiera** lekcje, kolo na lekcji kreci sie **po kazdym zadaniu**, lekcja
konczy sie notatka. Domyslny uklad slajdow modulu tematycznego:
1. powtorka z poprzedniego tematu -> slajd `recap` (kolo powtorzeniowe, `mode: 'powtorzeniowe'`),
2. `topic` - temat z kodem lekcji do zapisania w zeszycie,
3. nowy temat: `title` / `text` / `read` / `task` - po kazdym `task` kolo na lekcji (szuflada na
   slajdzie zadania, bez osobnego slajdu),
4. slajd `note` - notatka do zeszytu ("zapisujecie notatke i jestescie wolni") - ostatni slajd,
   bez kola na koncu lekcji.

Zestaw pytan do jednego bloku tematycznego: **5-6 krotkich pytan**. Bloki nie moga byc dlugie -
to klasa czwarta.

## Seed
Przy pierwszym uruchomieniu (pusty store) zaladowac klase "IV A" z 20 uczniami (plik
`src/data/seed.ts`) oraz puste klasy "IV B", "IV C", "V A" (nazwy do zmiany przez usera).

## Gotowe materialy
Menu "Gotowe materialy" (obok "Nowa lekcja" i w pustym stanie rocznika) wstawia do rocznika
komplet lekcji z pytaniami - **raz na rocznik**, wspolnie dla wszystkich jego klas:
- lekcja zapoznawcza (`src/data/intro.ts`) - zasady gry, zasilana z `src/data/zasady.ts`,
- powtorka klas 1-3 (`src/data/recap13.ts`) - dla czwartych klas,
- powtorka klasy 4 (`src/data/recap4.ts`) - dla piatych klas.

Powtorki sa opisane danymi w `RECAP_DEFINITIONS` (`src/components/lessons/useReadyMaterials.ts`) -
dolozenie kolejnej to jeden wpis w tablicy, bez zmian w UI. Buildery przyjmuja
`buildXxx(grade, classIds)` (rocznik i lista klas, ktore go tworza, zamiast pojedynczej klasy) i
zwracaja lekcje bez klasowego przypisania. Hook `useReadyMaterials(grade, classIds, gradeLessons)`
liczy, co juz jest wstawione dla rocznika, i co "Odswiezenie" ma podmienic. Kazda powtorka to
6 lekcji + 6 zestawow pytan; zakres wynika z podstawy programowej (I etap dla powtorki 1-3,
II etap dla powtorki klasy 4). **Tytuly lekcji musza byc unikalne miedzy powtorkami** - "Odswiez
gotowe materialy" dopasowuje lekcje po znormalizowanym tytule (`refreshMaterials.titleMatchKey`);
pilnuje tego test `src/data/recap4.test.ts`.

Wstawianie jest **przyrostowe**: klikniecie dokłada tylko te lekcje materialu, ktorych rocznik
jeszcze nie ma (dopasowanie po `titleMatchKey`), i tworzy zestawy pytan tylko dla nich. Dzieki
temu material, ktory urosl w kodzie (do powtorki 1-3 doszly lekcje 4-6), trafia do nauczyciela,
ktory wstawil starsza wersje - menu pokazuje wtedy "Uzupelnij" i liste brakujacych lekcji.
"Odswiez" nadal sluzy do czegos innego: podmienia tresc lekcji juz wstawionych.

## Migracje
- Store (`src/data/store.ts`, `persist` v4): `migrateLessonsToGrades` przeksztalca lekcje z v3
  (pojedyncza klasa: `classId` + `status`/`doneDate`) na v4 (rocznik: `grade` + `progress` per
  klasa). Lekcje o tej samej tresci, ktore nauczyciel wstawil osobno do klas rownoleglych, sa
  sklejane w jedna - dopasowanie po znormalizowanym tytule (`titleMatchKey`), a ich postep laczony
  do jednego obiektu `progress`.
- Supabase: `supabase/migrations/0015_uwagi_do_dziennika.sql` - kolumna `wpisane` w
  `recap_events` (uwaga przepisana do dziennika) plus indeks pod kalendarz zakladki "Uwagi".
- Supabase: `supabase/migrations/0005_lekcje_rocznika.sql` - odpowiadajaca zmiana schematu po
  stronie bazy: kolumna `grade` zamiast `class_id`, a `status`/`done_date` zastapione kolumna
  `progress jsonb` (mapa `class_id -> { status, doneDate }`).

## Jakosc
- Kazdy modul dziala end-to-end, bez atrap. `npm run build` i `npm run typecheck` przechodza.
- Ekrany projektora: duze czcionki (min 32px na tresci), wysoki kontrast, ciemne tlo.
- Ekrany administracyjne: zwykla gestosc, jasne tlo.
- Komponenty <= 250 linii; logika (losowanie, limity pasow, agregacja statystyk) w czystych
  funkcjach w `src/lib/*.ts` z testami (vitest).
