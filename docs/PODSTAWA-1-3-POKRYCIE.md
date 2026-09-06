# Powtórka klas 1-3: co z podstawy programowej już jest, a czego brakuje

Dokument roboczy do `src/data/recap13.ts`. Powstał, bo w repo była tylko podstawa
II etapu (`src/data/podstawa.ts`, klasy IV-VIII, kody z listy Vulcana) - podstawy
I etapu nie było nigdzie, więc nie dało się sprawdzić, czy sześć lekcji powtórki
w ogóle domyka materiał klas 1-3.

Źródło: rozporządzenie MEN, załącznik nr 2 (I etap edukacyjny - edukacja
wczesnoszkolna), część "Edukacja polonistyczna", punkty 1-5.
Kody używane niżej: `P.<sekcja>.<punkt>`, np. `P.3.d` = edukacja polonistyczna,
osiągnięcia w zakresie czytania, podpunkt d.

Uwaga: lekcje powtórki odbywają się w klasie 4, więc pole `curriculum` w
`recap13.ts` dalej ma trzymać kody **II** etapu (te trafiają do dziennika).
Kody `P.*` służą tylko do sprawdzenia, czy nic z klas 1-3 nie wypadło.

## Sekcje podstawy I etapu (edukacja polonistyczna)

| Sekcja | Zakres | Podpunkty |
|---|---|---|
| P.1 | słuchanie | a-f |
| P.2 | mówienie | a-g |
| P.3 | czytanie | a-i |
| P.4 | pisanie | a-f |
| P.5 | świadomość językowa | a-f |

## Co pokrywa obecnych sześć lekcji

| Lekcja | Kody I etapu |
|---|---|
| 1. Głoski, litery, sylaby, ortografia | P.5.a, P.4.b (częściowo) |
| 2. Części mowy, zdania, wielka litera | P.5.b, P.5.d, P.4.c, P.4.e (częściowo) |
| 3. Formy wypowiedzi i czytanie | P.3.g, P.3.h, P.4.a (opis, zaproszenie) |
| 4. Alfabet, słownik i rodziny wyrazów | P.4.c (porządek alfabetyczny), P.5.e (częściowo) |
| 5. Zmiękczenia, ą i ę, interpunkcja | P.4.b, P.4.c |
| 6. Czytanie ze zrozumieniem, krótkie formy | P.3.d, P.3.h, P.4.a (notatka, życzenia, podziękowanie) |

Wniosek: sześć lekcji dobrze domyka **kształcenie językowe i ortografię**
(P.5 i P.4.b-c). Cała reszta podstawy jest pokryta wyrywkowo albo wcale.

## Czego brakuje

### Braki duże - warto na nie zrobić osobne lekcje

| Kod | Treść z podstawy | Stan |
|---|---|---|
| P.4.a | układa i zapisuje **opowiadanie z 6-10 wypowiedzeń** | brak - jest tylko plan wydarzeń i porządkowanie zdarzeń |
| P.4.a | **list** (z adresem nadawcy i odbiorcy), **przeproszenie**, **ogłoszenie** | brak slajdów i zadań; ogłoszenie tylko w pytaniach do koła |
| P.3.d | **cechy i ocena bohatera z uzasadnieniem**, **nastrój utworu** | brak - jest sam podział na głównego i drugoplanowego |
| P.3.f | **twórcze przekształcanie tekstu**: dalsze losy bohatera, wymyślanie początku i zakończenia | brak |
| P.5.e | **związki frazeologiczne**, **wyrazy wieloznaczne** | brak (bliskoznaczne i przeciwstawne są w lekcji 4) |
| P.5.c, P.5.f | **przekształcanie zdań** (oznajmujące ↔ pytające, pojedyncze → złożone), **równoważnik zdania**, **wykrzyknienie** | brak |
| P.4.c, P.4.d, P.4.e | **skróty** (w tym matematyczne), **liczebniki zapisane słownie** (np. sześćset), **wielka litera w tytułach utworów i książek** | brak |

