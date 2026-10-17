# Klasa 5, lekcja 36: Sprawozdanie z filmu lub spektaklu (NEON s. 131-133). Tytuly i nazwiska wymyslone,
# inne niz w filmie dzialu 2 (filmiki/sprawozdanie: zoo, Teatr Lalek "Kot w butach", kino przyrodnicze).
from zbuduj import *

TYTUL = 'Sprawozdanie z filmu lub spektaklu'
EMO = '🎟️🎭📝'
KOLOR = '#0F766E'
PORT = 9426

WST, ROZ, ZAK = ('1. wstęp', 'var(--ak)'), ('2. rozwinięcie', 'var(--fiolet)'), ('3. zakończenie', 'var(--zielony)')
SRODKI = ['gra aktorów', 'muzyka', 'scenografia', 'kostiumy', 'efekty specjalne', 'charakteryzacja']

SCENY = [
    intro(
        'Cześć! Byliście ostatnio w kinie albo w teatrze? Taki wieczór może stać się dobrym tematem do sprawozdania. '
        'Sprawozdanie już znacie. Dziś nauczycie się pisać je z filmu lub spektaklu: co napisać we wstępie, o czym w '
        'rozwinięciu i jak ocenić dzieło na końcu. Czekają na was trzy zadania. Przygotujcie zeszyty!',
        'Sprawozdanie z filmu lub spektaklu',
        [('🎟️ wstęp', 'wstępie'), ('🎞️ rozwinięcie', 'rozwinięciu'), ('⭐ ocena', 'ocenić')],
    ),
    teoria(
        'przypomnienie',
        'Przypomnijmy. Sprawozdanie to rzeczowa relacja z wydarzenia, w którym braliśmy udział. Piszemy je w czasie '
        'przeszłym i trzymamy się faktów. Sprawozdanie z filmu ma te same trzy części: wstęp, rozwinięcie i '
        'zakończenie. Ale w każdej z nich trzeba pamiętać o kilku ważnych rzeczach.',
        (1, 'PLAN'), 'Sprawozdanie - przypomnienie 📝',
        karta('rzeczowa relacja z wydarzenia, w którym braliśmy udział', 'czas przeszły · tylko fakty', 'relacja',
              'var(--ak)', styl='width:1000px;margin:18px auto 0'),
        rzad(
            karta('1. wstęp', '', 'wstęp', 'var(--ak)', emo='🎟️'),
            karta('2. rozwinięcie', '', 'rozwinięcie', 'var(--fiolet)', emo='🎞️'),
            karta('3. zakończenie', '', 'zakończenie', 'var(--zielony)', emo='⭐'),
        ),
    ),
    teoria(
        'wstep',
        'We wstępie odpowiadamy na pytania: kiedy, gdzie i z kim byliśmy. Podajemy tytuł filmu albo spektaklu, '
        'nazwisko reżysera i gatunek. Na przykład: W piątek razem z klasą obejrzałam w kinie Mewa komedię przygodową '
        'pod tytułem Wyspa kota Feliksa w reżyserii Anny Nowak.',
        (1, 'PLAN'), '1. Wstęp 🎟️',
        chipy(chip('kiedy?', 'kiedy', 'var(--ak)'), chip('gdzie?', 'gdzie', 'var(--ak)'), chip('z kim?', 'kim', 'var(--ak)')),
        chipy(chip('tytuł', 'tytuł', 'var(--fiolet)'), chip('reżyser', 'reżysera', 'var(--fiolet)'),
              chip('gatunek', 'gatunek', 'var(--fiolet)')),
        karta('<i><span class="hl">W piątek</span> razem <span class="hl">z klasą</span> obejrzałam <span class="hl">w kinie '
              'Mewa</span> <span class="hl">komedię przygodową</span> pod tytułem <span class="hl">„Wyspa kota Feliksa”</span> '
              'w reżyserii <span class="hl">Anny Nowak</span>.</i>', '', 'piątek', 'var(--szary)',
              styl='width:1000px;margin:20px auto 0'),
    ),
    teoria(
        'rozwiniecie',
        'W rozwinięciu krótko piszemy, o czym jest film. Krótko, w dwóch albo trzech zdaniach! Nie opowiadamy całej '
        'historii i nie zdradzamy zakończenia. Potem piszemy, co zrobiło na nas wrażenie, czyli o środkach wyrazu. To '
        'gra aktorów, muzyka, scenografia, kostiumy i efekty specjalne. Na przykład: Największe wrażenie zrobiła na '
        'mnie muzyka, która w scenie burzy budowała napięcie.',
        (1, 'PLAN'), '2. Rozwinięcie 🎞️',
        lista(
            linia('📝 o czym jest film? - tylko 2-3 zdania', 'krótko'),
            linia('🤫 bez zakończenia!', 'zakończenia'),
            szer=760,
        ),
        chipy(*[chip(s, w, 'var(--fiolet)') for s, w in
                [('🎭 gra aktorów', 'aktorów'), ('🎵 muzyka', 'muzyka'), ('🏰 scenografia', 'scenografia'),
                 ('👗 kostiumy', 'kostiumy'), ('💥 efekty specjalne', 'efekty')]]),
        karta('<i>Największe wrażenie zrobiła na mnie <span class="hl">muzyka</span>, która w scenie burzy budowała '
              'napięcie.</i>', '', 'napięcie', 'var(--szary)', styl='width:1000px;margin:18px auto 0'),
    ),
    teoria(
        'zakonczenie',
        'W zakończeniu oceniamy całość i uzasadniamy ocenę. Możemy też komuś polecić film. Na przykład: Uważam, że '
        'warto obejrzeć ten film, bo uczy, że przyjaźń jest ważniejsza niż wygrana. Polecam go wszystkim, którzy '
        'lubią przygody.',
        (1, 'PLAN'), '3. Zakończenie ⭐',
        rzad(
            karta('ocena', 'czy warto?', 'oceniamy', 'var(--zielony)', emo='⭐'),
            karta('uzasadnienie', 'dlaczego?', 'uzasadniamy', 'var(--zielony)', emo='💬'),
            karta('polecenie', 'komu?', 'polecić', 'var(--zielony)', emo='👍'),
        ),
        karta('<i>Uważam, że <span class="hl">warto</span> obejrzeć ten film, <span class="hl">bo</span> uczy, że '
              'przyjaźń jest ważniejsza niż wygrana. <span class="hl">Polecam</span> go wszystkim, którzy lubią '
              'przygody.</i>', '', 'uważam', 'var(--szary)', styl='width:1000px;margin:20px auto 0'),
    ),
]

