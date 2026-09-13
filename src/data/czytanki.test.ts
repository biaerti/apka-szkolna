import { describe, expect, it } from 'vitest';
import { CZYTANKI, grupujWgLekcji } from './czytanki';

describe('czytanki', () => {
  it('maja unikalne id, bo id to nazwa pliku mp3', () => {
    const ids = CZYTANKI.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/);
  });

  it('grupuje kolejne czytanki tej samej lekcji w jedna grupe', () => {
    const grupy = grupujWgLekcji(CZYTANKI);
    expect(grupy.map((g) => g.lekcja)).toEqual(['1-2', '3', '4', '5-6', '7', '8', '9-10', '15', '16']);
    expect(grupy.find((g) => g.lekcja === '9-10')?.czytanki.map((c) => c.id)).toEqual([
      'dzien-kropki',
      'kropka',
      'wielka-historia-malej-kreski',
      'co-robisz-z-pomyslem',
    ]);
    expect(grupy.flatMap((g) => g.czytanki)).toEqual(CZYTANKI);
  });
});
