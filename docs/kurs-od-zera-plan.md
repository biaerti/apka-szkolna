# Kurs „Polski od zera” - plan na rok szkolny 2026/2027

Adres dla ucznia: **szkola.klippi.pl/od-zera** (telefon, sama przeglądarka, słuchawki).
Logowanie: ten sam login i hasło z kartki co w portalu `/uczen` (tabela `dyktando_uczniowie`).

Kurs dla dziecka, które prawie nie zna polskiego (kl. 4, rosyjskojęzyczny uczeń z Ukrainy),
robiony **na lekcjach polskiego**, gdy klasa robi swoje. Ten sam kurs w wersji „dom”
dostają chętni uczniowie z kl. 5 (Ukraina): bez zegara, po kolei, kiedy chcą.

Kurs bierze progresję z papierowego zeszytu „Mój polski od zera” (`karty-pracy/polski-od-zera/`,
tematy 1-34), ale rozkłada ją na cały rok i ćwiczy na telefonie z nagraniem każdego słowa.

## Założenia

- **Od dźwięku do pisma.** Każde słowo ma obrazek (emoji) i nagranie. Dziecko najpierw słyszy
  i widzi, potem rozpoznaje, potem czyta, na końcu pisze.
- **Mało tekstu na ekranie.** Polecenie po polsku (krótko, zawsze to samo dla danego typu
  zadania, żeby dziecko nauczyło się poleceń z lekcji) + tłumaczenie w języku ucznia.
- **Język podpowiedzi** na koncie (`od_zera_jezyk`): `ru` (rosyjski, jak w papierowym zeszycie,
  pierwszy uczeń kursu) albo `ua` (ukraiński). Każde słowo i zdanie kursu ma oba tłumaczenia.
- **Wymowa cyrylicą** przy nowych słowach (np. *szkoła [шкоўа]*), liczona automatycznie
  (`src/lib/odzeraWymowa.ts`), w zadaniach już jej nie ma. Konwencja z zeszytu: ł = ў.
- **Powtórki rozłożone w czasie** (pudełka Leitnera jak w study-mate: odstępy 1, 2, 4, 7, 14 dni).
  Stan fiszek jest w bazie, nie w telefonie.
- **Grywalizacja bez kar:** XP za zadania, gwiazdki za lekcję (1-3), seria lekcji/dni, poziom.
  Pomyłka nie zabiera nic, zadanie wraca na koniec etapu.
- **Treści własne.** Żadnych tekstów z podręczników. Słowa i zdania z życia szkoły i domu.

## Dwa tryby (kolumna `od_zera` na koncie)

| | `lekcja` (kl. 4, na lekcji) | `dom` (kl. 5, w domu) |
|---|---|---|
| Kiedy otwiera się lekcja | na początku każdej godziny polskiego klasy wg planu w bazie, licząc od `od_zera_start` | od razu, po kolei (następna po skończeniu poprzedniej) |
| Długość | 45 minut: po ćwiczeniach etap „Do dzwonka” z licznikiem do końca godziny | ok. 15-20 minut, koniec po ćwiczeniach (można dorzucić 5 zadań) |
| Zeszyt | etap „Przepisz do zeszytu” | etap jest, ale można go pominąć |
| Poza godziną polskiego | widać „Następna lekcja: wt 11:25”, wcześniejsze lekcje otwarte do powtórki | - |

Licznik godzin liczy wszystkie godziny polskiego (bez zajęć z wychowawcą). Zastępstwa, wycieczki,
ferie i nieobecności nie psują kursu: otwarta lekcja czeka, dziecko zawsze dostaje **pierwszą
nieskończoną**. Gdyby lekcji było otwartych za mało albo za dużo, Bartek w apce (Zadania domowe →
Polski od zera) klika „+1 lekcja” / „-1 lekcja” (kolumna `od_zera_przesuniecie`) albo zmienia datę startu.

## Jedna lekcja (45 minut, tryb `lekcja`)

| Etap | Czas | Co się dzieje |
|---|---|---|
| 1. Powtórka | 5-8 min | Fiszki z poprzednich lekcji, które przypadają na dziś (najwyżej 15). Zadania sprawdzane automatycznie: posłuchaj i wybierz obrazek, zobacz obrazek i wybierz słowo, napisz. Wynik przesuwa fiszkę w pudełkach. |
| 2. Nowe | 8-10 min | Zasada (jeśli jest: litera, końcówka) z przykładami i nagraniem, potem nowe słowa po jednym: duży obrazek, słowo, wymowa, tłumaczenie, nagranie (samo się odtwarza, można powtórzyć i zwolnić). Po każdych 3 słowach szybkie sprawdzenie. |
| 3. Ćwiczenia | 12-15 min | Ok. 20 zadań z nowych słów i zdań: posłuchaj i wybierz, przeczytaj i wybierz obrazek, dopasuj pary, ułóż słowo z liter, ułóż zdanie z wyrazów, napisz, co słyszysz. Błędne zadanie wraca na koniec. |
| 4. Zeszyt | 5 min | Kilka linijek do przepisania (słowo - tłumaczenie, zdanie). Dziecko przepisuje i klika „Przepisałem”. Bartek widzi to w zeszycie. |
| 5. Do dzwonka | reszta | Niekończąca się seria zadań z tej i wcześniejszych lekcji (najpierw słabe słowa), licznik minut do dzwonka, XP. |

