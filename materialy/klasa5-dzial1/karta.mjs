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
      tytul: 'Wiersz: rym i porównanie',
      wiedza: [
        'W wierszu mówi **podmiot liryczny** (nie autor!). Wiersz składa się z **wersów** (linijek) i **zwrotek**.',
        '**Rym** to podobne brzmienie końcówek wersów: ==las== - ==czas==. Rymy **parzyste**: 1. wers z 2., 3. z 4. **Przeplatane**: 1. z 3., 2. z 4.',
        '**Porównanie** zestawia dwie rzeczy słówkiem **jak, niczym, jakby**: szybki ==jak== wiatr.',
      ],
      zadania: [
        {
          polecenie: 'Przeczytaj wiersz. Podkreśl wyrazy, które się rymują, i odpowiedz.',
          linie: [
            'Mój pies ma uszy miękkie jak ((puch)), / a gdy go wołam, nadstawia ((słuch)).',
            'Choć czasem w błocie brudny ((cały)), / to przyjaciel z niego ((wspaniały)).',
            'Rymy: {{*parzyste|przeplatane}} · Kto mówi? [[właściciel psa|40]]',
            'Porównanie: [[uszy miękkie jak puch|60]]',
          ],
        },
        {
          polecenie: 'Dopisz rymy.',
          kolumny: 4,
          linie: ['nos - [[włos|14]]', 'mama - [[brama|14]]', 'lato - [[tato|14]]', 'rzeka - [[czeka|14]]'],
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
      tytul: 'Tekst informacyjny',
      wiedza: [
        '**Tekst informacyjny** (encyklopedia, Wikipedia) podaje tylko **fakty**, czyli to, co da się sprawdzić. Nie ma w nim **opinii** (najpiękniejszy, uważam, wykrzykniki).',
        'Wikipedię piszą internauci. Sprawdzam **przypisy** i **drugie źródło**.',
      ],
      zadania: [
        {
          polecenie: 'Fakt czy opinia? Wpisz **F** albo **O**.',
          kolumny: 2,
          linie: ['[[F|8]] Wisła płynie przez Kraków.', '[[O|8]] Kraków jest najpiękniejszy!', '[[O|8]] Uważam, że koty są mądre.', '[[F|8]] Pszczoły żyją w rojach.'],
        },
        {
          polecenie: 'Popraw zdanie tak, żeby pasowało do encyklopedii.',
          linie: ['Delfiny to cudowne i przesłodkie ssaki, które mieszkają w morzu! ➜ [[Delfiny to ssaki, które żyją w morzach.|80]]'],
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
          polecenie: 'Do nauczycielki czy do kolegi? Zakreśl, co pasuje do e-maila do **nauczycielki**.',
          linie: ['{{Siema!|*Dzień dobry,|*Pozdrawiam|Nara!|*Z poważaniem|thx}}'],
        },
        {
          polecenie: 'Uzupełnij e-mail.',
          linie: [
            'Temat: [[Nieobecność na lekcji|45]]',
            '[[Dzień dobry,|30]] jutro nie będzie mnie w szkole, bo jadę do lekarza. Czy mogę oddać zadanie w czwartek?',
            '[[Pozdrawiam|30]] [[Ola Nowak, 5a|35]]',
          ],
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
          polecenie: 'Kreska czy „i”? Uzupełnij.',
          kolumny: 4,
          linie: ['ko[[ń|8]]', '[[ni|8]]ebo', 'ło[[ś|8]]', '[[ci|8]]asto', 'ja[[ś|8]]ko', 'pła[[ć|8]]', '[[zi|8]]ma', 'mie[[ć|8]]'],
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
          kolumny: 2,
          linie: ['Ktoś otworzył okno. ➜ [[Otwarto okno.|35]]', 'Ludzie mówią, że... ➜ [[Mówi się, że...|35]]'],
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
