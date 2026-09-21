---
kind: handoff
date: 2026-09-21
topic: bot-uwag-vulcan-transfer
status: blocked
---

# Auto-wpis uwag z telefonu do VULCANA - wszystko działa POZA przeniesieniem ucznia do „Dotyczy"

## Summary
Sesja w trzech aktach: (1) Sala - kilka ostrzeżeń naraz, szósty rząd ławek,
linijka „Dziś:" słowami w arkuszu ucznia; (2) globalny auto-wpis uwag: uwaga
z innego urządzenia sama leci do dodatku Chrome (działa też na prezentacji);
(3) długa saga debugowania bota `fillUwaga` na ŻYWYM VULCANIE. Bot przechodzi
całą nawigację i wypełnia kategorię+treść, ale NIE UMIE przenieść ucznia
z lewej listy do „Dotyczy" - wypróbowaliśmy 5 metod, wszystkie „raportują ok",
żadna nie przenosi. Wersja 0.6.2 (pomiar współrzędnych PO pasku debuggera)
jest wgrana, ale NIE przetestowana do końca - ostatni zrzut Bartka to 0.6.1.

## Key takeaways / decisions
- **Zapisz klika BOT, zawsze** (decyzja Bartka): zatwierdzeniem uwagi jest
  samo jej danie w apce/na telefonie. Panelik pomocnika niczego nie pyta -
  paczka `VULCAN_UWAGA` od razu odpala `fillUwaga`, a po skompletowaniu
  formularza bot sam klika Zapisz (z bezpiecznikiem: brak ucznia w Dotyczy /
  kategorii / treści = stop i komunikat, bez zapisu).
