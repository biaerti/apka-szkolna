// Slajd "Praca z tekstem" - strona i czas na przeczytanie sa glowna trescia,
// widoczne od razu z ostatniej lawki, bez pytania. Rozmiary w pikselach kartki
// 1280x720 ze SlideView (na rzutniku skaluja sie razem z nia).

import type { Slide } from '../../data/types';
import { RichText } from './RichText';
import { StopwatchBar } from './StopwatchBar';
import { fitFontSize } from './fitText';
import { useSlideFontScale } from './useSlideFontScale';

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
    ? fitFontSize(slide.body, { width: 1000, height: bodyHeight, min: 28, max: 58, scale })
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
          {slide.source && <span className="text-4xl text-gray-300">{slide.source}</span>}
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
          <span className="text-3xl font-semibold text-gray-200">Czas na przeczytanie</span>
          <StopwatchBar key={slide.id} timerSec={timerSec} />
        </div>
      )}
    </div>
  );
}
