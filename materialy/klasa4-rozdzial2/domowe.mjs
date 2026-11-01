// Ćwiczenia do domu przed sprawdzianem - klasa 4, rozdział II „Pośród słów i znaczeń”.
// Link idzie do VULCANA razem z zapowiedzią sprawdzianu: uczeń wypełnia w przeglądarce
// (przycisk „Sprawdź” przy zadaniu) albo drukuje PDF. Typy zadań jak na sprawdzianie,
// ale własne przykłady - inne niż w puli sprawdzianu, filmikach, zeszycie i karcie pracy.
// Generator: node materialy/karta.mjs klasa4-rozdzial2 domowe.mjs
//   -> public/materialy/karty/klasa4-rozdzial2-domowe.html i public/materialy/klasa4-rozdzial2-domowe.pdf
// Znaczniki jak w materialy/klasa4-rozdzial1/karta.mjs; w luce „a / b” = obie odpowiedzi dobre.

export const KARTA = {
  plik: 'klasa4-rozdzial2-domowe',
  domowa: true,
  klasa: 'Klasa 4',
  tytul: 'Poćwicz przed sprawdzianem',
  podtytul: 'Rozdział II',
  wstep: 'Przy każdym temacie najpierw przeczytaj kolorową ramkę z regułą, potem zrób zadania. Wpisuj w luki i klikaj odpowiedzi. Kiedy skończysz zadanie, kliknij **Sprawdź**: zielone jest dobrze, czerwone pokaże poprawną odpowiedź. Na sprawdzianie będą bardzo podobne zadania!',
  tematy: [
    {
      tytul: 'Wyrazy potoczne',
      wiedza: [
        '**Wyrazy potoczne** to słowa „na luzie”: spoko, kumać, obciach. Pasują do rozmowy z kolegami.',
        'Nie używamy ich przy tablicy, w rozmowie z dorosłymi i **w wypracowaniu**. Każdy ma oficjalny odpowiednik: kumać - ==rozumieć==.',
      ],
      zadania: [
        {
          polecenie: 'Zamień wyróżniony wyraz potoczny na oficjalny.',
          linie: [
            'Nie **kumam**, o co chodzi w tym zadaniu. ➜ [[rozumiem|30]]',
            'Siostra **gada** przez telefon cały wieczór. ➜ [[rozmawia|30]]',
            'Ale **obciach**, pomyliłem drzwi! ➜ [[wstyd|30]]',
          ],
        },
        {
          polecenie: 'Podkreśl trzy wyrazy potoczne w wypracowaniu Kuby.',
          linie: ['Na urodzinach u Oli było ((spoko)). Najpierw zjedliśmy tort, a potem ((cisnęliśmy)) w gry do wieczora. Do domu wróciłem ((padnięty)).'],
        },
      ],
    },
    {
      tytul: 'Porównanie',
      wiedza: [
        '**Porównanie** zestawia dwie rzeczy, które są w czymś podobne: oczy błyszczą ==jak gwiazdy==.',
        'Słówka: **jak, jakby, niczym, niby**. Samo „jak” w pytaniu („Jak masz na imię?”) to **nie** porównanie.',
      ],
      zadania: [
        {
          polecenie: 'Czy w zdaniu jest porównanie? Zakreśl.',
          linie: [
            'Lód na stawie błyszczał jak lustro. {{*porównanie|brak porównania}}',
            'Jak długo jedzie się do babci? {{porównanie|*brak porównania}}',
            'Tata chrapał, jakby piłował drewno. {{*porównanie|brak porównania}}',
            'Na stole leży kolorowy obrus. {{porównanie|*brak porównania}}',
          ],
        },
        {
          polecenie: 'Dokończ porównania.',
          kolumny: 2,
          linie: ['uparty jak [[osioł|24]]', 'dumny jak [[paw|24]]', 'pracowity jak [[pszczoła / mrówka|24]]', 'biały jak [[śnieg|24]]'],
        },
      ],
    },
    {
      tytul: 'Synonimy i antonimy',
      wiedza: [
        '**Synonimy** mają podobne znaczenie: krzyczeć - wrzeszczeć.',
        '**Antonimy** mają przeciwne znaczenie: ciężki - lekki.',
      ],
      zadania: [
        {
          polecenie: 'Synonimy czy antonimy? Zakreśl.',
          linie: [
            'krzyczeć - wrzeszczeć {{*synonimy|antonimy}}',
            'zgubić - znaleźć {{synonimy|*antonimy}}',
            'rozmawiać - gawędzić {{*synonimy|antonimy}}',
            'tchórzliwy - odważny {{synonimy|*antonimy}}',
          ],
        },
        {
          polecenie: 'Dopisz synonim i antonim.',
          tabela: {
            naglowki: ['wyraz', 'synonim', 'antonim'],
            wiersze: [
              ['**zimny**', '[[np. chłodny|28]]', '[[ciepły / gorący|28]]'],
              ['**duży**', '[[np. wielki|28]]', '[[mały|28]]'],
              ['**radość**', '[[np. wesołość|28]]', '[[smutek|28]]'],
            ],
          },
        },
      ],
    },
    {
      tytul: 'List',
      wiedza: [
        'Po kolei: **miejscowość i data** · **nagłówek** · wstęp · rozwinięcie · zakończenie · **pozdrowienia** · **podpis**.',
        '**Ty, Ciebie, Ci, Tobie, Twój** - wielką literą. **ja, mnie, mój** - małą.',
      ],
      zadania: [
        {
          polecenie: 'Ponumeruj części listu po kolei.',
          kolumny: 2,
          linie: ['[[6|8]] pozdrowienia', '[[2|8]] nagłówek', '[[4|8]] rozwinięcie', '[[1|8]] miejscowość i data', '[[7|8]] podpis', '[[3|8]] wstęp', '[[5|8]] zakończenie'],
        },
        {
          polecenie: 'Wpisz wyrazy z nawiasów poprawną literą.',
          linie: [
            'Bardzo [[Ci|12]] (ty) dziękuję za paczkę. Książka od [[Ciebie|18]] (ty) jest super!',
            'Jutro pokażę ją [[mojej|16]] (moja) siostrze. Czy [[Twoja|16]] (twoja) mama już wróciła?',
          ],
        },
      ],
    },
    {
      tytul: 'Rzeczownik',
      wiedza: [
        '**Rzeczownik** odpowiada na pytania **kto? co?** Nazywa osoby, zwierzęta, rzeczy, rośliny, zjawiska, miejsca i uczucia (radość).',
        'Rodzaj: **ten** - męski, **ta** - żeński, **to** - nijaki.',
      ],
      zadania: [
        {
          polecenie: 'Podkreśl rzeczowniki (jest ich pięć).',
          linie: ['Mała ((wiewiórka)) schowała ((orzechy)) pod starym ((dębem)), a jej ((radość)) z ((zapasów)) trwała długo.'],
        },
        {
          polecenie: 'Dopisz ten, ta albo to i nazwij rodzaj.',
          tabela: {
            naglowki: ['rzeczownik', 'ten / ta / to', 'rodzaj'],
            wiersze: [
              ['**koc**', '[[ten|16]]', '[[męski|24]]'],
              ['**kość**', '[[ta|16]]', '[[żeński|24]]'],
              ['**cielę**', '[[to|16]]', '[[nijaki|24]]'],
              ['**ból**', '[[ten|16]]', '[[męski|24]]'],
            ],
          },
        },
      ],
    },
    {
      tytul: 'Przypadki',
      wiedza: [
        '**M** kto? co? · **D** kogo? czego? (nie ma) · **C** komu? czemu? · **B** kogo? co? (widzę) · **N** z kim? z czym? · **Ms** o kim? o czym? · **W** o!',
        'Jak rozpoznać? Zadaj pytanie od czasownika: Boję się (kogo? czego?) ==burzy== - dopełniacz.',
      ],
      zadania: [
        {
          polecenie: 'W jakim przypadku jest podkreślony wyraz? Wpisz skrót.',
          kolumny: 2,
          linie: [
            '[[D|9]] Boję się __burzy__.',
            '[[C|9]] Ufam __przyjacielowi__.',
            '[[B|9]] Czytam __komiks__.',
            '[[N|9]] Jeżdżę __tramwajem__.',
            '[[Ms|9]] Mieszkam w __Krakowie__.',
            '[[M|9]] Za oknem śpiewa __kos__.',
          ],
        },
        {
          polecenie: 'Odmień rzeczowniki przez przypadki.',
          tabela: {
            naglowki: ['przypadek', 'chomik', 'książka'],
            wiersze: [
              ['**M** (jest)', 'chomik', 'książka'],
              ['**D** (nie ma)', '[[chomika|24]]', '[[książki|24]]'],
              ['**C** (przyglądam się)', '[[chomikowi|24]]', '[[książce|24]]'],
              ['**B** (widzę)', '[[chomika|24]]', '[[książkę|24]]'],
              ['**N** (z)', '[[chomikiem|24]]', '[[książką|24]]'],
              ['**Ms** (o)', '[[chomiku|24]]', '[[książce|24]]'],
              ['**W** (o!)', '[[chomiku!|24]]', '[[książko!|24]]'],
            ],
          },
        },
      ],
    },
    {
      tytul: 'Trudne formy i wołacz',
      wiedza: [
        'W dopełniaczu liczby mnogiej często **nie ma końcówki**: nie mam ==kredek== (nie: kredków).',
        'Wołaczem **zwracamy się** do kogoś: Ania ➜ ==Aniu==! Tomek ➜ ==Tomku==!',
      ],
      zadania: [
        {
          polecenie: 'Popraw źle odmieniony wyraz.',
          linie: [
            'Nie mam już kolorowych kredków. ➜ [[kredek|26]]',
            'Kupiłem kilo truskawków. ➜ [[truskawek|26]]',
            'W autobusie było dużo ludziów. ➜ [[ludzi|26]]',
          ],
        },
        {
          polecenie: 'Zawołaj poprawnie.',
          kolumny: 2,
          linie: ['Ania ➜ [[Aniu!|22]]', 'Tomek ➜ [[Tomku!|22]]', 'dziadek ➜ [[dziadku!|22]]', 'ciocia ➜ [[ciociu!|22]]', 'Paweł ➜ [[Pawle!|22]]', 'pani Basia ➜ [[pani Basiu!|26]]'],
        },
      ],
    },
    {
      tytul: 'Fakt, opinia, argument',
      wiedza: [
        '**Fakt** można sprawdzić. **Opinia** to czyjeś zdanie - ktoś może myśleć inaczej.',
        '**Argument** mówi, dlaczego tak myślę: ...==ponieważ== / ==bo== ... „Bo tak” to nie argument.',
      ],
      zadania: [
        {
          polecenie: 'Fakt czy opinia? Zakreśl.',
          linie: [
            'Wieloryb jest ssakiem. {{*fakt|opinia}}',
            'Piłka nożna to najciekawszy sport. {{fakt|*opinia}}',
            'Polska leży w Europie. {{*fakt|opinia}}',
            'Szkoła powinna zaczynać się później. {{fakt|*opinia}}',
          ],
        },
        {
          polecenie: 'Dokończ zdanie, podając argument.',
          linie: ['Na przerwach powinniśmy wychodzić na boisko, ponieważ [[np. ruch na świeżym powietrzu dodaje energii do nauki|90]]'],
        },
      ],
    },
    {
      tytul: 'Asertywność',
      wiedza: [
        '**Asertywnie** to spokojnie i bez obrażania: mówię „nie”, mówię **dlaczego** i proponuję coś innego.',
        'Wzór: **Nie, bo... Ale mogę...**',
      ],
      zadania: [
        {
          polecenie: 'Kolega chce, żebyś zamiast niego sprzątnął po plastyce. Zakreśl odpowiedź asertywną.',
          linie: ['{{„Sam sprzątaj, leniu!”|„No dobra...”|*„Nie, bo każdy sprząta po sobie. Ale mogę ci pomóc z pędzlami.”}}'],
        },
        {
          polecenie: 'Odmów asertywnie: koleżanka chce pożyczyć twój nowy piórnik na cały tydzień.',
          pisanie: 2,
          wzor: 'np. Nie, bo piórnik jest mi potrzebny na każdej lekcji. Ale mogę ci pożyczyć długopis na dzisiaj.',
        },
      ],
    },
    {
      tytul: 'Wielka czy mała litera?',
      wiedza: [
        '**Wielką**: imiona i nazwiska, imiona zwierząt (Azor), miasta, państwa, rzeki, jeziora, góry, planety.',
        '**Małą**: nazwy pospolite (pies, rzeka, jezioro), dni tygodnia i miesiące.',
      ],
      zadania: [
        {
          polecenie: 'Zakreśl poprawny zapis.',
          kolumny: 2,
          linie: ['{{*Bałtyk|bałtyk}}', '{{Poniedziałek|*poniedziałek}}', '{{*Saturn|saturn}}', '{{Listopad|*listopad}}', '{{*Hiszpania|hiszpania}}', '{{Rzeka|*rzeka}} Warta'],
        },
        {
          polecenie: 'Znajdź trzy błędy i wypisz te wyrazy poprawnie.',
          linie: ['W lipcu kuba z psem azorem pojechał nad jezioro śniardwy.', '➜ [[Kuba, Azorem, Śniardwy|90]]'],
        },
      ],
    },
    {
      tytul: '„Nie” z rzeczownikami',
      wiedza: [
        '**Nie** z rzeczownikiem (kto? co?) piszemy **razem**: nieszczęście.',
        '**Nie** z czasownikiem (co robi?) piszemy **osobno**: nie rozumiem.',
      ],
      zadania: [
        {
          polecenie: 'Zapisz poprawnie: razem czy osobno?',
          kolumny: 2,
          linie: [
            '(nie)szczęście ➜ [[nieszczęście|28]]',
            '(nie)rozumiem ➜ [[nie rozumiem|28]]',
            '(nie)ład ➜ [[nieład|28]]',
            '(nie)skacz ➜ [[nie skacz|28]]',
            '(nie)przyjaciel ➜ [[nieprzyjaciel|28]]',
            '(nie)bój się ➜ [[nie bój się|28]]',
          ],
        },
        {
          polecenie: 'Zakreśl dobry zapis.',
          linie: [
            'Przez {{*nieuwagę|nie uwagę}} rozlałem sok.',
            'Tata {{niezdążył|*nie zdążył}} na pociąg.',
            'To było zwykłe {{*nieporozumienie|nie porozumienie}}.',
          ],
        },
      ],
    },
  ],
};
