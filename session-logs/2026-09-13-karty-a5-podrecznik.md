---
kind: handoff
date: 2026-09-13
topic: karty-a5-podrecznik
status: in-progress
---

# Przeprojektowanie treści kart A5 do pierwszych pięciu lekcji z podręcznika

## Summary

Powstał działający mechanizm prezentacji i drukowania dwóch pionowych kart A5 na jednej poziomej A4. Obecna stylistyka, kolory, linia cięcia i przebieg lekcji są zaakceptowane, ale treść kart jest nadal zbyt uboga i wygląda jak mechanicznie przeklejona notatka. Następna sesja ma opracować każdą z pięciu kart od nowa na podstawie rzeczywistej zawartości podręcznika i przygotować osobną, tematyczną ilustrację dla każdej lekcji.

## Key takeaways / decisions

- Zachować obecną stylistykę i mechanikę druku: A4 poziomo, dwie pionowe A5 obok siebie, środkowa linia cięcia, domyślnie 50 kart = 25 arkuszy.
- Nie przepisywać ponownie obecnego `notebookNote`. Najpierw przeanalizować właściwy materiał z podręcznika, a dopiero potem zbudować bogatszą, sensowną dydaktycznie kartę.
- Karta ma być jednocześnie kompletną notatką do późniejszej nauki i lekką kartą pracy. Większość treści jest gotowa, a uczeń uzupełnia tylko 2-4 pojedyncze kluczowe słowa lub jeden krótki element przykładu.
- Każda karta powinna mieć kilka wyraźnych bloków, np. regułę/pojęcie, jak rozpoznać lub zastosować, przykład rozwiązany krok po kroku oraz krótkie pole do uzupełnienia. Nie może zostać jeden mały blok i ogromna pusta przestrzeń, jak na ostatnim screenie użytkownika.
- Stworzyć pięć różnych ilustracji dopasowanych do tematów, zamiast powtarzać generyczną ikonę zeszytu/książki. Użytkownik wprost chce nowe wygenerowane obrazy. W nowej sesji użyć skillu `imagegen`, zapisać zasoby lokalnie w projekcie i połączyć je z konkretnymi lekcjami.
- Pierwszy slajd lekcji już poprawnie prowadzi rozdanie i wklejenie karty A5. Pokazuje trzy cele pojęciowe bez streszczania ani spoilerowania czytanki. Tego kierunku nie zmieniać.
- Blok podręcznikowy oznacza czas na całe: czytanie + rozmowę + zadania, a nie czas samego czytania. Ma ikonę podręcznika i właściwe strony.
- Końcowy slajd wraca do karty A5 i prosi o uzupełnienie luk oraz ustne wyjaśnienie dwóch pojęć. Nie przywracać osobnego slajdu „przepisz notatkę”.
- Obecne przykłady z Minecrafta/Robloxa mogą zostać inspiracją, ale nowe karty mają wynikać przede wszystkim z materiału na stronach podręcznika, nie z przypadkowego współczesnego motywu.
- Cele lekcji na pierwszym slajdzie są dobrym pomysłem, jeśli opisują umiejętności, a nie zdradzają treść czytanki.

## Source material

Zrzuty stron podręcznika przekazane przez użytkownika, wszystkie nadal istniały w chwili tworzenia handoffu:

- `C:\Users\barto\AppData\Local\Temp\codex-clipboard-3fc2a808-40ff-4543-953b-0929681e23c3.png` - strony 12-13, początek „Moje lato z szablozębnym”.
- `C:\Users\barto\AppData\Local\Temp\codex-clipboard-2159b683-27a4-4c59-b7d4-04ffdddf296d.png` - strony 14-15, list, „9 września”, świat przedstawiony.
- `C:\Users\barto\AppData\Local\Temp\codex-clipboard-b0ec921f-5c82-414d-9659-333430c9dc5c.png` - strony 16-17, „Być sobą, czyli kim?”, podmiot liryczny.
- `C:\Users\barto\AppData\Local\Temp\codex-clipboard-460deb4d-f4c4-4ea0-a29b-a3f17b030966.png` - strony 18-19, „Notatka kluczem do sukcesu”.
- `C:\Users\barto\AppData\Local\Temp\codex-clipboard-93e2a02c-0680-45eb-9e33-350d8696dd1e.png` - strony 20-21, mapa myśli, słoneczko i sketchnotka.
- `C:\Users\barto\AppData\Local\Temp\codex-clipboard-2ad632e6-6b34-4410-b675-5d6f6e633e59.png` - strony 22-23, głoski, litery i sylaby.
- `C:\Users\barto\AppData\Local\Temp\codex-clipboard-0531215f-c6c0-4f6c-88b1-1808b08ebb0b.png` - strona 24, sylaby i przenoszenie wyrazów.
- `C:\Users\barto\AppData\Local\Temp\codex-clipboard-d2065058-ec55-46ae-b168-afc0d29337ff.png` - aktualny problem: karta 4.6 ma tylko jeden ubogi blok „Najważniejsze” i bardzo dużo pustej przestrzeni.
- Referencja wcześniejszej, bogatszej stylistyki: `D:\VS-Projekty\apka-szkolna\output\pdf\podsumowania_lekcji_A5.pdf`.
- Dla piątego tematu, strony 25-28, w przekazanym zestawie nie ma czytelnego zrzutu właściwych stron. Najpierw sprawdzić, czy źródło jest dostępne w aplikacji/przeglądarce lub poprosić użytkownika o brakujący screen, zamiast dopowiadać treść.

