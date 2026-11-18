// Karta na zajęcia wyrównawcze: zdanie od zera (wielka litera, znak na końcu, czasownik,
// budowanie zdania, granice zdań). Po karcie „Części mowy - podstawy”, do prezentacji
// public/materialy/wyrownawcze/zdanie-prezentacja.html (przykłady na karcie są inne niż w prezentacji).
// Generator: node materialy/karta.mjs wyrownawcze-zdanie

export const KARTA = {
  plik: 'wyrownawcze-zdanie-karta',
  klasa: 'Wyrównawcze',
  tytul: 'Zdanie od zera',
  podtytul: 'wielka litera, czasownik, . ? !',
  duza: true,
  tematy: [
    {
      tytul: 'Początek i koniec',
      wiedza: [
        'Zdanie zaczynamy **wielką literą**.',
        'Na końcu: **kropka .** (mówię), **pytajnik ?** (pytam), **wykrzyknik !** (wołam)',
      ],
      zadania: [
        {
          polecenie: 'Jaki znak postawisz na końcu? Zakreśl.',
          info: 'Przeczytaj zdanie na głos. Pytasz o coś? Stawiasz pytajnik. Wołasz, ostrzegasz, cieszysz się? Wykrzyknik. Po prostu mówisz? Kropka.',
          przyklad: [
            '„Czy masz rower”',
            'Czy pytam? **Tak** ➜ ==?==',
            '„Uwaga, auto”',
            'Ostrzegam, wołam ➜ ==!==',
          ],
          kolumny: 2,
          linie: [
            'Gdzie mieszkasz {{.|*?|!}}',
            'Mam na imię Kuba {{*.|?|!}}',
            'Uwaga, pies gryzie {{.|?|*!}}',
            'Lubisz lody {{.|*?|!}}',
            'Wczoraj padał deszcz {{*.|?|!}}',
            'Brawo, wygraliśmy {{.|?|*!}}',
          ],
        },
        {
          polecenie: 'Podkreśl literę, która powinna być wielka. Dopisz znak na końcu.',
          info: 'Pierwsza litera zdania zawsze jest wielka. Potem przeczytaj zdanie i zdecyduj: kropka, pytajnik czy wykrzyknik?',
          przyklad: [
            'tata myje auto',
            'Pierwsza litera zdania: ==t== ➜ ==T==',
            'Mówię o czymś ➜ kropka',
            '==T==ata myje auto==.==',
          ],
          kolumny: 2,
          linie: [
            '((m))ama gotuje obiad[[.|8]]',
            '((c))zy idziesz ze mną[[?|8]]',
            '((u))ważaj, schody[[!|8]]',
            '((w)) piątek jedziemy do babci[[.|8]]',
            '((j))aki masz numer buta[[?|8]]',
            '((h))urra, wakacje[[!|8]]',
          ],
        },
      ],
    },
    {
      tytul: 'Zdanie ma czasownik',
      wiedza: [
        'W zdaniu ktoś coś **robi** albo coś się **dzieje**.',
        'Bez czasownika to **nie jest** zdanie: ~~Zimny poranek.~~',
      ],
      zadania: [
        {
          polecenie: 'Zdanie czy nie? Zakreśl.',
          info: 'Szukaj czasownika: zapytaj „co robi?” albo „co się dzieje?”. Jest odpowiedź - to zdanie. Nie ma - to nie zdanie.',
          przyklad: [
            '„Kot śpi na kocu.”',
            'Co robi kot? ==śpi== ➜ jest czasownik ➜ **zdanie**',
            '„Ciepły koc.”',
            'Co robi? Nie ma odpowiedzi ➜ **nie zdanie**',
          ],
          linie: [
            'Kot pije mleko. {{*zdanie|nie}}',
            'Zimny poranek. {{zdanie|*nie}}',
            'Dzieci grają w piłkę. {{*zdanie|nie}}',
            'Mój ulubiony kolor. {{zdanie|*nie}}',
            'Babcia piecze ciasto. {{*zdanie|nie}}',
            'Wycieczka do zoo. {{zdanie|*nie}}',
          ],
        },
        {
          polecenie: 'Dopisz czasownik, żeby powstało zdanie.',
          info: 'Zapytaj: co robi? Wpisz słowo, które mówi, co ktoś robi. Dobrych odpowiedzi jest kilka.',
          przyklad: [
            'Brat ... zupę.',
            'Pytam: co robi brat z zupą?',
            'Brat ==je== zupę.',
          ],
          kolumny: 2,
          linie: [
            'Pies [[np. szczeka|26]] na kota.',
            'Mama [[np. czyta|26]] książkę.',
            'Ptaki [[np. śpiewają|26]] w lesie.',
            'Kuba [[np. je|26]] kanapkę.',
            'Słońce [[np. świeci|26]] mocno.',
            'Pani [[np. pisze|26]] na tablicy.',
          ],
        },
      ],
    },
    {
      tytul: 'Budujemy zdanie',
      wiedza: [
        'Najkrótsze zdanie: **kto? + co robi?** Kot śpi.',
        'Potem dokładamy: **jaki? gdzie? kiedy?**',
      ],
      zadania: [
        {
          polecenie: 'Ułóż zdanie z rozsypanki. Pamiętaj o wielkiej literze i znaku na końcu.',
          info: 'Znajdź najpierw: kto? (rzeczownik) i co robi? (czasownik). Reszta wyrazów dochodzi do nich. Przeczytaj na głos, czy brzmi dobrze.',
          przyklad: [
            'rysuje, Zosia, konia',
            'Kto? ==Zosia==. Co robi? ==rysuje==.',
            'Co rysuje? ==konia==',
            '==Zosia rysuje konia.==',
          ],
          linie: [
            'kopie, piłkę, Tomek ➜ [[Tomek kopie piłkę.|80]]',
            'w, rosną, kwiaty, ogrodzie ➜ [[W ogrodzie rosną kwiaty.|80]]',
            'gazetę, czyta, dziadek ➜ [[Dziadek czyta gazetę.|80]]',
            'masz, kota, czy ➜ [[Czy masz kota?|80]]',
          ],
        },
        {
          polecenie: 'Rozbuduj zdanie. Dopisz wyraz, który odpowiada na pytanie w nawiasie.',
          info: 'Zdanie zostaje to samo, dokładamy tylko jeden klocek. Wyraz na początku zdania piszesz wielką literą.',
          przyklad: [
            'Kot śpi.',
            '(jaki?) ➜ ==Rudy== kot śpi.',
            '(gdzie?) ➜ Rudy kot śpi ==na fotelu==.',
          ],
          linie: [
            'Pies szczeka. ➜ (jaki?) [[np. Mały|28]] pies szczeka.',
            'Dzieci grają. ➜ Dzieci grają (gdzie?) [[np. na boisku|34]].',
            'Mama gotuje. ➜ (kiedy?) [[np. Wieczorem|30]] mama gotuje.',
          ],
        },
      ],
    },
    {
      tytul: 'Gdzie kończy się zdanie?',
      wiedza: [
        'Kończy się jedna myśl - stawiam **kropkę**.',
        'Następne zdanie zaczynam **wielką literą**.',
      ],
      zadania: [
        {
          polecenie: 'Podziel tekst na trzy zdania. Przepisz go z kropkami i wielkimi literami.',
          info: 'Czytaj powoli. Gdzie kończy się jedna myśl i zaczyna nowa? Tam kropka, a dalej wielka litera.',
          przyklad: [
            'rano wstałam umyłam zęby',
            'Pierwsza myśl: ==Rano wstałam.==',
            'Druga myśl: ==Umyłam zęby.==',
          ],
          linie: ['w niedzielę byłem w zoo widziałem lwa i żyrafę najbardziej podobały mi się małpy'],
          pisanie: 3,
          wzor: 'W niedzielę byłem w zoo. Widziałem lwa i żyrafę. Najbardziej podobały mi się małpy.',
        },
        {
          polecenie: 'Napisz dwa zdania o sobie: jedno z kropką i jedno pytanie do kolegi.',
          info: 'Pierwsze zdanie: powiedz coś o sobie. Drugie: zapytaj o coś kolegę - na końcu pytajnik. Oba zaczynasz wielką literą.',
          przyklad: [
            'O sobie: ==Mam psa.==',
            'Pytanie: ==Czy ty też masz psa?==',
          ],
          pisanie: 2,
          wzor: 'Mam dziesięć lat.\nCzy lubisz grać w piłkę?',
        },
      ],
    },
  ],
};
