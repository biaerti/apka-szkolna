# Klasa 5, lekcja 41: To wiem! To potrafie! - podsumowanie dzialu 3 (NEON s. 144-146). Przyklady wlasne,
# inne niz w filmach lekcji 30-40.
from zbuduj import *

TYTUL = 'To wiem! To potrafię!'
EMO = '🧭📶🔢✏️'
KOLOR = '#0F766E'
PORT = 9429
CSS = '.c4 { background: var(--roz); }'

SCENY = [
    intro(
        'Cześć! Za nami cały dział: Ideały, autorytety, idole. Dziś powtórzymy go w czterech częściach: słowa i teksty, '
        'przymiotnik, liczebnik oraz pisownia. Czekają na was trzy zadania z całego działu. Przygotujcie zeszyty!',
        'To wiem! To potrafię!',
        [('📚 słowa i teksty', 'słowa'), ('📶 przymiotnik', 'przymiotnik'), ('🔢 liczebnik', 'liczebnik'),
         ('✏️ pisownia', 'pisownia')],
    ),
    teoria(
        'teksty',
        'Zacznijmy od słów i tekstów. Epitet to określenie rzeczownika, najczęściej przymiotnik: puszysty kot. '
        'Autorytet to ktoś, kogo szanujemy i z kogo bierzemy przykład. Idola podziwiamy, często za sławę. Dedykacja '
        'stoi przed tekstem i mówi, komu autor poświęca dzieło. Tekst publicystyczny, czyli artykuł albo wywiad, mówi '
        'o aktualnych sprawach. Informacja to fakt, który da się sprawdzić, a opinia to czyjeś zdanie.',
        (1, 'SŁOWA I TEKSTY'), 'Słowa i teksty 📚',
        rzad(
            karta('epitet', 'określenie rzeczownika: <i>puszysty</i> kot', 'epitet', 'var(--ak)', emo='✋'),
            karta('autorytet · idol', 'szanujemy · podziwiamy', 'autorytet', 'var(--fiolet)', emo='🧭⭐'),
            karta('dedykacja', 'komu autor poświęca dzieło', 'dedykacja', 'var(--niebieski)', emo='💌'),
        ),
        rzad(
            karta('tekst publicystyczny', 'artykuł · wywiad · aktualne sprawy', 'publicystyczny', 'var(--zielony)', emo='📰'),
            karta('informacja · opinia', 'fakt do sprawdzenia · czyjeś zdanie', 'informacja', 'var(--roz)', emo='ℹ️💬'),
        ),
    ),
    teoria(
        'film',
        'Do tego film. Reżyser kieruje ekipą, scenarzysta pisze scenariusz, operator filmuje, a charakteryzator zmienia '
        'wygląd aktorów. Filmy bywają fabularne, dokumentalne i animowane. W sprawozdaniu z filmu we wstępie piszemy '
        'kiedy, gdzie, z kim i co obejrzeliśmy, w rozwinięciu krótko o treści i środkach wyrazu, a w zakończeniu '
        'oceniamy. Bez zdradzania zakończenia!',
        (1, 'SŁOWA I TEKSTY'), 'Film i sprawozdanie 🎬',
        chipy(chip('🎬 reżyser', 'reżyser', 'var(--ak)'), chip('📝 scenarzysta', 'scenarzysta', 'var(--ak)'),
              chip('🎥 operator', 'operator', 'var(--ak)'), chip('💄 charakteryzator', 'charakteryzator', 'var(--ak)')),
        chipy(chip('🎭 fabularny', 'fabularne', 'var(--fiolet)'), chip('🐧 dokumentalny', 'dokumentalne', 'var(--fiolet)'),
              chip('🎨 animowany', 'animowane', 'var(--fiolet)')),
        lista(
            linia('🎟️ wstęp: kiedy? gdzie? z kim? co?', 'wstępie'),
            linia('🎞️ rozwinięcie: krótko o treści + środki wyrazu', 'rozwinięciu'),
            linia('⭐ zakończenie: ocena · 🤫 bez spoilera', 'oceniamy'),
            szer=860,
        ),
    ),
]

