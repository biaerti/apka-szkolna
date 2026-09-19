# Sala: ławki na telefonie, plus/plomba jednym tapem, uwaga prosto do VULCANA

Stan: projekt (2026-09-19). Nic z tego nie jest jeszcze zaimplementowane.

## Problem

Na lekcji Bartek nie pamięta wszystkich imion, a wpisanie uwagi wymaga przerwania
lekcji i podejścia do komputera. Potrzebny jest widok sali na telefonie: ławki z
przypisanymi uczniami, tap w ucznia i od razu plus / kropka / plomba / uwaga.
Uwaga ma sama pojawić się na komputerze jako popup i trafić do VULCANA bez
przepisywania po lekcjach.

## Decyzje projektowe

- To NIE jest osobna aplikacja. Apka już działa od 390 px, ma store, sync i
  logowanie. Widok "Sala" to nowa strona w tej samej apce, otwierana na
  telefonie jako PWA (ikona na ekranie głównym).
- Plus / kropka / plomba to istniejące `RecapEvent` (bez `questionSetId`, jak
  koło na lekcji). Uwaga to istniejące `RecapEvent` z `result: 'uwaga'`.
  Nie dokładamy drugiego systemu punktów.
- Nowa jest tylko jedna encja: miejsce w ławce (`Seat`).
- Popup na komputerze wynika z synchronizacji: komputer widzi nowe zdarzenie
  `uwaga` z chmury, którego sam nie utworzył, i pokazuje je.
- Wpis do VULCANA idzie przez istniejący dodatek Chrome i zawsze zatrzymuje
  się przed zapisem (zasada z PRODUCT.md: człowiek widzi formularz przed zapisem).

## Model danych

Oznaczenie ławki z perspektywy patrzącego na tablicę: kolumna L / S / P
(lewa, środek, prawa) plus numer rzędu od tablicy. Ławka ma dwa miejsca.

```ts
export type SeatColumn = 'L' | 'S' | 'P';

export interface Seat {
  id: ID;
  classId: ID;
  studentId: ID;      // jeden uczeń = jedno miejsce (unikalne w klasie)
  column: SeatColumn; // L / S / P
  row: number;        // 1 = najbliżej tablicy
  side: 1 | 2;        // lewe / prawe miejsce w ławce
}
```

Etykieta: `P1` = prawa kolumna, pierwszy rząd. `side` nie wchodzi do etykiety,
w UI widać dwa nazwiska w jednej ławce. Domyślna siatka 3 kolumny x 5 rzędów =
30 miejsc, liczba rzędów wynika z najdalszego zajętego miejsca (+1 pusty).

Supabase: tabela `seats` (`class_id`, `student_id` unique, `column`, `row`,
`side`, `updated_at`), RLS jak `students`. Migracja `0023_seats.sql`, mapper
w `src/data/remote/`, wpięcie w `sync.ts` jak `absences`.

Do `RecapEvent` dochodzi jedno pole:

```ts
  /** Urządzenie, które utworzyło zdarzenie (losowy id w localStorage). */
  deviceId?: string;
```

Dzięki temu komputer wie, że uwaga przyszła z telefonu, a nie z jego okna.

## Widok "Sala" (telefon, ale działa też na komputerze)

Trasa: `/sala/:classId`. Wejście:

- pulpit i pasek bieżącej lekcji: przycisk "Sala" przy aktualnej godzinie
  (klasa wynika z planu, `periodStatus` + `timetable`),
- widok klasy `/klasy/:id`: akcja "Sala" w menu akcji.

Bez nowej pozycji w menu głównym (menu ma zostać krótkie).

Układ (jedna ręka, kciuk na dole):

1. Nagłówek: nazwa klasy, przełącznik `Ławki | Lista`, przycisk "Rozsadź".
2. Ławki: pasek TABLICA na górze, trzy kolumny L S P, rzędy w dół. Ławka to
   kafelek z dwoma nazwiskami (imię + inicjał nazwiska, bo miejsca mało). Puste
   miejsce to kropkowana ramka. Przy nazwisku dzisiejsze wyniki jako małe
   symbole (`resultSymbol.ts`), uwaga jako pomarańczowa kropka.
3. Lista: alfabetycznie, z numerem i etykietą ławki (`P1`), ta sama akcja po
   tapie. Uczniowie bez miejsca na końcu listy w sekcji "Bez ławki".
4. Tap w ucznia -> dolny arkusz (bottom sheet) z dużymi przyciskami w jednym
   rzędzie: **Plus**, **Kropka**, **Plomba**, **Uwaga**. Plus / kropka /
   plomba zapisują natychmiast i zamykają arkusz z krótką animacją na kafelku.
   Uwaga rozwija gotowce z `UWAGA_PRESETS` (ponownie użyć `UwagaNoteChoices`)
   plus pole własne. Wybór gotowca zapisuje i zamyka.
5. Cofnięcie: pasek "Cofnij" przez 5 s po zapisie (`removeRecapEvent`).

Zdarzenia z Sali dostają `note` jak koło na lekcji (kod lekcji, gdy lekcja
jest w toku) i `deviceId`.

## Rozsadzanie ("Rozsadź")

Na telefonie przeciąganie jest niewygodne, więc tryb dwóch tapów:

1. Tap w puste lub zajęte miejsce -> podświetlone.
2. Tap w ucznia z listy pod siatką ("Bez ławki" na górze listy) -> zapis.
   Tap w inne zajęte miejsce -> zamiana.
