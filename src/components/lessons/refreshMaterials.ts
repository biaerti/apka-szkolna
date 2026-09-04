// Dopasowanie "starych" lekcji (juz wstawionych do klasy) do "nowych" definicji
// gotowych materialow (buildRecap13 / buildIntroLesson) po tytule - z tolerancja
// na brak polskich znakow diakrytycznych ORAZ na przestawiona kolejnosc slow w
// tytule (np. stara wersja kodu miala "Litery, glosek..." zamiast "Glosek,
// litery..."). Dzieki temu "Odswiez gotowe materialy" w Lessons.tsx znajduje
// pare nawet wtedy, gdy tresc w kodzie zdazyla sie zmienic od czasu wstawienia.

import type { Lesson, Question, QuestionSet, Slide } from '../../data/types';

const DIACRITICS: Record<string, string> = {
  ą: 'a',
  ć: 'c',
  ę: 'e',
  ł: 'l',
  ń: 'n',
  ó: 'o',
  ś: 's',
  ź: 'z',
  ż: 'z',
};

function stripDiacritics(text: string): string {
  return text
    .toLowerCase()
    .split('')
    .map((ch) => DIACRITICS[ch] ?? ch)
    .join('');
}

/**
 * Klucz porownawczy tytulu lekcji/zestawu: male litery, bez polskich znakow,
 * slowa posortowane alfabetycznie (dzieki temu kolejnosc slow w zdaniu nie ma
 * znaczenia przy dopasowywaniu starej wersji do nowej).
 */
export function titleMatchKey(title: string): string {
  return stripDiacritics(title)
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .sort()
    .join(' ');
}

/** Paczka "swiezych" danych z kodu (buildRecap13 i/lub buildIntroLesson), gotowa do dopasowania. */
export interface FreshMaterialsBundle {
  lessons: Array<Omit<Lesson, 'id' | 'order'>>;
  questionSets: QuestionSet[]; // tymczasowe id - wygenerowane przez buildXxx, sluza tylko do mapowania
  questions: Question[]; // questionId.setId wskazuje na tymczasowe id powyzej
}

export interface RefreshMatch {
  oldLesson: Lesson;
  newLesson: Omit<Lesson, 'id' | 'order'>;
  newQuestionSet?: QuestionSet;
  newQuestions: Question[];
}

/** Znajduje pary (istniejaca lekcja w klasie <-> nowa definicja) po znormalizowanym tytule. */
export function matchLessonsForRefresh(
  classLessons: Lesson[],
  fresh: FreshMaterialsBundle,
): RefreshMatch[] {
  const matches: RefreshMatch[] = [];
  for (const newLesson of fresh.lessons) {
    const key = titleMatchKey(newLesson.title);
    const oldLesson = classLessons.find((l) => titleMatchKey(l.title) === key);
    if (!oldLesson) continue;
    const tempSetId = newLesson.questionSetId;
    const newQuestionSet = fresh.questionSets.find((qs) => qs.id === tempSetId);
    const newQuestions = fresh.questions
      .filter((q) => q.setId === tempSetId)
      .sort((a, b) => a.order - b.order);
    matches.push({ oldLesson, newLesson, newQuestionSet, newQuestions });
  }
  return matches;
}

/** Id zestawu pytan lekcji: pole questionSetId, a w razie jego braku (starsze dane) pierwszy slajd recap. */
export function lessonQuestionSetId(lesson: Lesson): string | undefined {
  if (lesson.questionSetId) return lesson.questionSetId;
  const recapSlide = lesson.slides.find(
    (s): s is Extract<Slide, { kind: 'recap' }> => s.kind === 'recap',
  );
  return recapSlide?.questionSetId;
}

/** Podmienia w slajdach lekcji tymczasowy id nowego zestawu na juz istniejacy w bazie. */
export function remapRecapSlides(slides: Slide[], fromId: string, toId: string): Slide[] {
  return slides.map((s) =>
    s.kind === 'recap' && s.questionSetId === fromId ? { ...s, questionSetId: toId } : s,
  );
}
