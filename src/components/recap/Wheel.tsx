// Kolo fortuny rysowane na canvasie 2D. Sektory = uczniowie z puli (naprzemienne
// kolory). Wynik jest losowany PRZED animacja (przez useRecapSession) - tu tylko
// animujemy obrot do zadanego kata koncowego (easing ease-out).

import { useEffect, useRef } from 'react';
import type { Student } from '../../data/types';

export interface WheelProps {
  students: Student[];
  spinning: boolean;
  targetAngle: number;
  spinToken: number;
  spinSec: number;
  onSpinEnd: () => void;
  size?: number;
}

const COLORS = ['#4f46e5', '#818cf8', '#312e81', '#6366f1'];

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function Wheel({ students, spinning, targetAngle, spinToken, spinSec, onSpinEnd, size = 480 }: WheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const animRef = useRef<number | null>(null);

  function draw(rotationDeg: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) / 2 - 8;

    ctx.clearRect(0, 0, w, h);

    const count = students.length;
    if (count === 0) {
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#1f2937';
      ctx.fill();
      ctx.fillStyle = '#9ca3af';
      ctx.font = '20px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Brak uczniów w puli', cx, cy);
      return;
    }

    const segment = (Math.PI * 2) / count;
    // Konwersja: 0 stopni (kat z wheelTargetAngle) = gora (wskaznik). Canvas 0 rad = prawo,
    // wiec przesuwamy o -90 stopni oraz o kat obrotu (w radianach), zgodnie z ruchem wskazowek zegara.
    const rotationRad = (rotationDeg * Math.PI) / 180;
    const startOffset = -Math.PI / 2 + rotationRad;

    for (let i = 0; i < count; i++) {
      const start = startOffset + i * segment;
      const end = start + segment;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, start, end);
      ctx.closePath();
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.stroke();

      const mid = start + segment / 2;
      ctx.save();
      ctx.translate(cx + Math.cos(mid) * radius * 0.62, cy + Math.sin(mid) * radius * 0.62);
      ctx.rotate(mid + Math.PI / 2);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const student = students[i];
      ctx.fillText(`${student.firstName}`, 0, -8);
      ctx.fillText(`${student.lastName}`, 0, 12);
      ctx.restore();
    }

    // Pointer u gory (nie obraca sie).
    ctx.beginPath();
    ctx.moveTo(cx - 16, cy - radius - 6);
    ctx.lineTo(cx + 16, cy - radius - 6);
    ctx.lineTo(cx, cy - radius + 22);
    ctx.closePath();
    ctx.fillStyle = '#facc15';
    ctx.fill();

    // Srodek kola.
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  useEffect(() => {
    draw(rotationRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [students]);

  useEffect(() => {
    if (!spinning || spinToken === 0) return;
    const startRotation = rotationRef.current;
    // targetAngle jest katem absolutnym (0 = wskaznik) + pelne obroty; liczymy od
    // ostatniego pelnego obrotu, inaczej po pierwszym losowaniu kolo trafia w zly sektor.
    const endRotation = Math.floor(startRotation / 360) * 360 + targetAngle;
    const durationMs = Math.max(500, spinSec * 1000);
    const startTime = performance.now();

    function frame(now: number) {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / durationMs);
      const eased = easeOutCubic(t);
      const current = startRotation + (endRotation - startRotation) * eased;
      rotationRef.current = current;
      draw(current);
      if (t < 1) {
        animRef.current = requestAnimationFrame(frame);
      } else {
        onSpinEnd();
      }
    }
    animRef.current = requestAnimationFrame(frame);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinToken]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="mx-auto block"
      role="img"
      aria-label="Koło fortuny z uczniami"
    />
  );
}
