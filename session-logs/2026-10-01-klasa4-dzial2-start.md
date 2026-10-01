---
kind: handoff
date: 2026-10-01
topic: klasa4-dzial2-start
status: in-progress
---

# Klasa 4, rozdział II - start: przejrzeć GWO, wybrać teksty, potem lekcje + filmy + zeszyt + sprawdzian

## Summary
Klasa 5 dział 2 jest zamknięty: 13 lekcji z filmami, zeszyt powtórzeniowy PDF (link dla uczniów) i sprawdzian z grupami A-D. Bartek chce to samo dla klasy 4, rozdział II („Między nami 4”, GWO). Najpierw przegląd podręcznika i wybór tematów, dopiero potem budowa.

## Key takeaways / decisions (Bartek, 2026-10-01)
- **Max 2 teksty (czytanki) na dział.** Resztę wycinamy, jeśli to „bzdury” (w rozdziale I np. Międzynarodowy Dzień Kropki). Zostaje język, ortografia, pisanie.
- **Film do KAŻDEJ lekcji**, także tekstowej. Styl jak w kl. 5 dział 2 (zaakceptowany) - pełny przepis w CLAUDE.md, sekcja „Filmik do każdej lekcji”. Dla 4 klasy prościej i wolniej niż dla 5.
- Po dziale: **zeszyt powtórzeniowy PDF + sprawdzian z grupami** - przepis w CLAUDE.md, sekcja „Powtórka i sprawdzian po dziale”. Zeszyt idzie do VULCANA jako nieobowiązkowe zadanie domowe (link `szkola.klippi.pl/materialy/...pdf`), nic nie drukujemy.
- Zadania z podręcznika: tylko sensowne (gramatyka, pisanie, pytania do tekstu), po kolei, jedno zadanie = jeden screen. Bez własnych Z1/Z2 na slajdach (zob. memory zadania-z-podrecznika).

## State
- ✅ Kl. 5 dział 2: commity do b298317 włącznie, wszystko wypchnięte. Sprawdzian i pula celowo poza repo (`output/materialy/`, `materialy/klasa5-dzial2/sprawdzian-pula.mjs` w .gitignore).
- ✅ Kl. 4 rozdział I (tematy 1-16) jest w `src/data/textbook4.ts` (`ROZDZIAL_1`), część z czytankami audio (`czytanki.ts`), filmy: czasownik, wypowiedzenia, powtorka-dzial1.
- 🔄 Kl. 4 rozdział II: nic jeszcze nie ma.
- ⛔ Czeka na Bartka: zaloguje się do GWO w przeglądarce, którą otworzę (osobny profil Chrome, hasła nie wpisujemy).

## Artifacts / skąd brać
- Multipodręcznik GWO kl. 4: id `1a5ce8d8...` (accessId 4323406), ćwiczenia `58c40602...` (accessId 4326859) - pełne dane w memory `podrecznik-klasa4-tematy`. Linki otwierają spis treści (page=3).
- Screeny w kl. 5 robiliśmy renderem SVG z NEON-a (`tmp/dzial2/render.mjs`, `cdp.mjs`, Chrome `--user-data-dir=tmp/chrome-neon --remote-debugging-port=9223`). **Dla GWO trzeba sprawdzić od nowa**, jak multibook serwuje strony (SVG? obrazki? canvas?) - zrobić profil `tmp/chrome-gwo`, port np. 9224, i obejrzeć requesty sieciowe po otwarciu strony.
- Wzór planu działu: `docs/klasa5-dzial2-uwaga-uczucia.md` (mapa stron, podstawa, co bierzemy / co pomijamy i dlaczego).
- Wzór lekcji: `src/data/textbook5dzial2.ts` (Topic z teacherPlan, questions, makeSlides; `zad()`, `ramka()`, `poKolei()`). Kl. 4 ma własny format w `textbook4.ts` - przy rozdziale II zdecydować: nowy plik `textbook4rozdzial2.ts` na wzór kl. 5 (zalecane) i wpięcie w `useReadyMaterials`.
- Wzór filmów: `filmiki/<nazwa>/` (np. `rzeczownik`, `ogonki`); wolny PORT renderu od 9345.

## Next step
Otworzyć Chrome z profilem `tmp/chrome-gwo` na multipodręczniku kl. 4, poprosić Bartka o zalogowanie, przejść spis treści rozdziału II i zrobić mapę stron: tematy, teksty, ramki teorii, zadania. Zaproponować Bartkowi listę lekcji (max 2 teksty, co wycinamy i dlaczego) i **czekać na akceptację** przed budową.

## What NOT to do
- Nie zgadywać treści podręcznika - tylko z przeczytanych stron (wcześniej ChatGPT wpisał 111 tematów z innego wydania, trzeba było kasować).
- Nie wycinać screenów ze zrzutów ekranu Bartka - tylko render z serwisu wydawcy.
- Nie wpisywać hasła do GWO - Bartek loguje się sam.
- Nie commitować cudzych zmian (`git diff` przed `add`, częściowe stage przez hash-object).
