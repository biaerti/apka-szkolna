// Slajd z filmikiem lekcyjnym. Spacja na tym slajdzie odtwarza/pauzuje film
// (zamiast przechodzic dalej) - strzalki dalej zmieniaja slajdy.

import { useEffect, useRef, useState } from 'react';
import type { Slide } from '../../data/types';
import { filmikById, filmikUrl } from '../../data/filmiki';

type VideoSlide = Extract<Slide, { kind: 'video' }>;

export function VideoSlideView({ slide }: { slide: VideoSlide }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const title = slide.title ?? filmikById(slide.videoId)?.title;

  useEffect(() => {
    let cancelled = false;
    setUrl(null);
    setError(null);
    if (!slide.videoId) return;
    filmikUrl(slide.videoId)
      .then((next) => {
        if (!cancelled) setUrl(next);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [slide.videoId]);

  // Faza capture na window - przed obsluga klawiszy prezentacji (usePresentKeys na document).
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== ' ' && e.code !== 'Space') return;
      const video = videoRef.current;
      if (!video) return;
      e.preventDefault();
      e.stopPropagation();
      if (video.paused) void video.play();
      else video.pause();
    }
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, []);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-10 pb-6 pt-8">
      {title && <h2 className="shrink-0 text-center text-[44px] font-bold leading-tight text-white">{title}</h2>}
      {url ? (
        <video
          ref={videoRef}
          src={url}
          controls
          preload="auto"
          className="min-h-0 w-full flex-1 rounded-xl bg-black object-contain"
        />
      ) : (
        <div className="flex min-h-0 w-full flex-1 items-center justify-center rounded-xl border-2 border-dashed border-gray-700 text-3xl text-gray-400">
          {!slide.videoId ? 'Nie wybrano filmu' : (error ?? 'Ładuję film...')}
        </div>
      )}
      {url && <p className="shrink-0 text-xl text-gray-500">Spacja: odtwórz / pauza</p>}
    </div>
  );
}
