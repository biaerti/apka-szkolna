# Klasa 5, lekcja 34: Jak stopniowac przymiotniki? (NEON s. 120-121). Przyklady wlasne - inne niz w
# filmie kl. 4 (filmiki/stopniowanie: mlody, dlugi, gruby, cieply, plecaki).
from zbuduj import *

TYTUL = 'Stopniowanie przymiotników'
EMO = '📶🏔️🏆'
KOLOR = '#C2410C'
PORT = 9424

REG, NIEREG, OPIS = ('1️⃣ regularnie', 'var(--ak)'), ('2️⃣ nieregularnie', 'var(--fiolet)'), ('3️⃣ opisowo', 'var(--niebieski)')
TAK, NIE = ('✅ tak', 'var(--zielony)'), ('❌ nie', 'var(--roz)')
NAGL = ['stopień równy', 'stopień wyższy', 'stopień najwyższy']

SCENY = [
    intro(
        'Cześć! Która góra jest wysoka, która wyższa, a która najwyższa? Żeby to powiedzieć, potrzebujemy '
        'stopniowania. Dziś przypomnimy trzy stopnie przymiotnika i trzy sposoby stopniowania. Dowiecie się też, '
        'które przymiotniki w ogóle się nie stopniują. Czekają na was trzy zadania. Przygotujcie zeszyty!',
        'Stopniowanie przymiotników',
        [('📶 trzy stopnie', 'stopnie'), ('🛠️ trzy sposoby', 'sposoby'), ('🚫 bez stopniowania', 'stopniują')],
    ),
    teoria(
        'stopnie',
        'Stopniowanie pokazuje, ile jest danej cechy. Stopień równy to podstawowa forma: szybki. Stopień wyższy '
        'porównuje dwie rzeczy: szybszy. Stopień najwyższy mówi, że czegoś jest najwięcej ze wszystkich: najszybszy. '
        'Rower jest szybki. Samochód jest szybszy. A samolot jest najszybszy.',
        (1, 'STOPNIE'), 'Trzy stopnie 📶',
        rzad(
            karta('równy', 'szybki', 'równy', 'var(--zielony)', emo='🚲'),
            karta('wyższy', 'szybszy', 'wyższy', 'var(--fiolet)', emo='🚗'),
            karta('najwyższy', 'najszybszy', 'najwyższy', 'var(--ak)', emo='✈️'),
        ),
        lista(
            linia('🚲 Rower jest <b class="ok">szybki</b>.', 'rower'),
            linia('🚗 Samochód jest <b style="color:var(--fiolet)">szybszy</b>.', 'samochód'),
            linia('✈️ Samolot jest <b class="ak">najszybszy</b>.', 'samolot'),
            szer=700,
        ),
    ),
    teoria(
        'regularne',
        'Większość przymiotników stopniujemy w sposób prosty regularny. W stopniu wyższym dodajemy końcówkę, na '
        'przykład: miły, milszy. Albo: jasny, jaśniejszy. W stopniu najwyższym dodajemy na początku cząstkę naj: '
        'najmilszy, najjaśniejszy. Uwaga, czasem w środku wyrazu zmienia się głoska. Wysoki, wyższy, najwyższy. Biały, '
        'bielszy, najbielszy.',
        (1, 'STOPNIE'), 'Prosto i regularnie 1️⃣',
        chipy(chip('stopień wyższy: -szy / -ejszy', 'końcówkę', 'var(--fiolet)'),
              chip('stopień najwyższy: naj- + stopień wyższy', 'cząstkę', 'var(--ak)')),
        tabela(NAGL, [
            ['miły', 'mil<b class="ak">szy</b>', '<b class="ak">naj</b>milszy'],
            ['jasny', 'jaśni<b class="ak">ejszy</b>', '<b class="ak">naj</b>jaśniejszy'],
            ['wysoki', 'wyż<b class="ak">szy</b>', '<b class="ak">naj</b>wyższy'],
            ['biały', 'biel<b class="ak">szy</b>', '<b class="ak">naj</b>bielszy'],
        ], ['miły', 'jasny', 'wysoki', 'biały'], szer=900),
    ),
]

