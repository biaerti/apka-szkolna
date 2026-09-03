// Lekcja zapoznawcza: zestaw 20 pytan "Poznajmy sie" + lekcja z prezentacja.
// Kontrakt: implementacja w module powtorki. Nie zmieniac sygnatury.

import { newId } from './id';
import type { Lesson, Question, QuestionSet, Slide } from './types';

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

function slideTitle(title: string, subtitle?: string): Slide {
  return { id: newId(), kind: 'title', title, subtitle };
}

function slideText(title: string, body: string): Slide {
  return { id: newId(), kind: 'text', title, body };
}

function slideRecap(questionSetId: string): Slide {
  return { id: newId(), kind: 'recap', questionSetId };
}

/** Tworzy zestaw pytan i lekcje zapoznawcza (pierwsza lekcja integracyjna) dla wskazanej klasy. */
export function buildIntroLesson(classId: string): IntroBundle {
  const setId = newId();
  const questionSet: QuestionSet = {
    id: setId,
    name: 'Poznajmy się',
    topic: 'Lekcja zapoznawcza',
    classIds: [classId],
    createdAt: new Date().toISOString(),
  };

  const questions: Question[] = QUESTION_TEXTS.map((text, i) => ({
    id: newId(),
    setId,
    text,
    order: i,
  }));

  const lesson: Omit<Lesson, 'id' | 'order'> = {
    classId,
    title: 'Lekcja zapoznawcza',
    topic: 'Lekcja zapoznawcza',
    status: 'planned',
    questionSetId: setId,
    registerTopic: 'Poznajmy się - lekcja organizacyjna i integracyjna',
    curriculum: ['III.1.1', 'II.3.7'],
    slides: [
      slideTitle('Poznajmy się', 'Język polski - klasa IV'),
      slideText(
        'Jak to działa',
        `- Każdy po kolei mówi swoje imię i jedną rzecz o sobie.
- Odpowiada na wylosowane pytanie.
- Słuchamy się nawzajem.`,
      ),
      slideText(
        'Zasady na naszych lekcjach',
        `- Na lekcję przynosimy zeszyt i podręcznik.
- Chcąc coś powiedzieć, podnosimy rękę.
- Na powtórkach losujemy pytania kołem fortuny: 2 pasy na tydzień dla każdego.
- Za podpowiadanie - minus.
- Za dobrą odpowiedź - plus.`,
      ),
      slideRecap(setId),
      slideTitle('Do zobaczenia!', 'Na następnej lekcji: powtórka z klas 1-3'),
    ],
  };

  return { lesson, questionSet, questions };
}