### Braki mniejsze - do wplecenia w istniejące lekcje, nie na osobną

| Kod | Treść | Gdzie dopiąć |
|---|---|---|
| P.4.b | **sprawdza i poprawia napisany tekst** | zadanie domykające w lekcji 6 |
| P.2.e | **recytuje wiersze, wygłasza z pamięci krótkie teksty prozatorskie** | lekcja 3 (wiersz i proza) |
| P.2.c | wypowiada się płynnie i wyraziście: **pauzy, intonacja, tempo, siła głosu** | lekcja 3 albo dialog w lekcji 6 |
| P.2.d | **nadaje tytuł obrazkom i fragmentom tekstu** | lekcja 6, przy temacie tekstu |
| P.2.f | **ustne sprawozdanie** z wykonanej pracy | lekcja 6 |
| P.1.c | **słucha tekstów czytanych i wypowiada się na ich temat** | jest tylko w Z1 lekcji 6 - warto powtórzyć w kilku |
| P.3.i | **czyta samodzielnie wybraną książkę** | osobny wątek, nie mieści się w powtórce |

## Plan: lekcje 7-12

Sześć lekcji domyka to, czego brakuje. Kolejność wynika z trudności, a nie z
kolejności w podstawie: najpierw praca z tekstem, potem tworzenie tekstu, na
końcu drobiazgi zapisu.

**7. Bohater: jaki jest i co czuję, gdy o nim czytam** - `P.3.d`, `P.2.d`
Cechy bohatera i ocena z uzasadnieniem ("uważam, że... bo w tekście..."),
nastrój utworu, nadawanie tytułu fragmentowi.
Ilustracje: `bohaterowie` (jest), `swiatPrzedstawiony` (jest), nowa: cechy
bohatera jako lista przymiotników przy postaci.

**8. Opowiadanie od początku do końca** - `P.4.a`, `P.3.f`
Opowiadanie na 6-10 zdań, dalsze losy bohatera, dopisywanie początku albo
zakończenia do ilustracji.
Ilustracje: `opowiadanie` (jest), `kolejnoscZdarzen` (jest).

**9. List, ogłoszenie i przeproszenie** - `P.4.a`
Trzy formy użytkowe, których nie ma nigdzie indziej; adres nadawcy i odbiorcy
na kopercie.
Ilustracje: `list` (jest), `ogloszenie` (jest), nowa: koperta z adresami.

**10. Wyrazy, które znaczą więcej** - `P.5.e`
Związki frazeologiczne (rozumiane przenośnie, nie dosłownie) i wyrazy
wieloznaczne (znaczenie rozstrzyga zdanie).
Ilustracje: `frazeologizm` (jest), `wieloznaczne` (jest).

**11. Zdanie da się przerobić** - `P.5.c`, `P.5.f`
Oznajmujące ↔ pytające, pojedyncze → złożone, równoważnik zdania,
wykrzyknienie.
Ilustracje: `rodzajeZdan` (jest), `zdanieZlozone` (jest), nowa: to samo zdanie
w czterech postaciach.

**12. Piszę czysto i sprawdzam po sobie** - `P.4.b`, `P.4.c`, `P.4.d`, `P.4.e`
Skróty, liczebniki zapisane słownie, wielka litera w tytułach utworów i
książek, na koniec sprawdzanie i poprawianie własnego tekstu.
Ilustracje: `skroty` (jest), `nazwyWlasne` (jest), `zeszyt` (jest).

## Ile z tego to nowa robota

Z jedenastu ilustracji potrzebnych do lekcji 7-12 osiem już istnieje w
`src/components/slides/art` (powstały do powtórki klasy 4 i dają się użyć bez
zmian). Do zrobienia są trzy nowe: cechy bohatera, koperta z adresami,
przekształcenia zdania.

Każda lekcja to, jak dotychczas, około 12 slajdów (reguła z ilustracją +
zadanie z tą samą ilustracją), jedna notatka na trzy punkty i jeden zestaw
pytań do koła.
