// Klasa 5, dzial 3 "Ideały, autorytety, idole" (NEON, Nowa Era, s. 99-146).
// Mapa stron, plan i wybor tekstow: docs/klasa5-dzial3-idealy-autorytety.md.
//
// Nowy format od dzialu 3 (Bartek, 2026-10-17): przygotuj sie -> kolo z
// poprzedniego tematu (3 pytania, 3 osoby) -> [czytanka i zadania do niej]
// -> film ok. 8 min (3 zadania z minuta na kazde, sprawdzanie z "dlaczego",
// "Zapamiętaj!") -> karty "Ćwiczymy razem" na wlasnych przykladach
// (cwiczenia5dzial3.ts) -> krotka notatka do przepisania na sam koniec.
// Dwa teksty na dzial: Twardowski "Ręce" (30) i "Lewy" (31). Strony lektury
// "Chłopcy z Placu Broni" (s. 100-106) pomijamy - lektury idą osobnymi
// dzialami lektury (wzor: lekturaChlopcy.ts dla kl. 4).
// Screeny z podrecznika tylko przed filmem: ramki i pytania do czytanki,
// renderem z NEON-a (tmp/dzial3/hires/wytnij.py), w buckecie czytanki jako d3-sNNN-*.webp.

import { newId } from './id';
import type { Slide, StudentAction } from './types';
import { plan, slideCzytanka, slideNote, slideTextbookImage, slideTextbookTask, slideTopic, slideVideo, type Topic } from './textbook5slides';

const DZIAL = 'Dział 3 - Ideały, autorytety, idole';

type Akcja = 'zeszyt' | 'ustnie';
const AKCJE: Record<Akcja, [StudentAction, string]> = {
  zeszyt: ['write-answer', 'Do zeszytu'],
  ustnie: ['oral', 'Ustnie'],
};

/** Kolo z poprzedniego tematu na start: 3 pytania, 3 osoby. */
function kolo(questionSetId?: string): Slide[] {
  return questionSetId ? [{ id: newId(), kind: 'recap', questionSetId, mode: 'powtorzeniowe', questionCount: 3 }] : [];
}
/** Screen jednego zadania z podrecznika: "Zadanie N", kod "s. 109 zad. 1" (dziala kolo K). */
function zad(plik: string, page: number, nr: string, akcja: Akcja): Slide {
  const [action, text] = AKCJE[akcja];
  return slideTextbookTask(`czytanki:${plik}.webp`, page, `s. ${page} zad. ${nr}`, `Zadanie ${nr}`, action, text);
}
/** "Na rozgrzewkę" z podrecznika - z kodem, zeby dalo sie losowac kolem. */
function rozgrzewka(plik: string, page: number, akcja: Akcja): Slide {
  const [action, text] = AKCJE[akcja];
  return slideTextbookTask(`czytanki:${plik}.webp`, page, `s. ${page} rozgrzewka`, 'Na rozgrzewkę', action, text);
}
/** Ramka teorii z podrecznika - do obejrzenia przed filmem. */
function ramka(plik: string, page: number, title: string): Slide {
  return slideTextbookImage(`czytanki:${plik}.webp`, page, title);
}
/** "Ćwiczymy razem": 2-3 karty po filmie, przed notatka. */
function razem(...ids: string[]): Slide[] {
  return ids.map((cwiczenieId) => ({ id: newId(), kind: 'cwiczenie', cwiczenieId }));
}

/** Przebieg lekcji w nowym formacie - kroki wspolne, rozni sie film, karty i dodatki. */
function przebieg(opts: { przed?: string[]; film: string; karty: string; dom?: string }): string {
  const kroki = [
    '**Temat + koło** (5 min) - 3 pytania z poprzedniej lekcji, 3 osoby.',
    ...(opts.przed ?? []),
    `**Film** ${opts.film}. Przy zadaniu jest minuta - pasek pokazuje czas, w razie potrzeby zatrzymaj film.`,
    `**Ćwiczymy razem** (reszta lekcji): ${opts.karty}. Wpisujecie albo klikacie na slajdzie, potem „Sprawdź”; na każdy przykład koło (K) losuje osobę.`,
    '**Notatka** (4 min) - 2 zdania do przepisania na sam koniec.',
    ...(opts.dom ? [`Do domu: ${opts.dom}`] : []),
  ];
  return kroki.map((k, i) => `${i + 1}. ${k}`).join('\n');
}

