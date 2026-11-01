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
];

export function przypomnienieById(id: string): Przypomnienie | undefined {
  return PRZYPOMNIENIA.find((p) => p.id === id);
}
