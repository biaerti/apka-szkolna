// Gotowa powtorka materialu klas 1-3 - jezyk polski.
// Trzy lekcje po ~45 min (fonetyka+ortografia, gramatyka+interpunkcja, formy wypowiedzi)
// + trzy zestawy pytan do kola fortuny. Wstawiane z ekranu Lekcje przyciskiem.

import { newId } from './id';
import type { Lesson, Question, QuestionSet, Slide } from './types';

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

/** Tworzy 3 lekcje + 3 zestawy pytan powtorki klas 1-3 dla wskazanej klasy. */
export function buildRecap13(classId: string): SeedBundleResult {
  // ---------- Zestawy pytan ----------
  const set1 = buildQuestionSet(
    'Powtórka 1-3: głoski, sylaby, ortografia',
    'Fonetyka i ortografia',
    classId,
    [
      { text: 'Ile liter ma alfabet polski?', answer: '32 litery (razem z ą, ć, ę, ł, ń, ó, ś, ź, ż)' },
      { text: 'Wymień wszystkie samogłoski w języku polskim.', answer: 'a, e, i, o, u, y, ą, ę' },
      { text: 'Podziel na sylaby wyraz: "parasolka".', answer: 'pa-ra-sol-ka (4 sylaby)' },
      { text: 'Podziel na sylaby wyraz: "kredka".', answer: 'kred-ka (2 sylaby)' },
      { text: 'Ile głosek, a ile liter ma wyraz "dzień"?', answer: '3 głoski (dź-e-ń), 5 liter' },
      { text: 'Ile głosek ma wyraz "szafa"?', answer: '4 głoski (sz-a-f-a)' },
      { text: 'Jaką literę piszemy: "ch" czy "h" w słowie "___leb"?', answer: 'chleb - przez "ch"' },
      { text: 'Jaką literę piszemy: "u" czy "ó" w słowie "kr___l"?', answer: 'król - przez "ó"' },
      { text: 'Jaką literę piszemy w słowie "___aba"?', answer: 'żaba - przez "ż"' },
      { text: 'Jaką literę piszemy w słowie "mo___e" (być może)?', answer: 'może - przez "ż"' },
      { text: 'Podziel na sylaby: "biblioteka".', answer: 'bi-blio-te-ka (4 sylaby)' },
      { text: 'Wymień 3 wyrazy, w których słychać głoskę "sz".', answer: 'np. szafa, kosz, myszka' },
    ],
  );

  const set2 = buildQuestionSet(
    'Powtórka 1-3: części mowy i zdania',
    'Gramatyka i interpunkcja',
    classId,
    [
      { text: 'Na jakie pytanie odpowiada rzeczownik?', answer: 'kto? co?' },
      { text: 'Na jakie pytanie odpowiada czasownik?', answer: 'co robi? co się z nim dzieje?' },
      { text: 'Na jakie pytanie odpowiada przymiotnik?', answer: 'jaki? jaka? jakie?' },
      { text: 'Powiedz, jaka to część mowy: "biegnie".', answer: 'czasownik' },
      { text: 'Powiedz, jaka to część mowy: "wesoły".', answer: 'przymiotnik' },
      { text: 'Powiedz, jaka to część mowy: "szkoła".', answer: 'rzeczownik' },
      { text: 'Wymień 4 rodzaje zdań ze względu na cel wypowiedzi.', answer: 'oznajmujące, pytające, rozkazujące, wykrzyknikowe' },
      { text: 'Jaki znak stawiamy na końcu zdania pytającego?', answer: 'znak zapytania: ?' },
      { text: 'Jaki znak stawiamy na końcu zdania wykrzyknikowego?', answer: 'wykrzyknik: !' },
      { text: 'Podaj przykład zdania rozkazującego.', answer: 'np. "Usiądź spokojnie."' },
      { text: 'Kiedy piszemy wielką literę? Podaj 3 sytuacje.', answer: 'na początku zdania, w imionach i nazwiskach, w nazwach miast/państw/rzek' },
      { text: 'Napisz poprawnie: "warszawa jest stolicą polski".', answer: 'Warszawa jest stolicą Polski.' },
    ],
  );

  const set3 = buildQuestionSet(
    'Powtórka 1-3: formy wypowiedzi i teksty',
    'Formy wypowiedzi',
    classId,
    [
      { text: 'Czym różni się wiersz od opowiadania?', answer: 'wiersz ma wersy (linijki), często rymy; opowiadanie to tekst ciągły (proza)' },
      { text: 'Co to jest rym?', answer: 'podobne zakończenia wyrazów na końcu wersów (np. kot - plot)' },
      { text: 'Wymień elementy opowiadania.', answer: 'początek, rozwinięcie (co się działo), zakończenie; bohaterowie, miejsce, czas' },
      { text: 'Kto to jest bohater tekstu?', answer: 'postać, o której opowiada tekst' },
      { text: 'Czym różni się baśń od legendy?', answer: 'baśń jest zmyślona i pełna magii; legenda tłumaczy prawdziwe miejsce/wydarzenie (często z elementami fantastycznymi)' },
      { text: 'Jak zaczyna się zwykle baśń?', answer: '"Dawno, dawno temu..." albo "Za górami, za lasami..."' },
      { text: 'Do kogo piszemy życzenia?', answer: 'do konkretnej osoby - z okazji świąt, urodzin, imienin, sukcesu' },
      { text: 'Co powinno zawierać zaproszenie?', answer: 'kogo zapraszamy, dokąd, kiedy (data i godzina), po co, kto zaprasza' },
      { text: 'Wymień 3 elementy listu.', answer: 'np. data i miejscowość, powitanie ("Kochana Mamo"), treść, pożegnanie, podpis' },
      { text: 'Co to jest opis?', answer: 'wypowiedź mówiąca, jak coś wygląda - osoba, przedmiot, krajobraz' },
      { text: 'Podaj 3 przymiotniki opisujące kolegę lub koleżankę.', answer: 'np. wesoły, uczynny, mądry, sympatyczny' },
      { text: 'Co to jest bajka?', answer: 'krótki utwór, często z morałem, w którym bohaterami są zwierzęta zachowujące się jak ludzie' },
    ],
  );

  // ---------- Lekcje ----------
  const lesson1: Omit<Lesson, 'id' | 'order'> = {
    classId,
    title: 'Powtórka 1-3: Litery, głoski, sylaby, ortografia',
    topic: 'Fonetyka i ortografia',
    status: 'planned',
    questionSetId: set1.set.id,
    slides: [
      slideTitle('Powtórka klas 1-3', 'Litery, głoski, sylaby i ortografia'),
      slideText('Alfabet polski', `Alfabet polski liczy **32 litery**.

Litery to znaki, które **piszemy**. Głoski to dźwięki, które **słyszymy** i **wymawiamy**.

Uwaga: nie zawsze liczba liter = liczba głosek. Przykłady:
- **dz**, **dż**, **dź**, **sz**, **cz**, **rz**, **ch** to **dwuznaki** - dwie litery, jedna głoska
- **si**, **ci**, **zi**, **ni**, **dzi** przed samogłoską - dwie litery, jedna głoska (np. "**si**wy" -> głoski: ś,i,w,y)`),
      slideText('Samogłoski i spółgłoski', `**Samogłoski** (jest ich 8): **a, e, i, o, u, y, ą, ę**

Wszystkie pozostałe to **spółgłoski** (np. b, c, d, f, g, h, k, l, m...).

Wskazówka: przy samogłosce buzia jest otwarta, powietrze płynie swobodnie.`),
      slideTask('Z1', 'Nazwij samogłoski w wyrazach', `W każdym wyrazie **znajdź i policz samogłoski**:

- kot
- książka
- ekierka
- parasolka
- Antonina

Zapisz w zeszycie: **wyraz - samogłoski - ile ich jest**.`, 4, 120),
      slideText('Sylaby', `**Sylaba** to najmniejsza część wyrazu, którą można wymówić za jednym otwarciem ust.

Każda sylaba musi mieć **przynajmniej jedną samogłoskę**.

Przykłady:
- **ma-ma** (2 sylaby)
- **kre-dka** albo **kred-ka** (2 sylaby)
- **te-le-fon** (3 sylaby)
- **te-le-wi-zor** (4 sylaby)

Podział na sylaby przydaje się, gdy **przenosimy wyraz** na końcu linijki - dzielimy tylko między sylabami.`),
      slideTask('Z2', 'Podziel na sylaby', `Podziel wyrazy na sylaby (możesz klaskać):

1. dom
2. lampa
3. jabłko
4. samolot
5. biblioteka
6. koleżanka

**Klaskajcie razem** - każda sylaba to jedno klaśnięcie.`, 5, 180),
      slideText('Dwuznaki: sz, cz, rz, ch, dz, dż, dź', `**Dwuznak** = dwie litery, jedna głoska.

W języku polskim spotykamy:
- **sz** (szafa, kosz)
- **cz** (czajnik, klucz)
- **rz** (rzeka, morze)
- **ch** (chleb, dach)
- **dz** (dzwon, bardzo)
- **dż** (dżem, drożdże)
- **dź** (dźwig, niedźwiedź)

Uwaga: to wciąż **jedna głoska**, choć piszemy dwiema literami.`),
      slideText('Zmiękczenia: si, ci, zi, ni, dzi', `Kiedy **s, c, z, n, dz** stoi przed samogłoską (a, e, o, u), a chcemy zmiękczyć - piszemy **si, ci, zi, ni, dzi**:

- **sia**no, **sie**dem, **sio**stra
- **cia**stko, **cie**pło, **cio**cia
- **zia**rno, **zie**mia, **zio**ło
- **nia**nia, **nie**bo, **nio**sę
- **dzia**dek, **dzie**cko, **dzió**b

Przed spółgłoską lub na końcu wyrazu używamy kresek: **ś, ć, ź, ń, dź** - np. **ś**wieca, **koń**, **ćw**iartka.`),
      slideText('Nosówki: ą, ę', `Litery **ą** i **ę** to **samogłoski nosowe** - powietrze uchodzi też przez nos.

- **ą**: **kąsać**, **piszą**, **wąż**
- **ę**: **ręce**, **węże**, **więc**

Uwaga na wymowę: przed **b, p** czasem słychać "om, em" (np. "z**ę**by" -> wymowa "zemby"), ale piszemy **ę**.`),
      slideText('Ortografia: ó czy u?', `**"Ó"** piszemy najczęściej:
- na końcu wyrazu, gdy wymienia się na **"o"**: st**ó**ł - st**o**ły, m**ó**j - m**o**ja, wr**ó**bel - wr**o**ble
- w końcówce **-ów, -ówka, -ówna**: Krak**ów**, ryb**ówka**, Nowak**ówna**

**"U"** piszemy:
- w końcówkach **-uje, -unek, -uś, -usek**: mal**uje**, rat**unek**, dziadzi**uś**
- na początku wielu wyrazów: **u**cho, **u**l, **u**ciekać (bez kreski)

**Zasada złota**: gdy da się wymienić na **o**, **e** albo **a** - piszemy **ó**.`),
      slideText('Ortografia: rz czy ż?', `**"Rz"** piszemy najczęściej:
- gdy wymienia się na **r**: mo**rz**e - mo**r**ski, wia**tr** - wie**trz**ny, ma**rz**ec - ma**r**cowy
- po literach **b, p, d, t, g, k, ch, j, w**: **brz**oza, **prz**yjaciel, **drz**ewo, **trz**y, **grz**yb

**"Ż"** piszemy:
- gdy wymienia się na **g, z, dz, h, s**: kr**ą**żek - kr**ą**g, mo**ż**e - mo**g**ę, blisko - bli**ż**szy
- w końcówkach **-arz, -erz** piszemy jednak **rz** (np. leka**rz**, pisa**rz**, żołnie**rz**)

Wyjątki trzeba zapamiętać: **rz**adko, ja**rz**yna; **ż**onkil, ka**ż**dy.`),
      slideText('Ortografia: ch czy h?', `**"Ch"** piszemy najczęściej:
- gdy wymienia się na **sz**: mu**ch**a - mu**sz**ka (nie zawsze - reguła pomocnicza!)
- po literze **s**: **sch**ody, **sch**owek
- na końcu wyrazu: da**ch**, kocha**m**

**"H"** piszemy:
- gdy wymienia się na **g, ż, z**: wa**h**adło - wa**g**a (rzadko wymienne)
- w wyrazach obcego pochodzenia: **h**erbata, **h**otel, **h**istoria, **h**okej

Większość słów w polskim jest przez **ch** - **h** to często słowa zapożyczone.`),
      slideRecap(set1.set.id),
      slideText('Podsumowanie', `Zapamiętaj:
- **8 samogłosek**: a, e, i, o, u, y, ą, ę
- **dwuznak** = 2 litery, 1 głoska (sz, cz, rz, ch, dz, dż, dź)
- każda **sylaba** musi mieć samogłoskę
- **ó** wymienia się na o/e/a; **u** nie wymienia
- **rz** wymienia się na **r**; **ż** na **g, z, dz, h, s**
- **ch** wymienia się na **sz**; **h** to często słowa obce`),
    ],
  };

  const lesson2: Omit<Lesson, 'id' | 'order'> = {
    classId,
    title: 'Powtórka 1-3: Części mowy, zdania, wielka litera',
    topic: 'Gramatyka i interpunkcja',
    status: 'planned',
    questionSetId: set2.set.id,
    slides: [
      slideTitle('Powtórka klas 1-3', 'Części mowy, zdania i interpunkcja'),
      slideText('Wyraz i zdanie', `**Wyraz** = pojedyncze słowo (np. kot, biegnie, niebieski).

**Zdanie** = grupa wyrazów, która mówi o czymś w sposób **skończony**. Zaczyna się **wielką literą**, kończy **kropką, znakiem zapytania albo wykrzyknikiem**.

Przykłady:
- "Ala ma kota." - zdanie
- "Kot Ali" - to nie jest jeszcze zdanie (brakuje czasownika, nie ma pełnej myśli)`),
      slideText('Rzeczownik', `**Rzeczownik** to część mowy, która nazywa **osoby, zwierzęta, rzeczy, zjawiska i uczucia**.

Odpowiada na pytania: **kto? co?**

Przykłady:
- osoby: **mama, tata, uczeń, Anna**
- zwierzęta: **pies, kot, motyl**
- rzeczy: **zeszyt, dom, komputer**
- zjawiska: **deszcz, tęcza, wiatr**
- uczucia: **radość, smutek, miłość**`),
      slideText('Czasownik', `**Czasownik** nazywa **czynność** lub **stan**.

Odpowiada na pytania: **co robi? co się z nim dzieje?**

Przykłady:
- czynności: **biegnie, pisze, śpiewa, czyta**
- stany: **śpi, siedzi, choruje, myśli**

Czasownik mówi też, **kiedy** coś się dzieje:
- **teraz** (czas teraźniejszy): pisze, biegnie
- **wczoraj** (czas przeszły): pisał, biegł
- **jutro** (czas przyszły): będzie pisał, pobiegnie`),
      slideText('Przymiotnik', `**Przymiotnik** określa **jaki, jaka, jakie** jest ktoś lub coś.

Odpowiada na pytania: **jaki? jaka? jakie? jacy? jakie?**

Przykłady:
- **wysoki** budynek, **wesoła** dziewczynka, **czerwone** jabłko
- **miły** kolega, **mądra** kobieta, **głupie** zwierzę

Przymiotniki opisują: kolor, kształt, wielkość, charakter, wiek itd.`),
      slideTask('Z1', 'Rozpoznaj część mowy', `Zapisz w zeszycie, jaka to część mowy (**R** - rzeczownik, **CZ** - czasownik, **P** - przymiotnik):

1. słońce
2. świeci
3. jasne
4. dziecko
5. uśmiecha
6. wesołe
7. plecak
8. ciężki

Sprawdzimy razem.`, 12, 240),
      slideText('Rodzaje zdań', `Ze względu na **cel wypowiedzi** rozróżniamy 4 rodzaje zdań:

1. **oznajmujące** - o czymś mówi. Kończy je **kropka**.
   *"Dzisiaj jest ładna pogoda."*

2. **pytające** - o coś pyta. Kończy je **znak zapytania**.
   *"Czy odrobiłeś lekcje?"*

3. **rozkazujące** - coś poleca. Kończy je **kropka** lub **wykrzyknik**.
   *"Usiądź prosto!"*

4. **wykrzyknikowe** - wyraża emocje. Kończy je **wykrzyknik**.
   *"Jak tu pięknie!"*`),
      slideTask('Z2', 'Jakie to zdanie?', `Do każdego zdania dopisz jego rodzaj (**O** - oznajmujące, **P** - pytające, **R** - rozkazujące, **W** - wykrzyknikowe):

1. Ale zimno na dworze!
2. Ile masz lat?
3. Zamknij drzwi.
4. Lubię czekoladę.
5. Czy pojedziemy nad morze?
6. Uwaga, samochód!

Zapisz w zeszycie.`, 15, 240),
      slideText('Znaki interpunkcyjne', `Na końcu zdania stawiamy:
- **kropkę** (.) - zdanie oznajmujące lub spokojny rozkaz
- **znak zapytania** (?) - zdanie pytające
- **wykrzyknik** (!) - zdanie wykrzyknikowe lub mocny rozkaz

W środku zdania:
- **przecinek** (,) - oddziela wyrazy, wyliczenia, części zdania (np. "Kupiłem jabłka, gruszki i śliwki.")
- **dwukropek** (:) - zapowiada wyliczenie lub czyjąś wypowiedź (np. "Mam trzy zwierzęta: psa, kota i chomika.")
- **myślnik** (-) - używany w dialogach

**Dialog** zapisujemy z myślnikiem na początku linijki:
- Cześć! - powiedziałem.
- Cześć, jak się masz? - odpowiedziała Ania.`),
      slideText('Wielka litera - kiedy?', `Wielką literę piszemy:
- **na początku zdania**: *"Dzisiaj jest środa."*
- w **imionach i nazwiskach**: *Jan Kowalski, Anna Nowak*
- w **nazwach miejscowości, państw, rzek, gór, mórz**: *Warszawa, Polska, Wisła, Tatry, Bałtyk*
- w **nazwach planet**: *Ziemia, Mars, Słońce* (jako gwiazda)
- w **tytułach książek, filmów**: *"Akademia Pana Kleksa"*
- z **grzeczności** (w listach): *Ty, Twój, Ciebie, Pan, Pani*

Małą literą piszemy nazwy dni tygodnia (poniedziałek), miesięcy (styczeń), narodowości przymiotnikowo (polski, angielski język), ale **narody rzeczownikowo - wielką**: Polak, Anglik.`),
      slideTask('Z3', 'Popraw pisownię', `Przepisz zdania do zeszytu, wstawiając wielkie litery tam, gdzie trzeba:

1. w niedzielę pojedziemy do warszawy.
2. mama kupiła książkę "harry potter".
3. moja siostra ania chodzi do klasy iv b.
4. najdłuższa rzeka w polsce to wisła.
5. mieszkamy w białymstoku.

Ile poprawek zrobiłeś w każdym zdaniu?`, 18, 300),
      slideText('Liczba pojedyncza i mnoga', `Rzeczowniki i czasowniki występują w **dwóch liczbach**:
- **pojedyncza** - jedna osoba/rzecz: **kot, dziecko, biegnie, pisze**
- **mnoga** - wiele osób/rzeczy: **koty, dzieci, biegną, piszą**

Uwaga na dziwne liczby mnogie:
- człowiek -> ludzie
- dziecko -> dzieci
- oko -> oczy
- ucho -> uszy
- ręka -> ręce
- brat -> bracia`),
      slideRecap(set2.set.id),
      slideText('Podsumowanie', `Zapamiętaj:
- **rzeczownik** (kto? co?), **czasownik** (co robi?), **przymiotnik** (jaki?)
- **4 rodzaje zdań**: oznajmujące, pytające, rozkazujące, wykrzyknikowe
- na końcu zdania: **. ? !**
- wielka litera: **początek zdania, imiona, nazwy własne**
- **liczba pojedyncza** i **mnoga**`),
    ],
  };

  const lesson3: Omit<Lesson, 'id' | 'order'> = {
    classId,
    title: 'Powtórka 1-3: Teksty i formy wypowiedzi',
    topic: 'Formy wypowiedzi',
    status: 'planned',
    questionSetId: set3.set.id,
    slides: [
      slideTitle('Powtórka klas 1-3', 'Teksty literackie i formy wypowiedzi'),
      slideText('Wiersz i proza', `**Wiersz** to utwór pisany w linijkach zwanych **wersami**. Często ma **rymy** i **rytm**.

**Rym** to podobne zakończenia wyrazów, np.:
- **kot** - **plot**
- **droga** - **noga**
- **niedziela** - **wesela**

**Proza** to zwykły tekst pisany zdaniami po sobie - np. opowiadanie, baśń, artykuł.

Jak rozpoznać wiersz? Ma **krótkie linijki** i **często się rymuje**.`),
      slideText('Bohater, miejsce, czas', `Każde opowiadanie ma:
- **bohatera** - osobę, o której opowiadamy (np. Ala, mama, pies Reksio)
- **miejsce akcji** - gdzie się dzieje (dom, szkoła, las)
- **czas akcji** - kiedy się dzieje (rano, latem, dawno temu)

**Bohater główny** = ten, o kim jest cała historia.
**Bohaterowie drugoplanowi** = ci, którzy pomagają lub są obok.`),
      slideTask('Z1', 'Bohaterowie znanych tekstów', `Przypomnij sobie znane baśnie i opowiadania. Dopisz **głównego bohatera** każdego tekstu:

1. "Czerwony Kapturek"
2. "Kopciuszek"
3. "Kubuś Puchatek"
4. "Akademia Pana Kleksa"
5. "Pippi Pończoszanka"
6. "Królewna Śnieżka"

Kto z nich jest **twoim ulubionym** bohaterem? Dlaczego?`, 25, 240),
      slideText('Baśń i legenda', `**Baśń** to opowieść **wymyślona**, pełna magii i cudów. Zwykle:
- zaczyna się: *"Dawno, dawno temu..."* / *"Za górami, za lasami..."*
- kończy: *"...i żyli długo i szczęśliwie."*
- złe jest ukarane, dobre nagrodzone

Przykłady: *Kopciuszek, Śnieżka, Jaś i Małgosia*

**Legenda** tłumaczy pochodzenie **prawdziwego miejsca** lub wydarzenia. Ma elementy fantastyczne, ale odnosi się do rzeczywistego świata.

Przykłady: *Legenda o Smoku Wawelskim, Legenda o Warsie i Sawie, Legenda o Lechu, Czechu i Rusie*`),
      slideText('Bajka', `**Bajka** to krótki utwór, w którym:
- bohaterami są **zwierzęta**, które mówią i zachowują się jak ludzie
- na końcu jest **morał** - nauka, wskazówka
- często pisana wierszem

Znane bajki napisał **Ignacy Krasicki** (np. "Wilk i owieczka", "Ptaszki w klatce") oraz **Jean de La Fontaine**.

Uwaga: w codziennym języku "bajka" znaczy też tyle co "baśń" - to normalne, ale w szkole warto znać różnicę.`),
      slideText('Opowiadanie ustne i pisemne', `**Opowiadanie** mówi o wydarzeniach ułożonych **w kolejności** - **co było najpierw**, **co później**, **jak się skończyło**.

Każde opowiadanie ma trzy części:
1. **Wstęp** - kto, gdzie, kiedy
2. **Rozwinięcie** - co się działo
3. **Zakończenie** - jak się skończyło

Używamy słówek: **najpierw, potem, nagle, w końcu, na zakończenie**.

Piszemy w **czasie przeszłym**: *pojechałem, zobaczyłem, wróciłem*.`),
      slideTask('Z2', 'Ułóż opowiadanie', `Ułóż krótkie opowiadanie (5-6 zdań) na jeden z tematów:
- **moja najlepsza wakacyjna przygoda**
- **jak spędziłem ostatnią sobotę**
- **najśmieszniejsza sytuacja z mojego życia**

Pamiętaj:
- **wstęp** (kto, gdzie, kiedy)
- **rozwinięcie** (co się działo - użyj słów: najpierw, potem, nagle)
- **zakończenie** (jak się skończyło)

Zapisz w zeszycie.`, 30, 420),
      slideText('Opis', `**Opis** mówi, **jak coś wygląda** - osoba, przedmiot, krajobraz, zwierzę.

W opisie używamy dużo **przymiotników** (jaki? jaka? jakie?).

**Opis osoby** - np. koleżanki:
- wygląd: wysoka, ma długie brązowe włosy, ciemne oczy
- ubiór: nosi jeansy i kolorowe bluzki
- charakter: wesoła, uczynna, mądra, lubi zwierzęta

**Opis przedmiotu** - np. plecaka:
- kolor: granatowy w biały wzorek
- kształt: prostokątny
- do czego służy: noszę w nim książki i zeszyty`),
      slideText('Życzenia i zaproszenie', `**Życzenia** piszemy z okazji: świąt, urodzin, imienin, sukcesu, ślubu, narodzin dziecka.

Przykład:
*Kochana Babciu!*
*Z okazji urodzin życzę Ci dużo zdrowia, radości i wielu wspaniałych chwil w gronie rodziny.*
*Twoja wnuczka Ania*

**Zaproszenie** musi zawierać:
- **kogo** zapraszamy
- **na co** (urodziny, dyskoteka, przedstawienie)
- **kiedy** (data i godzina)
- **dokąd** (adres)
- **kto** zaprasza

*Zapraszam Cię, Aniu, na moje 10 urodziny w sobotę 12 marca o godz. 15:00, u mnie w domu (ul. Kwiatowa 5). Marta*`),
      slideText('List i ogłoszenie', `**List** - do konkretnej osoby. Zawiera:
- **miejscowość i datę** w prawym górnym rogu
- **nagłówek** (Kochana Mamo, Drogi Wujku)
- **treść** (co chcesz przekazać)
- **pożegnanie** (Pozdrawiam, Ucałuj mocno)
- **podpis**

**Ogłoszenie** - dla wielu osób (na tablicy, w internecie). Musi być krótkie i konkretne:
- **kto** działa (imię/nazwa)
- **co** oferuje / czego szuka
- **jak się skontaktować** (telefon, e-mail)

Przykład: *"Uczeń klasy IV a odda za darmo szczeniaki. Kontakt: 500 100 200."*`),
      slideTask('Z3', 'Napisz zaproszenie', `Napisz zaproszenie do koleżanki/kolegi na jedno z wydarzeń:
- **twoje urodziny**
- **przedstawienie szkolne**
- **piknik klasowy**

Pamiętaj o wszystkich pięciu elementach: **kogo, na co, kiedy, dokąd, kto zaprasza**.

Masz 5 minut.`, 35, 300),
      slideRecap(set3.set.id),
      slideText('Podsumowanie', `Zapamiętaj:
- **wiersz** ma wersy i rymy; **proza** to zwykły tekst
- każdy tekst ma: **bohatera, miejsce, czas**
- **baśń** - wymyślona z magią; **legenda** - o prawdziwym miejscu; **bajka** - ze zwierzętami i morałem
- **opowiadanie**: wstęp - rozwinięcie - zakończenie
- **opis**: dużo przymiotników (jaki? jaka?)
- **zaproszenie**: kogo, na co, kiedy, dokąd, kto zaprasza`),
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

function slideText(title: string, body: string): Slide {
  return { id: newId(), kind: 'text', title, body };
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
