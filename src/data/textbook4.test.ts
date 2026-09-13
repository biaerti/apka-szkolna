import { describe, expect, it } from 'vitest';
import { buildTextbook4, TEXTBOOK4_TOPIC_COUNT } from './textbook4';

describe('buildTextbook4', () => {
  it('trzyma kolejnosc tematow z podrecznika i ich strony', () => {
    const bundle = buildTextbook4('IV', ['4a', '4b']);
    expect(bundle.lessons).toHaveLength(TEXTBOOK4_TOPIC_COUNT);
    expect(bundle.lessons[0]).toMatchObject({ title: '1-2. Krok po kroku tworzymy pierwszą wspólną opowieść', textbookPage: 12 });
    expect(bundle.lessons.find((l) => l.title.startsWith('5-6.'))).toMatchObject({ textbookPage: 22, exercisePage: 13 });
    const pages = bundle.lessons.map((l) => l.textbookPage ?? 0);
    expect([...pages].sort((a, b) => a - b)).toEqual(pages);
  });

  it('kazdy temat ma notatke A5 i pytania do kola z odpowiedziami', () => {
    const bundle = buildTextbook4('IV', ['4a']);
    expect(bundle.questionSets).toHaveLength(TEXTBOOK4_TOPIC_COUNT);
    for (const lesson of bundle.lessons) {
      expect(lesson.notebookNote).toBeTruthy();
      const qs = bundle.questions.filter((q) => q.setId === lesson.questionSetId);
      expect(qs.length).toBeGreaterThanOrEqual(4);
      expect(qs.every((q) => Boolean(q.answer))).toBe(true);
    }
  });

  it('nie pokazuje materialu klasy czwartej w innym roczniku', () => {
    expect(() => buildTextbook4('V', [])).toThrow();
  });
});
