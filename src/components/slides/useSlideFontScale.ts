// Mnoznik wielkosci liter na ekranach projektora (Ustawienia ->
// "Wielkość liter na slajdach"). Wszystkie widoki slajdow i kartkowek podaja go
// do fitFontSize jako `scale`, wiec jedno pole w ustawieniach rusza cala
// prezentacje naraz. Patrz komentarz przy FitOptions.scale w fitText.ts.

import { useStore } from '../../data/store';

export const SLIDE_FONT_PERCENT_MIN = 80;
export const SLIDE_FONT_PERCENT_MAX = 180;
export const SLIDE_FONT_PERCENT_DEFAULT = 100;

export function clampSlideFontPercent(percent: number | undefined): number {
  if (typeof percent !== 'number' || !Number.isFinite(percent)) return SLIDE_FONT_PERCENT_DEFAULT;
  return Math.min(SLIDE_FONT_PERCENT_MAX, Math.max(SLIDE_FONT_PERCENT_MIN, Math.round(percent)));
}

/** Mnoznik (1 = 100%) do przekazania jako `scale` w FitOptions. */
export function useSlideFontScale(): number {
  const percent = useStore((s) => s.settings.slideFontPercent);
  return clampSlideFontPercent(percent) / 100;
}
