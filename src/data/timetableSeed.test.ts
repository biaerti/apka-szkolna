import { describe, expect, it } from 'vitest';
import { DEFAULT_PERIODS, buildSeedTimetable } from './timetableSeed';

describe('buildSeedTimetable', () => {
  it('dopasowuje klasy po znormalizowanej nazwie i pomija nieznane', () => {
    const entries = buildSeedTimetable([
      { id: 'a', name: 'iv a', order: 0 },
      { id: 'v', name: 'VA', order: 1 },
      { id: 'x', name: 'VI B', order: 2 },
    ]);
    // IV A: pon 3,4; wt 5; sr 3,4; pt 1 = 6. V A: pon 1,2; wt 6; sr 5; pt 2 = 5.
    expect(entries.filter((e) => e.classId === 'a')).toHaveLength(6);
    expect(entries.filter((e) => e.classId === 'v')).toHaveLength(5);
    expect(entries.some((e) => e.classId === 'x')).toBe(false);
    expect(entries.find((e) => e.weekday === 2 && e.period === 5)?.room).toBe('30');
    expect(entries.find((e) => e.weekday === 3 && e.period === 3)?.room).toBe('13');
    expect(entries.find((e) => e.weekday === 3 && e.period === 4)?.note).toBe('Zajęcia z wychowawcą');
    const keys = entries.map((e) => `${e.weekday}-${e.period}`);
    expect(new Set(keys).size).toBe(keys.length);
    expect(entries.find((e) => e.weekday === 1 && e.period === 3)?.id).toBe('tt-1-3');
  });
  it('bez klas -> pusty plan; dzwonki 1-6', () => {
    expect(buildSeedTimetable([])).toEqual([]);
    expect(DEFAULT_PERIODS.map((p) => p.no)).toEqual([1, 2, 3, 4, 5, 6]);
  });
});
