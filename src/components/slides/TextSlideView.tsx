import type { Slide } from '../../data/types';
import { RichText } from './RichText';
import { SlideArtView, WIDE_ART } from './art';

export function TextSlideView({ slide }: { slide: Extract<Slide, { kind: 'text' }> }) {
  if (!slide.art) {
    return (
      <div className="flex h-full flex-col justify-center gap-6 px-20 py-16">
        {slide.title && <h2 className="text-5xl font-bold text-white">{slide.title}</h2>}
        <RichText
          text={slide.body}
          className="space-y-4 text-[32px] leading-snug text-gray-100 [&_ul]:space-y-2 [&_ol]:space-y-2"
        />
      </div>
    );
  }

  const text = (
    <div className="flex flex-1 flex-col justify-center gap-6">
      {slide.title && <h2 className="text-5xl font-bold text-white">{slide.title}</h2>}
      <RichText
        text={slide.body}
        className="space-y-4 text-[30px] leading-snug text-gray-100 [&_ul]:space-y-2 [&_ol]:space-y-2"
      />
    </div>
  );

  // Szerokie, poziome schematy (np. przebieg lekcji) czytelniejsze sa pod
  // tekstem na cala szerokosc niz w waskiej kolumnie obok.
  if (WIDE_ART.has(slide.art)) {
    return (
      <div className="flex h-full flex-col justify-center gap-8 px-16 py-12">
        {text}
        <SlideArtView art={slide.art} className="mx-auto h-auto w-full max-w-3xl" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col justify-center gap-10 px-14 py-12 lg:flex-row lg:items-center lg:gap-14 lg:px-16">
      {text}
      <div className="flex flex-1 items-center justify-center lg:max-w-[42%]">
        <SlideArtView art={slide.art} className="h-auto w-full max-w-md" />
      </div>
    </div>
  );
}
