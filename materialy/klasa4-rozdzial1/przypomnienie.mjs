// Powtórka rozdziału I na 1 stronę A4 - klasa 4, dla piszących sprawdzian z rozdziału II.
// Czytanie ze zrozumieniem (własny tekst) + zadania z rozdziału I na przykładach z tego tekstu.
// Generator: node materialy/karta.mjs klasa4-rozdzial1 przypomnienie.mjs
//   -> output/materialy/klasa4-rozdzial1-przypomnienie(-rozwiazania).pdf
//   + public/materialy/karty/klasa4-rozdzial1-przypomnienie.html (na projektor).
// Znaczniki jak w karta.mjs: [[luka]], {{a|*b}}, ((podkreśl)).

const TEKST = [
  '**Zguba**',
  'W sobotę rano obudził mnie telefon. Dzwoniła babcia Hela. Zgubiła klucze i nie mogła wejść do mieszkania. Szybko się ubrałem, wsiadłem na rower i pojechałem na drugi koniec osiedla.',
  'Babcia siedziała na zimnej ławce przed blokiem. Razem przeszukaliśmy trawnik, schody i skrzynkę na listy. Kluczy nigdzie nie było. Babcia westchnęła i usiadła z powrotem na ławce. Wtedy coś cicho zabrzęczało.',
  '- Babciu, ty dzwonisz! - zawołałem.',
  'Babcia sięgnęła do kieszeni starego płaszcza. Kieszeń była dziurawa, a klucze schowały się pod podszewką. Przez cały czas babcia nosiła je ze sobą!',
  'Na pocieszenie upiekła mi pyszną, puszystą szarlotkę.',
];

