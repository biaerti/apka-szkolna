// Klasa 4, lektura: Ferenc Molnár, „Chłopcy z Placu Broni” - osobna zakladka
// na liscie lekcji, jak dzial z podrecznika, tylko bez podrecznika.
// Plan i fakty o ksiazce: docs/lektura-chlopcy-z-placu-broni.md, jak omawiac
// lektury: docs/research/lektury-jak-omawiac.md.
//
// Bartek (2026-10-17): cala ksiazka przeczytana przed lekcja 1, 6 lekcji po
// kolei przez ksiazke. Kazda lekcja = 1 problem + 1 pojecie wiedzy. Przebieg
// w nowym formacie: kolo z poprzedniej lekcji -> film ok. 8 min (3 zadania,
// pauza 60 s, sprawdzanie z "dlaczego") -> 2 karty "Ćwiczymy razem" ->
// krotka notatka na koniec. Notatka tylko z pojecia, nigdy ze streszczenia.
// Filmy: filmiki/placu-broni/ (film1-film6), narracja wlasna, bez cytatow
// z przekladu.
//
// Bartek (2026-11-17): po kole czytanka - ok. 4 min fragmentu ksiazki z lektorka
// (przeklad T. Olszanskiego), pasujacego do lekcji. Tekst i mp3 jak inne
// czytanki: poza repo, w prywatnym buckecie (src/data/czytanki.ts).

import { newId } from './id';
import type { Slide } from './types';
import { plan, slideCzytanka, slideNote, slideTopic, slideVideo, type Topic } from './textbook5slides';

export const LEKTURA_CHLOPCY = 'Lektura - Chłopcy z Placu Broni';

/** Kolo na start: 3 pytania z poprzedniej lekcji, 3 osoby (nowy format, Bartek 2026-10-17). */
function kolo(questionSetId?: string): Slide[] {
  return questionSetId ? [{ id: newId(), kind: 'recap', questionSetId, mode: 'powtorzeniowe', questionCount: 3 }] : [];
}

/** "Ćwiczymy razem" (src/data/cwiczeniaChlopcy.ts): 2 karty po filmie. */
function razem(...ids: string[]): Slide[] {
  return ids.map((cwiczenieId) => ({ id: newId(), kind: 'cwiczenie', cwiczenieId }));
}

/**
 * Notatka z lektury: temat i kazde zdanie w osobnej linijce (Bartek 2026-11-16).
 * Pusta linia miedzy nimi, bo markdownLite skleja sasiednie linie spacja.
 */
function notatka(temat: string, ...zdania: string[]): Slide {
  return slideNote(temat, `\n${zdania.join('\n\n')}`);
}

/** Model 3D placu z bitwa krok po kroku (public/prezentacje/plac-broni-3d.html). */
function modelPlacu(): Slide {
  return { id: newId(), kind: 'embed', url: '/prezentacje/plac-broni-3d.html', title: 'Plac Broni - model i bitwa' };
}

/** Rozmowa na projektorze (bez notatki, bez oceny). */
function rozmowa(title: string, body: string, photo?: { src: string; credit: string }): Slide {
  return { id: newId(), kind: 'text', title, body, studentAction: 'oral', ...(photo ? { photo } : {}) };
}

/** Wspolny przebieg lekcji z lektury (45 min). */
function przebieg(film: string, karty: string, czytanka: string): string {
  return [
    '1. **Przygotuj się + temat** (3 min).',
    '2. **Koło** (5 min) - 3 pytania z poprzedniej lekcji, 3 osoby.',
    `3. **Czytanka** (ok. 4 min) - ${czytanka}. Lektorka czyta, tekst podświetla się na ekranie.`,
    `4. **Film „${film}”** (ok. 8 min) - 3 zadania z minutą na każde, sprawdzanie z „dlaczego”, na końcu „Zapamiętaj!”.`,
    `5. **Ćwiczymy razem** (reszta lekcji, 2 karty): ${karty}. Na czarnym ekranie, każdy przykład - koło (K) losuje osobę.`,
    '6. **Notatka** (5 min) - 2 zdania do przepisania.',
  ].join('\n');
}

const TYTUL_GEREB = '4. Gereb - czy zdradę można wybaczyć?';
const TYTUL_BITWA = '5. Bitwa o Plac Broni';
/** Bartek 2026-11-19: 4a i 4c zrobily bitwe (L5) przed Gerebem (L4), 4b po kolei. */
const BITWA_PRZED_GEREBEM = ['4a', '4c'];

