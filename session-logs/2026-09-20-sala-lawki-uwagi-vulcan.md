---
kind: handoff
date: 2026-09-20
topic: sala-lawki-uwagi-vulcan
status: done
---

# Widok Sala (ławki na telefonie), popup uwagi na komputerze i wpis uwagi do VULCANA przez dodatek

## Summary
Zaprojektowaliśmy i wdrożyliśmy w całości plan z `docs/PLAN-sala-lawki-uwagi.md`:
na telefonie widok ławek klasy (L/S/P, rząd 1 przy tablicy), tap w ucznia daje
plus / kropkę / plombę / uwagę; uwaga z telefonu wyskakuje na komputerze jako
popup (realtime Supabase), a przycisk "Wpisz do VULCANA" każe dodatkowi Chrome
wypełnić formularz uwagi w dzienniku i zatrzymać się przed zapisem. Wszystko
jest w trzech commitach na `main` (bf2b579, 9faf5d0, ba55c2b), migracje 0023
i 0024 wgrane do Supabase. Bot uwag w prawdziwym VULCANIE nie był jeszcze
uruchomiony.

## Key takeaways / decisions
- **Nie ma osobnej apki na telefon.** Sala to trasa `/sala/:classId` w tej samej
  apce plus manifest PWA (start_url `/sala`). Apka i tak działała od 390 px i ma
  sync, więc druga apka byłaby duplikatem.
- **Plus / plomba / uwaga z Sali to zwykłe `RecapEvent`** (bez questionSetId, jak
  koło na lekcji). Bilans, zakładka Uwagi i panel widzą je bez dodatkowej pracy.
  Bartek nie chce drugiego systemu punktów.
- **Jedyna nowa encja: `Seat`** (`column` L/S/P, `row`, `side` 1/2), id = `seat-<studentId>`,
  więc przesadzenie to upsert. Jedna sala 3 x 5 dla wszystkich klas (decyzja Bartka).
- **Rozsadzanie na dwa tapy**, nie drag and drop (telefon, Chrome 109). Logika
  jako czysta funkcja `nextSelection` w `useSalaSelection.ts`, testowana bez Reacta.
- **Popup wynika z sync, nie z osobnego kanału**: `RecapEvent.deviceId`
  (`src/lib/device.ts`, losowy id w localStorage). Komputer pokazuje uwagę z
  innego `deviceId` i tylko z dzisiaj; przy pierwszym renderze wszystko w store
  uchodzi za widziane, żeby odświeżenie nie wysypało popupów.
- **Popup celowo NIE jest na ekranach projektora** (LessonPresent, QuizPresent,
  RecapScreen), tylko w AppShell i w rozwiniętym panelu. Klasa nie ma widzieć
  komu wpisano uwagę.
- **Realtime = kanał `postgres_changes` na `recap_events`, który odpala ten sam
  `pullTodayRecapEvents`** co polling (polling zostaje jako fallback). Nie czytamy
  payloadu zmiany, żeby nie dublować zasad wtapiania.
- **Kategorie VULCANA** (lista z formularza): gotowce mają przypiętą kategorię
  (`src/lib/vulcanUwaga.ts`: PRESET_TEMPLATES), własna treść idzie jako "Uwaga".
  Treść to pełne zdanie z formą Uczeń / Uczennica po imieniu (heurystyka -a plus
  wyjątki typu Kuba).
- **Bot nigdy nie klika Zapisz.** Zapis wykrywa po kliknięciu "Zapisz" przez
  Bartka i zniknięciu okna, wtedy `VULCAN_UWAGA_SAVED` → apka ustawia `wpisane`.
  Jest też ręczny przycisk "Zapisałem w VULCANIE" w panelu pomocnika.
- **Commity wspólnych plików przy cudzych niezacommitowanych zmianach**: do
  indeksu wkładaliśmy wersję z HEAD z nałożonymi tylko naszymi edycjami
  (`git hash-object` + `git update-index --cacheinfo`), a przed commitem
  sprawdzaliśmy indeks przez `git checkout-index --prefix` + tsc + vitest.
  Skrypty w scratchpadzie sesji (stage_shared*.py), już niepotrzebne.
