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

/**
 * Aliasy starych tytulow gotowych materialow, ktore od czasu wstawienia
 * zmienily sie na tyle, ze nawet titleMatchKey (tolerancyjny na diakrytyki i
 * kolejnosc slow) ich nie znajdzie - bo zmienil sie sam ZESTAW SLOW w tytule.
 * Klucz: titleMatchKey STAREGO tytulu (z jakim lekcja mogla zostac wstawiona
 * u nauczyciela dawno temu), wartosc: titleMatchKey AKTUALNEGO tytulu z kodu,
 * na ktory nalezy go zmapowac.
 *
 * Przyklad: pierwsza wersja src/data/recap13.ts (commit e3c9c37) nazywala
 * trzecia lekcje "Powtórka 1-3: Teksty i formy wypowiedzi" - dzisiejsza,
 * merytorycznie ta sama lekcja to "Powtórka 1-3: Formy wypowiedzi i
 * czytanie" (ten sam zestaw pytan/temat: formy wypowiedzi, wiersz kontra
 * proza, baśń i legenda, opowiadanie, opis, zaproszenie).
 */
const TITLE_ALIASES: Record<string, string> = {
  [titleMatchKey('Powtorka 1-3: Teksty i formy wypowiedzi')]: titleMatchKey(
    'Powtórka 1-3: Formy wypowiedzi i czytanie',
  ),
};

/**
 * Znajduje w `classLessons` lekcje odpowiadajaca `newLesson`: najpierw wprost
 * po titleMatchKey (jak dotychczas), a gdy nic nie pasuje - po TITLE_ALIASES
 * (stary tytul z kodu, ktory zdazyl sie zmienic bardziej niz tylko kolejnoscia
 * slow/diakrytykami).
 */
function findOldLesson(classLessons: Lesson[], newLesson: Omit<Lesson, 'id' | 'order'>): Lesson | undefined {
  const key = titleMatchKey(newLesson.title);
  const direct = classLessons.find((l) => titleMatchKey(l.title) === key);
  if (direct) return direct;
  const aliasOldKey = Object.entries(TITLE_ALIASES).find(([, newKey]) => newKey === key)?.[0];
  if (!aliasOldKey) return undefined;
  return classLessons.find((l) => titleMatchKey(l.title) === aliasOldKey);
}

/** Znajduje pary (istniejaca lekcja w klasie <-> nowa definicja) po znormalizowanym tytule (patrz findOldLesson). */
export function matchLessonsForRefresh(
  classLessons: Lesson[],
  fresh: FreshMaterialsBundle,
): RefreshMatch[] {
  const matches: RefreshMatch[] = [];
  for (const newLesson of fresh.lessons) {
    const oldLesson = findOldLesson(classLessons, newLesson);
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
 * Wersja formatu fingerprintu - czysto informacyjna czesc `lessonFingerprint`,
 * zeby dwa fingerprinty policzone roznymi wersjami formatu (np. przed i po
 * dolozeniu pytan powtorkowych) nigdy nie wyszly przypadkiem rowne. Fingerprint
 * nigdzie juz nie jest trwale zapisywany (patrz classifyMatch) - sluzy tylko
 * doraznemu porownaniu w `isMatchStale`.
 */
export const FINGERPRINT_VERSION = 2;

/**
 * "Odcisk palca" tresci lekcji (tytul, wpis do dziennika, slajdy, pytania
 * zestawu wstepnego i pytania zestawu powtorkowego) - uzywany do wykrywania
 * "czy jest co odswiezac" (isMatchStale): porownanie biezacej tresci lekcji z
 * aktualna definicja z kodu. Rozroznieniem "kod nowszy" vs "recznie edytowane"
 * zajmuje sie osobno classifyMatch (jawna flaga, nie fingerprint).
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

/**
 * Odroznia "lekcja rozni sie, bo kod ma nowsza wersje" od "lekcja rozni sie,
 * bo nauczyciel zmienil ja recznie w edytorze". Dawniej wnioskowalismy to z
 * porownania fingerprintow tresci - ale bug w samym mechanizmie odswiezania
 * (np. zly remap zestawu powtorkowego przy jednym z wczesniejszych przebiegow)
 * mogl zapisac fingerprint niezgodny z faktyczna trescia i falszywie oznaczyc
 * lekcje jako "recznie edytowana", mimo ze nikt jej nie ruszal. Zamiast tego
 * `manuallyEdited` to WPROST flaga z store.manuallyEditedLessonIds, ustawiana
 * WYLACZNIE przy zapisie z LessonEditor (patrz updateLessonFromEditor) i
 * czyszczona przy kazdym odswiezeniu tej lekcji - nie da sie jej ustawic
 * przypadkiem samym refreshem/wstawieniem.
 */
export function classifyMatch(manuallyEdited: boolean): RefreshClassification {
  return manuallyEdited ? 'manually-edited' : 'code-newer';
}

/**
 * Rozwiazuje tymczasowy id zestawu (z buildXxx) na id w bazie, dla slajdu
 * recap OTWIERAJACEGO lekcje - wskazuje on na zestaw powtorkowy POPRZEDNIEJ
 * lekcji materialu, ktora moze byc odswiezana w tej samej petli (wtedy jej
 * nowy id jest w `updatedReviewSetIds`) albo juz istniec w bazie bez zmian
 * (wtedy bierzemy jej biezacy `reviewQuestionSetId`).
 */
export function resolveForeignReviewSetId(
  gradeLessons: Lesson[],
  tempId: string,
  freshBundle: FreshMaterialsBundle,
  updatedReviewSetIds: ReadonlyMap<string, string>,
): string | undefined {
  const owner = freshBundle.lessons.find((l) => l.reviewQuestionSetId === tempId);
  if (!owner) return undefined;
  const ownerOldLesson = gradeLessons.find((l) => titleMatchKey(l.title) === titleMatchKey(owner.title));
  if (!ownerOldLesson) return undefined;
  return updatedReviewSetIds.get(ownerOldLesson.id) ?? ownerOldLesson.reviewQuestionSetId;
}

/**
 * Zestawy pytan (z `questionSetIds`), na ktore po odswiezeniu (kazda lekcja ma
 * reviewQuestionSetId = questionSetId, patrz useReadyMaterials.refresh) nie
 * wskazuje juz ZADNA lekcja (questionSetId/reviewQuestionSetId) ani zaden
 * slajd recap zadnej lekcji. W praktyce to lustrzane zestawy powtorkowe
 * sprzed wycofania osobnych zestawow (patrz Lesson.reviewQuestionSetId) -
 * osierocone przez normalizacje reviewQuestionSetId. Usuwane razem z
 * pytaniami (store.removeQuestionSet kaskaduje), zeby "Odswiez wstawione
 * materialy" sprzatalo po sobie zamiast zostawiac osierocone duplikaty w
 * bazie. `lessons` powinno byc PELNA lista lekcji w store (nie tylko rocznika
 * odswiezanego materialu) - zestaw teoretycznie moze byc uzywany gdzie indziej.
 */
export function orphanedQuestionSetIds(lessons: Lesson[], questionSetIds: string[]): string[] {
  const referenced = new Set<string>();
  for (const l of lessons) {
    if (l.questionSetId) referenced.add(l.questionSetId);
    if (l.reviewQuestionSetId) referenced.add(l.reviewQuestionSetId);
    for (const s of l.slides) {
      if (s.kind === 'recap') referenced.add(s.questionSetId);
    }
  }
  return questionSetIds.filter((id) => !referenced.has(id));
}
