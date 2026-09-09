import { describe, expect, it } from 'vitest';
import { buildRecap4 } from './recap4';
import { buildRecap13 } from './recap13';
import { titleMatchKey } from '../components/lessons/refreshMaterials';

const CLASS_ID = 'klasa-testowa';

describe('buildRecap4', () => {
  it('tworzy szesc lekcji i szesc zestawow pytan (jeden zestaw na lekcje - bez osobnych zestawow powtorkowych)', () => {
    const bundle = buildRecap4('V', [CLASS_ID]);
    expect(bundle.lessons).toHaveLength(6);
    expect(bundle.questionSets).toHaveLength(6);
    for (const lesson of bundle.lessons) {
      expect(lesson.grade).toBe('V');
      expect(lesson.progress).toEqual({});
      expect(lesson.dzial).toBe('Powtórka klasy 4');
      // reviewQuestionSetId wskazuje na WLASNY zestaw lekcji (patrz src/lib/recap.ts).
      expect(lesson.reviewQuestionSetId).toBe(lesson.questionSetId);
    }
    for (const set of bundle.questionSets) {
      expect(set.classIds).toEqual([CLASS_ID]);
    }
  });

  it('lekcja 1 nie ma slajdu recap, kazda kolejna ma dokladnie jeden - otwierajacy (mode powtorzeniowe) na zestawie poprzedniej lekcji; brak slajdow po-lekcji', () => {
    const bundle = buildRecap4('V', [CLASS_ID]);
    bundle.lessons.forEach((lesson, idx) => {
      const recapSlides = lesson.slides.filter((s) => s.kind === 'recap');
      for (const slide of recapSlides) {
        if (slide.kind !== 'recap') throw new Error('spodziewany slajd recap');
        expect(slide.mode).not.toBe('po-lekcji');
      }

      if (idx === 0) {
        expect(recapSlides).toHaveLength(0);
        return;
      }

      expect(recapSlides).toHaveLength(1);
      const opening = recapSlides[0];
      if (opening.kind !== 'recap') throw new Error('spodziewany slajd recap');
      const previousLesson = bundle.lessons[idx - 1];
      expect(opening.questionSetId).toBe(previousLesson.questionSetId);
      expect(opening.mode).toBe('powtorzeniowe');
      expect(bundle.questionSets.some((qs) => qs.id === opening.questionSetId)).toBe(true);

      // Kolo powtorzeniowe jest na poczatku lekcji - przed pierwszym zadaniem.
      const recapIdx = lesson.slides.indexOf(opening);
      const firstTaskIdx = lesson.slides.findIndex((s) => s.kind === 'task');
      expect(firstTaskIdx).toBeGreaterThan(-1);
      expect(recapIdx).toBeLessThan(firstTaskIdx);
    });
  });

  // Zestaw lekcji sluzy kolu powtorzeniowemu na nastepnej lekcji: jedno pytanie na zadanie.
  it('zestaw lekcji ma tyle pytan, ile lekcja ma slajdow task (3-5)', () => {
    const bundle = buildRecap4('V', [CLASS_ID]);
    for (const lesson of bundle.lessons) {
      const taskCount = lesson.slides.filter((s) => s.kind === 'task').length;
      const questionCount = bundle.questions.filter((q) => q.setId === lesson.questionSetId).length;
      expect(taskCount).toBeGreaterThanOrEqual(3);
      expect(taskCount).toBeLessThanOrEqual(5);
      expect(questionCount).toBe(taskCount);
    }
  });

  // Pytanie na kolo sprawdza te sama umiejetnosc co zadanie, ale nie jest tym samym cwiczeniem.
  it('zadne pytanie nie powtarza tytulu ani tresci zadania z lekcji', () => {
    const bundle = buildRecap4('V', [CLASS_ID]);
    for (const lesson of bundle.lessons) {
      const tasks = lesson.slides.filter((s) => s.kind === 'task');
      const questions = bundle.questions.filter((q) => q.setId === lesson.questionSetId);
      for (const question of questions) {
        for (const task of tasks) {
          if (task.kind !== 'task') throw new Error('spodziewany slajd task');
          expect(question.text).not.toBe(task.title);
          expect(task.body.includes(question.text)).toBe(false);
        }
      }
    }
  });

  it('kazde pytanie ma odpowiedz i nalezy do istniejacego zestawu', () => {
    const bundle = buildRecap4('V', [CLASS_ID]);
    const setIds = new Set(bundle.questionSets.map((qs) => qs.id));
    expect(bundle.questions.length).toBeGreaterThan(0);
    for (const question of bundle.questions) {
      expect(question.text.trim()).not.toBe('');
      expect(question.answer?.trim()).toBeTruthy();
      expect(setIds.has(question.setId)).toBe(true);
    }
  });

  // Odswiezanie gotowych materialow dopasowuje lekcje po znormalizowanym tytule
  // (refreshMaterials.titleMatchKey). Gdyby ktorys tytul powtorki klasy 4 zderzyl
  // sie z tytulem z powtorki 1-3, "Odswiez gotowe materialy" podmienialoby lekcji
  // tresc na tresc z drugiego zestawu.
  it('tytuly lekcji nie kolidują z powtorka klas 1-3', () => {
    const klucze4 = buildRecap4('V', [CLASS_ID]).lessons.map((l) => titleMatchKey(l.title));
    const klucze13 = buildRecap13('IV', [CLASS_ID]).lessons.map((l) => titleMatchKey(l.title));
    expect(new Set([...klucze4, ...klucze13]).size).toBe(klucze4.length + klucze13.length);
  });

  it('tytuly lekcji sa unikalne wewnatrz powtorki', () => {
    const klucze = buildRecap4('V', [CLASS_ID]).lessons.map((l) => titleMatchKey(l.title));
    expect(new Set(klucze).size).toBe(klucze.length);
  });

  it('kolejne wywolania generuja nowe identyfikatory', () => {
    const a = buildRecap4('V', [CLASS_ID]);
    const b = buildRecap4('V', [CLASS_ID]);
    expect(a.questionSets[0].id).not.toBe(b.questionSets[0].id);
  });

  it('kazda lekcja ma slajd topic z krotkim tematem do zeszytu (bez stopera), a notatke max na 5 linijek', () => {
    const bundle = buildRecap4('V', [CLASS_ID]);
    for (const lesson of bundle.lessons) {
      const topicSlide = lesson.slides.find((s) => s.kind === 'topic');
      expect(topicSlide && topicSlide.kind === 'topic' ? topicSlide.topic : undefined).toBeTruthy();
      if (topicSlide && topicSlide.kind === 'topic') {
        expect(topicSlide.topic!.length).toBeLessThanOrEqual(40);
        // Slajd tematu nie ma juz pola stopera - odliczanie wlacza sie kolkiem na slajdzie.
        expect('timerSec' in topicSlide).toBe(false);
      }

      const noteSlide = lesson.slides.find((s) => s.kind === 'note');
      expect(noteSlide && noteSlide.kind === 'note' ? noteSlide.body : undefined).toBeTruthy();
      if (noteSlide && noteSlide.kind === 'note') {
        const lines = noteSlide.body.split('\n').filter((l) => l.trim() !== '');
        expect(lines.length).toBeLessThanOrEqual(5);
      }
    }
  });
});

