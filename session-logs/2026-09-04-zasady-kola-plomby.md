---
kind: handoff
date: 2026-09-04
topic: zasady-kola-plomby
status: in-progress
---

# Nowe zasady koła fortuny (plomby, uwagi, rozliczenia miesięczne), przebudowa nawigacji, ilustracje SVG

## Summary
Przebudowa zasad gry po tym, jak Bartek przetestował v1 na żywo i zgłosił listę ~17 uwag. "Minus" zniknął z UI na rzecz **plomby**, doszła **kropka** (odpowiedź częściowa), pojawiła się **eskalacja za przeszkadzanie** (ostrzeżenie / bez plusów / podwójne wejście do koła) i **rozliczanie pełnymi miesiącami**. Nawigacja spłaszczona z dziewięciu zakładek do sześciu. Slajdy dostały ilustracje SVG rysowane w kodzie. Wszystko wypchnięte na `main` jako `c4737ba`; `npm run typecheck`, 159 testów i `npm run build` przechodzą.

## Key takeaways / decisions
- **Słownictwo klasowe w kodzie.** `RecapResult` = `plus | kropka | plomba | pass | hint_plomba | uwaga | rozliczenie | jedynka | piatka`. Słowo "minus" ma **nie występować w UI** - Bartek nie chce negatywnych skojarzeń u dzieci. Kod czyta się razem z wydrukiem zasad.
- **Wszystko rozliczamy pełnymi miesiącami kalendarzowymi**: 3 pasy/miesiąc (`passesPerMonth`), uwagi i statystyki zerują się 1. dnia miesiąca. Bartek wprost: "niech się zeruje po miesiącu, pełnymi miesiącami".
- **Licznik uwag liczony z zapisanych `RecapEvent`, nie ze stanu sesji** - przeładowanie strony w środku lekcji nie może kasować konsekwencji. (Pierwsza wersja trzymała go w stanie Reacta; zmienione świadomie.)
- **Eskalacja 1-2-3**: ostrzeżenie -> brak plusów -> podwójne wejście do koła. Każde dodatkowe wejście to realnie jedno losowanie i jedno pytanie więcej dla całej klasy, więc "im więcej przeszkadzania, tym więcej odpytki" działa mechanicznie (`buildPool` z duplikatami, `usedCount` jako Map zamiast Set).
- **3 plusy = piątka, 3 plomby = zadania naprawcze -> dopiero brak = jedynka.** Bartek raz powiedział "3 plomby to jedynka", raz "3 zadania naprawcze"; zaimplementowana wersja łączna, potwierdzona.
- **Ekran gotowości ("kto nie czuje się gotowy") został zbudowany, a potem skasowany na żądanie Bartka.** Nie przywracać. Punkt o gotowości usunięty też z `zasady.ts`.
- **Nawigacja: sześć zakładek** - Pulpit, Klasy, Lekcje, Podręcznik, Zasady, Ustawienia. Bartek: "chcę być milionerem na zakładkach, których nie będę używał". Każda nowa pozycja wymaga uzasadnienia.
  - statystyki i rozliczenia weszły do **widoku klasy** (`/klasy/:id`, zakładki Uczniowie / Bilans miesiąca / Do rozliczenia)
  - kalendarz i osobna Powtórka usunięte; koło odpala się ze **slajdu `recap` w konkretnej lekcji**, a `Zakończ` wraca do `/lekcje`
- **Lekcje zostają per klasa** - Bartek chce trackować, komu co zrobił. Wszystkie czwarte mają te same lekcje i pytania, ale postęp osobno.
- **Grafika rysowana w kodzie (SVG), nie generowana przez API.** Decyzja Bartka - za darmo, offline w szkole, łatwo poprawić. 10 ilustracji w `src/components/slides/art/`, klucz `SlideArt` w `types.ts`.
- **Bartek prosił, żeby commitować i pushować za każdym razem, bez pytania** ("to i tak tylko dla mnie apka jest"). Stara notatka o blokadzie push jest nieaktualna - zaktualizowana w pamięci.
- Model pracy: Sonnet pisze w rozłącznych zakresach plików, Opus projektuje kontrakt (`types.ts`, `lib/recap.ts`) i sprawdza. Sprawdzać zawsze polskie znaki i merytorykę.

