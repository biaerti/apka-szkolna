// Slajd tekstowy. Rozmiary czcionek nie sa sztywne - liczymy je z dlugosci
// tekstu (fitText.ts), zeby krotki slajd byl OGROMNY, a dlugi wciaz sie
// miescil. Wymiary ponizej sa w pikselach kartki 1280x720 ze SlideView, ktora
// na rzutniku skaluje sie do pelnego ekranu.

import type { Slide } from '../../data/types';
import { RichText } from './RichText';
import { SlideArtView, WIDE_ART } from './art';
import { estimateTextHeight, fitFontSize } from './fitText';

const TITLE_FIT = { lineHeight: 1.15, charRatio: 0.55 };

function titleSize(title: string, width: number): number {
  return fitFontSize(title, { width, height: 150, min: 36, max: 88, ...TITLE_FIT });
}

function titleHeight(title: string, size: number, width: number): number {
  return estimateTextHeight(title, size, { width, height: 0, min: 0, max: 0, ...TITLE_FIT });
}

export function TextSlideView({ slide }: { slide: Extract<Slide, { kind: 'text' }> }) {
  function block(width: number, height: number) {
    const tSize = slide.title ? titleSize(slide.title, width) : 0;
    const used = slide.title ? titleHeight(slide.title, tSize, width) + 28 : 0;
    const bSize = fitFontSize(slide.body, { width, height: height - used, min: 22, max: 60 });
    return (
      <>
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
      </>
    );
  }

  if (!slide.art) {
    return <div className="flex h-full flex-col justify-center gap-7 px-20 py-14">{block(1120, 600)}</div>;
  }

  // Szerokie, poziome schematy (np. przebieg lekcji) czytelniejsze sa pod
  // tekstem na cala szerokosc niz w waskiej kolumnie obok.
  if (WIDE_ART.has(slide.art)) {
    return (
      <div className="flex h-full flex-col justify-center gap-8 px-16 py-12">
        <div className="flex flex-col justify-center gap-6">{block(1152, 350)}</div>
        <SlideArtView art={slide.art} className="mx-auto h-auto w-full max-w-3xl" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-row items-center gap-12 px-14 py-12">
      <div className="flex flex-1 flex-col justify-center gap-6">{block(600, 600)}</div>
      <div className="flex items-center justify-center" style={{ width: 480 }}>
        <SlideArtView art={slide.art} className="h-auto w-full" />
      </div>
    </div>
  );
}
