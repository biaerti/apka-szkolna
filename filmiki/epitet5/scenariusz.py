# Klasa 5, lekcja 30: „Ręce” - epitet (NEON s. 108-109). Przyklady wlasne, bez cytatow z wiersza.
from zbuduj import *

TYTUL = 'Epitet'
EMO = '✋🎨👀'
KOLOR = '#D9572B'
PORT = 9420

SCENY = [
    intro(
        'Cześć! Zamknijcie na chwilę oczy i wyobraźcie sobie dłoń. A teraz wyobraźcie sobie ciepłą, szorstką, '
        'spracowaną dłoń dziadka. Widzicie różnicę? Słowa, które ją zrobiły, to epitety. Dziś przypomnimy, czym jest '
        'epitet, jak go znaleźć w tekście i po co poeci go używają. Czekają na was trzy zadania. Przygotujcie zeszyty!',
        'Epitet',
        [('🔍 co to jest', 'czym'), ('🎯 jak go znaleźć', 'znaleźć'), ('🎨 po co', 'poeci')],
    ),
    teoria(
        'co-to',
        'Epitet to określenie rzeczownika. Mówi, jaki jest człowiek, przedmiot albo zjawisko. Najczęściej epitet jest '
        'przymiotnikiem, więc odpowiada na pytania: jaki? jaka? jakie? Jaki dzień? Deszczowy. Jaka herbata? Gorąca. '
        'Jakie oczy? Wesołe. Epitet stoi tuż przy rzeczowniku. Zwykle przed nim, ale czasem za nim, na przykład: '
        'oczy wesołe.',
        (1, 'CO TO JEST'), 'Co to jest epitet? 🔍',
        karta('EPITET = określenie rzeczownika', 'mówi, jaki jest człowiek, przedmiot albo zjawisko', 'określenie', 'var(--ak)'),
        chipy(chip('jaki?', 'pytania', 'var(--fiolet)'), chip('jaka?', 'pytania', 'var(--fiolet)', po=0.3),
              chip('jakie?', 'pytania', 'var(--fiolet)', po=0.6)),
        lista(
            linia('🌧️ jaki dzień? ➜ <b class="ak">deszczowy</b> dzień', 'deszczowy'),
            linia('🍵 jaka herbata? ➜ <b class="ak">gorąca</b> herbata', 'gorąca'),
            linia('😄 jakie oczy? ➜ <b class="ak">wesołe</b> oczy · oczy <b class="ak">wesołe</b>', 'wesołe'),
            szer=900,
        ),
    ),
    teoria(
        'obraz',
        'Po co nam epitety? Porównajcie dwa zdania. Pierwsze: Na stole stała zupa. Drugie: Na starym, drewnianym stole '
        'stała gorąca, pachnąca zupa. W drugim zdaniu od razu widzimy kuchnię i czujemy zapach. Epitety budują obraz. '
        'Tworzą też nastrój. Szare, zimne popołudnie i złote, słoneczne popołudnie to ta sama pora dnia, a jak inaczej '
        'się czujemy!',
        (1, 'CO TO JEST'), 'Po co są epitety? 🎨',
        rzad(
            karta('bez epitetów', 'Na stole stała zupa.', 'pierwsze', 'var(--szary)'),
            karta('z epitetami', 'Na <span class="hl">starym, drewnianym</span> stole stała <span class="hl">gorąca, pachnąca</span> zupa.', 'drugie', 'var(--ak)'),
        ),
        chipy(chip('👀 budują obraz', 'obraz', 'var(--ak)'), chip('🎭 tworzą nastrój', 'nastrój', 'var(--fiolet)')),
        lista(
            linia('☁️ <span class="hl">szare, zimne</span> popołudnie', 'szare'),
            linia('☀️ <span class="hl">złote, słoneczne</span> popołudnie', 'złote'),
            szer=760,
        ),
    ),
]

