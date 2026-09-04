import type { Slide } from '../../data/types';
import { SlideArtView } from './art';

export function TitleSlideView({ slide }: { slide: Extract<Slide, { kind: 'title' }> }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-10 px-16 text-center">
      <div>
        <h1 className="text-[56px] font-bold leading-tight text-white sm:text-[72px]">{slide.title}</h1>
        {slide.subtitle && <p className="mt-6 text-3xl text-gray-300">{slide.subtitle}</p>}
      </div>
      {slide.art && (
        <div className="h-56 w-full max-w-lg sm:h-64">
          <SlideArtView art={slide.art} className="h-full w-full" />
        </div>
      )}
    </div>
  );
}
