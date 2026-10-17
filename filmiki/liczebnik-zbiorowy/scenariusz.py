# Klasa 5, lekcja 38: Liczebnik zbiorowy i odmiana liczebnikow, lata (NEON s. 136-137). Przyklady wlasne.
from zbuduj import *

TYTUL = 'Liczebnik zbiorowy'
EMO = '👫🔁📆'
KOLOR = '#7C3AED'
PORT = 9420
CSS = '.pod { color: var(--szary); font-size: 24px; } .c2 { background: var(--niebieski); }'

SCENY = [
    intro(
        'Cześć! Jak powiecie: dwa dzieci czy dwoje dzieci? Trzy kocięta czy troje kociąt? Dziś poznacie liczebniki '
        'zbiorowe i nauczycie się je odmieniać. Na koniec sprawdzimy, jak mówić o latach, na przykład: w dwa tysiące '
        'dwudziestym szóstym roku. Czekają na was trzy zadania. Przygotujcie zeszyty!',
        'Liczebnik zbiorowy',
        [('👫 zbiorowe', 'zbiorowe'), ('🔁 odmiana', 'odmieniać'), ('📆 lata', 'latach')],
    ),
    teoria(
        'zbiorowe',
        'Liczebniki zbiorowe to: dwoje, troje, czworo, pięcioro, sześcioro i tak dalej. Odpowiadają na pytanie: ile? '
        'Używamy ich w trzech sytuacjach. Po pierwsze przy dzieciach i młodych zwierzętach: dwoje dzieci, troje '
        'kociąt, czworo źrebiąt. Po drugie, gdy w grupie są i kobiety, i mężczyźni: dwoje uczniów, czyli chłopiec i '
        'dziewczynka. Po trzecie przy rzeczownikach, które mają tylko liczbę mnogą: dwoje drzwi, troje sań.',
        (1, 'ZBIOROWE'), 'Liczebniki zbiorowe 👫',
        chipy(*[chip(s, 'zbiorowe', 'var(--ak)', po=0.25 * i) for i, s in
                enumerate(['dwoje', 'troje', 'czworo', 'pięcioro', 'sześcioro...'])]),
        rzad(
            karta('dzieci i młode zwierzęta', 'dwoje dzieci · troje kociąt · czworo źrebiąt', 'dzieciach', 'var(--ak)', emo='👶🐱'),
            karta('kobiety i mężczyźni razem', 'dwoje uczniów = 👦 + 👧', 'kobiety', 'var(--fiolet)', emo='👫'),
            karta('tylko liczba mnoga', 'dwoje drzwi · troje sań', 'mnogą', 'var(--zielony)', emo='🚪🛷'),
        ),
    ),
    teoria(
        'znaczenie',
        'Uwaga, liczebnik zbiorowy zmienia znaczenie! Dwóch uczniów to dwaj chłopcy. Dwie uczennice to dwie '
        'dziewczynki. A dwoje uczniów to chłopiec i dziewczynka. Tak samo: troje przyjaciół to grupa mieszana, a trzech '
        'przyjaciół to sami chłopcy. Pięcioro rodzeństwa? To bracia i siostry razem.',
        (1, 'ZBIOROWE'), 'Kto jest w grupie? 🔍',
        lista(
            linia('👦👦 <b class="ak">dwóch</b> uczniów - dwaj chłopcy', 'dwóch'),
            linia('👧👧 <b class="ak">dwie</b> uczennice - dwie dziewczynki', 'uczennice'),
            linia('👦👧 <b class="ak">dwoje</b> uczniów - chłopiec i dziewczynka', 'dwoje'),
            linia('👦👧👦 <b class="ak">troje</b> przyjaciół · 👦👦👦 <b class="ak">trzech</b> przyjaciół', 'troje'),
            linia('👨‍👩‍👧‍👦 <b class="ak">pięcioro</b> rodzeństwa - bracia i siostry', 'rodzeństwa'),
            szer=960,
        ),
    ),
]

