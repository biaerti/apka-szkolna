// Kandydaci do glosowania klasy nad lekturami: okladka, krotki opis do
// przeczytania uczniom z projektora i orientacyjna liczba stron. Okladki leza
// w public/okladki/<klucz>.jpg (352x500, sciagniete z lubimyczytac.pl).
//
// Ten sam tytul moze wystepowac w dwoch katalogach (nowa podstawa dla IV,
// stara dla V) pod roznymi id - dlatego opisy sa pod wlasnym kluczem, a
// KANDYDACI mapuja id z katalogu na klucz.

export interface OpisKandydata {
  klucz: string;
  autor: string;
  tytul: string;
  /** 2-3 zdania dla uczniow: o czym to jest, bez spoilerow. */
  opis: string;
  /** Orientacyjnie, zalezy od wydania. */
  strony: number;
  /** Krotka podpowiedz dla nauczyciela, np. gatunek albo na co uwazac. */
  uwaga?: string;
}

const lista: OpisKandydata[] = [
  {
    klucz: 'do-przerwy',
    autor: 'Adam Bahdaj',
    tytul: 'Do przerwy 0:1',
    opis: 'Warszawskie podwórko, banda chłopaków i drużyna piłkarska „Syrenka”, która nie ma ani boiska, ani butów, ani szans. Mandżaro i jego koledzy wolą kombinować, niż się poddać. Powieść o meczu, przyjaźni i o tym, że wygrywa się nie tylko na boisku.',
    strony: 200,
    uwaga: 'Polska klasyka, piłka nożna - dobrze wchodzi u chłopaków.',
  },
  {
    klucz: 'tajemniczy-ogrod',
    autor: 'Frances Hodgson Burnett',
    tytul: 'Tajemniczy ogród',
    opis: 'Mary, rozpieszczona i nielubiana sierota, trafia do ponurego dworu w Anglii. W nocy słyszy czyjś płacz, a w ogrodzie znajduje zamknięte na klucz drzwi. Historia o tym, jak jedna zaniedbana grządka zmienia trójkę dzieci.',
    strony: 280,
    uwaga: 'Spokojniejsza, dłuższa - lepsza na wiosnę niż na jesień.',
  },
  {
    klucz: 'momo',
    autor: 'Michael Ende',
    tytul: 'Momo',
    opis: 'W ruinach starego amfiteatru mieszka dziewczynka, która potrafi słuchać tak, że ludzie sami znajdują odpowiedzi. Aż do miasta przyjeżdżają Szarzy Panowie i namawiają wszystkich, żeby oszczędzali czas. Momo jako jedyna widzi, kim naprawdę są.',
    strony: 270,
    uwaga: 'Baśń z drugim dnem o czasie i pośpiechu. Autor „Niekończącej się historii”.',
  },
  {
    klucz: 'detektyw-pozytywka',
    autor: 'Grzegorz Kasdepke',
    tytul: 'Detektyw Pozytywka',
    opis: 'Detektyw Pozytywka mieszka w zwykłej kamienicy i rozwiązuje zagadki sąsiadów: kto podjada ciastka, dokąd zniknął kot, dlaczego winda staje. Każda zagadka to osobna historia i czytelnik może ją rozwiązać razem z nim, zanim przewróci stronę.',
    strony: 130,
    uwaga: 'Krótkie rozdziały, humor, łatwa. Dobra na start dla klasy, która mało czyta.',
  },
  {
    klucz: 'skrzynia-wladcy-piorunow',
    autor: 'Marcin Kozioł',
    tytul: 'Skrzynia Władcy Piorunów',
    opis: 'Trójka dzieci na wakacjach w Krakowie trafia na tajemniczą skrzynię, która ma związek z Nikolą Teslą, wynalazcą i „władcą piorunów”. Zaczyna się wyścig z czasem: szyfry, zagadki i ktoś, kto też chce zdobyć skrzynię. Pierwszy tom serii „Detektywi na kółkach”.',
    strony: 300,
    uwaga: 'Przygoda + nauka, jedno z dzieci jeździ na wózku - bez robienia z tego problemu.',
  },
  {
    klucz: 'lew-czarownica',
    autor: 'C.S. Lewis',
    tytul: 'Lew, czarownica i stara szafa',
    opis: 'Czworo rodzeństwa, wojna, wielki dom na wsi i szafa, przez którą wchodzi się do Narnii. Tam trwa wieczna zima bez świąt, rządzi Biała Czarownica, a wszyscy czekają na lwa Aslana. Jedno z dzieci zdradzi resztę.',
    strony: 190,
    uwaga: 'Klasyka fantasy, jest film. Znana wielu uczniom - mniejszy efekt zaskoczenia.',
  },
  {
    klucz: 'ronja',
    autor: 'Astrid Lindgren',
    tytul: 'Ronja, córka zbójnika',
    opis: 'Ronja urodziła się w noc burzy w zamku zbójników, w środku wielkiego lasu pełnego dzikich stworów. Kiedy poznaje Birka, syna wrogiej bandy, musi wybrać między ojcem a przyjacielem. Powieść o lesie, wolności i o tym, jak dzieci godzą dorosłych.',
    strony: 230,
    uwaga: 'Autorka Pippi. Dużo przyrody, mocna bohaterka.',
  },
  {
    klucz: 'magiczne-drzewo',
    autor: 'Andrzej Maleszka',
    tytul: 'Magiczne drzewo. Czerwone krzesło',
    opis: 'Piorun rozbija stary dąb, a z jego drewna ludzie robią setki przedmiotów. Każdy ma magiczną moc. Kuki, Filip i Tosia znajdują czerwone krzesło, które spełnia życzenia - i od razu przekonują się, że życzenia trzeba formułować bardzo ostrożnie.',
    strony: 300,
    uwaga: 'Bardzo lubiana przez klasy IV-V, jest serial i film. Szybka akcja.',
  },
  {
    klucz: 'chlopcy-z-placu-broni',
    autor: 'Ferenc Molnár',
    tytul: 'Chłopcy z Placu Broni',
    opis: 'Budapeszt, ponad sto lat temu. Plac Broni to zwykły pusty plac, ale dla chłopaków to ich państwo. Kiedy chce go zająć banda Czerwonych Koszul, zaczyna się wojna według wszystkich zasad. Najmniejszy z nich, Nemeczek, okaże się najodważniejszy.',
    strony: 200,
    uwaga: 'Klasyka, smutne zakończenie. W nowym przekładzie jako „Chłopaki z ulicy Pawła”.',
  },
  {
    klucz: 'pajaczek',
    autor: 'Ewa Nowak',
    tytul: 'Pajączek na rowerze',
    opis: 'Piotrek ma nowego kolegę w klasie: Mateusza na wózku. Najpierw nie wie, jak z nim rozmawiać, potem zaczynają razem knuć. Powieść o szkole, o pierwszych przyjaźniach i o tym, że „inny” szybko przestaje być inny.',
    strony: 160,
    uwaga: 'Współczesna polska szkoła, lekka, blisko życia czwartoklasisty.',
  },
  {
    klucz: 'cudowny-chlopak',
    autor: 'R.J. Palacio',
    tytul: 'Cudowny chłopak',
    opis: 'August ma dziesięć lat i twarz, na którą ludzie patrzą za długo. Do tej pory uczył się w domu, teraz pierwszy raz idzie do szkoły. Historię opowiada on sam, a potem jego siostra i koledzy - każdy widzi ją trochę inaczej.',
    strony: 400,
    uwaga: 'Gruba, ale krótkie rozdziały. Mocny temat: wygląd, akceptacja, hejt. Jest film.',
  },
  {
    klucz: 'pax',
    autor: 'Sara Pennypacker',
    tytul: 'Pax',
    opis: 'Peter od małego wychowuje lisa Paxa. Kiedy wybucha wojna, ojciec każe zostawić lisa w lesie. Peter ucieka z domu, żeby go odnaleźć, a Pax pierwszy raz w życiu musi poradzić sobie sam. Rozdziały na zmianę: chłopiec i lis.',
    strony: 300,
    uwaga: 'Wzruszająca, o zwierzętach i wojnie. Rozdziały „lisie” pisane z jego perspektywy.',
  },
  {
    klucz: 'tomek-sawyer',
    autor: 'Mark Twain',
    tytul: 'Przygody Tomka Sawyera',
    opis: 'Tomek mieszka nad Missisipi u ciotki Polly i ma talent do kłopotów: wykręca się od malowania płotu, ucieka na wyspę, zakochuje się i przypadkiem zostaje świadkiem zbrodni na cmentarzu. Potem jeszcze jaskinia i skarb.',
    strony: 250,
    uwaga: 'Klasyka, dużo humoru, ale język starszego przekładu bywa trudny.',
  },
  {
    klucz: 'akademia-pana-kleksa',
    autor: 'Jan Brzechwa',
    tytul: 'Akademia Pana Kleksa',
    opis: 'Adaś Niezgódka trafia do szkoły, w której uczy się kleksografii, leczenia chorych sprzętów i przędzenia liter. Pan Kleks rośnie i maleje, karmi się pigułkami na porost włosów, a w murze jest furtka do innych bajek. Ktoś jednak chce zniszczyć akademię.',
    strony: 150,
    uwaga: 'Zwykle czytana w klasie IV - sprawdź, czy klasa już ją miała.',
  },
  {
    klucz: 'kajko-i-kokosz',
    autor: 'Janusz Christa',
    tytul: 'Kajko i Kokosz. Szkoła latania',
    opis: 'Dwaj słowiańscy wojowie, mały sprytny Kajko i duży łakomy Kokosz, bronią Mirmiłowa przed Zbójcerzami. Tym razem Hegemon i Kapral chcą się dostać do grodu drogą powietrzną, a czarownica Jaga otwiera szkołę latania. Komiks.',
    strony: 50,
    uwaga: 'Komiks - jedyny na liście. Szybki, na jedną lekcję czytania.',
  },
  {
    klucz: 'hobbit',
    autor: 'J.R.R. Tolkien',
    tytul: 'Hobbit, czyli tam i z powrotem',
    opis: 'Bilbo Baggins lubi spokój, drugie śniadanie i fotel. Pewnego dnia czarodziej Gandalf i trzynastu krasnoludów wciągają go w wyprawę po skarb strzeżony przez smoka Smauga. Po drodze trolle, gobliny, pająki i Gollum z pierścieniem.',
    strony: 300,
    uwaga: 'Najgrubsza z obowiązkowych. Zwykle w klasie VI - lepiej zostawić na koniec cyklu.',
  },
  {
    klucz: 'kapelusz',
    autor: 'Adam Bahdaj',
    tytul: 'Kapelusz za 100 tysięcy',
    opis: 'Wakacje nad morzem. Dwunastoletnia Ika i jej kolega Groszek znajdują na plaży kapelusz, który komuś bardzo zależy odzyskać. Wciągają w to dziadka, milicjanta i pół miasteczka. Kryminał dla dzieci z lat 70.',
    strony: 180,
    uwaga: 'Klasyczny „kryminał wakacyjny”, jest stary film.',
  },
  {
    klucz: 'lajki-marczuka',
    autor: 'Paweł Beręsewicz',
    tytul: 'Wszystkie lajki Marczuka',
    opis: 'Kuba Marczuk nagrywa filmik, który niechcący staje się hitem. Nagle wszyscy w szkole go znają, a lajki liczy się w tysiącach. Tylko czy prawdziwi znajomi to ci, którzy klikają? Współczesna powieść o sławie w internecie.',
    strony: 190,
    uwaga: 'O internecie i popularności - temat, który klasa zna z własnego życia.',
  },
  {
    klucz: 'felix-net-nika',
    autor: 'Rafał Kosik',
    tytul: 'Felix, Net i Nika oraz Gang Niewidzialnych Ludzi',
    opis: 'Trójka przyjaciół z warszawskiego gimnazjum: Felix majsterkuje, Net programuje, Nika ma zdolności, których nie umie wyjaśnić. Razem trafiają na trop gangu, który okrada mieszkania, i sztucznej inteligencji, która mieszka w komputerze Neta.',
    strony: 400,
    uwaga: 'Gruba, ale uczniowie ją pochłaniają. Pierwszy tom długiej serii.',
  },
  {
    klucz: 'zwiadowcy',
    autor: 'John Flanagan',
    tytul: 'Zwiadowcy. Ruiny Gorlanu',
    opis: 'Will jest za mały na rycerza, więc trafia na naukę do Halta - zwiadowcy, cichego łucznika, którego wszyscy się boją. Uczy się tropić, strzelać i znikać w cieniu. Tymczasem na królestwo szykuje się dawny wróg i jego bestie.',
    strony: 300,
    uwaga: 'Fantasy przygodowe, bardzo lubiane. Pierwszy z kilkunastu tomów.',
  },
  {
    klucz: 'percy-jackson',
    autor: 'Rick Riordan',
    tytul: 'Percy Jackson. Złodziej pioruna',
    opis: 'Percy ma dysleksję, ADHD i wylatuje z kolejnej szkoły. Okazuje się, że jest synem Posejdona, a greccy bogowie żyją w Nowym Jorku. Ktoś ukradł piorun Zeusa i wszyscy myślą, że to on. Ma dziesięć dni, żeby go odzyskać.',
    strony: 400,
    uwaga: 'Świetnie łączy się z mitami greckimi z podstawy. Humor, szybka akcja.',
  },
  {
    klucz: 'most-do-terabithii',
    autor: 'Katherine Paterson',
    tytul: 'Most do Terabithii',
    opis: 'Jess chce być najszybszy w klasie, a wyprzedza go nowa dziewczyna, Leslie. Zostają przyjaciółmi i w lesie za strumieniem budują własne królestwo - Terabithię. Powieść o wyobraźni, przyjaźni i o stracie.',
    strony: 200,
    uwaga: 'Uwaga: bardzo smutne zakończenie. Trzeba być gotowym na rozmowę.',
  },
  {
    klucz: 'sposob-na-alcybiadesa',
    autor: 'Edmund Niziurski',
    tytul: 'Sposób na Alcybiadesa',
    opis: 'Uczniowie klasy ósmej kupują od starszych kolegów „sposób” na nauczyciela historii, Alcybiadesa. Plan jest prosty: udawać zainteresowanie. Problem w tym, że historia zaczyna ich naprawdę wciągać. Komedia szkolna z lat 60.',
    strony: 250,
    uwaga: 'Humor i szkolne realia sprzed lat - część słów trzeba tłumaczyć.',
  },
  {
    klucz: 'ania',
    autor: 'Lucy Maud Montgomery',
    tytul: 'Ania z Zielonego Wzgórza',
    opis: 'Rodzeństwo Cuthbertów chciało adoptować chłopca do pomocy na farmie, a przyjechała ruda, gadatliwa Ania. Kanada, mała wieś Avonlea, szkoła, przyjaciółka Diana i Gilbert, którego Ania nie zamierza nigdy przeprosić.',
    strony: 350,
    uwaga: 'Klasyka, długa. Nowy przekład („Anne z Zielonych Szczytów”) jest bliższy oryginału.',
  },
];

