# Dyktanda z pisowni - uczniowie z Ukrainy

Zadanie domowe co poniedziałek pod `https://szkola.klippi.pl/dyktando`. Dla uczniów z Ukrainy, którzy mówią po polsku, ale piszą z błędami. Uczeń wybiera imię z listy, wpisuje hasło z kartki i robi lekcję na komputerze albo telefonie.

## Jedna lekcja (10-15 minut)

1. **Wstęp** - 2-3 polskie litery i ich ukraiński dźwięk (`sz = ш`), po 2 przykłady z nagraniem.
2. **Słowa** (ok. 10) - słucha, pisze, od razu widzi, która litera jest zła i dlaczego (`sz = ш, dwie litery: s + z`). Po błędzie przepisuje słowo poprawnie, dopiero wtedy idzie dalej. Punkt liczy się z pierwszej próby.
3. **Dyktando** (5-6 krótkich zdań) - całe zdanie, potem powoli po dwa słowa. Poprawki słowo po słowie, wielka litera zaznaczona osobno (nie odbiera punktu), interpunkcji nie liczymy.
4. **Wynik** - punkty, słowa do powtórki, zapis w bazie. Lekcję można powtarzać, Bartek widzi wszystkie próby i błędy (Lekcje → Polski od zera → Dyktanda).

Zasady treści: własne, proste przykłady z życia ucznia (szkoła, dom, jedzenie), bez tekstów z podręcznika. Najwyżej 12 słów i 6 zdań. W zdaniach głównie litery z tej i poprzednich lekcji. Każde słowo i zdanie ma tłumaczenie na ukraiński (pomaga zrozumieć, nie zdradza pisowni).

## Seria

| Nr | Od | Temat | Co sprawia kłopot |
|----|----|-------|-------------------|
| 1 | 23.11 | sz, cz, ch | ш, ч, х jako dwie litery; ch to nie [ч] |
| 2 | 30.11 | ł i l, w | ł = ў, w = в (nie v) |
| 3 | 7.12 | y i i | и = y, і = i; po cz, sz, rz, ż zawsze y |
| 4 | 14.12 | ś, ć, ń, ź i si, ci, ni, zi | kreska przed spółgłoską, i przed samogłoską |
| 5 | 4.01 | ia, ie, iu (я, є, ю) | biały, wiem, kiedy |
| 6 | 11.01 | ą i ę | он/ен, ogonki na końcu wyrazu (idę, mają) |
| 7 | 18.01 | rz i ż | ж pisane dwojako; rz wymienne na r |
| 8 | 25.01 | ó i u | ó wymienne na o, e, a |
| 9 | 1.02 | ch i h | х pisane dwojako; h wymienne na g |
| 10 | 8.02 | wielka litera i powtórka | imiona, miasta, początek zdania |

Daty to poniedziałki - ferie i przerwy przesunąć w polu `od`.

## Nowa lekcja

1. `src/data/dyktanda/NN-temat.json` (wzór: `01-sz-cz-ch.json`), dopisać import w `src/data/dyktanda.ts`.
2. `python tools/dyktanda-audio.py` - nagrania brakujących słów i zdań (ElevenLabs, ok. 600 znaków na lekcję).
3. `python tools/dyktanda-audio.py --sprawdz` - rozpoznawanie mowy w każdym pliku; wszystko musi być `OK`.
4. `npx vitest run src/lib/dyktando.test.ts`, obejrzeć lekcję na `/dyktando`, commit z mp3.
