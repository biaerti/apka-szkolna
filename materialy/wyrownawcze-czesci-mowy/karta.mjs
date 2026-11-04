// Karta na zajęcia wyrównawcze: części mowy od zera (rzeczownik, czasownik, przymiotnik).
// Dla dwójki uczniów kl. 4, którzy potrzebują samych podstaw - osobno od arkuszy z czytaniem
// ze zrozumieniem (src/data/remedial.ts). Pytania zamiast definicji: kto? co? / co robi? / jaki?
// Większe litery (duza: true), 2 strony A4 (dużo prostych przykładów), wspólne sprawdzenie na projektorze
// (public/materialy/karty/wyrownawcze-czesci-mowy-karta.html).
// Generator: node materialy/karta.mjs wyrownawcze-czesci-mowy

export const KARTA = {
  plik: 'wyrownawcze-czesci-mowy-karta',
  klasa: 'Wyrównawcze',
  tytul: 'Części mowy - podstawy',
  podtytul: 'kto? co? jaki? co robi?',
  duza: true,
  tematy: [
    {
      tytul: 'Rzeczownik',
      wiedza: [
        '**Rzeczownik** to nazwa osoby, zwierzęcia, rzeczy albo rośliny.',
        'Pytamy: **kto?** ==mama==, ==kot== · **co?** ==stół==, ==róża==',
      ],
      zadania: [
        {
          polecenie: 'Zapytaj o wyraz: kto? czy co? Zakreśl.',
          info: 'O ludzi i zwierzęta pytamy „kto?”. O rzeczy i rośliny pytamy „co?”. Jedno i drugie to rzeczownik.',
          przyklad: [
            'Wyraz: **siostra**',
            'Człowiek ➜ pytam ==kto?== ➜ kto? siostra',
            'Wyraz: **kubek**',
            'Rzecz ➜ pytam ==co?== ➜ co? kubek',
            'Oba wyrazy to ==rzeczowniki==.',
          ],
          kolumny: 2,
          linie: [
            'pies {{*kto?|co?}}',
            'lampa {{kto?|*co?}}',
            'babcia {{*kto?|co?}}',
            'jabłko {{kto?|*co?}}',
            'lekarz {{*kto?|co?}}',
            'rower {{kto?|*co?}}',
            'koń {{*kto?|co?}}',
            'drzewo {{kto?|*co?}}',
            'kolega {{*kto?|co?}}',
            'telefon {{kto?|*co?}}',
          ],
        },
        {
          polecenie: 'Podkreśl rzeczowniki. W każdym zdaniu są dwa.',
          info: 'Szukaj nazw ludzi, zwierząt, rzeczy i roślin. Sprawdź pytaniem: kto to? co to?',
          przyklad: [
            'Mama kupiła chleb.',
            'Kto to? ==mama== ➜ rzeczownik',
            'Co to? ==chleb== ➜ rzeczownik',
            '„kupiła” to nie nazwa - pytam „co zrobiła?”',
          ],
          kolumny: 2,
          linie: [
            '((Pies)) gryzie ((kość)).',
            '((Tata)) czyta ((gazetę)).',
            '((Kot)) pije ((mleko)).',
            '((Babcia)) piecze ((ciasto)).',
          ],
        },
        {
          polecenie: 'Napisz rzeczowniki.',
          info: 'Pomyśl o ludziach z domu (kto?) i o rzeczach, które nosisz do szkoły (co?). Każda nazwa to rzeczownik.',
          przyklad: [
            'Kto jest w szkole? ==pani==, ==uczeń==',
            'Co jest w kuchni? ==lodówka==, ==łyżka==',
            'pani, uczeń, lodówka, łyżka to ==rzeczowniki==',
          ],
          linie: [
            'Kto jest w rodzinie? [[np. mama|24]] [[np. brat|24]] [[np. babcia|24]]',
            'Co jest w plecaku? [[np. zeszyt|24]] [[np. piórnik|24]] [[np. książka|24]]',
          ],
        },
      ],
    },
    {
      tytul: 'Czasownik',
      wiedza: [
        '**Czasownik** mówi, **co ktoś robi** albo **co się dzieje**.',
        'Pytamy: **co robi?** pies ==szczeka==, deszcz ==pada==',
      ],
      zadania: [
        {
          polecenie: 'Co robi? Dopisz czasownik.',
          info: 'Zapytaj: co robi ta osoba albo to zwierzę? Odpowiedź to czasownik. Dobrych odpowiedzi jest kilka.',
          przyklad: [
            '**Krowa** ...',
            'Pytam: co robi krowa?',
            'Krowa ==muczy==. Krowa ==je trawę==.',
            'muczy, je ➜ ==czasowniki==',
          ],
          kolumny: 2,
          linie: [
            'Ptak [[lata / śpiewa|28]].',
            'Ryba [[pływa|28]].',
            'Kucharz [[gotuje|28]].',
            'Uczeń [[pisze / czyta|28]].',
            'Pies [[szczeka / biega|28]].',
            'Mama [[pracuje / gotuje|28]].',
            'Żaba [[skacze / kumka|28]].',
            'Piłkarz [[gra / biega|28]].',
          ],
        },
        {
          polecenie: 'Podkreśl czasownik w każdym zdaniu.',
          info: 'Zadaj pytanie „co robi?” albo „co się dzieje?” o kogoś ze zdania. Wyraz, który odpowiada, to czasownik.',
          przyklad: [
            'Tata myje samochód.',
            'Pytam: co robi tata?',
            'Tata ==myje== samochód.',
            '„myje” to ==czasownik==',
          ],
          kolumny: 2,
          linie: [
            'Kot ((śpi)) na kanapie.',
            'Zosia ((rysuje)) konia.',
            'Dzieci ((biegają)) po boisku.',
            'Wieczorem ((pada)) deszcz.',
            'Dziadek ((czyta)) książkę.',
            'Brat ((je)) zupę.',
            'Ptaki ((śpiewają)) w lesie.',
            'Pani ((pisze)) na tablicy.',
          ],
        },
        {
          polecenie: 'Co robisz rano? Napisz trzy czasowniki.',
          info: 'Pomyśl o swoim poranku po kolei: co robisz po przebudzeniu? Każda czynność to czasownik.',
          przyklad: [
            'Co robię wieczorem?',
            'Ja ==jem== kolację.',
            'Ja ==oglądam== bajkę.',
            'Ja ==śpię==. ➜ jem, oglądam, śpię to ==czasowniki==',
          ],
          linie: ['Rano ja: [[np. wstaję|30]] [[np. myję się|30]] [[np. jem|30]]'],
        },
      ],
    },
    {
      tytul: 'Przymiotnik',
      wiedza: [
        '**Przymiotnik** mówi, **jaki** jest ktoś albo coś.',
        'Pytamy: **jaki? jaka? jakie?** ==duży== dom, ==zielona== trawa, ==słodkie== ciasto',
      ],
      zadania: [
        {
          polecenie: 'Jaki? Jaka? Jakie? Dopisz przymiotnik.',
          info: 'Pomyśl, jak to wygląda, jak smakuje albo jakie jest w dotyku. Słowo, które odpowiada na pytanie „jaki?”, to przymiotnik.',
          przyklad: [
            '**Ogień** jest ...',
            'Pytam: jaki jest ogień?',
            'Ogień jest ==gorący==. Ogień jest ==czerwony==.',
            'gorący, czerwony ➜ ==przymiotniki==',
          ],
          kolumny: 2,
          linie: [
            'Słoń jest [[duży / szary|28]].',
            'Cytryna jest [[kwaśna / żółta|28]].',
            'Lody są [[zimne / słodkie|28]].',
            'Mysz jest [[mała / szara|28]].',
            'Niebo jest [[niebieskie|28]].',
            'Śnieg jest [[biały / zimny|28]].',
            'Żyrafa jest [[wysoka|28]].',
            'Czekolada jest [[słodka|28]].',
          ],
        },
        {
          polecenie: 'Podkreśl przymiotnik w każdym zdaniu.',
          info: 'Zapytaj o rzecz albo osobę ze zdania: jaki? jaka? jakie? Wyraz, który odpowiada, to przymiotnik.',
          przyklad: [
            'Mam nowy plecak.',
            'Pytam: jaki plecak?',
            '==nowy== plecak',
            '„nowy” to ==przymiotnik==',
          ],
          kolumny: 2,
          linie: [
            'Mam ((czerwoną)) czapkę.',
            'To jest ((wesoły)) pies.',
            'Jem ((pyszne)) lody.',
            'Kot ma ((długi)) ogon.',
          ],
        },
        {
          polecenie: 'Napisz przymiotnik o przeciwnym znaczeniu.',
          info: 'Przeciwieństwo to słowo, które znaczy „na odwrót”. Też odpowiada na pytanie „jaki?”.',
          przyklad: [
            'Wyraz: **wysoki**',
            'Co znaczy na odwrót?',
            'wysoki ➜ ==niski==',
            'Oba odpowiadają na pytanie jaki? ➜ ==przymiotniki==',
          ],
          kolumny: 2,
          linie: [
            'duży ➜ [[mały|26]]',
            'wesoły ➜ [[smutny|26]]',
            'szybki ➜ [[wolny|26]]',
            'gorący ➜ [[zimny|26]]',
            'stary ➜ [[nowy / młody|26]]',
            'długi ➜ [[krótki|26]]',
          ],
        },
      ],
    },
    {
      tytul: 'Wszystko razem',
      wiedza: [
        '**kto? co?** ➜ rzeczownik',
        '**co robi?** ➜ czasownik',
        '**jaki?** ➜ przymiotnik',
      ],
      zadania: [
        {
          polecenie: 'Na jakie pytanie odpowiada wyraz? Zakreśl.',
          info: 'Wstaw wyraz do każdego pytania i posłuchaj, co pasuje: „co robi? skacze” brzmi dobrze, „kto? skacze” - nie.',
          przyklad: [
            'Wyraz: **czyta**',
            '~~kto? czyta~~ - nie pasuje',
            '==co robi?== czyta - pasuje ➜ czasownik',
            'Wyraz: **mokry** ➜ ==jaki?== mokry ➜ przymiotnik',
          ],
          linie: [
            'skacze {{kto? co?|*co robi?|jaki?}}',
            'książka {{*kto? co?|co robi?|jaki?}}',
            'wesoły {{kto? co?|co robi?|*jaki?}}',
            'je {{kto? co?|*co robi?|jaki?}}',
            'brat {{*kto? co?|co robi?|jaki?}}',
            'ciepła {{kto? co?|co robi?|*jaki?}}',
            'śpiewa {{kto? co?|*co robi?|jaki?}}',
            'okno {{*kto? co?|co robi?|jaki?}}',
            'mały {{kto? co?|co robi?|*jaki?}}',
            'pisze {{kto? co?|*co robi?|jaki?}}',
          ],
        },
        {
          polecenie: 'Ułóż zdania. Dopisz brakujące wyrazy.',
          info: 'Zdanie składamy jak klocki: jaki? + kto? + co robi? Sprawdź, czy całość brzmi dobrze, gdy przeczytasz ją na głos.',
          przyklad: [
            'jaki? ==głodny==',
            'kto? ==kot==',
            'co robi? ==miauczy==',
            'Zdanie: ==Głodny kot miauczy.==',
          ],
          tabela: {
            naglowki: ['jaki? (przymiotnik)', 'kto? co? (rzeczownik)', 'co robi? (czasownik)'],
            wiersze: [
              ['**mały**', '[[np. pies|30]]', '[[np. szczeka|30]]'],
              ['[[np. stary|30]]', '**dziadek**', '[[np. czyta|30]]'],
              ['[[np. wesoła|30]]', '[[np. dziewczynka|30]]', '**tańczy**'],
              ['**szybki**', '[[np. samochód|30]]', '[[np. jedzie|30]]'],
              ['[[np. zmęczony|30]]', '**tata**', '[[np. śpi|30]]'],
            ],
          },
        },
      ],
    },
  ],
};
