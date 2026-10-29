// Slajdy "na caly ekran" do odpowiedzi w arkuszach wyrownawczych (projektor).
// Klucz: numer arkusza -> numer zadania. Tylko tam, gdzie obrazek naprawde cos tlumaczy.
//
// Typy:
//   para     wiersze [lewy] --lacznik--> [prawy] (przyczyna i skutek, cecha i dowod, ja -> on)
//   czasy    os czasu: przeszly / terazniejszy / przyszly, `tag` wyroznia odpowiedz
//   kolumny  grupy z opisem (fakt/opinia, P/F/?, e/a), `ok` wyroznia element
//   kroki    kolejnosc ze strzalkami; `alfabet` podswietla pierwsze litery
//   tabela   naglowki + wiersze
//   wybor    dobry zapis obok skreslonego, z wyjasnieniem
//   mapa     srodek i galezie (rodzina wyrazow, dowody)
//   sylaby   wyraz podzielony na sylaby, samogloski na kolor
//   notatka  kartka z zeszytu: tytul i punkty
//   zdanie   zdanie ze znacznikami [wyraz|klasa|etykieta] i legenda
// W tekstach: ==zaznaczenie==, **pogrubienie**, ~~skreslenie~~, [wyraz|klasa|etykieta].
// Klasy znacznikow: p (podkreslenie), o (otoczenie), f (falista), h (zaznaczenie), k (znak).

const PRZYCZYNA = 'PRZYCZYNA';
const SKUTEK = 'SKUTEK';
const PF_KOLUMNY = (p, f, q) => [
  ...(p.length ? [{ tytul: 'P', opis: 'prawda - tekst tak mówi', kolor: 'zielony', items: p }] : []),
  { tytul: 'F', opis: 'fałsz - tekst mówi inaczej', kolor: 'czerwony', items: f },
  ...(q ? [{ tytul: '?', opis: 'tekst o tym nie mówi', kolor: 'szary', items: q }] : []),
];

