// Klasa 5, dzial "W poszukiwaniu przyjazni" (podrecznik s. 14-53) jako gotowe
// prezentacje. Nie przepisujemy podrecznika jeden do jednego: z dzialu
// wybrane sa trzy czytanki (Pax, Dziesiaty poziom, K kontra K), a pomiedzy
// nimi ida lekcje praktyczne - pisanie, gramatyka, internet - zeby nie kazda
// lekcja byla czytaniem. Lekcja 1 to omowienie "Sztuki programowania", ktora
// klasa przeczytala wczesniej.
//
// Kazda lekcja ma `teacherPlan` - sciagawke tylko dla nauczyciela (przycisk
// "Plan" na liscie lekcji): co czytamy, o czym powiedziec, jak wyjasnic, co
// narysowac na tablicy. Nagrania czytanek sa w src/data/czytanki.ts (V.1...).

import type { Lesson, Question, QuestionSet, Slide, SlideArt } from './types';
import type { FreshMaterialsBundle } from '../components/lessons/refreshMaterials';
import { newId } from './id';

interface Topic {
  title: string;
  topic: string;
  textbookPage: number;
  teacherPlan: string;
  questions: Array<{ text: string; answer: string }>;
  makeSlides: (previousQuestionSetId?: string) => Slide[];
}

const DZIAL = 'W poszukiwaniu przyjaźni';

/** Sekcje planu: "## Naglowek" + tresc, oddzielone pusta linia (markdown-lite). */
function plan(...sections: Array<[string, string]>): string {
  return sections.map(([heading, body]) => `## ${heading}\n\n${body}`).join('\n\n');
}

