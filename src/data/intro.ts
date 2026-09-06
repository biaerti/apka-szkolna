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

/**
 * Topic zestawu pytan lekcji zapoznawczej - po nim modul powtorki poznaje, ze
 * to ta lekcja (RecapSession: tryb po kolei, pytania losowe, bez ocen).
 */
export const INTRO_SET_TOPIC = 'Lekcja zapoznawcza';

/**
 * Glowne polecenie na ekranie kola w tej lekcji. Dziecko ma przede wszystkim
 * POWIEDZIEC, kim jest - wylosowane pytanie jest tylko dodatkiem, wiec na
 * ekranie stoi mniejsze, pod poleceniem (patrz QuestionPanel `prompt`).
 */
export const INTRO_PROMPT = 'Przedstaw się';
export const INTRO_PROMPT_HINT = 'imię i nazwisko, i co lubisz robić';

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

/**
 * Slajd z tematem lekcji do zeszytu. Bez wlasnej tresci - temat bierze sie z
 * lekcji (registerTopic), a kod (np. 4.3) dokleja SlideView, wiec zeszyt,
 * dziennik i lista lekcji zawsze mowia to samo.
 */
function slideTopic(): Slide {
  return { id: newId(), kind: 'topic' };
}

function slideText(title: string, body: string, art?: SlideArt): Slide {
  return { id: newId(), kind: 'text', title, body, art };
}

/** Slajd ze zdjeciem - opcjonalnie z naglowkiem i/albo tekstem obok (patrz ImageSlideView). */
function slideImage(opts: { url: string; title?: string; body?: string; caption?: string }): Slide {
  return { id: newId(), kind: 'image', ...opts };
}

function slideNote(title: string, body: string): Slide {
  return { id: newId(), kind: 'note', title, body };
}

