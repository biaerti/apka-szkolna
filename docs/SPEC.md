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

// Zdarzenie na recapie - jedyne zrodlo prawdy dla statystyk
type RecapResult = 'plus' | 'minus' | 'pass' | 'hint_minus';
interface RecapEvent {
  id: ID; studentId: ID; classId: ID; questionSetId?: ID; questionId?: ID;
  result: RecapResult; at: string; /* ISO */ 
}

interface QuestionSet { id: ID; name: string; topic?: string; classIds: ID[]; createdAt: string; }
interface Question { id: ID; setId: ID; text: string; answer?: string; order: number; }

// Lekcje = moduly tematyczne, niekoniecznie 1 lekcja = 45 min
interface Lesson {
  id: ID; classId: ID; title: string; topic?: string; order: number;
  status: 'planned' | 'in_progress' | 'done' | 'skipped';
  plannedDate?: string; doneDate?: string;
  questionSetId?: ID;     // recap na start (opcjonalny)
  slides: Slide[];
}

type Slide =
  | { id: ID; kind: 'title'; title: string; subtitle?: string }
  | { id: ID; kind: 'text'; title?: string; body: string }               // markdown-lite: akapity, listy
  | { id: ID; kind: 'task'; code: string; title?: string; body: string; page?: number; exerciseNo?: string; timerSec?: number }
  | { id: ID; kind: 'recap'; questionSetId: ID }                        // slajd uruchamia kolo fortuny
  | { id: ID; kind: 'image'; url: string; caption?: string };

interface Settings {
  passesPerWeek: number;          // domyslnie 2
  hintGivesMinus: boolean;        // domyslnie true
  wheelSpinSec: number;           // domyslnie 4
}
```

Tydzien do limitu pasow: poniedzialek-niedziela wg daty lokalnej.

## Moduly / trasy
- `/` - pulpit: dzisiejsze/kolejne lekcje per klasa, szybkie przejscie do recapu.
- `/klasy` - tabela klas, CRUD; `/klasy/:id` - uczniowie klasy (CRUD, import z tekstu:
  kazda linia "Nazwisko Imie" lub "1. Nazwisko Imie - uwaga"), aktywacja/dezaktywacja, statystyki ucznia.
- `/pytania` - zestawy pytan; `/pytania/:id` - edytor pytan (dodawanie na biezaco, import z
  tekstu: jedno pytanie na linie, opcjonalnie "pytanie | odpowiedz"), przypisanie do klas.
- `/powtorka` - wybor klasy + zestawu, potem `/powtorka/:classId/:setId` - **ekran projektora**:
  - kolo fortuny z aktywnymi (obecnymi) uczniami; nauczyciel przed startem odhacza nieobecnych
  - przycisk "Kręć" -> animacja obrotu (canvas albo CSS transform, deterministyczny wynik losowany
    przed animacja), wynik wyrazny, duza czcionka
  - po wylosowaniu: pokaz nastepne pytanie z zestawu (kolejno lub losowo - przelacznik),
    przyciski: Dobrze (+) / Źle (-) / Pas / Podpowiadał(a) (wybor innego ucznia -> minus)
  - licznik pasow ucznia w tym tygodniu widoczny, blokada gdy wyczerpane
  - uczen po odpowiedzi trafia do puli "juz byl" (mozna wlaczyc powtorki)
  - pasek boczny (zwijany) z lista uczniow i biezacym bilansem miesiaca
  - tryb pelnoekranowy (Fullscreen API) i skroty: Spacja = kręć, 1/2/3 = +/-/pas, F = fullscreen
- `/lekcje` - lista lekcji per klasa (kolejka, przeciaganie kolejnosci opcjonalnie - min. gora/dol),
  statusy, skip; `/lekcje/:id/edytuj` - edytor slajdow; `/lekcje/:id/pokaz` - **prezentacja**:
  strzalki/spacja nawigacja, F fullscreen, slajd `task` ma duzy kod zadania, numer strony,
  stoper (start/pauza/reset, dzwiek opcjonalny - brak assetow, wiec bez dzwieku, wizualny alarm),
  slajd `recap` osadza ekran powtorki.
- `/kalendarz` - widok tygodnia: lekcje z `plannedDate`, plus prosta kolejka "co dalej" per klasa,
  przycisk "pomiń" / "zrobione".
- `/statystyki` - per klasa, per miesiac: tabela uczen x (+, -, pas, podpowiedzi), eksport CSV.
- `/ustawienia` - Settings + eksport/import calej bazy do JSON.

## Seed
Przy pierwszym uruchomieniu (pusty store) zaladowac klase "IV A" z 20 uczniami (plik
`src/data/seed.ts`) oraz puste klasy "IV B", "IV C", "V A" (nazwy do zmiany przez usera).

## Jakosc
- Kazdy modul dziala end-to-end, bez atrap. `npm run build` i `npm run typecheck` przechodza.
- Ekrany projektora: duze czcionki (min 32px na tresci), wysoki kontrast, ciemne tlo.
- Ekrany administracyjne: zwykla gestosc, jasne tlo.
- Komponenty <= 250 linii; logika (losowanie, limity pasow, agregacja statystyk) w czystych
  funkcjach w `src/lib/*.ts` z testami (vitest).
