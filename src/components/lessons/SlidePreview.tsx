// Miniaturka slajdu 16:9 - renderuje ten sam komponent co prezentacja,
// przeskalowany transformem CSS do szerokosci kontenera.

import { useEffect, useRef, useState } from 'react';
import type { Slide } from '../../data/types';
import { SlideView } from '../slides/SlideView';

const BASE_WIDTH = 1280;
const BASE_HEIGHT = 720;

export function SlidePreview({ slide, classId }: { slide: Slide; classId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.2);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / BASE_WIDTH);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-lg border border-gray-700 bg-gray-950"
      style={{ height: BASE_HEIGHT * scale }}
    >
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{ width: BASE_WIDTH, height: BASE_HEIGHT, transform: `scale(${scale})` }}
      >
        <SlideView slide={slide} classId={classId} />
      </div>
    </div>
  );
}
