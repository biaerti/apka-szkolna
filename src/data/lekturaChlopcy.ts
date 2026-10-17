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

import { newId } from './id';
import type { Slide } from './types';
import { plan, slideNote, slideTopic, slideVideo, type Topic } from './textbook5slides';

export const LEKTURA_CHLOPCY = 'Lektura - Chłopcy z Placu Broni';

/** Kolo na start: 3 pytania z poprzedniej lekcji, 3 osoby (nowy format, Bartek 2026-10-17). */
function kolo(questionSetId?: string): Slide[] {
  return questionSetId ? [{ id: newId(), kind: 'recap', questionSetId, mode: 'powtorzeniowe', questionCount: 3 }] : [];
}

/** "Ćwiczymy razem" (src/data/cwiczeniaChlopcy.ts): 2 karty po filmie. */
function razem(...ids: string[]): Slide[] {
  return ids.map((cwiczenieId) => ({ id: newId(), kind: 'cwiczenie', cwiczenieId }));
}

/** Wspolny przebieg lekcji z lektury (45 min). */
function przebieg(film: string, karty: string): string {
  return [
    '1. **Przygotuj się + temat** (3 min).',
    '2. **Koło** (5 min) - 3 pytania z poprzedniej lekcji, 3 osoby.',
    `3. **Film „${film}”** (ok. 8 min) - 3 zadania z minutą na każde, sprawdzanie z „dlaczego”, na końcu „Zapamiętaj!”.`,
    `4. **Ćwiczymy razem** (reszta lekcji, 2 karty): ${karty}. Na czarnym ekranie, każdy przykład - koło (K) losuje osobę.`,
    '5. **Notatka** (5 min) - 2 zdania do przepisania.',
  ].join('\n');
}

