import { describe, expect, it } from 'vitest';
import { scaleTextBox, TEXT_SIZE_MAX, TEXT_SIZE_MIN } from './annotations';

const start = { width: 500, size: 50 };

describe('scaleTextBox', () => {
  it('szersza ramka to wieksze litery, w tej samej proporcji', () => {
    expect(scaleTextBox(start, 250, 1200)).toEqual({ width: 750, size: 75 });
  });

  it('wezsza ramka to mniejsze litery', () => {
    expect(scaleTextBox(start, -250, 1200)).toEqual({ width: 250, size: 25 });
  });

  it('bez ruchu nic sie nie zmienia', () => {
    expect(scaleTextBox(start, 0, 1200)).toEqual(start);
  });

  it('nie przekracza miejsca, ktore zostalo na kartce', () => {
    expect(scaleTextBox(start, 5000, 800).width).toBe(800);
  });

  it('nie schodzi ponizej minimalnej wielkosci liter', () => {
    expect(scaleTextBox(start, -5000, 1200).size).toBeGreaterThanOrEqual(TEXT_SIZE_MIN);
  });

  it('nie rosnie ponad maksymalna wielkosc liter', () => {
    expect(scaleTextBox(start, 5000, 100000).size).toBeLessThanOrEqual(TEXT_SIZE_MAX);
  });
});
