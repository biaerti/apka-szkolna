# Klasa 5, lekcja 40: Pisownia o i u - przypomnienie, u w zdrobnieniach, pary lod/lud (NEON s. 140-143).
# W narracji zamiast golych liter: "o z kreska", "otwarte u". Przyklady inne niz w filmie kl. 4 (filmiki/o-u).
from zbuduj import *

TYTUL = 'Ó czy u?'
EMO = '✏️🐱🧊'
KOLOR = '#A21CAF'
PORT = 9422

SCENY = [
    intro(
        'Cześć! Góra przez o z kreską, a kapelusz przez otwarte u. Skąd to wiemy? Dziś przypomnimy najważniejsze '
        'zasady, poznamy nową zasadę o zdrobnieniach i zobaczymy, jak jedna litera potrafi zmienić znaczenie słowa. '
        'Czekają na was trzy zadania. Przygotujcie zeszyty!',
        'Ó czy u?',
        [('📏 zasady', 'zasady'), ('🐱 zdrobnienia', 'zdrobnieniach'), ('🧊 lód czy lud?', 'znaczenie')],
    ),
    teoria(
        'o-kreskowane',
        'Najpierw o z kreską. Piszemy je, gdy w innej formie tego słowa w tym samym miejscu pojawia się inna '
        'samogłoska. Stół, bo stoły. Lód, bo lody. Niósł, bo niesie. Powrót, bo powracać. Piszemy je też w '
        'zakończeniach ów, ówka i ówna, na przykład: Kraków, żarówka, sąsiadówna. I w kilku słowach, które trzeba po '
        'prostu zapamiętać: góra, mózg, ogórek, wróbel.',
        (1, 'PRZYPOMNIENIE'), 'Kiedy ó? ✏️',
        lista(
            linia('🔄 st<b class="ak">ó</b>ł - st<b class="ok">o</b>ły · l<b class="ak">ó</b>d - l<b class="ok">o</b>dy', 'stół'),
            linia('🔄 ni<b class="ak">ó</b>sł - ni<b class="ok">e</b>sie · powr<b class="ak">ó</b>t - powr<b class="ok">a</b>cać', 'niósł'),
            szer=860,
        ),
        chipy(chip('-ów', 'zakończeniach', 'var(--fiolet)'), chip('-ówka', 'zakończeniach', 'var(--fiolet)', po=0.2),
              chip('-ówna', 'zakończeniach', 'var(--fiolet)', po=0.4)),
        lista(
            linia('🏙️ Krak<b class="ak">ów</b> · żar<b class="ak">ówka</b> · sąsiad<b class="ak">ówna</b>', 'kraków'),
            linia('📌 do zapamiętania: g<b class="ak">ó</b>ra · m<b class="ak">ó</b>zg · og<b class="ak">ó</b>rek · wr<b class="ak">ó</b>bel', 'góra'),
            szer=860,
        ),
    ),
    teoria(
        'u-otwarte',
        'Teraz otwarte u. Piszemy je w zakończeniach unek, us, usz, uch, ura i ulec, na przykład: rachunek, autobus, '
        'kapelusz, brzuch, kultura, budulec. Piszemy je w czasownikach zakończonych na uj i uje: maluj, rysuje. I na '
        'początku oraz na końcu wyrazów: ulica, ucho, kakadu. Na początku wyrazu o z kreską jest tylko w kilku słowach, '
        'na przykład: ósmy.',
        (1, 'PRZYPOMNIENIE'), 'Kiedy u? 🅤',
        chipy(*[chip(e, 'zakończeniach', 'var(--ak)', po=round(0.2 * i, 1)) for i, e in
                enumerate(['-unek', '-us', '-usz', '-uch', '-ura', '-ulec'])]),
        lista(
            linia('rach<b class="ak">unek</b> · autob<b class="ak">us</b> · kapel<b class="ak">usz</b> · brz<b class="ak">uch</b> · kult<b class="ak">ura</b> · bud<b class="ak">ulec</b>', 'rachunek'),
            linia('🖌️ czasowniki: mal<b class="ak">uj</b> · rys<b class="ak">uje</b>', 'maluj'),
            linia('🔚 początek i koniec: <b class="ak">u</b>lica · <b class="ak">u</b>cho · kakad<b class="ak">u</b>', 'ulica'),
            linia('⚠️ wyjątek: <b class="zle">ó</b>smy', 'ósmy'),
            szer=1000,
        ),
    ),
    teoria(
        'slownik',
        'A co, jeśli żadna zasada nie pasuje? Są słowa, w których o z kreską się nie wymienia: góra, mózg, ogórek, chór. '
        'Są też słowa z otwartym u bez żadnej zasady: arbuz, cukier, kura, trudny, burza. Takie słowa trzeba po prostu '
        'zapamiętać, a w razie wątpliwości zajrzeć do słownika ortograficznego. Pomaga też własna lista trudnych '
        'wyrazów na końcu zeszytu.',
        (1, 'PRZYPOMNIENIE'), 'Bez zasady? Słownik! 📖',
        rzad(
            karta('ó bez wymiany', 'g<b>ó</b>ra · m<b>ó</b>zg · og<b>ó</b>rek · ch<b>ó</b>r', 'góra', 'var(--ak)', emo='⛰️'),
            karta('u bez zasady', 'arb<b>u</b>z · c<b>u</b>kier · k<b>u</b>ra · tr<b>u</b>dny · b<b>u</b>rza', 'arbuz', 'var(--fiolet)', emo='🍉'),
        ),
        chipy(chip('📖 słownik ortograficzny', 'słownika', 'var(--zielony)'),
              chip('📝 lista trudnych wyrazów', 'lista', 'var(--niebieski)')),
    ),
]

