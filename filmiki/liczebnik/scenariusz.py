# Klasa 5, lekcja 37: Liczebnik glowny i porzadkowy (NEON s. 134-135). Przyklady wlasne.
from zbuduj import *

TYTUL = 'Liczebnik'
EMO = '🔢🥇📅'
KOLOR = '#4F46E5'
PORT = 9427
CSS = '.pod { color: var(--szary); font-size: 24px; }'

GL, PO = ('🔢 główny - ile?', 'var(--ak)'), ('🥇 porządkowy - który?', 'var(--fiolet)')

SCENY = [
    intro(
        'Cześć! Ile macie lat? Na którym piętrze mieszkacie? Którego dnia są wasze urodziny? Na wszystkie te pytania '
        'odpowiadamy liczebnikami. Dziś poznacie liczebniki główne i porządkowe, a także to, jak je odmieniać. '
        'Czekają na was trzy zadania. Przygotujcie zeszyty!',
        'Liczebnik',
        [('🔢 ile?', 'ile'), ('🥇 który?', 'którym'), ('🔁 odmiana', 'odmieniać')],
    ),
    teoria(
        'co-to',
        'Liczebnik to odmienna część mowy, która określa liczbę albo kolejność. Liczebniki główne odpowiadają na '
        'pytanie: ile? Mówią, ile czegoś jest. Jeden, pięć, dwanaście, sto. Liczebniki porządkowe odpowiadają na '
        'pytania: który? która? które? Mówią, które coś jest w kolejności. Pierwszy, piąty, dwunasty, setny. Mam trzy '
        'siostry. To liczebnik główny. Jestem trzecia w kolejce. To liczebnik porządkowy.',
        (1, 'CO TO JEST'), 'Co to jest liczebnik? 🔢',
        karta('LICZEBNIK', 'określa liczbę albo kolejność', 'liczbę', 'var(--ak)', styl='width:800px;margin:16px auto 0'),
        rzad(
            karta('główny · ile?', 'jeden · pięć · dwanaście · sto', 'główne', 'var(--ak)', emo='🔢'),
            karta('porządkowy · który? która? które?', 'pierwszy · piąty · dwunasty · setny', 'porządkowe', 'var(--fiolet)', emo='🥇'),
        ),
        lista(
            linia('Mam <b class="ak">trzy</b> siostry. ➜ ile? ➜ główny', 'siostry'),
            linia('Jestem <b style="color:var(--fiolet)">trzecia</b> w kolejce. ➜ która? ➜ porządkowy', 'kolejce'),
            szer=860,
        ),
    ),
]