export const DZIAL3_TOPICS: Topic[] = [
  {
    title: '30. „Ręce” - epitet',
    dzial: DZIAL,
    topic: 'Epitet',
    textbookPage: 108,
    teacherPlan: plan(
      ['Co dziś', 'Pierwsza z dwóch lekcji z tekstem w dziale. Krótki wiersz Jana Twardowskiego „Ręce” (s. 108): ręce mamy, które przyniosły na świat, kołysały i nauczyły wszystkiego. Na nim przypominamy epitet (ramka s. 109). Obraz ze s. 99, „O autorytecie” (s. 107) i wiersz Miłosza (s. 109-110) pomijamy - Miłosz zostaje jako zapas.'],
      ['Po lekcji uczeń', [
        '- wyjaśnia, czym jest epitet, i wskazuje go w tekście,',
        '- mówi, co epitety wnoszą do wiersza (obraz, nastrój, cechy osoby),',
        '- zastępuje puste słowa (ładny, fajny) trafnymi epitetami.',
      ].join('\n')],
      ['Przebieg (45 min)', przebieg({
        przed: [
          '**Czytanka „Ręce”** (1 min) + **s. 109 zad. 1** (ramka epitet na kolejnym slajdzie), **zad. 2-4** ustnie (8 min).',
        ],
        film: '„Epitet” (7:19) - co to jest, po co, epitet o człowieku, trafny epitet; 3 zadania',
        karty: '„Który wyraz to epitet?”, „Dobierz epitet”, „Zamiast ładny i dobry”',
      })],
      ['Jak wyjaśnić', [
        '- Epitet odpowiada na pytanie jaki? jaka? jakie? zadane od rzeczownika.',
        '- Bez epitetów tekst jest jak szkic ołówkiem, epitety dodają kolory.',
        '- W „Rękach” epitety mówią więcej o mamie niż o samych rękach: dobra, czuła, opiekuńcza.',
      ].join('\n')],
      ['Odpowiedzi', [
        '- **s. 109 zad. 1** Np. dobre, towarzyskie, suche, ciepłe, (za) słabe.',
        '- **zad. 2** Życie, opiekę i naukę: przyniosła na świat, kołysała, uczyła trzymać łyżkę, rozróżniać drzewa i grzyby, pokazywała świat.',
        '- **zad. 3** Mama czuła, cierpliwa, troskliwa - pierwsza nauczycielka dziecka.',
        '- **zad. 4** Ręce mamy umieją tylko chronić i prowadzić przez życie, nigdy nie skrzywdzą dziecka (dobre są różne odczytania, byle z uzasadnieniem).',
      ].join('\n')],
    ),
    questions: [
      { text: 'Co to jest epitet?', answer: 'Określenie rzeczownika, najczęściej przymiotnik - odpowiada na pytania jaki? jaka? jakie?' },
      { text: 'Wskaż epitet: „Na niebie wisiał srebrny księżyc”.', answer: 'srebrny' },
      { text: 'Dopisz dwa epitety do słowa „jesień”.', answer: 'Np. złota, deszczowa, chłodna.' },
      { text: 'Po co poeci używają epitetów?', answer: 'Żeby zbudować obraz i nastrój, pokazać cechy osób i rzeczy.' },
      { text: 'O czym jest wiersz „Ręce” Jana Twardowskiego?', answer: 'O rękach mamy, które opiekowały się dzieckiem i uczyły je świata.' },
      { text: 'Zamień „fajna” na trafny epitet: fajna piosenka.', answer: 'Np. wesoła, melodyjna, rytmiczna.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('„Ręce” - epitet'),
      ...kolo(previousSetId),
      slideCzytanka('rece'),
      zad('d3-s109-zad1', 109, '1', 'ustnie'),
      ramka('d3-s109-ramka', 109, 'Epitet'),
      zad('d3-s109-zad2', 109, '2', 'ustnie'),
      zad('d3-s109-zad3', 109, '3', 'ustnie'),
      zad('d3-s109-zad4', 109, '4', 'ustnie'),
      slideVideo('epitet5-film1'),
      ...razem('k5d3-epitet-znajdz', 'k5d3-epitet-dobierz', 'k5d3-epitet-zamien'),
      slideNote('Epitet', '**Epitet** to określenie rzeczownika, najczęściej przymiotnik. Odpowiada na pytania: jaki? jaka? jakie? (zimny wiatr, dobre ręce).\nEpitety budują obraz i nastrój tekstu.'),
    ],
  },
  {
    title: '31. Autorytet czy idol? „Lewy” i dedykacja',
    dzial: DZIAL,
    topic: 'Autorytet, idol, dedykacja',
    textbookPage: 110,
    teacherPlan: plan(
      ['Co dziś', 'Druga lekcja z tekstem: fragmenty biografii „Lewy. Chłopak, który zachwycił świat” Yvette Żółtowskiej-Darskiej (s. 110-113) - dzieciństwo Roberta Lewandowskiego: drobny chłopiec, upór, wsparcie rodziców, dwie godziny dojazdu na trening. Książka zaczyna się dedykacją, więc tu poznajemy **dedykację** (ramka s. 113). Film tłumaczy różnicę między **autorytetem** a **idolem** (temat działu, tekst „O autorytecie” ze s. 107 jest za trudny).'],
      ['Po lekcji uczeń', [
        '- odróżnia autorytet od idola i podaje przykłady,',
        '- wyjaśnia, czym jest dedykacja, i rozpoznaje ją w książce,',
        '- opowiada, jakie cechy pomogły bohaterowi tekstu.',
      ].join('\n')],
      ['Przebieg (45 min)', przebieg({
        przed: [
          '**Czytanka „Lewy”** (ok. 5,5 min z lektorem). Na start pytanie: kogo podziwiacie i za co?',
          '**Dedykacja z książki** (slajd) + **s. 113 zad. 1** i ramka, **zad. 2-6** ustnie, co zdążycie (8 min).',
        ],
        film: '„Autorytet czy idol?” (7:18) - autorytet, idol, test na autorytet, dedykacja; 3 zadania',
        karty: '„Autorytet czy idol?”, „Ideał, idol, respekt, autorytet”, „Czy to dedykacja?”',
      })],
      ['Jak wyjaśnić', [
        '- Autorytet szanujemy za to, jak postępuje, i chcemy być tacy jak on. Nie musi być sławny.',
        '- Idola podziwiamy, często za sławę, wygląd, talent. Idol, który dobrze postępuje, bywa też autorytetem - jak Lewandowski dla wielu dzieci.',
        '- Dedykacja stoi przed tekstem: „Dla...”, „Moim rodzicom...”.',
      ].join('\n')],
      ['Odpowiedzi', [
        '- **s. 113 zad. 1** „Dla Mila i Wszystkich Dzieci” - autorka podkreśla, że porażki też mogą przynieść coś dobrego, a potrzeba odwagi, wytrwałości i wiary w siebie.',
        '- **zad. 2** Tata (zapisał na treningi, wierzył w niego: „to jest skarb”), mama (woziła dzieci, organizowała dzień), trener Siwecki (przyjął go do starszej drużyny).',
        '- **zad. 3** Był niski i chudy, trenował ze starszymi i wyższymi, dostał ksywę Bobek, dojeżdżał ponad dwie godziny.',
        '- **zad. 4** Wytrwałość, upór, pracowitość, samozaparcie, pasja.',
        '- **zad. 5** „chudy i niski”, „chucherko”, „nogi jak patyczki”, „mizerny”, „chudziutka postura”, „malutki” - kontrast pokazuje, jak wiele osiągnął mimo słabego startu.',
        '- **zad. 6** Odpowiedzi uczniów.',
      ].join('\n')],
    ),
    questions: [
      { text: 'Czym różni się autorytet od idola?', answer: 'Autorytet szanujemy i bierzemy z niego przykład za to, jak postępuje. Idola podziwiamy, często za sławę i wygląd.' },
      { text: 'Podaj przykład osoby, która może być autorytetem, choć nie jest sławna.', answer: 'Np. babcia, trener, nauczycielka, starszy brat.' },
      { text: 'Co to jest dedykacja?', answer: 'Zapis przed tekstem utworu - mówi, komu autor poświęca dzieło.' },
      { text: 'Gdzie w książce znajdziesz dedykację?', answer: 'Na początku, przed tekstem utworu.' },
      { text: 'Komu autorka zadedykowała książkę „Lewy”?', answer: 'Milowi i Wszystkim Dzieciom.' },
      { text: 'Jakie cechy pomogły Robertowi Lewandowskiemu osiągnąć sukces?', answer: 'Np. wytrwałość, upór, pracowitość, samozaparcie.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Autorytet czy idol? Dedykacja'),
      ...kolo(previousSetId),
      slideCzytanka('lewy'),
      ramka('d3-s110-dedykacja', 110, 'Tak zaczyna się książka'),
      zad('d3-s113-zad1', 113, '1', 'ustnie'),
      ramka('d3-s113-ramka', 113, 'Dedykacja'),
      zad('d3-s113-zad2', 113, '2', 'ustnie'),
      zad('d3-s113-zad3', 113, '3', 'ustnie'),
      zad('d3-s113-zad4', 113, '4', 'ustnie'),
      zad('d3-s113-zad5', 113, '5', 'ustnie'),
      zad('d3-s113-zad6', 113, '6', 'ustnie'),
      slideVideo('autorytet-film1'),
      ...razem('k5d3-autorytet-czy', 'k5d3-idealy-slowa', 'k5d3-dedykacja-czy'),
      slideNote('Autorytet, idol, dedykacja', '**Autorytet** to osoba, którą szanujemy i z której bierzemy przykład. **Idola** podziwiamy, często za sławę.\n**Dedykacja** to zapis przed tekstem utworu: komu autor poświęca dzieło.'),
    ],
  },
  {
    title: '32. Tekst publicystyczny - informacja czy opinia?',
    dzial: DZIAL,
    topic: 'Tekst publicystyczny',
    textbookPage: 116,
    teacherPlan: plan(
      ['Co dziś', 'Ramka „Tekst publicystyczny” (s. 116) bez długiego artykułu „20 najbardziej wpływowych nastolatków” (s. 114-115). Uczymy się odróżniać informację od opinii i rozpoznawać słowa opinii - przyda się przy każdym artykule i filmiku w internecie.'],
      ['Po lekcji uczeń', [
        '- wie, gdzie pojawia się tekst publicystyczny i czym są artykuł i wywiad,',
        '- odróżnia informację (fakt) od opinii,',
        '- wskazuje słowa, które zdradzają opinię: przekonanie, wątpliwość, ocena, uogólnienie.',
      ].join('\n')],
      ['Przebieg (45 min)', przebieg({
        przed: ['**Ramka s. 116** (2 min) - rzut oka.'],
        film: '„Tekst publicystyczny” (7:08) - co to jest, artykuł i wywiad, informacja i opinia, słowa opinii; 3 zadania',
        karty: '„Informacja czy opinia?”, „Słowo, które zdradza opinię”, „Artykuł, wywiad czy coś innego?”',
        dom: 's. 116 zad. 6 albo 7 (debata „Czy warto dążyć do sławy?”) jako zapas na lekcję wychowawczą.',
      })],
      ['Jak wyjaśnić', [
        '- Informację da się sprawdzić (data, liczba, miejsce). Z opinią można się nie zgodzić.',
        '- Szukamy czterech grup słów: sądzę, że (przekonanie), chyba (wątpliwość), najlepszy (ocena), wszyscy (uogólnienie).',
      ].join('\n')],
    ),
    questions: [
      { text: 'Gdzie pojawiają się teksty publicystyczne?', answer: 'W prasie, radiu, telewizji i internecie.' },
      { text: 'Podaj dwa rodzaje tekstów publicystycznych.', answer: 'Artykuł i wywiad.' },
      { text: 'Informacja czy opinia: „Szkołę zbudowano w 1965 roku”?', answer: 'Informacja - da się to sprawdzić.' },
      { text: 'Informacja czy opinia: „To najbrzydszy budynek w mieście”?', answer: 'Opinia - to czyjaś ocena.' },
      { text: 'Podaj dwa słowa, które zdradzają opinię.', answer: 'Np. moim zdaniem, chyba, najlepszy, wszyscy.' },
      { text: 'Czym różni się wywiad od artykułu?', answer: 'Wywiad to rozmowa: pytania dziennikarza i odpowiedzi rozmówcy. Artykuł pisze sam dziennikarz.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Tekst publicystyczny'),
      ...kolo(previousSetId),
      ramka('d3-s116-ramka', 116, 'Tekst publicystyczny'),
      slideVideo('publicystyka-film1'),
      ...razem('k5d3-info-opinia', 'k5d3-slowo-opinii', 'k5d3-czy-publicystyka'),
      slideNote('Tekst publicystyczny', '**Tekst publicystyczny** (artykuł, wywiad) mówi o aktualnych sprawach, informuje i komentuje.\n**Informacja** to fakt, który da się sprawdzić, a **opinia** to czyjeś zdanie (moim zdaniem, chyba, najlepszy, wszyscy).'),
    ],
  },
  {
    title: '33. Co już wiemy o przymiotniku?',
    dzial: DZIAL,
    topic: 'Przymiotnik - odmiana i rodzaj męskoosobowy',
    textbookPage: 117,
    teacherPlan: plan(
      ['Co dziś', 'Przypomnienie przymiotnika z kl. 4 i dwie nowe rzeczy z s. 117-119: rodzaj **męskoosobowy / niemęskoosobowy** w liczbie mnogiej oraz pułapka z przymiotnikami na -cy, -dzy, -czy, -ży (obcy turyści, wyjątek duzi).'],
      ['Po lekcji uczeń', [
        '- dopasowuje przymiotnik do rzeczownika w przypadku, liczbie i rodzaju,',
        '- rozpoznaje rodzaj męskoosobowy i niemęskoosobowy (oni / one),',
        '- tworzy liczbę mnogą przymiotników typu obcy, cudzy, uroczy.',
      ].join('\n')],
      ['Przebieg (45 min)', przebieg({
        przed: ['**Ramki s. 118 i 119** (3 min).'],
        film: '„Przymiotnik” (7:46) - przypomnienie, tabela odmiany, oni / one, pułapka -cy, -czy; 3 zadania',
        karty: '„Dopasuj przymiotnik”, „Oni czy one?”, „Pułapka: liczba mnoga”',
      })],
      ['Jak wyjaśnić', [
        '- Test: o grupie mówimy oni? Męskoosobowy (mili chłopcy, mili rodzice). One? Niemęskoosobowy (miłe psy, miłe dziewczynki).',
        '- Psy, koty, konie to zawsze one - nawet jeśli to samce.',
        '- Obcy, cudzy, uroczy, śpiący: forma w r. męskoosobowym taka sama jak w lp. Duży ➜ duzi to wyjątek.',
      ].join('\n')],
    ),
    questions: [
      { text: 'Przez co odmienia się przymiotnik?', answer: 'Przez przypadki, liczby i rodzaje.' },
      { text: 'Jakie rodzaje ma przymiotnik w liczbie mnogiej?', answer: 'Męskoosobowy i niemęskoosobowy.' },
      { text: 'Oni czy one: „wesołe dziewczyny”?', answer: 'One - rodzaj niemęskoosobowy.' },
      { text: 'Uzupełnij: Rozmawiam z (mądry) babcią.', answer: 'mądrą' },
      { text: 'Podaj liczbę mnogą: obcy pan.', answer: 'obcy panowie - forma się nie zmienia' },
      { text: 'Podaj liczbę mnogą: duży chłopiec.', answer: 'duzi chłopcy - to wyjątek' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Co już wiemy o przymiotniku?'),
      ...kolo(previousSetId),
      ramka('d3-s118-ramka', 118, 'Odmiana przymiotnika'),
      ramka('d3-s119-ramka', 119, 'Przymiotniki na -cy, -dzy, -czy, -ży'),
      slideVideo('przymiotnik5-film1'),
      ...razem('k5d3-przym-forma', 'k5d3-oni-one', 'k5d3-cy-czy'),
      slideNote('Odmiana przymiotnika', 'Przymiotnik odmienia się przez **przypadki, liczby i rodzaje**, tak jak jego rzeczownik. W liczbie mnogiej ma rodzaj **męskoosobowy** (oni: mili chłopcy) i **niemęskoosobowy** (one: miłe psy).\nPrzymiotniki na -cy, -dzy, -czy, -ży w rodzaju męskoosobowym się nie zmieniają: obcy turyści (wyjątek: duzi).'),
    ],
  },
  {
    title: '34. Jak stopniować przymiotniki?',
    dzial: DZIAL,
    topic: 'Stopniowanie przymiotników',
    textbookPage: 120,
    teacherPlan: plan(
      ['Co dziś', 'Stopniowanie (s. 120-121): trzy stopnie, trzy sposoby (regularne, nieregularne, opisowe) i przymiotniki, których nie stopniujemy (metalowa rama, szklany stół).'],
      ['Po lekcji uczeń', [
        '- tworzy stopień wyższy i najwyższy,',
        '- rozpoznaje sposób stopniowania,',
        '- wskazuje przymiotniki, których nie da się stopniować, i mówi dlaczego.',
      ].join('\n')],
      ['Przebieg (45 min)', przebieg({
        przed: ['**Rozgrzewka s. 120** ustnie (2 min) + **ramki s. 120 i 121** (2 min).'],
        film: '„Stopniowanie przymiotników” (7:53) - stopnie, regularnie, nieregularnie, opisowo, bez stopniowania; 3 zadania',
        karty: '„Uzupełnij stopnie”, „Jak stopniujemy?”, „Który stopień?”',
      })],
      ['Jak wyjaśnić', [
        '- Stopień wyższy porównuje dwie rzeczy, najwyższy - jedną ze wszystkich.',
        '- Nieregularnych jest tylko kilka: dobry, zły, duży, mały - trzeba je znać na pamięć.',
        '- Pytanie kontrolne: czy tej cechy może być więcej? Drewniany, polski, kocia - nie.',
      ].join('\n')],
      ['Odpowiedzi', '- **Rozgrzewka s. 120** Ja jestem od ciebie mądrzejszy. Za to ja jestem najmądrzejszy. Formy mówią, ile jest danej cechy.'],
    ),
    questions: [
      { text: 'Wymień trzy stopnie przymiotnika.', answer: 'Równy, wyższy, najwyższy.' },
      { text: 'Stopniuj: miły.', answer: 'milszy, najmilszy' },
      { text: 'Stopniuj: zły.', answer: 'gorszy, najgorszy - nieregularnie' },
      { text: 'Jak stopniujemy przymiotnik „zmęczony”?', answer: 'Opisowo: bardziej zmęczony, najbardziej zmęczony.' },
      { text: 'Czy „szklany” się stopniuje? Dlaczego?', answer: 'Nie - mówi, z czego coś jest.' },
      { text: 'Podaj przymiotnik, który stopniuje się nieregularnie.', answer: 'Np. dobry, zły, duży, mały.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Stopniowanie przymiotników'),
      ...kolo(previousSetId),
      rozgrzewka('d3-s120-rozgrzewka', 120, 'ustnie'),
      ramka('d3-s120-ramka', 120, 'Stopnie przymiotnika'),
      ramka('d3-s121-ramka', 121, 'Sposoby stopniowania'),
      slideVideo('stopniowanie5-film1'),
      ...razem('k5d3-stopnie', 'k5d3-sposob', 'k5d3-stopien-w-zdaniu'),
      slideNote('Stopniowanie przymiotników', 'Stopnie: **równy, wyższy, najwyższy**. Stopniujemy **regularnie** (miły - milszy - najmilszy), **nieregularnie** (dobry - lepszy - najlepszy) albo **opisowo** (bardziej, najbardziej zmęczony).\nNie stopniujemy przymiotników, które mówią, z czego coś jest, skąd jest i czyje jest: drewniany, polski, kocia.'),
    ],
  },
  {
    title: '35. Ludzie filmu i gatunki filmowe',
    dzial: DZIAL,
    topic: 'Ludzie filmu, rodzaje i gatunki filmów',
    textbookPage: 124,
    teacherPlan: plan(
      ['Co dziś', '„Świat kultury” (s. 124-130): kto tworzy film (ilustracja planu filmowego s. 124-125), rodzaje filmów (fabularny, dokumentalny, animowany) i gatunki (s. 128-130). Tekst B. Burtta o dźwiękach w „Gwiezdnych wojnach” (s. 126-127) pomijamy - ciekawostkę o dźwiękach ma film. Przygotowuje do sprawozdania z filmu na następnej lekcji.'],
      ['Po lekcji uczeń', [
        '- nazywa zawody filmowe i mówi, czym się zajmują,',
        '- odróżnia film fabularny, dokumentalny i animowany,',
        '- rozpoznaje gatunki filmowe po opisie.',
      ].join('\n')],
      ['Przebieg (45 min)', przebieg({
        przed: ['Na start: jaki film ostatnio oglądaliście? Kto go zrobił?'],
        film: '„Ludzie filmu” (7:22) - zawody na planie i po zdjęciach, rodzaje filmów, gatunki; 3 zadania',
        karty: '„Kto to robi na planie?”, „Jaki to rodzaj filmu?”, „Jaki to gatunek?”',
        dom: '„Wśród ludzi” s. 130 - jak zachowujemy się w kinie (do przeczytania).',
      })],
      ['Jak wyjaśnić', [
        '- Reżyser to „kapitan” filmu, scenarzysta daje mu „mapę” (scenariusz).',
        '- Rodzaj filmu mówi, jak powstał (aktorzy, prawdziwe wydarzenia, animacja). Gatunek mówi, o czym jest i jaki ma nastrój.',
      ].join('\n')],
    ),
    questions: [
      { text: 'Kto kieruje pracą ekipy filmowej?', answer: 'Reżyser.' },
      { text: 'Co robi charakteryzator?', answer: 'Zmienia wygląd aktorów: makijaż, peruki, brody.' },
      { text: 'Kto zastępuje aktora w niebezpiecznych scenach?', answer: 'Kaskader.' },
      { text: 'Czym różni się film dokumentalny od fabularnego?', answer: 'Dokumentalny pokazuje prawdziwe wydarzenia, fabularny - wymyśloną historię z aktorami.' },
      { text: 'Jak powstaje film animowany?', answer: 'Z rysunków, lalek albo grafiki komputerowej.' },
      { text: 'Podaj trzy gatunki filmowe.', answer: 'Np. komedia, kryminał, fantasy, western, musical.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Ludzie filmu i gatunki filmowe'),
      ...kolo(previousSetId),
      slideVideo('ludzie-filmu-film1'),
      ...razem('k5d3-zawod', 'k5d3-rodzaj-filmu', 'k5d3-gatunek'),
      slideNote('Ludzie filmu', 'Film tworzą m.in. **reżyser** (kieruje), **scenarzysta** (pisze scenariusz), **operator** (filmuje), **scenograf**, **charakteryzator**, **kaskader** i **montażysta**.\nFilmy są **fabularne, dokumentalne i animowane**, a gatunki to np. komedia, kryminał, fantasy, science fiction, western, musical.'),
    ],
  },
  {
    title: '36. Sprawozdanie z filmu lub spektaklu',
    dzial: DZIAL,
    topic: 'Sprawozdanie z filmu lub spektaklu',
    textbookPage: 131,
    teacherPlan: plan(
      ['Co dziś', 'Sprawozdanie znamy z działu 2. Teraz z filmu albo spektaklu (s. 131-133): co we wstępie, co w rozwinięciu (krótko o treści + środki wyrazu), co w zakończeniu (ocena). Wzór z uwagami na s. 132.'],
      ['Po lekcji uczeń', [
        '- zna plan sprawozdania z filmu lub spektaklu,',
        '- odrzuca zbędne informacje i nie zdradza zakończenia,',
        '- nazywa środki wyrazu: gra aktorów, muzyka, scenografia, kostiumy, charakteryzacja, efekty.',
      ].join('\n')],
      ['Przebieg (45 min)', przebieg({
        przed: ['**Ramka s. 131 i wzór s. 132** (3 min) - rzut oka na strzałki przy wzorze.'],
        film: '„Sprawozdanie z filmu lub spektaklu” (7:47) - plan, czego nie pisać, słowniczek widza; 3 zadania',
        karty: '„Gdzie w sprawozdaniu z filmu?”, „Co chwali to zdanie?”',
        dom: 's. 133 zad. 3 - sprawozdanie z ostatnio obejrzanego filmu lub spektaklu.',
      })],
      ['Jak wyjaśnić', [
        '- Sprawozdanie to nie streszczenie: 2-3 zdania o treści, reszta o tym, jak film zrobiono i jak na nas działał.',
        '- Zakończenie = ocena + „bo...”. Samo „fajny” to za mało.',
      ].join('\n')],
    ),
    questions: [
      { text: 'Co piszemy we wstępie sprawozdania z filmu?', answer: 'Kiedy, gdzie i z kim oglądaliśmy, tytuł, reżysera, gatunek.' },
      { text: 'Czego nie piszemy w rozwinięciu?', answer: 'Całej historii scena po scenie i zakończenia.' },
      { text: 'Wymień trzy środki wyrazu w filmie.', answer: 'Np. gra aktorów, muzyka, scenografia, kostiumy, efekty specjalne.' },
      { text: 'Co to jest scenografia?', answer: 'Dekoracje i rekwizyty.' },
      { text: 'Co jest w zakończeniu sprawozdania z filmu?', answer: 'Ocena z uzasadnieniem, czasem polecenie.' },
      { text: 'Co to jest premiera?', answer: 'Pierwszy pokaz filmu albo spektaklu.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Sprawozdanie z filmu lub spektaklu'),
      ...kolo(previousSetId),
      ramka('d3-s131-ramka', 131, 'Jak napisać sprawozdanie z filmu lub ze spektaklu?'),
      ramka('d3-s132-wzor', 132, 'Wzór sprawozdania z filmu'),
      slideVideo('sprawozdanie-film-film1'),
      ...razem('k5d3-spr-czesc', 'k5d3-srodki'),
      slideNote('Sprawozdanie z filmu', '**Wstęp:** kiedy, gdzie, z kim, tytuł, reżyser. **Rozwinięcie:** krótko o treści i środki wyrazu (gra aktorów, muzyka, scenografia, kostiumy). **Zakończenie:** ocena z uzasadnieniem.\nNie streszczam wszystkiego i nie zdradzam zakończenia.'),
    ],
  },
  {
    title: '37. Liczebnik główny i porządkowy',
    dzial: DZIAL,
    topic: 'Liczebnik główny i porządkowy',
    textbookPage: 134,
    teacherPlan: plan(
      ['Co dziś', 'Nowa część mowy: liczebnik (s. 134-135). Liczebniki główne (ile?) i porządkowe (który?), ich odmiana, czytanie dat (5 maja = piątego maja) i formy dwaj / dwóch przy mężczyznach.'],
      ['Po lekcji uczeń', [
        '- odróżnia liczebnik główny od porządkowego,',
        '- zapisuje słowami liczebnik porządkowy w dobrej formie,',
        '- używa form dwa / dwie / dwaj i „pięć jabłek”.',
      ].join('\n')],
      ['Przebieg (45 min)', przebieg({
        przed: ['**Rozgrzewka s. 134** ustnie (2 min) + **ramka s. 134** (2 min).'],
        film: '„Liczebnik” (7:23) - główny i porządkowy, odmiana, daty, dwaj chłopcy, od pięciu w górę; 3 zadania',
        karty: '„Główny czy porządkowy?”, „Napisz słowami”, „Dwa, dwie czy dwaj?”',
      })],
      ['Jak wyjaśnić', [
        '- Zadaj pytanie: ile? - główny; który? - porządkowy.',
        '- Porządkowe zachowują się jak przymiotniki (pierwszy, pierwsza, pierwsze).',
        '- Datę z cyfrą czytamy porządkowo: 12 marca = dwunastego marca.',
      ].join('\n')],
      ['Odpowiedzi', '- **Rozgrzewka s. 134** trzy (ile? - łączy się z rzeczownikiem dni), czternastej (o której? - godzina). Główny i porządkowy.'],
    ),
    questions: [
      { text: 'Co to jest liczebnik?', answer: 'Odmienna część mowy, która określa liczbę albo kolejność.' },
      { text: 'Czym różni się liczebnik główny od porządkowego?', answer: 'Główny odpowiada na pytanie ile?, porządkowy - który?' },
      { text: 'Główny czy porządkowy: „szósty”?', answer: 'Porządkowy.' },
      { text: 'Jak przeczytasz datę 3 maja?', answer: 'trzeciego maja' },
      { text: 'Dwa czy dwaj: „... lekarze”?', answer: 'dwaj (albo dwóch) lekarze' },
      { text: 'Popraw: „osiem złote”.', answer: 'osiem złotych' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Liczebnik główny i porządkowy'),
      ...kolo(previousSetId),
      rozgrzewka('d3-s134-rozgrzewka', 134, 'ustnie'),
      ramka('d3-s134-ramka', 134, 'Liczebnik'),
      slideVideo('liczebnik-film1'),
      ...razem('k5d3-gl-por', 'k5d3-porz-slownie', 'k5d3-dwa-dwie-dwaj'),
      slideNote('Liczebnik', '**Liczebnik** określa liczbę albo kolejność. **Główny** odpowiada na pytanie ile? (pięć), **porządkowy** - który? (piąty).\nPorządkowe odmieniają się jak przymiotniki: 5 maja czytamy piątego maja.'),
    ],
  },
  {
    title: '38. Liczebnik zbiorowy. W którym roku?',
    dzial: DZIAL,
    topic: 'Liczebnik zbiorowy, odmiana liczebników w latach',
    textbookPage: 136,
    teacherPlan: plan(
      ['Co dziś', 'Liczebniki zbiorowe (s. 136-137): dwoje, troje, czworo - kiedy ich używamy i jak się odmieniają. Do tego mówienie o latach: odmieniamy tylko dwa ostatnie wyrazy (w dwa tysiące dwudziestym szóstym roku).'],
      ['Po lekcji uczeń', [
        '- wie, kiedy użyć liczebnika zbiorowego,',
        '- odmienia dwoje, troje, czworo przez przypadki,',
        '- poprawnie mówi i zapisuje słowami rok.',
      ].join('\n')],
      ['Przebieg (45 min)', przebieg({
        przed: ['**Ramki s. 136** (3 min): lata, potem liczebniki zbiorowe.'],
        film: '„Liczebnik zbiorowy” (7:26) - kiedy zbiorowy, kto jest w grupie, odmiana, lata; 3 zadania',
        karty: '„Zbiorowy czy zwykły?”, „Odmień liczebnik zbiorowy”, „W którym roku?”',
      })],
      ['Jak wyjaśnić', [
        '- Dwóch uczniów - chłopcy, dwie uczennice - dziewczynki, dwoje uczniów - chłopiec i dziewczynka.',
        '- Zbiorowy zawsze przy dzieciach i młodych zwierzętach: troje dzieci, czworo kociąt, i przy drzwiach, saniach, skrzypcach.',
        '- „Dwutysięczny dwudziesty szósty” to błąd - początek roku się nie odmienia.',
      ].join('\n')],
    ),
    questions: [
      { text: 'Podaj trzy liczebniki zbiorowe.', answer: 'Np. dwoje, troje, czworo.' },
      { text: 'Kiedy używamy liczebników zbiorowych?', answer: 'Przy dzieciach i młodych zwierzętach, grupach kobiet i mężczyzn i rzeczownikach tylko w liczbie mnogiej.' },
      { text: 'Kim są „dwoje uczniów”?', answer: 'Chłopiec i dziewczynka.' },
      { text: 'Uzupełnij: Idę z (dwoje) dzieci.', answer: 'dwojgiem' },
      { text: 'Jak powiesz: rok 2026 - w ... roku?', answer: 'w dwa tysiące dwudziestym szóstym roku' },
      { text: 'Zbiorowy czy zwykły: „... (5) długopisów”?', answer: 'pięć - zwykły, bo długopisy to zwykłe rzeczy' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Liczebnik zbiorowy'),
      ...kolo(previousSetId),
      ramka('d3-s136-ramka', 136, 'Liczebniki zbiorowe'),
      ramka('d3-s136-ramka-lata', 136, 'W którym roku?'),
      slideVideo('liczebnik-zbiorowy-film1'),
      ...razem('k5d3-zbiorowy-czy', 'k5d3-zbiorowy-odmiana', 'k5d3-rok'),
      slideNote('Liczebnik zbiorowy', '**Liczebniki zbiorowe** (dwoje, troje, czworo) łączymy z dziećmi, młodymi zwierzętami, grupami kobiet i mężczyzn oraz z rzeczownikami tylko w liczbie mnogiej. Odmieniają się przez przypadki: dwojga, dwojgu, dwojgiem.\nW latach odmieniamy dwa ostatnie wyrazy: w dwa tysiące dwudziestym szóstym roku.'),
    ],
  },
  {
    title: '39. Kropka a liczby. Zapisywanie dat',
    dzial: DZIAL,
    topic: 'Kropka a liczby. Zapisywanie dat',
    textbookPage: 138,
    teacherPlan: plan(
      ['Co dziś', 'Interpunkcja (s. 138-139): trzy sposoby zapisu daty i kropka po liczebniku porządkowym zapisanym cyfrą. Kiedy kropkę pomijamy: godziny, dzień przed nazwą miesiąca, cyfry rzymskie.'],
      ['Po lekcji uczeń', [
        '- zapisuje datę trzema sposobami,',
        '- stawia kropkę po cyfrze oznaczającej liczebnik porządkowy,',
        '- wie, kiedy kropki nie stawiamy.',
      ].join('\n')],
      ['Przebieg (45 min)', przebieg({
        przed: ['**Rozgrzewka s. 138** ustnie (2 min) + **ramka s. 138** (2 min).'],
        film: '„Kropka a liczby. Daty” (7:29) - trzy zapisy daty, miesiące po rzymsku, kropka po liczebniku, kiedy bez kropki; 3 zadania',
        karty: '„Dobrze czy źle zapisana data?”, „Z kropką czy bez?”, „Zapisz datę inaczej”',
        dom: 's. 138 zad. 1 - data urodzin na trzy sposoby.',
      })],
      ['Jak wyjaśnić', [
        '- Same cyfry arabskie: kropki między dniem, miesiącem i rokiem. Gdy miesiąc jest rzymski albo słowami - po dniu nic.',
        '- Kropka po cyfrze mówi: czytaj porządkowo (8. = ósmy).',
        '- Nazwa miesiąca w dacie zawsze w dopełniaczu: 1 stycznia, nie 1 styczeń.',
      ].join('\n')],
      ['Odpowiedzi', '- **Rozgrzewka s. 138** 21 stycznia 2019 r. - Dzień Babci, 31 XII 2018 r. - sylwester, 14.02.2019 r. - walentynki. Różnią się zapisem miesiąca: słowami, cyfrą rzymską, cyfrą arabską.'],
    ),
    questions: [
      { text: 'Kiedy w dacie stawiamy kropki?', answer: 'Gdy cała data jest zapisana cyframi arabskimi: 17.10.2026.' },
      { text: 'Zapisz 1 maja 2027 r. z miesiącem cyfrą rzymską.', answer: '1 V 2027' },
      { text: 'Czy po dniu stawiamy kropkę w zapisie „12 października”?', answer: 'Nie.' },
      { text: 'Gdzie postawisz kropkę: „Mieszkam na 5 piętrze”?', answer: 'Po piątce: na 5. piętrze.' },
      { text: 'Czy po godzinie piszemy kropkę: „o godzinie 8”?', answer: 'Nie.' },
      { text: 'Jaki miesiąc to XI?', answer: 'Listopad.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Kropka a liczby. Zapisywanie dat'),
      ...kolo(previousSetId),
      rozgrzewka('d3-s138-rozgrzewka', 138, 'ustnie'),
      ramka('d3-s138-ramka', 138, 'Zapisywanie dat'),
      slideVideo('daty-film1'),
      ...razem('k5d3-data-dobrze', 'k5d3-kropka', 'k5d3-data-zapisz'),
      slideNote('Kropka a liczby', 'Kropki stawiamy w dacie z samych cyfr arabskich: 17.10.2026. Gdy miesiąc jest cyfrą rzymską albo słowami, po dniu kropki nie ma: 17 X 2026, 17 października 2026 r.\nKropka po cyfrze oznacza liczebnik porządkowy: na 8. piętrze (ale: o godzinie 17, XX wiek).'),
    ],
  },
  {
    title: '40. Pisownia ó i u - przypomnienie i zdrobnienia',
    dzial: DZIAL,
    topic: 'Pisownia wyrazów z ó i u',
    textbookPage: 140,
    teacherPlan: plan(
      ['Co dziś', 'Ortografia (s. 140-143): przypomnienie zasad ó i u, nowa zasada - u w zakończeniach zdrobnień (ramka s. 142) - i wyrazy, które brzmią tak samo, a znaczą co innego (lód - lud, s. 143 zad. 9).'],
      ['Po lekcji uczeń', [
        '- uzasadnia pisownię ó wymiennego i ó w -ów, -ówka, -ówna,',
        '- pisze u w zakończeniach -unek, -us, -usz, -uch, -ura, -ulec, -uj, -uje,',
        '- tworzy zdrobnienia z u: kotuś, malutki, serduszko.',
      ].join('\n')],
      ['Przebieg (45 min)', przebieg({
        przed: ['**Rozgrzewka s. 140** do zeszytu albo ustnie (4 min) + **ramki s. 140 i 142** (2 min).'],
        film: '„Ó czy u?” (7:59) - ó, u, słownik, zdrobnienia, lód i lud; 3 zadania',
        karty: '„Ó czy u?”, „Utwórz zdrobnienie”, „Dlaczego tak?”',
      })],
      ['Jak wyjaśnić', [
        '- Przy ó szukaj wymiany: stół - stoły, wóz - wozy. Brak wymiany i brak zasady? Słownik.',
        '- Zdrobnienia brzmią czule: kotuś, mamusia, malutki - tam zawsze u.',
      ].join('\n')],
      ['Odpowiedzi', '- **Rozgrzewka s. 140** przywódców, pobudza umysł; nauki, humor, szybszemu zapamiętywaniu; nastrój, budzi, uspokaja; pomysłów, głód, przygód; uspokaja, usypia, zaufanie; smutek, bunt. Ó wymienne: nastrój (nastroje), głód (głodny), przygód (przygoda).'],
    ),
    questions: [
      { text: 'Podaj jedną zasadę pisowni ó.', answer: 'Np. ó wymienia się na o, e, a (stół - stoły) albo jest w -ów, -ówka, -ówna.' },
      { text: 'Dlaczego „stół” piszemy przez ó?', answer: 'Bo stoły - ó wymienia się na o.' },
      { text: 'Podaj dwa zakończenia, w których piszemy u.', answer: 'Np. -unek, -usz, -uch, -ura, -ulec, -uje.' },
      { text: 'Utwórz zdrobnienie z u od słowa „mama”.', answer: 'mamusia' },
      { text: 'Czym różni się lód od ludu?', answer: 'Lód to zamarznięta woda, lud to mieszkańcy kraju.' },
      { text: 'Ó czy u: Piotrk...w?', answer: 'Piotrków - ó, bo zakończenie -ów.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Pisownia ó i u'),
      ...kolo(previousSetId),
      rozgrzewka('d3-s140-rozgrzewka', 140, 'zeszyt'),
      ramka('d3-s140-ramka', 140, 'Pisownia ó i u - przypomnienie'),
      ramka('d3-s142-ramka', 142, 'U w zdrobnieniach'),
      slideVideo('o-u5-film1'),
      ...razem('k5d3-o-u-litera', 'k5d3-zdrobnienia', 'k5d3-o-u-uzasadnij'),
      slideNote('Pisownia ó i u', '**Ó** wymienia się na o, e, a (stół - stoły) i jest w zakończeniach -ów, -ówka, -ówna. **U** piszemy w -unek, -us, -usz, -uch, -ura, -ulec, -uj, -uje oraz na początku i końcu wyrazu.\nW zakończeniach **zdrobnień** zawsze piszemy u: kotuś, malutki, kwiatuszek.'),
    ],
  },
  {
    title: '41. Podsumowanie działu 3 - To wiem! To potrafię!',
    dzial: DZIAL,
    topic: 'Ideały, autorytety, idole - podsumowanie działu',
    textbookPage: 144,
    teacherPlan: plan(
      ['Co dziś', 'Podsumowanie na mapie ze s. 144 i film przekrojowy z całego działu. Test ze s. 145-146 (wywiad z Andrzejem Maleszką o „Magicznym drzewie”) zostaje jako zapas albo zadanie domowe - sprawdza publicystykę, epitety, przymiotniki, liczebniki i sprawozdanie z filmu.'],
      ['Po lekcji uczeń', [
        '- przypomina pojęcia działu: epitet, autorytet, idol, dedykacja, tekst publicystyczny, sprawozdanie z filmu,',
        '- odmienia i stopniuje przymiotniki, używa liczebników,',
        '- poprawnie zapisuje daty i wyrazy z ó i u,',
        '- sam ocenia, co już umie przed sprawdzianem.',
      ].join('\n')],
      ['Przebieg (45 min)', przebieg({
        przed: ['**Mapa s. 144** (2 min).'],
        film: '„To wiem! To potrafię!” (8:06) - słowa i teksty, przymiotnik, liczebnik, pisownia; 3 zadania',
        karty: '„Powtórka: słowa i teksty”, „Powtórka: język i pisownia”',
        dom: 'test s. 145-146 (wybrane zadania) albo zeszyt powtórzeniowy przed sprawdzianem.',
      })],
    ),
    questions: [
      { text: 'Co to jest epitet? Podaj przykład.', answer: 'Określenie rzeczownika, np. szumiący las.' },
      { text: 'Czym różni się informacja od opinii?', answer: 'Informację da się sprawdzić, opinia to czyjeś zdanie.' },
      { text: 'Podaj dwa przymiotniki, które stopniują się nieregularnie.', answer: 'Np. dobry, zły, duży, mały.' },
      { text: 'Podaj liczebnik zbiorowy z rzeczownikiem.', answer: 'Np. troje dzieci, czworo kociąt.' },
      { text: 'Zapisz 8 marca 2027 r. z miesiącem cyfrą rzymską.', answer: '8 III 2027' },
      { text: 'Dlaczego „malutki” piszemy przez u?', answer: 'Bo to zdrobnienie - zakończenie -utki.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Ideały, autorytety, idole - podsumowanie'),
      ...kolo(previousSetId),
      ramka('d3-s144-mapa', 144, 'Mapa działu - to wszystko dziś powtórzymy'),
      slideVideo('podsumowanie5-dzial3-film1'),
      ...razem('k5d3-powt-slowa', 'k5d3-powt-jezyk'),
      slideNote('Podsumowanie działu 3', 'Przed sprawdzianem powtarzam: epitet, autorytet i idol, dedykacja, tekst publicystyczny (informacja i opinia), sprawozdanie z filmu.\nJęzyk: odmiana i stopniowanie przymiotnika, liczebnik główny, porządkowy i zbiorowy, kropka w datach, ó i u.'),
    ],
  },
];
