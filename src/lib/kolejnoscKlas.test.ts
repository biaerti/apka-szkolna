import { describe, expect, it } from 'vitest';
import { KOLEJNOSC_KLAS, wKolejnosciKlasy } from './kolejnoscKlas';
import { nextLessons } from './queue';
import { buildTextbook4 } from '../data/textbook4';
import type { Lesson, SchoolClass } from '../data/types';

function lekcje(): Lesson[] {
  return buildTextbook4('IV', ['a']).lessons.map((l, i) => ({ ...l, id: `l${i}`, order: i }));
}

describe('kolejnosc lekcji dla klasy', () => {
  it('tytuly z regul istnieja w materialach klasy 4', () => {
    const tytuly = new Set(lekcje().map((l) => l.title));
    for (const r of KOLEJNOSC_KLAS) {
      expect(tytuly.has(r.przed)).toBe(true);
      expect(tytuly.has(r.za)).toBe(true);
    }
  });

  it('4a i 4c: bitwa przed Gerebem, 4b po staremu', () => {
    const wszystkie = lekcje();
    const lektura = (klasa?: string) =>
      wKolejnosciKlasy(wszystkie, klasa).filter((l) => /^[1-6]\. /.test(l.title) && l.dzial?.startsWith('Lektura')).map((l) => l.title.slice(0, 2));
    expect(lektura('IV A')).toEqual(['1.', '2.', '3.', '5.', '4.', '6.']);
    expect(lektura('IV C')).toEqual(['1.', '2.', '3.', '5.', '4.', '6.']);
    expect(lektura('IV B')).toEqual(['1.', '2.', '3.', '4.', '5.', '6.']);
    expect(wKolejnosciKlasy(wszystkie, 'IV A')).toHaveLength(wszystkie.length);
  });

  it('kolejka "Nastepna" w 4a: po bitwie Gereb, potem lekcja 6', () => {
    const classes: SchoolClass[] = [{ id: 'a', name: 'IV A', order: 0 }];
    const wszystkie = lekcje().map((l) => {
      const zrobiona = !l.dzial?.startsWith('Lektura') || /^[1-3]\. |^5\. /.test(l.title);
      return zrobiona ? { ...l, progress: { a: { status: 'done' as const } } } : l;
    });
    const [nastepna, dalej] = nextLessons(wszystkie, classes, 'a', 2);
    expect(nastepna.title).toMatch(/^4\. Gereb/);
    expect(dalej.title).toMatch(/^6\. /);
  });
});
