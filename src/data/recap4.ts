// Gotowa powtorka materialu klasy 4 - jezyk polski, na start klasy 5.
// Trzy lekcje (modul = 1-2 godziny lekcyjne): odmienne czesci mowy, zdanie i wyrazy
// nieodmienne, srodki poetyckie i formy wypowiedzi + trzy zestawy pytan do kola fortuny.
// Rytm slajdow taki sam jak w powtorce klas 1-3 (recap13.ts): krotka regula (text)
// -> zadanie do zeszytu ze stoperem (task) -> kolejna regula...
// Wstawiane z ekranu Lekcje przyciskiem.

import { newId } from './id';
import type { Lesson, Question, QuestionSet, Slide, SlideArt } from './types';

interface QuestionSeed {
  text: string;
  answer?: string;
}

interface SeedBundleResult {
  lessons: Omit<Lesson, 'id' | 'order'>[];
  questionSets: QuestionSet[];
  questions: Question[];
}

function buildQuestionSet(
  name: string,
  topic: string,
  classId: string,
  seeds: QuestionSeed[],
): { set: QuestionSet; questions: Question[] } {
  const setId = newId();
  const set: QuestionSet = {
    id: setId,
    name,
    topic,
    classIds: [classId],
    createdAt: new Date().toISOString(),
  };
  const questions: Question[] = seeds.map((s, i) => ({
    id: newId(),
    setId,
    text: s.text,
    answer: s.answer,
    order: i,
  }));
  return { set, questions };
}

