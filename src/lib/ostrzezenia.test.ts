import { describe, expect, it } from 'vitest';
import type { RecapEvent } from '../data/types';
import { activeWarning, warningsByStudent } from './ostrzezenia';

function event(id: string, studentId: string, result: RecapEvent['result'], at: string, classId = 'k1'): RecapEvent {
  return { id, studentId, classId, result, at };
}

const events: RecapEvent[] = [
  event('e1', 's1', 'plus', '2026-09-01T08:00:00.000Z'),
  event('e2', 's1', 'ostrzezenie', '2026-09-10T09:00:00.000Z'),
  event('e3', 's2', 'uwaga', '2026-09-11T09:00:00.000Z'),
  event('e4', 's3', 'ostrzezenie', '2026-09-02T09:00:00.000Z', 'k2'),
];

describe('activeWarning', () => {
  it('znajduje ostrzezenie ucznia, a przy innych wynikach daje undefined', () => {
    expect(activeWarning(events, 's1')?.id).toBe('e2');
    expect(activeWarning(events, 's2')).toBeUndefined();
  });

  it('przy kilku ostrzezeniach bierze najnowsze', () => {
    const wiele = [...events, event('e5', 's1', 'ostrzezenie', '2026-09-15T09:00:00.000Z')];
    expect(activeWarning(wiele, 's1')?.id).toBe('e5');
  });
});

describe('warningsByStudent', () => {
  it('daje ostrzezenia tylko z wybranej klasy', () => {
    const k1 = warningsByStudent(events, 'k1');
    expect([...k1.keys()]).toEqual(['s1']);
    expect(warningsByStudent(events, 'k2').get('s3')?.id).toBe('e4');
  });
});
