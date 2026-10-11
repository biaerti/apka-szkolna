---
kind: handoff
date: 2026-10-11
topic: klasa4-filmy-poprawa-sprawdzania
status: in-progress
---

# Summary

Filmy działu 2 klasy czwartej zostały skrócone do 4:31-4:59, ograniczone do trzech zadań, ponownie wyrenderowane i wysłane do Supabase. Zostały też rozdzielone pytania z filmu i koła powtórzeniowego oraz dodane tagi „Czytanka” przy odpowiednich lekcjach.

Sposób zachowania polecenia podczas sprawdzania jest jednak do całkowitej wymiany. Obecnie zastosowany wspólny mechanizm ściska zadanie do poziomego pasa u góry i pokazuje odpowiedzi w dolnej części. Bartek odrzucił ten projekt jako nieczytelny i prymitywny. Wersja ta jest obecnie w repozytorium, lokalnych MP4 i w chmurze.

# Key takeaways / decisions

- Docelowo nie dzielić ekranu na poziome połowy.
- Podział pionowy był tylko przykładem awaryjnym, a nie docelowym rozwiązaniem.
- Zadanie ma pozostać pełnoekranową, czytelną sceną.
- Po komunikacie „SPRAWDZAMY” nie należy otwierać nowego ekranu ani osobnego panelu odpowiedzi.
- Odpowiedzi trzeba animować bezpośrednio w istniejącym układzie zadania, przy właściwych przykładach.
- Można zmienić plakietkę „ZADANIE” na „SPRAWDZAMY”, ale układ i treść polecenia mają pozostać na miejscu.
- W dopasowaniach należy wpisywać litery przy istniejących wierszach albo rysować połączenia w istniejącym układzie dwóch kolumn.
- W zadaniach otwartych odpowiedź wzorcową należy odsłaniać w odpowiednim wierszu lub bezpośrednio pod nim.
- W dłuższych tekstach należy podświetlać, przekreślać lub poprawiać elementy w tym samym bloku tekstu.
- Odpowiedzi mogą pojawiać się kolejno, ale nie mogą zastępować polecenia i przykładów.
- Zachować zaakceptowane zmiany: długość 4-5 minut, trzy zadania, usunięcie zadania o zwracaniu się do kolegi i pani dyrektor, brak natychmiastowego koła po filmie oraz tagi „Czytanka”.

# State

- Commit wdrożenia: `3b1ad0e` (`Skróć filmy działu 2 klasy czwartej`), wypchnięty na `main`.
- Testy po wdrożeniu: 508/508 zaliczone.
- Typecheck po wdrożeniu: zaliczony.
- Skrypt skracający: `tools/skroc-filmy-klasa4.py`.
- Źródła 12 filmów: `filmiki/*/player.js`.
- W każdym z 12 plików `player.js` znajduje się odrzucony ogólny mechanizm `zachowajZadaniePrzyOdpowiedzi`, który klonuje i skaluje scenę zadania nad sceną odpowiedzi.
- Lokalne i publiczne pliki MP4 w `output/filmiki/` oraz `public/filmiki/` zawierają obecnie odrzucony układ.
- Te same odrzucone MP4 zostały wysłane do Supabase i trzeba je zastąpić po poprawnym renderze.
- W drzewie roboczym są cudze, niezwiązane zmiany. Nie wolno ich przypadkowo dodać do commita ani nadpisać.

Materiały pokazujące błąd:

- `C:/Users/barto/AppData/Local/Temp/codex-clipboard-d8568537-7f67-426e-b928-53155a8e66bf.png`
- `C:/Users/barto/AppData/Local/Temp/codex-clipboard-15430872-52c1-4bd7-a444-847a0902352c.png`
- `C:/Users/barto/AppData/Local/Temp/codex-clipboard-06262fed-ffbf-4f3c-b3c6-8acd47649e00.png`

# Next step

Usunąć `zachowajZadaniePrzyOdpowiedzi` ze wszystkich 12 plików `player.js`, a następnie przebudować pierwszą parę zadanie-sprawdzanie jako wzorzec: odpowiedź ma pojawiać się animacją bezpośrednio przy istniejących elementach pełnoekranowego zadania. Przed przeniesieniem wzorca na pozostałe sceny wyrenderować i obejrzeć klatki z początku, środka i końca sprawdzania.

# Remaining work

1. Zidentyfikować wszystkie 36 par zadanie-odpowiedź w 12 filmach.
2. Dla każdej pary połączyć logikę sprawdzania z pełnoekranowym układem zadania zamiast doklejać osobny widok.
3. Przygotować zrzuty kontrolne początku, środka i końca każdej sceny sprawdzania oraz arkusze kontaktowe do oceny czytelności.
4. Sprawdzić treść i poprawność każdej odpowiedzi.
5. Ponownie wyrenderować 12 filmów, zachowując docelowe 4-5 minut.
6. Zastąpić MP4 w `public/filmiki/`, wysłać poprawione pliki do Supabase i zweryfikować odtwarzanie.
7. Uruchomić `npm test` oraz `npm run typecheck`, a potem commitować wyłącznie własne zmiany i wypchnąć je na `main`.

# What NOT to do

- Nie zachowywać obecnego poziomego podziału ekranu.
- Nie wdrażać automatycznie podziału pionowego jako rozwiązania dla wszystkich scen.
- Nie skalować całego zadania do małego pasa lub kafelka.
- Nie pokazywać odpowiedzi na nowym, pustym ekranie.
- Nie wracać do filmów długości 7-10 minut ani do usuniętych zadań.
- Nie przywracać identycznych pytań bezpośrednio po filmie i na początku następnej lekcji.
- Nie cofać tagów „Czytanka”.
- Nie commitować istniejących, niezwiązanych zmian z brudnego drzewa roboczego.