Z1 = zadanie(
    1,
    'Zadanie pierwsze. Uzupełnij wyrazy: o z kreską albo otwarte u. Zapisz w zeszycie całe wyrazy. Masz minutę. '
    'Jeśli potrzebujesz więcej czasu, zatrzymaj film. Start!',
    (1, 'PRZYPOMNIENIE'), 'Ó czy u? Zapisz całe wyrazy.',
    [
        zad('ogr[[ó]]d', why='ogrody'),
        zad('mal[[u]]nek', why='-unek'),
        zad('n[[ó]]żka', why='noga'),
        zad('zapis[[u]]je', why='-uje'),
        zad('Krak[[ó]]w', why='-ów'),
        zad('[[u]]rodziny', why='na początku'),
    ],
    pokaz='uzupełnij', kolumny=2, szer=900,
)
SCENY += [
    Z1,
    odp(1,
        'Sprawdzamy. Ogród przez o z kreską, bo ogrody. Malunek przez otwarte u, bo to zakończenie unek. Nóżka przez o z '
        'kreską, bo noga. Zapisuje przez u, bo czasownik kończy się na uje. Kraków przez o z kreską, bo to zakończenie '
        'ów. I urodziny przez otwarte u, bo tak zaczyna się wyraz.',
        Z1, ['ogród', 'malunek', 'nóżka', 'zapisuje', 'kraków', 'urodziny']),
    teoria(
        'zdrobnienia',
        'A teraz nowa zasada. Otwarte u piszemy w zdrobnieniach, czyli w słowach, którymi mówimy czule o kimś albo o '
        'czymś małym. Kot to kotuś. Mama to mamusia. Mały to malutki, a cichy to cichutki. Syn to synuś, a pies to '
        'piesunio. Kwiat to kwiatuszek. W takich zakończeniach zawsze jest otwarte u: bielutki, leciutki, córunia, '
        'dziadziuś.',
        (2, 'ZDROBNIENIA'), 'Zdrobnienia: zawsze u 🐱',
        chipy(*[chip(e, 'zdrobnieniach', 'var(--fiolet)', po=round(0.2 * i, 1)) for i, e in
                enumerate(['-uś', '-usia', '-utki', '-uszek', '-unio', '-ulek', '-uchny'])]),
        lista(
            linia('🐱 kot ➜ kot<b class="ak">uś</b> · mama ➜ mam<b class="ak">usia</b>', 'kotuś'),
            linia('🤏 mały ➜ mal<b class="ak">utki</b> · cichy ➜ cich<b class="ak">utki</b>', 'malutki'),
            linia('🐶 syn ➜ syn<b class="ak">uś</b> · pies ➜ pies<b class="ak">unio</b>', 'synuś'),
            linia('🌸 kwiat ➜ kwiat<b class="ak">uszek</b>', 'kwiatuszek'),
            szer=900,
        ),
    ),
]

