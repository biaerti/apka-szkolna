// Karta pracy - klasa 4, rozdział II „Pośród słów i znaczeń”. 2 strony A4 do rozdania.
// Lekcja 2 tygodnia powtórki: zadania jak na sprawdzianie, ale własne przykłady - inne niż w puli
// sprawdzianu, filmikach, zeszycie, kartach „Ćwiczymy razem”, ćwiczeniach do domu i prezentacji powtórkowej.
// Lekcja 3: sprawdzanie na projektorze (public/materialy/karty/klasa4-rozdzial2-karta.html), przy każdym
// zadaniu „Info” z regułą i „Odpowiedź”.
// Generator: node materialy/karta.mjs klasa4-rozdzial2 -> karta (dla uczniów) i karta-rozwiazania (do wyświetlenia).
// Znaczniki jak w materialy/klasa4-rozdzial1/karta.mjs; w luce „a / b” = obie odpowiedzi dobre.

export const KARTA = {
  plik: 'klasa4-rozdzial2-karta',
  klasa: 'Klasa 4',
  tytul: 'Karta pracy - rozdział II',
  podtytul: 'Pośród słów i znaczeń',
  tematy: [
    {
      tytul: 'Wyrazy potoczne',
      wiedza: ['**Potoczne** mówimy na luzie, do kolegów. W szkole, do dorosłych i w wypracowaniu - **oficjalne**: ściema - ==kłamstwo==.'],
      zadania: [
        {
          polecenie: 'Zamień wyróżniony wyraz potoczny na oficjalny.',
          info: 'Zapytaj siebie: jak powiedziałbym to pani dyrektor? Wyraz oficjalny znaczy to samo, zmienia się tylko styl.',
          linie: [
            'Kuzyn **ściemnia**, że był w Paryżu. ➜ [[kłamie|30]]',
            '**Spoko**, pomogę ci. ➜ [[dobrze / w porządku|30]]',
            'Ola **wkręciła** mnie, że nie ma lekcji. ➜ [[oszukała / okłamała|30]]',
          ],
        },
      ],
    },
    {
      tytul: 'Porównanie',
      wiedza: ['Porównanie: **co opisuję + jak, jakby, niczym, niby + do czego porównuję**. Samo „jak” w pytaniu to nie porównanie.'],
      zadania: [
        {
          polecenie: 'Czy w zdaniu jest porównanie? Zakreśl.',
          info: 'Szukaj trzech części: co opisuję, słówko porównania i to, do czego porównuję. „Jak” na początku pytania niczego nie porównuje.',
          linie: [
            'Jego głos brzmiał jak dzwon. {{*tak|nie}}',
            'Jak zrobić latawiec? {{tak|*nie}}',
            'Szła powoli, niczym żółw. {{*tak|nie}}',
            'Mama robi pyszne pierogi. {{tak|*nie}}',
          ],
        },
      ],
    },
    {
      tytul: 'Synonimy i antonimy',
      wiedza: ['**Synonimy** - podobne znaczenie (smutny - markotny). **Antonimy** - przeciwne (wysoki - niski).'],
      zadania: [
        {
          polecenie: 'Dopisz synonim i antonim.',
          info: 'Synonim wstaw za wyraz w zdaniu - sens musi zostać ten sam. Antonim to słowo o przeciwnym znaczeniu. Dobrych synonimów jest kilka.',
          tabela: {
            naglowki: ['wyraz', 'synonim', 'antonim'],
            wiersze: [
              ['**mądry**', '[[np. bystry|28]]', '[[głupi|28]]'],
              ['**szybko**', '[[np. prędko|28]]', '[[wolno / powoli|28]]'],
              ['**smutek**', '[[np. żal|28]]', '[[radość|28]]'],
            ],
          },
        },
      ],
    },
    {
      tytul: 'List',
      wiedza: ['W liście o adresacie wielką literą: **Ty, Ciebie, Ci, Tobie, Twój**. O sobie małą: **ja, mnie, mój**.'],
      zadania: [
        {
          polecenie: 'Wpisz wyrazy z nawiasów poprawną literą.',
          info: 'Czy to słowo o osobie, do której piszesz (ty, twój)? Wtedy wielką literą - z szacunku. O sobie (ja, mój) - małą, chyba że zaczyna zdanie.',
          linie: [
            'Przesyłam [[Ci|12]] (ty) zdjęcia. Jestem na nich [[ja|12]] (ja) z psem.',
            'Czy [[Twój|16]] (twój) brat pływa? Buziaki dla [[Ciebie|18]] (ty)!',
          ],
        },
      ],
    },
    {
      tytul: 'Rzeczownik',
      wiedza: [
        'Rodzaj: **ten** - męski, **ta** - żeński, **to** - nijaki.',
        'W liczbie mnogiej: **ci** - męskoosobowy (tylko mężczyźni), **te** - niemęskoosobowy.',
      ],
      zadania: [
        {
          polecenie: 'Dopisz ten, ta, to, ci albo te i nazwij rodzaj.',
          info: 'Powiedz wyraz z ten, ta, to (liczba pojedyncza) albo z ci, te (liczba mnoga) i posłuchaj, co brzmi dobrze. „Ci” tylko przy mężczyznach.',
          tabela: {
            naglowki: ['rzeczownik', 'ten / ta / to / ci / te', 'rodzaj'],
            wiersze: [
              ['**koń**', '[[ten|16]]', '[[męski|30]]'],
              ['**kawa**', '[[ta|16]]', '[[żeński|30]]'],
              ['**zdjęcie**', '[[to|16]]', '[[nijaki|30]]'],
              ['**lekarze**', '[[ci|16]]', '[[męskoosobowy|30]]'],
              ['**myszy**', '[[te|16]]', '[[niemęskoosobowy|30]]'],
            ],
          },
        },
      ],
    },
    {
      tytul: 'Przypadki',
      wiedza: [
        '**M** kto? co? · **D** kogo? czego? · **C** komu? czemu? · **B** kogo? co? · **N** z kim? z czym? · **Ms** o kim? o czym? · **W** o!',
        'Zadaj pytanie od czasownika: Rysuję (czym?) ==kredką== - narzędnik.',
      ],
      zadania: [
        {
          polecenie: 'Zadaj pytanie o podkreślony wyraz i nazwij przypadek.',
          info: 'Znajdź czasownik i zadaj od niego pytanie o podkreślony wyraz. Pytanie podpowie przypadek: nie ma (czego?) mleka - dopełniacz.',
          tabela: {
            naglowki: ['zdanie', 'pytanie', 'przypadek'],
            wiersze: [
              ['Nie ma __mleka__.', '[[czego?|18]]', '[[dopełniacz|24]]'],
              ['Przyglądam się __mrówce__.', '[[komu? / czemu?|18]]', '[[celownik|24]]'],
              ['Rysuję __kredką__.', '[[czym?|18]]', '[[narzędnik|24]]'],
              ['Marzę o __rowerze__.', '[[o czym?|18]]', '[[miejscownik|24]]'],
              ['Na niebie widzę __tęczę__.', '[[co?|18]]', '[[biernik|24]]'],
              ['__Piotrusiu__, pomóż!', '[[o!|18]]', '[[wołacz|24]]'],
            ],
          },
        },
      ],
    },
    {
      tytul: 'Odmiana przez przypadki',
      wiedza: ['Wstaw wyraz po pomocniku: nie ma ==pszczoły==, przyglądam się ==pszczole==. Mianownik to forma ze słownika.'],
      zadania: [
        {
          polecenie: 'Odmień rzeczowniki przez przypadki.',
          info: 'Wstawiaj wyraz po pomocniku z lewej kolumny i powiedz całe zdanie na głos: nie ma (kogo? czego?) pszczoły...',
          tabela: {
            naglowki: ['przypadek', 'pszczoła', 'ząb'],
            wiersze: [
              ['**D** (nie ma)', '[[pszczoły|24]]', '[[zęba|24]]'],
              ['**C** (przyglądam się)', '[[pszczole|24]]', '[[zębowi|24]]'],
              ['**B** (widzę)', '[[pszczołę|24]]', '[[ząb|24]]'],
              ['**N** (z)', '[[pszczołą|24]]', '[[zębem|24]]'],
              ['**Ms** (o)', '[[pszczole|24]]', '[[zębie|24]]'],
              ['**W** (o!)', '[[pszczoło!|24]]', '[[zębie!|24]]'],
            ],
          },
        },
      ],
    },
    {
      tytul: 'Trudne formy i wołacz',
      wiedza: ['Dopełniacz liczby mnogiej często bez końcówki: nie ma ==kartek==. **Wołacz** - gdy wołamy: Ela - ==Elu==!'],
      zadania: [
        {
          polecenie: 'Popraw źle użyty wyraz.',
          info: 'Policz: jedna książka - pięć... (nie ma końcówki -ów). Przy wołaniu kogoś po imieniu użyj wołacza: Jacek - Jacku!',
          linie: [
            'Na półce stało pięć książków. ➜ [[książek|24]]',
            'Zjadłem kilka śliwków. ➜ [[śliwek|24]]',
            'Ela, chodź na obiad! ➜ [[Elu|24]]',
            'Jacek, oddaj piłkę! ➜ [[Jacku|24]]',
          ],
        },
      ],
    },
    {
      tytul: 'Fakt, opinia, argument',
      wiedza: ['**Fakt** da się sprawdzić, **opinia** to czyjeś zdanie. **Argument** mówi, dlaczego tak myślę: ...ponieważ...'],
      zadania: [
        {
          polecenie: 'Fakt czy opinia? Zakreśl.',
          info: 'Czy można to sprawdzić w książce, na mapie albo licząc? To fakt. Czy ktoś mógłby się nie zgodzić? To opinia.',
          kolumny: 2,
          linie: [
            'W Polsce są cztery pory roku. {{*fakt|opinia}}',
            'Pizza jest lepsza od zupy. {{fakt|*opinia}}',
            'Słoń to największe zwierzę lądowe. {{*fakt|opinia}}',
            'Zima to najgorsza pora roku. {{fakt|*opinia}}',
          ],
        },
        {
          polecenie: 'Dokończ zdania, podając dwa różne argumenty.',
          info: 'Argument odpowiada na pytanie „dlaczego?” i ma przekonać innych. „Bo tak” albo „bo lubię” to nie argument. Drugi argument musi mówić o czymś innym niż pierwszy.',
          linie: [
            'W szkole powinno być więcej wycieczek, ponieważ [[np. najlepiej uczymy się, oglądając rzeczy na żywo|90]]',
            'Poza tym [[np. na wycieczce klasa lepiej się poznaje i zaprzyjaźnia|90]]',
          ],
        },
      ],
    },
    {
      tytul: 'Asertywność',
      wiedza: ['**Asertywnie**: spokojnie mówię „nie”, mówię dlaczego i proponuję coś innego. **Nie, bo... Ale mogę...**'],
      zadania: [
        {
          polecenie: 'Kolega chce zjeść twój deser. Jaka to reakcja? Zakreśl.',
          info: 'Agresywna rani albo obraża. Uległa to zgoda wbrew sobie. Asertywna jest spokojna: „nie”, powód i propozycja.',
          linie: [
            '„Spadaj, to moje!” {{uległa|*agresywna|asertywna}}',
            '„No dobra, weź...” {{*uległa|agresywna|asertywna}}',
            '„Nie, bo jestem głodny. Dam ci jabłko.” {{uległa|agresywna|*asertywna}}',
          ],
        },
      ],
    },
    {
      tytul: 'Wielka czy mała litera?',
      wiedza: ['**Wielką** - nazwy własne (imiona, miasta, rzeki, morza). **Małą** - dni, miesiące.'],
      zadania: [
        {
          polecenie: 'W każdym zdaniu znajdź trzy błędy i wypisz te wyrazy poprawnie.',
          info: 'Szukaj imion ludzi i nazw miejsc - one zawsze wielką literą. Nazwa morza ma dwa wyrazy i oba piszemy wielką. Dni tygodnia i miesiące piszemy małą.',
          wLinii: true,
          linie: [
            'W maju jedziemy z ciocią basią nad morze bałtyckie, do gdyni.',
            '➜ [[Basią, Morze Bałtyckie, Gdyni|90]]',
            'We Wtorek Kuba pojedzie z tatą do krakowa nad wisłę.',
            '➜ [[wtorek, Krakowa, Wisłę|90]]',
          ],
        },
      ],
    },
    {
      tytul: '„Nie” z rzeczownikami',
      wiedza: ['Pytam o wyraz bez „nie”: **kto? co?** - razem (niepamięć), **co robi?** - osobno (nie patrz).'],
      zadania: [
        {
          polecenie: 'Zapisz poprawnie: razem czy osobno?',
          info: 'Zakryj „nie” i zapytaj o resztę wyrazu: kto? co? - rzeczownik, piszemy razem. Co robi? - czasownik, piszemy osobno.',
          kolumny: 2,
          linie: [
            '(nie)uwaga ➜ [[nieuwaga|26]]',
            '(nie)patrz ➜ [[nie patrz|26]]',
            '(nie)chęć ➜ [[niechęć|26]]',
            '(nie)chcą ➜ [[nie chcą|26]]',
            '(nie)pamięć ➜ [[niepamięć|26]]',
            '(nie)gadaj ➜ [[nie gadaj|26]]',
          ],
        },
      ],
    },
  ],
};
