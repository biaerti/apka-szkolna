// Klasa 5, dzial "W poszukiwaniu przyjazni" (podrecznik s. 14-53) jako gotowe
// prezentacje. Nie przepisujemy podrecznika jeden do jednego. Od 2026-09-24
// lekcje powstaja pojedynczo, jedna po drugiej - kazda z ustalonym celem
// ("Po lekcji uczen" w planie). Dwa formaty: lekcja z filmikiem (gramatyka,
// tematy techniczne) albo z czytanka.
//
// Kazda lekcja ma `teacherPlan` - sciagawke tylko dla nauczyciela (przycisk
// "Plan" na liscie lekcji): co czytamy, o czym powiedziec, jak wyjasnic, co
// narysowac na tablicy. Nagrania czytanek sa w src/data/czytanki.ts (V.2...).

import type { Lesson, Question, QuestionSet, Slide, SlideArt, StudentAction } from './types';
import type { FreshMaterialsBundle } from '../components/lessons/refreshMaterials';
import { newId } from './id';

interface Topic {
  title: string;
  topic: string;
  textbookPage: number;
  teacherPlan: string;
  questions: Array<{ text: string; answer: string }>;
  /** ownQuestionSetId - zestaw pytan tej lekcji (kolo po filmie z jej wlasnymi pytaniami). */
  makeSlides: (previousQuestionSetId?: string, ownQuestionSetId?: string) => Slide[];
}

const DZIAL = 'W poszukiwaniu przyjaźni';

/** Sekcje planu: "## Naglowek" + tresc, oddzielone pusta linia (markdown-lite). */
function plan(...sections: Array<[string, string]>): string {
  return sections.map(([heading, body]) => `## ${heading}\n\n${body}`).join('\n\n');
}

