// Klasa 4, rozdzial III "Od pomysłu do działania" (GWO "Między nami 4", s. 93-124).
// Mapa stron, plan i scenariusze filmow: docs/klasa4-rozdzial3-od-pomyslu.md.
//
// Nowy format od rozdzialu III (Bartek, 2026-10-17): przygotuj sie -> kolo
// z poprzedniego tematu (3 pytania, 3 osoby) -> film ok. 8 min (3 zadania
// z minuta na kazde, sprawdzanie z "dlaczego") -> karty "Ćwiczymy razem" na
// wlasnych przykladach -> krotka notatka do przepisania na sam koniec.
// Dwa teksty na rozdzial: Grabarczyk (lekcja 30) i Vestly (podsumowanie).
// Dzien tematyczny z Korczakiem (s. 94-98) pominiety. Screenow z
// podrecznika nie ma - dostep do multibooka "Między nami" wygasl.

import { newId } from './id';
import type { Slide } from './types';
import { plan, slideCzytanka, slideNote, slideTopic, slideVideo, type Topic } from './textbook5slides';

export const ROZDZIAL_3 = 'Rozdział III. Od pomysłu do działania';

/** Kolo z poprzedniego tematu na start: 3 pytania, 3 osoby. */
function kolo(questionSetId?: string): Slide[] {
  return questionSetId ? [{ id: newId(), kind: 'recap', questionSetId, mode: 'powtorzeniowe', questionCount: 3 }] : [];
}

/** "Ćwiczymy razem" (src/data/cwiczenia4.ts): 2-3 karty po filmie, przed notatka. */
function razem(...ids: string[]): Slide[] {
  return ids.map((cwiczenieId) => ({ id: newId(), kind: 'cwiczenie', cwiczenieId }));
}

/** Przebieg lekcji w nowym formacie - kroki wspolne, rozni sie film, karty i dodatki. */
function przebieg(opts: { przed?: string[]; film: string; karty: string; notatka?: string; dom?: string }): string {
  const kroki = [
    '**Temat + koło** (5 min) - 3 pytania z poprzedniej lekcji, 3 osoby.',
    ...(opts.przed ?? []),
    `**Film** ${opts.film}. Przy zadaniu jest minuta - pasek pokazuje czas, w razie potrzeby zatrzymaj film.`,
    `**Ćwiczymy razem** (reszta lekcji): ${opts.karty}. Wpisujecie albo klikacie na slajdzie, potem „Sprawdź”; na każdy przykład koło (K) losuje osobę.`,
    `**Notatka** (4 min) - ${opts.notatka ?? '2 zdania do przepisania na sam koniec'}.`,
    ...(opts.dom ? [`Do domu: ${opts.dom}`] : []),
  ];
  return kroki.map((k, i) => `${i + 1}. ${k}`).join('\n');
}

