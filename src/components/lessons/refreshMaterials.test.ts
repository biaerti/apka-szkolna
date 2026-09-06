import { describe, expect, it } from 'vitest';
import type { Lesson, Slide } from '../../data/types';
import {
  classifyMatch,
  isMatchStale,
  matchLessonsForRefresh,
  orphanedQuestionSetIds,
  remapRecapSlides,
  resolveForeignReviewSetId,
  titleMatchKey,
  type FreshMaterialsBundle,
  type RefreshMatch,
} from './refreshMaterials';

/**
 * Testy klasyfikacji "kod ma nowsza wersje" vs "nauczyciel edytowal recznie"
 * (classifyMatch - dziś jawna flaga, nie fingerprint), dopasowania po tytule z
 * aliasami starych tytulow (matchLessonsForRefresh) oraz sprzatania po
 * odswiezeniu osieroconych, zdublowanych zestawow powtorkowych
 * (orphanedQuestionSetIds) - scenariusz odzwierciedlajacy realne dane
 * nauczyciela: lekcja z osobnym, lustrzanym zestawem powtorkowym sprzed
 * wycofania osobnych zestawow (patrz Lesson.reviewQuestionSetId).
 */

function lesson(partial: Partial<Lesson> & { id: string }): Lesson {
  return {
    grade: 'IV',
    title: 'Fonetyka i ortografia',
    order: 0,
    progress: {},
    slides: [],
    ...partial,
  };
}

function recapSlide(id: string, questionSetId: string): Slide {
  return { id, kind: 'recap', questionSetId };
}

describe('classifyMatch', () => {
  it('"code-newer" gdy lekcja nie jest oznaczona jako edytowana recznie', () => {
    expect(classifyMatch(false)).toBe('code-newer');
  });

  it('"manually-edited" gdy lekcja ma ustawiona flage manuallyEditedLessonIds', () => {
    expect(classifyMatch(true)).toBe('manually-edited');
  });
});

describe('isMatchStale', () => {
  function match(oldLesson: Lesson, newLesson: Omit<Lesson, 'id' | 'order'>): RefreshMatch {
    return { oldLesson, newLesson, newQuestionSet: undefined, newQuestions: [], newReviewQuestionSet: undefined, newReviewQuestions: [] };
  }

  it('wykrywa roznice w trescii (np. registerTopic zmieniony w kodzie)', () => {
    const oldLesson = lesson({ id: 'l1', registerTopic: 'Stara wersja' });
    const newLesson: Omit<Lesson, 'id' | 'order'> = { ...oldLesson, registerTopic: 'Nowa wersja z kodu' };
    delete (newLesson as Partial<Lesson>).id;
    expect(isMatchStale(match(oldLesson, newLesson), [])).toBe(true);
  });

  it('brak roznicy w trescii (identyczne pola) = nic do odswiezenia', () => {
    const oldLesson = lesson({ id: 'l1', registerTopic: 'Ta sama tresc' });
    const newLesson: Omit<Lesson, 'id' | 'order'> = { ...oldLesson };
    delete (newLesson as Partial<Lesson>).id;
    expect(isMatchStale(match(oldLesson, newLesson), [])).toBe(false);
  });
});

describe('matchLessonsForRefresh - dopasowanie po tytule z aliasami', () => {
  it('dopasowuje wprost po znormalizowanym tytule (bez aliasu)', () => {
    const oldLesson = lesson({ id: 'l1', title: 'Powtórka 1-3: Głoski, litery, sylaby, ortografia' });
    const fresh: FreshMaterialsBundle = {
      lessons: [{ grade: 'IV', title: 'Powtórka 1-3: Litery, głoski, sylaby, ortografia', progress: {}, slides: [] }],
      questionSets: [],
      questions: [],
    };
    const matches = matchLessonsForRefresh([oldLesson], fresh);
    expect(matches).toHaveLength(1);
    expect(matches[0].oldLesson.id).toBe('l1');
  });

  it('dopasowuje przez alias, gdy tytul zmienil sie bardziej niz kolejnoscia slow/diakrytykami', () => {
    // Dokladnie produkcyjny przypadek: najstarsza wersja src/data/recap13.ts (commit e3c9c37)
    // nazywala trzecia lekcje "Powtórka 1-3: Teksty i formy wypowiedzi" (u nauczyciela
    // zapisana bez polskich znakow: "Powtorka 1-3: Teksty i formy wypowiedzi") - dzisiejszy
    // tytul tej samej, merytorycznie lekcji to "Powtórka 1-3: Formy wypowiedzi i czytanie".
    const oldLesson = lesson({ id: 'l3', title: 'Powtorka 1-3: Teksty i formy wypowiedzi' });
    const fresh: FreshMaterialsBundle = {
      lessons: [{ grade: 'IV', title: 'Powtórka 1-3: Formy wypowiedzi i czytanie', progress: {}, slides: [] }],
      questionSets: [],
      questions: [],
    };
    const matches = matchLessonsForRefresh([oldLesson], fresh);
    expect(matches).toHaveLength(1);
    expect(matches[0].oldLesson.id).toBe('l3');
  });

  it('bez dopasowania (ani wprost, ani przez alias) - lekcja zostaje pominieta', () => {
    const oldLesson = lesson({ id: 'l9', title: 'Zupelnie inny temat' });
    const fresh: FreshMaterialsBundle = {
      lessons: [{ grade: 'IV', title: 'Powtórka 1-3: Formy wypowiedzi i czytanie', progress: {}, slides: [] }],
      questionSets: [],
      questions: [],
    };
    expect(matchLessonsForRefresh([oldLesson], fresh)).toHaveLength(0);
  });
});

