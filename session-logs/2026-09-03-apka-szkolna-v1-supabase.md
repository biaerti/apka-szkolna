---
kind: handoff
date: 2026-09-03
topic: apka-szkolna-v1-supabase
status: in-progress
---

# Apka szkolna: pierwsza wersja (koło fortuny, lekcje, kalendarz), Supabase, lekcja zapoznawcza, powtórka 1-3

## Summary
Zbudowana od zera aplikacja webowa dla Bartka (nauczyciel polskiego, SP 97 Wrocław, wychowawca IV A) do prowadzenia lekcji na projektorze. Stack: Vite + React 18 + TS + Tailwind v3 + zustand (persist) + react-router, warstwa synchronizacji z Supabase i logowanie. Kod pisał Sonnet w równoległych zleceniach, Fable robił przegląd i poprawki. Repo wypchnięte na GitHub (biaerti/apka-szkolna, gałąź `main`). Bartek podpina domenę `szkola.klippi.pl` i Vercel.

## Key takeaways / decisions
- **Chrome 109 / Windows 7 w szkole** - dlatego Tailwind v3, target es2020, zakaz `:has()`, `color-mix`, `dvh` itd. Bartek mówi teraz, że będzie przynosił własny komputer, ale ograniczenie zostaje (bezpieczne).
- **Jeden store zustand jako jedyne źródło dla komponentów**; Supabase podpięte przez silnik diffów w `src/data/remote/sync.ts` (snapshot per kolekcja, upsert/delete w kolejności FK, retry). Chmura wygrywa przy logowaniu; pusta chmura = pytanie o wysłanie danych lokalnych.
- **Logowanie e-mail+hasło, RLS tylko authenticated**, bo baza ma dane dzieci. Rejestracji w aplikacji nie ma, konto zakłada się w panelu Supabase.
- **Klucz sesji w AuthGate to `user.id`, nie access_token** (token odświeża się co godzinę i nadpisywałby niewysłane zmiany w trakcie lekcji).
- **Kasowanie kaskadowe w store** (klasa -> uczniowie/lekcje/eventy, uczeń -> eventy, zestaw -> lessons.questionSetId), inaczej sync łamie FK.
- **Powtórka na projektorze**: dwie kolumny (koło + pytanie), tekst radialny na sektorach, wynik losowany przed animacją; kąt docelowy liczony od pełnego obrotu (był błąd trafiania w zły sektor od 2. losowania).
- **Tryby koła**: wybór ucznia koło / po kolei wg numeru; pytania po kolei / losowo; oceniaj tak/nie. Parametry z query string `?pick=&random=&grading=`; heurystyka: zestaw z topic `Lekcja zapoznawcza` domyślnie sequential/random/bez ocen.
- **Zakładka Pytania scalona z Lekcjami** (per klasa: lekcje + zestawy + "Gotowe materiały"). Trasy `/pytania*` zostały, tylko bez linku w nav.
- **Pola pod dziennik Vulcan** w lekcji: `registerTopic`, `curriculum` (kody z `src/data/podstawa.ts`); na liście lekcji linia "Dziennik: ..." z przyciskiem Kopiuj.
- **`git push` i `git branch -M` blokuje klasyfikator auto mode** - Bartek pushuje sam (twierdzi, że mogę; próbować, ale mieć fallback = komenda dla niego).
- Bartek chce, żeby **Sonnet pisał, Fable zarządzał i sprawdzał** ("żeby AI slopu nie było"). Sprawdzać zawsze polskie znaki w UI i merytorykę treści lekcji.