export const LEKTURA_CHLOPCY_TOPICS: Topic[] = [
  {
    title: '1. Plac Broni - po co walczyć o pusty plac?',
    dzial: LEKTURA_CHLOPCY,
    topic: 'Plac Broni - czas i miejsce akcji',
    textbookPage: 0,
    teacherPlan: plan(
      ['Co dziś', 'Pierwsza lekcja o lekturze (cała książka przeczytana wcześniej). Rozdziały I-II: chłopcy, Plac Broni, Czerwone Koszule, zabrana chorągiewka, wybór Boki. Pojęcie: **czas i miejsce akcji**, prawdziwe albo wymyślone. Film pokazuje mapę okolicy placu - wrócimy do niej przy wyprawie i bitwie.'],
      ['Po lekcji uczeń', [
        '- wskazuje czas i miejsce akcji (Budapeszt, wiosna 1889 r., kilka dni),',
        '- odróżnia miejsce prawdziwe od wymyślonego,',
        '- wie, gdzie są Plac Broni, skład drewna, Ogród Botaniczny i ogród przy Muzeum,',
        '- wyjaśnia, czym plac był dla chłopców.',
      ].join('\n')],
      ['Przebieg (45 min)', przebieg('Plac Broni - czas i miejsce akcji', '„Gdzie i kiedy?”, „Prawdziwe czy wymyślone?”')],
      ['Jak wyjaśnić', [
        '- Miejsce akcji odpowiada na pytanie **gdzie?**, czas akcji na pytanie **kiedy?**',
        '- Budapeszt, ulica Pawła, Ogród Botaniczny istnieją naprawdę - miejsce akcji jest prawdziwe. W baśni bywa wymyślone.',
        '- Plac to dla chłopców wolność wśród kamienic: zabawa, fortece, własne zasady. Jak mała ojczyzna, której się broni.',
        '- W nowszym przekładzie („Chłopaki z ulicy Pawła”) imiona są po węgiersku - to ta sama książka.',
      ].join('\n')],
      ['Odpowiedzi do filmu', [
        '- **Z1** kulki - muzeum, fortece - plac, narada na wyspie - ogród, wybór wodza - plac.',
        '- **Z2** czas: w marcu, po lekcjach, w 1889 roku; miejsce: w Budapeszcie, na wyspie, przy ulicy Pawła.',
        '- **Z3** odpowiedź 2 - jedyne wolne miejsce do zabawy, ich własny świat z zasadami.',
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
      slideVideo('placu-broni-film1'),
      ...razem('k4-chlopcy-gdzie-kiedy', 'k4-chlopcy-prawdziwe'),
      slideNote('Plac Broni - czas i miejsce akcji', '**Miejsce akcji** to miejsce, gdzie dzieją się wydarzenia (gdzie?), a **czas akcji** to czas, kiedy się dzieją (kiedy?).\nMogą być **prawdziwe**, jak Budapeszt w 1889 roku, albo **wymyślone**, jak w baśni.'),
    ],
  },
  {
    title: '2. Dwie drużyny - kto jest kim?',
    dzial: LEKTURA_CHLOPCY,
    topic: 'Bohaterowie główni, drugoplanowi i zbiorowi',
    textbookPage: 0,
    teacherPlan: plan(
      ['Co dziś', 'Bohaterowie całej książki: chłopcy z Placu Broni i Czerwone Koszule, stopnie wojskowe (jeden szeregowiec - Nemeczek). Pojęcia: **bohater główny, drugoplanowy, zbiorowy**. Film rysuje sieć bohaterów: kto do której drużyny, kto z kim się przyjaźni, kto rywalizuje, kto zdradza.'],
      ['Po lekcji uczeń', [
        '- przypisuje bohaterów do drużyn,',
        '- odróżnia bohatera głównego, drugoplanowego i zbiorowego,',
        '- uzasadnia, dlaczego Nemeczek jest bohaterem głównym, choć jest najmniejszy.',
      ].join('\n')],
      ['Przebieg (45 min)', przebieg('Dwie drużyny', '„Która drużyna?”, „Główny, drugoplanowy czy zbiorowy?”')],
      ['Jak wyjaśnić', [
        '- Bohater główny - wokół niego toczy się akcja (Nemeczek, Boka).',
        '- Drugoplanowy - często jest w książce, ale historia nie jest o nim (Feri Acz, Gereb, Czonakosz).',
        '- Zbiorowy - grupa działająca razem (chłopcy z Placu Broni, Czerwone Koszule).',
        '- Wszyscy chłopcy są oficerami, tylko Nemeczek jest szeregowcem - a to on okaże się najważniejszy.',
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
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Bohaterowie „Chłopców z Placu Broni”'),
      ...kolo(previousSetId),
      slideVideo('placu-broni-film2'),
      ...razem('k4-chlopcy-druzyny', 'k4-chlopcy-rodzaje-bohaterow'),
      slideNote('Bohaterowie „Chłopców z Placu Broni”', '**Bohater główny** jest najważniejszy - wokół niego toczy się akcja, a **bohater drugoplanowy** mu towarzyszy.\n**Bohater zbiorowy** to grupa, która działa razem, np. chłopcy z Placu Broni.'),
    ],
  },
  {
    title: '3. Nemeczek - mały, ale wielki',
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
      ['Przebieg (45 min)', przebieg('Nemeczek - cecha i dowód', '„Jaka cecha?”, „Czyn, słowa czy opinia innych?”')],
      ['Jak wyjaśnić', [
        '- Cecha bez dowodu to tylko opinia. Mówimy: jest odważny, **bo**...',
        '- Czyn: sam idzie do kryjówki wrogów. Słowa: woli zimną wodę niż zdradę. Opinia innych: wróg, Feri Acz, każe mu oddać honory.',
        '- Małe litery w księdze, potem wielkie - tak zmienia się opinia kolegów.',
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
      slideTopic('Nemeczek - cechy bohatera i dowody'),
      ...kolo(previousSetId),
      slideVideo('placu-broni-film3'),
      ...razem('k4-chlopcy-cecha', 'k4-chlopcy-dowod'),
      slideNote('Nemeczek - cechy bohatera i dowody', 'Cechy bohatera poznajemy po jego **czynach**, **słowach** i po tym, co mówią o nim **inni**.\nKażdą cechę popieramy dowodem, np. Nemeczek jest odważny, bo sam poszedł do kryjówki wrogów.'),
    ],
  },
  {
    title: '4. Gereb - czy zdradę można wybaczyć?',
    dzial: LEKTURA_CHLOPCY,
    topic: 'Ocena postępowania bohatera',
    textbookPage: 0,
    teacherPlan: plan(
      ['Co dziś', 'Gereb od początku do końca: przegrany wybór wodza, zdrada, cygara dla Janosza, porucznik u Czerwonych Koszul, wstyd, przeprosiny, powrót jako szeregowiec. Pojęcia: **czyn i motyw**, ocena z uzasadnieniem („Uważam, że..., ponieważ...”). Film: krzywa uczuć Gereba z momentem przełomu.'],
      ['Po lekcji uczeń', [
        '- odróżnia czyn od motywu,',
        '- wskazuje motywy Gereba,',
        '- ocenia postępowanie bohatera i uzasadnia ocenę.',
      ].join('\n')],
      ['Przebieg (45 min)', przebieg('Gereb - czyn i motyw', '„Czyn czy motyw?”, „Dobre uzasadnienie?”')],
      ['Jak wyjaśnić', [
        '- Najpierw pytamy: co zrobił? (czyn). Potem: dlaczego? (motyw).',
        '- Motyw pomaga zrozumieć, ale nie usprawiedliwia złego czynu.',
        '- Ocena bez „bo” to tylko „lubię / nie lubię”. Dobra ocena: Uważam, że..., ponieważ...',
        '- Można uważać, że Gereb zasłużył na drugą szansę, i można, że nie - liczy się uzasadnienie.',
      ].join('\n')],
      ['Odpowiedzi do filmu', [
        '- **Z1** motywy 1 i 3 - zazdrość o Bokę, chęć bycia ważnym.',
        '- **Z2** punkt 3 - widzi, że najmniejszy chłopiec woli zimną wodę niż zdradę.',
        '- **Z3** zdania 2 i 4 - mają tezę i „ponieważ” z faktem z książki.',
      ].join('\n')],
    ),
    questions: [
      { text: 'Dlaczego Gereb zdradził kolegów?', answer: 'Z zazdrości o Bokę - chciał być ważny i mieć wysoki stopień.' },
      { text: 'Jak Gereb chciał przegonić chłopców z placu?', answer: 'Częstował stróża Janosza cygarami i namawiał go, żeby wygonił chłopców.' },
      { text: 'Co sprawiło, że Gereb zaczął się wstydzić?', answer: 'Zobaczył odwagę Nemeczka, który wolał zimną wodę niż zdradę.' },
      { text: 'Czy Boka dobrze zrobił, przyjmując Gereba z powrotem? Uzasadnij.', answer: 'Własna opinia z „ponieważ”, np. tak, ponieważ Gereb przeprosił i chciał naprawić błąd.' },
      { text: 'Co to jest motyw działania?', answer: 'Powód, dla którego bohater coś robi (odpowiada na pytanie: dlaczego?).' },
      { text: 'Jako kto wrócił Gereb do chłopców z Placu Broni?', answer: 'Jako zwykły szeregowiec.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Gereb - oceniamy postępowanie bohatera'),
      ...kolo(previousSetId),
      slideVideo('placu-broni-film4'),
      ...razem('k4-chlopcy-czyn-motyw', 'k4-chlopcy-uzasadnienie'),
      slideNote('Gereb - oceniamy postępowanie bohatera', 'Oceniając bohatera, patrzymy, **co zrobił** (czyn) i **dlaczego** (motyw).\nSwoją ocenę zawsze uzasadniamy: „Uważam, że..., ponieważ...”.'),
    ],
  },
  {
    title: '5. Bitwa o Plac Broni',
    dzial: LEKTURA_CHLOPCY,
    topic: 'Przyczyna i skutek, punkt kulminacyjny',
    textbookPage: 0,
    teacherPlan: plan(
      ['Co dziś', 'Rozdziały VI-VIII: choroba Nemeczka, wypowiedzenie wojny i zasady walki, bitwa. Pojęcia: **przyczyna i skutek** (bo / więc) oraz **punkt kulminacyjny**. Film: łańcuch zdarzeń, mapa bitwy i krzywa napięcia.'],
      ['Po lekcji uczeń', [
        '- łączy wydarzenia jak przyczynę i skutek (bo, więc),',
        '- wskazuje punkt kulminacyjny powieści,',
        '- opowiada przebieg bitwy na mapie placu.',
      ].join('\n')],
      ['Przebieg (45 min)', przebieg('Bitwa o Plac Broni', '„Bo czy więc?”, „Dopisz skutek”')],
      ['Jak wyjaśnić', [
        '- Przyczyna odpowiada na pytanie **dlaczego?** (łączymy przez **bo**), skutek na **co z tego wynikło?** (**więc**).',
        '- Punkt kulminacyjny = najwyższy punkt krzywej napięcia: chory Nemeczek przewraca Feriego Acza.',
        '- Po nim napięcie opada: zwycięstwo, choroba, zakończenie.',
      ].join('\n')],
      ['Odpowiedzi do filmu', [
        '- **Z1** luka 1 - wyprawa do Ogrodu Botanicznego, luka 2 - ciężka choroba.',
        '- **Z2** punkt 5 - Nemeczek przewraca Feriego Acza.',
        '- **Z3** więc, bo, bo, więc.',
      ].join('\n')],
    ),
    questions: [
      { text: 'Dlaczego Nemeczek ciężko zachorował?', answer: 'Trzy razy był w zimnej wodzie i chodził w mokrym ubraniu.' },
      { text: 'Kto przyniósł wypowiedzenie wojny i jak?', answer: 'Posłańcy Czerwonych Koszul (bracia Pastorowie i Sebenicz), pod białą flagą.' },
      { text: 'Na jakie sposoby wolno było walczyć w bitwie?', answer: 'Bomby z piasku, zapasy i walka na dzidy - uczciwie, według zasad.' },
      { text: 'Co jest punktem kulminacyjnym powieści?', answer: 'Chory Nemeczek wbiega na plac i przewraca Feriego Acza.' },
      { text: 'Dlaczego Boka mianował Nemeczka kapitanem?', answer: 'Bo dzięki niemu chłopcy wygrali bitwę.' },
      { text: 'Bo czy więc: „Nemeczek przewrócił Feriego Acza, … Czerwone Koszule uciekły”?', answer: 'Więc - ucieczka to skutek.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Bitwa o Plac Broni - przyczyny i skutki'),
      ...kolo(previousSetId),
      slideVideo('placu-broni-film5'),
      ...razem('k4-chlopcy-bo-wiec', 'k4-chlopcy-skutek'),
      slideNote('Bitwa o Plac Broni - przyczyny i skutki', 'Wydarzenia łączą się jak łańcuch: **przyczyna** (bo) prowadzi do **skutku** (więc).\n**Punkt kulminacyjny** to moment największego napięcia w utworze.'),
    ],
  },
  {
    title: '6. Co zostaje po Nemeczku i po placu?',
    dzial: LEKTURA_CHLOPCY,
    topic: 'Przesłanie i wartości',
    textbookPage: 0,
    teacherPlan: plan(
      ['Co dziś', 'Rozdziały IX-X i cała książka: nazwisko wielkimi literami, śmierć Nemeczka, Feri Acz pod domem, plac pod budowę. Pojęcia: **wartości** i **przesłanie**. Na końcu filmu prawda/fałsz z całej książki - sprawdzenie przeczytania bez ocen.'],
      ['Po lekcji uczeń', [
        '- nazywa wartości, które ważą w książce (przyjaźń, odwaga, wierność, szacunek, przebaczenie),',
        '- wskazuje przesłanie i je uzasadnia,',
        '- łączy pojęcia z całego działu lektury.',
      ].join('\n')],
      ['Przebieg (45 min)', przebieg('Przesłanie i wartości', '„Jaka wartość?”, „Pojęcia z lektury” (powtórka całego działu)')],
      ['Jak wyjaśnić', [
        '- Wartość to to, co dla bohaterów najważniejsze - widać ją w czynach.',
        '- Przesłanie to myśl, którą autor chce nam przekazać. Szukamy go w zakończeniu i w ważnych decyzjach.',
        '- Plac i tak przepada, ale zostaje pamięć o odwadze i wierności Nemeczka. Rozmowa: czy walka miała sens? (własne zdanie z „ponieważ”).',
      ].join('\n')],
      ['Odpowiedzi do filmu', [
        '- **Z1** honory od Feriego - szacunek, Boka przyjmuje Gereba - przebaczenie, chory Nemeczek biegnie na plac - odwaga, Boka płacze pod domem Nemeczka - przyjaźń.',
        '- **Z2** odpowiedź 2 - wartość człowieka zależy od czynów, nie od wzrostu ani stopnia.',
        '- **Z3** prawda, fałsz, prawda, prawda, fałsz.',
      ].join('\n')],
    ),
    questions: [
      { text: 'Czego dowiaduje się Boka na końcu od stróża Janosza?', answer: 'Że na placu zbudują dom - plac i tak przepadnie.' },
      { text: 'Jak koledzy uczcili Nemeczka w księdze Związku Kitowców?', answer: 'Wpisali jego nazwisko wielkimi literami.' },
      { text: 'Jaką wartość pokazuje Feri Acz, gdy przychodzi pod dom Nemeczka?', answer: 'Szacunek dla przeciwnika.' },
      { text: 'Jakie jest przesłanie „Chłopców z Placu Broni”?', answer: 'Np. o wartości człowieka świadczą jego czyny, nie wzrost ani stopień.' },
      { text: 'Czy walka o plac miała sens? Uzasadnij.', answer: 'Własna opinia z „ponieważ”, np. tak, ponieważ chłopcy nauczyli się przyjaźni i odwagi.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Przesłanie „Chłopców z Placu Broni”'),
      ...kolo(previousSetId),
      slideVideo('placu-broni-film6'),
      ...razem('k4-chlopcy-wartosci', 'k4-chlopcy-pojecia'),
      slideNote('Przesłanie „Chłopców z Placu Broni”', '**Przesłanie** to myśl, którą autor chce nam przekazać - szukamy jej w zakończeniu i w ważnych decyzjach bohaterów.\n**Wartości** to to, co dla bohaterów najważniejsze, np. przyjaźń, odwaga, wierność.'),
    ],
  },
];
