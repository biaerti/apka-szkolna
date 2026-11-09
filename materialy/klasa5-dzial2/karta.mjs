// Karta pracy - klasa 5, dział 2 „Uwaga, uczucia!”. 2 strony A4 do rozdania.
// Idzie razem z lekcją 29a (powtórka z nauczycielem): tematy w tej samej kolejności co slajdy.
// Najpierw wspólna karta „Ćwiczymy razem” na projektorze, potem uczniowie sami robią zadanie
// o tym samym numerze z tej karty (na slajdzie znaczek „Teraz sami: karta pracy, zad. N”).
// Przykłady własne - inne niż w kartach k5-powt2-*, kartach lekcji 17-28, puli sprawdzianu i zeszycie.
// Projektor: public/materialy/karty/klasa5-dzial2-karta.html, przy zadaniu „Info” (reguła + przykład krok po kroku).
// Generator: node materialy/karta.mjs klasa5-dzial2 -> karta (dla uczniów) i karta-rozwiazania (do wyświetlenia).
// Znaczniki jak w materialy/klasa4-rozdzial1/karta.mjs; w luce „a / b” = obie odpowiedzi dobre.

export const KARTA = {
  plik: 'klasa5-dzial2-karta',
  klasa: 'Klasa 5',
  tytul: 'Karta pracy - dział 2',
  podtytul: 'Uwaga, uczucia!',
  tematy: [
    {
      tytul: 'Porównanie i przenośnia',
      wiedza: ['**Porównanie** ma słówko **jak, niczym, niby**. **Przenośnia** go nie ma - wyrazy razem znaczą coś nowego, nie dosłownie.'],
      zadania: [
        {
          polecenie: 'Porównanie czy przenośnia? Zakreśl.',
          info: 'Szukaj słówka jak, niczym, niby, jakby - jest? To porównanie. Nie ma, a wyrażenie narysowane dosłownie byłoby bzdurą? To przenośnia.',
          przyklad: [
            'Skakał jak piłka.',
            'Jest słówko ==jak== ➜ **porównanie**.',
            'morze łez',
            'Nie ma słówka, a dosłownie to bzdura (nikt nie płacze morzem) ➜ ==przenośnia==.',
          ],
          kolumny: 2,
          linie: [
            'Śmiał się jak hiena. {{*porównanie|przenośnia}}',
            'fala śmiechu {{porównanie|*przenośnia}}',
            'Szumiał niczym morze. {{*porównanie|przenośnia}}',
            'serce z lodu {{porównanie|*przenośnia}}',
          ],
        },
      ],
    },
    {
      tytul: 'Związki frazeologiczne',
      wiedza: ['**Związek frazeologiczny** - stałe połączenie wyrazów o przenośnym znaczeniu. Nie rozumiemy go dosłownie.'],
      zadania: [
        {
          polecenie: 'Zakreśl prawdziwe znaczenie.',
          info: 'Nie czytaj dosłownie. Zapytaj: co by to znaczyło, gdyby ktoś tak powiedział o koledze?',
          przyklad: [
            'dać nogę',
            'Dosłownie: ktoś daje komuś nogę? ==Bez sensu==.',
            'Przenośnie: szybko ==uciec==.',
          ],
          linie: [
            'mieć głowę na karku {{*być rozsądnym|mieć długą szyję}}',
            'owinąć kogoś wokół palca {{*robić z kimś, co się chce|bawić się nitką}}',
            'mieć nosa {{*trafnie coś przeczuć|mieć duży nos}}',
            'serce mu pękło {{*było mu bardzo smutno|zachorował}}',
          ],
        },
      ],
    },
    {
      tytul: 'Zdrobnienia i zgrubienia',
      wiedza: ['**Zdrobnienie** - małe albo czule: domek (-ek, -ka, -ko). **Zgrubienie** - duże, żartem: domisko (-isko).'],
      zadania: [
        {
          polecenie: 'Utwórz zdrobnienie i zgrubienie.',
          info: 'Zdrobnienie: dodaj -ek, -ka, -ko (czasem głoski się zmieniają). Zgrubienie: dodaj -isko, -sko. Powiedz na głos, czy brzmi dobrze.',
          przyklad: [
            'pies',
            'małe, czule: ==piesek==',
            'duże, żartem: ==psisko==',
          ],
          tabela: {
            naglowki: ['wyraz', 'zdrobnienie', 'zgrubienie'],
            wiersze: [
              ['**wóz**', '[[wózek|26]]', '[[wozisko|26]]'],
              ['**ręka**', '[[rączka|26]]', '[[ręczysko / łapsko|26]]'],
              ['**kamień**', '[[kamyk / kamyczek|26]]', '[[kamienisko|26]]'],
            ],
          },
        },
      ],
    },
    {
      tytul: 'Przypadki',
      wiedza: ['**M** kto? co? · **D** kogo? czego? · **C** komu? czemu? · **B** kogo? co? · **N** z kim? z czym? · **Ms** o kim? o czym? · **W** o!'],
      zadania: [
        {
          polecenie: 'W jakim przypadku jest podkreślony rzeczownik? Wpisz skrót.',
          info: 'Znajdź czasownik i zadaj od niego pytanie o podkreślony wyraz. Pytanie podpowie przypadek.',
          przyklad: [
            'Gram z siostrą.',
            'Czasownik: ==gram==. Gram (z kim?) z siostrą.',
            'z kim? z czym? ➜ **narzędnik (N)**',
          ],
          kolumny: 2,
          linie: [
            '[[D|9]] Nie widzę __drogi__.',
            '[[C|9]] Pomagam __bratu__.',
            '[[B|9]] Zjadłem __gruszkę__.',
            '[[N|9]] Jadę __rowerem__.',
            '[[Ms|9]] Śnię o __smokach__.',
            '[[W|9]] __Kasiu__, chodź!',
          ],
        },
      ],
    },
    {
      tytul: 'Nietypowa odmiana',
      wiedza: ['Na **-um** w lp. się nie odmieniają: w muzeum. Tylko lp.: odwaga. Tylko lm.: drzwi, sanie.'],
      zadania: [
        {
          polecenie: 'Popraw źle użyty wyraz.',
          info: 'Rzeczowniki na -um w liczbie pojedynczej mają zawsze tę samą formę: to liceum, w liceum, do liceum.',
          przyklad: [
            'Byłam w „muzeumie”.',
            'muzeum kończy się na ==-um== ➜ w lp. się nie odmienia.',
            'Byłam w ==muzeum==.',
          ],
          linie: [
            'Spotkamy się przy „liceumie”. ➜ [[liceum|26]]',
            'Mieszkam blisko „gimnazjumu”. ➜ [[gimnazjum|26]]',
          ],
        },
        {
          polecenie: 'Tylko liczba pojedyncza czy tylko mnoga? Zakreśl.',
          info: 'Powiedz „jeden ...” i „dwa ...”. Nie da się powiedzieć „jeden grabi”? To tylko lm. Nie ma „dwa szczęścia”? To tylko lp.',
          przyklad: [
            'okulary',
            '„jeden okular”? ==nie brzmi== ➜ **tylko lm.**',
            'tlen',
            '„dwa tleny”? ==nie brzmi== ➜ **tylko lp.**',
          ],
          kolumny: 2,
          linie: [
            'grabie {{tylko lp.|*tylko lm.}}',
            'szczęście {{*tylko lp.|tylko lm.}}',
            'ferie {{tylko lp.|*tylko lm.}}',
            'chrust {{*tylko lp.|tylko lm.}}',
          ],
        },
      ],
    },
    {
      tytul: 'Ę i ą na końcu wyrazu',
      wiedza: ['**-ę**: widzę kogo? co? (mamę), ja (piszę), małe zwierzę (kocię). **-ą**: z kim? z czym? (z mamą), oni (piszą).'],
      zadania: [
        {
          polecenie: 'Dopisz ę albo ą.',
          info: 'Zadaj pytanie: widzę co? - ę, z kim? z czym? - ą. Przy czasowniku: ja - ę, oni - ą.',
          przyklad: [
            'Czytam książk…',
            'Czytam (co?) ==książkę== ➜ biernik, **-ę**.',
            'Idę z babci…',
            'Idę (z kim?) ==z babcią== ➜ narzędnik, **-ą**.',
          ],
          kolumny: 2,
          linie: [
            'Pomaluję ścian[[ę|8]] na zielono.',
            'Rozmawiam z nauczycielk[[ą|8]].',
            'Psy szczekaj[[ą|8]] na listonosza.',
            'W kurniku piszczy kurcz[[ę|8]].',
          ],
        },
      ],
    },
    {
      tytul: 'Temat, końcówka i ó',
      wiedza: ['**Temat** się nie zmienia, **końcówka** tak: kot|y. **Ó** piszę, gdy w innej formie jest **o**: stół - stoły.'],
      zadania: [
        {
          polecenie: 'Wpisz ó albo u i podaj wyraz, który to udowadnia.',
          info: 'Odmień wyraz albo poszukaj wyrazu z tej samej rodziny. Pojawia się o? Piszesz ó.',
          przyklad: [
            'st…ł',
            'Odmieniam: ==stoły==, stołu - jest **o**.',
            'Piszę ==stół==.',
          ],
          kolumny: 2,
          linie: [
            'pok[[ó|6]]j ➜ [[pokoje|22]]',
            'samoch[[ó|6]]d ➜ [[samochody|22]]',
            'ogr[[ó|6]]d ➜ [[ogrody|22]]',
            'p[[ó|6]]ł ➜ [[połowa|22]]',
          ],
        },
      ],
    },
    {
      tytul: 'Sprawozdanie',
      wiedza: ['**Wstęp**: kto? co? kiedy? gdzie? **Przebieg** po kolei (najpierw, potem, na koniec). **Zakończenie**: krótka opinia.'],
      zadania: [
        {
          polecenie: 'Z której części sprawozdania jest zdanie? Zakreśl.',
          info: 'Mówi, kto, gdzie i kiedy? Wstęp. Opisuje, co się działo po kolei? Przebieg. Mówi, jak mi się podobało? Zakończenie.',
          przyklad: [
            'We wtorek byliśmy w teatrze.',
            'Mówi ==kiedy== i ==gdzie== ➜ **wstęp**.',
            'Spektakl bardzo mi się podobał.',
            'To ==moja opinia== ➜ **zakończenie**.',
          ],
          linie: [
            'W sobotę harcerze pojechali na biwak w lesie. {{*wstęp|przebieg|zakończenie}}',
            'Najpierw rozbiliśmy namioty. {{wstęp|*przebieg|zakończenie}}',
            'Potem rozpaliliśmy ognisko. {{wstęp|*przebieg|zakończenie}}',
            'To był najlepszy weekend tej jesieni. {{wstęp|przebieg|*zakończenie}}',
          ],
        },
        {
          polecenie: 'Napisz wstęp sprawozdania z ostatniej wycieczki albo wyjścia klasy (1-2 zdania).',
          info: 'Wstęp odpowiada na pytania: kto? co? kiedy? gdzie? Pisz w czasie przeszłym, same fakty.',
          przyklad: [
            'Kto? ==nasza klasa== · Co? ==wyjście do kina== · Kiedy? ==w piątek== · Gdzie? ==w Kinie Luna==',
            'W piątek nasza klasa poszła do Kina Luna na film przyrodniczy.',
          ],
          pisanie: 2,
          wzor: 'np. W czwartek klasa 5a pojechała na wycieczkę do Wieliczki, żeby zwiedzić kopalnię soli.',
        },
      ],
    },
    {
      tytul: 'Dwukropek',
      wiedza: ['Dwukropek stawiam przed **dialogiem**, przed **wyliczeniem** (po zapowiedzi: trzy owoce:) i przed **cytatem**.'],
      zadania: [
        {
          polecenie: 'Czy w miejscu ▢ trzeba postawić dwukropek? Zakreśl.',
          info: 'Coś zaraz nastąpi: czyjaś wypowiedź, wyliczenie po zapowiedzi (trzy rzeczy, następujące) albo cytat? Wtedy dwukropek. Inaczej - nic.',
          przyklad: [
            'Kupiłam dwa owoce ▢ jabłko i banana.',
            '„dwa owoce” ==zapowiada== wyliczenie ➜ **dwukropek**.',
            'Kupiłam ▢ jabłko w sklepie.',
            'Nic nie zapowiadam ➜ ==bez dwukropka==.',
          ],
          linie: [
            'Kolega zapytał ▢ – Grasz z nami? {{*tak|nie}}',
            'Wróciliśmy ▢ późno. {{tak|*nie}}',
            'Na drzwiach wisiał napis ▢ „Proszę pukać”. {{*tak|nie}}',
            'W koszyku miałam trzy owoce ▢ jabłko, gruszkę i śliwkę. {{*tak|nie}}',
          ],
        },
      ],
    },
    {
      tytul: 'Tekst reklamowy',
      wiedza: ['**Reklama** namawia do kupna: hasło, wykrzykniki, słowa nowość, gratis, taniej i obietnice bez pokrycia.'],
      zadania: [
        {
          polecenie: 'Podkreśl cztery słowa albo zwroty, które namawiają do kupna.',
          info: 'Szukaj słów-wabików (nowość, gratis, taniej), pośpiechu (tylko dziś, ostatnia szansa) i obietnic.',
          przyklad: [
            'Promocja! Sok Owocek - teraz taniej!',
            'Wabiki: ==Promocja!== i ==teraz taniej==.',
          ],
          linie: ['((Nowość!)) Batonik Mocarz - ((tylko dziś)) w każdym sklepie ((taniej))! Do każdego batonika naklejka ((gratis))!'],
        },
        {
          polecenie: 'Co obiecuje ta reklama? Czy to na pewno prawda?',
          info: 'Obietnica to to, co według reklamy zyskasz. Zastanów się, czy batonik naprawdę to daje.',
          przyklad: [
            '„Z sokiem Owocek będziesz najszybszy w klasie!”',
            'Obietnica: ==będę najszybszy==. Prawda? ==Nie== - sok nie sprawi, że szybciej biegam.',
          ],
          linie: ['Batonik Mocarz - z nim będziesz silny jak lew!', '➜ [[np. że będę silny jak lew - to nieprawda, batonik nie daje siły lwa|100]]'],
          wLinii: true,
        },
      ],
    },
  ],
};
