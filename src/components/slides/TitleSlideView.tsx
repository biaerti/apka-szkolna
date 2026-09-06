import type { Slide } from '../../data/types';
import { SlideArtView } from './art';
import { fitFontSize } from './fitText';

export function TitleSlideView({ slide }: { slide: Extract<Slide, { kind: 'title' }> }) {
  // Rozmiary w pikselach kartki 1280x720 ze SlideView - krotki tytul dostaje
  // maksimum, dluzszy schodzi tylko tyle, zeby sie zmiescil.
  const titleSize = fitFontSize(slide.title, {
    width: 1080,
    height: slide.art ? 220 : 340,
    min: 44,
    max: 116,
    lineHeight: 1.1,
    charRatio: 0.55,
  });
  const subtitleSize = slide.subtitle
    ? fitFontSize(slide.subtitle, { width: 1000, height: 120, min: 24, max: 48, charRatio: 0.5 })
    : 0;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 px-16 text-center">
      <div>
        <h1 className="font-bold leading-tight text-white" style={{ fontSize: titleSize }}>
          {slide.title}
        </h1>
        {slide.subtitle && (
          <p className="mt-5 text-gray-300" style={{ fontSize: subtitleSize }}>
            {slide.subtitle}
          </p>
        )}
      </div>
      {slide.art && (
        <div className="h-64 w-full max-w-xl">
          <SlideArtView art={slide.art} className="h-full w-full" />
        </div>
      )}
    </div>
  );
}
