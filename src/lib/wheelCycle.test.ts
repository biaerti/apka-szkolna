import { describe, expect, it } from 'vitest';
import type { RecapEvent, Student } from '../data/types';
import { wheelCycle } from './wheelCycle';

const st = (id: string, active = true): Student => ({ id, classId: 'c1', firstName: id, lastName: id, number: 1, active });
const ev = (studentId: string, at: Date, result: RecapEvent['result'] = 'plus'): RecapEvent => ({
  id: Math.random().toString(36),
  studentId,
  classId: 'c1',
  result,
  at: at.toISOString(),
});
const students = [st('a'), st('b'), st('c'), st('x', false)];

describe('wheelCycle', () => {
  it('pamieta odpowiedzi z poprzednich dni az do wyczerpania', () => {
    const events = [ev('a', new Date(2026, 9, 5, 9)), ev('b', new Date(2026, 9, 6, 10), 'kropka')];
    const r = wheelCycle(events, 'c1', students, new Date(2026, 9, 7, 8));
    expect([...r.answered.keys()].sort()).toEqual(['a', 'b']);
    expect(r.cycle).toBe(0);
  });

  it('gdy odpowie cala aktywna klasa, kolo sie zeruje', () => {
    const events = [
      ev('a', new Date(2026, 9, 5, 9)),
      ev('b', new Date(2026, 9, 5, 9, 5)),
      ev('c', new Date(2026, 9, 6, 9)),
      ev('a', new Date(2026, 9, 6, 9, 10)),
    ];
    const r = wheelCycle(events, 'c1', students, new Date(2026, 9, 6, 12));
    expect(r.cycle).toBe(1);
    expect([...r.answered.keys()]).toEqual(['a']);
  });

  it('uwagi nie skreslaja z kola, a zdarzenia sprzed startu sie nie licza', () => {
    const events = [ev('a', new Date(2026, 9, 2, 9)), ev('b', new Date(2026, 9, 5, 9), 'uwaga')];
    expect(wheelCycle(events, 'c1', students, new Date(2026, 9, 5, 12)).answered.size).toBe(0);
  });

  it('przed startem pamieta tylko dzisiejszy dzien', () => {
    const events = [ev('a', new Date(2026, 9, 1, 9)), ev('b', new Date(2026, 9, 2, 9))];
    expect([...wheelCycle(events, 'c1', students, new Date(2026, 9, 2, 12)).answered.keys()]).toEqual(['b']);
  });

  it('reczny reset zaczyna nowy obieg od podanej chwili', () => {
    const events = [ev('a', new Date(2026, 9, 5, 9)), ev('b', new Date(2026, 9, 5, 11))];
    const r = wheelCycle(events, 'c1', students, new Date(2026, 9, 5, 12), new Date(2026, 9, 5, 10).toISOString());
    expect([...r.answered.keys()]).toEqual(['b']);
  });
});
