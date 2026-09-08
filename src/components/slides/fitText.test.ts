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

describe('estimateTextHeight liczy odstepy miedzy blokami', () => {
  const opts = { width: 1000, height: 400, min: 20, max: 60 };

  it('lista jest wyzsza niz same wiersze tekstu (odstepy 0,3 em miedzy pozycjami)', () => {
    const items = ['- raz', '- dwa', '- trzy', '- cztery'].join('\n');
    const bareLines = 40 * 4 * 1.35;
    expect(estimateTextHeight(items, 40, opts)).toBeCloseTo(bareLines + 3 * 0.3 * 40, 5);
  });

  it('akapity dostaja wiekszy odstep niz pozycje listy', () => {
    const paragraphs = ['raz', '', 'dwa', '', 'trzy'].join('\n');
    const list = ['- raz', '- dwa', '- trzy'].join('\n');
    expect(estimateTextHeight(paragraphs, 40, opts)).toBeGreaterThan(estimateTextHeight(list, 40, opts));
  });

  it('dluga lista nie miesci sie tam, gdzie dawniej pozornie wchodzila', () => {
    // Tresc slajdu 4.2 Z2 ("Podziel na sylaby") w kolumnie obok ilustracji:
    // stare oszacowanie mowilo, ze zmiesci sie w 380 px, i stoper wypadal ze slajdu.
    const body = [
      'Podziel wyrazy na sylaby, klaszczac przy kazdej z nich:',
      '',
      '1. dom',
      '2. lampa',
      '3. jablko',
      '4. samolot',
      '5. kolezanka',
      '',
      'Zapisz podzial w zeszycie, np. lam-pa.',
    ].join('\n');
    expect(estimateTextHeight(body, 30, { width: 620, height: 0, min: 0, max: 0 })).toBeGreaterThan(380);
  });
});

describe('fitFontSize ze skala z Ustawien', () => {
  const opts = { width: 1000, height: 400, min: 30, max: 72 };

  it('skala podnosi maksimum dla krotkiego tekstu', () => {
    expect(fitFontSize('Krotko', { ...opts, scale: 1.25 })).toBe(90);
  });

  it('podloga rosnie o polowe skali - gesty slajd ma nie wyjsc poza kartke', () => {
    const long = 'Bardzo dluga tresc slajdu. '.repeat(200);
    // min 30 przy skali 1,25 -> 30 * 1,125
    expect(fitFontSize(long, { ...opts, scale: 1.25 })).toBe(34);
  });

  it('skala 1 nic nie zmienia', () => {
    const text = 'Zdanie o umiarkowanej dlugosci na slajdzie. '.repeat(6);
    expect(fitFontSize(text, { ...opts, scale: 1 })).toBe(fitFontSize(text, opts));
  });
});
