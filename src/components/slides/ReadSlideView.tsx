// Slajd "Praca z tekstem" - strona i czas calego bloku podrecznikowego sa
// glowna trescia, widoczna od razu z ostatniej lawki. Blok obejmuje czytanie,
// rozmowe i zadania, a nie tylko samo przeczytanie tekstu.

import type { Slide } from '../../data/types';
import { RichText } from './RichText';
import { StopwatchBar } from './StopwatchBar';
import { fitFontSize } from './fitText';
import { useSlideFontScale } from './useSlideFontScale';

function TextbookIcon() {
  return (
    <svg viewBox="0 0 96 72" className="h-20 w-28 text-accent-300" aria-hidden="true">
      <path d="M8 14c15-6 29-4 40 5v43c-11-8-25-10-40-4z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
      <path d="M88 14c-15-6-29-4-40 5v43c11-8 25-10 40-4z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
      <path d="M48 19v43M17 28h21M17 38h21M58 28h21M58 38h21" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function ReadSlideView({ slide }: { slide: Extract<Slide, { kind: 'read' }> }) {
  const scale = useSlideFontScale();
  const hasPage = typeof slide.page === 'number';
  const pageLabel = hasPage
    ? `s. ${slide.page}${typeof slide.pageTo === 'number' ? '-' + slide.pageTo : ''}`
    : null;
  const timerSec = typeof slide.timerSec === 'number' && slide.timerSec > 0 ? slide.timerSec : null;

  const titleSize = slide.title
    ? fitFontSize(slide.title, { width: 1100, height: 130, min: 40, max: 88, scale, lineHeight: 1.15, charRatio: 0.55 })
    : 0;
  const bodyHeight = 200 - (pageLabel ? 0 : 60);
  const bodySize = slide.body
    ? fitFontSize(slide.body, { width: 1000, height: bodyHeight, min: 24, max: 58, scale })
    : 0;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-16 py-8 text-center">
      {slide.title && (
        <h2 className="font-bold leading-tight text-white" style={{ fontSize: titleSize }}>
          {slide.title}
        </h2>
      )}

      {(slide.source || pageLabel) && (
        <div className="flex flex-col items-center gap-2">
          {slide.source && (
            <span className="flex items-center gap-4 text-4xl font-semibold text-gray-200">
              <TextbookIcon />
              {slide.source}
            </span>
          )}
          {pageLabel && (
            <span className="text-[170px] font-bold leading-none text-accent-300">{pageLabel}</span>
          )}
        </div>
      )}

      {slide.body && (
        <RichText
          text={slide.body}
          className="max-w-[1000px] space-y-[0.5em] leading-snug text-gray-100"
          style={{ fontSize: bodySize }}
        />
      )}

      {timerSec !== null && (
        <div className="mt-1 flex flex-col items-center gap-2">
          <span className="text-3xl font-semibold text-gray-200">Czas na pracę z podręcznikiem</span>
          <StopwatchBar key={slide.id} timerSec={timerSec} />
        </div>
      )}
    </div>
  );
}
