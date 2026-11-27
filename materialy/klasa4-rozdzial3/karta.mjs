// Karta pracy - klasa 4, rozdział III: części mowy, przymiotnik i przysłówek, odmiana pary przez przypadki.
// 2 strony A4 do rozdania (Bartek 2026-11-26: „części mowy na grubo”): najpierw pytanie ➜ nazwa części mowy,
// potem przymiotnik czy przysłówek, na koniec przymiotnik z rzeczownikiem w przypadkach i własne zdania.
// Własne przykłady - inne niż w filmikach i kartach „Ćwiczymy razem” (src/data/cwiczenia4rozdzial3.ts).
// Sprawdzanie na projektorze: public/materialy/karty/klasa4-rozdzial3-karta.html („Info” + „Odpowiedź”).
// Generator: node materialy/karta.mjs klasa4-rozdzial3 -> karta (dla uczniów) i karta-rozwiazania (do wyświetlenia),
// potem python materialy/wyslij.py klasa4-rozdzial3.
// Znaczniki jak w materialy/klasa4-rozdzial1/karta.mjs; w luce „a / b” = obie odpowiedzi dobre.

export const KARTA = {
  plik: 'klasa4-rozdzial3-karta',
  klasa: 'Klasa 4',
  tytul: 'Części mowy i odmiana',
  podtytul: 'rzeczownik, czasownik, przymiotnik, przysłówek',
  tematy: [
    {
      tytul: 'Zadaj pytanie - poznasz część mowy',
      wiedza: [
        'Nie zgaduj - **zapytaj o wyraz**:',
        '**kto? co?** ➜ ==rzeczownik== (mama, rower)',
        '**co robi? co się dzieje?** ➜ ==czasownik== (biega, pada)',
        '**jaki? jaka? jakie?** ➜ ==przymiotnik== (szybki, mokra)',
        '**jak?** ➜ ==przysłówek== (szybko, mokro)',
      ],
      zadania: [
        {
          polecenie: 'Zadaj pytanie, na które odpowiada wyraz. Potem nazwij część mowy.',
          info: 'Wstaw wyraz do pytań po kolei: kto? co? / co robi? / jaki? / jak? Pytanie, które pasuje, mówi, jaka to część mowy.',
          przyklad: [
            'Wyraz: **piszczy**',
            'Kto? co? piszczy - nie pasuje.',
            'Co robi? ==piszczy== - pasuje!',
            'Pytanie „co robi?” ➜ ==czasownik==',
          ],
          tabela: {
            naglowki: ['wyraz', 'pytanie', 'część mowy'],
            wiersze: [
              ['**chmura**', '[[co?|30]]', '[[rzeczownik|34]]'],
              ['**pochmurny**', '[[jaki?|30]]', '[[przymiotnik|34]]'],
              ['**pochmurno**', '[[jak?|30]]', '[[przysłówek|34]]'],
              ['**grzmi**', '[[co się dzieje? / co robi?|30]]', '[[czasownik|34]]'],
              ['**sąsiadka**', '[[kto?|30]]', '[[rzeczownik|34]]'],
              ['**uprzejmie**', '[[jak?|30]]', '[[przysłówek|34]]'],
              ['**uprzejma**', '[[jaka?|30]]', '[[przymiotnik|34]]'],
              ['**gotuje**', '[[co robi?|30]]', '[[czasownik|34]]'],
            ],
          },
        },
        {
          polecenie: 'Podpisz każdy wyraz w zdaniu: rz. (rzeczownik), cz. (czasownik), przym. (przymiotnik), przysł. (przysłówek).',
          info: 'Bierz wyrazy po kolei i do każdego zadaj pytanie. Przymiotnik pytasz od rzeczownika (jaki pies?), przysłówek od czasownika (jak szczeka?).',
          przyklad: [
            'Rudy kot leniwie ziewa.',
            'Kto? ==kot== ➜ rz. · Jaki kot? ==rudy== ➜ przym.',
            'Co robi kot? ==ziewa== ➜ cz.',
            'Jak ziewa? ==leniwie== ➜ przysł.',
          ],
          linie: [
            'Mały [[przym.|14]] pies [[rz.|12]] głośno [[przysł.|14]] szczeka [[cz.|12]].',
            'Wesoła [[przym.|14]] babcia [[rz.|12]] szybko [[przysł.|14]] tańczy [[cz.|12]].',
            'Zimny [[przym.|14]] wiatr [[rz.|12]] mocno [[przysł.|14]] wieje [[cz.|12]].',
            'Ostrożny [[przym.|14]] kierowca [[rz.|12]] powoli [[przysł.|14]] hamuje [[cz.|12]].',
          ],
        },
      ],
    },
    {
      tytul: 'Przymiotnik czy przysłówek?',
      wiedza: [
        '**Przymiotnik** opisuje **rzeczownik**: jaki? ==cichy== szept.',
        '**Przysłówek** opisuje **czasownik**: jak? szepcze ==cicho==. Często kończy się na **-o** albo **-e**: cicho, ładnie.',
        'Sprawdź, **od którego wyrazu** pytasz: od rzeczownika ➜ przymiotnik, od czasownika ➜ przysłówek.',
      ],
      zadania: [
        {
          polecenie: 'Zakreśl wyraz, który pasuje do zdania.',
          info: 'Znajdź wyraz, który opisujesz. Rzecz, osoba, zwierzę (kto? co?) ➜ przymiotnik (jaki?). Czynność (co robi?) ➜ przysłówek (jak?).',
          przyklad: [
            'Tata {{spokojny|spokojnie}} czyta gazetę.',
            'Co opisuję? czynność: ==czyta== (co robi?)',
            'Jak czyta? ➜ przysłówek: ==spokojnie==',
            'Ale: ==spokojny== tata (jaki tata?) ➜ przymiotnik',
          ],
          kolumny: 2,
          linie: [
            'Ola {{ładna|*ładnie}} rysuje.',
            'To {{*ładny|ładnie}} rysunek.',
            'Zając {{szybki|*szybko}} ucieka.',
            '{{*Szybki|Szybko}} zając ucieka.',
            'Mamy {{*trudne|trudno}} zadanie.',
            'Dziś jest mi {{trudne|*trudno}}.',
            'Brat {{głośny|*głośno}} chrapie.',
            'Słyszę {{*głośne|głośno}} chrapanie.',
          ],
        },
        {
          polecenie: 'Zamień przymiotnik na przysłówek.',
          info: 'Zmień pytanie „jaki?” na „jak?”. Przysłówek mówi, jak ktoś coś robi - najczęściej kończy się na -o albo -e.',
          przyklad: [
            '**wesoły** śmiech ➜ śmieje się...',
            'Pytam: jak się śmieje?',
            'śmieje się ==wesoło==',
            'wesoły (jaki?) ➜ wesoło (jak?)',
          ],
          kolumny: 2,
          linie: [
            '**smaczny** obiad ➜ gotuje [[smacznie|20]]',
            '**ciepły** sweter ➜ ubiera się [[ciepło|20]]',
            '**dokładny** rysunek ➜ rysuje [[dokładnie|20]]',
            '**dobry** wynik ➜ pisze [[dobrze|20]]',
            '**grzeczny** uczeń ➜ siedzi [[grzecznie|20]]',
            '**wysoki** skok ➜ skacze [[wysoko|20]]',
          ],
        },
      ],
    },
    {
      tytul: 'Przymiotnik z rzeczownikiem w przypadkach',
      wiedza: [
        'Przymiotnik **idzie za rzeczownikiem**: ten sam rodzaj, liczba i **przypadek**. Pytamy jak przy rzeczowniku:',
        '**M** kto? co? · **D** kogo? czego? (nie ma) · **C** komu? czemu? (przyglądam się) · **B** kogo? co? (widzę) · **N** z kim? z czym? · **Ms** o kim? o czym? · **W** o!',
        'np. nie ma ==ciepłego kocyka==, śpię z ==ciepłym kocykiem==, mówię o ==ciepłym kocyku==.',
      ],
      zadania: [
        {
          polecenie: 'Odmień pary przez przypadki.',
          info: 'Najpierw zadaj pytanie i odmień rzeczownik. Potem dopasuj do niego przymiotnik - z tym samym pytaniem.',
          przyklad: [
            'Narzędnik: z kim? z czym? (idę z...)',
            'rzeczownik: z ==piłką==',
            'przymiotnik pasuje do niego: z ==nową== piłką',
            'Odpowiedź: z ==nową piłką==',
          ],
          tabela: {
            naglowki: ['przypadek', 'zielony smok', 'mądra sowa'],
            wiersze: [
              ['**M** kto? co?', 'zielony smok', 'mądra sowa'],
              ['**D** kogo? czego?', '[[zielonego smoka|40]]', '[[mądrej sowy|40]]'],
              ['**C** komu? czemu?', '[[zielonemu smokowi|40]]', '[[mądrej sowie|40]]'],
              ['**B** kogo? co?', '[[zielonego smoka|40]]', '[[mądrą sowę|40]]'],
              ['**N** z kim? z czym?', '[[zielonym smokiem|40]]', '[[mądrą sową|40]]'],
              ['**Ms** o kim? o czym?', '[[zielonym smoku|40]]', '[[mądrej sowie|40]]'],
              ['**W** o!', '[[zielony smoku!|40]]', '[[mądra sowo!|40]]'],
            ],
          },
        },
        {
          polecenie: 'Wpisz parę z nawiasu w dobrej formie. Na końcu wpisz skrót przypadku.',
          info: 'Zadaj pytanie od czasownika w zdaniu, np. „bawię się z kim?” Pytanie mówi, jaki to przypadek. Przymiotnik i rzeczownik zmieniasz razem.',
          przyklad: [
            'Pomagam (nowa koleżanka).',
            'Pytam: pomagam komu? ➜ celownik ==C==',
            'Pomagam ==nowej koleżance==.',
          ],
          linie: [
            'Bawię się z [[młodszą siostrą|40]] (młodsza siostra). ➜ [[N|10]]',
            'W lodówce nie ma [[świeżego mleka|40]] (świeże mleko). ➜ [[D|10]]',
            'Daję marchewkę [[białemu królikowi|40]] (biały królik). ➜ [[C|10]]',
            'Na plaży znalazłem [[piękną muszelkę|40]] (piękna muszelka). ➜ [[B|10]]',
            'Ciągle myślę o [[nowym rowerze|40]] (nowy rower). ➜ [[Ms|10]]',
            'Na lekcji pracujemy z [[kolorowymi mapami|40]] (kolorowe mapy). ➜ [[N|10]]',
          ],
        },
        {
          polecenie: 'Podkreśl parę: przymiotnik + rzeczownik. Wpisz skrót przypadku.',
          info: 'Para to dwa wyrazy obok siebie: jaki? + kto? co?. Zadaj pytanie od czasownika do całej pary - pytanie mówi, jaki to przypadek.',
          przyklad: [
            'Czekam na szkolny autobus.',
            'Para: ==szkolny autobus== (jaki? + co?)',
            'Pytam: czekam na kogo? na co? ➜ biernik ==B==',
          ],
          linie: [
            'Marzę o ((ciepłym morzu)). ➜ [[Ms|10]]',
            'Nie lubię ((zimnej herbaty)). ➜ [[D|10]]',
            'Pomagam ((starszemu bratu)). ➜ [[C|10]]',
            'Kroję chleb ((ostrym nożem)). ➜ [[N|10]]',
            '((Biały bałwan)) stoi w ogrodzie. ➜ [[M|10]]',
            'Mama kupiła ((nowy płaszcz)). ➜ [[B|10]]',
          ],
        },
        {
          polecenie: 'Ułóż własne zdanie z parą w podanym przypadku.',
          info: 'Zacznij od słowa z pytania przypadku: „nie ma...” (D), „przyglądam się...” (C), „z...” (N), „o...” (Ms). Dopisz resztę zdania.',
          przyklad: [
            'Para: **szary kot**, celownik (komu?)',
            'Zaczynam od: przyglądam się... / daję...',
            'Daję mleko ==szaremu kotu==.',
          ],
          linie: [
            '**puszysty miś** - narzędnik (z kim? z czym?): [[np. Śpię z puszystym misiem.|110]]',
            '**ciekawa książka** - miejscownik (o kim? o czym?): [[np. Opowiadam o ciekawej książce.|110]]',
            '**wysoka góra** - dopełniacz (kogo? czego?): [[np. Nie widać wysokiej góry.|110]]',
          ],
        },
      ],
    },
  ],
};
