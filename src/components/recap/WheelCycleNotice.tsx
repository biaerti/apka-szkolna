// Animacja "kolo sie zeruje": gdy ostatnia osoba z klasy odpowie, obieg kola
// (src/lib/wheelCycle.ts) sie konczy i wszyscy wracaja na kolo. Komponent sam
// liczy obieg ze store i pokazuje plansze na kilka sekund, kiedy numer obiegu
// wzrosnie w trakcie lekcji (nie przy otwarciu kola).

import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../../data/store';
import { wheelCycle } from '../../lib/wheelCycle';

const SHOW_MS = 4500;

export function WheelCycleNotice({ classId }: { classId: string }) {
  const recapEvents = useStore((s) => s.recapEvents);
  const students = useStore((s) => s.students);
  const cycle = useMemo(() => wheelCycle(recapEvents, classId, students).cycle, [recapEvents, classId, students]);

  const prev = useRef<{ classId: string; cycle: number } | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const last = prev.current;
    prev.current = { classId, cycle };
    if (!last || last.classId !== classId || cycle <= last.cycle) return;
    setVisible(true);
    const t = window.setTimeout(() => setVisible(false), SHOW_MS);
    return () => window.clearTimeout(t);
  }, [classId, cycle]);

  if (!visible) return null;
  return (
    <div className="wheel-cycle-notice pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-black/60">
      <style>{`
        .wheel-cycle-notice { animation: wcn-fade ${SHOW_MS}ms ease-in-out forwards; }
        .wheel-cycle-card { animation: wcn-pop 600ms cubic-bezier(.2,1.6,.4,1) both; }
        .wheel-cycle-spin { animation: wcn-spin 2.4s cubic-bezier(.15,.7,.3,1) both; }
        @keyframes wcn-fade { 0% { opacity: 0 } 8% { opacity: 1 } 85% { opacity: 1 } 100% { opacity: 0 } }
        @keyframes wcn-pop { from { transform: scale(.6) } to { transform: scale(1) } }
        @keyframes wcn-spin { from { transform: rotate(0) } to { transform: rotate(-1440deg) } }
      `}</style>
      <div className="wheel-cycle-card flex flex-col items-center gap-4 rounded-3xl bg-white px-12 py-10 text-center shadow-2xl">
        <svg viewBox="0 0 100 100" className="wheel-cycle-spin h-32 w-32" aria-hidden>
          {Array.from({ length: 8 }, (_, i) => (
            <path
              key={i}
              d={`M50 50 L${50 + 46 * Math.cos((i * Math.PI) / 4)} ${50 + 46 * Math.sin((i * Math.PI) / 4)} A46 46 0 0 1 ${
                50 + 46 * Math.cos(((i + 1) * Math.PI) / 4)
              } ${50 + 46 * Math.sin(((i + 1) * Math.PI) / 4)} Z`}
              fill={['#f87171', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#f472b6', '#fb923c', '#22d3ee'][i]}
            />
          ))}
          <circle cx="50" cy="50" r="8" fill="#fff" />
        </svg>
        <p className="text-4xl font-bold text-gray-900">Wszyscy już byli!</p>
        <p className="text-2xl text-gray-600">Koło się zeruje - wszyscy wracają do losowania.</p>
      </div>
    </div>
  );
}
