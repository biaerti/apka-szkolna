// Slajd "Praca z tekstem" - strona i czas na przeczytanie sa glowna trescia,
// widoczne od razu z ostatniej lawki, bez pytania.

import type { Slide } from '../../data/types';
import { RichText } from './RichText';
import { StopwatchBar } from './StopwatchBar';

export function ReadSlideView({ slide }: { slide: Extract<Slide, { kind: 'read' }> }) {
  const hasPage = typeof slide.page === 'number';
  const pageLabel = hasPage
    ? `s. ${slide.page}${typeof slide.pageTo === 'number' ? '-' + slide.pageTo : ''}`
    : null;
  const timerSec = typeof slide.timerSec === 'number' && slide.timerSec > 0 ? slide.timerSec : null;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-16 py-10 text-center">
      {slide.title && <h2 className="text-5xl font-bold text-white">{slide.title}</h2>}

      {(slide.source || pageLabel) && (
        <div className="flex flex-col items-center gap-2">
          {slide.source && <span className="text-3xl text-gray-300">{slide.source}</span>}
          {pageLabel && (
            <span className="text-[160px] font-bold leading-none text-accent-300">{pageLabel}</span>
          )}
        </div>
      )}

      {slide.body && (
        <RichText text={slide.body} className="max-w-4xl space-y-3 text-[28px] leading-snug text-gray-100" />
      )}

      {timerSec !== null && (
        <div className="mt-2 flex flex-col items-center gap-2">
          <span className="text-2xl font-semibold text-gray-200">Czas na przeczytanie</span>
          <StopwatchBar key={slide.id} timerSec={timerSec} />
        </div>
      )}
    </div>
  );
}
