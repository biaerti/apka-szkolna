# Klasa 5, lekcja 33: Co juz wiemy o przymiotniku? Odmiana, rodzaj meskoosobowy, -cy/-dzy/-czy/-zy
# (NEON s. 117-119). Przyklady wlasne - inne niz w filmach kl. 4 (filmiki/przymiotnik*).
from zbuduj import *

TYTUL = 'Przymiotnik'
EMO = '🎨🔁🪤'
KOLOR = '#E07B12'
PORT = 9423
CSS = '.pod { color: var(--szary); font-size: 24px; }'

ONE, ONI = ('👭 one', 'var(--fiolet)'), ('👨‍👦 oni', 'var(--ak)')

SCENY = [
    intro(
        'Cześć! Przymiotnik znacie od dawna. To on mówi, że lody są czekoladowe, a pies jest wielki i kudłaty. Dziś '
        'przypomnimy, jak przymiotnik się odmienia i jak dopasowuje się do rzeczownika. Poznacie też dwa rodzaje w '
        'liczbie mnogiej i jedną sprytną pułapkę. Czekają na was trzy zadania. Przygotujcie zeszyty!',
        'Przymiotnik',
        [('🔁 odmiana', 'odmienia'), ('👨‍👦 dwa rodzaje', 'rodzaje'), ('🪤 pułapka', 'pułapkę')],
    ),
    teoria(
        'przypomnienie',
        'Przymiotnik to odmienna część mowy. Nazywa cechy ludzi, zwierząt, roślin, rzeczy i zjawisk. Odpowiada na '
        'pytania: jaki? jaka? jakie? Przymiotnik trzyma się rzeczownika i dopasowuje się do niego jak cień. Ma ten sam '
        'przypadek, tę samą liczbę i ten sam rodzaj. Zielony ogórek, zielona papryka, zielone jabłko. A z innym '
        'przypadkiem: z zielonym ogórkiem, z zieloną papryką.',
        (1, 'PRZYPOMNIENIE'), 'Co już wiemy? 🎨',
        karta('PRZYMIOTNIK', 'nazywa cechy · odpowiada na pytania: jaki? jaka? jakie?', 'cechy', 'var(--ak)'),
        chipy(chip('przypadek', 'przypadek', 'var(--fiolet)'), chip('liczba', 'liczbę', 'var(--fiolet)'),
              chip('rodzaj', 'rodzaj', 'var(--fiolet)'), chip('= jak rzeczownik 🫥', 'cień', 'var(--ciemny)')),
        lista(
            linia('🥒 zielon<b class="ak">y</b> ogórek · 🫑 zielon<b class="ak">a</b> papryka · 🍏 zielon<b class="ak">e</b> jabłko', 'ogórek'),
            linia('➜ z zielon<b class="ak">ym</b> ogórkiem · z zielon<b class="ak">ą</b> papryką', 'zielonym'),
            szer=960,
        ),
    ),
    teoria(
        'tabela',
        'Zobaczcie całą odmianę na przykładzie: wesoły klaun. Mianownik: wesoły klaun. Dopełniacz: nie ma wesołego '
        'klauna. Celownik: przyglądam się wesołemu klaunowi. Biernik: widzę wesołego klauna. Narzędnik: idę z wesołym '
        'klaunem. Miejscownik: mówię o wesołym klaunie. A w liczbie mnogiej: weseli klauni, wesołych klaunów, wesołym '
        'klaunom i tak dalej. Końcówka przymiotnika zmienia się razem z końcówką rzeczownika.',
        (1, 'PRZYPOMNIENIE'), 'Odmiana: wesoły klaun 🤡',
        tabela(['przypadek', 'liczba pojedyncza', 'liczba mnoga'], [
            ['M. kto? co?', 'wesoł<b class="ak">y</b> klaun', 'wesel<b class="ak">i</b> klauni'],
            ['D. kogo? czego?', 'wesoł<b class="ak">ego</b> klauna', 'wesoł<b class="ak">ych</b> klaunów'],
            ['C. komu? czemu?', 'wesoł<b class="ak">emu</b> klaunowi', 'wesoł<b class="ak">ym</b> klaunom'],
            ['B. kogo? co?', 'wesoł<b class="ak">ego</b> klauna', 'wesoł<b class="ak">ych</b> klaunów'],
            ['N. z kim? z czym?', 'wesoł<b class="ak">ym</b> klaunem', 'wesoł<b class="ak">ymi</b> klaunami'],
            ['Ms. o kim? o czym?', 'wesoł<b class="ak">ym</b> klaunie', 'wesoł<b class="ak">ych</b> klaunach'],
        ], ['mianownik', 'dopełniacz', 'celownik', 'biernik', 'narzędnik', 'miejscownik'], szer=980),
        chipy(chip('końcówka przymiotnika idzie za rzeczownikiem', 'końcówka', 'var(--fiolet)')),
    ),
]

