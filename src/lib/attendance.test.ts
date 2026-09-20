import { describe, expect, it } from 'vitest';
import type { Absence } from '../data/types';
import { absenceId, absentOnDay, attendanceForLesson, attendanceId } from './attendance';

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

  it('rozróżnia godziny i spóźnienie nie usuwa ucznia z koła', () => {
    const list: Absence[] = [
      { id: attendanceId('2026-09-14', 2, 's1'), studentId: 's1', classId: 'c1', date: '2026-09-14', period: 2, status: 'absent', at: '2026-09-14T08:00:00.000Z' },
      { id: attendanceId('2026-09-14', 3, 's2'), studentId: 's2', classId: 'c1', date: '2026-09-14', period: 3, status: 'late', at: '2026-09-14T09:00:00.000Z' },
    ];
    expect([...absentOnDay(list, 'c1', '2026-09-14', 2)]).toEqual(['s1']);
    expect([...absentOnDay(list, 'c1', '2026-09-14', 3)]).toEqual([]);
    expect(attendanceForLesson(list, 'c1', '2026-09-14', 3).get('s2')).toBe('late');
  });
});