describe('buildRecap13', () => {
  it('tworzy piec lekcji i piec zestawow pytan (jeden zestaw na lekcje - bez osobnych zestawow powtorkowych)', () => {
    const bundle = buildRecap13('IV', [CLASS_ID]);
    expect(bundle.lessons).toHaveLength(5);
    expect(bundle.questionSets).toHaveLength(5);
    for (const lesson of bundle.lessons) {
      expect(lesson.dzial).toBe('Powtórka 1-3');
      expect(lesson.reviewQuestionSetId).toBe(lesson.questionSetId);
    }
  });

  it('lekcja 1 nie ma slajdu recap, kazda kolejna ma dokladnie jeden - otwierajacy (mode powtorzeniowe) na zestawie poprzedniej lekcji; brak slajdow po-lekcji', () => {
    const bundle = buildRecap13('IV', [CLASS_ID]);
    bundle.lessons.forEach((lesson, idx) => {
      const recapSlides = lesson.slides.filter((s) => s.kind === 'recap');
      for (const slide of recapSlides) {
        if (slide.kind !== 'recap') throw new Error('spodziewany slajd recap');
        expect(slide.mode).not.toBe('po-lekcji');
      }

      if (idx === 0) {
        expect(recapSlides).toHaveLength(0);
        return;
      }

      expect(recapSlides).toHaveLength(1);
      const opening = recapSlides[0];
      if (opening.kind !== 'recap') throw new Error('spodziewany slajd recap');
      const previousLesson = bundle.lessons[idx - 1];
      expect(opening.questionSetId).toBe(previousLesson.questionSetId);
      expect(opening.mode).toBe('powtorzeniowe');
      expect(bundle.questionSets.some((qs) => qs.id === opening.questionSetId)).toBe(true);

      // Kolo powtorzeniowe jest na poczatku lekcji - przed pierwszym zadaniem.
      const recapIdx = lesson.slides.indexOf(opening);
      const firstTaskIdx = lesson.slides.findIndex((s) => s.kind === 'task');
      expect(firstTaskIdx).toBeGreaterThan(-1);
      expect(recapIdx).toBeLessThan(firstTaskIdx);
    });
  });

  // Zestaw lekcji sluzy kolu powtorzeniowemu na nastepnej lekcji: jedno pytanie na zadanie.
  it('zestaw lekcji ma tyle pytan, ile lekcja ma slajdow task (3-5)', () => {
    const bundle = buildRecap13('IV', [CLASS_ID]);
    for (const lesson of bundle.lessons) {
      const taskCount = lesson.slides.filter((s) => s.kind === 'task').length;
      const questionCount = bundle.questions.filter((q) => q.setId === lesson.questionSetId).length;
      expect(taskCount).toBeGreaterThanOrEqual(3);
      expect(taskCount).toBeLessThanOrEqual(5);
      expect(questionCount).toBe(taskCount);
    }
  });

  // Pytanie na kolo sprawdza te sama umiejetnosc co zadanie, ale nie jest tym samym cwiczeniem.
  it('zadne pytanie nie powtarza tytulu ani tresci zadania z lekcji', () => {
    const bundle = buildRecap13('IV', [CLASS_ID]);
    for (const lesson of bundle.lessons) {
      const tasks = lesson.slides.filter((s) => s.kind === 'task');
      const questions = bundle.questions.filter((q) => q.setId === lesson.questionSetId);
      for (const question of questions) {
        for (const task of tasks) {
          if (task.kind !== 'task') throw new Error('spodziewany slajd task');
          expect(question.text).not.toBe(task.title);
          expect(task.body.includes(question.text)).toBe(false);
        }
      }
    }
  });

  it('kazde pytanie ma odpowiedz i nalezy do istniejacego zestawu', () => {
    const bundle = buildRecap13('IV', [CLASS_ID]);
    const setIds = new Set(bundle.questionSets.map((qs) => qs.id));
    expect(bundle.questions.length).toBeGreaterThan(0);
    for (const question of bundle.questions) {
      expect(question.text.trim()).not.toBe('');
      expect(question.answer?.trim()).toBeTruthy();
      expect(setIds.has(question.setId)).toBe(true);
    }
  });

  it('tytuly lekcji sa unikalne wewnatrz powtorki', () => {
    const klucze = buildRecap13('IV', [CLASS_ID]).lessons.map((l) => titleMatchKey(l.title));
    expect(new Set(klucze).size).toBe(klucze.length);
  });

  it('kazda lekcja ma slajd topic z krotkim tematem do zeszytu (bez stopera), a notatke max na 5 linijek', () => {
    const bundle = buildRecap13('IV', [CLASS_ID]);
    for (const lesson of bundle.lessons) {
      const topicSlide = lesson.slides.find((s) => s.kind === 'topic');
      expect(topicSlide && topicSlide.kind === 'topic' ? topicSlide.topic : undefined).toBeTruthy();
      if (topicSlide && topicSlide.kind === 'topic') {
        expect(topicSlide.topic!.length).toBeLessThanOrEqual(40);
        // Slajd tematu nie ma juz pola stopera - odliczanie wlacza sie kolkiem na slajdzie.
        expect('timerSec' in topicSlide).toBe(false);
      }

      const noteSlide = lesson.slides.find((s) => s.kind === 'note');
      expect(noteSlide && noteSlide.kind === 'note' ? noteSlide.body : undefined).toBeTruthy();
      if (noteSlide && noteSlide.kind === 'note') {
        const lines = noteSlide.body.split('\n').filter((l) => l.trim() !== '');
        expect(lines.length).toBeLessThanOrEqual(5);
      }
    }
  });
});
