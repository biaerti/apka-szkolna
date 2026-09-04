import { describe, expect, it } from 'vitest';
import type { RecapEvent, Settings, Student } from '../data/types';
import {
  buildPool,
  canEarnPlus,
  canPass,
  earnedFive,
  monthBalance,
  nextRandomIndex,
  nextSequential,
  outstandingPlomby,
  outstandingPlusy,
  owesTasks,
  passesUsedThisMonth,
  pickRandom,
  plannedDraws,
  shuffle,
  warnLevel,
  warningsThisMonth,
  wheelEntriesFor,
  wheelTargetAngle,
} from './recap';

function ev(partial: Partial<RecapEvent>): RecapEvent {
  return {
    id: partial.id ?? Math.random().toString(36),
    studentId: partial.studentId ?? 's1',
    classId: partial.classId ?? 'c1',
    result: partial.result ?? 'plus',
    at: partial.at ?? new Date().toISOString(),
    questionId: partial.questionId,
    note: partial.note,
  };
}

function stu(partial: Partial<Student> & { id: string }): Student {
  return {
    classId: 'c1',
    firstName: 'Jan',
    lastName: 'Kowalski',
    number: 1,
    active: true,
    ...partial,
  };
}

const settings: Settings = {
  passesPerMonth: 3,
  hintGivesMinus: true,
  wheelSpinSec: 4,
  plusesForFive: 3,
  plombyForOne: 3,
};

describe('passesUsedThisMonth', () => {
  it('liczy tylko zdarzenia pass z tego samego miesiaca', () => {
    const now = new Date(2026, 8, 2); // wrzesien
    const events: RecapEvent[] = [
      ev({ studentId: 's1', result: 'pass', at: new Date(2026, 8, 1).toISOString() }), // ten miesiac (1. dnia)
      ev({ studentId: 's1', result: 'pass', at: new Date(2026, 8, 30).toISOString() }), // ten miesiac (ostatni dzien)
      ev({ studentId: 's1', result: 'pass', at: new Date(2026, 7, 31).toISOString() }), // poprzedni miesiac
      ev({ studentId: 's1', result: 'pass', at: new Date(2026, 9, 1).toISOString() }), // nastepny miesiac
      ev({ studentId: 's1', result: 'plus', at: new Date(2026, 8, 2).toISOString() }), // nie pass
      ev({ studentId: 's2', result: 'pass', at: new Date(2026, 8, 2).toISOString() }), // inny uczen
    ];
    expect(passesUsedThisMonth(events, 's1', now)).toBe(2);
  });

  it('pasy z poprzedniego miesiaca nie obciazaja biezacego', () => {
    const now = new Date(2026, 8, 2);
    const events: RecapEvent[] = [
      ev({ studentId: 's1', result: 'pass', at: new Date(2026, 7, 5).toISOString() }),
      ev({ studentId: 's1', result: 'pass', at: new Date(2026, 7, 12).toISOString() }),
      ev({ studentId: 's1', result: 'pass', at: new Date(2026, 7, 19).toISOString() }),
    ];
    expect(passesUsedThisMonth(events, 's1', now)).toBe(0);
  });
});

describe('warningsThisMonth', () => {
  it('liczy uwagi tylko z biezacego miesiaca i tylko tego ucznia', () => {
    const now = new Date(2026, 8, 15);
    const events: RecapEvent[] = [
      ev({ studentId: 's1', result: 'uwaga', at: new Date(2026, 8, 1).toISOString() }),
      ev({ studentId: 's1', result: 'uwaga', at: new Date(2026, 8, 15).toISOString() }),
      ev({ studentId: 's1', result: 'uwaga', at: new Date(2026, 7, 30).toISOString() }), // poprzedni miesiac
      ev({ studentId: 's1', result: 'plomba', at: new Date(2026, 8, 15).toISOString() }), // nie uwaga
      ev({ studentId: 's2', result: 'uwaga', at: new Date(2026, 8, 15).toISOString() }), // inny uczen
    ];
    expect(warningsThisMonth(events, 's1', now)).toBe(2);
  });

  it('eskalacja zeruje sie z poczatkiem miesiaca', () => {
    const events: RecapEvent[] = [
      ev({ studentId: 's1', result: 'uwaga', at: new Date(2026, 7, 10).toISOString() }),
      ev({ studentId: 's1', result: 'uwaga', at: new Date(2026, 7, 20).toISOString() }),
      ev({ studentId: 's1', result: 'uwaga', at: new Date(2026, 7, 25).toISOString() }),
    ];
    // W sierpniu uczen mial trzy uwagi (podwojne wejscie do kola)...
    expect(wheelEntriesFor(warningsThisMonth(events, 's1', new Date(2026, 7, 26)))).toBe(2);
    // ...ale 1. wrzesnia licznik startuje od zera.
    expect(warningsThisMonth(events, 's1', new Date(2026, 8, 1))).toBe(0);
    expect(wheelEntriesFor(warningsThisMonth(events, 's1', new Date(2026, 8, 1)))).toBe(1);
  });
});

