// Karta pracy - klasa 4, rozdział I „Poznajemy siebie i innych”. 2 strony A4 do rozdania.
// Nie powtarza filmików: każdy temat to krótka wiedza od zera + własne, różne zadania.
// Generator: node materialy/karta.mjs klasa4-rozdzial1 -> karta (dla uczniów) i karta-rozwiazania (do wyświetlenia).
// Znaczniki jak w zeszycie (**, ==, __, ~~) oraz:
//   [[odpowiedź]]        - luka; w rozwiązaniach wpisana odpowiedź. [[odpowiedź|30]] = szerokość luki w mm.
//   {{a|*b|c}}           - wybór; uczeń zakreśla, w rozwiązaniach * jest zakreślone.
//   ((słowo))            - w rozwiązaniach podkreślone (zadania „podkreśl”).

export const KARTA = {
  plik: 'klasa4-rozdzial1-karta',
  klasa: 'Klasa 4',
  tytul: 'Karta pracy - rozdział I',
  podtytul: 'Poznajemy siebie i innych',
  tematy: [
    {
      tytul: 'Świat przedstawiony',
      wiedza: [
        '**Świat przedstawiony** to wszystko, co dzieje się w utworze. Składa się z czterech elementów:',
        '**czas** (kiedy?) · **miejsce** (gdzie?) · **bohaterowie** (kto?) · **wydarzenia** (co się stało?)',
      ],
      zadania: [
        {
          polecenie: 'Uzupełnij tabelę na podstawie zdania.',
          linie: ['W czasie wakacji Ola i jej kuzyn Bartek znaleźli na strychu u babci stary pamiętnik.'],
          tabela: {
            naglowki: ['czas', 'miejsce', 'bohaterowie', 'wydarzenie'],
            wiersze: [['[[wakacje|30]]', '[[strych u babci|30]]', '[[Ola i Bartek|30]]', '[[znalezienie pamiętnika|38]]']],
          },
        },
        {
          polecenie: 'Do jakiego pytania pasuje każde słowo? Zakreśl.',
          kolumny: 2,
          linie: [
            'o północy - {{*kiedy?|gdzie?|kto?}}',
            'w zamku - {{kiedy?|*gdzie?|kto?}}',
            'smok i rycerz - {{kiedy?|gdzie?|*kto?}}',
            'w zeszłym roku - {{*kiedy?|gdzie?|kto?}}',
          ],
        },
      ],
    },
    {
      tytul: 'Kto mówi w tekście?',
      wiedza: [
        '**Autor** napisał tekst - to prawdziwy człowiek. W tekście mówi ktoś inny:',
        'w opowiadaniu **narrator**: **narrator-bohater** mówi o sobie (==poszedłem==, ==zobaczyłam==), **narrator-obserwator** o innych (==Ania poszła==).',
        'w wierszu (wersy, zwrotki) **podmiot liryczny**.',
      ],
      zadania: [
        {
          polecenie: 'Kto mówi? Wpisz: **B** - narrator-bohater, **O** - narrator-obserwator, **P** - podmiot liryczny.',
          linie: [
            '[[B|8]] Wspięłam się na drzewo i zobaczyłam gniazdo.',
            '[[O|8]] Franek przez godzinę układał puzzle z dziadkiem.',
            '[[P|8]] Biegnę boso po trawie, / słońce grzeje mi plecy.',
            '[[B|8]] Spóźniliśmy się na autobus, więc poszliśmy pieszo.',
          ],
        },
        {
          polecenie: 'Zamień zdanie tak, żeby opowiadał narrator-bohater.',
          linie: ['Kasia otworzyła drzwi i krzyknęła ze strachu. ➜ [[Otworzyłam drzwi i krzyknęłam ze strachu.|95]]'],
        },
      ],
    },
    {
      tytul: 'Notatka',
      wiedza: [
        'Dobra notatka jest **krótka, konkretna i czytelna**. Wybieramy formę: **punkty** (lista, kolejne kroki), **tabela** (porównanie według tych samych cech), **mapa myśli** (skojarzenia wokół jednego hasła), **notatka tradycyjna** (kilka krótkich zdań).',
      ],
      zadania: [
        {
          polecenie: 'Jaka forma notatki pasuje najlepiej? Zakreśl.',
          linie: [
            'kroki robienia papierowego samolotu - {{*punkty|tabela|mapa myśli}}',
            'porównanie lata i zimy: pogoda, ubranie, zabawy - {{punkty|*tabela|mapa myśli}}',
            'wszystko, co kojarzy ci się z przyjaźnią - {{punkty|tabela|*mapa myśli}}',
          ],
        },
        {
          polecenie: 'Dokończ mapę myśli - dopisz trzy skojarzenia do hasła **WAKACJE**.',
          linie: ['WAKACJE ➜ [[np. morze|26]], [[wolny czas|26]], [[lody|26]]'],
        },
      ],
    },
    {
      tytul: 'Głoska, litera, sylaba',
      wiedza: [
        '**Literę** piszemy i widzimy, **głoskę** słyszymy. Dwie litery mogą dawać jedną głoskę: **sz, cz, rz, ch, dz, dź, dż**.',
        '**Sylaba** to część wyrazu z jedną samogłoską (**a, ą, e, ę, i, o, u, ó, y**). Wyraz przenosimy tylko między sylabami: ko-szy-ko-wa.',
      ],
      zadania: [
        {
          polecenie: 'Policz litery, głoski i sylaby.',
          tabela: {
            naglowki: ['wyraz', 'litery', 'głoski', 'sylaby'],
            wiersze: [
              ['**szuflada**', '[[8|12]]', '[[7|12]]', '[[3|12]]'],
              ['**chomik**', '[[6|12]]', '[[5|12]]', '[[2|12]]'],
              ['**dżdżownica**', '[[10|12]]', '[[8|12]]', '[[3|12]]'],
            ],
          },
        },
        {
          polecenie: 'Podziel wyrazy na sylaby.',
          kolumny: 2,
          linie: ['telefon ➜ [[te-le-fon|28]]', 'czekolada ➜ [[cze-ko-la-da|28]]', 'piórnik ➜ [[piór-nik|28]]', 'samochód ➜ [[sa-mo-chód|28]]'],
        },
      ],
    },
    {
      tytul: 'Epitet',
      wiedza: [
        '**Epitet** określa rzeczownik i odpowiada na pytanie **jaki? jaka? jakie?** Najczęściej to przymiotnik: ==mroźny== poranek, ==skrzypiące== schody.',
        'Epitety pomagają zobaczyć i poczuć to, co opisujemy. Zamiast „fajny” wybieraj słowa dokładne.',
      ],
      zadania: [
        {
          polecenie: 'Podkreśl wszystkie epitety (jest ich pięć).',
          linie: ['((Stary)), ((skrzypiący)) statek płynął po ((wzburzonym)) morzu, a ((zmęczeni)) marynarze patrzyli w ((ciemne)) niebo.'],
        },
        {
          polecenie: 'Dopisz po dwa epitety.',
          kolumny: 2,
          linie: ['[[np. puszysty, biały|34]] kot', '[[ciepła, słoneczna|34]] plaża', '[[stary, tajemniczy|34]] zamek', '[[pyszne, czekoladowe|34]] ciasto'],
        },
      ],
    },
    {
      tytul: 'Czasownik',
      wiedza: [
        '**Czasownik** mówi, co ktoś **robi** (pisze, skacze) albo **co się z nim dzieje** (śpi, choruje). **Nie** z czasownikiem piszemy **osobno**: nie wiem.',
        'Odmienia się przez **osobę** (ja, ty, on / my, wy, oni), **liczbę** (pojedyncza, mnoga), **czas** (przeszły, teraźniejszy, przyszły), a w czasie przeszłym też przez **rodzaj** (czytał, czytała, czytało).',
        'Formy **nieosobowe**: **bezokolicznik** (co robić? - pływać) i formy na **-no, -to** (posprzątano, zbito).',
      ],
      zadania: [
        {
          polecenie: 'Podkreśl czasowniki.',
          linie: ['Rano Tymek ((wstał)), ((zjadł)) szybkie śniadanie i ((pobiegł)) do szkoły. Na przerwie ((grał)) z kolegami w piłkę.'],
        },
        {
          polecenie: 'Uzupełnij tabelę.',
          tabela: {
            naglowki: ['czasownik', 'osoba', 'liczba', 'czas'],
            wiersze: [
              ['**skaczesz**', '[[2.|14]]', '[[pojedyncza|24]]', '[[teraźniejszy|24]]'],
              ['**pływaliśmy**', '[[1.|14]]', '[[mnoga|24]]', '[[przeszły|24]]'],
              ['**będą malować**', '[[3.|14]]', '[[mnoga|24]]', '[[przyszły|24]]'],
            ],
          },
        },
        {
          polecenie: 'Napisz poprawnie.',
          kolumny: 2,
          linie: ['(nie)lubię ➜ [[nie lubię|26]]', '(nie)chcemy ➜ [[nie chcemy|26]]', '(nie)wiedział ➜ [[nie wiedział|26]]', '(nie)spałam ➜ [[nie spałam|26]]'],
        },
        {
          polecenie: 'Zakreśl formy nieosobowe czasownika.',
          linie: ['{{*zamknięto|zamknął|*śpiewać|śpiewam|*ugotowano|gotujesz}}'],
        },
        {
          polecenie: 'Napisz czasownik **rysować** w czasie przeszłym.',
          kolumny: 3,
          linie: ['ja (Ola) [[rysowałam|24]]', 'ja (Kuba) [[rysowałem|24]]', 'ono (dziecko) [[rysowało|22]]'],
        },
      ],
    },
    {
      tytul: 'Zdanie i równoważnik zdania',
      wiedza: [
        '**Zdanie** ma czasownik w formie osobowej: Pies ==szczeka==. **Równoważnik zdania** go nie ma: Szczekanie psa. Uwaga: bezokolicznik to forma nieosobowa, więc „Nie hałasować!” to **równoważnik**.',
      ],
      zadania: [
        {
          polecenie: 'Wpisz **Z** (zdanie) albo **R** (równoważnik).',
          kolumny: 2,
          linie: ['[[R|8]] Piękna pogoda.', '[[Z|8]] Słońce świeci.', '[[R|8]] Nie deptać trawników!', '[[Z|8]] Uważaj na schodach!', '[[R|8]] Koniec lekcji.', '[[Z|8]] Zadzwonił dzwonek.'],
        },
        {
          polecenie: 'Zamień równoważniki w zdania.',
          linie: ['Wycieczka do zoo. ➜ [[np. Pojechaliśmy na wycieczkę do zoo.|90]]', 'Mróz za oknem. ➜ [[Za oknem jest mróz.|90]]'],
        },
        {
          polecenie: 'A teraz odwrotnie - zamień zdanie w równoważnik.',
          linie: ['Dzieci bawią się na boisku. ➜ [[Zabawa dzieci na boisku.|60]]'],
        },
      ],
    },
    {
      tytul: 'Plan ramowy',
      wiedza: [
        '**Plan ramowy** to najważniejsze wydarzenia, zapisane **po kolei**, w punktach i **bez szczegółów**. Punkty mają tę samą formę, najczęściej **równoważniki**: Ola ==zgubiła== psa ➜ ==Zgubienie== psa.',
      ],
      zadania: [
        {
          polecenie: 'Ponumeruj wydarzenia we właściwej kolejności.',
          kolumny: 2,
          linie: ['[[3|8]] Zbudowanie bałwana.', '[[1|8]] Pierwszy śnieg za oknem.', '[[4|8]] Powrót do domu na gorące kakao.', '[[2|8]] Wyjście na podwórko z sankami.'],
        },
        {
          polecenie: 'Zamień zdania na punkty planu.',
          linie: [
            'Chłopcy znaleźli w parku portfel. ➜ [[Znalezienie portfela w parku.|80]]',
            'Zanieśli go na policję. ➜ [[Oddanie portfela na policję.|80]]',
            'Właściciel podziękował chłopcom. ➜ [[Podziękowanie właściciela.|80]]',
          ],
        },
        {
          polecenie: 'Zakreśl punkt, który nie pasuje do planu ramowego wycieczki, bo jest szczegółem.',
          linie: ['{{Wyjazd nad morze.|*Niebieski ręcznik w paski.|Budowanie zamku z piasku.|Powrót do domu.}}'],
        },
      ],
    },
  ],
};