Z1 = zadanie(
    1,
    'Zadanie pierwsze. W każdym zdaniu jest liczebnik. Przy numerze zapisz w zeszycie: główny albo porządkowy. '
    'Zadaj pytanie: ile? czy który? Masz minutę. Jeśli potrzebujesz więcej czasu, zatrzymaj film. Start!',
    (1, 'CO TO JEST'), 'Liczebnik główny czy porządkowy?',
    [
        zad('W szafce stoi ((osiem)) słoików.', 'główny', 'ile?', kolor='var(--ak)'),
        zad('Mieszkam na ((czwartym)) piętrze.', 'porządkowy', 'na którym?', kolor='var(--fiolet)'),
        zad('Zjadłem ((dwa)) jabłka.', 'główny', 'ile?', kolor='var(--ak)'),
        zad('Ola zajęła ((pierwsze)) miejsce.', 'porządkowy', 'które?', kolor='var(--fiolet)'),
        zad('To już ((dziesiąta)) lekcja w tym tygodniu.', 'porządkowy', 'która?', kolor='var(--fiolet)'),
        zad('Autobus odjeżdża za ((pięć)) minut.', 'główny', 'ile?', kolor='var(--ak)'),
    ],
    pokaz='zdaniu', opcje=[GL, PO],
)
SCENY += [
    Z1,
    odp(1,
        'Sprawdzamy. Osiem: ile słoików? Główny. Czwartym: na którym piętrze? Porządkowy. Dwa: ile jabłek? Główny. '
        'Pierwsze: które miejsce? Porządkowy. Dziesiąta: która lekcja? Porządkowy. Pięć: ile minut? Główny.',
        Z1, ['osiem', 'czwartym', 'dwa', 'pierwsze', 'dziesiąta', 'pięć']),
    teoria(
        'porzadkowe',
        'Liczebniki porządkowe odmieniają się jak przymiotniki: przez przypadki, liczby i rodzaje. Pierwszy dzień, '
        'pierwsza lekcja, pierwsze miejsce. W pierwszym dniu, po pierwszej lekcji. Uwaga na daty! Gdy w kalendarzu '
        'stoi cyfra pięć i słowo maj, czytamy: piątego maja. Mówimy: urodziłam się dwunastego marca, a nie dwanaście '
        'marca.',
        (2, 'ODMIANA PORZĄDKOWYCH'), 'Porządkowe odmieniają się jak przymiotniki 🥇',
        lista(
            linia('pierwsz<b class="ak">y</b> dzień · pierwsz<b class="ak">a</b> lekcja · pierwsz<b class="ak">e</b> miejsce', 'dzień'),
            linia('w pierwsz<b class="ak">ym</b> dniu · po pierwsz<b class="ak">ej</b> lekcji', 'dniu'),
            linia('📅 5 maja ➜ czytamy: <b class="ak">piątego</b> maja', 'piątego'),
            linia('🎂 12 marca ➜ <b class="ak">dwunastego</b> marca · <span class="skr">dwanaście marca</span>', 'dwunastego'),
            szer=940,
        ),
    ),
]

Z2 = zadanie(
    2,
    'Zadanie drugie. Zamień liczby w nawiasach na liczebniki porządkowe w odpowiedniej formie. Zapisz w zeszycie '
    'tylko te słowa. Masz minutę. Jeśli potrzebujesz więcej czasu, zatrzymaj film. Start!',
    (2, 'ODMIANA PORZĄDKOWYCH'), 'Zapisz słowami liczebnik porządkowy.',
    [
        zad('Mieszkam na <span class="pod">(3)</span> [[trzecim]] piętrze.'),
        zad('Chodzę do <span class="pod">(5)</span> [[piątej]] klasy.'),
        zad('Urodziłam się <span class="pod">(12)</span> [[dwunastego]] maja.'),
        zad('Zajęliśmy <span class="pod">(2)</span> [[drugie]] miejsce.'),
        zad('Spotkajmy się po <span class="pod">(6)</span> [[szóstej]] lekcji.'),
    ],
    pokaz='nawiasach', szer=900,
)
SCENY += [
    Z2,
    odp(2,
        'Sprawdzamy. Na trzecim piętrze. Do piątej klasy. Urodziłam się dwunastego maja, pamiętajcie: dwunastego, a '
        'nie dwanaście. Zajęliśmy drugie miejsce. I po szóstej lekcji. Każdy liczebnik dopasował się do rzeczownika '
        'tak jak przymiotnik.',
        Z2, ['trzecim', 'piątej', 'dwunastego', 'drugie', 'szóstej']),
    teoria(
        'glowne',
        'Liczebniki główne też się odmieniają, przez przypadki i rodzaje. Dwa koty, dwie kotki, dwa okna. A gdy mówimy '
        'o mężczyznach i chłopcach, mamy dwie poprawne formy: dwaj chłopcy albo dwóch chłopców. Tak samo: trzej bracia '
        'albo trzech braci, czterej panowie albo czterech panów. I jeszcze przypadki: nie mam dwóch złotych, idę z '
        'dwoma kolegami, myślę o trzech zadaniach.',
        (3, 'ODMIANA GŁÓWNYCH'), 'Główne też się odmieniają 🔢',
        lista(
            linia('🐈 <b class="ak">dwa</b> koty · <b class="ak">dwie</b> kotki · <b class="ak">dwa</b> okna', 'koty'),
            linia('👦👦 <b class="ak">dwaj</b> chłopcy = <b class="ak">dwóch</b> chłopców', 'dwaj'),
            linia('👨‍👦 <b class="ak">trzej</b> bracia = <b class="ak">trzech</b> braci · <b class="ak">czterej</b> panowie = <b class="ak">czterech</b> panów', 'trzej'),
            linia('nie mam <b class="ak">dwóch</b> złotych · z <b class="ak">dwoma</b> kolegami · o <b class="ak">trzech</b> zadaniach', 'złotych'),
            szer=1080,
        ),
    ),
    teoria(
        'z-rzeczownikiem',
        'Zwróćcie uwagę, co dzieje się z rzeczownikiem. Mówimy: dwa jabłka, trzy jabłka, cztery jabłka. Ale od pięciu '
        'w górę rzeczownik zmienia formę: pięć jabłek, sześć jabłek, dwadzieścia jabłek. Tak samo: cztery dni, ale '
        'pięć dni. Trzy koleżanki, ale siedem koleżanek. Dlatego w zadaniu z matematyki piszemy: osiem złotych, a nie '
        'osiem złote.',
        (3, 'ODMIANA GŁÓWNYCH'), 'Od pięciu w górę 🍎',
        rzad(
            karta('2, 3, 4', 'dwa jabłk<b>a</b> · cztery dni · trzy koleżank<b>i</b>', 'cztery', 'var(--ak)', emo='🍎🍎'),
            karta('5 i więcej', 'pięć jabł<b>ek</b> · pięć dni · siedem koleżan<b>ek</b>', 'pięciu', 'var(--fiolet)', emo='🍎🍎🍎🍎🍎'),
        ),
        lista(
            linia('💰 osiem <b class="ak">złotych</b> · <span class="skr">osiem złote</span>', 'złotych'),
            szer=640,
        ),
    ),
]

