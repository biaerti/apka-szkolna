// Dopasowanie "starych" lekcji (juz wstawionych do klasy) do "nowych" definicji
// gotowych materialow (buildRecap13 / buildIntroLesson) po tytule - z tolerancja
// na brak polskich znakow diakrytycznych ORAZ na przestawiona kolejnosc slow w
// tytule (np. stara wersja kodu miala "Litery, glosek..." zamiast "Glosek,
// litery..."). Dzieki temu "Odswiez gotowe materialy" w Lessons.tsx znajduje
// pare nawet wtedy, gdy tresc w kodzie zdazyla sie zmienic od czasu wstawienia.

import type { Lesson, Question, QuestionSet, Slide } from '../../data/types';

export { titleMatchKey } from '../../lib/titleMatchKey';
import { titleMatchKey } from '../../lib/titleMatchKey';

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
  /**
   * Zestaw powtorkowy TEJ lekcji - od wycofania lustrzanych zestawow to zwykle
   * TEN SAM zestaw co newQuestionSet (reviewQuestionSetId lekcji wskazuje na
   * jej wlasny questionSetId, patrz src/lib/recap.ts). Zostaje osobnym polem,
   * zeby dzialaly starsze, jeszcze nieodswiezone lekcje z prawdziwie osobnym
   * zestawem powtorkowym.
   */
  newReviewQuestionSet?: QuestionSet;
  newReviewQuestions: Question[];
}