3. Tap w podświetlone miejsce jeszcze raz -> zwolnienie.

Na komputerze dodatkowo drag and drop (HTML5 DnD działa w Chrome 109).
Przycisk "Wyczyść rozsadzenie" w menu akcji, z potwierdzeniem.

## Popup na komputerze

Nowy hook `useIncomingUwagi` w `AppShell`, `LessonPresent` i `Panel`:

- obserwuje `recapEvents`; nowa uwaga z dzisiaj, z innym `deviceId` niż
  własny i bez `wpisane` -> toast w prawym dolnym rogu,
- treść: "Uwaga: Kowalski Jan (IV A) - Przeszkadza na lekcji",
- przyciski: **Wpisz do VULCANA**, **Później** (uwaga zostaje w zakładce
  Uwagi, jak dotąd), **Cofnij** (usuwa zdarzenie, pomyłka na telefonie),
- toast znika sam po 60 s, uwaga zostaje w zakładce Uwagi,
- zbiór już pokazanych id trzymany w pamięci okna, żeby nic nie wyskoczyło
  dwa razy po kolejnym pullu.

Synchronizacja: dziś pull co 15 s (`useTodayEventsPull`). Na lekcji to za
długo. Docelowo kanał Supabase Realtime `postgres_changes` na `recap_events`
(INSERT), a polling zostaje jako fallback co 15 s. Realtime działa na
websockets, Chrome 109 to obsługuje. Po włączeniu realtime popup pojawia się
w około sekundę po tapie na telefonie.

## Uwaga do VULCANA

Rozszerzenie mostu w `vulcan-extension`:

```ts
export interface VulcanUwagaTransfer {
  version: 1;
  kind: 'uwaga';
  eventId: string;
  date: string;
  className: string;       // "IV A"
  vulcanClassName: string; // "4A"
  student: { firstName: string; lastName: string; number: number };
  content: string;         // treść uwagi
  category?: string;       // kategoria z listy VULCANA, jeśli jest
}
```

Przepływ w bocie (`vulcan-bot.js`):

1. Wejść do modułu uwag w dzienniku (ścieżka do ustalenia na podstawie
   zrzutów ekranu, tak jak wcześniej frekwencja).
2. Wybrać klasę i ucznia po nazwisku (`findStudentRow`).
3. Wypełnić treść (`setField`) i kategorię (`chooseDropdown`).
4. Zatrzymać się. Pasek pomocnika pokazuje "Sprawdź i zapisz".
5. Po kliknięciu zapisu przez Bartka pomocnik odsyła `VULCAN_UWAGA_SAVED`
   z `eventId`, apka ustawia `wpisane: true`.

Nierozpoznana kontrolka = stop i komunikat, bez klikania na ślepo (jak dziś).

### Jak to testować bez psucia dziennika

- Kroki bota są funkcjami na DOM. Robimy plik `vulcan-extension/fixtures/uwagi.html`
  odtwarzający formularz uwag (zrzut DOM z prawdziwej strony, bez danych
  osobowych) i test Playwright, który ładuje fixture, odpala bota z paczką
  testową i sprawdza, że pola są wypełnione, a zapis NIE został kliknięty.
- Most między apką a dodatkiem testujemy w vitest przez podmianę `postMessage`.
- Na żywo: pierwszy raz w VULCANIE z uwagą testową dla siebie lub na
  koncie demo, jeśli szkoła je ma. Bot i tak nie zapisuje sam.

## Etapy (każdy osobno do wdrożenia i commita)

1. **Model miejsc.** Typ `Seat`, `deviceId` w `RecapEvent`, migracja `0023_seats`,
   mappery, akcje w store (`setSeat`, `clearSeat`, `swapSeats`, `clearSeating`),
   `src/lib/seating.ts` z siatką, etykietami i testami.
2. **Widok Sala (odczyt + akcje).** Trasa `/sala/:classId`, ławki + lista,
   arkusz plus / kropka / plomba / uwaga, cofnij. Wejście z pulpitu i klasy.
   Sprawdzić na 390 px w trybie przeglądu (port 5175).
3. **Rozsadzanie.** Tryb dwóch tapów, DnD na komputerze, czyszczenie.
4. **Popup na komputerze.** `useIncomingUwagi`, toast, przyciski Później /
   Cofnij. Na razie z pollingiem 15 s, a w Sali odświeżanie co 5 s.
5. **Realtime.** Kanał `postgres_changes` z fallbackiem na polling.
6. **Uwaga do VULCANA.** Zrzuty formularza uwag od Bartka, fixture, kroki
   bota, `VULCAN_UWAGA` w moście, przycisk "Wpisz do VULCANA" w toaście
   i w `UwagaCard`, auto `wpisane` po zapisie.
7. **PWA.** `manifest.webmanifest`, ikona, `display: standalone`, żeby Sala
   otwierała się z ekranu głównego telefonu bez paska przeglądarki.

## Potwierdzone przez Bartka (2026-09-19)

- Rząd 1 jest przy tablicy.
- Wszystkie klasy siedzą w tej samej sali: jedna siatka 3 x 5 dla wszystkich.
- Uwagi w VULCANIE mają kategorie. Zajmiemy się tym w etapie 6, gotowce
  dostaną wtedy przypiętą kategorię.
