// Zeszyt powtórzeniowy przed sprawdzianem - klasa 5, dział 2 „Uwaga, uczucia!”.
// Każdy temat: krótkie „Przypomnij sobie” + zadania z filmiku z rozwiązaniem
// i wyjaśnieniem DLACZEGO. Sprawdzian losuje podobne zadania (sprawdzian.mjs).
// Znaczniki: **pogrubienie**, ==zaznaczenie== (żółte tło), __podkreślenie__.

export const ZESZYT = {
  plik: 'klasa5-dzial2-powtorka',
  klasa: 'Klasa 5',
  dzial: 'Dział 2 · Uwaga, uczucia!',
  tytul: 'Powtórka przed sprawdzianem',
  wstep: 'Ten zeszyt to wszystko, co było w filmikach z działu 2 - w skrócie. Przy każdym temacie najpierw przypomnisz sobie regułę, a potem zobaczysz zadania z filmiku razem z rozwiązaniem. Zasłoń odpowiedź kartką, spróbuj sam, a potem sprawdź. Na sprawdzianie będą bardzo podobne zadania!',
  tematy: [
    {
      tytul: 'Przenośnia',
      lekcja: 17,
      przypomnij: [
        '**Porównanie** zestawia dwie rzeczy słówkiem **jak, niczym, jakby**: szybki ==jak== wiatr, biały ==jak== śnieg, zimny ==niczym== lód.',
        '**Przenośnia (metafora)** nie ma słówka jak. Wyrazy razem znaczą coś nowego: **kamienne serce** (ktoś nieczuły), **złote serce**, **morze łez**, **las rąk**.',
        '**Test rysowania:** spróbuj to narysować. Wychodzi bzdura? To przenośnia. Zielona żaba - dosłownie. Zielono w głowie - przenośnia.',
        '**Jak odczytać przenośnię?** Zapytaj: jaki jest ten przedmiot? Kamień jest twardy i nic nie czuje, więc kamienne serce = ktoś nieczuły.',
        '**Jak zrobić przenośnię?** Weź porównanie i wyrzuć jak: śnieg jest jak biała pierzyna ➜ ==biała pierzyna śniegu==.',
      ],
      zadania: [
        {
          polecenie: 'Porównanie czy przenośnia?',
          tresc: ['szybki jak strzała', 'las rąk', 'złote serce', 'blady niczym ściana', 'morze łez', 'śpi jak suseł'],
          odpowiedz: ['szybki jak strzała - **porównanie** (jest „jak”)', 'las rąk - **przenośnia** (w klasie nie rośnie las)', 'złote serce - **przenośnia** (to dobry człowiek)', 'blady niczym ściana - **porównanie** (jest „niczym”)', 'morze łez - **przenośnia** (bardzo dużo łez)', 'śpi jak suseł - **porównanie** (jest „jak”)'],
        },
        {
          polecenie: 'Dosłownie czy w przenośni?',
          tresc: ['ciężka torba', 'ciężki dzień', 'kamienny mur', 'kamienna twarz', 'gorąca herbata', 'gorące powitanie'],
          odpowiedz: ['ciężka torba - **dosłownie**', 'ciężki dzień - **w przenośni** (męczący)', 'kamienny mur - **dosłownie**', 'kamienna twarz - **w przenośni** (nie pokazuje uczuć)', 'gorąca herbata - **dosłownie**', 'gorące powitanie - **w przenośni** (serdeczne)'],
        },
        {
          polecenie: 'Co znaczą te przenośnie?',
          tresc: ['złote ręce', 'burza oklasków', 'żelazne nerwy'],
          odpowiedz: ['złote ręce - **wszystko potrafi zrobić i naprawić** (złoto jest cenne)', 'burza oklasków - **bardzo głośne, długie brawa** (burza jest głośna)', 'żelazne nerwy - **zachowuje spokój** (żelazo jest twarde i mocne)'],
        },
        {
          polecenie: 'Zamień porównanie w przenośnię.',
          tresc: ['Liście są jak złote monety.', 'Rosa jest jak perły.', 'Słońce jest jak pomarańczowa piłka.'],
          odpowiedz: ['**złote monety liści**', '**perły rosy**', '**pomarańczowa piłka słońca**'],
          dlaczego: 'Wyrzucamy „jak” i łączymy wyrazy.',
        },
      ],
    },
    {
      tytul: 'Związki frazeologiczne',
      lekcja: 18,
      przypomnij: [
        '**Związek frazeologiczny (frazeologizm)** to stałe połączenie wyrazów. Razem znaczą coś innego niż każdy wyraz osobno: **czuć miętę** = podkochiwać się.',
        '**Nie zmieniamy wyrazów:** czuć miętę, a nie ~~czuć bazylię~~; bułka z masłem, a nie ~~bułka z dżemem~~.',
        '**Nie rozumiemy dosłownie** - inaczej wyjdzie żart, jak u Bartusia, który wąchał dłoń Igi.',
        '**O sercu:** podbić serce (zdobyć sympatię), złamać serce (zranić), wziąć do serca (przejąć się), mieć serce na dłoni (być dobrym).',
        '**O uczuciach:** włosy stanęły dęba (strach), chcieć zapaść się pod ziemię (wstyd), wszystko się w nim gotuje (złość), być w siódmym niebie (radość).',
      ],
      zadania: [
        {
          polecenie: 'Połącz frazeologizm ze znaczeniem.',
          tresc: ['bułka z masłem', 'mieć muchy w nosie', 'trzymać język za zębami', 'rzucać słowa na wiatr'],
          dopisek: '**A.** obiecywać i nie dotrzymywać · **B.** być obrażonym · **C.** coś bardzo łatwego · **D.** nie zdradzić tajemnicy',
          odpowiedz: ['**1 - C** (bułkę z masłem zje każdy)', '**2 - B** (kręci nosem i się dąsa)', '**3 - D** (schowany język nic nie powie)', '**4 - A** (wiatr porywa słowa)'],
        },
        {
          polecenie: 'Uzupełnij frazeologizmami o sercu.',
          tresc: ['Kasia przejęła się uwagą pani. Wzięła ją sobie ……', 'Nowy kolega od razu …… całej klasy.', 'Babcia zawsze pomaga sąsiadom. Ma ……'],
          odpowiedz: ['**do serca**', '**podbił serca**', '**serce na dłoni**'],
        },
        {
          polecenie: 'Jakie uczucie opisuje frazeologizm?',
          tresc: ['Na widok cienia w piwnicy włosy stanęły mu dęba.', 'Gdy wygrała konkurs, była w siódmym niebie.', 'Po tej wpadce chciał zapaść się pod ziemię.', 'Brat znowu zabrał mu ładowarkę - wszystko się w nim gotowało.'],
          odpowiedz: ['**strach**', '**radość**', '**wstyd**', '**złość**'],
        },
        {
          polecenie: 'Ułóż zdanie z frazeologizmem.',
          tresc: ['Wybierz dwa frazeologizmy i ułóż z każdym zdanie.'],
          odpowiedz: ['np. Ola obiecała, że przyjdzie, ale znowu **rzuciła słowa na wiatr**.', 'np. Kuba ma dziś **muchy w nosie**, bo przegrał mecz.'],
          dlaczego: 'Zdanie ma pokazać, że rozumiesz znaczenie.',
        },
      ],
    },
    {
      tytul: 'Zdrobnienia, zgrubienia i siła uczuć',
      lekcja: 19,
      przypomnij: [
        '**Wyraz neutralny** tylko nazywa: pies, dom, nos.',
        '**Zdrobnienie** - coś małego albo czule: piesek, domek, nosek, kotek, mamusia, słoneczko.',
        '**Zgrubienie** - coś dużego, niechęć albo żart: psisko, domisko, nochal, kocur, buciory.',
        'Słowo, które wybierasz, **zdradza uczucia**: „biega piesek” (lubię go), „biega psisko” (jest groźny).',
        '**Uczucia mają siłę:** niepokój ➜ strach ➜ groza; zadowolenie ➜ radość ➜ euforia; przygnębienie ➜ żal ➜ rozpacz.',
      ],
      zadania: [
        {
          polecenie: 'Utwórz zdrobnienia.',
          tresc: ['stół', 'ręka', 'but', 'kwiat', 'ptak'],
          odpowiedz: ['stół - **stolik**', 'ręka - **rączka**', 'but - **bucik**', 'kwiat - **kwiatek**', 'ptak - **ptaszek**'],
          dlaczego: 'Czasem w środku wyrazu coś się zmienia: st==ó==ł - st==o==lik, r==ę==ka - r==ą==czka.',
        },
        {
          polecenie: 'Uzupełnij tabelkę: zdrobnienie - wyraz neutralny - zgrubienie.',
          tresc: ['? - nos - ?', '? - kot - ?', '? - dom - ?'],
          odpowiedz: ['**nosek** - nos - **nochal, nosisko**', '**kotek** - kot - **kocur, kocisko**', '**domek** - dom - **domisko**'],
        },
        {
          polecenie: 'Wypisz wyraz nacechowany i napisz, jakie uczucie pokazuje.',
          tresc: ['Mamusiu, przytul mnie!', 'Zabierz stąd te buciory!', 'Jaki śliczny kotek!', 'Przy furtce warczy wielkie psisko.'],
          odpowiedz: ['**mamusiu** - zdrobnienie, czułość', '**buciory** - zgrubienie, niechęć', '**kotek** - zdrobnienie, czułość', '**psisko** - zgrubienie, niechęć (strach)'],
        },
        {
          polecenie: 'Ułóż od najsłabszego do najsilniejszego.',
          tresc: ['wściekłość · irytacja · złość', 'przerażenie · obawa · strach'],
          odpowiedz: ['**irytacja ➜ złość ➜ wściekłość**', '**obawa ➜ strach ➜ przerażenie**'],
        },
      ],
    },
    {
      tytul: '„Lwy” - co robić ze złością?',
      lekcja: 20,
      przypomnij: [
        'W wierszu Hanny Januszewskiej „Lwy” mówi **chłopiec, który jest zły** (podmiot liryczny).',
        '**Lwy to przenośnia złości** - są groźne, silne, drapieżne. Wieczorem lwy odchodzą = złość mija.',
        '**Złość to normalne uczucie.** Poznasz ją po ciele: zaciśnięte pięści, gorąca twarz, szybki oddech.',
        '**Dobre sposoby:** głęboki oddech, liczenie do 10, ruch, chwila w spokojnym miejscu, rozmowa, przeprosiny. **Złe:** krzyk, bicie, niszczenie rzeczy, obrażanie się.',
        '**Zdanie od „ja”:** zamiast „Ty zawsze…!” mów: „==Jestem zły, bo== wziąłeś moją ładowarkę bez pytania”.',
      ],
      zadania: [
        {
          polecenie: 'Dobry czy zły sposób na złość?',
          tresc: ['trzasnąć drzwiami', 'policzyć do dziesięciu', 'uderzyć brata', 'pobiegać po podwórku', 'powiedzieć „Jestem zły, bo…”', 'obrazić się na tydzień'],
          odpowiedz: ['trzasnąć drzwiami - **zły**', 'policzyć do dziesięciu - **dobry**', 'uderzyć brata - **zły**', 'pobiegać - **dobry** (ruch wypala złość)', '„Jestem zły, bo…” - **dobry**', 'obrazić się na tydzień - **zły** (nic się nie wyjaśni)'],
        },
        {
          polecenie: 'Zamień atak na zdanie od „ja”.',
          tresc: ['„Ty nigdy mnie nie słuchasz!”', '„Zepsułaś mi rysunek, jesteś okropna!”'],
          odpowiedz: ['np. **„Jest mi przykro, kiedy mówię, a ty mnie nie słuchasz.”**', 'np. **„Jestem zła, bo mój rysunek jest zniszczony, a bardzo się starałam.”**'],
          dlaczego: 'W zdaniu jest ja, uczucie i powód - bez wyzwisk.',
        },
      ],
    },
    {
      tytul: 'Rzeczownik',
      lekcja: 22,
      przypomnij: [
        '**Rzeczownik** odpowiada na pytania kto? co? Nazywa też uczucia: radość, strach, przyjaźń.',
        '**Rodzaj** sprawdzam słówkiem ten, ta, to. Liczbę mnogą zamieniam na pojedynczą: psy ➜ ten pies (męski).',
        '**Przypadki i pomocnicy:** M. kto? co? (jest) · D. kogo? czego? (nie ma) · C. komu? czemu? (przyglądam się) · B. kogo? co? (widzę) · N. z kim? z czym? (idę z) · Ms. o kim? o czym? (mówię o) · W. o!',
        '**Pospolity** - nazwa ogólna, mała litera: rzeka, miasto. **Własny** - jedna, konkretna nazwa, wielka litera: Wisła, Kraków, Burek, „Hobbit”.',
      ],
      tabela: {
        naglowki: ['przypadek', 'pytania', 'pomocnik', 'kot', 'mama'],
        wiersze: [
          ['Mianownik', 'kto? co?', 'jest', 'kot', 'mama'],
          ['Dopełniacz', 'kogo? czego?', 'nie ma', 'kota', 'mamy'],
          ['Celownik', 'komu? czemu?', 'przyglądam się', 'kotu', 'mamie'],
          ['Biernik', 'kogo? co?', 'widzę', 'kota', 'mamę'],
          ['Narzędnik', 'z kim? z czym?', 'idę z', 'kotem', 'mamą'],
          ['Miejscownik', 'o kim? o czym?', 'mówię o', 'kocie', 'mamie'],
          ['Wołacz', 'o!', 'wołam', 'kocie!', 'mamo!'],
        ],
      },
      zadania: [
        {
          polecenie: 'Jaki rodzaj? Dopisz ten, ta albo to.',
          tresc: ['plecak', 'tęcza', 'jabłko', 'radość', 'psy', 'drzewa'],
          odpowiedz: ['ten plecak - **męski**', 'ta tęcza - **żeński**', 'to jabłko - **nijaki**', 'ta radość - **żeński**', 'psy ➜ ten pies - **męski**', 'drzewa ➜ to drzewo - **nijaki**'],
        },
        {
          polecenie: 'Odmień rzeczownik „szkoła” przez przypadki.',
          tresc: ['M. jest … · D. nie ma … · C. przyglądam się … · B. widzę … · N. z … · Ms. mówię o … · W. o …!'],
          odpowiedz: ['**szkoła, szkoły, szkole, szkołę, szkołą, szkole, szkoło!**'],
          dlaczego: 'Celownik i miejscownik mają tu tę samą formę (szkole) - rozróżnia je pomocnik.',
        },
        {
          polecenie: 'W jakim przypadku jest wyróżniony rzeczownik?',
          tresc: ['Nie mam __długopisu__.', 'Idę do kina z __bratem__.', 'Myślę o __wakacjach__.', 'Daj __psu__ wody.', 'Widzę __tęczę__.'],
          odpowiedz: ['długopisu - **dopełniacz** (nie ma czego?)', 'bratem - **narzędnik** (z kim?)', 'wakacjach - **miejscownik** (o czym?)', 'psu - **celownik** (komu?)', 'tęczę - **biernik** (widzę co?)'],
        },
        {
          polecenie: 'Popraw - gdzie wielka litera?',
          tresc: ['latem ola i jej pies burek pojechali do gdańska nad bałtyk.', 'w bibliotece wypożyczyłem książkę „dzieci z bullerbyn”.'],
          odpowiedz: ['**L**atem **O**la i jej pies **B**urek pojechali do **G**dańska nad **B**ałtyk.', '**W** bibliotece wypożyczyłem książkę „**D**zieci z **B**ullerbyn”.'],
          dlaczego: 'Początek zdania, imiona (też zwierząt), miasta, morza i tytuły piszemy wielką literą.',
        },
      ],
    },
    {
      tytul: 'Rzeczowniki o nietypowej odmianie',
      lekcja: 23,
      przypomnij: [
        '**Muzeum, akwarium, liceum, centrum** w liczbie pojedynczej się **nie odmieniają**: jestem w ==muzeum== (nie ~~w muzeumie~~), idę do akwarium.',
        'W liczbie mnogiej odmieniają się normalnie: muzea, muzeów, w muzeach.',
        '**Tylko liczba pojedyncza:** powietrze, odzież, młodzież, zazdrość. **Tylko mnoga:** drzwi, sanie, nożyczki, okulary, spodnie, wakacje, imieniny.',
        '**Liczymy tak:** jedne drzwi, dwoje drzwi, troje nożyczek, para spodni.',
        '**Dopełniacz:** nie ma sań, spodni, nożyczek, skrzypiec, imienin.',
      ],
      zadania: [
        {
          polecenie: 'Które zdania są błędne? Popraw je.',
          tresc: ['Byliśmy w muzeumie.', 'Poszliśmy do akwarium.', 'Mieszkam blisko centrumu.', 'W mieście są trzy muzea.', 'Zwiedziliśmy pięć muzeów.'],
          odpowiedz: ['❌ ➜ **w muzeum**', '✅ dobrze', '❌ ➜ **blisko centrum**', '✅ dobrze (liczba mnoga)', '✅ dobrze (liczba mnoga)'],
        },
        {
          polecenie: 'Tylko pojedyncza czy tylko mnoga?',
          tresc: ['powietrze, nożyczki, odzież, wakacje, sanie, młodzież, okulary, zazdrość'],
          odpowiedz: ['tylko pojedyncza: **powietrze, odzież, młodzież, zazdrość**', 'tylko mnoga: **nożyczki, wakacje, sanie, okulary**'],
        },
        {
          polecenie: 'Uzupełnij: jedne, dwoje, troje, pary.',
          tresc: ['Kupiłam …… nożyczki. (1)', 'W klasie jest …… drzwi. (2)', 'Tata ma trzy …… spodni.', 'Zgubiłem …… okulary. (1)'],
          odpowiedz: ['**jedne**', '**dwoje**', '**pary**', '**jedne**'],
        },
        {
          polecenie: 'Dokończ: „Nie ma …”.',
          tresc: ['sanie', 'skrzypce', 'imieniny', 'spodnie'],
          odpowiedz: ['nie ma **sań**', 'nie ma **skrzypiec**', 'nie ma **imienin**', 'nie ma **spodni**'],
        },
      ],
    },
    {
      tytul: 'Ę i ą na końcu wyrazu',
      lekcja: 24,
      przypomnij: [
        '**Widzę kogo? co?** (biernik) ➜ **-ę**: widzę mamę, tęczę, piję kawę, czytam książkę.',
        '**Z kim? z czym?** (narzędnik) ➜ **-ą**: idę z mamą, rozmawiam z koleżanką, jem łyżką.',
        '**Małe istoty** ➜ **-ę**: kocię, szczenię, źrebię, prosię, cielę, pisklę, niemowlę.',
        '**Czasownik:** ja ➜ **-ę** (piszę, robię, niosę), oni / one ➜ **-ą** (piszą, robią, czytają).',
        '**Wyjątki bez ogonka:** wiem, jem, umiem, rozumiem.',
      ],
      zadania: [
        {
          polecenie: 'Ę czy ą? Zadaj pytanie.',
          tresc: ['Widzę babci…', 'Rozmawiam z babci…', 'Jem zupę łyżk…', 'Podaj mi łyżk…', 'Narysuj tęcz…', 'Idę z koleżank…'],
          odpowiedz: ['babci**ę** (widzę kogo?)', 'babci**ą** (z kim?)', 'łyżk**ą** (czym?)', 'łyżk**ę** (podaj co?)', 'tęcz**ę** (narysuj co?)', 'koleżank**ą** (z kim?)'],
        },
        {
          polecenie: 'Napisz formy dla „ja” i „oni”.',
          tresc: ['pisać', 'nieść', 'robić', 'rozumieć (tylko ja)'],
          odpowiedz: ['pisz**ę** - pisz**ą**', 'nios**ę** - nios**ą**', 'robi**ę** - robi**ą**', '**rozumiem** - wyjątek'],
        },
        {
          polecenie: 'Przepisz i uzupełnij końcówki.',
          tresc: ['Oni czyt… bajk… z mam….', 'Ja nios… szczeni… do domu.', 'Dzieci śpiewaj… z pani….', 'Nie wi…, gdzie jest piłka.'],
          odpowiedz: ['Oni czytaj**ą** bajk**ę** z mam**ą**.', 'Ja nios**ę** szczeni**ę** do domu.', 'Dzieci śpiewaj**ą** z pani**ą**.', 'Nie **wiem**, gdzie jest piłka. (wyjątek)'],
        },
      ],
    },
    {
      tytul: 'Temat i końcówka · ó wymienne',
      lekcja: 25,
      przypomnij: [
        '**Temat** to część wyrazu, która zostaje w odmianie; **końcówka** się zmienia: róż|a, róż|y, róż|ą.',
        '**Końcówka zerowa** (ø) - po temacie nic nie ma: kwiat|ø, dom|ø, brat|ø.',
        '**Oboczność** - wymiana głosek w temacie: st==ó==ł - st==o==łu, rę==k==a - rę==c==e, no==g==a - no==dz==e.',
        '**Trik na ó:** jeśli w innej formie słychać o, piszę **ó**: stół, bo stoły; lód, bo lody; róg, bo rogi. Jeśli dalej słychać u - piszę **u**: but, bo buty.',
      ],
      zadania: [
        {
          polecenie: 'Oddziel temat od końcówki.',
          tresc: ['kotem', 'książki', 'okno', 'lasu', 'brat', 'szkołą'],
          odpowiedz: ['kot|**em**', 'książk|**i**', 'okn|**o**', 'las|**u**', 'brat|**ø**', 'szkoł|**ą**'],
        },
        {
          polecenie: 'Uzasadnij pisownię ó.',
          tresc: ['nóż', 'sól', 'dół', 'główka', 'nóżka'],
          odpowiedz: ['nóż, bo **noże**', 'sól, bo **solić**', 'dół, bo **doły**', 'główka, bo **głowa**', 'nóżka, bo **noga**'],
        },
        {
          polecenie: 'U czy ó? Zmień formę i sprawdź.',
          tresc: ['r…g', 'kr…l', 'st…ł', 'b…t', 'dr…t', 'd…ł'],
          odpowiedz: ['r**ó**g, bo rogi', 'kr**ó**l, bo królowa', 'st**ó**ł, bo stoły', 'b**u**t, bo buty', 'dr**u**t, bo druty', 'd**ó**ł, bo doły'],
        },
      ],
    },
    {
      tytul: 'Sprawozdanie',
      lekcja: 26,
      przypomnij: [
        '**Sprawozdanie** to krótka, rzeczowa relacja z prawdziwego wydarzenia. Bez fantazji, bez dialogów, w czasie przeszłym.',
        '**Tytuł** + **wstęp** (kto? co? kiedy? gdzie? dlaczego?) + **rozwinięcie** (przebieg po kolei) + **zakończenie** (krótka opinia).',
        '**Słowa porządkujące:** najpierw, następnie, potem, później, po chwili, na koniec.',
        'Zamiast „poszliśmy”: udaliśmy się, wyruszyliśmy, dotarliśmy. Zamiast „oglądaliśmy”: podziwialiśmy, zwiedzaliśmy.',
        '**Zbędne szczegóły skreślam** (co jadłem na śniadanie, kolor siedzeń w autobusie).',
      ],
      zadania: [
        {
          polecenie: 'Sprawozdanie czy opowiadanie?',
          tresc: ['W piątek nasza klasa pojechała do muzeum.', 'Obraz nagle ożył i mrugnął do mnie.', 'Przewodnik opowiedział nam o historii zamku.', 'Zamieniłem się w rycerza i walczyłem ze smokiem.'],
          odpowiedz: ['**sprawozdanie** (fakt)', '**opowiadanie** (fantazja)', '**sprawozdanie**', '**opowiadanie**'],
        },
        {
          polecenie: 'Do której części pasuje zdanie: wstęp, rozwinięcie czy zakończenie?',
          tresc: ['W środę 15 marca klasa 5a poszła do Teatru Lalek.', 'Najpierw zwiedziliśmy kulisy.', 'Spektakl bardzo mi się podobał.', 'Wyjście zorganizowała pani od polskiego, bo omawiamy baśnie.', 'Potem obejrzeliśmy „Kota w butach”.', 'Polecam ten teatr wszystkim klasom.'],
          odpowiedz: ['**wstęp: 1, 4** · **rozwinięcie: 2, 5** · **zakończenie: 3, 6**'],
        },
        {
          polecenie: 'Uzupełnij słowami: najpierw, następnie, potem, na koniec.',
          tresc: ['…… zwiedziliśmy zamek. …… poszliśmy do muzeum. …… zjedliśmy obiad. …… kupiliśmy pamiątki i wróciliśmy autokarem.'],
          odpowiedz: ['**Najpierw** … **Następnie** … **Potem** … **Na koniec** …'],
        },
      ],
    },
    {
      tytul: 'Dwukropek',
      lekcja: 27,
      przypomnij: [
        '**Przed wyliczeniem:** Do plecaka zapakowałem==:== książki, zeszyty i piórnik.',
        '**Przed czyimiś słowami:** Mama zawołała==:== - Obiad gotowy!',
        '**Przed cytatem** (w cudzysłowie): Trener powiedział==:== „Nigdy się nie poddawajcie”.',
        '**Z „że” na cytat zmieniam osobę:** Ola powiedziała, że jest zmęczona ➜ Ola powiedziała: „Jestem zmęczona”.',
      ],
      zadania: [
        {
          polecenie: 'Wstaw dwukropek.',
          tresc: ['Na urodziny zaprosiłam trzy koleżanki Zosię, Martę i Julię.', 'Tata krzyknął - Uwaga, schody!', 'W sklepie kupiliśmy chleb, mleko i jajka.', 'Babcia zawsze powtarza „Kto rano wstaje, temu Pan Bóg daje”.'],
          odpowiedz: ['koleżanki**:** Zosię… (wyliczenie)', 'krzyknął**:** (czyjeś słowa)', 'kupiliśmy**:** chleb… (wyliczenie)', 'powtarza**:** „…” (cytat)'],
        },
        {
          polecenie: 'Zamień na dwukropek i cytat.',
          tresc: ['Kuba powiedział, że zapomniał zeszytu.', 'Pani oznajmiła, że jutro będzie kartkówka.'],
          odpowiedz: ['Kuba powiedział**: „Zapomniałem zeszytu”.**', 'Pani oznajmiła**: „Jutro będzie kartkówka”.**'],
          dlaczego: 'On zapomniał ➜ ja zapomniałem.',
        },
        {
          polecenie: 'Napisz wstęp sprawozdania z kiermaszu.',
          tresc: ['kto? samorząd uczniowski · co? kiermasz świąteczny · kiedy? środa, 10 grudnia · gdzie? korytarz szkoły · dlaczego? zbiórka dla schroniska'],
          odpowiedz: ['np. **W środę 10 grudnia na korytarzu naszej szkoły samorząd uczniowski zorganizował kiermasz świąteczny, bo zbieraliśmy pieniądze dla schroniska.**'],
        },
      ],
    },
    {
      tytul: 'Tekst reklamowy',
      lekcja: 28,
      przypomnij: [
        '**Tekst reklamowy** namawia do kupna albo skorzystania z usługi. Łac. reclamo = wołać, krzyczeć.',
        '**Informacja** podaje fakty, **reklama** zachwala.',
        '**Słowa z reklam:** nowość, promocja, gratis, najlepszy, super, tylko teraz, taniej, więcej + wykrzykniki i zwroty: kup! spróbuj!',
        '**Sztuczki:** jaskrawe kolory, uśmiechnięci ludzie, znani ludzie, piosenka, rymowane hasło („Mleko pij, zdrowo żyj!”).',
        'Reklama pokazuje **świat piękniejszy niż naprawdę** - najpierw myśl, potem kupuj.',
      ],
      zadania: [
        {
          polecenie: 'Reklama czy informacja?',
          tresc: ['Nowy sok Słoneczko - zdrowie w każdej kropli! Kup teraz!', 'Sklep jest czynny od 8.00 do 20.00.', 'Tylko dziś drugi plecak GRATIS!', 'Biblioteka szkolna jest na pierwszym piętrze.'],
          odpowiedz: ['**reklama**', '**informacja**', '**reklama**', '**informacja**'],
        },
        {
          polecenie: 'Wypisz słowa, które namawiają.',
          tresc: ['NOWOŚĆ! Super Chrupki Kosmos - najlepsze chrupki na świecie! Tylko teraz dwie paczki w cenie jednej! Spróbuj, a pokochasz!'],
          odpowiedz: ['**nowość, super, najlepsze, tylko teraz, dwie w cenie jednej, spróbuj, pokochasz**'],
        },
        {
          polecenie: 'Co obiecuje reklama? Jak jest naprawdę?',
          tresc: ['Buty Rakieta - z nimi wygrasz każdy wyścig!', 'Plecak Geniusz - z nim zawsze dostaniesz szóstkę!'],
          odpowiedz: ['obiecuje **zwycięstwo** - naprawdę trzeba trenować', 'obiecuje **dobre oceny** - naprawdę oceny zależą od nauki'],
        },
      ],
    },
    {
      tytul: 'Recytacja - ściągawka',
      lekcja: 21,
      przypomnij: [
        '**Przygotowanie:** zrozum wiersz (kto mówi? jaki nastrój?) · zaznacz pauzy | i ważne słowa · ucz się po kawałku · ćwicz na głos.',
        '**Głos:** po przecinku krótka pauza, po kropce dłuższa · pytanie - głos w górę · ważne słowo mocniej · tempo do nastroju.',
        '**Postawa:** prosto, tytuł i autor na początku, oddech, wzrok na słuchaczy. Zapomniałeś? Oddech i zwrotka od nowa.',
      ],
      zadania: [],
    },
  ],
};
