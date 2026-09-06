import type { Slide } from '../../data/types';
import { RichText } from './RichText';

type ImageSlide = Extract<Slide, { kind: 'image' }>;

function SlideImg({ slide, className }: { slide: ImageSlide; className: string }) {
  return slide.url ? (
    <img src={slide.url} alt={slide.caption ?? slide.title ?? ''} className={className} />
  ) : (
    <div
      className={`flex items-center justify-center rounded-lg border-2 border-dashed border-gray-600 text-3xl text-gray-400 ${className}`}
    >
      Brak obrazu
    </div>
  );
}

export function ImageSlideView({ slide }: { slide: ImageSlide }) {
  // Zdjecie + tekst obok - np. "Kim jestem". Naglowek nad calym slajdem,
  // zdjecie po lewej, tekst po prawej - czytelne na 1280x720.
  if (slide.body) {
    return (
      <div className="flex h-full flex-col gap-6 px-16 py-12">
        {slide.title && <h2 className="text-5xl font-bold leading-tight text-white">{slide.title}</h2>}
        <div className="flex flex-1 flex-row items-center gap-12">
          <SlideImg slide={slide} className="max-h-full w-[420px] flex-shrink-0 rounded-lg object-cover" />
          <RichText
            text={slide.body}
            className="flex-1 space-y-[0.6em] text-4xl leading-snug text-gray-100"
          />
        </div>
      </div>
    );
  }

  // Sam naglowek nad zdjeciem, bez tekstu - np. "Znacie teleturniej Kolo Fortuny?"
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-10 py-10">
      {slide.title && <h2 className="text-5xl font-bold leading-tight text-white">{slide.title}</h2>}
      <SlideImg slide={slide} className="max-h-[75%] max-w-full rounded-lg object-contain" />
      {slide.caption && <p className="text-3xl text-gray-300">{slide.caption}</p>}
    </div>
  );
}
