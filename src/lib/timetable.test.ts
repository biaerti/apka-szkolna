import { describe, expect, it } from 'vitest';
import type { LessonPeriod, TimetableEntry } from '../data/types';
import {
  currentEntry,
  currentOrNextEntry,
  entriesForDay,
  formatHm,
  formatRemaining,
  normalizeClassName,
  parseHm,
  periodStatus,
  weekdayOf,
} from './timetable';

const PERIODS: LessonPeriod[] = [
  { no: 1, start: '8:00', end: '8:45' },
  { no: 2, start: '8:50', end: '9:35' },
  { no: 3, start: '9:40', end: '10:25' },
];

// Poniedzialek 7 wrzesnia 2026, czas lokalny.
const at = (h: number, m: number, s = 0) => new Date(2026, 8, 7, h, m, s);

describe('parseHm / formatHm', () => {
  it('parsuje z zerem wiodacym i bez', () => {
    expect(parseHm('8:05')).toBe(485);
    expect(parseHm('08:05')).toBe(485);
    expect(parseHm('13:15')).toBe(795);
  });
  it('odrzuca smieci', () => {
    expect(parseHm('abc')).toBeNaN();
    expect(parseHm('25:00')).toBeNaN();
    expect(parseHm('8:75')).toBeNaN();
  });
  it('formatuje bez zera wiodacego w godzinie', () => {
    expect(formatHm(485)).toBe('8:05');
    expect(formatHm(795)).toBe('13:15');
  });
});

describe('weekdayOf', () => {
  it('pon-pt -> 1-5, weekend -> 0', () => {
    expect(weekdayOf(new Date(2026, 8, 7))).toBe(1);
    expect(weekdayOf(new Date(2026, 8, 11))).toBe(5);
    expect(weekdayOf(new Date(2026, 8, 12))).toBe(0);
    expect(weekdayOf(new Date(2026, 8, 13))).toBe(0);
  });
});

describe('periodStatus', () => {
  it('w trakcie lekcji liczy sekundy do konca', () => {
    const s = periodStatus(PERIODS, at(8, 22, 30));
    expect(s.kind).toBe('lesson');
    if (s.kind === 'lesson') {
      expect(s.period.no).toBe(1);
      expect(s.endsAtMin).toBe(8 * 60 + 45);
      expect(s.remainingSec).toBe(22 * 60 + 30);
    }
  });
  it('na przerwie liczy do nastepnej lekcji', () => {
    const s = periodStatus(PERIODS, at(8, 47));
    expect(s.kind).toBe('break');
    if (s.kind === 'break') {
      expect(s.nextPeriod.no).toBe(2);
      expect(s.startsAtMin).toBe(8 * 60 + 50);
      expect(s.remainingSec).toBe(180);
    }
  });
  it('przed pierwsza i po ostatniej lekcji: none', () => {
    expect(periodStatus(PERIODS, at(7, 30)).kind).toBe('none');
    expect(periodStatus(PERIODS, at(10, 25)).kind).toBe('none');
    expect(periodStatus(PERIODS, at(23, 59)).kind).toBe('none');
  });
  it('bez godzin: none', () => {
    expect(periodStatus([], at(9, 0)).kind).toBe('none');
  });
  it('ignoruje godziny z niepoprawnym czasem i nie zaklada posortowania', () => {
    const messy = [PERIODS[2], { no: 9, start: 'x', end: '9:00' }, PERIODS[0], PERIODS[1]];
    const s = periodStatus(messy, at(9, 0));
    expect(s.kind).toBe('lesson');
    if (s.kind === 'lesson') expect(s.period.no).toBe(2);
  });
});

describe('formatRemaining', () => {
  it('minuty w gore, sekundy ponizej minuty', () => {
    expect(formatRemaining(23 * 60)).toBe('23 min');
    expect(formatRemaining(22 * 60 + 30)).toBe('23 min');
    expect(formatRemaining(60)).toBe('1 min');
    expect(formatRemaining(45)).toBe('45 s');
    expect(formatRemaining(0)).toBe('0 s');
  });
});

const TT: TimetableEntry[] = [
  { id: 'a', weekday: 1, period: 2, classId: 'c2' },
  { id: 'b', weekday: 1, period: 1, classId: 'c1', room: '31' },
  { id: 'c', weekday: 2, period: 1, classId: 'c3' },
  // Sam dopisek, bez klasy - to nie lekcja nauczyciela.
  { id: 'd', weekday: 1, period: 3, note: 'Jagoda ma lekcję' },
];

describe('entriesForDay / currentEntry / currentOrNextEntry', () => {
  it('wpisy dnia posortowane po godzinie', () => {
    expect(entriesForDay(TT, 1).map((e) => e.id)).toEqual(['b', 'a']);
    expect(entriesForDay(TT, 3)).toEqual([]);
  });
  it('komorka z samym dopiskiem nie jest lekcja', () => {
    expect(entriesForDay(TT, 1).map((e) => e.id)).not.toContain('d');
    expect(currentEntry(TT, PERIODS, at(9, 50))).toBeUndefined();
    expect(currentOrNextEntry(TT, PERIODS, at(8, 47))?.id).toBe('a');
  });
  it('biezacy wpis wg dzwonkow', () => {
    expect(currentEntry(TT, PERIODS, at(8, 10))?.id).toBe('b');
    expect(currentEntry(TT, PERIODS, at(8, 47))).toBeUndefined();
    expect(currentEntry(TT, PERIODS, at(9, 50))).toBeUndefined(); // 3. lekcja bez wpisu
  });
  it('najblizszy wpis na przerwie i przed lekcjami, brak po ostatniej i w weekend', () => {
    expect(currentOrNextEntry(TT, PERIODS, at(7, 0))?.id).toBe('b');
    expect(currentOrNextEntry(TT, PERIODS, at(8, 47))?.id).toBe('a');
    expect(currentOrNextEntry(TT, PERIODS, at(11, 0))).toBeUndefined();
    expect(currentOrNextEntry(TT, PERIODS, new Date(2026, 8, 12, 8, 10))).toBeUndefined();
  });
});

describe('normalizeClassName', () => {
  it('bez spacji, bez wielkosci liter', () => {
    expect(normalizeClassName('IV A')).toBe('iva');
    expect(normalizeClassName(' iv  a ')).toBe('iva');
    expect(normalizeClassName('IVA')).toBe('iva');
  });
});
