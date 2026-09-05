// Lekcja zapoznawcza: zestaw 20 pytan "Poznajmy sie" + lekcja z prezentacja.
// Kontrakt: implementacja w module powtorki. Sygnatura buildIntroLesson(grade, classIds)
// - lekcja nalezy do rocznika (grade), classIds trafiaja tylko do QuestionSet.classIds.
//
// Prezentacja to prawdziwe wprowadzenie do gry (kolo fortuny), ktora bedzie
// towarzyszyc klasie caly rok: pytanie do dzieci -> definicja gry -> zasady.
// Tresc zasad NIE jest duplikowana - slajdy, ktore powtarzaja regulamin,
// czerpia bezposrednio z `RULE_SECTIONS` w src/data/zasady.ts (jedno zrodlo
// prawdy, ta sama tresc trafia tez na wydruk A4).

import { newId } from './id';
import { RULE_SECTIONS, type RuleSection } from './zasady';
import type { Lesson, Question, QuestionSet, Slide, SlideArt } from './types';

export interface IntroBundle {
  lesson: Omit<Lesson, 'id' | 'order'>;
  questionSet: QuestionSet;
  questions: Question[];
}

const QUESTION_TEXTS: string[] = [
  'Jakie jest twoje ulubione zwierzę i dlaczego?',
  'Gdybyś mógł/mogła mieć supermoc, jaką byś wybrał/a?',
  'Co lubisz robić w wolnym czasie?',
  'Jakie jest twoje ulubione miejsce, w którym byłeś/aś na wakacjach?',
  'Coś, co potrafisz zrobić, a inni pewnie o tobie nie wiedzą?',
  'Jaki jest twój ulubiony film lub serial?',
  'Gdybyś mógł/mogła teleportować się gdziekolwiek na świecie, dokąd byś poszedł/poszła?',
  'Jaka jest twoja ulubiona gra (komputerowa, planszowa, podwórkowa)?',
  'Co najbardziej lubisz w naszej szkole?',
  'Jakbyś opisał/a siebie w trzech słowach?',
  'Jaki jest twój ulubiony przedmiot w szkole i dlaczego?',
  'Gdybyś mógł/mogła zjeść tylko jedno danie do końca życia, co by to było?',
  'Masz jakieś zwierzę domowe? Jakie i jak się nazywa?',
  'Co robisz zwykle w weekend?',
  'Jaka jest twoja ulubiona piosenka albo zespół/wykonawca?',
  'Gdybyś mógł/mogła spotkać dowolną postać z bajki/filmu, kogo byś wybrał/a?',
  'Jakie jest twoje marzenie na przyszłość - kim chciałbyś/chciałabyś zostać?',
  'Co lubisz robić z rodziną w wolnym czasie?',
  'Jaka jest najśmieszniejsza rzecz, jaka ci się ostatnio przydarzyła?',
  'Gdybyś mógł/mogła mieć dodatkową godzinę w ciągu dnia, co byś z nią zrobił/a?',
];

// ---------- Pomocnicze fabryki slajdow ----------

function slideTitle(title: string, subtitle?: string, art?: SlideArt): Slide {
  return { id: newId(), kind: 'title', title, subtitle, art };
}

function slideText(title: string, body: string, art?: SlideArt): Slide {
  return { id: newId(), kind: 'text', title, body, art };
}

function slideImage(url: string, caption?: string): Slide {
  return { id: newId(), kind: 'image', url, caption };
}

function slideNote(title: string, body: string): Slide {
  return { id: newId(), kind: 'note', title, body };
}

function slideRecap(questionSetId: string): Slide {
  return { id: newId(), kind: 'recap', questionSetId };
}

/** Znajduje sekcje zasad po tytule - zrodlo prawdy dla slajdow, ktore je omawiaja. */
function ruleSection(title: string): RuleSection {
  const found = RULE_SECTIONS.find((s) => s.title === title);
  if (!found) throw new Error(`Nie znaleziono sekcji zasad: ${title}`);
  return found;
}

/** Zamienia liste punktow na markdown-lite: nieuporzadkowana lista "- ...". */
function asBulletList(items: string[]): string {
  return items.map((item) => `- ${item}`).join('\n');
}

/**
 * Dzieli punkty sekcji na pasujace do wzorca i reszte. Uzywane, gdy jeden punkt
 * zasad zasluguje na wlasny slajd z ilustracja (np. "3 plusy = piatka").
 * Szukamy po tresci, a nie po indeksie - zasady bywaja przestawiane.
 */
function partitionItems(items: string[], match: RegExp): { matched: string[]; rest: string[] } {
  return {
    matched: items.filter((item) => match.test(item)),
    rest: items.filter((item) => !match.test(item)),
  };
}

