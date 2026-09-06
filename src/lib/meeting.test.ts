import { describe, expect, it } from 'vitest';
import { formatMeetingDate, meetingSummary } from './meeting';

describe('formatMeetingDate', () => {
  it('formatuje klucz daty po polsku z dniem tygodnia', () => {
    expect(formatMeetingDate('2026-09-09')).toBe('środa, 9 września 2026');
  });

  it('nie przesuwa daty o dzien (czas lokalny, nie UTC)', () => {
    expect(formatMeetingDate('2026-01-01')).toContain('1 stycznia 2026');
  });

  it('zwraca wejscie bez zmian, gdy to nie jest klucz daty', () => {
    expect(formatMeetingDate('')).toBe('');
    expect(formatMeetingDate('kiedys')).toBe('kiedys');
  });
});

describe('meetingSummary', () => {
  const skrypt = `## 1. Obiady

- Ruszyly od poniedzialku.

## 2. Etyka

- Zapis oznacza obowiazek.`;

  it('bierze naglowki sekcji jako spis punktow', () => {
    expect(meetingSummary(skrypt)).toEqual(['1. Obiady', '2. Etyka']);
  });

  it('scala pogrubienie w naglowku do jednego napisu', () => {
    expect(meetingSummary('## Rada **Rodzicow**')).toEqual(['Rada Rodzicow']);
  });

  it('bez naglowkow spada na pierwsze punkty listy', () => {
    expect(meetingSummary('- pierwszy\n- drugi')).toEqual(['pierwszy', 'drugi']);
  });

  it('przycina liste do limitu', () => {
    expect(meetingSummary('## a\n\n## b\n\n## c', 2)).toEqual(['a', 'b']);
  });

  it('pusty skrypt daje pusty spis', () => {
    expect(meetingSummary('')).toEqual([]);
  });
});
