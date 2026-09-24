import { useEffect, useState } from 'react';
import type { Slide } from '../../data/types';
import { CZYTANKI_URL_PREFIX, czytankiPlikUrl } from '../../data/czytanki';
import { RichText } from './RichText';
import { fitFontSize } from './fitText';
import { useSlideFontScale } from './useSlideFontScale';
import { StudentActionBadge } from './StudentActionBadge';

type ImageSlide = Extract<Slide, { kind: 'image' }>;

/**
 * "czytanki:plik.webp" = skan z podrecznika w prywatnym buckecie czytanek
 * (repo jest publiczne, skanow nie commitujemy) - podpisujemy URL przy wyswietleniu.
 */
function useImageUrl(url: string): string | null {
  const prywatny = url.startsWith(CZYTANKI_URL_PREFIX);
  const [signed, setSigned] = useState<string | null>(null);
  useEffect(() => {
    if (!prywatny) return;
    let cancelled = false;
    setSigned(null);
    czytankiPlikUrl(url.slice(CZYTANKI_URL_PREFIX.length))
      .then((next) => !cancelled && setSigned(next))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [url, prywatny]);
  return prywatny ? signed : url;
}

function SlideImg({ slide, className }: { slide: ImageSlide; className: string }) {
  const src = useImageUrl(slide.url);
  return src ? (
    <img src={src} alt={slide.caption ?? slide.title ?? ''} className={className} />
  ) : (
    <div
      className={`flex items-center justify-center rounded-lg border-2 border-dashed border-gray-600 text-3xl text-gray-400 ${className}`}
    >
      {slide.url ? 'Ładuję obraz...' : 'Brak obrazu'}
    </div>
  );
}

export function ImageSlideView({ slide }: { slide: ImageSlide }) {
  // Rozmiary w pikselach kartki 1280x720, przemnozone przez ustawienie
  // "Wielkość liter na slajdach" (useSlideFontScale) - tak jak w reszcie slajdow.
  const scale = useSlideFontScale();
  const titleSize = Math.round(56 * scale);
  const captionSize = Math.round(34 * scale);

  // Screen z podrecznika (ramka teorii albo zadanie): strona u gory, zeby dzieci
  // wiedzialy, gdzie to jest w ksiazce; obok plakietka "W podręczniku" / "Do zeszytu".
  if (typeof slide.page === 'number') {
    return (
      <div className="flex h-full flex-col gap-4 px-12 pb-12 pt-7">
        <div className="flex shrink-0 items-center justify-between gap-6 pr-28">
          <div className="min-w-0">
            <span className="block text-[40px] font-bold leading-tight text-accent-300">Podręcznik s. {slide.page}</span>
            {slide.title && <span className="block text-[28px] leading-tight text-gray-300">{slide.title}</span>}
          </div>
          {slide.studentAction && <StudentActionBadge action={slide.studentAction} text={slide.studentActionText} />}
        </div>
        {/* Do lewej: pionowa ramka zostawia z prawej miejsce na pisanie po slajdzie. */}
        <div className="flex min-h-0 flex-1 items-start justify-start">
          <SlideImg slide={slide} className="max-h-full max-w-full rounded-lg object-contain" />
        </div>
      </div>
    );
  }

  // Zdjecie + tekst obok - np. "Kim jestem". Naglowek nad calym slajdem,
  // zdjecie po lewej, tekst po prawej - czytelne na 1280x720.
  if (slide.body) {
    const bodySize = fitFontSize(slide.body, { width: 660, height: 460, min: 24, max: 52, scale });
    return (
      <div className="flex h-full flex-col gap-6 px-16 py-12">
        {slide.title && (
          <h2 className="font-bold leading-tight text-white" style={{ fontSize: titleSize }}>
            {slide.title}
          </h2>
        )}
        <div className="flex flex-1 flex-row items-center gap-12">
          <SlideImg slide={slide} className="max-h-full w-[420px] flex-shrink-0 rounded-lg object-cover" />
          <RichText
            text={slide.body}
            className="flex-1 space-y-[0.6em] leading-snug text-gray-100"
            style={{ fontSize: bodySize }}
          />
        </div>
      </div>
    );
  }

  // Sam naglowek nad zdjeciem, bez tekstu - np. "Znacie teleturniej Kolo Fortuny?"
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-10 py-8">
      {slide.title && (
        <h2 className="font-bold leading-tight text-white" style={{ fontSize: titleSize }}>
          {slide.title}
        </h2>
      )}
      <SlideImg
        slide={slide}
        className={`${slide.title || slide.caption ? 'max-h-[75%]' : 'max-h-full'} max-w-full rounded-lg object-contain`}
      />
      {slide.caption && (
        <p className="text-gray-300" style={{ fontSize: captionSize }}>
          {slide.caption}
        </p>
      )}
    </div>
  );
}