Z1 = zadanie(
    1,
    'Zadanie pierwsze. Do której części sprawozdania pasuje każde zdanie? Przy numerze zapisz: wstęp, rozwinięcie '
    'albo zakończenie. Masz minutę. Jeśli potrzebujesz więcej czasu, zatrzymaj film. Start!',
    (1, 'PLAN'), 'Do której części pasuje to zdanie?',
    [
        zad('Najbardziej podobały mi się kostiumy z dawnych czasów.', 'rozwinięcie', kolor='var(--fiolet)'),
        zad('W sobotę z tatą byłam w teatrze na „Zaczarowanym młynie”.', 'wstęp', kolor='var(--ak)'),
        zad('Polecam ten spektakl, bo jest zabawny i mądry.', 'zakończenie', kolor='var(--zielony)'),
        zad('Film opowiada o chłopcu, który znajduje mapę pirata.', 'rozwinięcie', kolor='var(--fiolet)'),
        zad('Film wyreżyserował Jan Lis.', 'wstęp', kolor='var(--ak)'),
    ],
    pokaz='zdanie', opcje=[WST, ROZ, ZAK],
)
SCENY += [
    Z1,
    odp(1,
        'Sprawdzamy. Pierwsze pasuje do rozwinięcia, bo mówi o kostiumach, czyli o środkach wyrazu. Drugie to wstęp: '
        'kiedy, gdzie, z kim i tytuł. Trzecie to zakończenie, bo jest ocena i polecenie. Czwarte to rozwinięcie, bo '
        'krótko mówi, o czym jest film. Piąte to wstęp, bo podaje reżysera.',
        Z1, ['rozwinięcia', 'wstęp', 'zakończenie', 'rozwinięcie', 'wstęp']),
    teoria(
        'czego-nie',
        'Czego nie piszemy w sprawozdaniu z filmu? Po pierwsze nie streszczamy całej historii scena po scenie. Po drugie '
        'nie zdradzamy zakończenia, żeby nie zepsuć innym niespodzianki. Po trzecie nie piszemy o rzeczach, które nie '
        'dotyczą filmu, na przykład ile kosztował popcorn. I jeszcze jedno: zamiast pisać ciągle fajny i super, '
        'wybierajcie dokładne słowa: zabawny, wzruszający, trzymający w napięciu, widowiskowy.',
        (2, 'CZEGO NIE PISAĆ'), 'Czego nie piszemy? 🚫',
        lista(
            linia('❌ cała historia scena po scenie', 'streszczamy'),
            linia('❌ zakończenie - spoiler! 🤫', 'zdradzamy'),
            linia('❌ popcorn, kolejka do kasy 🍿', 'popcorn'),
            linia('❌ <span class="skr">fajny, super</span> ➜ zabawny · wzruszający · widowiskowy', 'zabawny'),
            szer=1080,
        ),
    ),
]

