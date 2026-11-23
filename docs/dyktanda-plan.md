# Dyktanda z pisowni - uczniowie z innym językiem ojczystym

Zadanie domowe co poniedziałek pod `https://szkola.klippi.pl/dyktando`. Dla uczniów, którzy mówią po polsku, ale piszą z błędami: z Ukrainy (podpowiedzi po ukraińsku) i ze świata hiszpańskojęzycznego (podpowiedzi po hiszpańsku). Język ustawia się przy uczniu w apce: **Zadania domowe → Polski dla obcokrajowców**. Uczeń wybiera imię z listy, wpisuje hasło z kartki i robi lekcję na komputerze albo telefonie.

## Jedna lekcja (ok. 20 minut)

1. **Wstęp jak prezentacja** - slajd powitalny z literami lekcji, potem slajd na każdą regułę: litery składają się na ekranie (`s + z → sz = [ш]`), lektorka czyta krótki tekst, dwa przykłady z obrazkiem i nagraniem.
2. **Ćwiczenie z luką** (6 słów) - słucha słowa i wybiera brakujące litery (`?afa` → sz / cz / ch). Bez punktów, to nauka: po złym wyborze słyszy słowo jeszcze raz i dostaje podpowiedź.
3. **Słowa** (8) - słucha i pisze, od razu widzi złą literę i podpowiedź w swoim języku. Po błędzie przepisuje słowo poprawnie.
4. **Dyktando zdań** (5) - całe zdanie, potem powoli po dwa słowa. Poprawki słowo po słowie, wielka litera zaznaczona osobno (nie odbiera punktu), interpunkcji nie liczymy.
5. **Zapamiętaj!** - reguły lekcji w kafelkach (`sz = [ш] szkoła`) i 2-3 zdania do zapamiętania, czytane przez lektorkę.
6. **Test** (5-6 nowych słów i 1-2 zdania) - bez podpowiedzi, poprawki dopiero po całym teście.
7. **Wynik** - osobno ćwiczenia i test, razem w bazie. Lekcję można powtarzać, Bartek widzi wszystkie próby i błędy.

Zasady treści: własne, proste przykłady z życia ucznia (szkoła, dom, jedzenie), bez tekstów z podręcznika. W zdaniach głównie litery z tej i poprzednich lekcji. Każdy tekst ma `ua` i `es`. Gdy polska linijka mówi o cyrylicy albo o ukraińskim, dopisujemy `plEs` - wersję dla hiszpańskojęzycznych (pilnuje test). Tekst lektorki (`lektor`) bez gołych liter i nawiasów - piszemy nazwy liter słowami („es i zet”).

## Seria: od dźwięków do reguł

Uczniowie mówią po polsku, więc pierwsza część jest krótka: tylko te dźwięki, które ich alfabet zapisuje inaczej. Potem reguły ortografii, czyli te same dźwięki pisane różnie - tego nie da się „usłyszeć”, trzeba znać zasadę i słowo do wymiany.

**Etap 1 - dźwięk i litera** (Ukraińcy: cyrylica → łacinka; Hiszpanie: inne znaczenie liter)

| Nr | Od | Temat | Co sprawia kłopot |
|----|----|-------|-------------------|
| 1 | 23.11 | sz, cz, ch | jeden dźwięk - dwie litery; ch to nie [ч] (Hiszpanie: ch = j) |
| 2 | 30.11 | ł, l, w | ł = ў; w = в, a nie v (Hiszpanie: w = v, ł = u z „huevo”) |
| 3 | 7.12 | y, i, j | и = y, і = i, й = j; po cz, sz, rz, ż zawsze y (Hiszpanie: j = y z „yo”, y to samogłoska) |
| 4 | 14.12 | ś, ć, ń, ź i si, ci, ni, zi | kreska przed spółgłoską i na końcu, i przed samogłoską (Hiszpanie: ń = ñ) |
| 5 | 4.01 | ia, ie, iu, io (я, є, ю) | biały, wiem, kiedy |
| 6 | 11.01 | ą, ę | он/ен; ogonek na końcu wyrazu (idę, mają) |
| 7 | 18.01 | dz, dż, dź; c = [ц] | Hiszpanie: c to zawsze „ts” |

**Etap 2 - reguły ortografii** (ten sam dźwięk, różne litery)

Wstęp pokazuje regułę i **wymianę** (`stół → stołu`), w ćwiczeniu z luką uczeń wybiera literę i widzi słowo, które ją uzasadnia.

| Nr | Temat | Reguła |
|----|-------|--------|
| 8 | ó czy u | ó wymienia się na o, e, a; końcówki -ów, -ówka, -ówna |
| 9 | rz czy ż | rz wymienia się na r; ż na g, z, s, h; rz po p, b, t, d, k, g, ch, j, w |
| 10 | ch czy h | h wymienia się na g, z, ż; ch na końcu wyrazu |
| 11 | ą i ę na końcu | idą / idę, z mamą, -ę w 1. osobie |
| 12 | wielka litera | imiona, miasta, kraje, święta; dni tygodnia i miesiące małą |
| 13 | nie z czasownikiem i przymiotnikiem | nie idę (osobno), niebieski / niewysoki (razem) |
| 14 | -i, -ii, -ji | Maria - Marii, lekcja - lekcji, pani |

**Etap 3 - pisanie dłuższego tekstu**

| Nr | Temat |
|----|-------|
| 15 | dyktando z krótkiego tekstu (wiadomość do kolegi) - wszystkie reguły naraz |
| 16 | powtórka z testem całego etapu 2 |

Daty to poniedziałki - ferie i przerwy przesunąć w polu `od`.

**Dopasowanie poziomu.** Po lekcjach 1-2 patrzymy na wyniki w zakładce Zadania domowe. Jeśli większość ma ponad 90%, lekcje 3-7 łączymy po dwie (2 tematy w jednej lekcji) i szybciej dochodzimy do etapu 2. Jeśli ktoś ma poniżej 60%, zostaje dłużej na etapie 1 - lekcję można robić kilka razy.

## Nowa lekcja

1. `src/data/dyktanda/NN-temat.json` (wzór: `01-sz-cz-ch.json`), dopisać import w `src/data/dyktanda.ts`.
2. `python tools/dyktanda-audio.py` - nagrania brakujących słów, zdań i tekstów lektorki (ElevenLabs, ok. 700 znaków na lekcję).
3. `python tools/dyktanda-audio.py --sprawdz` - rozpoznawanie mowy w każdym pliku; wszystko `OK` (słowo zapisane cyrylicą, np. „Пушка”, to też dobrze - STT pomylił tylko alfabet).
4. `npx vitest run src/lib/dyktando.test.ts`, obejrzeć lekcję na `/dyktando` po ukraińsku i po hiszpańsku, commit z mp3.