Z1 = zadanie(
    1,
    'Zadanie pierwsze. Wybierz poprawny liczebnik. Zastanów się, czy trzeba użyć zbiorowego. Zapisz w zeszycie '
    'numer i wybrane słowo. Masz minutę. Jeśli potrzebujesz więcej czasu, zatrzymaj film. Start!',
    (1, 'ZBIOROWE'), 'Zwykły czy zbiorowy? Wybierz liczebnik.',
    [
        zad('W piaskownicy bawi się {{*troje|trzy}} dzieci.', why='dzieci'),
        zad('Kotka urodziła {{*czworo|cztery}} kociąt.', why='młode zwierzęta'),
        zad('Na półce stoi {{pięcioro|*pięć}} książek.', why='zwykłe rzeczy'),
        zad('Do ogrodu prowadzą {{*dwoje|dwa}} drzwi.', why='tylko lm.'),
        zad('Ola i Kuba to {{*dwoje|dwóch}} przyjaciół.', why='👧 + 👦'),
        zad('Przyszło {{trzech|*troje}} gości: babcia, dziadek i ciocia.', why='grupa mieszana'),
    ],
    pokaz='poprawny',
)
SCENY += [
    Z1,
    odp(1,
        'Sprawdzamy. Troje dzieci, bo to dzieci. Czworo kociąt, bo to młode zwierzęta. Pięć książek, bo książki to '
        'zwykłe rzeczy i zbiorowy liczebnik tu nie pasuje. Dwoje drzwi, bo drzwi mają tylko liczbę mnogą. Ola i Kuba '
        'to dwoje przyjaciół, bo to dziewczynka i chłopiec. I troje gości, bo w grupie są kobiety i mężczyzna.',
        Z1, ['dzieci', 'kociąt', 'książek', 'drzwi', 'przyjaciół', 'gości']),
    teoria(
        'odmiana',
        'Liczebniki zbiorowe odmieniają się przez przypadki. Spójrzcie na odmianę słowa dwoje. Mianownik: dwoje dzieci. '
        'Dopełniacz: nie ma dwojga dzieci. Celownik: daję prezenty dwojgu dzieciom. Biernik: widzę dwoje dzieci. '
        'Narzędnik: idę z dwojgiem dzieci. Miejscownik: mówię o dwojgu dzieciach. Tak samo odmienia się troje: trojga, '
        'trojgu, trojgiem.',
        (2, 'ODMIANA'), 'Odmiana: dwoje, troje 🔁',
        tabela(['przypadek', 'dwoje', 'troje'], [
            ['M. kto? co?', 'dwoje dzieci', 'troje dzieci'],
            ['D. kogo? czego?', 'dwoj<b class="ak">ga</b> dzieci', 'troj<b class="ak">ga</b> dzieci'],
            ['C. komu? czemu?', 'dwoj<b class="ak">gu</b> dzieciom', 'troj<b class="ak">gu</b> dzieciom'],
            ['B. kogo? co?', 'dwoje dzieci', 'troje dzieci'],
            ['N. z kim? z czym?', 'dwoj<b class="ak">giem</b> dzieci', 'troj<b class="ak">giem</b> dzieci'],
            ['Ms. o kim? o czym?', 'dwoj<b class="ak">gu</b> dzieciach', 'troj<b class="ak">gu</b> dzieciach'],
        ], ['mianownik', 'dopełniacz', 'celownik', 'biernik', 'narzędnik', 'miejscownik'], szer=900),
    ),
]

