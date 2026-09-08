import { describe, expect, it } from 'vitest';
import { decodeHt622bFrame, feedHt622b } from './ht622b';

// Ramki przechwycone z prawdziwego HT622B (COM12, 9600) 2026-09-08,
// wartosci odczytane z wyswietlacza przy zamrozonym HOLD.
function frame(hex: string): Uint8Array {
  return new Uint8Array(hex.split(' ').map((b) => parseInt(b, 16)));
}

describe('decodeHt622bFrame', () => {
  it('dekoduje wartosci dB zgodnie z wyswietlaczem', () => {
    const cases: Array<[string, number]> = [
      ['06 2A 11 01 05 0E 08 E6 FB 8B 00 0E 00 00 00 00 00 00 00 02', 16.6],
      ['06 2A 11 01 05 0E 0B E6 1B 8E 00 0E 00 00 00 00 00 00 00 02', 116.7],
      ['06 2A 11 01 05 0E 68 AD DF 86 00 0E 00 00 00 00 00 00 00 02', 20.4],
      ['06 2A 11 01 05 0E C8 06 1E 86 00 0E 00 00 00 00 00 00 00 02', 47.1],
    ];
    for (const [hex, expected] of cases) {
      expect(decodeHt622bFrame(frame(hex))?.db).toBeCloseTo(expected, 5);
    }
  });

  it('rozpoznaje flage hold', () => {
    expect(decodeHt622bFrame(frame('06 2A 11 01 05 0E C8 06 1E 86 00 0E'))?.hold).toBe(true);
    expect(decodeHt622bFrame(frame('06 2A 11 01 05 0A C8 06 1E 86 00 0E'))?.hold).toBe(false);
  });

  it('odrzuca ramki w trybie SONE (bez ikony dB)', () => {
    // 01.9 SONE - bajt B3 bez bitu 0x80.
    expect(decodeHt622bFrame(frame('06 2A 11 01 05 0E A8 0F D6 0F 00 0E'))).toBeNull();
  });

  it('odrzuca smieci i ramki obce', () => {
    expect(decodeHt622bFrame(frame('FF FF FF FF FF FF FF FF FF FF'))).toBeNull();
    expect(decodeHt622bFrame(frame('06 2A'))).toBeNull();
  });
});

describe('feedHt622b', () => {
  it('tnie strumien na ramki, znosi wiodace 00 i zostawia ogon', () => {
    const stream = frame(
      '00 06 2A 11 01 05 0E C8 06 1E 86 00 0E 00 00 00 00 00 00 00 02 0D 0A' +
        ' 00 06 2A 11 01 05 0E 68 AD DF 86 00 0E 00 00 00 00 00 00 00 02 0D 0A' +
        ' 00 06 2A 11',
    );
    const { readings, rest } = feedHt622b(stream);
    expect(readings.map((r) => r.db)).toEqual([47.1, 20.4]);
    expect(Array.from(rest)).toEqual([0x00, 0x06, 0x2a, 0x11]);
  });
});
