// Gotowa powtorka materialu klas 1-3 - jezyk polski.
// Szesc lekcji (modul = 1-2 godziny lekcyjne): fonetyka+ortografia, gramatyka+interpunkcja,
// formy wypowiedzi i czytanie, zmiekczenia i samogloski nosowe, alfabet+slownik+rodzina
// wyrazow, zapis rozmowy (dialog i czat) - kazda z wlasnym zestawem pytan do kola fortuny.
// (Wczesniejsza wersja miala 12 lekcji - lekcje 4-12 byly chaotyczne i zostaly zastapione
// dwiema nowymi, spokojniejszymi; stara tresc zostala w historii gita, commit ac36793.)
// Rytm slajdow: (od lekcji 2) kolo powtorzeniowe na zestawie POPRZEDNIEJ lekcji (recap) ->
// krotka regula z ilustracja (text) -> zadanie do zeszytu ze stoperem i TA SAMA ilustracja
// (task; po zadaniu UI losuje kolem osobe, ktora pokazuje rozwiazanie) -> kolejna regula...
// -> slajd "Zapamiętaj" -> notatka do zeszytu. Na koncu lekcji NIE MA kola z pytaniami:
// zestaw pytan lekcji sluzy wylacznie kolu powtorzeniowemu na poczatku nastepnej lekcji,
// a pytan jest dokladnie tyle, ile zadan (kazde sprawdza umiejetnosc z zadania Zi na innym
// materiale). W klasach 1-3 kazdy slajd tresciowy ma obrazek, a notatka ma najwyzej trzy punkty.
// Lekcje 4-6 (dopisane pozniej) stosuja dwie nowsze zasady, ktorych lekcje 1-3 celowo
// NIE dostaly wstecz (nauczyciel prowadzi je juz w klasach - nie ruszamy):
// - polecenie zadania w CALOSCI w `body`, bez tytulu-naglowka (dzieci nie czytaly podtytulu,
//   wiec polecenie ma byc jednym, samowystarczalnym tekstem),
// - ikonka "do zeszytu" (pole `zeszyt` slajdu) zamiast pytania "czy to zapisujemy?".
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