Z3 = zadanie(
    3,
    'Zadanie trzecie. Wybierz poprawną formę liczebnika. Zapisz w zeszycie numer i wybrane słowo. Masz minutę. '
    'Jeśli potrzebujesz więcej czasu, zatrzymaj film. Start!',
    (3, 'ODMIANA GŁÓWNYCH'), 'Wybierz poprawną formę liczebnika.',
    [
        zad('{{*dwie|dwa}} koleżanki', why='rodzaj żeński'),
        zad('{{dwa|*dwaj}} chłopcy', why='mężczyźni'),
        zad('{{*dwa|dwie}} rowery'),
        zad('{{trzy|*trzej}} bracia', why='mężczyźni'),
        zad('{{*trzech|trzy}} panów'),
        zad('{{*cztery|czterej}} krzesła', why='to nie osoby'),
    ],
    pokaz='formę', szer=720,
)
SCENY += [
    Z3,
    odp(3,
        'Sprawdzamy. Dwie koleżanki, bo koleżanka to rodzaj żeński. Dwaj chłopcy, bo to mężczyźni. Dwa rowery. Trzej '
        'bracia. Trzech panów, bo z formą panów łączy się trzech. I cztery krzesła, bo krzesła to nie osoby.',
        Z3, ['koleżanki', 'chłopcy', 'rowery', 'bracia', 'panów', 'krzesła']),
    zapamietaj(
        'Zapamiętaj! Liczebnik określa liczbę albo kolejność. Liczebniki główne odpowiadają na pytanie: ile? Jeden, '
        'pięć, sto. Liczebniki porządkowe na pytanie: który? Pierwszy, piąty, setny. Porządkowe odmieniają się jak '
        'przymiotniki, a daty czytamy porządkowo: piątego maja. Przy mężczyznach mówimy: dwaj chłopcy albo dwóch '
        'chłopców. Brawo!',
        [
            ('🔢 główny - ile? jeden, pięć, sto', 'główne'),
            ('🥇 porządkowy - który? pierwszy, piąty, setny', 'porządkowe'),
            ('📅 5 maja ➜ piątego maja', 'piątego'),
            ('👦👦 dwaj chłopcy = dwóch chłopców · dwie koleżanki', 'dwaj'),
        ],
    ),
]
