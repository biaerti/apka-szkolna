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

  it('pierwsze piec tematow zaczyna karta A5 i nie ma slajdu do przepisywania notatki', () => {
    const bundle = buildTextbook4('IV', ['4a']);
    for (const lesson of bundle.lessons.slice(0, 5)) {
      expect(lesson.exercisePage).toBeUndefined();
      const opening = lesson.slides[0];
      expect(opening).toMatchObject({ kind: 'topic', variant: 'handout' });
      expect(opening.kind === 'topic' ? opening.goals : undefined).toHaveLength(3);
      expect(lesson.slides.some((slide) => slide.kind === 'read')).toBe(true);
      expect(lesson.slides.filter((slide) => slide.kind === 'task')).toHaveLength(lesson.title.startsWith('4.') ? 4 : 3);
      expect(lesson.slides.filter((slide) => slide.kind === 'task').every((slide) => Boolean(slide.answerExample))).toBe(true);
      expect(lesson.slides.some((slide) => slide.kind === 'note')).toBe(false);
      expect(lesson.slides[lesson.slides.length - 1]).toMatchObject({ kind: 'text', title: 'Wracamy do karty A5', zeszyt: true });
      expect(lesson.notebookNote?.match(/\{\{[^{}]+\}\}/g)).toHaveLength(3);
    }
    const firstRead = bundle.lessons[0].slides.find((slide) => slide.kind === 'read');
    expect(firstRead).toMatchObject({ page: 12, pageTo: 15, timerSec: 20 * 60 });
  });

  it('kolejne tematy maja prezentacje i zadania bez dodatkowych kart A5', () => {
    const bundle = buildTextbook4('IV', ['4a']);
    const lessons = bundle.lessons.slice(5);
    expect(lessons).toHaveLength(7);
    expect(lessons.map((lesson) => lesson.title)).toEqual([
      '8. Dlaczego warto być sobą?',
      '9-10. Dzień tematyczny: Międzynarodowy Dzień Kropki',
      '11. Czas na czasownik',
      '12-13. Misja odmiana! Tajemnice czasownika',
      '14. Czy każda nasza wypowiedź jest zdaniem?',
      '15. Tworzymy plan ramowy',
      '16. Co już wiesz? Co umiesz?',
    ]);
    for (const lesson of lessons) {
      expect(lesson.slides[0]).toMatchObject({ kind: 'topic', variant: 'write' });
      expect(lesson.slides.some((slide) => slide.kind === 'read')).toBe(true);
      expect(lesson.slides.filter((slide) => slide.kind === 'task')).toHaveLength(2);
      expect(lesson.slides.filter((slide) => slide.kind === 'task').every((slide) => Boolean(slide.answerExample))).toBe(true);
      expect(lesson.slides.some((slide) => slide.kind === 'topic' && slide.variant === 'handout')).toBe(false);
      expect(lesson.slides.some((slide) => slide.kind === 'text' && slide.title === 'Wracamy do karty A5')).toBe(false);
      expect(lesson.notebookNote).toBeUndefined();
    }
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

  it('pierwsze piec tematow ma notatke A5, a kazdy temat pytania do kola z odpowiedziami', () => {
    const bundle = buildTextbook4('IV', ['4a']);
    expect(bundle.questionSets).toHaveLength(TEXTBOOK4_TOPIC_COUNT);
    for (const lesson of bundle.lessons.slice(0, 5)) {
      expect(lesson.notebookNote).toBeTruthy();
    }
    for (const lesson of bundle.lessons) {
      const qs = bundle.questions.filter((q) => q.setId === lesson.questionSetId);
      expect(qs.length).toBeGreaterThanOrEqual(4);
      expect(qs.every((q) => Boolean(q.answer))).toBe(true);
    }
  });

  it('nie pokazuje materialu klasy czwartej w innym roczniku', () => {
    expect(() => buildTextbook4('V', [])).toThrow();
  });
});