/** variant 'demo' = pierwsze, "surowe" pokazanie kola - bez trybu "Przedstaw się". */
function slideRecap(questionSetId: string, variant?: 'demo'): Slide {
  return { id: newId(), kind: 'recap', questionSetId, ...(variant ? { variant } : {}) };
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
 * Pogrubia nazwy obu kol w tresci zasad. Rozroznienie "koło po lekcji" vs
 * "koło powtórzeniowe" to najwazniejsza nomenklatura calego systemu - na
 * slajdzie musi rzucac sie w oczy, a sama tresc zostaje w zasady.ts.
 */
function boldNazwyKol(text: string): string {
  return text.replace(/(Koł[oa]) (po lekcji|powtórzeniow\w+)/gi, '**$1 $2**');
}

/** Zamienia liste punktow na markdown-lite: uporzadkowana lista "1. ...". */
function asNumberedList(items: string[]): string {
  return items.map((item, i) => `${i + 1}. ${item}`).join('\n');
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

// Progi procentowe ze sprawdzianow (skala WZO szkoly) - jedno zrodlo dla slajdu
// "Sprawdziany i oceny" oraz dla notatki do zeszytu. Tresc zrodlowa to punkt
// o procentach w sekcji "Zeszyt i sprawdziany" (zasady.ts) - test w
// intro.test.ts pilnuje, zeby ta tablica i tekst zasad nie rozjechaly sie.
const GRADE_THRESHOLDS: { range: string; grade: string }[] = [
  { range: '0-30%', grade: 'niedostateczny' },
  { range: '31-50%', grade: 'dopuszczający' },
  { range: '51-72%', grade: 'dostateczny' },
  { range: '73-85%', grade: 'dobry' },
  { range: '86-96%', grade: 'bardzo dobry' },
  { range: '97-100%', grade: 'celujący' },
];

/** Tworzy zestaw pytan i lekcje zapoznawcza (pierwsza lekcja integracyjna) dla wskazanego rocznika. */
export function buildIntroLesson(grade: string, classIds: string[]): IntroBundle {
  const setId = newId();
  const questionSet: QuestionSet = {
    id: setId,
    name: 'Poznajmy się',
    topic: INTRO_SET_TOPIC,
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
  const secZleZachowania = ruleSection('Co liczy się jako przeszkadzanie');
  // Ostatni punkt sekcji mowi, za co uwagi NIE ma - dostaje wlasny slajd, bo dla
  // dziecka to najwazniejsze zdanie calej lekcji: nieumiejetnosc nie jest karana.
  const { matched: bezUwagi, rest: zleZachowania } = partitionItems(
    secZleZachowania.items,
    /NIE jest przeszkadzanie/i,
  );
  // Dawna nazwa sekcji: "Kiedy ktos przeszkadza".
  const secEskalacja = ruleSection('Specjalne utrudnienia za zachowanie');
  const secLawki = ruleSection('Gdzie siedzimy');
  // Punkt o przelicznikach na oceny dostaje wlasny slajd z ilustracja "stopnie",
  // reszta zostaje przy definicjach plusa, kropki i plomby.
  const { matched: ocenyStopnie, rest: ocenyBiezace } = partitionItems(
    secWygranaPrzegrana.items,
    /piątka|jedynka/i,
  );
  const secLekcja = ruleSection('Jak wygląda nasza lekcja');
  // Punkt o kodach zadan/lekcji zostaje wspomniany na koniec slajdu jako
  // osobne zdanie, trzy kroki (powtorka - temat - kolo) ida jako lista numerowana.
  const { matched: przebiegKod, rest: przebiegKroki } = partitionItems(secLekcja.items, /kod/i);
  // Slajd "Jak wyglada nasza lekcja" pojawia sie DWA RAZY: raz po przykladzie
  // rundy (zeby dzieci od razu wiedzialy, kiedy ktore kolo sie kreci) i drugi
  // raz po rozdziale o zachowaniu, jako przypomnienie calego przebiegu.
  // Kazde wywolanie daje nowy slajd z wlasnym id.
  const slideJakWygladaLekcja = () =>
    slideText(
      'Jak wygląda nasza lekcja',
      `${asNumberedList(przebiegKroki.map(boldNazwyKol))}

${przebiegKod[0]}`,
      'przebieg',
    );
  const secZeszyt = ruleSection('Zeszyt i sprawdziany');
  // Punkty o kodach lekcji (wszystkie zawieraja slowo "kod") dostaja wlasny
  // slajd "Kody lekcji" - dzieciom nalezy sie osobne, spokojne wytlumaczenie
  // systemu spisu tematow, a nie jedna linijka wsrod wyposazenia.
  const { matched: zeszytKody, rest: zeszytPoKodach } = partitionItems(secZeszyt.items, /kod/i);
  // Punkt o procentach zasila slajd z progami ocen (ilustracja "procenty"),
  // reszta (numer i temat lekcji, notatki, powtorzenie przed sprawdzianem)
  // trafia na slajd "Co bedzie potrzebne". Szukamy po tresci, nie po indeksie.
  const { rest: zeszytBiezace } = partitionItems(zeszytPoKodach, /procent/i);

  const jestOsmoklasista = grade === 'VIII';

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

      // 2. Temat do zeszytu - z kodem lekcji, ktory dzieci zapisuja przy temacie
      slideTopic(),

      // 3. Kim jestem - zdjecie i tekst na jednym slajdzie (plik w public/bart.jpg)
      slideImage({
        url: '/bart.jpg',
        title: 'Kim jestem',
        body: 'Jestem psychologiem i nauczycielem języka polskiego. Pracuję też z komputerami i sztuczną inteligencją.',
      }),

      // 4. Co bedzie potrzebne - zeszyt plus reszta sekcji "Zeszyt i sprawdziany"
      // (bez punktow o kodach i o procentach - te maja wlasne slajdy)
      slideText(
        'Co będzie potrzebne',
        asBulletList(['Zeszyt w linie - podpisany, przynosimy na każdą lekcję.', ...zeszytBiezace]),
        'zeszyt',
      ),

      // 5. Kody lekcji - osobny slajd, zeby wytlumaczenie bylo czytelne
      slideText('Kody lekcji', asBulletList(zeszytKody), 'zeszyt'),

      // 6. Zapowiedz trzech kategorii ocen - lista numerowana
      slideText(
        'Za co będą oceny',
        asNumberedList([
          'Klasówki i kartkówki.',
          'Dyktanda, projekty grupowe, recytacja - ich zasady poznacie w ciągu roku, kiedy przyjdzie na nie czas.',
          'Odpowiedzi ustne na lekcji - na każdej lekcji. O tym za chwilę więcej.',
        ]),
      ),

      // 7. Progi procentowe sprawdzianow - wlasny slajd, czytelnie rozbity na liste
      slideText(
        'Klasówki i kartkówki - progi ocen',
        `${asBulletList(GRADE_THRESHOLDS.map((t) => `${t.range} - ${t.grade}`))}

Te progi obowiązują w całej szkole (WZO) - to nie mój wymysł, tak oceniają wszyscy nauczyciele.`,
        'procenty',
      ),

      // 8. Przejscie do trzeciej kategorii - odpowiedzi ustne jako gra
      slideText(
        'Odpowiedzi ustne = gra',
        'Trzecia kategoria to odpowiedzi ustne. **U nas to jest gra.**',
      ),

      // 9. Pytanie do klasy - tu mowia dzieci, slajd ma byc pusty celowo
      slideText('Co to jest gra?', '**Jakie gry znacie? Jakie mają zasady?**'),

      // 10. Definicja gry + sens zasad (nie autorytarnie - zasady chronia gre i graczy)
      slideText(
        'Czym jest gra',
        `W każdej grze:

- są zasady
- można wygrać
- można przegrać
- jest nagroda i jest kara

Bez zasad nie ma gry.

Zasady są po to, żeby dało się grać uczciwie. Są jawne i takie same dla wszystkich - decyduje los, nie ja. ${
          jestOsmoklasista
            ? 'W tym roku czeka was egzamin ósmoklasisty - ta gra to trening przed nim.'
            : 'Ta gra to trening - trenujemy jak drużyna.'
        }`,
        'gra',
      ),

      // 11. Teleturniej Kolo Fortuny - sam naglowek i zdjecie, bez tekstu
      slideImage({ url: '/kolo-fortuny.jpg', title: 'Znacie teleturniej Koło Fortuny?' }),

      // 12. Koło fortuny - jak dziala u nas (z zasady.ts)
      slideText(
        'Koło fortuny',
        asBulletList(['Na kole są wasze imiona i nazwiska.', secGraKolo.items[1]]),
        'kolo',
      ),

      // 13. Pierwsze pokazanie kola - nauczyciel kreci raz-dwa i wychodzi (Esc).
      // Demo: dziala jak zwykla runda (bez "Przedstaw się", bez ocen).
      slideRecap(setId, 'demo'),

      // 14. Plus, kropka, plomba (z zasady.ts, bez punktu o ocenach)
      slideText('Co można wygrać, a co przegrać', asBulletList(ocenyBiezace), 'oceny'),

      // 15. Przelicznik na oceny - wlasny slajd, bo to najwazniejsza konsekwencja
      slideText('Kiedy plusy zamieniają się w ocenę', asBulletList(ocenyStopnie), 'stopnie'),

      // 16. Pasy (z zasady.ts) - odrabianie plomb JUZ USUNIETE, nie przywracac
      slideText('Pasy', asBulletList(secPasy.items), 'pas'),

      // 17. Przyklad rundy na pytaniu, na ktorym widac roznice miedzy odpowiedziami.
      // To przyklad kola powtorzeniowego - na kole po lekcji mozna tylko zyskac.
      slideText(
        'Przykład rundy',
        `Pytanie: **"Wymień trzy znaki interpunkcyjne."** (koło powtórzeniowe)

- Wymieniasz trzy (np. kropka, przecinek, pytajnik) → plus
- Wymieniasz jeden albo dwa → kropka
- Odpowiadasz źle albo wcale → plomba
- Mówisz "pas" → nic się nie dzieje, ale zużywasz 1 z 2 pasów na ten miesiąc

Na kole po lekcji, zaraz po nowym temacie, można tylko zyskać - nie ma tu kropki ani plomby.`,
      ),

      // 18. Przebieg lekcji (z zasady.ts) - zaraz po przykladzie rundy, bo dopiero
      // tu widac, KIEDY kreci sie ktore kolo. Nazwy obu kol pogrubione.
      slideJakWygladaLekcja(),

      // 19. Dwa koła - najwazniejsze rozroznienie calego systemu. Tresc obu
      // punktow z zasady.ts (sekcja "Gramy w koło fortuny"), plus zdanie, ze
      // kola po lekcji nie trzeba sie bac.
      slideText(
        'Dwa koła: po lekcji i powtórzeniowe',
        `${asBulletList([secGraKolo.items[2], secGraKolo.items[3]].map(boldNazwyKol))}

Na **kole po lekcji** nie ma się czego bać - można tylko zyskać, nic nie szkodzi.

Na **kole powtórzeniowym** gra się o wszystko: plus, kropka albo plomba.`,
        'kolo',
      ),

      // 20. Eskalacja 1-2-3 (z zasady.ts) - NAJPIERW konsekwencje, powaga tematu
      slideText('Specjalne utrudnienia za zachowanie', asBulletList(secEskalacja.items), 'eskalacja'),

      // 21. Nazwanie zachowan (z zasady.ts) - DOPIERO TERAZ jasna definicja, co
      // dokladnie jest karane. Bez tego "uwaga" jest workiem na wszystko i dzieci
      // boja sie, ze dostana ja za zla odpowiedz. Punkt "to NIE jest
      // przeszkadzanie" wchodzi na koncu jako akapit (dawniej mial wlasny slajd
      // "Za to nigdy nie ma uwagi" - usuniety, zeby nie ciagnac tematu).
      slideText(
        'Co to znaczy przeszkadzać',
        `${asBulletList(zleZachowania)}

**${bezUwagi[0]}**`,
        'zleZachowania',
      ),

      // 22. Przypomnienie przebiegu lekcji - ten sam slajd co wyzej, tym razem
      // po rozdziale o zachowaniu, zeby zamknac czesc o zasadach.
      slideJakWygladaLekcja(),

      // 23. Gdzie siedzimy (z zasady.ts)
      slideText('Gdzie siedzimy', asBulletList(secLawki.items), 'lawki'),

      // 24. Slajd kontraktowy - zanim zaczniemy grac, dzieci moga zglaszac uwagi
      slideText(
        'Wasz głos',
        '**Czy coś jest niejasne? Co byście dodali albo zmienili?**\n\nZasady można wspólnie doszlifować.',
      ),

      // 25. Instrukcja przed runda zapoznawcza - co uczen ma powiedziec
      slideText(
        'Kiedy koło cię wskaże',
        `Powiedz trzy rzeczy:

1. Jak się nazywasz.
2. Co lubisz robić.
3. Odpowiedz na pytanie, które wylosowało koło.

Dzisiaj nie ma plusów ani plomb. Dzisiaj się poznajemy.`,
        'kolo',
      ),

      // 26. Wlasciwa runda zapoznawcza - 20 pytan
      slideRecap(setId),

      // 27. Notatka do zeszytu
      slideNote(
        'Notatka do zeszytu',
        `**Temat: Zasady pracy na lekcjach języka polskiego**

- Koło losuje, kto odpowiada. Nie zgłaszamy się.
- Koło po lekcji (po nowym temacie) - można tylko zyskać. Koło powtórzeniowe (na kolejnej lekcji) - gra się o wszystko.
- Plus - dobra odpowiedź. Kropka - częściowa. Plomba - zła albo jej brak.
- Rozliczenie na koniec miesiąca: 3 plusy = piątka, 3 plomby = jedynka.
- 2 pasy w miesiącu.
- Siadamy w najbliższych ławkach.
- Zeszyt w linie: numer, temat, notatki.
- Sprawdzian (progi WZO): 0-30% - 1, 31-50% - 2, 51-72% - 3, 73-85% - 4, 86-96% - 5, 97-100% - 6.`,
      ),

      // 28. Zakonczenie
      // Podtytul bez numerow klas - lekcja jest wspolna dla roznych rocznikow,
      // a zakres powtorki zalezy od rocznika (kl. IV: 1-3, kl. V: 1-4 itd.).
      slideTitle('Do zobaczenia!', 'Na następnej lekcji: powtórka z poprzednich klas'),
    ],
  };

  return { lesson, questionSet, questions };
}
