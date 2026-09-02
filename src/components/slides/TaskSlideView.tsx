import type { Slide } from '../../data/types';
import { RichText } from './RichText';
import { StopwatchBar } from './StopwatchBar';

export function TaskSlideView({ slide }: { slide: Extract<Slide, { kind: 'task' }> }) {
  const hasSource = slide.page || slide.exerciseNo;

  return (
    <div className="relative flex h-full flex-col px-16 py-10">
      <div className="flex items-start justify-between">
        <div className="rounded-2xl border-4 border-accent-400 px-8 py-3">
          <span className="text-[96px] font-bold leading-none text-accent-300">{slide.code}</span>
        </div>
        {hasSource && (
          <div className="rounded-lg bg-black/30 px-5 py-2 text-2xl text-gray-200">
            {slide.page && <span>Podręcznik s. {slide.page}</span>}
            {slide.page && slide.exerciseNo && <span>, </span>}
            {slide.exerciseNo && <span>ćw. {slide.exerciseNo}</span>}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
        {slide.title && <h2 className="text-5xl font-bold text-white">{slide.title}</h2>}
        <RichText text={slide.body} className="space-y-3 text-[32px] leading-snug text-gray-100" />
      </div>

      {typeof slide.timerSec === 'number' && slide.timerSec > 0 && (
        <div className="flex justify-center">
          <StopwatchBar key={slide.id} timerSec={slide.timerSec} />
        </div>
      )}
    </div>
  );
}
