# Klasa 5, lekcja 32: Tekst publicystyczny - informacja czy opinia? (NEON s. 116). Przyklady wlasne.
from zbuduj import *

TYTUL = 'Tekst publicystyczny'
EMO = '📰🎙️💬'
KOLOR = '#2F6DB5'
PORT = 9422

TAK, NIE = ('✅ tak', 'var(--zielony)'), ('❌ nie', 'var(--roz)')
INF, OPI = ('ℹ️ informacja', 'var(--ak)'), ('💬 opinia', 'var(--fiolet)')

SCENY = [
    intro(
        'Cześć! Codziennie czytacie i oglądacie mnóstwo tekstów: wiadomości w telefonie, artykuły, filmiki z '
        'komentarzem. Część z nich podaje fakty, a część mówi, co ktoś o tych faktach myśli. Dziś poznacie tekst '
        'publicystyczny i nauczycie się odróżniać informację od opinii. Czekają na was trzy zadania. Przygotujcie '
        'zeszyty!',
        'Tekst publicystyczny',
        [('📰 co to jest', 'publicystyczny'), ('ℹ️ informacja', 'informację'), ('💬 opinia', 'opinii')],
    ),
    teoria(
        'co-to',
        'Tekst publicystyczny znajdziecie w gazecie, w radiu, w telewizji i w internecie. Mówi o tym, co dzieje się '
        'teraz, czyli o aktualnych wydarzeniach. Może dotyczyć sportu, nauki, kultury, szkoły albo miasta. Taki tekst '
        'informuje, ale też komentuje. Autor mówi, co myśli o sprawie, i próbuje przekonać do tego odbiorców. '
        'Najczęstsze teksty publicystyczne to artykuł i wywiad.',
        (1, 'CO TO JEST'), 'Tekst publicystyczny 📰',
        chipy(chip('📰 gazeta', 'gazecie', 'var(--ak)'), chip('📻 radio', 'radiu', 'var(--ak)'),
              chip('📺 telewizja', 'telewizji', 'var(--ak)'), chip('💻 internet', 'internecie', 'var(--ak)')),
        karta('aktualne wydarzenia', 'sport · nauka · kultura · szkoła · miasto', 'aktualnych', 'var(--fiolet)',
              styl='width:820px;margin:18px auto 0'),
        rzad(
            karta('ℹ️ informuje', 'podaje fakty', 'informuje', 'var(--ak)'),
            karta('💬 komentuje', 'autor mówi, co myśli, i przekonuje', 'komentuje', 'var(--fiolet)'),
        ),
        chipy(chip('artykuł', 'artykuł', 'var(--zielony)'), chip('wywiad', 'wywiad', 'var(--zielony)')),
    ),
    teoria(
        'artykul-wywiad',
        'Czym różni się artykuł od wywiadu? Artykuł pisze dziennikarz. Sam opowiada o sprawie i dodaje swój '
        'komentarz. Wywiad to rozmowa. Dziennikarz zadaje pytania, a ktoś ciekawy odpowiada, na przykład mistrzyni '
        'szachów albo lekarz. W wywiadzie widać pytania i odpowiedzi, często z myślnikami albo z imionami rozmówców.',
        (1, 'CO TO JEST'), 'Artykuł i wywiad 🎙️',
        rzad(
            karta('📰 ARTYKUŁ', 'dziennikarz sam opowiada o sprawie i komentuje', 'dziennikarz', 'var(--ak)'),
            karta('🎙️ WYWIAD', 'rozmowa: pytania dziennikarza i odpowiedzi rozmówcy', 'rozmowa', 'var(--fiolet)'),
        ),
        lista(
            linia('<b class="ak">– Ile godzin dziennie trenujesz?</b>', 'pytania'),
            linia('– Około trzech. Szachy to dla mnie przygoda.', 'odpowiedzi'),
            szer=820,
        ),
    ),
]