## State
- ✅ done: plomby/kropki, eskalacja uwag, rozliczenia miesięczne, panel wyboru pytania, czytelny bilans w pasku bocznym, mocne wyróżnienie wylosowanej osoby (koło rysowane z migawki puli, sektor nie gaśnie po ocenie), tryb "po kolei" sam ustawia następnego, "pokaż/ukryj odpowiedź", nowe slajdy `read` i `note`, 10 ilustracji SVG, przepisana lekcja zapoznawcza ze zdjęciem (`public/bart.jpg`), wydruk zasad (dwie kopie na A4 + strona z rysunkiem koła), zakładka Podręcznik (PDF w IndexedDB), akcja "Odśwież gotowe materiały", prawdziwe komunikaty błędu synchronizacji, migracje 0003 i 0004, migracja store'u v1->v3.
- 🔄 **Migracje SQL NIE są uruchomione.** Bartek musi mieć w bazie `0002_lesson_register.sql`, `0003_zasady_kola.sql`, `0004_pasy_miesieczne.sql`. Wszystkie napisane idempotentnie.
- 🔄 **Sync na żywej bazie nadal nietestowany** - tylko testy jednostkowe diffu i mapperów.
- 🔄 **Slajdy powtórki 1-3 wciąż bez ilustracji.** Istniejący zestaw `SlideArt` opisuje zasady gry (koło, oceny, eskalacja, ławki), nie fonetykę i gramatykę. Do recap13 trzeba osobnego zestawu: alfabet, podział na sylaby, schemat zdania, części mowy.
- ⛔ **Nic nie zostało kliknięte w przeglądarce.** Playwright i Chrome MCP nie łączyły się przez całą sesję. Weryfikacja wyłącznie z typecheck, vitest i build.
- ⚠️ Bartek ma w przeglądarce **stare dane** wstawione poprzednią wersją kodu: tytuły bez polskich znaków ("Powtorka 1-3: Litery, gloski...") i błąd merytoryczny w odpowiedzi ("35 liter" zamiast poprawnych "32 litery" - w kodzie jest dobrze). Naprawia to przycisk **"Odśwież gotowe materiały"** w Lekcjach, nie samo "Wstaw".
- ⚠️ `src/pages/Settings.tsx` ma 253 linie (limit ze SPEC to 250). Marginalnie.

## Artifacts
- `docs/SPEC.md` - zaktualizowany: nowe typy, rozliczanie miesięczne, sekcja "Zasady gry", schemat lekcji, nowe moduły/trasy.
- Kontrakt (pisany ręcznie, nie przez agentów): `src/data/types.ts`, `src/lib/recap.ts`.
- Zasady jako dane: `src/data/zasady.ts` - **jedno źródło prawdy** dla wydruku A4 i slajdów lekcji zapoznawczej. `src/data/intro.ts` sięga do sekcji po tytule (`ruleSection`) - zmiana tytułu sekcji wywali `buildIntroLesson`, a `Lessons.tsx` łapie to w `try/catch`, więc przycisk po prostu **zniknie po cichu**. Pilnuje tego `src/data/intro.test.ts`.
- Moduł powtórki rozbity na hooki: `useRecapSession` (kompozytor), `useAttendance`, `usePool`, `useQuestionOrder`, `useRecapDraw`, `useRecapKeys` + komponenty `RecapToolbar`, `RecapWheelPanel`, `RecapAnswerPanel`, `QuestionPicker`, `StudentPicker`.
- Ilustracje: `src/components/slides/art/` (10 komponentów + rejestr z bezpiecznym fallbackiem na nieznany klucz).
- Wydruk: `src/pages/RulesPrint.tsx` + `src/components/print/WheelDiagram.tsx`.
- Podręcznik: `src/pages/Textbook.tsx` + `src/lib/textbookStore.ts` (IndexedDB).
- Błędy synchronizacji: `src/data/remote/errors.ts` + testy - rozpoznaje `42703`/`PGRST204` i mówi wprost, że trzeba uruchomić migracje.
- Testy: 159 (13 plików).

