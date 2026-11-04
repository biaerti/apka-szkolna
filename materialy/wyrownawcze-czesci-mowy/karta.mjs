// Karta na zajęcia wyrównawcze: części mowy od zera (rzeczownik, czasownik, przymiotnik).
// Dla dwójki uczniów kl. 4, którzy potrzebują samych podstaw - osobno od arkuszy z czytaniem
// ze zrozumieniem (src/data/remedial.ts). Pytania zamiast definicji: kto? co? / co robi? / jaki?
// Większe litery (duza: true), 2 strony A4, wspólne sprawdzenie na projektorze
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
          ],
        },
        {
          polecenie: 'Co jest w twojej klasie? Napisz trzy rzeczowniki.',
          info: 'Rozejrzyj się i zapytaj: co tu stoi, co tu leży? Każda rzecz, którą widzisz, ma nazwę - to rzeczownik.',
          przyklad: [
            'Rozglądam się po kuchni.',
            'Co tu stoi? ==lodówka==',
            'Co tu leży? ==łyżka==',
            'lodówka, łyżka to ==rzeczowniki==',
          ],
          linie: ['[[np. ławka|34]]   [[np. tablica|34]]   [[np. krzesło|34]]'],
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
          ],
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
            ],
          },
        },
      ],
    },
  ],
};