const TOPICS: Topic[] = [
  {
    title: '2. Jak zapisać dialog?',
    topic: 'Jak zapisać dialog?',
    textbookPage: 14,
    teacherPlan: plan(
      ['Co dziś', '„Sztukę programowania” już przeczytaliście, więc nie ma osobnej lekcji omówienia. Tekst omawiamy przy okazji dialogów - jest ich w nim pełno. Na początku krótka rozmowa o fabule, potem zasady zapisu dialogu na przykładach z tekstu.\nPodręcznik otwarty na s. 14-18. Nagranie całości: „Czytanki” → V.2 (9 min), gdyby ktoś był nieobecny.'],
      ['Przebieg (45 min)', [
        '1. **Temat + obecność** (3 min). Pierwsza lekcja działu, więc koło powtórzeniowe możesz pominąć.',
        '2. **Co pamiętamy?** (6 min). Pytasz ustnie, koło losuje: Kim jest Jacek i jak przyjęła go klasa? Co zrobił Radek, gdy Modry popchnął Jacka? Jak Radek to naprawił? Co znaczy „ciężar spadł mu z serca”? Ty rysujesz na tablicy oś wydarzeń.',
        '3. **Slajd z zasadami** (5 min). Każdą zasadę pokazujesz na zdaniu z tekstu. Przepisują trzy wzory z tablicy.',
        '4. **Z1** - dialog na boisku (6 min).',
        '5. **Z2** - telefon do Matyldy (6 min).',
        '6. **Z3** - czasowniki z tekstu (5 min).',
        '7. **Z4** w parach (7 min). Dwie pary czytają na głos z podziałem na role.',
        '8. **Notatka** (4 min).',
      ].join('\n')],
      ['Jak wyjaśnić', [
        '- W dialogu są dwa rodzaje tekstu: **to, co mówi bohater** (wypowiedź), i **to, co dopowiada narrator** (kto mówi i jak). Myślnik oddziela jedno od drugiego.',
        '- Pokaż na „– Spadaj! – mruknął Modry.”: myślnik, słowa Modrego, wykrzyknik zostaje przy nich, myślnik, narrator małą literą, kropka na samym końcu.',
        '- Najczęstszy błąd: kropka przed narratorem („– Idę. – powiedział”). Kropka idzie na koniec całego zdania.',
        '- Przy Z1 wróć do treści: Jacek pyta, Modry odpowiada, a Radek w tej rozmowie **milczy**. To milczenie jest jego błędem. Zapytaj: „Co wy byście powiedzieli?” - to prowadzi prosto do Z4.',
        '- Czasowniki z Z3 są w podręczniku pogrubione, a ramki „Przydatne słowa” (s. 14-15) wyjaśniają dwa z nich.',
      ].join('\n')],
      ['Tablica', 'Oś wydarzeń (rysujesz w punkcie 2): Nowy w klasie → kurs w MDK → Koks i Matylda → boisko: Radek milczy → zaginiony Koks → Radek szuka i znajduje → „Nic nie pamiętam”.\nPod nią trzy wzory, znaki zakreślone kolorem:\n– Spadaj! – mruknął Modry.\n– Mógłbym z wami zagrać? – spytał Jacek.\n– Dzień dobry – mruknął. – Jestem Jacek.'],
    ),
    questions: [
      { text: 'Jak zachował się Radek, gdy Modry popchnął Jacka na boisku?', answer: 'Nie zareagował. Odwrócił się i udawał, że wiąże sznurowadło.' },
      { text: 'W jaki sposób Radek naprawił swój błąd?', answer: 'Odnalazł zaginionego psa Jacka, Koksa, i przyprowadził go do domu.' },
      { text: 'Od jakiego znaku zaczyna się każda wypowiedź w dialogu?', answer: 'Od myślnika, i to w nowej linijce.' },
      { text: 'Jaką literą zaczynamy słowa narratora po wypowiedzi bohatera?', answer: 'Małą, np. „– Spadaj! – mruknął Modry”.' },
      { text: 'Co znaczy, że ktoś „zaoponował”?', answer: 'Sprzeciwił się, zaprotestował.' },
    ],
    makeSlides: () => [
      slideTopic('Jak zapisać dialog?'),
      slideRead('Wracamy do „Sztuki programowania”', 14, 18, 'Przypominamy sobie historię Radka i Jacka. Dziś szukamy w tekście dialogów i uczymy się, jak się je zapisuje.', 6 * 60),
      slideText('Trzy zasady dialogu', '1. Każda wypowiedź od **nowej linijki** i od **myślnika**.\n2. Słowa narratora oddziel myślnikiem i zacznij **małą literą**: – Spadaj! – **mruknął** Modry.\n3. **?** i **!** zostają przy bohaterze, a **kropkę** stawiamy dopiero po słowach narratora.\n\nZdanie, które wprowadza dialog, kończy się **dwukropkiem**.', 'dialog'),
      slideTask('Z1', 'Otwórz podręcznik na s. 16. Znajdź rozmowę na boisku (od „Mógłbym z wami zagrać?”).\n\n1. Przepisz **dwie wypowiedzi** razem ze słowami narratora.\n2. Zakreśl kolorem myślniki i znaki na końcu słów bohatera.\n3. Odpowiedz: kto w tej rozmowie **nic nie mówi** i dlaczego?', 6 * 60, 'dialog', '1. – Spadaj! – mruknął Modry.\n– Zjeżdżaj, kujonie! – krzyknął Modry.\n3. Radek. Był zakłopotany i bał się kolegów, więc tylko unikał wzroku Jacka.'),
      slideTask('Z2', 'Radek dzwoni do Matyldy. Ktoś zgubił wszystkie myślniki i znaki - przepisz rozmowę poprawnie:\n\nCześć tu Radek powiedział niepewnie co z Koksem\nUciekł odpowiedziała Matylda Jacek jest w szpitalu\nJak mogę pomóc zapytał Radek', 6 * 60, 'dialog', '– Cześć, tu Radek – powiedział niepewnie. – Co z Koksem?\n– Uciekł – odpowiedziała Matylda. – Jacek jest w szpitalu.\n– Jak mogę pomóc? – zapytał Radek.'),
      slideTask('Z3', 'Zamiast „powiedział” autor używa ciekawszych czasowników. Połącz je ze znaczeniem:\n\n1. mruknął  2. zaoponował  3. żachnął się  4. roześmiał się  5. zdenerwował się\n\na) sprzeciwił się\nb) powiedział cicho i niewyraźnie\nc) powiedział ze złością\nd) lekko się oburzył\ne) powiedział ze śmiechem', 5 * 60, 'dialog', '1 - b, 2 - a, 3 - d, 4 - e, 5 - c'),
      slideTask('Z4', 'W parach: cofnijmy czas. Na boisku Radek tym razem **staje w obronie** Jacka.\n\nNapiszcie 4 wypowiedzi (Jacek, Modry, Radek). Przy każdej dodajcie słowa narratora i użyjcie **dwóch czasowników z Z3**.', 7 * 60, 'dialog', '– Mógłbym z wami zagrać? – spytał Jacek.\n– Spadaj! – mruknął Modry.\n– Czemu? Jacek dobrze gra – zaoponował Radek.\n– Dobra, niech zagra – żachnął się Modry.'),
      slideNote('Jak zapisać dialog?', '- Każda wypowiedź od nowej linijki i od myślnika.\n- Słowa narratora po myślniku, małą literą.\n- ? i ! zostają przy bohaterze, kropka po słowach narratora.\n- Radek nie obronił Jacka, ale naprawił błąd - odnalazł Koksa.'),
    ],
  },
  {
    title: '3. Opowiadanie twórcze z dialogiem',
    topic: 'Opowiadanie - jak je napisać?',
    textbookPage: 19,
    teacherPlan: plan(
      ['Co dziś', 'Lekcja z filmikiem. Najpierw film (ok. 4-5 min): czym są formy wypowiedzi, czym jest opowiadanie, gdzie je spotykamy (książki, rozmowa, egzamin ósmoklasisty), z czego się składa, jak zacząć i jak skończyć. Potem trzy zadania, które razem budują jedno małe opowiadanie: układanka części, własny wstęp, własne zakończenie. W domu piszą całe opowiadanie.\nW podręczniku jest to samo na s. 19-21 (s. 21 to wzór opowiadania z podpisanymi częściami) - możesz go pokazać zamiast czytać.'],
      ['Przebieg (45 min)', [
        '1. **Temat + koło** (8 min) - pytania o dialog.',
        '2. **Film** (5 min). Zanim puścisz: „Po filmie zapytam, z jakich trzech części składa się opowiadanie”.',
        '3. **Po filmie** (3 min), ustnie: Jakie formy wypowiedzi pojawiły się na początku? Z jakich części składa się opowiadanie? Która część jest najdłuższa?',
        '4. **Z1 - układanka** (7 min). Pomieszane zdania jednej historii: układają je po kolei i podpisują W / R / Z.',
        '5. **Z2 - wstęp** (7 min). Każdy pisze wstęp do „Zagubionego klucza”.',
        '6. **Z3 - zakończenie** (7 min). Rozwinięcie jest na slajdzie, oni dopisują zakończenie. Wylosowane osoby czytają całość: swój wstęp, rozwinięcie ze slajdu i swoje zakończenie.',
        '7. **Notatka + zadanie domowe** (5 min).',
      ].join('\n')],
      ['Jak wyjaśnić', [
        '- **Forma wypowiedzi** to rodzaj tekstu z własnymi zasadami: zaproszenie ma kto/gdzie/kiedy, e-mail ma temat i podpis, a **opowiadanie ma wstęp, rozwinięcie i zakończenie**.',
        '- **Opowiadanie** to historia, w której wydarzenia dzieją się po kolei, a opowiada je narrator. „Sztuka programowania” to opowiadanie.',
        '- **Wstęp** = kto? gdzie? kiedy? - 2-3 zdania. **Rozwinięcie** = co się działo, po kolei, ze zwrotem akcji i dialogiem - najdłuższa część. **Zakończenie** = jak się skończyło + czego to nauczyło - 1-2 zdania.',
        '- Przy Z1 podpowiedz: szukajcie słów-sygnałów. „Najpierw” i „nagle” są w rozwinięciu, „od tamtej pory” w zakończeniu.',
        '- **Jeden czas**: kto zaczął od „poszedłem”, nie przeskakuje na „idę”.',
      ].join('\n')],
      ['Tablica', 'Trzy prostokąty jeden pod drugim, środkowy najwyższy:\n**WSTĘP** - kto? gdzie? kiedy? (Pewnego dnia… / Było słoneczne popołudnie…)\n**ROZWINIĘCIE** - najpierw, potem, NAGLE!, dialog\n**ZAKOŃCZENIE** - Od tamtej pory… / Ta przygoda nauczyła mnie, że…\nZ boku: jeden czas, tytuł, każda część od akapitu.'],
      ['Zadanie domowe', 'Opowiadanie „Niezwykły dzień” - minimum strona w zeszycie: tytuł, wstęp, rozwinięcie (co najmniej 3 wydarzenia, zwrot akcji i 2 wypowiedzi w dialogu), zakończenie. Termin: za tydzień. Lista kontrolna jest na slajdzie - niech ją przepiszą.'],
    ),
    questions: [
      { text: 'Z jakich trzech części składa się opowiadanie?', answer: 'Ze wstępu, rozwinięcia i zakończenia.' },
      { text: 'Na jakie pytania odpowiada wstęp opowiadania?', answer: 'Kto? Gdzie? Kiedy?' },
      { text: 'Która część opowiadania jest najdłuższa i co w niej piszemy?', answer: 'Rozwinięcie - wydarzenia po kolei, zwrot akcji i dialog.' },
      { text: 'Podaj dwa wyrazy, które zapowiadają zwrot akcji.', answer: 'Np. nagle, w ułamku sekundy, niespodziewanie, jak grom z jasnego nieba.' },
      { text: 'Podaj zwrot, od którego można zacząć zakończenie.', answer: 'Np. „Od tamtej pory…”, „Ta przygoda nauczyła mnie, że…”, „Do dziś pamiętam…”.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Opowiadanie - jak je napisać?'),
      ...recap(previousSetId),
      slideVideo('opowiadanie-film1'),
      slideTask('Z1', 'Ktoś pomieszał zdania jednej historii. Zapisz litery **we właściwej kolejności** i przy każdej napisz: **W** - wstęp, **R** - rozwinięcie, **Z** - zakończenie.\n\nA. Od tamtej pory zawsze zamykam furtkę.\nB. W niedzielę rano bawiłam się z psem Burkiem w ogrodzie babci.\nC. Nagle zobaczyłam, że furtka jest otwarta, a Burka nigdzie nie ma!\nD. Najpierw rzucałam mu patyk, a potem poszłam do domu po wodę.\nE. – Burek! – wołałam, biegnąc ulicą.\nF. Znalazłam go przed sklepem, gdzie merdał ogonem do pani z kiełbasą.', 7 * 60, 'opowiadanie', 'B - W\nD - R\nC - R (zwrot akcji: „nagle”)\nE - R (dialog)\nF - R\nA - Z (zwrot „od tamtej pory”)'),
      slideTask('Z2', 'Napisz **wstęp** do opowiadania **„Zagubiony klucz”** (2-3 zdania).\n\nWstęp musi odpowiadać na pytania: **kto? gdzie? kiedy?**\nZacznij od jednego z początków z filmu, np. „Pewnego dnia…”, „Było deszczowe popołudnie…”, „Nigdy nie zapomnę dnia, w którym…”.', 6 * 60, 'opowiadanie', 'Np. „Nigdy nie zapomnę dnia, w którym zgubiłem klucz do domu. Było deszczowe, listopadowe popołudnie. Wróciłem ze szkoły, a mamy nie było w domu.”'),
      slideTask('Z3', 'Oto **rozwinięcie** „Zagubionego klucza”:\n\n„Najpierw szukałem klucza w plecaku. Potem przetrząsnąłem wszystkie kieszenie. Nagle usłyszałem cichy brzęk – klucz leżał pod wycieraczką, a obok siedział kot sąsiadów.”\n\nDopisz **zakończenie** (1-2 zdania). Zacznij od „Od tamtej pory…” albo „Ta przygoda nauczyła mnie, że…”.', 6 * 60, 'opowiadanie', 'Np. „Od tamtej pory noszę klucz na smyczy przy plecaku. A kot sąsiadów dostaje ode mnie czasem kawałek szynki.”'),
      slideText('Zadanie domowe', 'Napisz opowiadanie **„Niezwykły dzień”** - minimum strona w zeszycie.\n\n- tytuł,\n- wstęp: kto, gdzie, kiedy,\n- rozwinięcie: co najmniej 3 wydarzenia po kolei, zwrot akcji, 2 wypowiedzi w dialogu,\n- zakończenie: jak się skończyło i czego cię to nauczyło,\n- jeden czas - przeszły.\n\nTermin: za tydzień.', 'opowiadanie'),
      slideNote('Opowiadanie', '- Opowiadanie to historia opowiadana przez narratora.\n- Wstęp: kto, gdzie, kiedy.\n- Rozwinięcie: wydarzenia po kolei, zwrot akcji, dialog.\n- Zakończenie: jak się skończyło i czego to nauczyło.\n- Piszę w jednym czasie i każdą część od akapitu.'),
    ],
  },
  {
    title: '4. Głoski miękkie i twarde',
    topic: 'Głoski miękkie i twarde',
    textbookPage: 23,
    teacherPlan: plan(
      ['Co dziś', 'Lekcja z filmikiem, bez czytanki. Film (7 min, z pauzami) przypomina ramkę z s. 23 (głoska, litera, sylaba, dzielenie na sylaby) i przerabia nowe z s. 24: głoski miękkie i twarde. Dokłada dwa podziały spoza podręcznika, bardziej przydatne w pisaniu: syczące / szumiące / ciszące oraz dźwięczne / bezdźwięczne w parach. W filmie jest 5 zadań - dzieci zapisują odpowiedzi w zeszycie, a rozliczamy je dopiero kołem po filmie.'],
      ['Po lekcji uczeń', [
        '- odróżnia głoskę od litery i liczy je w wyrazie (puszcza: 7 liter, 5 głosek),',
        '- dzieli wyraz na sylaby, także na dwa sposoby (prze-kąs-ka, prze-ką-ska),',
        '- rozpoznaje spółgłoskę miękką testem z językiem i wie, kiedy pisać kreskę, a kiedy „i”,',
        '- rozróżnia głoski syczące, szumiące i ciszące,',
        '- zna pary dźwięczna - bezdźwięczna i sprawdza pisownię na końcu wyrazu (chleb, bo chleba).',
      ].join('\n')],
      ['Przebieg (45 min)', [
        '1. **Temat + koło powtórzeniowe** (8 min) - pytania o opowiadanie z poprzedniej lekcji.',
        '2. **Film** (7 min). Zanim puścisz: „W filmie jest 5 zadań. Każdą odpowiedź zapisujecie w zeszycie, a po filmie koło wybierze, kto ją przeczyta”.',
        '3. **Koło po filmie** (8 min) - 5 pytań = 5 zadań z filmu, jedna osoba na pytanie. Plansza końcowa filmu z listą Z1-Z5 zostaje na ekranie.',
        '4. **s. 24 zad. 4** (4 min) - zi czy ź, ci czy ć. Koło (K) wybiera, kto czyta.',
        '5. **Z6** (4 min) - trzy kolumny: syczące, szumiące, ciszące.',
        '6. **Z7** (5 min) - chleb czy chlep: dźwięczna czy bezdźwięczna na końcu wyrazu.',
        '7. **Notatka** (5 min).',
      ].join('\n')],
      ['Odpowiedzi do zadań z filmu', [
        '- **Z1** puszcza: 7 liter, 5 głosek (p-u-sz-cz-a), 2 sylaby (pusz-cza), samogłoski u, a.',
        '- **Z2** prze-ką-ska.',
        '- **Z3** kość - ś, ć; koń - ń; ciasto - ć (zapisane „ci”).',
        '- **Z4** cukier - c, sycząca; czekolada - cz, szumiąca; ciastko - ć (ci), cisząca.',
        '- **Z5** dama, bąk, koza.',
      ].join('\n')],
      ['Jak wyjaśnić', [
        '- **Głoskę słyszę, literę widzę.** „Sz”, „cz”, „ch”, „rz”, „dz” to dwie litery, ale jedna głoska.',
        '- **Miękka czy twarda?** Nie każ uczyć się listy. Test: powiedz „nic” i „nić” - przy miękkiej środek języka idzie do podniebienia. Pary do pokazania: nic - nić, len - leń, malec - maleć.',
        '- **Kreska czy „i”?** Po miękkiej jest samogłoska → piszę „i” (ciasto, koniec). Nie ma samogłoski (koniec wyrazu albo spółgłoska) → kreska (koń, ćma). W „ciasto” „i” tylko zmiękcza, nie jest osobną głoską.',
        '- **Syczące - szumiące - ciszące**: trójki s - sz - ś, z - ż - ź, c - cz - ć, dz - dż - dź. Najlepszy przykład: kasa, kasza, Kasia. Ciszące to te same głoski, co miękkie z kreską.',
        '- **Dźwięczne**: dłoń na szyi, „bzzz” drga, „sss” nie. Pary: b-p, d-t, g-k, w-f, z-s, ż-sz, dz-c, dż-cz, dź-ć, ź-ś. Po co to? Na końcu wyrazu dźwięczna brzmi jak bezdźwięczna (chleb brzmi jak „chlep”) - zmieniamy formę (chleba) i słychać, co pisać.',
      ].join('\n')],
      ['Tablica', 'Cztery okienka:\n**GŁOSKA / LITERA** - pszczoła: 8 liter, 6 głosek, 2 sylaby\n**MIĘKKIE** - kreska: koń, ćma | „i”: koniec, ciasto\n**SYCZĄCE / SZUMIĄCE / CISZĄCE** - kasa, kasza, Kasia\n**DŹWIĘCZNE ↔ BEZDŹWIĘCZNE** - b-p, d-t, z-s; chleb → chleba'],
    ),
    // Pytania do kola po filmie = piec zadan z filmiku (gloski-film1).
    questions: [
      { text: 'PUSZCZA - ile liter, ile głosek, ile sylab? Które to samogłoski?', answer: '7 liter, 5 głosek (p-u-sz-cz-a), 2 sylaby (pusz-cza). Samogłoski: u, a.' },
      { text: 'Przekąska: prze-kąs-ka. Jak inaczej podzielić ją na sylaby?', answer: 'prze-ką-ska.' },
      { text: 'Wypisz spółgłoski miękkie ze słów: kość, koń, ciasto.', answer: 'kość - ś, ć; koń - ń; ciasto - ć (zapisane „ci”).' },
      { text: 'Cukier, czekolada, ciastko - pierwsza głoska jest sycząca, szumiąca czy cisząca?', answer: 'cukier - c, sycząca; czekolada - cz, szumiąca; ciastko - ć (ci), cisząca.' },
      { text: 'Zamień zaznaczoną głoskę na jej parę: Tama, Pąk, koSa.', answer: 'dama, bąk, koza.' },
    ],
    makeSlides: (previousSetId, ownSetId) => [
      slideTopic('Głoski miękkie i twarde'),
      // Pierwsze kolo (pokaz przenosi je na start) powtarza POPRZEDNIA lekcje;
      // drugie, po filmiku, pyta o jego piec zadan.
      ...recap(previousSetId),
      slideVideo('gloski-film1'),
      ...(ownSetId ? [{ ...slideRecap(ownSetId), questionCount: 5 }] : []),
      slideTextbookTask('czytanki:gloski-s24-zad4.webp', 24, 's.24 zad.4', 'Zadanie 4', 'write-answer', 'Do zeszytu'),
      slideTask('Z6', 'Posortuj wyrazy do trzech kolumn według **pierwszej głoski**: **syczące · szumiące · ciszące**.\n\nsanki, szalik, śnieg, cebula, czapka, ćma, zegar, żaba, źrebię', 4 * 60, undefined, '**Syczące:** sanki, cebula, zegar\n**Szumiące:** szalik, czapka, żaba\n**Ciszące:** śnieg, ćma, źrebię'),
      slideTask('Z7', 'Dźwięczna czy bezdźwięczna? Przepisz wyrazy z właściwą literą. Sprawdzaj, zmieniając formę: chleb → chle**b**a.\n\n1. chle(b/p)\n2. grzy(b/p)\n3. słu(b/p)\n4. ogró(d/t)\n5. nó(ż/sz)\n6. ko(ż/sz)', 5 * 60, undefined, '1. chleb (chleba)\n2. grzyb (grzyby)\n3. słup (słupy)\n4. ogród (ogrody)\n5. nóż (noże)\n6. kosz (kosze)'),
      slideNote('Głoski miękkie i twarde', '1. Głoskę słyszę, literę widzę. Sylaba zawsze ma samogłoskę.\n2. Miękkie (środek języka do góry): ć, ś, ź, ń, dź. Kreska na końcu i przed spółgłoską (koń), „i” przed samogłoską (koniec).\n3. Syczące: s, z, c, dz. Szumiące: sz, ż (rz), cz, dż. Ciszące: ś, ź, ć, dź.\n4. Dźwięczne i bezdźwięczne w parach: b-p, d-t, z-s. Piszę chleb, bo chleba.'),
    ],
  },
];