Z2 = zadanie(
    2,
    'Zadanie drugie. Wpisz liczebnik z nawiasu w odpowiedniej formie. Zapisz w zeszycie tylko liczebniki. Masz '
    'minutę. Jeśli potrzebujesz więcej czasu, zatrzymaj film. Start!',
    (2, 'ODMIANA'), 'Wpisz liczebnik w odpowiedniej formie.',
    [
        zad('Opiekuję się <span class="pod">(dwoje)</span> [[dwojgiem]] kociąt.', why='z kim?'),
        zad('Nie widzę tu <span class="pod">(troje)</span> [[trojga]] dzieci.', why='kogo nie widzę?'),
        zad('Babcia kupiła lody <span class="pod">(czworo)</span> [[czworgu]] wnukom.', why='komu?'),
        zad('Rozmawiamy o <span class="pod">(pięcioro)</span> [[pięciorgu]] uczniach.', why='o kim?'),
        zad('Pani pochwaliła <span class="pod">(dwoje)</span> [[dwoje]] uczniów.', why='kogo? - bez zmiany'),
    ],
    pokaz='nawiasu', szer=1060,
)
SCENY += [
    Z2,
    odp(2,
        'Sprawdzamy. Opiekuję się dwojgiem kociąt, bo pytamy: z kim? Nie widzę trojga dzieci, bo: kogo nie widzę? '
        'Lody czworgu wnukom, bo: komu? Rozmawiamy o pięciorgu uczniach. A pani pochwaliła dwoje uczniów, bo w bierniku '
        'forma się nie zmienia.',
        Z2, ['dwojgiem', 'trojga', 'czworgu', 'pięciorgu', 'pochwaliła']),
    teoria(
        'lata',
        'A teraz lata. Rok to liczebnik porządkowy. Gdy mówimy o roku z kilku słów, odmieniamy tylko dwa ostatnie '
        'słowa, czyli dziesiątki i jedności. Tysiąc dziewięćset osiemdziesiąty dziewiąty rok, ale: w tysiąc dziewięćset '
        'osiemdziesiątym dziewiątym roku. Początek, czyli tysiąc dziewięćset, zostaje bez zmian. Tak samo: w dwa '
        'tysiące dwudziestym szóstym roku, a nie w dwutysięcznym dwudziestym szóstym.',
        (3, 'LATA'), 'W którym roku? 📆',
        chipy(chip('odmieniamy tylko 2 ostatnie słowa', 'ostatnie', 'var(--ak)')),
        lista(
            linia('📆 1989 ➜ w tysiąc dziewięćset <b class="ak">osiemdziesiątym dziewiątym</b> roku', 'osiemdziesiątym'),
            linia('🟰 początek bez zmian: <b>tysiąc dziewięćset</b>', 'początek'),
            linia('📆 2026 ➜ w dwa tysiące <b class="ak">dwudziestym szóstym</b> roku', 'dwudziestym'),
            linia('❌ <span class="skr">w dwutysięcznym dwudziestym szóstym roku</span>', 'dwutysięcznym'),
            szer=1060,
        ),
    ),
]

Z3 = zadanie(
    3,
    'Zadanie trzecie. Jak poprawnie powiedzieć te daty? Wybierz właściwą formę i zapisz w zeszycie numer oraz '
    'wybrane słowa. Masz minutę. Jeśli potrzebujesz więcej czasu, zatrzymaj film. Start!',
    (3, 'LATA'), 'Wybierz poprawną formę roku.',
    [
        zad('2014 ➜ w {{*dwa tysiące|dwutysięcznym}} czternastym roku'),
        zad('1970 ➜ w tysiąc dziewięćset {{*siedemdziesiątym|siedemdziesiąt}} roku'),
        zad('2005 ➜ w dwa tysiące {{*piątym|pięć}} roku'),
        zad('2023 ➜ w dwa tysiące {{dwadzieścia trzy|*dwudziestym trzecim}} roku'),
        zad('2026 ➜ w {{*dwa tysiące|dwóch tysiącach}} dwudziestym szóstym roku'),
    ],
    pokaz='daty', szer=1160,
)
SCENY += [
    Z3,
    odp(3,
        'Sprawdzamy. W dwa tysiące czternastym roku, bo początek się nie zmienia. W tysiąc dziewięćset siedemdziesiątym '
        'roku. W dwa tysiące piątym roku. W dwa tysiące dwudziestym trzecim roku, tu odmieniamy oba ostatnie '
        'słowa. I w dwa tysiące dwudziestym szóstym roku. Początek roku zawsze zostaje bez zmian.',
        Z3, ['czternastym', 'siedemdziesiątym', 'piątym', 'trzecim', 'szóstym']),
    zapamietaj(
        'Zapamiętaj! Liczebniki zbiorowe, takie jak dwoje, troje, czworo, łączymy z dziećmi i młodymi zwierzętami, z '
        'grupami kobiet i mężczyzn oraz z rzeczownikami, które mają tylko liczbę mnogą. Odmieniają się przez przypadki: '
        'dwoje, dwojga, dwojgu, dwojgiem. W latach odmieniamy tylko dwa ostatnie słowa: w dwa tysiące dwudziestym '
        'szóstym roku. Brawo!',
        [
            ('👶 dwoje dzieci · troje kociąt', 'dwoje'),
            ('👫 dwoje uczniów = 👦 + 👧', 'kobiet'),
            ('🚪 dwoje drzwi, troje sań - tylko liczba mnoga', 'mnogą'),
            ('🔁 dwoje · dwojga · dwojgu · dwojgiem', 'dwojga'),
            ('📆 w dwa tysiące dwudziestym szóstym roku', 'ostatnie'),
        ],
    ),
]