describe('canPass', () => {
  it('true gdy limit nie wyczerpany', () => {
    const now = new Date(2026, 8, 2);
    expect(canPass([], 's1', settings, now)).toBe(true);
  });

  it('true przy dwoch pasach, gdy limit miesieczny wynosi 3', () => {
    const now = new Date(2026, 8, 20);
    const events: RecapEvent[] = [
      ev({ studentId: 's1', result: 'pass', at: new Date(2026, 8, 1).toISOString() }),
      ev({ studentId: 's1', result: 'pass', at: new Date(2026, 8, 10).toISOString() }),
    ];
    expect(canPass(events, 's1', settings, now)).toBe(true);
  });

  it('false gdy limit miesieczny wyczerpany', () => {
    const now = new Date(2026, 8, 20);
    const events: RecapEvent[] = [
      ev({ studentId: 's1', result: 'pass', at: new Date(2026, 8, 1).toISOString() }),
      ev({ studentId: 's1', result: 'pass', at: new Date(2026, 8, 10).toISOString() }),
      ev({ studentId: 's1', result: 'pass', at: new Date(2026, 8, 15).toISOString() }),
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

describe('warnLevel', () => {
  it('none dla 0 uwag', () => {
    expect(warnLevel(0)).toBe('none');
  });
  it('warned dla 1 uwagi', () => {
    expect(warnLevel(1)).toBe('warned');
  });
  it('no_plus dla 2 uwag', () => {
    expect(warnLevel(2)).toBe('no_plus');
  });
  it('doubled dla 3 i wiecej uwag', () => {
    expect(warnLevel(3)).toBe('doubled');
    expect(warnLevel(5)).toBe('doubled');
  });
});

describe('wheelEntriesFor', () => {
  it('1 wejscie ponizej progu podwojenia', () => {
    expect(wheelEntriesFor(0)).toBe(1);
    expect(wheelEntriesFor(1)).toBe(1);
    expect(wheelEntriesFor(2)).toBe(1);
  });
  it('2 wejscia od progu podwojenia (3 uwagi)', () => {
    expect(wheelEntriesFor(3)).toBe(2);
    expect(wheelEntriesFor(4)).toBe(2);
  });
});

describe('canEarnPlus', () => {
  it('true ponizej progu blokady plusow', () => {
    expect(canEarnPlus(0)).toBe(true);
    expect(canEarnPlus(1)).toBe(true);
  });
  it('false od progu blokady plusow', () => {
    expect(canEarnPlus(2)).toBe(false);
    expect(canEarnPlus(3)).toBe(false);
  });
});

describe('buildPool', () => {
  const s1 = stu({ id: 's1', number: 1 });
  const s2 = stu({ id: 's2', number: 2 });
  const s3 = stu({ id: 's3', number: 3 });

  it('jedno wejscie na ucznia bez uwag i bez wczesniejszych odpowiedzi', () => {
    const pool = buildPool({
      students: [s1, s2, s3],
      warningsFor: () => 0,
      usedFor: () => 0,
    });
    expect(pool).toHaveLength(3);
    expect(pool.map((p) => p.key)).toEqual(['s1#0', 's2#0', 's3#0']);
  });

  it('uczen z 3 uwagami dostaje dwa wejscia', () => {
    const warnings = new Map([['s2', 3]]);
    const pool = buildPool({
      students: [s1, s2, s3],
      warningsFor: (id) => warnings.get(id) ?? 0,
      usedFor: () => 0,
    });
    expect(pool.filter((p) => p.student.id === 's2')).toHaveLength(2);
    expect(pool.filter((p) => p.student.id === 's1')).toHaveLength(1);
    expect(pool.map((p) => p.key)).toEqual(['s1#0', 's2#0', 's2#1', 's3#0']);
  });

  it('pomija wejscia juz wykorzystane w rundzie', () => {
    const warnings = new Map([['s2', 3]]);
    const used = new Map([
      ['s1', 1], // wykorzystane w calosci
      ['s2', 1], // z dwoch wejsc zostalo jedno
    ]);
    const pool = buildPool({
      students: [s1, s2, s3],
      warningsFor: (id) => warnings.get(id) ?? 0,
      usedFor: (id) => used.get(id) ?? 0,
    });
    expect(pool.map((p) => p.key)).toEqual(['s2#0', 's3#0']);
  });

  it('allowRepeats ignoruje juz wykorzystane wejscia', () => {
    const used = new Map([['s1', 1]]);
    const pool = buildPool({
      students: [s1, s2],
      warningsFor: () => 0,
      usedFor: (id) => used.get(id) ?? 0,
      allowRepeats: true,
    });
    expect(pool.map((p) => p.student.id)).toEqual(['s1', 's2']);
  });
});

describe('plannedDraws', () => {
  it('sumuje wejscia do kola dla wszystkich uczniow', () => {
    const s1 = stu({ id: 's1' });
    const s2 = stu({ id: 's2' });
    const s3 = stu({ id: 's3' });
    const warnings = new Map([['s2', 3]]);
    expect(plannedDraws([s1, s2, s3], (id) => warnings.get(id) ?? 0)).toBe(4); // 1 + 2 + 1
  });

  it('0 dla pustej listy uczniow', () => {
    expect(plannedDraws([], () => 0)).toBe(0);
  });
});

describe('monthBalance', () => {
  it('liczy zdarzenia ucznia w danym miesiacu wedlug nowych nazw', () => {
    const events: RecapEvent[] = [
      ev({ studentId: 's1', result: 'plus', at: new Date(2026, 8, 2).toISOString() }),
      ev({ studentId: 's1', result: 'plus', at: new Date(2026, 8, 5).toISOString() }),
      ev({ studentId: 's1', result: 'kropka', at: new Date(2026, 8, 5).toISOString() }),
      ev({ studentId: 's1', result: 'plomba', at: new Date(2026, 8, 5).toISOString() }),
      ev({ studentId: 's1', result: 'pass', at: new Date(2026, 8, 5).toISOString() }),
      ev({ studentId: 's1', result: 'hint_plomba', at: new Date(2026, 8, 5).toISOString() }),
      ev({ studentId: 's1', result: 'uwaga', at: new Date(2026, 8, 5).toISOString() }),
      ev({ studentId: 's1', result: 'plus', at: new Date(2026, 7, 5).toISOString() }), // inny miesiac
      ev({ studentId: 's2', result: 'plus', at: new Date(2026, 8, 5).toISOString() }), // inny uczen
    ];
    expect(monthBalance(events, 's1', '2026-09')).toEqual({
      plus: 2,
      kropka: 1,
      plomba: 1,
      pass: 1,
      hint: 1,
      uwaga: 1,
      plombyTotal: 2, // plomba + hint
    });
  });
});

describe('outstandingPlomby', () => {
  it('liczy plomby (w tym za podpowiadanie) od poczatku, gdy nie bylo rozliczenia', () => {
    const events: RecapEvent[] = [
      ev({ studentId: 's1', result: 'plomba', questionId: 'q1', at: new Date(2026, 8, 1).toISOString() }),
      ev({ studentId: 's1', result: 'hint_plomba', questionId: 'q2', at: new Date(2026, 8, 2).toISOString() }),
      ev({ studentId: 's1', result: 'plus', at: new Date(2026, 8, 3).toISOString() }),
    ];
    const result = outstandingPlomby(events, 's1');
    expect(result.count).toBe(2);
    expect(result.questionIds).toEqual(['q1', 'q2']);
  });

  it('zeruje sie po rozliczeniu', () => {
    const events: RecapEvent[] = [
      ev({ studentId: 's1', result: 'plomba', at: new Date(2026, 8, 1).toISOString() }),
      ev({ studentId: 's1', result: 'plomba', at: new Date(2026, 8, 2).toISOString() }),
      ev({ studentId: 's1', result: 'rozliczenie', at: new Date(2026, 8, 3).toISOString() }),
      ev({ studentId: 's1', result: 'plomba', at: new Date(2026, 8, 4).toISOString() }),
    ];
    expect(outstandingPlomby(events, 's1').count).toBe(1);
  });

  it('zeruje sie po jedynce', () => {
    const events: RecapEvent[] = [
      ev({ studentId: 's1', result: 'plomba', at: new Date(2026, 8, 1).toISOString() }),
      ev({ studentId: 's1', result: 'plomba', at: new Date(2026, 8, 2).toISOString() }),
      ev({ studentId: 's1', result: 'plomba', at: new Date(2026, 8, 3).toISOString() }),
      ev({ studentId: 's1', result: 'jedynka', at: new Date(2026, 8, 4).toISOString() }),
    ];
    expect(outstandingPlomby(events, 's1').count).toBe(0);
  });
});

describe('outstandingPlusy', () => {
  it('liczy plusy od poczatku, gdy nie bylo piatki', () => {
    const events: RecapEvent[] = [
      ev({ studentId: 's1', result: 'plus', questionId: 'q1', at: new Date(2026, 8, 1).toISOString() }),
      ev({ studentId: 's1', result: 'plus', questionId: 'q2', at: new Date(2026, 8, 2).toISOString() }),
      ev({ studentId: 's1', result: 'plomba', at: new Date(2026, 8, 3).toISOString() }),
    ];
    const result = outstandingPlusy(events, 's1');
    expect(result.count).toBe(2);
    expect(result.questionIds).toEqual(['q1', 'q2']);
  });

  it('zeruje sie po piatce', () => {
    const events: RecapEvent[] = [
      ev({ studentId: 's1', result: 'plus', at: new Date(2026, 8, 1).toISOString() }),
      ev({ studentId: 's1', result: 'plus', at: new Date(2026, 8, 2).toISOString() }),
      ev({ studentId: 's1', result: 'plus', at: new Date(2026, 8, 3).toISOString() }),
      ev({ studentId: 's1', result: 'piatka', at: new Date(2026, 8, 4).toISOString() }),
      ev({ studentId: 's1', result: 'plus', at: new Date(2026, 8, 5).toISOString() }),
    ];
    expect(outstandingPlusy(events, 's1').count).toBe(1);
  });
});

describe('owesTasks', () => {
  it('false ponizej progu plombyForOne', () => {
    const events: RecapEvent[] = [
      ev({ studentId: 's1', result: 'plomba', at: new Date(2026, 8, 1).toISOString() }),
      ev({ studentId: 's1', result: 'plomba', at: new Date(2026, 8, 2).toISOString() }),
    ];
    expect(owesTasks(events, 's1', settings)).toBe(false);
  });

  it('true od progu plombyForOne', () => {
    const events: RecapEvent[] = [
      ev({ studentId: 's1', result: 'plomba', at: new Date(2026, 8, 1).toISOString() }),
      ev({ studentId: 's1', result: 'plomba', at: new Date(2026, 8, 2).toISOString() }),
      ev({ studentId: 's1', result: 'hint_plomba', at: new Date(2026, 8, 3).toISOString() }),
    ];
    expect(owesTasks(events, 's1', settings)).toBe(true);
  });
});

describe('earnedFive', () => {
  it('false ponizej progu plusesForFive', () => {
    const events: RecapEvent[] = [
      ev({ studentId: 's1', result: 'plus', at: new Date(2026, 8, 1).toISOString() }),
      ev({ studentId: 's1', result: 'plus', at: new Date(2026, 8, 2).toISOString() }),
    ];
    expect(earnedFive(events, 's1', settings)).toBe(false);
  });

  it('true od progu plusesForFive', () => {
    const events: RecapEvent[] = [
      ev({ studentId: 's1', result: 'plus', at: new Date(2026, 8, 1).toISOString() }),
      ev({ studentId: 's1', result: 'plus', at: new Date(2026, 8, 2).toISOString() }),
      ev({ studentId: 's1', result: 'plus', at: new Date(2026, 8, 3).toISOString() }),
    ];
    expect(earnedFive(events, 's1', settings)).toBe(true);
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

describe('nextSequential', () => {
  it('zwraca pierwszego ucznia z puli', () => {
    expect(nextSequential(['a', 'b', 'c'])).toBe('a');
  });

  it('zwraca undefined dla pustej puli', () => {
    expect(nextSequential([])).toBeUndefined();
  });
});

describe('shuffle', () => {
  it('zawiera te same elementy co wejscie', () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffle(input, () => 0.5);
    expect(result).toHaveLength(input.length);
    expect([...result].sort()).toEqual(input);
  });

  it('nie mutuje oryginalnej tablicy', () => {
    const input = [1, 2, 3];
    shuffle(input, () => 0.5);
    expect(input).toEqual([1, 2, 3]);
  });

  it('jest deterministyczne dla stalego rng', () => {
    const a = shuffle([1, 2, 3, 4], () => 0.1);
    const b = shuffle([1, 2, 3, 4], () => 0.1);
    expect(a).toEqual(b);
  });
});

describe('nextRandomIndex', () => {
  it('zwraca kolejny indeks, gdy lista nie jest wyczerpana', () => {
    expect(nextRandomIndex(0, 3)).toEqual({ index: 1, reshuffle: false });
    expect(nextRandomIndex(1, 3)).toEqual({ index: 2, reshuffle: false });
  });

  it('sygnalizuje potrzebe ponownego tasowania po wyczerpaniu listy', () => {
    expect(nextRandomIndex(2, 3)).toEqual({ index: 0, reshuffle: true });
  });

  it('sygnalizuje reshuffle dla pustej listy', () => {
    expect(nextRandomIndex(0, 0)).toEqual({ index: 0, reshuffle: true });
  });
});