## Next step
1. **Uruchomić migracje przez MCP Supabase.** Autoryzacja jest już załatwiona (patrz niżej) - po restarcie sesji z katalogu projektu narzędzia będą dostępne. Kolejno: `0002_lesson_register.sql`, `0003_zasady_kola.sql`, `0004_pasy_miesieczne.sql`. Potem sprawdzić na żywej bazie, czy kolumny się zgadzają.
2. **Przetestować sync na żywej bazie** - to nigdy nie było zrobione. Zalogować się, zmienić coś lokalnie, sprawdzić, czy dolatuje; sprawdzić kaskadowe usuwanie i kolejność FK.
3. **Kazać Bartkowi kliknąć "Odśwież gotowe materiały"** dla IV A i zweryfikować, że stare tytuły i "35 liter" znikają, a statusy lekcji i `recapEvents` zostają.
4. **Ilustracje do powtórki 1-3** - osobny zestaw `SlideArt` pod treści przedmiotowe.
5. Przejść aplikację w przeglądarce (5174, `apka-szkolna-test`), bo nic nie zostało obejrzane na oczy.

## Supabase - stan autoryzacji (rozwiązane w tej sesji)
- `.mcp.json` wskazuje `project_ref=wfwvfvdodmmtlwjyuevi` - **zgadza się** z projektem Bartka. Organizacja `gjiulmtqovrkccqoahfl` nie jest tam w ogóle podawana.
- Objaw "unrecognized client id" brał się z **trzech niedokończonych rejestracji OAuth** w `~/.claude/.credentials.json` (każda z `clientId`, żadna z tokenem). Usunięte wraz z wpisem w `mcp-needs-auth-cache.json`; kopie zapasowe z datą leżą obok. Po ponownej autoryzacji jest wpis `supabase|530fcc8d25bc3cc7` z ważnym access i refresh tokenem.
- **CLI `supabase` jest zalogowane na inne konto** - `projects api-keys --project-ref wfwvfvdodmmtlwjyuevi` zwraca `403`, projektu nie ma na liście. Gdyby MCP zawiodło, obejście: `supabase login` na konto z organizacją `gjiulmtqovrkccqoahfl`, potem `supabase link --project-ref wfwvfvdodmmtlwjyuevi`.
- Serwery MCP ładują się **przy starcie sesji i tylko z katalogu projektu** (`.mcp.json` jest projektowy). Uruchomienie `claude` z `C:\Users\barto` nie pokaże Supabase na liście.

## Maybe list (Bartek sygnalizuje, nie robić teraz)
- **Ekstrakcja tekstu z PDF podręcznika** na slajdy `read` - zakładka Podręcznik jest przygotowana (kształt rekordu gotowy na `extractedPages`), ale samej ekstrakcji nie ma.
- Bot Playwright do dziennika Vulcan (szczegóły przepływu w handoffie z 2026-09-03).
- Import podręcznika GWO, gdy Bartek dostanie dostęp.
- Rotacja kluczy Supabase - Bartek kiedyś wkleił service_role do `.env.example` (przywrócone, nie trafiło do gita).

## What NOT to do
- **Nie przywracać ekranu gotowości** - Bartek kazał go wywalić po testach.
- **Nie używać słowa "minus" w UI** ani w treściach dla dzieci. Jest plomba.
- Nie wracać do rozliczania tygodniowego ani do trzymania uwag w stanie sesji.
- Nie dodawać zakładek do menu bez wyraźnej potrzeby.
- Nie używać CSS niedostępnego w Chrome 109 (`:has()`, `color-mix()`, `dvh/svh`, `@container`, nested CSS).
- Nie zmieniać tytułów sekcji w `src/data/zasady.ts` bez poprawienia `intro.ts` - błąd nie wywali aplikacji, tylko po cichu ukryje przycisk "Lekcja zapoznawcza".
- Nie zmieniać tytułów lekcji i nazw zestawów w `recap13.ts` bez sprawdzenia `refreshMaterials.ts` - dopasowuje stare wpisy po znormalizowanej nazwie.
- Nie wysyłać z Sonneta całej aplikacji jednym zleceniem; dzielić po plikach z rozłącznymi zakresami. **Uwaga: w tej sesji cztery agenty padły w połowie na limicie sesji (rate limit)** - po każdym padzie sprawdzać `npm run typecheck`, bo zostawiają niekompilujący się stan. Tak znalazła się regresja: skasowana strona Statystyki, której zawartości nikt nie przeniósł do widoku klasy.
- Nie wkładać service_role ani secret key do plików śledzonych przez git ani do `VITE_*`.
