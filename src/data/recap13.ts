// Gotowa powtorka materialu klas 1-3 - jezyk polski.
// Dwanascie lekcji (modul = 1-2 godziny lekcyjne): fonetyka+ortografia, gramatyka+interpunkcja,
// formy wypowiedzi i czytanie, alfabet+slownictwo, zmiekczenia+interpunkcja,
// czytanie ze zrozumieniem+krotkie formy - kazda z wlasnym zestawem pytan do kola fortuny.
// Zakres wynika z podstawy programowej I etapu (edukacja polonistyczna: sluchanie,
// mowienie, czytanie, pisanie, ksztalcenie jezykowe, samoksztalcenie).
// Rytm slajdow: krotka regula z ilustracja (text) -> zadanie do zeszytu ze
// stoperem i TA SAMA ilustracja (task) -> kolejna regula... W klasach 1-3 kazdy
// slajd tresciowy ma obrazek, a notatka do zeszytu ma najwyzej trzy punkty.
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
const DZIAL = 'Powtórka 1-3';

/** Tworzy 6 lekcji + 6 zestawow pytan wstepnych + 6 zestawow powtorkowych powtorki klas 1-3 dla wskazanego rocznika. */
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
      { text: 'Co to jest rym?', answer: 'podobne zakończenie wyrazów na końcu wersów, np. kot - płot' },
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
      { text: 'Dlaczego piszemy "koń", ale "konia"?', answer: 'ń na końcu wyrazu, a przed samogłoską zmiękczenie zapisujemy przez ni: ko-ni-a' },
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

  const set7 = buildQuestionSet(
    'Powtórka 1-3: bohater, nastrój i tytuł',
    'Bohater i odbiór tekstu',
    classIds,
    [
      { text: 'Co składa się na świat przedstawiony utworu?', answer: 'czas, miejsce, bohaterowie i wydarzenia' },
      { text: 'Na jakie pytanie odpowiada czas w świecie przedstawionym?', answer: 'kiedy?' },
      { text: 'Podaj trzy cechy Kopciuszka.', answer: 'np. pracowita, dobra, cierpliwa' },
      { text: 'Skąd wiesz, że bohater jest odważny?', answer: 'z tego, co robi w tekście - trzeba wskazać konkretne zdarzenie' },
      { text: 'Jak zacząć zdanie, w którym oceniasz bohatera?', answer: 'np. "Uważam, że... , bo w tekście..."' },
      { text: 'Czym różni się cecha bohatera od jego wyglądu?', answer: 'cecha mówi, jaki jest w środku; wygląd - jak wygląda z zewnątrz' },
      { text: 'Co to jest nastrój utworu?', answer: 'uczucie, jakie budzi tekst: wesoły, smutny albo straszny' },
      { text: 'Po czym poznajesz nastrój tekstu?', answer: 'po słowach, których użył autor, np. ciemno, cisza, śmiech' },
      { text: 'Jaki nastrój ma tekst ze słowami: śmiech, słońce, zabawa?', answer: 'wesoły' },
      { text: 'Jaki nastrój ma tekst ze słowami: ciemno, cicho, sam?', answer: 'straszny albo smutny' },
      { text: 'Po co tekstowi tytuł?', answer: 'mówi w kilku słowach, o czym tekst jest' },
      { text: 'Wymyśl tytuł do historii o psie, który zgubił się w mieście.', answer: 'np. "Zagubiony Burek"' },
      { text: 'Czym różni się bohater główny od drugoplanowego?', answer: 'główny jest przez cały czas, drugoplanowy tylko w części zdarzeń' },
      { text: 'Czy w jednym tekście może być dwóch bohaterów głównych?', answer: 'tak, jeśli obaj są w całej historii' },
    ],
  );

  const set8 = buildQuestionSet(
    'Powtórka 1-3: opowiadanie',
    'Tworzenie opowiadania',
    classIds,
    [
      { text: 'Z jakich trzech części składa się opowiadanie?', answer: 'wstęp, rozwinięcie, zakończenie' },
      { text: 'Co piszemy we wstępie opowiadania?', answer: 'kto, kiedy i gdzie - wprowadzamy bohatera i miejsce' },
      { text: 'Co się dzieje w rozwinięciu?', answer: 'najważniejsze wydarzenia, opowiedziane po kolei' },
      { text: 'Do czego służy zakończenie?', answer: 'mówi, jak się to wszystko skończyło' },
      { text: 'Ile zdań ma mieć opowiadanie w klasie 3?', answer: 'od 6 do 10' },
      { text: 'Wymień cztery słowa, które porządkują wydarzenia.', answer: 'najpierw, potem, nagle, na koniec' },
      { text: 'Po co w opowiadaniu słowo "nagle"?', answer: 'zapowiada zwrot akcji - coś, czego nikt się nie spodziewał' },
      { text: 'Czym różni się plan wydarzeń od opowiadania?', answer: 'plan to krótkie punkty, opowiadanie to pełne zdania' },
      { text: 'Co to są dalsze losy bohatera?', answer: 'wymyślony ciąg dalszy historii, zgodny z tym, co już o nim wiemy' },
      { text: 'Czy w dalszych losach bohater może nagle zmienić charakter?', answer: 'nie - ma zostać taki, jaki był w tekście' },
      { text: 'Jakiej części mowy używamy najwięcej, opowiadając wydarzenia?', answer: 'czasowników' },
      { text: 'Od czego zaczynasz każdą nową część opowiadania?', answer: 'od nowego akapitu, czyli od wcięcia' },
      { text: 'Co zrobić, gdy w opowiadaniu ciągle powtarza się to samo słowo?', answer: 'zamienić je na wyraz bliskoznaczny' },
      { text: 'Podaj przykład pierwszego zdania wstępu.', answer: 'np. "Pewnego letniego poranka Marek wyszedł z domu."' },
    ],
  );

  const set9 = buildQuestionSet(
    'Powtórka 1-3: list, ogłoszenie i przeproszenie',
    'Formy użytkowe',
    classIds,
    [
      { text: 'Wymień cztery stałe elementy listu.', answer: 'miejscowość i data, nagłówek, treść, pożegnanie z podpisem' },
      { text: 'Gdzie na kartce piszemy miejscowość i datę?', answer: 'w prawym górnym rogu' },
      { text: 'Podaj przykład nagłówka listu.', answer: 'np. "Kochana Babciu," albo "Cześć Zosiu,"' },
      { text: 'Jakim znakiem kończymy nagłówek listu?', answer: 'przecinkiem' },
      { text: 'Czym kończymy list?', answer: 'pożegnaniem i podpisem, np. "Pozdrawiam, Antek"' },
      { text: 'Gdzie na kopercie piszemy adres nadawcy?', answer: 'w lewym górnym rogu' },
      { text: 'Gdzie na kopercie piszemy adres odbiorcy?', answer: 'na środku koperty, większymi literami' },
      { text: 'Co jeszcze musi znaleźć się na kopercie?', answer: 'znaczek, w prawym górnym rogu' },
      { text: 'Na jakie trzy pytania odpowiada ogłoszenie?', answer: 'czego dotyczy, kiedy i gdzie, kto ogłasza' },
      { text: 'Czym różni się ogłoszenie od zaproszenia?', answer: 'ogłoszenie jest do wszystkich, zaproszenie do konkretnej osoby' },
      { text: 'Z jakich trzech części składa się przeproszenie?', answer: 'za co konkretnie, że jest mi przykro, co zrobię inaczej' },
      { text: 'Dlaczego samo "przepraszam" to za mało?', answer: 'nie wiadomo, za co przepraszam ani czy coś się zmieni' },
      { text: 'Podaj przykład pierwszego zdania przeprosin.', answer: 'np. "Przepraszam, że zniszczyłem Twój rysunek."' },
      { text: 'Do kogo piszemy list, a do kogo ogłoszenie?', answer: 'list do jednej osoby, ogłoszenie do wielu naraz' },
    ],
  );

  const set10 = buildQuestionSet(
    'Powtórka 1-3: frazeologizmy i wyrazy wieloznaczne',
    'Słownictwo',
    classIds,
    [
      { text: 'Co to jest wyraz wieloznaczny?', answer: 'wyraz, który ma kilka różnych znaczeń' },
      { text: 'Podaj trzy znaczenia wyrazu "zamek".', answer: 'budowla, zamek w kurtce, zamek w drzwiach' },
      { text: 'Skąd wiesz, o które znaczenie chodzi?', answer: 'z całego zdania, w którym ten wyraz stoi' },
      { text: 'Podaj dwa znaczenia wyrazu "język".', answer: 'część ciała oraz mowa, np. język polski' },
      { text: 'Co to jest związek frazeologiczny?', answer: 'stałe połączenie wyrazów, które rozumiemy przenośnie' },
      { text: 'Co znaczy "wziąć nogi za pas"?', answer: 'szybko uciec' },
      { text: 'Co znaczy "mieć muchy w nosie"?', answer: 'być obrażonym' },
      { text: 'Co znaczy "biały kruk"?', answer: 'rzadka, cenna rzecz' },
      { text: 'Czy frazeologizmy rozumiemy dosłownie?', answer: 'nie, przenośnie - dosłownie wychodzi bzdura' },
      { text: 'Co to jest zdrobnienie? Podaj przykład.', answer: 'wyraz mówiący, że coś jest małe albo miłe: domek, piesek' },
      { text: 'Co to jest zgrubienie? Podaj przykład.', answer: 'wyraz mówiący, że coś jest duże albo brzydkie: domisko, psisko' },
      { text: 'Utwórz zdrobnienie i zgrubienie od wyrazu "nos".', answer: 'nosek i nochal' },
      { text: 'Po co używamy zdrobnień?', answer: 'żeby powiedzieć o czymś ciepło, czule' },
      { text: 'Czym różni się wyraz wieloznaczny od bliskoznacznego?', answer: 'wieloznaczny to jeden wyraz z wieloma znaczeniami, bliskoznaczne to dwa wyrazy o podobnym znaczeniu' },
    ],
  );

  const set11 = buildQuestionSet(
    'Powtórka 1-3: przekształcanie zdań',
    'Składnia',
    classIds,
    [
      { text: 'Zamień na pytanie: "Ala wraca do domu."', answer: '"Czy Ala wraca do domu?"' },
      { text: 'Zamień na zdanie oznajmujące: "Czy pada deszcz?"', answer: '"Pada deszcz."' },
      { text: 'Jaki znak stawiasz na końcu wykrzyknienia?', answer: 'wykrzyknik' },
      { text: 'Co to jest równoważnik zdania?', answer: 'wypowiedzenie bez orzeczenia, np. "Cisza."' },
      { text: 'Czy "Powrót Ali do domu." to zdanie?', answer: 'nie, to równoważnik - nie ma orzeczenia' },
      { text: 'Po czym poznasz zdanie?', answer: 'ma orzeczenie, czyli czasownik mówiący, co się dzieje' },
      { text: 'Co to jest zdanie pojedyncze?', answer: 'zdanie z jednym orzeczeniem' },
      { text: 'Co to jest zdanie złożone?', answer: 'zdanie z co najmniej dwoma orzeczeniami' },
      { text: 'Ile orzeczeń ma zdanie "Ala wróciła i zjadła obiad"?', answer: 'dwa: wróciła, zjadła' },
      { text: 'Połącz w jedno zdanie: "Padał deszcz." "Zostaliśmy w domu."', answer: 'np. "Padał deszcz, więc zostaliśmy w domu."' },
      { text: 'Jakie wyrazy łączą zdania w złożone?', answer: 'i, a, ale, bo, że, więc' },
      { text: 'Gdzie stawiamy przecinek w zdaniu złożonym?', answer: 'przed ale, bo, że, więc' },
      { text: 'Zamień na wykrzyknienie: "Ala wraca do domu."', answer: '"Ala wraca do domu!"' },
      { text: 'Podaj równoważnik zdania, jakim można zatytułować przerwę.', answer: 'np. "Przerwa." albo "Koniec lekcji."' },
    ],
  );

  const set12 = buildQuestionSet(
    'Powtórka 1-3: skróty, liczebniki i poprawianie tekstu',
    'Zapis i poprawność',
    classIds,
    [
      { text: 'Co znaczy skrót "np."?', answer: 'na przykład' },
      { text: 'Co znaczy skrót "itd."?', answer: 'i tak dalej' },
      { text: 'Co znaczy skrót "ul."?', answer: 'ulica' },
      { text: 'Co znaczy skrót "godz."?', answer: 'godzina' },
      { text: 'Dlaczego po "np." stawiamy kropkę, a po "dr" nie?', answer: 'kropka jest wtedy, gdy skrót urywa wyraz; "dr" kończy się ostatnią literą wyrazu doktor' },
      { text: 'Zapisz słowami: 600.', answer: 'sześćset' },
      { text: 'Zapisz słowami: 400.', answer: 'czterysta' },
      { text: 'Zapisz słowami: 90.', answer: 'dziewięćdziesiąt' },
      { text: 'Jak zapiszemy tytuł książki?', answer: 'wielką literą i w cudzysłowie: "Akademia pana Kleksa"' },
      { text: 'Czy nazwy dni tygodnia piszemy wielką literą?', answer: 'nie, małą: poniedziałek, wtorek' },
      { text: 'Czy nazwy świąt piszemy wielką literą?', answer: 'tak: Boże Narodzenie, Wielkanoc' },
      { text: 'Wymień trzy rzeczy, które sprawdzasz po napisaniu tekstu.', answer: 'np. kropki na końcach zdań, wielkie litery, powtórzenia, trudne ortograficznie wyrazy' },
      { text: 'Co robisz, gdy nie jesteś pewien pisowni wyrazu?', answer: 'sprawdzam w słowniku ortograficznym' },
      { text: 'Jak sprawdzisz, czy w tekście nie brakuje kropki?', answer: 'czytam na głos - tam gdzie robię pauzę, powinien być znak' },
    ],
  );


  // ---------- Lekcje ----------
  const lesson1: Omit<Lesson, 'id' | 'order'> = {
    grade,
    title: 'Powtórka 1-3: Głoski, litery, sylaby, ortografia',
    topic: 'Fonetyka i ortografia',
    progress: {},
    dzial: DZIAL,
    questionSetId: set1.set.id,
    reviewQuestionSetId: set1.set.id,
    registerTopic: 'Powtórzenie wiadomości z klas 1-3: głoski, litery, sylaby, ortografia',
    curriculum: ['II.3.5', 'II.4.1'],
    slides: [
      slideTitle('Powtórka klas 1-3', 'Głoski, litery, sylaby i ortografia - część 1/12'),
      slideTopic('Głoski, litery, sylaby'),
      slideText('Samogłoski i spółgłoski', `Samogłosek jest **8**: **a, e, i, o, u, y, ą, ę**.

Reszta liter to **spółgłoski**, np. **b, k, m, s, t**.

Przy samogłosce buzia jest otwarta, powietrze płynie swobodnie.`, 'samogloski'),
      slideTask('Z1', 'Policz samogłoski', `Zapisz w zeszycie każdy wyraz i policz w nim samogłoski:

- kot
- ekierka
- parasolka
- Antonina

Zapisz tak: **wyraz - liczba samogłosek**.`, undefined, 90, 'samogloski'),
      slideText('Sylaby', `**Sylaba** to część wyrazu, którą wymawiamy za jednym otwarciem ust.

Każda sylaba ma co najmniej **jedną samogłoskę**.

Przykłady: **ma-ma** (2), **te-le-fon** (3), **bi-blio-te-ka** (4).`, 'sylaby'),
      slideTask('Z2', 'Podziel na sylaby', `Podziel wyrazy na sylaby, klaszcząc przy każdej z nich:

1. dom
2. lampa
3. jabłko
4. samolot
5. koleżanka

Zapisz podział w zeszycie, np. **lam-pa**.`, undefined, 120, 'sylaby'),
      slideText('Dwuznaki - jedna głoska, dwie litery', `**Dwuznaki**: **sz, cz, rz, ch, dz, dż, dź**.

To jedna głoska zapisana dwiema literami.

Przykład: **szafa** ma głoski sz-a-f-a, czyli **4 głoski**, choć **5 liter**.`, 'dwuznak'),
      slideTask('Z3', 'Policz głoski i litery', `Dla każdego wyrazu zapisz w zeszycie liczbę głosek i liczbę liter:

- dzień
- ciocia
- kosz
- drzewo

Wzór zapisu: **wyraz - głoski / litery**.`, undefined, 150, 'dwuznak'),
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

Uzasadnij ustnie każdy wybór.`, undefined, 150, 'wymianaOu'),
      slideText('Ortografia: rz-ż i ch-h', `**Rz** piszemy, gdy wymienia się na **r**: morze - morski.

**Ż** piszemy, gdy wymienia się na **g** lub **z**: noga - nóżka, może - mogę.

**Ch** wymienia się na **sz**: mucha - muszka. **H** piszemy w wyrazach obcych: hotel, herbata.`, 'wymianaRzCh'),
      slideTask('Z5', 'Uzupełnij rz-ż i ch-h', `Przepisz do zeszytu, wstawiając właściwą literę w lukę (_):

1. Idziemy na spacer nad mo_e. (rz/ż)
2. To mo_e się udać. (rz/ż)
3. Zjadłem kawałek _leba. (ch/h)
4. Byliśmy w nowym _otelu. (ch/h)

Uzasadnij ustnie każdy wybór.`, undefined, 150, 'wymianaRzCh'),
      slideText('Zanim zakręcimy kołem', `Zapamiętaj:
- **8 samogłosek**: a, e, i, o, u, y, ą, ę
- **dwuznak** to jedna głoska, dwie litery
- **ó** wymienia się na o, e, a`, 'wymianaOu'),
      slideRecap(set1.set.id, 'po-lekcji'),
      slideNote(
        'Notatka do zeszytu',
        `- Samogłoski (8): a, e, i, o, u, y, ą, ę.
- Dwuznak - jedna głoska, dwie litery: sz, cz, rz, ch, dz.
- Ó: wymiana na o, e, a. Rz: na r. Ż: na g, z. Ch: na sz.`,
      ),
    ],
  };

  const lesson2: Omit<Lesson, 'id' | 'order'> = {
    grade,
    title: 'Powtórka 1-3: Części mowy, zdania, wielka litera',
    topic: 'Gramatyka i interpunkcja',
    progress: {},
    dzial: DZIAL,
    questionSetId: set2.set.id,
    reviewQuestionSetId: set2.set.id,
    registerTopic: 'Powtórzenie wiadomości z klas 1-3: części mowy, rodzaje zdań, interpunkcja',
    curriculum: ['II.1.1', 'II.1.11', 'II.4.2', 'II.4.1'],
    slides: [
      slideTitle('Powtórka klas 1-3', 'Części mowy, zdania i interpunkcja - część 2/12'),
      slideTopic('Części mowy i zdania'),
      // Kolo na start: wracamy do ostatniego tematu (glaski, litery, sylaby) tym samym zestawem, w trybie powtorzeniowym.
      slideRecap(set1.set.id, 'powtorzeniowe'),
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

Sprawdzimy razem na głos.`, undefined, 180, 'rzeczownik'),
      slideText('Rodzaje zdań', `Ze względu na cel wypowiedzi rozróżniamy:

- **oznajmujące** - o czymś mówią, np. "Pada deszcz."
- **pytające** - o coś pytają, np. "Czy pada deszcz?"
- **rozkazujące** - coś polecają, np. "Zamknij okno!"`, 'rodzajeZdan'),
      slideTask('Z2', 'Jakie to zdanie?', `Do każdego zdania dopisz jego rodzaj: **O** - oznajmujące, **P** - pytające, **R** - rozkazujące. Dopisz też brakujący znak na końcu.

1. Ile masz lat
2. Zamknij drzwi
3. Lubię czekoladę
4. Czy pojedziemy nad morze`, undefined, 180, 'rodzajeZdan'),
      slideText('Wielka litera', `Wielką literą zaczynamy:

- **zdanie**: "Dzisiaj jest środa."
- **imiona i nazwiska**: Jan Kowalski
- **nazwy miejscowości, państw, rzek**: Warszawa, Polska, Wisła`, 'wielkaLitera'),
      slideTask('Z3', 'Popraw wielkie litery', `Przepisz zdania do zeszytu, poprawiając wielkie litery:

1. w niedzielę jedziemy do warszawy.
2. moja koleżanka ania mieszka w krakowie.
3. najdłuższa rzeka w polsce to wisła.

Podkreśl poprawione litery.`, undefined, 180, 'wielkaLitera'),
      slideText('Przecinek przed że, ale, bo', `Przed spójnikami **że, ale, bo** zawsze stawiamy **przecinek**.

Przykłady:
- "Wiem, że przyjdziesz."
- "Chciałem wyjść, ale padał deszcz."
- "Zostałem w domu, bo byłem chory."`, 'przecinek'),
      slideTask('Z4', 'Wstaw przecinki', `Przepisz zdania do zeszytu, wstawiając brakujący przecinek:

1. Wiem że masz rację.
2. Chciałem grać ale musiałem się uczyć.
3. Nie poszedłem do szkoły bo bolała mnie głowa.
4. Cieszę się że przyjechałeś.`, undefined, 150, 'przecinek'),
      slideText('Zanim zakręcimy kołem', `Zapamiętaj:
- **kto? co?** rzeczownik, **co robi?** czasownik, **jaki?** przymiotnik
- zdanie: **oznajmujące, pytające, rozkazujące**
- przecinek przed **że, ale, bo**`, 'rodzajeZdan'),
      slideRecap(set2.set.id, 'po-lekcji'),
      slideNote(
        'Notatka do zeszytu',
        `- Rzeczownik (kto? co?), czasownik (co robi?), przymiotnik (jaki?).
- Zdania: oznajmujące, pytające, rozkazujące.
- Wielka litera: początek zdania, nazwy własne.
- Przecinek przed: że, ale, bo.`,
      ),
    ],
  };

  const lesson3: Omit<Lesson, 'id' | 'order'> = {
    grade,
    title: 'Powtórka 1-3: Formy wypowiedzi i czytanie',
    topic: 'Formy wypowiedzi',
    progress: {},
    dzial: DZIAL,
    questionSetId: set3.set.id,
    reviewQuestionSetId: set3.set.id,
    registerTopic: 'Powtórzenie wiadomości z klas 1-3: formy wypowiedzi, czytanie i opowiadanie tekstów',
    curriculum: ['III.2.1', 'III.2.3', 'I.1.3', 'I.1.6', 'I.1.7'],
    slides: [
      slideTitle('Powtórka klas 1-3', 'Czytanie i formy wypowiedzi - część 3/12'),
      slideTopic('Formy wypowiedzi'),
      // Kolo na start: wracamy do tematu z lekcji 2 (czesci mowy, zdania) tym samym zestawem, w trybie powtorzeniowym.
      slideRecap(set2.set.id, 'powtorzeniowe'),
      slideText('Wiersz i proza', `**Wiersz** jest zapisany w **wersach** (liniach) i często się **rymuje**.

**Rym** to podobne zakończenie wyrazów, np. **kot - płot**.

**Proza** to zwykły tekst pisany zdaniami, np. opowiadanie.`, 'wiersz'),
      slideTask('Z1', 'Znajdź rymy', `Do każdego wyrazu dopisz w zeszycie rymujące się słowo:

1. las
2. noga
3. wiosna
4. domek

Na koniec wymyśl jedną własną parę rymów.`, undefined, 120, 'wiersz'),
      slideText('Bohater, baśń i legenda', `**Bohater główny** to postać, o której jest cała historia.

**Baśń** jest zmyślona i ma magię ("Dawno, dawno temu...").

**Legenda** tłumaczy pochodzenie prawdziwego miejsca, np. Legenda o Smoku Wawelskim.`, 'basn'),
      slideTask('Z2', 'Bohaterowie znanych baśni', `Zapisz w zeszycie głównego bohatera każdego tytułu:

1. "Czerwony Kapturek"
2. "Kopciuszek"
3. "Kubuś Puchatek"
4. "Królewna Śnieżka"

Który z nich jest twoim ulubionym? Dlaczego?`, undefined, 150, 'basn'),
      slideText('Opowiadanie i plan wydarzeń', `Opowiadanie ma trzy części: **wstęp, rozwinięcie, zakończenie**.

**Plan wydarzeń** to kolejno spisane punkty, co działo się w tekście.

Używamy słów: **najpierw, potem, nagle, na koniec**.`, 'opowiadanie'),
      slideTask('Z3', 'Uporządkuj plan wydarzeń', `Wydarzenia z baśni o Kopciuszku są pomieszane. Ustaw je w zeszycie w prawidłowej kolejności (1-4):

- Kopciuszek mierzy pantofelek.
- Kopciuszek jedzie na bal.
- Macocha każe jej sprzątać.
- Książę zakochuje się w Kopciuszku.`, undefined, 150, 'opowiadanie'),
      slideText('Opis', `**Opis** mówi, jak coś wygląda - osoba, przedmiot, zwierzę.

W opisie używamy dużo **przymiotników** (jaki? jaka?).

Przykład: plecak jest **granatowy**, **duży** i **wygodny**.`, 'opis'),
      slideTask('Z4', 'Napisz opis', `Napisz w zeszycie **2 zdania opisu** swojego plecaka lub piórnika.

Użyj co najmniej **3 przymiotników**, np. kolor, kształt, wielkość.

Przeczytamy kilka opisów na głos.`, undefined, 180, 'opis'),
      slideText('Zaproszenie', `Zaproszenie musi zawierać:

- **kogo** zapraszamy i **na co**
- **kiedy** (data, godzina) i **dokąd**
- **kto** zaprasza`, 'zaproszenie'),
      slideTask('Z5', 'Napisz zaproszenie', `Napisz w zeszycie krótkie zaproszenie koleżanki lub kolegi na **swoje urodziny**.

Pamiętaj o wszystkich elementach: kogo, na co, kiedy, dokąd, kto zaprasza.

Masz 5 minut.`, undefined, 300, 'zaproszenie'),
      slideText('Zanim zakręcimy kołem', `Zapamiętaj:
- **wiersz** ma wersy i rymy
- **baśń** jest zmyślona, **legenda** tłumaczy prawdziwe miejsce
- opowiadanie: **wstęp - rozwinięcie - zakończenie**`, 'opowiadanie'),
      slideRecap(set3.set.id, 'po-lekcji'),
      slideNote(
        'Notatka do zeszytu',
        `- Wiersz: wersy i rymy. Proza: zwykły tekst, zdania.
- Baśń - zmyślona. Legenda - prawdziwe miejsce.
- Opowiadanie: wstęp, rozwinięcie, zakończenie.`,
      ),
    ],
  };

  const lesson4: Omit<Lesson, 'id' | 'order'> = {
    grade,
    title: 'Powtórka 1-3: Alfabet, słownik i rodziny wyrazów',
    topic: 'Alfabet i słownictwo',
    progress: {},
    dzial: DZIAL,
    questionSetId: set4.set.id,
    reviewQuestionSetId: set4.set.id,
    registerTopic: 'Powtórzenie wiadomości z klas 1-3: alfabet, korzystanie ze słownika, wyrazy bliskoznaczne i pokrewne',
    curriculum: ['IV.5', 'II.2.8', 'IV.3', 'II.4.1'],
    slides: [
      slideTitle('Powtórka klas 1-3', 'Alfabet, słownik i rodziny wyrazów - część 4/12'),
      slideTopic('Alfabet i słownik'),
      // Kolo na start: wracamy do tematu z lekcji 3 (formy wypowiedzi) tym samym zestawem, w trybie powtorzeniowym.
      slideRecap(set3.set.id, 'powtorzeniowe'),
      slideText('Alfabet', `Alfabet polski ma **32 litery**. Dziewięć z nich to litery **tylko polskie**: ą, ć, ę, ł, ń, ó, ś, ź, ż.

Każda z nich stoi w alfabecie **zaraz po** swojej "zwykłej" literze: a, **ą**, b, c, **ć**, d...

Porządek alfabetyczny ustalamy po pierwszej literze. Jeśli jest taka sama - po drugiej, potem po trzeciej.`, 'alfabet'),
      slideTask('Z1', 'Ustaw alfabetycznie', `Przepisz do zeszytu w kolejności alfabetycznej:

1. zima, dom, ananas, rower
2. kot, koc, koń, kosz
3. lato, lampa, las, lalka

Przy drugiej i trzeciej grupie musisz patrzeć na drugą i trzecią literę.`, undefined, 210, 'alfabet'),
      slideText('Słownik ortograficzny', `Gdy nie wiesz, jak zapisać wyraz - **sprawdź w słowniku**, nie zgaduj.

Wyrazy stoją w nim w kolejności alfabetycznej, więc szukasz po kolejnych literach.

Na górze strony są **żywe paginy** - pierwszy i ostatni wyraz z tej strony. Po nich poznasz, czy szukać dalej, czy cofnąć.`, 'slownik'),
      slideTask('Z2', 'Sprawdź w słowniku', `Weź słownik ortograficzny (albo koniec podręcznika) i sprawdź pisownię czterech wyrazów:

- ż_łw
- _erbata
- ogr_dek
- kalendar_

Zapisz je w zeszycie poprawnie i podaj numer strony, na której je znalazłeś.`, undefined, 300, 'slownik'),
      slideText('Bliskoznaczne i przeciwstawne', `**Wyrazy bliskoznaczne** znaczą prawie to samo: ładny - piękny, iść - kroczyć.

Używamy ich, żeby **nie powtarzać** ciągle tego samego słowa.

**Wyrazy o znaczeniu przeciwnym** znaczą odwrotnie: ciepły - zimny, dzień - noc.`, 'bliskoznaczne'),
      slideTask('Z3', 'Zamień powtórzenia', `Przepisz zdania do zeszytu, zamieniając powtarzający się wyraz **ładny** na bliskoznaczny:

"Miałem ładny dzień. Pogoda była ładna, a park wyglądał ładnie."

Potem dopisz wyrazy o znaczeniu przeciwnym do: **duży, wesoły, jasny**.`, undefined, 240, 'bliskoznaczne'),
      slideText('Rodzina wyrazów', `**Rodzina wyrazów** to wyrazy z tą samą cząstką i wspólnym znaczeniem.

**dom** - domek, domowy, domownik, bezdomny

Uwaga na pułapkę: **domino** brzmi podobnie, ale znaczy coś zupełnie innego - nie należy do tej rodziny.`, 'rodzinaWyrazow'),
      slideTask('Z4', 'Zbuduj rodziny wyrazów', `Do każdego wyrazu dopisz w zeszycie **trzy wyrazy z jego rodziny**:

1. las
2. kwiat
3. szkoła
4. woda

Podkreśl w każdym wspólną cząstkę.`, undefined, 240, 'rodzinaWyrazow'),
      slideText('Zanim zakręcimy kołem', `Zapamiętaj:
- alfabet: **32 litery**, 9 tylko polskich
- **bliskoznaczne** znaczą to samo, **przeciwstawne** odwrotnie
- **rodzina wyrazów** ma wspólną cząstkę`, 'rodzinaWyrazow'),
      slideRecap(set4.set.id, 'po-lekcji'),
      slideNote(
        'Notatka do zeszytu',
        `- Alfabet: 32 litery, 9 tylko polskich (ą, ć, ę, ł, ń, ó, ś, ź, ż).
- W słowniku: szukamy po kolejnych literach.
- Rodzina wyrazów - wspólna cząstka: dom, domek, domowy.`,
      ),
    ],
  };

  const lesson5: Omit<Lesson, 'id' | 'order'> = {
    grade,
    title: 'Powtórka 1-3: Zmiękczenia, ą i ę, znaki interpunkcyjne',
    topic: 'Ortografia i interpunkcja',
    progress: {},
    dzial: DZIAL,
    questionSetId: set5.set.id,
    reviewQuestionSetId: set5.set.id,
    registerTopic: 'Powtórzenie wiadomości z klas 1-3: zmiękczenia, pisownia ą i ę, znaki interpunkcyjne',
    curriculum: ['II.4.1', 'II.4.2', 'II.3.5'],
    slides: [
      slideTitle('Powtórka klas 1-3', 'Zmiękczenia, ą i ę, interpunkcja - część 5/12'),
      slideTopic('Zmiękczenia i interpunkcja'),
      // Kolo na start: wracamy do tematu z lekcji 4 (alfabet i slownik) tym samym zestawem, w trybie powtorzeniowym.
      slideRecap(set4.set.id, 'powtorzeniowe'),
      slideText('Zmiękczenia: kreska czy i', `To jedna z najczęstszych pomyłek w zeszytach.

**Kreska** - na końcu wyrazu i przed spółgłoską: ni**ć**, ko**ń**, we**ź**.

**Litera i** - przed samogłoską: **ci**ocia, **si**ostra, **zi**ma, **ni**ebo.

Jedna głoska, dwa sposoby zapisu - decyduje to, co stoi obok.`, 'zmiekczenia'),
      slideTask('Z1', 'Kreska czy i', `Przepisz wyrazy do zeszytu, wybierając poprawny zapis:

1. (ć / ci)asto
2. li(ść / ści)
3. (ś / si)ano
4. jesie(ń / ni)
5. (zi / ź)arno
6. (ń / ni)edziela

Przy każdym dopisz, co stoi zaraz po zmiękczeniu: **samogłoska**, **spółgłoska** czy **koniec wyrazu**.`, undefined, 240, 'zmiekczenia'),
      slideText('ą i ę czy om, on, em, en', `Sprawdzasz **uchem**: powiedz wyraz powoli.

Słychać **jedną** głoskę - piszesz **ą** albo **ę**: wąsy, gęś, kąt, ręka.

Słychać **osobne n albo m** - piszesz dwie litery: bo**mb**a, ko**nd**uktor, te**mp**eratura, se**ns**acja.`, 'nosowki'),
      slideTask('Z2', 'Posłuchaj i zapisz', `Przepisz wyrazy do zeszytu, wstawiając ą, ę albo om, on, em, en:

1. d__b
2. t__cza
3. p__pa
4. kol__da
5. k__pas
6. dzi__ki

Każdy wyraz powiedz najpierw na głos, powoli.`, undefined, 240, 'nosowki'),
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

Przy każdym powiedz, jaki to znak i dlaczego.`, undefined, 270, 'znakiInterpunkcyjne'),
      slideText('Zanim zakręcimy kołem', `Zapamiętaj:
- **kreska** przed spółgłoską, **litera i** przed samogłoską
- **ą, ę** gdy słychać jedną głoskę
- przecinek: wyliczenie oraz przed **że, ale, bo**`, 'znakiInterpunkcyjne'),
      slideRecap(set5.set.id, 'po-lekcji'),
      slideNote(
        'Notatka do zeszytu',
        `- Kreska: koniec wyrazu, przed spółgłoską (koń). Litera i: przed samogłoską (ciocia).
- ą, ę - jedna głoska (kąt). om, on, em, en - osobne m/n.
- Przecinek: wyliczenie, przed że/ale/bo. Myślnik - dialog.`,
      ),
    ],
  };

  const lesson6: Omit<Lesson, 'id' | 'order'> = {
    grade,
    title: 'Powtórka 1-3: Czytanie ze zrozumieniem i krótkie formy',
    topic: 'Czytanie i formy użytkowe',
    progress: {},
    dzial: DZIAL,
    questionSetId: set6.set.id,
    reviewQuestionSetId: set6.set.id,
    registerTopic: 'Powtórzenie wiadomości z klas 1-3: czytanie ze zrozumieniem, dialog, życzenia, podziękowanie, notatka',
    curriculum: ['2.2', '2.3', 'I.1.7', 'I.1.8', 'III.2.1', 'III.2.4'],
    slides: [
      slideTitle('Powtórka klas 1-3', 'Czytanie ze zrozumieniem i krótkie formy - część 6/12'),
      slideTopic('Czytanie ze zrozumieniem'),
      // Kolo na start: wracamy do tematu z lekcji 5 (zmiekczenia, interpunkcja) tym samym zestawem, w trybie powtorzeniowym.
      slideRecap(set5.set.id, 'powtorzeniowe'),
      slideText('Temat tekstu', `**Temat tekstu** to jedno zdanie: o czym ten tekst jest.

Gdy szukasz informacji, znajdź w tekście **słowa z pytania** i przeczytaj zdanie wokół nich.`, 'tematTekstu'),
      slideText('Bohater główny i drugoplanowy', `**Bohater główny** jest w historii przez cały czas.

**Drugoplanowy** pojawia się tylko w części zdarzeń.`, 'bohaterowie'),
      slideText('Kolejność zdarzeń', `Wydarzenia opowiadamy **po kolei**, tak jak się działy.

Pomagają w tym słowa: **najpierw, potem, następnie, nagle, na koniec**.

Z takich punktów powstaje **plan wydarzeń**.`, 'kolejnoscZdarzen'),
      slideTask('Z1', 'Ułóż plan wydarzeń', `Nauczyciel przeczyta krótki tekst. Zapisz w zeszycie **4 punkty planu wydarzeń**.

Każdy punkt zacznij od słowa porządkującego: najpierw, potem, nagle, na koniec.

Punkty mają być krótkie - jedno zdanie każdy.`, undefined, 300, 'kolejnoscZdarzen'),
      slideText('Dialog', `**Dialog** to rozmowa co najmniej dwóch osób. **Monolog** - wypowiedź jednej.

Zapis dialogu ma dwie zasady:
- każda wypowiedź od **nowej linii**
- na początku **myślnik**`, 'dialog'),
      slideTask('Z2', 'Zapisz dialog', `Zapisz w zeszycie **czterozdaniowy dialog** dwóch kolegów, którzy umawiają się na wspólne odrabianie lekcji.

Pamiętaj: nowa linia i myślnik przy każdej wypowiedzi.

Dwie osoby przeczytają swój dialog na głos, na role.`, undefined, 300, 'dialog'),
      slideText('Życzenia i podziękowanie', `**Życzenia**: do kogo, z jakiej okazji, czego życzysz, podpis.

**Podziękowanie**: komu dziękujesz, za co konkretnie, podpis.

Obie formy są **krótkie** - kilka zdań wystarczy.`, 'zyczenia'),
      slideTask('Z3', 'Napisz życzenia i podziękowanie', `W zeszycie napisz dwie krótkie formy:

1. **życzenia** dla babci albo dziadka z okazji urodzin
2. **podziękowanie** dla osoby, która ostatnio ci pomogła

W obu podpisz się i napisz, z jakiej okazji albo za co dziękujesz.`, undefined, 360, 'zyczenia'),
      slideText('Notatka', `**Notatka** to najważniejsze informacje w skrócie - punkty, nie całe wypracowanie.

Dobra notatka odpowiada na pytania: **kto, co, kiedy, gdzie**.

Zapisujesz ją dla siebie - ma się dać przeczytać za tydzień i wszystko zrozumieć.`, 'zeszyt'),
      slideText('Zanim zakręcimy kołem', `Zapamiętaj:
- **temat tekstu** to jedno zdanie
- kolejność: **najpierw - potem - nagle - na koniec**
- dialog: **nowa linia i myślnik**`, 'dialog'),
      slideRecap(set6.set.id, 'po-lekcji'),
      slideNote(
        'Notatka do zeszytu',
        `- Temat tekstu - jedno zdanie, o czym jest.
- Kolejność: najpierw, potem, nagle, na koniec.
- Dialog: nowa linia, myślnik. Życzenia - z podpisem.`,
      ),
    ],
  };

  const lesson7: Omit<Lesson, 'id' | 'order'> = {
    grade,
    title: 'Powtórka 1-3: Bohater i nastrój utworu',
    topic: 'Bohater i odbiór tekstu',
    progress: {},
    dzial: DZIAL,
    questionSetId: set7.set.id,
    reviewQuestionSetId: set7.set.id,
    registerTopic:
      'Powtórzenie wiadomości z klas 1-3: świat przedstawiony, cechy i ocena bohatera, nastrój utworu',
    curriculum: ['I.1.1', 'I.1.11', 'I.1.19', 'I.1.14', 'I.1.5'],
    slides: [
      slideTitle('Powtórka klas 1-3', 'Bohater i nastrój utworu - część 7/12'),
      slideTopic('Bohater i nastrój utworu'),
      slideRecap(set6.set.id, 'powtorzeniowe'),
      slideText('Świat przedstawiony', `Każda historia dzieje się **kiedyś** i **gdzieś**.

Świat przedstawiony to **czas**, **miejsce**, **bohaterowie** i **wydarzenia**.

To pierwsze cztery pytania, jakie zadajesz po przeczytaniu tekstu.`, 'swiatPrzedstawiony'),
      slideText('Jaki jest bohater', `**Cecha** mówi, jaki bohater jest w środku: odważny, uparty, pomocny.

To nie to samo, co **wygląd** - wysoki i rudy to jeszcze nie cecha.

Każdą cechę musisz umieć **pokazać zdarzeniem** z tekstu.`, 'cechyBohatera'),
      slideTask('Z1', 'Trzy cechy i dowód', `Wybierz bohatera z ostatniej przeczytanej książki. Zapisz w zeszycie:

1. trzy jego cechy
2. przy każdej jedno zdanie: **bo w tekście...**

Wzór: **odważny - bo wszedł nocą do lasu.**`, undefined, 300, 'cechyBohatera'),
      slideText('Nastrój utworu', `**Nastrój** to uczucie, jakie budzi w tobie tekst.

Wesoły, smutny, straszny - poznajesz go po **słowach**, których użył autor.

"Ciemno, cicho, sam" i "śmiech, słońce, zabawa" to dwa różne nastroje.`, 'nastroj'),
      slideTask('Z2', 'Rozpoznaj nastrój', `Nauczyciel przeczyta trzy krótkie fragmenty. Po każdym zapisz w zeszycie:

1. jaki to nastrój
2. **dwa słowa** z fragmentu, po których to poznałeś

Sprawdzimy razem na głos.`, undefined, 240, 'nastroj'),
      slideText('Tytuł', `**Tytuł** mówi w kilku słowach, o czym jest tekst.

Dobry tytuł da się wymyślić dopiero wtedy, gdy wiesz, co jest w tekście **najważniejsze**.

Tytuł nie zdradza zakończenia.`, 'tematTekstu'),
      slideTask('Z3', 'Wymyśl tytuł', `Wymyśl i zapisz w zeszycie tytuł do każdej historii:

1. pies zgubił się w mieście i wrócił po tygodniu
2. klasa posadziła drzewo przed szkołą
3. chłopiec bał się ciemności, aż przestał

Tytuł ma mieć **najwyżej cztery słowa**.`, undefined, 240, 'tematTekstu'),
      slideText('Zanim zakręcimy kołem', `Zapamiętaj:
- świat przedstawiony: **czas, miejsce, bohaterowie, wydarzenia**
- każdą cechę bohatera pokazujesz zdarzeniem: **bo w tekście...**
- **nastrój** poznajesz po słowach, tytuł mówi, co najważniejsze`, 'cechyBohatera'),
      slideRecap(set7.set.id, 'po-lekcji'),
      slideNote(
        'Notatka do zeszytu',
        `- Świat przedstawiony: czas, miejsce, bohaterowie, wydarzenia.
- Cecha bohatera - z dowodem: odważny, bo...
- Nastrój (wesoły, smutny, straszny) - po słowach autora.`,
      ),
    ],
  };

  const lesson8: Omit<Lesson, 'id' | 'order'> = {
    grade,
    title: 'Powtórka 1-3: Opowiadanie od początku do końca',
    topic: 'Tworzenie opowiadania',
    progress: {},
    dzial: DZIAL,
    questionSetId: set8.set.id,
    reviewQuestionSetId: set8.set.id,
    registerTopic:
      'Powtórzenie wiadomości z klas 1-3: opowiadanie ze wstępem, rozwinięciem i zakończeniem, dalsze losy bohatera',
    curriculum: ['III.2.1', 'III.2.3', 'III.2.7', 'I.1.7'],
    slides: [
      slideTitle('Powtórka klas 1-3', 'Opowiadanie od początku do końca - część 8/12'),
      slideTopic('Opowiadanie'),
      slideRecap(set7.set.id, 'powtorzeniowe'),
      slideText('Trzy części opowiadania', `**Wstęp** - kto, kiedy i gdzie.

**Rozwinięcie** - co się działo, po kolei.

**Zakończenie** - jak się to skończyło. Każda część od **nowego akapitu**.`, 'opowiadanie'),
      slideTask('Z1', 'Dopasuj części', `Nauczyciel przeczyta krótkie opowiadanie. Zapisz w zeszycie, o czym była każda część:

1. wstęp
2. rozwinięcie
3. zakończenie

Przy każdej jedno zdanie, nie więcej.`, undefined, 240, 'opowiadanie'),
      slideText('Słowa, które prowadzą', `Wydarzenia opowiadamy **po kolei**: najpierw, potem, nagle, na koniec.

**Nagle** zapowiada zwrot akcji - coś, czego nikt się nie spodziewał.

Bez tych słów opowiadanie rozsypuje się na luźne zdania.`, 'kolejnoscZdarzen'),
      slideTask('Z2', 'Ułóż plan', `Zapisz w zeszycie **4 punkty planu** opowiadania o dniu, w którym coś ci się nie udało.

Każdy punkt zacznij od słowa: najpierw, potem, nagle, na koniec.

Punkty mają być krótkie - jedno zdanie każdy.`, undefined, 240, 'kolejnoscZdarzen'),
      slideText('Opowiadanie na 6-10 zdań', `Teraz z planu robisz **opowiadanie**: każdy punkt rozwijasz w jedno albo dwa zdania.

Razem **od 6 do 10 zdań** - tyle wymaga się w klasie 3.

Nie powtarzaj tego samego słowa. Powtórzenia zamieniaj na **wyrazy bliskoznaczne**.`, 'opowiadanie'),
      slideTask('Z3', 'Napisz opowiadanie', `Z planu z zadania Z2 napisz w zeszycie **opowiadanie na 6-10 zdań**.

Pamiętaj o trzech częściach i o nowym akapicie przy każdej.

Masz 10 minut. Dwie osoby przeczytają swoje na głos.`, undefined, 600, 'opowiadanie'),
      slideText('Dalsze losy bohatera', `Możesz też **dopisać ciąg dalszy** znanej historii.

Jedna zasada: bohater zostaje **taki sam**. Jeśli był tchórzliwy, nie robi się nagle bohaterem bez powodu.

Tak samo działa wymyślanie **początku** albo **zakończenia** do obrazka.`, 'swiatPrzedstawiony'),
      slideTask('Z4', 'Dopisz zakończenie', `Nauczyciel przeczyta opowiadanie bez zakończenia.

Dopisz w zeszycie **trzy zdania zakończenia**.

Bohater ma zostać taki, jaki był - sprawdzimy to przy czytaniu na głos.`, undefined, 300, 'kolejnoscZdarzen'),
      slideText('Zanim zakręcimy kołem', `Zapamiętaj:
- opowiadanie: **wstęp - rozwinięcie - zakończenie**, każda część od akapitu
- porządkują je słowa **najpierw, potem, nagle, na koniec**
- w klasie 3 opowiadanie ma **6-10 zdań**`, 'opowiadanie'),
      slideRecap(set8.set.id, 'po-lekcji'),
      slideNote(
        'Notatka do zeszytu',
        `- Wstęp (kto, kiedy, gdzie), rozwinięcie, zakończenie.
- Kolejność: najpierw, potem, nagle, na koniec.
- 6-10 zdań, każda część od nowego akapitu.`,
      ),
    ],
  };

  const lesson9: Omit<Lesson, 'id' | 'order'> = {
    grade,
    title: 'Powtórka 1-3: List, ogłoszenie i przeproszenie',
    topic: 'Formy użytkowe',
    progress: {},
    dzial: DZIAL,
    questionSetId: set9.set.id,
    reviewQuestionSetId: set9.set.id,
    registerTopic:
      'Powtórzenie wiadomości z klas 1-3: list, adresowanie koperty, ogłoszenie i przeproszenie',
    curriculum: ['III.2.1', 'II.3.7', 'III.2.6'],
    slides: [
      slideTitle('Powtórka klas 1-3', 'List, ogłoszenie i przeproszenie - część 9/12'),
      slideTopic('List, ogłoszenie, przeprosiny'),
      slideRecap(set8.set.id, 'powtorzeniowe'),
      slideText('List', `List ma **cztery stałe elementy**:

- miejscowość i data w prawym górnym rogu
- nagłówek zakończony **przecinkiem**: "Kochana Babciu,"
- treść, a na końcu pożegnanie i **podpis**`, 'list'),
      slideTask('Z1', 'Napisz list', `Napisz w zeszycie krótki list do babci albo dziadka o tym, co ostatnio wydarzyło się w szkole.

Cztery elementy muszą być: **data, nagłówek, treść, podpis**.

Treść to 4-5 zdań. Masz 8 minut.`, undefined, 480, 'list'),
      slideText('Koperta', `List trzeba jeszcze **zaadresować**.

**Nadawca** (ty) - w lewym górnym rogu, drobniej.

**Odbiorca** - na środku, większymi literami. Znaczek w prawym górnym rogu.`, 'koperta'),
      slideTask('Z2', 'Zaadresuj kopertę', `Narysuj w zeszycie prostokąt - to twoja koperta - i zaadresuj ją:

1. w lewym górnym rogu **swój** adres
2. na środku adres osoby, do której piszesz
3. zaznacz miejsce na znaczek

Adres to trzy linijki: imię i nazwisko, ulica, kod i miasto.`, undefined, 300, 'koperta'),
      slideText('Ogłoszenie', `**Ogłoszenie** piszemy do wielu osób naraz, nie do jednej.

Odpowiada na trzy pytania: **czego dotyczy**, **kiedy i gdzie**, **kto ogłasza**.

Ma być krótkie - ktoś czyta je w biegu, na korytarzu.`, 'ogloszenie'),
      slideTask('Z3', 'Napisz ogłoszenie', `Napisz w zeszycie ogłoszenie o szkolnym turnieju szachowym.

Muszą się w nim znaleźć wszystkie trzy odpowiedzi: czego dotyczy, kiedy i gdzie, kto ogłasza.

Całość ma się zmieścić w **czterech linijkach**.`, undefined, 300, 'ogloszenie'),
      slideText('Przeproszenie', `Samo "przepraszam" to za mało - nie wiadomo, za co ani czy coś się zmieni.

Dobre przeprosiny mają trzy części: **za co konkretnie**, **że jest mi przykro**, **co zrobię inaczej**.

Trzecia część jest najważniejsza.`, 'przeproszenie'),
      slideTask('Z4', 'Napisz przeprosiny', `Napisz w zeszycie krótkie przeprosiny w jednej z sytuacji:

1. zabrałeś koledze piórnik bez pytania
2. spóźniłeś się i cała klasa czekała
3. powiedziałeś coś przykrego

Trzy zdania - po jednym na każdą część.`, undefined, 300, 'przeproszenie'),
      slideText('Zanim zakręcimy kołem', `Zapamiętaj:
- list: **data, nagłówek z przecinkiem, treść, podpis**
- koperta: **nadawca** w lewym górnym rogu, **odbiorca** na środku
- ogłoszenie: **co, kiedy i gdzie, kto**; przeprosiny: **za co, przykro mi, co zrobię**`, 'list'),
      slideRecap(set9.set.id, 'po-lekcji'),
      slideNote(
        'Notatka do zeszytu',
        `- List: data, nagłówek + przecinek, treść, podpis.
- Koperta: nadawca lewy górny róg, odbiorca środek.
- Ogłoszenie: co, kiedy i gdzie, kto. Przeprosiny: za co, przykro mi, poprawię.`,
      ),
    ],
  };

  const lesson10: Omit<Lesson, 'id' | 'order'> = {
    grade,
    title: 'Powtórka 1-3: Wyrazy, które znaczą więcej',
    topic: 'Słownictwo',
    progress: {},
    dzial: DZIAL,
    questionSetId: set10.set.id,
    reviewQuestionSetId: set10.set.id,
    registerTopic:
      'Powtórzenie wiadomości z klas 1-3: wyrazy wieloznaczne, związki frazeologiczne, zdrobnienia i zgrubienia',
    curriculum: ['II.2.4', 'II.2.5', 'I.1.15'],
    slides: [
      slideTitle('Powtórka klas 1-3', 'Wyrazy, które znaczą więcej - część 10/12'),
      slideTopic('Wyrazy, które znaczą więcej'),
      slideRecap(set9.set.id, 'powtorzeniowe'),
      slideText('Wyraz wieloznaczny', `Jeden wyraz, a kilka **różnych** znaczeń.

**Zamek** to budowla, zamek w kurtce albo zamek w drzwiach.

O które chodzi, mówi ci **całe zdanie**, nie sam wyraz.`, 'wieloznaczne'),
      slideTask('Z1', 'Trzy zdania, trzy znaczenia', `Ułóż w zeszycie po jednym zdaniu dla każdego znaczenia:

1. **zamek** - budowla
2. **zamek** - w kurtce
3. **język** - część ciała
4. **język** - mowa

Zdanie ma jasno pokazywać, o które znaczenie chodzi.`, undefined, 300, 'wieloznaczne'),
      slideText('Związek frazeologiczny', `To **stałe połączenie wyrazów**, które rozumiemy **przenośnie**.

"Wziąć nogi za pas" nie znaczy, że ktoś naprawdę bierze nogi.

Rozumiane dosłownie, frazeologizmy są śmieszne - i bez sensu.`, 'frazeologizm'),
      slideTask('Z2', 'Co to znaczy', `Zapisz w zeszycie, co naprawdę znaczą te zwroty:

1. kręcić nosem
2. mieć węża w kieszeni
3. robić z igły widły
4. rzucać słowa na wiatr

Do jednego z nich ułóż zdanie.`, undefined, 300, 'frazeologizm'),
      slideText('Zdrobnienie i zgrubienie', `**Zdrobnienie** mówi, że coś jest małe albo miłe: **domek**, **piesek**.

**Zgrubienie** - że duże albo brzydkie: **domisko**, **psisko**.

Ten sam dom, a zupełnie inne wrażenie.`, 'zdrobnienieZgrubienie'),
      slideTask('Z3', 'Zdrobnij i zgrub', `Do każdego wyrazu dopisz w zeszycie zdrobnienie i zgrubienie:

1. kot
2. ręka
3. chłopiec
4. ptak

Potem powiedz, którego z nich użyłbyś w bajce dla malucha.`, undefined, 240, 'zdrobnienieZgrubienie'),
      slideText('Zanim zakręcimy kołem', `Zapamiętaj:
- **wieloznaczny** to jeden wyraz i kilka znaczeń - rozstrzyga zdanie
- **frazeologizm** rozumiemy przenośnie, nie dosłownie
- **zdrobnienie** zmniejsza i ociepla, **zgrubienie** powiększa`, 'frazeologizm'),
      slideRecap(set10.set.id, 'po-lekcji'),
      slideNote(
        'Notatka do zeszytu',
        `- Wyraz wieloznaczny - kilka znaczeń (zamek); rozstrzyga zdanie.
- Frazeologizm - znaczenie przenośne, nie dosłowne.
- Zdrobnienie: domek. Zgrubienie: domisko.`,
      ),
    ],
  };

  const lesson11: Omit<Lesson, 'id' | 'order'> = {
    grade,
    title: 'Powtórka 1-3: Przerabiamy zdania',
    topic: 'Składnia',
    progress: {},
    dzial: DZIAL,
    questionSetId: set11.set.id,
    reviewQuestionSetId: set11.set.id,
    registerTopic:
      'Powtórzenie wiadomości z klas 1-3: przekształcanie zdań, zdanie pojedyncze i złożone, równoważnik zdania',
    curriculum: ['II.1.11', 'II.1.12', 'II.1.13', 'II.4.2'],
    slides: [
      slideTitle('Powtórka klas 1-3', 'Przerabiamy zdania - część 11/12'),
      slideTopic('Przekształcanie zdań'),
      slideRecap(set10.set.id, 'powtorzeniowe'),
      slideText('Cztery postacie jednego zdania', `To samo można powiedzieć na kilka sposobów:

**Ala wraca do domu.** - **Czy Ala wraca do domu?** - **Ala wraca do domu!**

A można też bez czasownika: **Powrót Ali do domu.**`, 'przeksztalcanieZdan'),
      slideTask('Z1', 'Przerób zdania', `Każde zdanie zapisz w zeszycie **dwa razy**: jako pytanie i jako wykrzyknienie.

1. Marek gra w piłkę.
2. Jutro jedziemy nad morze.
3. Zosia znalazła klucze.

Pamiętaj o znaku na końcu.`, undefined, 240, 'przeksztalcanieZdan'),
      slideText('Równoważnik zdania', `**Zdanie** ma **orzeczenie** - czasownik mówiący, co się dzieje.

**Równoważnik** orzeczenia nie ma: "Cisza.", "Przerwa.", "Powrót Ali."

Dlatego świetnie nadaje się na **tytuł** i na napis na tablicy.`, 'przeksztalcanieZdan'),
      slideTask('Z2', 'Zdanie czy równoważnik', `Zapisz w zeszycie **Z** (zdanie) albo **R** (równoważnik). Przy Z podkreśl orzeczenie.

1. Uwaga, świeżo malowane.
2. Dzieci biegną na przerwę.
3. Koniec lekcji.
4. Ala czyta książkę.
5. Zakaz wstępu.`, undefined, 240, 'przeksztalcanieZdan'),
      slideText('Pojedyncze i złożone', `**Zdanie pojedyncze** ma **jedno** orzeczenie: "Ala wróciła."

**Zdanie złożone** ma co najmniej **dwa**: "Ala wróciła **i** zjadła obiad."

Łączą je: **i, a, ale, bo, że, więc**. Przed **ale, bo, że, więc** stawiamy przecinek.`, 'zdanieZlozone'),
      slideTask('Z3', 'Połącz w złożone', `Połącz każdą parę w jedno zdanie złożone i zapisz je w zeszycie:

1. Padał deszcz. Zostaliśmy w domu.
2. Marek biegł szybko. Nie zdążył na autobus.
3. Wiem to. Mama mi powiedziała.

Nie zapomnij o przecinku.`, undefined, 270, 'zdanieZlozone'),
      slideText('Zanim zakręcimy kołem', `Zapamiętaj:
- to samo zdanie może być **oznajmujące, pytające** albo **wykrzyknieniem**
- **równoważnik** nie ma orzeczenia - nic w nim nie "robi"
- **pojedyncze** ma jedno orzeczenie, **złożone** co najmniej dwa`, 'przeksztalcanieZdan'),
      slideRecap(set11.set.id, 'po-lekcji'),
      slideNote(
        'Notatka do zeszytu',
        `- Zdanie: oznajmujące, pytające, wykrzyknienie - zmienia się znak.
- Równoważnik bez orzeczenia: Cisza. Przerwa.
- Pojedyncze - jedno orzeczenie, złożone - co najmniej dwa. Przecinek przed: ale, bo, że, więc.`,
      ),
    ],
  };

  const lesson12: Omit<Lesson, 'id' | 'order'> = {
    grade,
    title: 'Powtórka 1-3: Skróty, liczebniki i sprawdzanie po sobie',
    topic: 'Zapis i poprawność',
    progress: {},
    dzial: DZIAL,
    questionSetId: set12.set.id,
    reviewQuestionSetId: set12.set.id,
    registerTopic:
      'Powtórzenie wiadomości z klas 1-3: skróty, liczebniki zapisane słownie, wielka litera w tytułach, poprawianie własnego tekstu',
    curriculum: ['II.4.1', 'II.4.2', 'IV.2', 'IV.5'],
    slides: [
      slideTitle('Powtórka klas 1-3', 'Skróty, liczebniki i sprawdzanie po sobie - część 12/12'),
      slideTopic('Skróty i liczebniki'),
      slideRecap(set11.set.id, 'powtorzeniowe'),
      slideText('Skróty', `Skrót to wyraz **urwany** w pisaniu, ale czytany w całości.

**np.** czytamy "na przykład", **itd.** - "i tak dalej".

Kropka jest wtedy, gdy skrót urywa wyraz. **dr** kropki nie ma - kończy się ostatnią literą wyrazu doktor.`, 'skroty'),
      slideTask('Z1', 'Rozwiń skróty', `Zapisz w zeszycie, co znaczy każdy skrót, i dopisz kropkę tam, gdzie trzeba:

1. prof
2. tzn
3. str
4. nr

Przy ostatnim uzasadnij, dlaczego bez kropki.`, undefined, 240, 'skroty'),
      slideText('Liczebniki słowami', `W zdaniu liczby często zapisujemy **słowami**, nie cyframi.

**600** to **sześćset**, **400** to **czterysta**, **90** to **dziewięćdziesiąt**.

Te trzy trzeba po prostu **zapamiętać** - najczęściej się w nich myli.`, 'liczebnikSlownie'),
      slideTask('Z2', 'Zapisz słowami', `Zapisz w zeszycie słowami:

1. 700
2. 500
3. 60
4. 900
5. 14

Pierwsze cztery podkreśl - to te, w których najłatwiej o błąd.`, undefined, 240, 'liczebnikSlownie'),
      slideText('Wielka litera w tytułach', `Nazwy **własne** piszemy wielką literą: Burek, Kraków, Wisła.

Tak samo **tytuły** książek i utworów - w cudzysłowie: **"Akademia pana Kleksa"**.

Uwaga: **święta** wielką literą (Boże Narodzenie), ale **dni tygodnia** małą (poniedziałek).`, 'nazwyWlasne'),
      slideTask('Z3', 'Popraw wielkie litery', `Przepisz do zeszytu poprawnie:

1. czytam książkę dzieci z bullerbyn.
2. w piątek jedziemy do gdańska.
3. na wielkanoc przyjedzie ciocia.
4. mój kot mruczek śpi na parapecie.

Podkreśl poprawione litery.`, undefined, 270, 'nazwyWlasne'),
      slideText('Sprawdzam po sobie', `Tekst nie kończy się na ostatnim zdaniu - kończy się na **sprawdzeniu**.

Czytasz **na głos**: tam gdzie robisz pauzę, powinien być znak.

Potem sprawdzasz cztery rzeczy: **kropki, wielkie litery, powtórzenia, trudne wyrazy**.`, 'zeszyt'),
      slideTask('Z4', 'Sprawdź swój tekst', `Weź opowiadanie, które napisałeś na lekcji 8, i sprawdź je po sobie:

1. przeczytaj na głos i dopisz brakujące znaki
2. sprawdź wielkie litery
3. znajdź powtórzenia i zamień je
4. dwa trudne wyrazy sprawdź w słowniku

Poprawki zaznacz kolorem.`, undefined, 420, 'zeszyt'),
      slideText('Zanim zakręcimy kołem', `Zapamiętaj:
- kropka w skrócie jest wtedy, gdy skrót **urywa** wyraz (np., itd., ale dr)
- **sześćset, czterysta, dziewięćdziesiąt** - pisownię trzeba zapamiętać
- po napisaniu czytasz **na głos** i sprawdzasz kropki, wielkie litery, powtórzenia`, 'skroty'),
      slideRecap(set12.set.id, 'po-lekcji'),
      slideNote(
        'Notatka do zeszytu',
        `- Kropka w skrócie urwanym: np., itd. Skrót dr - bez kropki.
- Liczebniki słowami: sześćset, czterysta, dziewięćdziesiąt.
- Tytuły i nazwy własne - wielką literą. Sprawdzam tekst na głos.`,
      ),
    ],
  };


  return {
    lessons: [
      lesson1,
      lesson2,
      lesson3,
      lesson4,
      lesson5,
      lesson6,
      lesson7,
      lesson8,
      lesson9,
      lesson10,
      lesson11,
      lesson12,
    ],
    questionSets: [
      set1.set,
      set2.set,
      set3.set,
      set4.set,
      set5.set,
      set6.set,
      set7.set,
      set8.set,
      set9.set,
      set10.set,
      set11.set,
      set12.set,
    ],
    questions: [
      ...set1.questions,
      ...set2.questions,
      ...set3.questions,
      ...set4.questions,
      ...set5.questions,
      ...set6.questions,
      ...set7.questions,
      ...set8.questions,
      ...set9.questions,
      ...set10.questions,
      ...set11.questions,
      ...set12.questions,
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
  return { id: newId(), kind: 'topic', topic, timerSec: 180 };
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

function slideRecap(questionSetId: string, mode?: 'po-lekcji' | 'powtorzeniowe'): Slide {
  return { id: newId(), kind: 'recap', questionSetId, ...(mode ? { mode } : {}) };
}

function slideNote(title: string, body: string): Slide {
  return { id: newId(), kind: 'note', title, body };
}
