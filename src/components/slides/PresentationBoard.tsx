import { useEffect, useRef, useState } from 'react';
import { SLIDE_H, SLIDE_W } from './fitText';
import { AnnotationLayer } from './AnnotationLayer';
import type { SlideAnnotations } from './useSlideAnnotations';

/** Pusta tablica 16:9 korzystajaca z tej samej warstwy narzedzi co slajdy. */
export function PresentationBoard({ ann }: { ann: SlideAnnotations }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const element = frameRef.current;
    if (!element) return;
    const update = () => {
      const next = Math.min(element.clientWidth / SLIDE_W, element.clientHeight / SLIDE_H);
      setScale(next > 0 ? next : 1);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={frameRef} className="flex h-full w-full items-center justify-center overflow-hidden bg-gray-950">
      <div className="relative overflow-hidden" style={{ width: SLIDE_W * scale, height: SLIDE_H * scale }}>
        <div
          className="absolute left-0 top-0 overflow-hidden bg-[#f7f5ef] text-gray-900"
          style={{ width: SLIDE_W, height: SLIDE_H, transformOrigin: 'top left', transform: `scale(${scale})` }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(75,85,99,.28) 1.25px, transparent 1.25px)', backgroundSize: '28px 28px' }}
          />
          <div className="pointer-events-none absolute left-10 top-8 text-sm font-semibold uppercase tracking-[0.16em] text-gray-400">
            Tablica do tej prezentacji
          </div>
          <AnnotationLayer ann={ann} />
        </div>
      </div>
    </div>
  );
}
