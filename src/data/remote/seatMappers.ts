// Mapowanie miejsc w lawkach <-> wiersze Supabase. Schemat:
// supabase/migrations/0023_seats.sql. Osobny plik jak absenceMappers.ts,
// bo mappers.ts jest juz za dlugi.
//
// Kolumna nazywa sie w bazie `col`, nie `column` - to slowo kluczowe SQL i
// wymagaloby cudzyslowow w kazdym zapytaniu.

import type { Seat, SeatColumn } from '../types';

export interface SeatRow {
  id: string;
  class_id: string;
  student_id: string;
  col: SeatColumn;
  row: number;
  side: number;
}

export function seatToRow(seat: Seat): SeatRow {
  return {
    id: seat.id,
    class_id: seat.classId,
    student_id: seat.studentId,
    col: seat.column,
    row: seat.row,
    side: seat.side,
  };
}

export function rowToSeat(row: SeatRow): Seat {
  return {
    id: row.id,
    classId: row.class_id,
    studentId: row.student_id,
    column: row.col,
    row: row.row,
    side: row.side === 2 ? 2 : 1,
  };
}
