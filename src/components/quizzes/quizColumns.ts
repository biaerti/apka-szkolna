// Dobieranie rozmiaru czcionki i podzialu pytan dla widoku "wszystkie" na
// projektorze. Przy jednej kolumnie liczy sie tylko rozmiar; przy dwoch trzeba
// jeszcze zdecydowac, gdzie przelamac liste - kolumna jest o polowe wezsza,
// wiec te same pytania zawijaja sie inaczej i podzial zalezy od rozmiaru liter.
// Szukamy najwiekszego rozmiaru, przy ktorym da sie rozdzielic pytania tak, by
// obie kolumny zmiescily sie na wysokosc.

import { estimateTextHeight, fitFontSize } from '../slides/fitText';

/** Szerokosc obszaru tresci na kartce 1280x720 (bez marginesow). */
const AREA_W = 1120;
/** Wysokosc obszaru tresci (bez naglowka i stopki). */
const AREA_H = 560;
/** Odstep miedzy kolumnami w pikselach kartki. */
const COL_GAP = 60;
/** Numer zadania z odstepem: w-[1.6em] + gap-[0.6em]. */
const NUMBER_EM = 2.2;
/** py-[0.18em] u gory i u dolu kazdej pozycji listy. */
const ITEM_PAD_EM = 0.36;
const LINE_HEIGHT = 1.45;
const FONT_MIN = 22;
const FONT_MAX = 72;

export interface QuizLayout {
  fontSize: number;
  /** Numer pytania (od 0), od ktorego zaczyna sie druga kolumna. */
  split: number;
}

/** Rozmiar czcionki po skalowaniu z Ustawien - te same reguly co w fitFontSize. */
function bounds(scale: number): { min: number; max: number } {
  return { min: Math.round(FONT_MIN * (1 + (scale - 1) / 2)), max: Math.round(FONT_MAX * scale) };
}

/**
 * Podzial listy na dwie kolumny w miejscu, ktore najbardziej je wyrownuje.
 * Zwraca `null`, gdy przy zadnym przelamaniu obie kolumny nie mieszcza sie w
 * `limit` - wtedy trzeba probowac mniejszej czcionki.
 */
function balancedSplit(heights: number[], limit: number): number | null {
  const total = heights.reduce((sum, h) => sum + h, 0);
  let best: number | null = null;
  let bestDiff = Infinity;
  let first = 0;
  for (let k = 1; k < heights.length; k += 1) {
    first += heights[k - 1];
    const second = total - first;
    if (first > limit || second > limit) continue;
    const diff = Math.abs(first - second);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = k;
    }
  }
  return best;
}

/** Przelamanie najblizsze polowie wysokosci - awaryjne, gdy nic sie nie miesci. */
function halfSplit(heights: number[]): number {
  const total = heights.reduce((sum, h) => sum + h, 0);
  let first = 0;
  let best = 1;
  let bestDiff = Infinity;
  for (let k = 1; k < heights.length; k += 1) {
    first += heights[k - 1];
    const diff = Math.abs(first - (total - first));
    if (diff < bestDiff) {
      bestDiff = diff;
      best = k;
    }
  }
  return best;
}

function columnHeights(texts: string[], fontSize: number, width: number): number[] {
  return texts.map(
    (text) =>
      estimateTextHeight(text, fontSize, { width, height: AREA_H, min: FONT_MIN, max: FONT_MAX, lineHeight: LINE_HEIGHT }) +
      ITEM_PAD_EM * fontSize,
  );
}

/** Szerokosc samego tekstu w kolumnie (bez miejsca na numer zadania). */
function textWidth(fontSize: number, columns: number): number {
  const column = columns === 2 ? (AREA_W - COL_GAP) / 2 : AREA_W;
  return column - NUMBER_EM * fontSize;
}

export function quizLayout(texts: string[], columns: 1 | 2, scale: number): QuizLayout {
  if (columns === 1 || texts.length < 2) {
    return { fontSize: fitFontSize(texts.join('\n'), { width: AREA_W, height: AREA_H, min: FONT_MIN, max: FONT_MAX, scale, lineHeight: LINE_HEIGHT }), split: texts.length };
  }
  const { min, max } = bounds(scale);
  for (let size = max; size > min; size -= 2) {
    const width = textWidth(size, 2);
    // Kolumna wezsza niz kilka znakow to juz nie kolumna - przy tak duzych
    // literach dwie obok siebie po prostu sie nie mieszcza.
    if (width < size * 6) continue;
    const split = balancedSplit(columnHeights(texts, size, width), AREA_H);
    if (split !== null) return { fontSize: size, split };
  }
  return { fontSize: min, split: halfSplit(columnHeights(texts, min, textWidth(min, 2))) };
}