Z1 = zadanie(
    1,
    'Zadanie pierwsze. W każdym rzędzie brakuje jednego stopnia. Zapisz w zeszycie tylko brakujące formy. Masz '
    'minutę. Jeśli potrzebujesz więcej czasu, zatrzymaj film. Start!',
    (1, 'STOPNIE'), 'Brakuje jednego stopnia. Zapisz tylko brakujące formy.',
    [
        zad('zimny ➜ [[zimniejszy]] ➜ najzimniejszy'),
        zad('krótki ➜ krótszy ➜ [[najkrótszy]]'),
        zad('tani ➜ [[tańszy]] ➜ najtańszy', why='zmiana głoski'),
        zad('[[słodki]] ➜ słodszy ➜ najsłodszy', why='forma podstawowa'),
        zad('głośny ➜ [[głośniejszy]] ➜ najgłośniejszy'),
    ],
    pokaz='rzędzie', szer=1000,
)
SCENY += [
    Z1,
    odp(1,
        'Sprawdzamy. Zimny, zimniejszy, najzimniejszy. Krótki, krótszy, najkrótszy. Tani, tańszy, najtańszy, tu '
        'zmienia się głoska. Słodki, słodszy, najsłodszy, bo stopień równy to forma podstawowa. Głośny, głośniejszy, '
        'najgłośniejszy.',
        Z1, ['zimniejszy', 'najkrótszy', 'tańszy', 'słodki', 'głośniejszy']),
    teoria(
        'nieregularne',
        'Kilka przymiotników stopniuje się nieregularnie. W stopniu wyższym mają zupełnie inny wyraz. Dobry, lepszy, '
        'najlepszy. Zły, gorszy, najgorszy. Duży, większy, największy. Mały, mniejszy, najmniejszy. Tych form trzeba '
        'się po prostu nauczyć. Nikt nie mówi: dobrzejszy!',
        (2, 'NIEREGULARNIE I OPISOWO'), 'Nieregularnie 2️⃣',
        tabela(NAGL, [
            ['dobry', '<b class="ak">lepszy</b>', 'najlepszy'],
            ['zły', '<b class="ak">gorszy</b>', 'najgorszy'],
            ['duży', '<b class="ak">większy</b>', 'największy'],
            ['mały', '<b class="ak">mniejszy</b>', 'najmniejszy'],
        ], ['dobry', 'zły', 'duży', 'mały'], szer=900),
        chipy(chip('❌ <span style="text-decoration:line-through">dobrzejszy</span>', 'dobrzejszy', 'var(--roz)')),
    ),
    teoria(
        'opisowe',
        'Trzeci sposób to stopniowanie opisowe. Nie zmieniamy przymiotnika, tylko dodajemy przed nim słowa bardziej i '
        'najbardziej. Tak stopniujemy zwykle długie przymiotniki, na przykład: interesujący, bardziej interesujący, '
        'najbardziej interesujący. Albo: zmęczony, bardziej zmęczony, najbardziej zmęczony. Można też stopniować w '
        'dół, słowami mniej i najmniej: wygodny, mniej wygodny, najmniej wygodny. A niektóre przymiotniki mają dwie '
        'poprawne formy: miękki, miększy albo bardziej miękki.',
        (2, 'NIEREGULARNIE I OPISOWO'), 'Opisowo 3️⃣',
        tabela(NAGL, [
            ['interesujący', '<b class="ak">bardziej</b> interesujący', '<b class="ak">najbardziej</b> interesujący'],
            ['zmęczony', '<b class="ak">bardziej</b> zmęczony', '<b class="ak">najbardziej</b> zmęczony'],
            ['wygodny', '<b class="ak">mniej</b> wygodny', '<b class="ak">najmniej</b> wygodny'],
            ['miękki', 'miększy / bardziej miękki', 'najmiększy / najbardziej miękki'],
        ], ['interesujący', 'zmęczony', 'wygodny', 'miękki'], szer=1140),
    ),
]

