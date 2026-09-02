import { describe, expect, it } from 'vitest';
import { addDays, formatPl, isToday, parseDateKey, toDateKey, weekDays } from './dates';

describe('toDateKey / parseDateKey', () => {
  it('formatuje date lokalna na RRRR-MM-DD', () => {
    expect(toDateKey(new Date(2026, 8, 2))).toBe('2026-09-02');
    expect(toDateKey(new Date(2026, 0, 5))).toBe('2026-01-05');
  });

  it('parsuje klucz z powrotem na te sama date', () => {
    const parsed = parseDateKey('2026-09-02');
    expect(parsed.getFullYear()).toBe(2026);
    expect(parsed.getMonth()).toBe(8);
    expect(parsed.getDate()).toBe(2);
  });

  it('round-trip toDateKey(parseDateKey(x)) === x', () => {
    expect(toDateKey(parseDateKey('2026-12-31'))).toBe('2026-12-31');
  });
});

describe('addDays', () => {
  it('dodaje dni w przod', () => {
    expect(toDateKey(addDays(new Date(2026, 8, 2), 3))).toBe('2026-09-05');
  });

  it('dodaje dni wstecz (ujemne)', () => {
    expect(toDateKey(addDays(new Date(2026, 8, 2), -3))).toBe('2026-08-30');
  });

  it('przechodzi przez granice miesiaca', () => {
    expect(toDateKey(addDays(new Date(2026, 7, 31), 1))).toBe('2026-09-01');
  });
});

describe('weekDays', () => {
  it('zwraca 7 dni zaczynajac od poniedzialku', () => {
    const days = weekDays(new Date(2026, 8, 2)); // sroda
    expect(days).toHaveLength(7);
    expect(days[0].getDay()).toBe(1);
    expect(days[6].getDay()).toBe(0);
    expect(toDateKey(days[0])).toBe('2026-08-31');
    expect(toDateKey(days[6])).toBe('2026-09-06');
  });

  it('dla poniedzialku zwraca ten sam dzien jako pierwszy', () => {
    const monday = new Date(2026, 7, 31);
    const days = weekDays(monday);
    expect(toDateKey(days[0])).toBe('2026-08-31');
  });

  it('dla niedzieli cofa do poniedzialku tego samego tygodnia', () => {
    const sunday = new Date(2026, 8, 6);
    const days = weekDays(sunday);
    expect(toDateKey(days[0])).toBe('2026-08-31');
    expect(toDateKey(days[6])).toBe('2026-09-06');
  });
});

describe('isToday', () => {
  it('true dla dzisiejszej daty', () => {
    expect(isToday(new Date())).toBe(true);
  });

  it('false dla wczoraj', () => {
    expect(isToday(addDays(new Date(), -1))).toBe(false);
  });
});

describe('formatPl', () => {
  it('zawiera dzien miesiaca', () => {
    const result = formatPl(new Date(2026, 8, 2));
    expect(result).toContain('2');
    expect(result).toContain('wrz');
  });
});