const TOPICS: Topic[] = [
  {
    title: '1. Sztuka programowania - omówienie',
    topic: 'Sztuka programowania',
    textbookPage: 14,
    teacherPlan: plan(
      ['Co dziś', 'Tekst jest już przeczytany - dziś tylko rozmowa i zadania, bez czytania na głos. Podręcznik otwarty na s. 14-18, dzieci szukają w nim dowodów.\nNagranie całości: głośnik „Czytanki” → V.1 (9 min). Przydaje się dla nieobecnych albo żeby puścić samą scenę na boisku (s. 16).'],
      ['Przebieg (45 min)', [
        '1. **Temat do zeszytu + obecność** (3 min). Koło powtórzeniowe: to pierwsza lekcja działu, więc albo je pomijasz, albo odpalasz z listy na pytaniach z ostatniej powtórki.',
        '2. **Rozgrzewka: co się stało?** (6 min). Każda wylosowana osoba mówi jedno zdanie z fabuły, po kolei. Ty w tym czasie rysujesz na tablicy oś wydarzeń (niżej).',
        '3. **Z1 - narrator** (4 min).',
        '4. **Z2 - Radek przed i po** (8 min) + rozmowa: zad. 2 i 4 ze s. 18.',
        '5. **Z3 - ciężar spadł z serca** (7 min) + zad. 7: czego wymaga przyjaźń? Słowa zbierasz na tablicy.',
        '6. **Z4 - dialog pod lupą** (5 min) - pomost do następnej lekcji.',
        '7. **Notatka do zeszytu** (5 min).',
      ].join('\n')],
      ['Jak wyjaśnić', [
        '- **Narrator:** zapytaj „Kto nam to opowiada? Czy on tam jest? Mówi «ja»?”. Nie mówi „ja”, opowiada o Radku - więc tylko obserwuje.',
        '- **Radek:** nie oceniaj go od razu. Zapytaj: „A wy? Cała drużyna się śmieje, Modry popycha nowego - co robicie?”. Chodzi o uczciwą odpowiedź: Radek bał się, że straci kolegów. Jego błąd to milczenie, a nie złośliwość. Potem sam go naprawił.',
        '- **Jacek:** nie mścił się i wybaczył („Nic nie pamiętam”). To też jest sztuka.',
        '- **Tytuł na koniec:** „Dlaczego «Sztuka programowania», skoro to opowiadanie o przyjaźni?”. Przyjaźni też trzeba się nauczyć, jak programowania - najpierw nic nie rozumiesz, potem „zaskakują kable”.',
      ].join('\n')],
      ['Tablica', 'Oś wydarzeń: Nowy w klasie → kujon? → kurs w MDK → Koks i Matylda → boisko: Modry popycha, Radek milczy → Jacek się odsuwa → wypadek, zaginiony Koks → Radek szuka i znajduje → „nic nie pamiętam”.\nPod osią dwie kolumny: **Radek zawiódł, bo...** | **Radek naprawił, bo...**'],
      ['Praca domowa (jeśli chcesz)', 'Zad. 10, s. 18: jesteś Jackiem - 5 zdań o pierwszych dniach w nowej szkole, w 1. osobie („ja”).'],
    ),
    questions: [
      { text: 'Jak klasa przyjęła nowego ucznia, Jacka?', answer: 'Bez entuzjazmu. Koledzy uznali go za kujona, bo czytał książkę o programowaniu.' },
      { text: 'Na jaki kurs zapisał się Radek i kogo tam spotkał?', answer: 'Na kurs programowania w MDK. Spotkał tam Jacka.' },
      { text: 'Jak zachował się Radek, gdy Modry popchnął Jacka na boisku?', answer: 'Nie zareagował. Odwrócił się i udawał, że wiąże sznurowadło.' },
      { text: 'W jaki sposób Radek naprawił swój błąd?', answer: 'Odnalazł zaginionego psa Jacka, Koksa, i przyprowadził go do domu.' },
      { text: 'Co znaczy wyrażenie „ciężar spadł z serca”?', answer: 'Poczuć ulgę, pozbyć się zmartwienia albo wyrzutów sumienia.' },
    ],
    makeSlides: () => [
      slideTopic('Sztuka programowania'),
      slideRead('Wracamy do tekstu', 14, 18, 'Opowiadanie już znamy. Dziś szukamy w nim dowodów: kto opowiada, jak zmienia się Radek i czego wymaga przyjaźń. Miej otwarty podręcznik.', 5 * 60),
      slideText('Przypomnienie: kto opowiada?', '**Narrator** to osoba, która opowiada historię.\n\n- może **brać udział** w wydarzeniach - mówi wtedy „ja”: „Pobiegłem do domu”,\n- może je tylko **obserwować** i opowiadać o innych: „Radek pobiegł do domu”.', 'narrator'),
      slideTask('Z1', 'Kto opowiada „Sztukę programowania”?\n\nZapisz w zeszycie: czy narrator **bierze udział** w wydarzeniach, czy je tylko **obserwuje**. Przepisz z tekstu jedno zdanie, które to udowadnia.', 4 * 60, 'narrator', 'Narrator tylko obserwuje. Opowiada o Radku, nie mówi „ja”, np. „Radek szybkim ruchem wyrwał Jackowi książkę”.'),
      slideTask('Z2', 'Radek przed i po. Dokończ w zeszycie trzy zdania:\n\n1. Na początku Radek uważał Jacka za...\n2. Kiedy Modry popchnął Jacka, Radek...\n3. Kiedy zaginął Koks, Radek...\n\nPod spodem napisz jedno słowo: **dlaczego** Radek zachował się tak na boisku?', 7 * 60, 'kolejnoscZdarzen', '1. ...kujona, dziwaka.\n2. ...nie zareagował, odwrócił się i udawał, że wiąże sznurowadło.\n3. ...szukał go do nocy, a rano pojechał rowerem do Jabłonki, uwolnił psa z łańcucha i przyprowadził go do Jacka.\n\nDlaczego: bał się (kolegów, śmiechu, że straci drużynę).'),
      slideTask('Z3', 'Na końcu czytamy, że Radkowi „wielki ciężar spadł z serca”.\n\n1. Co znaczy to wyrażenie?\n2. Jaki to był ciężar i dlaczego zniknął?\n3. Dokończ zdanie: **Przyjaźń wymaga...** (podaj dwa słowa).', 6 * 60, 'frazeologizm', '1. Poczuć ulgę.\n2. Wyrzuty sumienia, że zawiódł Jacka. Zniknęły, bo Radek naprawił błąd i Jacek mu wybaczył („Nic nie pamiętam”).\n3. Np. odwagi, lojalności, stawania w obronie, umiejętności przeproszenia i wybaczenia.'),
      slideTask('Z4', 'Dialog pod lupą (zad. 8, s. 18).\n\nPrzepisz z tekstu wypowiedź: **– Zjeżdżaj, kujonie! – krzyknął Modry.**\n\nZakreśl kolorem: myślnik na początku, znak na końcu słów bohatera i myślnik przed słowami narratora. Jaką literą zaczynają się słowa narratora?', 4 * 60, 'dialog', 'Wypowiedź zaczyna się od myślnika. Wykrzyknik zostaje przy słowach bohatera. Potem myślnik i słowa narratora - **małą literą**: „krzyknął Modry”.'),
      slideNote('Sztuka programowania', '- Narrator obserwuje wydarzenia i opowiada o Radku.\n- Radek nie obronił Jacka, bo bał się kolegów. Naprawił to - odnalazł Koksa.\n- „Ciężar spadł z serca” = poczuć ulgę.\n- Przyjaźń wymaga odwagi i lojalności.'),
    ],
  },
  {
    title: '2. Jak zapisać dialog?',
    topic: 'Jak zapisać dialog?',
    textbookPage: 20,
    teacherPlan: plan(
      ['Co dziś', 'Bez czytanki. Lekcja warsztatowa: zasady zapisu dialogu (s. 20) i ćwiczenia. Podręcznik niepotrzebny - wszystko jest na slajdach.'],
      ['Przebieg (45 min)', [
        '1. **Temat + koło powtórzeniowe** (8 min) - pytania o „Sztukę programowania”.',
        '2. **Haczyk** (3 min): na tablicy piszesz jednym ciągiem, bez żadnych znaków: idziesz na mecz zapytał Radek nie wiem odpowiedział Jacek. Pytasz: „Kto tu mówi? Ile osób?”. Potem to samo rozpisane porządnie - różnica od razu widać.',
        '3. **Slajd z trzema zasadami** (5 min) - przepisują wzory z tablicy.',
        '4. **Z1** (7 min), **Z2** (6 min), **Z3** w parach (8 min). Na koniec Z3 dwie pary czytają swój dialog z podziałem na role.',
        '5. **Notatka** (4 min).',
      ].join('\n')],
      ['Jak wyjaśnić', [
        '- Dwa rodzaje tekstu: **to, co mówi bohater** (wypowiedź) i **to, co dopowiada narrator** (kto mówi i jak). Myślnik oddziela jedno od drugiego.',
        '- Zabawa na żywo: dwoje ochotników mówi po jednym zdaniu, a klasa dyktuje ci, jak to zapisać na tablicy („myślnik... teraz wielka litera... pytajnik... myślnik... zapytała Ola...”).',
        '- Najczęstszy błąd: kropka przed słowami narratora („– Idę. – powiedział”). Pokaż: kropka idzie **na koniec całego zdania**, po narratorze.',
        '- Pytajnik i wykrzyknik zostają przy bohaterze, bo to jego intonacja.',
      ].join('\n')],
      ['Tablica', 'Trzy wzory jeden pod drugim, znaki zakreślone kolorem:\n– Idę do domu – powiedział Kacper.\n– Idziesz już? – zapytała Ola.\n– Idę – powiedział Kacper. – Mama czeka.\nObok **bank czasowników mówienia** - dopisujesz podczas Z2: szepnął, krzyknął, mruknął, zażartował, jęknął, zaproponowała, westchnęła...'],
    ),
    questions: [
      { text: 'Od jakiego znaku zaczyna się każda wypowiedź w dialogu?', answer: 'Od myślnika, i to w nowej linijce.' },
      { text: 'Jaką literą zaczynamy słowa narratora po wypowiedzi bohatera?', answer: 'Małą, np. „– Idę – powiedział Kacper”.' },
      { text: 'Gdzie postawisz kropkę w zdaniu: „– Idę – powiedział Kacper”?', answer: 'Na końcu, po słowach narratora.' },
      { text: 'Jakim znakiem kończymy zdanie, które wprowadza dialog?', answer: 'Dwukropkiem, np. „Patrzył na mnie i zapytał:”.' },
      { text: 'Podaj trzy czasowniki, którymi można zastąpić „powiedział”.', answer: 'Np. szepnął, krzyknął, mruknął, zapytał, westchnął, zażartował.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Jak zapisać dialog?'),
      ...recap(previousSetId),
      slideText('Trzy zasady dialogu', '1. Każda wypowiedź od **nowej linijki** i od **myślnika**.\n2. Słowa narratora oddziel myślnikiem i zacznij **małą literą**: – Idę – **powiedział** Kacper.\n3. **?** i **!** zostają przy bohaterze, a **kropkę** stawiamy dopiero po słowach narratora.\n\nZdanie, które wprowadza dialog, kończy się **dwukropkiem**.', 'dialog'),
      slideTask('Z1', 'Ktoś zgubił wszystkie myślniki i znaki. Przepisz dialog poprawnie:\n\nIdziesz jutro na trening zapytał Kuba\nNie wiem odpowiedziała Ola chyba boli mnie noga\nSzkoda westchnął Kuba bez ciebie przegramy', 6 * 60, 'dialog', '– Idziesz jutro na trening? – zapytał Kuba.\n– Nie wiem – odpowiedziała Ola. – Chyba boli mnie noga.\n– Szkoda – westchnął Kuba. – Bez ciebie przegramy.'),
      slideTask('Z2', 'Zamień nudne **„powiedział / powiedziała”** na czasowniki, które pokazują, **jak** ktoś mówi:\n\n– Uwaga, pies! – powiedział Tomek.\n– Cicho, bo usłyszy – powiedziała Zuza.\n– Wcale się nie boję – powiedział Tomek, ale głos mu drżał.\n– To idź pierwszy – powiedziała Zuza ze śmiechem.', 5 * 60, 'dialog', 'Np. **krzyknął** Tomek, **szepnęła** Zuza, **zapewnił / wyjąkał** Tomek, **zakpiła / zaproponowała** Zuza.'),
      slideTask('Z3', 'W parach: Radek i Jacek spotykają się po dwudziestu latach. Napiszcie ich rozmowę.\n\n- zdanie wprowadzające zakończone dwukropkiem,\n- 4 wypowiedzi,\n- przy dwóch komentarz narratora,\n- jeden czasownik z naszego banku.', 8 * 60, 'dialog', 'Np. Na przystanku ktoś klepnął Radka w ramię i zapytał:\n– Pamiętasz mnie?\n– Jacek?! – krzyknął Radek. – Nadal programujesz?\n– Robię gry – uśmiechnął się Jacek.\n– A Koks? – zapytał cicho Radek.'),
      slideNote('Jak zapisać dialog?', '- Każda wypowiedź od nowej linijki i od myślnika.\n- Słowa narratora po myślniku, małą literą.\n- ? i ! zostają przy bohaterze, kropka po słowach narratora.\n- Przed dialogiem stawiamy dwukropek.'),
    ],
  },
  {
    title: '3. Opowiadanie twórcze z dialogiem',
    topic: 'Opowiadanie z dialogiem',
    textbookPage: 19,
    teacherPlan: plan(
      ['Co dziś', 'Bez czytanki. Planujemy opowiadanie w grupach 3-4 osobowych, a piszą je w domu. Wzór opowiadania jest na s. 21 („Poszukiwacze skarbów”), zasady na s. 19, zdjęcie namiotu do zad. 6 na s. 22.'],
      ['Przebieg (45 min)', [
        '1. **Temat + koło** (8 min) - pytania o dialog.',
        '2. **Kanapka** (5 min): rysujesz schemat opowiadania, oni przepisują.',
        '3. **Grupy.** Każda grupa dostaje ten sam tytuł „Niezwykły dzień” i robi Z1 (6 min) i Z2 (7 min). Kręcisz kołem - z każdej grupy odpowiada wylosowana osoba, nie lider.',
        '4. **Z3 - zwrot akcji** (7 min) - indywidualnie.',
        '5. **Notatka** (4 min) + zadanie domowe na slajdzie.',
      ].join('\n')],
      ['Jak wyjaśnić', [
        '- Opowiadanie to **kanapka**: wstęp i zakończenie to chleb (krótkie), a rozwinięcie to wszystko, co ważne w środku.',
        '- **Wstęp** odpowiada na trzy pytania: kto? gdzie? kiedy? Wystarczą 2-3 zdania.',
        '- **Zwrot akcji** to moment, w którym czytelnik myśli „o nie!”. Słowa-sygnały: nagle, w ułamku sekundy, znienacka, jak grom z jasnego nieba.',
        '- **Jeden czas.** Kto zaczął w przeszłym („poszłam”), ten nie przeskakuje na teraźniejszy („idę”).',
        '- Dialog ożywia opowiadanie, ale niech nie zajmie całego - 2-4 wypowiedzi wystarczą.',
      ].join('\n')],
      ['Tablica', 'Kanapka z trzech warstw:\n**WSTĘP** - kto, gdzie, kiedy\n**ROZWINIĘCIE** - wydarzenia po kolei + dialog + zwrot akcji\n**ZAKOŃCZENIE** - jak się skończyło, czego się nauczyłem\nZ boku: nagle / w ułamku sekundy / znienacka / jak grom z jasnego nieba.'],
      ['Zadanie domowe', 'Opowiadanie „Niezwykły dzień” z planu grupy - minimum strona w zeszycie, z dialogiem (co najmniej 3 wypowiedzi). Termin: za tydzień.'],
    ),
    questions: [
      { text: 'Z jakich trzech części składa się opowiadanie?', answer: 'Ze wstępu, rozwinięcia i zakończenia.' },
      { text: 'Na jakie pytania odpowiada wstęp opowiadania?', answer: 'Kto? Gdzie? Kiedy? - przedstawia bohaterów, miejsce i czas.' },
      { text: 'Podaj dwa wyrazy, które zapowiadają zwrot akcji.', answer: 'Np. nagle, w ułamku sekundy, znienacka, jak grom z jasnego nieba.' },
      { text: 'Dlaczego nie mieszamy czasów w opowiadaniu?', answer: 'Bo czytelnik się gubi. Piszemy w jednym czasie, np. w przeszłym.' },
      { text: 'Po co w opowiadaniu dialog?', answer: 'Ożywia tekst, pokazuje bohaterów i ich emocje, sprawia, że jest ciekawiej.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Opowiadanie z dialogiem'),
      ...recap(previousSetId),
      slideText('Opowiadanie to kanapka', '**Wstęp** - kto? gdzie? kiedy?\n\n**Rozwinięcie** - wydarzenia po kolei, dialog i **zwrot akcji** (nagle, w ułamku sekundy, jak grom z jasnego nieba).\n\n**Zakończenie** - jak się skończyło i czego to nauczyło bohatera.\n\nPiszemy w **jednym czasie**.', 'opowiadanie'),
      slideTask('Z1', 'Grupa: tytuł **„Niezwykły dzień”**.\n\nNarysujcie w zeszycie tabelkę z trzema rubrykami: **czas, miejsce, bohaterowie**. Wypełnijcie ją.\n\nKażda rubryka ma być konkretna: nie „kiedyś”, tylko „w sobotę o świcie”.', 5 * 60, 'swiatPrzedstawiony', 'Np. **Czas:** sobota, świt. **Miejsce:** namiot nad jeziorem. **Bohaterowie:** ja, mój brat Kuba i tajemniczy pies.'),
      slideTask('Z2', 'Ułóżcie **plan wydarzeń** w 5 punktach (krótko, bez czasowników w formie osobowej).\n\nPunkt 3 albo 4 ma być **zwrotem akcji**.', 7 * 60, 'kolejnoscZdarzen', 'Np. 1. Wyjazd pod namiot. 2. Rozbijanie obozu nad jeziorem. 3. Nocne szczekanie za namiotem. 4. Odkrycie zaginionego psa sąsiadów. 5. Powrót psa do domu i nagroda.'),
      slideTask('Z3', 'Nudny fragment - ożyw go! Przepisz i dodaj **dwa słowa zwrotu akcji** oraz **jedną wypowiedź** bohatera w dialogu:\n\n„Szedłem przez park. Było cicho. Na ławce leżała paczka. Podszedłem bliżej. Paczka się poruszyła.”', 7 * 60, 'opowiadanie', 'Np. „Szedłem przez pusty park. Było cicho. Na ławce leżała szara paczka. Podszedłem bliżej i **nagle** paczka się poruszyła!\n– Kto tam? – szepnąłem.\n**W ułamku sekundy** z pudełka wyskoczył mały kot.”'),
      slideText('Zadanie domowe', 'Napisz opowiadanie **„Niezwykły dzień”** według planu twojej grupy.\n\n- co najmniej strona w zeszycie,\n- wstęp, rozwinięcie, zakończenie,\n- dialog: minimum 3 wypowiedzi,\n- jeden zwrot akcji.\n\nTermin: za tydzień.', 'opowiadanie'),
      slideNote('Opowiadanie z dialogiem', '- Wstęp: kto, gdzie, kiedy.\n- Rozwinięcie: wydarzenia po kolei, dialog, zwrot akcji.\n- Zakończenie: jak się skończyło.\n- Piszę w jednym czasie.'),
    ],
  },
  {
    title: '4. Głoski miękkie i twarde',
    topic: 'Głoski miękkie i twarde',
    textbookPage: 23,
    teacherPlan: plan(
      ['Co dziś', 'Bez czytanki, lekcja-gra. Przypomnienie z klasy 4 (głoska, litera, sylaba - s. 23) i nowe: spółgłoski miękkie i ich zapis (s. 24).'],
      ['Przebieg (45 min)', [
        '1. **Temat + koło** (8 min).',
        '2. **Rozgrzewka z s. 24** (4 min): wszyscy mówią na głos „maleć – malec”, „nić – nic” i sprawdzają palcem, gdzie jest język. Przy miękkiej środek języka idzie do góry.',
        '3. **Z1 - wyścig** (7 min): kto pierwszy poda dobre liczby, podnosi rękę. Punkt bierze jednak osoba wylosowana kołem.',
        '4. **Slajd z zasadą** (4 min) + **Z2** (6 min) + **Z3** (6 min).',
        '5. **Notatka** (4 min).',
      ].join('\n')],
      ['Jak wyjaśnić', [
        '- **Głoskę słyszę, literę widzę.** „Ch” to dwie litery, ale jedna głoska.',
        '- Miękkość zapisujemy **kreską**, gdy dalej jest spółgłoska albo koniec wyrazu: ćma, koń.',
        '- Literą **i**, gdy dalej jest samogłoska: ciasto, koniec.',
        '- Szybki test: „Czy po tej głosce jest samogłoska? Tak - piszę i. Nie - piszę kreskę”.',
        '- W „ciasto” „i” nie jest osobną głoską - tylko zmiękcza. Dlatego ciasto ma 6 liter, ale 5 głosek.',
      ].join('\n')],
      ['Tablica', 'Dwie kolumny: **kreska** (ćma, koń, śnieg, źle) | **litera i** (ciasto, koniec, siano, zima).\nNad nimi strzałka: „po miękkiej jest samogłoska? → i”.'],
    ),
    questions: [
      { text: 'Czym różni się głoska od litery?', answer: 'Głoskę słyszymy i wymawiamy, literę widzimy i piszemy.' },
      { text: 'Wymień pięć miękkich spółgłosek zapisywanych z kreską.', answer: 'ć, dź, ń, ś, ź.' },
      { text: 'Kiedy miękkość zapisujemy kreską, a kiedy literą „i”?', answer: 'Kreską - przed spółgłoską i na końcu wyrazu. Literą „i” - przed samogłoską.' },
      { text: 'Ile liter i ile głosek ma wyraz „ciasto”?', answer: '6 liter i 5 głosek, bo „ci” to jedna głoska ć.' },
      { text: 'Czego nie może zabraknąć w żadnej sylabie?', answer: 'Samogłoski.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Głoski miękkie i twarde'),
      ...recap(previousSetId),
      slideTask('Z1', 'Wyścig! Przy każdym wyrazie zapisz: **ile liter, ile głosek, ile sylab**.\n\n1. koń\n2. ciasto\n3. chrząszcz\n4. dziewczynka', 6 * 60, 'dwuznak', '1. koń - 3 litery, 3 głoski, 1 sylaba\n2. ciasto - 6 liter, 5 głosek, 2 sylaby (cia-sto)\n3. chrząszcz - 9 liter, 5 głosek, 1 sylaba\n4. dziewczynka - 11 liter, 8 głosek, 3 sylaby (dziew-czyn-ka)'),
      slideText('Miękka głoska - kreska czy „i”?', 'Spółgłoski miękkie: **ć, dź, ń, ś, ź** (i bi, pi, mi, wi, fi, ki, gi, li...).\n\n- **kreska** - przed spółgłoską i na końcu wyrazu: **ć**ma, ko**ń**, **ś**nieg\n- **litera i** - przed samogłoską: **ci**asto, ko**ni**ec, **si**ano\n\nTest: po miękkiej jest samogłoska? Piszę **i**.', 'zmiekczenia'),
      slideTask('Z2', 'Kreska czy „i”? Przepisz i uzupełnij:\n\n1. (ś/si)wieca\n2. (ś/si)ano\n3. (ź/zi)ma\n4. (ć/ci)ma\n5. pie(ś/si)ń\n6. (ń/ni)ebo', 5 * 60, 'zmiekczenia', '1. świeca\n2. siano\n3. zima\n4. ćma\n5. pieśń\n6. niebo'),
      slideTask('Z3', 'Zgubiona kreska zmienia sens! Wyjaśnij różnicę i ułóż zdanie z każdym wyrazem:\n\n- **len** - **leń**\n- **kos** - **koś**', 5 * 60, 'zmiekczenia', '**len** - roślina („Z lnu robi się tkaniny”), **leń** - ktoś leniwy („Nie bądź leniem”).\n**kos** - ptak („Kos śpiewa na dachu”), **koś** - rozkaz od „kosić” („Koś trawę za domem”).'),
      slideNote('Głoski miękkie i twarde', '- Głoskę słyszę, literę widzę i piszę.\n- Miękkie: ć, dź, ń, ś, ź (ci, dzi, ni, si, zi).\n- Kreska - przed spółgłoską i na końcu: koń.\n- Litera i - przed samogłoską: koniec.'),
    ],
  },
  {
    title: '5. Pax - przyjaźń oczami lisa',
    topic: 'Pax - oczami lisa',
    textbookPage: 25,
    teacherPlan: plan(
      ['Co dziś czytamy', '**Sara Pennypacker, „Pax”**, s. 25-27. Nagranie: głośnik „Czytanki” → V.5 (6 min). Puszczasz całe - dzieci śledzą w podręczniku.\nPrzed czytaniem koniecznie pokaż ramkę „Kilka słów o książce” (s. 25): wojna, ojciec idzie do wojska, Peter jedzie do dziadka 500 km dalej. Bez tego nie rozumieją, dlaczego ojciec każe zostawić lisa.'],
      ['Przebieg (45 min)', [
        '1. **Temat + koło** (7 min).',
        '2. **Zanim przeczytasz** (4 min): „Empatia - kto wie, co to?”. Robisz mapę myśli, jedno zdanie ze słownika na slajdzie.',
        '3. **Nagranie** (8 min).',
        '4. **Z1** (7 min), **Z2** (6 min), **Z3** (7 min) - jeśli zabraknie czasu, Z3 idzie do domu.',
        '5. **Notatka** (4 min).',
      ].join('\n')],
      ['O czym powiedzieć', [
        '- **Dwie perspektywy.** Pierwsza część jest pokazana „nosem lisa”: czuje wibracje, zapachy, „woń kłamstwa” ojca. Druga, po gwiazdkach, - oczami Petera w nocy. Pytanie: „Skąd lis wie, że ojciec kłamie? Po zapachu!”.',
        '- **Najsmutniejszy moment:** lis myśli, że to zabawa z żołnierzykiem. Gdyby się obejrzał, zobaczyłby, jak chłopiec płacze - i by wrócił. Zapytaj: „Kto tu jest bardziej przywiązany?”.',
        '- **Zdanie klucz:** „Pozostawienie Paxa nie było czymś, co trzeba było zrobić”. Tata mówił „trzeba”, a Peter decyduje sam.',
        '- „Nierozłączni” - jak Radek i Koks w poprzednim tekście: przyjaźń ze zwierzęciem też wymaga odwagi.',
      ].join('\n')],
      ['Tablica', 'Dwie kolumny: **PAX czuje** | **PETER czuje**, nad nimi napis NARRATOR i dwie strzałki (raz patrzy oczami jednego, raz drugiego).\nObok mapa myśli: EMPATIA → wczuć się, zrozumieć, pomóc.'],
    ),
    questions: [
      { text: 'Kim jest Pax i skąd wziął się u Petera?', answer: 'To lis. Peter uratował go, gdy lisek był osierocony.' },
      { text: 'Dlaczego Peter musiał rozstać się z Paxem?', answer: 'Wybuchła wojna, ojciec szedł do wojska, a Peter miał zamieszkać u dziadka daleko od domu.' },
      { text: 'Czym Peter odwrócił uwagę lisa w lesie?', answer: 'Rzucił mu w las ulubioną zabawkę - plastikowego żołnierzyka.' },
      { text: 'Co postanowił Peter w nocy u dziadka?', answer: 'Że wróci po Paxa - spakował plecak i atlas z mapą trasy.' },
      { text: 'Co to jest empatia?', answer: 'Umiejętność wczucia się w to, co czuje i myśli ktoś inny.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Pax - oczami lisa'),
      ...recap(previousSetId),
      slideText('Zanim przeczytasz: empatia', '**Empatia** to umiejętność wczucia się w to, co czuje ktoś inny - człowiek albo zwierzę.\n\nPodczas słuchania sprawdzaj: **czyimi oczami** widzimy teraz świat - lisa czy chłopca?', 'cechyBohatera'),
      slideRead('Czytamy: „Pax”', 25, 27, 'Sara Pennypacker, „Pax”. Słuchamy nagrania, podręcznik otwarty. Najpierw przeczytaj ramkę „Kilka słów o książce” na s. 25.', 12 * 60),
      slideTask('Z1', 'Narysuj w zeszycie tabelkę **Pax | Peter**.\n\nWpisz po **dwa uczucia** każdego z nich i przy każdym krótki dowód z tekstu.', 7 * 60, 'cechyBohatera', '**Pax:** niepokój (wyczuł, że chłopiec płacze), radość i ulga (myśli, że to zabawa z żołnierzykiem), strach (gdy ojciec złapał go za kark).\n**Peter:** smutek, rozpacz (płakał bezgłośnie, zasłaniał twarz), przerażenie (czuł się, jakby to jego zostawiono w lesie), determinacja (postanowił wrócić).'),
      slideTask('Z2', 'Odpowiedz w zeszycie:\n\n1. Dlaczego Peter musiał zostawić Paxa? (ramka s. 25)\n2. Jaką decyzję podjął w nocy?\n3. Co ta decyzja mówi o nim? Podaj dwie cechy.', 6 * 60, 'cechyBohatera', '1. Wybuchła wojna, ojciec szedł do wojska, a Peter jechał do dziadka 500 km od domu.\n2. Postanowił wrócić po lisa.\n3. Jest odważny, lojalny, bardzo kocha Paxa, podejmuje decyzje sam.'),
      slideTask('Z3', 'Zostań Paxem. Napisz **4 zdania** jako lis, który czeka przy drodze z żołnierzykiem w pysku.\n\n- mów „ja”,\n- użyj dwóch zmysłów: węchu i słuchu,\n- ostatnie zdanie ma pokazać, na co czekasz.', 7 * 60, 'narrator', 'Np. „Siedzę na skraju drogi, a w pysku trzymam żołnierzyka. Czuję jeszcze zapach spalin i słonej skóry mojego chłopca. Nasłuchuję każdego warkotu silnika. Wiem, że wróci, bo przecież zawsze wraca.”'),
      slideNote('Pax', '- Autorka: Sara Pennypacker.\n- Narrator pokazuje świat oczami lisa i oczami Petera.\n- Empatia - wczuć się w to, co czuje ktoś inny.\n- Peter postanawia wrócić po Paxa - są nierozłączni.'),
    ],
  },
  {
    title: '6. Encyklopedia i Wikipedia',
    topic: 'Encyklopedia i Wikipedia',
    textbookPage: 29,
    teacherPlan: plan(
      ['Co dziś', 'Bez czytanki, lekcja praktyczna przy projektorze. Porównujemy „lisa z książki” (Pax) z lisem z encyklopedii (s. 29). Przygotuj w drugiej karcie Wikipedię albo encyklopedia.pwn.pl z hasłem **lis pospolity** - otwierasz przy Z2.'],
      ['Przebieg (45 min)', [
        '1. **Temat + koło** (7 min) - pytania o Paxa.',
        '2. **Haczyk** (3 min): „Co wiemy o lisach z Paxa? Czy to wystarczy do sprawdzianu z przyrody?”.',
        '3. **Slajd: encyklopedia** (5 min).',
        '4. **Z1 - gra w tomy** (6 min): czytasz hasło, koło losuje, kto podaje tom.',
        '5. **Z2 - detektywi hasła** (10 min): na projektorze hasło „lis”, wylosowana osoba szuka odpowiedzi i pokazuje palcem na ekranie.',
        '6. **Z3** (7 min) + **notatka** (4 min).',
      ].join('\n')],
      ['Jak wyjaśnić', [
        '- **Encyklopedia** to zbiór wiadomości. **Powszechna** - o wszystkim, **specjalistyczna** - o jednej dziedzinie (np. o dinozaurach).',
        '- Hasła są alfabetycznie, a osoby szukamy **pod nazwiskiem**: Kopernik Mikołaj, nie Mikołaj Kopernik.',
        '- **Wikipedia** to też encyklopedia, ale może ją edytować każdy. Dlatego ważne informacje sprawdzamy w drugim źródle.',
        '- Tekst **informacyjny** podaje fakty, krótko, bez opinii. **Literacki** działa na wyobraźnię i uczucia.',
      ].join('\n')],
      ['Tablica', 'Cztery prostokąty-tomy: I A-F | II G-L | III Ł-R | IV S-Z.\nPod spodem tabelka: **Encyklopedia** (fakty, liczby, bez uczuć) | **Pax** (uczucia, wyobraźnia, bohater).'],
    ),
    questions: [
      { text: 'Czym różni się encyklopedia powszechna od specjalistycznej?', answer: 'Powszechna ma wiadomości z wielu dziedzin, specjalistyczna - z jednej, np. o zwierzętach.' },
      { text: 'Pod jakim hasłem szukasz w encyklopedii Marii Konopnickiej?', answer: 'Pod nazwiskiem: Konopnicka Maria.' },
      { text: 'Czym tekst informacyjny różni się od literackiego?', answer: 'Informacyjny podaje fakty zwięźle i bez opinii, literacki działa na wyobraźnię i uczucia.' },
      { text: 'Dlaczego informacje z Wikipedii warto sprawdzić w drugim źródle?', answer: 'Bo Wikipedię może edytować każdy i mogą w niej być błędy.' },
      { text: 'Podaj dwa przykłady tekstów informacyjnych.', answer: 'Np. hasło w encyklopedii, ogłoszenie, wiadomość w gazecie, definicja w podręczniku.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Encyklopedia i Wikipedia'),
      ...recap(previousSetId),
      slideText('Encyklopedia krok po kroku', '**Encyklopedia** - zbiór wiadomości ułożony alfabetycznie.\n\n- **powszechna** - o wszystkim,\n- **specjalistyczna** - o jednej dziedzinie.\n\nOsoby szukamy **pod nazwiskiem**. **Wikipedię** może edytować każdy - ważne fakty sprawdź w drugim źródle.', 'slownik'),
      slideTask('Z1', 'Encyklopedia ma 4 tomy: **I A-F, II G-L, III Ł-R, IV S-Z**.\n\nW którym tomie znajdziesz hasła?\n\n1. Kanada\n2. Wisła\n3. Stanisław Moniuszko\n4. Wisława Szymborska\n5. internet\n6. Afryka', 5 * 60, 'alfabet', '1. Kanada - II\n2. Wisła - IV\n3. Moniuszko Stanisław - III\n4. Szymborska Wisława - IV\n5. internet - II\n6. Afryka - I'),
      slideTask('Z2', 'Detektywi hasła. Na ekranie hasło **lis pospolity**. Znajdź i zapisz w punktach:\n\n1. Gdzie żyje lis?\n2. Czym się żywi?\n3. Ile mierzy albo waży?\n4. Czy w Polsce jest pod ochroną?', 10 * 60, 'slownik', 'Odpowiedzi odczytujemy z hasła na ekranie. Warto zwrócić uwagę, że hasło podaje liczby i fakty, a nie uczucia.'),
      slideTask('Z3', 'Porównaj lisa z encyklopedii i lisa z „Paxa”. Zrób tabelkę z kolumnami **Encyklopedia** i **„Pax”**. W wierszach odpowiedz:\n\n1. Po co jest ten tekst?\n2. Czy są w nim uczucia?\n3. Jakie słowa przeważają?', 6 * 60, undefined, '**Encyklopedia:** żeby przekazać wiedzę; bez uczuć i opinii; liczby, fakty, nazwy.\n**„Pax”:** żeby poruszyć czytelnika; pełno uczuć (strach, ulga, tęsknota); opisy, emocje, zmysły.'),
      slideNote('Encyklopedia i Wikipedia', '- Encyklopedia powszechna - o wszystkim, specjalistyczna - o jednej dziedzinie.\n- Osoby szukamy pod nazwiskiem.\n- Tekst informacyjny: fakty, krótko, bez opinii.\n- Wikipedię sprawdzam w drugim źródle.'),
    ],
  },
  {
    title: '7. Dziesiąty poziom - czym jest pomaganie?',
    topic: 'Dziesiąty poziom',
    textbookPage: 31,
    teacherPlan: plan(
      ['Co dziś czytamy', '**Jody J. Little, „Dziesiąty poziom”**, s. 31-34. Czytamy **w rolach** - w tekście jest dużo dialogów, więc przećwiczą to, co było na lekcji o dialogu. Role: narrator (ty albo najlepiej czytająca osoba), Jędrek, mama, Dawid, Dominik. Zmieniaj obsadę co stronę.\nNagranie awaryjne: „Czytanki” → V.7 (7 min).'],
      ['Przebieg (45 min)', [
        '1. **Temat + koło** (7 min).',
        '2. **Haczyk** (2 min): „Na którym poziomie jesteście w swojej grze? Co jest na ostatnim?”.',
        '3. **Czytanie w rolach** (12 min). „Bank żywności” wyjaśnij od razu przy przypisie.',
        '4. **Z1** (6 min), **Z2** w parach (7 min), **Z3** (5 min).',
        '5. **Notatka** (4 min).',
      ].join('\n')],
      ['O czym powiedzieć', [
        '- **Zaskoczenie Jędrka:** ludzie w kolejce „nie wyglądają na bezdomnych”. Dawid mówi, że pracują, ale zarabiają za mało. Bieda nie zawsze jest widoczna.',
        '- **Dominikowi jest wstyd** - odwraca wzrok. Jędrek nie robi z tego sprawy, tylko zaprasza go do pomocy, żeby Dominik dostał paczkę. To **takt**.',
        '- **Władek i dżem:** Dawid mówi „nie traktuję tego jak kradzieży”. Dobre pytanie do dyskusji: „Zgadzacie się z Dawidem?”.',
        '- **Tytuł:** wyższy poziom w grze to trudniejsze wyzwanie i większa nagroda. Pomoc przyjacielowi to „poziom dziesiąty” - najwyższy.',
        '- **Wolontariusz** - pracuje dobrowolnie, bez pieniędzy (ramka s. 33).',
      ].join('\n')],
      ['Tablica', 'Pasek gry z poziomami 1-10. Wydarzenia wpisujesz jako kolejne poziomy: 8 - rekord w „Max Surf” → pakowanie paczek → Władek i dżem → punkt przy kościele → brakuje paczek → Dominik w kolejce → 10 - pomoc przyjacielowi.\nObok ramka: pytanie **otwarte** (Dlaczego...? Jak...?) | pytanie **zamknięte** (Czy...? → tak/nie).'],
    ),
    questions: [
      { text: 'Dlaczego Jędrek nie chciał w sobotę jechać z Dawidem?', answer: 'Umówił się z Dominikiem i Michałem na zawody komputerowe.' },
      { text: 'Co to jest bank żywności?', answer: 'Organizacja, która zbiera jedzenie i dzieli je między najuboższych.' },
      { text: 'Kogo Jędrek spotkał w kolejce po paczki i dlaczego ta osoba tam była?', answer: 'Dominika. Jego tata od jakiegoś czasu nie miał pracy.' },
      { text: 'Czym różni się pytanie otwarte od zamkniętego?', answer: 'Na otwarte odpowiadamy dłużej, własnymi słowami. Na zamknięte - tak albo nie, zwykle zaczyna się od „czy”.' },
      { text: 'Kto to jest wolontariusz?', answer: 'Osoba, która pracuje dobrowolnie i bez wynagrodzenia, żeby pomóc innym.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Dziesiąty poziom'),
      ...recap(previousSetId),
      slideRead('Czytamy w rolach', 31, 34, 'Jody J. Little, „Dziesiąty poziom”. Role: narrator, Jędrek, mama, Dawid, Dominik. Pozostali śledzą tekst - zmiana obsady co stronę.', 14 * 60),
      slideTask('Z1', 'Zapisz **plan wydarzeń** w 6 punktach. Zacznij od gry w „Max Surf”, skończ na słowach „poziom dziesiąty”.', 6 * 60, 'kolejnoscZdarzen', '1. Jędrek dochodzi do 8. poziomu w „Max Surf”.\n2. Mama prosi, żeby w sobotę pomógł Dawidowi.\n3. Ładowanie paczek i Władek ze słoikiem dżemu.\n4. Rozdawanie paczek przy kościele.\n5. Brak paczek i Dominik w kolejce.\n6. Wspólna pomoc - „poziom dziesiąty”.'),
      slideText('Pytania otwarte i zamknięte', '**Pytanie otwarte** - odpowiadasz własnymi słowami, dłużej: Dlaczego Dominik stał w kolejce?\n\n**Pytanie zamknięte** - wystarczy **tak** albo **nie**, zwykle zaczyna się od **czy**: Czy Jędrek pomógł Dawidowi?', 'bohaterowie'),
      slideTask('Z2', 'W parach. Każdy układa do tekstu **jedno pytanie otwarte** i **jedno zamknięte**, zapisuje je w zeszycie i zadaje sąsiadowi. Sąsiad odpowiada ustnie.', 7 * 60, undefined, 'Np. otwarte: „Dlaczego Jędrkowi zrobiło się głupio?”; zamknięte: „Czy Dawid pozwolił Władkowi zabrać dżem?”.'),
      slideTask('Z3', '„Pomóc przyjacielowi to jest poziom dziesiąty!”\n\nDo czego Jędrek porównał pomoc? Dlaczego akurat **dziesiąty** poziom, a nie pierwszy? Odpowiedz w 2-3 zdaniach.', 5 * 60, 'cechyBohatera', 'Porównał pomoc do poziomu w grze komputerowej. Dziesiąty to najwyższy, najtrudniejszy i daje największą satysfakcję. Jędrek zrozumiał, że pomoc prawdziwemu przyjacielowi jest ważniejsza niż wygrana w grze.'),
      slideNote('Dziesiąty poziom', '- Wolontariusz pomaga dobrowolnie i bez zapłaty.\n- Jędrek pomógł Dominikowi tak, żeby go nie zawstydzić.\n- Pytanie otwarte: dłuższa odpowiedź. Zamknięte: tak/nie, zaczyna się od „czy”.'),
    ],
  },
  {
    title: '8. Co już wiemy o czasowniku?',
    topic: 'Co wiemy o czasowniku?',
    textbookPage: 46,
    teacherPlan: plan(
      ['Co dziś', 'Bez czytanki. Powtórka z klasy 4: osoba, liczba, czas, rodzaj, czas przyszły prosty i złożony (s. 46-47).'],
      ['Przebieg (45 min)', [
        '1. **Temat + koło** (7 min).',
        '2. **Z1** (6 min) - rozgrzewka.',
        '3. **Slajd: 4 cechy** (5 min) - rysujesz tabelkę.',
        '4. **Łańcuch odmiany ustnie** (5 min): mówisz „ja czytam”, koło losuje osobę, która zmienia osobę albo czas („my czytaliśmy”), potem kolejna.',
        '5. **Z2** (8 min), **Z3** (6 min).',
        '6. **Notatka** (4 min).',
      ].join('\n')],
      ['Jak wyjaśnić', [
        '- Czasownik to **„co robi?”**. Pytamy o cztery rzeczy: **kto?** (osoba), **ilu?** (liczba), **kiedy?** (czas), a w przeszłym - **on/ona/ono?** (rodzaj).',
        '- **Rodzaj męskoosobowy** w liczbie mnogiej = w grupie jest choć jeden chłopak/mężczyzna: „oni biegli”. Same dziewczyny, zwierzęta, rzeczy: „one biegły”.',
        '- **Czas przyszły:** prosty to jedno słowo („zaśpiewam”), złożony - dwa („będę śpiewać”, „będę śpiewał”).',
        '- Trik na rodzaj w przeszłym: „grałyśmy” zdradza, że pisały dziewczyny - to przyda się w Z3.',
      ].join('\n')],
      ['Tablica', 'Tabelka: CZASOWNIK → osoba (1, 2, 3) | liczba (poj., mn.) | czas (przeszły, teraźniejszy, przyszły) | rodzaj (m, ż, n / męskoos., niemęskoos.).\nPod spodem: przyszły prosty = zrobię | złożony = będę robić / będę robił.'],
    ),
    questions: [
      { text: 'Przez co odmienia się czasownik?', answer: 'Przez osoby, liczby i czasy, a w czasie przeszłym i przyszłym złożonym także przez rodzaje.' },
      { text: 'Określ osobę, liczbę i czas: „pojedziecie”.', answer: '2. osoba, liczba mnoga, czas przyszły.' },
      { text: 'Czym różni się forma „biegli” od „biegły”?', answer: '„Biegli” - rodzaj męskoosobowy, „biegły” - niemęskoosobowy.' },
      { text: 'Podaj formę prostą i złożoną czasu przyszłego od „czytać”.', answer: 'Prosta: przeczytam. Złożona: będę czytać / będę czytał.' },
      { text: 'Na jakie pytania odpowiada czasownik?', answer: 'Co robi? Co się z nim dzieje?' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Co wiemy o czasowniku?'),
      ...recap(previousSetId),
      slideTask('Z1', 'Dokończ trzy wypowiedzi czasownikiem i podkreśl go:\n\n1. **Jutro** ... do kina.\n2. **Wczoraj** ... nowy odcinek.\n3. **Teraz** ... lekcje.\n\nOd czego zależy forma czasownika?', 4 * 60, 'czasownik', 'Np. 1. Jutro **pójdę** do kina. 2. Wczoraj **obejrzałam** nowy odcinek. 3. Teraz **odrabiam** lekcje.\nForma zależy od tego, **kiedy** coś się dzieje (czas) i **kto** to robi.'),
      slideText('Czasownik - cztery pytania', '- **kto?** - osoba: 1., 2., 3.\n- **ilu?** - liczba: pojedyncza, mnoga\n- **kiedy?** - czas: przeszły, teraźniejszy, przyszły\n- **on, ona, ono?** - rodzaj (w przeszłym)\n\nCzas przyszły: **prosty** - zaśpiewam, **złożony** - będę śpiewać / będę śpiewał.', 'czasownikOdmiana'),
      slideTask('Z2', 'Określ **osobę, liczbę, czas** i - jeśli się da - **rodzaj**:\n\n1. grałyśmy\n2. pobiegniesz\n3. będą czytali\n4. śpię', 7 * 60, 'czasownikOdmiana', '1. grałyśmy - 1. os., l.mn., przeszły, niemęskoosobowy\n2. pobiegniesz - 2. os., l.poj., przyszły prosty (rodzaju nie określimy)\n3. będą czytali - 3. os., l.mn., przyszły złożony, męskoosobowy\n4. śpię - 1. os., l.poj., teraźniejszy (rodzaju nie określimy)'),
      slideTask('Z3', 'Kto to napisał? Przy każdym wpisie z forum zapisz: **dziewczyna, chłopak** czy **grupa** - i który czasownik to zdradził.\n\n1. „Wczoraj byłam na basenie i przepłynęłam kilometr.”\n2. „Zagraliśmy wczoraj mecz i wygraliśmy 3:1.”\n3. „Pomalowałem pokój na zielono.”', 5 * 60, 'czasownikOdmiana', '1. dziewczyna - **byłam, przepłynęłam**\n2. grupa (z co najmniej jednym chłopakiem) - **zagraliśmy, wygraliśmy**\n3. chłopak - **pomalowałem**'),
      slideNote('Co wiemy o czasowniku?', '- Czasownik odmienia się przez osoby, liczby, czasy i rodzaje (w przeszłym).\n- Męskoosobowy: oni biegli. Niemęskoosobowy: one biegły.\n- Przyszły prosty: zrobię. Złożony: będę robić.'),
    ],
  },
  {
    title: '9. Wielki wybuch, czyli K kontra K',
    topic: 'Kryspin w sieci i naprawdę',
    textbookPage: 36,
    teacherPlan: plan(
      ['Co dziś czytamy', '**Barbara Kosmowska, Grzegorz Kasdepke, „Wielki wybuch, czyli K kontra K”**, s. 36-39. Nagranie: „Czytanki” → V.9 (ok. 6 min). Najlepiej: s. 36-38 z nagrania, a e-mail Kryspina (s. 38-39) czyta na głos wylosowany uczeń - od razu widać różnicę między tym, co było, a co napisał.\nPrzed czytaniem ramka „Kilka słów o książce” (s. 36): Kryspin i Ksenia grają razem online, ale nie znają się naprawdę.'],
      ['Przebieg (45 min)', [
        '1. **Temat + koło** (7 min).',
        '2. **Haczyk** (3 min): „Podnieście rękę, jeśli w grze albo w sieci jesteście trochę inni niż na co dzień”. Bez komentarzy, tylko rozgrzewka.',
        '3. **Nagranie + e-mail** (10 min).',
        '4. **Z1** (7 min), **Z2** (6 min), **Z3** (6 min).',
        '5. **Notatka** (4 min).',
      ].join('\n')],
      ['O czym powiedzieć', [
        '- **Humor narratora:** pierwsze zdania - „czy jest coś śmieszniejszego...”. Narrator żartuje z Kryspina, ale mu współczuje.',
        '- **Kryspin nie jest tchórzem:** nie umie i nie chce bić, bo nie chce robić krzywdy. Zapytaj: „To wada czy zaleta?”.',
        '- **E-mail:** w parku to on wpadł do jeziora, a w mailu pisze, że to on wrzucił kolegów. Odwrócił role. Dlaczego? Wstyd, chce być „fajny” dla Kseni.',
        '- **Co będzie, gdy się spotkają?** (ramka: Ksenia też udaje). Wirtualne udawanie ma krótkie nogi.',
        '- Pomost do następnej lekcji: kultura i bezpieczeństwo w internecie.',
      ].join('\n')],
      ['Tablica', 'Dwie kolumny: **KRYSPIN NAPRAWDĘ** | **KRYSPIN W E-MAILU**, wypełniacie razem podczas Z1.\nPod spodem: wirtualne udawanie → wstyd → kłopot przy spotkaniu.'],
    ),
    questions: [
      { text: 'Kim są Kryspin i Ksenia i jak się poznali?', answer: 'To nieśmiali nastolatkowie. Grają razem w grę online „Gwiezdni Rycerze” i piszą do siebie e-maile, ale nie znają się naprawdę.' },
      { text: 'Jak wabi się pies Kryspina i dlaczego chłopiec wstydził się tego imienia?', answer: 'Terminator. Imię brzmiało groźnie, a to mały, rudy spaniel - wszyscy się śmiali.' },
      { text: 'Co naprawdę wydarzyło się w parku?', answer: 'Koledzy gonili Kryspina, a on stracił równowagę i wpadł do jeziora w muł. Wrócił do domu przemoczony i zawstydzony.' },
      { text: 'Co Kryspin napisał Kseni o tym dniu?', answer: 'Że to on pobił kolegów - jednego wrzucił do jeziora, drugiego w błoto.' },
      { text: 'Na czym polega wirtualne udawanie?', answer: 'Na przedstawianiu się w internecie jako ktoś inny, lepszy, niż jest się naprawdę.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Kryspin w sieci i naprawdę'),
      ...recap(previousSetId),
      slideRead('Czytamy: „Wielki wybuch, czyli K kontra K”', 36, 39, 'Najpierw ramka „Kilka słów o książce” (s. 36). Potem słuchamy nagrania, a e-mail Kryspina czyta na głos jedna osoba.', 12 * 60),
      slideTask('Z1', 'Narysuj tabelkę: **Kryspin naprawdę | Kryspin w e-mailu**.\n\nWpisz po **trzy** informacje do każdej kolumny.', 7 * 60, 'cechyBohatera', '**Naprawdę:** nie umie się bić, koledzy mu dokuczają; uciekał przed Gryzmołem i Esfloresem; sam wpadł do jeziora, było mu wstyd.\n**W e-mailu:** „dowaliłem dwóm gościom”; wrzucił jednego do jeziora, drugiego w błoto; „trochę mnie poniosło” - udaje silnego i pewnego siebie.'),
      slideTask('Z2', 'Odpowiedz w 2-3 zdaniach:\n\n1. Dlaczego Kryspin w e-mailu opisał wszystko odwrotnie?\n2. Co może się stać, gdy K i K spotkają się naprawdę?', 6 * 60, undefined, '1. Wstydził się tego, co się stało. Chciał wypaść przed Ksenią na odważnego i popularnego.\n2. Prawda wyjdzie na jaw, oboje mogą się rozczarować - albo odetchnąć, że nie trzeba już udawać.'),
      slideTask('Z3', 'Rada dla Kryspina. Napisz do niego **krótką wiadomość** (2-3 zdania): co powinien zrobić, żeby zyskać prawdziwych przyjaciół?\n\nZacznij od zwrotu do adresata, np. „Cześć, Kryspin!”.', 6 * 60, 'wiadomosc', 'Np. „Cześć, Kryspin! Nie musisz udawać twardziela - to, że nie chcesz nikogo bić, jest w porządku. Napisz Kseni prawdę, bo prawdziwy przyjaciel polubi cię takim, jaki jesteś.”'),
      slideNote('K kontra K', '- Kryspin w sieci udaje odważnego i popularnego, a naprawdę jest nieśmiały.\n- Wirtualne udawanie - pokazywanie się w internecie jako ktoś inny.\n- Prawdziwa przyjaźń zaczyna się od prawdy.'),
    ],
  },
  {
    title: '10. Kultura w internecie',
    topic: 'Kultura w internecie',
    textbookPage: 40,
    teacherPlan: plan(
      ['Co dziś', 'Bez czytanki. Sposoby komunikowania się (s. 40-41) i zasady kultury w sieci (s. 42-43). Rozkładówka s. 40-41 jest kolorowa i dobrze wygląda na projektorze - możesz ją pokazać zamiast czytać.'],
      ['Przebieg (45 min)', [
        '1. **Temat + koło** (7 min).',
        '2. **Haczyk** (3 min): „Ile wiadomości wysłaliście wczoraj? Przez co?”. Zapisujesz na tablicy, co padnie.',
        '3. **Z1** (6 min).',
        '4. **Slajd: netykieta** (5 min).',
        '5. **Z2** (8 min) - tu jest najwięcej rozmowy. **Z3** (7 min).',
        '6. **Notatka** (4 min).',
      ].join('\n')],
      ['Jak wyjaśnić', [
        '- **Hejter** obraża i atakuje. **Troll** celowo prowokuje kłótnie, żeby się bawić czyimś zdenerwowaniem. Na trolla najlepsza odpowiedź to brak odpowiedzi.',
        '- **Krytyka a hejt:** krytyka mówi o rzeczy („ten błyszczyk się kruszy”), hejt o człowieku („jesteście puste”).',
        '- WIELKIE LITERY w sieci = krzyk.',
        '- Portale społecznościowe są od 13 lat (s. 41). Nie moralizuj, tylko podaj jako fakt.',
        '- Jeśli ktoś w klasie opowie o prawdziwym hejcie - nie drąż przy wszystkich, porozmawiaj po lekcji.',
      ].join('\n')],
      ['Tablica', 'Tabelka z zad. 4, s. 42: **Udogodnienia** (szybko, za darmo, z całym światem) | **Zagrożenia** (hejt, fałszywe konta, uzależnienie, kradzież danych).\nObok: KRYTYKA → o rzeczy | HEJT → o człowieku.'],
    ),
    questions: [
      { text: 'Kim jest hejter, a kim troll?', answer: 'Hejter obraża i atakuje innych w sieci. Troll celowo prowokuje kłótnie.' },
      { text: 'Dlaczego w internecie nie piszemy wielkimi literami?', answer: 'Bo oznacza to krzyk.' },
      { text: 'Czym różni się blog od forum dyskusyjnego?', answer: 'Blog to internetowy dziennik jednej osoby, a na forum wiele osób dyskutuje na jeden temat.' },
      { text: 'Od ilu lat można założyć konto na Facebooku?', answer: 'Od 13 lat.' },
      { text: 'Podaj dwie zasady kultury w internecie.', answer: 'Np. nie obrażam, nie piszę wielkimi literami, używam polskich liter i znaków interpunkcyjnych, nie odpowiadam trollom.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Kultura w internecie'),
      ...recap(previousSetId),
      slideTask('Z1', 'Dopasuj nazwę do opisu. Zapisz pary, np. 1 - C.\n\n1. SMS  2. e-mail  3. komunikator  4. blog  5. forum  6. portal społecznościowy\n\nA. internetowy dziennik jednej osoby\nB. list wysłany pocztą elektroniczną\nC. krótka wiadomość tekstowa z telefonu\nD. rozmowa na żywo, np. Messenger\nE. dyskusja wielu osób na jeden temat\nF. profil, posty i komentarze znajomych', 5 * 60, 'czat', '1 - C, 2 - B, 3 - D, 4 - A, 5 - E, 6 - F'),
      slideText('Netykieta - kultura w sieci', '- Nie obrażaj - **krytykuj rzecz**, nie człowieka.\n- Nie pisz WIELKIMI LITERAMI - to krzyk.\n- **Nie karm trolla** - nie odpowiadaj na zaczepki.\n- Pisz poprawnie: polskie litery, kropki, przecinki.\n- Hejt zgłaszaj dorosłemu albo administratorowi.', 'czat'),
      slideTask('Z2', 'Pod filmikiem kolegi ktoś napisał:\n\n**„TWÓJ FILMIK TO NAJWIĘKSZA NUDA NA ŚWIECIE!!! USUŃ KONTO”**\n\n1. Wypisz, co w tym komentarzu łamie zasady netykiety (co najmniej 3 rzeczy).\n2. Napisz ten sam komentarz tak, żeby był krytyką, a nie hejtem.', 8 * 60, 'czat', '1. Wielkie litery (krzyk), nadmiar wykrzykników, atak na człowieka zamiast rzeczy, polecenie „usuń konto”.\n2. Np. „Pomysł jest fajny, ale dla mnie film jest trochę za długi. Może skróć wstęp?”'),
      slideTask('Z3', 'Na forum „Nasze zwierzaki” ktoś pyta: **„Kot czy pies? Mama pozwoliła mi wybrać. Pomóżcie!”**\n\nNapisz odpowiedź w **3 zdaniach**: podaj swój wybór, jeden argument i coś miłego na koniec. Pamiętaj o polskich literach i interpunkcji.', 6 * 60, 'czat', 'Np. „Ja wybrałbym psa. Pies zmusza do spacerów, więc więcej ruszasz się na świeżym powietrzu. Powodzenia i daj znać, kogo wybrałaś!”'),
      slideNote('Kultura w internecie', '- Hejter obraża, troll prowokuje kłótnie.\n- Krytykuję rzecz, nie człowieka.\n- WIELKIE LITERY = krzyk.\n- Piszę poprawnie i uprzejmie, jak w rozmowie twarzą w twarz.'),
    ],
  },
  {
    title: '11. Jak napisać e-mail?',
    topic: 'Jak napisać e-mail?',
    textbookPage: 44,
    teacherPlan: plan(
      ['Co dziś', 'Bez czytanki. Budowa e-maila (s. 44-45). Dobrze, żeby każdy na koniec lekcji miał w zeszycie jeden gotowy, poprawny e-mail do nauczyciela - to przyda im się naprawdę.'],
      ['Przebieg (45 min)', [
        '1. **Temat + koło** (7 min).',
        '2. **Z1 - znajdź błędy** (7 min). Najpierw sami, potem koło.',
        '3. **Slajd: szkielet e-maila** (5 min) - rysujesz „kopertę” z okienkami.',
        '4. **Z2** (9 min), **Z3** (7 min).',
        '5. **Notatka** (4 min).',
      ].join('\n')],
      ['Jak wyjaśnić', [
        '- **Temat** to „tytuł” maila - po nim adresat wie, czy otworzyć. Nigdy pusty.',
        '- **„Witam”** tylko gospodarz mówi gościom. Do nauczyciela: „Dzień dobry” albo „Szanowna Pani”.',
        '- Po zwrocie stawiamy **przecinek**, a treść zaczynamy **małą literą** (albo wykrzyknik i wielka litera).',
        '- Na końcu **pozdrowienia** i **podpis** - imię i nazwisko, bo adres typu „kotek2014” nic nie mówi.',
        '- **DW** (do wiadomości) - kopia dla kogoś jeszcze, np. dla rodzica.',
      ].join('\n')],
      ['Tablica', 'Szkielet e-maila jak okienko programu:\nDo: ...\nDW: ...\nTemat: ...\n---\nDzień dobry, / Szanowna Pani,\ntreść małą literą...\nKażda sprawa - nowy akapit.\nPozdrawiam\nImię Nazwisko, kl. 5'],
    ),
    questions: [
      { text: 'Co wpisujesz w polu „Temat”?', answer: 'Krótko, czego dotyczy wiadomość, np. „Nieobecność na lekcji 12 października”.' },
      { text: 'Dlaczego do nauczyciela nie piszemy „Witam”?', answer: 'Bo „witam” mówi gospodarz do gościa. Lepiej napisać „Dzień dobry” albo „Szanowna Pani”.' },
      { text: 'Jaką literą zaczynasz treść po zwrocie zakończonym przecinkiem?', answer: 'Małą.' },
      { text: 'Co oznacza skrót DW w e-mailu?', answer: 'Do wiadomości - kopia maila dla innej osoby.' },
      { text: 'Co musi być na końcu e-maila?', answer: 'Pozdrowienia i podpis nadawcy.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Jak napisać e-mail?'),
      ...recap(previousSetId),
      slideTask('Z1', 'Znajdź **5 błędów** w tym e-mailu do nauczyciela:\n\nDo: nauczyciel@szkola.pl\nTemat: (pusty)\n\nWitam\nnie bede jutro na polskim bo ide do dentysty co mam zrobic z zadaniem\nnara', 6 * 60, 'email', '1. Brak tematu.\n2. „Witam” zamiast „Dzień dobry,” / „Szanowny Panie,”.\n3. Brak polskich liter (będę, idę, zrobić).\n4. Brak znaków interpunkcyjnych i znaku zapytania.\n5. „Nara” zamiast „Pozdrawiam” i brak podpisu.'),
      slideText('Szkielet e-maila', '1. **Temat** - krótko, czego dotyczy.\n2. **Zwrot**: Dzień dobry, / Szanowna Pani,\n3. **Treść** - po przecinku małą literą. Każda sprawa w nowym akapicie.\n4. **Pozdrowienia**: Pozdrawiam, Z wyrazami szacunku.\n5. **Podpis** - imię i nazwisko.\n\nNie zaczynamy od **„Witam”**.', 'email'),
      slideTask('Z2', 'Napisz e-mail do nauczyciela. Jutro nie będzie cię w szkole (wymyśl powód) i pytasz, co było zadane.\n\nMusi mieć: **temat, zwrot, 2-3 zdania treści, pozdrowienia, podpis**.', 8 * 60, 'email', 'Temat: Nieobecność 15 października\n\nDzień dobry,\njutro nie będzie mnie na lekcji polskiego, ponieważ jadę na zawody pływackie. Czy mogę prosić o informację, co będzie zadane?\n\nPozdrawiam\nOla Nowak, kl. 5'),
      slideTask('Z3', 'Teraz e-mail do koleżanki albo kolegi: przypomnij, co jest zadane z polskiego. Może być luźniejszy, ale **poprawny** - z tematem, zwrotem i podpisem.\n\nCzym różni się od e-maila z Z2?', 6 * 60, 'email', 'Temat: Zadanie z polskiego\n\nCześć, Kuba!\nPamiętaj, że na piątek mamy napisać opowiadanie „Niezwykły dzień”, co najmniej stronę, z dialogiem.\n\nNa razie!\nOla\n\nRóżnica: inny zwrot i pożegnanie, luźniejszy ton - ale dalej są polskie litery i interpunkcja.'),
      slideNote('Jak napisać e-mail?', '- Temat mówi, czego dotyczy wiadomość.\n- Zwrot: „Dzień dobry,” - nie „Witam”.\n- Treść po przecinku małą literą, każda sprawa w nowym akapicie.\n- Na końcu pozdrowienia i podpis.'),
    ],
  },
  {
    title: '12. Nieosobowe formy czasownika',
    topic: 'Nieosobowe formy czasownika',
    textbookPage: 48,
    teacherPlan: plan(
      ['Co dziś', 'Bez czytanki. Bezokolicznik, formy na -no/-to i konstrukcje z „się” (s. 48-49). Materiał jest z życia: przepisy, ogłoszenia, regulaminy.'],
      ['Przebieg (45 min)', [
        '1. **Temat + koło** (7 min).',
        '2. **Haczyk** (3 min): piszesz na tablicy „Zamknięto dopływ wody”. Pytasz: „Kto zamknął?”. Nie wiadomo - i o to chodzi.',
        '3. **Slajd z trzema formami** (5 min).',
        '4. **Z1** (7 min), **Z2** (7 min), **Z3** (7 min).',
        '5. **Notatka** (4 min).',
      ].join('\n')],
      ['Jak wyjaśnić', [
        '- Formy **osobowe** mówią, kto działa („ugotowałam”). **Nieosobowe** - nie mówią.',
        '- Trzy rodzaje: **bezokolicznik** (-ć, -c: gotować, piec), **-no / -to** (ugotowano, umyto), **„się”** (gotowało się, mówi się).',
        '- Kiedy się ich używa: w przepisach, instrukcjach i ogłoszeniach. Nieważne kto, ważne co.',
        '- Uwaga na pułapkę: „kot umył się” to forma osobowa (wiemy kto - kot). „Tu się nie pali” - nieosobowa.',
      ].join('\n')],
      ['Tablica', 'Trzy szuflady: **-ć / -c** (robić, piec) | **-no / -to** (zrobiono, umyto) | **się** (robiło się, mówi się).\nNad nimi: NIE WIEMY, KTO TO ROBI.'],
    ),
    questions: [
      { text: 'Czym różnią się formy osobowe od nieosobowych czasownika?', answer: 'Osobowe mówią, kto wykonuje czynność, nieosobowe tego nie mówią.' },
      { text: 'Podaj trzy rodzaje nieosobowych form czasownika.', answer: 'Bezokolicznik, formy zakończone na -no/-to i konstrukcje z „się”.' },
      { text: 'Jakie zakończenia ma bezokolicznik?', answer: '-ć albo -c, np. pisać, piec.' },
      { text: 'Gdzie często spotykamy formy na -no i -to?', answer: 'W ogłoszeniach i informacjach, np. „Zamknięto sklep”.' },
      { text: 'Czy „Otwarto nową bibliotekę” mówi, kto ją otworzył?', answer: 'Nie - to forma nieosobowa.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Nieosobowe formy czasownika'),
      ...recap(previousSetId),
      slideText('Nie wiemy, kto to zrobił', 'Formy **nieosobowe** nie mówią, kto wykonuje czynność:\n\n- **bezokolicznik**: -ć, -c → gotować, piec\n- formy na **-no, -to** → ugotowano, umyto\n- konstrukcje z **się** → gotowało się, mówi się\n\nUżywamy ich w przepisach, instrukcjach i ogłoszeniach.', 'ogloszenie'),
      slideTask('Z1', 'Mama podyktowała przepis na kanapkę:\n\n„Kroisz chleb. Smarujesz go masłem. Kładziesz ser i pomidor. Posypujesz szczypiorkiem.”\n\nZapisz przepis w zeszycie **bezokolicznikami**. Nadaj mu tytuł.', 6 * 60, 'czasownik', '**Kanapka z serem**\nKroić chleb. Posmarować masłem. Położyć ser i pomidor. Posypać szczypiorkiem.'),
      slideTask('Z2', 'Przekształć zdania tak, żeby było wiadomo, **kto** to zrobił. Wymyśl wykonawców.\n\n1. Zamknięto bibliotekę.\n2. Posprzątano klasę.\n3. Odwołano wycieczkę.\n\nKiedy lepiej użyć formy osobowej, a kiedy nieosobowej?', 6 * 60, 'przeksztalcanieZdan', 'Np. 1. Pani bibliotekarka zamknęła bibliotekę. 2. Dyżurni posprzątali klasę. 3. Pan dyrektor odwołał wycieczkę.\nForma osobowa - gdy ważne jest, kto działał. Nieosobowa - gdy ważna jest sama informacja.'),
      slideTask('Z3', 'Napisz **dwa ogłoszenia** na szkolną tablicę. W jednym użyj formy na **-no/-to**, w drugim konstrukcji z **się**. Podkreśl te formy.', 6 * 60, 'ogloszenie', 'Np. „W bibliotece **otwarto** kącik z komiksami.”\n„W piątek **odbędzie się** apel z okazji Dnia Edukacji Narodowej.”'),
      slideNote('Nieosobowe formy czasownika', '- Nie mówią, kto wykonuje czynność.\n- Bezokolicznik: gotować, piec.\n- Formy na -no, -to: ugotowano, umyto.\n- Konstrukcje z „się”: mówi się, gotowało się.'),
    ],
  },
  {
    title: '13. Tryby czasownika',
    topic: 'Tryby czasownika',
    textbookPage: 50,
    teacherPlan: plan(
      ['Co dziś', 'Bez czytanki. Tryb oznajmujący, rozkazujący i przypuszczający (s. 50-52). Lekcja bardzo „mówiona” - dużo przykładów na głos, zanim cokolwiek zapiszą.'],
      ['Przebieg (45 min)', [
        '1. **Temat + koło** (7 min).',
        '2. **Rozgrzewka** (3 min): rysunek z s. 50 - dwie dziewczyny przed wystawą. Kto informuje, kto doradza, kto wydaje polecenie?',
        '3. **Slajd z trzema trybami** (6 min).',
        '4. **Z1** (6 min), **Z2** - łańcuch ustnie, a na koniec zapis dwóch zdań (7 min), **Z3** (6 min).',
        '5. **Notatka** (4 min).',
      ].join('\n')],
      ['Jak wyjaśnić', [
        '- Tryb to **nastawienie** mówiącego. Trzy nastawienia: **oznajmujący** - informuję (jem, jadłem, zjem), **rozkazujący** - każę albo proszę (jedz! niech je!), **przypuszczający** - marzę, gdybam (jadłbym).',
        '- **Rozkazujący** nie ma 1. osoby liczby pojedynczej (nie rozkazuję sam sobie) ani czasu.',
        '- **Przypuszczający** = forma przeszła + by: jadł + bym → jadłbym. Nie ma czasu, ale ma rodzaj (jadłabym / jadłbym).',
        '- Pomost do następnej lekcji: „by” z czasownikiem piszemy razem - i tu nie ma wyjątków.',
      ].join('\n')],
      ['Tablica', 'Trzy kolumny z minkami:\nOZNAJMUJĄCY - czytam, czytałem, przeczytam\nROZKAZUJĄCY - czytaj! czytajmy! niech czyta!\nPRZYPUSZCZAJĄCY - czytałbym, czytałabyś, czytalibyśmy'],
    ),
    questions: [
      { text: 'Jakie są tryby czasownika?', answer: 'Oznajmujący, rozkazujący i przypuszczający.' },
      { text: 'W jakim trybie jest czasownik „zjedzcie”?', answer: 'W rozkazującym.' },
      { text: 'Jak tworzymy tryb przypuszczający?', answer: 'Do formy czasu przeszłego dodajemy cząstkę -by z końcówką, np. zrobił + bym → zrobiłbym.' },
      { text: 'Której formy nie ma tryb rozkazujący?', answer: '1. osoby liczby pojedynczej.' },
      { text: 'Do czego służy tryb oznajmujący?', answer: 'Do informowania o czynnościach, które się dzieją, działy albo będą dziać.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Tryby czasownika'),
      ...recap(previousSetId),
      slideText('Trzy tryby - trzy nastawienia', '**Oznajmujący** - informuję: jem, jadłem, zjem.\n\n**Rozkazujący** - każę, proszę, radzę: jedz! zjedzmy! niech zje!\n\n**Przypuszczający** - marzę, gdybam, proszę grzecznie: zjadłbym, zjadłabyś.\n\nPrzypuszczający = czas przeszły + **by**: zjadł + bym.', 'czasownik'),
      slideTask('Z1', 'Zamień regulamin klasy na **polecenia w trybie rozkazującym** (2. osoba liczby mnogiej):\n\n1. Uczniowie zmieniają obuwie.\n2. Nie biegamy po korytarzu.\n3. Wyłączamy telefony na lekcji.\n4. Sprzątamy po sobie ławki.', 5 * 60, 'czasownik', '1. Zmieńcie obuwie!\n2. Nie biegajcie po korytarzu!\n3. Wyłączcie telefony na lekcji!\n4. Posprzątajcie po sobie ławki!'),
      slideTask('Z2', 'Dokończ zdania **trybem przypuszczającym**. Podkreśl czasowniki.\n\n1. Gdybym urodził(a) się w Australii, ...\n2. Gdybym znalazł(a) się na bezludnej wyspie, ...\n3. Gdyby ludzie potrafili latać, ...', 6 * 60, 'czasownik', 'Np. 1. ...**hodowałbym** kangura.\n2. ...**zbudowałabym** szałas z liści.\n3. ...nikt nie **stałby** w korkach.'),
      slideTask('Z3', 'Nazwij tryb każdego czasownika:\n\n1. czytam\n2. czytaj\n3. czytałabym\n4. niech czyta\n5. przeczytaliśmy\n6. przeczytalibyście', 5 * 60, 'czasownikOdmiana', '1. oznajmujący\n2. rozkazujący\n3. przypuszczający\n4. rozkazujący\n5. oznajmujący\n6. przypuszczający'),
      slideNote('Tryby czasownika', '- Oznajmujący - informuję: jem, zjem.\n- Rozkazujący - każę, proszę: jedz! niech zje!\n- Przypuszczający - marzę, gdybam: zjadłbym.\n- Przypuszczający = czas przeszły + by.'),
    ],
  },
  {
    title: '14. Pisownia cząstki „by”',
    topic: 'Pisownia „by”',
    textbookPage: 53,
    teacherPlan: plan(
      ['Co dziś', 'Ortografia (s. 53). Krótki temat, więc druga połowa lekcji to dyktando-błyskawica i dokończenie zaległości z działu (np. czytanie opowiadań „Niezwykły dzień”, jeśli już są).'],
      ['Przebieg (45 min)', [
        '1. **Temat + koło** (7 min).',
        '2. **Slajd: dwie szuflady** (5 min).',
        '3. **Z1** (5 min), **Z2** (6 min).',
        '4. **Dyktando-błyskawica** (8 min): dyktujesz 5 zdań z odpowiedzi do Z3, a sprawdzają w parach, z ekranu.',
        '5. **Notatka** (4 min). Zostaje ok. 10 min - 2-3 osoby czytają swoje opowiadania.',
      ].join('\n')],
      ['Jak wyjaśnić', [
        '- **Razem**: z czasownikiem w formie osobowej (zrobiłby, poszłabym) i ze spójnikami (żeby, gdyby, jakby, aby, chociażby).',
        '- **Osobno**: przy bezokoliczniku (zrobić by) i wtedy, gdy „by” stoi **przed** czasownikiem, doczepione do innego słowa („Chętnie **bym** ci pomogła”, „Tam **bym** nie pojechał”).',
        '- Test: „Czy «by» jest przyklejone do czasownika, który mówi, kto działa? → razem”.',
      ].join('\n')],
      ['Tablica', 'Dwie szuflady:\n**RAZEM** - zrobiłbym, poszłabyś, żeby, gdyby, jakby\n**OSOBNO** - zrobić by, chętnie bym pomógł, tam bym nie poszedł'],
    ),
    questions: [
      { text: 'Kiedy cząstkę „by” piszemy łącznie?', answer: 'Z czasownikami w formie osobowej (zrobiłby) i ze spójnikami (żeby, gdyby, jakby).' },
      { text: 'Kiedy cząstkę „by” piszemy osobno?', answer: 'Po bezokolicznikach (zrobić by) i gdy stoi przed czasownikiem (chętnie bym pomógł).' },
      { text: 'Jak zapiszesz: „gdy/by” - razem czy osobno?', answer: 'Razem: gdyby.' },
      { text: 'Popraw zdanie: „Poszedł by m do kina”.', answer: 'Poszedłbym do kina.' },
      { text: 'Czy w zdaniu „Chętnie bym ci pomogła” piszemy „bym” osobno? Dlaczego?', answer: 'Tak, bo „bym” stoi przed czasownikiem, a nie jest do niego doczepione.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Pisownia „by”'),
      ...recap(previousSetId),
      slideText('Razem czy osobno?', '**Razem**:\n- z czasownikiem w formie osobowej: poszedłbym, zrobiłabyś\n- ze spójnikami: żeby, gdyby, jakby, aby, chociażby\n\n**Osobno**:\n- po bezokoliczniku: zrobić by\n- gdy stoi przed czasownikiem: chętnie **bym** pomógł', 'nieZCzesciami'),
      slideTask('Z1', 'Posortuj do dwóch kolumn: **razem | osobno**. Przepisz poprawnie.\n\npojechał(by), (że)(by), zrobić (by), (gdy)(by)ś, chętnie (bym) pomogła, czytała(bym), jak(by), tam (bym) nie poszedł', 5 * 60, 'nieZCzesciami', '**Razem:** pojechałby, żeby, gdybyś, czytałabym, jakby\n**Osobno:** zrobić by, chętnie bym pomogła, tam bym nie poszedł'),
      slideTask('Z2', 'Przekształć zdania tak, żeby „by” było pisane **razem** z czasownikiem:\n\n1. A co ty byś zrobił?\n2. Chętnie bym ci pomogła.\n3. Naprawdę byś mogła?', 5 * 60, 'nieZCzesciami', '1. A co zrobiłbyś?\n2. Chętnie pomogłabym ci.\n3. Naprawdę mogłabyś?'),
      slideTask('Z3', 'Dyktando-błyskawica. Zapisz zdania, które podyktuje nauczyciel. Potem sprawdź z sąsiadem.', 8 * 60, 'nieZCzesciami', '1. Gdybym miał psa, nazwałbym go Koks.\n2. Chciałabyś pojechać z nami?\n3. Tam bym nie wchodził.\n4. Zrób to tak, żeby nikt nie widział.\n5. Pomóc by trzeba, ale jak?'),
      slideNote('Pisownia „by”', '- Razem: poszedłbym, zrobiłabyś, żeby, gdyby, jakby.\n- Osobno: zrobić by, chętnie bym pomógł.'),
    ],
  },
  {
    title: '15. W poszukiwaniu przyjaźni - powtórzenie',
    topic: 'Powtórzenie działu',
    textbookPage: 14,
    teacherPlan: plan(
      ['Co dziś', 'Powtórka całego działu przed sprawdzianem albo kartkówką. Bez czytania - zadania mieszane, dużo koła.'],
      ['Przebieg (45 min)', [
        '1. **Temat** (2 min).',
        '2. **Koło powtórzeniowe** (10 min) - pytania z lekcji o by.',
        '3. **Mapa działu** (5 min): rysujesz na tablicy, oni mówią, co pamiętają z każdego tekstu.',
        '4. **Z1** (7 min) - dialog, **Z2** (7 min) - czasownik, **Z3** (8 min) - e-mail i netykieta.',
        '5. **Notatka** (4 min) - co będzie na sprawdzianie.',
      ].join('\n')],
      ['Jak wyjaśnić', [
        '- Przy mapie pytaj o **łącznik**: co mają wspólnego Radek, Peter, Jędrek i Kryspin? Każdy musiał się zdecydować - milczeć czy działać, udawać czy być sobą.',
        '- Najczęstsze błędy z działu, które warto przypomnieć: kropka przed słowami narratora w dialogu, „Witam” w e-mailu, „by” osobno przy czasowniku.',
      ].join('\n')],
      ['Tablica', 'Mapa: w środku PRZYJAŹŃ. Gałęzie: Sztuka programowania (odwaga, lojalność) | Pax (empatia, przyjaźń ze zwierzęciem) | Dziesiąty poziom (pomoc, wolontariat) | K kontra K (być sobą w sieci).\nDruga mapa: JĘZYK → dialog, głoski miękkie, czasownik (osoba, liczba, czas, rodzaj, tryby, formy nieosobowe), „by”, e-mail.'],
    ),
    questions: [
      { text: 'Czym narrator-obserwator różni się od narratora biorącego udział w wydarzeniach?', answer: 'Obserwator opowiada o innych („Radek pobiegł”), a uczestnik mówi o sobie („pobiegłem”).' },
      { text: 'Jakie trzy tryby ma czasownik?', answer: 'Oznajmujący, rozkazujący i przypuszczający.' },
      { text: 'Jak zapiszesz miękkość w wyrazie „koń”, a jak w „koniec”?', answer: 'W „koń” kreską (koniec wyrazu), w „koniec” literą i (przed samogłoską).' },
      { text: 'Co łączy bohaterów tekstów z tego działu?', answer: 'Każdy musiał się wykazać w przyjaźni - odwagą, empatią, pomocą albo szczerością.' },
      { text: 'Podaj przykład formy nieosobowej czasownika.', answer: 'Np. czytać, przeczytano, mówi się.' },
    ],
    makeSlides: (previousSetId) => [
      slideTopic('Powtórzenie działu'),
      ...recap(previousSetId),
      slideText('Co już wiemy?', '**Teksty:** Sztuka programowania, Pax, Dziesiąty poziom, K kontra K.\n\n**Pisanie:** dialog, opowiadanie, e-mail, kultura w sieci.\n\n**Język:** głoski miękkie, czasownik (osoba, liczba, czas, rodzaj), formy nieosobowe, tryby, pisownia „by”.', 'swiatPrzedstawiony'),
      slideTask('Z1', 'Przepisz dialog poprawnie i zamień „powiedział” na lepsze czasowniki:\n\nGdzie jest Koks powiedział Radek\nuciekł powiedziała Matylda szukaliśmy go wszędzie', 6 * 60, 'dialog', '– Gdzie jest Koks? – zapytał Radek.\n– Uciekł – westchnęła Matylda. – Szukaliśmy go wszędzie.'),
      slideTask('Z2', 'Przy każdym czasowniku zapisz **tryb** i - jeśli się da - **osobę, liczbę i czas**:\n\n1. pomógłbym\n2. pomóżcie\n3. pomagaliśmy\n4. pomagano\n\nKtóra forma jest nieosobowa?', 7 * 60, 'czasownikOdmiana', '1. przypuszczający, 1. os., l.poj.\n2. rozkazujący, 2. os., l.mn.\n3. oznajmujący, 1. os., l.mn., czas przeszły\n4. forma nieosobowa (na -no) - nie określimy osoby.'),
      slideTask('Z3', 'Napisz e-mail do Kryspina z „K kontra K”, w którym radzisz mu, jak zachowywać się w sieci. Zastosuj **zasady e-maila** (temat, zwrot, podpis) i **netykiety**. Użyj jednego czasownika w trybie przypuszczającym.', 8 * 60, 'email', 'Temat: Rada od kolegi\n\nCześć, Kryspin!\nNa twoim miejscu napisałbym Kseni prawdę o tym, co stało się w parku. W sieci łatwo udawać, ale przyjaciele powinni wiedzieć, jacy jesteśmy naprawdę.\n\nPozdrawiam\nKuba'),
      slideNote('Powtórzenie działu', '- Przyjaźń wymaga odwagi, empatii, pomocy i szczerości.\n- Dialog: myślnik, słowa narratora małą literą.\n- Czasownik: tryby, formy nieosobowe, „by” z czasownikiem razem.\n- E-mail: temat, zwrot, podpis - bez „Witam”.'),
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
      slides: topic.makeSlides(questionSets[index - 1]?.id),
    };
  });
  return { lessons, questionSets, questions };
}

export const TEXTBOOK5_TOPIC_COUNT = TOPICS.length;

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
function slideRecap(questionSetId: string): Slide { return { id: newId(), kind: 'recap', questionSetId, mode: 'powtorzeniowe' }; }
/** Notatka zamykajaca lekcje: "Temat: <krotka nazwa>" + kilka linijek do przepisania. */
function slideNote(temat: string, body: string): Slide {
  return { id: newId(), kind: 'note', title: 'Notatka do zeszytu', body: `**Temat:** ${temat}\n${body}` };
}
function recap(questionSetId?: string): Slide[] { return questionSetId ? [slideRecap(questionSetId)] : []; }