Z1 = zadanie(
    1,
    'Zadanie pierwsze. Przeczytaj pięć opisów. Który z nich to tekst publicystyczny? Przy każdym numerze zapisz '
    'w zeszycie: tak albo nie. Masz minutę. Jeśli potrzebujesz więcej czasu, zatrzymaj film. Start!',
    (1, 'CO TO JEST'), 'Czy to tekst publicystyczny?',
    [
        zad('Artykuł w gazecie o remoncie szkolnego boiska', 'tak', kolor='var(--zielony)'),
        zad('Wywiad z mistrzynią szachów w radiu', 'tak', kolor='var(--zielony)'),
        zad('Baśń o smoku i odważnej księżniczce', 'nie', 'zmyślona', kolor='var(--roz)'),
        zad('Przepis na naleśniki z jagodami', 'nie', 'instrukcja', kolor='var(--roz)'),
        zad('Komentarz na portalu o nowym planie lekcji', 'tak', kolor='var(--zielony)'),
    ],
    pokaz='opisów', opcje=[TAK, NIE],
)
SCENY += [
    Z1,
    odp(1,
        'Sprawdzamy. Pierwsze tak, bo artykuł mówi o aktualnej sprawie w szkole. Drugie tak, to wywiad. Trzecie nie, '
        'bo baśń jest zmyślona. Czwarte nie, przepis uczy gotowania, a nie komentuje wydarzeń. Piąte tak, bo autor '
        'komentuje nowy plan lekcji.',
        Z1, ['tak', 'tak', 'nie', 'nie', 'tak']),
    teoria(
        'info-opinia',
        'W tekście publicystycznym mieszają się informacje i opinie. Informacja to fakt. Można go sprawdzić: datę, '
        'liczbę, miejsce. Na przykład: Mecz zakończył się wynikiem dwa do jednego. Opinia to czyjeś zdanie. Mówi, co '
        'ktoś myśli albo czuje. Z opinią można się nie zgodzić. Na przykład: To był najnudniejszy mecz sezonu. Mądry '
        'odbiorca zawsze odróżnia jedno od drugiego.',
        (2, 'INFORMACJA I OPINIA'), 'Informacja czy opinia? 🤔',
        rzad(
            karta('ℹ️ INFORMACJA', 'fakt - da się sprawdzić: data, liczba, miejsce', 'fakt', 'var(--ak)'),
            karta('💬 OPINIA', 'czyjeś zdanie - można się nie zgodzić', 'zdanie', 'var(--fiolet)'),
        ),
        lista(
            linia('ℹ️ Mecz zakończył się wynikiem 2:1.', 'wynikiem'),
            linia('💬 To był <span class="hl">najnudniejszy</span> mecz sezonu.', 'najnudniejszy'),
            szer=820,
        ),
    ),
]

