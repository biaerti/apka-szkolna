import { describe, expect, it } from 'vitest';
import { googleCalendarUrl, godzinySpotkania, spotkaniaDnia, spotkaniePoLekcji, znaneTagi, type Spotkanie } from './spotkania';

function s(id: string, patch: Partial<Spotkanie>): Spotkanie {
  return { id, tytul: id, data: '2026-10-14', od: '13:00', do: null, tag: null, wGoogle: false, createdAt: '2026-10-12T10:00:00Z', ...patch };
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

  it('pisze godziny', () => {
    expect(godzinySpotkania({ od: '13:00', do: null })).toBe('13:00');
    expect(godzinySpotkania({ od: '13:00', do: '14:30' })).toBe('13:00-14:30');
  });

  it('robi link do Kalendarza Google', () => {
    const url = new URL(googleCalendarUrl(s('x', { tytul: 'Spotkanie z Neronem', od: '13:00', tag: 'Neron' })));
    expect(url.searchParams.get('action')).toBe('TEMPLATE');
    expect(url.searchParams.get('text')).toBe('Spotkanie z Neronem');
    expect(url.searchParams.get('dates')).toBe('20261014T130000/20261014T140000');
    expect(url.searchParams.get('ctz')).toBe('Europe/Warsaw');
    expect(url.searchParams.get('details')).toBe('Tag: Neron');
  });

  it('koniec spotkania i przejscie przez polnoc', () => {
    expect(new URL(googleCalendarUrl(s('x', { od: '8:05', do: '9:30' }))).searchParams.get('dates')).toBe('20261014T080500/20261014T093000');
    expect(new URL(googleCalendarUrl(s('x', { data: '2026-10-31', od: '23:30' }))).searchParams.get('dates')).toBe('20261031T233000/20261101T003000');
  });
});
