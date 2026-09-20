import { describe, expect, it } from 'vitest';
import type { Student } from '../data/types';
import { matchVulcanAttendance, statusFromVulcanSymbol } from './vulcanAttendance';

const st = (id: string, number: number, firstName: string, lastName: string): Student => ({
  id,
  classId: 'c1',
  number,
  firstName,
  lastName,
  active: true,
});

const STUDENTS = [st('a', 1, 'Anna', 'Kowalska'), st('b', 2, 'Jan', 'Nowak'), st('c', 3, 'Ola', 'Wiśniewska')];

describe('statusFromVulcanSymbol', () => {
  it('mapuje symbole frekwencji', () => {
    expect(statusFromVulcanSymbol('-')).toBe('absent');
    expect(statusFromVulcanSymbol('−')).toBe('absent');
    expect(statusFromVulcanSymbol('u')).toBe('absent');
    expect(statusFromVulcanSymbol('s')).toBe('late');
    expect(statusFromVulcanSymbol('.')).toBe('present');
    expect(statusFromVulcanSymbol('∙')).toBe('present');
  });
  it('nieznany symbol (niesprawdzona frekwencja) -> undefined', () => {
    expect(statusFromVulcanSymbol('?')).toBeUndefined();
    expect(statusFromVulcanSymbol('')).toBeUndefined();
  });
});

describe('matchVulcanAttendance', () => {
  it('dopasowuje po "Nazwisko Imię" niezaleznie od wielkosci liter', () => {
    const { matched, unmatched } = matchVulcanAttendance(
      [
        { name: 'KOWALSKA ANNA', symbol: '-' },
        { name: 'Nowak Jan', symbol: '.' },
      ],
      STUDENTS,
    );
    expect(matched).toEqual([
      { studentId: 'a', status: 'absent' },
      { studentId: 'b', status: 'present' },
    ]);
    expect(unmatched).toEqual([]);
  });
  it('dopasowuje po numerze, gdy pisownia nazwiska sie rozjezdza', () => {
    const { matched, unmatched } = matchVulcanAttendance(
      [{ number: 3, name: 'Wisniewska Ola', symbol: 's' }],
      STUDENTS,
    );
    expect(matched).toEqual([{ studentId: 'c', status: 'late' }]);
    expect(unmatched).toEqual([]);
  });
  it('pomija wiersze z nieznanym symbolem, zglasza niedopasowane', () => {
    const { matched, unmatched } = matchVulcanAttendance(
      [
        { name: 'Kowalska Anna', symbol: '?' },
        { name: 'Obcy Uczeń', symbol: '-' },
      ],
      STUDENTS,
    );
    expect(matched).toEqual([]);
    expect(unmatched).toEqual(['Obcy Uczeń']);
  });
});
