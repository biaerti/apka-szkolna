// Ćwiczenia do domu przed sprawdzianem - klasa 5, dział 2 „Uwaga, uczucia!”.
// Link idzie do VULCANA razem z zapowiedzią sprawdzianu: uczeń wypełnia w przeglądarce
// (przycisk „Sprawdź” przy zadaniu) albo drukuje PDF. Typy zadań i kolejność tematów jak na sprawdzianie,
// ale własne przykłady - inne niż w puli sprawdzianu, filmikach, zeszycie i karcie pracy.
// Generator: node materialy/karta.mjs klasa5-dzial2 domowe.mjs
//   -> public/materialy/karty/klasa5-dzial2-domowe.html i public/materialy/klasa5-dzial2-domowe.pdf
// Znaczniki jak w materialy/klasa4-rozdzial1/karta.mjs; w luce „a / b” = obie odpowiedzi dobre.

export const KARTA = {
  plik: 'klasa5-dzial2-domowe',
  domowa: true,
  klasa: 'Klasa 5',
  tytul: 'Poćwicz przed sprawdzianem',
  podtytul: 'Dział 2 - Uwaga, uczucia!',
  wstep: 'Przy każdym temacie najpierw przeczytaj kolorową ramkę z regułą, potem zrób zadania. Wpisuj w luki i klikaj odpowiedzi. Nie wiesz, jak zacząć? Kliknij **Info** przy zadaniu. Kiedy skończysz zadanie, kliknij **Sprawdź**: zielone jest dobrze, czerwone pokaże poprawną odpowiedź. Na sprawdzianie będą bardzo podobne zadania!',
  tematy: [
    {
      tytul: 'Porównanie i przenośnia',
      wiedza: [
        '**Porównanie** ma słówko **jak, jakby, niczym, niby**: lekki ==jak piórko==.',
        '**Przenośnia** nie ma słówka - wyrazy razem znaczą coś nowego, nie dosłownie: ==złote serce==.',
      ],
      zadania: [
        {
          polecenie: 'Porównanie czy przenośnia? Zakreśl.',
          info: 'Szukaj słówka **jak, jakby, niczym, niby**. Jest? To porównanie. Nie ma, a narysowane dosłownie byłoby bzdurą? To przenośnia.',
          przyklad: [
            'Mknął jak pocisk.',
            'Jest słówko ==jak== ➜ **porównanie**.',
            'Z oczu sypały mu się iskry.',
            'Nie ma słówka, a dosłownie to bzdura ➜ ==przenośnia==.',
          ],
          linie: [
            'Była lekka niczym piórko. {{*porównanie|przenośnia}}',
            'Tata ma gołębie serce. {{porównanie|*przenośnia}}',
            'Na niebie płonął zachód słońca. {{porównanie|*przenośnia}}',
            'Ryczał, jakby był lwem. {{*porównanie|przenośnia}}',
            'Mróz szczypał nas w policzki. {{porównanie|*przenośnia}}',
          ],
        },
      ],
    },
    {
      tytul: 'Związki frazeologiczne',
      wiedza: [
        '**Związek frazeologiczny** to stałe połączenie wyrazów o przenośnym znaczeniu. Nie rozumiemy go dosłownie: dać nogę = ==uciec==.',
        'Wiele z nich mówi o **uczuciach**: skakać z radości, trząść się ze strachu.',
      ],
      zadania: [
        {
          polecenie: 'Zakreśl prawdziwe znaczenie.',
          info: 'Nie czytaj dosłownie. Zapytaj: co by to znaczyło, gdyby ktoś tak powiedział o koledze?',
          linie: [
            'mieć węża w kieszeni {{hodować węża|*być skąpym}}',
            'wziąć nogi za pas {{*szybko uciec|zapiąć pasek}}',
            'ugryźć się w język {{*powstrzymać się od powiedzenia czegoś|skaleczyć się przy jedzeniu}}',
            'mieć klapki na oczach {{nosić okulary przeciwsłoneczne|*nie widzieć innych racji}}',
          ],
        },
        {
          polecenie: 'Jakie uczucie opisuje frazeologizm? Zakreśl.',
          info: 'Wyobraź sobie tę osobę. Co czuje ktoś, komu krew się gotuje? A ktoś, komu krew zastygła w żyłach?',
          linie: [
            'Krew się w nim zagotowała, kiedy ktoś zajął jego miejsce. {{strach|wstyd|*złość|radość}}',
            'Gdy usłyszała kroki w ciemnym domu, krew zastygła jej w żyłach. {{*strach|wstyd|złość|radość}}',
            'Spłonął rumieńcem, gdy pani przeczytała jego liścik na głos. {{strach|*wstyd|złość|radość}}',
            'Na widok szczeniaka oczy jej się zaświeciły. {{strach|wstyd|złość|*radość}}',
          ],
        },
      ],
    },
    {
      tytul: 'Wyrazy nacechowane emocjonalnie',
      wiedza: [
        '**Zdrobnienie** - małe albo czule: domek (**-ek, -ka, -ko**). **Zgrubienie** - duże albo żartem, z niechęcią: domisko (**-isko**).',
        'Uczucia mają różną **siłę**: niepokój ➜ strach ➜ groza.',
      ],
      zadania: [
        {
          polecenie: 'Utwórz zdrobnienie i zgrubienie.',
          info: 'Zdrobnienie: dodaj -ek, -ka, -ko (czasem głoski się zmieniają: ręka - rączka). Zgrubienie: dodaj -isko, -sko. Powiedz na głos, czy brzmi dobrze.',
          przyklad: [
            'pies',
            'małe, czule: ==piesek==',
            'duże, żartem: ==psisko==',
          ],
          tabela: {
            naglowki: ['wyraz', 'zdrobnienie', 'zgrubienie'],
            wiersze: [
              ['**ząb**', '[[ząbek|26]]', '[[zębisko|26]]'],
              ['**drzewo**', '[[drzewko|26]]', '[[drzewisko|26]]'],
              ['**głowa**', '[[główka|26]]', '[[głowisko / łepetyna|26]]'],
            ],
          },
        },
        {
          polecenie: 'Ponumeruj uczucia od najsłabszego (1) do najsilniejszego (3).',
          info: 'Wyobraź sobie, co czujesz w każdej sytuacji. Które uczucie jest ledwo, ledwo? To 1. Które tak mocne, że nie da się wytrzymać? To 3.',
          linie: [
            '[[2|6]] smutek  [[3|6]] rozpacz  [[1|6]] przykrość',
            '[[3|6]] zachwyt  [[1|6]] zadowolenie  [[2|6]] radość',
          ],
        },
      ],
    },
    {
      tytul: 'Przypadki',
      wiedza: [
        '**M** kto? co? · **D** kogo? czego? · **C** komu? czemu? · **B** kogo? co? · **N** z kim? z czym? · **Ms** o kim? o czym? · **W** o!',
        'Jak rozpoznać? Zadaj pytanie od czasownika: Szukam (czego?) ==kluczy== - dopełniacz.',
      ],
      zadania: [
        {
          polecenie: 'Zadaj pytanie o podkreślony rzeczownik i nazwij przypadek.',
          info: 'Znajdź czasownik i zadaj od niego pytanie o podkreślony wyraz: Dziękuję (komu?) babci - celownik. Pytanie podpowie przypadek. Wpisz pełną nazwę przypadku.',
          przyklad: [
            'Gram z __siostrą__.',
            'Czasownik: ==gram==. Gram (z kim?) z siostrą.',
            'z kim? z czym? ➜ **narzędnik**',
          ],
          tabela: {
            naglowki: ['zdanie', 'pytanie', 'przypadek'],
            wiersze: [
              ['Szukam __kluczy__.', '[[czego?|20]]', '[[dopełniacz|26]]'],
              ['Dziękuję __babci__.', '[[komu?|20]]', '[[celownik|26]]'],
              ['Kupiłem __gazetę__.', '[[co?|20]]', '[[biernik|26]]'],
              ['Maluję __pędzlem__.', '[[czym? / z czym?|20]]', '[[narzędnik|26]]'],
              ['Marzę o __rowerze__.', '[[o czym?|20]]', '[[miejscownik|26]]'],
              ['__Słońce__ świeci.', '[[co?|20]]', '[[mianownik|26]]'],
            ],
          },
        },
      ],
    },
    {
      tytul: 'Nazwy własne',
      wiedza: [
        '**Wielką** literą: imiona i nazwiska, imiona zwierząt (Reksio), miasta, państwa, rzeki, góry, planety, tytuły („Hobbit”).',
        '**Małą**: nazwy pospolite (kot, rzeka, góry), dni tygodnia i miesiące.',
      ],
      zadania: [
        {
          polecenie: 'Zakreśl poprawny zapis.',
          info: 'Wielką literą piszemy **nazwy własne** - imię jednej osoby, zwierzęcia albo miejsca (Tatry, Mars, Francja). Dni tygodnia, miesiące i zwykłe słowa (rzeka, góry) - małą.',
          kolumny: 2,
          linie: ['{{*Tatry|tatry}}', '{{Środa|*środa}}', '{{*Mars|mars}}', '{{Grudzień|*grudzień}}', '{{*Francja|francja}}', '{{Rzeka|*rzeka}} Odra'],
        },
        {
          polecenie: 'W zdaniu są trzy błędy w pisowni wielką i małą literą. Podkreśl źle zapisane wyrazy.',
          info: 'Szukaj imion ludzi, imion zwierząt i nazw miejsc - one zawsze wielką literą. Sprawdź też, czy jakieś zwykłe słowo nie dostało wielkiej litery bez powodu.',
          linie: ['W wakacje ((zosia)) i jej kot ((filemon)) zwiedzili ((gdańsk)), a potem pojechali nad morze.'],
        },
      ],
    },
    {
      tytul: 'Nietypowa odmiana',
      wiedza: [
        'Rzeczowniki na **-um** w liczbie pojedynczej się nie odmieniają: to muzeum, w ==muzeum==.',
        'Niektóre mają **tylko lp.** (odwaga, mleko), inne **tylko lm.** (drzwi, sanie): nie ma ==drzwiów==, tylko ==drzwi==.',
      ],
      zadania: [
        {
          polecenie: 'Popraw źle użyty wyraz.',
          info: 'Wyraz na **-um** zostaje taki sam: to oceanarium, w oceanarium. Przy wyrazach tylko w lm. sprawdź formę: nie ma (czego?) drzwi.',
          linie: [
            'Pojechaliśmy do „oceanariumu”. ➜ [[oceanarium|26]]',
            'Napisałem post na „forumie” klasy. ➜ [[forum|26]]',
            'Zgubiłem klucze od „drzwiów”. ➜ [[drzwi|26]]',
          ],
        },
        {
          polecenie: 'Tylko liczba pojedyncza czy tylko mnoga? Zakreśl.',
          info: 'Powiedz „jeden ...” i „dwa ...”. Nie da się powiedzieć „jeden szach”? To tylko lm. Nie ma „dwa lenistwa”? To tylko lp.',
          kolumny: 2,
          linie: [
            'szachy {{tylko lp.|*tylko lm.}}',
            'lenistwo {{*tylko lp.|tylko lm.}}',
            'nosze {{tylko lp.|*tylko lm.}}',
            'zdrowie {{*tylko lp.|tylko lm.}}',
          ],
        },
      ],
    },
    {
      tytul: 'Ę i ą na końcu wyrazu',
      wiedza: [
        '**-ę**: widzę kogo? co? (==mamę==), ja (==piszę==), małe zwierzę (==kocię==).',
        '**-ą**: z kim? z czym? (==z mamą==), oni (==piszą==).',
      ],
      zadania: [
        {
          polecenie: 'Dopisz ę albo ą.',
          info: 'Zadaj pytanie: widzę co? - ę, z kim? z czym? - ą. Przy czasowniku: ja - ę, oni - ą.',
          kolumny: 2,
          linie: [
            'Oglądam ciekawą bajk[[ę|8]].',
            'Spaceruję z ciotk[[ą|8]].',
            'Dzieci biegaj[[ą|8]] po boisku.',
            'Ja rysuj[[ę|8]] konia.',
            'Na łące pasie się jagni[[ę|8]].',
            'Piszę długopisem i kredk[[ą|8]].',
          ],
        },
      ],
    },
    {
      tytul: 'Ó czy u?',
      wiedza: ['**Ó** piszę, gdy w innej formie albo w wyrazie z rodziny jest **o**: stół - ==stoły==, kółko - ==koło==.'],
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
            'pr[[ó|6]]g ➜ [[progi|22]]',
            'm[[ó|6]]j ➜ [[moja / moi|22]]',
            'sł[[ó|6]]j ➜ [[słoje|22]]',
            'b[[ó|6]]r ➜ [[bory|22]]',
          ],
        },
      ],
    },
    {
      tytul: 'Dwukropek',
      wiedza: ['Dwukropek stawiam przed **dialogiem**, przed **wyliczeniem** (po zapowiedzi: trzy owoce:) i przed **cytatem** albo napisem.'],
      zadania: [
        {
          polecenie: 'Czy w miejscu ▢ trzeba postawić dwukropek? Zakreśl.',
          info: 'Coś zaraz nastąpi: czyjaś wypowiedź, wyliczenie po zapowiedzi (cztery rzeczy, następujące) albo napis? Wtedy dwukropek. Inaczej - nic.',
          linie: [
            'Do plecaka włożyłam cztery rzeczy ▢ książkę, latarkę, wodę i bluzę. {{*tak|nie}}',
            'Siostra szepnęła ▢ – Ktoś puka do drzwi. {{*tak|nie}}',
            'Jutro jedziemy ▢ nad morze. {{tak|*nie}}',
            'Na pudełku napisano ▢ „Ostrożnie, szkło!”. {{*tak|nie}}',
            'Kupiłem ▢ nowy zeszyt. {{tak|*nie}}',
          ],
        },
      ],
    },
    {
      tytul: 'Tekst reklamowy',
      wiedza: ['**Reklama** namawia do kupna: hasło, wykrzykniki, słowa-wabiki (**nowość, gratis, taniej**), pośpiech (**tylko dziś**) i obietnice bez pokrycia.'],
      zadania: [
        {
          polecenie: 'Podkreśl cztery słowa albo zwroty, które namawiają do kupna.',
          info: 'Szukaj słów-wabików (okazja, gratis, taniej), pośpiechu (tylko teraz, ostatnie sztuki) i obietnic.',
          linie: ['Hulajnoga Błyskawica - pojedziesz szybciej niż wiatr! ((Super okazja))! ((Tylko teraz)) kask ((gratis))! ((Ostatnie sztuki))!'],
        },
        {
          polecenie: 'Co obiecuje ta reklama? Czy to na pewno prawda?',
          info: 'Obietnica to to, co według reklamy zyskasz. Zastanów się, czy hulajnoga naprawdę to daje.',
          wLinii: true,
          linie: ['➜ [[np. że pojadę szybciej niż wiatr - to przesada, hulajnoga tak szybko nie jeździ|100]]'],
        },
      ],
    },
    {
      tytul: 'Sprawozdanie',
      wiedza: [
        '**Wstęp**: kto? co? kiedy? gdzie? **Przebieg** po kolei (najpierw, potem, na koniec). **Zakończenie**: krótka opinia.',
        'Piszemy w **czasie przeszłym**.',
      ],
      zadania: [
        {
          polecenie: 'Z której części sprawozdania jest zdanie? Zakreśl.',
          info: 'Mówi, kto, gdzie i kiedy? Wstęp. Opisuje, co się działo po kolei? Przebieg. Mówi, jak mi się podobało? Zakończenie.',
          linie: [
            'W niedzielę cała rodzina pojechała na grzybobranie do lasu. {{*wstęp|przebieg|zakończenie}}',
            'Najpierw szukaliśmy grzybów pod sosnami. {{wstęp|*przebieg|zakończenie}}',
            'Wróciłam zmęczona, ale bardzo zadowolona. {{wstęp|przebieg|*zakończenie}}',
            'Potem tata rozpalił ognisko. {{wstęp|*przebieg|zakończenie}}',
          ],
        },
        {
          polecenie: 'Napisz krótkie sprawozdanie (4-5 zdań) **z urodzin** (swoich albo kolegi). We wstępie napisz: kto? co? kiedy? gdzie? W przebiegu użyj słów **najpierw** i **potem**. Na koniec dodaj swoją **opinię**. W jednym zdaniu postaw **dwukropek** przed wyliczeniem.',
          info: 'Po kolei: 1) wstęp - kto, co, kiedy, gdzie; 2) najpierw..., potem... (tu wylicz coś z dwukropkiem: zagraliśmy w trzy gry: ...); 3) jak ci się podobało i dlaczego. Kliknij **Sprawdź**, żeby zobaczyć przykład.',
          pisanie: 5,
          wzor: 'np. W sobotę w kręgielni odbyły się urodziny mojego kolegi Adama. Najpierw zagraliśmy w kręgle. Potem Adam rozpakował trzy prezenty: książkę, piłkę i grę. Na koniec zjedliśmy tort czekoladowy. To było bardzo udane przyjęcie, bo wszyscy dobrze się bawili.',
        },
      ],
    },
  ],
};