Z2 = zadanie(
    2,
    'Zadanie drugie. Oto sześć zdań z artykułu o nowym skateparku. Przy każdym numerze zapisz: informacja albo '
    'opinia. Masz minutę. Jeśli potrzebujesz więcej czasu, zatrzymaj film. Start!',
    (2, 'INFORMACJA I OPINIA'), 'Nowy skatepark 🛹 Informacja czy opinia?',
    [
        zad('Skatepark otwarto w sobotę o 10.00.', 'informacja', kolor='var(--ak)'),
        zad('Moim zdaniem to najlepsze miejsce w dzielnicy.', 'opinia', kolor='var(--fiolet)'),
        zad('Na otwarcie przyszło około 200 osób.', 'informacja', kolor='var(--ak)'),
        zad('Wydaje mi się, że rampa jest za niska.', 'opinia', kolor='var(--fiolet)'),
        zad('Budowa trwała pół roku.', 'informacja', kolor='var(--ak)'),
        zad('Wszyscy nastolatkowie będą tu przychodzić codziennie.', 'opinia', kolor='var(--fiolet)'),
    ],
    pokaz='zdań', opcje=[INF, OPI],
)
SCENY += [
    Z2,
    odp(2,
        'Sprawdzamy. Pierwsze to informacja, bo datę i godzinę można sprawdzić. Drugie to opinia, zdradzają ją słowa: '
        'moim zdaniem. Trzecie to informacja, liczbę osób da się policzyć. Czwarte to opinia, bo ktoś mówi: wydaje mi '
        'się. Piąte to informacja. Szóste to opinia, bo nie da się sprawdzić, co zrobią wszyscy nastolatkowie.',
        Z2, ['informacja', 'opinia', 'informacja', 'opinia', 'informacja', 'opinia']),
    teoria(
        'slowa',
        'Jak szybko rozpoznać opinię? Szukajcie czterech rodzajów słów. Pierwsze pokazują przekonanie: sądzę, że, '
        'moim zdaniem, według mnie. Drugie pokazują wątpliwość: chyba, zapewne, najprawdopodobniej, wydaje mi się. '
        'Trzecie oceniają: dobry, kultowy, najlepszy, najgorszy. Czwarte uogólniają, czyli mówią o wszystkich naraz: '
        'wszyscy, zawsze, nikt, nigdy.',
        (3, 'SŁOWA OPINII'), 'Słowa, które zdradzają opinię 🔎',
        rzad(
            karta('🙋 przekonanie', 'sądzę, że · moim zdaniem · według mnie', 'przekonanie', 'var(--ak)'),
            karta('🤔 wątpliwość', 'chyba · zapewne · najprawdopodobniej · wydaje mi się', 'wątpliwość', 'var(--fiolet)'),
        ),
        rzad(
            karta('⭐ ocena', 'dobry · kultowy · najlepszy · najgorszy', 'oceniają', 'var(--zielony)'),
            karta('👥 uogólnienie', 'wszyscy · zawsze · nikt · nigdy', 'uogólniają', 'var(--roz)'),
        ),
    ),
]

Z3 = zadanie(
    3,
    'Zadanie trzecie. W każdym zdaniu jest jedno słowo, które zdradza opinię. Zapisz w zeszycie tylko te słowa. '
    'Masz minutę. Jeśli potrzebujesz więcej czasu, zatrzymaj film. Start!',
    (3, 'SŁOWA OPINII'), 'Które słowo zdradza opinię? Zapisz je.',
    [
        zad('((Sądzę)), że zawody były dobrze przygotowane.', 'przekonanie', kolor='var(--ak)'),
        zad('To ((kultowy)) serial dla całej rodziny.', 'ocena', kolor='var(--zielony)'),
        zad('((Zapewne)) mecz zostanie przełożony.', 'wątpliwość', kolor='var(--fiolet)'),
        zad('((Nikt)) nie lubi poniedziałków.', 'uogólnienie', kolor='var(--roz)'),
        zad('To ((najgorszy)) pomysł w historii szkoły.', 'ocena', kolor='var(--zielony)'),
    ],
    pokaz='zdaniu',
)
SCENY += [
    Z3,
    odp(3,
        'Sprawdzamy. Sądzę, czyli przekonanie autora. Kultowy to ocena. Zapewne pokazuje wątpliwość, bo autor nie wie '
        'na pewno. Nikt to uogólnienie, przecież ktoś może lubić poniedziałki. Najgorszy to znowu ocena.',
        Z3, ['sądzę', 'kultowy', 'zapewne', 'nikt', 'najgorszy']),
    zapamietaj(
        'Zapamiętaj! Tekst publicystyczny pojawia się w prasie, radiu, telewizji i internecie. Mówi o aktualnych '
        'wydarzeniach, informuje i komentuje. Najczęściej to artykuł albo wywiad. Informacja to fakt, który można '
        'sprawdzić. Opinia to czyjeś zdanie. Zdradzają ją słowa takie jak: moim zdaniem, chyba, najlepszy, wszyscy. '
        'Brawo!',
        [
            ('📰 prasa, radio, telewizja, internet - aktualne wydarzenia', 'prasie'),
            ('💬 informuje i komentuje: artykuł, wywiad', 'komentuje'),
            ('ℹ️ informacja = fakt, który da się sprawdzić', 'fakt'),
            ('🗣️ opinia = czyjeś zdanie: moim zdaniem, chyba, najlepszy, wszyscy', 'opinia'),
        ],
    ),
]
