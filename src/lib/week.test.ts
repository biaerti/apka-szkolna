import { describe, expect, it } from 'vitest';
import { isSameWeek, monthKey, weekStart } from './week';

describe('weekStart', () => {
  it('zwraca ten sam dzien, jesli to poniedzialek', () => {
    const monday = new Date(2026, 8, 7); // 2026-09-07 to poniedzialek
    const result = weekStart(monday);
    expect(result.getDay()).toBe(1);
  });

  it('cofa do poniedzialku dla srodka tygodnia', () => {
    const wednesday = new Date(2026, 8, 2); // 2026-09-02 to sroda
    const result = weekStart(wednesday);
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(7); // sierpien - poniedzialek tego tygodnia to 31.08
    expect(result.getDate()).toBe(31);
    expect(result.getDay()).toBe(1);
    expect(result.getHours()).toBe(0);
  });

  it('cofa do poniedzialku dla niedzieli', () => {
    const sunday = new Date(2026, 8, 6); // 2026-09-06 to niedziela
    const result = weekStart(sunday);
    expect(result.getDate()).toBe(31);
    expect(result.getMonth()).toBe(7);
    expect(result.getDay()).toBe(1);
  });
});

describe('isSameWeek', () => {
  it('true dla dwoch dni w tym samym tygodniu', () => {
    const a = new Date(2026, 7, 31); // poniedzialek
    const b = new Date(2026, 8, 6); // niedziela tego samego tygodnia
    expect(isSameWeek(a, b)).toBe(true);
  });

  it('false dla dni w roznych tygodniach', () => {
    const a = new Date(2026, 8, 6); // niedziela
    const b = new Date(2026, 8, 7); // poniedzialek nastepnego tygodnia
    expect(isSameWeek(a, b)).toBe(false);
  });
});

describe('monthKey', () => {
  it('formatuje rok i miesiac z zerem wiodacym', () => {
    expect(monthKey(new Date(2026, 8, 2))).toBe('2026-09');
    expect(monthKey(new Date(2026, 0, 15))).toBe('2026-01');
  });
});
