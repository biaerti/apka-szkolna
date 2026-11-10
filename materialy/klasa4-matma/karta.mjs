// Karta z matematyki dla klasy 4 (dodatkowa, na lekcji polskiego - uczniowie poprosili o matmę).
// Same ciekawostki, których jeszcze nie było: sztuczka z mnożeniem przez 11, sposób Gaussa,
// kwadraty magiczne, cecha podzielności przez 3 i 9.
// Generator: node materialy/karta.mjs klasa4-matma

export const KARTA = {
  plik: 'klasa4-matma-sztuczki-karta',
  klasa: 'Klasa 4',
  tytul: 'Matematyczne sztuczki',
  podtytul: 'Licz szybciej niż kalkulator',
  tematy: [
    {
      tytul: 'Mnożenie przez 11 w pamięci',
      wiedza: [
        'Liczbę dwucyfrową mnożymy przez 11 tak: **rozsuwamy jej cyfry**, a w środek wpisujemy ich **sumę**.',
        '==36 · 11== → 3 _ 6 → 3 + 6 = 9 → **396**',
        'Gdy suma wyjdzie 10 albo więcej, jedynkę **dodajemy do pierwszej cyfry**: ==78 · 11== → 7 _ 8 → 7 + 8 = 15 → 7 + 1 = 8 → **858**',
      ],
      zadania: [
        {
          polecenie: 'Policz sztuczką, bez słupków.',
          kolumny: 3,
          linie: [
            '24 · 11 = [[264|14]]',
            '43 · 11 = [[473|14]]',
            '61 · 11 = [[671|14]]',
            '52 · 11 = [[572|14]]',
            '35 · 11 = [[385|14]]',
            '72 · 11 = [[792|14]]',
          ],
        },
        {
          polecenie: 'Teraz trudniej - suma cyfr przekracza 10. Pamiętaj o jedynce!',
          kolumny: 2,
          linie: [
            '47 · 11 = [[517|14]]',
            '68 · 11 = [[748|14]]',
            '59 · 11 = [[649|14]]',
            '86 · 11 = [[946|14]]',
          ],
        },
        {
          polecenie: 'Zagadka odwrotna: jaką liczbę pomnożono przez 11?',
          kolumny: 2,
          linie: [
            '[[54|12]] · 11 = 594',
            '[[23|12]] · 11 = 253',
          ],
        },
      ],
    },
    {
      tytul: 'Sposób małego Gaussa',
      wiedza: [
        'Jest taka historia: nauczyciel kazał klasie dodać wszystkie liczby od 1 do 100, żeby mieć chwilę spokoju. Mały Carl Gauss miał wynik po minucie!',
        'Jego sposób: łączymy liczby w **pary z dwóch końców**. Każda para daje **tyle samo**.',
        '==1 + 2 + 3 + ... + 10== → 1 + 10, 2 + 9, 3 + 8, 4 + 7, 5 + 6 → **5 par po 11** → 5 · 11 = **55**',
      ],
      zadania: [
        {
          polecenie: 'Policz sposobem Gaussa.',
          tabela: {
            naglowki: ['dodaj', 'ile daje jedna para?', 'ile jest par?', 'wynik'],
            wiersze: [
              ['1 + 2 + ... + 20', '[[21|14]]', '[[10|14]]', '[[210|16]]'],
              ['1 + 2 + ... + 100', '[[101|14]]', '[[50|14]]', '[[5050|18]]'],
              ['2 + 4 + 6 + ... + 20', '[[22|14]]', '[[5|14]]', '[[110|16]]'],
            ],
          },
        },
      ],
    },
    {
      tytul: 'Kwadrat magiczny',
      wiedza: [
        'W **kwadracie magicznym** suma liczb w każdym **wierszu**, każdej **kolumnie** i na obu **przekątnych** jest taka sama. To **suma magiczna**.',
        'Najsłynniejszy kwadrat ma ponad 2000 lat i pochodzi z Chin. Jego suma magiczna to **15**.',
      ],
      zadania: [
        {
          polecenie: 'Suma magiczna to **15**. Uzupełnij kwadrat.',
          tabela: {
            wiersze: [
              ['4', '[[9|10]]', '2'],
              ['[[3|10]]', '5', '7'],
              ['8', '[[1|10]]', '[[6|10]]'],
            ],
          },
        },
        {
          polecenie: 'Ten kwadrat ma sumę magiczną **30**. Uzupełnij go.',
          tabela: {
            wiersze: [
              ['[[8|10]]', '18', '4'],
              ['6', '10', '[[14|10]]'],
              ['[[16|10]]', '2', '[[12|10]]'],
            ],
          },
        },
        {
          polecenie: 'Popatrz na oba kwadraty. Co się stało z liczbami, gdy suma zmieniła się z 15 na 30?',
          linie: ['[[Każda liczba jest dwa razy większa (pomnożona przez 2).|110]]'],
        },
      ],
    },
    {
      tytul: 'Czy dzieli się przez 3 i przez 9?',
      wiedza: [
        'Nie musisz dzielić! Wystarczy **dodać cyfry** liczby.',
        'Jeśli **suma cyfr** dzieli się przez **3**, cała liczba też: ==471== → 4 + 7 + 1 = 12 → dzieli się przez 3.',
        'Tak samo z **9**: ==819== → 8 + 1 + 9 = 18 → dzieli się przez 9.',
      ],
      zadania: [
        {
          polecenie: 'Dodaj cyfry i zakreśl odpowiedź.',
          tabela: {
            naglowki: ['liczba', 'suma cyfr', 'dzieli się przez 3?', 'dzieli się przez 9?'],
            wiersze: [
              ['126', '[[9|12]]', '{{*tak|nie}}', '{{*tak|nie}}'],
              ['254', '[[11|12]]', '{{tak|*nie}}', '{{tak|*nie}}'],
              ['507', '[[12|12]]', '{{*tak|nie}}', '{{tak|*nie}}'],
              ['3456', '[[18|12]]', '{{*tak|nie}}', '{{*tak|nie}}'],
              ['1001', '[[2|12]]', '{{tak|*nie}}', '{{tak|*nie}}'],
            ],
          },
        },
        {
          polecenie: 'Wpisz brakującą cyfrę tak, żeby liczba dzieliła się przez **9**.',
          kolumny: 4,
          linie: [
            '5 [[3|8]] 1',
            '2 [[8|8]] 8',
            '6 [[8|8]] 4',
            '1 [[1|8]] 7',
          ],
        },
        {
          polecenie: 'Ola ma 156 cukierków. Czy może podzielić je po równo między siebie i dwie koleżanki, tak żeby nic nie zostało?',
          linie: ['suma cyfr: [[12|10]] → {{*tak|nie}}, każda dostanie [[52|10]] cukierki'],
        },
      ],
    },
    {
      tytul: 'Mnożenie przez 5 i 50',
      wiedza: [
        'Mnożyć przez 5 jest trudno, a przez 10 łatwo. A 5 to **połowa** z 10!',
        'Więc: **pomnóż przez 10, potem podziel na pół**. ==48 · 5== → 480 : 2 = **240**',
        'Przez 50: **pomnóż przez 100 i podziel na pół**. ==36 · 50== → 3600 : 2 = **1800**',
      ],
      zadania: [
        {
          polecenie: 'Policz sztuczką. Najpierw wpisz wynik razy 10 (albo razy 100).',
          kolumny: 2,
          linie: [
            '64 · 5 → [[640|14]] : 2 = [[320|14]]',
            '86 · 5 → [[860|14]] : 2 = [[430|14]]',
            '128 · 5 → [[1280|16]] : 2 = [[640|14]]',
            '42 · 50 → [[4200|16]] : 2 = [[2100|16]]',
          ],
        },
        {
          polecenie: 'Bilet do kina kosztuje 5 zł. Ile zapłaci cała szkoła za 246 biletów?',
          linie: ['246 · 5 → [[2460|16]] : 2 = [[1230|16]] zł'],
        },
      ],
    },
    {
      tytul: 'Liczby kwadratowe',
      wiedza: [
        'Liczby **1, 4, 9, 16...** to **liczby kwadratowe** - z tylu kropek da się ułożyć kwadrat: 2 · 2 = 4, 3 · 3 = 9, 4 · 4 = 16.',
        'Ciekawostka: dodawaj po kolei **liczby nieparzyste**, a zawsze wyjdzie liczba kwadratowa! ==1 + 3 + 5 = 9 = 3 · 3==',
        'Ile liczb dodasz, taki będzie bok kwadratu.',
      ],
      zadania: [
        {
          polecenie: 'Sprawdź ciekawostkę. Uzupełnij.',
          linie: [
            '1 + 3 + 5 + 7 = [[16|12]] = [[4|8]] · [[4|8]]',
            '1 + 3 + 5 + 7 + 9 = [[25|12]] = [[5|8]] · [[5|8]]',
            '1 + 3 + 5 + 7 + 9 + 11 + 13 = [[49|12]] = [[7|8]] · [[7|8]]',
          ],
        },
        {
          polecenie: 'Bez dodawania: ile wynosi suma **dziesięciu** pierwszych liczb nieparzystych (1 + 3 + ... + 19)?',
          linie: ['[[10|8]] · [[10|8]] = [[100|12]]'],
        },
      ],
    },
  ],
};
