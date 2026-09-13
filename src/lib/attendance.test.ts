import { describe, expect, it } from 'vitest';
import type { Absence } from '../data/types';
import { absenceId, absentOnDay } from './attendance';

function abs(studentId: string, classId: string, date: string): Absence {
  return { id: absenceId(date, studentId), studentId, classId, date, at: `${date}T08:00:00.000Z` };
}

describe('absentOnDay', () => {
  it('bierze tylko podana klase i dzien', () => {
    const list = [abs('s1', 'c1', '2026-09-14'), abs('s2', 'c1', '2026-09-15'), abs('s3', 'c2', '2026-09-14')];
    expect([...absentOnDay(list, 'c1', '2026-09-14')]).toEqual(['s1']);
  });

  it('id jest stale dla dnia i ucznia', () => {
    expect(absenceId('2026-09-14', 's1')).toBe(absenceId('2026-09-14', 's1'));
    expect(absenceId('2026-09-14', 's1')).not.toBe(absenceId('2026-09-15', 's1'));
  });
});
