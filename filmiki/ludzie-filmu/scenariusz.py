# Klasa 5, lekcja 35: Ludzie filmu i gatunki filmowe (NEON s. 124-130). Przyklady wlasne, bez tytulow
# filmow z podrecznika.
from zbuduj import *

TYTUL = 'Ludzie filmu'
EMO = '🎬🎥🍿'
KOLOR = '#B5338A'
PORT = 9425
CSS = '.opcje .chip { font-size: 23px; padding: 3px 18px; }'

RODZ = [('🎭 fabularny', 'var(--ak)'), ('🐧 dokumentalny', 'var(--zielony)'), ('🎨 animowany', 'var(--niebieski)')]
ZAWODY = [z for z in ['reżyser', 'scenarzysta', 'operator', 'scenograf', 'charakteryzator', 'kaskader', 'montażysta']]
GAT = ['komedia', 'przygodowy', 'fantasy', 'science fiction', 'musical', 'kryminał', 'western', 'melodramat']

SCENY = [
    intro(
        'Cześć! Film się kończy, a na ekranie przesuwają się długie napisy. Dziesiątki, a czasem setki nazwisk. Kim są '
        'ci wszyscy ludzie? Dziś poznacie zawody filmowe, a potem rodzaje i gatunki filmów. Czekają na was trzy '
        'zadania. Przygotujcie zeszyty!',
        'Ludzie filmu',
        [('🎬 zawody filmowe', 'zawody'), ('🎞️ rodzaje filmów', 'rodzaje'), ('🍿 gatunki', 'gatunki')],
    ),
    teoria(
        'na-planie',
        'Zacznijmy od tych najważniejszych. Reżyser kieruje całą ekipą. Decyduje, jak ma wyglądać każda scena, i mówi '
        'aktorom, jak mają grać. Scenarzysta pisze scenariusz, czyli tekst filmu: co się dzieje, gdzie i co mówią '
        'postacie. Aktor wciela się w postać i gra ją przed kamerą. A operator obsługuje kamerę. To on decyduje, co '
        'zobaczymy w kadrze.',
        (1, 'LUDZIE FILMU'), 'Kto pracuje nad filmem? 🎬',
        rzad(
            karta('reżyser', 'kieruje ekipą, decyduje o każdej scenie', 'reżyser', 'var(--ak)', emo='🎬'),
            karta('scenarzysta', 'pisze scenariusz - tekst filmu', 'scenarzysta', 'var(--fiolet)', emo='📝'),
        ),
        rzad(
            karta('aktor', 'wciela się w postać i ją gra', 'aktor', 'var(--zielony)', emo='🎭'),
            karta('operator', 'obsługuje kamerę, wybiera kadr', 'operator', 'var(--niebieski)', emo='🎥'),
        ),
    ),
    teoria(
        'za-kulisami',
        'Ale film to też praca wielu osób, których nie widać. Scenograf projektuje dekoracje i dobiera rekwizyty. '
        'Kostiumograf szyje i dobiera stroje. Charakteryzator robi makijaż, przykleja brody, czasem zamienia aktora w '
        'staruszka albo w potwora. Kaskader zastępuje aktora w niebezpiecznych scenach, na przykład skacze z dachu '
        'albo spada ze schodów.',
        (1, 'LUDZIE FILMU'), 'Ludzie, których nie widać 👀',
        rzad(
            karta('scenograf', 'dekoracje i rekwizyty', 'scenograf', 'var(--ak)', emo='🏰'),
            karta('kostiumograf', 'stroje', 'kostiumograf', 'var(--fiolet)', emo='👗'),
        ),
        rzad(
            karta('charakteryzator', 'makijaż, peruki, brody', 'charakteryzator', 'var(--zielony)', emo='💄'),
            karta('kaskader', 'niebezpieczne sceny zamiast aktora', 'kaskader', 'var(--niebieski)', emo='🤸'),
        ),
    ),
    teoria(
        'montaz',
        'Kiedy zdjęcia są gotowe, zaczyna się praca montażysty. Montażysta wybiera najlepsze ujęcia i skleja je w '
        'całość. Realizator dźwięku dba o dźwięki i muzykę. Ciekawostka: odgłos kroków na śniegu często nagrywa się w '
        'studiu, ściskając w dłoni woreczek z mąką ziemniaczaną. A producent? Zdobywa pieniądze na film i pilnuje, '
        'żeby powstał na czas.',
        (1, 'LUDZIE FILMU'), 'Po zdjęciach ✂️',
        rzad(
            karta('montażysta', 'wybiera ujęcia i skleja je w całość', 'montażysta', 'var(--ak)', emo='✂️'),
            karta('realizator dźwięku', 'dźwięki i muzyka', 'realizator', 'var(--fiolet)', emo='🎧'),
            karta('producent', 'pieniądze i terminy', 'producent', 'var(--zielony)', emo='💰'),
        ),
        linia('❄️👣 kroki na śniegu = woreczek z mąką ziemniaczaną!', 'kroków', styl='width:900px;margin:22px auto 0'),
    ),
]