Z1 = zadanie(
    1,
    'Zadanie pierwsze. Przeczytaj sześć opisów. Co to jest? Przy każdym numerze zapisz w zeszycie jedno słowo. Masz '
    'minutę. Jeśli potrzebujesz więcej czasu, zatrzymaj film. Start!',
    (1, 'SŁOWA I TEKSTY'), 'Co to jest? Zapisz jedno słowo.',
    [
        zad('Określenie rzeczownika, np. <i>złociste</i> liście. ➜ [[epitet]]'),
        zad('Zapis przed tekstem: komu autor poświęca dzieło. ➜ [[dedykacja]]'),
        zad('Osoba, którą szanujemy i z której bierzemy przykład. ➜ [[autorytet]]'),
        zad('Kieruje pracą całej ekipy filmowej. ➜ [[reżyser]]'),
        zad('Film o prawdziwych ludziach i wydarzeniach. ➜ [[dokumentalny]]'),
        zad('Rozmowa dziennikarza z ciekawą osobą. ➜ [[wywiad]]'),
    ],
    pokaz='opisów',
)
SCENY += [
    Z1,
    odp(1,
        'Sprawdzamy. Złociste liście, czyli jakie? To epitet. Zapis przed tekstem to dedykacja. Osoba, z której bierzemy '
        'przykład, to autorytet. Ekipą kieruje reżyser. Film o prawdziwych ludziach jest dokumentalny. A rozmowa '
        'dziennikarza z ciekawą osobą to wywiad.',
        Z1, ['epitet', 'dedykacja', 'autorytet', 'reżyser', 'dokumentalny', 'wywiad']),
    teoria(
        'przymiotnik',
        'Teraz przymiotnik. Odmienia się przez przypadki, liczby i rodzaje, tak jak jego rzeczownik. W liczbie mnogiej '
        'ma dwa rodzaje: męskoosobowy, czyli oni, i niemęskoosobowy, czyli one. Mili koledzy, ale miłe koleżanki. '
        'Przymiotniki takie jak obcy czy uroczy w rodzaju męskoosobowym się nie zmieniają. Stopniujemy je regularnie: '
        'miły, milszy, najmilszy, nieregularnie: dobry, lepszy, najlepszy, albo opisowo: bardziej zmęczony. Drewniany '
        'czy polski nie stopniują się wcale.',
        (2, 'PRZYMIOTNIK'), 'Przymiotnik 📶',
        rzad(
            karta('oni · one', 'mil<b>i</b> koledzy · mił<b>e</b> koleżanki', 'oni', 'var(--fiolet)', emo='👨‍👦👭'),
            karta('bez zmiany', 'obcy turyści · uroczy chłopcy', 'obcy', 'var(--roz)', emo='🪤'),
        ),
        lista(
            linia('1️⃣ regularnie: miły - milszy - najmilszy', 'regularnie'),
            linia('2️⃣ nieregularnie: dobry - lepszy - najlepszy', 'nieregularnie'),
            linia('3️⃣ opisowo: bardziej, najbardziej zmęczony', 'opisowo'),
            linia('🚫 drewniany, polski - bez stopniowania', 'drewniany'),
            szer=860,
        ),
    ),
    teoria(
        'liczebnik',
        'A liczebnik? Główny odpowiada na pytanie ile: pięć. Porządkowy na pytanie który: piąty. Zbiorowy, na przykład '
        'dwoje czy troje, łączymy z dziećmi, młodymi zwierzętami i grupami chłopców i dziewczyn. W latach odmieniamy '
        'tylko dwa ostatnie słowa: w dwa tysiące dwudziestym szóstym roku. Po cyfrze arabskiej, która oznacza '
        'liczebnik porządkowy, stawiamy kropkę: na ósmym piętrze. Ale nie przy godzinach i nie po cyfrach rzymskich.',
        (3, 'LICZEBNIK'), 'Liczebnik 🔢',
        rzad(
            karta('główny · ile?', 'pięć', 'główny', 'var(--ak)', emo='🔢'),
            karta('porządkowy · który?', 'piąty', 'porządkowy', 'var(--fiolet)', emo='🥇'),
            karta('zbiorowy', 'dwoje dzieci · troje kociąt', 'zbiorowy', 'var(--zielony)', emo='👫'),
        ),
        lista(
            linia('📆 w dwa tysiące <b class="ak">dwudziestym szóstym</b> roku', 'latach'),
            linia('🏢 na 8<b class="zle">.</b> piętrze · 🕔 o godzinie 17 · XX wiek', 'kropkę'),
            szer=860,
        ),
    ),
]

