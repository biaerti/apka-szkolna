// Zeszyt powtórzeniowy przed sprawdzianem - klasa 4, rozdział I „Poznajemy siebie i innych”.
// Każdy temat: krótkie „Przypomnij sobie” + zadania z filmików (czasownik, wypowiedzenia,
// plan ramowy, powtórka działu, podsumowanie rozdziału) z rozwiązaniem i wyjaśnieniem DLACZEGO.
// Sprawdzian losuje podobne zadania (sprawdzian.mjs).
// Znaczniki: **pogrubienie**, ==zaznaczenie== (żółte tło), __podkreślenie__, ~~skreślenie~~.

export const ZESZYT = {
  plik: 'klasa4-rozdzial1-powtorka',
  klasa: 'Klasa 4',
  dzial: 'Rozdział I · Poznajemy siebie i innych',
  tytul: 'Powtórka przed sprawdzianem',
  wstep: 'Ten zeszyt to wszystko, co było w filmikach z rozdziału I - w skrócie. Przy każdym temacie najpierw przypomnisz sobie regułę, a potem zobaczysz zadania z filmików razem z rozwiązaniem. Zasłoń odpowiedź kartką, spróbuj sam, a potem sprawdź. Na sprawdzianie będą bardzo podobne zadania!',
  tematy: [
    {
      tytul: 'Świat przedstawiony',
      lekcja: '1-2',
      przypomnij: [
        '**Świat przedstawiony** to wszystko, czego dowiadujemy się o świecie utworu.',
        'Pytamy: **kiedy?** - czas, **gdzie?** - miejsce, **kto?** - bohaterowie, **co się stało?** - wydarzenia.',
        'Przykład: W ==sobotę rano== ==Kuba== pojechał z ==tatą== ==nad jezioro== i ==złowił pierwszą rybę==.',
        'Miejscem może być też świat gry albo bajki, np. serwer Minecrafta.',
      ],
      zadania: [
        {
          polecenie: 'Wypisz czas, miejsce, bohaterkę i wydarzenie.',
          tresc: ['Wieczorem Asia zbudowała w swoim pokoju dom w Minecrafcie.'],
          odpowiedz: ['czas - **wieczór**', 'miejsce - **pokój Asi i świat gry Minecraft**', 'bohaterka - **Asia**', 'wydarzenie - **zbudowanie domu**'],
          dlaczego: 'Każdy element to odpowiedź na jedno pytanie: kiedy? gdzie? kto? co się stało?',
        },
        {
          polecenie: 'Wypisz elementy świata przedstawionego.',
          tresc: ['W sobotę rano Kuba pojechał z tatą nad jezioro i złowił pierwszą rybę.'],
          odpowiedz: ['czas - **sobota rano**, miejsce - **jezioro**, bohaterowie - **Kuba i tata**, wydarzenie - **złowienie ryby**'],
        },
      ],
    },
    {
      tytul: 'Kto mówi w tekście?',
      lekcja: '1-3',
      przypomnij: [
        '**Autor** to prawdziwy człowiek, który napisał tekst. Nie jest tym samym co osoba mówiąca w tekście.',
        'W **opowiadaniu** (prozie) mówi **narrator**: zapis zdaniami i akapitami.',
        '**Narrator-bohater** mówi o sobie: wszedłem, ==zobaczyłam==, uciekliśmy.',
        '**Narrator-obserwator** opowiada o innych: ==Kuba wszedł==, Ola zobaczyła.',
        'W **wierszu** (wersy, strofy) mówi **podmiot liryczny**. Zdradzają go słowa: czuję, marzę, jestem.',
      ],
      zadania: [
        {
          polecenie: 'Kto mówi: autor, narrator czy podmiot liryczny? Czy jest bohaterem, czy obserwatorem?',
          tresc: ['Wbiegłem do ciemnego tunelu i usłyszałem kroki.'],
          odpowiedz: ['**narrator-bohater**'],
          dlaczego: 'To proza, więc mówi narrator, nie podmiot liryczny. Forma „wbiegłem” pokazuje, że sam bierze udział w wydarzeniach.',
        },
        {
          polecenie: 'Kto mówi w każdym fragmencie?',
          tresc: ['Otworzyłam szafę i zobaczyłam małego kotka.', 'Tomek przez całą przerwę szukał zgubionej piłki.', 'Siedzę przy oknie, / liczę krople deszczu, / czekam na słońce.'],
          odpowiedz: ['**narrator-bohater** - otworzyłam, zobaczyłam', '**narrator-obserwator** - opowiada o Tomku', '**podmiot liryczny** - to wiersz, ma wersy'],
          dlaczego: 'Opowiadanie - narrator. Wiersz - podmiot liryczny.',
        },
      ],
    },
    {
      tytul: 'Notatka',
      lekcja: 4,
      przypomnij: [
        'Dobra notatka jest **krótka, konkretna i czytelna** (zasada 3K). Wybiera tylko najważniejsze informacje.',
        '**Punkty** - lista rzeczy albo kolejne kroki.',
        '**Tabela** - porównanie co najmniej dwóch rzeczy według tych samych cech.',
        '**Mapa myśli** - od jednego hasła rozchodzą się skojarzenia.',
        '**Notatka tradycyjna** - krótkie wyjaśnienie tematu pełnymi zdaniami.',
      ],
      zadania: [
        {
          polecenie: 'Jaką formę notatki wybierzesz?',
          tresc: ['plan zakupów na klasowe śniadanie', 'porównanie dwóch rowerów przed zakupem', 'porównanie dwóch filmów'],
          odpowiedz: ['**notatka punktowa** - potrzebna lista', '**tabela** - np. model, cena, rozmiar kół, liczba biegów', '**tabela** - te same cechy obu filmów'],
        },
        {
          polecenie: 'Dwa poradniki budowania bazy różnią się czasem trwania, liczbą kroków i poziomem trudności. Zaproponuj cztery nagłówki tabeli.',
          tresc: [],
          odpowiedz: ['**film, czas, liczba kroków, poziom trudności**'],
          dlaczego: 'Pierwsza kolumna mówi, który poradnik opisujesz, a pozostałe to wspólne cechy obu.',
        },
      ],
    },
    {
      tytul: 'Głoska, litera, sylaba',
      lekcja: '5-6',
      przypomnij: [
        '**Literę** widzimy i piszemy. **Głoskę** słyszymy i wymawiamy.',
        'Czasem dwie litery to jedna głoska (dwuznak): **sz, cz, rz, ch, dz, dż, dź**.',
        'Samogłoski: **a, ą, e, ę, i, o, u (ó), y**. W każdej sylabie jest samogłoska.',
        'Wyrazy przenosimy do nowej linii tylko **między sylabami**: chmu-ra.',
      ],
      zadania: [
        {
          polecenie: 'Ile liter, głosek i sylab?',
          tresc: ['szafa', 'czapka', 'chleb'],
          odpowiedz: ['5 liter, 4 głoski, 2 sylaby: sza-fa', '6 liter, 5 głosek, 2 sylaby: czap-ka', '5 liter, 4 głoski, 1 sylaba'],
          dlaczego: 'sz, cz i ch to dwie litery, ale jedna głoska.',
        },
      ],
    },
    {
      tytul: 'Epitet',
      lekcja: 7,
      przypomnij: [
        '**Epitet** to słowo, które **określa rzeczownik**. Odpowiada na pytania: **jaki? jaka? jakie?**',
        'Najczęściej jest przymiotnikiem: ==ciemny, gęsty== las.',
        'Epitety malują obraz i budują nastrój: ==zimny, ponury== wieczór.',
        'Zamiast „fajny” i „super” wybieraj słowa dokładne.',
      ],
      zadania: [
        {
          polecenie: 'Wskaż trzy epitety i nazwij część mowy.',
          tresc: ['Cichy, mroczny korytarz prowadził do starej wieży.'],
          odpowiedz: ['==cichy== korytarz, ==mroczny== korytarz, ==stara== wieża - to **przymiotniki**'],
          dlaczego: 'Budują nastrój tajemnicy i pomagają wyobrazić sobie miejsce.',
        },
        {
          polecenie: 'Dopisz do każdego rzeczownika jeden epitet.',
          tresc: ['… pies szczekał na … kota pod … drzewem.'],
          odpowiedz: ['np. ==Mały, kudłaty== pies szczekał na ==rudego== kota pod ==starym== drzewem.'],
          dlaczego: 'Każdy epitet określa rzeczownik i odpowiada na pytanie jaki?',
        },
      ],
    },
    {
      tytul: 'Czasownik',
      lekcja: '11-13',
      przypomnij: [
        '**Czasownik** nazywa **czynności** (co robi? - biegnie) i **stany** (co się z nim dzieje? - śpi).',
        '**„Nie”** z czasownikami piszemy **osobno**: nie wiem, nie lubię.',
        'Odmienia się przez **osoby** (ja piszę, ty piszesz), **liczby** (piszę, piszemy), **czasy** (pisałem, piszę, będę pisać), a w czasie przeszłym także przez **rodzaje** (pisał, pisała, pisało).',
        '**Formy nieosobowe**: bezokolicznik (co robić? - pisać, zjeść) i formy na **-no, -to** (zrobiono, umyto). Nie wiemy, kto wykonuje czynność.',
      ],
      zadania: [
        {
          polecenie: 'Które słowo to czasownik?',
          tresc: ['A. wysoki', 'B. skacze', 'C. kot', 'D. wesoło'],
          odpowiedz: ['**B. skacze** - odpowiada na pytanie co robi?'],
        },
        {
          polecenie: 'Dopisz „nie”.',
          tresc: ['biegnę', 'rozumiem'],
          odpowiedz: ['**nie biegnę**', '**nie rozumiem**'],
          dlaczego: '„Nie” z czasownikami zawsze piszemy osobno.',
        },
        {
          polecenie: 'Określ osobę i liczbę: „gramy”.',
          tresc: ['A. 1. osoba liczby mnogiej', 'B. 2. osoba liczby pojedynczej', 'C. 3. osoba liczby mnogiej'],
          odpowiedz: ['**A** - my gramy'],
        },
        {
          polecenie: 'Zamień „czytam” na czas przeszły i przyszły.',
          tresc: [],
          odpowiedz: ['przeszły: **czytałem / czytałam**', 'przyszły: **będę czytać / przeczytam**'],
        },
        {
          polecenie: 'Określ osobę, liczbę, czas i rodzaj.',
          tresc: ['zobaczyłam', 'odkryłyśmy'],
          odpowiedz: ['**1. osoba, liczba pojedyncza, czas przeszły, rodzaj żeński** (chłopiec: zobaczyłem)', '**1. osoba, liczba mnoga, czas przeszły, rodzaj niemęskoosobowy**; bezokolicznik: odkryć'],
        },
      ],
    },
    {
      tytul: 'Zdanie i równoważnik zdania',
      lekcja: 14,
      przypomnij: [
        '**Wypowiedzenie** to słowo albo grupa słów, którymi coś komuś przekazujemy.',
        '**Zdanie** ma czasownik w **formie osobowej** (wiemy, kto działa): Kuba ==czyta== książkę.',
        '**Równoważnik zdania** go nie ma: Czytanie książki.',
        '**Uwaga, pułapka!** Bezokolicznik to forma nieosobowa: „Nie biegać po korytarzu” to **równoważnik**.',
        'Równoważnik zmienisz w zdanie, gdy dodasz czasownik w formie osobowej: Alarm pożarowy ➜ ==Włączył się== alarm pożarowy.',
      ],
      zadania: [
        {
          polecenie: 'Wskaż czasownik i określ jego osobę oraz liczbę.',
          tresc: ['Wracamy ze spaceru.'],
          odpowiedz: ['**wracamy** - 1. osoba, liczba mnoga'],
        },
        {
          polecenie: 'Zdanie (Z) czy równoważnik (R)?',
          tresc: ['Deszcz pada.', 'Silny deszcz.', 'Zamknij drzwi.', 'Nie biegać po korytarzu.', 'Cisza w bibliotece.', 'Uczniowie odkładają książki.'],
          odpowiedz: ['**Z** - pada', '**R** - brak czasownika', '**Z** - zamknij (polecenie też może być zdaniem)', '**R** - biegać to bezokolicznik', '**R**', '**Z** - odkładają'],
        },
        {
          polecenie: 'Zamień równoważnik w zdanie.',
          tresc: ['Porządek na ławce.'],
          odpowiedz: ['np. Na ławce ==panuje== porządek.'],
          dlaczego: 'Wystarczy dodać czasownik w formie osobowej, który pasuje do sensu.',
        },
      ],
    },
    {
      tytul: 'Plan ramowy',
      lekcja: 15,
      przypomnij: [
        '**Plan ramowy** to **najważniejsze wydarzenia** z opowieści, zapisane w punktach, **bez szczegółów**.',
        'Wydarzenia układamy **po kolei** - od początku do końca (kolejność chronologiczna).',
        'Wszystkie punkty mają **tę samą formę**, najczęściej **równoważniki zdań**.',
        'Ze zdania zrobisz punkt planu, gdy czasownik zamienisz na rzeczownik: Tomek ==znalazł== klucz ➜ ==Znalezienie== klucza.',
      ],
      zadania: [
        {
          polecenie: 'Urodziny Kuby. Wypisz numery najważniejszych wydarzeń.',
          tresc: ['Zaproszenie przyjaciół na urodziny.', 'Niebieskie balony pod sufitem.', 'Przyjście gości.', 'Kolorowe serwetki na stole.', 'Rozpakowanie prezentów.', 'Wspólna zabawa w podchody.', 'Pożegnanie gości.'],
          odpowiedz: ['**1, 3, 5, 6, 7**'],
          dlaczego: 'Balony i serwetki to wygląd, a nie wydarzenie - nic się w nich nie dzieje.',
        },
        {
          polecenie: 'Zdanie czy równoważnik zdania?',
          tresc: ['Wyjazd na wycieczkę.', 'Autobus zatrzymał się w lesie.', 'Zbieranie grzybów.', 'Szukać drogi do autobusu.', 'Dzieci zgubiły mapę.', 'Powrót do szkoły.'],
          odpowiedz: ['R', '**Z** - zatrzymał się', 'R', 'R - bezokolicznik', '**Z** - zgubiły', 'R'],
        },
        {
          polecenie: 'Zamień zdania na punkty planu (równoważniki).',
          tresc: ['Kot wszedł na drzewo.', 'Strażacy przyjechali na sygnale.', 'Strażak zdjął kota z gałęzi.', 'Dzieci podziękowały strażakom.'],
          odpowiedz: ['Wejście kota na drzewo.', 'Przyjazd strażaków.', 'Zdjęcie kota z gałęzi.', 'Podziękowanie dla strażaków.'],
          dlaczego: 'W żadnym punkcie nie zostaje czasownik w formie osobowej (wszedł, przyjechali, zdjął).',
        },
        {
          polecenie: 'Ułóż plan ramowy bajki o Czerwonym Kapturku w 5 punktach.',
          tresc: [],
          odpowiedz: ['np. 1. Wyprawa Czerwonego Kapturka do babci. 2. Spotkanie z wilkiem w lesie. 3. Podstęp wilka w domu babci. 4. Połknięcie babci i Kapturka. 5. Uratowanie ich przez myśliwego.'],
          dlaczego: 'Sprawdź: tylko najważniejsze wydarzenia, po kolei, same równoważniki.',
        },
        {
          polecenie: 'Zamień zdania o pikniku na punkty planu.',
          tresc: ['Rodzina pojechała na piknik.', 'Nagle zaczęło padać.', 'Wszyscy wrócili do domu.'],
          odpowiedz: ['Wyjazd na piknik.', 'Nagły deszcz.', 'Powrót do domu.'],
        },
      ],
    },
  ],
};