Z1 = zadanie(
    1,
    'Zadanie pierwsze. Przeczytaj pięć zdań. W każdym jest jeden epitet. Zapisz w zeszycie tylko te epitety. '
    'Masz minutę. Jeśli potrzebujesz więcej czasu, zatrzymaj film. Start!',
    (1, 'CO TO JEST'), 'Znajdź w każdym zdaniu epitet. Zapisz tylko epitety.',
    [
        zad('Mama upiekła ((kruche)) ciasteczka.', why='jakie ciasteczka?'),
        zad('Za oknem szumi ((jesienny)) wiatr.', why='jaki wiatr?'),
        zad('Dziadek ma ((siwą)) brodę.', why='jaką brodę?'),
        zad('Ola nosi plecak ((czerwony)).', why='jaki plecak? - za rzeczownikiem'),
        zad('Usłyszałam ((cichy)) szept.', why='jaki szept?'),
    ],
    pokaz='pięć',
)
SCENY += [
    Z1,
    odp(1,
        'Sprawdzamy. Kruche, bo pytamy: jakie ciasteczka? Jesienny, bo: jaki wiatr? Siwą, bo: jaką brodę? '
        'Czerwony, bo: jaki plecak? Uwaga, tu epitet stoi za rzeczownikiem. I cichy, bo: jaki szept? '
        'Zawsze zaczynamy od rzeczownika i zadajemy pytanie.',
        Z1, ['kruche', 'jesienny', 'siwą', 'czerwony', 'cichy']),
    teoria(
        'kim-jest',
        'Epitety mówią nie tylko o wyglądzie. Mogą też zdradzić, jaki jest człowiek. Spójrzcie na ręce. Zręczne ręce '
        'należą do kogoś, kto wszystko umie naprawić. Spracowane ręce ma osoba, która dużo i ciężko pracuje. '
        'Troskliwe ręce opiekują się innymi. Delikatne ręce głaszczą i pocieszają. Jedno słowo, a już coś wiemy '
        'o człowieku.',
        (2, 'EPITET O CZŁOWIEKU'), 'Jakie są ręce? ✋',
        rzad(
            karta('zręczne', 'umie wszystko naprawić', 'zręczne', 'var(--ak)', emo='🔧'),
            karta('spracowane', 'dużo i ciężko pracuje', 'spracowane', 'var(--fiolet)', emo='🧱'),
        ),
        rzad(
            karta('troskliwe', 'opiekuje się innymi', 'troskliwe', 'var(--zielony)', emo='🩹'),
            karta('delikatne', 'głaszcze i pociesza', 'delikatne', 'var(--niebieski)', emo='🤲'),
        ),
        chipy(chip('jedno słowo = coś o człowieku', 'człowieku', 'var(--ciemny)')),
    ),
]

