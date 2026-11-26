import { describe, expect, it } from 'vitest';
import { CEL_TYGODNIA, poczatekTygodnia, stanWyzwania } from './wyzwanie';

const w = (lekcja: string, data: string) => ({ lekcja, created_at: `${data}T15:00:00` });

describe('wyzwanie tygodnia', () => {
  it('tydzien zaczyna sie w poniedzialek', () => {
    expect(poczatekTygodnia(new Date(2026, 10, 26))).toBe('2026-11-23'); // czwartek
    expect(poczatekTygodnia(new Date(2026, 10, 29))).toBe('2026-11-23'); // niedziela
    expect(poczatekTygodnia(new Date(2026, 10, 30))).toBe('2026-11-30'); // poniedzialek
  });

  it('ta sama lekcja dwa razy liczy sie raz', () => {
    const s = stanWyzwania([w('zd:a', '2026-11-24'), w('zd:a', '2026-11-25'), w('zd:b', '2026-11-25')], new Date(2026, 10, 26));
    expect(s.teraz).toBe(2);
    expect(s.dniDoKonca).toBe(4);
  });

  it('pelny tydzien to poziom, a miniony tydzien zostaje zamkniety', () => {
    const stary = Array.from({ length: CEL_TYGODNIA }, (_, i) => w(`zd:${i}`, '2026-11-17'));
    const s = stanWyzwania([...stary, w('zd:x', '2026-11-23')], new Date(2026, 10, 26));
    expect(s.zaliczone).toBe(1);
    expect(s.teraz).toBe(1);
    expect(s.historia[5]).toBe(true);
    expect(s.historia[4]).toBe(false);
  });
});
