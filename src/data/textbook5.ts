// Klasa 5, dzial "W poszukiwaniu przyjazni" (podrecznik s. 14-53) jako gotowe
// prezentacje. Nie przepisujemy podrecznika jeden do jednego. Od 2026-09-24
// lekcje powstaja pojedynczo, jedna po drugiej - kazda z ustalonym celem
// ("Po lekcji uczen" w planie). Dwa formaty: lekcja z filmikiem (gramatyka,
// tematy techniczne) albo z czytanka.
//
// Kazda lekcja ma `teacherPlan` - sciagawke tylko dla nauczyciela (przycisk
// "Plan" na liscie lekcji): co czytamy, o czym powiedziec, jak wyjasnic, co
// narysowac na tablicy. Nagrania czytanek sa w src/data/czytanki.ts (V.2...).

import type { Lesson, Question, QuestionSet, Slide } from './types';
import type { FreshMaterialsBundle } from '../components/lessons/refreshMaterials';
import { newId } from './id';
import { DZIAL2_TOPICS } from './textbook5dzial2';
import {
  plan, recap, slideCzytanka, slideNote, slideRead, slideRecap, slideTask, slideText, slideTextbookImage,
  slideTextbookTask, slideTopic, slideVideo, type Topic,
} from './textbook5slides';

const DZIAL = 'Dział 1 - W poszukiwaniu przyjaźni';

