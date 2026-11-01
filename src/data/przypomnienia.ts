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

const R2 = (n: number) => `Powtórka rozdziału II · ${n}/5`;

export const PRZYPOMNIENIA: Przypomnienie[] = [
  // ---------- Klasa 4, rozdzial II - lekcja 29 (powtorka z nauczycielem) ----------
  {
    id: 'p4-r2-slowa',
    naglowek: R2(1),
    tytul: 'Słowa: potoczne, porównanie, synonimy',
    kroki: [
      { typ: 'regula', tekst: '**Wyraz potoczny** mówimy na luzie, do kolegów. W wypracowaniu i do dorosłych - ==oficjalny==.' },
      { typ: 'zamiana', pary: [['kasa', 'pieniądze'], ['gadać', 'rozmawiać'], ['kumpel', 'kolega']], podpis: 'sens ten sam, zmienia się tylko styl' },
      { typ: 'czesci', czesci: [['plecak ciężki', 'co opisuję'], ['jak', 'słówko: jak, jakby, niczym, niby'], ['kamień', 'do czego porównuję']] },
      { typ: 'para', a: 'szybki', b: 'prędki', znak: '=', podpis: 'synonimy - podobne znaczenie' },
      { typ: 'para', a: 'otwierać', b: 'zamykać', znak: '↔', podpis: 'antonimy - przeciwne znaczenie' },
    ],
  },
  {
    id: 'p4-r2-list',
    naglowek: R2(2),
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
    naglowek: R2(3),
    tytul: 'Rzeczownik',
    kroki: [
      { typ: 'regula', tekst: 'Rzeczownik odpowiada na pytania ==kto? co?== Nazywa też uczucia i zjawiska: radość, burza.' },
      { typ: 'pytanie', zdanie: 'Na parapecie śpi kot.', od: 'śpi', do: 'kot', pytanie: 'kto?', wynik: 'rzeczownik' },
      { typ: 'czesci', czesci: [['ten stół', 'rodzaj męski'], ['ta lampa', 'rodzaj żeński'], ['to okno', 'rodzaj nijaki']] },
      { typ: 'regula', tekst: 'Liczba: **pojedyncza** (kot) i **mnoga** (koty). Tylko mnogą mają: ==drzwi, nożyczki, spodnie==.' },
    ],
  },
  {
    id: 'p4-r2-przypadki',
    naglowek: R2(4),
    tytul: 'Przypadki',
    kroki: [
      { typ: 'czesci', czesci: [['M', 'kto? co?'], ['D', 'kogo? czego?'], ['C', 'komu? czemu?'], ['B', 'kogo? co?'], ['N', 'z kim? z czym?'], ['Ms', 'o kim? o czym?'], ['W', 'o!']] },
      { typ: 'pytanie', zdanie: 'Idę do kina z bratem.', od: 'Idę', do: 'bratem', pytanie: 'z kim?', wynik: 'narzędnik' },
      { typ: 'pytanie', zdanie: 'Pomagam babci w ogrodzie.', od: 'Pomagam', do: 'babci', pytanie: 'komu?', wynik: 'celownik' },
      { typ: 'zamiana', pary: [['nie ma zabawków', 'zabawek'], ['Kasia!', 'Kasiu!']], podpis: 'dopełniacz l. mnogiej często bez końcówki · wołacz, gdy wołamy' },
    ],
  },
  {
    id: 'p4-r2-pisownia',
    naglowek: R2(5),
    tytul: 'Pisownia: wielka litera i „nie”',
    kroki: [
      { typ: 'regula', tekst: '**Wielką** literą nazwy własne: imiona, zwierzęta, miasta, państwa, rzeki, góry, planety. **Małą**: ==dni tygodnia, miesiące==, zwykłe słowa.' },
      { typ: 'zamiana', pary: [['ola', 'Ola'], ['wisła', 'Wisła'], ['Poniedziałek', 'poniedziałek']] },
      { typ: 'pytanie', zdanie: 'Ola czuje niepokój.', od: 'czuje', do: 'niepokój', pytanie: 'co?', wynik: 'rzeczownik - razem' },
      { typ: 'zamiana', pary: [['nie porządek', 'nieporządek'], ['niewiem', 'nie wiem']], podpis: '„nie” z rzeczownikiem razem, z czasownikiem osobno' },
    ],
  },
];

export function przypomnienieById(id: string): Przypomnienie | undefined {
  return PRZYPOMNIENIA.find((p) => p.id === id);
}
