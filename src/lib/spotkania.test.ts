import { describe, expect, it } from 'vitest';
import { spotkaniaDnia, spotkaniePoLekcji, znaneTagi, type Spotkanie } from './spotkania';

function s(id: string, patch: Partial<Spotkanie>): Spotkanie {
  return { id, tytul: id, data: '2026-10-14', od: '13:00', do: null, tag: null, createdAt: '2026-10-12T10:00:00Z', ...patch };
}

const periods = [
  { no: 1, start: '8:00', end: '8:45' },
  { no: 2, start: '8:50', end: '9:35' },
  { no: 3, start: '9:40', end: '10:25' },
  { no: 4, start: '10:35', end: '11:20' },
  { no: 5, start: '11:25', end: '12:10' },
  { no: 6, start: '12:30', end: '13:15' },
];

describe('spotkania', () => {
  it('bierze dzien i sortuje po godzinie', () => {
    const list = [s('pozno', { od: '18:00' }), s('inny-dzien', { data: '2026-10-15' }), s('rano', { od: '7:30' })];
    expect(spotkaniaDnia(list, '2026-10-14').map((x) => x.id)).toEqual(['rano', 'pozno']);
  });

  it('stawia spotkanie miedzy lekcjami', () => {
    expect(spotkaniePoLekcji('7:15', periods, 5)).toBe(0);
    expect(spotkaniePoLekcji('8:00', periods, 5)).toBe(1);
    expect(spotkaniePoLekcji('9:45', periods, 5)).toBe(3);
    // 13:00 w srode: ostatnia lekcja to 5., wiec spotkanie idzie na koniec dnia.
    expect(spotkaniePoLekcji('13:00', periods, 5)).toBe(5);
    expect(spotkaniePoLekcji('13:00', periods, 6)).toBe(6);
  });

  it('podpowiada najczestsze tagi', () => {
    expect(znaneTagi([s('a', { tag: 'Pretium' }), s('b', { tag: 'Neron' }), s('c', { tag: 'Neron' }), s('d', {})])).toEqual(['Neron', 'Pretium']);
  });
});