export const WIZUALIZACJE = {
  1: {
    3: {
      typ: 'kroki', tytul: 'Kolejność wydarzeń',
      items: [
        { t: 'Dzieci przyniosły własne wyroby.' },
        { t: 'Uczniowie połączyli dwie ławki.' },
        { t: 'Sprzedały się zakładki.' },
        { t: 'Klasa zebrała pieniądze na książki.' },
      ],
      dopisek: 'W zadaniu: **2, 3, 1, 4**',
      zapamietaj: 'Kolejność zdradzają słowa: **najpierw, potem, następnego dnia, pod koniec**.',
    },
    7: {
      typ: 'zdanie', tytul: 'Rzeczownik',
      tekst: 'W [piątek|p] [klasa|p] IV a miała przygotować [stoisko|p] na szkolny [kiermasz|p].',
      legenda: [{ klasa: 'p', nazwa: 'rzeczownik', pytanie: 'kto? co?' }],
      zapamietaj: 'Rzeczownik nazywa osoby, zwierzęta, rzeczy i zjawiska. Odpowiada na pytania **kto? co?**',
    },
    9: {
      typ: 'kroki', tytul: 'Kolejność alfabetyczna', alfabet: true,
      items: [{ t: 'figurka' }, { t: 'obrus' }, { t: 'stoisko' }, { t: 'zakładka' }],
      zapamietaj: 'Patrzymy na **pierwszą literę**. Gdy jest taka sama - na drugą.',
    },
    10: {
      typ: 'para', tytul: 'Łączymy zdania wyrazem ponieważ',
      wiersze: [{ lewy: [SKUTEK, 'Uczniowie byli dumni.'], lacznik: 'ponieważ', prawy: [PRZYCZYNA, 'Wspólnie rozwiązali problem.'] }],
      wynik: 'Uczniowie byli dumni[,|k] **ponieważ** wspólnie rozwiązali problem.',
      zapamietaj: 'Po **ponieważ** stoi przyczyna. Przed ponieważ stawiamy **przecinek**.',
    },
    11: {
      typ: 'zdanie', tytul: 'Wielka litera i znak na końcu',
      przed: 'było: ~~czy sara przygotowała ceny~~',
      tekst: '[C|k]zy [S|k]ara przygotowała ceny[?|k]',
      zapamietaj: 'Zdanie i imię zaczynamy **wielką literą**. Pytanie kończymy **pytajnikiem**.',
    },
    12: {
      typ: 'kolumny', tytul: 'Co musi mieć zaproszenie?',
      kolumny: [
        { tytul: 'Na co?', items: [{ t: 'Zapraszam Cię na szkolny kiermasz!' }] },
        { tytul: 'Gdzie?', items: [{ t: 'w sali 12' }] },
        { tytul: 'Kiedy?', items: [{ t: 'w sobotę o 10.00' }] },
        { tytul: 'Zachęta', items: [{ t: 'Będą zakładki i figurki!' }] },
      ],
      zapamietaj: 'Sprawdź, czy odbiorca wie: **na co, gdzie i kiedy** ma przyjść.',
    },
  },
  2: {
    3: {
      typ: 'para', tytul: 'Przyczyna i skutek',
      wiersze: [{ lewy: [PRZYCZYNA, 'Kuba przypomniał sobie o szafce z ponumerowanymi szufladami.'], lacznik: 'dlatego', prawy: [SKUTEK, 'Klucz otworzył siódmą szufladę.'] }],
      zapamietaj: 'Przyczyna odpowiada na pytanie **dlaczego?**',
    },
    4: {
      typ: 'kolumny', tytul: 'Prawda czy fałsz?',
      kolumny: PF_KOLUMNY(
        [{ t: 'Nauczycielka szukała zapasowego klucza.' }, { t: 'Uczniowie wykorzystali przyrządy na lekcji.' }],
        [{ t: 'Klucz miał kwadratową zawieszkę.', uw: 'w tekście: okrągłą' }],
      ),
      zapamietaj: 'Zanim zaznaczysz, **znajdź zdanie w tekście**.',
    },
    5: {
      typ: 'para', tytul: 'Cecha i dowód',
      wiersze: [{ lewy: ['CECHA', 'Maja jest uczciwa.'], lacznik: 'bo', prawy: ['DOWÓD Z TEKSTU', 'Zaniosła znaleziony klucz do sekretariatu.'] }],
      zapamietaj: 'Cecha mówi, **jaka** jest postać. Dowód mówi, **co zrobiła**.',
    },
    7: {
      typ: 'zdanie', tytul: 'Części mowy',
      tekst: '[Maja|p] [znalazła|o] [mały|f] [klucz|p].',
      legenda: [
        { klasa: 'p', nazwa: 'rzeczownik', pytanie: 'kto? co?' },
        { klasa: 'o', nazwa: 'czasownik', pytanie: 'co robi?' },
        { klasa: 'f', nazwa: 'przymiotnik', pytanie: 'jaki?' },
      ],
      zapamietaj: 'Zadaj pytanie do wyrazu - pytanie podpowiada część mowy.',
    },
    8: {
      typ: 'tabela', tytul: 'Liczba mnoga',
      naglowki: ['jeden (ten, ta)', 'wiele (te)'],
      wiersze: [['klucz', '==klucze=='], ['szuflada', '==szuflady=='], ['kamień', '==kamienie==']],
      zapamietaj: 'Liczba mnoga - gdy jest **więcej niż jeden**. Pomaga słowo **te**.',
    },
    9: {
      typ: 'wybor', tytul: 'Poprawny zapis',
      wiersze: [
        { dobrze: 'drużyna', zle: 'drurzyna', czemu: 'ż, bo druh (h wymienia się na ż)' },
        { dobrze: 'korytarz', zle: 'korytasz', czemu: 'na końcu wyrazu -arz piszemy rz' },
        { dobrze: 'mosiężny', zle: 'mosienżny', czemu: 'ę, bo mosiądz (ą wymienia się na ę)' },
      ],
      zapamietaj: 'Szukaj **wyrazu pokrewnego** - podpowiada pisownię.',
    },
    10: {
      typ: 'mapa', tytul: 'Rodzina wyrazu',
      srodek: 'klucz', galezie: ['kluczyk', 'kluczowy', 'klucznik'],
      zapamietaj: 'Wyrazy pokrewne mają **wspólną część** i są ze sobą związane znaczeniem.',
    },
    11: {
      typ: 'zdanie', tytul: 'Rozwijamy zdanie',
      tekst: '[Wczoraj rano|h|kiedy?] Maja znalazła klucz [na szkolnym korytarzu|h|gdzie?].',
      zapamietaj: 'Zdanie rozwijamy, odpowiadając na pytania: **kiedy? gdzie? jaki? jak?**',
    },
  },
  3: {
    4: {
      typ: 'para', tytul: 'Przyczyna i skutek',
      wiersze: [{ lewy: [PRZYCZYNA, 'Ktoś kładzie się bardzo późno.'], lacznik: 'dlatego', prawy: [SKUTEK, 'Rano jest senny, rozdrażniony i mniej skupiony.'] }],
      wynik: 'Ktoś kładzie się bardzo późno[,|k] **dlatego** rano może być senny.',
      zapamietaj: '**Przyczyna** - to, co dzieje się najpierw (dlaczego?). **Skutek** - to, co z tego wynika. Łączą je: dlatego, więc, bo, ponieważ.',
    },
    6: {
      typ: 'kolumny', tytul: 'Fakt czy opinia?',
      kolumny: [
        { tytul: 'FAKT', opis: 'można sprawdzić, dla każdego taki sam', kolor: 'niebieski', items: [{ t: 'Dzieci potrzebują więcej snu niż dorośli.' }] },
        { tytul: 'OPINIA', opis: 'czyjeś zdanie, ocena', kolor: 'pomaranczowy', items: [{ t: 'Spokojny wieczór jest ==najlepszą== częścią dnia.', ok: true }] },
      ],
      zapamietaj: 'Opinię zdradzają oceny: **najlepszy, ładny, nudny, wspaniały**.',
    },
    7: {
      typ: 'zdanie', tytul: 'Czasownik',
      tekst: 'Jeśli ktoś [kładzie się|o] bardzo późno, rano [może|o] [być|o] senny.',
      legenda: [{ klasa: 'o', nazwa: 'czasownik', pytanie: 'co robi? co się z nim dzieje?' }],
      zapamietaj: 'Czasownik mówi, **co ktoś robi** albo **co się z nim dzieje**.',
    },
    8: {
      typ: 'czasy', tytul: 'Czasy czasownika',
      items: [
        { nazwa: 'przeszły', kiedy: 'wczoraj', opis: 'to, co już się wydarzyło', przyklad: 'Mózg ==porządkował== informacje.', tag: 'odpowiedź' },
        { nazwa: 'teraźniejszy', kiedy: 'teraz', opis: 'to, co dzieje się teraz', przyklad: 'Mózg ==porządkuje== informacje.', tag: 'w zadaniu' },
        { nazwa: 'przyszły', kiedy: 'jutro', opis: 'to, co dopiero się wydarzy', przyklad: 'Mózg ==będzie porządkował== informacje.' },
      ],
      zapamietaj: 'Czas przeszły często poznasz po **-ł-**: porządkował, spała, czytali.',
    },
    9: {
      typ: 'wybor', tytul: 'Poprawny zapis',
      wiersze: [
        { dobrze: 'mózg', zle: 'musk', czemu: 'ó i g - zapamiętaj (mózgu, mózgi)' },
        { dobrze: 'późno', zle: 'puźno', czemu: 'ó - zapamiętaj (późny, później)' },
        { dobrze: 'przygotować', zle: 'pszygotować', czemu: 'po p piszemy rz' },
      ],
      zapamietaj: 'Po **p, b, t, d, k, g, ch, j, w** piszemy zwykle **rz**.',
    },
    10: {
      typ: 'kolumny', tytul: 'Rodzaje zdań',
      kolumny: [
        { tytul: 'oznajmujące', znak: '.', opis: 'coś stwierdza', kolor: 'niebieski', items: [{ t: 'Po dobrym śnie łatwiej się uczę.' }] },
        { tytul: 'pytające', znak: '?', opis: 'o coś pyta', kolor: 'pomaranczowy', items: [{ t: 'Ile godzin śpisz w nocy?' }] },
      ],
      zapamietaj: 'Zdanie oznajmujące kończy **kropka**, pytające - **pytajnik**.',
    },
    11: {
      typ: 'sylaby', tytul: 'Sylaby i samogłoski',
      sylaby: ['wy', 'po', 'czę', 'ty'],
      zapamietaj: 'W każdej sylabie jest **jedna samogłoska**: a, ą, e, ę, i, o, ó, u, y.',
    },
    12: {
      typ: 'notatka', tytul: 'Notatka punktowa',
      kartka: 'Mój sposób na dobry wieczór',
      punkty: ['Odkładam telefon.', 'Pakuję plecak na jutro.', 'Wietrzę pokój i kładę się o stałej porze.'],
      zapamietaj: 'Notatka punktowa: **tytuł**, **numery**, w każdym punkcie **jedna krótka myśl**.',
    },
  },
  4: {
    3: {
      typ: 'kroki', tytul: 'Plan drogi',
      items: [{ t: 'brama' }, { t: 'fontanna', hl: true }, { t: 'dwie ławki' }, { t: 'mały mostek', hl: true }, { t: 'tablica z wiewiórką' }, { t: 'stary dąb' }],
      zapamietaj: 'Plan drogi to miejsca **po kolei** - tak, jak je mijamy.',
    },
    4: {
      typ: 'para', tytul: 'Przyczyna i skutek',
      wiersze: [{ lewy: [PRZYCZYNA, 'Tomek chciał skręcić w złą stronę.'], lacznik: 'dlatego', prawy: [SKUTEK, 'Maja ponownie przeczytała instrukcję.'] }],
      zapamietaj: 'Pytanie **dlaczego?** to pytanie o przyczynę.',
    },
    5: {
      typ: 'para', tytul: 'Umiejętność i dowód',
      wiersze: [{ lewy: ['UMIEJĘTNOŚĆ', 'uważne czytanie'], lacznik: 'bo', prawy: ['DOWÓD Z TEKSTU', 'Maja ponownie przeczytała instrukcję i wskazała właściwą drogę.'] }],
      zapamietaj: 'Dowód to **fragment tekstu**, który potwierdza odpowiedź.',
    },
    7: {
      typ: 'tabela', tytul: 'Przymiotnik',
      naglowki: ['rzeczownik', 'pytanie', 'przymiotnik'],
      wiersze: [['dąb', 'jaki?', '==stary=='], ['alejka', 'jaka?', '==szeroka=='], ['instrukcja', 'jaka?', '==krótka==']],
      zapamietaj: 'Przymiotnik mówi, **jaki** jest ktoś albo coś.',
    },
    8: {
      typ: 'kroki', tytul: 'Kolejność alfabetyczna', alfabet: true,
      items: [{ t: 'brama' }, { t: 'dąb' }, { t: 'fontanna' }, { t: 'mostek' }],
      zapamietaj: 'Patrzymy na **pierwszą literę**. Gdy jest taka sama - na drugą.',
    },
    9: {
      typ: 'wybor', tytul: 'Poprawny zapis',
      wiersze: [
        { dobrze: 'drużyna', zle: 'drurzyna', czemu: 'ż, bo druh (h wymienia się na ż)' },
        { dobrze: 'ścieżka', zle: 'ścieszka', czemu: 'ż - zapamiętaj (ścieżki)' },
        { dobrze: 'wiewiórka', zle: 'wiewjurka', czemu: 'wiewiórka - zapamiętaj' },
      ],
      zapamietaj: 'Gdy nie ma reguły - sprawdź w słowniku i **zapamiętaj**.',
    },
    10: {
      typ: 'para', tytul: 'Polecenie i prośba',
      wiersze: [{ lewy: ['POLECENIE', 'Idź prosto do fontanny.'], lacznik: 'grzeczniej', prawy: ['PROŚBA', '==Proszę==, idź prosto do fontanny.'] }],
      zapamietaj: 'Prośbę tworzą słowa: **proszę, czy możesz, bądź tak miły**.',
    },
    12: {
      typ: 'kolumny', tytul: 'Określenia kierunku',
      kolumny: [
        { tytul: '↑', opis: 'prosto', items: [] },
        { tytul: '←', opis: 'w lewo', items: [] },
        { tytul: '→', opis: 'w prawo', items: [] },
        { tytul: '↷', opis: 'obok, za, przed', items: [] },
      ],
      zapamietaj: 'Instrukcja: **kolejne kroki**, każdy z kierunkiem i miejscem.',
    },
  },
  5: {
    2: {
      typ: 'para', tytul: 'Zachowanie zdradza uczucia',
      wiersze: [{ lewy: ['CO ROBI?', 'Przez całą lekcję rysuje kwadraty, nie słucha.'], lacznik: 'czyli', prawy: ['CO CZUJE?', 'Jest rozczarowany i smutny.'] }],
      zapamietaj: 'Gdy tekst nie nazywa uczuć, **wnioskuj z zachowania**.',
    },
    4: {
      typ: 'kolumny', tytul: 'P, F czy ?',
      kolumny: PF_KOLUMNY(
        [{ t: 'Iga podziwia, jak Antek rysuje ruch.' }],
        [{ t: 'Antek i Iga chodzą do tej samej klasy.', uw: 'Iga jest z równoległej klasy' }],
        [{ t: 'Iga rysuje komiksy dłużej niż Antek.' }],
      ),
      zapamietaj: '**F** - tekst mówi coś innego. **?** - tekst w ogóle o tym nie mówi.',
    },
    6: {
      typ: 'kroki', tytul: 'Jak zmienia się nastrój Antka?',
      items: [
        { t: 'rozczarowany, zazdrosny', nr: 'początek' },
        { t: 'Iga pokazuje swoje nieudane szkice', nr: 'zwrot' },
        { t: 'pogodzony, chce współpracować', nr: 'koniec' },
      ],
      zapamietaj: 'Szukaj momentu, **po którym** bohater zaczyna myśleć inaczej.',
    },
    7: {
      typ: 'tabela', tytul: 'Odmiana: komiks',
      naglowki: ['pytanie', 'forma', 'zdanie'],
      wiersze: [
        ['kogo? czego?', '==komiksu==', 'nie było jego komiksu'],
        ['komu? czemu?', '==komiksowi==', 'przyglądał się komiksowi'],
        ['(z) kim? czym?', '==komiksem==', 'zachwyciła się komiksem'],
        ['o kim? o czym?', '==komiksie==', 'rozmawiali o komiksie'],
      ],
      zapamietaj: 'Zadaj **pytanie** od słowa przed luką: nie było (czego?) - komiksu.',
    },
    9: {
      typ: 'zdanie', tytul: 'Przecinek',
      tekst: 'Antek wiedział[,|k] że jego kot dobrze wyszedł[,|k] ale wciąż było mu przykro[,|k] bo marzył o pierwszym miejscu.',
      zapamietaj: 'Przecinek stawiamy przed: **że, ale, bo, ponieważ, który, więc**.',
    },
    10: {
      typ: 'kolumny', tytul: 'Mruknął czy krzyknął?',
      kolumny: [
        { tytul: 'mruknął', opis: 'cicho, niechętnie, pod nosem', kolor: 'niebieski', items: [{ t: 'Antek jest smutny, zamknięty w sobie.' }] },
        { tytul: 'krzyknął', opis: 'głośno, ze złością', kolor: 'czerwony', items: [{ t: 'Antek byłby wściekły, wybuchłby.' }] },
      ],
      zapamietaj: 'Jeden czasownik potrafi **zmienić obraz** postaci.',
    },
    12: {
      typ: 'notatka', tytul: 'Jak zapisać dialog', bezNumerow: true,
      kartka: 'Przykład',
      punkty: ['– Kto zostawił tę kartkę? – zapytała Iga.', '– Ja – odpowiedział cicho Antek.', '– Smok obok kota? Świetny pomysł!'],
      zapamietaj: 'Każda wypowiedź **od nowej linijki** i **od myślnika**.',
    },
  },
  6: {
    1: {
      typ: 'kolumny', tytul: 'Dlaczego ptaki odlatują?',
      kolumny: [
        { tytul: 'Często się sądzi', kolor: 'czerwony', items: [{ t: '~~bo jest im zimno~~' }] },
        { tytul: 'Naprawdę', kolor: 'zielony', items: [{ t: 'bo zimą **brakuje pokarmu**: owadów, żab, dżdżownic', ok: true }] },
      ],
      zapamietaj: 'Autor **prostuje** błędne przekonanie: "Nie robią tego z powodu zimna".',
    },
    2: {
      typ: 'tabela', tytul: 'Porównanie',
      naglowki: ['', 'bocian biały', 'jaskółka dymówka'],
      wiersze: [
        ['budowa', 'ciężki, szerokie skrzydła', 'lekka, zwinna'],
        ['sposób lotu', 'szybuje na ciepłym powietrzu', 'macha skrzydłami'],
        ['lot nad morzem', 'omija morze, leci nad lądem', 'przelatuje nad morzem'],
      ],
      zapamietaj: 'Porównujemy **tę samą cechę** u obu ptaków.',
    },
    3: {
      typ: 'kroki', tytul: 'Łańcuch przyczyn',
      items: [
        { t: 'Bocian jest ciężki.' },
        { t: 'Musi szybować na ciepłym powietrzu.' },
        { t: 'Nad morzem nie ma ciepłych prądów.' },
        { t: 'Leci dłuższą drogą nad lądem.', hl: true },
      ],
      zapamietaj: 'Jedna przyczyna wywołuje skutek, który staje się **kolejną przyczyną**.',
    },
    4: {
      typ: 'kolumny', tytul: 'P, F czy ?',
      kolumny: PF_KOLUMNY(
        [],
        [{ t: 'Bociany odlatują, bo nie znoszą zimna.', uw: 'brakuje im pokarmu' }, { t: 'Młode bociany zawsze lecą z rodzicami.', uw: 'często startują przed dorosłymi' }],
        [{ t: 'Jaskółki żyją dłużej niż bociany.' }],
      ),
      zapamietaj: '**F** - tekst mówi coś innego. **?** - tekst w ogóle o tym nie mówi.',
    },
    7: {
      typ: 'tabela', tytul: 'Od rzeczownika do przymiotnika',
      naglowki: ['rzeczownik', 'przymiotnik (jaki?)'],
      wiersze: [['zima', '==zimowy=='], ['ptak', '==ptasi=='], ['Afryka', '==afrykański== (mała litera!)'], ['morze', '==morski=='], ['słońce', '==słoneczny==']],
      zapamietaj: 'Przymiotniki od nazw krajów i kontynentów piszemy **małą literą**.',
    },
    8: {
      typ: 'tabela', tytul: 'ż, rz czy sz?',
      naglowki: ['wyraz', 'dlaczego?'],
      wiersze: [
        ['==ż==aby', 'zapamiętaj'],
        ['d==ż==d==ż==ownice', 'zapamiętaj'],
        ['p==rz==ewody', 'po p piszemy rz'],
        ['wyru==sz==ają', 'ruszać - słychać sz'],
        ['mo==rz==e', 'bo morski (rz wymienia się na r)'],
        ['==ż==ółty', 'zapamiętaj'],
      ],
      zapamietaj: '**rz** wymienia się na **r** (morze - morski), **ż** na **g, h, z, s** (drużyna - druh).',
    },
    9: {
      typ: 'tabela', tytul: 'Odmiana: ptak',
      naglowki: ['pytanie', 'forma', 'zdanie'],
      wiersze: [
        ['kogo? czego?', '==ptaków==', 'krążyło pięć ptaków'],
        ['komu? czemu?', '==ptakom==', 'przyglądają się ptakom'],
        ['o kim? o czym?', '==ptakach==', 'przeczytałem o ptakach'],
      ],
      zapamietaj: 'Zadaj **pytanie** od słowa przed luką: pięć (kogo? czego?) - ptaków.',
    },
    10: {
      typ: 'para', tytul: 'Więc czy ponieważ?',
      wiersze: [
        { lewy: [PRZYCZYNA, 'Zimą brakuje owadów,'], lacznik: 'więc', prawy: [SKUTEK, 'jaskółki odlatują do Afryki.'] },
        { lewy: [SKUTEK, 'Jaskółki odlatują do Afryki,'], lacznik: 'ponieważ', prawy: [PRZYCZYNA, 'zimą brakuje owadów.'] },
      ],
      zapamietaj: 'Po **więc** jest skutek, po **ponieważ** - przyczyna. Przed obydwoma przecinek.',
    },
    11: {
      typ: 'mapa', tytul: 'Jeden wyraz, wiele znaczeń',
      srodek: 'igła', galezie: ['igła kompasu', 'igła do szycia', 'igła sosny', 'igła strzykawki'],
      zapamietaj: 'Znaczenie wyrazu poznajemy **z całego zdania**.',
    },
  },
  7: {
    1: {
      typ: 'mapa', tytul: 'Kto opowiada?',
      srodek: 'pies', galezie: ['trzyma piłkę w zębach', 'chodzi na spacery', 'obwąchuje krzaki', 'ma miskę', 'zjadł skarpetkę'],
      zapamietaj: 'Narrator nie mówi wprost, kim jest - **zbieraj wskazówki**.',
    },
    2: {
      typ: 'mapa', tytul: 'Kim jest Nowy?',
      srodek: 'niemowlę', galezie: ['jest mały i głośny', 'pachnie mlekiem', 'płacze', 'leży na kocu', 'pierwszy raz się śmieje'],
      zapamietaj: 'Każda wskazówka osobno niewiele mówi. **Razem** dają odpowiedź.',
    },
    4: {
      typ: 'kolumny', tytul: 'P, F czy ?',
      kolumny: PF_KOLUMNY(
        [],
        [{ t: 'Nowy mieszka w domu od trzech dni.', uw: 'od trzech miesięcy' }, { t: 'Pani nakrzyczała na narratora.', uw: 'nikt nie krzyczał, westchnęła' }],
        [{ t: 'Narrator ma na imię Burek.' }],
      ),
      zapamietaj: '**F** - tekst mówi coś innego. **?** - tekst w ogóle o tym nie mówi.',
    },
    7: {
      typ: 'para', tytul: 'Ja czy on?',
      wiersze: [
        { lewy: ['MÓWI PIES (JA)', 'Wcześniej to ja ==byłem== najważniejszy.'], lacznik: '', prawy: ['KTOŚ Z BOKU (ON)', 'Wcześniej to on ==był== najważniejszy.'] },
        { lewy: ['MÓWI PIES (JA)', 'Wczoraj ==zjadłem== skarpetkę.'], lacznik: '', prawy: ['KTOŚ Z BOKU (ON)', 'Wczoraj ==zjadł== skarpetkę.'] },
      ],
      zapamietaj: 'Narrator-bohater mówi **ja**, narrator z boku mówi **on, ona**.',
    },
    8: {
      typ: 'czasy', tytul: 'Osoba, liczba i czas',
      items: [
        { nazwa: 'przeszły', kiedy: 'wczoraj', opis: 'to, co już się wydarzyło', przyklad: '==zjadłem==', extra: 'ja - 1. osoba, liczba pojedyncza' },
        { nazwa: 'teraźniejszy', kiedy: 'teraz', opis: 'to, co dzieje się teraz', przyklad: '==biegną==', extra: 'oni - 3. osoba, liczba mnoga' },
        { nazwa: 'przyszły', kiedy: 'jutro', opis: 'to, co dopiero się wydarzy', przyklad: '==zostanę==', extra: 'ja - 1. osoba, liczba pojedyncza' },
      ],
      zapamietaj: 'Osobę sprawdzisz, dodając **ja, ty, on, my, wy, oni**.',
    },
    10: {
      typ: 'kolumny', tytul: 'ę czy ą?',
      kolumny: [
        { tytul: 'ę', opis: 'widzę (kogo? co?)', kolor: 'niebieski', items: [{ t: 'trzyma piłk==ę==' }, { t: 'rzuca piłk==ę==' }] },
        { tytul: 'ą', opis: 'bawię się (kim? czym?)', kolor: 'pomaranczowy', items: [{ t: 'bawi się piłk==ą==' }, { t: 'przykryła kołdr==ą==' }] },
      ],
      zapamietaj: '**kogo? co?** - piszemy **ę**. **kim? czym?** - piszemy **ą**.',
    },
    11: {
      typ: 'mapa', tytul: 'Nazwij uczucie',
      srodek: 'zazdrość', galezie: ['zazdrosny', 'zazdrościć', 'zazdrośnie'],
      zapamietaj: 'Uczucie to rzeczownik: **zazdrość, radość, smutek**.',
    },
  },
};
