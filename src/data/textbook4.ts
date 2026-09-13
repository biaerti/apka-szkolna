// Kolejnosc tematow z oficjalnego spisu tresci "Miedzy nami 4" (wydanie 2026/2027).
// Lekcje sa celowo szkieletem planu: Bartek zaznacza postep osobno dla kazdej
// klasy, a slajdy i pytania moze dopracowywac tylko do tematow, ktore prowadzi.

import type { Lesson, Question, QuestionSet } from './types';
import type { FreshMaterialsBundle } from '../components/lessons/refreshMaterials';
import { newId } from './id';

type Topic = [section: string, title: string, textbookPage: number, exercisePage?: number];

const TOPICS: Topic[] = [
  ['Wśród znajomych i przyjaciół - Powroty', 'Na starcie - „Tacy jesteśmy”', 14],
  ['Wśród znajomych i przyjaciół - Powroty', 'Pierwszy dzień - „Poranek na Zamku”', 18],
  ['Wśród znajomych i przyjaciół - Powroty', 'W sekretariacie szkoły - głoska a litera', 21, 7],
  ['Wśród znajomych i przyjaciół - Powroty', 'Aż w końcu nadchodzi moment... - „Może wy tego nie wiecie”', 24],
  ['Wśród znajomych i przyjaciół - Powroty', 'Książki - Twoja supermoc', 27],
  ['Wśród znajomych i przyjaciół - Powroty', 'U lekarza - samogłoski i spółgłoski', 29, 10],
  ['Wśród znajomych i przyjaciół - Powroty', 'Klik! Migawki z wakacji - zdjęcia', 31],
  ['Wśród znajomych i przyjaciół - Powroty', 'Nad morzem - pisownia rz wymiennego', 33, 12],
  ['Wśród znajomych i przyjaciół - Powroty', 'Słowa i spacje - ramowy plan zdarzeń', 36, 16],
  ['Wśród znajomych i przyjaciół - Powroty', 'Wakacje w przyszłości - „Rok 3000”', 38],
  ['Wśród znajomych i przyjaciół - Stworzyć więzi', 'Pamiętać o dobrych manierach - „Powitanie”', 42],
  ['Wśród znajomych i przyjaciół - Stworzyć więzi', 'Słowa i spacje - dialog', 44, 19],
  ['Wśród znajomych i przyjaciół - Stworzyć więzi', 'Szczerość za szczerość - „Zażegnać konflikt”', 46],
  ['Wśród znajomych i przyjaciół - Stworzyć więzi', 'Jacy jesteśmy - „Nieproszony gość”', 50],
  ['Wśród znajomych i przyjaciół - Stworzyć więzi', 'Razem jesteśmy oceanem - plakat', 55],
  ['Wśród znajomych i przyjaciół - Stworzyć więzi', 'Pocztówka od przyjaciół - pisownia ó wymiennego', 57, 21],
  ['Wśród znajomych i przyjaciół - Stworzyć więzi', 'Słowa i spacje - krótka wypowiedź pisemna', 59],
  ['Wśród znajomych i przyjaciół - Stworzyć więzi', 'Pracujemy ze słownikami - słownik ortograficzny', 62],
  ['Wśród znajomych i przyjaciół - Poznać przyjaciół', 'Spotkać przyjaciela - „Zły pomysł”', 64],
  ['Wśród znajomych i przyjaciół - Poznać przyjaciół', 'Wszyscy jesteśmy wyjątkowi - „Zoologiczny talent”', 67, 24],
  ['Wśród znajomych i przyjaciół - Poznać przyjaciół', 'Na koncercie - sylaba i wyraz', 68, 28],
  ['Wśród znajomych i przyjaciół - Poznać przyjaciół', 'Czarodziejka Smarkodziejka - „Selfie”', 70],
  ['Wśród znajomych i przyjaciół - Poznać przyjaciół', 'Nie każdy jest przyjacielem - plakat', 74],
  ['Wśród znajomych i przyjaciół - Poznać przyjaciół', 'Wiem, co to jest. Potrafię - Wśród znajomych i przyjaciół', 76],
  ['Wśród znajomych i przyjaciół - Poznać przyjaciół', 'Sprawdź siebie - „Wizyta”', 78],
  ['Wśród znajomych i przyjaciół - Poznać przyjaciół', '100/100! - Jak czytam tekst?', 79],

  ['W szkole - Obrazki ze szkolnego życia', 'Porozmawiajmy o szkole - zdjęcia', 82],
  ['W szkole - Obrazki ze szkolnego życia', 'Słowa i spacje - opis budynku', 84, 30],
  ['W szkole - Obrazki ze szkolnego życia', 'Czy książka może przemówić? - „Książka”', 87, 33],
  ['W szkole - Obrazki ze szkolnego życia', 'Potężna śnieżyca - pisownia ż wymiennego', 89, 34],
  ['W szkole - Obrazki ze szkolnego życia', 'Nauczeni współpracy? - „Rysiek i Królik”', 91],
  ['W szkole - Obrazki ze szkolnego życia', 'Międzynarodowy projekt - „Niespodziewana wizyta”', 97, 38],
  ['W szkole - Obrazki ze szkolnego życia', 'Polskie symbole państwowe - „Mazurek Dąbrowskiego”', 102],
  ['W szkole - Obrazki ze szkolnego życia', 'Słowa i spacje - piszemy e-wiadomości', 105],
  ['W szkole - Obrazki ze szkolnego życia', 'Z przymrużeniem oka - „W klasie”', 108],
  ['W szkole - Obrazki ze szkolnego życia', 'Konkurs szkolnej piosenki - przenoszenie wyrazów', 110, 41],
  ['W szkole - Obrazki ze szkolnego życia', 'Gryzmu-gryzmu, tararara - „Szkoła przyszłości”', 113],
  ['W szkole - Obrazki ze szkolnego życia', 'Słowa i spacje - jak notować', 116],
  ['W szkole - Szkoła w...', 'W różnych zakątkach świata - „Marzenia afrykańskich dzieci”', 119],
  ['W szkole - Szkoła w...', 'Ze słuchawką w uchu - pisownia ch wymiennego', 123, 46],
  ['W szkole - Szkoła w...', 'O wyzwaniach na emigracji - „Szczszcz..., czyli jak brzmi inność”', 125],
  ['W szkole - Szkoła w...', 'Słowa i spacje - jak umieścić dialog w tekście?', 128, 49],
  ['W szkole - Szkoła w...', 'O górach i chwilach w schronisku - pisownia ch', 131, 51],
  ['W szkole - Szkoła w...', 'Słowa i spacje - list tradycyjny', 133],
  ['W szkole - Szkoła w...', 'Podczas przerwy - pisownia rz po spółgłoskach', 136, 54],
  ['W szkole - Szkoła w...', 'Wiem, co to jest. Potrafię - W szkole', 138],
  ['W szkole - Szkoła w...', 'Sprawdź siebie - „Polowanie na potwora”', 140],
  ['W szkole - Szkoła w...', '100/100! - Jak czytam polecenia?', 143],

  ['Dom i jego okolice - Portrety', 'Dom z prawdziwego zdarzenia - „Trzy małe świnki”', 146],
  ['Dom i jego okolice - Portrety', 'Miejsce pełne tajemnic - „Strych”', 151, 59],
  ['Dom i jego okolice - Portrety', 'Fotografia z przeszłości - „Stara fotografia mojego taty”', 155, 62],
  ['Dom i jego okolice - Portrety', 'Wykapany dziadek, wykapana ciocia - wyrazy pokrewne', 158],
  ['Dom i jego okolice - Portrety', 'Ważna osoba dla wnuka - „A teraz posłuchaj...”', 160],
  ['Dom i jego okolice - Portrety', 'Słowa i spacje - życzenia', 163, 64],
  ['Dom i jego okolice - Portrety', 'W królewskich rodzinach - baśnie o księżniczkach', 166],
  ['Dom i jego okolice - Portrety', 'Ekscentryczny członek rodziny - „Ciotka Pati”', 170],
  ['Dom i jego okolice - Portrety', 'Dziecięcy koncert życzeń - pisownia ża-, żo-, żu-, ży-', 173, 67],
  ['Dom i jego okolice - Świat dorosłych, świat dzieci', 'Różne punkty widzenia - „Korzystna propozycja?”', 175],
  ['Dom i jego okolice - Świat dorosłych, świat dzieci', 'Wspólne zabawy - „Domowe przedstawienie”', 179],
  ['Dom i jego okolice - Świat dorosłych, świat dzieci', 'Wspólny wolny czas - „Leniuchowanie też ma sens”', 182],
  ['Dom i jego okolice - Świat dorosłych, świat dzieci', 'W pokoju dzieci - odmienne i nieodmienne części mowy', 184, 70],
  ['Dom i jego okolice - Świat dorosłych, świat dzieci', 'W kuchni państwa Paczków - pisownia zakończeń -ów, -ówka, -ówna', 187, 78],
  ['Dom i jego okolice - Świat dorosłych, świat dzieci', 'Pycha. Hau! Aaaa!!! - „Kanapka”', 190, 74],
  ['Dom i jego okolice - Świat dorosłych, świat dzieci', 'Słowa i spacje - podaj mi przepis na...', 193, 81],
  ['Dom i jego okolice - Świat dorosłych, świat dzieci', 'Historia zapisana w wafelku - „Przypadki chodzą po lodach”', 196],
  ['Dom i jego okolice - Świat dorosłych, świat dzieci', 'Kotlety Pawła - części mowy: rzeczownik', 199, 83],
  ['Dom i jego okolice - Poza domem', 'Nowy na podwórku - „Zielony Pies”', 203],
  ['Dom i jego okolice - Poza domem', 'Jaki to był dzień? - części mowy: przymiotnik', 208, 90],
  ['Dom i jego okolice - Poza domem', 'Jak w podwórkowych wyliczankach - „Wyliczanka”', 211, 96],
  ['Dom i jego okolice - Poza domem', 'Co robi dzidziuś w kałuży? - pisownia wyrazów z u', 213, 98],
  ['Dom i jego okolice - Poza domem', 'Niezwykły bohater - „Dżok. Legenda o psiej wierności”', 215],
  ['Dom i jego okolice - Poza domem', 'Co robią dziewczyny? Co się z nimi dzieje? - czasownik', 218, 102],
  ['Dom i jego okolice - Poza domem', 'Teraźniejszość. Przeszłość. Przyszłość - czasy czasownika', 222],
  ['Dom i jego okolice - Poza domem', 'Pewnego popołudnia - „Niedaleko pada jabłko...”', 225],
  ['Dom i jego okolice - Poza domem', 'Dosłownie i w przenośni - „Kwitną gawrony”', 229, 111],
  ['Dom i jego okolice - Poza domem', 'Jak było na treningu? - części mowy: przysłówek', 232, 112],
  ['Dom i jego okolice - Poza domem', 'Tosiu! Bądźże poważna! - komiks', 234],
  ['Dom i jego okolice - Poza domem', 'Pamiętaj! - ilustracja', 242],
  ['Dom i jego okolice - Poza domem', 'Wiem, co to jest. Potrafię - Dom i jego okolice', 244],
  ['Dom i jego okolice - Poza domem', 'Sprawdź siebie - „Na rynku w Muszynie”', 246],
  ['Dom i jego okolice - Poza domem', '100/100! - Jak odpowiadam na pytania?', 249],

  ['W świecie fantazji - W krainie baśni', 'Wkroczyć w świat fantazji - „Na wyspach Bergamutach”', 252],
  ['W świecie fantazji - W krainie baśni', 'Co to jest baśń? - „Kopciuszek, czyli szklany pantofelek”', 254],
  ['W świecie fantazji - W krainie baśni', 'W pracowni baśniopisarza', 262, 116],
  ['W świecie fantazji - W krainie baśni', 'W grodzisku - wypowiedzenia oznajmujące, pytające i rozkazujące', 266, 121],
  ['W świecie fantazji - W krainie baśni', 'Królewna Różyczka z Żółtego Wzgórza - pisownia ó niewymiennego', 270, 125],
  ['W świecie fantazji - W krainie baśni', 'Chować w sercu drogę - „W świecie baśni”', 273],
  ['W świecie fantazji - W krainie baśni', 'Zabawa z baśnią - „Zielony Kapturek”', 275],
  ['W świecie fantazji - W krainie baśni', 'Za złotą furtką - „Snów dobrych życzenia”', 279, 131],
  ['W świecie fantazji - W krainie baśni', 'Festiwal fantastyki - zdanie i równoważnik zdania', 282, 133],
  ['W świecie fantazji - W krainie baśni', 'Książka żyje... Naprawdę!', 285],
  ['W świecie fantazji - W krainie baśni', 'Wystawa baśniowych ilustracji - zdanie pojedyncze i złożone', 288, 137],
  ['W świecie fantazji - W krainie baśni', 'Banialuki nie tylko do nauki - „Bzdurniej, czyli turniej bzdur”', 291, 140],
  ['W świecie fantazji - W krainie legend', 'Ile prawdy w legendzie? - „Skąd się wzięła sól w Wieliczce i Bochni?”', 293],
  ['W świecie fantazji - W krainie legend', 'Legenda o mikołajku nadmorskim - „Bursztynowa korona”', 298],
  ['W świecie fantazji - W krainie legend', 'Jak powstało Jezioro Żabie - pisownia ż niewymiennego', 303, 145],
  ['W świecie fantazji - W krainie legend', 'Przepis królowej pszczół - „Legenda o piernikach toruńskich”', 306],
  ['W świecie fantazji - W krainie legend', 'Na turystycznym szlaku - pisownia wielką i małą literą', 309, 149],
  ['W świecie fantazji - W krainie legend', 'Legenda na scenie - „Niezwykły strażnik Bramy Wyżynnej”', 314],
  ['W świecie fantazji - W krainie legend', 'Wiem, co to jest. Potrafię - W świecie fantazji', 322],
  ['W świecie fantazji - W krainie legend', 'Sprawdź siebie - „Tytus, Romek i A’Tomek”', 324],
  ['W świecie fantazji - W krainie legend', '100/100! - Jak pracuję na sukces?', 329],

  ['Bank szalonych pomysłów', 'Literackie eksperymenty', 330],
  ['Bank szalonych pomysłów', '100/100! - Jak osiągam sukces w pisaniu dłuższej wypowiedzi?', 333],
  ['Bank szalonych pomysłów', 'Grupowe wyzwania', 334],
  ['Bank szalonych pomysłów', '100/100! - Jak osiągam sukces, pracując w grupie?', 335],
  ['Zaloguj się do świata książek - projekty czytelnicze', 'Strefa dłuższych opowieści, czyli jak planować czytanie', 336],
  ['Zaloguj się do świata książek - projekty czytelnicze', 'Portal Mistrza Czytania. Klucz do rozumienia świata i siebie', 338],
  ['Zaloguj się do świata książek - projekty czytelnicze', 'Wyobraźnia i dymki, czyli strefa komiksu', 342],
  ['Zaloguj się do świata książek - projekty czytelnicze', 'Czytelnicze akcje w akcji', 346],
  ['Zaloguj się do świata książek - projekty czytelnicze', '100/100! - Mistrzowie czytania', 348],
];