/** Slajd z materialow Bartka o rymach (teoria + karta pracy) - obraz z prywatnego bucketu czytanek. */
function obrazRymy(plik: string, title: string, code?: string): Slide {
  return code
    ? { id: newId(), kind: 'image', url: `czytanki:rymy-${plik}.webp`, title, code, studentAction: 'write-answer' }
    : { id: newId(), kind: 'image', url: `czytanki:rymy-${plik}.webp`, title, studentAction: 'look' };
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
      slideNote('Jak zapisać dialog?', '- Każda wypowiedź od nowej linijki i od myślnika.\n- Słowa narratora po myślniku, małą literą.\n- ? i ! zostają przy bohaterze, kropka po słowach narratora.'),
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
        '4. **Notatka** (5 min) - zaraz po kole, póki wszystko świeże.',
        '5. **s. 24 zad. 4** (4 min) - zi czy ź, ci czy ć. Koło (K) wybiera, kto czyta.',
        '6. **Z1** (4 min) - trzy kolumny: syczące, szumiące, ciszące.',
        '7. **Z2** (5 min) - chleb czy chlep: dźwięczna czy bezdźwięczna na końcu wyrazu.',
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
      // Notatka zaraz po rozliczeniu zadan z filmu, potem cwiczenia.
      slideNote('Głoski miękkie i twarde', '1. Głoskę słyszę, literę widzę. Sylaba zawsze ma samogłoskę.\n2. Miękkie (środek języka do góry): ć, ś, ź, ń, dź. Kreska na końcu i przed spółgłoską (koń), „i” przed samogłoską (koniec).\n3. Syczące: s, z, c, dz. Szumiące: sz, ż (rz), cz, dż. Ciszące: ś, ź, ć, dź.\n4. Dźwięczne i bezdźwięczne w parach: b-p, d-t, z-s. Piszę chleb, bo chleba.'),
      slideTextbookTask('czytanki:gloski-s24-zad4.webp', 24, 's.24 zad.4', 'Zadanie 4', 'write-answer', 'Do zeszytu'),
      slideTask('Z1', 'Posortuj wyrazy do trzech kolumn według **pierwszej głoski**: **syczące · szumiące · ciszące**.\n\nsanki, szalik, śnieg, cebula, czapka, ćma, zegar, żaba, źrebię', 4 * 60, undefined, '**Syczące:** sanki, cebula, zegar\n**Szumiące:** szalik, czapka, żaba\n**Ciszące:** śnieg, ćma, źrebię'),
      slideTask('Z2', 'Dźwięczna czy bezdźwięczna? Przepisz wyrazy z właściwą literą. Sprawdzaj, zmieniając formę: chleb → chle**b**a.\n\n1. chle(b/p)\n2. grzy(b/p)\n3. słu(b/p)\n4. ogró(d/t)\n5. nó(ż/sz)\n6. ko(ż/sz)', 5 * 60, undefined, '1. chleb (chleba)\n2. grzyb (grzyby)\n3. słup (słupy)\n4. ogród (ogrody)\n5. nóż (noże)\n6. kosz (kosze)'),
    ],
  },
  {
    title: '7. Dziesiąty poziom - pomaganie i przyjaźń',
    topic: 'Pomaganie - dziesiąty poziom przyjaźni',
    textbookPage: 31,
    teacherPlan: plan(
      ['Co dziś', 'Czytamy opowiadanie Jody J. Little „Dziesiąty poziom” z podręcznika na s. 31-34. Nagranie ElevenLabs jest na slajdzie czytanki i podświetla kolejne słowa. Przed czytaniem przypominamy pojęcia „opowiadanie” i „bohater”. Po czytaniu uczniowie układają plan wydarzeń, zapisują go w zeszycie, a następnie wykonują zadania 5-9 ze s. 35.'],
      ['Po lekcji uczeń', [
        '- rozpoznaje opowiadanie i wskazuje bohaterów,',
        '- układa plan wydarzeń w kolejności chronologicznej,',
        '- odróżnia pytania otwarte od zamkniętych,',
        '- wyjaśnia, czym jest wolontariat i dlaczego ludzie pomagają innym,',
        '- uzasadnia własne zdanie na temat przyjaźni.',
      ].join('\n')],
      ['Przebieg (45 min)', [
        '1. **Temat i przypomnienie pojęć** (4 min). Pokazujesz dwie ramki z podręcznika: opowiadanie i bohater.',
        '2. **Czytanka „Dziesiąty poziom”** (8 min). Uczniowie śledzą tekst w podręczniku na s. 31-34, a lektor czyta z projektora.',
        '3. **Zad. 2 - plan wydarzeń** (10 min). Najpierw wyjaśniasz zasadę, potem uczniowie układają plan. Odsłaniasz przykładową odpowiedź i zapisują uzgodnioną wersję do zeszytu.',
        '4. **Zad. 5** (7 min). W parach układają po trzy pytania otwarte i zamknięte, następnie zadają je sobie nawzajem.',
        '5. **Zad. 6-8** (9 min). Rozmowa kierowana. Odpowiedzi ustne, koło wybiera osoby do wypowiedzi.',
        '6. **Zad. 9** (7 min). Samodzielna odpowiedź z uzasadnieniem do zeszytu.',
      ].join('\n')],
      ['Jak wyjaśnić plan wydarzeń', [
        '- Plan wydarzeń zapisuje najważniejsze wydarzenia w takiej kolejności, w jakiej wystąpiły w tekście.',
        '- Każdy punkt powinien być krótki i mieć podobną formę, najlepiej równoważnika zdania.',
        '- Pomijamy drobne szczegóły. Zostawiamy tylko te zdarzenia, bez których nie da się opowiedzieć historii.',
        '- Po ułożeniu planu sprawdzamy, czy na jego podstawie można odtworzyć treść opowiadania.',
      ].join('\n')],
      ['Odpowiedzi i wskazówki', 'W zad. 5 przypomnij, że pytanie zamknięte zwykle zaczyna się od „czy” i pozwala odpowiedzieć „tak” albo „nie”. W zad. 6-8 nie szukamy jednej wzorcowej odpowiedzi, ale pełnego zdania i przykładu. W zad. 9 uczeń powinien zająć stanowisko, podać argument i krótko go objaśnić.'],
    ),
    questions: [
      { text: 'Dlaczego Jędrek pojechał z Dawidem rozwozić paczki?', answer: 'Mama poprosiła go, aby pomógł Dawidowi w dostarczaniu paczek żywnościowych na Boże Narodzenie.' },
      { text: 'Czego Jędrek dowiedział się o osobach odbierających paczki?', answer: 'Nie wszystkie były bezdomne. Niektóre pracowały, ale zarabiały za mało, aby utrzymać rodzinę.' },
      { text: 'Dlaczego Dominik stał w kolejce po paczkę?', answer: 'Jego tata od pewnego czasu nie miał pracy, więc rodzinie brakowało pieniędzy.' },
      { text: 'Co Dominik zrobił po odebraniu paczki?', answer: 'Zgodził się pomóc Jędrkowi i Dawidowi rozwieźć pozostałe paczki, a potem zanieść jedną Michałowi.' },
      { text: 'Jak zapisujemy dobry plan wydarzeń?', answer: 'Krótko, po kolei i w podobnej formie, uwzględniając tylko najważniejsze wydarzenia.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Pomaganie - dziesiąty poziom przyjaźni'),
      ...recap(previousSetId),
      slideTextbookImage('czytanki:dziesiaty-poziom-opowiadanie.png', 34, 'Przypomnienie: opowiadanie'),
      slideTextbookImage('czytanki:dziesiaty-poziom-bohater.png', 35, 'Przypomnienie: bohater'),
      slideCzytanka('dziesiaty-poziom'),
      {
        id: newId(),
        kind: 'task',
        code: 'Z2',
        title: 'Plan wydarzeń',
        page: 34,
        exerciseNo: '2',
        body: '**Podręcznik s. 34, zad. 2**\n\n**Plan wydarzeń** zawiera najważniejsze zdarzenia zapisane po kolei. Każdy punkt powinien być krótki i mieć podobną formę.\n\nZapisz plan wydarzeń z opowiadania „Dziesiąty poziom”.',
        timerSec: 8 * 60,
        studentAction: 'write-answer',
        studentActionText: 'Do zeszytu',
        answerExample: '1. Prośba mamy o pomoc Dawidowi.\n2. Ładowanie i rozwożenie paczek.\n3. Spór o jedzenie zabrane przez Władka.\n4. Wydawanie żywności w świetlicy.\n5. Spotkanie Dominika i poznanie jego sytuacji.\n6. Wspólne zawiezienie paczek Michałowi.',
      },
      // Lekcja z tekstem - bez notatki z treści tekstu (Bartek, 2026-10-01), w zeszycie tylko temat.
      slideNote('Pomaganie - dziesiąty poziom przyjaźni', ''),
      slideTextbookTask('czytanki:dziesiaty-poziom-zad5.png', 35, 's. 35 zad. 5', 'Pytania otwarte i zamknięte', 'oral', 'Ustnie w parze'),
      slideTextbookTask('czytanki:dziesiaty-poziom-zad6-8.png', 35, 's. 35 zad. 6-8', 'Pomaganie i wolontariat', 'oral', 'Odpowiedzi ustne'),
      slideTextbookTask('czytanki:dziesiaty-poziom-zad9.png', 35, 's. 35 zad. 9', 'Przyjaźń - własne zdanie', 'write-answer', 'Do zeszytu'),
    ],
  },
  {
    title: '12. Kiedy stosować nieosobowe formy czasownika?',
    topic: 'Osobowe i nieosobowe formy czasownika',
    textbookPage: 48,
    teacherPlan: plan(
      ['Co dziś', 'Najpierw świadomie wracamy do filmu z klasy 4 „Czy każda wypowiedź jest zdaniem?”. Uczniowie przypominają sobie, że zdanie ma czasownik w formie osobowej, a bezokolicznik nie wskazuje wykonawcy. Nowa treść dla klasy 5 to dwie kolejne formy nieosobowe: zakończone na **-no, -to** oraz konstrukcje z czasownikiem ze słowem **się**. Podręcznik s. 48-49.'],
      ['Po lekcji uczeń', [
        '- odróżnia formę osobową od nieosobowej,',
        '- rozpoznaje bezokolicznik oraz formy zakończone na **-no, -to**,',
        '- rozpoznaje konstrukcje nieosobowe z czasownikiem i słowem **się**,',
        '- wybiera formę osobową, gdy wykonawca jest ważny, a nieosobową, gdy jest nieznany lub nieistotny.',
      ].join('\n')],
      ['Przebieg (45 min)', [
        '1. **Temat + koło powtórzeniowe** (7 min) - pytania o „Dziesiąty poziom”.',
        '2. **Film z klasy 4** (4 min) - szybka powtórka: forma osobowa, zdanie, równoważnik i bezokolicznik. Cztery odpowiedzi z filmu uczniowie zapisują bardzo krótko.',
        '3. **Co nowego w klasie 5?** (6 min) - pokazujesz trzy gałęzie schematu: bezokolicznik, **-no/-to**, czasownik + **się**. Za każdym razem pytasz: „Czy wiemy, kto wykonał czynność?”.',
        '4. **Podręcznik s. 48, zad. 1** (8 min) - uzupełniają przepis bezokolicznikami. Sprawdzenie kołem na lekcji.',
        '5. **Podręcznik s. 49, zad. 3** (10 min) - zamieniają formy nieosobowe na osobowe, dobierając wykonawcę ze słownictwa.',
        '6. **Graficzna notatka** (7 min) - przerysowują schemat trzech form nieosobowych i dopisują zasadę wyboru.',
        '7. **Podsumowanie ustne** (3 min) - „Kiedy użyję formy osobowej, a kiedy nieosobowej?”.',
      ].join('\n')],
      ['Jak wyjaśnić', [
        '- **Forma osobowa** wskazuje wykonawcę dzięki osobie i liczbie: „uczniowie przygotowali”.',
        '- **Bezokolicznik** nazywa czynność, ale nie wskazuje osoby: „przygotować”, „czytać”.',
        '- Formy na **-no, -to** mówią, że czynność wykonano w przeszłości, lecz nie podają sprawcy: „przygotowano”, „odkryto”.',
        '- Konstrukcje typu „planuje się”, „mówi się”, „buduje się” również odsuwają wykonawcę na dalszy plan.',
        '- Nie mówimy, że każda forma ze słowem „się” jest nieosobowa. W zdaniu „Ola się śmieje” forma „śmieje” wskazuje Olę. Liczy się to, czy da się ustalić wykonawcę.',
      ].join('\n')],
      ['Tablica', '**KTO WYKONUJE CZYNNOŚĆ?**\nWiadomo → forma osobowa: „Uczniowie przygotowali upominki”.\nNie wiadomo / nieważne → forma nieosobowa: „Przygotowano upominki”, „Planuje się remont”.\nNiżej trzy odnogi: bezokolicznik | -no, -to | czasownik + się.'],
      ['Odpowiedzi', '**Zad. 1:** przygotować, ugotować, wsypać, dodać, wymieszać, przełożyć, odstawić.\n**Zad. 3:** np. Aktorzy przeprowadzili warsztaty teatralne. Uczniowie zaprosili rodziców na przedstawienie. Czytelnicy sprawdzili dostępność książki w katalogu. Turyści odkryli skarb w ruinach starego zamku.'],
    ),
    questions: [
      { text: 'Po czym rozpoznasz, że czasownik ma formę osobową?', answer: 'Można określić osobę i liczbę wykonawcy, np. czytamy - 1. osoba liczby mnogiej.' },
      { text: 'Czy bezokolicznik wskazuje wykonawcę czynności? Podaj przykład.', answer: 'Nie. Np. czytać, zrobić, biec.' },
      { text: 'Co mówią formy zakończone na -no, -to?', answer: 'Że czynność wykonano w przeszłości, ale nie wiadomo albo nie jest ważne, kto ją wykonał.' },
      { text: 'Zamień „Odkryto skarb” na zdanie z formą osobową.', answer: 'Np. Turyści odkryli skarb.' },
      { text: 'Kiedy warto użyć formy nieosobowej?', answer: 'Gdy wykonawca jest nieznany, nieważny albo chcemy skupić uwagę na samej czynności.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Osobowe i nieosobowe formy czasownika'),
      ...recap(previousSetId),
      slideVideo('wypowiedzenia-film1'),
      slideText('Co nowego w klasie 5?', '**Formy nieosobowe nie wskazują wykonawcy:**\n\n- bezokolicznik: **czytać, zrobić**,\n- formy na **-no, -to**: **przeczytano, zrobiono**,\n- konstrukcje nieosobowe z **się**: **mówi się, planuje się**.\n\nUwaga: nie każde „się” tworzy konstrukcję nieosobową. „Ola się śmieje” ma wykonawcę.', 'formyNieosobowe'),
      slideTextbookTask('czytanki:formy-nieosobowe-s48-zad1.png', 48, 's. 48 zad. 1', 'Przepis na sałatkę', 'write-answer', 'Do zeszytu'),
      slideTextbookTask('czytanki:formy-nieosobowe-s49-zad3.png', 49, 's. 49 zad. 3', 'Kto wykonał czynność?', 'write-answer', 'Do zeszytu'),
      {
        ...slideNote('Osobowe i nieosobowe formy czasownika', ''),
        diagram: 'formyCzasownika',
        timerSec: 7 * 60,
      },
    ],
  },
  {
    title: '13. Co wyrażamy za pomocą trybów czasownika?',
    topic: 'Tryby czasownika',
    textbookPage: 50,
    teacherPlan: plan(
      ['Co dziś', 'Lekcja z nowym filmem o trzech trybach czasownika. Film pokazuje, że ta sama czynność może być informacją, poleceniem albo przypuszczeniem i pragnieniem. Po filmie uczniowie robią wybrane przez Ciebie zadania 2, 3 i 5 z podręcznika na s. 51-52.'],
      ['Po lekcji uczeń', [
        '- rozpoznaje tryb oznajmujący, rozkazujący i przypuszczający,',
        '- wyjaśnia, co wyraża każdy z trybów,',
        '- określa formę czasownika w trybie oznajmującym,',
        '- przekształca informację w polecenie i tworzy zdania w trybie przypuszczającym.',
      ].join('\n')],
      ['Przebieg (45 min)', [
        '1. **Temat + koło powtórzeniowe** (8 min) - pytania o formy osobowe i nieosobowe.',
        '2. **Film „Tryby czasownika”** (5 min) - trzy tryby pokazane na jednej sytuacji. Przed filmem polecenie: „Zapisz nazwy trzech trybów i po jednym przykładzie”.',
        '3. **Szybkie sprawdzenie po filmie** (4 min) - uczniowie podają swoje przykłady, a Ty układasz je w trzech kolumnach.',
        '4. **Podręcznik s. 51, zad. 2** (7 min) - tryb oznajmujący i pełna analiza formy czasownika „czytać”.',
        '5. **Podręcznik s. 51, zad. 3** (7 min) - przekształcenie zasad bezpieczeństwa w tryb rozkazujący.',
        '6. **Podręcznik s. 52, zad. 5** (7 min) - dokończenie zdań w trybie przypuszczającym.',
        '7. **Graficzna notatka** (7 min) - trzy drogi od tej samej czynności: fakt, polecenie, możliwość.',
      ].join('\n')],
      ['Jak wyjaśnić', [
        '- **Oznajmujący** mówi, co dzieje się naprawdę, działo się albo będzie się działo: „czytam”, „czytałem”, „będę czytać”. Ma czas.',
        '- **Rozkazujący** wyraża polecenie, zakaz, prośbę, radę lub wskazówkę: „czytaj”, „nie czytaj”, „niech przeczyta”. Czasu nie określamy.',
        '- **Przypuszczający** mówi o możliwości, warunku, pragnieniu lub życzeniu: „czytałbym”, „gdyby przeczytała”. Rozpoznajemy go po cząstce **-by-**, która łączy się z końcówką osobową.',
        '- Uwaga na sens: „Niech Ola przeczyta” jest trybem rozkazującym, choć brzmi łagodniej niż „Olu, przeczytaj”.',
      ].join('\n')],
      ['Tablica', 'Trzy kolumny i jedno słowo **czytać**:\nOZNAJMUJĄCY - czytam / czytałem / będę czytać - fakt\nROZKAZUJĄCY - czytaj / niech czyta - polecenie lub prośba\nPRZYPUSZCZAJĄCY - czytałbym / gdyby czytała - możliwość lub pragnienie'],
      ['Odpowiedzi', '**Zad. 2:** wszystkie formy są w trybie oznajmującym. Tata czyta - 3 os., lp., czas teraźniejszy. Dzieci czytały - 3 os., lm., czas przeszły, rodzaj niemęskoosobowy. Lokatorzy czytali - 3 os., lm., czas przeszły, rodzaj męskoosobowy. Mama będzie czytała - 3 os., lp., czas przyszły, rodzaj żeński.\n**Zad. 3:** Nie trzymaj suszarki wilgotnymi rękami. Nie używaj jej podczas kąpieli. Stosuj ją wyłącznie zgodnie z przeznaczeniem. Po suszeniu zawsze wyjmij wtyczkę z gniazdka.\n**Zad. 5:** odpowiedzi własne, poprawne formy z -by-, np. surfowałbym, zbudowałbym szałas, polecieliby do szkoły.'],
    ),
    questions: [
      { text: 'Jakie są trzy tryby czasownika?', answer: 'Oznajmujący, rozkazujący i przypuszczający.' },
      { text: 'Co wyraża tryb oznajmujący?', answer: 'Informację o czynności lub stanie, które są, były albo będą rzeczywiste.' },
      { text: 'Co może wyrażać tryb rozkazujący oprócz rozkazu?', answer: 'Zakaz, prośbę, radę albo wskazówkę.' },
      { text: 'Po czym najłatwiej rozpoznać tryb przypuszczający?', answer: 'Po cząstce -by-, np. zrobiłbym, poszłaby, przeczytalibyśmy.' },
      { text: 'Określ tryb w zdaniu „Niech przyjaciele pojadą z nami”.', answer: 'Tryb rozkazujący.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Tryby czasownika'),
      ...recap(previousSetId),
      slideVideo('tryby-czasownika-film1'),
      slideTextbookTask('czytanki:tryby-s51-zad2.png', 51, 's. 51 zad. 2', 'Tryb i forma czasownika', 'write-answer', 'Do zeszytu'),
      slideTextbookTask('czytanki:tryby-s51-zad3.png', 51, 's. 51 zad. 3', 'Zasady bezpiecznego używania suszarki', 'write-answer', 'Do zeszytu'),
      slideTextbookTask('czytanki:tryby-s52-zad5.png', 52, 's. 52 zad. 5', 'Co by było, gdyby…', 'write-answer', 'Do zeszytu'),
      {
        ...slideNote('Tryby czasownika', ''),
        diagram: 'trybyCzasownika',
        timerSec: 7 * 60,
      },
    ],
  },
  {
    title: '15. Wikipedia i współczesne sposoby komunikowania się',
    topic: 'Wikipedia i sposoby komunikowania się',
    textbookPage: 54,
    teacherPlan: plan(
      ['Co dziś', 'Dwie części na jednej lekcji. **Wikipedia** (s. 54-55): zamiast fragmentów artykułu z podręcznika czytamy własną czytankę „Wikipedia. Największa encyklopedia świata” (2:47, podświetlanie słów) - ten sam materiał prościej: kto pisze, skąd nazwa, zasady, jak sprawdzać. Potem film (3:47) z 3 zadaniami i sprawdzeniem po każdym. **Sposoby komunikowania się** (s. 40-41): mapa z podręcznika na ekranie, czytamy ramki razem i dopasowujemy sposób do sytuacji.'],
      ['Po lekcji uczeń', [
        '- wyjaśnia, czym Wikipedia różni się od tradycyjnej encyklopedii (kto pisze, kto sprawdza),',
        '- zna najważniejsze zasady Wikipedii: neutralność, źródła, prawa autorskie,',
        '- wymienia trzy sposoby sprawdzenia artykułu: przypisy, drugie źródło, oznaczenia,',
        '- odróżnia fakt od opinii w zdaniu encyklopedycznym,',
        '- nazywa współczesne sposoby komunikowania się (SMS/MMS, e-mail, komunikator, portal społecznościowy, blog, forum) i dobiera je do sytuacji.',
      ].join('\n')],
      ['Przebieg (45 min)', [
        '1. **Temat + koło powtórzeniowe** (6 min) - pytania o tryby czasownika.',
        '2. **Na start, ustnie** (2 min): „Kto z was korzystał z Wikipedii? Czy zawsze można jej wierzyć?” - nie rozstrzygasz, odpowiedź da czytanka.',
        '3. **Czytanka** (4 min) - lektorka czyta, uczniowie śledzą tekst na ekranie.',
        '4. **Film** (4 min). Zanim puścisz: „Zeszyty otwarte, w filmie są 3 zadania, po każdym od razu sprawdzenie”.',
        '5. **Z1 - fakty o zwierzęciu** (5 min). 2-3 osoby czytają, klasa łapie opinie.',
        '6. **Mapa s. 40-41** (5 min) - czytacie ramki na zmianę (koło wybiera czytających). Dopytaj: „Czym różni się SMS od MMS-a? Od ilu lat konto na Facebooku?”.',
        '7. **Z2 - dopasuj sposób do sytuacji** (5 min).',
        '8. **Koło z pytaniami lekcji** (7 min) - 6 pytań z obu części.',
        '9. **Notatka** (5 min) + zadanie domowe ze s. 55.',
      ].join('\n')],
      ['Odpowiedzi do zadań z filmu', [
        '- **Z1** 1 - Wikipedia, 2 - encyklopedia papierowa, 3 - Wikipedia, 4 - Wikipedia.',
        '- **Z2** zdanie 2 („Żyrafy są najpiękniejszymi zwierzętami na świecie!”) - opinia, łamie zasadę neutralności.',
        '- **Z3** wersja przejrzana → dobry artykuł → artykuł na medal.',
      ].join('\n')],
      ['Jak wyjaśnić', [
        '- **Nazwa:** hawajskie „wiki wiki” = bardzo szybko + encyklopedia. Szybkość to siła i słabość: nowości są od razu, ale nikt nie sprawdza ich przed publikacją.',
        '- **Fakt czy opinia?** Fakt da się sprawdzić w innym źródle. Opinię zdradzają słowa „najpiękniejszy”, „najlepszy”, „uważam”, wykrzyknik. Łączy się to z tekstem informacyjnym z wcześniejszych lekcji.',
        '- **Drugie źródło** musi być niezależne - wiele stron kopiuje tekst z Wikipedii, więc „to samo w trzech miejscach” niczego nie dowodzi.',
        '- **SMS czy MMS:** SMS to sam tekst, MMS może mieć zdjęcie albo film. **Blog** to internetowy dziennik jednej osoby, **forum** to rozmowa wielu osób o jednym temacie.',
        '- Portal społecznościowy od 13 lat - dobry moment na krótką rozmowę o tym, co wolno publikować (wizerunek, dane, prawa autorskie jak w Wikipedii).',
      ].join('\n')],
      ['Tablica', 'Dwie kolumny:\n**WIKIPEDIA** - piszą internauci | zasady: neutralność, źródła, prawa autorskie | sprawdzam: przypisy → drugie źródło → oznaczenia (✔ przejrzana, ⭐ dobry, 🏅 na medal)\n**JAK SIĘ KOMUNIKUJEMY?** - SMS/MMS · e-mail · komunikator · portal społecznościowy · blog · forum'],
      ['Zadanie domowe', 'Podręcznik s. 55: **zad. 3** - sprawdź w opisany sposób hasła „Mieszko I” i „żyrafa” (wypisz: czy są przypisy, jakie oznaczenie ma artykuł). **Zad. 5** - jakie kryteria musi spełnić artykuł na medal (dla chętnych).'],
    ),
    // Kolo po obu czesciach lekcji - zadania filmu sprawdza sam film.
    questions: [
      { text: 'Kto pisze hasła w Wikipedii, a kto w tradycyjnej encyklopedii?', answer: 'Wikipedię piszą internauci (każdy może poprawić), tradycyjną encyklopedię eksperci, a hasła sprawdzają redaktorzy i recenzenci.' },
      { text: 'Skąd pochodzi nazwa „Wikipedia”?', answer: 'Z hawajskiego „wiki wiki” (bardzo szybko) i słowa „encyklopedia”.' },
      { text: 'Co znaczy, że artykuł w Wikipedii ma być neutralny?', answer: 'Podaje fakty, bez opinii i ocen.' },
      { text: 'Jak sprawdzić, czy artykuł w Wikipedii jest wiarygodny?', answer: 'Zobaczyć przypisy (źródła), porównać z drugim, niezależnym źródłem, sprawdzić oznaczenia (wersja przejrzana, dobry artykuł, artykuł na medal).' },
      { text: 'Czym różni się SMS od MMS-a?', answer: 'SMS to sama wiadomość tekstowa, MMS może zawierać zdjęcie albo film.' },
      { text: 'Czym różni się blog od forum dyskusyjnego?', answer: 'Blog to internetowy dziennik jednej osoby, a na forum wiele osób o podobnych zainteresowaniach wymienia się opiniami.' },
      { text: 'Od ilu lat można założyć konto na Facebooku? Jak nazywa się takie konto?', answer: 'Od 13 lat. Konto to profil.' },
    ],
    makeSlides: (previousSetId, ownSetId) => [
      slideTopic('Wikipedia i sposoby komunikowania się'),
      ...recap(previousSetId),
      slideCzytanka('wikipedia'),
      slideVideo('wikipedia-film1'),
      slideTask('Z1', 'Napisz **dwa zdania** o swoim ulubionym zwierzęciu, które mogłyby trafić do Wikipedii - **same fakty**, bez opinii.\n\nPotem dopisz **jedno zdanie-opinię**, którego redaktor by nie wpuścił.', 5 * 60, undefined, 'Fakty: Kot domowy jest ssakiem drapieżnym. Koty śpią nawet 15 godzin na dobę.\nOpinia: Koty są najsłodszymi zwierzętami na świecie!'),
      slideTextbookImage('czytanki:komunikacja-s40-41.webp', 40, 'Współczesne sposoby komunikowania się'),
      slideTask('Z2', 'Jak się skomunikujesz? Do każdej sytuacji dopisz sposób: **SMS, MMS, e-mail, komunikator, portal społecznościowy, blog, forum**.\n\n1. Piszesz do wychowawczyni, że jutro cię nie będzie.\n2. Wysyłasz babci zdjęcie z wycieczki na zwykły telefon.\n3. Umawiasz się z trzema kolegami na boisko - za 10 minut.\n4. Chcesz co tydzień opisywać swoje wyprawy rowerowe.\n5. Pytasz innych właścicieli papug, jak nauczyć ptaka mówić.\n6. Pokazujesz znajomym zdjęcia i czytasz ich komentarze.', 5 * 60, undefined, '1. e-mail\n2. MMS\n3. komunikator (albo SMS)\n4. blog\n5. forum dyskusyjne\n6. portal społecznościowy'),
      ...(ownSetId ? [{ ...slideRecap(ownSetId), questionCount: 6 }] : []),
      slideNote('Wikipedia i sposoby komunikowania się', '1. Wikipedia to darmowa encyklopedia internetowa, którą piszą internauci („wiki wiki” = bardzo szybko).\n2. Zasady: fakty bez opinii (neutralność), źródła, nie kopiujemy cudzych tekstów.\n3. Sprawdzam artykuł: przypisy, drugie źródło, oznaczenia (wersja przejrzana, dobry artykuł, artykuł na medal).\n4. Komunikujemy się przez: SMS/MMS, e-mail, komunikatory, portale społecznościowe, blogi i fora dyskusyjne.'),
      slideTextbookTask('czytanki:wikipedia-s55.webp', 55, 's. 55 zad. 3 i 5', 'Zadanie domowe', 'write-answer', 'Do domu'),
    ],
  },
  {
    // Rym jest na mapie dzialu (s. 13 i s. 56). Lekcja na materialach Bartka (teoria + karta pracy,
    // obrazy rymy-*.webp w prywatnym buckecie czytanek - we fragmentach sa cudze wiersze i rap).
    title: '15a. Rym - schematy i rodzaje rymów',
    topic: 'Rym - schematy i rodzaje rymów',
    textbookPage: 13,
    teacherPlan: plan(
      ['Co dziś', 'Lekcja na Twoich materiałach: najpierw **teoria rymów** (7 slajdów), potem **karta pracy** (4 ćwiczenia, ćwiczenie 3 na dwóch slajdach). Na koniec koło z pytaniami i notatka. Rym wraca na podsumowaniu działu (lekcja 16).'],
      ['Po lekcji uczeń', [
        '- wyjaśnia, co to jest rym,',
        '- rozpoznaje schemat rymów: parzyste (AABB), krzyżowe (ABAB), okalające (ABBA),',
        '- odróżnia rym dokładny od niedokładnego, męski od żeńskiego, gramatyczny od niegramatycznego,',
        '- dopisuje wers według schematu,',
        '- wskazuje rym wewnętrzny.',
      ].join('\n')],
      ['Przebieg (45 min)', [
        '1. **Temat + koło powtórzeniowe** (5 min) - pytania o Wikipedię i sposoby komunikowania się.',
        '2. **Teoria** (12 min) - 7 slajdów, uczniowie zapisują schematy i przykłady.',
        '3. **Ćwiczenie 1** - schemat rymów (5 min).',
        '4. **Ćwiczenie 2** - rodzaje rymów w parach (6 min).',
        '5. **Ćwiczenie 3** - dopisz wersy (8 min, wybierz 2 z 4 albo w grupach).',
        '6. **Ćwiczenie 4** - rymy wewnętrzne (zapas).',
        '7. **Koło z pytaniami lekcji** (5 min) i **notatka** (4 min).',
      ].join('\n')],
      ['Odpowiedzi', [
        '- **Ćw. 1** fragment 1 - okalający (ABBA), fragment 2 - krzyżowy (ABAB), fragment 3 - parzysty (AABB).',
        '- **Ćw. 2** dom - tom: dokładny, męski, gramatyczny · kochanie - szukanie: dokładny, żeński, gramatyczny · serce - więcej: niedokładny, żeński, niegramatyczny · biały - klawisz: niedokładny, żeński, niegramatyczny · miłość - zażyłość: dokładny, żeński, gramatyczny.',
        '- **Ćw. 3** wersy dowolne, sprawdzamy schemat i rodzaj rymu.',
        '- **Ćw. 4** podpowiedzi są na karcie: Asy - klasy, szóstki - nudny, Kier - jazz; torbę stylu - problem synu; epitety - etykiety.',
      ].join('\n')],
    ),
    // Kolo na koniec: nowe przyklady do pojec z teorii.
    questions: [
      { text: 'Co to jest rym?', answer: 'Podobne lub identyczne brzmienie końcówek wyrazów, najczęściej na końcu wersów.' },
      { text: 'Jak nazywa się schemat AABB? A ABAB? A ABBA?', answer: 'AABB - parzyste, ABAB - krzyżowe, ABBA - okalające.' },
      { text: 'Rym dokładny czy niedokładny: mama - brama? kot - kos?', answer: 'Mama - brama: dokładny (brzmi identycznie). Kot - kos: niedokładny (zgadza się samogłoska, końcówki podobne).' },
      { text: 'Rym męski czy żeński: kot - płot? lato - złoto?', answer: 'Kot - płot: męski (akcent na ostatniej sylabie). Lato - złoto: żeński (akcent na przedostatniej).' },
      { text: 'Rym gramatyczny czy niegramatyczny: skacze - płacze? rzeka - czeka?', answer: 'Skacze - płacze: gramatyczny (oba czasowniki). Rzeka - czeka: niegramatyczny (rzeczownik i czasownik).' },
      { text: 'Podaj rym gramatyczny z dwóch przymiotników.', answer: 'Np. biały - mały, wesoły - goły, zielony - czerwony.' },
      { text: 'Co to jest rym wewnętrzny?', answer: 'Rym w tym samym miejscu w różnych wersach, a nie tylko na ich końcu.' },
      { text: 'Dopisz wers do „Na śniegu stoi bałwanek mały”, tak żeby wyszedł rym parzysty.', answer: 'Np. „a obok niego dzieci się śmiały”.' },
    ],
    makeSlides: (previousSetId, ownSetId) => [
      slideTopic('Rym - schematy i rodzaje rymów'),
      ...recap(previousSetId),
      obrazRymy('teoria-1', 'Teoria rymów - czym jest rym?'),
      obrazRymy('teoria-2', 'Teoria rymów - schematy'),
      obrazRymy('teoria-3', 'Teoria rymów - dokładny i niedokładny'),
      obrazRymy('teoria-4', 'Teoria rymów - męski i żeński'),
      obrazRymy('teoria-5', 'Teoria rymów - gramatyczny i niegramatyczny'),
      obrazRymy('teoria-6', 'Teoria rymów - rymy wewnętrzne'),
      obrazRymy('teoria-7', 'Teoria rymów - podsumowanie'),
      obrazRymy('karta-1', 'Ćwiczenie 1', 'Ćw. 1'),
      obrazRymy('karta-2', 'Ćwiczenie 2', 'Ćw. 2'),
      obrazRymy('karta-3ab', 'Ćwiczenie 3 (A i B)', 'Ćw. 3 A-B'),
      obrazRymy('karta-3cd', 'Ćwiczenie 3 (C i D)', 'Ćw. 3 C-D'),
      obrazRymy('karta-4', 'Ćwiczenie 4', 'Ćw. 4'),
      ...(ownSetId ? [{ ...slideRecap(ownSetId), questionCount: 5 }] : []),
      slideNote('Rym - schematy i rodzaje rymów', '1. **Rym** - podobne lub identyczne brzmienie końcówek wyrazów, najczęściej na końcu wersów.\n2. Schematy: **AABB** parzyste, **ABAB** krzyżowe, **ABBA** okalające.\n3. Rym **dokładny** (koc - noc) i **niedokładny** (serce - grzeszę).\n4. Rym **męski** - akcent na ostatnią sylabę (dom - tom), **żeński** - na przedostatnią (kochanie - szukanie).\n5. Rym **gramatyczny** - ta sama część mowy (biały - mały), **niegramatyczny** - różne.\n6. **Rym wewnętrzny** - w tym samym miejscu w różnych wersach.'),
    ],
  },
  {
    title: '16. Podsumowanie działu - To wiem! To potrafię!',
    topic: 'W poszukiwaniu przyjaźni - podsumowanie działu',
    textbookPage: 56,
    teacherPlan: plan(
      ['Co dziś', 'Lekcja podsumowująca dział na podstawie mapy z s. 56. Rdzeń to film (10,5 min) - przechodzi przez całą mapę: wiersz, opowiadanie i dialog, tekst informacyjny, e-mail, głoski, czasownik i pisownię „by”. W filmie jest 8 zadań. Po każdym jest pasek odliczania, a zaraz potem sprawdzenie, więc uczniowie sami stawiają sobie ✓ w zeszycie. Po filmie koło z pytaniami przekrojowymi i dwa zadania, które łączą kilka tematów naraz.'],
      ['Po lekcji uczeń', [
        '- odróżnia podmiot liryczny od narratora, wskazuje rym i porównanie,',
        '- zna części opowiadania i poprawnie zapisuje dialog,',
        '- odróżnia fakt od opinii w tekście informacyjnym,',
        '- pisze grzeczny e-mail z tematem, powitaniem, pożegnaniem i podpisem,',
        '- rozpoznaje formy nieosobowe i tryby czasownika, poprawnie pisze „by”,',
        '- ocenia sam, co już umie z działu (ile zadań z filmu na 8).',
      ].join('\n')],
      ['Przebieg (45 min)', [
        '1. **Temat + koło powtórzeniowe** (6 min) - pytania o tryby czasownika.',
        '2. **Mapa działu** (1 min) - screen s. 56: „Dziś przejdziemy przez całą tę mapę”.',
        '3. **Film** (11 min). Zanim puścisz: „Zeszyty otwarte. W filmie jest 8 zadań. Zapisujecie odpowiedź, a po sprawdzeniu stawiacie sobie ✓ albo poprawiacie na zielono”. Na końcu szybkie podniesienie rąk: kto ma 6 i więcej ✓?',
        '4. **Koło podsumowujące** (7 min) - 6 pytań z całego działu, inne niż w filmie.',
        '5. **Z1 - dialog, który łączy wszystko** (8 min). Wylosowane 2-3 osoby czytają na głos, klasa szuka porównania i trybów.',
        '6. **Z2 - e-mail do wychowawczyni** (7 min).',
        '7. **Notatka - mapa działu** (5 min).',
      ].join('\n')],
      ['Odpowiedzi do zadań z filmu', [
        '- **Z1** rymy: koc - noc, kłócę - wrócę; porównanie: przyjaciel jak ciepły koc; podmiot liryczny: osoba, która mówi o swoim przyjacielu.',
        '- **Z2** C - narrator, który bierze udział w wydarzeniach („wracałem”).',
        '- **Z3** – Idziesz na boisko? – zapytał Jacek. / – Nie mam czasu – odpowiedział Radek.',
        '- **Z4** B - „Wilki żyją w grupach nazywanych watahami” (fakt).',
        '- **Z5** brak tematu, „siema” → Dzień dobry, „nara” → Pozdrawiam, brak podpisu (bonus: brak polskich liter).',
        '- **Z6** nić, leń, koniec.',
        '- **Z7** pomalowano - forma na -no, -to; pomaluj - rozkazujący; pomalowałabym - przypuszczający; pomalować - bezokolicznik; malujemy - oznajmujący.',
        '- **Z8** poszłaby, gdyby, można by spróbować, zrobiono by, ty byś wiedział.',
      ].join('\n')],
      ['Jak wyjaśnić', [
        '- Jeśli większość myli **podmiot liryczny z narratorem**: wiersz → podmiot liryczny, opowiadanie → narrator. Autor żyje naprawdę i tylko napisał tekst.',
        '- **Fakt czy opinia?** Fakt można sprawdzić w encyklopedii. Opinię zdradzają słowa „uważam”, „najpiękniejszy”, wykrzykniki.',
        '- **„By” jednym zdaniem:** razem z czasownikiem, który ma osobę (zrobiłbym), i w gdyby/żeby/aby. Osobno przy wszystkim innym (można by, zrobiono by, ja bym).',
        '- Przy Z1 zwróć uwagę na zapis dialogu - to najczęstszy błąd z działu.',
      ].join('\n')],
      ['Tablica', 'Mapa jak na s. 56: w środku **TO WIEM! TO POTRAFIĘ!**, trzy gałęzie:\n**LITERATURA** - podmiot liryczny, rym, porównanie | opowiadanie, narrator, bohater | dialog\n**TEKSTY, KTÓRE UCZĄ** - tekst informacyjny (fakty!), encyklopedia, Wikipedia | e-mail\n**JĘZYK** - głoski miękkie/twarde | czasownik: formy nieosobowe, tryby | by razem / osobno'],
    ),
    // Kolo po filmie: pytania przekrojowe z calego dzialu (zadania filmu sprawdza sam film).
    questions: [
      { text: 'Czym różni się podmiot liryczny od narratora?', answer: 'Podmiot liryczny mówi w wierszu, a narrator opowiada historię w opowiadaniu.' },
      { text: 'Podaj przykład porównania. Które słowo je tworzy?', answer: 'Np. „szybki jak wiatr” - słowo „jak” (albo niczym, jakby).' },
      { text: 'Z jakich części składa się opowiadanie i co piszemy we wstępie?', answer: 'Wstęp, rozwinięcie, zakończenie. Wstęp: kto, gdzie, kiedy.' },
      { text: 'Czego nie może być w tekście informacyjnym?', answer: 'Opinii i emocji - podaje tylko fakty.' },
      { text: 'Jakie elementy musi mieć e-mail do nauczyciela?', answer: 'Temat, powitanie, treść, pożegnanie i podpis.' },
      { text: 'Odmień „pisać” w trzech trybach (1. osoba).', answer: 'Piszę (oznajmujący), pisz (rozkazujący), pisałbym / pisałabym (przypuszczający).' },
      { text: 'Wymień trzy formy nieosobowe czasownika z przykładami.', answer: 'Bezokolicznik (czytać), forma na -no, -to (czytano), konstrukcja z się (czyta się).' },
      { text: 'Razem czy osobno: zrobił(by)m, można(by), gdy(by)?', answer: 'zrobiłbym - razem, można by - osobno, gdyby - razem.' },
    ],
    makeSlides: (previousSetId, ownSetId) => [
      slideTopic('W poszukiwaniu przyjaźni - podsumowanie działu'),
      ...recap(previousSetId),
      slideTextbookImage('czytanki:podsumowanie5-s56.png', 56, 'Mapa działu - to wszystko dziś powtórzymy'),
      slideVideo('podsumowanie5-dzial1-film1'),
      ...(ownSetId ? [{ ...slideRecap(ownSetId), questionCount: 6 }] : []),
      slideTask('Z1', 'Koks wrócił do domu. Napisz **4 linijki dialogu** Jacka i Radka.\n\nW dialogu muszą być:\n1. jedno **porównanie** (jak, niczym, jakby),\n2. jeden czasownik w **trybie rozkazującym**,\n3. jeden czasownik w **trybie przypuszczającym** - uważaj na pisownię „by”.\n\nPamiętaj o myślnikach i słowach narratora.', 8 * 60, 'dialog', '– Koks wrócił! – krzyknął Jacek, szczęśliwy jak dziecko w Wigilię.\n– Pogłaszcz go – zaproponował Radek. – Chyba już mnie lubi.\n– Gdybyś go nie znalazł, nie spałbym całą noc – powiedział cicho Jacek.\n– Chodźmy z nim na spacer! – zawołał Radek.'),
      slideTask('Z2', 'Napisz **e-mail do wychowawczyni**. Klasa chce zorganizować zbiórkę karmy dla schroniska.\n\n- temat,\n- powitanie,\n- 2-3 zdania: co chcecie zrobić i o co prosicie (użyj trybu przypuszczającego, np. „moglibyśmy”),\n- pożegnanie i podpis.', 7 * 60, undefined, 'Temat: Zbiórka karmy dla schroniska\n\nDzień dobry,\nnasza klasa chciałaby zorganizować zbiórkę karmy dla schroniska. Moglibyśmy ustawić pudło na korytarzu przez dwa tygodnie. Czy zgodziłaby się Pani nam pomóc?\n\nPozdrawiam\nOla Nowak, 5a'),
      slideNote('W poszukiwaniu przyjaźni - podsumowanie', '**LITERATURA:** podmiot liryczny mówi w wierszu, narrator w opowiadaniu. Rym, porównanie (jak, niczym). Opowiadanie: wstęp, rozwinięcie, zakończenie; dialog od myślnika.\n**TEKSTY, KTÓRE UCZĄ:** tekst informacyjny = fakty bez opinii. Wikipedię sprawdzam w drugim źródle. E-mail: temat, powitanie, treść, pożegnanie, podpis.\n**JĘZYK:** miękkie: kreska (koń) albo „i” (koniec). Formy nieosobowe: czytać, czytano, czyta się. Tryby: czytam, czytaj, czytałbym. „By” razem z osobową formą (zrobiłbym) i w gdyby, osobno przy reszcie (można by).'),
    ],
  },
];