- **Droga do formularza: dziennik oddziału, nie lekcja** (odkrycie Bartka):
  uwagi w VULCANIE wiszą luzem przy klasie i miesiącu. Wstążka
  `#rbbnDziennkiBtn` → klasa w drzewie (`.x-tree-node-text` zaczynający się od
  „4c ("), → `[uitestid="Dane dziennika-Pochwały i uwagi"]` → zakładka „Uwagi"
  (findText exact) → „Dodaj" (odsapka 800 ms + do 3 prób, bo panel się dogrywa).
- **VULCAN ma stałe `uitestid`** (Bartek wkleił pełne DOM-y): okno
  `[uitestid="DodajUwageEditorView"]`, lewa/prawa lista
  `vswitchpanel-left-grid`/`vswitchpanel-right-grid`, strzałki `a[uitestid=">"]`
  i `">>"`, kategoria `#cmbKategorieId-inputEl` (combo, opcje
  `.x-boundlist-item`; „Uwaga" jest 2x - brać tę z `data-qtip`), treść
  `#idTresc-inputEl`, przyciski `a[uitestid="Zapisz"|"Anuluj"|"Usuń"]`.
- **CSP VULCANA blokuje wstrzykiwany inline `<script>`** - jedyna droga do
  `window.Ext` to `chrome.scripting.executeScript` z `world: 'MAIN'`
  (background.js, message `EXT_RUN`; manifest ma permission `scripting`).
- **Pasek „rozpoczął debugowanie" spycha stronę w dół** - współrzędne klików
  przez debugger trzeba mierzyć PO `chrome.debugger.attach` (0.6.2 to robi:
  content znakuje cele `data-apka-bot-click="i"`, background mierzy i klika
  `Input.dispatchMouseEvent` z mouseMoved przed press; permission `debugger`).
- Sala: ostrzeżeń może być kilka (przycisk się nie blokuje, △2 przy nazwisku),
  uwaga zdejmuje wszystkie; SEAT_ROWS=6; `warningsByStudent` zwraca teraz
  `Map<string, RecapEvent[]>`.
- Plusy z Sali normalnie liczą się do bilansu i piątki (monthBalance /
  outstandingPlusy patrzą tylko na `result`).

## State
- ✅ Sala (commit 80322ba) i auto-wpis w apce: `AutoVulcanUwaga` w App.tsx
  (globalny pull + auto-send z flagą `background`, dedupe w localStorage
  `vulcan-uwaga-auto`), zdeployowane na Vercel. Testy 433 ✔, tsc ✔.
- ✅ Bot nawiguje: dziennik oddziału → 4C → Pochwały i uwagi → Uwagi → Dodaj
  → wyszukuje „Mykhaliuk" → okno i wyszukiwarka działają; kategoria i treść
  wypełniały się poprawnie (test z 0.5.6).
- ⛔ BLOKER: przeniesienie ucznia do „Dotyczy". Wypróbowane i NIEskuteczne:
  syntetyczny klik wiersza+strzałki, dwuklik, handler przycisku przez
  Ext.getCmp (EXT_RUN zwraca „ok"!), realne kliki debuggerem ze stygnącymi
  współrzędnymi (0.6.0/0.6.1 - klikały nad celem przez pasek debuggera).
  Ręcznie u Bartka działa zwykły klik wiersza + klik „>".
- 🔄 0.6.2 wgrane na dysk i do repo, NIE przetestowane (pomiar współrzędnych
  po attach + mouseMoved). To pierwszy krok nowej sesji.
- ⛔ APK na telefon czeka: telefon odrzuca adb jako `unauthorized` - Bartek
  musi kliknąć „Zezwól" na telefonie, potem `npm run apk` (build ze wszystkim
  z dzisiaj jeszcze nie wgrany).
- Testowa uwaga w Supabase: recap_events id `1152ae40-56c1-4f44-8461-290a581251ed`,
  uczeń Oleksii Mykhaliuk `dc6d1f7a-522f-4382-8e63-7ee3d8aea906`, klasa IV C
  `c27f14ed-dbac-483c-b265-45b71551f51c`, device_id `telefon-test-claude`,
  wciąż `wpisane=false` - wisi w zakładce Uwagi z przyciskiem „Do VULCANA"
  (nim odpala się test; treść Bartek lekko rozszerzył w apce).

## Artifacts
- Commity (wszystko na main, wypchnięte): 80322ba (Sala), 59ffa72
  (AutoVulcanUwaga), 33f8d8f…f7eeae7 (saga bota, dodatek 0.5.1→0.6.2).
- Pliki: `vulcan-extension/vulcan-bot.js` (fillUwaga, openUwagiOddzialu,
  pickStudentInModal, extRun, realClick), `vulcan-extension/background.js`
  (EXT_RUN → extMain w world MAIN, REAL_CLICKS → realClicks + measureClickTargets),
  `vulcan-extension/manifest.json` (0.6.2, permissions: tabs, storage,
  scripting, debugger), `src/components/uwagi/AutoVulcanUwaga.tsx`,
  `src/pages/Sala.tsx`, `src/lib/ostrzezenia.ts`, `src/lib/seating.ts`.
- Procedura testu (Bartek zna na pamięć): Anuluj w VULCANIE → ⟳ dodatku
  (sprawdzić NUMER wersji!) → F5 karta VULCANA → F5 karta apki → apka/Uwagi →
  karta Oleksii → „Do VULCANA". Po każdym ⟳ dodatku OBIE karty wymagają F5.

## Next step
Test 0.6.2 (współrzędne po attach). Jak dalej nie przenosi: dodać
diagnostykę zwrotną z `measureClickTargets` (zmierzone punkty w komunikacie
błędu) i/lub podejrzeć w świecie MAIN, jakiego xtype jest `vswitchpanelex`
(`Ext.getCmp('vswitchpanelex-…')`) - może ma własną metodę przenoszenia
(np. `moveRec`/`onAddBtnClick`), którą można wywołać wprost zamiast klikać.
Ewentualnie w EXT_RUN po `select()` sprawdzić `getSelection().length` i
zwrócić to w wyniku - dotąd „ok" znaczyło tylko „handler wywołany".

## What NOT to do
- Nie wracać do wstrzykiwania inline `<script>` (CSP blokuje po cichu).
- Nie mierzyć współrzędnych klików przed `chrome.debugger.attach`.
- Nie szukać strzałki „>" po tekście w candidates() bez `uitestid` (ikonowe
  przyciski; a candidates() celowo omija panel bota `#apka-szkolna-vulcan-bot`).
- Nie brać pierwszej „Uwagi" z boundlisty (nagłówek grupy) - tylko z data-qtip.
- Nie chodzić przez lekcję w drzewie dni - dziennik oddziału jest niezależny
  od planu.
- Nie kazać Bartkowi niczego potwierdzać w paneliku - pełny automat.
- Nie robić `git add` na wspólnych plikach bez sprawdzenia diffa (inna sesja
  zostawiła zmiany w useReadyMaterials.ts i textbook4.*).
