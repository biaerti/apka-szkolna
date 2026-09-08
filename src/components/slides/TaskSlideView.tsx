// Slajd zadania (Z1, Z2...). Kod zadania jest celowo ogromny - to on wisi na
// tablicy, gdy klasa pisze w zeszytach. Tresc dobiera rozmiar do dlugosci
// (fitText.ts) w pikselach kartki 1280x720 ze SlideView.
//
// Stoper siedzi w PRAWYM DOLNYM ROGU, poza ukladem kolumnowym (absolute) i obok
// kodu lekcji: gdy stal pod trescia, dluzsze polecenie spychalo go poza slajd.
// Dol slajdu jest pod niego zarezerwowany paddingiem, zeby tresc nie wchodzila
// mu pod spod.

import clsx from 'clsx';
import { useState } from 'react';
import type { Slide } from '../../data/types';
import { RichText } from './RichText';
import { SlideArtView } from './art';
import { StopwatchBar } from './StopwatchBar';
import { estimateTextHeight, fitFontSize } from './fitText';
import { useSlideFontScale } from './useSlideFontScale';

const TITLE_FIT = { lineHeight: 1.15, charRatio: 0.55 };

/** Czas stopera, gdy slajd go nie ma, a nauczyciel wlaczy go na lekcji. */
const DEFAULT_TIMER_SEC = 180;

export function TaskSlideView({ slide }: { slide: Extract<Slide, { kind: 'task' }> }) {
  const scale = useSlideFontScale();
  const hasSource = slide.page || slide.exerciseNo;
  // Czas stopera zyje tylko w tym pokazie (SlideView keyuje slajd po id, wiec
  // kolejne zadanie startuje od wartosci z lekcji) - zmiana na lekcji nie
  // zapisuje sie do slajdu, zeby jeden wolniejszy dzien nie przestawial lekcji na stale.
  const [timerSec, setTimerSec] = useState(typeof slide.timerSec === 'number' ? slide.timerSec : 0);
  const hasTimer = timerSec > 0;

  // Z ilustracja tekst dostaje wezsza kolumne - reszta kartki nalezy do obrazka.
  const width = slide.art ? 620 : 1000;
  // Wysokosc do dyspozycji pod naglowkiem z kodem zadania: stoper zabiera pasek
  // przy dolnej krawedzi (patrz padding kontenera nizej).
  const available = hasTimer ? 430 : 480;
  const title = slide.title ?? '';
  const tSize = title ? fitFontSize(title, { width, height: 130, min: 40, max: 84, scale, ...TITLE_FIT }) : 0;
  const used = title
    ? estimateTextHeight(title, tSize, { width, height: 0, min: 0, max: 0, ...TITLE_FIT }) + 20
    : 0;
  const bSize = fitFontSize(slide.body, { width, height: available - used, min: 26, max: 66, scale });

  return (
    <div className={clsx('relative flex h-full flex-col px-16 pt-8', hasTimer ? 'pb-28' : 'pb-16')}>
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

      {/* Prawy dolny rog, na lewo od kodu lekcji (LessonCodeBadge w SlideView). */}
      <div className="absolute bottom-5 right-28">
        {hasTimer ? (
          /* key = dlugosc: zmiana -1/+1 min przestawia stoper od nowa */
          <StopwatchBar
            key={timerSec}
            compact
            timerSec={timerSec}
            onAdjust={(delta) => setTimerSec((t) => Math.max(60, t + delta))}
          />
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setTimerSec(DEFAULT_TIMER_SEC);
            }}
            className="rounded-lg px-4 py-1 text-xl text-gray-500 hover:bg-white/10 hover:text-gray-300"
            title="Włącz stoper na to zadanie (3 min, potem -1/+1 min)"
          >
            + stoper
          </button>
        )}
      </div>
    </div>
  );
}
