---
kind: handoff
date: 2026-09-30
topic: klasa5-dzial2-filmy
status: in-progress
---

# Klasa 5, dział 2 - filmy do lekcji 17-21 gotowe, 22-29 czekają na kredyty ElevenLabs

## Summary
Lista lekcji dostała zakładki Powtórzeniowe | Dział 1 | Dział 2 z zapamiętaniem (localStorage per rocznik), guzik „Plan lekcji” usunięty. Potem po kolei filmy do działu 2: 17 przenośnia, 18 frazeologizmy, 19 zdrobnienia, 20 złość („Lwy”), 21 recytacja - wyrenderowane, w buckecie `filmiki`, wpięte w lekcje. Skończyły się kredyty ElevenLabs.

## Key takeaways / decisions
- **Film do KAŻDEJ lekcji działu 2** (także tekstowych 17 i 20) - Bartek potwierdził 2026-09-29.
- **Styl filmu:** 7-9 min, wiele przykładów, 4 zadania do zeszytu z paskiem i od razu sprawdzeniem „dlaczego”, scena „Zapamiętaj!” na końcu. Bartek: „ten styl co jest jest spoko”, filmy mają być dłuższe, nie 20 s.
- **Koło po filmie** = nowe, podobne pytania (pole `questions` lekcji), `slideRecap(ownSetId)` zaraz po `slideVideo`. `makeSlides: (previousSetId, ownSetId)`.
- Kolejność slajdów: [czytanka/ramka] → film → koło → notatka → zadania z podręcznika jako zapas.
- Lekcja 21: zadania w filmie **na głos** (cała klasa), nie do zeszytu. Nie cytować wierszy z podręcznika (prawa autorskie) - własne przykłady.
- **Koszt:** ok. 0,35 kredytu na znak narracji (z forced alignment). Film 5000 znaków ≈ 1700 kredytów.

## State
- ✅ Zakładki działów (20b99ee). ✅ Filmy 17-21 (f438f74, dc25ed7), mp4 w buckecie i w public/filmiki.
- ⛔ ElevenLabs: 9304/10019 zużyte, reset 2026-10-26. Na film 22 potrzeba ~1500. Bartek musi doładować albo poczekać.
- 🔄 Filmy do zrobienia: 22 rzeczownik (przypadki, własne/pospolite), 23 nietypowa odmiana, 24 ę/ą, 25 temat i końcówka (opcjonalna), 26 sprawozdanie, 27 dwukropek + sprawozdanie, 28 reklama, 29 podsumowanie działu. Te lekcje mają jeszcze `${FILM_POZNIEJ}` w planie.

## Artifacts
- filmiki/{przenosnia,frazeologizmy,zdrobnienia,zlosc,recytacja}/ - narracja, film1.html, timeline, skrypty.
- Nowy film: skopiuj folder, `sed` nazwę w *.py/*.mjs, **zmień PORT w renderuj.mjs** (zajęte: 9333-9336) - profil Chrome i folder klatek biorą nazwę z folderu.
- Narracje pisane skryptem Python w pliku (scratchpad), nie heredoc - polskie znaki.
- Kontrola słów: skrypt sprawdzający `data-slowo` vs `timeline-film1.json` (odtworzyć: dla każdej sceny każde data-slowo musi być w słowach narracji po normalizacji).
- src/data/textbook5dzial2.ts, src/data/filmiki.ts (cudze niezacommitowane linie powtorka-dzial1 - nie commitować), src/lib/lessonMaterial.ts, components/lessons/MaterialTabs.tsx.

## Next step
Po doładowaniu ElevenLabs: film do lekcji 22 „Rzeczownik - przypadki, własne i pospolite” (przeczytać definicję lekcji w textbook5dzial2.ts), ten sam schemat co 17-21, potem 23, 24...

## What NOT to do
- Nie generować audio bez sprawdzenia kredytów (`/v1/user/subscription`) - przerwana generacja zostawia połowę scen.
- Nie puszczać dwóch renderów z tym samym PORT/profilem Chrome („Chrome nie wstal”).
- Nie commitować cudzych linii w filmiki.ts, LessonRow.tsx - stage przez `git hash-object` + `update-index`.
- Gołe litery w narracji (ek, ó) - TTS czyta nazwy liter; końcówki pokazywać na ekranie.