Z1 = zadanie(
    1,
    'Zadanie pierwsze. Kto to robi? Przy każdym opisie zapisz w zeszycie nazwę zawodu. Pomogą wam słowa na '
    'ekranie. Masz minutę. Jeśli potrzebujesz więcej czasu, zatrzymaj film. Start!',
    (1, 'LUDZIE FILMU'), 'Kto to robi? Zapisz nazwę zawodu.',
    [
        zad('Zmienia aktora w starego czarodzieja z brodą. ➜ [[charakteryzator]]'),
        zad('Wybiera najlepsze ujęcia i skleja je. ➜ [[montażysta]]'),
        zad('Skacze z mostu zamiast gwiazdy filmu. ➜ [[kaskader]]'),
        zad('Pisze, co mówią bohaterowie. ➜ [[scenarzysta]]'),
        zad('Kieruje pracą całej ekipy na planie. ➜ [[reżyser]]'),
    ],
    pokaz='opisie', opcje=ZAWODY,
)
SCENY += [
    Z1,
    odp(1,
        'Sprawdzamy. Charakteryzator, bo zmienia wygląd aktora. Montażysta, bo wybiera i skleja ujęcia. Kaskader, bo '
        'to on wykonuje niebezpieczne skoki. Scenarzysta, bo pisze tekst filmu. I reżyser, bo kieruje całą ekipą.',
        Z1, ['charakteryzator', 'montażysta', 'kaskader', 'scenarzysta', 'reżyser']),
    teoria(
        'rodzaje',
        'Filmy dzielimy na trzy rodzaje. Film fabularny opowiada wymyśloną historię, a grają w nim aktorzy. Film '
        'dokumentalny pokazuje prawdziwe wydarzenia, ludzi, zwierzęta albo miejsca. Nikt w nim niczego nie udaje. Film '
        'animowany powstaje z rysunków, lalek albo grafiki komputerowej. Kolejne obrazki zmieniają się tak szybko, że '
        'widzimy ruch.',
        (2, 'RODZAJE FILMÓW'), 'Trzy rodzaje filmów 🎞️',
        rzad(
            karta('fabularny', 'wymyślona historia, grają aktorzy', 'fabularny', 'var(--ak)', emo='🎭'),
            karta('dokumentalny', 'prawdziwe wydarzenia, ludzie, zwierzęta', 'dokumentalny', 'var(--zielony)', emo='🐧'),
            karta('animowany', 'rysunki, lalki, komputer', 'animowany', 'var(--niebieski)', emo='🎨'),
        ),
        chipy(chip('🖼️ ➜ 🖼️ ➜ 🖼️ szybko = ruch', 'ruch', 'var(--fiolet)')),
    ),
]

