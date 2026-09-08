import { describe, expect, it } from 'vitest';
import { estimateTextHeight, fitFontSize, plainLength } from './fitText';

describe('plainLength', () => {
  it('nie liczy skladni markdown-lite', () => {
    expect(plainLength('- **raz**\n- dwa')).toBe(plainLength('raz\ndwa'));
  });
});

describe('fitFontSize', () => {
  const opts = { width: 1000, height: 400, min: 30, max: 72 };

  it('krotki tekst dostaje maksimum', () => {
    expect(fitFontSize('Trzy slowa tutaj', opts)).toBe(72);
  });

  it('dlugi tekst schodzi w dol, ale nie ponizej min', () => {
    const long = 'Bardzo dluga tresc slajdu. '.repeat(200);
    expect(fitFontSize(long, opts)).toBe(30);
  });

  it('tekst sredniej dlugosci miesci sie w przydzielonej wysokosci', () => {
    const text = 'Zdanie o umiarkowanej dlugosci na slajdzie. '.repeat(6);
    const size = fitFontSize(text, opts);
    expect(size).toBeLessThan(opts.max);
    expect(estimateTextHeight(text, size, opts)).toBeLessThanOrEqual(opts.height);
  });
});

describe('fitFontSize ze skala z Ustawien', () => {
  const opts = { width: 1000, height: 400, min: 30, max: 72 };

  it('skala podnosi maksimum dla krotkiego tekstu', () => {
    expect(fitFontSize('Krotko', { ...opts, scale: 1.25 })).toBe(90);
  });

  it('skala podnosi takze podloge dla bardzo dlugiego tekstu', () => {
    const long = 'Bardzo dluga tresc slajdu. '.repeat(200);
    expect(fitFontSize(long, { ...opts, scale: 1.25 })).toBe(38);
  });

  it('skala 1 nic nie zmienia', () => {
    const text = 'Zdanie o umiarkowanej dlugosci na slajdzie. '.repeat(6);
    expect(fitFontSize(text, { ...opts, scale: 1 })).toBe(fitFontSize(text, opts));
  });
});
