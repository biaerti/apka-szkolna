// "Ćwiczymy razem" do lektury „Chłopcy z Placu Broni” (kl. 4,
// src/data/lekturaChlopcy.ts) - po 2 karty na lekcje, czesc dolaczona do
// CWICZENIA4. Jedna karta pracuje na pojeciu z lekcji na wlasnych
// przykladach (bajki, filmy, codziennosc), druga na ksiazce - ale na innych
// faktach niz zadania w filmach (filmiki/placu-broni/narracja) i kolo.

import type { Cwiczenie } from './cwiczenia';
import { wybor } from './cwiczeniaKlocki';

const MIEJSCE = ['prawdziwe', 'wymyślone'];
const DRUZYNA = ['Plac Broni', 'Czerwone Koszule'];
const BOHATER = ['główny', 'drugoplanowy', 'zbiorowy'];
const DOWOD = ['czyn', 'słowa', 'opinia innych'];
const CZYN = ['czyn', 'motyw'];
const UZASADNIENIE = ['dobre uzasadnienie', 'brak uzasadnienia'];
const BO_WIEC = ['bo', 'więc'];

export const CWICZENIA_CHLOPCY: Cwiczenie[] = [
  // ---------- 1. Czas i miejsce akcji ----------
  {
    id: 'k4-chlopcy-gdzie-kiedy',
    typ: 'luki',
    tytul: 'Gdzie i kiedy?',
    polecenie: 'Znajdź w zdaniu czas akcji (kiedy?) i miejsce akcji (gdzie?).',
    naglowki: ['zdanie', 'kiedy?', 'gdzie?'],
    naRaz: 4,
    przyklady: [
      'W sobotę Kuba pojechał nad jezioro. | [[w sobotę|sobota]] | [[nad jezioro|nad jeziorem|jezioro]]',
      'Na przerwie Ola czytała w bibliotece. | [[na przerwie|przerwa]] | [[w bibliotece|biblioteka]]',
      'W wakacje spaliśmy w lesie. | [[w wakacje|wakacje]] | [[w lesie|las]]',
      'Wieczorem chłopcy grali na boisku. | [[wieczorem|wieczór]] | [[na boisku|boisko]]',
      'Dawno temu w wieży mieszkała królewna. | [[dawno temu]] | [[w wieży|wieża]]',
      'W grudniu w Zakopanem spadł śnieg. | [[w grudniu|grudzień]] | [[w Zakopanem|Zakopane]]',
      'Po lekcjach Zosia czekała przed szkołą. | [[po lekcjach]] | [[przed szkołą|szkoła]]',
      'W 1410 roku pod Grunwaldem była bitwa. | [[w 1410 roku|1410|w 1410 r.]] | [[pod Grunwaldem|Grunwald]]',
    ],
  },
  {
    id: 'k4-chlopcy-prawdziwe',
    typ: 'luki',
    tytul: 'Prawdziwe czy wymyślone?',
    polecenie: 'Miejsce akcji istnieje naprawdę czy ktoś je wymyślił?',
    naglowki: ['miejsce akcji', 'jakie?'],
    naRaz: 6,
    przyklady: [
      `Warszawa, park Łazienki | ${wybor(MIEJSCE, 'prawdziwe')}`,
      `kraina za drzwiami starej szafy | ${wybor(MIEJSCE, 'wymyślone')}`,
      `Kraków, smocza jama pod Wawelem | ${wybor(MIEJSCE, 'prawdziwe')}`,
      `szkoła czarodziejów w zamku | ${wybor(MIEJSCE, 'wymyślone')}`,
      `Gdańsk, port nad morzem | ${wybor(MIEJSCE, 'prawdziwe')}`,
      `Akademia pana Kleksa | ${wybor(MIEJSCE, 'wymyślone')}`,
      `Tatry, Morskie Oko | ${wybor(MIEJSCE, 'prawdziwe')}`,
      `pałac Królowej Śniegu | ${wybor(MIEJSCE, 'wymyślone')}`,
      `Budapeszt, ulica Pawła | ${wybor(MIEJSCE, 'prawdziwe')}`,
      `wioska Smerfów | ${wybor(MIEJSCE, 'wymyślone')}`,
      `Londyn, most nad Tamizą | ${wybor(MIEJSCE, 'prawdziwe')}`,
      `kraina, gdzie zwierzęta mówią | ${wybor(MIEJSCE, 'wymyślone')}`,
    ],
  },

  // ---------- 2. Bohaterowie ----------
  {
    id: 'k4-chlopcy-druzyny',
    typ: 'luki',
    tytul: 'Która drużyna?',
    polecenie: 'O kim to zdanie: o chłopcach z Placu Broni czy o Czerwonych Koszulach?',
    naglowki: ['zdanie', 'drużyna'],
    naRaz: 6,
    przyklady: [
      `Mają kryjówkę wśród ruin na wyspie. | ${wybor(DRUZYNA, 'Czerwone Koszule')}`,
      `Należą do Związku Kitowców. | ${wybor(DRUZYNA, 'Plac Broni')}`,
      `Chcą zabrać plac, żeby grać na nim w palanta. | ${wybor(DRUZYNA, 'Czerwone Koszule')}`,
      `Zbudowali fortece na sągach drewna. | ${wybor(DRUZYNA, 'Plac Broni')}`,
      `Mają w drużynie braci Pastorów. | ${wybor(DRUZYNA, 'Czerwone Koszule')}`,
      `Wszyscy są oficerami oprócz jednego. | ${wybor(DRUZYNA, 'Plac Broni')}`,
      `Spotykają się w Ogrodzie Botanicznym. | ${wybor(DRUZYNA, 'Czerwone Koszule')}`,
      `Ich wodzem jest Boka. | ${wybor(DRUZYNA, 'Plac Broni')}`,
      `Zabrali młodszym szklane kulki. | ${wybor(DRUZYNA, 'Czerwone Koszule')}`,
      `Stróż Janosz pilnuje drewna tuż obok ich placu. | ${wybor(DRUZYNA, 'Plac Broni')}`,
    ],
  },
  {
    id: 'k4-chlopcy-rodzaje-bohaterow',
    typ: 'luki',
    tytul: 'Główny, drugoplanowy czy zbiorowy?',
    polecenie: 'Jakim bohaterem jest ta postać albo grupa w swojej historii?',
    naglowki: ['bohater', 'jaki?'],
    naRaz: 6,
    przyklady: [
      `Kopciuszek w baśni o Kopciuszku | ${wybor(BOHATER, 'główny')}`,
      `macocha w baśni o Kopciuszku | ${wybor(BOHATER, 'drugoplanowy')}`,
      `siedmiu krasnoludków w „Królewnie Śnieżce” | ${wybor(BOHATER, 'zbiorowy')}`,
      `Pinokio w bajce o Pinokiu | ${wybor(BOHATER, 'główny')}`,
      `Dżepetto, który wystrugał Pinokia | ${wybor(BOHATER, 'drugoplanowy')}`,
      `Smerfy w bajce o Smerfach | ${wybor(BOHATER, 'zbiorowy')}`,
      `Gargamel w bajce o Smerfach | ${wybor(BOHATER, 'drugoplanowy')}`,
      `Czerwony Kapturek w baśni o Kapturku | ${wybor(BOHATER, 'główny')}`,
      `myśliwy w baśni o Czerwonym Kapturku | ${wybor(BOHATER, 'drugoplanowy')}`,
      `cała klasa 4a, która razem jedzie na wycieczkę | ${wybor(BOHATER, 'zbiorowy')}`,
      `Mikołajek w książce o Mikołajku | ${wybor(BOHATER, 'główny')}`,
      `załoga statku, która razem walczy z burzą | ${wybor(BOHATER, 'zbiorowy')}`,
    ],
  },

  // ---------- 3. Cecha i dowod ----------
  {
    id: 'k4-chlopcy-cecha',
    typ: 'luki',
    tytul: 'Jaka cecha?',
    polecenie: 'Jaką cechę pokazuje ten dowód? Kliknij cechę, która pasuje.',
    naglowki: ['dowód', 'cecha'],
    naRaz: 3,
    przyklady: [
      `Ola znalazła portfel i oddała go pani w sklepie. | ${wybor(['odważna', 'uczciwa', 'leniwa'], 'uczciwa')}`,
      `Kasia weszła na wysoką drabinę, żeby zdjąć kota z dachu. | ${wybor(['odważna', 'zazdrosna', 'skąpa'], 'odważna')}`,
      `Piotr nie zdradził sekretu przyjaciela, choć wszyscy go wypytywali. | ${wybor(['gadatliwy', 'lojalny', 'wesoły'], 'lojalny')}`,
      `Ania przez tydzień ćwiczyła codziennie, aż nauczyła się jeździć na rolkach. | ${wybor(['wytrwała', 'nieśmiała', 'roztargniona'], 'wytrwała')}`,
      `Bartek sam przyznał się, że to on stłukł szybę piłką. | ${wybor(['prawdomówny', 'tchórzliwy', 'leniwy'], 'prawdomówny')}`,
      `Zosia co dzień pomaga młodszemu bratu w lekcjach. | ${wybor(['opiekuńcza', 'samolubna', 'złośliwa'], 'opiekuńcza')}`,
      `Kuba śmieje się z kolegi, który przewrócił się na korytarzu. | ${wybor(['życzliwy', 'złośliwy', 'pomocny'], 'złośliwy')}`,
      `Marek zostawił zeszyt w domu, potem kurtkę w szatni, a potem klucze w parku. | ${wybor(['roztargniony', 'odważny', 'dokładny'], 'roztargniony')}`,
      `Julka podzieliła się drugim śniadaniem z koleżanką, która swoje zapomniała. | ${wybor(['skąpa', 'koleżeńska', 'leniwa'], 'koleżeńska')}`,
    ],
  },
  {
    id: 'k4-chlopcy-dowod',
    typ: 'luki',
    tytul: 'Czyn, słowa czy opinia innych?',
    polecenie: 'Skąd wiemy, jaka jest Ola? Jaki to rodzaj dowodu?',
    naglowki: ['dowód', 'rodzaj dowodu'],
    naRaz: 3,
    przyklady: [
      `Ola codziennie wstaje wcześnie, żeby wyprowadzić psa. | ${wybor(DOWOD, 'czyn')}`,
      `Ola mówi: „Nigdy nie zostawię psa bez wody”. | ${wybor(DOWOD, 'słowa')}`,
      `Mama mówi o Oli: „To najbardziej obowiązkowa dziewczynka, jaką znam”. | ${wybor(DOWOD, 'opinia innych')}`,
      `Ola wskoczyła do kałuży, żeby wyciągnąć tonącego kotka. | ${wybor(DOWOD, 'czyn')}`,
      `Koledzy z klasy wybrali Olę na przewodniczącą, bo jej ufają. | ${wybor(DOWOD, 'opinia innych')}`,
      `Ola obiecuje koleżance: „Pomogę ci, nawet jeśli to potrwa”. | ${wybor(DOWOD, 'słowa')}`,
      `Pani od plastyki mówi, że Ola rysuje najstaranniej w klasie. | ${wybor(DOWOD, 'opinia innych')}`,
      `Ola oddała swoją nagrodę koledze, który bardziej się starał. | ${wybor(DOWOD, 'czyn')}`,
      `Ola mówi bratu: „Nie bój się, będę obok”. | ${wybor(DOWOD, 'słowa')}`,
    ],
  },

  // ---------- 4. Czyn i motyw, ocena ----------
  {
    id: 'k4-chlopcy-czyn-motyw',
    typ: 'luki',
    tytul: 'Czyn czy motyw?',
    polecenie: 'Czyn mówi, co bohater zrobił. Motyw mówi, dlaczego.',
    naglowki: ['część zdania', 'czyn czy motyw?'],
    naRaz: 6,
    przyklady: [
      `Kuba wziął rower brata bez pytania, | ${wybor(CZYN, 'czyn')}`,
      `bo spóźniał się na trening. | ${wybor(CZYN, 'motyw')}`,
      `Ola skłamała mamie, | ${wybor(CZYN, 'czyn')}`,
      `bo bała się kary za zgubiony klucz. | ${wybor(CZYN, 'motyw')}`,
      `Wilk przebrał się za babcię, | ${wybor(CZYN, 'czyn')}`,
      `bo chciał zjeść Czerwonego Kapturka. | ${wybor(CZYN, 'motyw')}`,
      `Tomek schował telefon kolegi, | ${wybor(CZYN, 'czyn')}`,
      `bo zazdrościł mu nowego modelu. | ${wybor(CZYN, 'motyw')}`,
      `Macocha nie pozwoliła Kopciuszkowi iść na bal, | ${wybor(CZYN, 'czyn')}`,
      `bo chciała, żeby królewicz wybrał jej córkę. | ${wybor(CZYN, 'motyw')}`,
      `Zosia przechwalała się w klasie, | ${wybor(CZYN, 'czyn')}`,
      `bo chciała, żeby wszyscy ją podziwiali. | ${wybor(CZYN, 'motyw')}`,
    ],
  },
  {
    id: 'k4-chlopcy-uzasadnienie',
    typ: 'luki',
    tytul: 'Dobre uzasadnienie?',
    polecenie: 'Czy ta ocena ma prawdziwe uzasadnienie z książki?',
    naglowki: ['ocena', 'uzasadnienie'],
    naRaz: 4,
    przyklady: [
      `Uważam, że Boka jest dobrym wodzem, ponieważ jest spokojny i sprawiedliwy. | ${wybor(UZASADNIENIE, 'dobre uzasadnienie')}`,
      `Gereb jest beznadziejny, bo tak. | ${wybor(UZASADNIENIE, 'brak uzasadnienia')}`,
      `Uważam, że bracia Pastorowie postąpili źle, ponieważ zabrali młodszym kulki. | ${wybor(UZASADNIENIE, 'dobre uzasadnienie')}`,
      `Feri Acz jest fajny, bo jest fajny. | ${wybor(UZASADNIENIE, 'brak uzasadnienia')}`,
      `Uważam, że Czonakosz jest dobrym kolegą, ponieważ poszedł z Boką na wyprawę do Ogrodu. | ${wybor(UZASADNIENIE, 'dobre uzasadnienie')}`,
      `Nie lubię Czerwonych Koszul i już. | ${wybor(UZASADNIENIE, 'brak uzasadnienia')}`,
      `Uważam, że Gereb był odważny, ponieważ walczył w pierwszym szeregu. | ${wybor(UZASADNIENIE, 'dobre uzasadnienie')}`,
      `Kitowcy są dziwni, bo mi się nie podobają. | ${wybor(UZASADNIENIE, 'brak uzasadnienia')}`,
    ],
  },

  // ---------- 5. Przyczyna i skutek ----------
  {
    id: 'k4-chlopcy-bo-wiec',
    typ: 'luki',
    tytul: 'Bo czy więc?',
    polecenie: '„Bo” prowadzi do przyczyny, „więc” do skutku. Wybierz słowo.',
    naRaz: 6,
    przyklady: [
      `Zaczął padać deszcz, ${wybor(BO_WIEC, 'więc')} otworzyłam parasol.`,
      `Zjadłem dwa talerze zupy, ${wybor(BO_WIEC, 'bo')} byłem bardzo głodny.`,
      `Pies szczekał całą noc, ${wybor(BO_WIEC, 'więc')} nikt nie mógł spać.`,
      `Ola płakała, ${wybor(BO_WIEC, 'bo')} zgubiła ulubioną maskotkę.`,
      `Spóźniłem się na autobus, ${wybor(BO_WIEC, 'więc')} poszedłem pieszo.`,
      `Drużyna wygrała mecz, ${wybor(BO_WIEC, 'bo')} cały tydzień trenowała.`,
      `Lód na stawie był cienki, ${wybor(BO_WIEC, 'więc')} nikt nie wszedł na ślizgawkę.`,
      `Zamknęliśmy okno, ${wybor(BO_WIEC, 'bo')} zrobiło się zimno.`,
      `Kot zrzucił wazon, ${wybor(BO_WIEC, 'więc')} na podłodze leżały skorupy.`,
      `Kuba dostał szóstkę, ${wybor(BO_WIEC, 'bo')} świetnie przygotował się do sprawdzianu.`,
      `Zgasło światło, ${wybor(BO_WIEC, 'więc')} zapaliliśmy świeczki.`,
      `Babcia się uśmiechnęła, ${wybor(BO_WIEC, 'bo')} dostała od nas laurkę.`,
    ],
  },
  {
    id: 'k4-chlopcy-skutek',
    typ: 'luki',
    tytul: 'Dopisz skutek',
    polecenie: 'Co z tego wynikło? Dopisz skutek po „więc”. Dobrych odpowiedzi jest wiele - żółte sprawdzamy razem.',
    naglowki: ['przyczyna', 'skutek'],
    naRaz: 4,
    przyklady: [
      'Zapomniałem kluczy, więc | [[?nie mogłem wejść do domu|czekałem pod drzwiami|zadzwoniłem do mamy]]',
      'W nocy spadło dużo śniegu, więc | [[?ulepiliśmy bałwana|poszliśmy na sanki|nie było lekcji]]',
      'Kasia nie odrobiła lekcji, więc | [[?dostała minus|musiała je dorobić|dostała jedynkę]]',
      'Na wycieczce zaczęła się burza, więc | [[?schowaliśmy się w schronisku|wróciliśmy do autobusu|uciekliśmy pod dach]]',
      'Tata zaspał, więc | [[?spóźnił się do pracy|nie zjadł śniadania]]',
      'Piesek zgubił się w parku, więc | [[?szukaliśmy go do wieczora|rozwiesiliśmy ogłoszenia]]',
      'Kolega złamał nogę, więc | [[?nie przyszedł do szkoły|chodził o kulach|odwiedziliśmy go w domu]]',
      'Wygraliśmy konkurs, więc | [[?dostaliśmy nagrodę|cała klasa się cieszyła|pojechaliśmy na wycieczkę]]',
    ],
  },

  // ---------- 6. Wartosci i powtorka pojec ----------
  {
    id: 'k4-chlopcy-wartosci',
    typ: 'luki',
    tytul: 'Jaka wartość?',
    polecenie: 'Co jest najważniejsze dla bohatera w tej sytuacji?',
    naglowki: ['sytuacja', 'wartość'],
    naRaz: 3,
    przyklady: [
      `Marta przez cały tydzień odwiedzała chorą koleżankę i przynosiła jej lekcje. | ${wybor(['przyjaźń', 'zazdrość', 'pieniądze'], 'przyjaźń')}`,
      `Strażak wszedł do płonącego domu po dziecko. | ${wybor(['wygoda', 'odwaga', 'sława'], 'odwaga')}`,
      `Ola oddała sprzedawcy za dużo wydaną resztę. | ${wybor(['uczciwość', 'spryt', 'przyjaźń'], 'uczciwość')}`,
      `Po meczu przegrani podali rękę zwycięzcom i pogratulowali im. | ${wybor(['zemsta', 'szacunek', 'strach'], 'szacunek')}`,
      `Brat przeprosił siostrę za zniszczony rysunek, a ona mu wybaczyła. | ${wybor(['przebaczenie', 'kara', 'duma'], 'przebaczenie')}`,
      `Kuba dotrzymał obietnicy, choć wolałby iść na mecz. | ${wybor(['lenistwo', 'słowność', 'zabawa'], 'słowność')}`,
      `Dziadek co dzień opowiada wnukom, jak wyglądało miasto, gdy był mały. | ${wybor(['pamięć', 'zemsta', 'wygoda'], 'pamięć')}`,
      `Zosia stanęła w obronie kolegi, z którego wszyscy się śmiali. | ${wybor(['odwaga', 'obojętność', 'złośliwość'], 'odwaga')}`,
      `Drużyna nie zostawiła kolegi z kontuzją i razem doszła do mety. | ${wybor(['koleżeństwo', 'pośpiech', 'wygrana'], 'koleżeństwo')}`,
    ],
  },
  {
    id: 'k4-chlopcy-pojecia',
    typ: 'luki',
    tytul: 'Pojęcia z lektury',
    polecenie: 'Powtórka całej lektury: jakie pojęcie pasuje do przykładu?',
    naglowki: ['przykład z „Chłopców z Placu Broni”', 'pojęcie'],
    naRaz: 3,
    przyklady: [
      `w Budapeszcie, przy ulicy Pawła | ${wybor(['czas akcji', 'miejsce akcji', 'motyw'], 'miejsce akcji')}`,
      `wiosną 1889 roku, przez kilka dni | ${wybor(['czas akcji', 'miejsce akcji', 'przesłanie'], 'czas akcji')}`,
      `Czerwone Koszule działają zawsze razem | ${wybor(['bohater główny', 'bohater zbiorowy', 'czas akcji'], 'bohater zbiorowy')}`,
      `Nemeczek jest wierny - nie przeszedł do wrogów | ${wybor(['cecha i dowód', 'miejsce akcji', 'skutek'], 'cecha i dowód')}`,
      `Gereb zdradził, bo zazdrościł Boce | ${wybor(['czas akcji', 'motyw', 'bohater zbiorowy'], 'motyw')}`,
      `chory Nemeczek przewraca Feriego Acza | ${wybor(['punkt kulminacyjny', 'miejsce akcji', 'motyw'], 'punkt kulminacyjny')}`,
      `Nemeczek długo był w zimnej wodzie, więc zachorował | ${wybor(['przyczyna i skutek', 'bohater zbiorowy', 'czas akcji'], 'przyczyna i skutek')}`,
      `Feri Acz każe oddać honory małemu wrogowi | ${wybor(['szacunek', 'zdrada', 'zazdrość'], 'szacunek')}`,
      `liczy się serce i czyny, a nie wzrost | ${wybor(['przesłanie', 'miejsce akcji', 'czas akcji'], 'przesłanie')}`,
    ],
  },
];
