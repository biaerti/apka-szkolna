import type { Slide } from '../../data/types';

export function TitleSlideView({ slide }: { slide: Extract<Slide, { kind: 'title' }> }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-16 text-center">
      <h1 className="text-[56px] font-bold leading-tight text-white sm:text-[72px]">{slide.title}</h1>
      {slide.subtitle && <p className="mt-6 text-3xl text-gray-300">{slide.subtitle}</p>}
    </div>
  );
}
