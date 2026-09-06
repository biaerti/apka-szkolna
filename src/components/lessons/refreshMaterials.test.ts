import { describe, expect, it } from 'vitest';
import type { Lesson, Question } from '../../data/types';
import { classifyMatch, FINGERPRINT_VERSION, isMatchStale, type RefreshMatch } from './refreshMaterials';

/**
 * Testy klasyfikacji "kod ma nowsza wersje" vs "nauczyciel edytowal recznie".
 * Kontekst: "Odswiez wstawione materialy" dopasowuje lekcje po tytule i
 * porownuje tresc z aktualna definicja z kodu (isMatchStale) - ale sama
 * roznica nie mowi, KTO ja spowodowal. classifyMatch odrozniania to,
 * porownujac aktualna tresc lekcji z fingerprintem WERSJI WSTAWIONEJ/ostatnio
 * odswiezonej (zapisanym w store.insertedFingerprints).
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

function question(partial: Partial<Question> & { id: string; setId: string }): Question {
  return { text: 'Pytanie', order: 0, ...partial };
}

function match(oldLesson: Lesson, newLesson: Omit<Lesson, 'id' | 'order'>): RefreshMatch {
  return { oldLesson, newLesson, newQuestionSet: undefined, newQuestions: [], newReviewQuestionSet: undefined, newReviewQuestions: [] };
}

describe('classifyMatch', () => {
  it('"code-newer": tresc lekcji nie zmienila sie od wstawienia - roznica bierze sie tylko z kodu', () => {
    const oldLesson = lesson({ id: 'l1', title: 'Fonetyka i ortografia', registerTopic: 'Fonetyka' });
    const newLesson: Omit<Lesson, 'id' | 'order'> = {
      ...oldLesson,
      registerTopic: 'Fonetyka i ortografia (v2)', // kod zmienil tresc
    };
    delete (newLesson as Partial<Lesson>).id;

    const m = match(oldLesson, newLesson);
    expect(isMatchStale(m, [])).toBe(true);

    // fingerprint zapisany przy wstawieniu = dokladnie to, co jest w oldLesson teraz
    const insertedFingerprint = JSON.stringify({
      v: FINGERPRINT_VERSION,
      title: oldLesson.title,
      registerTopic: oldLesson.registerTopic ?? '',
      curriculum: oldLesson.curriculum ?? [],
      slides: JSON.stringify(oldLesson.slides),
      questions: [],
      reviewQuestions: [],
    });

    expect(classifyMatch(m, [], insertedFingerprint)).toBe('code-newer');
  });

  it('"manually-edited": nauczyciel zmienil tresc recznie po wstawieniu - aktualna tresc nie pasuje do zapisanego fingerprintu', () => {
    const oldLesson = lesson({ id: 'l1', title: 'Fonetyka i ortografia', registerTopic: 'Zmieniony przez nauczyciela' });
    const newLesson: Omit<Lesson, 'id' | 'order'> = {
      ...oldLesson,
      registerTopic: 'Fonetyka i ortografia (v2) z kodu',
    };
    delete (newLesson as Partial<Lesson>).id;

    const m = match(oldLesson, newLesson);
    expect(isMatchStale(m, [])).toBe(true);

    // fingerprint zapisany przy wstawieniu odpowiadal STAREJ tresci (przed reczna edycja nauczyciela)
    const insertedFingerprint = JSON.stringify({
      v: FINGERPRINT_VERSION,
      title: oldLesson.title,
      registerTopic: 'Oryginalny wpis z kodu',
      curriculum: [],
      slides: JSON.stringify(oldLesson.slides),
      questions: [],
      reviewQuestions: [],
    });

    expect(classifyMatch(m, [], insertedFingerprint)).toBe('manually-edited');
  });

  it('"code-newer": zapisany fingerprint ma stara wersje formatu (sprzed dolozenia pytan powtorkowych) - traktujemy jak brak fingerprintu', () => {
    const oldLesson = lesson({ id: 'l1', title: 'Fonetyka i ortografia', registerTopic: 'Zmieniony przez nauczyciela' });
    const newLesson: Omit<Lesson, 'id' | 'order'> = { ...oldLesson, registerTopic: 'Z kodu' };
    delete (newLesson as Partial<Lesson>).id;
    const m = match(oldLesson, newLesson);

    // Stary format bez pola "v" i "reviewQuestions" - fingerprint sprzed tej zmiany.
    const oldFormatFingerprint = JSON.stringify({
      title: oldLesson.title,
      registerTopic: oldLesson.registerTopic ?? '',
      curriculum: oldLesson.curriculum ?? [],
      slides: JSON.stringify(oldLesson.slides),
      questions: [],
    });

    expect(classifyMatch(m, [], oldFormatFingerprint)).toBe('code-newer');
  });

  it('brak zapisanego fingerprintu (stare dane sprzed tej funkcji) spada na dotychczasowe zachowanie ("code-newer")', () => {
    const oldLesson = lesson({ id: 'l1' });
    const newLesson: Omit<Lesson, 'id' | 'order'> = { ...oldLesson, title: 'Nowy tytul z kodu' };
    delete (newLesson as Partial<Lesson>).id;

    const m = match(oldLesson, newLesson);
    expect(classifyMatch(m, [], undefined)).toBe('code-newer');
  });

  it('bierze pod uwage tez pytania zestawu przypisanego do lekcji', () => {
    const oldLesson = lesson({ id: 'l1', questionSetId: 'qs1' });
    const oldQuestions = [question({ id: 'q1', setId: 'qs1', text: 'Zmienione recznie przez nauczyciela' })];
    const newLesson: Omit<Lesson, 'id' | 'order'> = { ...oldLesson };
    delete (newLesson as Partial<Lesson>).id;

    const m: RefreshMatch = {
      oldLesson,
      newLesson,
      newQuestionSet: undefined,
      newQuestions: [question({ id: 'q1-fresh', setId: 'tmp', text: 'Pytanie z nowej wersji kodu' })],
      newReviewQuestionSet: undefined,
      newReviewQuestions: [],
    };

    const insertedFingerprint = JSON.stringify({
      v: FINGERPRINT_VERSION,
      title: oldLesson.title,
      registerTopic: '',
      curriculum: [],
      slides: JSON.stringify(oldLesson.slides),
      questions: [['Oryginalne pytanie z wstawienia', '']],
      reviewQuestions: [],
    });

    expect(classifyMatch(m, oldQuestions, insertedFingerprint)).toBe('manually-edited');
  });
});
