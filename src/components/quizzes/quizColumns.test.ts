import { describe, expect, it } from 'vitest';
import { quizLayout } from './quizColumns';

// Kartkowka z 07.09.2026 - typowa: cztery polecenia z podpunktami.
const kartkowka = [
  'Napisz ile liter, głosek i sylab mają wyrazy:\n1. dzień\n2. pszczoła\n3. gąszcze\n4. czekolada (1 pkt)',
  'Wymyśl. zdanie mające format: {Przymiotnik}_{Rzeczownik}_{Czasownik} (1 pkt)',
  'Uzupełnij wielkie litery i wstaw przecinki w poniższych zdaniach:\n1. zaprosiłam antka na urodziny ale zapomniałam mu o nich przypomnieć.\n2. myślę o tym że kiedyś wybiorę się w tatry. (1 pkt)',
  'Podaj parę wyrazów, w której:\n1. "ó" wymienia się na "o"\n2. "ó" wymienia się na "a" (1 pkt)',
];

describe('quizLayout', () => {
  it('w jednej kolumnie nie dzieli listy', () => {
    const { split } = quizLayout(kartkowka, 1, 1);
    expect(split).toBe(kartkowka.length);
  });

  it('w dwoch kolumnach lamie liste i daje wieksze litery', () => {
    const one = quizLayout(kartkowka, 1, 1);
    const two = quizLayout(kartkowka, 2, 1);
    expect(two.split).toBeGreaterThan(0);
    expect(two.split).toBeLessThan(kartkowka.length);
    expect(two.fontSize).toBeGreaterThan(one.fontSize);
  });

  it('pojedyncze pytanie zostaje w jednej kolumnie', () => {
    expect(quizLayout([kartkowka[0]], 2, 1).split).toBe(1);
  });

  it('dluga kartkowka nadal sie miesci - rozmiar spada, ale nie ponizej minimum', () => {
    const dluga = Array.from({ length: 20 }, (_, i) => `${i + 1}. Odmien przez przypadki wyraz numer ${i + 1} (1 pkt)`);
    const { fontSize, split } = quizLayout(dluga, 2, 1);
    expect(fontSize).toBeGreaterThanOrEqual(22);
    expect(split).toBeGreaterThan(0);
    expect(split).toBeLessThan(dluga.length);
  });
});