Z2 = zadanie(
    2,
    'Zadanie drugie. Przeczytaj opisy pięciu filmów. Przy każdym numerze zapisz rodzaj filmu: fabularny, '
    'dokumentalny albo animowany. Masz minutę. Jeśli potrzebujesz więcej czasu, zatrzymaj film. Start!',
    (2, 'RODZAJE FILMÓW'), 'Jaki to rodzaj filmu?',
    [
        zad('Przyrodnicy filmują życie pingwinów na Antarktydzie.', 'dokumentalny', kolor='var(--zielony)'),
        zad('Aktorzy grają rodzinę, która wygrywa wycieczkę w kosmos.', 'fabularny', kolor='var(--ak)'),
        zad('Narysowana historia psa, który zostaje detektywem.', 'animowany', kolor='var(--niebieski)'),
        zad('Reportaż o tym, jak w fabryce powstaje czekolada.', 'dokumentalny', kolor='var(--zielony)'),
        zad('Bajka o plastelinowych ludzikach, nagrana klatka po klatce.', 'animowany', kolor='var(--niebieski)'),
    ],
    pokaz='filmów', opcje=RODZ,
)
SCENY += [
    Z2,
    odp(2,
        'Sprawdzamy. Pierwszy to film dokumentalny, bo pokazuje prawdziwe pingwiny. Drugi fabularny, bo aktorzy grają '
        'wymyśloną historię. Trzeci animowany, bo jest narysowany. Czwarty dokumentalny, bo pokazuje prawdziwą '
        'fabrykę. Piąty animowany, bo plastelinowe ludziki nagrywa się klatka po klatce.',
        Z2, ['dokumentalny', 'fabularny', 'animowany', 'dokumentalny', 'animowany']),
    teoria(
        'gatunki',
        'W każdym rodzaju są gatunki filmowe. Komedia ma nas rozśmieszyć. Film przygodowy to szybka akcja, podróże i '
        'niebezpieczeństwa. Fantasy pokazuje świat magii, smoków i czarodziejów. Science fiction opowiada o '
        'przyszłości, kosmosie i niezwykłych wynalazkach. W musicalu bohaterowie śpiewają i tańczą. Kryminał to '
        'zagadka: kto popełnił przestępstwo? Western dzieje się na Dzikim Zachodzie, wśród kowbojów. A melodramat '
        'opowiada o miłości i wzruszeniach.',
        (3, 'GATUNKI'), 'Gatunki filmowe 🍿',
        lista(
            linia('😂 <b class="ak">komedia</b> - rozśmiesza', 'komedia'),
            linia('🧭 <b class="ak">przygodowy</b> - akcja, podróże', 'przygodowy'),
            linia('🐉 <b class="ak">fantasy</b> - magia, smoki', 'fantasy'),
            linia('🚀 <b class="ak">science fiction</b> - przyszłość, kosmos', 'science'),
            linia('🎤 <b class="ak">musical</b> - śpiew i taniec', 'musicalu'),
            linia('🔍 <b class="ak">kryminał</b> - zagadka przestępstwa', 'kryminał'),
            linia('🤠 <b class="ak">western</b> - Dziki Zachód', 'western'),
            linia('💕 <b class="ak">melodramat</b> - miłość, wzruszenia', 'melodramat'),
            szer=820,
        ),
    ),
]

Z3 = zadanie(
    3,
    'Zadanie trzecie. Jaki to gatunek? Przy każdym opisie zapisz w zeszycie nazwę gatunku. Pomogą wam słowa na '
    'ekranie. Masz minutę. Jeśli potrzebujesz więcej czasu, zatrzymaj film. Start!',
    (3, 'GATUNKI'), 'Jaki to gatunek filmu?',
    [
        zad('Detektyw szuka złodzieja diamentu. ➜ [[kryminał]]'),
        zad('Smok i młody czarodziej ratują królestwo. ➜ [[fantasy]]'),
        zad('Załoga statku leci na Marsa w roku 3000. ➜ [[science fiction]]'),
        zad('Niezdarny kucharz ciągle wpada w śmieszne kłopoty. ➜ [[komedia]]'),
        zad('Kowboj broni miasteczka przed bandytami. ➜ [[western]]'),
    ],
    pokaz='opisie', opcje=GAT,
)
SCENY += [
    Z3,
    odp(3,
        'Sprawdzamy. Detektyw i zagadka to kryminał. Smok i czarodziej to fantasy. Lot na Marsa w przyszłości to '
        'science fiction. Śmieszne kłopoty to komedia. A kowboj to western.',
        Z3, ['kryminał', 'fantasy', 'science', 'komedia', 'western']),
    zapamietaj(
        'Zapamiętaj! Nad filmem pracuje cała ekipa: reżyser kieruje, scenarzysta pisze scenariusz, operator filmuje, a '
        'scenograf, charakteryzator, kaskader i montażysta dbają o resztę. Filmy dzielimy na fabularne, dokumentalne i '
        'animowane. Gatunki filmowe to między innymi komedia, kryminał, fantasy i science fiction. Brawo!',
        [
            ('🎬 reżyser kieruje · scenarzysta pisze · operator filmuje', 'kieruje'),
            ('🏰 scenograf · charakteryzator · kaskader · montażysta', 'scenograf'),
            ('🎞️ rodzaje: fabularny · dokumentalny · animowany', 'fabularne'),
            ('🍿 gatunki: komedia, kryminał, fantasy, science fiction...', 'gatunki'),
        ],
    ),
]
