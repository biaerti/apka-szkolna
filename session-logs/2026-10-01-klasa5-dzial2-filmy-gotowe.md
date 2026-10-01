---
kind: handoff
date: 2026-10-01
topic: klasa5-dzial2-filmy-gotowe
status: done
---

# Klasa 5, dział 2 - filmy do wszystkich 13 lekcji (17-29) gotowe

## Summary
Dokończone filmy do całego działu 2 „Uwaga, uczucia!”: 22 rzeczownik, 23 nietypowa odmiana, 24 ę/ą, 25 temat i końcówka, 26 sprawozdanie, 27 dwukropek, 28 reklama, 29 podsumowanie (17-21 były z poprzedniej sesji). Każdy wyrenderowany, w buckecie `filmiki`, wpięty w lekcję z kołem po filmie. Stała `FILM_POZNIEJ` usunięta. Workflow opisany w CLAUDE.md projektu, żeby powtórzyć go w kolejnych działach (także kl. 4).

## Key takeaways / decisions
- Bartek: film do **każdej** lekcji, także tekstowej; styl zaakceptowany („ten styl co jest jest spoko”).
- Ortografia w narracji bez gołych liter: „e z ogonkiem”, „a z ogonkiem”, „o z kreską”, końcówki tylko na ekranie.
- Zadania w filmie na własnych przykładach (nie dublują podręcznika, bez cytowania jego tekstów).
- Restart sesji zabija rendery w tle - po każdym gotowym renderze od razu `wyslij.py` + commit.
- ElevenLabs: klucz musi być z planu płatnego (darmowy nie używa głosu Aleksandry z biblioteki). Zużycie ~0,35 kredytu/znak z alignmentem.

## State
- ✅ Lekcje 17-29: film + koło z nowymi pytaniami + notatka + zadania z podręcznika jako zapas.
- ✅ Commity: 20b99ee (zakładki działów), f438f74, dc25ed7, fa23c3c, 288bdb7, + ostatni z lekcją 29.
- Kredyty ElevenLabs po działe: ok. 1300 z 10 000 zostało na tym kluczu.

## Next step
Kolejny dział (kl. 5 dział 3 albo kl. 4 dział 2) - najpierw mapa stron i plan w `docs/`, lekcje w `src/data/`, potem filmy wg CLAUDE.md.

## What NOT to do
- Nie puszczać renderów z tym samym PORT (zajęte 9333-9344).
- Nie commitować cudzych linii w `src/data/filmiki.ts` (powtorka-dzial1 - inna sesja).