const ALL_TOPICS: Topic[] = [...TOPICS.map((t) => ({ ...t, dzial: t.dzial ?? DZIAL })), ...DZIAL2_TOPICS];

export function buildTextbook5(grade: string, classIds: string[]): FreshMaterialsBundle {
  if (grade.toUpperCase() !== 'V') throw new Error('Materiał jest przygotowany dla klasy V.');
  const questionSets: QuestionSet[] = ALL_TOPICS.map((topic) => ({ id: newId(), name: topic.title, topic: topic.title, classIds, createdAt: new Date().toISOString() }));
  const questions: Question[] = [];
  const lessons: Array<Omit<Lesson, 'id' | 'order'>> = ALL_TOPICS.map((topic, index) => {
    const setId = questionSets[index].id;
    topic.questions.forEach((question, order) => questions.push({ id: newId(), setId, ...question, order }));
    return {
      grade,
      title: topic.title,
      topic: topic.topic,
      registerTopic: topic.title.replace(/^[\d-]+[a-z]?\.\s*/, ''),
      materialType: 'textbook',
      textbookPage: topic.textbookPage,
      teacherPlan: topic.teacherPlan,
      questionSetId: setId,
      reviewQuestionSetId: setId,
      dzial: topic.dzial,
      progress: {},
      slides: topic.makeSlides(questionSets[index - 1]?.id, setId),
    };
  });
  return { lessons, questionSets, questions };
}

export const TEXTBOOK5_TOPIC_COUNT = ALL_TOPICS.length;

/**
 * Tematy wycofane z materialu - automat odswiezania usuwa je z rocznika.
 * Omowienie "Sztuki programowania" weszlo do lekcji o dialogu. Lekcje 5-15
 * (pierwszy, hurtowy szkic dzialu) wycofane 2026-09-24 - Bartek robi dzial od
 * nowa, lekcja po lekcji. Tematy 12-13 zostaly juz odbudowane i wrocily wyzej.
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
  '14. Pisownia cząstki „by”',
  '15. W poszukiwaniu przyjaźni - powtórzenie',
]);
