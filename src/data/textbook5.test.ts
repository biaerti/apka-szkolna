import { describe, expect, it } from 'vitest';
import { buildTextbook5, RETIRED_TEXTBOOK5_TITLES, TEXTBOOK5_TOPIC_COUNT } from './textbook5';

describe('buildTextbook5', () => {
  const bundle = buildTextbook5('V', ['klasa-5a']);

  it('jest tylko dla klasy V', () => {
    expect(() => buildTextbook5('IV', [])).toThrow();
  });

  it('zaczyna od dialogu na Sztuce programowania', () => {
    expect(bundle.lessons).toHaveLength(TEXTBOOK5_TOPIC_COUNT);
    expect(bundle.lessons[0].title).toContain('dialog');
    expect(bundle.lessons[0].teacherPlan).toContain('Sztuk');
  });

  it('lekcja o gloskach: film, kolo z jej 5 zadaniami, zadanie z podrecznika', () => {
    const lesson = bundle.lessons.find((l) => l.title.startsWith('4. Głoski'))!;
    expect(lesson.teacherPlan).toContain('## Po lekcji uczeń');
    const kinds = lesson.slides.map((s) => s.kind);
    expect(kinds).toEqual(['topic', 'recap', 'video', 'recap', 'note', 'image', 'task', 'task']);
    const own = lesson.slides[3];
    expect(own.kind === 'recap' && own.questionSetId).toBe(lesson.questionSetId);
    expect(own.kind === 'recap' && own.questionCount).toBe(5);
    expect(bundle.questions.filter((q) => q.setId === lesson.questionSetId)).toHaveLength(5);
  });

  it('lekcja o Dziesiatym poziomie: definicje, czytanka, plan i zadania 5-9', () => {
    const lesson = bundle.lessons.find((l) => l.title.startsWith('7. Dziesiąty poziom'))!;
    expect(lesson.topic).toBe('Pomaganie - dziesiąty poziom przyjaźni');
    expect(lesson.textbookPage).toBe(31);
    expect(lesson.slides.map((s) => s.kind)).toEqual([
      'topic', 'recap', 'image', 'image', 'czytanka', 'task', 'note', 'image', 'image', 'image',
    ]);
    expect(lesson.slides[4]).toMatchObject({ kind: 'czytanka', czytankaId: 'dziesiaty-poziom' });

    const plan = lesson.slides[5];
    expect(plan).toMatchObject({
      kind: 'task',
      code: 'Z2',
      page: 34,
      exerciseNo: '2',
      studentAction: 'write-answer',
    });
    expect(plan.kind === 'task' && plan.body).toContain('Plan wydarzeń');
    expect(plan.kind === 'task' && plan.answerExample).toContain('Spotkanie Dominika');

    expect(lesson.slides[lesson.slides.length - 1]).toMatchObject({
      kind: 'image',
      code: 's. 35 zad. 9',
      studentAction: 'write-answer',
    });
  });

  it('nieosobowe formy: powtorka z filmu, nowe formy, zadania 1 i 3 oraz graficzna notatka', () => {
    const lesson = bundle.lessons.find((l) => l.title.startsWith('12. Kiedy stosować'))!;
    expect(lesson.textbookPage).toBe(48);
    expect(lesson.slides.map((s) => s.kind)).toEqual(['topic', 'recap', 'video', 'text', 'image', 'image', 'note']);
    expect(lesson.slides[2]).toMatchObject({ kind: 'video', videoId: 'wypowiedzenia-film1' });
    expect(lesson.slides[4]).toMatchObject({ kind: 'image', code: 's. 48 zad. 1', studentAction: 'write-answer' });
    expect(lesson.slides[5]).toMatchObject({ kind: 'image', code: 's. 49 zad. 3', studentAction: 'write-answer' });
    expect(lesson.slides[6]).toMatchObject({ kind: 'note', diagram: 'formyCzasownika' });
  });

  it('tryby czasownika: nowy film, zadania 2, 3 i 5 oraz graficzna notatka', () => {
    const lesson = bundle.lessons.find((l) => l.title.startsWith('13. Co wyrażamy'))!;
    expect(lesson.textbookPage).toBe(50);
    expect(lesson.slides.map((s) => s.kind)).toEqual(['topic', 'recap', 'video', 'image', 'image', 'image', 'note']);
    expect(lesson.slides[2]).toMatchObject({ kind: 'video', videoId: 'tryby-czasownika-film1' });
    expect(lesson.slides.slice(3, 6).map((s) => s.kind === 'image' && s.code)).toEqual([
      's. 51 zad. 2',
      's. 51 zad. 3',
      's. 52 zad. 5',
    ]);
    expect(lesson.slides[6]).toMatchObject({ kind: 'note', diagram: 'trybyCzasownika' });
  });

  it('kazda lekcja ma plan dla nauczyciela, temat na starcie i notatke', () => {
    for (const lesson of bundle.lessons) {
      expect(lesson.teacherPlan).toMatch(/^## /);
      expect(lesson.slides[0].kind).toBe('topic');
      expect(lesson.slides.some((s) => s.kind === 'note')).toBe(true);
    }
  });

  it('kolo powtorzeniowe lekcji N pyta o lekcje N-1', () => {
    bundle.lessons.forEach((lesson, index) => {
      const recap = lesson.slides.find((s) => s.kind === 'recap' && s.questionSetId !== lesson.questionSetId);
      if (index === 0) expect(recap).toBeUndefined();
      else expect(recap && recap.kind === 'recap' && recap.questionSetId).toBe(bundle.lessons[index - 1].questionSetId);
    });
  });

  it('nie uzywa kursywy ani tabel, ktorych markdown-lite nie rysuje', () => {
    for (const lesson of bundle.lessons) {
      const text = JSON.stringify(lesson.slides) + lesson.teacherPlan;
      expect(text).not.toMatch(/(^|[^*\w])\*[^*\s][^*]*[^*\s]\*(?!\*)/);
      expect(text).not.toMatch(/\| \w+ \|/);
    }
  });

  it('podsumowanie dzialu: mapa s. 56, film, kolo z 6 pytaniami, dwa zadania i notatka', () => {
    const lesson = bundle.lessons.find((l) => l.title.startsWith('16. Podsumowanie'))!;
    expect(lesson.textbookPage).toBe(56);
    expect(lesson.slides.map((s) => s.kind)).toEqual(['topic', 'recap', 'image', 'video', 'recap', 'task', 'task', 'note']);
    expect(lesson.slides[3]).toMatchObject({ kind: 'video', videoId: 'podsumowanie5-dzial1-film1' });
    const own = lesson.slides[4];
    expect(own.kind === 'recap' && own.questionSetId).toBe(lesson.questionSetId);
    expect(own.kind === 'recap' && own.questionCount).toBe(6);
  });

  it('wycofane tematy nie wracaja w materiale', () => {
    for (const lesson of bundle.lessons) expect(RETIRED_TEXTBOOK5_TITLES.has(lesson.title)).toBe(false);
  });
});