/** Tworzy 3 lekcje + 3 zestawy pytan powtorki materialu klasy 4 dla wskazanej klasy. */
export function buildRecap4(classId: string): SeedBundleResult {
  // ---------- Zestawy pytan ----------
  const set1 = buildQuestionSet(
    'Powtórka klasy 4: odmienne części mowy',
    'Odmienne części mowy',
    classId,
    [
      { text: 'Wymień cztery odmienne części mowy.', answer: 'rzeczownik, czasownik, przymiotnik, liczebnik (odmienia się też zaimek)' },
      { text: 'Ile przypadków ma język polski? Wymień pierwsze trzy.', answer: '7 przypadków; mianownik, dopełniacz, celownik' },
      { text: 'Na jakie pytania odpowiada dopełniacz?', answer: 'kogo? czego?' },
      { text: 'Na jakie pytania odpowiada narzędnik?', answer: '(z) kim? (z) czym?' },
      { text: 'Odmień przez trzy pierwsze przypadki rzeczownik "pies".', answer: 'M. pies, D. psa, C. psu' },
      { text: 'Jakie trzy rodzaje ma rzeczownik w liczbie pojedynczej?', answer: 'męski, żeński, nijaki' },
      { text: 'Co określamy przy czasowniku poza osobą i liczbą?', answer: 'czas (przeszły, teraźniejszy, przyszły), a także rodzaj i tryb' },
      { text: 'Podaj formę bezokolicznika czasownika "napisałem".', answer: 'napisać' },
      { text: 'W jakiej osobie i liczbie jest forma "piszecie"?', answer: '2. osoba liczby mnogiej' },
      { text: 'Wymień trzy stopnie przymiotnika na przykładzie wyrazu "miły".', answer: 'miły - milszy - najmilszy (równy, wyższy, najwyższy)' },
      { text: 'Stopniuj przymiotnik "dobry".', answer: 'dobry - lepszy - najlepszy (stopniowanie nieregularne)' },
      { text: 'Jak stopniujemy przymiotnik "kolorowy"?', answer: 'bardziej kolorowy - najbardziej kolorowy (stopniowanie opisowe)' },
      { text: 'Czym różni się liczebnik główny od porządkowego? Podaj przykłady.', answer: 'główny odpowiada na pytanie ile? (pięć), porządkowy - który z kolei? (piąty)' },
      { text: 'Jaką częścią mowy jest wyraz "trzeci"?', answer: 'liczebnikiem porządkowym' },
      { text: 'Na jakie pytania odpowiada przymiotnik?', answer: 'jaki? jaka? jakie? który? czyj?' },
    ],
  );

  const set2 = buildQuestionSet(
    'Powtórka klasy 4: zdanie i wyrazy nieodmienne',
    'Składnia i wyrazy nieodmienne',
    classId,
    [
      { text: 'Co to jest orzeczenie i jaką częścią mowy najczęściej jest wyrażone?', answer: 'mówi, co robi podmiot; najczęściej czasownikiem w formie osobowej' },
      { text: 'Na jakie pytania odpowiada podmiot?', answer: 'kto? co?' },
      { text: 'Wskaż podmiot i orzeczenie w zdaniu: "Mała Zosia czyta ciekawą książkę."', answer: 'podmiot: Zosia, orzeczenie: czyta' },
      { text: 'Czym różni się zdanie pojedyncze rozwinięte od nierozwiniętego?', answer: 'nierozwinięte ma tylko podmiot i orzeczenie, rozwinięte ma dodatkowe określenia' },
      { text: 'Ile orzeczeń ma zdanie złożone?', answer: 'co najmniej dwa - tyle zdań składowych, ile orzeczeń' },
      { text: 'Co to jest równoważnik zdania? Podaj przykład.', answer: 'wypowiedzenie bez orzeczenia, np. "Cisza!", "Zakaz wstępu"' },
      { text: 'Zamień na równoważnik zdania: "Proszę zamknąć drzwi."', answer: 'np. "Zamykać drzwi!" albo "Drzwi zamknięte"' },
      { text: 'Wymień trzy części mowy, które się nie odmieniają.', answer: 'przysłówek, przyimek, spójnik (a także wykrzyknik i partykuła)' },
      { text: 'Na jakie pytania odpowiada przysłówek?', answer: 'jak? gdzie? kiedy?' },
      { text: 'Od jakiej części mowy tworzymy przysłówek "wesoło"?', answer: 'od przymiotnika "wesoły"' },
      { text: 'Podaj trzy przyimki.', answer: 'np. w, na, pod, nad, za, przy, do, od' },
      { text: 'Jak piszemy "nie" z czasownikiem? Podaj przykład.', answer: 'osobno: nie wiem, nie pójdę' },
      { text: 'Jak piszemy "nie" z rzeczownikiem i przymiotnikiem? Podaj przykłady.', answer: 'razem: nieprawda, niegrzeczny' },
      { text: 'Popraw zapis: "Nieznam tego chłopca."', answer: '"Nie znam tego chłopca" - nie z czasownikiem piszemy osobno' },
      { text: 'Jaki znak stawiamy przed spójnikami: że, ale, bo, więc?', answer: 'przecinek' },
    ],
  );

  const set3 = buildQuestionSet(
    'Powtórka klasy 4: środki poetyckie i formy wypowiedzi',
    'Środki poetyckie i formy wypowiedzi',
    classId,
    [
      { text: 'Co to jest epitet? Podaj przykład.', answer: 'określenie rzeczownika, najczęściej przymiotnik, np. "zielona łąka"' },
      { text: 'Po jakich wyrazach poznajemy porównanie?', answer: 'po wyrazach: jak, jakby, niby, niczym' },
      { text: 'Ułóż porównanie ze słowem "szybki".', answer: 'np. "szybki jak błyskawica"' },
      { text: 'Co to jest wyraz dźwiękonaśladowczy? Podaj dwa przykłady.', answer: 'wyraz naśladujący dźwięk, np. bzyk, szur, plum, tik-tak' },
      { text: 'Co to jest uosobienie?', answer: 'nadanie rzeczy, zwierzęciu lub zjawisku cech człowieka, np. "wiatr śpiewał"' },
      { text: 'Czym jest ożywienie? Podaj przykład.', answer: 'nadanie przedmiotowi cech istoty żywej, np. "słońce się budzi"' },
      { text: 'Jak nazywa się jedna linijka wiersza?', answer: 'wers' },
      { text: 'Jak inaczej nazywamy zwrotkę wiersza?', answer: 'strofa' },
      { text: 'Co to jest refren?', answer: 'powtarzający się fragment wiersza lub piosenki' },
      { text: 'Kto wypowiada się w wierszu, a kto w opowiadaniu?', answer: 'w wierszu podmiot liryczny, w opowiadaniu narrator' },
      { text: 'Czym różni się narracja pierwszoosobowa od trzecioosobowej?', answer: 'pierwszoosobowa: narrator mówi "ja", jest bohaterem; trzecioosobowa: opowiada z zewnątrz' },
      { text: 'Wymień cztery elementy listu.', answer: 'miejscowość i data, nagłówek, treść, zwrot pożegnalny i podpis' },
      { text: 'Co musi zawierać ogłoszenie?', answer: 'czego dotyczy, kiedy i gdzie, kontakt do osoby ogłaszającej' },
      { text: 'Czym różni się dialog od monologu?', answer: 'dialog to rozmowa co najmniej dwóch osób, monolog to wypowiedź jednej' },
      { text: 'Jakim znakiem zapisujemy wypowiedzi w dialogu?', answer: 'myślnikiem na początku każdej wypowiedzi (nowa linia)' },
    ],
  );

  // ---------- Lekcje ----------
  const lesson1: Omit<Lesson, 'id' | 'order'> = {
    classId,
    title: 'Powtórka klasy 4: Odmienne części mowy',
    topic: 'Odmienne części mowy',
    status: 'planned',
    questionSetId: set1.set.id,
    registerTopic: 'Powtórzenie wiadomości z klasy 4: odmienne części mowy i ich formy',
    curriculum: ['II.1.1', 'II.1.2', 'II.1.4', 'II.1.6', 'II.1.7'],
    slides: [
      slideTitle('Powtórka klasy 4', 'Odmienne części mowy - część 1/3'),
      slideText('Co dziś powtarzamy', `- Rzeczownik i odmiana przez przypadki
- Czasownik: osoba, liczba, czas
- Przymiotnik i jego stopniowanie
- Liczebnik główny i porządkowy`),
      slideText('Odmienne i nieodmienne', `**Odmienne** części mowy zmieniają swoją formę: **rzeczownik, czasownik, przymiotnik, liczebnik, zaimek**.

**Nieodmienne** wyglądają zawsze tak samo: **przysłówek, przyimek, spójnik**.

Sprawdzamy prosto: spróbuj powiedzieć wyraz w innej formie. "Kot - kota - kotu" - odmienny. "Szybko" - zawsze "szybko".`),
      slideText('Rzeczownik przez przypadki', `Rzeczownik odmienia się przez **7 przypadków**, a każdy ma swoje pytania.

Odmieniamy zawsze z pomocą pytań, np. **kot**: M. kto? co? - kot, D. kogo? czego? - kota.

Rzeczownik ma też **liczbę** (pojedyncza, mnoga) i **rodzaj** (męski, żeński, nijaki).`, 'przypadki'),
      slideTask('Z1', 'Odmień przez przypadki', `Odmień w zeszycie przez wszystkie 7 przypadków rzeczownik **szkoła**.

Zapisuj tak: **M. (kto? co?) szkoła**.

Podpowiedź: pytania masz na ilustracji obok.`, undefined, 240),
      slideText('Czasownik: osoba, liczba, czas', `Czasownik odmienia się przez **osoby** (ja, ty, on / my, wy, oni) i **liczby**.

Ma trzy **czasy**: **przeszły** (pisałem), **teraźniejszy** (piszę), **przyszły** (będę pisać).

Forma bez osoby i czasu to **bezokolicznik**: pisa**ć**, biec, robi**ć**.`, 'czasownikOdmiana'),
      slideTask('Z2', 'Określ formę czasownika', `Dla każdej formy zapisz w zeszycie **osobę, liczbę i czas**:

1. czytamy
2. napiszesz
3. biegli
4. śpiewam

Wzór: **czytamy - 1. osoba, l. mnoga, czas teraźniejszy**.`, undefined, 180),
      slideText('Stopniowanie przymiotnika', `Przymiotnik ma **trzy stopnie**: równy, wyższy i najwyższy.

**Regularnie**: miły - milszy - najmilszy.

**Opisowo** (dłuższe wyrazy): kolorowy - bardziej kolorowy - najbardziej kolorowy.

**Nieregularnie**: dobry - lepszy - najlepszy, zły - gorszy - najgorszy.`, 'stopniowanie'),
      slideTask('Z3', 'Stopniuj przymiotniki', `Zapisz w zeszycie trzy stopnie każdego przymiotnika:

1. ciepły
2. mądry
3. interesujący
4. duży

Przy ostatnich dwóch uważaj - jeden stopniuje się opisowo, drugi nieregularnie.`, undefined, 210),
      slideText('Liczebnik', `**Liczebnik główny** odpowiada na pytanie **ile?** - jeden, pięć, dwadzieścia.

**Liczebnik porządkowy** odpowiada na pytanie **który z kolei?** - pierwszy, piąty, dwudziesty.

Liczebnik porządkowy zapisany cyfrą ma kropkę: **5. miejsce** znaczy "piąte miejsce".`, 'liczebnik'),
      slideTask('Z4', 'Główny czy porządkowy', `Zapisz w zeszycie, jaki to liczebnik: **G** - główny, **P** - porządkowy.

1. siedem
2. trzeci
3. dwanaście
4. setny
5. dwadzieścia jeden

Ułóż też jedno zdanie z liczebnikiem porządkowym.`, undefined, 180),
      slideText('Zanim zakręcimy kołem', `Zapamiętaj:
- odmienne: **rzeczownik, czasownik, przymiotnik, liczebnik**
- rzeczownik odmienia się przez **7 przypadków**, liczby i rodzaje
- czasownik ma **osobę, liczbę i czas**, a bez nich jest **bezokolicznikiem**
- przymiotnik stopniujemy: **równy - wyższy - najwyższy**`),
      slideRecap(set1.set.id),
      slideNote(
        'Notatka do zeszytu',
        `**Temat: Odmienne części mowy**

- Odmienne: rzeczownik, czasownik, przymiotnik, liczebnik, zaimek.
- Rzeczownik odmienia się przez 7 przypadków, liczby i rodzaje.
- Czasownik odmienia się przez osoby, liczby i czasy; bezokolicznik nie ma osoby ani czasu.
- Przymiotnik stopniujemy regularnie (miły - milszy - najmilszy), opisowo (bardziej) i nieregularnie (dobry - lepszy - najlepszy).
- Liczebnik główny: ile? (pięć). Liczebnik porządkowy: który z kolei? (piąty).`,
      ),
    ],
  };

  const lesson2: Omit<Lesson, 'id' | 'order'> = {
    classId,
    title: 'Powtórka klasy 4: Zdanie i wyrazy nieodmienne',
    topic: 'Składnia i wyrazy nieodmienne',
    status: 'planned',
    questionSetId: set2.set.id,
    registerTopic: 'Powtórzenie wiadomości z klasy 4: budowa zdania, wyrazy nieodmienne, pisownia "nie"',
    curriculum: ['II.1.8', 'II.1.12', 'II.1.2', 'II.4.1', 'II.4.2'],
    slides: [
      slideTitle('Powtórka klasy 4', 'Zdanie i wyrazy nieodmienne - część 2/3'),
      slideText('Co dziś powtarzamy', `- Podmiot i orzeczenie
- Zdanie pojedyncze, złożone i równoważnik
- Przysłówek, przyimek, spójnik
- Pisownia "nie" z różnymi częściami mowy`),
      slideText('Podmiot i orzeczenie', `**Orzeczenie** mówi, co się dzieje. To czasownik w formie osobowej: **kto? co robi?**

**Podmiot** to wykonawca - odpowiada na pytania **kto? co?**

W zdaniu "Mała Zosia czyta książkę" podmiotem jest **Zosia**, a orzeczeniem **czyta**.`, 'podmiotOrzeczenie'),
      slideTask('Z1', 'Znajdź podmiot i orzeczenie', `Przepisz zdania do zeszytu. Podmiot podkreśl **jedną** linią, orzeczenie **dwiema**:

1. Wysoki chłopiec kopnął piłkę.
2. Nasza klasa pojechała na wycieczkę.
3. Wczoraj padał zimny deszcz.
4. Mama upiekła pyszne ciasto.`, undefined, 210),
      slideText('Zdanie pojedyncze i złożone', `**Zdanie pojedyncze** ma **jedno** orzeczenie.

- **nierozwinięte**: sam podmiot i orzeczenie - "Pies szczeka."
- **rozwinięte**: z określeniami - "Duży pies głośno szczeka na listonosza."

**Zdanie złożone** ma **co najmniej dwa** orzeczenia: "Pies szczeka, **bo** widzi listonosza."

Ile orzeczeń, tyle zdań składowych.`, 'zdanieZlozone'),
      slideText('Równoważnik zdania', `**Równoważnik zdania** to wypowiedzenie **bez orzeczenia**.

Przykłady: "Cisza!", "Zakaz wstępu.", "Uwaga, zły pies!"

Spotykasz je codziennie na tablicach, w ogłoszeniach i planach lekcji.`),
      slideTask('Z2', 'Pojedyncze, złożone czy równoważnik', `Zapisz w zeszycie przy każdym wypowiedzeniu: **P** - pojedyncze, **Z** - złożone, **R** - równoważnik.

1. Ania śpiewa i tańczy.
2. Wstęp wzbroniony.
3. Kot śpi na kanapie.
4. Wróciłem do domu, bo zrobiło się ciemno.

Przy złożonych policz orzeczenia.`, undefined, 210),
      slideText('Wyrazy nieodmienne', `**Przysłówek** - jak? gdzie? kiedy? - szybko, tutaj, wczoraj. Powstaje od przymiotnika: wesoły - **wesoło**.

**Przyimek** - mały wyraz wskazujący miejsce lub czas: w, na, pod, nad, za, do, od.

**Spójnik** - łączy wyrazy i zdania: i, a, ale, oraz, że, bo, więc.`, 'nieodmienne'),
      slideTask('Z3', 'Rozpoznaj wyrazy nieodmienne', `Wypisz z tekstu do zeszytu wszystkie **przysłówki**, **przyimki** i **spójniki**:

"Wczoraj poszliśmy do parku, ale szybko zrobiło się zimno, więc wróciliśmy do domu."

Zapisz je w trzech kolumnach.`, undefined, 180),
      slideText('Pisownia "nie"', `**Osobno** z czasownikiem: **nie wiem**, **nie pójdę**, **nie mam**.

**Razem** z rzeczownikiem i przymiotnikiem: **nieprawda**, **niegrzeczny**, **niedaleko**.

Najczęstszy błąd to "niewiem" - zapamiętaj: przy czasowniku **nie** stoi zawsze osobno.`, 'nieZCzesciami'),
      slideTask('Z4', 'Razem czy osobno', `Przepisz do zeszytu, zapisując poprawnie wyrażenia z "nie":

1. (nie)czytam
2. (nie)wesoły
3. (nie)szczęście
4. (nie)pojadę
5. (nie)ładny

Przy każdym dopisz, jaka to część mowy.`, undefined, 210),
      slideText('Zanim zakręcimy kołem', `Zapamiętaj:
- **orzeczenie** - co robi (czasownik), **podmiot** - kto? co?
- zdanie **złożone** ma co najmniej **dwa orzeczenia**
- **równoważnik** nie ma orzeczenia
- **nie** z czasownikiem **osobno**, z rzeczownikiem i przymiotnikiem **razem**`),
      slideRecap(set2.set.id),
      slideNote(
        'Notatka do zeszytu',
        `**Temat: Zdanie i wyrazy nieodmienne**

- Orzeczenie mówi, co się dzieje (czasownik osobowy). Podmiot odpowiada na pytania kto? co?
- Zdanie pojedyncze ma jedno orzeczenie, złożone - co najmniej dwa.
- Równoważnik zdania nie ma orzeczenia, np. "Cisza!".
- Nieodmienne: przysłówek (jak? gdzie? kiedy?), przyimek (w, na, pod), spójnik (i, ale, bo).
- "Nie" z czasownikiem piszemy osobno, z rzeczownikiem i przymiotnikiem razem.`,
      ),
    ],
  };

  const lesson3: Omit<Lesson, 'id' | 'order'> = {
    classId,
    title: 'Powtórka klasy 4: Środki poetyckie i formy wypowiedzi',
    topic: 'Środki poetyckie i formy wypowiedzi',
    status: 'planned',
    questionSetId: set3.set.id,
    registerTopic: 'Powtórzenie wiadomości z klasy 4: środki poetyckie, budowa wiersza, formy wypowiedzi',
    curriculum: ['I.1.4', 'I.1.6', 'I.1.9', 'I.1.10', 'III.2.1'],
    slides: [
      slideTitle('Powtórka klasy 4', 'Środki poetyckie i formy wypowiedzi - część 3/3'),
      slideText('Co dziś powtarzamy', `- Epitet, porównanie, przenośnia, ożywienie
- Wers, strofa, rym, refren
- Narrator i podmiot liryczny
- List, ogłoszenie i dialog`),
      slideText('Środki poetyckie', `**Epitet** - określenie rzeczownika: **zielona** łąka, **stary** dąb.

**Porównanie** - z wyrazem jak, niby, niczym: silny **jak** tur.

**Przenośnia** - znaczenie nie wprost: "złote serce" (nie ze złota - dobre).

**Wyraz dźwiękonaśladowczy**: bzyk, plum, tik-tak.`, 'srodkiPoetyckie'),
      slideTask('Z1', 'Rozpoznaj środek poetycki', `Zapisz w zeszycie, jaki to środek: **E** - epitet, **P** - porównanie, **D** - wyraz dźwiękonaśladowczy.

1. mroźna zima
2. biały jak śnieg
3. szur, szur
4. wesoła piosenka
5. lekki niczym piórko

Ułóż też własne porównanie.`, undefined, 210),
      slideText('Ożywienie i uosobienie', `**Ożywienie** - przedmiot albo zjawisko zachowuje się jak istota żywa: "słońce **się budzi**", "wiatr **biegnie**".

**Uosobienie** - rzecz, zwierzę albo zjawisko robi to, co człowiek: "wiatr **śpiewał piosenkę**", "drzewa **szeptały**".

Poeta używa ich, żeby świat w wierszu wydawał się żywy.`),
      slideText('Budowa wiersza', `**Wers** - jedna linijka wiersza.

**Strofa** (zwrotka) - grupa wersów oddzielona odstępem.

**Rym** - podobne zakończenie wersów: kot - płot.

**Refren** - fragment, który się powtarza.`, 'strofa'),
      slideTask('Z2', 'Policz wersy i strofy', `Otwórz podręcznik na dowolnym wierszu i zapisz w zeszycie:

1. ile wiersz ma **strof**
2. ile **wersów** ma pierwsza strofa
3. dwie pary wyrazów, które się **rymują**

Jeśli wiersz ma refren - przepisz go.`, undefined, 240),
      slideText('Kto opowiada', `W **wierszu** wypowiada się **podmiot liryczny** - ten, kto mówi "ja" w wierszu.

W **opowiadaniu** i powieści opowiada **narrator**.

Narracja **pierwszoosobowa**: narrator mówi "ja", sam brał udział w wydarzeniach.

Narracja **trzecioosobowa**: narrator opowiada o bohaterach z zewnątrz - "on, ona, oni".`, 'narrator'),
      slideText('List', `List ma stałe elementy:

- **miejscowość i data** (w prawym górnym rogu)
- **nagłówek**: Droga Aniu, Kochana Babciu
- **treść** - to, co chcemy przekazać
- **zwrot pożegnalny i podpis**: Pozdrawiam, Antek`, 'list'),
      slideTask('Z3', 'Napisz krótki list', `Napisz w zeszycie **krótki list** do kolegi lub koleżanki z wakacji.

Pamiętaj o wszystkich czterech elementach: data, nagłówek, treść, pożegnanie i podpis.

Treść: 3-4 zdania. Masz 6 minut.`, undefined, 360),
      slideText('Ogłoszenie i dialog', `**Ogłoszenie** musi odpowiadać na pytania: **czego dotyczy**, **kiedy i gdzie**, **kto** je zamieszcza.

**Dialog** to rozmowa co najmniej dwóch osób. Każdą wypowiedź zapisujemy od **nowej linii**, zaczynając od **myślnika**:

- Idziesz na boisko?
- Tak, zaraz po lekcjach.`, 'ogloszenie'),
      slideTask('Z4', 'Ułóż ogłoszenie', `Napisz w zeszycie ogłoszenie o **zbiórce karmy dla schroniska**.

Musi być w nim: czego dotyczy, kiedy i gdzie przynosić, kto organizuje.

Krótko - ogłoszenie ma być czytelne z daleka.`, undefined, 300),
      slideText('Zanim zakręcimy kołem', `Zapamiętaj:
- **epitet** określa, **porównanie** ma "jak", **przenośnia** mówi nie wprost
- **wers** to linijka, **strofa** to zwrotka
- w wierszu mówi **podmiot liryczny**, w opowiadaniu **narrator**
- list: data, nagłówek, treść, podpis`),
      slideRecap(set3.set.id),
      slideNote(
        'Notatka do zeszytu',
        `**Temat: Środki poetyckie i formy wypowiedzi**

- Epitet określa rzeczownik (zielona łąka), porównanie ma wyraz jak/niby/niczym.
- Przenośnia mówi nie wprost (złote serce). Wyrazy dźwiękonaśladowcze naśladują dźwięk.
- Ożywienie i uosobienie sprawiają, że rzeczy zachowują się jak istoty żywe i jak ludzie.
- Wers to jedna linijka, strofa to zwrotka, refren się powtarza.
- W wierszu mówi podmiot liryczny, w opowiadaniu narrator (1. lub 3. osoba).
- List: miejscowość i data, nagłówek, treść, pożegnanie i podpis.`,
      ),
    ],
  };

  return {
    lessons: [lesson1, lesson2, lesson3],
    questionSets: [set1.set, set2.set, set3.set],
    questions: [...set1.questions, ...set2.questions, ...set3.questions],
  };
}

// ---------- Pomocnicze fabryki slajdow ----------

function slideTitle(title: string, subtitle?: string): Slide {
  return { id: newId(), kind: 'title', title, subtitle };
}

function slideText(title: string, body: string, art?: SlideArt): Slide {
  return { id: newId(), kind: 'text', title, body, art };
}

function slideTask(
  code: string,
  title: string,
  body: string,
  exerciseNo?: number,
  timerSec?: number,
): Slide {
  return {
    id: newId(),
    kind: 'task',
    code,
    title,
    body,
    exerciseNo: exerciseNo ? String(exerciseNo) : undefined,
    timerSec,
  };
}

function slideRecap(questionSetId: string): Slide {
  return { id: newId(), kind: 'recap', questionSetId };
}

function slideNote(title: string, body: string): Slide {
  return { id: newId(), kind: 'note', title, body };
}