## State

- ✅ done: układ wydruku A4 poziomo z dwiema A5 i linią cięcia.
- ✅ done: kolorowa stylistyka kart oraz edycja liczby kopii.
- ✅ done: pierwszy slajd „Karta do wklejenia” z trzema celami.
- ✅ done: slajd „Otwieramy podręcznik” z ikoną, stronami i czasem całego bloku.
- ✅ done: po trzy lekkie luki na każdej obecnej karcie oraz końcowy powrót do karty.
- ✅ done: commit `4788d47` został wypchnięty na `main`.
- ✅ done: bazowo przechodziły 373 testy i build produkcyjny.
- 🔄 in progress: merytoryczne przeprojektowanie pięciu kart i nowe osobne ilustracje.
- ⛔ waiting: dla piątej lekcji może brakować źródłowych stron 25-28.

## Relevant implementation

- `src/data/textbook4.ts` - treść pięciu lekcji, prezentacje, `notebookNote`, luki `{{odpowiedź}}`.
- `src/pages/LessonNotesPrint.tsx` - parser bloków notatki, renderowanie luk, motywy kolorystyczne i układ dwóch A5.
- `src/components/slides/TopicSlideView.tsx` - wariant `handout` pierwszego slajdu.
- `src/components/slides/ReadSlideView.tsx` - blok pracy z podręcznikiem.
- `src/components/lessons/TopicSlideForm.tsx` i `slideDefaults.ts` - obsługa wariantu w edytorze.
- `src/data/types.ts` - `variant: 'handout'` i `goals` na slajdzie tematu.
- `src/data/textbook4.test.ts` - testy pięciu lekcji, trzech luk i braku końcowego slajdu do przepisywania.
- `src/data/textbook4Toc.ts` - zapisany spis treści podręcznika, commit `7a78775`.

## Git and workspace warning

Gałąź `main`. Po commicie `4788d47` pojawił się niezależny commit `7a78775` dotyczący spisu treści. W chwili handoffu worktree zawierał niezatwierdzone, niezwiązane zmiany dotyczące obecności, dziennika i integracji Vulcan, m.in. `src/App.tsx`, `src/data/store.ts`, `src/data/types.ts`, migracje `0021/0022`, `Journal.tsx` i `vulcan-extension/`. To praca użytkownika/innej sesji. Nie kasować jej, nie nadpisywać i nie dodawać do commita kart A5. Szczególnie uważać na wspólny plik `src/data/types.ts`.

## Next step

Najpierw otworzyć wszystkie dostępne zrzuty podręcznika narzędziem do podglądu obrazów i przygotować krótki konspekt treści każdej z pięciu kart: 3-4 bloki, konkretne reguły, rozwiązany przykład oraz dokładnie 2-4 sensowne luki. Dopiero po zaakceptowaniu własnego konspektu przerobić `notebookNote`, wygenerować pięć osobnych ilustracji i podpiąć je w `LessonNotesPrint.tsx`. Na końcu odświeżyć lokalne gotowe materiały, obejrzeć wszystkie pięć kart, sprawdzić brak przepełnień, uruchomić pełne testy/build i commitować wyłącznie pliki związane z kartami.

## What NOT to do

- Nie zmieniać zaakceptowanego formatu dwóch A5 na poziomej A4.
- Nie wracać do suchego, jednokolumnowego tekstu ani jednej generycznej ikony dla wszystkich lekcji.
- Nie kopiować bezmyślnie obecnych `notebookNote` ani samych ramek „zapamiętaj” z podręcznika.
- Nie przeładowywać kart ćwiczeniami. To ma być przede wszystkim pełna notatka powtórzeniowa z kilkoma lekkimi uzupełnieniami.
- Nie spoilerować fabuły czytanki na pierwszym slajdzie.
- Nie generować treści piątej karty bez źródła, jeśli strony 25-28 nadal nie będą dostępne.
- Nie commitować niezwiązanych zmian z obecności, dziennika, Supabase ani `vulcan-extension/`.
