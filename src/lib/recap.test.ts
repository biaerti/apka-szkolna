import { describe, expect, it } from 'vitest';
import type { RecapEvent, Settings, Slide, Student } from '../data/types';
import {
  answeredOnDay,
  answersByQuestion,
  lessonWheelNote,
  buildRoundEntries,
  drawableEntries,
  canPass,
  earnedFive,
  earnedOne,
  monthBalance,
  nextRandomIndex,
  nextSequential,
  outstandingPlomby,
  outstandingPlusy,
  passesUsedThisMonth,
  pickRandom,
  plannedDraws,
  resolveRecapMode,
  shuffle,
  warningsThisMonth,
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
  answerTimerSec: 30,
  plusesForFive: 3,
  plombyForOne: 3,
  reviewQuestionCount: 5,
  slideFontPercent: 100,
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

  it('licznik uwag zeruje sie z poczatkiem miesiaca', () => {
    const events: RecapEvent[] = [
      ev({ studentId: 's1', result: 'uwaga', at: new Date(2026, 7, 10).toISOString() }),
      ev({ studentId: 's1', result: 'uwaga', at: new Date(2026, 7, 20).toISOString() }),
      ev({ studentId: 's1', result: 'uwaga', at: new Date(2026, 7, 25).toISOString() }),
    ];
    expect(warningsThisMonth(events, 's1', new Date(2026, 7, 26))).toBe(3);
    // 1. wrzesnia licznik startuje od zera.
    expect(warningsThisMonth(events, 's1', new Date(2026, 8, 1))).toBe(0);
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

describe('resolveRecapMode', () => {
  function recapSlide(partial: Partial<Extract<Slide, { kind: 'recap' }>> = {}): Extract<Slide, { kind: 'recap' }> {
    return { id: 's1', kind: 'recap', questionSetId: 'qs1', ...partial };
  }

  it('uzywa pola mode, gdy jest ustawione', () => {
    expect(resolveRecapMode(recapSlide({ mode: 'powtorzeniowe' }))).toBe('powtorzeniowe');
    expect(resolveRecapMode(recapSlide({ mode: 'po-lekcji' }))).toBe('po-lekcji');
    expect(resolveRecapMode(recapSlide({ mode: 'demo' }))).toBe('demo');
  });
  it('bez pola mode: variant "demo" daje tryb demo', () => {
    expect(resolveRecapMode(recapSlide({ variant: 'demo' }))).toBe('demo');
  });
  it('stary slajd bez mode i bez variant - domyslnie po-lekcji (wsteczna zgodnosc)', () => {
    expect(resolveRecapMode(recapSlide())).toBe('po-lekcji');
  });
});

describe('buildRoundEntries', () => {
  const s1 = stu({ id: 's1', number: 1 });
  const s2 = stu({ id: 's2', number: 2 });
  const s3 = stu({ id: 's3', number: 3 });

  it('jedno wejscie na ucznia, gdy nikt jeszcze nie odpowiadal', () => {
    const entries = buildRoundEntries({
      students: [s1, s2, s3],
      usedFor: () => 0,
    });
    expect(entries).toHaveLength(3);
    expect(entries.map((e) => e.key)).toEqual(['s1#0', 's2#0', 's3#0']);
    expect(entries.every((e) => !e.done)).toBe(true);
  });

  it('wykorzystane wejscia zostaja na kole, ale sa oznaczone jako done', () => {
    const used = new Map([
      ['s1', 1], // wykorzystane
    ]);
    const entries = buildRoundEntries({
      students: [s1, s2, s3],
      usedFor: (id) => used.get(id) ?? 0,
    });
    expect(entries.map((e) => [e.key, e.done])).toEqual([
      ['s1#0', true],
      ['s2#0', false],
      ['s3#0', false],
    ]);
  });

  it('allowRepeats zdejmuje oznaczenie done ze wszystkich wejsc', () => {
    const used = new Map([['s1', 1]]);
    const entries = buildRoundEntries({
      students: [s1, s2],
      usedFor: (id) => used.get(id) ?? 0,
      allowRepeats: true,
    });
    expect(entries.map((e) => e.student.id)).toEqual(['s1', 's2']);
    expect(entries.every((e) => !e.done)).toBe(true);
  });
});

describe('drawableEntries', () => {
  const s1 = stu({ id: 's1', number: 1 });
  const s2 = stu({ id: 's2', number: 2 });

  it('losowanie omija wejscia oznaczone jako done', () => {
    const used = new Map([['s1', 1]]);
    const entries = buildRoundEntries({
      students: [s1, s2],
      usedFor: (id) => used.get(id) ?? 0,
    });
    expect(drawableEntries(entries).map((e) => e.key)).toEqual(['s2#0']);
  });
});

describe('plannedDraws', () => {
  it('kazdy uczen to jedno losowanie', () => {
    const s1 = stu({ id: 's1' });
    const s2 = stu({ id: 's2' });
    const s3 = stu({ id: 's3' });
    expect(plannedDraws([s1, s2, s3])).toBe(3);
  });

  it('0 dla pustej listy uczniow', () => {
    expect(plannedDraws([])).toBe(0);
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

describe('earnedOne', () => {
  it('false ponizej progu plombyForOne', () => {
    const events: RecapEvent[] = [
      ev({ studentId: 's1', result: 'plomba', at: new Date(2026, 8, 1).toISOString() }),
      ev({ studentId: 's1', result: 'plomba', at: new Date(2026, 8, 2).toISOString() }),
    ];
    expect(earnedOne(events, 's1', settings)).toBe(false);
  });

  it('true od progu plombyForOne', () => {
    const events: RecapEvent[] = [
      ev({ studentId: 's1', result: 'plomba', at: new Date(2026, 8, 1).toISOString() }),
      ev({ studentId: 's1', result: 'plomba', at: new Date(2026, 8, 2).toISOString() }),
      ev({ studentId: 's1', result: 'hint_plomba', at: new Date(2026, 8, 3).toISOString() }),
    ];
    expect(earnedOne(events, 's1', settings)).toBe(true);
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


describe('answersByQuestion', () => {
  it('grupuje odpowiedzi klasy po pytaniu, od najstarszej', () => {
    const events = [
      ev({ studentId: 's2', questionId: 'q1', result: 'plomba', at: new Date(2026, 8, 2).toISOString() }),
      ev({ studentId: 's1', questionId: 'q1', result: 'plus', at: new Date(2026, 8, 1).toISOString() }),
      ev({ studentId: 's3', questionId: 'q2', result: 'kropka', at: new Date(2026, 8, 3).toISOString() }),
    ];
    const map = answersByQuestion(events, 'c1');
    expect(map.get('q1')?.map((a) => [a.studentId, a.result])).toEqual([
      ['s1', 'plus'],
      ['s2', 'plomba'],
    ]);
    expect(map.get('q2')?.length).toBe(1);
  });

  it('pomija inne klasy, uwagi, podpowiedzi i zdarzenia bez pytania', () => {
    const events = [
      ev({ questionId: 'q1', classId: 'c2', result: 'plus' }),
      ev({ questionId: 'q1', result: 'uwaga' }),
      ev({ questionId: 'q1', result: 'hint_plomba' }),
      ev({ result: 'plus' }),
    ];
    expect(answersByQuestion(events, 'c1').size).toBe(0);
  });
});

describe('kolo na lekcji: answeredOnDay / lessonWheelNote', () => {
  const day = '2026-09-07';
  const atDay = (h: number) => new Date(2026, 8, 7, h, 0, 0).toISOString();

  it('liczy tylko oceny (plus/kropka/plomba/pas) z tej klasy i z tego dnia', () => {
    const events = [
      ev({ studentId: 's1', classId: 'c1', result: 'plus', at: atDay(8) }),
      ev({ studentId: 's1', classId: 'c1', result: 'kropka', at: atDay(9) }),
      ev({ studentId: 's2', classId: 'c1', result: 'pass', at: atDay(9) }),
      // uwaga i podpowiedz to nie "odpowiadal"
      ev({ studentId: 's3', classId: 'c1', result: 'uwaga', at: atDay(9) }),
      ev({ studentId: 's3', classId: 'c1', result: 'hint_plomba', at: atDay(9) }),
      // inna klasa
      ev({ studentId: 's4', classId: 'c2', result: 'plus', at: atDay(9) }),
      // inny dzien
      ev({ studentId: 's5', classId: 'c1', result: 'plus', at: new Date(2026, 8, 6, 23, 30).toISOString() }),
    ];
    const map = answeredOnDay(events, 'c1', day);
    expect(map.get('s1')).toBe(2);
    expect(map.get('s2')).toBe(1);
    expect(map.has('s3')).toBe(false);
    expect(map.has('s4')).toBe(false);
    expect(map.has('s5')).toBe(false);
  });

  it('pusta lista zdarzen = nikt jeszcze nie odpowiadal', () => {
    expect(answeredOnDay([], 'c1', day).size).toBe(0);
  });

  it('adnotacja zdarzenia: kod lekcji + kod zadania, bez kodu lekcji sam kod zadania', () => {
    expect(lessonWheelNote('4.3', 'Z2')).toBe('4.3 Z2');
    expect(lessonWheelNote(undefined, 'Z1')).toBe('Z1');
  });
});
