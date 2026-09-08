// Dekoder ramek decybelomierza Habotest HT622B (USB, mostek CH340, 9600 8N1).
// Protokol zdekodowany empirycznie 2026-09-08 przez zamrazanie wartosci
// przyciskiem HOLD i porownywanie ramek z wyswietlaczem.
//
// Ramka (~5/s, koniec 0D 0A): 06 2A 11 01 [b4] [b5] B0 B1 B2 B3 ... 02 0D 0A
//   b5 bit 0x04 - ikona H (hold)
//   B3 bit 0x80 - ikona dB (bez niej miernik jest w trybie SONE)
//   B0..B3 - zrzut segmentow LCD, cyfry setki/dziesiatki/jednosci/dziesiate:
//     C1 ("1" setek) = B0 & 0x03
//     C2: f=B0&80 g=B0&40 e=B0&20 | a=B1&08 b=B1&04 c=B1&02 d=B1&01
//     C3: f=B1&80 g=B1&40 e=B1&20 | a=B2&08 b=B2&04 c=B2&02 d=B2&01
//     C4: f=B2&80 g=B2&40 e=B2&20 | a=B3&08 b=B3&04 c=B3&02 d=B3&01
// Wyswietlacz w dB pokazuje zawsze XX.X (30.0-130.0).

const HEADER = [0x06, 0x2a, 0x11, 0x01];

// Segmenty gfedcba -> cyfra (klasyczny 7-seg).
const SEGMENTS_TO_DIGIT: Record<number, number> = {
  0b0111111: 0,
  0b0000110: 1,
  0b1011011: 2,
  0b1001111: 3,
  0b1100110: 4,
  0b1101101: 5,
  0b1111101: 6,
  0b0000111: 7,
  0b1111111: 8,
  0b1101111: 9,
};

function digitAt(hi: number, lo: number): number | null {
  const a = (lo >> 3) & 1;
  const b = (lo >> 2) & 1;
  const c = (lo >> 1) & 1;
  const d = lo & 1;
  const e = (hi >> 5) & 1;
  const f = (hi >> 7) & 1;
  const g = (hi >> 6) & 1;
  const mask = (g << 6) | (f << 5) | (e << 4) | (d << 3) | (c << 2) | (b << 1) | a;
  const digit = SEGMENTS_TO_DIGIT[mask];
  return digit === undefined ? null : digit;
}

export interface Ht622bReading {
  db: number;
  hold: boolean;
}

// Dekoduje jedna ramke (bajty od 0x06 do konca, bez 0D 0A).
// null = ramka uszkodzona, nie-dB (SONE) albo nieczytelne cyfry.
export function decodeHt622bFrame(frame: Uint8Array): Ht622bReading | null {
  if (frame.length < 10) return null;
  for (let i = 0; i < HEADER.length; i++) {
    if (frame[i] !== HEADER[i]) return null;
  }
  const b5 = frame[5];
  const b0 = frame[6];
  const b1 = frame[7];
  const b2 = frame[8];
  const b3 = frame[9];

  if ((b3 & 0x80) === 0) return null; // tryb SONE - prosimy o UNIT na dB

  const hundreds = b0 & 0x03;
  if (hundreds !== 0 && hundreds !== 0x03) return null;
  const c2 = digitAt(b0, b1 & 0x0f);
  const c3 = digitAt(b1, b2 & 0x0f);
  const c4 = digitAt(b2, b3 & 0x0f);
  if (c2 === null || c3 === null || c4 === null) return null;

  const db = (hundreds === 0x03 ? 100 : 0) + c2 * 10 + c3 + c4 / 10;
  if (db > 140) return null;
  return { db, hold: (b5 & 0x04) !== 0 };
}

// Tnie surowy strumien na ramki po separatorze 0D 0A i dekoduje kazda.
// Zwraca odczyty i ogon bufora (niedokonczona ramka zostaje na potem).
export function feedHt622b(buffer: Uint8Array): { readings: Ht622bReading[]; rest: Uint8Array } {
  const readings: Ht622bReading[] = [];
  let start = 0;
  for (let i = 0; i + 1 < buffer.length; i++) {
    if (buffer[i] === 0x0d && buffer[i + 1] === 0x0a) {
      let frame = buffer.subarray(start, i);
      // Miedzy ramkami trafia sie wiodace 00 z poprzedniej ramki.
      while (frame.length > 0 && frame[0] !== 0x06) frame = frame.subarray(1);
      const reading = decodeHt622bFrame(frame);
      if (reading) readings.push(reading);
      start = i + 2;
      i++;
    }
  }
  // Ochrona przed rozrostem, gdyby separator nigdy nie przyszedl.
  const rest = buffer.subarray(start);
  return { readings, rest: rest.length > 64 ? rest.subarray(rest.length - 64) : rest };
}
