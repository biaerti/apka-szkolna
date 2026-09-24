import { describe, expect, it } from 'vitest';
import { buildTextbook4, TEXTBOOK4_TOPIC_COUNT } from './textbook4';
import { estimateTextHeight, fitFontSize } from '../components/slides/fitText';

describe('buildTextbook4', () => {
  it('trzyma kolejnosc tematow z podrecznika i ich strony', () => {
    const bundle = buildTextbook4('IV', ['4a', '4b']);
    expect(bundle.lessons).toHaveLength(TEXTBOOK4_TOPIC_COUNT);
    expect(bundle.lessons[0]).toMatchObject({ title: '1-2. Krok po kroku tworzymy pierwszą wspólną opowieść', textbookPage: 12 });
    expect(bundle.lessons.find((l) => l.title.startsWith('5-6.'))).toMatchObject({ textbookPage: 22 });
    const pages = bundle.lessons.map((l) => l.textbookPage ?? 0);
    expect([...pages].sort((a, b) => a - b)).toEqual(pages);
  });

  it('kazda lekcja zaczyna sie zapisaniem tematu i konczy notatka do zeszytu', () => {
    const bundle = buildTextbook4('IV', ['4a']);
    expect(bundle.lessons.slice(5).map((lesson) => lesson.title)).toEqual([
      '8. Dlaczego warto być sobą?',
      '9-10. Dzień tematyczny: Międzynarodowy Dzień Kropki',
      '11. Czas na czasownik',
      '12-13. Misja odmiana! Tajemnice czasownika',
      '14. Czy każda nasza wypowiedź jest zdaniem?',
      '15. Tworzymy plan ramowy',
      '16. Co już wiesz? Co umiesz?',
    ]);
    for (const [index, lesson] of bundle.lessons.entries()) {
      expect(lesson.exercisePage).toBeUndefined();
      expect(lesson.slides[0]).toMatchObject({ kind: 'topic', variant: 'write' });
      // Dwa formaty: praca z podrecznikiem (slajd read) albo lekcja z czytanka
      // z lektorem - tam notatka idzie PRZED zadaniami (czytanka -> ramka -> notatka -> zadania).
      const czytanka = lesson.slides.some((slide) => slide.kind === 'czytanka');
      expect(czytanka || lesson.slides.some((slide) => slide.kind === 'read')).toBe(true);
      // Pierwsze piec tematow ma 3-4 zadania, krotsze prezentacje podsumowujace - 2,
      // lekcje z czytanka - 3 krotkie.
      const expectedTasks = czytanka ? 3 : index >= 5 ? 2 : lesson.title.startsWith('4.') ? 4 : 3;
      expect(lesson.slides.filter((slide) => slide.kind === 'task')).toHaveLength(expectedTasks);
      expect(lesson.slides.filter((slide) => slide.kind === 'task').every((slide) => Boolean(slide.answerExample))).toBe(true);
      // Zadnych slajdow zwiazanych z kartami A5 - Bartek moze ich nie drukowac.
      expect(lesson.slides.some((slide) => slide.kind === 'topic' && slide.variant === 'handout')).toBe(false);
      expect(lesson.slides.some((slide) => slide.kind === 'text' && slide.title === 'Wracamy do karty A5')).toBe(false);
      // Zadania bez plakietki "do zeszytu" - Bartek ja wycofal z tych prezentacji.
      expect(lesson.slides.filter((slide) => slide.kind === 'task').some((slide) => slide.zeszyt)).toBe(false);
      // Kazda lekcje zamyka notatka "Temat: ..." do przepisania.
      const closing = czytanka ? lesson.slides.find((slide) => slide.kind === 'note')! : lesson.slides[lesson.slides.length - 1];
      expect(closing).toMatchObject({ kind: 'note', title: 'Notatka do zeszytu' });
      expect(closing.kind === 'note' ? closing.body : '').toMatch(/^\*\*Temat:\*\* /);
      // Notatka A5 do wydruku jest pelna (bez luk {{...}}) - nie ma juz slajdu
      // wracania do karty, wiec nie byloby kiedy uzupelniac pol.
      expect(lesson.notebookNote).toBeTruthy();
      expect(lesson.notebookNote).not.toMatch(/\{\{/);
    }
    const firstRead = bundle.lessons[0].slides.find((slide) => slide.kind === 'read');
    expect(firstRead).toMatchObject({ page: 12, pageTo: 15, timerSec: 20 * 60 });
  });

  it('zadania mieszcza sie na slajdzie projektora', () => {
    const bundle = buildTextbook4('IV', ['4a']);
    const tasks = bundle.lessons.flatMap((lesson) => lesson.slides.filter((slide) => slide.kind === 'task'));
    for (const task of tasks) {
      const opts = { width: task.art ? 620 : 1000, height: 430, min: 26, max: 66 };
      const size = fitFontSize(task.body, opts);
      expect(estimateTextHeight(task.body, size, opts), `${task.code}: ${task.body.slice(0, 40)}`).toBeLessThanOrEqual(opts.height);
    }
  });

  it('kazdy temat ma notatke A5 i pytania do kola z odpowiedziami', () => {
    const bundle = buildTextbook4('IV', ['4a']);
    expect(bundle.questionSets).toHaveLength(TEXTBOOK4_TOPIC_COUNT);
    for (const lesson of bundle.lessons) {
      expect(lesson.notebookNote).toBeTruthy();
    }
    for (const lesson of bundle.lessons) {
      const qs = bundle.questions.filter((q) => q.setId === lesson.questionSetId);
      expect(qs.length).toBeGreaterThanOrEqual(4);
      expect(qs.every((q) => Boolean(q.answer))).toBe(true);
    }
  });

  it('lekcje o czasowniku maja proste zadania wedlug pokazanego wzoru', () => {
    const bundle = buildTextbook4('IV', ['4a']);
    const verbLessons = bundle.lessons.filter((lesson) =>
      lesson.title === '11. Czas na czasownik'
      || lesson.title === '12-13. Misja odmiana! Tajemnice czasownika',
    );

    expect(verbLessons).toHaveLength(2);
    for (const lesson of verbLessons) {
      const tasks = lesson.slides.filter((slide) => slide.kind === 'task');
      expect(tasks).toHaveLength(2);
      expect(tasks.every((task) => task.body.includes('**Przykład:**'))).toBe(true);
      expect(tasks.every((task) => task.body.includes('**Teraz ty:**'))).toBe(true);
      expect(tasks.every((task) => Boolean(task.answerExample))).toBe(true);
    }
  });

  it('nie pokazuje materialu klasy czwartej w innym roczniku', () => {
    expect(() => buildTextbook4('V', [])).toThrow();
  });
});