Z2 = zadanie(
    2,
    'Zadanie drugie. Utwórz zdrobnienia od podanych słów. Pamiętaj o otwartym u. Zapisz w zeszycie tylko '
    'zdrobnienia. Masz minutę. Jeśli potrzebujesz więcej czasu, zatrzymaj film. Start!',
    (2, 'ZDROBNIENIA'), 'Utwórz zdrobnienie. Pamiętaj o u!',
    [
        zad('tata ➜ [[tatuś]]'),
        zad('babcia ➜ [[babunia|babusia|babuleńka]]', why='albo: babusia'),
        zad('cienki ➜ [[cieniutki]]'),
        zad('dziadek ➜ [[dziadziuś|dziadunio]]', why='albo: dziadunio'),
        zad('ciepły ➜ [[cieplutki]]'),
        zad('serce ➜ [[serduszko]]'),
    ],
    pokaz='słów', szer=760,
)
SCENY += [
    Z2,
    odp(2,
        'Sprawdzamy. Tatuś. Babunia albo babusia. Cieniutki. Dziadziuś albo dziadunio. Cieplutki. I serduszko. W każdym '
        'zdrobnieniu piszemy otwarte u.',
        Z2, ['tatuś', 'babunia', 'cieniutki', 'dziadziuś', 'cieplutki', 'serduszko']),
    teoria(
        'pary',
        'Czasem dwa słowa brzmią tak samo, a różni je tylko jedna litera. Lód to zamarznięta woda, bo lody. A lud to '
        'mieszkańcy kraju, na przykład: król przemawiał do ludu. Łódź to statek albo miasto. A łudź się to forma od '
        'słowa łudzić się, czyli mieć złudną nadzieję. Kórnik to miasto z pięknym zamkiem, a kurnik to dom dla kur. '
        'Pisownia zmienia znaczenie!',
        (3, 'BRZMI TAK SAMO'), 'Brzmi tak samo, znaczy co innego 🧊👥',
        rzad(karta('🧊 l<b class="ak">ó</b>d', 'zamarznięta woda - lody', 'lód', 'var(--ak)'),
             karta('👥 l<b class="ak">u</b>d', 'mieszkańcy kraju - ludowy', 'lud', 'var(--fiolet)')),
        rzad(karta('⛵ ł<b class="ak">ó</b>dź', 'statek - łodzie', 'łódź', 'var(--ak)'),
             karta('💭 ł<b class="ak">u</b>dź się', 'od: łudzić się', 'łudź', 'var(--fiolet)')),
        rzad(karta('🏰 K<b class="ak">ó</b>rnik', 'miasto z zamkiem', 'kórnik', 'var(--ak)'),
             karta('🐔 k<b class="ak">u</b>rnik', 'dom dla kur', 'kurnik', 'var(--fiolet)')),
    ),
]

Z3 = zadanie(
    3,
    'Zadanie trzecie. Wybierz słowo, które pasuje do zdania. Zapisz w zeszycie numer i wybrany wyraz. Masz minutę. '
    'Jeśli potrzebujesz więcej czasu, zatrzymaj film. Start!',
    (3, 'BRZMI TAK SAMO'), 'Które słowo pasuje do zdania?',
    [
        zad('Na stawie leży gruby {{*lód|lud}}.'),
        zad('Król przemówił do swojego {{lodu|*ludu}}.'),
        zad('Płynęliśmy {{*łodzią|łudzią}} po jeziorze.'),
        zad('Nie {{łódź|*łudź}} się, że zdążysz bez biegu.'),
        zad('Kury śpią w {{Kórniku|*kurniku}}.'),
        zad('Zwiedziliśmy zamek w {{*Kórniku|kurniku}}.'),
    ],
    pokaz='zdania', szer=900,
)
SCENY += [
    Z3,
    odp(3,
        'Sprawdzamy. Gruby lód, bo chodzi o zamarzniętą wodę. Do swojego ludu, czyli do mieszkańców. Płynęliśmy łodzią. '
        'Nie łudź się, czyli nie miej złudzeń. Kury śpią w kurniku. A zamek zwiedziliśmy w Kórniku, w mieście pod '
        'Poznaniem.',
        Z3, ['lód', 'ludu', 'łodzią', 'łudź', 'kurniku', 'kórniku']),
    zapamietaj(
        'Zapamiętaj! O z kreską piszemy, gdy w innej formie słowa słyszymy inną samogłoskę: stół i stoły. Piszemy je też '
        'w zakończeniach ów, ówka, ówna. Otwarte u piszemy w zakończeniach unek, us, usz, uch, ura, ulec, w '
        'czasownikach na uj i uje, na początku i na końcu wyrazów oraz w zdrobnieniach: kotuś, malutki. A lód i lud to '
        'dwa różne słowa. Brawo!',
        [
            ('🔄 ó wymienne: stół - stoły · niósł - niesie', 'stół'),
            ('🏙️ -ów, -ówka, -ówna: Kraków, żarówka', 'ówka'),
            ('🅤 u: -unek, -us, -usz, -uch, -ura, -ulec · -uj, -uje', 'unek'),
            ('🐱 u w zdrobnieniach: kotuś, malutki, serduszko', 'zdrobnieniach'),
            ('🧊 lód ≠ 👥 lud', 'lud'),
        ],
    ),
]