PAS, NIEP = ('✅ pasuje', 'var(--zielony)'), ('❌ nie pasuje', 'var(--roz)')
Z2 = zadanie(
    2,
    'Zadanie drugie. Ktoś pisze sprawozdanie ze spektaklu. Które zdania nie pasują? Zapisz w zeszycie ich numery. '
    'Masz minutę. Jeśli potrzebujesz więcej czasu, zatrzymaj film. Start!',
    (2, 'CZEGO NIE PISAĆ'), 'Które zdania nie pasują do sprawozdania? Zapisz numery.',
    [
        zad('Spektakl trwał półtorej godziny z przerwą.', 'pasuje'),
        zad('Na końcu okazuje się, że złodziejem był ogrodnik!', 'nie pasuje', 'spoiler', kolor='var(--roz)'),
        zad('Muzyka grana na żywo przez orkiestrę zachwyciła widzów.', 'pasuje'),
        zad('W przerwie kupiłem colę i dwa batoniki.', 'nie pasuje', 'nie o spektaklu', kolor='var(--roz)'),
        zad('Aktorka grająca królową wspaniale zmieniała głos.', 'pasuje'),
        zad('Potem bohater szedł do lasu, potem do zamku...', 'nie pasuje', 'streszcza', kolor='var(--roz)'),
    ],
    pokaz='zdania', opcje=[PAS, NIEP],
)
SCENY += [
    Z2,
    odp(2,
        'Sprawdzamy. Nie pasują zdania: drugie, czwarte i szóste. Drugie zdradza zakończenie, a to psuje niespodziankę. '
        'Czwarte mówi o batonikach, a nie o spektaklu. Szóste to streszczanie scena po scenie. Pozostałe pasują: '
        'długość spektaklu, muzyka i gra aktorki to ważne informacje.',
        Z2, ['długość', 'drugie', 'muzyka', 'czwarte', 'aktorki', 'szóste']),
    teoria(
        'slowa',
        'Kilka słów, które przydadzą się w sprawozdaniu. Seans to pokaz filmu w kinie. Spektakl to przedstawienie w '
        'teatrze. Premiera to pierwszy pokaz. Obsada to wszyscy aktorzy, którzy grają w filmie. Pamiętajcie też, co '
        'znaczą nazwy środków wyrazu. Scenografia to dekoracje. Charakteryzacja to makijaż i fryzury postaci. A efekty '
        'specjalne to na przykład wybuchy albo latające smoki.',
        (3, 'SŁOWNICZEK'), 'Słowniczek widza 📚',
        rzad(
            karta('seans', 'pokaz filmu w kinie', 'seans', 'var(--ak)', emo='🎦'),
            karta('spektakl', 'przedstawienie w teatrze', 'spektakl', 'var(--ak)', emo='🎭'),
            karta('premiera', 'pierwszy pokaz', 'premiera', 'var(--ak)', emo='🥂'),
            karta('obsada', 'wszyscy aktorzy filmu', 'obsada', 'var(--ak)', emo='👥'),
        ),
        rzad(
            karta('scenografia', 'dekoracje', 'dekoracje', 'var(--fiolet)', emo='🏰'),
            karta('charakteryzacja', 'makijaż i fryzury', 'makijaż', 'var(--fiolet)', emo='💄'),
            karta('efekty specjalne', 'wybuchy, latające smoki', 'wybuchy', 'var(--fiolet)', emo='💥'),
        ),
    ),
]