export const ROZDZIAL3_TOPICS: Topic[] = [
  {
    title: '30. Przedsiębiorczy, czyli jaki?',
    dzial: ROZDZIAL_3,
    topic: 'Przedsiębiorczość i przysłowia',
    textbookPage: 99,
    teacherPlan: plan(
      ['Co dziś', 'Pierwsza z dwóch lekcji z tekstem w tym rozdziale. Krótki tekst Karoliny Grabarczyk „I ty możesz zmienić świat” (s. 99-101) - dwie prawdziwe historie: Mikaila Ulmer i lemoniada, która pomaga pszczołom, oraz Chester Greenwood, który jako 15-latek wymyślił nauszniki. Dzień tematyczny z Korczakiem (s. 94-98) pomijamy. Potem film: cechy osoby przedsiębiorczej i przysłowia.'],
      ['Po lekcji uczeń', [
        '- wyjaśnia, że przedsiębiorczość to pomysł + działanie,',
        '- nazywa cechy osoby przedsiębiorczej (zaradny, kreatywny, wytrwały, odważny, odpowiedzialny),',
        '- wie, czym jest przysłowie, i dopasowuje je do sytuacji.',
      ].join('\n')],
      ['Przebieg (45 min)', przebieg({
        przed: [
          '**Czytanka „I ty możesz zmienić świat”** (ok. 4 min z lektorem) + **s. 101 zad. 1** ustnie (3 min).',
        ],
        film: '„Przedsiębiorczy, czyli jaki?” (9:03) - pomysł + działanie, cechy i przysłowia, 3 zadania',
        karty: '„Jaka to cecha?”, „Dokończ przysłowie”, „Co znaczy przysłowie?”',
      })],
      ['Jak wyjaśnić', [
        '- Sam pomysł to za mało, samo działanie bez pomysłu też. Przedsiębiorczość = jedno i drugie.',
        '- Nie trzeba mieć firmy: zbiórka karmy dla schroniska też jest przedsiębiorcza.',
        '- Przysłowie mówi o życiu wszystkich ludzi, nie o jednej sytuacji. Pytamy: co znaczy dosłownie, a co naprawdę?',
      ].join('\n')],
      ['Odpowiedzi', '- **s. 101 zad. 1** Przepis na lemoniadę Mikaila znalazła w starej książce kucharskiej prababci. Pszczołami zainteresowała się, bo dwa razy ją użądliły. Sprzedaje lemoniadę z hasłem „Kup butelkę, ocal pszczołę”, część zysku oddaje na ratowanie pszczół, prowadzi warsztaty i udziela wywiadów. Patent to prawo wyłącznego korzystania z wynalazku - Chester Greenwood dostał go na nauszniki. „Nausznikowa stolica świata” - fabryka w Farmington robiła 400 tysięcy nauszników rocznie.'],
    ),
    questions: [
      { text: 'Czym jest przedsiębiorczość? Uzupełnij: pomysł + ...', answer: 'działanie' },
      { text: 'Jaka to cecha: Ola uczy się żonglować i po każdym upadku piłek próbuje dalej?', answer: 'wytrwałość - Ola jest wytrwała' },
      { text: 'Jaka to cecha: Jaś z pudełek po butach zrobił garaż dla resoraków?', answer: 'kreatywność - Jaś jest kreatywny' },
      { text: 'Dokończ przysłowie: Kto rano wstaje, ...', answer: 'temu Pan Bóg daje' },
      { text: 'Co znaczy przysłowie „Nie od razu Kraków zbudowano”?', answer: 'Na wielkie rzeczy potrzeba czasu i cierpliwości.' },
      { text: 'Czym przysłowie różni się od zwykłego zdania?', answer: 'Jest krótkie, mądre, powtarzane od dawna i mówi o życiu wszystkich ludzi.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Przedsiębiorczy, czyli jaki?'),
      ...kolo(previousSetId),
      slideCzytanka('i-ty-mozesz-zmienic-swiat'),
      slideVideo('przedsiebiorczy-film1'),
      ...razem('k4-przedsiebiorczy-cecha', 'k4-przyslowia-dokoncz', 'k4-przyslowia-znaczenie'),
      slideNote('Przedsiębiorczy, czyli jaki?', '**Przedsiębiorczość** to pomysł + działanie. Osoba przedsiębiorcza jest zaradna, kreatywna, wytrwała, odważna i odpowiedzialna.\n**Przysłowie** to krótkie, mądre zdanie powtarzane od dawna, np. Kto pyta, nie błądzi.'),
    ],
  },
  {
    title: '31. Przymiotnik - król opisu',
    dzial: ROZDZIAL_3,
    topic: 'Przymiotnik',
    textbookPage: 102,
    teacherPlan: plan(
      ['Co dziś', 'Pierwsza z dwóch lekcji o przymiotniku (w podręczniku temat 3-4 na dwie godziny). Dziś: co nazywa przymiotnik, pytania jaki? jaka? jakie?, łączenie z rzeczownikiem i pułapka „szybko”. Odmiana na następnej lekcji.'],
      ['Po lekcji uczeń', [
        '- wie, że przymiotnik nazywa cechy i właściwości,',
        '- rozpoznaje przymiotnik pytaniem jaki? jaka? jakie? zadanym od rzeczownika,',
        '- dobiera przymiotnik do rzeczownika,',
        '- odróżnia przymiotnik od wyrazów, które odpowiadają na pytanie jak? (szybko).',
      ].join('\n')],
      ['Przebieg (45 min)', przebieg({
        film: '„Przymiotnik - król opisu” (8:36) - cechy i właściwości, przymiotnik słucha rzeczownika, pułapka „szybko”, 3 zadania',
        karty: '„Jaki? Jaka? Jakie?”, „Przymiotnik czy nie?”, „O czym mówi przymiotnik?”',
      })],
      ['Jak wyjaśnić', [
        '- „Mam psa” i „Mam małego, rudego psa” - po którym zdaniu widzicie psa? To robota przymiotników.',
        '- Najpierw rzeczownik, potem pytanie: pies - jaki? rudy.',
        '- Zielony ogórek, zielona żaba, zielone jabłko - końcówkę wybiera rzeczownik.',
        '- Szybko odpowiada na pytanie jak? - to nie przymiotnik.',
      ].join('\n')],
    ),
    questions: [
      { text: 'Na jakie pytania odpowiada przymiotnik?', answer: 'jaki? jaka? jakie?' },
      { text: 'Znajdź przymiotnik: „Na stole leży okrągły tort”.', answer: 'okrągły' },
      { text: 'Przymiotnik czy nie: „głośno”?', answer: 'Nie - odpowiada na pytanie jak?' },
      { text: 'Dopisz dwa przymiotniki do słowa „lato”.', answer: 'np. gorące, słoneczne, długie' },
      { text: 'Dokończ w dobrej formie: zielony liść, ... trawa.', answer: 'zielona trawa' },
      { text: 'Jaki to przymiotnik - mówi o kolorze czy o materiale: „wełniany”?', answer: 'O materiale - z wełny.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Przymiotnik - król opisu'),
      ...kolo(previousSetId),
      slideVideo('przymiotnik-film1'),
      ...razem('k4-przymiotnik-jaki', 'k4-przymiotnik-czy', 'k4-przymiotnik-grupy'),
      slideNote('Przymiotnik - król opisu', '**Przymiotnik** nazywa cechy i właściwości ludzi, zwierząt, roślin i przedmiotów.\nOdpowiada na pytania: **jaki? jaka? jakie?**, np. wesoły pies, drewniana ławka.'),
    ],
  },
  {
    title: '32. Odmiana przymiotnika',
    dzial: ROZDZIAL_3,
    topic: 'Odmiana przymiotnika',
    textbookPage: 104,
    teacherPlan: plan(
      ['Co dziś', 'Druga lekcja o przymiotniku: odmiana przez rodzaje, liczby i przypadki. Przypadki znamy z rzeczownika (rozdział II) - przymiotnik idzie za rzeczownikiem jak cień.'],
      ['Po lekcji uczeń', [
        '- dopasowuje przymiotnik do rodzaju rzeczownika (ten, ta, to),',
        '- rozróżnia w liczbie mnogiej formy męskoosobowe (ci mądrzy) i niemęskoosobowe (te mądre),',
        '- odmienia przymiotnik z rzeczownikiem przez przypadki.',
      ].join('\n')],
      ['Przebieg (45 min)', przebieg({
        film: '„Odmiana przymiotnika” (8:03) - rodzaje, liczby, przypadki, 3 zadania',
        karty: '„Ten, ta, to”, „Ci czy te?”, „Odmieniamy parę”',
      })],
      ['Jak wyjaśnić', [
        '- Test ten / ta / to: ten mądry, ta mądra, to mądre.',
        '- W liczbie mnogiej test ci / te. Ci - gdy w grupie jest choć jeden chłopiec albo mężczyzna. Psy to nie osoby: te psy.',
        '- Przypadki pytamy tak samo jak przy rzeczowniku: nie ma (kogo? czego?) czerwonego autobusu.',
      ].join('\n')],
    ),
    questions: [
      { text: 'Dopisz „duży” w dobrej formie: ... okno.', answer: 'duże okno' },
      { text: 'Ci czy te: (mili / miłe) koleżanki?', answer: 'miłe koleżanki - te' },
      { text: 'Ci czy te: (zdolni / zdolne) piłkarze?', answer: 'zdolni piłkarze - ci' },
      { text: 'Dokończ: Nie mam ... (nowy) zeszytu.', answer: 'nowego' },
      { text: 'Dokończ: Jadę na wycieczkę z ... (starszy) bratem.', answer: 'starszym' },
      { text: 'Popraw błąd: „Bawię się z moim siostrą”.', answer: 'z moją siostrą' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Odmiana przymiotnika'),
      ...kolo(previousSetId),
      slideVideo('przymiotnik-odmiana-film1'),
      ...razem('k4-odmiana-rodzaj', 'k4-odmiana-mnoga', 'k4-odmiana-przypadki'),
      slideNote('Odmiana przymiotnika', 'Przymiotnik **odmienia się** razem z rzeczownikiem przez **rodzaje** (mądry, mądra, mądre), **liczby** (ci mądrzy chłopcy, te mądre psy) i **przypadki** (nie ma czerwonego autobusu).'),
    ],
  },
  {
    title: '33. Przymiotniki w akcji - od dobrego do najlepszego',
    dzial: ROZDZIAL_3,
    topic: 'Stopniowanie przymiotników',
    textbookPage: 106,
    teacherPlan: plan(
      ['Co dziś', 'Stopniowanie przymiotników: trzy stopnie i trzy sposoby (regularny, nieregularny, opisowy) oraz przymiotniki, których nie stopniujemy. Na końcu ortografia: „nie” z przymiotnikami razem.'],
      ['Po lekcji uczeń', [
        '- tworzy stopień wyższy i najwyższy przymiotnika,',
        '- rozpoznaje stopniowanie regularne, nieregularne i opisowe,',
        '- wie, że niektórych przymiotników nie stopniujemy (drewniany),',
        '- pisze „nie” z przymiotnikami łącznie.',
      ].join('\n')],
      ['Przebieg (45 min)', przebieg({
        film: '„Stopniowanie przymiotników” (8:27) - stopnie, trzy sposoby, „nie” razem, 3 zadania',
        karty: '„Stopniujemy”, „Który sposób?”, „Razem czy osobno?”',
      })],
      ['Jak wyjaśnić', [
        '- Trzy plecaki: ciężki, cięższy, najcięższy.',
        '- Regularnie: -szy / -ejszy i naj-. Nieregularnie (uparciuchy): dobry, zły, duży, mały. Opisowo: bardziej, najbardziej.',
        '- Stół nie może być „bardziej drewniany” - takich przymiotników nie stopniujemy.',
        '- Nie z przymiotnikami razem (niemiły), z czasownikami osobno (nie wiem).',
      ].join('\n')],
    ),
    questions: [
      { text: 'Stopniuj: jasny.', answer: 'jasny, jaśniejszy, najjaśniejszy' },
      { text: 'Stopniuj: zły.', answer: 'zły, gorszy, najgorszy - nieregularnie' },
      { text: 'Który sposób: zabawny, bardziej zabawny, najbardziej zabawny?', answer: 'opisowy' },
      { text: 'Czy da się stopniować „szklany”?', answer: 'Nie - szklanka nie może być bardziej szklana.' },
      { text: 'Razem czy osobno: (nie)wielki?', answer: 'niewielki - razem, przymiotnik' },
      { text: 'Podaj stopień najwyższy od „mały”.', answer: 'najmniejszy' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Stopniowanie przymiotników'),
      ...kolo(previousSetId),
      slideVideo('stopniowanie-film1'),
      ...razem('k4-stopniowanie-tabela', 'k4-stopniowanie-sposob', 'k4-nie-przymiotnik'),
      slideNote('Stopniowanie przymiotników', 'Przymiotnik ma 3 stopnie: **równy, wyższy, najwyższy**. Stopniujemy regularnie (miły - milszy - najmilszy), nieregularnie (dobry - lepszy - najlepszy) albo opisowo (kolorowy - bardziej kolorowy - najbardziej kolorowy).\n**Nie** z przymiotnikami piszemy **razem**: niemiły, nieduży.'),
    ],
  },
  {
    title: '34. Jak stworzyć ciekawy opis przedmiotu?',
    dzial: ROZDZIAL_3,
    topic: 'Opis przedmiotu',
    textbookPage: 108,
    teacherPlan: plan(
      ['Co dziś', 'Pisanie: plan opisu przedmiotu, kolejność od ogółu do szczegółu, zmysły i unikanie powtórzeń. Wzór ze świnką-skarbonką (s. 108) można pokazać w podręczniku jako drugi przykład.'],
      ['Po lekcji uczeń', [
        '- zna trzy części opisu przedmiotu i wie, co w każdej napisać,',
        '- opisuje wygląd od ogółu do szczegółu,',
        '- używa słów z różnych zmysłów,',
        '- łączy zdania, żeby uniknąć powtórzeń.',
      ].join('\n')],
      ['Przebieg (45 min)', przebieg({
        film: '„Opis przedmiotu” (7:52) - zagadka z budzikiem, plan, kolejność, zmysły, 3 zadania',
        karty: '„Która część opisu?”, „Jakim zmysłem?”, „Z czego jest?”',
        dom: 's. 110 zad. 3 - opis rzeczy, na którą zbierasz pieniądze (wstęp, rozwinięcie, zakończenie, każda część od nowej linijki).',
      })],
      ['Jak wyjaśnić', [
        '- Opis to malowanie słowami - czytelnik ma zobaczyć przedmiot bez zdjęcia.',
        '- Kamera robi zbliżenie: najpierw cały przedmiot, potem materiał, potem części i drobiazgi.',
        '- Nie tylko „widzę”: gładki (dotyk), skrzypi (słuch), pachnie (węch).',
      ].join('\n')],
    ),
    questions: [
      { text: 'Co piszemy we wstępie opisu przedmiotu?', answer: 'Co opisujemy i skąd to mamy.' },
      { text: 'W jakiej kolejności opisujemy wygląd przedmiotu?', answer: 'Od ogółu do szczegółu.' },
      { text: 'Którym zmysłem poznajemy, że coś szeleści?', answer: 'Słuchem.' },
      { text: 'Gdzie napiszesz: „Ta lampka bardzo mi się podoba”?', answer: 'W zakończeniu.' },
      { text: 'Popraw powtórzenie: „Kubek jest żółty. Kubek jest duży”.', answer: 'np. Kubek jest duży i żółty.' },
      { text: 'Podaj przymiotnik od „szkło”: ... wazon.', answer: 'szklany wazon' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Opis przedmiotu'),
      ...kolo(previousSetId),
      slideVideo('opis-przedmiotu-film1'),
      ...razem('k4-opis-czesc', 'k4-opis-zmysly', 'k4-opis-material'),
      slideNote('Opis przedmiotu', 'Opis przedmiotu ma **wstęp** (co to jest, skąd to mam), **rozwinięcie** (wygląd od ogółu do szczegółu: wielkość, kształt, kolor, materiał, części) i **zakończenie** (do czego służy, co o nim myślę).'),
    ],
  },
  {
    title: '35. Szukam, sprzedam, kupię - jak napisać ogłoszenie?',
    dzial: ROZDZIAL_3,
    topic: 'Ogłoszenie',
    textbookPage: 110,
    teacherPlan: plan(
      ['Co dziś', 'Pisanie: ogłoszenie. Rodzaje ogłoszeń, obowiązkowe części (nagłówek, co, gdzie, kiedy, kontakt, podpis) i zasada „krótko i konkretnie”.'],
      ['Po lekcji uczeń', [
        '- rozpoznaje rodzaje ogłoszeń po nagłówku,',
        '- sprawdza, czy ogłoszenie ma wszystkie potrzebne informacje,',
        '- skreśla zbędne zdania,',
        '- pisze krótkie ogłoszenie.',
      ].join('\n')],
      ['Przebieg (45 min)', przebieg({
        film: '„Ogłoszenie” (7:01) - kartka „Zgubiłem psa. Kuba”, części ogłoszenia, krótko i konkretnie, 3 zadania',
        karty: '„Co to za ogłoszenie?”, „Czego brakuje?”, „Ważne czy zbędne?”',
        dom: 's. 112 zad. 4 - własne ogłoszenie (sprzedam, zgubiono albo zaproszenie).',
      })],
      ['Jak wyjaśnić', [
        '- Ogłoszenie czyta wiele osób w biegu - ma być krótkie.',
        '- Pytania kontrolne: co? gdzie? kiedy? jak się skontaktować? kto pisze?',
        '- Historia życia hulajnogi nikomu nie pomoże jej kupić.',
      ].join('\n')],
    ),
    questions: [
      { text: 'Co to za ogłoszenie: „Oddam rowerek dla trzylatka”?', answer: 'oddam' },
      { text: 'Wymień części ogłoszenia.', answer: 'Nagłówek, co, gdzie, kiedy, kontakt, podpis.' },
      { text: 'Czego brakuje: „Sprzedam łyżwy, rozmiar 34. Tel. 600 200 300”?', answer: 'Podpisu (i np. ceny).' },
      { text: 'Czy w ogłoszeniu o zgubionym kluczu piszemy, co jedliśmy na obiad?', answer: 'Nie - to zbędna informacja.' },
      { text: 'Na jakie pytania odpowiada ogłoszenie o wydarzeniu?', answer: 'Kto zaprasza, na co, kiedy, gdzie, co zabrać.' },
      { text: 'Wymyśl nagłówek ogłoszenia o zaginionym chomiku.', answer: 'np. Zaginął chomik!' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Ogłoszenie'),
      ...kolo(previousSetId),
      slideVideo('ogloszenie-film1'),
      ...razem('k4-ogloszenie-rodzaj', 'k4-ogloszenie-brakuje', 'k4-ogloszenie-zbedne'),
      slideNote('Ogłoszenie', '**Ogłoszenie** to krótka informacja dla wielu osób.\nMa: nagłówek, informacje (co? gdzie? kiedy?), kontakt i podpis.'),
    ],
  },
  {
    title: '36. Czy wyrazy mogą mieć rodzinę?',
    dzial: ROZDZIAL_3,
    topic: 'Rodzina wyrazów',
    textbookPage: 113,
    teacherPlan: plan(
      ['Co dziś', 'Słowotwórstwo na poziomie 4 klasy: wyrazy pokrewne i rodzina wyrazów, pułapka „podobne litery” i wymiana głosek, która podpowiada pisownię (most do lekcji o ó i u).'],
      ['Po lekcji uczeń', [
        '- wyjaśnia, co to wyrazy pokrewne (wspólna cząstka + powiązane znaczenie),',
        '- dobiera wyrazy pokrewne i wskazuje intruza,',
        '- wie, że w rodzinie głoski się wymieniają (stół - stoły), i korzysta z tego w ortografii.',
      ].join('\n')],
      ['Przebieg (45 min)', przebieg({
        film: '„Rodzina wyrazów” (7:26) - rodzina „las”, pułapka kot - kotlet, wymiana głosek, drzewo „mleko”, 3 zadania',
        karty: '„Kto nie pasuje do rodziny?”, „Zgadnij wyraz z rodziny”, „Podpowiedź do pisowni”',
      })],
      ['Jak wyjaśnić', [
        '- Rodzina: wspólne nazwisko (cząstka) i wspólny dom (znaczenie). Jedno bez drugiego nie wystarczy.',
        '- Kot i kotlet, lis i list - podobne litery, ale to nie rodzina.',
        '- Nie wiesz, jak napisać stół? Stoły, stolik - słychać o.',
      ].join('\n')],
    ),
    questions: [
      { text: 'Co mają wspólnego wyrazy pokrewne?', answer: 'Wspólną cząstkę i powiązane znaczenie.' },
      { text: 'Podaj dwa wyrazy z rodziny „kwiat”.', answer: 'np. kwiatek, kwiaciarnia, kwiecisty' },
      { text: 'Który wyraz nie pasuje: but, bucik, butelka, obuwie?', answer: 'butelka' },
      { text: 'Czy „morze” i „mors” to rodzina?', answer: 'Nie - mors nie ma nic wspólnego z morzem.' },
      { text: 'Jaki wyraz z rodziny podpowiada pisownię „wóz”?', answer: 'wozy, wozić' },
      { text: 'Kto pracuje w lesie? Podaj wyraz z rodziny „las”.', answer: 'leśniczy' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Rodzina wyrazów'),
      ...kolo(previousSetId),
      slideVideo('rodzina-wyrazow-film1'),
      ...razem('k4-rodzina-intruz', 'k4-rodzina-zgadnij', 'k4-rodzina-wymiana'),
      slideNote('Rodzina wyrazów', '**Wyrazy pokrewne** mają wspólną cząstkę i są powiązane znaczeniem. Razem tworzą **rodzinę wyrazów**, np. las, lasek, leśny.\nW rodzinie głoski się wymieniają (stół - stoły), co pomaga w pisowni.'),
    ],
  },
  {
    title: '37. Tajniki polskiej ortografii: pisownia ó i u',
    dzial: ROZDZIAL_3,
    topic: 'Pisownia ó i u',
    textbookPage: 115,
    teacherPlan: plan(
      ['Co dziś', 'Ortografia: ó wymienne na o, e, a; ó w zakończeniach -ów, -ówka; u w zakończeniach -unek, -uszek, -utki, -uś, -usia, w czasownikach z -uj-, na początku i na końcu wyrazu; ó i u niewymienne do zapamiętania (ortoobrazki).'],
      ['Po lekcji uczeń', [
        '- uzasadnia pisownię ó wyrazem pokrewnym albo inną formą,',
        '- stosuje zasady pisowni ó i u w zakończeniach,',
        '- zna kilka wyrazów z ó niewymiennym i sposoby ich zapamiętania.',
      ].join('\n')],
      ['Przebieg (45 min)', przebieg({
        przed: ['**Zacznijmy od... s. 115** (2 min) - uzasadnij ó i u: końcówka, kółko, wróbel, ul, rysuję, brzuch.'],
        film: '„Pisownia ó i u” (7:20) - zamiana na o, e, a, zakończenia, słowa do zapamiętania, 3 zadania',
        karty: '„Ó czy u?”, „Jaka zasada?”, „Ó i u w zdaniach”',
        dom: 's. 116 zad. 4 - ortoobrazki do słów: żółw, królowa, sukienka, wulkan, tulipan.',
      })],
      ['Jak wyjaśnić', [
        '- Najpierw szukamy zamiany: stół - stoły, wiózł - wiezie, skrócić - skracać.',
        '- Zakończenia z ó: Kraków, pocztówka. Z u: rysunek, kożuszek, malutki, synuś, maluje.',
        '- U na początku (ucho) i na końcu (domu). Wyjątki: ósmy, ósemka.',
        '- Góra, żółw, ogórek, brzuch - do zapamiętania (rysunek, rymowanka).',
      ].join('\n')],
    ),
    questions: [
      { text: 'Uzasadnij pisownię: wóz.', answer: 'wozy - ó wymienia się na o' },
      { text: 'Ó czy u: Rzesz_w?', answer: 'Rzeszów - zakończenie -ów' },
      { text: 'Ó czy u: kwiat_szek?', answer: 'kwiatuszek - zakończenie -uszek' },
      { text: 'Ó czy u: mal_je?', answer: 'maluje - czasownik z -uj-' },
      { text: 'Ó czy u na początku wyrazu: _cho?', answer: 'ucho - na początku wyrazu u' },
      { text: 'Podaj dwa wyrazy z ó do zapamiętania.', answer: 'np. góra, żółw, ogórek, król, róża' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Pisownia ó i u'),
      ...kolo(previousSetId),
      slideVideo('o-u-film1'),
      ...razem('k4-ou-wybierz', 'k4-ou-zasada', 'k4-ou-zdania'),
      slideNote('Pisownia ó i u', '**Ó** piszemy, gdy wymienia się na o, e, a (stół - stoły), i w zakończeniach -ów, -ówka.\n**U** piszemy w zakończeniach -unek, -uszek, -utki, -uś, -usia, w czasownikach z -uj- oraz na początku i na końcu wyrazu.'),
    ],
  },
  {
    title: '38. Wyturlajmy opis postaci!',
    dzial: ROZDZIAL_3,
    topic: 'Opis postaci',
    textbookPage: 117,
    teacherPlan: plan(
      ['Co dziś', 'Pisanie: opis postaci. Plan (wstęp, wygląd od góry do dołu, zakończenie z „dlaczego”), słowa, które pokazują zamiast „ładny” i „normalny”, unikanie powtórzeń „ma, ma, ma”.'],
      ['Po lekcji uczeń', [
        '- zna części opisu postaci,',
        '- opisuje wygląd w kolejności od góry do dołu,',
        '- wybiera dokładne słowa zamiast ogólnych,',
        '- uzasadnia swoją opinię w zakończeniu.',
      ].join('\n')],
      ['Przebieg (45 min)', przebieg({
        film: '„Opis postaci” (7:08) - plan, dziadek Stefan, słowa, które pokazują, zgadywanka z postaciami z bajek, 3 zadania',
        karty: '„Która część opisu?”, „Słowo, które pokazuje”',
        dom: 's. 119 zad. 3 - rzut kostką i opis wylosowanej postaci (albo opis kogoś z rodziny).',
      })],
      ['Jak wyjaśnić', [
        '- „Mój tata jest normalny” - poznalibyście go na dworcu? Opis ma pomóc zobaczyć człowieka.',
        '- Od góry do dołu: cała postać, twarz, włosy, ubiór, coś charakterystycznego.',
        '- Zakończenie zawsze z „bo”: lubię ją, bo jest odważna.',
      ].join('\n')],
    ),
    questions: [
      { text: 'Co piszemy we wstępie opisu postaci?', answer: 'Kto to jest, ile ma lat, skąd go znam.' },
      { text: 'W jakiej kolejności opisujemy wygląd?', answer: 'Od góry do dołu: postać, twarz, włosy, ubiór.' },
      { text: 'Zamień na ciekawsze: „Ma ładny uśmiech”.', answer: 'np. Ma szeroki, ciepły uśmiech.' },
      { text: 'Czego nie może zabraknąć w zakończeniu opinii?', answer: 'Uzasadnienia - dlaczego tak myślę.' },
      { text: 'Popraw powtórzenia: „Ma czapkę. Ma szalik. Ma rękawiczki”.', answer: 'np. Nosi czapkę, szalik i rękawiczki.' },
      { text: 'Kto to: zielony olbrzym, który mieszka na bagnach?', answer: 'Shrek' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Opis postaci'),
      ...kolo(previousSetId),
      slideVideo('opis-postaci-film1'),
      ...razem('k4-postac-czesc', 'k4-postac-slowa'),
      slideNote('Opis postaci', 'Opis postaci ma **wstęp** (kto to jest, skąd go znam), **wygląd** od góry do dołu (wzrost, twarz, włosy, ubiór, coś charakterystycznego) i **zakończenie** (co o nim myślę i dlaczego).'),
    ],
  },
  {
    title: '39. Co już wiesz? Co umiesz? Podsumowanie rozdziału III',
    dzial: ROZDZIAL_3,
    topic: 'Od pomysłu do działania - podsumowanie',
    textbookPage: 120,
    teacherPlan: plan(
      ['Co dziś', 'Druga lekcja z tekstem: Anne-Catharina Vestly „8 + 2 i domek w lesie” (s. 120-122) - dziewczynki bawią się w sklep, babcia na niby sprzedaje gofry, a przychodzą prawdziwi klienci. Film powtarza cały rozdział przed sprawdzianem.'],
      ['Przebieg (45 min)', przebieg({
        przed: ['**Czytanka „8 + 2 i domek w lesie”** (ok. 5 min z lektorem) + **s. 123 zad. 1-2** ustnie (3 min).'],
        film: '„Podsumowanie rozdziału III” (7:10) - przedsiębiorczość, przymiotnik, opisy i ogłoszenie, rodzina wyrazów, ó i u, 3 zadania',
        karty: '„Powtórka rozdziału”, „Przymiotnik na sprawdzian”',
        notatka: 'przy lekcji z tekstem sam temat',
        dom: 'zeszyt powtórzeniowy PDF (link w VULCANIE) przed sprawdzianem.',
      })],
    ),
    questions: [
      { text: 'Przedsiębiorczość to pomysł plus...', answer: 'działanie' },
      { text: 'Stopniuj: dobry.', answer: 'dobry, lepszy, najlepszy' },
      { text: 'Ci czy te: (wesołe / weseli) dziewczynki?', answer: 'wesołe dziewczynki' },
      { text: 'Wymień części ogłoszenia.', answer: 'Nagłówek, co, gdzie, kiedy, kontakt, podpis.' },
      { text: 'Ó czy u: g_ra? Dlaczego?', answer: 'góra - ó do zapamiętania' },
      { text: 'Podaj wyraz pokrewny do „ogród”.', answer: 'np. ogrodnik, ogródek, ogrodowy' },
      { text: 'W jakiej kolejności opisujemy przedmiot?', answer: 'Od ogółu do szczegółu.' },
      { text: 'Razem czy osobno: (nie)ciekawy?', answer: 'nieciekawy - razem' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Od pomysłu do działania - podsumowanie'),
      ...kolo(previousSetId),
      slideCzytanka('8-plus-2-i-domek-w-lesie'),
      slideVideo('podsumowanie4-dzial3-film1'),
      ...razem('k4-podsumowanie-r3', 'k4-podsumowanie-przymiotnik'),
      slideNote('Od pomysłu do działania - podsumowanie', ''),
    ],
  },
];
