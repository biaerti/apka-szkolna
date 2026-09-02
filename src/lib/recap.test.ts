import { describe, expect, it } from 'vitest';
import type { RecapEvent, Settings } from '../data/types';
import { canPass, monthBalance, passesUsedThisWeek, pickRandom, wheelTargetAngle } from './recap';

function ev(partial: Partial<RecapEvent>): RecapEvent {
  return {
    id: partial.id ?? Math.random().toString(36),
    studentId: partial.studentId ?? 's1',
    classId: partial.classId ?? 'c1',
    result: partial.result ?? 'plus',
    at: partial.at ?? new Date().toISOString(),
  };
}

const settings: Settings = { passesPerWeek: 2, hintGivesMinus: true, wheelSpinSec: 4 };

describe('passesUsedThisWeek', () => {
  it('liczy tylko zdarzenia pass tego samego tygodnia', () => {
    const now = new Date(2026, 8, 2); // sroda
    const events: RecapEvent[] = [
      ev({ studentId: 's1', result: 'pass', at: new Date(2026, 7, 31).toISOString() }), // ten sam tydzien (pon)
      ev({ studentId: 's1', result: 'pass', at: new Date(2026, 8, 6).toISOString() }), // ten sam tydzien (nd)
      ev({ studentId: 's1', result: 'pass', at: new Date(2026, 8, 7).toISOString() }), // nastepny tydzien
      ev({ studentId: 's1', result: 'plus', at: new Date(2026, 8, 2).toISOString() }), // nie pass
      ev({ studentId: 's2', result: 'pass', at: new Date(2026, 8, 2).toISOString() }), // inny uczen
    ];
    expect(passesUsedThisWeek(events, 's1', now)).toBe(2);
  });
});

describe('canPass', () => {
  it('true gdy limit nie wyczerpany', () => {
    const now = new Date(2026, 8, 2);
    expect(canPass([], 's1', settings, now)).toBe(true);
  });

  it('false gdy limit wyczerpany', () => {
    const now = new Date(2026, 8, 2);
    const events: RecapEvent[] = [
      ev({ studentId: 's1', result: 'pass', at: new Date(2026, 8, 1).toISOString() }),
      ev({ studentId: 's1', result: 'pass', at: new Date(2026, 8, 2).toISOString() }),
    ];
    expect(canPass(events, 's1', settings, now)).toBe(false);
  });
});

describe('pickRandom', () => {
  it('zwraca undefined dla pustej puli', () => {
    expect(pickRandom([])).toBeUndefined();
  });

  it('zwraca element z puli wedlug dostarczonego rng', () => {
    const pool = ['a', 'b', 'c'];
    expect(pickRandom(pool, () => 0)).toBe('a');
    expect(pickRandom(pool, () => 0.99)).toBe('c');
    expect(pickRandom(pool, () => 0.5)).toBe('b');
  });
});

describe('monthBalance', () => {
  it('liczy zdarzenia ucznia w danym miesiacu', () => {
    const events: RecapEvent[] = [
      ev({ studentId: 's1', result: 'plus', at: new Date(2026, 8, 2).toISOString() }),
      ev({ studentId: 's1', result: 'plus', at: new Date(2026, 8, 5).toISOString() }),
      ev({ studentId: 's1', result: 'minus', at: new Date(2026, 8, 5).toISOString() }),
      ev({ studentId: 's1', result: 'pass', at: new Date(2026, 8, 5).toISOString() }),
      ev({ studentId: 's1', result: 'hint_minus', at: new Date(2026, 8, 5).toISOString() }),
      ev({ studentId: 's1', result: 'plus', at: new Date(2026, 7, 5).toISOString() }), // inny miesiac
      ev({ studentId: 's2', result: 'plus', at: new Date(2026, 8, 5).toISOString() }), // inny uczen
    ];
    expect(monthBalance(events, 's1', '2026-09')).toEqual({ plus: 2, minus: 1, pass: 1, hint: 1 });
  });
});

describe('wheelTargetAngle', () => {
  it('trafia w zadany sektor po zastosowaniu obrotu', () => {
    const count = 5;
    const spins = 3;
    for (let index = 0; index < count; index++) {
      const angle = wheelTargetAngle(index, count, spins, () => 0.5);
      // Po obrocie o `angle`, punkt sektora ktory ladowal na pointerze (0) to (segment*index + offset).
      const segment = 360 / count;
      const margin = segment * 0.15;
      const offset = margin + 0.5 * (segment - margin * 2);
      const sectorPoint = index * segment + offset;
      const landing = (360 - (angle % 360)) % 360;
      expect(landing).toBeCloseTo(sectorPoint % 360, 5);
    }
  });

  it('zawiera pelne obroty', () => {
    const angle = wheelTargetAngle(0, 4, 3, () => 0);
    expect(angle).toBeGreaterThanOrEqual(3 * 360);
  });

  it('zwraca 0 dla pustego kola', () => {
    expect(wheelTargetAngle(0, 0, 3)).toBe(0);
  });
});
