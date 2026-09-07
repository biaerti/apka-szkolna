// Uchwyt do przeciagania okna, ktory zostaje przyciskiem: przeciaganie rusza
// dopiero po ruchu myszy z wcisnietym przyciskiem, a samo klikniecie odpala
// akcje. Dlatego nie uzywamy data-tauri-drag-region - ono polyka klik, a
// pigulka ma byc jednoczesnie uchwytem i przyciskiem "rozwin".

import { useRef, type PointerEvent } from 'react';
import { przeciagnijOkno } from '../../lib/desktop';

export function useUchwytPrzeciagania(onKlik: () => void) {
  const startRef = useRef<{ x: number; y: number } | null>(null);
  return {
    onPointerDown: (e: PointerEvent) => {
      if (e.button !== 0) return;
      startRef.current = { x: e.clientX, y: e.clientY };
    },
    onPointerMove: (e: PointerEvent) => {
      const start = startRef.current;
      if (!start) return;
      if (Math.abs(e.clientX - start.x) + Math.abs(e.clientY - start.y) > 4) {
        startRef.current = null;
        void przeciagnijOkno();
      }
    },
    onPointerUp: () => {
      if (startRef.current) {
        startRef.current = null;
        onKlik();
      }
    },
  };
}
