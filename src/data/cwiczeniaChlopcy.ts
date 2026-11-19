// "Ćwiczymy razem" do lektury „Chłopcy z Placu Broni” (kl. 4,
// src/data/lekturaChlopcy.ts) - po 2 karty na lekcje, czesc dolaczona do
// CWICZENIA4. Jedna karta pracuje na pojeciu z lekcji na wlasnych
// przykladach (bajki, filmy, codziennosc), druga na ksiazce - ale na innych
// faktach niz zadania w filmach (filmiki/placu-broni/narracja) i kolo.

import type { Cwiczenie } from './cwiczenia';
import { wybor } from './cwiczeniaKlocki';

const MIEJSCA = ['plac', 'ogród', 'szkoła', 'dom'];
const BITWA = ['przed bitwą', 'po bitwie'];
const DRUZYNA = ['Plac Broni', 'Czerwone Koszule'];
const BOHATER = ['główny', 'drugoplanowy', 'zbiorowy'];
const PROTAGONISTA = ['protagonista', 'antagonista'];
const DOWOD = ['czyn', 'słowa', 'opinia innych'];
const CZYN = ['czyn', 'motyw'];
const POZIOM = ['sympatia', 'zaufanie', 'jedno i drugie'];
const ODBUDOWA = ['czyn', 'same słowa', 'przekupstwo'];
const BO_WIEC = ['bo', 'więc'];