export const OPISY_KANDYDATOW: Record<string, OpisKandydata> = Object.fromEntries(
  lista.map((opis) => [opis.klucz, opis]),
);

export interface Kandydat {
  /** Id z katalogu w lektury.ts - trafia do readingPlans po zatwierdzeniu. */
  id: string;
  klucz: string;
  /** Tytul obowiazkowy w starej podstawie: nie ma go co wykluczac z glosowania. */
  obowiazkowa?: boolean;
}

// Klasa IV: 13 tytulow polecanych z LEKTURY_IV_2026_POLECANE_IDS, z konkretnym
// tomem tam, gdzie podstawa mowi "wybrana powiesc".
// Klasa V: 5 obowiazkowych z cyklu IV-VI plus uzupelniajace pasujace do wieku.
export const KANDYDACI: Record<'IV' | 'V', Kandydat[]> = {
  IV: [
    { id: 'nowa-narracyjna-1', klucz: 'do-przerwy' },
    { id: 'nowa-narracyjna-6', klucz: 'tajemniczy-ogrod' },
    { id: 'nowa-narracyjna-17', klucz: 'momo' },
    { id: 'nowa-narracyjna-23', klucz: 'detektyw-pozytywka' },
    { id: 'nowa-narracyjna-32', klucz: 'skrzynia-wladcy-piorunow' },
    { id: 'nowa-narracyjna-38', klucz: 'lew-czarownica' },
    { id: 'nowa-narracyjna-39', klucz: 'ronja' },
    { id: 'nowa-narracyjna-41', klucz: 'magiczne-drzewo' },
    { id: 'nowa-narracyjna-43', klucz: 'chlopcy-z-placu-broni' },
    { id: 'nowa-narracyjna-48', klucz: 'pajaczek' },
    { id: 'nowa-narracyjna-52', klucz: 'cudowny-chlopak' },
    { id: 'nowa-narracyjna-54', klucz: 'pax' },
    { id: 'nowa-narracyjna-70', klucz: 'tomek-sawyer' },
  ],
  V: [
    { id: 'stara-obowiazkowa-1', klucz: 'akademia-pana-kleksa', obowiazkowa: true },
    { id: 'stara-obowiazkowa-2', klucz: 'kajko-i-kokosz', obowiazkowa: true },
    { id: 'stara-obowiazkowa-3', klucz: 'lew-czarownica', obowiazkowa: true },
    { id: 'stara-obowiazkowa-4', klucz: 'chlopcy-z-placu-broni', obowiazkowa: true },
    { id: 'stara-obowiazkowa-5', klucz: 'hobbit', obowiazkowa: true },
    { id: 'stara-uzupelniajaca-1', klucz: 'kapelusz' },
    { id: 'stara-uzupelniajaca-4', klucz: 'lajki-marczuka' },
    { id: 'stara-uzupelniajaca-12', klucz: 'zwiadowcy' },
    { id: 'stara-uzupelniajaca-18', klucz: 'felix-net-nika' },
    { id: 'stara-uzupelniajaca-28', klucz: 'magiczne-drzewo' },
    { id: 'stara-uzupelniajaca-30', klucz: 'ania' },
    { id: 'stara-uzupelniajaca-33', klucz: 'sposob-na-alcybiadesa' },
    { id: 'stara-uzupelniajaca-36', klucz: 'cudowny-chlopak' },
    { id: 'stara-uzupelniajaca-37', klucz: 'most-do-terabithii' },
    { id: 'stara-uzupelniajaca-38', klucz: 'pax' },
    { id: 'stara-uzupelniajaca-41', klucz: 'percy-jackson' },
    { id: 'stara-uzupelniajaca-47', klucz: 'tomek-sawyer' },
  ],
};

export function okladkaUrl(klucz: string): string {
  return `/okladki/${klucz}.jpg`;
}

// Kiedy omawiamy kolejne lektury - po parzystych dzialach podrecznika, zeby
// klasa miala ~2 miesiace na przeczytanie. IV: GWO, 9 rozdzialow (dzial 1
// konczy sie ok. polowy pazdziernika razem z powtorzeniem i sprawdzianem).
// V: Nowa Era, 7 dzialow. Miesiace orientacyjne - drukuja sie na liscie dla
// uczniow, wiec jak tempo sie rozjedzie, popraw tutaj.
export interface Termin {
  dzial: number;
  kiedy: string;
}

export const TERMINY: Record<'IV' | 'V', Termin[]> = {
  IV: [
    { dzial: 2, kiedy: 'koniec listopada' },
    { dzial: 4, kiedy: 'koniec stycznia' },
    { dzial: 6, kiedy: 'koniec marca' },
    { dzial: 8, kiedy: 'koniec maja' },
  ],
  V: [
    { dzial: 2, kiedy: 'początek grudnia' },
    { dzial: 4, kiedy: 'koniec lutego' },
    { dzial: 6, kiedy: 'połowa maja' },
    { dzial: 7, kiedy: 'czerwiec' },
  ],
};