Z2 = zadanie(
    2,
    'Zadanie drugie. W każdym zdaniu są dwa epitety do wyboru. Wybierz ten, który pasuje do sytuacji. Zapisz w '
    'zeszycie numer i wybrane słowo. Masz minutę. Jeśli potrzebujesz więcej czasu, zatrzymaj film. Start!',
    (2, 'EPITET O CZŁOWIEKU'), 'Który epitet pasuje do sytuacji?',
    [
        zad('Babcia zrobiła mi sweter na drutach. Ma {{*zręczne|leniwe}} ręce.'),
        zad('Tata cały dzień nosił cegły. Ma {{gładkie|*spracowane}} ręce.'),
        zad('Pielęgniarka ostrożnie zmienia opatrunek. Ma {{ciężkie|*delikatne}} ręce.'),
        zad('Kot długo leżał na słońcu. Ma {{*ciepłe|lodowate}} futro.'),
        zad('Po spacerze w mrozie mam {{gorące|*zmarznięte}} dłonie.'),
    ],
    pokaz='sytuacji',
)
SCENY += [
    Z2,
    odp(2,
        'Sprawdzamy. Zręczne, bo robienie swetra wymaga sprawnych palców. Spracowane, bo tata ciężko pracował cały '
        'dzień. Delikatne, bo przy opatrunku trzeba uważać, żeby nie bolało. Ciepłe, bo kot grzał się na słońcu. '
        'I zmarznięte, bo był mróz. Epitet musi pasować do tego, co się dzieje.',
        Z2, ['zręczne', 'spracowane', 'delikatne', 'ciepłe', 'zmarznięte']),
    teoria(
        'trafne',
        'Epitety pomagają pisać ciekawie, ale ważne jest, żeby były trafne. Słowo ładny mówi bardzo mało. Ładny ogród? '
        'Lepiej: kolorowy albo pachnący. Ładny dzień? Lepiej: słoneczny albo ciepły. Ładna piosenka? Wesoła albo '
        'melodyjna. I nie przesadzajcie z liczbą. Mały, malutki, drobny, niewielki kotek to za dużo. Wystarczą jeden '
        'albo dwa dobre epitety.',
        (3, 'TRAFNY EPITET'), 'Trafny epitet 🎯',
        lista(
            linia('🌷 <span class="skr">ładny</span> ogród ➜ <b class="ak">kolorowy, pachnący</b>', 'ogród'),
            linia('☀️ <span class="skr">ładny</span> dzień ➜ <b class="ak">słoneczny, ciepły</b>', 'dzień'),
            linia('🎵 <span class="skr">ładna</span> piosenka ➜ <b class="ak">wesoła, melodyjna</b>', 'piosenka'),
            linia('🐱 <span class="skr">mały, malutki, drobny, niewielki</span> kotek ➜ za dużo!', 'malutki'),
            szer=980,
        ),
        chipy(chip('1-2 dobre epitety wystarczą', 'wystarczą', 'var(--zielony)')),
    ),
]

Z3 = zadanie(
    3,
    'Zadanie trzecie. Słowo fajny mówi bardzo mało. Przy każdym wyrażeniu zapisz w zeszycie jeden dokładniejszy '
    'epitet. Masz minutę. Jeśli potrzebujesz więcej czasu, zatrzymaj film. Start!',
    (3, 'TRAFNY EPITET'), 'Zamień „fajny” na dokładniejszy epitet. Jedno słowo.',
    [
        zad('<span class="skr">fajny</span> film ➜ [[ciekawy]]', why='albo: zabawny, wzruszający'),
        zad('<span class="skr">fajna</span> kurtka ➜ [[ciepła]]', why='albo: wygodna, kolorowa'),
        zad('<span class="skr">fajny</span> kolega ➜ [[koleżeński]]', why='albo: wesoły, uczynny'),
        zad('<span class="skr">fajne</span> wakacje ➜ [[słoneczne]]', why='albo: udane, niezapomniane'),
    ],
    pokaz='wyrażeniu', szer=1000,
)
SCENY += [
    Z3,
    odp(3,
        'Sprawdzamy. Tu dobrych odpowiedzi jest wiele. Film może być ciekawy, zabawny albo wzruszający. Kurtka może '
        'być ciepła, wygodna albo kolorowa. Kolega może być koleżeński, wesoły albo uczynny. Wakacje mogą być '
        'słoneczne, udane, niezapomniane. Każde z tych słów mówi więcej niż fajny, bo nazywa konkretną cechę.',
        Z3, ['ciekawy', 'ciepła', 'koleżeński', 'słoneczne']),
    zapamietaj(
        'Zapamiętaj! Epitet to określenie rzeczownika. Najczęściej jest przymiotnikiem i odpowiada na pytania: jaki? '
        'jaka? jakie? Epitety budują obraz i nastrój, a także mówią, jaki jest człowiek. Wybieraj trafne epitety '
        'zamiast pustych słów, takich jak ładny czy fajny. Brawo!',
        [
            ('✋ epitet = określenie rzeczownika, najczęściej przymiotnik', 'określenie'),
            ('❓ odpowiada na pytania: jaki? jaka? jakie?', 'pytania'),
            ('🎨 buduje obraz i nastrój', 'obraz'),
            ('🧑 mówi, jaki jest człowiek: zręczne, troskliwe ręce', 'człowiek'),
            ('🎯 trafny epitet zamiast „ładny” i „fajny”', 'trafne'),
        ],
    ),
]
