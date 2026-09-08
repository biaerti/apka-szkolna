// Renderuje pojedynczy slajd w pelnym rozmiarze (ciemne tlo, jasny tekst) -
// wspolny komponent uzywany zarowno przez prezentacje, jak i podglad w edytorze.
//
// Slajd rysujemy zawsze na kartce 1280x720 (fitText.ts) i skalujemy transformem
// do rozmiaru kontenera. Dzieki temu na rzutniku 1920x1080 kazda literka jest
// automatycznie 1,5x wieksza niz w kodzie, a miniaturka w edytorze pokazuje
// dokladnie to samo, co zobaczy klasa. Wyjatkiem jest slajd `recap` (kolo
// fortuny) - ma wlasny, responsywny uklad i musi dostac caly ekran.

import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Slide } from '../../data/types';
import { SLIDE_H, SLIDE_W } from './fitText';
import { TitleSlideView } from './TitleSlideView';
import { TextSlideView } from './TextSlideView';
import { TaskSlideView } from './TaskSlideView';
import { ReadSlideView } from './ReadSlideView';
import { NoteSlideView } from './NoteSlideView';
import { RecapSlideView } from './RecapSlideView';
import { ImageSlideView } from './ImageSlideView';
import { TopicSlideView } from './TopicSlideView';

export interface SlideViewProps {
  slide: Slide;
  classId: string;
  onRecapExit?: () => void;
  /** Kod lekcji (np. "4.3") - maly znacznik w rogu slajdu i tresc slajdu z tematem. */
  lessonCode?: string;
  /** Temat lekcji do zeszytu - uzywany przez slajd `topic`, gdy nie ma wlasnego. */
  lessonTopic?: string;
}

/** Kartka 1280x720 wyskalowana do kontenera, wysrodkowana. */
function SlideStage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const s = Math.min(el.clientWidth / SLIDE_W, el.clientHeight / SLIDE_H);
      setScale(s > 0 ? s : 1);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex h-full w-full items-center justify-center overflow-hidden bg-gray-950">
      <div className="relative overflow-hidden" style={{ width: SLIDE_W * scale, height: SLIDE_H * scale }}>
        <div
          className="absolute left-0 top-0 bg-gray-950 text-gray-100"
          style={{ width: SLIDE_W, height: SLIDE_H, transformOrigin: 'top left', transform: `scale(${scale})` }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Kod lekcji w rogu - dziecko, ktore sie zgubilo, wie pod jakim tematem pisze.
 * Prawy DOLNY rog: lewa gora nalezy do kodu zadania (Z1), a prawa gora do
 * numeru strony w podreczniku.
 */
function LessonCodeBadge({ code, onLightBackground }: { code: string; onLightBackground: boolean }) {
  return (
    <span
      className={`pointer-events-none absolute bottom-4 right-6 z-10 rounded-md px-3 py-1 text-2xl font-semibold tabular-nums ${
        onLightBackground ? 'bg-gray-900/10 text-gray-500' : 'bg-white/10 text-gray-400'
      }`}
    >
      {code}
    </span>
  );
}

export function SlideView({ slide, classId, onRecapExit, lessonCode, lessonTopic }: SlideViewProps) {
  // Kolo fortuny: wlasny uklad na caly ekran, bez kartki i bez znacznika w rogu
  // (ma wlasny gorny pasek z nazwa klasy i zestawu).
  if (slide.kind === 'recap') {
    return (
      <div className="h-full w-full bg-gray-950 text-gray-100">
        <RecapSlideView slide={slide} classId={classId} onExit={onRecapExit} />
      </div>
    );
  }

  return (
    <SlideStage>
      {lessonCode && slide.kind !== 'topic' && (
        <LessonCodeBadge code={lessonCode} onLightBackground={slide.kind === 'note'} />
      )}
      {slide.kind === 'title' && <TitleSlideView slide={slide} />}
      {slide.kind === 'topic' && <TopicSlideView slide={slide} code={lessonCode} lessonTopic={lessonTopic} />}
      {slide.kind === 'text' && <TextSlideView slide={slide} />}
      {slide.kind === 'task' && <TaskSlideView key={slide.id} slide={slide} />}
      {slide.kind === 'read' && <ReadSlideView slide={slide} />}
      {slide.kind === 'note' && <NoteSlideView slide={slide} />}
      {slide.kind === 'image' && <ImageSlideView slide={slide} />}
    </SlideStage>
  );
}
