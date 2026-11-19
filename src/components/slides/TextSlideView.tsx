// Slajd tekstowy. Rozmiary czcionek nie sa sztywne - liczymy je z dlugosci
// tekstu (fitText.ts), zeby krotki slajd byl OGROMNY, a dlugi wciaz sie
// miescil. Wymiary ponizej sa w pikselach kartki 1280x720 ze SlideView, ktora
// na rzutniku skaluje sie do pelnego ekranu.

import { useRef } from 'react';
import type { Slide } from '../../data/types';
import { RichText } from './RichText';
import { FULL_ART, SlideArtView, WIDE_ART } from './art';
import { resolvedStudentAction, StudentActionBadge } from './StudentActionBadge';
import { estimateTextHeight, fitFontSize } from './fitText';
import { useSlideFontScale } from './useSlideFontScale';
import { useKrokiListy } from './useKrokiListy';

const TITLE_FIT = { lineHeight: 1.15, charRatio: 0.55 };

function titleSize(title: string, width: number, scale: number): number {
  return fitFontSize(title, { width, height: 150, min: 42, max: 96, scale, ...TITLE_FIT });
}

function titleHeight(title: string, size: number, width: number): number {
  return estimateTextHeight(title, size, { width, height: 0, min: 0, max: 0, ...TITLE_FIT });
}

/**
 * `narrow` - tryb pisania (klawisz P): sam tekst w lewej kolumnie, bez ilustracji.
 * `kroki` - prezentacja: punkty slajdu `krokowo` wchodza po kolei (w miniaturkach wszystkie).
 */
export function TextSlideView({ slide, narrow = false, kroki = false }: { slide: Extract<Slide, { kind: 'text' }>; narrow?: boolean; kroki?: boolean }) {
  const scale = useSlideFontScale();
  const tresc = useRef<HTMLDivElement>(null);
  useKrokiListy(tresc, kroki && !!slide.krokowo, slide.id);
  const studentAction = resolvedStudentAction(slide.studentAction, slide.zeszyt, 'copy');

  // Plakietka (prawy gorny rog) zabiera tytulowi miejsce w ukladach na cala szerokosc.
  const PLAKIETKA = 380;
  function block(width: number, height: number, podPlakietka = false) {
    const tWidth = podPlakietka && studentAction ? width - PLAKIETKA : width;
    const tSize = slide.title ? titleSize(slide.title, tWidth, scale) : 0;
    const used = slide.title ? titleHeight(slide.title, tSize, tWidth) + 28 : 0;
    const bSize = fitFontSize(slide.body, { width, height: height - used, min: 28, max: 72, scale });
    return (
      <>
        {slide.title && (
          <h2 className="font-bold leading-tight text-white" style={{ fontSize: tSize, maxWidth: tWidth }}>
            {slide.title}
          </h2>
        )}
        <div ref={tresc}>
          <RichText
            text={slide.body}
            className="space-y-[0.6em] leading-snug text-gray-100 [&_ul]:space-y-[0.3em] [&_ol]:space-y-[0.3em]"
            style={{ fontSize: bSize }}
          />
        </div>
      </>
    );
  }

  // Ikonka "do zeszytu" wisi w prawym gornym rogu, nad ukladem kolumn -
  // wspolne miejsce dla wszystkich trzech wariantow slajdu.
  const badge = studentAction ? (
    // top-14: nizej niz zegar prezentacji (PresentClock, fixed w rogu ekranu).
    <div className="absolute right-8 top-14 z-10">
      <StudentActionBadge action={studentAction} text={slide.studentActionText} />
    </div>
  ) : null;

  if (narrow) {
    return (
      <div className="relative flex h-full flex-col justify-center gap-6 px-10 py-14">
        {block(480, 600)}
      </div>
    );
  }

  if (slide.photo) {
    return (
      <div className="relative flex h-full flex-row items-center gap-10 px-14 py-12">
        {badge}
        <div className="flex flex-1 flex-col justify-center gap-6">{block(700, 600)}</div>
        <figure className="flex flex-col items-end gap-2" style={{ width: 400 }}>
          <img src={slide.photo.src} alt="" className="w-full rounded-2xl object-cover" style={{ maxHeight: 520 }} />
          <figcaption className="text-xs text-gray-500">{slide.photo.credit}</figcaption>
        </figure>
      </div>
    );
  }

  // Schemat na caly slajd (np. "zdrada"): maly tytul, ilustracja na reszcie
  // kartki. Kroki (`krokowo`) odkrywaja jej czesci z data-krok.
  if (slide.art && FULL_ART.has(slide.art)) {
    return (
      <div ref={tresc} className="relative flex h-full flex-col gap-4 px-14 pb-8 pt-12">
        {badge}
        {slide.title && (
          <h2 className="font-bold leading-tight text-white" style={{ fontSize: 56 * scale, maxWidth: 1172 - PLAKIETKA }}>
            {slide.title}
          </h2>
        )}
        <SlideArtView art={slide.art} className="min-h-0 w-full flex-1" />
      </div>
    );
  }

  if (!slide.art) {
    return (
      <div className="relative flex h-full flex-col justify-center gap-7 px-20 py-14">
        {badge}
        {block(1120, 600, true)}
      </div>
    );
  }

  // Szerokie, poziome schematy (np. przebieg lekcji) czytelniejsze sa pod
  // tekstem na cala szerokosc niz w waskiej kolumnie obok.
  if (WIDE_ART.has(slide.art)) {
    return (
      <div className="relative flex h-full flex-col justify-center gap-8 px-16 py-12">
        {badge}
        <div className="flex flex-col justify-center gap-6">{block(1152, 350, true)}</div>
        <SlideArtView art={slide.art} className="mx-auto h-auto w-full max-w-3xl" />
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-row items-center gap-12 px-14 py-12">
      {badge}
      <div className="flex flex-1 flex-col justify-center gap-6">{block(600, 600)}</div>
      <div className="flex items-center justify-center" style={{ width: 480 }}>
        <SlideArtView art={slide.art} className="h-auto w-full" />
      </div>
    </div>
  );
}
