# Pływające koło fortuny (aplikacja desktopowa)

Małe okno, które **zawsze jest na wierzchu** - także nad multipodręcznikiem GWO
puszczonym na projektor. Służy do jednego: kiedy lekcja idzie w podręczniku, a
nie w prezentacji apki, i po zadaniu trzeba wylosować, kto pokazuje rozwiązanie.

Dwa stany:

- **pigułka** - wąski pasek (`🎡 IV A`), zajmuje róg ekranu. Przeciągasz, żeby
  przesunąć; klikasz, żeby rozwinąć.
- **panel** - okno 360x600 z dwoma trybami przełączanymi w nagłówku:
  - **Koło** - *Kręć*, nazwisko i dwie oceny: **✚ Dobrze** i **• Kropka**
    (klawisze `1` i `2`, `Spacja` kręci, `Backspace` cofa). Przycisk **Reset**
    kasuje skreślenia, **Obecność** wypisuje nieobecnych z koła.
  - **Stoper** - odliczanie z własnym poleceniem („Czytamy tekst ze s. 12")
    i edytowalną długością. `Spacja` = start / pauza. Leci dalej po zwinięciu
    do pigułki - pigułka pokazuje wtedy pozostały czas.

  W nagłówku jest też wybór klasy i **Uwagi** (lista klasy z licznikiem uwag
  w tym miesiącu). `Esc` zwija panel do pigułki.

Zdarzenia lądują w tym samym miejscu, co te z prezentacji - w bilansie miesiąca
mają adnotację `podręcznik`. Pula "kto już dziś odpowiadał" jest wspólna
(liczona z zapisanych zdarzeń), więc koło z panelu nie losuje kogoś, kto
odpowiadał rano na kole powtórzeniowym.

Minimalizacja z paska zadań **nie chowa** okna - zwija je do pigułki. Zasada:
nie ma stanu "apka działa, a na ekranie nie ma po niej śladu".

## Jak to jest zbudowane

To tylko okno. Cały panel to zwykła trasa apki webowej - `/panel`
(`src/pages/Panel.tsx`), ładowana z produkcji. Dzięki temu:

- logika koła, losowania i ocen jest jedna (`useTaskWheel`, ten sam hook, co
  szuflada w prezentacji), a nie skopiowana,
- dane idą do tego samego Supabase, co apka w przeglądarce,
- **poprawki w panelu nie wymagają przebudowania exe** - wystarczy deploy na
  Vercel.

Natywnego kodu jest tyle, ile przeglądarka nie umie: przechwycenie
minimalizacji z paska zadań (`src-tauri/src/pasek_zadan.rs`). Rozmiar okna,
pozycja, przeciąganie i zamknięcie idą z JS przez `core:window` - mostek jest
w `src/lib/desktop.ts` w apce.

Wzorowane na `D:\VS-Projekty\notatka-lekarza\desktop` (ten sam układ Tauri v2).

## Adres, z którego ładuje się panel

W `src-tauri/tauri.conf.json` (`build.frontendDist`) **i** w
`src-tauri/capabilities/panel-prod.json` (`remote.urls`) jest
`https://szkola.klippi.pl`. Jeśli apka stoi pod innym adresem, trzeba
zmienić go w **obu** plikach i przebudować - inaczej okno wstanie puste albo
pigułka nie będzie umiała zmienić rozmiaru okna.

## Uruchomienie

Dev (panel z lokalnego `npm run dev`, port 5173):

```bash
cd desktop
npm install
npm run dev
```

Instalator (NSIS, `src-tauri/target/release/bundle/nsis/`):

```bash
cd desktop
npm run build
```

Wymaga Rusta (`rustup`) i WebView2 - na Windows 11 jest w systemie, instalator
i tak dociąga go w razie potrzeby.

Panel da się też obejrzeć bez budowania czegokolwiek: `npm run dev` w katalogu
głównym i wejście na http://localhost:5173/panel - wtedy zmienia się tylko UI,
bo nie ma okna do zmieniania.
