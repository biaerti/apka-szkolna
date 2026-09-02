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
| `/klasy` | Klasy i uczniowie (import listy z tekstu, dezaktywacja zamiast kasowania) |
| `/pytania` | Zestawy pytań do powtórek (import: jedno pytanie na linię, opcjonalnie `pytanie \| odpowiedź`) |
| `/powtorka` | Wybór klasy, zestawu i obecnych, potem ekran projektora z kołem fortuny |
| `/lekcje` | Lista lekcji per klasa, edytor slajdów, prezentacja |
| `/kalendarz` | Widok tygodnia, kolejka lekcji, zaległe, pomijanie |
| `/statystyki` | Bilans uczniów per miesiąc, eksport CSV, usuwanie pojedynczych zdarzeń |
| `/ustawienia` | Limit pasów na tydzień, minus za podpowiadanie, czas kręcenia, eksport/import JSON |

## Skróty na ekranie projektora

Powtórka: `Spacja` kręć, `1` dobrze, `2` źle, `3` pas, `N` następne pytanie, `O` pokaż odpowiedź,
`F` pełny ekran, `Esc` zakończ.

Prezentacja: strzałki / `Spacja` / `PageUp` / `PageDown` nawigacja, `Home` / `End`, `F` pełny ekran,
`Esc` wyjście. Klik w lewą / prawą połowę ekranu też przewija slajdy.

## Zasady powtórki (konfigurowalne w Ustawieniach)

- Każdy uczeń ma domyślnie 2 pasy na tydzień (poniedziałek - niedziela).
- Podpowiadanie daje minus podpowiadającemu.
- Wylosowany uczeń wypada z puli do końca rundy (można włączyć powtórki).
- Statystyki liczone per miesiąc z zapisanych zdarzeń; każde zdarzenie można usunąć.

## Struktura

- `src/data` - typy, store (zustand + persist), seed, backup
- `src/lib` - czysta logika z testami (parsery, limity pasów, statystyki, stoper, markdown-lite)
- `src/components` - UI per moduł
- `src/pages` - strony / trasy
- `docs/SPEC.md` - specyfikacja