- Dev-owy uchwyt `window.__apkaStore` (tylko `import.meta.env.DEV`) pozwala
  symulować zdarzenia z konsoli / headless Chrome.

## State
- ✅ Etap 1: model `Seat`, migracja `0023_seats`, mapper, store (`setSeat`, `clearSeat`, `clearSeating`), `src/lib/seating.ts` z testami.
- ✅ Etap 2: strona `src/pages/Sala.tsx` (ławki | lista, dolny arkusz `StudentActionSheet`, cofnij 5 s), wejścia z paska "Dziś" na pulpicie i z widoku klasy.
- ✅ Etap 3: tryb "Rozsadź" (dwa tapy, zamiana, "Wyczyść rozsadzenie klasy").
- ✅ Etap 4: `deviceId`, `useIncomingUwagi`, `IncomingUwagaToast` w AppShell i Panelu.
- ✅ Etap 5: `subscribeTodayRecapEvents` w `sync.ts`, wpięte w `useTodayEventsPull`; migracja 0024 dodaje `device_id` i publikację realtime.
- ✅ Etap 6: `src/lib/vulcanUwaga.ts`, `src/lib/vulcanBridge.ts`, `useVulcanUwaga.ts`, przyciski w toaście i `UwagaCard`; dodatek 0.4 (`app-bridge.js`, `background.js`, `vulcan-bot.js: fillUwaga`).
- ✅ Etap 7: `public/manifest.webmanifest`, ikony, meta w `index.html`.
- ⛔ Nie sprawdzone na żywo: realtime (tryb przeglądu nie ma chmury), instalacja PWA na telefonie, bot `fillUwaga` w prawdziwym VULCANIE. Bartek musi odświeżyć dodatek w `chrome://extensions` i obie karty.

## Artifacts
- Plan i decyzje: `docs/PLAN-sala-lawki-uwagi.md`
- Commity: bf2b579 (Sala), 9faf5d0 (popup, realtime, PWA), ba55c2b (VULCAN); wszystko na `main`, wypchnięte
- Nowe pliki: `src/pages/Sala.tsx`, `src/components/sala/*`, `src/lib/seating.ts`, `src/lib/device.ts`, `src/lib/vulcanUwaga.ts`, `src/lib/vulcanBridge.ts`, `src/components/uwagi/useIncomingUwagi.ts`, `IncomingUwagaToast.tsx`, `useVulcanUwaga.ts`, `src/data/remote/seatMappers.ts`, `supabase/migrations/0023_seats.sql`, `0024_recap_events_device_id_realtime.sql`
- Testy: 423 w 45 plikach przechodzą (`npx vitest run`), `npx tsc --noEmit` czysty
- Pamięć: `sala-lawki-uwagi.md` w memory projektu

## Next step
Bartek testuje na żywo w szkole: telefon w `/sala` daje uwagę → na komputerze
popup → "Wpisz do VULCANA" → sprawdzić, na którym kroku bot się zatrzyma (komunikat
"Nie znalazłem..."). Poprawki będą w `vulcan-extension/vulcan-bot.js` w
`fillUwaga` / `pickStudentInModal` / `modalRoot`. Znane ryzyko: kategoria "Uwaga"
jest na liście dwa razy (nagłówek grupy i pozycja), `chooseDropdown` bierze
mniejszy element.

## What NOT to do
- Nie robić osobnej aplikacji mobilnej ani drugiego systemu punktów.
- Nie pokazywać popupu uwagi na ekranach projektora.
- Nie kazać botowi klikać Zapisz w VULCANIE (zasada z PRODUCT.md: człowiek zatwierdza).
- Nie dodawać service workera do PWA (stale świeża wersja ważniejsza niż offline).
- Nie robić `git add` na wspólnych plikach (App.tsx, store.ts, types.ts, AppShell.tsx) bez sprawdzenia `git diff`, jeśli inna sesja zostawiła tam niezacommitowane zmiany.