function noteFor(title: string): string {
  const titleParts = title.split(' - ');
  const skill = titleParts[titleParts.length - 1] ?? title;
  return [
    `Temat: ${title}`,
    `Najważniejsze pojęcie lub umiejętność: ${skill}.`,
    'Przykład albo ważne wydarzenie: ................................................................',
    'Wniosek z lekcji: ................................................................................',
  ].join('\n');
}

function promptsFor(title: string): string[] {
  const lower = title.toLocaleLowerCase('pl');
  if (/pisownia|głoska|litera|samogłosk|spółgłosk|sylab|części mowy|rzeczownik|przymiotnik|czasownik|przysłówek|zdani|wypowiedzeni|przecinek|wyraz/.test(lower)) {
    return [
      `Wyjaśnij własnymi słowami zasadę lub pojęcie z tematu „${title}”.`,
      'Podaj własny poprawny przykład i uzasadnij odpowiedź.',
      'Jaki błąd najłatwiej tu popełnić i jak można go sprawdzić?',
    ];
  }
  if (/opis|dialog|list|wiadomo|życzeni|przepis|plan|notować|pisemna|pisani/.test(lower)) {
    return [
      `Jakie elementy musi zawierać forma wypowiedzi omawiana w temacie „${title}”?`,
      'W jakiej kolejności najlepiej ułożyć informacje?',
      'Podaj jedną zasadę językową lub graficzną ważną przy pisaniu.',
    ];
  }
  return [
    `Jaki jest główny temat materiału „${title}”?`,
    'Który fragment, obraz albo wydarzenie jest najważniejsze i dlaczego?',
    'Jaki wniosek można zapisać po tej lekcji?',
  ];
}

export function buildTextbook4(grade: string, classIds: string[]): FreshMaterialsBundle {
  if (grade.toUpperCase() !== 'IV') throw new Error('Podręcznik jest przygotowany dla klasy IV.');
  const questionSets: QuestionSet[] = [];
  const questions: Question[] = [];
  const lessons: Array<Omit<Lesson, 'id' | 'order'>> = TOPICS.map(([dzial, title, textbookPage, exercisePage]) => {
    const setId = newId();
    questionSets.push({ id: setId, name: title, topic: title, classIds, createdAt: new Date().toISOString() });
    promptsFor(title).forEach((text, order) => questions.push({ id: newId(), setId, text, order }));
    return {
      grade,
      title,
      registerTopic: title,
      materialType: 'textbook',
      textbookPage,
      exercisePage,
      notebookNote: noteFor(title),
      questionSetId: setId,
      reviewQuestionSetId: setId,
      dzial,
      progress: {},
      slides: [],
    };
  });
  return { lessons, questionSets, questions };
}

export const TEXTBOOK4_TOPIC_COUNT = TOPICS.length;