Z1 = zadanie(
    1,
    'Zadanie pierwsze. W nawiasach są przymiotniki w podstawowej formie. Dopasuj je do rzeczowników i zapisz w '
    'zeszycie tylko poprawne formy. Masz minutę. Jeśli potrzebujesz więcej czasu, zatrzymaj film. Start!',
    (1, 'PRZYPOMNIENIE'), 'Dopasuj przymiotnik do rzeczownika. Zapisz tylko przymiotniki.',
    [
        zad('Idę do kina z <span class="pod">(nowy)</span> [[nową]] koleżanką.', why='z kim?'),
        zad('Nie mam <span class="pod">(czerwony)</span> [[czerwonego]] długopisu.', why='czego nie mam?'),
        zad('Marzę o <span class="pod">(ciepły)</span> [[ciepłym]] morzu.', why='o czym?'),
        zad('Kupiłem prezent <span class="pod">(młodszy)</span> [[młodszej]] siostrze.', why='komu?'),
        zad('Z okna widzę <span class="pod">(wysoki)</span> [[wysoką]] wieżę.', why='co widzę?'),
    ],
    pokaz='rzeczowników',
)
SCENY += [
    Z1,
    odp(1,
        'Sprawdzamy. Z nową koleżanką, bo pytamy: z kim? Nie mam czerwonego długopisu, bo: czego nie mam? Marzę o '
        'ciepłym morzu. Prezent młodszej siostrze, bo: komu? I widzę wysoką wieżę. Przymiotnik zawsze bierze '
        'przypadek od swojego rzeczownika.',
        Z1, ['nową', 'czerwonego', 'ciepłym', 'młodszej', 'wysoką']),
    teoria(
        'rodzaje',
        'W liczbie pojedynczej przymiotnik ma trzy rodzaje: męski, żeński i nijaki. Miły chłopiec, miła dziewczynka, '
        'miłe dziecko. W liczbie mnogiej są tylko dwa rodzaje. Rodzaj męskoosobowy to grupa, w której jest choć jeden '
        'mężczyzna albo chłopiec: mili chłopcy, mili rodzice, mili sąsiedzi. Wszystko inne to rodzaj '
        'niemęskoosobowy: miłe dziewczynki, miłe psy, miłe domy. Prosty test: czy o grupie powiesz oni, czy one? '
        'Oni to męskoosobowy, one to niemęskoosobowy.',
        (2, 'LICZBA MNOGA'), 'Dwa rodzaje w liczbie mnogiej 👨‍👦👭',
        linia('liczba pojedyncza: mił<b class="ak">y</b> chłopiec · mił<b class="ak">a</b> dziewczynka · mił<b class="ak">e</b> dziecko',
              'trzy', styl='width:1000px;margin:16px auto 0'),
        rzad(
            karta('męskoosobowy · ONI', 'mil<b>i</b> chłopcy · mil<b>i</b> rodzice · mil<b>i</b> sąsiedzi', 'męskoosobowy',
                  'var(--ak)', emo='👨‍👦'),
            karta('niemęskoosobowy · ONE', 'mił<b>e</b> dziewczynki · mił<b>e</b> psy · mił<b>e</b> domy', 'niemęskoosobowy',
                  'var(--fiolet)', emo='👭🐕🏠'),
        ),
        chipy(chip('test: oni ➜ męskoosobowy · one ➜ niemęskoosobowy', 'test', 'var(--zielony)')),
    ),
]

