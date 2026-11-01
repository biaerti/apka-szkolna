import { describe, expect, it } from 'vitest';
import { PRZYPOMNIENIA } from './przypomnienia';

describe('przypomnienia', () => {
  it('maja unikalne id i najwyzej 5 krokow (kartka 1280x720)', () => {
    expect(new Set(PRZYPOMNIENIA.map((p) => p.id)).size).toBe(PRZYPOMNIENIA.length);
    for (const p of PRZYPOMNIENIA) {
      expect(p.kroki.length, p.id).toBeGreaterThan(0);
      expect(p.kroki.length, p.id).toBeLessThanOrEqual(5);
    }
  });

  it('strzalka w kroku "pytanie" trafia w wyrazy, ktore sa w zdaniu', () => {
    const bezZnakow = (s: string) => s.replace(/[.,!?…:;„”"]/g, '');
    for (const p of PRZYPOMNIENIA) {
      for (const k of p.kroki) {
        if (k.typ !== 'pytanie') continue;
        const wyrazy = k.zdanie.split(' ').map(bezZnakow);
        expect(wyrazy, `${p.id}: ${k.od}`).toContain(k.od);
        expect(wyrazy, `${p.id}: ${k.do}`).toContain(k.do);
      }
    }
  });
});