export function buildTextbook5(grade: string, classIds: string[]): FreshMaterialsBundle {
  if (grade.toUpperCase() !== 'V') throw new Error('Materiał jest przygotowany dla klasy V.');
  const questionSets: QuestionSet[] = TOPICS.map((topic) => ({ id: newId(), name: topic.title, topic: topic.title, classIds, createdAt: new Date().toISOString() }));
  const questions: Question[] = [];
  const lessons: Array<Omit<Lesson, 'id' | 'order'>> = TOPICS.map((topic, index) => {
    const setId = questionSets[index].id;
    topic.questions.forEach((question, order) => questions.push({ id: newId(), setId, ...question, order }));
    return {
      grade,
      title: topic.title,
      topic: topic.topic,
      registerTopic: topic.title.replace(/^[\d-]+\.\s*/, ''),
      materialType: 'textbook',
      textbookPage: topic.textbookPage,
      teacherPlan: topic.teacherPlan,
      questionSetId: setId,
      reviewQuestionSetId: setId,
      dzial: DZIAL,
      progress: {},
      slides: topic.makeSlides(questionSets[index - 1]?.id, setId),
    };
  });
  return { lessons, questionSets, questions };
}

export const TEXTBOOK5_TOPIC_COUNT = TOPICS.length;

/**
 * Tematy wycofane z materialu - automat odswiezania usuwa je z rocznika.
 * Omowienie "Sztuki programowania" weszlo do lekcji o dialogu. Lekcje 5-15
 * (pierwszy, hurtowy szkic dzialu) wycofane 2026-09-24 - Bartek robi dzial od
 * nowa, lekcja po lekcji.
 */