export const KARTA = {
  plik: 'klasa4-rozdzial1-przypomnienie',
  klasa: 'Klasa 4',
  tytul: 'Przypomnij sobie rozdział I',
  podtytul: 'Poznajemy siebie i innych',
  wstep: 'Przeczytaj tekst „Zguba” i rozwiąż zadania. Wszystkie przykłady pochodzą z tego tekstu.',
  tematy: [
    {
      tytul: 'Czytamy ze zrozumieniem',
      wiedza: TEKST,
      zadania: [
        {
          polecenie: 'Uzupełnij świat przedstawiony.',
          info: '**Świat przedstawiony**: czas (kiedy?), miejsce (gdzie?), bohaterowie (kto?), wydarzenia (co się stało?).',
          tabela: {
            naglowki: ['czas', 'miejsce', 'bohaterowie'],
            wiersze: [['[[sobota rano|28]]', '[[osiedle, ławka przed blokiem|38]]', '[[wnuk (narrator) i babcia Hela|38]]']],
          },
        },
        {
          polecenie: 'Kto opowiada tę historię? Zakreśl i napisz, po czym to poznajesz.',
          wLinii: true,
          info: '**Narrator-bohater** mówi o sobie (poszedłem, zobaczyłam), **narrator-obserwator** o innych (Ania poszła). W wierszu mówi **podmiot liryczny**.',
          linie: [
            '{{*narrator-bohater|narrator-obserwator|podmiot liryczny}}',
            'Poznaję po tym, że [[np. mówi o sobie: obudził mnie, pojechałem, zawołałem|90]]',
          ],
        },
        {
          polecenie: 'Prawda czy fałsz? Zakreśl.',
          linie: [
            'Babcia zostawiła klucze u sąsiadki. {{prawda|*fałsz}}',
            'Wnuk przyjechał do babci rowerem. {{*prawda|fałsz}}',
            'Klucze przez cały czas były w płaszczu babci. {{*prawda|fałsz}}',
          ],
        },
        {
          polecenie: 'Ponumeruj punkty planu ramowego we właściwej kolejności.',
          info: '**Plan ramowy**: najważniejsze wydarzenia po kolei, bez szczegółów, najczęściej równoważnikami zdań.',
          kolumny: 2,
          linie: [
            '[[3|8]] Poszukiwanie kluczy.',
            '[[1|8]] Telefon od babci.',
            '[[5|8]] Szarlotka na pocieszenie.',
            '[[2|8]] Jazda rowerem do babci.',
            '[[4|8]] Klucze pod podszewką.',
          ],
        },
        {
          polecenie: 'Jaka była? Jaki był? Wypisz z tekstu epitety.',
          info: '**Epitet** określa rzeczownik i odpowiada na pytanie jaki? jaka? jakie?',
          wLinii: true,
          linie: ['ławka ➜ [[zimna|16]]   płaszcz ➜ [[stary|16]]   szarlotka ➜ [[pyszna, puszysta|30]]'],
        },
      ],
    },
    {
      tytul: 'Czasownik',
      wiedza: [
        '**Czasownik** mówi, co ktoś robi albo co się z nim dzieje. Odmienia się przez **osobę**, **liczbę**, **czas**, a w czasie przeszłym też przez **rodzaj** (męskoosobowy: zrobili, niemęskoosobowy: zrobiły).',
        '**Nie** z czasownikiem piszemy **osobno**.',
      ],
      zadania: [
        {
          polecenie: 'Uzupełnij tabelę. Czasowniki pochodzą z tekstu.',
          tabela: {
            naglowki: ['czasownik', 'osoba', 'liczba', 'czas', 'rodzaj'],
            wiersze: [
              ['**pojechałem**', '[[1.|10]]', '[[pojedyncza|22]]', '[[przeszły|20]]', '[[męski|28]]'],
              ['**przeszukaliśmy**', '[[1.|10]]', '[[mnoga|22]]', '[[przeszły|20]]', '[[męskoosobowy|28]]'],
              ['**schowały się**', '[[3.|10]]', '[[mnoga|22]]', '[[przeszły|20]]', '[[niemęskoosobowy|28]]'],
            ],
          },
        },
        {
          polecenie: 'Napisz poprawnie.',
          wLinii: true,
          linie: ['(nie)mogła ➜ [[nie mogła|17]]   (nie)znalazł ➜ [[nie znalazł|18]]   (nie)szukaj ➜ [[nie szukaj|17]]'],
        },
      ],
    },
    {
      tytul: 'Zdanie i równoważnik',
      wiedza: [
        '**Zdanie** ma czasownik w formie osobowej: Babcia ==westchnęła==. **Równoważnik zdania** go nie ma: Telefon od babci.',
      ],
      zadania: [
        {
          polecenie: 'Wpisz **Z** (zdanie) albo **R** (równoważnik).',
          kolumny: 2,
          linie: ['[[Z|8]] Kluczy nigdzie nie było.', '[[R|8]] Zguba babci.', '[[R|8]] Dziura w kieszeni.', '[[Z|8]] Coś cicho zabrzęczało.'],
        },
        {
          polecenie: 'Zamień zdanie w równoważnik.',
          wLinii: true,
          linie: ['Babcia upiekła szarlotkę. ➜ [[Upieczenie szarlotki.|60]]'],
        },
      ],
    },
    {
      tytul: 'Głoska, litera, sylaba',
      wiedza: [
        '**Literę** widzimy, **głoskę** słyszymy (sz, cz, rz, ch, dz to jedna głoska). **Sylaba** ma jedną samogłoskę.',
      ],
      zadania: [
        {
          polecenie: 'Policz litery, głoski i sylaby.',
          tabela: {
            naglowki: ['wyraz', 'litery', 'głoski', 'sylaby'],
            wiersze: [
              ['**klucze**', '[[6|12]]', '[[5|12]]', '[[2|12]]'],
              ['**szarlotka**', '[[9|12]]', '[[8|12]]', '[[3|12]]'],
            ],
          },
        },
        {
          polecenie: 'Podziel na sylaby.',
          kolumny: 2,
          linie: ['podszewka ➜ [[pod-szew-ka|28]]', 'skrzynka ➜ [[skrzyn-ka|28]]'],
        },
      ],
    },
  ],
};
