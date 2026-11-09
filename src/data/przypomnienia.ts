// Rejestr slajdow "Przypomnienie" (kind: 'przypomnienie') - lekcja powtorkowa,
// ktora prowadzi nauczyciel, bez filmu (Bartek 2026-11-01: "film na
// powtorzenie mi sie nie podoba, wolalbym, zebym to ja gadal"). Jedno
// zagadnienie = jeden slajd: tytul, a potem kroki odslaniane strzalka albo
// kliknieciem w prawa polowe (lewa / strzalka w lewo chowa ostatni krok).
// Po przypomnieniu ida 2 karty "Ćwiczymy razem" i nastepne zagadnienie.
//
// Tresc zyje tutaj (slajd trzyma tylko id) - jak cwiczenia i filmiki - wiec
// poprawka nie wymaga odswiezania lekcji w bazie.
//
// Kroki (kazdy sam animuje sie po odslonieciu):
// - regula:   zdanie z **pogrubieniem** i ==zakresleniem== (marker sie domalowuje),
// - pytanie:  zdanie, strzalka od wyrazu `od` do wyrazu `do` z pytaniem, potem plakietka z wynikiem,
// - czesci:   kafelki z podpisami wchodza po kolei (np. trzy czesci porownania),
// - kolejnosc: ponumerowane etapy po kolei, ze strzalkami (np. czesci listu),
// - zamiana:  zly zapis przekreslony -> dobry obok (kasa -> pieniądze, ola -> Ola),
// - para:     dwa wyrazy ze znakiem = (synonimy) albo ↔ (antonimy) i podpisem.

export type KrokPrzypomnienia =
  | { typ: 'regula'; tekst: string }
  | { typ: 'pytanie'; zdanie: string; od: string; do: string; pytanie: string; wynik?: string }
  | { typ: 'czesci'; czesci: Array<[string, string]> }
  | { typ: 'kolejnosc'; elementy: string[] }
  | { typ: 'zamiana'; pary: Array<[string, string]>; podpis?: string }
  | { typ: 'para'; a: string; b: string; znak: '=' | '↔'; podpis: string };

export interface Przypomnienie {
  id: string;
  /** Duzy tytul zagadnienia. */
  tytul: string;
  /** Maly napis nad tytulem, np. "Powtórka · 1/5". */
  naglowek?: string;
  kroki: KrokPrzypomnienia[];
}

// Jedno zagadnienie na slajd (Bartek 2026-11-01: "rozdzielilbym, bo sa na 1 slajdzie oba zagadnienia").
const R2 = (n: number) => `Powtórka rozdziału II · ${n}/9`;
const R5 = (n: number) => `Powtórka działu 2 · ${n}/10`;

