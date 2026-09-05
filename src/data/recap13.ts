// Gotowa powtorka materialu klas 1-3 - jezyk polski.
// Szesc lekcji (modul = 1-2 godziny lekcyjne): fonetyka+ortografia, gramatyka+interpunkcja,
// formy wypowiedzi i czytanie, alfabet+slownictwo, zmiekczenia+interpunkcja,
// czytanie ze zrozumieniem+krotkie formy - kazda z wlasnym zestawem pytan do kola fortuny.
// Zakres wynika z podstawy programowej I etapu (edukacja polonistyczna: sluchanie,
// mowienie, czytanie, pisanie, ksztalcenie jezykowe, samoksztalcenie).
// Rytm slajdow: krotka regula (text) -> zadanie do zeszytu ze stoperem (task) -> kolejna regula...
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

/** Tworzy 6 lekcji + 6 zestawow pytan powtorki klas 1-3 dla wskazanego rocznika. */
export function buildRecap13(grade: string, classIds: string[]): SeedBundleResult {
  // ---------- Zestawy pytan ----------
  const set1 = buildQuestionSet(
    'Powtórka 1-3: głoski, sylaby, ortografia',
    'Fonetyka i ortografia',
    classIds,
    [
      { text: 'Ile liter ma alfabet polski?', answer: '32 litery (w tym ą, ć, ę, ł, ń, ó, ś, ź, ż)' },
      { text: 'Wymień wszystkie samogłoski w języku polskim.', answer: 'a, e, i, o, u, y, ą, ę (8 samogłosek)' },
      { text: 'Podziel na sylaby wyraz: biblioteka.', answer: 'bi-blio-te-ka (4 sylaby)' },
      { text: 'Podziel na sylaby wyraz: kredka.', answer: 'kred-ka (2 sylaby)' },
      { text: 'Ile głosek i ile liter ma wyraz dzień?', answer: '3 głoski (dź-e-ń), 5 liter' },
      { text: 'Ile głosek i ile liter ma wyraz ciocia?', answer: '4 głoski (ć-o-ć-a), 6 liter' },
      { text: 'Co to jest dwuznak? Podaj przykład.', answer: 'dwie litery zapisujące jedną głoskę, np. sz, cz, rz, ch, dz, dż, dź' },
      { text: 'Jak piszemy: kr_l? ó czy u?', answer: 'król - ó, bo wymienia się na o: król - królowie' },
      { text: 'Jak piszemy: w_zek? ó czy u?', answer: 'wózek - ó, bo wymienia się na o: wózek - wozy' },
      { text: 'Jak piszemy: si_dmy? ó czy u?', answer: 'siódmy - ó, bo wymienia się na e: siódmy - siedem' },
      { text: 'Jak piszemy: sk_ra? ó czy u?', answer: 'skóra - ó, pisownię trzeba zapamiętać (nie ma wymiany)' },
      { text: 'Jak piszemy: mo_e (zbiornik wodny)? rz czy ż?', answer: 'morze - rz, bo wymienia się na r: morze - morski' },
      { text: 'Jak piszemy: mo_e (być może)? rz czy ż?', answer: 'może - ż, bo wymienia się na g: może - mogę' },
      { text: 'Jak piszemy: mu_a (owad)? ch czy h?', answer: 'mucha - ch, bo wymienia się na sz: mucha - muszka' },
    ],
  );

  const set2 = buildQuestionSet(
    'Powtórka 1-3: części mowy i zdania',
    'Gramatyka i interpunkcja',
    classIds,
    [
      { text: 'Na jakie pytania odpowiada rzeczownik?', answer: 'kto? co?' },
      { text: 'Na jakie pytania odpowiada czasownik?', answer: 'co robi? co się z nim dzieje?' },
      { text: 'Na jakie pytania odpowiada przymiotnik?', answer: 'jaki? jaka? jakie?' },
      { text: 'Jaka to część mowy: biegnie?', answer: 'czasownik' },
      { text: 'Jaka to część mowy: wesoły?', answer: 'przymiotnik' },
      { text: 'Jaka to część mowy: szkoła?', answer: 'rzeczownik' },
      { text: 'Wymień trzy rodzaje zdań ze względu na cel wypowiedzi.', answer: 'oznajmujące, pytające, rozkazujące' },
      { text: 'Jaki znak stawiamy na końcu zdania pytającego?', answer: 'znak zapytania (?)' },
      { text: 'Jakim znakiem może kończyć się zdanie rozkazujące?', answer: 'kropką albo wykrzyknikiem' },
      { text: 'Podaj przykład zdania rozkazującego.', answer: 'np. "Usiądź spokojnie."' },
      { text: 'Kiedy piszemy wielką literę? Podaj trzy sytuacje.', answer: 'na początku zdania, w imionach i nazwiskach, w nazwach miejscowości, państw i rzek' },
      { text: 'Popraw zapis: warszawa jest stolicą polski.', answer: 'Warszawa jest stolicą Polski.' },
      { text: 'Kiedy stawiamy przecinek przed słowem że?', answer: 'zawsze, np. "Wiem, że przyjdziesz."' },
      { text: 'Kiedy stawiamy przecinek przed słowem ale?', answer: 'zawsze, np. "Chciałem iść, ale padał deszcz."' },
    ],
  );

  const set3 = buildQuestionSet(
    'Powtórka 1-3: formy wypowiedzi i teksty',
    'Formy wypowiedzi',
    classIds,
    [
      { text: 'Czym różni się wiersz od opowiadania?', answer: 'wiersz ma wersy i często rymy; opowiadanie to tekst ciągły pisany prozą' },
      { text: 'Co to jest rym?', answer: 'podobne zakończenie wyrazów na końcu wersów, np. kot - plot' },
      { text: 'Wymień trzy części, z których składa się opowiadanie.', answer: 'wstęp, rozwinięcie, zakończenie' },
      { text: 'Kim jest bohater główny?', answer: 'postacią, o której opowiada cała historia' },
      { text: 'Czym różni się baśń od legendy?', answer: 'baśń jest zmyślona i pełna magii; legenda tłumaczy pochodzenie prawdziwego miejsca lub wydarzenia' },
      { text: 'Jak zwykle zaczyna się baśń?', answer: 'np. "Dawno, dawno temu..." albo "Za górami, za lasami..."' },
      { text: 'Kim są bohaterowie bajki jako gatunku?', answer: 'zwierzętami, które mówią i zachowują się jak ludzie' },
      { text: 'Co znajduje się zwykle na końcu bajki?', answer: 'morał, czyli nauka płynąca z historii' },
      { text: 'Wymień trzy elementy, jakie powinno zawierać zaproszenie.', answer: 'np. kogo zapraszamy, na co, kiedy, dokąd, kto zaprasza (dowolne trzy)' },
      { text: 'Wymień trzy elementy listu.', answer: 'np. data i miejscowość, nagłówek, treść, pożegnanie, podpis (dowolne trzy)' },
      { text: 'Co to jest opis?', answer: 'wypowiedź mówiąca, jak coś wygląda - osoba, przedmiot lub krajobraz' },
      { text: 'Jakiej części mowy używamy najwięcej w opisie?', answer: 'przymiotników' },
      { text: 'Co to jest plan wydarzeń?', answer: 'kolejno spisane punkty pokazujące, co działo się w tekście' },
      { text: 'Do kogo piszemy życzenia?', answer: 'do konkretnej osoby, z okazji święta, urodzin lub sukcesu' },
    ],
  );

  const set4 = buildQuestionSet(
    'Powtórka 1-3: alfabet, słownik i rodziny wyrazów',
    'Alfabet i słownictwo',
    classIds,
    [
      { text: 'Ile liter ma alfabet polski i ile z nich to litery tylko polskie?', answer: '32 litery, w tym 9 tylko polskich: ą, ć, ę, ł, ń, ó, ś, ź, ż' },
      { text: 'Jaka litera stoi w alfabecie zaraz po literze m?', answer: 'n (a zaraz po niej ń)' },
      { text: 'Ustaw w kolejności alfabetycznej: rower, ryba, rak.', answer: 'rak, rower, ryba' },
      { text: 'Ustaw w kolejności alfabetycznej: kot, koc, koń.', answer: 'koc, koń, kot' },
      { text: 'Po czym poznajesz, który wyraz w słowniku jest wcześniej, jeśli oba zaczynają się tak samo?', answer: 'po kolejnej literze: porównujemy drugą, potem trzecią i tak dalej' },
      { text: 'Do czego służy słownik ortograficzny?', answer: 'do sprawdzania, jak poprawnie zapisać wyraz' },
      { text: 'Co to są wyrazy bliskoznaczne? Podaj przykład.', answer: 'wyrazy o bardzo podobnym znaczeniu, np. ładny - piękny' },
      { text: 'Podaj wyraz bliskoznaczny do słowa "iść".', answer: 'np. kroczyć, maszerować, wędrować' },
      { text: 'Co to są wyrazy o znaczeniu przeciwnym? Podaj parę.', answer: 'znaczą odwrotnie, np. ciepły - zimny, dzień - noc' },
      { text: 'Podaj wyraz o znaczeniu przeciwnym do słowa "wesoły".', answer: 'smutny' },
      { text: 'Co to jest rodzina wyrazów?', answer: 'grupa wyrazów ze wspólną cząstką i wspólnym znaczeniem, np. dom, domek, domowy' },
      { text: 'Podaj trzy wyrazy z rodziny wyrazu "las".', answer: 'np. lasek, leśny, leśniczy, leśnik' },
      { text: 'Jaka cząstka jest wspólna dla wyrazów: kwiat, kwiatek, kwiaciarnia?', answer: 'kwiat' },
      { text: 'Który wyraz nie należy do rodziny wyrazu "dom": domek, domowy, domino?', answer: 'domino - to zupełnie inne znaczenie, tylko podobnie brzmi' },
    ],
  );

  const set5 = buildQuestionSet(
    'Powtórka 1-3: zmiękczenia, ą i ę, znaki interpunkcyjne',
    'Ortografia i interpunkcja',
    classIds,
    [
      { text: 'Kiedy piszemy ć, a kiedy ci?', answer: 'ć na końcu wyrazu i przed spółgłoską (nić), ci przed samogłoską (ciocia)' },
      { text: 'Jak zapiszemy zmiękczone s przed samogłoską? Podaj przykład.', answer: 'si, np. siostra, siano' },
      { text: 'Popraw zapis: "Mój dziadek ma konia i koń."', answer: 'to zdanie jest poprawne - koń na końcu wyrazu, konia przed samogłoską' },
      { text: 'Jak zapiszemy: "zima" czy "źima"?', answer: 'zima - przed samogłoską piszemy zi, nie ź' },
      { text: 'Podaj dwa wyrazy z dź i dzi.', answer: 'np. gwóźdź, niedźwiedź (dź); dziadek, dziura (dzi)' },
      { text: 'Kiedy piszemy ą i ę, a kiedy om, on, em, en?', answer: 'ą i ę, gdy słychać jedną głoskę; om/on/em/en, gdy słychać osobne m albo n' },
      { text: 'Jak zapiszemy: k_t (róg pokoju)?', answer: 'kąt' },
      { text: 'Jak zapiszemy: k_duktor?', answer: 'konduktor - słychać wyraźne n' },
      { text: 'Jaki znak stawiamy na końcu zdania oznajmującego?', answer: 'kropkę' },
      { text: 'Do czego służy wykrzyknik?', answer: 'kończy zdanie rozkazujące albo takie, które mówimy z emocją' },
      { text: 'Kiedy stawiamy przecinek w wyliczeniu? Podaj przykład.', answer: 'między wyliczanymi wyrazami: "Kupiłem chleb, masło i ser"' },
      { text: 'Czy przed "i" w wyliczeniu stawiamy przecinek?', answer: 'nie, np. "jabłka, gruszki i śliwki"' },
      { text: 'Do czego służy dwukropek?', answer: 'zapowiada wyliczenie albo czyjeś słowa, np. "Wziąłem: zeszyt, długopis i linijkę"' },
      { text: 'Jaki znak stawiamy na początku każdej wypowiedzi w dialogu?', answer: 'myślnik' },
    ],
  );

  const set6 = buildQuestionSet(
    'Powtórka 1-3: czytanie ze zrozumieniem i krótkie formy',
    'Czytanie i formy użytkowe',
    classIds,
    [
      { text: 'Co to jest temat tekstu?', answer: 'to, o czym tekst opowiada - da się powiedzieć jednym zdaniem' },
      { text: 'Jakich słów używamy, żeby uporządkować wydarzenia?', answer: 'najpierw, potem, następnie, nagle, na koniec' },
      { text: 'Czym różni się bohater główny od drugoplanowego?', answer: 'główny występuje przez cały czas, drugoplanowy pojawia się tylko w części zdarzeń' },
      { text: 'Co robisz, gdy masz znaleźć w tekście konkretną informację?', answer: 'szukam w tekście słów z pytania i czytam zdanie wokół nich' },
      { text: 'Czym różni się dialog od monologu?', answer: 'dialog to rozmowa co najmniej dwóch osób, monolog to wypowiedź jednej' },
      { text: 'Jak zapisujemy dialog?', answer: 'każdą wypowiedź od nowej linii, zaczynając od myślnika' },
      { text: 'Co musi zawierać zaproszenie?', answer: 'kogo zapraszamy, na co, kiedy, dokąd i kto zaprasza' },
      { text: 'Co musi zawierać życzenie?', answer: 'do kogo, z jakiej okazji, czego życzymy i podpis' },
      { text: 'Za co dziękujemy w podziękowaniu i co jeszcze musi w nim być?', answer: 'za konkretną rzecz; musi być też komu dziękujemy i podpis' },
      { text: 'Co musi zawierać ogłoszenie?', answer: 'czego dotyczy, kiedy i gdzie, kto je zamieszcza' },
      { text: 'Po co piszemy notatkę?', answer: 'żeby zapamiętać najważniejsze informacje w skróconej formie' },
      { text: 'Czym różni się notatka od opowiadania?', answer: 'notatka jest krótka i ma same najważniejsze punkty, opowiadanie to pełny tekst ze zdaniami' },
      { text: 'Co to jest zagadka?', answer: 'krótki tekst z opisem, do którego trzeba odgadnąć rozwiązanie' },
      { text: 'Który znak kończy zdanie: "Ale piękny dzień"?', answer: 'wykrzyknik - to zdanie z emocją' },
    ],
  );

  // ---------- Lekcje ----------
  const lesson1: Omit<Lesson, 'id' | 'order'> = {
    grade,
    title: 'Powtórka 1-3: Głoski, litery, sylaby, ortografia',
    topic: 'Fonetyka i ortografia',
    progress: {},
    questionSetId: set1.set.id,
    registerTopic: 'Powtórzenie wiadomości z klas 1-3: głoski, litery, sylaby, ortografia',
    curriculum: ['II.3.5', 'II.4.1'],
    slides: [
      slideTitle('Powtórka klas 1-3', 'Głoski, litery, sylaby i ortografia - część 1/6'),
      slideText('Co dziś powtarzamy', `- Głoski, litery i sylaby
- Samogłoski, spółgłoski i dwuznaki
- Zasady ó/u, rz/ż i ch/h`),
      slideText('Samogłoski i spółgłoski', `Samogłosek jest **8**: **a, e, i, o, u, y, ą, ę**.

Reszta liter to **spółgłoski**, np. **b, k, m, s, t**.

Przy samogłosce buzia jest otwarta, powietrze płynie swobodnie.`, 'samogloski'),
      slideTask('Z1', 'Policz samogłoski', `Zapisz w zeszycie każdy wyraz i policz w nim samogłoski:

- kot
- ekierka
- parasolka
- Antonina

Zapisz tak: **wyraz - liczba samogłosek**.`, undefined, 90),
      slideText('Sylaby', `**Sylaba** to część wyrazu, którą wymawiamy za jednym otwarciem ust.

Każda sylaba ma co najmniej **jedną samogłoskę**.

Przykłady: **ma-ma** (2), **te-le-fon** (3), **bi-blio-te-ka** (4).`, 'sylaby'),
      slideTask('Z2', 'Podziel na sylaby', `Podziel wyrazy na sylaby, klaszcząc przy każdej z nich:

1. dom
2. lampa
3. jabłko
4. samolot
5. koleżanka

Zapisz podział w zeszycie, np. **lam-pa**.`, undefined, 120),
      slideText('Dwuznaki - jedna głoska, dwie litery', `**Dwuznaki**: **sz, cz, rz, ch, dz, dż, dź**.

To jedna głoska zapisana dwiema literami.

Przykład: **szafa** ma głoski sz-a-f-a, czyli **4 głoski**, choć **5 liter**.`, 'dwuznak'),
      slideTask('Z3', 'Policz głoski i litery', `Dla każdego wyrazu zapisz w zeszycie liczbę głosek i liczbę liter:

- dzień
- ciocia
- kosz
- drzewo

Wzór zapisu: **wyraz - głoski / litery**.`, undefined, 150),
      slideText('Ortografia: ó czy u?', `**Ó** piszemy, gdy wymienia się na **o, e** albo **a**:

- **stół - stoły** (ó:o)
- **siódmy - siedem** (ó:e)
- **skrócić - skracać** (ó:a)

Gdy wymiany nie ma, pisownię trzeba **zapamiętać** (np. ogórek, wróbel).`, 'wymianaOu'),
      slideTask('Z4', 'Uzupełnij ó czy u', `Przepisz zdania do zeszytu, wstawiając w lukę (_) literę ó albo u:

1. Byłem w kr_lestwie bajek.
2. To mój ul_biony kolor.
3. Kupiłem nowy w_zek.
4. Ugotowałam pyszną z_pę.

Uzasadnij ustnie każdy wybór.`, undefined, 150),
      slideText('Ortografia: rz-ż i ch-h', `**Rz** piszemy, gdy wymienia się na **r**: morze - morski.

**Ż** piszemy, gdy wymienia się na **g** lub **z**: noga - nóżka, może - mogę.

**Ch** wymienia się na **sz**: mucha - muszka. **H** piszemy w wyrazach obcych: hotel, herbata.`, 'wymianaRzCh'),
      slideTask('Z5', 'Uzupełnij rz-ż i ch-h', `Przepisz do zeszytu, wstawiając właściwą literę w lukę (_):

1. Idziemy na spacer nad mo_e. (rz/ż)
2. To mo_e się udać. (rz/ż)
3. Zjadłem kawałek _leba. (ch/h)
4. Byliśmy w nowym _otelu. (ch/h)

Uzasadnij ustnie każdy wybór.`, undefined, 150),
      slideText('Zanim zakręcimy kołem', `Zapamiętaj:
- **8 samogłosek**: a, e, i, o, u, y, ą, ę
- **dwuznak** to jedna głoska zapisana dwiema literami
- **ó** wymienia się na o/e/a, **rz** na r, **ż** na g/z, **ch** na sz`),
      slideRecap(set1.set.id),
      slideNote(
        'Notatka do zeszytu',
        `**Temat: Głoski, litery, sylaby i ortografia**

- Samogłosek jest 8: a, e, i, o, u, y, ą, ę.
- Dwuznak to jedna głoska zapisana dwiema literami (np. sz, cz, rz, ch).
- Ó piszemy, gdy wymienia się na o, e albo a.
- Rz piszemy, gdy wymienia się na r; ż - gdy wymienia się na g lub z.
- Ch piszemy, gdy wymienia się na sz; h - w wyrazach obcych.`,
      ),
    ],
  };

  const lesson2: Omit<Lesson, 'id' | 'order'> = {
    grade,
    title: 'Powtórka 1-3: Części mowy, zdania, wielka litera',
    topic: 'Gramatyka i interpunkcja',
    progress: {},
    questionSetId: set2.set.id,
    registerTopic: 'Powtórzenie wiadomości z klas 1-3: części mowy, rodzaje zdań, interpunkcja',
    curriculum: ['II.1.1', 'II.1.11', 'II.4.2', 'II.4.1'],
    slides: [
      slideTitle('Powtórka klas 1-3', 'Części mowy, zdania i interpunkcja - część 2/6'),
      slideText('Co dziś powtarzamy', `- Rzeczownik, czasownik, przymiotnik
- Rodzaje zdań i znaki na ich końcu
- Wielka litera i przecinek przed że, ale, bo`),
      slideText('Rzeczownik', `**Rzeczownik** nazywa osoby, zwierzęta, rzeczy i uczucia.

Odpowiada na pytania: **kto? co?**

Przykłady: **mama, pies, zeszyt, radość**.`, 'rzeczownik'),
      slideText('Czasownik', `**Czasownik** nazywa czynność lub stan.

Odpowiada na pytania: **co robi? co się z nim dzieje?**

Przykłady: **biegnie, śpiewa, śpi, choruje**.`, 'czasownik'),
      slideText('Przymiotnik', `**Przymiotnik** określa, jaki jest ktoś lub coś.

Odpowiada na pytania: **jaki? jaka? jakie?**

Przykłady: **wesoły, czerwone, mądra, wysoki**.`, 'przymiotnik'),
      slideTask('Z1', 'Rozpoznaj części mowy', `Zapisz w zeszycie, jaka to część mowy: **R** - rzeczownik, **CZ** - czasownik, **P** - przymiotnik.

1. słońce
2. świeci
3. jasne
4. dziecko
5. uśmiecha się
6. wesołe

Sprawdzimy razem na głos.`, undefined, 180),
      slideText('Rodzaje zdań', `Ze względu na cel wypowiedzi rozróżniamy:

- **oznajmujące** - o czymś mówią, np. "Pada deszcz."
- **pytające** - o coś pytają, np. "Czy pada deszcz?"
- **rozkazujące** - coś polecają, np. "Zamknij okno!"`, 'rodzajeZdan'),
      slideTask('Z2', 'Jakie to zdanie?', `Do każdego zdania dopisz jego rodzaj: **O** - oznajmujące, **P** - pytające, **R** - rozkazujące. Dopisz też brakujący znak na końcu.

1. Ile masz lat
2. Zamknij drzwi
3. Lubię czekoladę
4. Czy pojedziemy nad morze`, undefined, 180),
      slideText('Wielka litera', `Wielką literą zaczynamy:

- **zdanie**: "Dzisiaj jest środa."
- **imiona i nazwiska**: Jan Kowalski
- **nazwy miejscowości, państw, rzek**: Warszawa, Polska, Wisła`, 'wielkaLitera'),
      slideTask('Z3', 'Popraw wielkie litery', `Przepisz zdania do zeszytu, poprawiając wielkie litery:

1. w niedzielę jedziemy do warszawy.
2. moja koleżanka ania mieszka w krakowie.
3. najdłuższa rzeka w polsce to wisła.

Podkreśl poprawione litery.`, undefined, 180),
      slideText('Przecinek przed że, ale, bo', `Przed spójnikami **że, ale, bo** zawsze stawiamy **przecinek**.

Przykłady:
- "Wiem, że przyjdziesz."
- "Chciałem wyjść, ale padał deszcz."
- "Zostałem w domu, bo byłem chory."`, 'przecinek'),
      slideTask('Z4', 'Wstaw przecinki', `Przepisz zdania do zeszytu, wstawiając brakujący przecinek:

1. Wiem że masz rację.
2. Chciałem grać ale musiałem się uczyć.
3. Nie poszedłem do szkoły bo bolała mnie głowa.
4. Cieszę się że przyjechałeś.`, undefined, 150),
      slideText('Zanim zakręcimy kołem', `Zapamiętaj:
- **rzeczownik** (kto? co?), **czasownik** (co robi?), **przymiotnik** (jaki?)
- zdanie **oznajmujące, pytające** albo **rozkazujące**
- przecinek zawsze przed **że, ale, bo**`),
      slideRecap(set2.set.id),
      slideNote(
        'Notatka do zeszytu',
        `**Temat: Części mowy, zdania i wielka litera**

- Rzeczownik (kto? co?), czasownik (co robi?), przymiotnik (jaki? jaka? jakie?).
- Zdania: oznajmujące, pytające, rozkazujące.
- Wielką literą piszemy: początek zdania, imiona i nazwiska, nazwy miejscowości.
- Przecinek stawiamy zawsze przed że, ale, bo.`,
      ),
    ],
  };

  const lesson3: Omit<Lesson, 'id' | 'order'> = {
    grade,
    title: 'Powtórka 1-3: Formy wypowiedzi i czytanie',
    topic: 'Formy wypowiedzi',
    progress: {},
    questionSetId: set3.set.id,
    registerTopic: 'Powtórzenie wiadomości z klas 1-3: formy wypowiedzi, czytanie i opowiadanie tekstów',
    curriculum: ['III.2.1', 'III.2.3', 'I.1.3', 'I.1.6', 'I.1.7'],
    slides: [
      slideTitle('Powtórka klas 1-3', 'Czytanie i formy wypowiedzi - część 3/6'),
      slideText('Co dziś powtarzamy', `- Wiersz, proza i rymy
- Bohater, baśń, legenda i bajka
- Plan wydarzeń, opis i zaproszenie`),
      slideText('Wiersz i proza', `**Wiersz** jest zapisany w **wersach** (liniach) i często się **rymuje**.

**Rym** to podobne zakończenie wyrazów, np. **kot - plot**.

**Proza** to zwykły tekst pisany zdaniami, np. opowiadanie.`, 'wiersz'),
      slideTask('Z1', 'Znajdź rymy', `Do każdego wyrazu dopisz w zeszycie rymujące się słowo:

1. kot
2. noga
3. wiosna
4. domek

Na koniec wymyśl jedną własną parę rymów.`, undefined, 120),
      slideText('Bohater, baśń i legenda', `**Bohater główny** to postać, o której jest cała historia.

**Baśń** jest zmyślona i ma magię ("Dawno, dawno temu...").

**Legenda** tłumaczy pochodzenie prawdziwego miejsca, np. Legenda o Smoku Wawelskim.`, 'basn'),
      slideTask('Z2', 'Bohaterowie znanych baśni', `Zapisz w zeszycie głównego bohatera każdego tytułu:

1. "Czerwony Kapturek"
2. "Kopciuszek"
3. "Kubuś Puchatek"
4. "Królewna Śnieżka"

Który z nich jest twoim ulubionym? Dlaczego?`, undefined, 150),
      slideText('Opowiadanie i plan wydarzeń', `Opowiadanie ma trzy części: **wstęp, rozwinięcie, zakończenie**.

**Plan wydarzeń** to kolejno spisane punkty, co działo się w tekście.

Używamy słów: **najpierw, potem, nagle, na koniec**.`, 'opowiadanie'),
      slideTask('Z3', 'Uporządkuj plan wydarzeń', `Wydarzenia z baśni o Kopciuszku są pomieszane. Ustaw je w zeszycie w prawidłowej kolejności (1-4):

- Kopciuszek mierzy pantofelek.
- Kopciuszek jedzie na bal.
- Macocha każe jej sprzątać.
- Książę zakochuje się w Kopciuszku.`, undefined, 150),
      slideText('Opis', `**Opis** mówi, jak coś wygląda - osoba, przedmiot, zwierzę.

W opisie używamy dużo **przymiotników** (jaki? jaka?).

Przykład: plecak jest **granatowy**, **duży** i **wygodny**.`, 'opis'),
      slideTask('Z4', 'Napisz opis', `Napisz w zeszycie **2 zdania opisu** swojego plecaka lub piórnika.

Użyj co najmniej **3 przymiotników**, np. kolor, kształt, wielkość.

Przeczytamy kilka opisów na głos.`, undefined, 180),
      slideText('Zaproszenie', `Zaproszenie musi zawierać:

- **kogo** zapraszamy i **na co**
- **kiedy** (data, godzina) i **dokąd**
- **kto** zaprasza`, 'zaproszenie'),
      slideTask('Z5', 'Napisz zaproszenie', `Napisz w zeszycie krótkie zaproszenie koleżanki lub kolegi na **swoje urodziny**.

Pamiętaj o wszystkich elementach: kogo, na co, kiedy, dokąd, kto zaprasza.

Masz 5 minut.`, undefined, 300),
      slideText('Zanim zakręcimy kołem', `Zapamiętaj:
- **wiersz** ma wersy i rymy, **proza** to zwykły tekst pisany zdaniami
- **baśń** jest zmyślona, **legenda** tłumaczy prawdziwe miejsce
- opowiadanie: **wstęp - rozwinięcie - zakończenie**`),
      slideRecap(set3.set.id),
      slideNote(
        'Notatka do zeszytu',
        `**Temat: Formy wypowiedzi i czytanie tekstów**

- Wiersz ma wersy i rymy, proza to zwykły tekst pisany zdaniami.
- Baśń jest zmyślona, legenda tłumaczy pochodzenie prawdziwego miejsca.
- Opowiadanie ma trzy części: wstęp, rozwinięcie, zakończenie.
- W opisie używamy dużo przymiotników (jaki? jaka?).
- Zaproszenie: kogo, na co, kiedy, dokąd i kto zaprasza.`,
      ),
    ],
  };

  const lesson4: Omit<Lesson, 'id' | 'order'> = {
    grade,
    title: 'Powtórka 1-3: Alfabet, słownik i rodziny wyrazów',
    topic: 'Alfabet i słownictwo',
    progress: {},
    questionSetId: set4.set.id,
    registerTopic: 'Powtórzenie wiadomości z klas 1-3: alfabet, korzystanie ze słownika, wyrazy bliskoznaczne i pokrewne',
    curriculum: ['IV.5', 'II.2.8', 'IV.3', 'II.4.1'],
    slides: [
      slideTitle('Powtórka klas 1-3', 'Alfabet, słownik i rodziny wyrazów - część 4/6'),
      slideText('Co dziś powtarzamy', `- Alfabet i porządek alfabetyczny
- Szukanie wyrazu w słowniku ortograficznym
- Wyrazy bliskoznaczne i przeciwstawne
- Rodzina wyrazów`),
      slideText('Alfabet', `Alfabet polski ma **32 litery**. Dziewięć z nich to litery **tylko polskie**: ą, ć, ę, ł, ń, ó, ś, ź, ż.

Każda z nich stoi w alfabecie **zaraz po** swojej "zwykłej" literze: a, **ą**, b, c, **ć**, d...

Porządek alfabetyczny ustalamy po pierwszej literze. Jeśli jest taka sama - po drugiej, potem po trzeciej.`, 'alfabet'),
      slideTask('Z1', 'Ustaw alfabetycznie', `Przepisz do zeszytu w kolejności alfabetycznej:

1. zima, dom, ananas, rower
2. kot, koc, koń, kosz
3. lato, lampa, las, lalka

Przy drugiej i trzeciej grupie musisz patrzeć na drugą i trzecią literę.`, undefined, 210),
      slideText('Słownik ortograficzny', `Gdy nie wiesz, jak zapisać wyraz - **sprawdź w słowniku**, nie zgaduj.

Wyrazy stoją w nim w kolejności alfabetycznej, więc szukasz po kolejnych literach.

Na górze strony są **żywe paginy** - pierwszy i ostatni wyraz z tej strony. Po nich poznasz, czy szukać dalej, czy cofnąć.`, 'slownik'),
      slideTask('Z2', 'Sprawdź w słowniku', `Weź słownik ortograficzny (albo koniec podręcznika) i sprawdź pisownię czterech wyrazów:

- ż__łw
- ogr__dek
- __erbata
- w__ozek

Zapisz je w zeszycie poprawnie i podaj numer strony, na której je znalazłeś.`, undefined, 300),
      slideText('Bliskoznaczne i przeciwstawne', `**Wyrazy bliskoznaczne** znaczą prawie to samo: ładny - piękny, iść - kroczyć.

Używamy ich, żeby **nie powtarzać** ciągle tego samego słowa.

**Wyrazy o znaczeniu przeciwnym** znaczą odwrotnie: ciepły - zimny, dzień - noc.`, 'bliskoznaczne'),
      slideTask('Z3', 'Zamień powtórzenia', `Przepisz zdania do zeszytu, zamieniając powtarzający się wyraz **ładny** na bliskoznaczny:

"Miałem ładny dzień. Pogoda była ładna, a park wyglądał ładnie."

Potem dopisz wyrazy o znaczeniu przeciwnym do: **duży, wesoły, jasny**.`, undefined, 240),
      slideText('Rodzina wyrazów', `**Rodzina wyrazów** to wyrazy z tą samą cząstką i wspólnym znaczeniem.

**dom** - domek, domowy, domownik, bezdomny

Uwaga na pułapkę: **domino** brzmi podobnie, ale znaczy coś zupełnie innego - nie należy do tej rodziny.`, 'rodzinaWyrazow'),
      slideTask('Z4', 'Zbuduj rodziny wyrazów', `Do każdego wyrazu dopisz w zeszycie **trzy wyrazy z jego rodziny**:

1. las
2. kwiat
3. szkoła
4. woda

Podkreśl w każdym wspólną cząstkę.`, undefined, 240),
      slideText('Zanim zakręcimy kołem', `Zapamiętaj:
- alfabet ma **32 litery**, w tym 9 tylko polskich
- w słowniku szukamy po **kolejnych literach**
- **bliskoznaczne** znaczą prawie to samo, **przeciwstawne** odwrotnie
- **rodzina wyrazów** ma wspólną cząstkę i wspólne znaczenie`),
      slideRecap(set4.set.id),
      slideNote(
        'Notatka do zeszytu',
        `**Temat: Alfabet, słownik i rodziny wyrazów**

- Alfabet polski ma 32 litery, w tym 9 tylko polskich: ą, ć, ę, ł, ń, ó, ś, ź, ż.
- Kolejność alfabetyczną ustalamy po pierwszej literze, a przy takiej samej - po następnej.
- Wyrazy bliskoznaczne znaczą prawie to samo (ładny - piękny), przeciwstawne odwrotnie (dzień - noc).
- Rodzina wyrazów to wyrazy ze wspólną cząstką i wspólnym znaczeniem: dom, domek, domowy.`,
      ),
    ],
  };

  const lesson5: Omit<Lesson, 'id' | 'order'> = {
    grade,
    title: 'Powtórka 1-3: Zmiękczenia, ą i ę, znaki interpunkcyjne',
    topic: 'Ortografia i interpunkcja',
    progress: {},
    questionSetId: set5.set.id,
    registerTopic: 'Powtórzenie wiadomości z klas 1-3: zmiękczenia, pisownia ą i ę, znaki interpunkcyjne',
    curriculum: ['II.4.1', 'II.4.2', 'II.3.5'],
    slides: [
      slideTitle('Powtórka klas 1-3', 'Zmiękczenia, ą i ę, interpunkcja - część 5/6'),
      slideText('Co dziś powtarzamy', `- Kreska czy litera i: ć - ci, ś - si, ź - zi, ń - ni, dź - dzi
- Kiedy ą i ę, a kiedy om, on, em, en
- Sześć znaków interpunkcyjnych i ich zadania`),
      slideText('Zmiękczenia: kreska czy i', `To jedna z najczęstszych pomyłek w zeszytach.

**Kreska** - na końcu wyrazu i przed spółgłoską: ni**ć**, ko**ń**, we**ź**.

**Litera i** - przed samogłoską: **ci**ocia, **si**ostra, **zi**ma, **ni**ebo.

Jedna głoska, dwa sposoby zapisu - decyduje to, co stoi obok.`, 'zmiekczenia'),
      slideTask('Z1', 'Kreska czy i', `Przepisz wyrazy do zeszytu, wybierając poprawny zapis:

1. (ć / ci)ocia
2. ni(ć / ci)
3. (ś / si)ostra
4. ko(ń / ni)
5. (zi / ź)ma
6. we(ź / zi)

Przy każdym dopisz, co stoi zaraz po zmiękczeniu: **samogłoska**, **spółgłoska** czy **koniec wyrazu**.`, undefined, 240),
      slideText('ą i ę czy om, on, em, en', `Sprawdzasz **uchem**: powiedz wyraz powoli.

Słychać **jedną** głoskę - piszesz **ą** albo **ę**: wąsy, gęś, kąt, ręka.

Słychać **osobne n albo m** - piszesz dwie litery: bo**mb**a, ko**nd**uktor, te**mp**eratura, se**ns**acja.`, 'nosowki'),
      slideTask('Z2', 'Posłuchaj i zapisz', `Przepisz wyrazy do zeszytu, wstawiając ą, ę albo om, on, em, en:

1. k__t
2. b__ba
3. g__ś
4. k__duktor
5. r__ka
6. t__peratura

Każdy wyraz powiedz najpierw na głos, powoli.`, undefined, 240),
      slideText('Znaki interpunkcyjne', `Każdy znak ma **jedno zadanie**:

- **kropka** kończy zdanie, **pytajnik** stawiamy przy pytaniu, **wykrzyknik** przy rozkazie i emocji
- **przecinek** - w wyliczeniu oraz przed że, ale, bo
- **dwukropek** zapowiada wyliczenie, **myślnik** rozpoczyna wypowiedź w dialogu`, 'znakiInterpunkcyjne'),
      slideTask('Z3', 'Wstaw znaki', `Przepisz do zeszytu, wstawiając brakujące znaki interpunkcyjne:

1. Ile masz lat
2. Do plecaka zapakowałem zeszyt długopis i linijkę
3. Ale piękny dzień
4. Wiem że dasz radę
5. Kupiłam trzy owoce jabłko gruszkę i śliwkę

Przy każdym powiedz, jaki to znak i dlaczego.`, undefined, 270),
      slideText('Zanim zakręcimy kołem', `Zapamiętaj:
- **kreska** na końcu i przed spółgłoską, **litera i** przed samogłoską
- **ą, ę** gdy słychać jedną głoskę; **om, on, em, en** gdy słychać osobne m lub n
- przecinek: **wyliczenie** oraz przed **że, ale, bo**
- w dialogu każda wypowiedź od **myślnika**`),
      slideRecap(set5.set.id),
      slideNote(
        'Notatka do zeszytu',
        `**Temat: Zmiękczenia, ą i ę, znaki interpunkcyjne**

- Zmiękczenie zapisujemy kreską na końcu wyrazu i przed spółgłoską (nić, koń), a literą i przed samogłoską (ciocia, zima).
- ą i ę piszemy, gdy słychać jedną głoskę (kąt, gęś); om, on, em, en - gdy słychać osobne m lub n (bomba, konduktor).
- Kropka kończy zdanie, pytajnik - pytanie, wykrzyknik - rozkaz i emocję.
- Przecinek stawiamy w wyliczeniu oraz przed że, ale, bo.
- Dwukropek zapowiada wyliczenie, myślnik rozpoczyna wypowiedź w dialogu.`,
      ),
    ],
  };

  const lesson6: Omit<Lesson, 'id' | 'order'> = {
    grade,
    title: 'Powtórka 1-3: Czytanie ze zrozumieniem i krótkie formy',
    topic: 'Czytanie i formy użytkowe',
    progress: {},
    questionSetId: set6.set.id,
    registerTopic: 'Powtórzenie wiadomości z klas 1-3: czytanie ze zrozumieniem, dialog, życzenia, podziękowanie, notatka',
    curriculum: ['2.2', '2.3', 'I.1.7', 'I.1.8', 'III.2.1', 'III.2.4'],
    slides: [
      slideTitle('Powtórka klas 1-3', 'Czytanie ze zrozumieniem i krótkie formy - część 6/6'),
      slideText('Co dziś powtarzamy', `- Temat tekstu i szukanie informacji
- Kolejność zdarzeń
- Dialog i jego zapis
- Życzenia, podziękowanie i notatka`),
      slideText('Czytanie ze zrozumieniem', `**Temat tekstu** to jedno zdanie: o czym ten tekst jest.

Gdy masz znaleźć konkretną informację, **nie czytaj wszystkiego od nowa**. Znajdź w tekście słowa z pytania i przeczytaj zdanie wokół nich.

Bohater **główny** jest przez cały czas, **drugoplanowy** tylko w części zdarzeń.`),
      slideText('Kolejność zdarzeń', `Wydarzenia opowiadamy **po kolei**, tak jak się działy.

Pomagają w tym słowa: **najpierw, potem, następnie, nagle, na koniec**.

Z takich punktów powstaje **plan wydarzeń**.`, 'kolejnoscZdarzen'),
      slideTask('Z1', 'Ułóż plan wydarzeń', `Nauczyciel przeczyta krótki tekst. Zapisz w zeszycie **4 punkty planu wydarzeń**.

Każdy punkt zacznij od słowa porządkującego: najpierw, potem, nagle, na koniec.

Punkty mają być krótkie - jedno zdanie każdy.`, undefined, 300),
      slideText('Dialog', `**Dialog** to rozmowa co najmniej dwóch osób. **Monolog** - wypowiedź jednej.

Zapis dialogu ma dwie zasady:
- każda wypowiedź od **nowej linii**
- na początku **myślnik**`, 'dialog'),
      slideTask('Z2', 'Zapisz dialog', `Zapisz w zeszycie **czterozdaniowy dialog** dwóch kolegów, którzy umawiają się na wspólne odrabianie lekcji.

Pamiętaj: nowa linia i myślnik przy każdej wypowiedzi.

Dwie osoby przeczytają swój dialog na głos, na role.`, undefined, 300),
      slideText('Życzenia i podziękowanie', `**Życzenia**: do kogo, z jakiej okazji, czego życzysz, podpis.

**Podziękowanie**: komu dziękujesz, za co konkretnie, podpis.

Obie formy są **krótkie** - kilka zdań wystarczy.`, 'zyczenia'),
      slideTask('Z3', 'Napisz życzenia i podziękowanie', `W zeszycie napisz dwie krótkie formy:

1. **życzenia** dla babci albo dziadka z okazji urodzin
2. **podziękowanie** dla osoby, która ostatnio ci pomogła

W obu podpisz się i napisz, z jakiej okazji albo za co dziękujesz.`, undefined, 360),
      slideText('Notatka', `**Notatka** to najważniejsze informacje w skrócie - punkty, nie całe wypracowanie.

Dobra notatka odpowiada na pytania: **kto, co, kiedy, gdzie**.

Zapisujesz ją dla siebie - ma się dać przeczytać za tydzień i wszystko zrozumieć.`, 'zeszyt'),
      slideText('Zanim zakręcimy kołem', `Zapamiętaj:
- **temat tekstu** mówi jednym zdaniem, o czym on jest
- wydarzenia porządkujemy: **najpierw - potem - nagle - na koniec**
- dialog: **nowa linia i myślnik**
- życzenia i podziękowanie zawsze kończymy **podpisem**`),
      slideRecap(set6.set.id),
      slideNote(
        'Notatka do zeszytu',
        `**Temat: Czytanie ze zrozumieniem i krótkie formy użytkowe**

- Temat tekstu mówi jednym zdaniem, o czym tekst jest.
- Wydarzenia porządkujemy słowami: najpierw, potem, nagle, na koniec.
- Dialog to rozmowa dwóch osób; każdą wypowiedź piszemy od nowej linii, od myślnika.
- Życzenia: do kogo, z jakiej okazji, czego życzymy, podpis.
- Podziękowanie: komu, za co, podpis. Notatka: kto, co, kiedy, gdzie - w punktach.`,
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
