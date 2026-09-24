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
import { VideoSlideView } from './VideoSlideView';
import { CzytankaSlideView } from './CzytankaSlideView';
import { TopicSlideView } from './TopicSlideView';

export interface SlideViewProps {
  slide: Slide;
  classId: string;
  onRecapExit?: () => void;
  /** Kod lekcji (np. "4.3") - maly znacznik w rogu slajdu i tresc slajdu z tematem. */
  lessonCode?: string;
  /** Temat lekcji do zeszytu - uzywany przez slajd `topic`, gdy nie ma wlasnego. */
  lessonTopic?: string;
  /** Strony z pierwszego slajdu podręcznikowego, łączone w pokazie ze slajdem tematu. */
  textbookPage?: { from: number; to?: number };
  /**
   * Warstwa rysowania (AnnotationLayer) - renderowana NA kartce 1280x720, wiec
   * kreski skaluja sie razem z trescia slajdu. Podglad w edytorze jej nie podaje.
   */
  overlay?: ReactNode;
  /**
   * Tryb pisania (klawisz P w prezentacji): tresc zadania albo slajdu
   * tekstowego zweza sie do lewej kolumny, a prawe ~56% kartki jest puste -
   * nauczyciel pisze i rysuje tam narzedziami adnotacji. Dziala dla slajdow
   * `task` i `text`; pozostale rysuja sie normalnie (patrz supportsWritePane).
   */
  writePane?: boolean;
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

/** Szerokosc lewej kolumny w trybie pisania - reszta kartki 1280 to pole do pisania. */
const WRITE_PANE_TEXT_W = 560;

export function supportsWritePane(slide: Slide | undefined): boolean {
  return slide?.kind === 'task' || slide?.kind === 'text';
}

/** Puste pole do pisania - kropkowana podkladka jak w widoku "P" na kartkowkach. */
function WritePad() {
  return (
    <div className="relative h-full flex-1 border-l border-gray-800">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(156,163,175,.3) 1.25px, transparent 1.25px)', backgroundSize: '28px 28px' }}
      />
    </div>
  );
}

export function SlideView({ slide, classId, onRecapExit, lessonCode, lessonTopic, textbookPage, overlay, writePane = false }: SlideViewProps) {
  // Kolo fortuny: wlasny uklad na caly ekran, bez kartki i bez znacznika w rogu
  // (ma wlasny gorny pasek z nazwa klasy i zestawu).
  if (slide.kind === 'recap') {
    return (
      <div className="h-full w-full bg-gray-950 text-gray-100">
        <RecapSlideView slide={slide} classId={classId} onExit={onRecapExit} />
      </div>
    );
  }

  if (writePane && (slide.kind === 'task' || slide.kind === 'text')) {
    return (
      <SlideStage>
        <div className="absolute inset-0 flex">
          <div className="relative h-full shrink-0" style={{ width: WRITE_PANE_TEXT_W }}>
            {slide.kind === 'task' ? <TaskSlideView key={slide.id} slide={slide} narrow /> : <TextSlideView slide={slide} narrow />}
          </div>
          <WritePad />
        </div>
        {lessonCode && <LessonCodeBadge code={lessonCode} onLightBackground={false} />}
        {overlay}
      </SlideStage>
    );
  }

  return (
    <SlideStage>
      {lessonCode && slide.kind !== 'topic' && (
        <LessonCodeBadge code={lessonCode} onLightBackground={slide.kind === 'note'} />
      )}
      {slide.kind === 'title' && <TitleSlideView slide={slide} />}
      {slide.kind === 'topic' && <TopicSlideView slide={slide} code={lessonCode} lessonTopic={lessonTopic} textbookPage={textbookPage} />}
      {slide.kind === 'text' && <TextSlideView slide={slide} />}
      {slide.kind === 'task' && <TaskSlideView key={slide.id} slide={slide} />}
      {slide.kind === 'read' && <ReadSlideView slide={slide} />}
      {slide.kind === 'note' && <NoteSlideView slide={slide} code={lessonCode} />}
      {slide.kind === 'image' && <ImageSlideView slide={slide} />}
      {slide.kind === 'video' && <VideoSlideView key={slide.id} slide={slide} />}
      {slide.kind === 'czytanka' && <CzytankaSlideView key={slide.id} slide={slide} />}
      {overlay}
    </SlideStage>
  );
}
