// Karta pracy - klasa 4, rozdział II: przypadki (odmiana i rozpoznawanie). 1 strona A4 do rozdania.
// Nie powtarza filmików ani kart „Ćwiczymy razem”: własne wyrazy i zdania.
// Generator: node materialy/karta.mjs klasa4-rozdzial2 -> karta (dla uczniów) i karta-rozwiazania (do wyświetlenia).
// Znaczniki jak w materialy/klasa4-rozdzial1/karta.mjs.

export const KARTA = {
  plik: 'klasa4-rozdzial2-karta',
  klasa: 'Klasa 4',
  tytul: 'Przypadki',
  podtytul: 'Odmiana i rozpoznawanie',
  tematy: [
    {
      tytul: 'Odmiana przez przypadki',
      wiedza: [
        'Rzeczownik zmienia formę: ==jeż==, nie ma ==jeża==, idę z ==jeżem==. To **odmiana przez przypadki**. Jest ich siedem:',
        '**M** mianownik - kto? co? (jest)',
        '**D** dopełniacz - kogo? czego? (nie ma)',
        '**C** celownik - komu? czemu? (przyglądam się)',
        '**B** biernik - kogo? co? (widzę)',
        '**N** narzędnik - z kim? z czym? (idę z)',
        '**Ms** miejscownik - o kim? o czym? (mówię o)',
        '**W** wołacz - o!',
        'Kolejność: **M**ama **D**aje **C**ukierki, **B**asia **N**ajpierw **M**amie **W**ręcza.',
      ],
      zadania: [
        {
          polecenie: 'Odmień wyrazy przez przypadki. Pomoże ci słowo w nawiasie.',
          tabela: {
            naglowki: ['przypadek', 'jeż', 'żaba', 'jajko'],
            wiersze: [
              ['**M** (jest)', 'jeż', 'żaba', 'jajko'],
              ['**D** (nie ma)', '[[jeża|22]]', '[[żaby|22]]', '[[jajka|22]]'],
              ['**C** (przyglądam się)', '[[jeżowi|22]]', '[[żabie|22]]', '[[jajku|22]]'],
              ['**B** (widzę)', '[[jeża|22]]', '[[żabę|22]]', '[[jajko|22]]'],
              ['**N** (idę z)', '[[jeżem|22]]', '[[żabą|22]]', '[[jajkiem|22]]'],
              ['**Ms** (mówię o)', '[[jeżu|22]]', '[[żabie|22]]', '[[jajku|22]]'],
              ['**W** (o!)', '[[jeżu!|22]]', '[[żabo!|22]]', '[[jajko!|22]]'],
            ],
          },
        },
        {
          polecenie: 'Dopisz pytania przypadków.',
          kolumny: 2,
          linie: [
            'dopełniacz ➜ [[kogo? czego?|32]]',
            'biernik ➜ [[kogo? co?|32]]',
            'celownik ➜ [[komu? czemu?|32]]',
            'narzędnik ➜ [[z kim? z czym?|32]]',
          ],
        },
      ],
    },
    {
      tytul: 'Rozpoznaj przypadek',
      wiedza: [
        'Znajdź słowo, od którego zależy rzeczownik (najczęściej czasownik), i **zadaj od niego pytanie**: Czekam na (kogo? co?) ==autobus== - biernik.',
        'Uważaj na podobne pytania. **Kto? co?** - mianownik, ten, kto coś robi: ==Kot== śpi. **Kogo? co?** - biernik: Głaszczę ==kota==.',
        'Po **nie** często jest dopełniacz: mam kanapkę ➜ nie mam ==kanapki==.',
      ],
      zadania: [
        {
          polecenie: 'W jakim przypadku jest podkreślony wyraz? Wpisz skrót: M, D, C, B, N, Ms, W.',
          kolumny: 2,
          linie: [
            '[[M|9]] __Wiewiórka__ zbiera orzechy.',
            '[[D|9]] Nie lubię __szpinaku__.',
            '[[C|9]] Pomagam __dziadkowi__.',
            '[[B|9]] Zbudowaliśmy __szałas__.',
            '[[N|9]] Kroję chleb __nożem__.',
            '[[Ms|9]] Śnię o __wakacjach__.',
            '[[W|9]] __Piotrze__, zamknij okno!',
            '[[N|9]] Rower stoi przed __domem__.',
          ],
        },
        {
          polecenie: 'Zakreśl formę, która pasuje do zdania.',
          linie: [
            'Jutro jadę nad jezioro z {{kuzyn|kuzyna|*kuzynem}}.',
            'Nigdzie nie widzę {{kot|*kota|kotem}}.',
            'Daję kość {{psa|*psu|psem}}.',
            'Na ławce siedzi {{*sąsiadka|sąsiadkę|sąsiadce}}.',
          ],
        },
      ],
    },
    {
      tytul: 'Liczba mnoga i wołacz',
      wiedza: [
        'W liczbie mnogiej pytania są te same: ==koty==, (nie ma) ==kotów==, ==kotom==, (widzę) ==koty==, z ==kotami==, o ==kotach==, ==koty==!',
        'W dopełniaczu bywa **bez końcówki**: nie ma ==gruszek== (nie: gruszków).',
        'Wołaczem **zwracamy się** do kogoś: Zosia ➜ ==Zosiu==!',
      ],
      zadania: [
        {
          polecenie: 'Wpisz wyraz z nawiasu w odpowiedniej formie.',
          linie: [
            'W koszyku nie ma [[gruszek|22]] (gruszki).',
            'Idę na spacer z [[psami|22]] (psy).',
            'Czytam o [[dinozaurach|24]] (dinozaury).',
            'Zgubiłem parę [[rękawiczek|24]] (rękawiczki).',
            'Przyglądam się [[mrówkom|22]] (mrówki).',
            'Kupię kilo [[ziemniaków|24]] (ziemniaki).',
          ],
        },
        {
          polecenie: 'Zawołaj poprawnie.',
          kolumny: 2,
          linie: [
            'Kasia ➜ [[Kasiu!|20]]',
            'Wojtek ➜ [[Wojtku!|20]]',
            'pies ➜ [[psie!|20]]',
            'kot ➜ [[kocie!|20]]',
            'pani Ewa ➜ [[pani Ewo!|20]]',
            'pan Marek ➜ [[panie Marku!|24]]',
          ],
        },
      ],
    },
  ],
};
