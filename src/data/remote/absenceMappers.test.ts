import { describe, expect, it } from 'vitest';
import { absenceToRow, rowToAbsence } from './absenceMappers';

describe('absence mappers', () => {
  const base = { id: 'a1', studentId: 's1', classId: 'c1', date: '2026-09-14', period: 3, at: '2026-09-14T08:00:00.000Z' };

  it('pomija status zwykłej nieobecności dla zgodności ze schematem 0021', () => {
    expect(absenceToRow({ ...base, status: 'absent' })).not.toHaveProperty('status');
  });

  it('wysyła i odczytuje status spóźnienia po migracji 0022', () => {
    const row = absenceToRow({ ...base, status: 'late' });
    expect(row.status).toBe('late');
    expect(rowToAbsence(row).status).toBe('late');
  });
});
