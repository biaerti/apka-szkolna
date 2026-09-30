# Apka szkolna - instrukcja dla Claude

Apka nauczyciela polskiego (Bartek, SP 97): lekcje jako prezentacje na projektor, koło fortuny, sala, uwagi, VULCAN. React + Vite + Supabase, deploy na Vercel z `main`.

## Git
- Commituj i pushuj na `main` bez pytania.
- W drzewie często leżą **niezacommitowane zmiany innych sesji**. Przed `git add` sprawdź `git diff`. Plik z cudzymi hunkami stage'uj częściowo: wersja z HEAD + tylko Twoje zmiany → `git hash-object -w` → `git update-index --cacheinfo`. Nigdy `git checkout`/`git restore` na cudzym pliku.
- Testy: `npx vitest run`. Typy: `npx tsc --noEmit -p tsconfig.json` (błędy TS6307/TS6310 z tsconfig.node to stary szum, ignoruj).

## Lekcje z podręcznika (dział po dziale)
- Dane: `src/data/textbook4.ts` (kl. 4, GWO „Między nami”), `src/data/textbook5.ts` + `textbook5dzial2.ts` (kl. 5, Nowa Era „NEON”), wspólne klocki w `textbook5slides.ts`.
- Każdy dział ma swoje `dzial: 'Dział N - nazwa'`. Na liście lekcji to osobna zakładka (Powtórzeniowe | Dział 1 | Dział 2...).
- Zasady Bartka: podręcznik to pomoc, nie rama. Max 2 lekcje z czytanym tekstem na dział, reszta to język i pisanie. Zadania z podręcznika tylko sensowne, **po kolei** (strona, numer), jedno zadanie = jeden screen = jeden slajd. Screeny tylko renderem z NEON-a/multibooka, nigdy wycinki ze zrzutów ekranu. Bez własnych zadań Z1/Z2 na slajdach.
- Nowy dział: najpierw mapa stron i plan w `docs/klasaN-dzialM-*.md`, potem lekcje.

## Filmik do każdej lekcji
Wzór: `filmiki/przenosnia/`, `frazeologizmy/`, `zdrobnienia/`, `zlosc/`, `recytacja/`. Styl zaakceptowany przez Bartka - nie zmieniaj go.

**Treść (najważniejsze):**
- 7-9 minut, a nie 20 sekund. Każde pojęcie tłumaczone na **wielu różnych przykładach**, dużo powtórek.
- Schemat: intro → część wyjaśniająca → ZADANIE (pauza 20-25 s, pasek odliczania, zapis w zeszycie) → SPRAWDZAMY z wyjaśnieniem **dlaczego** → kolejna część... → scena **„Zapamiętaj!”**, która prostymi słowami powtarza całość.
- Zwykle 4 zadania. Na lekcjach praktycznych (np. recytacja) zadania są na głos, dla całej klasy.
- Zadania w filmie nie mogą dublować zadań z podręcznika. Nie cytuj tekstów z podręcznika (prawa autorskie), używaj własnych przykładów.
- W narracji nie ma gołych liter („ek”, „ó”), bo TTS czyta je jako nazwy liter. Końcówki i litery pokazuj na ekranie.

**Pipeline nowego filmu:**
1. Skopiuj folder wzoru i zamień jego nazwę w `*.py`/`*.mjs`. W `renderuj.mjs` ustaw **nowy PORT** (zajęte 9333-9336). Profil Chrome i folder klatek biorą nazwę z folderu, dzięki temu rendery idą równolegle.
2. Narrację pisz skryptem Python do pliku (`narracja/film1/NN-nazwa.txt`, pauza na zadanie jako sufiks `+20`). **Nie przez heredoc w bashu**, bo psuje polskie znaki.
3. Przed generacją sprawdź kredyty ElevenLabs (`GET /v1/user/subscription`). Koszt to ok. 0,35 kredytu na znak razem z alignmentem, film 5000 znaków ≈ 1700 kredytów.
4. `python filmiki/X/generuj-audio.py film1` (audio + timeline + forced alignment).
5. `film1.html`: sceny `<section data-id="...">`, animacje wiązane ze słowem narracji przez `data-slowo`. Sprawdź, czy każde `data-slowo` występuje w słowach sceny w `timeline-film1.json`.
6. `node filmiki/X/podejrzyj.mjs film1 <czasy końców scen>` → obejrzyj zrzuty (ucięte i zawinięte napisy) → popraw.
7. `node filmiki/X/renderuj.mjs film1` → `output/filmiki/X-film1.mp4` → `python filmiki/wyslij.py X-film1.mp4` → kopia do `public/filmiki/` (dev).
8. Wpis w `src/data/filmiki.ts`, a w lekcji: `slideVideo('X-film1')` i zaraz po nim `...(ownSetId ? [{ ...slideRecap(ownSetId), questionCount: 5 }] : [])` z `makeSlides: (previousSetId, ownSetId)`.
9. `questions` lekcji = **nowe, podobne** zadania do koła po filmie, inne niż w filmie. Kolejność slajdów: [czytanka/ramka] → film → koło → notatka → zadania z podręcznika jako zapas.
10. Audio, mp4 i klatki nie idą do repo (gitignore). Commituj html, narrację, timeline i skrypty.

## Handoff
Stan bieżącej pracy jest w `session-logs/` (`/handoff`, `/pickup`).
