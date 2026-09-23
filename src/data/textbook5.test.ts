import { describe, expect, it } from 'vitest';
import { buildTextbook5, TEXTBOOK5_TOPIC_COUNT } from './textbook5';

describe('buildTextbook5', () => {
  const bundle = buildTextbook5('V', ['klasa-5a']);

  it('jest tylko dla klasy V', () => {
    expect(() => buildTextbook5('IV', [])).toThrow();
  });

  it('zaczyna od omowienia Sztuki programowania i konczy powtorzeniem', () => {
    expect(bundle.lessons).toHaveLength(TEXTBOOK5_TOPIC_COUNT);
    expect(bundle.lessons[0].title).toContain('Sztuka programowania');
    expect(bundle.lessons[bundle.lessons.length - 1].title).toContain('powtórzenie');
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
      const recap = lesson.slides.find((s) => s.kind === 'recap');
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
});
