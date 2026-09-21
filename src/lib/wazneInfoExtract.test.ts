import { describe, expect, it } from 'vitest';
import { buildPaczkaText, dniDoTerminu, parseExtractResponse } from './wazneInfoExtract';

describe('parseExtractResponse', () => {
  it('parsuje JSON w plocie i odrzuca smieci', () => {
    const text =
      '```json\n{"punkty":[{"tytul":"Konkurs","tresc":"Zapisy do 9.10","termin":"2026-10-09","linki":["https://a.pl","zle"]},{"tytul":""},{"tytul":"Bez terminu","termin":"jutro"}]}\n```';
    expect(parseExtractResponse(text)).toEqual([
      { tytul: 'Konkurs', tresc: 'Zapisy do 9.10', termin: '2026-10-09', linki: ['https://a.pl'] },
      { tytul: 'Bez terminu', tresc: '', termin: null, linki: [] },
    ]);
  });

  it('zwraca pusta liste dla niepoprawnej odpowiedzi', () => {
    expect(parseExtractResponse('nie wiem')).toEqual([]);
    expect(parseExtractResponse('{"punkty": "x"}')).toEqual([]);
  });
});

describe('buildPaczkaText', () => {
  it('numeruje punkty, pogrubia tytul i dodaje termin oraz linki', () => {
    const text = buildPaczkaText([
      { tytul: 'Konkurs', tresc: 'Karty do 9.10.', termin: '2026-10-09', linki: ['https://a.pl'] },
      { tytul: 'Obiady', tresc: '', termin: null, linki: [] },
    ]);
    expect(text).toBe(
      'Dzień dobry, kilka ważnych informacji:\n\n1. *Konkurs* (do 9 października)\nKarty do 9.10.\nhttps://a.pl\n\n2. *Obiady*\n\nPozdrawiam',
    );
  });
});

describe('dniDoTerminu', () => {
  it('liczy dni', () => {
    expect(dniDoTerminu('2026-09-22', '2026-09-21')).toBe(1);
    expect(dniDoTerminu('2026-09-20', '2026-09-21')).toBe(-1);
  });
});