Tryb `dom`: etapy 1-4 (zeszyt do pominięcia), bez etapu 5.

Ostatnia lekcja każdego działu („Sprawdź się”) nie ma nowych słów: powtórka całego działu,
test (20 zadań, wynik w procentach dla Bartka) i zeszyt: „napisz 3 zdania o sobie”.

## Kalendarz

IV A ma 5 godzin polskiego w tygodniu (pn 2, wt 1, śr 1, pt 1). Od 30.11.2026 do końca roku
wychodzi ok. 125 godzin: grudzień 18, styczeń do ferii 9 (ferie na Dolnym Śląsku 18-31.01.2027),
luty-marzec do Wielkanocy 39 (przerwa 25-30.03), kwiecień-czerwiec ok. 59.
Kurs ma **20 działów po 6 lekcji = 120 lekcji** i kilka godzin zapasu.

| Dział | Lekcje | Mniej więcej |
|---|---|---|
| 1-3 | 1-18 | grudzień |
| 4-5 | 19-30 | styczeń, początek lutego |
| 6-9 | 31-54 | luty, marzec |
| 10-13 | 55-78 | kwiecień, maj |
| 14-17 | 79-102 | maj, czerwiec |
| 18-20 | 103-120 | czerwiec (albo jako powtórka wakacyjna w trybie dom) |

Działy 18-20 to gramatyka i pisownia z kl. 4 w prostym ujęciu. Gdy dziecko szybko idzie,
Bartek może je przesunąć wcześniej („+1 lekcja”).

## Działy i lekcje

### Dział 1. Cześć! Litery i dźwięki
1. Cześć! Dzień dobry! - powitania, samogłoski a, e, i, o, u, y
2. Jak masz na imię? Kto to? - ja, ty, to jest; litery inne niż w cyrylicy: c, h, j, w, y
3. Sz, cz, rz, ż - szkoła, czapka, rzeka, żaba
4. Ś, ć, ź, ń i si, ci, zi, ni - śnieg, ciocia, zima, koń
5. Ł, ó, ch, ą, ę - łyżka, góra, chleb, ząb, ręka
6. Sprawdź się: czytam polskie słowa

### Dział 2. W klasie
7. Co jest w plecaku? - zeszyt, książka, długopis, ołówek, gumka, linijka, piórnik
8. W klasie - ławka, krzesło, tablica, okno, drzwi, komputer
9. Polecenia nauczyciela - otwórz, przeczytaj, napisz, posłuchaj, powiedz, pokaż
10. Zwroty ucznia - nie rozumiem, czy mogę wyjść?, proszę powtórzyć
11. To jest... Czy to jest...? Tak / Nie
12. Sprawdź się

### Dział 3. Liczby i kolory
13. Liczby 0-10
14. Liczby 11-20, „Ile?”
15. Kolory
16. Jaki to kolor? czerwony samochód, czerwona czapka
17. Liczby do 100, strona w książce
18. Sprawdź się

### Dział 4. Moja rodzina
19. Rodzina - mama, tata, brat, siostra, babcia, dziadek
20. Mam / nie mam
21. Ile masz lat?
22. Jaki jest? duży, mały, młody, stary, wesoły
23. Czytam krótki tekst o rodzinie i piszę o sobie
24. Sprawdź się

### Dział 5. Szkoła i tydzień
25. Dni tygodnia
26. Przedmioty szkolne
27. Mój plan lekcji: w poniedziałek mam...
28. Ludzie i miejsca w szkole - szatnia, stołówka, biblioteka, sala gimnastyczna
29. Gdzie jest...? Idę do...
30. Sprawdź się

### Dział 6. Jedzenie
31. Owoce i warzywa
32. Śniadanie i obiad
33. Picie; jestem głodny, chce mi się pić
34. Lubię / nie lubię
35. Poproszę... Ile kosztuje?
36. Sprawdź się

### Dział 7. Ciało i zdrowie
37. Głowa i twarz
38. Ciało
39. Boli mnie... (u pielęgniarki)
40. Jak się czujesz?
41. Na WF-ie: biegnij, skacz, stań
42. Sprawdź się

### Dział 8. Dom i mój pokój
43. Pokoje w domu
44. Meble
45. Gdzie? w, na, pod, obok, za
46. Mój pokój - opis
47. Prace domowe
48. Sprawdź się

### Dział 9. Mój dzień (czasowniki)
49. Rano: wstaję, myję się, jem śniadanie
50. Ja, ty, on, ona: robię, robisz, robi
51. My, wy, oni: robimy, robicie, robią
52. Po szkole
53. Rano, po południu, wieczorem
54. Sprawdź się

### Dział 10. Pogoda i kalendarz
55. Pory roku
56. Miesiące
57. Jaka jest pogoda?
58. Data i urodziny
59. Święta w Polsce
60. Sprawdź się

