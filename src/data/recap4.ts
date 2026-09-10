// Gotowa powtorka materialu klasy 4 - jezyk polski, na start klasy 5.
// Siedem lekcji (modul = 1-2 godziny lekcyjne): odmienne czesci mowy, zdanie i wyrazy
// nieodmienne, srodki poetyckie i formy wypowiedzi, slownictwo i frazeologia,
// ortografia z wielka litera i skrotami, swiat przedstawiony z gatunkami i tekstami
// kultury, zapis rozmowy z wiadomoscia i e-mailem - kazda z wlasnym zestawem pytan
// do kola fortuny.
// Rytm slajdow taki sam jak w powtorce klas 1-3 (recap13.ts): krotka regula (text)
// -> zadanie do zeszytu ze stoperem (task; po nim UI losuje kolem osobe, ktora
// pokazuje rozwiazanie) -> kolejna regula... -> slajd "Zapamiętaj" -> notatka.
// Zestaw pytan lekcji NIE jest odpytywany na jej koncu - sluzy wylacznie kolu
// powtorzeniowemu na poczatku NASTEPNEJ lekcji (slajd recap, mode 'powtorzeniowe').
// Dlatego zestaw ma tyle pytan, ile lekcja ma zadan (3-5): pytanie i. sprawdza te
// sama umiejetnosc co zadanie Zi, ale na innym materiale i do odpowiedzi ustnej.
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
  classIds: string[],
  seeds: QuestionSeed[],
): { set: QuestionSet; questions: Question[] } {
  const setId = newId();
  const set: QuestionSet = {
    id: setId,
    name,
    topic,
    classIds,
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

/** Nazwa dzialu do naglowka na liscie lekcji - wszystkie lekcje tej powtorki naleza razem. */
const DZIAL = 'Powtórka klasy 4';

/**
 * Tworzy 7 lekcji + 7 zestawow pytan powtorki materialu klasy 4 dla wskazanego rocznika.
 * Kazda lekcja: tytul -> temat -> (od lekcji 2) kolo powtorzeniowe na zestawie poprzedniej
 * lekcji -> regula -> zadanie (+ kolo na lekcji w UI) -> ... -> Zapamiętaj -> notatka.
 * Zestaw lekcji ma dokladnie tyle pytan, ile lekcja ma slajdow task.
 */
export function buildRecap4(grade: string, classIds: string[]): SeedBundleResult {
  // ---------- Zestawy pytan ----------
  const set1 = buildQuestionSet(
    'Powtórka klasy 4: odmienne części mowy',
    'Odmienne części mowy',
    classIds,
    // 4 pytania = 4 zadania lekcji 1 (Z1 odmiana przez przypadki, Z2 forma czasownika, Z3 stopniowanie, Z4 liczebniki).
    [
      { text: 'Odmień przez trzy pierwsze przypadki rzeczownik "pies".', answer: 'M. pies, D. psa, C. psu' },
      { text: 'W jakiej osobie, liczbie i czasie jest forma "piszecie"?', answer: '2. osoba liczby mnogiej, czas teraźniejszy' },
      { text: 'Stopniuj przymiotnik "dobry". Jakie to stopniowanie?', answer: 'dobry - lepszy - najlepszy; stopniowanie nieregularne' },
      { text: 'Jaki to liczebnik: "dziesiąty", a jaki "dziesięć"? Na jakie pytania odpowiadają?', answer: 'dziesiąty - porządkowy (który z kolei?), dziesięć - główny (ile?)' },
    ],
  );

  const set2 = buildQuestionSet(
    'Powtórka klasy 4: zdanie i wyrazy nieodmienne',
    'Składnia i wyrazy nieodmienne',
    classIds,
    // 4 pytania = 4 zadania lekcji 2 (Z1 podmiot i orzeczenie, Z2 rodzaj wypowiedzenia, Z3 wyrazy nieodmienne, Z4 pisownia "nie").
    [
      { text: 'Wskaż podmiot i orzeczenie w zdaniu: "Mały kotek pije mleko z miski."', answer: 'podmiot: kotek, orzeczenie: pije' },
      { text: 'Jakie to wypowiedzenie: "Uwaga, stopień!", a jakie: "Dzieci biegają, a pies szczeka"?', answer: 'pierwsze - równoważnik zdania (bez orzeczenia), drugie - zdanie złożone (dwa orzeczenia: biegają, szczeka)' },
      { text: 'Znajdź przysłówek, przyimek i spójnik w zdaniu: "Dzisiaj siedziałem pod drzewem i czytałem."', answer: 'przysłówek: dzisiaj, przyimek: pod, spójnik: i' },
      { text: 'Jak zapiszesz "nie" z wyrazami: lubię, porządek, miły? Dlaczego?', answer: 'nie lubię (osobno - czasownik), nieporządek (razem - rzeczownik), niemiły (razem - przymiotnik)' },
    ],
  );

  const set3 = buildQuestionSet(
    'Powtórka klasy 4: środki poetyckie i formy wypowiedzi',
    'Środki poetyckie i formy wypowiedzi',
    classIds,
    // 4 pytania = 4 zadania lekcji 3 (Z1 srodki poetyckie, Z2 budowa wiersza, Z3 list, Z4 ogloszenie).
    [
      { text: 'Jaki to środek poetycki: "cichy wieczór", "zimny jak lód", "kap, kap"?', answer: 'epitet, porównanie, wyraz dźwiękonaśladowczy' },
      { text: 'Jak nazywa się jedna linijka wiersza, a jak zwrotka? Co to jest rym?', answer: 'linijka to wers, zwrotka to strofa; rym to podobne zakończenie wersów, np. kot - płot' },
      { text: 'Wymień cztery elementy listu.', answer: 'miejscowość i data, nagłówek, treść, zwrot pożegnalny i podpis' },
      { text: 'Na jakie trzy pytania musi odpowiadać ogłoszenie?', answer: 'czego dotyczy, kiedy i gdzie, kto je zamieszcza (kontakt)' },
    ],
  );

  const set4 = buildQuestionSet(
    'Powtórka klasy 4: słownictwo i frazeologia',
    'Słownictwo',
    classIds,
    // 3 pytania = 3 zadania lekcji 4 (Z1 rdzen, Z2 wyraz wieloznaczny, Z3 frazeologizmy).
    [
      { text: 'Jaki rdzeń mają wyrazy: woda, wodny, podwodny? Dodaj jeden wyraz z tej rodziny.', answer: 'rdzeń wod-; np. wodnik, wodospad, wodować' },
      { text: 'Podaj dwa różne znaczenia wyrazu "pilot".', answer: 'np. pilot samolotu i pilot do telewizora (także pilot wycieczki)' },
      { text: 'Co znaczy "mieć muchy w nosie"?', answer: 'być obrażonym, w złym humorze' },
    ],
  );

  const set5 = buildQuestionSet(
    'Powtórka klasy 4: ortografia, wielka litera i skróty',
    'Ortografia i interpunkcja',
    classIds,
    // 3 pytania = 3 zadania lekcji 5 (Z1 uzasadnienie pisowni, Z2 wielka litera, Z3 znaki interpunkcyjne).
    [
      { text: 'Dlaczego w wyrazie "lód" piszemy ó, a w "morze" rz? Podaj wymiany.', answer: 'lód - lody (ó wymienia się na o), morze - morski (rz wymienia się na r)' },
      { text: 'Które z tych wyrazów napiszesz wielką literą: wisła, wtorek, wielkanoc, maj, warszawa?', answer: 'Wisła, Wielkanoc, Warszawa (nazwy własne i święto); wtorek i maj małą literą' },
      { text: 'Jakie znaki wstawisz: "Czy lubisz lody" oraz "Zabrałem trzy rzeczy zeszyt długopis i linijkę"?', answer: 'pytajnik na końcu pytania; dwukropek przed wyliczeniem i przecinek: "Zabrałem trzy rzeczy: zeszyt, długopis i linijkę."' },
    ],
  );

  const set6 = buildQuestionSet(
    'Powtórka klasy 4: świat przedstawiony, gatunki, teatr i film',
    'Odbiór tekstów kultury',
    classIds,
    // 3 pytania = 3 zadania lekcji 6 (Z1 swiat przedstawiony, Z2 realizm i fantastyka, Z3 komiks).
    [
      { text: 'Wymień cztery elementy świata przedstawionego i pytania, na które odpowiadają.', answer: 'czas (kiedy?), miejsce (gdzie?), bohaterowie (kto?), wydarzenia (co się dzieje?)' },
      { text: 'Co jest realistyczne, a co fantastyczne: "chłopiec gubi klucze", "czarownica leci na miotle"? Po czym poznajesz?', answer: 'pierwsze realistyczne - mogłoby zdarzyć się naprawdę; drugie fantastyczne - magia, nie zdarzy się naprawdę' },
      { text: 'Jak zbudowany jest komiks? Gdzie zapisuje się słowa postaci?', answer: 'to opowieść w obrazkach ułożonych w kadry; słowa postaci są w dymkach' },
    ],
  );


  // Zestaw lekcji 7 - ostatniej, wiec jej kolo krecimy recznie ("Koło powt.").
  const set7 = buildQuestionSet(
    'Powtórka klasy 4: dialog, wiadomość i e-mail',
    'Zapis rozmowy i pisanie na ekranie',
    classIds,
    [
      {
        text: 'Jak zapisujemy słowa narratora po wypowiedzi bohatera: "- Idę - ... powiedział Kuba"?',
        answer: 'po myślniku, małą literą: - Idę - powiedział Kuba.',
      },
      {
        text: 'Piszesz wiadomość do trenera. Jak zapiszesz wyraz "pana" w zwrocie "prośba do pana"?',
        answer: 'wielką literą - Pana; zwroty do adresata piszemy wielką literą z szacunku',
      },
      {
        text: 'Do czego służy pole "Temat" w e-mailu i co się dzieje, gdy zostanie puste?',
        answer:
          'mówi jednym zdaniem, o co chodzi; pusty temat wygląda na spam i wiadomość łatwo ginie',
      },
      {
        text: 'Wymień dwie rzeczy, które pasują do wiadomości do kolegi, a nie pasują do wiadomości do nauczyciela.',
        answer: 'np. skróty (nara, cze, thx), emotki, brak powitania i podpisu, zdania bez znaków',
      },
    ],
  );

  // ---------- Lekcje ----------
  const lesson1: Omit<Lesson, 'id' | 'order'> = {
    grade,
    title: 'Powtórka klasy 4: Odmienne części mowy',
    topic: 'Odmienne części mowy',
    progress: {},
    dzial: DZIAL,
    questionSetId: set1.set.id,
    reviewQuestionSetId: set1.set.id,
    registerTopic: 'Powtórzenie wiadomości z klasy 4: odmienne części mowy i ich formy',
    curriculum: ['II.1.1', 'II.1.2', 'II.1.4', 'II.1.6', 'II.1.7'],
    slides: [
      slideTitle('Powtórka klasy 4', 'Odmienne części mowy - część 1/7'),
      slideTopic('Odmienne części mowy'),
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
      slideText('Zapamiętaj', `- odmienne: **rzeczownik, czasownik, przymiotnik, liczebnik**
- rzeczownik odmienia się przez **7 przypadków**, liczby i rodzaje
- czasownik ma **osobę, liczbę i czas**, a bez nich jest **bezokolicznikiem**
- przymiotnik stopniujemy: **równy - wyższy - najwyższy**`),
      slideNote(
        'Notatka do zeszytu',
        `- Odmienne: rzeczownik, czasownik, przymiotnik, liczebnik, zaimek.
- Rzeczownik: 7 przypadków, liczby, rodzaje.
- Czasownik: osoba, liczba, czas. Bezokolicznik - bez nich.
- Stopniowanie: miły - milszy - najmilszy. Liczebnik: główny (ile?), porządkowy (który?).`,
      ),
    ],
  };

  const lesson2: Omit<Lesson, 'id' | 'order'> = {
    grade,
    title: 'Powtórka klasy 4: Zdanie i wyrazy nieodmienne',
    topic: 'Składnia i wyrazy nieodmienne',
    progress: {},
    dzial: DZIAL,
    questionSetId: set2.set.id,
    reviewQuestionSetId: set2.set.id,
    registerTopic: 'Powtórzenie wiadomości z klasy 4: budowa zdania, wyrazy nieodmienne, pisownia "nie"',
    curriculum: ['II.1.8', 'II.1.12', 'II.1.2', 'II.4.1', 'II.4.2'],
    slides: [
      slideTitle('Powtórka klasy 4', 'Zdanie i wyrazy nieodmienne - część 2/7'),
      slideTopic('Zdanie i wyrazy nieodmienne'),
      // Kolo na start: wracamy do tematu z lekcji 1 (odmienne czesci mowy) zestawem tamtej lekcji.
      slideRecap(set1.set.id),
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
      slideText('Zapamiętaj', `- **orzeczenie** - co robi (czasownik), **podmiot** - kto? co?
- zdanie **złożone** ma co najmniej **dwa orzeczenia**
- **równoważnik** nie ma orzeczenia
- **nie** z czasownikiem **osobno**, z rzeczownikiem i przymiotnikiem **razem**`),
      slideNote(
        'Notatka do zeszytu',
        `- Orzeczenie - co robi. Podmiot - kto? co?
- Pojedyncze - jedno orzeczenie, złożone - co najmniej dwa. Równoważnik - bez orzeczenia.
- Nieodmienne: przysłówek, przyimek, spójnik.
- Nie + czasownik osobno, nie + rzeczownik/przymiotnik razem.`,
      ),
    ],
  };

  const lesson3: Omit<Lesson, 'id' | 'order'> = {
    grade,
    title: 'Powtórka klasy 4: Środki poetyckie i formy wypowiedzi',
    topic: 'Środki poetyckie i formy wypowiedzi',
    progress: {},
    dzial: DZIAL,
    questionSetId: set3.set.id,
    reviewQuestionSetId: set3.set.id,
    registerTopic: 'Powtórzenie wiadomości z klasy 4: środki poetyckie, budowa wiersza, formy wypowiedzi',
    curriculum: ['I.1.4', 'I.1.6', 'I.1.9', 'I.1.10', 'III.2.1'],
    slides: [
      slideTitle('Powtórka klasy 4', 'Środki poetyckie i formy wypowiedzi - część 3/7'),
      slideTopic('Środki poetyckie'),
      // Kolo na start: wracamy do tematu z lekcji 2 (zdanie, wyrazy nieodmienne) zestawem tamtej lekcji.
      slideRecap(set2.set.id),
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
      slideText('Zapamiętaj', `- **epitet** określa, **porównanie** ma "jak", **przenośnia** mówi nie wprost
- **wers** to linijka, **strofa** to zwrotka
- w wierszu mówi **podmiot liryczny**, w opowiadaniu **narrator**
- list: data, nagłówek, treść, podpis`),
      slideNote(
        'Notatka do zeszytu',
        `- Epitet określa (zielona łąka), porównanie ma jak/niby.
- Przenośnia - nie wprost. Wers - linijka, strofa - zwrotka.
- Wiersz: podmiot liryczny. Opowiadanie: narrator.
- List: data, nagłówek, treść, podpis.`,
      ),
    ],
  };

  const lesson4: Omit<Lesson, 'id' | 'order'> = {
    grade,
    title: 'Powtórka klasy 4: Słownictwo i frazeologia',
    topic: 'Słownictwo',
    progress: {},
    dzial: DZIAL,
    questionSetId: set4.set.id,
    reviewQuestionSetId: set4.set.id,
    registerTopic: 'Powtórzenie wiadomości z klasy 4: rodzina wyrazów, synonimy i antonimy, wyrazy wieloznaczne, związki frazeologiczne',
    curriculum: ['II.2.4', 'II.2.5', 'II.2.8', 'I.1.4', 'IV.5'],
    slides: [
      slideTitle('Powtórka klasy 4', 'Słownictwo i frazeologia - część 4/7'),
      slideTopic('Słownictwo i frazeologia'),
      // Kolo na start: wracamy do tematu z lekcji 3 (srodki poetyckie, formy wypowiedzi) zestawem tamtej lekcji.
      slideRecap(set3.set.id),
      slideText('Co dziś powtarzamy', `- Rodzina wyrazów i rdzeń
- Synonimy i antonimy
- Wyrazy wieloznaczne
- Zdrobnienia i zgrubienia
- Związki frazeologiczne`),
      slideText('Rodzina wyrazów', `**Rodzina wyrazów** to wyrazy o wspólnym znaczeniu i wspólnej cząstce.

Ta wspólna cząstka to **rdzeń**: **dom**ek, **dom**owy, **dom**ownik, bez**dom**ny.

Wyraz, od którego powstały pozostałe, to **wyraz podstawowy** (dom). Reszta to **wyrazy pochodne**.`, 'rodzinaWyrazow'),
      slideTask('Z1', 'Znajdź rdzeń', `Zapisz w zeszycie rdzeń każdej rodziny i dopisz do niej **dwa** własne wyrazy:

1. pisać, pisarz, napis, pisemny
2. las, leśny, leśniczy
3. szkoła, szkolny, przedszkole

Rdzeń podkreśl w każdym wyrazie.`, undefined, 240),
      slideText('Synonimy i antonimy', `**Synonimy** (wyrazy bliskoznaczne) znaczą prawie to samo: mądry - bystry - rozumny.

Używamy ich, żeby **nie powtarzać** tego samego słowa w wypracowaniu.

**Antonimy** znaczą odwrotnie: odważny - tchórzliwy, jasny - ciemny.`, 'bliskoznaczne'),
      slideText('Wyrazy wieloznaczne', `Jeden wyraz, kilka **różnych** znaczeń.

**zamek**: budowla, zamek w kurtce, zamek w drzwiach

**klucz**: do drzwi, klucz żurawi, klucz wiolinowy

O znaczeniu decyduje **całe zdanie**, a nie sam wyraz.`, 'wieloznaczne'),
      slideTask('Z2', 'Dwa znaczenia', `Ułóż w zeszycie po **dwa zdania** z każdym wyrazem - w każdym zdaniu w innym znaczeniu:

1. zamek
2. języki
3. korek
4. bal

Podkreśl fragment zdania, po którym wiadomo, o które znaczenie chodzi.`, undefined, 300),
      slideText('Zdrobnienia i zgrubienia', `**Zdrobnienie** - forma mniejsza i czulsza: dom - **domek**, kot - **kotek**.

**Zgrubienie** - forma większa i często niemiła: dom - **domisko**, pies - **psisko**.

Autor wybiera je świadomie: zdrobnieniem pokazuje sympatię, zgrubieniem - niechęć.`, 'zdrobnienieZgrubienie'),
      slideText('Związki frazeologiczne', `**Związek frazeologiczny** to stałe połączenie wyrazów o znaczeniu **przenośnym**.

Nie tłumaczy się go dosłownie: "wziąć nogi za pas" nie znaczy, że ktoś wkłada nogi do paska.

Frazeologizmów szukamy w **słowniku frazeologicznym**.`, 'frazeologizm'),
      slideTask('Z3', 'Wyjaśnij frazeologizmy', `Zapisz w zeszycie, co znaczy każdy zwrot, a potem ułóż z jednym z nich zdanie:

1. mieć węża w kieszeni
2. rzucać słowa na wiatr
3. musztarda po obiedzie
4. złapać byka za rogi

Pracujcie w parach - potem sprawdzimy na głos.`, undefined, 300),
      slideText('Zapamiętaj', `- **rodzina wyrazów** ma wspólny **rdzeń**
- **synonim** znaczy prawie to samo, **antonim** odwrotnie
- **wyraz wieloznaczny** ma kilka znaczeń - decyduje zdanie
- **frazeologizm** rozumiemy **przenośnie**, nie dosłownie`),
      slideNote(
        'Notatka do zeszytu',
        `- Rodzina wyrazów - wspólny rdzeń: dom, domek, domowy.
- Synonim - prawie to samo, antonim - odwrotnie.
- Wieloznaczny - kilka znaczeń (zamek), decyduje zdanie.
- Frazeologizm - znaczenie przenośne: nogi za pas = uciec.`,
      ),
    ],
  };

  const lesson5: Omit<Lesson, 'id' | 'order'> = {
    grade,
    title: 'Powtórka klasy 4: Ortografia, wielka litera i skróty',
    topic: 'Ortografia i interpunkcja',
    progress: {},
    dzial: DZIAL,
    questionSetId: set5.set.id,
    reviewQuestionSetId: set5.set.id,
    registerTopic: 'Powtórzenie wiadomości z klasy 4: pisownia ó-u, rz-ż, ch-h, wielka litera w nazwach własnych, skróty',
    curriculum: ['II.4.1', 'II.4.2', 'IV.5'],
    slides: [
      slideTitle('Powtórka klasy 4', 'Ortografia, wielka litera i skróty - część 5/7'),
      slideTopic('Ortografia i wielka litera'),
      // Kolo na start: wracamy do tematu z lekcji 4 (slownictwo i frazeologia) zestawem tamtej lekcji.
      slideRecap(set4.set.id),
      slideText('Co dziś powtarzamy', `- Ó i u, rz i ż, ch i h: wymiany oraz reguły
- Wielka litera w nazwach własnych
- Skróty i kropka w skrócie
- Dwukropek i dialog`),
      slideText('Ó, rz, ch - wymiany', `**Ó** wymienia się na **o, e, a**: stół - stoły, siódmy - siedem, skrócić - skracać.

**Rz** wymienia się na **r**: morze - morski. **Ż** na **g** lub **z**: może - mogę, wożę - wozy.

**Ch** wymienia się na **sz**: mucha - muszka.`, 'wymianaOu'),
      slideText('Ó, rz, ch - reguły bez wymiany', `**Rz** piszemy po literach **b, p, d, t, g, k, ch, j, w**: brzeg, przerwa, drzewo, krzak.

**Ch** piszemy zawsze na **końcu wyrazu**: dach, groch (wyjątek: druh).

Reszty trzeba się **nauczyć na pamięć**: ogórek, wróbel, chór, hałas, herbata.`),
      slideTask('Z1', 'Uzasadnij pisownię', `Przepisz do zeszytu i przy każdym wyrazie dopisz **uzasadnienie** (wymiana albo reguła):

1. mr__z
2. b__zeg
3. da__ (ch/h)
4. w__z (wóz/wuz)
5. p__yjaciel (rz/ż)
6. mu__ka (sz od mucha)

Wzór: **mróz - ó, bo mrozy**.`, undefined, 300),
      slideText('Wielka litera', `Wielką literą piszemy **nazwy własne**: Burek, Kraków, Wisła, Polska.

Także: **nazwy świąt** (Boże Narodzenie, Wielkanoc), **tytuły** ("Akademia pana Kleksa"), **nazwy ulic** (ulica Długa).

Małą literą: **dni tygodnia i miesiące** (poniedziałek, marzec) oraz nazwy pospolite (pies, rzeka, miasto).`, 'nazwyWlasne'),
      slideTask('Z2', 'Popraw wielkie litery', `Przepisz zdania do zeszytu, poprawiając wielkie litery:

1. w grudniu obchodzimy boże narodzenie.
2. mieszkam w gdańsku przy ulicy słonecznej.
3. w poniedziałek czytamy "akademię pana kleksa".
4. moja koleżanka ania ma psa burka.

Przy każdej poprawce powiedz, dlaczego.`, undefined, 270),
      slideText('Skróty', `Skrót zwykle kończy się **kropką**: np., itd., itp., ul., godz., s., r.

**Bez kropki** piszemy skrót zakończony **ostatnią literą** całego wyrazu: **dr** (dokto**r**), **mgr** (magiste**r**).

Zasada: skrót urwany w środku wyrazu - z kropką; skrót sięgający ostatniej litery - bez kropki.`, 'skroty'),
      slideText('Dwukropek i dialog', `**Dwukropek** zapowiada wyliczenie albo czyjeś słowa:

"Do plecaka zapakowałem: zeszyt, długopis i linijkę."

**Dialog**: każda wypowiedź od nowej linii, na początku **myślnik**.`, 'dialog'),
      slideTask('Z3', 'Wstaw znaki', `Przepisz do zeszytu, wstawiając brakujące znaki:

1. Kupiliśmy trzy rzeczy chleb masło i ser
2. Ale ładnie dziś świeci słońce
3. Czy zdążymy na autobus
4. Wiem że dasz radę

Przy każdym powiedz, jaki to znak i dlaczego.`, undefined, 240),
      slideText('Zapamiętaj', `- **ó** wymienia się na o/e/a, **rz** na r, **ż** na g/z, **ch** na sz
- **rz** po b, p, d, t, g, k, ch, j, w; **ch** na końcu wyrazu
- **nazwy własne i święta** wielką literą, **dni i miesiące** małą
- skrót obciętego wyrazu ma **kropkę**`),
      slideNote(
        'Notatka do zeszytu',
        `- Ó - wymiana na o/e/a. Rz - na r. Ż - na g/z. Ch - na sz.
- Rz po: b, p, d, t, g, k, ch, j, w. Ch na końcu wyrazu.
- Wielka litera: nazwy własne, święta, tytuły. Mała: dni, miesiące.
- Kropka w skrócie urwanym (np., itd.), skrót dr - bez kropki.`,
      ),
    ],
  };

  const lesson6: Omit<Lesson, 'id' | 'order'> = {
    grade,
    title: 'Powtórka klasy 4: Świat przedstawiony, gatunki, teatr i film',
    topic: 'Odbiór tekstów kultury',
    progress: {},
    dzial: DZIAL,
    questionSetId: set6.set.id,
    reviewQuestionSetId: set6.set.id,
    registerTopic: 'Powtórzenie wiadomości z klasy 4: świat przedstawiony, baśń, legenda, mit, bajka, komiks, teatr i film',
    curriculum: ['I.1.1', 'I.1.2', 'I.1.3', '2.7', '2.8', '2.9', '2.10'],
    slides: [
      slideTitle('Powtórka klasy 4', 'Świat przedstawiony, gatunki, teatr i film - część 6/7'),
      slideTopic('Świat przedstawiony'),
      // Kolo na start: wracamy do tematu z lekcji 5 (ortografia, wielka litera, skroty) zestawem tamtej lekcji.
      slideRecap(set5.set.id),
      slideText('Co dziś powtarzamy', `- Świat przedstawiony utworu
- Fikcja, elementy realistyczne i fantastyczne
- Baśń, legenda, mit, bajka, komiks
- Teatr, film i adaptacja`),
      slideText('Świat przedstawiony', `Każdy utwór ma swój **świat przedstawiony** - cztery elementy, o które zawsze pytamy.

**Czas** (kiedy?), **miejsce** (gdzie?), **bohaterowie** (kto?), **wydarzenia** (co się dzieje?).

To pierwsze, co ustalasz po przeczytaniu tekstu.`, 'swiatPrzedstawiony'),
      slideTask('Z1', 'Opisz świat przedstawiony', `Wybierz ostatnią przeczytaną lekturę albo tekst z podręcznika i zapisz w zeszycie cztery punkty:

1. **czas** - kiedy dzieje się akcja
2. **miejsce** - gdzie
3. **bohaterowie** - główni i drugoplanowi
4. **wydarzenia** - trzy najważniejsze, po kolei`, undefined, 300),
      slideText('Fikcja, realizm i fantastyka', `**Fikcja literacka** - świat wymyślony przez autora, choć może przypominać prawdziwy.

**Elementy realistyczne** mogłyby zdarzyć się naprawdę: szkoła, rower, kłótnia z bratem.

**Elementy fantastyczne** nie mogłyby: latający dywan, gadające zwierzęta, magia.`),
      slideTask('Z2', 'Realistyczne czy fantastyczne', `Zapisz w zeszycie: **R** - realistyczne, **F** - fantastyczne.

1. chłopiec spóźnia się do szkoły
2. kot rozmawia z myszą
3. dziewczynka przenosi się w czasie
4. rodzina jedzie na wakacje
5. drzewo podaje bohaterowi rękę

Przy dwóch wybranych napisz, po czym poznajesz.`, undefined, 210),
      slideText('Gatunki', `Cztery gatunki, które trzeba umieć rozpoznać:

**Baśń** - magia i zmyślony świat. **Legenda** - tłumaczy prawdziwe miejsce.

**Mit** - wyjaśnia świat, występują bogowie. **Bajka** - zwierzęta i **morał** na końcu.`, 'gatunki'),
      slideText('Komiks', `**Komiks** opowiada historię **obrazkami** ułożonymi w kadry.

Tekst jest w **dymkach** (co postać mówi lub myśli) i w podpisach pod kadrem.

Dźwięki zapisuje się wyrazami dźwiękonaśladowczymi: **bam!**, **wrrr**, **plum**.`),
      slideTask('Z3', 'Zamień baśń w komiks', `Wybierz krótką baśń, którą znasz. Narysuj w zeszycie **4 kadry** komiksu.

W każdym kadrze: prosty rysunek i **dymek** z wypowiedzią bohatera.

Nie musi być ładnie - ma być czytelnie i po kolei.`, undefined, 420),
      slideText('Teatr, film i adaptacja', `W **teatrze** aktorzy grają **na żywo** na scenie: scenografia, kostiumy, widownia.

W **filmie** wszystko jest nagrane: kamera, plan filmowy, montaż, muzyka.

**Adaptacja** to książka przerobiona na film albo spektakl.`, 'teatrFilm'),
      slideText('Zapamiętaj', `- świat przedstawiony: **czas, miejsce, bohaterowie, wydarzenia**
- **fantastyczne** nie mogłoby zdarzyć się naprawdę
- **baśń** - magia, **legenda** - prawdziwe miejsce, **mit** - bogowie, **bajka** - morał
- **adaptacja** - książka przerobiona na film albo spektakl`),
      slideNote(
        'Notatka do zeszytu',
        `- Świat przedstawiony: czas, miejsce, bohaterowie, wydarzenia.
- Baśń - magia. Legenda - prawdziwe miejsce. Mit - bogowie. Bajka - morał.
- Komiks: obrazki w kadrach, tekst w dymkach.
- Teatr - na żywo, film - nagrany. Adaptacja - przeróbka na film.`,
      ),
    ],
  };

  const lesson7: Omit<Lesson, 'id' | 'order'> = {
    grade,
    title: 'Powtórka klasy 4: Dialog, wiadomość i e-mail',
    topic: 'Dialog, wiadomość i e-mail',
    progress: {},
    dzial: DZIAL,
    questionSetId: set7.set.id,
    reviewQuestionSetId: set7.set.id,
    registerTopic:
      'Powtórzenie wiadomości z klasy 4: zapis dialogu ze słowami narratora, wiadomość oficjalna i nieoficjalna, e-mail',
    curriculum: ['III.2.1', 'III.2.5', 'IV.2', 'II.4.1'],
    slides: [
      slideTitle('Powtórka klasy 4', 'Dialog, wiadomość i e-mail - część 7/7'),
      slideTopic('Dialog, wiadomość i e-mail'),
      // Kolo na start: zestaw lekcji 6 (swiat przedstawiony, gatunki, teatr i film).
      slideRecap(set6.set.id),
      slideText('Co dziś powtarzamy', `- Dialog w opowiadaniu i słowa narratora
- Wiadomość oficjalna i nieoficjalna
- E-mail: temat, zwrot do adresata, podpis
- Znak na końcu zdania kontra emotka`),
      slideText('Rozmowa na ekranie i w opowiadaniu', `Na czacie widać, kto mówi, bo każdy ma swoją stronę ekranu i swój dymek.

W opowiadaniu dymków nie ma - pracę dymka wykonuje **układ tekstu**: każda wypowiedź od nowej linii, na początku **myślnik**.

Dlatego rozmowy z komunikatora nie da się wkleić do wypracowania - trzeba ją **przepisać** jak dialog.`, 'czat'),
      slideText('Słowa narratora przy wypowiedzi', `Po wypowiedzi bohatera narrator często dopowiada, kto i jak mówił. Wtedy stawiamy **drugi myślnik**, a słowa narratora piszemy **małą literą**:

- Zaraz przyjdę - powiedział Kuba.

Czasownik mówienia można wybrać dokładniej niż „powiedział": szepnął, krzyknął, mruknął, zapytał.`, 'dialog'),
      slideTask('Z1', 'Zamień czat na dialog', `Przepisz tę rozmowę do zeszytu jako dialog w opowiadaniu: nowa linia, myślnik, znak na końcu. Do każdej wypowiedzi dopisz słowa narratora po drugim myślniku, za każdym razem z **innym** czasownikiem mówienia.

Ola: masz zadanie z polskiego
Kuba: mam ale zostawiłem zeszyt w szkole
Ola: to co teraz zrobisz
Kuba: poproszę wychowawczynię o kartkę`, undefined, 300, 'dialog'),
      slideText('Oficjalnie czy nieoficjalnie', `Do kolegi piszesz **nieoficjalnie**: krótko, ze skrótami i emotkami.

Do nauczyciela, trenera czy urzędu piszesz **oficjalnie**: pełnymi zdaniami, z powitaniem, prośbą, podziękowaniem i podpisem.

W wiadomości oficjalnej zwroty do adresata piszemy **wielką literą**: Pan, Pani, Ciebie, Wam. Wielkie litery w całym wyrazie znaczą w internecie **krzyk**.`, 'wiadomosc'),
      slideTask('Z2', 'Przepisz na wiadomość oficjalną', `Uczeń wysłał do nauczycielki: „ZAPOMNIALEM ZESZYTU CO TERAZ??? nara"

Napisz tę wiadomość w zeszycie jeszcze raz, oficjalnie. Muszą się w niej znaleźć: powitanie, prośba pełnym zdaniem, podziękowanie i podpis. Zwroty do adresatki zapisz wielką literą i podkreśl je.`, undefined, 300, 'wiadomosc'),
      slideText('E-mail to list na ekranie', `E-mail ma te same części co list, tylko w polach formularza:

- **Do** - adres odbiorcy, sprawdzany przed wysłaniem
- **Temat** - jedno zdanie, o co chodzi; nigdy nie zostaje pusty
- treść ze zwrotem grzecznościowym i podpisem imieniem oraz klasą
- **załącznik**, gdy coś przesyłasz

Adres nadawcy nic nie mówi odbiorcy, dlatego podpis jest obowiązkowy.`, 'email'),
      slideTask('Z3', 'Napisz e-mail', `Napisz w zeszycie e-mail do nauczycielki z prośbą o zgodę na oddanie opowiadania dzień później.

Zapisz go tak jak na ekranie: najpierw linijka **Temat:**, potem treść. W treści: zwrot do adresatki, prośba z uzasadnieniem, podziękowanie i podpis imieniem oraz klasą.`, undefined, 360, 'email'),
      slideText('Znak na końcu zdania', `Emotka dokłada nastrój, ale **nie zastępuje** kropki, pytajnika ani wykrzyknika.

To znak na końcu mówi odbiorcy, po co piszesz: pytam, informuję czy proszę stanowczo.

Wiadomość bez znaków i wielkich liter czyta się wolniej, a w sprawie oficjalnej wygląda na niedbalą.`, 'znakiInterpunkcyjne'),
      slideTask('Z4', 'Wstaw znaki i nazwij zdania', `Przepisz wiadomości do zeszytu: wielka litera na początku, właściwy znak na końcu. Obok każdej dopisz, czy to zdanie **oznajmujące**, **pytające** czy **rozkazujące**.

1. kiedy oddajemy opowiadanie
2. wysłałam Pani zadanie mailem
3. proszę o odpowiedź do piątku
4. nie zapomnij o załączniku`, undefined, 240, 'przeksztalcanieZdan'),
      slideText('Zapamiętaj', `- dialog: **nowa linia + myślnik**, słowa narratora po drugim myślniku małą literą
- oficjalnie: powitanie, prośba, podziękowanie, podpis; **Pan, Pani, Ciebie** wielką literą
- e-mail: **temat** nigdy pusty, podpis imieniem i klasą`, 'email'),
      slideNote(
        'Notatka do zeszytu',
        `- Dialog: nowa linia i myślnik; słowa narratora po drugim myślniku małą literą.
- Wiadomość oficjalna: powitanie, prośba, podziękowanie, podpis.
- Zwroty do adresata wielką literą: Pan, Pani, Ciebie, Wam.
- E-mail: pole Temat nigdy nie zostaje puste, podpisuję się imieniem i klasą.`,
      ),
    ],
  };


  return {
    lessons: [lesson1, lesson2, lesson3, lesson4, lesson5, lesson6, lesson7],
    questionSets: [
      set1.set,
      set2.set,
      set3.set,
      set4.set,
      set5.set,
      set6.set,
      set7.set,
    ],
    questions: [
      ...set1.questions,
      ...set2.questions,
      ...set3.questions,
      ...set4.questions,
      ...set5.questions,
      ...set6.questions,
      ...set7.questions,
    ],
  };
}

// ---------- Pomocnicze fabryki slajdow ----------

function slideTitle(title: string, subtitle?: string): Slide {
  return { id: newId(), kind: 'title', title, subtitle };
}

/**
 * Slajd z tematem lekcji do zeszytu. `topic` to krotka, zeszytowa wersja
 * tematu (dzieci pisza wolno) - dluzszy `registerTopic` zostaje tylko w
 * dzienniku Vulcan. Stoper 180 s daje czas na przepisanie tematu i daty.
 */
function slideTopic(topic: string): Slide {
  return { id: newId(), kind: 'topic', topic };
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
  art?: SlideArt,
): Slide {
  return {
    id: newId(),
    kind: 'task',
    code,
    title,
    body,
    exerciseNo: exerciseNo ? String(exerciseNo) : undefined,
    timerSec,
    art,
  };
}

/** Kolo powtorzeniowe na poczatku lekcji - jedyny rodzaj slajdu recap w tej powtorce (zestaw poprzedniej lekcji). */
function slideRecap(questionSetId: string): Slide {
  return { id: newId(), kind: 'recap', questionSetId, mode: 'powtorzeniowe' };
}

function slideNote(title: string, body: string): Slide {
  return { id: newId(), kind: 'note', title, body };
}
