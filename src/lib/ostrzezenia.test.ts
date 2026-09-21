import { describe, expect, it } from 'vitest';
import type { RecapEvent } from '../data/types';
import { warningsByStudent } from './ostrzezenia';

function event(id: string, studentId: string, result: RecapEvent['result'], at: string, classId = 'k1'): RecapEvent {
  return { id, studentId, classId, result, at };
}

const events: RecapEvent[] = [
  event('e1', 's1', 'plus', '2026-09-01T08:00:00.000Z'),
  event('e2', 's1', 'ostrzezenie', '2026-09-10T09:00:00.000Z'),
  event('e3', 's2', 'uwaga', '2026-09-11T09:00:00.000Z'),
  event('e4', 's3', 'ostrzezenie', '2026-09-02T09:00:00.000Z', 'k2'),
];

describe('warningsByStudent', () => {
  it('daje ostrzezenia tylko z wybranej klasy', () => {
    const k1 = warningsByStudent(events, 'k1');
    expect([...k1.keys()]).toEqual(['s1']);
    expect(k1.get('s1')?.map((e) => e.id)).toEqual(['e2']);
    expect(warningsByStudent(events, 'k2').get('s3')?.[0]?.id).toBe('e4');
  });

  it('kilka ostrzezen jednego ucznia zbiera w liste od najstarszego', () => {
    const wiele = [
      ...events,
      event('e6', 's1', 'ostrzezenie', '2026-09-15T09:00:00.000Z'),
      event('e5', 's1', 'ostrzezenie', '2026-09-12T09:00:00.000Z'),
    ];
    expect(warningsByStudent(wiele, 'k1').get('s1')?.map((e) => e.id)).toEqual(['e2', 'e5', 'e6']);
  });
});
