import { useEffect, useRef, useState } from 'react';
import { SLIDE_H, SLIDE_W } from './fitText';
import { AnnotationLayer } from './AnnotationLayer';
import type { SlideAnnotations } from './useSlideAnnotations';

/**
 * Pusta tablica do rysowania - korzysta z tej samej warstwy narzedzi co slajdy,
 * wiec wspolrzedne trzyma w pikselach kartki 1280x720 (patrz annotations.ts).
 *
 * Kartka jest skalowana "pod okno, a nie w okno" (Math.max zamiast Math.min):
 * tablica ma byc po prostu calym tlem, bez ramki i bez ciemnych pasow po bokach.
 * Przy ekranie innym niz 16:9 wypada poza obraz waski pasek kartki - na pustej
 * tablicy nic to nie kosztuje, a nauczyciel rysuje po calym ekranie.
 */
export function PresentationBoard({ ann }: { ann: SlideAnnotations }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ scale: 1, left: 0, top: 0 });

  useEffect(() => {
    const element = frameRef.current;
    if (!element) return;
    const update = () => {
      const { clientWidth: w, clientHeight: h } = element;
      if (w === 0 || h === 0) return;
      const scale = Math.max(w / SLIDE_W, h / SLIDE_H);
      // Srodek kartki zostaje na srodku ekranu - obcina sie rowno z dwoch stron.
      setBox({ scale, left: (w - SLIDE_W * scale) / 2, top: (h - SLIDE_H * scale) / 2 });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={frameRef} className="relative h-full w-full overflow-hidden bg-[#f7f5ef] text-gray-900">
      <div
        className="absolute"
        style={{
          width: SLIDE_W,
          height: SLIDE_H,
          left: box.left,
          top: box.top,
          transformOrigin: 'top left',
          transform: `scale(${box.scale})`,
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(75,85,99,.28) 1.25px, transparent 1.25px)', backgroundSize: '28px 28px' }}
        />
        <AnnotationLayer ann={ann} />
      </div>
    </div>
  );
}
