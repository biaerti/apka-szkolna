// Karta pracy - klasa 5, dział 1 „W poszukiwaniu przyjaźni” (mapa „To wiem! To potrafię!”, s. 56). 2 strony A4 do rozdania.
// Nie powtarza filmików: każdy temat to krótka wiedza od zera + własne, różne zadania.
// Generator: node materialy/karta.mjs klasa5-dzial1 -> karta (dla uczniów) i karta-rozwiazania (do wyświetlenia).
// Znaczniki: [[odpowiedź|mm]] luka, {{a|*b}} wybór, ((słowo)) podkreślenie w rozwiązaniach - opis w klasa4-rozdzial1/karta.mjs.

export const KARTA = {
  plik: 'klasa5-dzial1-karta',
  klasa: 'Klasa 5',
  tytul: 'Karta pracy - dział 1',
  podtytul: 'W poszukiwaniu przyjaźni',
  tematy: [
    {
      tytul: 'Wiersz',
      wiedza: [
        'W wierszu mówi **podmiot liryczny** (nie autor!). Wiersz składa się z **wersów** (linijek) i **zwrotek**.',
        '**Rym** to podobne brzmienie końcówek wyrazów na końcu wersów: ==las== - ==czas==. Schematy: **AABB** parzyste, **ABAB** krzyżowe, **ABBA** okalające.',
        '**Porównanie** zestawia dwie rzeczy słówkiem **jak, niczym, jakby**: szybki ==jak== wiatr.',
      ],
      zadania: [
        {
          polecenie: 'Przeczytaj wiersz. Podkreśl wyrazy, które się rymują, i odpowiedz.',
          wiersz: [
            'Mój pies ma uszy miękkie jak ((puch)),',
            'gdy tylko zawołam, nadstawia ((słuch)).',
            'Choć wraca z błota brudny ((cały)),',
            'to przyjaciel z niego ((wspaniały)).',
          ],
          pytania: [
            ['Kto mówi w wierszu?', '[[właściciel psa (podmiot liryczny)|60]]'],
            ['Ile wersów ma zwrotka?', '[[4|60]]'],
            ['Porównanie:', '[[uszy miękkie jak puch|60]]'],
            ['Schemat rymów:', '{{*parzyste|krzyżowe|okalające}}'],
          ],
        },
      ],
    },
    {
      tytul: 'Rodzaje rymów',
      wiedza: [
        '**Dokładny** - końcówki brzmią tak samo (==mama - brama==). **Niedokładny** - zgadza się samogłoska, ale reszta trochę inna (==kot - kos==).',
        '**Męski** - akcent na ostatniej sylabie, zwykle krótkie wyrazy (==dom - tom==). **Żeński** - na przedostatniej (==lato - złoto==).',
        '**Gramatyczny** - ta sama część mowy (==biały - mały==). **Niegramatyczny** - różne (==rzeka - czeka==).',
      ],
      zadania: [
        {
          polecenie: 'Jaki to rym? Zakreśl w każdej kolumnie.',
          tabela: {
            naglowki: ['rym', 'dokładny czy niedokładny?', 'męski czy żeński?', 'gramatyczny czy niegramatyczny?'],
            wiersze: [
              ['**kot - koc**', '{{dokładny|*niedokładny}}', '{{*męski|żeński}}', '{{*gramatyczny|niegramatyczny}}'],
              ['**okno - mokro**', '{{dokładny|*niedokładny}}', '{{męski|*żeński}}', '{{gramatyczny|*niegramatyczny}}'],
              ['**czyta - pyta**', '{{*dokładny|niedokładny}}', '{{męski|*żeński}}', '{{*gramatyczny|niegramatyczny}}'],
              ['**las - nas**', '{{*dokładny|niedokładny}}', '{{*męski|żeński}}', '{{gramatyczny|*niegramatyczny}}'],
            ],
          },
        },
        {
          polecenie: 'Dopisz rym **dokładny** i **gramatyczny** (ta sama część mowy).',
          kolumny: 4,
          linie: ['śpiewa - [[ziewa|14]]', 'kotek - [[płotek|14]]', 'sowa - [[krowa|14]]', 'myje - [[szyje|14]]'],
        },
      ],
    },
    {
      tytul: 'Opowiadanie',
      wiedza: [
        '**Opowiadanie** to historia, którą opowiada **narrator**. Ludzie i zwierzęta, które w niej występują, to **bohaterowie**.',
        'Plan: **wstęp** (kto? gdzie? kiedy?) · **rozwinięcie** (wydarzenia po kolei, coś niespodziewanego, dialog) · **zakończenie** (jak się skończyło). Każda część od **akapitu**.',
      ],
      zadania: [
        {
          polecenie: 'Do której części opowiadania pasuje zdanie? Zakreśl.',
          linie: [
            'Było mroźne, grudniowe popołudnie. {{*wstęp|rozwinięcie|zakończenie}}',
            'Nagle spod ławki dobiegło skomlenie. {{wstęp|*rozwinięcie|zakończenie}}',
            'Od tej pory są nierozłączni. {{wstęp|rozwinięcie|*zakończenie}}',
          ],
        },
        {
          polecenie: 'Kto opowiada? Wpisz: **U** - narrator uczestniczy w wydarzeniach, **O** - narrator tylko obserwuje.',
          kolumny: 2,
          linie: ['[[U|8]] Zajrzałam do ogrodu.', '[[O|8]] Marta czekała na przyjaciółkę.'],
        },
      ],
    },
    {
      tytul: 'Dialog',
      wiedza: [
        'Każda wypowiedź od **nowej linijki** i od **myślnika**. Słowa narratora po myślniku, **małą literą**.',
        '**?** i **!** zostają przy bohaterze, a **kropka** idzie na koniec, po słowach narratora: – Idę już – ==powiedziała== Ola.',
      ],
      zadania: [
        {
          polecenie: 'Zapisz rozmowę poprawnie: dodaj myślniki i znaki interpunkcyjne.',
          linie: [
            'gdzie byłeś zapytała mama ➜ [[– Gdzie byłeś? – zapytała mama.|90]]',
            'u Franka odpowiedział Tymek graliśmy w szachy ➜ [[– U Franka – odpowiedział Tymek. – Graliśmy w szachy.|90]]',
          ],
        },
        {
          polecenie: 'Zakreśl zapis poprawny.',
          linie: ['{{– Pomóż mi. – poprosiła Ania.|*– Pomóż mi – poprosiła Ania.|– Pomóż mi – Poprosiła Ania.}}'],
        },
      ],
    },
    {
      tytul: 'E-mail',
      wiedza: [
        'Grzeczny e-mail ma: **temat** · **powitanie** (Dzień dobry, Szanowna Pani) · **treść** · **pożegnanie** (Pozdrawiam, Z poważaniem) · **podpis**.',
        'Do nauczyciela piszemy z polskimi znakami, bez skrótów i emotek.',
      ],
      zadania: [
        {
          polecenie: 'Napisz e-mail do wychowawczyni. Klasa chce pojechać na wycieczkę do zoo: zapytaj, czy pani się zgodzi i kiedy można by pojechać.',
          pisanie: 5,
          wzor: 'Temat: Wycieczka do zoo\nDzień dobry,\nnasza klasa chciałaby pojechać na wycieczkę do zoo. Czy zgodziłaby się Pani z nami pojechać? Moglibyśmy wybrać się w maju.\nPozdrawiam\nOla Nowak, 5a',
        },
      ],
    },
    {
      tytul: 'Głoski',
      wiedza: [
        'Głoskę **słyszę**, literę **widzę**. **Samogłoski**: a, ą, e, ę, i, o, u (ó), y. Reszta to **spółgłoski**.',
        '**Miękkie**: ć, ś, ź, ń, dź. Kreska na końcu i przed spółgłoską (ko==ń==, ==ś==piew), „**i**” przed samogłoską (==ni==ebo, ==si==ano).',
      ],
      zadania: [
        {
          polecenie: 'Wpisz brakującą głoskę: z kreską (ń, ś, ć, ź) albo z „i” (ni, si, ci, zi).',
          kolumny: 2,
          linie: ['**ń** czy **ni**?  ko[[ń|8]]  [[ni|8]]ebo', '**ś** czy **si**?  [[si|8]]korka  ło[[ś|8]]', '**ć** czy **ci**?  pła[[ć|8]]  [[ci|8]]asto', '**ź** czy **zi**?  [[zi|8]]ma  wo[[ź|8]]ny'],
        },
        {
          polecenie: 'Podkreśl spółgłoski miękkie.',
          linie: ['((ś))wieca · ko((ń)) · lis · ((ć))ma · nos · ((dź))wig · ((ź))le · las'],
        },
      ],
    },
    {
      tytul: 'Formy nieosobowe czasownika',
      wiedza: [
        'Formy nieosobowe nie mówią, **kto** wykonuje czynność: **bezokolicznik** (czytać, biec), forma na **-no, -to** (czytano, zbito), konstrukcja z **się** (czyta się, mówi się).',
      ],
      zadania: [
        {
          polecenie: 'Zakreśl formy nieosobowe.',
          linie: ['{{*sprzątano|sprzątam|*pływać|pływasz|*mówi się|mówiłeś|*zamknięto}}'],
        },
        {
          polecenie: 'Zamień na formę nieosobową, tak żeby nie było wiadomo kto.',
          pytania: [['Ktoś otworzył okno. ➜', '[[Otwarto okno.|35]]'], ['Ludzie mówią, że... ➜', '[[Mówi się, że...|35]]']],
        },
      ],
    },
    {
      tytul: 'Tryby czasownika i pisownia „by”',
      wiedza: [
        'Tryb **oznajmujący** - jest naprawdę (czytam) · **rozkazujący** - prośba, polecenie (czytaj!) · **przypuszczający** - może być, gdyby... (czytałbym).',
        '**By** piszemy **razem** z czasownikiem w formie osobowej (==zrobiłbym==) i w **gdyby, żeby, aby**. **Osobno** przy reszcie: można ==by==, ja ==bym==, zrobiono ==by==.',
      ],
      zadania: [
        {
          polecenie: 'Nazwij tryb: **O** - oznajmujący, **R** - rozkazujący, **P** - przypuszczający.',
          kolumny: 3,
          linie: ['[[R|8]] posprzątaj', '[[O|8]] gotowaliśmy', '[[P|8]] pojechałabym', '[[O|8]] piszesz', '[[P|8]] zjadłbyś', '[[R|8]] chodźcie'],
        },
        {
          polecenie: 'Razem czy osobno? Napisz poprawnie.',
          kolumny: 2,
          linie: ['zagrał(by)m ➜ [[zagrałbym|26]]', 'trzeba(by) ➜ [[trzeba by|26]]', 'gdy(by) ➜ [[gdyby|26]]', 'ty(byś) wiedział ➜ [[ty byś|26]]'],
        },
        {
          polecenie: 'Dokończ zdanie, używając trybu przypuszczającego.',
          linie: ['Gdybym miał(a) skrzydła, [[np. poleciałbym nad morze.|80]]'],
        },
      ],
    },
  ],
};