Z2 = zadanie(
    2,
    'Zadanie drugie. Sześć krótkich pytań o przymiotnik i liczebnik. Zapisz w zeszycie numer i odpowiedź. Masz '
    'minutę. Jeśli potrzebujesz więcej czasu, zatrzymaj film. Start!',
    (3, 'LICZEBNIK'), 'Wybierz albo uzupełnij.',
    [
        zad('Na boisku grali {{*wysocy|wysokie}} chłopcy.', why='oni'),
        zad('zły ➜ gorszy ➜ [[najgorszy]]', why='nieregularnie'),
        zad('Czy „szklany” się stopniuje? {{tak|*nie}}', why='z czego?'),
        zad('W piaskownicy bawi się {{*troje|trzy}} dzieci.', why='zbiorowy'),
        zad('Mieszkam na {{*7.|7}} piętrze.', why='siódmym'),
        zad('Urodziłem się w dwa tysiące {{*piętnastym|piętnaście}} roku.'),
    ],
    pokaz='pytań', szer=1000,
)
SCENY += [
    Z2,
    odp(2,
        'Sprawdzamy. Wysocy chłopcy, bo oni. Zły, gorszy, najgorszy, to stopniowanie nieregularne. Szklany się nie '
        'stopniuje, bo mówi, z czego coś jest. Troje dzieci, bo przy dzieciach używamy zbiorowego. Na siódmym piętrze, '
        'więc z kropką. I w dwa tysiące piętnastym roku.',
        Z2, ['wysocy', 'najgorszy', 'szklany', 'troje', 'siódmym', 'piętnastym']),
    teoria(
        'pisownia',
        'Na koniec pisownia. O z kreską piszemy, gdy wymienia się na inną samogłoskę: stół i stoły, oraz w zakończeniach '
        'ów, ówka, ówna. Otwarte u piszemy w zakończeniach unek, us, usz, uch, ura, ulec, w czasownikach na uj i uje, '
        'a także w zdrobnieniach: kotuś, malutki. I pamiętajcie: lód to zamarznięta woda, a lud to mieszkańcy kraju.',
        (4, 'PISOWNIA'), 'Ó i u ✏️',
        lista(
            linia('🔄 st<b class="ak">ó</b>ł - stoły · -<b class="ak">ó</b>w, -<b class="ak">ó</b>wka, -<b class="ak">ó</b>wna', 'stół'),
            linia('🅤 -<b class="ak">u</b>nek, -<b class="ak">u</b>s, -<b class="ak">u</b>sz, -<b class="ak">u</b>ch, -<b class="ak">u</b>ra, -<b class="ak">u</b>lec · -<b class="ak">u</b>j, -<b class="ak">u</b>je', 'unek'),
            linia('🐱 zdrobnienia: kot<b class="ak">u</b>ś, mal<b class="ak">u</b>tki', 'zdrobnieniach'),
            linia('🧊 l<b class="ak">ó</b>d ≠ 👥 l<b class="ak">u</b>d', 'lód'),
            szer=900,
        ),
    ),
]

Z3 = zadanie(
    3,
    'Zadanie trzecie. Uzupełnij wyrazy: o z kreską albo otwarte u. Zapisz w zeszycie całe wyrazy. Masz minutę. Jeśli '
    'potrzebujesz więcej czasu, zatrzymaj film. Start!',
    (4, 'PISOWNIA'), 'Ó czy u? Zapisz całe wyrazy.',
    [
        zad('kot[[u]]ś', why='zdrobnienie'),
        zad('r[[ó]]g', why='rogi'),
        zad('bud[[u]]je', why='-uje'),
        zad('stol[[ó]]wka', why='-ówka'),
        zad('mal[[u]]tki', why='zdrobnienie'),
        zad('Rzesz[[ó]]w', why='-ów'),
    ],
    pokaz='uzupełnij', kolumny=2, szer=900,
)
SCENY += [
    Z3,
    odp(3,
        'Sprawdzamy. Kotuś przez otwarte u, bo to zdrobnienie. Róg przez o z kreską, bo rogi. Buduje przez u, bo '
        'czasownik kończy się na uje. Stołówka przez o z kreską, bo zakończenie ówka. Malutki przez u, znowu '
        'zdrobnienie. I Rzeszów przez o z kreską, bo zakończenie ów.',
        Z3, ['kotuś', 'róg', 'buduje', 'stołówka', 'malutki', 'rzeszów']),
    zapamietaj(
        'Zapamiętaj najważniejsze z działu! Epitet określa rzeczownik. Autorytet szanujemy, idola podziwiamy. Dedykacja '
        'mówi, komu autor poświęca dzieło. Tekst publicystyczny łączy informacje i opinie. Przymiotnik ma rodzaj '
        'męskoosobowy i niemęskoosobowy i trzy sposoby stopniowania. Liczebniki są główne, porządkowe i zbiorowe. '
        'O z kreską i otwarte u piszemy według zasad. Powodzenia na sprawdzianie! Brawo!',
        [
            ('✋ epitet · 🧭 autorytet · ⭐ idol · 💌 dedykacja', 'epitet'),
            ('📰 tekst publicystyczny: informacja + opinia', 'publicystyczny'),
            ('📶 przymiotnik: oni / one · 3 sposoby stopniowania', 'męskoosobowy'),
            ('🔢 liczebnik: główny · porządkowy · zbiorowy', 'główne'),
            ('✏️ ó i u według zasad · 🍀 powodzenia!', 'powodzenia'),
        ],
    ),
]
