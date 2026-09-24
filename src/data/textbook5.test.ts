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
    expect(kinds).toEqual(['topic', 'recap', 'video', 'recap', 'image', 'task', 'task', 'note']);
    const own = lesson.slides[3];
    expect(own.kind === 'recap' && own.questionSetId).toBe(lesson.questionSetId);
    expect(own.kind === 'recap' && own.questionCount).toBe(5);
    expect(bundle.questions.filter((q) => q.setId === lesson.questionSetId)).toHaveLength(5);
  });

  it('kazda lekcja ma plan dla nauczyciela, temat na starcie i notatke na koncu', () => {
    for (const lesson of bundle.lessons) {
      expect(lesson.teacherPlan).toMatch(/^## /);
      expect(lesson.slides[0].kind).toBe('topic');
      expect(lesson.slides[lesson.slides.length - 1].kind).toBe('note');
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

  it('wycofane tematy nie wracaja w materiale', () => {
    for (const lesson of bundle.lessons) expect(RETIRED_TEXTBOOK5_TITLES.has(lesson.title)).toBe(false);
  });
});
