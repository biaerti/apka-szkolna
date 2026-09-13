import { describe, expect, it } from 'vitest';
import { buildTextbook4, TEXTBOOK4_TOPIC_COUNT } from './textbook4';

describe('buildTextbook4', () => {
  it('trzyma pelna kolejnosc tematow z oficjalnego spisu tresci', () => {
    const bundle = buildTextbook4('IV', ['4a', '4b']);
    expect(bundle.lessons).toHaveLength(TEXTBOOK4_TOPIC_COUNT);
    expect(TEXTBOOK4_TOPIC_COUNT).toBeGreaterThan(100);
    expect(bundle.lessons[0]).toMatchObject({ title: 'Na starcie - „Tacy jesteśmy”', textbookPage: 14 });
    expect(bundle.lessons[bundle.lessons.length - 1]).toMatchObject({ title: '100/100! - Mistrzowie czytania', textbookPage: 348 });
  });

  it('laczy tematy jezykowe z odpowiadajacymi stronami cwiczen', () => {
    const bundle = buildTextbook4('IV', []);
    expect(bundle.lessons.find((lesson) => lesson.textbookPage === 21)).toMatchObject({ exercisePage: 7 });
    expect(bundle.lessons.find((lesson) => lesson.textbookPage === 218)).toMatchObject({ exercisePage: 102 });
    expect(bundle.lessons.find((lesson) => lesson.textbookPage === 309)).toMatchObject({ exercisePage: 149 });
  });

  it('przygotowuje do kazdego tematu notatke A5 i trzy pytania powtorkowe', () => {
    const bundle = buildTextbook4('IV', ['4a']);
    expect(bundle.questionSets).toHaveLength(TEXTBOOK4_TOPIC_COUNT);
    expect(bundle.questions).toHaveLength(TEXTBOOK4_TOPIC_COUNT * 3);
    expect(bundle.lessons.every((lesson) => Boolean(lesson.notebookNote && lesson.questionSetId))).toBe(true);
  });

  it('nie pokazuje materialu klasy czwartej w innym roczniku', () => {
    expect(() => buildTextbook4('V', [])).toThrow();
  });
});
