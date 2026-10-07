import { describe, expect, it } from 'vitest';
import { zadaniaDnia, zadaniaLekcji, zadaniaOgolne, zadaniaZalegle, type Zadanie } from './zadania';

function z(id: string, patch: Partial<Zadanie>): Zadanie {
  return { id, tekst: id, data: null, lekcja: null, klasaId: null, zrobione: false, createdAt: `2026-10-07T08:0${id.length}:00Z`, ...patch };
}

const list = [
  z('ogolne', {}),
  z('ogolne-zrobione', { zrobione: true }),
  z('dzien', { data: '2026-10-07' }),
  z('lekcja', { data: '2026-10-07', lekcja: 3, klasaId: 'iva' }),
  z('wczoraj', { data: '2026-10-06', lekcja: 2 }),
  z('wczoraj-zrobione', { data: '2026-10-06', zrobione: true }),
];

describe('zadania', () => {
  it('rozdziela ogolne, dzien i lekcje', () => {
    expect(zadaniaOgolne(list).map((x) => x.id)).toEqual(['ogolne', 'ogolne-zrobione']);
    expect(zadaniaDnia(list, '2026-10-07').map((x) => x.id)).toEqual(['dzien']);
    expect(zadaniaLekcji(list, '2026-10-07', 3).map((x) => x.id)).toEqual(['lekcja']);
    expect(zadaniaLekcji(list, '2026-10-07', 2)).toEqual([]);
  });

  it('zalegle to tylko niezrobione z poprzednich dni', () => {
    expect(zadaniaZalegle(list, '2026-10-07').map((x) => x.id)).toEqual(['wczoraj']);
  });
});
