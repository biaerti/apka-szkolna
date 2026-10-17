# Klasa 5, lekcja 39: Kropka a liczby. Zapisywanie dat (NEON s. 138-139). Przyklady wlasne.
from zbuduj import *

TYTUL = 'Kropka a liczby. Daty'
EMO = '📅🏛️⚫'
KOLOR = '#0E7490'
PORT = 9421

DOB, ZLE = ('✅ dobrze', 'var(--zielony)'), ('❌ źle', 'var(--roz)')
ZK, BK = ('z kropką', 'var(--ak)'), ('bez kropki', 'var(--fiolet)')

SCENY = [
    intro(
        'Cześć! Jak zapisać datę swoich urodzin? Samymi cyframi, słowami, a może cyframi rzymskimi? I gdzie postawić '
        'kropkę? Dziś nauczycie się poprawnie zapisywać daty i liczebniki porządkowe. Czekają na was trzy zadania. '
        'Przygotujcie zeszyty!',
        'Kropka a liczby. Daty',
        [('📅 daty', 'datę'), ('🏛️ cyfry rzymskie', 'rzymskimi'), ('⚫ kropka', 'kropkę')],
    ),
    teoria(
        'trzy-sposoby',
        'Datę możemy zapisać na trzy sposoby. Pierwszy: same cyfry arabskie, czyli takie jak w matematyce. Wtedy dzień, '
        'miesiąc i rok oddzielamy kropkami. Drugi sposób: miesiąc cyfrą rzymską. Wtedy nie stawiamy kropek, tylko '
        'odstępy. Trzeci sposób: miesiąc słowami. Po dniu też nie ma kropki. Na końcu możemy dodać skrót słowa rok, i '
        'ten skrót zawsze ma kropkę.',
        (1, 'DATY'), 'Trzy sposoby zapisu daty 📅',
        rzad(
            karta('17<b class="zle">.</b>10<b class="zle">.</b>2026', 'cyfry arabskie: kropki', 'arabskie', 'var(--ak)', emo='🔢'),
            karta('17 X 2026', 'miesiąc rzymski: odstępy, bez kropek', 'rzymską', 'var(--fiolet)', emo='🏛️'),
            karta('17 października 2026&nbsp;r<b class="zle">.</b>', 'miesiąc słowami: bez kropki po dniu', 'słowami', 'var(--zielony)', emo='🔤'),
        ),
        chipy(chip('r. = rok - zawsze z kropką', 'skrót', 'var(--ciemny)')),
    ),
    teoria(
        'rzymskie',
        'Przypomnijmy miesiące w cyfrach rzymskich. Styczeń to jeden, luty dwa, marzec trzy. Kwiecień to cztery, czyli '
        'pięć minus jeden. Maj to pięć, czerwiec sześć, lipiec siedem, sierpień osiem. Wrzesień to dziewięć, czyli '
        'dziesięć minus jeden. Październik to dziesięć, listopad jedenaście, a grudzień dwanaście.',
        (1, 'DATY'), 'Miesiące po rzymsku 🏛️',
        tabela(['styczeń - kwiecień', 'maj - sierpień', 'wrzesień - grudzień'], [
            ['<b class="ak">I</b> styczeń', '<b class="ak">V</b> maj', '<b class="ak">IX</b> wrzesień'],
            ['<b class="ak">II</b> luty', '<b class="ak">VI</b> czerwiec', '<b class="ak">X</b> październik'],
            ['<b class="ak">III</b> marzec', '<b class="ak">VII</b> lipiec', '<b class="ak">XI</b> listopad'],
            ['<b class="ak">IV</b> kwiecień', '<b class="ak">VIII</b> sierpień', '<b class="ak">XII</b> grudzień'],
        ], ['styczeń', 'luty', 'marzec', 'kwiecień'], szer=980),
    ),
]