// Progi procentowe ze sprawdzianow - jedno zrodlo dla slajdu "Sprawdziany i oceny"
// oraz dla notatki do zeszytu. Tresc zrodlowa to punkt o procentach w sekcji
// "Zeszyt i sprawdziany" (zasady.ts) - test w intro.test.ts pilnuje, zeby ta
// tablica i tekst zasad nie rozjechaly sie.
const GRADE_THRESHOLDS: { percent: number; grade: string }[] = [
  { percent: 33, grade: 'dwójka' },
  { percent: 50, grade: 'trójka' },
  { percent: 75, grade: 'czwórka' },
  { percent: 90, grade: 'piątka' },
  { percent: 98, grade: 'szóstka' },
];

/** Tworzy zestaw pytan i lekcje zapoznawcza (pierwsza lekcja integracyjna) dla wskazanego rocznika. */
export function buildIntroLesson(grade: string, classIds: string[]): IntroBundle {
  const setId = newId();
  const questionSet: QuestionSet = {
    id: setId,
    name: 'Poznajmy się',
    topic: 'Lekcja zapoznawcza',
    classIds,
    createdAt: new Date().toISOString(),
  };

  const questions: Question[] = QUESTION_TEXTS.map((text, i) => ({
    id: newId(),
    setId,
    text,
    order: i,
  }));

  const secGraKolo = ruleSection('Gramy w koło fortuny');
  const secWygranaPrzegrana = ruleSection('Co można wygrać, a co przegrać');
  const secPasy = ruleSection('Pasy');
  const secPlomby = ruleSection('Plomby da się odrobić');
  const secZleZachowania = ruleSection('Co liczy się jako przeszkadzanie');
  // Ostatni punkt sekcji mowi, za co uwagi NIE ma - dostaje wlasny slajd, bo dla
  // dziecka to najwazniejsze zdanie calej lekcji: nieumiejetnosc nie jest karana.
  const { matched: bezUwagi, rest: zleZachowania } = partitionItems(
    secZleZachowania.items,
    /NIE jest przeszkadzanie/i,
  );
  const secPrzeszkadzanie = ruleSection('Kiedy ktoś przeszkadza');
  const secLawki = ruleSection('Gdzie siedzimy');
  // Punkt o przelicznikach na oceny dostaje wlasny slajd z ilustracja "stopnie",
  // reszta zostaje przy definicjach plusa, kropki i plomby.
  const { matched: ocenyStopnie, rest: ocenyBiezace } = partitionItems(
    secWygranaPrzegrana.items,
    /piątka|jedynka/i,
  );
  const secLekcja = ruleSection('Jak wygląda nasza lekcja');
  const secZeszyt = ruleSection('Zeszyt i sprawdziany');
  // Punkt o procentach dostaje wlasny slajd z ilustracja "procenty", reszta
  // (numer i temat lekcji, notatki, powtorzenie przed sprawdzianem) zostaje
  // przy zeszycie. Szukamy po tresci, nie po indeksie.
  const { rest: zeszytBiezace } = partitionItems(secZeszyt.items, /procent/i);

  const lesson: Omit<Lesson, 'id' | 'order'> = {
    grade,
    title: 'Lekcja zapoznawcza',
    topic: 'Lekcja zapoznawcza',
    progress: {},
    questionSetId: setId,
    registerTopic: 'Poznajmy się - lekcja organizacyjna. Zasady pracy na lekcjach języka polskiego',
    curriculum: ['III.1.1', 'II.3.7', 'II.3.3'],
    slides: [
      // 1. Tytul
      slideTitle('Poznajmy się', `Język polski - klasa ${grade}`),

      // 2. Zdjecie nauczyciela (plik w public/bart.jpg)
      slideImage('/bart.jpg', 'Bartosz Kuniński'),

      // 3. Kim jestem - bez ilustracji, bo zdjecie jest slajd wczesniej
      slideText(
        'Kim jestem',
        `Jestem psychologiem i nauczycielem języka polskiego.

Pracuję też z komputerami i sztuczną inteligencją. Ten program napisałem sam - za chwilę zobaczycie w nim koło fortuny z waszymi imionami.`,
      ),

      // 4. Pytanie do klasy - tu mowia dzieci, slajd ma byc pusty celowo
      slideText('Co to jest gra?', '**Jakie gry znacie?**'),

      // 5. Definicja gry
      slideText(
        'Czym jest gra',
        `W każdej grze:

- są zasady
- można wygrać
- można przegrać
- jest nagroda i jest kara

Bez zasad nie ma gry.`,
        'gra',
      ),

      // 6. Przebieg lekcji (z zasady.ts)
      slideText('My też będziemy grać', asBulletList(secLekcja.items), 'przebieg'),

      // 7. Zapowiedz kola
      slideText(
        'Koło fortuny',
        `Na kole są wasze imiona i nazwiska.

Koło losuje, kto odpowiada.`,
        'kolo',
      ),

      // 8. Pierwsze pokazanie kola - nauczyciel kreci raz-dwa i wychodzi (Esc)
      slideRecap(setId),

      // 9. Plus, kropka, plomba (z zasady.ts, bez punktu o ocenach)
      slideText('Co można wygrać, a co przegrać', asBulletList(ocenyBiezace), 'oceny'),

      // 10. Przelicznik na oceny - wlasny slajd, bo to najwazniejsza konsekwencja
      slideText('Kiedy plusy zamieniają się w ocenę', asBulletList(ocenyStopnie), 'stopnie'),

      // 11. Nie zglaszamy sie + pasy (z zasady.ts)
      slideText('Nie zgłaszamy się', asBulletList([secGraKolo.items[1], ...secPasy.items]), 'pas'),

      // 12. Plomby da sie odrobic (z zasady.ts)
      slideText('Plomby da się odrobić', asBulletList(secPlomby.items), 'zadania'),

      // 13. Pytanie do klasy - znowu mowia dzieci
      slideText('Czy zachowujecie się grzecznie na lekcjach?', '**Co to znaczy: przeszkadzać?**'),

      // 14. Nazwanie zachowan (z zasady.ts) - zanim padnie slowo "konsekwencje",
      // klasa ma wiedziec dokladnie, o czym mowimy. Bez tego "uwaga" jest workiem
      // na wszystko i dzieci boja sie, ze dostana ja za zla odpowiedz.
      slideText('Co to znaczy przeszkadzać', asBulletList(zleZachowania), 'zleZachowania'),

      // 15. Kontra do poprzedniego slajdu - za co uwagi nie ma NIGDY (z zasady.ts).
      // Celowo bez listy i bez ilustracji: jedno zdanie na calym ekranie, zeby
      // wybrzmialo. Punkt zasad wchodzi tu jako akapit, nie jako kolejny bullet.
      slideText(
        'Za to nigdy nie ma uwagi',
        `**${bezUwagi[0]}**

Uwagi są wyłącznie za zachowanie - nigdy za to, że czegoś jeszcze nie umiesz.

Nie wiesz? Powiedz "nie wiem" albo weź pas. To uczciwe zagranie, nie przegrana.`,
      ),

      // 16. Eskalacja 1-2-3 (z zasady.ts)
      slideText('Kiedy ktoś przeszkadza', asBulletList(secPrzeszkadzanie.items), 'eskalacja'),

      // 15. Gdzie siedzimy (z zasady.ts)
      slideText('Gdzie siedzimy', asBulletList(secLawki.items), 'lawki'),

      // 16. Zeszyt (z zasady.ts, bez punktu o procentach)
      slideText('Zeszyt', asBulletList(zeszytBiezace), 'zeszyt'),

      // 17. Progi procentowe sprawdzianow - wlasny slajd, czytelnie rozbity na liste
      slideText(
        'Sprawdziany i oceny',
        asBulletList(GRADE_THRESHOLDS.map((t) => `${t.percent}% - ${t.grade}`)),
        'procenty',
      ),

      // 18. Instrukcja przed runda zapoznawcza - co uczen ma powiedziec
      slideText(
        'Kiedy koło cię wskaże',
        `Powiedz trzy rzeczy:

1. Jak się nazywasz.
2. Co lubisz robić.
3. Odpowiedz na pytanie, które wylosowało koło.

Dzisiaj nie ma plusów ani plomb. Dzisiaj się poznajemy.`,
        'kolo',
      ),

      // 19. Wlasciwa runda zapoznawcza - 20 pytan
      slideRecap(setId),

      // 20. Notatka do zeszytu
      slideNote(
        'Notatka do zeszytu',
        `**Temat: Zasady pracy na lekcjach języka polskiego**

- Koło losuje, kto odpowiada. Nie zgłaszamy się.
- Plus - dobra odpowiedź. Kropka - częściowa. Plomba - zła albo jej brak.
- 3 plusy = piątka. 3 plomby = jedynka.
- 3 pasy w miesiącu.
- Siadamy w najbliższych ławkach.
- Zeszyt w linie: numer, temat, notatki.
- Sprawdzian: 33% - 2, 50% - 3, 75% - 4, 90% - 5, 98% - 6.`,
      ),

      // 21. Zakonczenie
      slideTitle('Do zobaczenia!', 'Na następnej lekcji: powtórka z klas 1-3'),
    ],
  };

  return { lesson, questionSet, questions };
}