Z2 = zadanie(
    2,
    'Zadanie drugie. Jak stopniujemy te przymiotniki? Przy każdym numerze zapisz w zeszycie jedno słowo: '
    'regularnie, nieregularnie albo opisowo. Masz minutę. Jeśli potrzebujesz więcej czasu, zatrzymaj film. Start!',
    (2, 'NIEREGULARNIE I OPISOWO'), 'Jak stopniujemy te przymiotniki?',
    [
        zad('zły', 'nieregularnie', 'gorszy, najgorszy', kolor='var(--fiolet)'),
        zad('cichy', 'regularnie', 'cichszy, najcichszy', kolor='var(--ak)'),
        zad('zachwycony', 'opisowo', 'bardziej zachwycony', kolor='var(--niebieski)'),
        zad('mały', 'nieregularnie', 'mniejszy, najmniejszy', kolor='var(--fiolet)'),
        zad('gęsty', 'regularnie', 'gęstszy, najgęstszy', kolor='var(--ak)'),
        zad('zaskoczony', 'opisowo', 'najbardziej zaskoczony', kolor='var(--niebieski)'),
    ],
    pokaz='przymiotniki', opcje=[REG, NIEREG, OPIS], szer=820,
)
SCENY += [
    Z2,
    odp(2,
        'Sprawdzamy. Zły to nieregularnie: gorszy, najgorszy. Cichy regularnie: cichszy, najcichszy. Zachwycony '
        'opisowo: bardziej zachwycony. Mały nieregularnie: mniejszy. Gęsty regularnie: gęstszy. I zaskoczony opisowo: '
        'najbardziej zaskoczony.',
        Z2, ['zły', 'cichy', 'zachwycony', 'mały', 'gęsty', 'zaskoczony']),
    teoria(
        'bez-stopniowania',
        'Są też przymiotniki, których nie stopniujemy wcale. To te, które mówią, z czego coś jest, skąd pochodzi albo '
        'czyje jest. Drewniany stół nie może być drewniańszy. Szklany kubek, metalowa rama, polski film, kocia miska. '
        'Taka cecha albo jest, albo jej nie ma. Nie da się być trochę bardziej szklanym. Zapytajcie: czy tej cechy '
        'może być więcej? Jeśli nie, przymiotnik się nie stopniuje.',
        (3, 'BEZ STOPNIOWANIA'), 'Tych nie stopniujemy 🚫',
        karta('z czego? · skąd? · czyje?', 'drewniany · szklany · metalowa · polski · kocia', 'czego', 'var(--roz)',
              styl='width:900px;margin:16px auto 0'),
        lista(
            linia('🪵 drewniany stół ➜ <span class="skr">drewniańszy</span>', 'drewniańszy'),
            linia('🥛 szklany kubek · 🖼️ metalowa rama', 'szklany'),
            linia('🎬 polski film · 🐱 kocia miska', 'polski'),
            szer=760,
        ),
        chipy(chip('❓ czy tej cechy może być więcej?', 'więcej', 'var(--zielony)')),
    ),
]

Z3 = zadanie(
    3,
    'Zadanie trzecie. Czy te przymiotniki da się stopniować? Przy każdym numerze zapisz: tak albo nie. Masz minutę. '
    'Jeśli potrzebujesz więcej czasu, zatrzymaj film. Start!',
    (3, 'BEZ STOPNIOWANIA'), 'Czy ten przymiotnik się stopniuje?',
    [
        zad('wełniany sweter', 'nie', 'z czego?', kolor='var(--roz)'),
        zad('zabawny film', 'tak', 'zabawniejszy', kolor='var(--zielony)'),
        zad('krakowski rynek', 'nie', 'skąd?', kolor='var(--roz)'),
        zad('smutna piosenka', 'tak', 'smutniejsza', kolor='var(--zielony)'),
        zad('psia buda', 'nie', 'czyja?', kolor='var(--roz)'),
        zad('ostry nóż', 'tak', 'ostrzejszy', kolor='var(--zielony)'),
    ],
    pokaz='przymiotniki', opcje=[TAK, NIE], szer=760,
)
SCENY += [
    Z3,
    odp(3,
        'Sprawdzamy. Wełniany nie, bo mówi, z czego jest sweter. Zabawny tak: zabawniejszy. Krakowski nie, bo mówi, '
        'skąd jest rynek. Smutna tak: smutniejsza. Psia nie, bo mówi, czyja jest buda. Ostry tak: ostrzejszy.',
        Z3, ['wełniany', 'zabawny', 'krakowski', 'smutna', 'psia', 'ostry']),
    zapamietaj(
        'Zapamiętaj! Przymiotnik ma trzy stopnie: równy, wyższy i najwyższy. Stopniujemy go na trzy sposoby. '
        'Regularnie: miły, milszy, najmilszy. Nieregularnie: dobry, lepszy, najlepszy. Opisowo: bardziej i najbardziej '
        'zmęczony. Przymiotniki, które mówią, z czego coś jest, skąd jest albo czyje jest, nie stopniują się. Brawo!',
        [
            ('📶 stopnie: równy · wyższy · najwyższy', 'stopnie'),
            ('1️⃣ regularnie: miły - milszy - najmilszy', 'regularnie'),
            ('2️⃣ nieregularnie: dobry - lepszy - najlepszy', 'nieregularnie'),
            ('3️⃣ opisowo: bardziej, najbardziej zmęczony', 'opisowo'),
            ('🚫 z czego? skąd? czyje? - nie stopniujemy: drewniany, polski, kocia', 'czego'),
        ],
    ),
]
