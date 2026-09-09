import { describe, expect, it } from 'vitest';
import { decodeHt622bFrame, feedHt622b } from './ht622b';

// Ramki przechwycone z prawdziwego HT622B (COM12, 9600) 2026-09-08/09.
// Ramki dB pochodza z cichego pokoju (tryb dB potwierdzony na wyswietlaczu),
// wartosci zdekodowane recznie z mapy segmentow i zweryfikowane zakresem.
function frame(hex: string): Uint8Array {
  return new Uint8Array(hex.split(' ').map((b) => parseInt(b, 16)));
}

describe('decodeHt622bFrame', () => {
  it('dekoduje wartosci dB z prawdziwych ramek', () => {
    const cases: Array<[string, number]> = [
      ['06 2A 11 01 05 0A C0 06 D6 3F 00 0F 00 00 00 00 00 00 00 02', 41.9],
      ['06 2A 11 01 05 0A C0 E6 7B 3D 00 0F 00 00 00 00 00 00 00 02', 46.2],
      ['06 2A 11 01 05 0A C0 46 DF 3B 00 0F 00 00 00 00 00 00 00 02', 43.5],
      ['06 2A 11 01 05 0A C0 C6 FF 3F 00 0F 00 00 00 00 00 00 00 02', 49.8],
      ['06 2A 11 01 05 0A C0 66 DD 36 00 0F 00 00 00 00 00 00 00 02', 42.4],
    ];
    for (const [hex, expected] of cases) {
      expect(decodeHt622bFrame(frame(hex))?.db).toBeCloseTo(expected, 5);
    }
  });

  it('rozpoznaje flage hold', () => {
    expect(decodeHt622bFrame(frame('06 2A 11 01 05 0E C0 06 D6 3F 00 0F'))?.hold).toBe(true);
    expect(decodeHt622bFrame(frame('06 2A 11 01 05 0A C0 06 D6 3F 00 0F'))?.hold).toBe(false);
  });

  it('odrzuca ramki w trybie SONE (bez ikony dB, bity 0x30 w B3)', () => {
    // Prawdziwe ramki SONE: 01.9, 16.6, 116.7 sone (wyswietlacz odczytany przy HOLD).
    expect(decodeHt622bFrame(frame('06 2A 11 01 05 0E A8 0F D6 0F 00 0E'))).toBeNull();
    expect(decodeHt622bFrame(frame('06 2A 11 01 05 0E 08 E6 FB 8B 00 0E'))).toBeNull();
    expect(decodeHt622bFrame(frame('06 2A 11 01 05 0E 0B E6 1B 8E 00 0E'))).toBeNull();
  });

  it('odrzuca smieci i ramki obce', () => {
    expect(decodeHt622bFrame(frame('FF FF FF FF FF FF FF FF FF FF'))).toBeNull();
    expect(decodeHt622bFrame(frame('06 2A'))).toBeNull();
  });
});

describe('feedHt622b', () => {
  it('tnie strumien na ramki, znosi wiodace 00 i zostawia ogon', () => {
    const stream = frame(
      '00 06 2A 11 01 05 0A C0 06 D6 3F 00 0F 00 00 00 00 00 00 00 02 0D 0A' +
        ' 00 06 2A 11 01 05 0A C0 E6 7B 3D 00 0F 00 00 00 00 00 00 00 02 0D 0A' +
        ' 00 06 2A 11',
    );
    const { readings, rest } = feedHt622b(stream);
    expect(readings.map((r) => r.db)).toEqual([41.9, 46.2]);
    expect(Array.from(rest)).toEqual([0x00, 0x06, 0x2a, 0x11]);
  });
});
