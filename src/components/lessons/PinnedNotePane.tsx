// Notatka obok kolejnych slajdow. Czesc klasy jeszcze przepisuje, a reszta
// idzie juz do zadan - ekran dzieli sie w pionie: z lewej notatka, z prawej
// biezacy slajd. Zwinieta notatka to waski pasek przy lewej krawedzi
// (jak "Koło" i "Klasa" po prawej), klawisz N przelacza.

import { useEffect, useRef, useState } from 'react';
import type { Slide } from '../../data/types';
import { NoteSlideView } from '../slides/NoteSlideView';
import { SLIDE_W } from '../slides/fitText';

type NoteSlide = Extract<Slide, { kind: 'note' }>;

export function PinnedNoteTab({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Pokaż notatkę obok (N)"
      className="fixed left-0 top-1/2 z-40 rounded-l-md bg-gray-800/60 px-1.5 py-4 text-[11px] tracking-wide text-gray-300 hover:bg-gray-800/90"
      // Obrot o 180 stopni: napis czytany od dolu, a zaokraglony (po obrocie) prawy bok.
      style={{ writingMode: 'vertical-rl', transform: 'translateY(-50%) rotate(180deg)' }}
    >
      Notatka
    </button>
  );
}

/**
 * Kartka ma szerokosc 1280 (jak kazdy slajd), a wysokosc dopasowana do polowy
 * ekranu - notatka wypelnia cala wysokosc zamiast plywac w czarnych pasach.
 */
export function PinnedNotePane({ slide, lessonCode, onClose }: { slide: NoteSlide; lessonCode?: string; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ scale: number; height: number }>({ scale: 0.5, height: 720 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const scale = el.clientWidth / SLIDE_W;
      if (scale > 0) setSize({ scale, height: Math.max(720, el.clientHeight / scale) });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Gorny pasek: lewy rog zajmuje ikonka stopera prezentacji (PresentationTimer),
  // wiec kartka notatki zaczyna sie pod nim i nic na nia nie wchodzi.
  return (
    <div className="flex h-full shrink-0 flex-col border-r-4 border-gray-800 bg-gray-900" style={{ width: '45%' }} onClick={(e) => e.stopPropagation()}>
      <div className="flex h-14 shrink-0 items-center justify-end px-3">
        <button
          type="button"
          onClick={onClose}
          title="Zwiń notatkę (N)"
          className="rounded-lg bg-gray-800 px-4 py-2 text-base font-semibold text-gray-200 hover:bg-gray-700"
        >
          ‹ Zwiń notatkę
        </button>
      </div>
      <div ref={ref} className="relative min-h-0 flex-1 overflow-hidden bg-amber-50">
        <div
          className="absolute left-0 top-0"
          style={{ width: SLIDE_W, height: size.height, transformOrigin: 'top left', transform: `scale(${size.scale})` }}
        >
          <NoteSlideView slide={slide} code={lessonCode} pinnedHeight={size.height} />
        </div>
      </div>
    </div>
  );
}