Z1 = zadanie(
    1,
    'Zadanie pierwsze. Przyjrzyj się sześciu datom. Która jest zapisana dobrze, a która źle? Przy numerze zapisz: '
    'dobrze albo źle. Masz minutę. Jeśli potrzebujesz więcej czasu, zatrzymaj film. Start!',
    (1, 'DATY'), 'Dobrze czy źle zapisana data?',
    [
        zad('3.05.2026', 'dobrze', kolor='var(--zielony)'),
        zad('3. maja 2026 r.', 'źle', 'bez kropki po dniu', kolor='var(--roz)'),
        zad('11 XI 1918', 'dobrze', kolor='var(--zielony)'),
        zad('1.IX.2026', 'źle', 'przy rzymskich bez kropek', kolor='var(--roz)'),
        zad('24 grudnia 2025 r.', 'dobrze', kolor='var(--zielony)'),
        zad('1. września 2026 r.', 'źle', 'bez kropki po dniu', kolor='var(--roz)'),
    ],
    pokaz='datom', opcje=[DOB, ZLE], szer=820,
)
SCENY += [
    Z1,
    odp(1,
        'Sprawdzamy. Pierwsza dobrze: same cyfry arabskie i kropki. Druga źle, bo gdy miesiąc jest słowami, po dniu '
        'nie stawiamy kropki. Trzecia dobrze: miesiąc rzymski i odstępy. Czwarta źle, bo przy cyfrze rzymskiej nie ma '
        'kropek. Piąta dobrze. Szósta znowu źle: kropka po dniu, a miesiąc jest słowami.',
        Z1, ['pierwsza', 'druga', 'trzecia', 'czwarta', 'piąta', 'szósta']),
    teoria(
        'kropka-porzadkowa',
        'Kropka ma jeszcze jedno zadanie. Stawiamy ją po cyfrze arabskiej, która oznacza liczebnik porządkowy. Mieszkam '
        'na ósmym piętrze. Jeśli zapiszemy ósemkę cyfrą, stawiamy po niej kropkę. Dzięki kropce wiemy, że czytamy: '
        'ósmym, a nie: osiem. Zająłem drugie miejsce: dwójka z kropką. A po cyfrze rzymskiej? Tam kropki nie stawiamy: '
        'dwudziesty wiek, Jan Paweł drugi.',
        (2, 'KROPKA PO LICZBIE'), 'Kropka po liczebniku porządkowym ⚫',
        lista(
            linia('🏢 na 8<b class="zle">.</b> piętrze = na <b class="ak">ósmym</b> piętrze', 'ósmym'),
            linia('🥈 2<b class="zle">.</b> miejsce = <b class="ak">drugie</b> miejsce', 'drugie'),
            linia('🏛️ XX wiek · Jan Paweł II ➜ po cyfrze rzymskiej bez kropki', 'rzymskiej'),
            szer=960,
        ),
    ),
    teoria(
        'bez-kropki',
        'Są dwie sytuacje, w których kropkę po liczebniku porządkowym pomijamy. Pierwsza: godziny bez minut. Piszemy: '
        'spotkajmy się o godzinie siedemnastej, i siedemnastkę zapisujemy bez kropki. Druga: dzień miesiąca, gdy '
        'miesiąc jest zapisany słowami, na przykład dwudziestego trzeciego października. Kropkę można też pominąć, gdy '
        'i tak wiadomo, że chodzi o kolejność: chodzę do piątej klasy.',
        (2, 'KROPKA PO LICZBIE'), 'Kiedy bez kropki? 🚫',
        lista(
            linia('🕔 o godzinie 17 ➜ bez kropki', 'godziny'),
            linia('📅 23 października ➜ bez kropki', 'dzień'),
            linia('🎒 chodzę do 5 klasy ➜ wiadomo, że piątej', 'wiadomo'),
            szer=960,
        ),
    ),
]

