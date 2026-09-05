// Gotowa powtorka materialu klasy 4 - jezyk polski, na start klasy 5.
// Szesc lekcji (modul = 1-2 godziny lekcyjne): odmienne czesci mowy, zdanie i wyrazy
// nieodmienne, srodki poetyckie i formy wypowiedzi, slownictwo i frazeologia,
// ortografia z wielka litera i skrotami, swiat przedstawiony z gatunkami i tekstami
// kultury - kazda z wlasnym zestawem pytan do kola fortuny.
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

/** Tworzy 6 lekcji + 6 zestawow pytan powtorki materialu klasy 4 dla wskazanego rocznika. */
export function buildRecap4(grade: string, classIds: string[]): SeedBundleResult {
  // ---------- Zestawy pytan ----------
  const set1 = buildQuestionSet(
    'Powtórka klasy 4: odmienne części mowy',
    'Odmienne części mowy',
    classIds,
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
    classIds,
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
    classIds,
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

  const set4 = buildQuestionSet(
    'Powtórka klasy 4: słownictwo i frazeologia',
    'Słownictwo',
    classIds,
    [
      { text: 'Co to jest rodzina wyrazów?', answer: 'grupa wyrazów ze wspólną cząstką i wspólnym znaczeniem, np. dom, domek, domowy' },
      { text: 'Jak nazywa się wspólna cząstka wszystkich wyrazów z jednej rodziny?', answer: 'rdzeń (wspólna cząstka)' },
      { text: 'Podaj rdzeń wyrazów: pisać, pisarz, napis, pisemny.', answer: 'pis' },
      { text: 'Który wyraz jest podstawowy, a który pochodny: las - leśniczy?', answer: 'podstawowy: las, pochodny: leśniczy (powstał od lasu)' },
      { text: 'Co to jest wyraz wieloznaczny? Podaj przykład.', answer: 'wyraz o kilku różnych znaczeniach, np. zamek: budowla, w kurtce, w drzwiach' },
      { text: 'Podaj dwa znaczenia wyrazu "klucz".', answer: 'np. klucz do drzwi, klucz żurawi, klucz wiolinowy, klucz do zadania' },
      { text: 'Co to jest synonim? Podaj synonim słowa "mądry".', answer: 'wyraz bliskoznaczny; np. rozumny, bystry, inteligentny' },
      { text: 'Co to jest antonim? Podaj antonim słowa "odważny".', answer: 'wyraz o znaczeniu przeciwnym; tchórzliwy' },
      { text: 'Po co używamy synonimów w wypracowaniu?', answer: 'żeby nie powtarzać w kółko tego samego wyrazu' },
      { text: 'Co to jest zdrobnienie? Podaj zdrobnienie od "kot".', answer: 'forma mniejsza i czulsza; kotek, koteczek' },
      { text: 'Co to jest zgrubienie? Podaj zgrubienie od "pies".', answer: 'forma większa i niemiła; psisko' },
      { text: 'Co to jest związek frazeologiczny?', answer: 'stałe połączenie wyrazów o znaczeniu przenośnym, np. wziąć nogi za pas' },
      { text: 'Co znaczy "wziąć nogi za pas"?', answer: 'szybko uciec' },
      { text: 'Co znaczy "mieć muchy w nosie"?', answer: 'być obrażonym, w złym humorze' },
      { text: 'Co znaczy "biały kruk"?', answer: 'rzecz bardzo rzadka i cenna, np. stara książka' },
    ],
  );

  const set5 = buildQuestionSet(
    'Powtórka klasy 4: ortografia, wielka litera i skróty',
    'Ortografia i interpunkcja',
    classIds,
    [
      { text: 'Kiedy piszemy ó wymienne? Podaj przykład z wymianą.', answer: 'gdy wymienia się na o, e albo a: stół - stoły, siódmy - siedem, skrócić - skracać' },
      { text: 'Podaj trzy wyrazy, w których ó trzeba zapamiętać.', answer: 'np. ogórek, wróbel, król, córka, chór, mózg' },
      { text: 'Kiedy piszemy rz, a kiedy ż? Podaj wymianę dla obu.', answer: 'rz wymienia się na r (morze - morski), ż na g lub z (może - mogę, wożę - wozy)' },
      { text: 'Po jakich literach piszemy rz? Podaj dwa przykłady.', answer: 'po b, p, d, t, g, k, ch, j, w: brzeg, przerwa, drzewo, krzak' },
      { text: 'Kiedy piszemy ch? Podaj zasadę i przykład.', answer: 'gdy wymienia się na sz (mucha - muszka) i zawsze na końcu wyrazu (dach)' },
      { text: 'Popraw zapis: "Mieszkam w krakowie przy ulicy długiej."', answer: 'Mieszkam w Krakowie przy ulicy Długiej.' },
      { text: 'Czy nazwy świąt piszemy wielką literą? Podaj przykład.', answer: 'tak: Boże Narodzenie, Wielkanoc, Dzień Matki' },
      { text: 'Jak zapisujemy tytuł książki?', answer: 'wielką literą pierwszy wyraz i w cudzysłowie: "Akademia pana Kleksa"' },
      { text: 'Czy nazwy dni tygodnia i miesięcy piszemy wielką literą?', answer: 'nie, małą: poniedziałek, marzec' },
      { text: 'Czym różni się nazwa własna od pospolitej? Podaj parę przykładów.', answer: 'własna nazywa konkretną osobę lub miejsce (Burek, Wisła), pospolita całą grupę (pies, rzeka)' },
      { text: 'Co oznaczają skróty: np., itd., itp.?', answer: 'na przykład, i tak dalej, i tym podobne' },
      { text: 'Dlaczego skrót "dr" piszemy bez kropki?', answer: 'bo kończy się ostatnią literą całego wyrazu (doktor)' },
      { text: 'Jak zapisujemy wypowiedzi w dialogu?', answer: 'każdą od nowej linii, zaczynając od myślnika' },
      { text: 'Do czego służy dwukropek? Podaj przykład.', answer: 'zapowiada wyliczenie lub czyjeś słowa: "Kupiłem: chleb, masło i ser"' },
      { text: 'Popraw zapis: "Byłem u lekarza dr. kowalskiego."', answer: 'Byłem u lekarza dr. Kowalskiego - nazwisko wielką literą.' },
    ],
  );

  const set6 = buildQuestionSet(
    'Powtórka klasy 4: świat przedstawiony, gatunki, teatr i film',
    'Odbiór tekstów kultury',
    classIds,
    [
      { text: 'Wymień cztery elementy świata przedstawionego.', answer: 'czas, miejsce, bohaterowie, wydarzenia' },
      { text: 'Na jakie pytanie odpowiada "miejsce" w świecie przedstawionym?', answer: 'gdzie dzieje się akcja?' },
      { text: 'Co to jest fikcja literacka?', answer: 'świat wymyślony przez autora, choć może przypominać prawdziwy' },
      { text: 'Czym różnią się elementy realistyczne od fantastycznych?', answer: 'realistyczne mogłyby zdarzyć się naprawdę, fantastyczne nie (magia, smoki, latający dywan)' },
      { text: 'Po czym poznajesz baśń?', answer: 'po magii, zmyślonym świecie i zwrocie "dawno, dawno temu"' },
      { text: 'Czym różni się legenda od baśni?', answer: 'legenda tłumaczy pochodzenie prawdziwego miejsca lub wydarzenia' },
      { text: 'Co wyjaśnia mit? Podaj przykład.', answer: 'pochodzenie świata i zjawisk, opowiada o bogach; np. mit o Prometeuszu' },
      { text: 'Kto jest bohaterem bajki i co jest na jej końcu?', answer: 'zwierzęta zachowujące się jak ludzie; na końcu morał' },
      { text: 'Co to jest komiks?', answer: 'opowieść w kadrach, obrazkach, z tekstem w dymkach' },
      { text: 'Jak nazywa się tekst w komiksie zapisany w chmurce przy postaci?', answer: 'dymek' },
      { text: 'Wymień trzy elementy spektaklu teatralnego.', answer: 'np. scena, aktorzy, scenografia, kostiumy, reżyser, widownia' },
      { text: 'Wymień trzy elementy dzieła filmowego.', answer: 'np. kamera i zdjęcia, montaż, muzyka, reżyser, plan filmowy, aktorzy' },
      { text: 'Czym różni się teatr od filmu?', answer: 'w teatrze aktorzy grają na żywo na scenie, film jest nagrany i oglądamy go na ekranie' },
      { text: 'Co to jest adaptacja?', answer: 'przerobienie utworu literackiego na film albo spektakl' },
      { text: 'Kto kieruje pracą aktorów i w teatrze, i w filmie?', answer: 'reżyser' },
    ],
  );

  // ---------- Lekcje ----------
  const lesson1: Omit<Lesson, 'id' | 'order'> = {
    grade,
    title: 'Powtórka klasy 4: Odmienne części mowy',
    topic: 'Odmienne części mowy',
    progress: {},
    questionSetId: set1.set.id,
    registerTopic: 'Powtórzenie wiadomości z klasy 4: odmienne części mowy i ich formy',
    curriculum: ['II.1.1', 'II.1.2', 'II.1.4', 'II.1.6', 'II.1.7'],
    slides: [
      slideTitle('Powtórka klasy 4', 'Odmienne części mowy - część 1/6'),
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
    grade,
    title: 'Powtórka klasy 4: Zdanie i wyrazy nieodmienne',
    topic: 'Składnia i wyrazy nieodmienne',
    progress: {},
    questionSetId: set2.set.id,
    registerTopic: 'Powtórzenie wiadomości z klasy 4: budowa zdania, wyrazy nieodmienne, pisownia "nie"',
    curriculum: ['II.1.8', 'II.1.12', 'II.1.2', 'II.4.1', 'II.4.2'],
    slides: [
      slideTitle('Powtórka klasy 4', 'Zdanie i wyrazy nieodmienne - część 2/6'),
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
    grade,
    title: 'Powtórka klasy 4: Środki poetyckie i formy wypowiedzi',
    topic: 'Środki poetyckie i formy wypowiedzi',
    progress: {},
    questionSetId: set3.set.id,
    registerTopic: 'Powtórzenie wiadomości z klasy 4: środki poetyckie, budowa wiersza, formy wypowiedzi',
    curriculum: ['I.1.4', 'I.1.6', 'I.1.9', 'I.1.10', 'III.2.1'],
    slides: [
      slideTitle('Powtórka klasy 4', 'Środki poetyckie i formy wypowiedzi - część 3/6'),
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

  const lesson4: Omit<Lesson, 'id' | 'order'> = {
    grade,
    title: 'Powtórka klasy 4: Słownictwo i frazeologia',
    topic: 'Słownictwo',
    progress: {},
    questionSetId: set4.set.id,
    registerTopic: 'Powtórzenie wiadomości z klasy 4: rodzina wyrazów, synonimy i antonimy, wyrazy wieloznaczne, związki frazeologiczne',
    curriculum: ['II.2.4', 'II.2.5', 'II.2.8', 'I.1.4', 'IV.5'],
    slides: [
      slideTitle('Powtórka klasy 4', 'Słownictwo i frazeologia - część 4/6'),
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
      slideText('Zanim zakręcimy kołem', `Zapamiętaj:
- **rodzina wyrazów** ma wspólny **rdzeń**
- **synonim** znaczy prawie to samo, **antonim** odwrotnie
- **wyraz wieloznaczny** ma kilka znaczeń - decyduje zdanie
- **frazeologizm** rozumiemy **przenośnie**, nie dosłownie`),
      slideRecap(set4.set.id),
      slideNote(
        'Notatka do zeszytu',
        `**Temat: Słownictwo i frazeologia**

- Rodzina wyrazów ma wspólny rdzeń: dom, domek, domowy, bezdomny.
- Wyraz podstawowy to ten, od którego powstały pozostałe (wyrazy pochodne).
- Synonimy znaczą prawie to samo (mądry - bystry), antonimy odwrotnie (jasny - ciemny).
- Wyraz wieloznaczny ma kilka znaczeń, np. zamek, klucz - o znaczeniu decyduje zdanie.
- Zdrobnienie: domek. Zgrubienie: domisko.
- Związek frazeologiczny ma znaczenie przenośne, np. wziąć nogi za pas = szybko uciec.`,
      ),
    ],
  };

  const lesson5: Omit<Lesson, 'id' | 'order'> = {
    grade,
    title: 'Powtórka klasy 4: Ortografia, wielka litera i skróty',
    topic: 'Ortografia i interpunkcja',
    progress: {},
    questionSetId: set5.set.id,
    registerTopic: 'Powtórzenie wiadomości z klasy 4: pisownia ó-u, rz-ż, ch-h, wielka litera w nazwach własnych, skróty',
    curriculum: ['II.4.1', 'II.4.2', 'IV.5'],
    slides: [
      slideTitle('Powtórka klasy 4', 'Ortografia, wielka litera i skróty - część 5/6'),
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
      slideText('Zanim zakręcimy kołem', `Zapamiętaj:
- **ó** wymienia się na o/e/a, **rz** na r, **ż** na g/z, **ch** na sz
- **rz** po b, p, d, t, g, k, ch, j, w; **ch** na końcu wyrazu
- **nazwy własne i święta** wielką literą, **dni i miesiące** małą
- skrót obciętego wyrazu ma **kropkę**`),
      slideRecap(set5.set.id),
      slideNote(
        'Notatka do zeszytu',
        `**Temat: Ortografia, wielka litera i skróty**

- Ó wymienia się na o, e, a (stół - stoły). Rz wymienia się na r (morze - morski), ż na g lub z (może - mogę).
- Rz piszemy po b, p, d, t, g, k, ch, j, w: brzeg, przerwa, drzewo.
- Ch piszemy na końcu wyrazu: dach, groch.
- Wielką literą: nazwy własne, nazwy świąt, tytuły, nazwy ulic. Małą: dni tygodnia i miesiące.
- Skrót obciętego wyrazu ma kropkę (np., itd., ul.); skrót z ostatnią literą wyrazu jej nie ma (dr, mgr).`,
      ),
    ],
  };

  const lesson6: Omit<Lesson, 'id' | 'order'> = {
    grade,
    title: 'Powtórka klasy 4: Świat przedstawiony, gatunki, teatr i film',
    topic: 'Odbiór tekstów kultury',
    progress: {},
    questionSetId: set6.set.id,
    registerTopic: 'Powtórzenie wiadomości z klasy 4: świat przedstawiony, baśń, legenda, mit, bajka, komiks, teatr i film',
    curriculum: ['I.1.1', 'I.1.2', 'I.1.3', '2.7', '2.8', '2.9', '2.10'],
    slides: [
      slideTitle('Powtórka klasy 4', 'Świat przedstawiony, gatunki, teatr i film - część 6/6'),
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
      slideText('Zanim zakręcimy kołem', `Zapamiętaj:
- świat przedstawiony: **czas, miejsce, bohaterowie, wydarzenia**
- **fantastyczne** nie mogłoby zdarzyć się naprawdę
- **baśń** - magia, **legenda** - prawdziwe miejsce, **mit** - bogowie, **bajka** - morał
- **adaptacja** - książka przerobiona na film albo spektakl`),
      slideRecap(set6.set.id),
      slideNote(
        'Notatka do zeszytu',
        `**Temat: Świat przedstawiony, gatunki, teatr i film**

- Świat przedstawiony to czas, miejsce, bohaterowie i wydarzenia.
- Fikcja literacka to świat wymyślony; elementy fantastyczne nie mogłyby zdarzyć się naprawdę.
- Baśń ma magię, legenda tłumaczy prawdziwe miejsce, mit wyjaśnia świat i mówi o bogach, bajka kończy się morałem.
- Komiks opowiada obrazkami w kadrach, tekst jest w dymkach.
- W teatrze aktorzy grają na żywo, film jest nagrany. Adaptacja to książka przerobiona na film lub spektakl.`,
      ),
    ],
  };

  return {
    lessons: [lesson1, lesson2, lesson3, lesson4, lesson5, lesson6],
    questionSets: [set1.set, set2.set, set3.set, set4.set, set5.set, set6.set],
    questions: [
      ...set1.questions,
      ...set2.questions,
      ...set3.questions,
      ...set4.questions,
      ...set5.questions,
      ...set6.questions,
    ],
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
