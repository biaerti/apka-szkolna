// Slajd zadania (Z1, Z2...). Kod zadania jest celowo ogromny - to on wisi na
// tablicy, gdy klasa pisze w zeszytach. Tresc dobiera rozmiar do dlugosci
// (fitText.ts) w pikselach kartki 1280x720 ze SlideView.

import type { Slide } from '../../data/types';
import { RichText } from './RichText';
import { SlideArtView } from './art';
import { StopwatchBar } from './StopwatchBar';
import { estimateTextHeight, fitFontSize } from './fitText';

const TITLE_FIT = { lineHeight: 1.15, charRatio: 0.55 };

export function TaskSlideView({ slide }: { slide: Extract<Slide, { kind: 'task' }> }) {
  const hasSource = slide.page || slide.exerciseNo;
  const hasTimer = typeof slide.timerSec === 'number' && slide.timerSec > 0;

  // Z ilustracja tekst dostaje wezsza kolumne - reszta kartki nalezy do obrazka.
  const width = slide.art ? 620 : 1000;
  const available = hasTimer ? 380 : 470;
  const title = slide.title ?? '';
  const tSize = title ? fitFontSize(title, { width, height: 130, min: 34, max: 76, ...TITLE_FIT }) : 0;
  const used = title
    ? estimateTextHeight(title, tSize, { width, height: 0, min: 0, max: 0, ...TITLE_FIT }) + 20
    : 0;
  const bSize = fitFontSize(slide.body, { width, height: available - used, min: 22, max: 54 });

  return (
    <div className="relative flex h-full flex-col px-16 py-8">
      <div className="flex items-start justify-between">
        <div className="rounded-2xl border-4 border-accent-400 px-8 py-3">
          <span className="text-[96px] font-bold leading-none text-accent-300">{slide.code}</span>
        </div>
        {hasSource && (
          <div className="rounded-lg bg-black/30 px-5 py-2 text-3xl text-gray-200">
            {slide.page && <span>Podręcznik s. {slide.page}</span>}
            {slide.page && slide.exerciseNo && <span>, </span>}
            {slide.exerciseNo && <span>ćw. {slide.exerciseNo}</span>}
          </div>
        )}
      </div>

      <div className={`flex flex-1 items-center justify-center gap-10 ${slide.art ? 'px-2' : 'px-8'}`}>
        <div
          className={`flex flex-col justify-center gap-5 ${slide.art ? 'flex-1 text-left' : 'flex-1 items-center text-center'}`}
        >
          {slide.title && (
            <h2 className="font-bold leading-tight text-white" style={{ fontSize: tSize }}>
              {slide.title}
            </h2>
          )}
          <RichText
            text={slide.body}
            className="space-y-[0.6em] leading-snug text-gray-100 [&_ul]:space-y-[0.3em] [&_ol]:space-y-[0.3em]"
            style={{ fontSize: bSize }}
          />
        </div>
        {slide.art && (
          <div className="flex items-center justify-center" style={{ width: 460 }}>
            <SlideArtView art={slide.art} className="h-auto w-full" />
          </div>
        )}
      </div>

      {hasTimer && (
        <div className="flex justify-center">
          <StopwatchBar key={slide.id} timerSec={slide.timerSec as number} />
        </div>
      )}
    </div>
  );
}
