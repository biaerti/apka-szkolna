import { describe, expect, it } from 'vitest';
import { CWICZENIA } from '../data/cwiczenia';
import { MAKS_PYTAN, przetasujWybory, kluczZadania, maZadanie, notatkaLekcji, pytaniaZadania, type LekcjaZadania } from './zadaniaDomowe';

const lekcja = (ids: string[], note?: string): LekcjaZadania => ({
  lekcja_id: 'L1',
  tytul: 'Test',
  kod: '5.1',
  data: '2026-11-23',
  slajdy: [
    ...ids.map((cwiczenieId) => ({ kind: 'cwiczenie', cwiczenieId })),
    ...(note ? [{ kind: 'note', body: note }] : []),
  ],
});

describe('zadania domowe z lekcji', () => {
  it('bez kart nie ma zadania', () => {
    expect(maZadanie(lekcja([]))).toBe(false);
    expect(maZadanie(lekcja(['nie-ma-takiej']))).toBe(false);
  });

  it('notatka z lekcji', () => {
    expect(notatkaLekcji(lekcja([], '**Temat:** x'))).toBe('**Temat:** x');
  });

  it('kazda karta daje pytania, razem najwyzej MAKS_PYTAN', () => {
    const luki = CWICZENIA.filter((c) => c.typ === 'luki').slice(0, 11).map((c) => c.id);
    const p = pytaniaZadania(lekcja(luki), () => 0.3);
    expect(p.length).toBeGreaterThan(0);
    expect(p.length).toBeLessThanOrEqual(MAKS_PYTAN);
    for (const q of p) expect(q.punkty).toBeGreaterThan(0);
  });

  it('klucz wyniku', () => {
    expect(kluczZadania('abc')).toBe('zd:abc');
  });

  it('tasowanie wyborow zostawia gwiazdke przy dobrej odpowiedzi', () => {
    const t = przetasujWybory('Ola {{*bo|więc}} tak, a {{x|*y|z}}', () => 0);
    expect(t).toMatch(/\{\{(więc\|\*bo|\*bo\|więc)\}\}/);
    expect(t.match(/\*/g)).toHaveLength(2);
    expect(t).toContain('*y');
  });
});
