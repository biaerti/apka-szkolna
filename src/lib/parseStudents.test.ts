import { describe, expect, it } from 'vitest';
import { parseStudentsText } from './parseStudents';

describe('parseStudentsText', () => {
  it('parsuje linie z numerem, nazwiskiem i imieniem', () => {
    const result = parseStudentsText('1. Kowalska Paulina');
    expect(result).toEqual([{ number: 1, lastName: 'Kowalska', firstName: 'Paulina', note: undefined }]);
  });

  it('parsuje linie bez numeru', () => {
    const result = parseStudentsText('Kowalska Paulina');
    expect(result).toEqual([{ number: undefined, lastName: 'Kowalska', firstName: 'Paulina', note: undefined }]);
  });

  it('parsuje uwage po myslniku', () => {
    const result = parseStudentsText('7. Lendhai Jascha - orzeczenie');
    expect(result).toEqual([
      { number: 7, lastName: 'Lendhai', firstName: 'Jascha', note: 'orzeczenie' },
    ]);
  });

  it('obsluguje dwuczlonowe nazwiska z myslnikiem', () => {
    const result = parseStudentsText('8. Łakatosz Santiago - orzeczenie');
    expect(result[0].lastName).toBe('Łakatosz');
    expect(result[0].firstName).toBe('Santiago');
    expect(result[0].note).toBe('orzeczenie');
  });

  it('obsluguje wieloczlonowe nazwisko bez uwagi', () => {
    const result = parseStudentsText('Nowak-Kowalski Jan');
    expect(result).toEqual([
      { number: undefined, lastName: 'Nowak-Kowalski', firstName: 'Jan', note: undefined },
    ]);
  });

  it('pomija puste linie', () => {
    const result = parseStudentsText('1. Kowalska Paulina\n\n\n2. Nowak Jan');
    expect(result).toHaveLength(2);
  });

  it('parsuje cala liste 20 uczniow bez bledow', () => {
    const text = [
      '1. Cisowski Jakub',
      '2. Downar Adam',
      '7. Lendhai Jascha - orzeczenie',
      '8. Łakatosz Santiago - orzeczenie',
      '11. Patejuk Ignacy - orzeczenie',
      '20. Żurek Zuzanna',
    ].join('\n');
    const result = parseStudentsText(text);
    expect(result).toHaveLength(6);
    expect(result.filter((s) => s.note === 'orzeczenie')).toHaveLength(3);
  });

  it('trymuje biale znaki wokol linii', () => {
    const result = parseStudentsText('   3. Nowak Jan   ');
    expect(result[0]).toEqual({ number: 3, lastName: 'Nowak', firstName: 'Jan', note: undefined });
  });
});