## State
- ✅ done: klasy/uczniowie (import z tekstu, aktywny/nieaktywny), zestawy pytań, powtórka z kołem i statystyki per miesiąc (2 pasy/tydzień, minus za podpowiadanie), lekcje z edytorem slajdów (tytuł/tekst/zadanie ze stoperem/powtórka/obraz) i prezentacją, kalendarz tygodniowy, pulpit, ustawienia z eksportem JSON, Supabase sync + login, lekcja zapoznawcza (20 pytań), powtórka 1-3 (3 prezentacje po 14 slajdów z 4-5 zadaniami), README, vercel.json, `.mcp.json` z Supabase.
- ✅ Supabase: migracja 0001 uruchomiona przez Bartka (tabele odpowiadają), `.env.local` z URL + anon key (gitignored).
- 🔄 in progress: Bartek musi jeszcze uruchomić `supabase/migrations/0002_lesson_register.sql` (kolumny register_topic, curriculum) i założyć użytkownika w Authentication. Sync na żywej bazie NIE był testowany (tylko testy jednostkowe diffu/mapperów).
- ⛔ MCP Supabase wymaga uwierzytelnienia przez `claude /mcp` w zwykłym terminalu (nie w tej sesji).
- ⚠️ Bartek wkleił kiedyś service_role i secret key do `.env.example` (przywrócone, nie trafiło do gita) - zalecono rotację kluczy.
- ⚠️ Trzy komponenty przekraczają limit 250 linii ze SPEC: `RecapSession.tsx` (382), `useRecapSession.ts` (307), `Lessons.tsx` (328). Do pocięcia przy okazji.

## Artifacts
- `docs/SPEC.md` - specyfikacja (źródło prawdy), `README.md`
- `src/data/{types,store,seed,backup,supabase,auth,intro,recap13,podstawa}.ts`, `src/data/remote/{sync,diff,mappers}.ts`
- `src/components/recap/**` (Wheel, RecapSession, useRecapSession, SequentialPicker...), `src/components/lessons/**`, `src/components/slides/**`, `src/components/calendar/**`
- `src/pages/*` - trasy; ekrany projektora (`/powtorka/:classId/:setId`, `/lekcje/:id/pokaz`) poza AppShell
- `supabase/migrations/0001_init.sql`, `0002_lesson_register.sql`
- `.claude/launch.json`: `apka-szkolna-dev` (5173, z env = ekran logowania) i `apka-szkolna-test` (5174, `--mode test`, `.env.test` z pustymi zmiennymi = tryb lokalny bez logowania; `.env.test` jest gitignored, może zniknąć - odtworzyć dwiema pustymi liniami `VITE_SUPABASE_URL=` i `VITE_SUPABASE_ANON_KEY=`)
- Testy: 103 (vitest), `npm run typecheck && npm test && npm run build` przechodzą na commicie 7e3e8c3.
- Pamięć: `~/.claude/projects/D--VS-Projekty-apka-szkolna/memory/` (kontekst + git/Supabase).