/** Tworzy 6 lekcji + 6 zestawow pytan powtorki klas 1-3 dla wskazanego rocznika (zestaw lekcji N kreci sie na poczatku lekcji N+1). */
export function buildRecap13(grade: string, classIds: string[]): SeedBundleResult {
  // ---------- Zestawy pytan ----------
  // Kazdy zestaw ma DOKLADNIE tyle pytan, ile lekcja ma zadan (Z1, Z2...): pytanie i.
  // sprawdza te sama umiejetnosc co zadanie Zi, ale na innym materiale, tak by dalo
  // sie odpowiedziec ustnie w 1-2 zdaniach. Zestaw sluzy WYLACZNIE kolu
  // powtorzeniowemu na poczatku nastepnej lekcji (set6 zostaje na "Koło powt.").
  const set1 = buildQuestionSet(
    'Powtórka 1-3: głoski, sylaby, ortografia',
    'Fonetyka i ortografia',
    classIds,
    [
      { text: 'Ile samogłosek ma wyraz: zeszyt?', answer: '2 samogłoski (e, y) - y też jest samogłoską' },
      { text: 'Podziel na sylaby wyraz: czekolada.', answer: 'cze-ko-la-da (4 sylaby)' },
      { text: 'Ile głosek i ile liter ma wyraz czapka?', answer: '5 głosek (cz-a-p-k-a), 6 liter - cz to dwuznak' },
      { text: 'Jak piszemy: l_d (zamarznięta woda)? ó czy u?', answer: 'lód - ó, bo wymienia się na o: lód - lody' },
      { text: 'Jak piszemy: ma_ec (miesiąc)? rz czy ż?', answer: 'marzec - rz, bo wymienia się na r: marzec - marca' },
    ],
  );

  const set2 = buildQuestionSet(
    'Powtórka 1-3: części mowy i zdania',
    'Gramatyka i interpunkcja',
    classIds,
    [
      { text: 'Jakie to części mowy: pływa, czerwony, książka?', answer: 'pływa - czasownik, czerwony - przymiotnik, książka - rzeczownik' },
      { text: 'Jaki to rodzaj zdania i jaki znak stawiamy na końcu: "Gdzie leży mój plecak"?', answer: 'pytające - znak zapytania (?)' },
      { text: 'Popraw zapis: mój brat tomek pojechał nad bałtyk.', answer: 'Mój brat Tomek pojechał nad Bałtyk.' },
      { text: 'Gdzie brakuje przecinka: "Poszliśmy do domu bo zaczęło padać"?', answer: 'przed bo: "Poszliśmy do domu, bo zaczęło padać."' },
    ],
  );

  const set3 = buildQuestionSet(
    'Powtórka 1-3: formy wypowiedzi i teksty',
    'Formy wypowiedzi',
    classIds,
    [
      { text: 'Podaj wyraz, który rymuje się ze słowem: kotek.', answer: 'np. płotek, młotek, motek' },
      { text: 'Kim jest główny bohater baśni "Pinokio"?', answer: 'drewniany pajacyk, który chce zostać prawdziwym chłopcem' },
      { text: 'Ułóż w kolejności wydarzenia z "Czerwonego Kapturka": myśliwy ratuje babcię, Kapturek idzie przez las, wilk zjada babcię.', answer: 'Kapturek idzie przez las, wilk zjada babcię, myśliwy ratuje babcię' },
      { text: 'Opisz jednym zdaniem swoje buty, używając dwóch przymiotników.', answer: 'np. "Moje buty są czarne i wygodne."' },
      { text: 'Zaproś ustnie kolegę na przedstawienie klasowe - powiedz kogo, na co, kiedy i dokąd.', answer: 'np. "Kasiu, zapraszam cię na przedstawienie klasy 4a w piątek o 12:00 do sali gimnastycznej."' },
    ],
  );

  const set4 = buildQuestionSet(
    'Powtórka 1-3: zmiękczenia oraz ą i ę',
    'Zmiękczenia i samogłoski nosowe',
    classIds,
    [
      {
        text: 'Wyjaśnij, czemu w wyrazie "śnieg" piszemy ś, a w wyrazie "siano" - si.',
        answer: 'przed spółgłoską (n) zmiękczenie zapisujemy kreską, przed samogłoską (a) - literą i',
      },
      {
        text: 'Jak zapiszesz: k_t (róg pokoju) i k_cert (występ muzyczny)?',
        answer: 'kąt - słychać jedną głoskę; koncert - słychać osobne n',
      },
      {
        text: 'Znajdź błąd w zdaniu: "W sobote pójdę na basen." Jak go poprawić?',
        answer: 'sobote -> sobotę (widzę kogo? co? sobotę - na końcu piszemy ę, choć słychać e)',
      },
    ],
  );

  const set5 = buildQuestionSet(
    'Powtórka 1-3: alfabet, słownik i rodzina wyrazów',
    'Alfabet i słownictwo',
    classIds,
    [
      {
        text: 'Który wyraz stoi w słowniku pierwszy: ptak czy pszczoła? Dlaczego?',
        answer: 'pszczoła - pierwsza litera ta sama, a s stoi w alfabecie przed t',
      },
      {
        text: 'Do czego służą dwa wyrazy wypisane na samej górze strony słownika?',
        answer: 'to żywe paginy - pierwszy i ostatni wyraz strony; mówią, czy szukać dalej, czy się cofnąć',
      },
      {
        text: 'Podaj dwa wyrazy bliskoznaczne do wyrazu "mały".',
        answer: 'np. malutki, niewielki, drobny',
      },
      {
        text: 'Czy "kotlet" należy do rodziny wyrazu "kot"? Uzasadnij.',
        answer: 'nie - brzmi podobnie, ale nie ma wspólnego znaczenia z kotem',
      },
    ],
  );



  // Zestaw lekcji 6 - lekcja konczy powtorke, wiec jej kolo krecimy dopiero
  // recznie ("Koło powt." na liscie lekcji), tak samo jak set5.
  const set6 = buildQuestionSet(
    'Powtórka 1-3: zapis rozmowy - dialog i czat',
    'Zapis rozmowy',
    classIds,
    [
      {
        text: 'Od czego zaczyna się każda wypowiedź w dialogu zapisanym w zeszycie?',
        answer: 'od nowej linii i myślnika',
      },
      {
        text: 'Kolega napisał na czacie „idziesz jutro na basen". Jakiego znaku brakuje na końcu i dlaczego?',
        answer: 'pytajnika - to pytanie; emotka nie zastępuje znaku na końcu zdania',
      },
      {
        text: 'Czym różni się wiadomość do kolegi od wiadomości do nauczyciela?',
        answer:
          'do nauczyciela: powitanie, prośba pełnym zdaniem, podziękowanie i podpis; bez skrótów i emotek',
      },
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
      slideText('Zapamiętaj', `- **8 samogłosek**: a, e, i, o, u, y, ą, ę
- **dwuznak** to jedna głoska, dwie litery
- **ó** wymienia się na o, e, a`, 'wymianaOu'),
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
      // Kolo na start: zestaw lekcji 1 (gloski, litery, sylaby) w trybie powtorzeniowym - jedyne kolo z pytaniami w lekcji.
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
      slideText('Zapamiętaj', `- **kto? co?** rzeczownik, **co robi?** czasownik, **jaki?** przymiotnik
- zdanie: **oznajmujące, pytające, rozkazujące**
- przecinek przed **że, ale, bo**`, 'rodzajeZdan'),
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
      // Kolo na start: zestaw lekcji 2 (czesci mowy, zdania) w trybie powtorzeniowym.
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
      slideText('Zapamiętaj', `- **wiersz** ma wersy i rymy
- **baśń** jest zmyślona, **legenda** tłumaczy prawdziwe miejsce
- opowiadanie: **wstęp - rozwinięcie - zakończenie**`, 'opowiadanie'),
      slideNote(
        'Notatka do zeszytu',
        `- Wiersz: wersy i rymy. Proza: zwykły tekst, zdania.
- Baśń - zmyślona. Legenda - prawdziwe miejsce.
- Opowiadanie: wstęp, rozwinięcie, zakończenie.`,
      ),
    ],
  };

  // Lekcje 4-5: nowszy styl - polecenie w calosci w body (bez tytulu zadania),
  // ikonka "do zeszytu" na kazdym zadaniu pisemnym. Lekcja 4 otwiera umowe
  // ikonki osobnym slajdem, bo klasa widzi ja pierwszy raz.
  const lesson4: Omit<Lesson, 'id' | 'order'> = {
    grade,
    title: 'Powtórka 1-3: Zmiękczenia oraz ą i ę',
    topic: 'Zmiękczenia i samogłoski nosowe',
    progress: {},
    dzial: DZIAL,
    questionSetId: set4.set.id,
    reviewQuestionSetId: set4.set.id,
    registerTopic: 'Powtórzenie wiadomości z klas 1-3: zmiękczenia, pisownia ą i ę',
    curriculum: ['II.4.1', 'II.3.5'],
    slides: [
      slideTitle('Powtórka klas 1-3', 'Zmiękczenia oraz ą i ę - pisownia, którą słychać'),
      slideTopic('Zmiękczenia oraz ą i ę'),
      // Kolo na start: zestaw lekcji 3 (formy wypowiedzi) w trybie powtorzeniowym.
      slideRecap(set3.set.id, 'powtorzeniowe'),
      slideText('Umowa: ikonka zeszytu', `Od dziś na slajdach pojawia się ikonka **„do zeszytu"**.

- Jest ikonka - **zapisujesz** to, co każe slajd.
- Nie ma ikonki - **słuchasz** i zgłaszasz się do odpowiedzi.

Nie trzeba pytać, czy zapisywać - wystarczy spojrzeć.`, 'zeszyt'),
      slideText('Miękka głoska, dwa zapisy', `Miękką głoskę zapisujemy na dwa sposoby - decyduje to, co stoi **tuż za nią**:

- przed **samogłoską** - litera **i**: s**i**ostra, c**i**ocia, n**i**ebo
- przed **spółgłoską** i na **końcu wyrazu** - kreska: **ś**nieg, ko**ń**, gę**ś**`, 'zmiekczenia'),
      slideTask('Z1', undefined, `Przepisz wyrazy do zeszytu, wybierając poprawny zapis. Obok każdego dopisz, co stoi po miękkiej głosce: samogłoska, spółgłoska czy koniec wyrazu.

1. (ś / si)ostra
2. (ć / ci)emno
3. gę(ś / si)
4. (ń / ni)ebo
5. sło(ń / ni)
6. (ś / si)nieg

Wzór: **siostra - po si stoi samogłoska o**.`, undefined, 240, 'zmiekczenia', true),
      slideText('ą i ę - jedna głoska czy dwie?', `Powiedz wyraz **powoli** i posłuchaj.

Słychać **jedną** głoskę - piszesz **ą** albo **ę**: w**ą**sy, g**ę**ś, k**ą**t.

Słychać **osobne m albo n** - piszesz dwie litery: b**om**ba, k**on**cert, t**em**perówka.`, 'nosowki'),
      slideTask('Z2', undefined, `Powiedz każdy wyraz powoli na głos i posłuchaj: jedna głoska czy osobne m albo n? Potem zapisz wyraz w zeszycie z ą, ę albo om, on, em, en.

1. z_b
2. g_ska
3. b_ben
4. k_puter
5. wst_żka
6. p_czek`, undefined, 240, 'nosowki', true),
      slideText('Podstępne ę na końcu wyrazu', `Na końcu wyrazu **ę** brzmi jak zwykłe **e** - dlatego właśnie tu jest najwięcej błędów.

- **ja** coś robię - czasownik z **ę**: id**ę**, pisz**ę**, prosz**ę**
- widzę **kogo? co?** - sobot**ę**, niedziel**ę**, książk**ę**

Ucho tu nie wystarczy - sprawdź, czy to „ja robię" albo „widzę coś".`, 'nosowki'),
      slideTask('Z3', undefined, `W tym tekście ukryło się **6 błędów**. Przepisz tekst do zeszytu poprawnie i podkreśl każdą poprawioną literę:

„W niedziele ide z ciocią do zoo. Zobaczymy słonie, wielbłondy i wężę. Potem usiondziemy na ławce i bendziemy patrzeć na łabędzie."`, undefined, 300, undefined, true),
      slideText('Zapamiętaj', `- litera **i** przed samogłoską (ciocia), **kreska** przed spółgłoską i na końcu (śnieg, koń)
- jedna głoska - **ą, ę** (kąt); osobne m/n - **om, on, em, en** (koncert)
- na końcu wyrazu **ę**, choć słychać e: idę, sobotę`, 'zmiekczenia'),
      slideNote(
        'Notatka do zeszytu',
        `- Litera i przed samogłoską: ciocia. Kreska przed spółgłoską i na końcu: śnieg, koń.
- Jedna głoska - ą, ę: kąt, gęś. Osobne m/n - om, on, em, en: koncert.
- Na końcu wyrazu ę: idę, sobotę.`,
      ),
    ],
  };

  const lesson5: Omit<Lesson, 'id' | 'order'> = {
    grade,
    title: 'Powtórka 1-3: Alfabet, słownik i rodzina wyrazów',
    topic: 'Alfabet i słownictwo',
    progress: {},
    dzial: DZIAL,
    questionSetId: set5.set.id,
    reviewQuestionSetId: set5.set.id,
    registerTopic:
      'Powtórzenie wiadomości z klas 1-3: kolejność alfabetyczna, słownik ortograficzny, wyrazy bliskoznaczne i rodzina wyrazów',
    curriculum: ['IV.5', 'II.2.8', 'II.4.1'],
    slides: [
      slideTitle('Powtórka klas 1-3', 'Alfabet, słownik i rodzina wyrazów - narzędzia do słów'),
      slideTopic('Alfabet, słownik, rodzina wyrazów'),
      // Kolo na start: zestaw lekcji 4 (zmiekczenia, a i e nosowe) w trybie powtorzeniowym.
      slideRecap(set4.set.id, 'powtorzeniowe'),
      slideText('Alfabet - 32 litery w stałym porządku', `Alfabet to stała kolejność **32 liter** - dzięki niej każdy wyraz da się znaleźć w słowniku.

Gdy pierwsza litera jest ta sama, decyduje **druga**; gdy i ta jest taka sama - **trzecia**.

Krótszy wyraz, który cały mieści się w dłuższym, stoi **pierwszy**: kra, potem krab.`, 'alfabet'),
      slideTask('Z1', undefined, `Zapisz każdą grupę wyrazów w kolejności alfabetycznej, w jednej linijce:

1. sowa, sarna, słoń
2. kra, krok, krab
3. mak, magia, maj

Pierwsza litera wszędzie jest ta sama - patrz na drugą i trzecią.`, undefined, 240, 'alfabet', true),
      slideText('Słownik ortograficzny', `Pisowni **nie zgadujemy** - sprawdzamy ją w słowniku ortograficznym.

Na górze każdej strony słownik podpowiada **żywe paginy**: pierwszy i ostatni wyraz tej strony.

Twój wyraz mieści się między nimi alfabetycznie? Jest na tej stronie.`, 'slownik'),
      slideTask('Z2', undefined, `Na górze strony słownika stoją żywe paginy: **malina** i **motyl** - pierwszy i ostatni wyraz tej strony.

Przepisz do zeszytu tylko te wyrazy, które znajdziesz na tej stronie:

mama, mysz, morze, marzec, mucha`, undefined, 240, 'slownik', true),
      slideText('Bliskoznaczne i przeciwne', `**Wyrazy bliskoznaczne** znaczą prawie to samo: fajny - udany, świetny, wspaniały.

Ratują tekst przed powtarzaniem w kółko tego samego słowa.

**Wyrazy przeciwne** znaczą odwrotnie: wesoły - smutny, cichy - głośny.`, 'bliskoznaczne'),
      slideTask('Z3', undefined, `Przepisz tekst do zeszytu tak, żeby wyraz „fajny" nie pojawił się ani razu - za każdym razem wstaw **inny** wyraz bliskoznaczny:

„To był fajny dzień. Zjedliśmy fajny obiad, a potem obejrzeliśmy fajny film."

Na koniec dopisz wyrazy o znaczeniu przeciwnym do: wesoły, cichy.`, undefined, 300, 'bliskoznaczne', true),
      slideText('Rodzina wyrazów', `**Rodzina wyrazów** to wyrazy ze wspólną cząstką i wspólnym znaczeniem:

**wod**a - **wod**ny, **wod**ospad, **wod**nik

Uwaga na pułapki: **zawodnik** brzmi podobnie, ale z wodą nie ma nic wspólnego - to nie ta rodzina.`, 'rodzinaWyrazow'),
      slideTask('Z4', undefined, `Z listy wybierz i zapisz w zeszycie tylko wyrazy z rodziny wyrazu **woda**:

wodny, wodospad, wojsko, wodnik, worek, zawodnik

Dopisz dwa własne wyrazy z tej rodziny i podkreśl w każdym wspólną cząstkę.`, undefined, 240, 'rodzinaWyrazow', true),
      slideText('Zapamiętaj', `- w alfabecie decyduje **pierwsza** litera, potem druga i trzecia
- pisownię **sprawdzam w słowniku**, między żywymi paginami
- rodzina wyrazów = wspólna **cząstka** i wspólne **znaczenie**`, 'rodzinaWyrazow'),
      slideNote(
        'Notatka do zeszytu',
        `- Alfabet: 32 litery; ta sama pierwsza litera - decyduje druga.
- Pisownię sprawdzam w słowniku ortograficznym, nie zgaduję.
- Zamiast powtarzać wyraz, wstawiam bliskoznaczny: fajny - udany.
- Rodzina wyrazów - wspólna cząstka i znaczenie: woda, wodny, wodospad.`,
      ),
    ],
  };


  const lesson6: Omit<Lesson, 'id' | 'order'> = {
    grade,
    title: 'Powtórka 1-3: Zapis rozmowy - dialog i czat',
    topic: 'Zapis rozmowy',
    progress: {},
    dzial: DZIAL,
    questionSetId: set6.set.id,
    reviewQuestionSetId: set6.set.id,
    registerTopic:
      'Powtórzenie wiadomości z klas 1-3: zapis dialogu, znaki na końcu zdania i kultura pisania wiadomości',
    curriculum: ['II.3.5', 'III.2.1', 'IV.2'],
    slides: [
      slideTitle('Powtórka klas 1-3', 'Zapis rozmowy - w zeszycie i na ekranie'),
      slideTopic('Zapis rozmowy: dialog i czat'),
      // Kolo na start: zestaw lekcji 5 (alfabet i slownictwo) w trybie powtorzeniowym.
      slideRecap(set5.set.id, 'powtorzeniowe'),
      slideText('Ta sama rozmowa, dwa zapisy', `Na czacie rozmowa sama układa się w **dymki** - widać, kto mówi, bo każdy ma swoją stronę ekranu.

W zeszycie dymków nie ma, więc kto mówi, pokazuje **układ tekstu**:

- każda wypowiedź od **nowej linii**
- na początku **myślnik**`, 'czat'),
      slideTask('Z1', undefined, `Przepisz tę rozmowę do zeszytu tak, jak zapisuje się dialog: każda wypowiedź od nowej linii, z myślnikiem i znakiem na końcu.

„Ola pisze: masz zadanie z polskiego. Kuba odpowiada: mam, ale zostawiłem zeszyt w szkole. Ola pyta: to co teraz zrobisz. Kuba pisze: poproszę o kartkę."

Wzór pierwszej linijki: **- Masz zadanie z polskiego?**`, undefined, 300, 'dialog', true),
      slideText('Emotka to nie znak zdania', `Na końcu zdania zawsze stoi **kropka, pytajnik albo wykrzyknik** - to one mówią, po co piszesz.

- pytam - **?**
- zwykła wiadomość - **.**
- krzyczę, cieszę się, ostrzegam - **!**

Emotka może dołożyć nastrój, ale **nie zastępuje** znaku ani wielkiej litery na początku.`, 'znakiInterpunkcyjne'),
      slideTask('Z2', undefined, `Przepisz wiadomości do zeszytu poprawnie: wielka litera na początku i właściwy znak na końcu. Obok każdej dopisz, co to za zdanie: **pytanie**, **oznajmienie** czy **rozkaz**.

1. kiedy jest sprawdzian
2. już jestem pod szkołą
3. zadzwoń do mnie po obiedzie
4. ale super mecz
5. nie zapomnij stroju`, undefined, 300, 'przeksztalcanieZdan', true),
      slideText('Wiadomość do dorosłego', `Do kolegi piszesz krótko i luźno. Do **nauczyciela, trenera, bibliotekarki** wiadomość ma cztery części:

**powitanie - prośba - podziękowanie - podpis**

Wielkie litery w całym wyrazie znaczą w internecie **krzyk**, więc ich nie używamy. Podpisujemy się imieniem i klasą, bo adres nic nie mówi.`, 'wiadomosc'),
      slideTask('Z3', undefined, `Uczeń wysłał do nauczycielki wiadomość: „ZAPOMNIALEM ZESZYTU CO TERAZ???"

Napisz ją w zeszycie jeszcze raz, tak jak pisze się do dorosłego. Muszą się w niej znaleźć wszystkie cztery części: powitanie, prośba pełnym zdaniem, podziękowanie i podpis.`, undefined, 300, 'wiadomosc', true),
      slideText('Zapamiętaj', `- dialog w zeszycie: **nowa linia + myślnik** przy każdej wypowiedzi
- na końcu zdania **. ? !** - emotka nigdy tego nie zastąpi
- do dorosłego: **powitanie, prośba, podziękowanie, podpis**`, 'czat'),
      slideNote(
        'Notatka do zeszytu',
        `- Dialog: każda wypowiedź od nowej linii, z myślnikiem.
- Na końcu zdania kropka, pytajnik albo wykrzyknik. Emotka nie jest znakiem zdania.
- Wiadomość do dorosłego: powitanie, prośba, podziękowanie, podpis.`,
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

/**
 * `title` undefined = nowszy styl zadan (lekcje 4-5): cale polecenie w `body`,
 * bez naglowka. `zeszyt` = ikonka "do zeszytu" na slajdzie.
 */
function slideTask(
  code: string,
  title: string | undefined,
  body: string,
  exerciseNo?: number,
  timerSec?: number,
  art?: SlideArt,
  zeszyt?: boolean,
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
    zeszyt,
  };
}

/** Kolo powtorzeniowe na poczatku lekcji - jedyny rodzaj slajdu recap w tej powtorce. */
function slideRecap(questionSetId: string, mode: 'powtorzeniowe'): Slide {
  return { id: newId(), kind: 'recap', questionSetId, mode };
}

function slideNote(title: string, body: string): Slide {
  return { id: newId(), kind: 'note', title, body };
}