function questionsForTempSetId(fresh: FreshMaterialsBundle, tempSetId: string | undefined) {
  const set = fresh.questionSets.find((qs) => qs.id === tempSetId);
  const questions = fresh.questions.filter((q) => q.setId === tempSetId).sort((a, b) => a.order - b.order);
  return { set, questions };
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
    const { set: newQuestionSet, questions: newQuestions } = questionsForTempSetId(fresh, newLesson.questionSetId);
    const { set: newReviewQuestionSet, questions: newReviewQuestions } = questionsForTempSetId(
      fresh,
      newLesson.reviewQuestionSetId,
    );
    matches.push({ oldLesson, newLesson, newQuestionSet, newQuestions, newReviewQuestionSet, newReviewQuestions });
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

/**
 * Podmienia w slajdach lekcji tymczasowe id zestawow pytan na juz istniejace w
 * bazie. Przyjmuje mape fromId -> toId, bo lekcja moze miec dwa slajdy recap:
 * koncowy (wlasny zestaw) i poczatkowy (zestaw powtorkowy POPRZEDNIEJ lekcji).
 * Resolver zamiast plaskiej mapy, zeby wolno bylo policzyc docelowe id leniwie
 * (np. dopiero po znalezieniu lekcji-wlasciciela po tytule).
 */
export function remapRecapSlides(slides: Slide[], resolve: (tempId: string) => string | undefined): Slide[] {
  return slides.map((s) => {
    if (s.kind !== 'recap') return s;
    const mapped = resolve(s.questionSetId);
    return mapped ? { ...s, questionSetId: mapped } : s;
  });
}

/** Usuwa pola `id` ze slajdow - id sa losowane przy kazdym buildXxx, wiec nie moga wchodzic do porownania. */
function slidesFingerprint(slides: Slide[]): string {
  return JSON.stringify(slides.map(({ id: _id, ...rest }) => rest));
}

function questionsFingerprint(questions: Question[]): Array<[string, string]> {
  return [...questions].sort((a, b) => a.order - b.order).map((q) => [q.text, q.answer ?? ''] as [string, string]);
}

/** Fragment lekcji potrzebny do policzenia fingerprintu - wspolny dla Lesson i "surowej" definicji z kodu. */
type FingerprintableLesson = Pick<Lesson, 'title' | 'registerTopic' | 'curriculum' | 'slides'>;

/**
 * Wersja formatu fingerprintu. Rosnie za kazdym razem, gdy zmienia sie zestaw
 * pol wchodzacych do `lessonFingerprint` (np. dolozenie pytan powtorkowych) -
 * stare fingerprinty (zapisane w store.insertedFingerprints) przestaja wtedy
 * pasowac formatem, a nie trescia. `classifyMatch` sprawdza `v` PRZED
 * porownaniem trescii: niezgodnosc wersji = traktujemy jak brak fingerprintu
 * ('code-newer'), zeby sama zmiana formatu nie oznaczala fałszywie "lekcja
 * zostala recznie edytowana".
 */
export const FINGERPRINT_VERSION = 2;

/**
 * "Odcisk palca" tresci lekcji (tytul, wpis do dziennika, slajdy, pytania
 * zestawu wstepnego i pytania zestawu powtorkowego) - uzywany zarowno do
 * wykrywania "czy jest co odswiezac" (isMatchStale), jak i do zapamietywania w
 * store, jaka wersja z kodu zostala wstawiona (patrz store.ts:
 * insertedFingerprints), zeby po recznej edycji przez nauczyciela dalo sie
 * odroznic "kod ma nowsza wersje" od "nauczyciel edytowal recznie".
 */
export function lessonFingerprint(
  lesson: FingerprintableLesson,
  questions: Question[],
  reviewQuestions: Question[] = [],
): string {
  return JSON.stringify({
    v: FINGERPRINT_VERSION,
    title: lesson.title,
    registerTopic: lesson.registerTopic ?? '',
    curriculum: lesson.curriculum ?? [],
    slides: slidesFingerprint(lesson.slides),
    questions: questionsFingerprint(questions),
    reviewQuestions: questionsFingerprint(reviewQuestions),
  });
}

/** Pytania nalezace do zestawu lekcji `lesson`, posortowane jak w kole fortuny. */
function questionsOf(lesson: Lesson, allQuestions: Question[]): Question[] {
  return allQuestions
    .filter((q) => q.setId === lessonQuestionSetId(lesson))
    .sort((a, b) => a.order - b.order);
}

/** Pytania zestawu powtorkowego lekcji `lesson` (brak reviewQuestionSetId = brak zestawu). */
function reviewQuestionsOf(lesson: Lesson, allQuestions: Question[]): Question[] {
  if (!lesson.reviewQuestionSetId) return [];
  return allQuestions
    .filter((q) => q.setId === lesson.reviewQuestionSetId)
    .sort((a, b) => a.order - b.order);
}

/**
 * Czy wstawiona lekcja rozni sie trescia od aktualnej definicji w kodzie
 * (tytul, wpis do dziennika, slajdy, pytania). Dopasowanie po tytule mowi tylko
 * "to ten sam material"; dopiero to mowi, czy jest co odswiezac.
 */
export function isMatchStale(match: RefreshMatch, oldQuestions: Question[]): boolean {
  const oldQ = questionsOf(match.oldLesson, oldQuestions);
  const oldReviewQ = reviewQuestionsOf(match.oldLesson, oldQuestions);
  return (
    lessonFingerprint(match.oldLesson, oldQ, oldReviewQ) !==
    lessonFingerprint(match.newLesson, match.newQuestions, match.newReviewQuestions)
  );
}

export type RefreshClassification = 'code-newer' | 'manually-edited';

/** Dopasowanie do odswiezenia wraz z klasyfikacja, czemu tresc sie rozni. */
export interface ClassifiedRefreshMatch extends RefreshMatch {
  classification: RefreshClassification;
}

/** Czy zapisany fingerprint ma aktualna wersje formatu (patrz FINGERPRINT_VERSION). */
function hasCurrentFingerprintVersion(fingerprint: string): boolean {
  try {
    const parsed = JSON.parse(fingerprint) as { v?: number };
    return parsed.v === FINGERPRINT_VERSION;
  } catch {
    return false;
  }
}

/**
 * Odrozniala "lekcja rozni sie, bo kod ma nowsza wersje" od "lekcja rozni sie,
 * bo nauczyciel zmienil ja recznie w edytorze". Porownuje AKTUALNA tresc
 * lekcji z fingerprintem wersji, ktora zostala wstawiona/ostatnio odswiezona
 * (zapisanym w store przy wstawianiu/odswiezaniu). Jesli sa rowne - nikt nie
 * ruszal lekcji recznie, wiec roznica bierze sie z samego kodu. Jesli sa rozne
 * - ktos zmienil tresc recznie (fingerprint zapisanej wersji nie pasuje do
 * tego, co faktycznie jest w lekcji), wiec ciche nadpisanie zgubiloby te
 * zmiany. Brak zapisanego fingerprintu (stare dane sprzed tej funkcji) ORAZ
 * fingerprint w starym formacie (sprzed dolozenia pytan powtorkowych) spadaja
 * na dotychczasowe zachowanie - traktujemy jak "kod nowszy".
 */
export function classifyMatch(
  match: RefreshMatch,
  oldQuestions: Question[],
  insertedFingerprint: string | undefined,
): RefreshClassification {
  if (insertedFingerprint === undefined) return 'code-newer';
  if (!hasCurrentFingerprintVersion(insertedFingerprint)) return 'code-newer';
  const oldQ = questionsOf(match.oldLesson, oldQuestions);
  const oldReviewQ = reviewQuestionsOf(match.oldLesson, oldQuestions);
  const currentFingerprint = lessonFingerprint(match.oldLesson, oldQ, oldReviewQ);
  return currentFingerprint === insertedFingerprint ? 'code-newer' : 'manually-edited';
}