export const LEKTURA_CHLOPCY_TOPICS: Topic[] = [
  {
    title: '1. Plac Broni - po co walczyć o pusty plac?',
    dzial: LEKTURA_CHLOPCY,
    topic: 'Plac Broni - czas i miejsce akcji',
    textbookPage: 0,
    teacherPlan: plan(
      ['Co dziś', 'Pierwsza lekcja o lekturze (cała książka przeczytana wcześniej). Film zaczyna się **streszczeniem całej książki** (ok. 1 min), żeby każdy wiedział, o czym rozmawiamy - także ci, którzy nie doczytali. Potem pojęcie: **czas i miejsce akcji**, prawdziwe albo wymyślone, i mapa okolicy placu - wrócimy do niej przy wyprawie, a przy bitwie zobaczymy plac w 3D.'],
      ['Po lekcji uczeń', [
        '- wskazuje czas i miejsce akcji (Budapeszt, wiosna 1889 r., kilka dni),',
        '- odróżnia miejsce prawdziwe od wymyślonego,',
        '- wie, gdzie są Plac Broni, skład drewna, Ogród Botaniczny i ogród przy Muzeum,',
        '- wyjaśnia, czym plac był dla chłopców.',
      ].join('\n')],
      ['Przebieg (45 min)', przebieg('Plac Broni - streszczenie, czas i miejsce akcji', '„Gdzie i kiedy? Fakty z książki”, „Co tu się wydarzyło?”, „Przed bitwą czy po bitwie?” (3 karty, quiz z lektury)', 'opis placu i składu drewna z rozdz. II (zapytaj potem: gdzie jest plac i co go otacza?)')],
      ['Jak wyjaśnić', [
        '- Miejsce akcji odpowiada na pytanie **gdzie?**, czas akcji na pytanie **kiedy?**',
        '- Budapeszt, ulica Pawła, Ogród Botaniczny istnieją naprawdę - miejsce akcji jest prawdziwe. W baśni bywa wymyślone.',
        '- Plac to dla chłopców wolność wśród kamienic: zabawa, fortece, własne zasady. Jak mała ojczyzna, której się broni.',
        '- W nowszym przekładzie („Chłopaki z ulicy Pawła”) imiona są po węgiersku - to ta sama książka.',
      ].join('\n')],
      ['Odpowiedzi do filmu', [
        '- **Z1** kulki - muzeum, fortece - plac, narada na wyspie - ogród, wybór wodza - plac.',
        '- **Z2** odpowiedź 2 - jedyne wolne miejsce do zabawy, ich własny świat z zasadami.',
        '- Czas czy miejsce (w marcu, w Budapeszcie...) ćwiczymy już na kartach, nie w filmie.',
      ].join('\n')],
    ),
    questions: [
      { text: 'Gdzie i kiedy dzieje się akcja „Chłopców z Placu Broni”?', answer: 'W Budapeszcie, wiosną 1889 roku, przez kilka dni.' },
      { text: 'Dlaczego plac jest dla chłopców taki ważny?', answer: 'To ich jedyne wolne miejsce do zabawy wśród kamienic - ich własny świat z zasadami.' },
      { text: 'Gdzie mają kryjówkę Czerwone Koszule?', answer: 'Na wyspie w Ogrodzie Botanicznym.' },
      { text: 'Po co Feri Acz zabrał chłopcom chorągiewkę z placu?', answer: 'Żeby pokazać, że Czerwone Koszule mogą wejść na plac - to zapowiedź walki o plac.' },
      { text: 'Dlaczego chłopcy wybrali na wodza właśnie Bokę?', answer: 'Bo jest spokojny, rozsądny i sprawiedliwy - wszyscy mu ufają.' },
      { text: 'Miejsce akcji tej książki jest prawdziwe czy wymyślone? Dlaczego?', answer: 'Prawdziwe - Budapeszt, ulica Pawła i Ogród Botaniczny istnieją naprawdę.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Plac Broni - czas i miejsce akcji'),
      ...kolo(previousSetId),
      slideCzytanka('placu-broni-plac'),
      slideVideo('placu-broni-film1'),
      ...razem('k4-chlopcy-gdzie-kiedy', 'k4-chlopcy-co-tu-bylo', 'k4-chlopcy-przed-po'),
      notatka('Plac Broni - czas i miejsce akcji', '**Miejsce akcji** to miejsce, gdzie dzieją się wydarzenia (gdzie?), a **czas akcji** to czas, kiedy się dzieją (kiedy?).', 'Mogą być **prawdziwe**, jak Budapeszt w 1889 roku, albo **wymyślone**, jak w baśni.'),
    ],
  },
  {
    title: '2. Dwie drużyny - kto jest kim?',
    dzial: LEKTURA_CHLOPCY,
    topic: 'Bohaterowie główni, drugoplanowi i zbiorowi, protagonista i antagonista',
    textbookPage: 0,
    teacherPlan: plan(
      ['Co dziś', 'Bohaterowie całej książki: chłopcy z Placu Broni i Czerwone Koszule, stopnie wojskowe (jeden szeregowiec - Nemeczek). Pojęcia: **bohater główny, drugoplanowy, zbiorowy** oraz **protagonista i antagonista** (po filmie: karta i notatka). Film rysuje sieć bohaterów: kto do której drużyny, kto z kim się przyjaźni, kto rywalizuje, kto zdradza.'],
      ['Po lekcji uczeń', [
        '- przypisuje bohaterów do drużyn,',
        '- odróżnia bohatera głównego, drugoplanowego i zbiorowego,',
        '- wskazuje protagonistę i antagonistę (Boka - Feri Acz),',
        '- uzasadnia, dlaczego Nemeczek jest bohaterem głównym, choć jest najmniejszy.',
      ].join('\n')],
      ['Przebieg (45 min)', przebieg('Dwie drużyny', '„Która drużyna?”, „Główny, drugoplanowy czy zbiorowy?”, „Protagonista czy antagonista?” (przed tą kartą 2 min wyjaśnienia z „Jak wyjaśnić”)', 'wybór przewodniczącego z rozdz. II: płacz Nemeczka-szeregowca, Boka kontra Gereb, „Niech żyje Plac!”')],
      ['Jak wyjaśnić', [
        '- Bohater główny - wokół niego toczy się akcja (Nemeczek, Boka).',
        '- Drugoplanowy - często jest w książce, ale historia nie jest o nim (Feri Acz, Gereb, Czonakosz).',
        '- Zbiorowy - grupa działająca razem (chłopcy z Placu Broni, Czerwone Koszule).',
        '- Wszyscy chłopcy są oficerami, tylko Nemeczek jest szeregowcem - a to on okaże się najważniejszy.',
        '- **Protagonista** dąży do celu, któremu kibicujemy: Boka i chłopcy chcą obronić plac. **Antagonista** stoi mu na drodze: Feri Acz i Czerwone Koszule chcą plac zabrać.',
        '- Antagonista nie musi być zły: Feri Acz jest honorowy, każe oddać honory Nemeczkowi. Po prostu chce czegoś przeciwnego.',
        '- Przykłady spoza książki: Simba i Skaza („Król Lew”), Harry Potter i Voldemort.',
      ].join('\n')],
      ['Odpowiedzi do filmu', [
        '- **Z1** plac: Boka, Nemeczek, Czonakosz, Czele; koszule: Feri Acz, Pastorowie, Sebenicz, Wendauer.',
        '- **Z2** Nemeczek - główny, chłopcy z Placu Broni - zbiorowy, Czonakosz - drugoplanowy, Czerwone Koszule - zbiorowy, Feri Acz - drugoplanowy.',
        '- **Z3** odpowiedź 2 - historia kręci się wokół niego, jego odwaga decyduje o losie placu.',
      ].join('\n')],
    ),
    questions: [
      { text: 'Kto jest wodzem Czerwonych Koszul?', answer: 'Feri Acz.' },
      { text: 'Dlaczego Nemeczek jest jedynym szeregowcem?', answer: 'Był najmniejszy i koledzy nie traktowali go poważnie - wszyscy inni zostali oficerami.' },
      { text: 'Co to jest bohater zbiorowy? Podaj przykład z książki.', answer: 'Grupa, która działa razem, np. chłopcy z Placu Broni albo Czerwone Koszule.' },
      { text: 'Dlaczego Gereb nie był zadowolony z wyboru wodza?', answer: 'Sam chciał nim zostać, a chłopcy wybrali Bokę.' },
      { text: 'Czym zajmuje się Związek Kitowców?', answer: 'To klub chłopców: razem dbają o kit, żeby nie wysechł, mają prezesa, pieczęć i księgę.' },
      { text: 'Feri Acz to bohater główny czy drugoplanowy? Dlaczego?', answer: 'Drugoplanowy - jest ważny, ale historia toczy się wokół Nemeczka i Boki.' },
      { text: 'Kto jest protagonistą, a kto antagonistą w „Chłopcach z Placu Broni”?', answer: 'Protagonista: Boka i chłopcy z Placu Broni (bronią placu). Antagonista: Feri Acz i Czerwone Koszule (chcą plac zabrać).' },
      { text: 'Czy antagonista musi być zły? Podaj przykład z książki.', answer: 'Nie - Feri Acz przeszkadza chłopcom, ale jest honorowy: każe oddać honory Nemeczkowi.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Bohaterowie „Chłopców z Placu Broni”'),
      ...kolo(previousSetId),
      slideCzytanka('placu-broni-wybory'),
      slideVideo('placu-broni-film2'),
      ...razem('k4-chlopcy-druzyny', 'k4-chlopcy-rodzaje-bohaterow', 'k4-chlopcy-protagonista'),
      notatka('Bohaterowie „Chłopców z Placu Broni”', '**Bohater główny** jest najważniejszy - wokół niego toczy się akcja, a **bohater drugoplanowy** mu towarzyszy.', '**Bohater zbiorowy** to grupa, która działa razem, np. chłopcy z Placu Broni.', '**Protagonista** dąży do celu (Boka i chłopcy bronią placu), a **antagonista** mu przeszkadza (Feri Acz i Czerwone Koszule).'),
    ],
  },
  {
    title: '3. Nemeczek - alfa, sigma czy beta?',
    dzial: LEKTURA_CHLOPCY,
    topic: 'Cechy bohatera i dowody',
    textbookPage: 0,
    teacherPlan: plan(
      ['Co dziś', 'Rozdziały III-V: wyprawa do Ogrodu Botanicznego, nazwisko Nemeczka małymi literami w księdze Związku Kitowców, samotna wyprawa po chorągiewkę i trzecia kąpiel. Pojęcie: **cecha bohatera i dowód** (czyn, słowa, opinia innych). Film: trasa wyprawy na mapie, karta postaci i drabinka od szeregowca do kapitana.'],
      ['Po lekcji uczeń', [
        '- nazywa cechy Nemeczka,',
        '- popiera każdą cechę dowodem,',
        '- rozpoznaje rodzaj dowodu: czyn, słowa albo opinia innych.',
      ].join('\n')],
      ['Przebieg (45 min)', przebieg('Nemeczek - cecha i dowód', '„Jaka cecha?”, „Czyn, słowa czy opinia innych?”', 'Nemeczek na wyspie z rozdz. V: „Są tacy!”, „Nigdy!”, kąpiel w stawie i „Prezentuj broń!” (ok. 5 min)')],
      ['Jak wyjaśnić', [
        '- Cecha bez dowodu to tylko opinia. Mówimy: jest odważny, **bo**...',
        '- Czyn: sam idzie do kryjówki wrogów. Słowa: woli zimną wodę niż zdradę. Opinia innych: wróg, Feri Acz, każe mu oddać honory.',
        '- Małe litery w księdze, potem wielkie - tak zmienia się opinia kolegów.',
      ].join('\n')],
      ['Rozmowa po filmie: alfa, beta, sigma (ok. 10 min, 3 slajdy)', [
        'Dzieci znają z internetu podział chłopaków na „alfa” (rządzi), „beta” (słabszy, słucha innych) i „sigma” (samotny wilk). Najpierw wyjaśniamy, skąd ten podział, potem pytamy, kim byłby Nemeczek. Jeśli zabraknie czasu, skróć karty (jedna zamiast dwóch).',
        '',
        '**Slajd 1 - skąd to się wzięło.**',
        '- „Alfa” i „beta” pochodzą z badań nad wilkami w zoo w Bazylei (Rudolph Schenkel, 1947). Obce wilki zamknięte razem walczyły o pierwszeństwo.',
        '- Słowo rozsławił L. David Mech w książce „The Wolf” (1970). W 1999 r. sam je odwołał: na wolności wataha to rodzice z dziećmi, nikt nie walczy o tron. Prosił, żeby przestać mówić „alfa”.',
        '- „Sigma” dopisano w internecie ok. 2010 r., a dziś to głównie mem („sigma” = chodzi swoimi drogami, nikogo nie potrzebuje).',
        '',
        '**Slajd 2 - dlaczego tylko chłopcy.**',
        '- Pytanie dla klasy: dlaczego nikt nie dzieli tak dziewczyn? Bo kobiecość uchodzi za coś, co się po prostu ma. Męskość - za coś, co trzeba zdobyć i ciągle udowadniać, i można ją stracić („nie jesteś prawdziwym facetem”). Psycholodzy nazywają to **niepewną męskością** (Vandello i Bosson, 2008).',
        '- Hierarchia alfa-beta to właśnie ranking zdanych i oblanych prób: kto się nie przestraszy, idzie w górę, kto się boi, spada w dół („beta”).',
        '- Sigma to też sztuczny podział: niby poza grą, ale jego męskość też jest sprawdzana - przez kolegów, przez dziewczynę, w sytuacji, w której trzeba kogoś obronić. Wniosek: to ta sama próba, tylko inna nazwa.',
        '',
        '**Slajd 3 - Nemeczek.** Na co naprowadzić:',
        '- Według tej tabelki Nemeczek to „beta”: najmniejszy, jedyny szeregowiec, wszyscy mu rozkazują. A to on zdaje każdą próbę.',
        '- Męskość = odwaga wystawiona na próbę: schodzi z drzewa i przyznaje się przed wrogami, trzy razy ląduje w zimnej wodzie, nie przechodzi do Czerwonych Koszul, chory biegnie na bitwę.',
        '- Gereb chciał być „alfą” (wodzem, wysokim stopniem) - i zdradził. Feri Acz, prawdziwy „alfa”, oddaje honory najmniejszemu.',
        '- Wniosek: siła to nie rządzenie innymi ani wzrost, tylko odwaga i wierność, kiedy jest trudno. Najmniejszy okazał się największy - warto o tym pamiętać, zanim w klasie ktoś kogoś nazwie „betą”.',
      ].join('\n')],
      ['Odpowiedzi do filmu', [
        '- **Z1** odpowiedź 2 - schodzi z drzewa i mówi: to ja.',
        '- **Z2** sam idzie do kryjówki wrogów - odważny, nie przechodzi do wrogów - wierny, przyznaje się - prawdomówny (honorowy).',
        '- **Z3** honory od Feriego - opinia innych, woli wodę niż zdradę - słowa, ucieka chory z łóżka - czyn, wielkie litery - opinia innych.',
      ].join('\n')],
    ),
    questions: [
      { text: 'Po co chłopcy zostawili w Ogrodzie Botanicznym kartkę „Tu byli chłopcy z Placu Broni”?', answer: 'Żeby pokazać, że się nie boją i też potrafią wejść na teren wroga.' },
      { text: 'Dlaczego Nemeczek wyszedł z zebrania Związku Kitowców?', answer: 'Zobaczył, że Gereb skrada się do stróża Janosza, i poszedł za nim.' },
      { text: 'Dlaczego koledzy wpisali nazwisko Nemeczka małymi literami?', answer: 'Myśleli, że ich zawiódł i stchórzył - nie wiedzieli, że śledził Gereba.' },
      { text: 'Dlaczego Nemeczek zszedł z drzewa i przyznał się, że zabrał chorągiewkę?', answer: 'Nie chciał chować się jak złodziej - chciał pokazać, że chłopcy z Placu Broni się nie boją.' },
      { text: 'Dlaczego Feri Acz kazał oddać Nemeczkowi honory?', answer: 'Docenił jego odwagę i wierność, choć Nemeczek był jego wrogiem.' },
      { text: 'Podaj jedną cechę Nemeczka i dowód.', answer: 'Np. odważny - sam poszedł do kryjówki wrogów; wierny - nie przeszedł do Czerwonych Koszul.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Nemeczek - alfa, sigma czy beta?'),
      ...kolo(previousSetId),
      slideCzytanka('placu-broni-nemeczek'),
      slideVideo('placu-broni-film3'),
      rozmowa('Skąd się wzięły „alfa” i „beta”?', [
        'Te słowa wymyślili badacze **wilków** ok. 80 lat temu. Patrzyli na wilki w zoo: obce sobie, zamknięte razem, biły się o to, kto rządzi.',
        '- Na wolności wataha to **rodzina**. „Alfa” to po prostu mama i tata, którzy opiekują się młodymi.',
        '- Badacz, który rozsławił słowo „alfa”, sam potem prosił, żeby go nie używać.',
        '- Internet przeniósł ten podział na chłopaków, a ok. 15 lat temu dodał **sigmę** - „samotnego wilka”.',
        '- Skoro nawet u wilków to pomyłka - czy pasuje do ludzi?',
      ].join('\n'), { src: '/prezentacje/wilk.jpg', credit: 'Fot. Mas3cf, CC BY-SA 4.0, Wikimedia Commons' }),
      rozmowa('Dlaczego tylko chłopcy?', [
        'Nikt nie dzieli tak dziewczyn. O dziewczynie mówi się, że po prostu **jest** dziewczyną. Chłopak słyszy: „bądź twardy”, „nie becz”, „pokaż, że jesteś facetem”. Męskość trzeba **udowadniać** - ciągle jest wystawiana na próbę.',
        '- Kto zda próbę, idzie w górę grupy - „alfa”. Kto się przestraszy, spada w dół - „beta”.',
        '- „Sigma” niby nie gra w tę grę. Ale czy jemu nikt nie robi prób?',
        '- Jakie próby znacie z podwórka i ze szkoły? Kto je wymyśla?',
      ].join('\n')),
      rozmowa('„Alfa, beta, sigma” - a Nemeczek?', [
        'W internecie dzieli się chłopaków na **alfa** (rządzi grupą), **beta** (słabszy, słucha innych) i **sigma** (chodzi własnymi drogami).',
        '- Kim byłby Nemeczek według tej tabelki? A Gereb? A Feri Acz?',
        '- Kiedy odwaga Nemeczka zostaje wystawiona na próbę?',
        '- Kto w tej książce naprawdę zdał egzamin z odwagi?',
        '- Co jest ważniejsze: kto rządzi grupą - czy kto dotrzymuje słowa, kiedy jest trudno?',
      ].join('\n')),
      ...razem('k4-chlopcy-cecha', 'k4-chlopcy-dowod'),
      notatka('Nemeczek - cechy bohatera i dowody', 'Cechy bohatera poznajemy po jego **czynach**, **słowach** i po tym, co mówią o nim **inni**.', 'Każdą cechę popieramy dowodem, np. Nemeczek jest odważny, bo sam poszedł do kryjówki wrogów.'),
    ],
  },
  {
    title: TYTUL_GEREB,
    dzial: LEKTURA_CHLOPCY,
    topic: 'Czyn i motyw. Sympatia i zaufanie',
    // 4a i 4c przyszly na Gereba prosto z bitwy - kolo z pytan o bitwe.
    koloDlaKlas: [{ klasy: BITWA_PRZED_GEREBEM, zLekcji: TYTUL_BITWA }],
    textbookPage: 0,
    teacherPlan: plan(
      ['Co dziś', 'Gereb: przegrane wybory (3 głosy na 11 - pierwszy raz rywalizuje z Boką i „zapala mu się lampka”), zdrada, wstyd, powrót. Dwie rzeczy: **czyn i motyw** (motyw pomaga zrozumieć, nie usprawiedliwia) oraz główna myśl lekcji - **sympatia i zaufanie** to dwa różne poziomy. Zdrada nie musi zabrać sympatii, ale niszczy zaufanie. Chłopcy z Placu Broni potrzebowali obu, bo powierzali sobie tajemnice. Zaufanie odbudowują czyny, krok po kroku.'],
      ['Po lekcji uczeń', [
        '- odróżnia czyn od motywu,',
        '- odróżnia sympatię od zaufania i rozpoznaje je w sytuacjach,',
        '- wyjaśnia, dlaczego Boka przebacza Gerebowi, ale go nie przyjmuje,',
        '- wie, że zaufanie odbudowują czyny, a nie same słowa.',
      ].join('\n')],
      ['Przebieg (45 min)', [
        '1. **Przygotuj się + temat** (3 min).',
        '2. **Koło** (5 min) - 3 pytania z poprzedniej lekcji, 3 osoby (4b: Nemeczek, 4a i 4c: bitwa - te klasy zrobiły bitwę wcześniej).',
        '3. **Czytanka** (ok. 4 min) - Gereb przy furtce z rozdz. VI. Przed czytaniem: „Boka zgaduje, dlaczego Gereb przyszedł. Gereb mówi, że inny był powód. Uważajcie”.',
        '4. **Film „Gereb - czyn i motyw, sympatia i zaufanie”** (ok. 9 min) - 3 zadania z minutą na każde.',
        '5. **Rozmowa „Lubić a ufać”** (5 min) - pytania na slajdzie.',
        '6. **Ćwiczymy razem** (3 karty): „Czyn czy motyw?”, „Sympatia czy zaufanie?”, „Czym odbudować zaufanie?”. Każdy przykład - koło (K) losuje osobę.',
        '7. **Notatka** (5 min) - 3 zdania do przepisania.',
      ].join('\n')],
      ['Jak wyjaśnić', [
        '- Czyn: co zrobił? Motyw: dlaczego? Dwóch złodziei: jeden chce mieć więcej, drugi potrzebuje na operację dziecka. Czyn ten sam, motywy różne. Motyw pomaga zrozumieć, ale nie usprawiedliwia.',
        '- **Sympatia** = lubię cię. **Zaufanie** = mogę na tobie polegać. Kolegę z korytarza można lubić, ale nie mówić mu o ważnych sprawach. Komuś, z kim się nie kolegujemy, można ufać - wiemy, że w kłopocie pomoże.',
        '- Dlatego po zdradzie kolega wydaje się jednocześnie dobry i zły: sympatia została, zaufanie zniknęło.',
        '- W książce: przy furtce Boka mówi, że już przebaczył, i prawie woła Gereba z powrotem (sympatia), ale go nie przyjmuje (zaufanie). Po liście chłopcy głosują „Tak!”, lecz Gereb wraca na razie jako szeregowy, a Rychter ma go pilnować. „Jednak porządny z ciebie chłopak” - Gereba boli to „jednak”. Stopień porucznika odzyskuje dopiero po bitwie, w której odbiera wrogom chorągiewkę.',
      ].join('\n')],
      ['Odpowiedzi do filmu', [
        '- **Z1** motywy 1 i 3 - zazdrość o Bokę, chęć bycia ważnym.',
        '- **Z2** 1 sama sympatia, 2 samo zaufanie, 3 jedno i drugie, 4 sympatia została, zaufanie zniknęło.',
        '- **Z3** pomysły 2 i 4 - czyny. Cukierki to przekupstwo (jak cygara dla Janosza), samo „przepraszam” to tylko słowa.',
      ].join('\n')],
    ),
    questions: [
      { text: 'Ile głosów dostał Gereb w wyborach na przewodniczącego?', answer: 'Trzy (Boka dostał jedenaście).' },
      { text: 'Jak Gereb chciał przegonić chłopców z placu?', answer: 'Częstował stróża Janosza cygarami i namawiał go, żeby wygonił chłopców.' },
      { text: 'Czym różni się czyn od motywu?', answer: 'Czyn to to, co ktoś zrobił. Motyw to powód - dlaczego to zrobił.' },
      { text: 'Czym różni się sympatia od zaufania?', answer: 'Sympatia: lubię cię. Zaufanie: mogę na tobie polegać.' },
      { text: 'Co Boka czuł do Gereba przy furtce: sympatię, zaufanie czy jedno i drugie?', answer: 'Sympatię - przebaczył mu i chciał go zawołać. Zaufania nie - nie przyjął go z powrotem.' },
      { text: 'Czym Gereb odzyskał zaufanie chłopców?', answer: 'Czynami: podsłuchał z drzewa plan Czerwonych Koszul, a w bitwie odebrał wrogom chorągiewkę.' },
      { text: 'Jako kto wrócił Gereb na Plac Broni?', answer: 'Na razie jako szeregowy, a Rychter miał go pilnować.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Gereb - czyn i motyw, sympatia i zaufanie'),
      ...kolo(previousSetId),
      slideCzytanka('placu-broni-gereb'),
      slideVideo('placu-broni-film4'),
      rozmowa('Lubić a ufać', [
        'Boka mówi Gerebowi, że mu przebacza - i nie przyjmuje go z powrotem. Czy to się wyklucza?',
        '- Czy kolega może być jednocześnie dobry i zły?',
        '- Czy da się kogoś lubić i mu nie ufać? A ufać komuś, kogo się nie lubi?',
        '- Dlaczego zaufanie traci się w jednej chwili, a odbudowuje tak powoli?',
        '- Czy Boka dobrze zrobił, że kazał Rychterowi pilnować Gereba?',
      ].join('\n')),
      ...razem('k4-chlopcy-czyn-motyw', 'k4-chlopcy-sympatia-zaufanie', 'k4-chlopcy-odbudowa'),
      notatka('Gereb - czyn i motyw, sympatia i zaufanie', 'Oceniając bohatera, patrzymy, **co zrobił** (czyn) i **dlaczego** (motyw). Motyw pomaga zrozumieć, ale nie usprawiedliwia złego czynu.', '**Sympatia** to: lubię cię. **Zaufanie** to: mogę na tobie polegać. Przyjaźń potrzebuje obu.', 'Zdrada niszczy zaufanie. Odbudowują je **czyny**, nie same słowa.'),
    ],
  },
  {
    title: TYTUL_BITWA,
    dzial: LEKTURA_CHLOPCY,
    topic: 'Plan bitwy, przyczyna i skutek',
    textbookPage: 0,
    teacherPlan: plan(
      ['Co dziś', 'Rozdziały VI-VIII: plan Boki, okop, bitwa. Najpierw dzieci rysują plac **z pamięci**, potem model 3D placu: porównanie z rysunkami, widok z góry = plan, a potem bitwa krok po kroku. Przy każdym kroku czytasz krótki fragment (podpis „Czytamy” na modelu), dzieci śledzą na modelu, gdzie kto jest. Ćwiczymy **wyobraźnię przestrzenną**: czytając opis, ustawiamy sobie w głowie plan. Pojęcia z filmu: **przyczyna i skutek**, **punkt kulminacyjny**.'],
      ['Po lekcji uczeń', [
        '- rysuje plan placu i wskazuje na nim bramy, forty, tartak i chatkę,',
        '- opowiada przebieg bitwy na planie,',
        '- łączy wydarzenia jak przyczynę i skutek (bo, więc),',
        '- wskazuje punkt kulminacyjny powieści.',
      ].join('\n')],
      ['Przebieg (45 min)', [
        '1. **Przygotuj się + temat** (3 min).',
        '2. **Koło** (5 min) - 3 pytania z poprzedniej lekcji, 3 osoby.',
        '3. **Czytanka** (ok. 4 min) - punkt kulminacyjny bitwy z rozdz. VIII: chory Nemeczek przewraca Feriego Acza.',
        '4. **Narysuj plac z pamięci** (5 min) - kartka, widok z góry, podpisy. Bez zaglądania do książki.',
        '5. **Model 3D** (12 min) - krok 1: dzieci porównują model ze swoimi rysunkami i pokazują miejsca (napisy są schowane), krok 2: widok z góry = plan, kroki 3-15: bitwa. Najpierw czytasz fragment, potem ▶ i model pokazuje ruch.',
        '6. **Film „Bitwa o Plac Broni”** (ok. 8 min) - bo / więc i punkt kulminacyjny.',
        '7. **Ćwiczymy razem** (reszta lekcji, 3 karty): „Bo czy więc?”, „Co z tego wynikło w bitwie?”, „Dopisz skutek”. Ile zdążycie - każdy przykład, koło (K) losuje osobę.',
        '8. **Notatka** (5 min) - 2 zdania do przepisania.',
      ].join('\n')],
      ['Model - obsługa', [
        '- Strzałki / spacja przechodzą po krokach modelu, po ostatnim kroku idzie kolejny slajd.',
        '- Myszką: lewy przycisk obraca, kółko przybliża, prawy przesuwa. Kamera i tak wraca do ujęcia przy kolejnym kroku.',
        '- Przyciski: **Z góry** (plan, zostaje na kolejnych krokach), **Napisy** (podpisy miejsc), **Tekst** (chowa opis na dole). Po kliknięciu w model klawisze P, N, T robią to samo.',
        '- Układ placu jest wg planu Boki z węgierskiego wydania z 1916 r.: brama od ulicy Marii z lewej, furtka od ulicy Pawła na dole, 12 sągów, forty 1-6, okop przed fortami 4 i 5.',
      ].join('\n')],
      ['Fragmenty do czytania (strony wpisz ze swojego wydania)', [
        '- rozdz. II - opis placu i składu drewna (labirynt sągów, tartak, chatka Słowaka) - krok 2,',
        '- rozdz. VI - Boka objaśnia plan bitwy na kamieniu: oddziały A-D, forty 1-6, udawana ucieczka - krok 3,',
        '- początek rozdz. VIII - okop przed fortami 4 i 5 - krok 4,',
        '- rozdz. VIII - bitwa: wrogowie u bram, ucieczka do wozowni i chatki, jeńcy w chatce, atak Feriego, Boka w okopie, „Do chatki!”, Nemeczek i Feri Acz - kroki 5-15.',
      ].join('\n')],
      ['Jak wyjaśnić', [
        '- Plan to widok z góry: z lotu ptaka widać, co jest obok czego. Czytając, pytaj: gdzie jesteśmy? skąd przychodzi wróg? co jest po lewej, a co po prawej?',
        '- Boka wygrywa, bo zna swój teren: wróg nie widzi okopu i nie wie, że „uciekający” chowają się w wozowni i chatce.',
        '- Feri miał taki sam plan (atak z dwóch stron), ale czekał na trąbkę, a trębacza zamknięto w chatce - to przyczyna i skutek.',
        '- Punkt kulminacyjny = najwyższy punkt krzywej napięcia: chory Nemeczek przewraca Feriego Acza. Po nim napięcie opada.',
      ].join('\n')],
      ['Odpowiedzi do filmu', [
        '- **Z1** luka 1 - wyprawa do Ogrodu Botanicznego, luka 2 - ciężka choroba.',
        '- **Z2** punkt 5 - Nemeczek przewraca Feriego Acza.',
        '- **Z3** więc, bo, bo, więc.',
      ].join('\n')],
    ),
    questions: [
      { text: 'Dlaczego Nemeczek ciężko zachorował?', answer: 'Trzy razy był w zimnej wodzie i chodził w mokrym ubraniu.' },
      { text: 'Na jakie sposoby wolno było walczyć w bitwie?', answer: 'Bomby z piasku, zapasy i walka na dzidy - uczciwie, według zasad.' },
      { text: 'Dlaczego Czerwone Koszule nie zauważyły oddziałów A i B?', answer: 'Bo chłopcy schowali się w okopie przed fortami 4 i 5.' },
      { text: 'Dlaczego Feri Acz długo czekał przed furtką od ulicy Pawła?', answer: 'Czekał na sygnał trąbki od oddziału Pastora - a ich trębacza zamknięto w chatce.' },
      { text: 'Co jest punktem kulminacyjnym powieści?', answer: 'Chory Nemeczek wbiega na plac i przewraca Feriego Acza.' },
      { text: 'Bo czy więc: „Nemeczek przewrócił Feriego Acza, … Czerwone Koszule uciekły”?', answer: 'Więc - ucieczka to skutek.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Bitwa o Plac Broni - plan, przyczyny i skutki'),
      ...kolo(previousSetId),
      slideCzytanka('placu-broni-bitwa'),
      {
        id: newId(),
        kind: 'task',
        code: 'Plan',
        title: 'Narysuj Plac Broni z pamięci',
        body: 'Narysuj plac **z góry**, jak na planie. Zaznacz i podpisz:\n- ulicę Pawła z furtką i ulicę Marii z bramą,\n- skład drewna z fortami,\n- tartak, wozownię i chatkę Janosza.',
        timerSec: 300,
        studentAction: 'write-answer',
      },
      modelPlacu(),
      slideVideo('placu-broni-film5'),
      ...razem('k4-chlopcy-bo-wiec', 'k4-chlopcy-bitwa-skutki', 'k4-chlopcy-skutek'),
      notatka('Bitwa o Plac Broni - plan, przyczyny i skutki', 'Wydarzenia łączą się jak łańcuch: **przyczyna** (bo) prowadzi do **skutku** (więc).', '**Punkt kulminacyjny** to moment największego napięcia w utworze.'),
    ],
  },
  {
    title: '6. Dlaczego Nemeczek musiał umrzeć?',
    dzial: LEKTURA_CHLOPCY,
    topic: 'Symbol i przesłanie',
    // 4a i 4c robia Gereba tuz przed ta lekcja - kolo z pytan o Gereba.
    koloDlaKlas: [{ klasy: BITWA_PRZED_GEREBEM, zLekcji: TYTUL_GEREB }],
    textbookPage: 0,
    teacherPlan: plan(
      ['Co dziś', 'Rozdziały IX-X i cała książka. Pytanie lekcji: dlaczego autor pozwolił Nemeczkowi umrzeć? Czytamy krótkie fragmenty, w których plac jest jak ojczyzna, i rozmawiamy: plac to **symbol** ojczyzny, a Nemeczek oddaje za niego zdrowie i życie - to idea **patriotyzmu**. Potem film o wartościach i przesłaniu (na końcu prawda/fałsz z całej książki).'],
      ['Po lekcji uczeń', [
        '- wyjaśnia, co to symbol, i podaje przykład z książki,',
        '- wyjaśnia, dlaczego plac jest dla chłopców jak ojczyzna,',
        '- odpowiada na pytanie lekcji własnym zdaniem z „ponieważ”,',
        '- nazywa przesłanie książki.',
      ].join('\n')],
      ['Przebieg (45 min)', [
        '1. **Przygotuj się + temat** (3 min).',
        '2. **Koło** (5 min) - 3 pytania z poprzedniej lekcji, 3 osoby.',
        '3. **Czytanka** (ok. 4 min) - zakończenie z rozdz. X: Boka sam na placu, „Budować będą”, plac jak ojczyzna.',
        '4. **Czytamy fragmenty** (6 min) - plac jak ojczyzna; zakończenie już było w czytance, rozdz. X pomiń. Po każdym fragmencie jedno pytanie.',
        '5. **Rozmowa** (7 min) - plac jako symbol, dlaczego Nemeczek nie zginął w bitwie, dlaczego musiał umrzeć.',
        '6. **Film „Przesłanie i wartości”** (ok. 9 min) - 3 zadania, na końcu prawda/fałsz z całej książki.',
        '7. **Ćwiczymy razem** (1 karta, „Jaka wartość?”), jeśli zostanie czas.',
        '8. **Notatka** (5 min) - 2 zdania do przepisania.',
      ].join('\n')],
      ['Fragmenty do czytania (strony wpisz ze swojego wydania)', [
        '- rozdz. II - okrzyk na cześć placu; autor dopowiada, że chłopcy wołali tak, jakby wiwatowali na cześć ojczyzny - to odmiana miłości do ojczyzny,',
        '- rozdz. VI - Boka przed bitwą zastanawia się, czy kiedyś będzie walczył nie o mały plac, tylko o wielką ojczyznę,',
        '- rozdz. VII - pan Racz mówi, że Nemeczek się przeziębił. Chłopcy wiedzą swoje: przeziębił się za ojczyznę,',
        '- koniec rozdz. VIII - chory Nemeczek w gorączce czuje wiatr od placu,',
        '- rozdz. X - Nemeczek mówi Boce, że walczył za wszystkich, choć wie, że placu już nie zobaczy,',
        '- rozdz. X - Boka sam na placu szuka śladów Nemeczka tam, gdzie przewrócił Feriego (jak Dawid Goliata). Janosz: na placu stanie dom.',
      ].join('\n')],
      ['Jak wyjaśnić', [
        '- **Symbol** to coś, co znaczy więcej niż samo siebie. Plac to mała ojczyzna: swoja ziemia i granice, własne prawa i przysięga, flaga (chorągiewka), wojsko ze stopniami, zdrajca i bohater.',
        '- **Dlaczego nie zginął w bitwie?** W tej wojnie są zasady: wojnę wypowiada się pod białą flagą, walczy się piaskiem i w zapasach, nigdy dwóch na jednego. Nikt nikogo nie bije na śmierć. Gdyby Pastor pobił Nemeczka, książka byłaby o okrucieństwie i winie jednego chłopca. Nemeczek choruje od trzech kąpieli, czyli od własnej wierności i honoru - za każdym razem mógł się wycofać i nie chciał.',
        '- **Dlaczego musiał umrzeć?** Kilka dobrych odpowiedzi, liczy się „ponieważ”: zabawa w wojnę pokazuje prawdziwą cenę; najmniejszy okazuje się największy i zostaje zapamiętany (wielkie litery w księdze); patriotyzm to oddać coś swojego dla wspólnej sprawy; gorzki koniec - dorośli i tak zabierają plac pod kamienicę, ale nie mogą zabrać tego, czego chłopcy się nauczyli.',
        '- Patriotyzm w tej książce to wierność swoim i uczciwa walka, nie nienawiść do wroga: Feri Acz oddaje Nemeczkowi honory i przychodzi pod jego dom.',
      ].join('\n')],
      ['Odpowiedzi do filmu', [
        '- **Z1** honory od Feriego - szacunek, Boka przyjmuje Gereba - przebaczenie, chory Nemeczek biegnie na plac - odwaga, Boka płacze pod domem Nemeczka - przyjaźń.',
        '- **Z2** odpowiedź 2 - wartość człowieka zależy od czynów, nie od wzrostu ani stopnia.',
        '- **Z3** prawda, fałsz, prawda, prawda, fałsz.',
      ].join('\n')],
    ),
    questions: [
      { text: 'Dlaczego Plac Broni jest symbolem ojczyzny?', answer: 'Chłopcy mają tam swoją ziemię, prawa, flagę i wojsko - i bronią go jak ojczyzny.' },
      { text: 'Od czego naprawdę zachorował Nemeczek?', answer: 'Od trzech kąpieli w zimnej wodzie - przez swoją wierność i honor.' },
      { text: 'Dlaczego Nemeczek nie mógł zginąć w samej bitwie?', answer: 'W tej wojnie były zasady: piasek, zapasy, nigdy dwóch na jednego - nikt nikogo nie bił na śmierć.' },
      { text: 'Czego dowiaduje się Boka na końcu od stróża Janosza?', answer: 'Że na placu zbudują dom - plac i tak przepadnie.' },
      { text: 'Jaką wartość pokazuje Feri Acz, gdy przychodzi pod dom Nemeczka?', answer: 'Szacunek dla przeciwnika.' },
      { text: 'Jakie jest przesłanie „Chłopców z Placu Broni”?', answer: 'Np. o wartości człowieka świadczą jego czyny, nie wzrost ani stopień.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Dlaczego Nemeczek musiał umrzeć?'),
      ...kolo(previousSetId),
      slideCzytanka('placu-broni-koniec'),
      {
        id: newId(),
        kind: 'read',
        title: 'Plac jak ojczyzna',
        source: 'Lektura: Chłopcy z Placu Broni',
        body: 'Szukamy miejsc, w których plac jest jak **ojczyzna**:\n- rozdz. II - okrzyk na cześć placu\n- rozdz. VI - Boka przed bitwą\n- rozdz. VII - Nemeczek się przeziębił... za co?\n- koniec rozdz. VIII - wiatr od placu\n- rozdz. X - Nemeczek: placu już nie zobaczę',
        timerSec: 600,
        studentAction: 'look',
      },
      rozmowa('Plac Broni = ...?', [
        'Na placu chłopcy mają:',
        '- swoją ziemię i granice (płot, furtka, brama),',
        '- swoje prawa i przysięgę,',
        '- swoją flagę - chorągiewkę,',
        '- wojsko ze stopniami,',
        '- zdrajcę i bohatera.',
        '**Co to przypomina? O co walczą naprawdę?**',
      ].join('\n')),
      rozmowa('Dlaczego Nemeczek nie zginął w bitwie?', [
        '- Czy Pastor albo Feri Acz mogli go pobić na śmierć? Jakie zasady obowiązywały w bitwie?',
        '- Od czego naprawdę zachorował Nemeczek?',
        '- Kiedy mógł się wycofać - i dlaczego tego nie zrobił?',
      ].join('\n')),
      rozmowa('Dlaczego Nemeczek musiał umrzeć?', [
        'Dokończ: **Moim zdaniem Nemeczek musiał umrzeć, ponieważ...**',
        '- Co zostaje po Nemeczku?',
        '- Co zostaje po placu, skoro stanie na nim kamienica?',
      ].join('\n')),
      slideVideo('placu-broni-film6'),
      ...razem('k4-chlopcy-wartosci'),
      notatka('Dlaczego Nemeczek musiał umrzeć?', '**Symbol** to coś, co oznacza więcej niż samo siebie, np. Plac Broni oznacza ojczyznę, której chłopcy bronią.', '**Przesłanie** to myśl, którą autor chce nam przekazać - szukamy jej w zakończeniu i w ważnych decyzjach bohaterów.'),
    ],
  },
];
