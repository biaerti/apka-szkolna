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

// Lekcje = moduly tematyczne, niekoniecznie 1 lekcja = 45 min
export interface Lesson {
  id: ID;
  classId: ID;
  title: string;
  topic?: string;
  order: number;
  status: 'planned' | 'in_progress' | 'done' | 'skipped';
  plannedDate?: string;
  doneDate?: string;
  questionSetId?: ID; // recap na start (opcjonalny)
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
  | 'pas' // pas: dzis nie odpowiadam
  | 'zadania' // zadania naprawcze z pytan, ktorych uczen nie umial
  | 'lawki' // plan klasy: siadamy w najblizszych lawkach
  | 'przebieg' // przebieg lekcji: powtorka - temat - kolo - notatka
  | 'zeszyt' // notatka do zeszytu
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
  | 'zaproszenie'; // kogo, na co, kiedy, dokad, kto zaprasza

export type Slide =
  | { id: ID; kind: 'title'; title: string; subtitle?: string; art?: SlideArt }
  | { id: ID; kind: 'text'; title?: string; body: string; art?: SlideArt } // markdown-lite: akapity, listy
  | {
      id: ID;
      kind: 'task';
      code: string;
      title?: string;
      body: string;
      page?: number;
      exerciseNo?: string;
      timerSec?: number;
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
  | { id: ID; kind: 'recap'; questionSetId: ID } // slajd uruchamia kolo fortuny
  | { id: ID; kind: 'image'; url: string; caption?: string };

export interface Settings {
  // Wszystko rozliczamy pelnymi miesiacami kalendarzowymi: pasy, uwagi i statystyki
  // zeruja sie 1. dnia miesiaca. Jeden rytm, zeby nie trzeba bylo pamietac dwoch.
  passesPerMonth: number; // domyslnie 3
  hintGivesMinus: boolean; // podpowiadanie = plomba dla podpowiadajacego; domyslnie true
  wheelSpinSec: number; // domyslnie 4
  plusesForFive: number; // ile plusow zamienia sie na piatke; domyslnie 3
  plombyForOne: number; // ile plomb zamienia sie na jedynke; domyslnie 3
}
