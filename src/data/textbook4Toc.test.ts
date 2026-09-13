import { describe, expect, it } from 'vitest';
import {
  TEXTBOOK4_METADATA,
  TEXTBOOK4_REQUIRED_TEXT_COVERAGE,
  TEXTBOOK4_TOC,
} from './textbook4Toc';

describe('spis treści podręcznika GWO dla klasy IV', () => {
  it('zawiera wszystkie 9 rozdziałów w kolejności stron', () => {
    expect(TEXTBOOK4_TOC).toHaveLength(9);
    expect(TEXTBOOK4_TOC.map((chapter) => chapter.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    const pages = TEXTBOOK4_TOC.flatMap((chapter) => chapter.items.map((item) => item.page));
    expect(pages[0]).toBe(12);
    expect(pages[pages.length - 1]).toBe(350);
    expect([...pages].sort((a, b) => a - b)).toEqual(pages);
  });

  it('zapisuje dane identyfikujące dokładne wydanie', () => {
    expect(TEXTBOOK4_METADATA).toMatchObject({
      publisher: 'Gdańskie Wydawnictwo Oświatowe',
      year: 2026,
      approvalNumber: '1275/1/2026',
      isbn: '978-83-8118-733-6',
    });
  });

  it('porównuje wszystkie krótkie teksty wskazane dla nowej podstawy', () => {
    expect(TEXTBOOK4_REQUIRED_TEXT_COVERAGE.map((item) => item.requirementId)).toEqual([
      'nowa-stala-1',
      'nowa-stala-2',
      'nowa-stala-3',
      'nowa-stala-4',
      'nowa-stala-5',
    ]);
  });
});
