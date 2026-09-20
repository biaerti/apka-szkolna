import { describe, expect, it } from 'vitest';
import { classSlotOptions, progressWithoutSlot, slotDayLabel, slotsFromProgress } from './lessonSlots';

const periods = [
  { no: 1, start: '8:00', end: '8:45' },
  { no: 2, start: '8:50', end: '9:35' },
];
const timetable = [
  { id: 'm1', weekday: 1, period: 1, classId: 'a' },
  { id: 'm2', weekday: 1, period: 2, classId: 'a' },
];

describe('lesson slots', () => {
  it('zamienia stary pojedynczy termin na slot', () => {
    expect(slotsFromProgress({ status: 'planned', lessonDate: '2026-09-14', lessonPeriod: 2 })).toEqual([
      { id: '2026-09-14-2', date: '2026-09-14', period: 2 },
    ]);
  });

  it('usuwa slot także ze starego pojedynczego terminu', () => {
    expect(progressWithoutSlot(
      { status: 'planned', lessonDate: '2026-09-14', lessonPeriod: 2 },
      '2026-09-14-2',
    )).toEqual({
      status: 'planned',
      lessonSlots: [],
      lessonDate: undefined,
      lessonPeriod: undefined,
    });
  });

  it('proponuje aktualną godzinę przed kolejną', () => {
    const options = classSlotOptions({ timetable, periods, classId: 'a', now: new Date(2026, 8, 14, 8, 20) });
    expect(options.slice(0, 2).map((option) => option.label)).toEqual(['Teraz · 8:00', 'Dziś · 8:50']);
  });

  it('zostawia wszystkie dzisiejsze godziny do wyboru także po lekcjach', () => {
    const now = new Date(2026, 8, 14, 18, 0);
    const options = classSlotOptions({ timetable, periods, classId: 'a', now });

    expect(options.filter((option) => option.date === '2026-09-14').map((option) => option.period)).toEqual([1, 2]);
    expect(slotDayLabel('2026-09-14', now)).toBe('Dzisiaj');
    expect(slotDayLabel('2026-09-15', now)).toBe('Jutro');
  });

  it('zwraca każdą godzinę klasy z wybranego dnia', () => {
    const tuesdayPeriods = [
      ...periods,
      { no: 5, start: '11:25', end: '12:10' },
    ];
    const tuesdayTimetable = [
      { id: 't1', weekday: 2, period: 1, classId: 'a' },
      { id: 't2', weekday: 2, period: 2, classId: 'a' },
      { id: 't5', weekday: 2, period: 5, classId: 'a' },
    ];

    const options = classSlotOptions({
      timetable: tuesdayTimetable,
      periods: tuesdayPeriods,
      classId: 'a',
      now: new Date(2026, 8, 15, 14, 0),
    });

    expect(options.filter((option) => option.date === '2026-09-15').map((option) => option.label)).toEqual([
      'Dziś · 8:00',
      'Dziś · 8:50',
      'Dziś · 11:25',
    ]);
  });
});