export const CWICZENIA_CHLOPCY: Cwiczenie[] = [
  // ---------- 1. Czas i miejsce akcji (fakty z ksiazki, Bartek 2026-11-16:
  // zamiast zdan o Kubie i "prawdziwe czy wymyslone" - quiz z lektury) ----------
  {
    id: 'k4-chlopcy-gdzie-kiedy',
    typ: 'luki',
    tytul: 'Gdzie i kiedy? Fakty z książki',
    polecenie: 'Co wiesz o czasie i miejscu akcji „Chłopców z Placu Broni”? Wybierz odpowiedź.',
    naglowki: ['pytanie', 'odpowiedź'],
    naRaz: 4,
    przyklady: [
      `W jakim mieście dzieje się akcja? | ${wybor(['w Budapeszcie', 'w Warszawie', 'w Wiedniu'], 'w Budapeszcie')}`,
      `W którym roku? | ${wybor(['w 1889', 'w 1939', 'w 1989'], 'w 1889')}`,
      `O jakiej porze roku? | ${wybor(['zimą', 'wiosną', 'latem'], 'wiosną')}`,
      `Ile trwa cała historia? | ${wybor(['kilka dni', 'kilka lat', 'całe wakacje'], 'kilka dni')}`,
      `Przy jakich ulicach leży plac? | ${wybor(['Pawła i Marii', 'Długiej i Krótkiej', 'Szkolnej i Polnej'], 'Pawła i Marii')}`,
      `Co sąsiaduje z placem? | ${wybor(['skład drewna', 'stadion', 'dworzec'], 'skład drewna')}`,
      `Kto pilnuje drewna? | ${wybor(['stróż Janosz', 'pan Racz', 'Feri Acz'], 'stróż Janosz')}`,
      `Jak ma na imię pies stróża? | ${wybor(['Hektor', 'Burek', 'Azor'], 'Hektor')}`,
    ],
  },
  {
    id: 'k4-chlopcy-co-tu-bylo',
    typ: 'luki',
    tytul: 'Co tu się wydarzyło?',
    polecenie: 'Gdzie to się stało? Ogród to Ogród Botaniczny, a dom to dom Nemeczka.',
    naglowki: ['wydarzenie', 'gdzie?'],
    naRaz: 4,
    przyklady: [
      `Pan Racz rozwiązuje Związek Kitowców. | ${wybor(MIEJSCA, 'szkoła')}`,
      `Nemeczek chowa się w basenie w palmiarni. | ${wybor(MIEJSCA, 'ogród')}`,
      `Feri Acz zabiera chłopcom chorągiewkę. | ${wybor(MIEJSCA, 'plac')}`,
      `Ojciec krawiec szyje, a Nemeczek leży chory. | ${wybor(MIEJSCA, 'dom')}`,
      `Nemeczek schodzi z drzewa i przyznaje się. | ${wybor(MIEJSCA, 'ogród')}`,
      `Janosz rano kopie okop przed fortami. | ${wybor(MIEJSCA, 'plac')}`,
      `Gereb przekupuje Janosza cygarami. | ${wybor(MIEJSCA, 'plac')}`,
      `Feri Acz przychodzi do chorego Nemeczka. | ${wybor(MIEJSCA, 'dom')}`,
    ],
  },
  {
    id: 'k4-chlopcy-przed-po',
    typ: 'luki',
    tytul: 'Przed bitwą czy po bitwie?',
    polecenie: 'Kiedy to się stało: przed wielką bitwą o plac czy po niej?',
    naglowki: ['wydarzenie', 'kiedy?'],
    naRaz: 4,
    przyklady: [
      `Chłopcy wybierają Bokę na wodza. | ${wybor(BITWA, 'przed bitwą')}`,
      `Nazwisko Nemeczka trafia do księgi wielkimi literami. | ${wybor(BITWA, 'po bitwie')}`,
      `Kitowcy wpisują nazwisko Nemeczka małymi literami. | ${wybor(BITWA, 'przed bitwą')}`,
      `Boka dowiaduje się, że na placu stanie kamienica. | ${wybor(BITWA, 'po bitwie')}`,
      `Gereb przeprasza i wraca jako szeregowiec. | ${wybor(BITWA, 'przed bitwą')}`,
      `Boka mianuje Nemeczka kapitanem. | ${wybor(BITWA, 'po bitwie')}`,
      `Czerwone Koszule wypowiadają wojnę pod białą flagą. | ${wybor(BITWA, 'przed bitwą')}`,
      `Nemeczek umiera. | ${wybor(BITWA, 'po bitwie')}`,
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

  {
    id: 'k4-chlopcy-protagonista',
    typ: 'luki',
    tytul: 'Protagonista czy antagonista?',
    polecenie: 'Protagonista dąży do celu, a antagonista mu przeszkadza. Kim jest ta postać?',
    naglowki: ['postać', 'kto?'],
    naRaz: 4,
    przyklady: [
      `Simba w „Królu Lwie” | ${wybor(PROTAGONISTA, 'protagonista')}`,
      `Skaza w „Królu Lwie” | ${wybor(PROTAGONISTA, 'antagonista')}`,
      `Voldemort w „Harrym Potterze” | ${wybor(PROTAGONISTA, 'antagonista')}`,
      `Harry Potter | ${wybor(PROTAGONISTA, 'protagonista')}`,
      `czarownica w „Jasiu i Małgosi” | ${wybor(PROTAGONISTA, 'antagonista')}`,
      `Jaś i Małgosia | ${wybor(PROTAGONISTA, 'protagonista')}`,
      `Boka, wódz chłopców z Placu Broni | ${wybor(PROTAGONISTA, 'protagonista')}`,
      `Feri Acz, wódz Czerwonych Koszul | ${wybor(PROTAGONISTA, 'antagonista')}`,
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
  // Bartek 2026-11-19: zamiast "Dobre uzasadnienie?" - sympatia i zaufanie
  // (glowna mysl lekcji) i czym odbudowac zaufanie. Przyklady inne niz w filmie.
  {
    id: 'k4-chlopcy-sympatia-zaufanie',
    typ: 'luki',
    tytul: 'Sympatia czy zaufanie?',
    polecenie: 'Sympatia: lubię cię. Zaufanie: mogę na tobie polegać. Co tu jest?',
    naglowki: ['sytuacja', 'co tu jest?'],
    naRaz: 3,
    przyklady: [
      `Z Antkiem gracie w piłkę na każdej przerwie, ale pożyczonych rzeczy nigdy nie oddaje. | ${wybor(POZIOM, 'sympatia')}`,
      `Z Lenką siedzicie w ławce, razem się śmiejecie i dochowujecie swoich tajemnic. | ${wybor(POZIOM, 'jedno i drugie')}`,
      `Sąsiad, z którym rzadko rozmawiacie, podlewa wasze kwiaty, kiedy wyjeżdżacie. | ${wybor(POZIOM, 'zaufanie')}`,
      `Kuzyn jest bardzo zabawny, ale zawsze na ciebie skarży rodzicom. | ${wybor(POZIOM, 'sympatia')}`,
      `Szymon z drużyny ciągle się z ciebie nabija, ale na boisku zawsze możesz na nim polegać. | ${wybor(POZIOM, 'zaufanie')}`,
      `Z Igą znacie się od przedszkola i to jej pierwszej mówisz o kłopotach. | ${wybor(POZIOM, 'jedno i drugie')}`,
    ],
  },
  {
    id: 'k4-chlopcy-odbudowa',
    typ: 'luki',
    tytul: 'Czym odbudować zaufanie?',
    polecenie: 'Przeprosiny są ważne, ale zaufanie odbudowują czyny. Co to jest?',
    naglowki: ['co robię?', 'co to jest?'],
    naRaz: 3,
    przyklady: [
      `Zgubiłem pożyczoną książkę, więc odkupuję ją za kieszonkowe i oddaję. | ${wybor(ODBUDOWA, 'czyn')}`,
      `Wygadałam sekret koleżanki, więc daję jej czekoladę, żeby nie była zła. | ${wybor(ODBUDOWA, 'przekupstwo')}`,
      `Zapomniałem oddać koledze grę, więc mówię: „Sorry, zapomniałem”. | ${wybor(ODBUDOWA, 'same słowa')}`,
      `Spóźniłam się na umówione spotkanie, więc od tej pory zawsze przychodzę na czas. | ${wybor(ODBUDOWA, 'czyn')}`,
      `Śmiałem się z kolegi przy wszystkich, więc obiecuję mu grę na mojej konsoli. | ${wybor(ODBUDOWA, 'przekupstwo')}`,
      `Wygłupami zepsułam drużynie mecz, więc cały tydzień przychodzę pierwsza na trening. | ${wybor(ODBUDOWA, 'czyn')}`,
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
    // Fakty z bitwy (model 3D, kroki 8-13) - inne niz w filmie 5 i w kole.
    id: 'k4-chlopcy-bitwa-skutki',
    typ: 'luki',
    tytul: 'Co z tego wynikło w bitwie?',
    polecenie: 'Przypomnij sobie bitwę na modelu. Co wynikło z tej przyczyny? Wybierz słowo po „więc”.',
    naRaz: 3,
    przyklady: [
      `W forcie 2 skończył się piasek, więc Boka zawołał: ${wybor(['szturm!', 'stój!', 'do domu!'], 'szturm!')}`,
      `Oddziały C i D wybiegły z wozowni i z chatki, więc zaatakowały wrogów ${wybor(['od tyłu', 'od przodu', 'z dachu'], 'od tyłu')}`,
      `Oddział Pastora siedział zamknięty w chatce, więc załogi fortów 1 i 2 przeszły na forty ${wybor(['4 i 5', '3 i 6', '1 i 3'], '4 i 5')}`,
      `Feri usłyszał trąbkę Boki zamiast trąbki Pastora, więc zrozumiał, że Pastor ${wybor(['przegrał', 'wygrał', 'się schował'], 'przegrał')}`,
      `Wróg złapał Kolnaya z rozkazem, więc do okopu skoczył sam ${wybor(['Boka', 'Nemeczek', 'Janosz'], 'Boka')}`,
      `Feri chciał uwolnić jeńców, więc nagle skręcił całą grupą do ${wybor(['chatki', 'bramy', 'tartaku'], 'chatki')}`,
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
