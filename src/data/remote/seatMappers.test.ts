import { describe, expect, it } from 'vitest';
import { rowToSeat, seatToRow } from './seatMappers';

describe('seat mappers', () => {
  const seat = { id: 'seat-s1', classId: 'c1', studentId: 's1', column: 'P' as const, row: 1, side: 2 as const };

  it('wysyla kolumne jako col i wraca do tego samego obiektu', () => {
    const row = seatToRow(seat);
    expect(row.col).toBe('P');
    expect(row).not.toHaveProperty('column');
    expect(rowToSeat(row)).toEqual(seat);
  });

  it('strona spoza 1/2 w bazie wraca jako 1', () => {
    expect(rowToSeat({ ...seatToRow(seat), side: 7 }).side).toBe(1);
  });
});
