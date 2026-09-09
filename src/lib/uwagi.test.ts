import { describe, expect, it } from 'vitest';
import type { RecapEvent } from '../data/types';
import { doWpisania, uwagaLabel, uwagaTime, uwagiByDay } from './uwagi';

function ev(partial: Partial<RecapEvent> & { at: string }): RecapEvent {
  return {
    id: partial.id ?? Math.random().toString(36),
    studentId: partial.studentId ?? 's1',
    classId: partial.classId ?? 'c1',
    result: partial.result ?? 'uwaga',
    note: partial.note,
    wpisane: partial.wpisane,
    at: partial.at,
  };
}

const monday = new Date(2026, 8, 7);
const tuesday = new Date(2026, 8, 8);

describe('uwagiByDay', () => {
  it('grupuje uwagi po dniu i pomija inne wyniki', () => {
    const events = [
      ev({ id: 'a', at: new Date(2026, 8, 7, 9, 15).toISOString() }),
      ev({ id: 'b', at: new Date(2026, 8, 8, 11, 0).toISOString() }),
      ev({ id: 'c', result: 'plomba', at: new Date(2026, 8, 8, 12, 0).toISOString() }),
    ];
    const map = uwagiByDay(events, [monday, tuesday]);
    expect(map.get('2026-09-07')?.map((e) => e.id)).toEqual(['a']);
    expect(map.get('2026-09-08')?.map((e) => e.id)).toEqual(['b']);
  });

  it('pomija uwagi spoza podanych dni', () => {
    const events = [ev({ id: 'a', at: new Date(2026, 8, 1, 9, 0).toISOString() })];
    const map = uwagiByDay(events, [monday, tuesday]);
    expect(map.get('2026-09-07')).toEqual([]);
    expect(map.get('2026-09-08')).toEqual([]);
  });

  it('kazdy dzien zakresu ma wpis, nawet pusty', () => {
    const map = uwagiByDay([], [monday, tuesday]);
    expect([...map.keys()].sort()).toEqual(['2026-09-07', '2026-09-08']);
  });

  it('w obrebie dnia sortuje od najwczesniejszej', () => {
    const events = [
      ev({ id: 'pozna', at: new Date(2026, 8, 7, 12, 0).toISOString() }),
      ev({ id: 'wczesna', at: new Date(2026, 8, 7, 8, 0).toISOString() }),
    ];
    expect(uwagiByDay(events, [monday]).get('2026-09-07')?.map((e) => e.id)).toEqual(['wczesna', 'pozna']);
  });
});

describe('doWpisania', () => {
  it('liczy tylko uwagi bez odhaczenia', () => {
    const events = [
      ev({ at: new Date(2026, 8, 7).toISOString() }),
      ev({ at: new Date(2026, 8, 7).toISOString(), wpisane: true }),
      ev({ result: 'plus', at: new Date(2026, 8, 7).toISOString() }),
    ];
    expect(doWpisania(events)).toBe(1);
  });
});

describe('uwagaTime', () => {
  it('godzina z zerem wiodacym', () => {
    expect(uwagaTime(ev({ at: new Date(2026, 8, 7, 8, 5).toISOString() }))).toBe('08:05');
  });
});

describe('uwagaLabel', () => {
  it('wlasna tresc, gdy jest', () => {
    expect(uwagaLabel(ev({ at: '2026-09-07T08:00:00.000Z', note: 'Rzuca gumkami' }))).toBe('Rzuca gumkami');
  });
  it('domyslna tresc, gdy nauczyciel nic nie wpisal', () => {
    expect(uwagaLabel(ev({ at: '2026-09-07T08:00:00.000Z' }))).toBe('Przeszkadza na lekcji');
    expect(uwagaLabel(ev({ at: '2026-09-07T08:00:00.000Z', note: '   ' }))).toBe('Przeszkadza na lekcji');
  });
});
