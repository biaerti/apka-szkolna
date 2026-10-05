import { describe, expect, it } from 'vitest';
import { DEFAULT_PERIODS, buildSeedTimetable } from '../data/timetableSeed';
import type { SchoolClass } from '../data/types';
import { obiadAfter, obiadStatus, shortClassName } from './obiady';

// 2026-10-05 to poniedzialek, 2026-10-06 wtorek.
const at = (day: number, h: number, m: number) => new Date(2026, 9, day, h, m);
const classes: SchoolClass[] = ['IV A', 'IV B', 'IV C', 'V A'].map((name, i) => ({ id: `k${i}`, name, order: i }));
const timetable = buildSeedTimetable(classes);

describe('shortClassName', () => {
  it('rzymskie i arabskie', () => {
    expect(shortClassName('IV C')).toBe('4c');
    expect(shortClassName('V A')).toBe('5a');
    expect(shortClassName('VIII a')).toBe('8a');
    expect(shortClassName('4b')).toBe('4b');
    expect(shortClassName('Kółko')).toBeUndefined();
  });
});

describe('obiady w planie Bartka', () => {
  it('pon po 6. lekcji 4c idzie sama', () => {
    expect(obiadAfter(at(5, 12, 40), 6, 'IV C')).toMatchObject({ klasa: '4c', mode: 'sami' });
  });
  it('wt po 5. lekcji 4a, po 6. 5a', () => {
    expect(obiadAfter(at(6, 11, 30), 5, 'IV A')?.klasa).toBe('4a');
    expect(obiadAfter(at(6, 12, 40), 6, 'V A')?.klasa).toBe('5a');
  });
  it('zegar: na 6. lekcji w pon zapowiedz, na 5. nic', () => {
    expect(obiadStatus(timetable, classes, DEFAULT_PERIODS, at(5, 12, 40))).toMatchObject({
      kind: 'after-lesson',
      obiad: { klasa: '4c' },
    });
    expect(obiadStatus(timetable, classes, DEFAULT_PERIODS, at(5, 11, 30)).kind).toBe('none');
  });
  it('zegar: przerwa po 5. lekcji we wtorek - obiad 4a teraz', () => {
    expect(obiadStatus(timetable, classes, DEFAULT_PERIODS, at(6, 12, 15))).toMatchObject({
      kind: 'now',
      obiad: { klasa: '4a' },
    });
  });
});