export const RETIRED_TEXTBOOK5_TITLES = new Set<string>([
  '1. Sztuka programowania - omówienie',
  '5. Pax - przyjaźń oczami lisa',
  '6. Encyklopedia i Wikipedia',
  '7. Dziesiąty poziom - czym jest pomaganie?',
  '8. Co już wiemy o czasowniku?',
  '9. Wielki wybuch, czyli K kontra K',
  '10. Kultura w internecie',
  '11. Jak napisać e-mail?',
  '12. Nieosobowe formy czasownika',
  '13. Tryby czasownika',
  '14. Pisownia cząstki „by”',
  '15. W poszukiwaniu przyjaźni - powtórzenie',
]);

function slideTopic(topic: string): Slide {
  return { id: newId(), kind: 'topic', topic, variant: 'write' };
}
function slideRead(title: string, page: number, pageTo: number, body: string, timerSec: number): Slide {
  return { id: newId(), kind: 'read', title, source: 'Podręcznik', page, pageTo, body, timerSec };
}
function slideText(title: string, body: string, art?: SlideArt): Slide { return { id: newId(), kind: 'text', title, body, art }; }
function slideTask(code: string, body: string, timerSec: number, art?: SlideArt, answerExample?: string): Slide {
  return { id: newId(), kind: 'task', code, body, timerSec, art, answerExample, studentAction: 'write-answer' };
}
function slideVideo(videoId: string): Slide { return { id: newId(), kind: 'video', videoId }; }
/** Screen zadania z podrecznika - z kodem, wiec dziala na nim kolo na lekcji (K). */
function slideTextbookTask(url: string, page: number, code: string, title: string, studentAction: StudentAction, studentActionText?: string): Slide {
  return { id: newId(), kind: 'image', url, page, code, title, studentAction, studentActionText };
}
function slideRecap(questionSetId: string): Slide { return { id: newId(), kind: 'recap', questionSetId, mode: 'powtorzeniowe' }; }
/** Notatka zamykajaca lekcje: "Temat: <krotka nazwa>" + kilka linijek do przepisania. */
function slideNote(temat: string, body: string): Slide {
  return { id: newId(), kind: 'note', title: 'Notatka do zeszytu', body: `**Temat:** ${temat}\n${body}` };
}
function recap(questionSetId?: string): Slide[] { return questionSetId ? [slideRecap(questionSetId)] : []; }
