import { describe, expect, it } from 'vitest';
import { dopasujKlase, dopasujUcznia, kluczKlasy, punktyPodpisu } from './pracePisemne';
import type { Student } from '../data/types';

const s = (id: string, firstName: string, lastName: string, number = 1): Student => ({
  id,
  classId: 'k',
  firstName,
  lastName,
  number,
  active: true,
});

const klasa = [
  s('a', 'Aleksandra', 'Nowak', 1),
  s('b', 'Ignacy', 'Kowalski', 2),
  s('c', 'Jakub', 'Wiśniewski', 3),
  s('d', 'Jakub', 'Zieliński', 4),
  s('e', 'Łucja', 'Żółć', 5),
];

describe('kluczKlasy', () => {
  it('sprowadza rzymskie i arabskie nazwy do jednej postaci', () => {
    expect(kluczKlasy('IV A')).toBe('4a');
    expect(kluczKlasy('4a')).toBe('4a');
    expect(kluczKlasy('Klasa 4 C')).toBe('4c');
    expect(kluczKlasy('VII b')).toBe('7b');
    expect(kluczKlasy('V a')).toBe('5a');
  });
});

describe('dopasowanie podpisu', () => {
  it('zdrobnienie trafia w pełne imię', () => {
    expect(dopasujUcznia('Ola', klasa)).toBe('a');
    expect(dopasujUcznia('Pozdrawiam Ola', klasa)).toBe('a');
  });

  it('imię i nazwisko bez polskich znaków albo z błędem w końcówce', () => {
    expect(dopasujUcznia('Lucja Zolc', klasa)).toBe('e');
    expect(dopasujUcznia('IGNACY KOWALSK', klasa)).toBe('b');
  });

  it('dwóch Kubów bez nazwiska - nie zgadujemy', () => {
    expect(dopasujUcznia('Kuba', klasa)).toBeNull();
    expect(dopasujUcznia('Kuba W.', klasa)).toBe('c');
    expect(punktyPodpisu('Kuba Zieliński', klasa[3])).toBe(5);
  });

  it('w klasie pewniejszy podpis zajmuje ucznia pierwszy', () => {
    expect(dopasujKlase([{ podpis: 'Kuba' }, { podpis: 'Jakub Wiśniewski' }], klasa)).toEqual(['d', 'c']);
  });

  it('brak podpisu - brak ucznia', () => {
    expect(dopasujUcznia('', klasa)).toBeNull();
  });
});

describe('podpisy z paczki', () => {
  it('dopiski agenta w nawiasie i numer klasy nie przeszkadzają', () => {
    const k = [s('z', 'Zuzanna', 'Malinowska'), s('a', 'Adam', 'Abacki'), s('p', 'Paweł', 'Nowak')];
    expect(dopasujUcznia('Zuzia (u góry: Zuzanna Malinowska 4A)', k)).toBe('z');
    expect(dopasujUcznia('Twój wnuk Paweł', k)).toBe('p');
  });
});