Z2 = zadanie(
    2,
    'Zadanie drugie. Gdzie potrzebna jest kropka? Przy każdym numerze zapisz w zeszycie: z kropką albo bez kropki. '
    'Masz minutę. Jeśli potrzebujesz więcej czasu, zatrzymaj film. Start!',
    (2, 'KROPKA PO LICZBIE'), 'Z kropką czy bez kropki?',
    [
        zad('Mieszkam na {{*4.|4}} piętrze.', why='czwartym'),
        zad('Film zaczyna się o godzinie {{18.|*18}}', why='godzina'),
        zad('Wycieczka będzie {{12.|*12}} czerwca.', why='miesiąc słowami'),
        zad('Ola zajęła {{*3.|3}} miejsce w konkursie.', why='trzecie'),
        zad('Król Zygmunt {{III.|*III}} Waza', why='cyfra rzymska'),
        zad('Gol padł w {{*15.|15}} minucie meczu.', why='piętnastej'),
    ],
    pokaz='kropka', opcje=[ZK, BK], szer=900,
)
SCENY += [
    Z2,
    odp(2,
        'Sprawdzamy. Na czwartym piętrze z kropką, bo to liczebnik porządkowy. O godzinie osiemnastej bez kropki, bo '
        'to godzina. Dwunastego czerwca bez kropki, bo miesiąc jest słowami. Trzecie miejsce z kropką. Zygmunt trzeci '
        'bez kropki, bo to cyfra rzymska. I w piętnastej minucie z kropką.',
        Z2, ['piętrze', 'godzinie', 'czerwca', 'miejsce', 'zygmunt', 'minucie']),
]

Z3 = zadanie(
    3,
    'Zadanie trzecie. Zapisz każdą datę w inny sposób, tak jak mówi polecenie. Masz minutę. Jeśli potrzebujesz '
    'więcej czasu, zatrzymaj film. Start!',
    (3, 'ZAPISUJEMY'), 'Zapisz datę w inny sposób.',
    [
        zad('1 maja 2026 r. ➜ miesiąc rzymski: [[1 V 2026]]'),
        zad('15.08.2025 ➜ miesiąc słowami: [[15 sierpnia 2025 r.|15 sierpnia 2025]]'),
        zad('6 XII 2026 ➜ same cyfry arabskie: [[6.12.2026|06.12.2026]]'),
        zad('11 listopada 1918 r. ➜ miesiąc rzymski: [[11 XI 1918]]'),
    ],
    pokaz='inny', szer=1000,
)
SCENY += [
    Z3,
    odp(3,
        'Sprawdzamy. Pierwszy maja: jedynka, odstęp, rzymska piątka, odstęp i rok. Piętnasty sierpnia: piętnaście, '
        'słowo sierpnia i rok, bez kropki po dniu. Szósty grudnia cyframi arabskimi: szóstka, kropka, dwanaście, '
        'kropka, rok. I jedenasty listopada: jedenaście, rzymska jedenastka, tysiąc dziewięćset osiemnaście. To Narodowe '
        'Święto Niepodległości!',
        Z3, ['maja', 'sierpnia', 'grudnia', 'listopada']),
    zapamietaj(
        'Zapamiętaj! W dacie z samych cyfr arabskich stawiamy kropki. Gdy miesiąc jest cyfrą rzymską albo słowami, po '
        'dniu nie ma kropki. Kropkę stawiamy po cyfrze arabskiej, która oznacza liczebnik porządkowy: na ósmym piętrze. '
        'Nie stawiamy jej przy godzinach, przy dniu przed nazwą miesiąca i po cyfrach rzymskich. Brawo!',
        [
            ('📅 17.10.2026 - cyfry arabskie, kropki', 'arabskich'),
            ('🏛️ 17 X 2026 · 17 października 2026 r. - bez kropki po dniu', 'rzymską'),
            ('🏢 na 8. piętrze - kropka po liczebniku porządkowym', 'ósmym'),
            ('🚫 o godzinie 17 · 23 października · XX wiek - bez kropki', 'godzinach'),
        ],
    ),
]
