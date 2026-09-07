# Apka szkolna

Aplikacja webowa do prowadzenia lekcji polskiego na projektorze: koło fortuny do powtórek,
prezentacje lekcji ze slajdami zadań i stoperem, kalendarz lekcji per klasa, statystyki uczniów.

Działa w przeglądarce (także Chrome 109 na Windows 7). Dane trzymane w localStorage
przeglądarki - do czasu podpięcia Supabase. Eksport/import całej bazy do JSON jest w Ustawieniach.

## Uruchomienie lokalne

```bash
npm install
npm run dev
```

Aplikacja: http://localhost:5173

Testy i build:

```bash
npm run typecheck
npm test
npm run build
```

## Wdrożenie na Vercel

Projekt to statyczny build Vite. W Vercel: Framework = Vite, build `npm run build`, output `dist`.
Framework preset w Vercel: **Vite** (nie Next.js). Plik `vercel.json` przekierowuje wszystkie ścieżki na `index.html` (routing po stronie klienta).

## Chmura (Supabase)

Bez zmiennych środowiskowych aplikacja działa lokalnie (localStorage, bez logowania).
Żeby włączyć synchronizację z Supabase:

1. W panelu Supabase uruchom SQL z `supabase/migrations/0001_init.sql` (SQL Editor).
2. Authentication -> Users -> dodaj użytkownika (e-mail + hasło). Rejestracji w aplikacji nie ma.
3. Skopiuj `.env.example` do `.env.local` i wpisz `VITE_SUPABASE_ANON_KEY`
   (Project Settings -> API -> anon public). W Vercel dodaj obie zmienne w Environment Variables.
4. Po zalogowaniu: jeśli chmura ma dane, wygrywa chmura. Jeśli jest pusta, aplikacja zapyta,
   czy wysłać dane z tej przeglądarki.

Każda zmiana w aplikacji jest wysyłana do chmury z opóźnieniem 400 ms. Status widać na dole
paska bocznego. Offline zmiany czekają i idą po powrocie sieci.

## Moduły

| Trasa | Co robi |
|---|---|
| `/` | Pulpit: dzisiejsze lekcje, kolejka per klasa, szybki start |
| `/klasy`, `/klasy/:id` | Klasy i uczniowie (import listy z tekstu, dezaktywacja zamiast kasowania); w widoku klasy zakładki Uczniowie / Bilans miesiąca / Do rozliczenia |
| `/lekcje` | Lista lekcji per rocznik (postęp per klasa), edytor slajdów, prezentacja, gotowe materiały |
| `/lekcje/:id/pokaz/:classId` | Ekran projektora: slajdy, koło na lekcji przy zadaniach, koło powtórzeniowe ze slajdu `recap` |
| `/pytania/:id` | Zestaw pytań lekcji (import: jedno pytanie na linię, opcjonalnie `pytanie \| odpowiedź`) |
| `/kartkowki` | Kartkówki i klasówki per klasa: pytania z zestawów lekcji + własne, pokaz na projektorze (`/kartkowki/:id/pokaz`) |
| `/plan` | Plan lekcji: siatka pon-pt z klasą i salą, godziny dzwonków; z niego bierze się zegar z odliczaniem do końca lekcji na ekranach projektora i pasek "Dziś" na pulpicie |
| `/podrecznik` | Podręcznik (PDF w IndexedDB) |
| `/panel` | Pływające koło fortuny dla aplikacji desktopowej (`desktop/`) - okno nad multipodręcznikiem |
| `/zebrania` | Zebrania z rodzicami - kafelki i skrypt zebrania |
| `/zasady/druk` | Wydruk zasad na A4 |
| `/ustawienia` | Limit pasów na miesiąc, plomba za podpowiadanie, czas kręcenia, stoper odpowiedzi, eksport/import JSON |

## Aplikacja desktopowa (pływające koło)

Kiedy lekcja idzie w multipodręczniku GWO, a nie w prezentacji apki, koło musi być NAD tamtym oknem.
Robi to mały shell Tauri z katalogu `desktop/`: okno zawsze na wierzchu, zwijane do pigułki, ładujące
trasę `/panel` z produkcji. Szczegóły i uruchomienie: [`desktop/README.md`](desktop/README.md).

## Skróty na ekranie projektora

Powtórka: `Spacja` kręć, `1` dobrze, `2` źle, `3` pas, `N` następne pytanie, `O` pokaż odpowiedź,
`F` pełny ekran, `Esc` zakończ.

Prezentacja: strzałki / `Spacja` / `PageUp` / `PageDown` nawigacja, `Home` / `End`, `F` pełny ekran,
`Esc` wyjście. Klik w lewą / prawą połowę ekranu też przewija slajdy. Na slajdzie zadania `K` otwiera
koło na lekcji - wtedy `Spacja` kręć, `1` plus, `2` kropka, `Backspace` cofnij, `Esc` zamyka koło.

## Zasady powtórki (konfigurowalne w Ustawieniach)

- Dwa koła. **Koło na lekcji**: po każdym zadaniu (Z1, Z2...) koło losuje, kto pokazuje rozwiązanie -
  można tylko zyskać (plus za dobrze zrobione zadanie, kropka za zrobione słabo albo wcale; plomby
  i pasa nie ma). Kręci się ze slajdu zadania w prezentacji. **Koło powtórzeniowe**: początek
  następnej lekcji, pytania z poprzedniego tematu (inne niż zadania), gra się o wszystko:
  plus / kropka / plomba / pas. Uruchamia się ze slajdu `recap` albo przyciskiem "Koło powt." na
  liście lekcji.
- Każdy uczeń ma domyślnie 2 pasy na miesiąc (zerują się 1. dnia miesiąca).
- Podpowiadanie daje plombę podpowiadającemu.
- Wylosowany uczeń wypada z puli do końca rundy (można włączyć powtórki).
- Statystyki liczone per miesiąc z zapisanych zdarzeń; każde zdarzenie można usunąć.

## Struktura

- `src/data` - typy, store (zustand + persist), seed, backup
- `src/lib` - czysta logika z testami (parsery, limity pasów, statystyki, stoper, markdown-lite)
- `src/components` - UI per moduł
- `src/pages` - strony / trasy
- `docs/SPEC.md` - specyfikacja
