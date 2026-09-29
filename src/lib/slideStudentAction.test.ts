import { describe, expect, it } from 'vitest';
import type { Slide } from '../data/types';
import { keepManualStudentActions, withStudentAction } from './slideStudentAction';

const screen = (id: string, code: string): Slide => ({
  id, kind: 'image', url: `czytanki:${code}.webp`, page: 63, code, studentAction: 'oral', studentActionText: 'Ustnie',
});

describe('keepManualStudentActions', () => {
  it('zostawia plakietke przestawiona recznie, gdy lekcja odswieza sie z kodu', () => {
    const old = [withStudentAction(screen('a', 's. 63 zad. 3'), 'write-answer', 'Do zeszytu'), screen('b', 's. 63 zad. 5')];
    const fresh = [screen('x', 's. 63 zad. 3'), screen('y', 's. 63 zad. 5')];
    const wynik = keepManualStudentActions(fresh, old);
    expect(wynik[0]).toMatchObject({ id: 'x', studentAction: 'write-answer', studentActionText: 'Do zeszytu', studentActionManual: true });
    expect(wynik[1]).toMatchObject({ id: 'y', studentAction: 'oral' });
    expect(wynik[1]).not.toHaveProperty('studentActionManual');
  });

  it('bez recznych zmian zwraca slajdy z kodu bez zmian', () => {
    const fresh = [screen('x', 's. 63 zad. 3')];
    expect(keepManualStudentActions(fresh, [screen('a', 's. 63 zad. 3')])).toBe(fresh);
  });
});