## Next step
Zaimplementować nowe zasady koła fortuny, które Bartek podał na koniec sesji (dosłownie):
1. **Zmiana nazewnictwa**: "minus" -> np. **"plomba"** (bez negatywnych skojarzeń) w całym UI i treściach (intro.ts slajd "Zasady", ScoreButtons, statystyki, sidebar). Przemyśleć nazwę dla plusa (może zostać "plus").
2. **Przeszkadzanie**: uczeń, który przeszkadza, dostaje flagę na sesję/okres: (a) na kole pojawia się **2 razy** (podwójny sektor), (b) **traci możliwość zdobywania plusów** za dobre odpowiedzi. Potrzebny nowy typ zdarzenia (np. `disturb`) + przycisk w sidebarze/ekranie koła + logika w `useRecapSession`/`Wheel` (pula z duplikatem).
3. **3 plomby = 3 zadania naprawcze** powiązane z pytaniami, na które uczeń nie odpowiedział (zapisujemy `questionId` w eventach, więc da się wylistować). Uczeń przynosi rozwiązania na następną lekcję -> **zerowanie plomb** (akcja "rozliczono"); nie przyniósł -> jedynka (adnotacja/ocena w statystykach). Potrzebny widok "do rozliczenia" per klasa (lista uczniów z >=3 plombami, ich pytania, przyciski: wydrukuj/kopiuj zadania, rozliczone, jedynka).
4. **Slajd "Notatka do zeszytu"** po kole: nowy rodzaj slajdu lub konwencja - slajd `text` z tytułem "Notatka z lekcji" na końcu każdej lekcji (dodać do recap13 i intro; w edytorze przycisk "Dodaj notatkę"). Bartek: "zapisujecie notatkę i jesteście wolni".
5. **Przed każdym kołem pytanie "kto nie czuje się gotowy?"** - slajd/overlay przed startem koła (np. w RecapSession ekran startowy "Czy jesteśmy gotowi do koła?" z przyciskiem Start), koło 2-3 razy w trakcie tematu: omówienie -> zadania -> koło.
6. **Praca z tekstem**: slajd `task` ma pokazywać stronę i czas na przeczytanie (już jest `page` + `timerSec`; upewnić się, że edytor podpowiada "czas na przeczytanie").
7. **Wydruk zasad na 1 stronę A4 po polsku** (trasa np. `/zasady/druk`, CSS `@media print`): wstęp "Pamiętacie koło fortuny? Kto zna koło fortuny?", jak działa (po każdym zagadnieniu, 2-3 razy w temacie), na początku może stresować, ale będzie OK; przed kołem pytanie o gotowość; 2 pasy na tydzień; plomba za podpowiadanie; przeszkadzanie = 2 razy na kole + bez plusów; 3 plomby = 3 zadania na następną lekcję, brak = jedynka; notatka do zeszytu na koniec i wolne; **zasada ławek: nie siedzimy w ostatnich ławkach, wszyscy w najbliższych, żeby nie krzyczeć (bodźce)**.
8. Zasady z pkt 7 wpisać też do slajdu "Zasady na naszych lekcjach" w `intro.ts`.

Zacząć od: przeczytać `src/data/types.ts`, `src/components/recap/useRecapSession.ts`, `src/lib/recap.ts`, potem zlecić Sonnetowi punkty 1-3 (dane + koło) i 7-8 (wydruk + intro) równolegle, 4-6 osobno. Po zmianie `RecapResult` dodać migrację SQL (check constraint na `recap_events.result`).

## Maybe list (Bartek sygnalizuje, nie robić teraz)
- **Bot Playwright do dziennika Vulcan**: logowanie https://cufs.vulcan.net.pl/wroclaw/Account/LogOn?... (CUFS/WS-Federation), dziennik https://dziennik-dziennik.vulcan.net.pl/wroclaw/003013/App.mvc (ExtJS). Przepływ: zakładka Lekcja -> "Utwórz lekcję" (typ Lekcja, grupa oddział 4A, przedmiot Język polski) -> "Dalej" -> "Dodawanie tematu lekcji": Rozkład materiału, Podstawa programowa (Język polski - klasy IV-VI), Elementy podstawy programowej (kody jak w `podstawa.ts`), Temat -> Zapisz; potem Frekwencja. Ma działać lokalnie na komputerze Bartka. Dane wejściowe: `registerTopic` + `curriculum` z lekcji.
- Obrazki do slajdów (Bartek wygeneruje w GPT; preferować linki, nie data URL).
- Import podręcznika GWO (PDF -> zadania na slajdy), gdy Bartek dostanie dostęp.
- Pocięcie 3 dużych komponentów.

## What NOT to do
- Nie używać nowego CSS niedostępnego w Chrome 109 (SPEC).
- Nie wkładać service_role ani secret key do plików śledzonych przez git ani do `VITE_*`.
- Nie wysyłać z Sonneta całej aplikacji jednym zleceniem; dzielić po plikach z rozłącznymi zakresami (równoległe agenty wcześniej kolidowały tylko w przeglądarce, nie w plikach).
- Nie testować w przeglądarce na 5173 z `.env.local` bez konta - używać `apka-szkolna-test` na 5174 (tryb lokalny).
- Nie kluczować sesji po access_token; nie liczyć kąta koła od bieżącego obrotu.