Z2 = zadanie(
    2,
    'Zadanie drugie. Wybierz poprawną formę przymiotnika. Pomyśl: oni czy one? Zapisz w zeszycie numer i wybraną '
    'formę. Masz minutę. Jeśli potrzebujesz więcej czasu, zatrzymaj film. Start!',
    (2, 'LICZBA MNOGA'), 'Oni czy one? Wybierz formę przymiotnika.',
    [
        zad('{{mili|*miłe}} koleżanki', 'one', kolor='var(--fiolet)'),
        zad('{{*zdolni|zdolne}} uczniowie', 'oni', kolor='var(--ak)'),
        zad('{{dobrzy|*dobre}} psy', 'one', kolor='var(--fiolet)'),
        zad('{{*weseli|wesołe}} sąsiedzi', 'oni', kolor='var(--ak)'),
        zad('{{*wysocy|wysokie}} koszykarze', 'oni', kolor='var(--ak)'),
        zad('{{wysocy|*wysokie}} drzewa', 'one', kolor='var(--fiolet)'),
    ],
    pokaz='formę', opcje=[ONI, ONE], szer=760,
)
SCENY += [
    Z2,
    odp(2,
        'Sprawdzamy. Miłe koleżanki, bo one. Zdolni uczniowie, bo oni. Dobre psy, bo psy to one, nie oni. Weseli '
        'sąsiedzi, bo oni. Wysocy koszykarze, bo oni. I wysokie drzewa, bo drzewa to one.',
        Z2, ['koleżanki', 'uczniowie', 'psy', 'sąsiedzi', 'koszykarze', 'drzewa']),
    teoria(
        'pulapka',
        'A teraz pułapka. Zwykle przymiotnik w rodzaju męskoosobowym zmienia końcówkę: wysoki chłopiec, ale wysocy '
        'chłopcy. Miły pan, ale mili panowie. Są jednak przymiotniki, które w tej formie się nie zmieniają. To te, '
        'które kończą się tak jak obcy, cudzy, uroczy albo świeży. Obcy turysta i obcy turyści. Cudzy brat i cudzy '
        'bracia. Uroczy chłopiec i uroczy chłopcy. Śpiący kolega i śpiący koledzy. Wyjątek to duży: duży chłopiec, ale '
        'duzi chłopcy.',
        (3, 'PUŁAPKA'), 'Pułapka: forma się nie zmienia 🪤',
        linia('zwykle: wysok<b class="ak">i</b> chłopiec ➜ wysoc<b class="ak">y</b> chłopcy · mił<b class="ak">y</b> pan ➜ mil<b class="ak">i</b> panowie',
              'zwykle', styl='width:1100px;margin:14px auto 0'),
        chipy(chip('-cy', 'kończą', 'var(--roz)'), chip('-dzy', 'kończą', 'var(--roz)', po=0.2),
              chip('-czy', 'kończą', 'var(--roz)', po=0.4), chip('-ży', 'kończą', 'var(--roz)', po=0.6)),
        lista(
            linia('obcy turysta ➜ <b class="ak">obcy</b> turyści', 'turyści'),
            linia('cudzy brat ➜ <b class="ak">cudzy</b> bracia', 'bracia'),
            linia('uroczy chłopiec ➜ <b class="ak">uroczy</b> chłopcy · śpiący kolega ➜ <b class="ak">śpiący</b> koledzy', 'uroczy'),
            linia('⚠️ wyjątek: duży chłopiec ➜ <b class="zle">duzi</b> chłopcy', 'wyjątek'),
            szer=1000,
        ),
    ),
]

Z3 = zadanie(
    3,
    'Zadanie trzecie. Zmień przymiotniki na liczbę mnogą. Uważaj, nie każdy zachowuje się tak samo. Zapisz w '
    'zeszycie tylko przymiotniki. Masz minutę. Jeśli potrzebujesz więcej czasu, zatrzymaj film. Start!',
    (3, 'PUŁAPKA'), 'Liczba mnoga. Zapisz tylko przymiotniki.',
    [
        zad('obcy pan ➜ [[obcy]] panowie', why='bez zmiany'),
        zad('śpiący brat ➜ [[śpiący]] bracia', why='bez zmiany'),
        zad('duży chłopiec ➜ [[duzi]] chłopcy', why='wyjątek'),
        zad('mądry nauczyciel ➜ [[mądrzy]] nauczyciele', why='zwykła zmiana'),
        zad('uroczy pies ➜ [[urocze]] psy', why='psy to „one”'),
        zad('cudzy sąsiad ➜ [[cudzy]] sąsiedzi', why='bez zmiany'),
    ],
    pokaz='przymiotniki', szer=1000,
)
SCENY += [
    Z3,
    odp(3,
        'Sprawdzamy. Obcy panowie, bez zmiany. Śpiący bracia, też bez zmiany. Duzi chłopcy, bo duży to wyjątek. Mądrzy '
        'nauczyciele, tu końcówka zmienia się jak zwykle. Urocze psy! Psy to nie osoby, więc to rodzaj '
        'niemęskoosobowy. I cudzy sąsiedzi, bez zmiany.',
        Z3, ['obcy', 'śpiący', 'duzi', 'mądrzy', 'urocze', 'cudzy']),
    zapamietaj(
        'Zapamiętaj! Przymiotnik odmienia się przez przypadki, liczby i rodzaje i zawsze dopasowuje się do '
        'rzeczownika. W liczbie mnogiej ma dwa rodzaje: męskoosobowy, gdy mówimy oni, i niemęskoosobowy, gdy mówimy '
        'one. Przymiotniki takie jak obcy, cudzy czy uroczy w rodzaju męskoosobowym się nie zmieniają. Wyjątek to '
        'duzi. Brawo!',
        [
            ('🔁 przypadek, liczba, rodzaj - taki sam jak rzeczownika', 'przypadki'),
            ('👨‍👦 oni ➜ męskoosobowy: mili chłopcy', 'oni'),
            ('👭 one ➜ niemęskoosobowy: miłe psy, miłe koleżanki', 'one'),
            ('🪤 -cy, -dzy, -czy, -ży bez zmiany: obcy turyści · wyjątek: duzi', 'obcy'),
        ],
    ),
]
