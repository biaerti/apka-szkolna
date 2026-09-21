import { describe, expect, it } from 'vitest';
import {
  LEKTURY_IV_2026_KATALOG,
  LEKTURY_IV_2026_POLECANE_IDS,
  LEKTURY_KROTKIE,
  LEKTURY_OBOWIAZKOWE,
  LEKTURY_UZUPELNIAJACE,
} from './lektury';

describe('katalogi lektur', () => {
  it('ma pełną listę nowych tekstów narracyjnych i dramatycznych', () => {
    expect(LEKTURY_IV_2026_KATALOG).toHaveLength(76);
  });

  it('ma unikalne identyfikatory we wszystkich katalogach', () => {
    const wszystkie = [
      ...LEKTURY_IV_2026_KATALOG,
      ...LEKTURY_OBOWIAZKOWE,
      ...LEKTURY_KROTKIE,
      ...LEKTURY_UZUPELNIAJACE,
    ];
    expect(new Set(wszystkie.map((lektura) => lektura.id)).size).toBe(wszystkie.length);
  });

  it('każda polecana pozycja dla IV istnieje w oficjalnym katalogu', () => {
    const ids = new Set(LEKTURY_IV_2026_KATALOG.map((lektura) => lektura.id));
    for (const id of LEKTURY_IV_2026_POLECANE_IDS) expect(ids.has(id)).toBe(true);
  });
});

describe('kandydaci do głosowania', () => {
  it('każdy kandydat ma opis, okładkę i istnieje w katalogu', async () => {
    const { KANDYDACI, OPISY_KANDYDATOW } = await import('./lekturyOpisy');
    const fs = await import('node:fs');
    const ids = new Set([
      ...LEKTURY_IV_2026_KATALOG,
      ...LEKTURY_OBOWIAZKOWE,
      ...LEKTURY_UZUPELNIAJACE,
    ].map((lektura) => lektura.id));
    for (const kandydat of [...KANDYDACI.IV, ...KANDYDACI.V]) {
      expect(ids.has(kandydat.id), kandydat.id).toBe(true);
      expect(OPISY_KANDYDATOW[kandydat.klucz], kandydat.klucz).toBeDefined();
      expect(fs.existsSync(`public/okladki/${kandydat.klucz}.jpg`), kandydat.klucz).toBe(true);
    }
  });

  it('kandydaci dla IV są z listy polecanych', async () => {
    const { KANDYDACI } = await import('./lekturyOpisy');
    for (const kandydat of KANDYDACI.IV) expect(LEKTURY_IV_2026_POLECANE_IDS.has(kandydat.id)).toBe(true);
  });
});