describe('scenariusz produkcyjny: zdublowany zestaw powtorkowy sprzatany po odswiezeniu', () => {
  // Odtwarza dane nauczyciela: lekcja "4.1" ma juz znormalizowane
  // reviewQuestionSetId === questionSetId, lekcja "4.2" (odswiezana w tym
  // tescie) ma osobny, zdublowany zestaw powtorkowy ("setB-dup" - kopia
  // pytan z "setB"). Test odtwarza DOKLADNIE te kroki, ktore wykonuje
  // useReadyMaterials.refresh(): effectiveReviewSetId wymuszone rowne
  // effectiveSetId, remapRecapSlides ze slajdem otwierajacym wskazujacym na
  // POPRZEDNIA lekcje (resolveForeignReviewSetId), a na koniec
  // orphanedQuestionSetIds wykrywajace "setB-dup" jako osierocony duplikat.
  it('po odswiezeniu zostaje jeden zestaw, duplikat i jego pytania sa osierocone, slajd otwierajacy wskazuje zestaw poprzedniej lekcji', () => {
    const oldLessonA = lesson({
      id: 'A',
      title: 'Powtórka 1-3: Głoski, litery, sylaby, ortografia',
      questionSetId: 'setA',
      reviewQuestionSetId: 'setA', // juz znormalizowana wczesniej
      slides: [recapSlide('sA-close', 'setA')],
    });
    const oldLessonB = lesson({
      id: 'B',
      title: 'Powtórka 1-3: Części mowy, zdania, wielka litera',
      questionSetId: 'setB',
      reviewQuestionSetId: 'setB-dup', // BUG: osobny, zdublowany zestaw powtorkowy
      slides: [
        recapSlide('sB-open', 'setA'), // slajd otwierajacy - wraca do POPRZEDNIEJ lekcji
        recapSlide('sB-close', 'setB'), // slajd zamykajacy - wlasny zestaw lekcji B
      ],
    });
    const gradeLessons = [oldLessonA, oldLessonB];

    const freshLessonA = { grade: 'IV', title: oldLessonA.title, progress: {}, questionSetId: 'tmpA', reviewQuestionSetId: 'tmpA', slides: [] };
    const freshLessonB = {
      grade: 'IV',
      title: oldLessonB.title,
      progress: {},
      questionSetId: 'tmpB',
      reviewQuestionSetId: 'tmpB', // dzisiejszy kod juz nie generuje osobnych tempId
      slides: [recapSlide('newB-open', 'tmpA'), recapSlide('newB-close', 'tmpB')],
    };
    const freshBundle: FreshMaterialsBundle = {
      lessons: [freshLessonA, freshLessonB],
      questionSets: [],
      questions: [],
    };

    // --- symulacja jednego przebiegu refresh() dla lekcji B (A sie nie zmienia) ---
    const effectiveSetId = oldLessonB.questionSetId; // syncQuestionSetInPlace zachowuje istniejacy id
    const effectiveReviewSetId = effectiveSetId; // wymuszone rowne (patrz useReadyMaterials.refresh)
    const updatedReviewSetIds = new Map<string, string>([['B', effectiveReviewSetId!]]);

    const mappedSlides = remapRecapSlides(freshLessonB.slides, (tempId) => {
      if (tempId === freshLessonB.questionSetId) return effectiveSetId;
      if (tempId === freshLessonB.reviewQuestionSetId) return effectiveReviewSetId;
      return resolveForeignReviewSetId(gradeLessons, tempId, freshBundle, updatedReviewSetIds);
    });

    const updatedLessonB: Lesson = {
      ...oldLessonB,
      questionSetId: effectiveSetId,
      reviewQuestionSetId: effectiveReviewSetId,
      slides: mappedSlides,
    };

    // Jeden, wspolny zestaw pozostaje - reviewQuestionSetId === questionSetId.
    expect(updatedLessonB.questionSetId).toBe('setB');
    expect(updatedLessonB.reviewQuestionSetId).toBe('setB');

    // Slajd otwierajacy nadal wskazuje zestaw POPRZEDNIEJ lekcji (setA), a nie duplikat.
    const openingSlide = updatedLessonB.slides.find((s) => s.id === 'newB-open');
    expect(openingSlide).toMatchObject({ questionSetId: 'setA' });
    const closingSlide = updatedLessonB.slides.find((s) => s.id === 'newB-close');
    expect(closingSlide).toMatchObject({ questionSetId: 'setB' });

    // Po podmianie B w liscie lekcji, duplikat "setB-dup" nie jest juz przez nic wskazywany.
    const lessonsAfterRefresh = [oldLessonA, updatedLessonB];
    const orphans = orphanedQuestionSetIds(lessonsAfterRefresh, ['setA', 'setB', 'setB-dup']);
    expect(orphans).toEqual(['setB-dup']);

    // setA i setB zostaja - wciaz sa wskazywane (przez questionSetId/reviewQuestionSetId/slajdy).
    expect(orphanedQuestionSetIds(lessonsAfterRefresh, ['setA', 'setB'])).toEqual([]);
  });
});

describe('titleMatchKey', () => {
  it('ignoruje diakrytyki i kolejnosc slow (sanity check uzywany przez powyzsze testy)', () => {
    expect(titleMatchKey('Powtórka 1-3: Litery, głoski, sylaby')).toBe(
      titleMatchKey('Powtorka 1-3: Głoski, litery, sylaby'),
    );
  });
});