Z3 = zadanie(
    3,
    'Zadanie trzecie. Każde zdanie chwali inny środek wyrazu. Zapisz w zeszycie, co chwali: muzykę, kostiumy, '
    'scenografię, efekty specjalne czy charakteryzację. Masz minutę. Jeśli potrzebujesz więcej czasu, zatrzymaj '
    'film. Start!',
    (3, 'SŁOWNICZEK'), 'Co chwali to zdanie? Zapisz nazwę środka wyrazu.',
    [
        zad('Zamek na scenie miał prawdziwe wieże i most. ➜ [[scenografia|scenografię]]'),
        zad('Smok ział ogniem jak żywy. ➜ [[efekty specjalne]]'),
        zad('Suknie dworskie lśniły od cekinów. ➜ [[kostiumy]]'),
        zad('Czarownica miała zielony nos i splątane włosy. ➜ [[charakteryzacja|charakteryzację]]'),
        zad('W cichych scenach grały skrzypce, a w pościgu bębny. ➜ [[muzyka|muzykę]]'),
    ],
    pokaz='zdanie', opcje=SRODKI,
)
SCENY += [
    Z3,
    odp(3,
        'Sprawdzamy. Zamek z wieżami to scenografia, czyli dekoracje. Smok ziejący ogniem to efekty specjalne. Suknie '
        'to kostiumy. Zielony nos i splątane włosy to charakteryzacja. A skrzypce i bębny to muzyka.',
        Z3, ['scenografia', 'efekty', 'kostiumy', 'charakteryzacja', 'muzyka']),
    zapamietaj(
        'Zapamiętaj! W sprawozdaniu z filmu lub spektaklu we wstępie piszemy, kiedy, gdzie i z kim byliśmy, a także '
        'tytuł, reżysera i gatunek. W rozwinięciu krótko mówimy, o czym jest dzieło, i opisujemy środki wyrazu: grę '
        'aktorów, muzykę, scenografię, kostiumy. W zakończeniu oceniamy i uzasadniamy ocenę. I nie zdradzamy '
        'zakończenia! Brawo!',
        [
            ('🎟️ wstęp: kiedy? gdzie? z kim? · tytuł, reżyser, gatunek', 'wstępie'),
            ('🎞️ rozwinięcie: krótko o czym + środki wyrazu', 'rozwinięciu'),
            ('⭐ zakończenie: ocena i uzasadnienie', 'oceniamy'),
            ('🤫 nie zdradzam zakończenia, nie streszczam wszystkiego', 'zdradzamy'),
        ],
    ),
]