### Dział 11. Ubrania
61. Ubrania
62. Co masz na sobie?
63. Ten, ta, to - rodzaj rzeczownika
64. Jaki? jaka? jakie?
65. Ubieram się na pogodę
66. Sprawdź się

### Dział 12. Zwierzęta
67. Zwierzęta w domu
68. Na wsi
69. W lesie i w zoo
70. Co robi zwierzę?
71. Jeden kot, dwa koty, pięć kotów
72. Sprawdź się

### Dział 13. Moje miasto
73. Miejsca w mieście
74. Jadę autobusem
75. Prosto, w lewo, w prawo
76. Gdzie mieszkasz?
77. Wrocław - czytam krótki tekst
78. Sprawdź się

### Dział 14. Czas wolny
79. Sport
80. Gram w..., gram na...
81. Umiem, lubię + co robić
82. Weekend
83. Pobawimy się? Rozmowa z kolegą
84. Sprawdź się

### Dział 15. Godziny i zakupy
85. Która godzina?
86. O której? wpół do, kwadrans
87. Złoty i grosz
88. W sklepie
89. Lista zakupów
90. Sprawdź się

### Dział 16. Wczoraj (czas przeszły)
91. Byłem, byłam
92. Robiłem, robiłam
93. On robił, ona robiła
94. Co robiłeś w weekend?
95. Czytam tekst w czasie przeszłym
96. Sprawdź się

### Dział 17. Jutro (czas przyszły)
97. Będę + co robić
98. Jutro, pojutrze, za tydzień
99. Plany na wakacje
100. Umawiam się
101. Piszę wiadomość
102. Sprawdź się

### Dział 18. Części mowy (kl. 4)
103. Rzeczownik: kto? co?
104. Czasownik: co robi?
105. Przymiotnik: jaki?
106. Rodzaj i liczba
107. Zdanie: kto? co robi?
108. Sprawdź się

### Dział 19. Przypadki - prosto
109. Nie ma... (kogo? czego?)
110. Daję... (komu? czemu?)
111. Widzę... (kogo? co?)
112. Z kim? z czym?
113. Gdzie? w szkole, na boisku (o kim? o czym?)
114. Sprawdź się

### Dział 20. Czytam i piszę
115. Wielka litera
116. Ó czy u? Rz czy ż?
117. Ch czy h?
118. Opisuję osobę
119. Uczucia
120. Wielki finał: czytam i piszę o sobie

## Typy zadań (silnik: `src/lib/odzera.ts`)

Zadania silnik robi sam z listy słów i zdań lekcji (nie trzeba ich pisać ręcznie):

| Typ | Polecenie | Z czego |
|---|---|---|
| `poznaj` | Posłuchaj i powtórz | nowe słowo: obrazek, słowo, wymowa, tłumaczenie, nagranie |
| `zasada` | Popatrz | zasada z przykładami (litery, końcówki) |
| `sluchaj` | Posłuchaj i wybierz obrazek | nagranie → 4 obrazki |
| `obrazek` | Wybierz słowo | obrazek → 4 słowa (czytanie) |
| `czytaj` | Przeczytaj i wybierz obrazek | słowo bez nagrania → 4 obrazki |
| `tlumacz` | Co to znaczy? | słowo/zdanie → 3 tłumaczenia |
| `pary` | Połącz w pary | 4-5 par słowo ↔ obrazek |
| `litery` | Ułóż słowo | rozsypane litery krótkiego słowa (z nagraniem) |
| `zdanie` | Ułóż zdanie | rozsypane wyrazy zdania (z nagraniem i tłumaczeniem) |
| `napisz` | Napisz, co słyszysz | nagranie → pole tekstowe; bez ogonków = „Prawie” |
| `zeszyt` | Przepisz do zeszytu | linijki do przepisania |

## Treść (`src/data/odzera/dzial-NN.json`)

Każda lekcja: `nr`, `tytul` (pl/ru/ua), 6-10 słów (`pl`, `e` emoji, `ru`, `ua`, opcjonalnie
`wym` - poprawka wymowy), 0-3 zasady, 3-6 zdań, linijki do zeszytu. Zasady pisania treści:
- emoji muszą jednoznacznie pokazywać słowo (bez dwóch słów z tym samym emoji w lekcji),
- w tekście dla lektorki nie ma gołych liter (TTS czyta je jako nazwy liter) - litery pokazuje ekran,
- słowa, które TTS czyta źle (krótkie, przymiotniki na -y), sprawdzamy rozpoznawaniem mowy
  (`python tools/odzera-audio.py --sprawdz`) i podmieniamy,
- pilnuje test `src/lib/odzera.test.ts` (tłumaczenia, emoji, unikalne nagrania, numeracja).

Nagrania: `python tools/odzera-audio.py` (ElevenLabs, głos Aleksandra, turbo v2.5, `pl`),
pliki w `public/audio/odzera/` (własne zdania, idą do repo).

## Stan

- 2026-11-27: silnik, logowanie, panel nauczyciela, migracja 0046, dział 1 z nagraniami.
  Kolejne działy dopisywać po kolei, z wyprzedzeniem ok. 2 tygodni.
