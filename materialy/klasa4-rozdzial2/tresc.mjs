// Zeszyt powtórzeniowy przed sprawdzianem - klasa 4, rozdział II „Pośród słów i znaczeń”.
// Każdy temat: krótkie „Przypomnij sobie” + zadania z filmiku z rozwiązaniem
// i wyjaśnieniem DLACZEGO. Sprawdzian losuje podobne zadania (sprawdzian.mjs).
// Znaczniki: **pogrubienie**, ==zaznaczenie== (żółte tło), __podkreślenie__, ~~skreślenie~~.

export const ZESZYT = {
  plik: 'klasa4-rozdzial2-powtorka',
  klasa: 'Klasa 4',
  dzial: 'Rozdział II · Pośród słów i znaczeń',
  tytul: 'Powtórka przed sprawdzianem',
  wstep: 'Ten zeszyt to wszystko, co było w filmikach z rozdziału II - w skrócie. Przy każdym temacie najpierw przypomnisz sobie regułę, a potem zobaczysz zadania z filmiku razem z rozwiązaniem. Zasłoń odpowiedź kartką, spróbuj sam, a potem sprawdź. Na sprawdzianie będą bardzo podobne zadania!',
  tematy: [
    {
      tytul: 'Wyrazy potoczne',
      lekcja: 18,
      przypomnij: [
        '**Wyrazy potoczne** to słowa swobodne, „na luzie”: siema, nara, kasa, ziomek, ściema, ogarniać, czadowo.',
        'Nie są brzydkie ani zakazane. Pasują do rozmowy z **kolegami, rodzeństwem, przyjaciółmi** i do wiadomości na telefonie.',
        '**Unikamy ich**, gdy odpowiadamy przy tablicy, rozmawiamy z nauczycielem, dyrektorem albo obcym dorosłym. W **wypracowaniu są zakazane**.',
        'Każdy wyraz potoczny ma poważnego brata: kasa - ==pieniądze==, wcinać - ==jeść==, kimać - ==spać==, ziomek - ==kolega==, wkurzony - ==zdenerwowany==.',
        'W słowniku przy wyrazie potocznym stoi skrót **pot.**, a wszystkie słowa są ułożone **alfabetycznie**.',
      ],
      zadania: [
        {
          polecenie: 'Do kogo to powiedziano: do kolegi czy do pani dyrektor?',
          tresc: ['Nara, widzimy się jutro!', 'Do widzenia, do zobaczenia jutro.', 'Przepraszam, nie zrozumiałem polecenia.', 'Sorki, nie ogarniam tego zadania.', 'Ale ściema!'],
          odpowiedz: ['**do kolegi** (nara)', '**do pani dyrektor**', '**do pani dyrektor**', '**do kolegi** (sorki, ogarniam)', '**do kolegi** (ściema = kłamstwo)'],
          dlaczego: 'Wyrazy potoczne zdradzają rozmowę na luzie.',
        },
        {
          polecenie: 'Zamień wyraz potoczny na oficjalny.',
          tresc: ['Zgubiłem całą kasę.', 'Mój brat wcina już trzecią kanapkę.', 'Nie ogarniam tej mapy.', 'Babcia była wkurzona na kota.'],
          odpowiedz: ['Zgubiłem ==wszystkie pieniądze==.', 'Mój brat ==je== już trzecią kanapkę.', 'Nie ==rozumiem== tej mapy.', 'Babcia była ==zdenerwowana== na kota.'],
          dlaczego: 'Sens się nie zmienia, zmienia się tylko styl - z luźnego na oficjalny.',
        },
        {
          polecenie: 'Znajdź 4 wyrazy potoczne w wypracowaniu Oli i popraw je.',
          tresc: ['W sobotę pojechaliśmy na wycieczkę do zoo. Było mega! Najbardziej spodobały mi się małpy. Potem wcinaliśmy lody, a tata wydał na nie całą kasę. W drodze powrotnej wszyscy w autobusie kimali.'],
          odpowiedz: ['~~mega~~ - **wspaniale**', '~~wcinaliśmy~~ - **jedliśmy**', '~~kasę~~ - **pieniądze**', '~~kimali~~ - **spali**'],
        },
        {
          polecenie: 'Ułóż alfabetycznie, jak w słowniku.',
          tresc: ['wcinać, kimać, ściema, kasa, ogarniać'],
          odpowiedz: ['**kasa, kimać, ogarniać, ściema, wcinać**'],
          dlaczego: 'Kasa i kimać zaczynają się na k - wtedy patrzymy na drugą literę: a jest przed i.',
        },
      ],
    },
    {
      tytul: 'Porównanie',
      lekcja: 19,
      przypomnij: [
        '**Porównanie** zestawia dwie rzeczy i pokazuje, w czym są podobne: biega szybko ==jak gepard==.',
        'Słówka porównania: **jak, jakby, niczym, niby**.',
        'Porównanie ma 3 części: to, co opisujemy + słówko + to, do czego porównujemy: ręce zimne / jak / lód.',
        '**Uwaga!** Samo „jak” to jeszcze nie porównanie: „Jak się nazywasz?” niczego nie porównuje.',
        'Znane porównania: głodny jak wilk, zdrowy jak ryba, wierny jak pies, chytry jak lis, śpi jak suseł.',
        'Własne porównanie w 3 krokach: **cecha** (ciężki) ➜ **co ma ją najbardziej** (walizka) ➜ **połącz słówkiem**: ciężki jak walizka.',
      ],
      zadania: [
        {
          polecenie: 'W których zdaniach jest porównanie?',
          tresc: ['Plecak był ciężki jak kamień.', 'Jak się nazywa twój pies?', 'Babcia piecze pyszne ciasto.', 'W klasie było cicho jak w bibliotece.', 'Mój młodszy brat jest uparty.', 'Śnieg leżał na polu niby gruba kołdra.'],
          odpowiedz: ['**tak**', '**nie** - to pytanie, niczego nie porównujemy', 'nie', '**tak**', 'nie', '**tak**'],
        },
        {
          polecenie: 'Dokończ znane porównania.',
          tresc: ['chytry jak ...', 'powolny jak ...', 'czerwony jak ...', 'silny jak ...', 'śpi jak ...'],
          odpowiedz: ['lis', 'żółw / ślimak', 'burak / rak', 'koń / niedźwiedź', 'suseł'],
        },
        {
          polecenie: 'Ulepsz opis psa Burka - dopisz porównania.',
          tresc: ['Burek jest wielki.', 'Szczeka głośno.', 'Biega szybko.'],
          odpowiedz: ['np. Burek jest wielki ==jak szafa==.', 'np. Szczeka głośno ==niczym syrena strażacka==.', 'np. Biega szybko ==jak strzała==.'],
          dlaczego: 'Sprawdź: jest słówko i ta rzecz naprawdę ma tę cechę (szafa jest wielka).',
        },
        {
          polecenie: 'Wymyśl własne porównania.',
          tresc: ['Szkolny korytarz na przerwie jest głośny ...', 'Moje łóżko w sobotę rano jest ...', 'Deszcz stuka w okno ...'],
          odpowiedz: ['np. jak stadion podczas meczu', 'np. ciepłe niczym gniazdko', 'np. jakby ktoś bębnił palcami'],
        },
      ],
    },
    {
      tytul: 'Synonimy i antonimy',
      lekcja: 20,
      przypomnij: [
        '**Synonimy** to wyrazy o podobnym znaczeniu (bliskoznaczne): smutny - markotny, iść - maszerować.',
        'Synonimy pomagają **unikać powtórzeń** i mówią więcej: zapytał, odpowiedział, krzyknął, szepnął zamiast ciągle „powiedział”.',
        '**Antonimy** to wyrazy o przeciwnym znaczeniu: wysoki - niski, otwierać - zamykać.',
        'Nie każdy wyraz ma antonim: dom, niebieski, czytać.',
      ],
      zadania: [
        {
          polecenie: 'Połącz w pary wyrazy bliskoznaczne.',
          tresc: ['smutny, szybki, bać się, zmęczony, auto', 'samochód, prędki, wyczerpany, markotny, lękać się'],
          odpowiedz: ['smutny - **markotny**, szybki - **prędki**, bać się - **lękać się**, zmęczony - **wyczerpany**, auto - **samochód**'],
        },
        {
          polecenie: 'Zamień „powiedział” na lepsze synonimy.',
          tresc: ['- Gdzie jest mój plecak? - powiedział Tomek.', '- Pod ławką - powiedziała Ola.', '- Uwaga, pies! - powiedział tata.', '- Śpij już, kochanie - powiedziała mama.'],
          odpowiedz: ['==zapytał== (jest pytanie)', '==odpowiedziała==', '==krzyknął== (ostrzega, wykrzyknik)', '==szepnęła== (przy śpiącym mówi się cicho)'],
        },
        {
          polecenie: 'Dopisz antonimy.',
          tresc: ['wysoki', 'otwierać', 'cichy', 'początek', 'pełny'],
          odpowiedz: ['niski', 'zamykać', 'głośny', 'koniec', 'pusty'],
        },
        {
          polecenie: 'Synonimy (S) czy antonimy (A)?',
          tresc: ['mądry - inteligentny', 'ciepło - zimno', 'biec - pędzić', 'kupić - sprzedać', 'piękny - śliczny', 'stary - młody'],
          odpowiedz: ['**S**', '**A**', '**S**', '**A**', '**S**', '**A**'],
        },
      ],
    },
    {
      tytul: 'List',
      lekcja: 21,
      przypomnij: [
        'Części listu po kolei: **miejscowość i data** (prawy górny róg) · **nagłówek** (Droga Ciociu!) · **wstęp** · **rozwinięcie** · **zakończenie** · **pozdrowienia** · **podpis** (ręcznie) · czasem **PS**.',
        'Nagłówek zawsze wielką literą. Po **wykrzykniku** dalej piszemy wielką literą, po **przecinku** - małą.',
        '**Ty, Ciebie, Ci, Tobie, Twój** - wielką literą (szacunek dla adresata). **ja, mnie, mój** - małą (chyba że zaczynają zdanie).',
        '**Akapit** = jedna myśl. Nowy akapit zaczynamy od wcięcia.',
      ],
      zadania: [
        {
          polecenie: 'Czego brakuje w liście Oli do cioci?',
          tresc: ['Dziękuję Ci za książkę o zwierzętach. Bardzo mi się przydała! Wczoraj byliśmy z klasą w zoo. Najbardziej podobały mi się pingwiny, bo zabawnie chodzą. Kiedy nas odwiedzisz? Całuję mocno!'],
          odpowiedz: ['brak **miejscowości i daty**, **nagłówka** (np. Droga Ciociu!) i **podpisu** (np. Twoja Ola)'],
        },
        {
          polecenie: 'Popraw błędy w początkach listów.',
          tresc: ['Kochana Ciociu, Dziękuję za prezent.', 'Drogi Wujku! dawno do Ciebie nie pisałem.', 'drogi Marku! Co u Ciebie słychać?'],
          odpowiedz: ['Kochana Ciociu, ==d==ziękuję... (po przecinku mała litera)', 'Drogi Wujku! ==D==awno... (po wykrzykniku wielka)', '==D==rogi Marku! (nagłówek zawsze wielką literą)'],
        },
        {
          polecenie: 'Wstaw słowa z nawiasów.',
          tresc: ['Dziękuję (ty) ... za list. Bardzo (ja) ... ucieszył. Czy (twój) ... pies już wyzdrowiał? Często o (ty) ... myślę. (mój) ... kot przesyła (ty) ... buziaki.'],
          odpowiedz: ['Dziękuję ==Ci== za list. Bardzo ==mnie== ucieszył. Czy ==Twój== pies już wyzdrowiał? Często o ==Tobie== myślę. ==Mój== kot przesyła ==Ci== buziaki.'],
          dlaczego: '„Mój” jest wielką literą tylko dlatego, że zaczyna zdanie.',
        },
        {
          polecenie: 'Od których zdań zaczyna się nowy akapit?',
          tresc: ['(1) Dziękuję za list i zdjęcia. (2) Bardzo się ucieszyłem. (3) W sobotę byłem z tatą na rybach. (4) Złapaliśmy trzy ryby, ale wszystkie wypuściliśmy. (5) Napisz mi, co u Ciebie. (6) Czekam na odpowiedź!'],
          odpowiedz: ['od zdania **3** (ryby) i od zdania **5** (zakończenie)'],
          dlaczego: '3 sprawy = 3 akapity.',
        },
      ],
    },
    {
      tytul: 'Rzeczownik',
      lekcja: 22,
      przypomnij: [
        '**Rzeczownik** odpowiada na pytania **kto? co?**',
        'Nazywa: osoby (babcia), zwierzęta (chomik), rzeczy (hulajnoga), rośliny (tulipan), zjawiska (śnieżyca), miejsca (las) i pojęcia (tęsknota - nie dotkniesz, ale poczujesz).',
        '**Liczba**: pojedyncza (autobus) i mnoga (autobusy).',
        '**Rodzaj** w liczbie pojedynczej: **ten** - męski, **ta** - żeński, **to** - nijaki. W liczbie mnogiej: **ci** - męskoosobowy (tylko panowie i chłopcy), **te** - niemęskoosobowy (cała reszta).',
        'Niektóre rzeczowniki mają tylko liczbę mnogą: okulary, nożyczki, spodnie, sanki.',
      ],
      zadania: [
        {
          polecenie: 'Co nazywa każdy rzeczownik?',
          tresc: ['śnieżyca, babcia, tęsknota, las, hulajnoga, tulipan, chomik'],
          odpowiedz: ['śnieżyca - **zjawisko**, babcia - **osoba**, tęsknota - **pojęcie**, las - **miejsce**, hulajnoga - **rzecz**, tulipan - **roślina**, chomik - **zwierzę**'],
        },
        {
          polecenie: 'Zmień liczbę.',
          tresc: ['autobus', 'lusterko', 'sąsiadka', 'ptaki', 'kanapki', 'przyjaciele'],
          odpowiedz: ['autobusy', 'lusterka', 'sąsiadki', 'ptak', 'kanapka', 'przyjaciel'],
        },
        {
          polecenie: 'Dopisz ten, ta albo to i nazwę rodzaju.',
          tresc: ['słoń', 'mysz', 'jajko', 'telefon', 'noc', 'imię'],
          odpowiedz: ['ten - męski', '==ta== - żeński (pułapka!)', 'to - nijaki', 'ten - męski', '==ta== - żeński (pułapka!)', 'to - nijaki'],
          dlaczego: 'Wygląd wyrazu może oszukać - zawsze sprawdzaj: ten, ta, to.',
        },
        {
          polecenie: 'Ci czy te?',
          tresc: ['koledzy', 'koleżanki', 'kotki', 'policjanci', 'auta', 'okulary'],
          odpowiedz: ['**ci**', 'te', 'te', '**ci**', 'te', 'te'],
          dlaczego: '„Ci” tylko dla chłopców i mężczyzn (rodzaj męskoosobowy).',
        },
      ],
    },
    {
      tytul: 'Przypadki',
      lekcja: 23,
      przypomnij: [
        '**Mianownik** - kto? co? (jest) · **Dopełniacz** - kogo? czego? (nie ma) · **Celownik** - komu? czemu? (przyglądam się) · **Biernik** - kogo? co? (widzę) · **Narzędnik** - z kim? z czym? (idę) · **Miejscownik** - o kim? o czym? (mówię) · **Wołacz** - o!',
        'Kolejność zapamiętasz z wierszyka: **M**ama **D**aje **C**ukierki, **B**asia **N**ajpierw **M**amie **W**ręcza.',
        'Przypadek w zdaniu rozpoznajesz, zadając pytanie od czynności: szukam (czego?) klucza - dopełniacz.',
        'Wołacz: Ola - Olu!, Janek - Janku!, babcia - babciu!, pan Adam - panie Adamie!',
      ],
      zadania: [
        {
          polecenie: 'Odmień wyraz „lis” przez przypadki.',
          tresc: ['jest ... · nie ma ... · przyglądam się ... · widzę ... · idę z ... · mówię o ... · o, ...!'],
          odpowiedz: ['lis, lisa, lisowi, lisa, z lisem, o lisie, lisie!'],
        },
        {
          polecenie: 'Ułóż przypadki po kolei i dopisz pytania.',
          tresc: ['narzędnik, mianownik, wołacz, biernik, dopełniacz, miejscownik, celownik'],
          odpowiedz: ['mianownik (kto? co?), dopełniacz (kogo? czego?), celownik (komu? czemu?), biernik (kogo? co?), narzędnik (z kim? z czym?), miejscownik (o kim? o czym?), wołacz (o!)'],
        },
        {
          polecenie: 'W jakim przypadku jest wyróżniony wyraz?',
          tresc: ['Na niebie świeci __księżyc__.', 'Szukam __klucza__.', 'Dałem marchewkę __królikowi__.', 'Dziadek czyta __gazetę__.', 'Jadę na basen z __ciocią__.', 'Opowiadam o __koncercie__.'],
          odpowiedz: ['mianownik (co świeci?)', 'dopełniacz (szukam czego?)', 'celownik (komu dałem?)', 'biernik (czyta co?)', 'narzędnik (z kim?)', 'miejscownik (o czym?)'],
        },
        {
          polecenie: 'Zawołaj poprawnie.',
          tresc: ['Ola', 'Janek', 'babcia', 'pan Adam', 'Michał'],
          odpowiedz: ['Olu!', 'Janku!', 'babciu!', 'panie Adamie!', 'Michale!'],
        },
      ],
    },
    {
      tytul: 'Przypadki w liczbie mnogiej',
      lekcja: 24,
      przypomnij: [
        'Te same pytania, ale wiele rzeczy: koty, (nie ma) kotów, kotom, (widzę) koty, z kotami, o kotach, koty!',
        'W liczbie mnogiej **mianownik, biernik i wołacz** często wyglądają tak samo - rozróżniamy je pytaniem: kto? co? stoi (mianownik), kogo? co? widzę / lubię (biernik), o! (wołacz).',
        'Uważaj na dopełniacz: nie ma ==skarpetek==, ==spodni==, ==bułek== (a nie skarpetków, spodniów, bułków). I narzędnik: z ==dziećmi==.',
      ],
      zadania: [
        {
          polecenie: 'Odmień „książki” w liczbie mnogiej.',
          tresc: ['książki · nie ma ... · przyglądam się ... · widzę ... · z ... · o ... · ...!'],
          odpowiedz: ['książki, książek, książkom, książki, z książkami, o książkach, książki!'],
        },
        {
          polecenie: 'Mianownik, biernik czy wołacz?',
          tresc: ['__Samochody__ stoją na parkingu.', 'Mama kupiła __jabłka__.', '__Ptaki__, lećcie do ciepłych krajów!', 'Lubię zimowe __wieczory__.', '__Lekcje__ kończą się wcześnie.'],
          odpowiedz: ['mianownik (co stoi?)', 'biernik (co kupiła?)', 'wołacz', 'biernik (co lubię?)', 'mianownik (co się kończy?)'],
        },
        {
          polecenie: 'Popraw źle odmieniony wyraz.',
          tresc: ['Zgubiłem dwie pary skarpetków.', 'Nie mogę znaleźć moich spodniów.', 'Na wycieczce byliśmy z innymi dzieciami.', 'W sklepie nie było już bułków.'],
          odpowiedz: ['==skarpetek==', '==spodni==', '==dziećmi==', '==bułek=='],
        },
        {
          polecenie: 'Odmień „okno” w obu liczbach.',
          tresc: ['liczba pojedyncza i mnoga'],
          odpowiedz: ['okno, okna, oknu, okno, oknem, o oknie, okno!', 'okna, ==okien==, oknom, okna, oknami, o oknach, okna!'],
        },
      ],
    },
    {
      tytul: 'Opinia i argument',
      lekcja: 25,
      przypomnij: [
        '**Fakt** można sprawdzić (Pająk ma osiem nóg). **Opinia** to czyjeś zdanie (Koty są mądrzejsze od psów).',
        'Słowa „najlepszy, piękniejszy, najnudniejszy” często zdradzają opinię.',
        'Zwroty do opinii: **moim zdaniem, uważam, że, sądzę, że, według mnie**.',
        '**Argument** to powód, który uzasadnia opinię: Warto czytać, **ponieważ** poznaję ciekawe historie. „Bo tak” **nie jest** argumentem.',
        'Druga strona też może mieć argumenty - odpowiadamy na nie spokojnie (jak Zosia z „Kursu fotografii”).',
      ],
      zadania: [
        {
          polecenie: 'Fakt czy opinia?',
          tresc: ['Tydzień ma siedem dni.', 'Matematyka to najnudniejszy przedmiot.', 'Pająk ma osiem nóg.', 'Zima jest piękniejsza od lata.', 'Wisła płynie przez Kraków.', 'Koty są mądrzejsze od psów.'],
          odpowiedz: ['fakt', '**opinia**', 'fakt', '**opinia**', 'fakt', '**opinia**'],
        },
        {
          polecenie: '„Warto mieć w klasie akwarium z rybkami...” Który powód jest argumentem?',
          tresc: ['bo tak', 'bo w innej klasie też jest akwarium', 'ponieważ uczymy się dbać o zwierzęta'],
          odpowiedz: ['nie - niczego nie tłumaczy', 'nie', '**tak - to jedyny argument**'],
        },
        {
          polecenie: 'Podaj dwa argumenty: „Warto czytać książki przed snem, ponieważ...”',
          tresc: [],
          odpowiedz: ['np. łatwiej zasnąć, poznaję nowe słowa, ćwiczę wyobraźnię, odpoczywam od telefonu'],
        },
        {
          polecenie: 'Chcesz psa, a mama mówi „nie”. Podaj jej argument i swoją odpowiedź.',
          tresc: [],
          odpowiedz: ['np. „Kto będzie z nim wychodził?” - Zrobię grafik spacerów.', '„To kosztuje.” - Dołożę z kieszonkowego.', '„A wakacje?” - Zajmie się nim dziadek.'],
        },
      ],
    },
    {
      tytul: 'Asertywność',
      lekcja: 26,
      przypomnij: [
        '**Asertywność** to mówienie „nie” spokojnie i z szacunkiem.',
        'Trzy reakcje: **uległa** (robię, choć nie chcę), **agresywna** (krzyczę, obrażam), **asertywna** (spokojnie odmawiam i mówię dlaczego).',
        'Wzór: **Nie, bo... Ale mogę...**',
        'Gdy obcy dorosły coś proponuje (podwiezienie, cukierek): głośne **NIE**, odchodzisz i od razu mówisz rodzicom albo nauczycielowi.',
      ],
      zadania: [
        {
          polecenie: 'Która odpowiedź jest asertywna?',
          tresc: ['Kolega chce twoje miejsce przy oknie w autobusie.', 'Ktoś namawia cię na zjedzenie ostrej papryczki na wyzwanie.', 'Kuzyn zabiera twoje cukierki.'],
          odpowiedz: ['„Nie, siedzę tu pierwszy. Ale w drodze powrotnej możemy się zamienić.”', '„Nie mam ochoty na to wyzwanie.”', '„To moje cukierki. Mogę ci dać jednego.”'],
        },
        {
          polecenie: 'Odmów według wzoru „Nie, bo... Ale mogę...”.',
          tresc: ['Kolega chce grać na twoim telefonie całą przerwę.', 'Koleżanka namawia, żeby przejść przez płot do sąsiada po piłkę.'],
          odpowiedz: ['np. Nie, bo telefon jest od rodziców. Ale mogę ci pokazać jedną grę.', 'np. Nie, bo to cudzy ogród. Ale możemy poprosić sąsiada o piłkę.'],
        },
        {
          polecenie: 'Grupa śmieje się z nowej osoby w klasie. Co powiesz?',
          tresc: [],
          odpowiedz: ['kolegom: „Przestańcie, to nie jest śmieszne.”', 'nowej osobie: „Chodź z nami na przerwę.”', 'jeśli nie przestaną - mówisz nauczycielowi (to nie skarżenie, to pomoc).'],
        },
      ],
    },
    {
      tytul: 'Wielka czy mała litera?',
      lekcja: 27,
      przypomnij: [
        '**Nazwy własne** (jedna, konkretna osoba, zwierzę, miejsce) piszemy **wielką literą**: imiona i nazwiska, imiona zwierząt, miasta, państwa, rzeki, góry, kontynenty, planety, święta.',
        '**Nazwy pospolite** (cała grupa) piszemy **małą literą**: pies, rzeka, miasto, plaża.',
        'Pary: góry - ==Tatry==, planeta - ==Mars==, kot - ==Filemon==, państwo - ==Polska==, święto - ==Boże Narodzenie== (oba słowa wielką!).',
        'Pułapki: ==Ziemia== (planeta) i ziemia (gleba), ==Róża== (imię) i róża (kwiat).',
      ],
      zadania: [
        {
          polecenie: 'Dopisz nazwę własną.',
          tresc: ['góry', 'planeta', 'kot', 'państwo', 'święto'],
          odpowiedz: ['np. Tatry', 'np. Mars', 'np. Filemon', 'np. Polska', 'np. Wielkanoc'],
        },
        {
          polecenie: 'Wypisz słowa, które powinny zaczynać się wielką literą.',
          tresc: ['W sobotę ola pojechała z tatą do gdańska. Wzięła ze sobą psa reksia. Z okna pociągu widziała rzekę wisłę, a wieczorem jasną planetę wenus.'],
          odpowiedz: ['**Ola, Gdańska, Reksia, Wisłę, Wenus**', 'tata, pies, rzeka, planeta - małą, bo to nazwy pospolite'],
        },
        {
          polecenie: 'Wielką czy małą?',
          tresc: ['Kret kopie korytarze w (z/Z)iemi.', 'Astronauta oglądał (z/Z)iemię z kosmosu.', 'W ogrodzie zakwitła czerwona (r/R)óża.', 'Moją najlepszą koleżanką jest (r/R)óża.'],
          odpowiedz: ['ziemi - gleba', '**Ziemię** - planeta', 'róża - kwiat', '**Róża** - imię'],
        },
        {
          polecenie: 'Znajdź 5 błędów w pocztówce.',
          tresc: ['Jestem z rodzicami w sopocie. Codziennie biegam po Plaży z psem fafikiem. Wieczorem widziałam planetę saturn. Tata mówi, że w przyszłym roku pojedziemy do włoch.'],
          odpowiedz: ['==Sopocie==, ==plaży== (pospolita!), ==Fafikiem==, ==Saturn==, ==Włoch=='],
          dlaczego: 'Błędy są w dwie strony - plaża to nazwa pospolita.',
        },
      ],
    },
    {
      tytul: '„Nie” z rzeczownikami',
      lekcja: 28,
      przypomnij: [
        '**Nie** z rzeczownikami piszemy **razem**: niepokój, nieporządek, niepogoda, nieuwaga.',
        '**Nie** z czasownikami piszemy **osobno**: nie śpi, nie lubi, nie pije.',
        'Jak sprawdzić? Pytam: **kto? co?** ➜ rzeczownik ➜ razem. **Co robi?** ➜ czasownik ➜ osobno.',
        'Są słowa, które bez „nie” nie istnieją: niedźwiedź, niedziela, niemowlę.',
      ],
      zadania: [
        {
          polecenie: 'Dodaj „nie” i zapisz nowy wyraz.',
          tresc: ['cierpliwość', 'uwaga', 'posłuszeństwo', 'ład', 'ostrożność'],
          odpowiedz: ['niecierpliwość', 'nieuwaga', 'nieposłuszeństwo', 'nieład', 'nieostrożność'],
        },
        {
          polecenie: 'Razem czy osobno?',
          tresc: ['Ciasne buty to prawdziwa (nie)wygoda.', 'Tomek (nie)śpi.', 'Za (nie)grzeczność Kuba przeprosił.', 'Kasia (nie)lubi szpinaku.', 'Pani zauważyła moją (nie)obecność.', 'Babcia (nie)pije kawy.'],
          odpowiedz: ['**niewygoda** (co?)', 'nie śpi (co robi?)', '**niegrzeczność**', 'nie lubi', '**nieobecność**', 'nie pije'],
        },
        {
          polecenie: 'Odgadnij rzeczownik z „nie”.',
          tresc: ['Maleńkie dziecko, które jeszcze nie chodzi i nie mówi.', 'Dzień tygodnia po sobocie.', 'Twój wróg, a nie przyjaciel.', 'Leje, wieje i jest zimno.'],
          odpowiedz: ['niemowlę', 'niedziela', 'nieprzyjaciel', 'niepogoda'],
        },
        {
          polecenie: 'Znajdź 3 błędy w ogłoszeniu.',
          tresc: ['Przepraszamy za nie porządek w szatni. Nie zapomnijcie butów na zmianę. Nie punktualność to zły zwyczaj, więc nie spóźniajcie się. Na mokrych schodach grozi wam nie bezpieczeństwo, więc nie biegajcie!'],
          odpowiedz: ['==nieporządek==, ==Niepunktualność==, ==niebezpieczeństwo==', 'nie zapomnijcie, nie spóźniajcie, nie biegajcie - to czasowniki, osobno'],
        },
      ],
    },
  ],
};