export const PRZYPOMNIENIA: Przypomnienie[] = [
  // ---------- Klasa 4, rozdzial II - lekcja 29 (powtorka z nauczycielem) ----------
  {
    id: 'p4-r2-potoczne',
    naglowek: R2(1),
    tytul: 'Wyrazy potoczne',
    kroki: [
      { typ: 'regula', tekst: '**Wyraz potoczny** mówimy na luzie, do kolegów. W szkole, do dorosłych i w wypracowaniu - ==oficjalny==.' },
      { typ: 'czesci', czesci: [['Siema! Nara!', 'do kolegi'], ['Dzień dobry! Do widzenia!', 'do pani dyrektor']] },
      { typ: 'zamiana', pary: [['kasa', 'pieniądze'], ['gadać', 'rozmawiać'], ['kumpel', 'kolega']], podpis: 'sens ten sam, zmienia się tylko styl' },
      { typ: 'regula', tekst: 'W słowniku przy wyrazie potocznym stoi skrót ==pot.==' },
    ],
  },
  {
    id: 'p4-r2-porownanie',
    naglowek: R2(2),
    tytul: 'Porównanie',
    kroki: [
      { typ: 'regula', tekst: '**Porównanie** zestawia dwie rzeczy, które są w czymś ==podobne==.' },
      { typ: 'czesci', czesci: [['plecak ciężki', 'co opisuję'], ['jak', 'słówko'], ['kamień', 'do czego porównuję']] },
      { typ: 'regula', tekst: 'Słówka porównania: ==jak, jakby, niczym, niby==.' },
      { typ: 'regula', tekst: 'Uwaga! „**Jak** masz na imię?” to pytanie - nic z niczym nie zestawiamy, więc ==to nie porównanie==.' },
    ],
  },
  {
    id: 'p4-r2-synonimy',
    naglowek: R2(3),
    tytul: 'Synonimy i antonimy',
    kroki: [
      { typ: 'para', a: 'szybki', b: 'prędki', znak: '=', podpis: 'synonimy - podobne znaczenie' },
      { typ: 'para', a: 'otwierać', b: 'zamykać', znak: '↔', podpis: 'antonimy - przeciwne znaczenie' },
      { typ: 'regula', tekst: 'Synonimy pomagają **unikać powtórzeń**: zamiast ciągle „powiedział” - ==zapytał, krzyknął, szepnął==.' },
      { typ: 'regula', tekst: 'Nie każdy wyraz ma antonim: ==dom, niebieski, czytać==.' },
    ],
  },
  {
    id: 'p4-r2-list',
    naglowek: R2(4),
    tytul: 'List',
    kroki: [
      { typ: 'kolejnosc', elementy: ['miejscowość i data', 'nagłówek', 'wstęp', 'rozwinięcie', 'zakończenie', 'pozdrowienia', 'podpis'] },
      { typ: 'regula', tekst: 'Nagłówek zawsze **wielką** literą: ==Droga Ciociu!== Po wykrzykniku dalej wielką, po przecinku małą.' },
      { typ: 'zamiana', pary: [['ty', 'Ty'], ['ciebie', 'Ciebie'], ['twój', 'Twój']], podpis: 'o adresacie - wielką literą, z szacunku' },
      { typ: 'regula', tekst: 'O sobie piszemy **małą** literą: ==ja, mnie, mój== (chyba że zaczynają zdanie).' },
    ],
  },
  {
    id: 'p4-r2-rzeczownik',
    naglowek: R2(5),
    tytul: 'Rzeczownik',
    kroki: [
      { typ: 'regula', tekst: 'Rzeczownik odpowiada na pytania ==kto? co?== (też uczucia: radość).' },
      { typ: 'pytanie', zdanie: 'Na parapecie śpi kot.', od: 'śpi', do: 'kot', pytanie: 'kto?', wynik: 'rzeczownik' },
      { typ: 'czesci', czesci: [['ten stół', 'rodzaj męski'], ['ta lampa', 'rodzaj żeński'], ['to okno', 'rodzaj nijaki']] },
      { typ: 'regula', tekst: 'Liczba: **pojedyncza** (kot) i **mnoga** (koty). Tylko mnogą mają: ==drzwi, nożyczki, spodnie==.' },
      { typ: 'czesci', czesci: [['ci chłopcy, panowie', 'męskoosobowy - tylko mężczyźni'], ['te dziewczynki, psy, stoły', 'niemęskoosobowy - cała reszta']] },
    ],
  },
  {
    id: 'p4-r2-przypadki',
    naglowek: R2(6),
    tytul: 'Przypadki',
    kroki: [
      { typ: 'czesci', czesci: [['M', 'kto? co?'], ['D', 'kogo? czego?'], ['C', 'komu? czemu?'], ['B', 'kogo? co?'], ['N', 'z kim? z czym?'], ['Ms', 'o kim? o czym?'], ['W', 'o!']] },
      { typ: 'pytanie', zdanie: 'Idę do kina z bratem.', od: 'Idę', do: 'bratem', pytanie: 'z kim?', wynik: 'narzędnik' },
      { typ: 'pytanie', zdanie: 'Nie widzę tablicy.', od: 'widzę', do: 'tablicy', pytanie: 'kogo? czego?', wynik: 'dopełniacz' },
      { typ: 'pytanie', zdanie: 'Pomagam babci w ogrodzie.', od: 'Pomagam', do: 'babci', pytanie: 'komu?', wynik: 'celownik' },
    ],
  },
  {
    id: 'p4-r2-trudne',
    naglowek: R2(7),
    tytul: 'Trudne formy i wołacz',
    kroki: [
      { typ: 'regula', tekst: 'Dopełniacz liczby mnogiej (nie ma kogo? czego?) często ==nie ma końcówki==.' },
      { typ: 'zamiana', pary: [['kredków', 'kredek'], ['zabawków', 'zabawek'], ['spodniów', 'spodni']], podpis: 'jedna kredka - nie ma kredek' },
      { typ: 'regula', tekst: '**Wołacz** - forma, gdy do kogoś ==wołamy== albo się zwracamy.' },
      { typ: 'zamiana', pary: [['Kasia!', 'Kasiu!'], ['Tomek!', 'Tomku!'], ['pani Ewa!', 'pani Ewo!']] },
    ],
  },
  {
    id: 'p4-r2-wielka',
    naglowek: R2(8),
    tytul: 'Wielka czy mała litera?',
    kroki: [
      { typ: 'regula', tekst: '**Wielką** literą piszemy ==nazwy własne== - imię jednej osoby, zwierzęcia, miejsca.' },
      { typ: 'czesci', czesci: [['Burek', 'imię psa'], ['Wisła', 'rzeka'], ['Tatry', 'góry'], ['Mars', 'planeta']] },
      { typ: 'regula', tekst: '**Małą**: ==dni tygodnia, miesiące== i zwykłe słowa: pies, rzeka, miasto.' },
      { typ: 'zamiana', pary: [['ola', 'Ola'], ['wisła', 'Wisła'], ['Poniedziałek', 'poniedziałek']] },
    ],
  },
  {
    id: 'p4-r2-nie',
    naglowek: R2(9),
    tytul: '„Nie” z rzeczownikami',
    kroki: [
      { typ: 'regula', tekst: 'Pytam o wyraz bez „nie”: **kto? co?** - piszemy ==razem==, **co robi?** - piszemy osobno.' },
      { typ: 'pytanie', zdanie: 'Ola czuje niepokój.', od: 'czuje', do: 'niepokój', pytanie: 'co?', wynik: 'rzeczownik - razem' },
      { typ: 'pytanie', zdanie: 'Kuba nie śpi.', od: 'Kuba', do: 'śpi', pytanie: 'co robi?', wynik: 'czasownik - osobno' },
      { typ: 'zamiana', pary: [['nie porządek', 'nieporządek'], ['niewiem', 'nie wiem']] },
    ],
  },

  // ---------- Klasa 5, dzial 2 - lekcja 29a (powtorka z nauczycielem) ----------
  {
    id: 'p5-d2-przenosnia',
    naglowek: R5(1),
    tytul: 'Porównanie i przenośnia',
    kroki: [
      { typ: 'regula', tekst: '**Porównanie** mówi wprost, ma słówko ==jak, niczym, niby==: szybki jak wiatr.' },
      { typ: 'regula', tekst: '**Przenośnia** nie ma słówka - wyrazy razem znaczą coś ==nowego==, nie dosłownie.' },
      { typ: 'czesci', czesci: [['oczy jak gwiazdy', 'porównanie - jest „jak”'], ['gwiazdy w oczach', 'przenośnia']] },
      { typ: 'regula', tekst: 'Test: ==narysuj to dosłownie==. Wychodzi bzdura (morze łez)? To przenośnia.' },
    ],
  },
  {
    id: 'p5-d2-frazeo',
    naglowek: R5(2),
    tytul: 'Związki frazeologiczne',
    kroki: [
      { typ: 'regula', tekst: 'Związek frazeologiczny - ==stałe połączenie== wyrazów o przenośnym znaczeniu.' },
      { typ: 'czesci', czesci: [['włosy stanęły dęba', 'strach'], ['zapaść się pod ziemię', 'wstyd'], ['być w siódmym niebie', 'radość']] },
      { typ: 'zamiana', pary: [['czuć pietruszkę', 'czuć miętę'], ['mieć pszczoły w nosie', 'mieć muchy w nosie']], podpis: 'nie wymieniamy w nim słów' },
    ],
  },
  {
    id: 'p5-d2-nacechowane',
    naglowek: R5(3),
    tytul: 'Zdrobnienia i zgrubienia',
    kroki: [
      { typ: 'regula', tekst: 'Wyraz **neutralny** tylko nazywa: pies. **Nacechowany** wyraża też ==uczucia==.' },
      { typ: 'czesci', czesci: [['piesek', 'zdrobnienie - małe, czule'], ['pies', 'neutralny'], ['psisko', 'zgrubienie - duże, żartem']] },
      { typ: 'regula', tekst: 'Zdrobnienia: ==-ek, -ka, -ko== (domek). Zgrubienia: ==-isko, -sko== (domisko).' },
      { typ: 'kolejnosc', elementy: ['niepokój', 'strach', 'groza'] },
    ],
  },
  {
    id: 'p5-d2-przypadki',
    naglowek: R5(4),
    tytul: 'Rzeczownik i przypadki',
    kroki: [
      { typ: 'czesci', czesci: [['M', 'kto? co?'], ['D', 'kogo? czego?'], ['C', 'komu? czemu?'], ['B', 'kogo? co?'], ['N', 'z kim? z czym?'], ['Ms', 'o kim? o czym?'], ['W', 'o!']] },
      { typ: 'pytanie', zdanie: 'Gram w szachy z dziadkiem.', od: 'Gram', do: 'dziadkiem', pytanie: 'z kim?', wynik: 'narzędnik' },
      { typ: 'pytanie', zdanie: 'Szukam parasola.', od: 'Szukam', do: 'parasola', pytanie: 'kogo? czego?', wynik: 'dopełniacz' },
      { typ: 'regula', tekst: 'Nazwy **własne** wielką literą: ==Wisła, Wawel==. **Pospolite** małą: rzeka, zamek.' },
    ],
  },
  {
    id: 'p5-d2-nietypowe',
    naglowek: R5(5),
    tytul: 'Nietypowa odmiana',
    kroki: [
      { typ: 'regula', tekst: 'Rzeczowniki na **-um** w liczbie pojedynczej ==się nie odmieniają==.' },
      { typ: 'zamiana', pary: [['w liceumie', 'w liceum'], ['do centruma', 'do centrum']] },
      { typ: 'regula', tekst: 'W liczbie mnogiej już tak: muzea, ==muzeów==, w muzeach.' },
      { typ: 'czesci', czesci: [['powietrze, odzież', 'tylko liczba pojedyncza'], ['drzwi, sanie, okulary', 'tylko liczba mnoga']] },
    ],
  },
  {
    id: 'p5-d2-ea',
    naglowek: R5(6),
    tytul: 'Ę i ą na końcu wyrazu',
    kroki: [
      { typ: 'czesci', czesci: [['widzę mamę', '-ę: kogo? co?'], ['idę z mamą', '-ą: z kim? z czym?']] },
      { typ: 'czesci', czesci: [['ja piszę', '-ę: ja'], ['oni piszą', '-ą: oni, one']] },
      { typ: 'regula', tekst: 'Małe zwierzęta na **-ę**: ==kocię, źrebię, cielę==.' },
      { typ: 'regula', tekst: 'Bez ogonka tylko: ==wiem, jem, umiem, rozumiem==.' },
    ],
  },
  {
    id: 'p5-d2-temat',
    naglowek: R5(7),
    tytul: 'Temat, końcówka i ó',
    kroki: [
      { typ: 'czesci', czesci: [['tablic', 'temat - się nie zmienia'], ['-a, -y, -ą', 'końcówka - zmienia się']] },
      { typ: 'regula', tekst: 'Brak końcówki to **końcówka zerowa**: brat|==ø==, stół|ø.' },
      { typ: 'czesci', czesci: [['stół - stoły', 'ó : o'], ['ręka - ręce', 'k : c']] },
      { typ: 'regula', tekst: 'Piszę **ó**, gdy w innej formie jest ==o==: wóz - wozy.' },
    ],
  },
  {
    id: 'p5-d2-sprawozdanie',
    naglowek: R5(8),
    tytul: 'Sprawozdanie',
    kroki: [
      { typ: 'regula', tekst: '**Sprawozdanie** - krótka, rzeczowa relacja z wydarzenia, w którym ==brałem udział==.' },
      { typ: 'kolejnosc', elementy: ['tytuł', 'wstęp: kto? co? kiedy? gdzie?', 'przebieg po kolei', 'krótka opinia'] },
      { typ: 'regula', tekst: 'Słowa porządku: ==najpierw, następnie, potem, na koniec==. Same fakty, czas przeszły.' },
    ],
  },
  {
    id: 'p5-d2-dwukropek',
    naglowek: R5(9),
    tytul: 'Dwukropek',
    kroki: [
      { typ: 'regula', tekst: 'Dwukropek zapowiada, że ==coś zaraz nastąpi==.' },
      { typ: 'czesci', czesci: [['przed dialogiem', 'Tata zawołał: – Idziemy!'], ['przed wyliczeniem', 'Mam trzy zwierzęta: kota, psa i rybki.'], ['przed cytatem', 'Mówi: „Kto pyta, nie błądzi”.']] },
      { typ: 'zamiana', pary: [['Mam dwie pasje, piłkę i rower.', 'Mam dwie pasje: piłkę i rower.']] },
    ],
  },
  {
    id: 'p5-d2-reklama',
    naglowek: R5(10),
    tytul: 'Tekst reklamowy',
    kroki: [
      { typ: 'regula', tekst: 'Tekst reklamowy ==namawia== do kupna albo skorzystania z usługi.' },
      { typ: 'czesci', czesci: [['NOWOŚĆ! GRATIS!', 'słowa-wabiki'], ['Tylko dziś!', 'pośpiech'], ['Będziesz najlepszy!', 'obietnica']] },
      { typ: 'regula', tekst: 'Reklama pokazuje świat ==piękniejszy niż naprawdę== - najpierw sprawdzam, potem kupuję.' },
    ],
  },
];

export function przypomnienieById(id: string): Przypomnienie | undefined {
  return PRZYPOMNIENIA.find((p) => p.id === id);
}
