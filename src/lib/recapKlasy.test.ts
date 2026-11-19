import { describe, expect, it } from 'vitest';
import { klasaKlucz, recapSetIdForClass } from './recap';
import { buildTextbook4 } from '../data/textbook4';
import { LEKTURA_CHLOPCY } from '../data/lekturaChlopcy';
import { codeVersion } from '../components/lessons/refreshMaterials';
import type { Slide } from '../data/types';

describe('kolo dla klas w innej kolejnosci lekcji', () => {
  it('klucz klasy nie zalezy od zapisu', () => {
    expect(klasaKlucz('IV A')).toBe('4A');
    expect(klasaKlucz('4a')).toBe('4A');
    expect(klasaKlucz('4 c')).toBe('4C');
    expect(klasaKlucz('V B')).toBe('5B');
    expect(klasaKlucz('VI A')).toBe('6A');
  });

  it('wyjatek klasy podmienia zestaw, inne klasy zostaja przy zwyklym', () => {
    const slide: Extract<Slide, { kind: 'recap' }> = {
      id: 's', kind: 'recap', questionSetId: 'zwykly', mode: 'powtorzeniowe',
      dlaKlas: [{ klasy: ['4a', '4c'], questionSetId: 'inny' }],
    };
    expect(recapSetIdForClass(slide, 'IV A')).toBe('inny');
    expect(recapSetIdForClass(slide, 'IV C')).toBe('inny');
    expect(recapSetIdForClass(slide, 'IV B')).toBe('zwykly');
    expect(recapSetIdForClass(slide, undefined)).toBe('zwykly');
  });

  it('Chlopcy z Placu Broni: 4a i 4c - Gereb po bitwie, a lekcja 6 po Gerebie', () => {
    const bundle = buildTextbook4('IV', ['4a']);
    const [, , l3, l4, l5, l6] = bundle.lessons.filter((l) => l.dzial === LEKTURA_CHLOPCY);
    const kolo = (slides: Slide[]) => slides.find((s): s is Extract<Slide, { kind: 'recap' }> => s.kind === 'recap')!;

    expect(recapSetIdForClass(kolo(l4.slides), 'IV B')).toBe(l3.questionSetId);
    expect(recapSetIdForClass(kolo(l4.slides), 'IV A')).toBe(l5.questionSetId);
    expect(recapSetIdForClass(kolo(l4.slides), 'IV C')).toBe(l5.questionSetId);

    expect(recapSetIdForClass(kolo(l5.slides), 'IV B')).toBe(l4.questionSetId);

    expect(recapSetIdForClass(kolo(l6.slides), 'IV B')).toBe(l5.questionSetId);
    expect(recapSetIdForClass(kolo(l6.slides), 'IV A')).toBe(l4.questionSetId);
  });

  it('wersja materialu z wyjatkami jest stala miedzy buildami (bez petli odswiezania)', () => {
    const wersja = () => {
      const bundle = buildTextbook4('IV', ['4a']);
      const l4 = bundle.lessons.filter((l) => l.dzial === LEKTURA_CHLOPCY)[3];
      return codeVersion(l4, bundle.questions.filter((q) => q.setId === l4.questionSetId), bundle);
    };
    expect(wersja()).toBe(wersja());
  });
});
