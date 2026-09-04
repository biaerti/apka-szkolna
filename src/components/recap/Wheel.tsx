// Kolo fortuny rysowane na canvasie 2D. Sektory = wpisy do puli (PoolEntry) -
// uczen z podwojnym wejsciem (3 uwagi) ma dwa sasiadujace lub rozrzucone
// sektory, wiec rysujemy po wpisach, nie po uczniach. Wynik jest losowany
// PRZED animacja (przez useRecapSession) - tu tylko animujemy obrot do
// zadanego kata koncowego (easing ease-out).
//
// Rysowanie w devicePixelRatio (ostrosc na projektorze) + etykiety radialne
// (jedna linia, wyrownana do prawej przy promieniu 0.92), zeby nazwiska sie nie
// nakladaly przy wiekszej liczbie sektorow. Wylosowany sektor jest podswietlony
// (zolty), a sektory ucznia z podwojnym wejsciem sa bursztynowe, zeby dzieci
// widzialy, ze ktos jest na kole dwa razy.

import { useEffect, useRef } from 'react';
import type { PoolEntry } from '../../lib/recap';

export interface WheelProps {
  entries: PoolEntry[];
  spinning: boolean;
  targetAngle: number;
  spinToken: number;
  spinSec: number;
  onSpinEnd: () => void;
  size?: number;
  /** Klucz wpisu aktualnie wylosowanego (podswietlenie DOKLADNIE tego sektora). */
  highlightKey?: string | null;
}

const COLORS = ['#4f46e5', '#818cf8', '#312e81', '#6366f1'];
const DOUBLE_COLORS = ['#b45309', '#d97706'];

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function Wheel({
  entries,
  spinning,
  targetAngle,
  spinToken,
  spinSec,
  onSpinEnd,
  size = 480,
  highlightKey = null,
}: WheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const animRef = useRef<number | null>(null);

  function draw(rotationDeg: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = size;
    const h = size;
    // Bufor fizyczny w devicePixelRatio - ostry rysunek na projektorze.
    const targetW = Math.max(1, Math.round(w * dpr));
    const targetH = Math.max(1, Math.round(h * dpr));
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) / 2 - 8;

    ctx.clearRect(0, 0, w, h);

    const count = entries.length;
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

    // Uczniowie z wiecej niz jednym wpisem w biezacej puli - ich sektory
    // rysujemy bursztynowo, zeby bylo widac podwojne wejscie na kole.
    const countByStudent = new Map<string, number>();
    for (const entry of entries) {
      countByStudent.set(entry.student.id, (countByStudent.get(entry.student.id) ?? 0) + 1);
    }

    const segment = (Math.PI * 2) / count;
    // Konwersja: 0 stopni (kat z wheelTargetAngle) = gora (wskaznik). Canvas 0 rad = prawo,
    // wiec przesuwamy o -90 stopni oraz o kat obrotu (w radianach), zgodnie z ruchem wskazowek zegara.
    const rotationRad = (rotationDeg * Math.PI) / 180;
    const startOffset = -Math.PI / 2 + rotationRad;

    // Rozmiar czcionki dobrany do liczby sektorow: przy 20 sektorach ~ size/28,
    // nigdy mniej niz 12px.
    const fontSize = Math.max(12, (size * 20) / (28 * count));
    const highlightIdx = highlightKey ? entries.findIndex((en) => en.key === highlightKey) : -1;

    for (let i = 0; i < count; i++) {
      const start = startOffset + i * segment;
      const end = start + segment;
      const isHighlighted = !spinning && i === highlightIdx;
      const entry = entries[i];
      const isDouble = (countByStudent.get(entry.student.id) ?? 0) > 1;
      const colorSet = isDouble ? DOUBLE_COLORS : COLORS;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, start, end);
      ctx.closePath();
      ctx.fillStyle = isHighlighted ? '#facc15' : colorSet[i % colorSet.length];
      ctx.fill();
      ctx.strokeStyle = isHighlighted ? '#fff7ed' : '#0f172a';
      ctx.lineWidth = isHighlighted ? 4 : 2;
      ctx.stroke();

      const mid = start + segment / 2;

      // Tekst radialny: od srodka na zewnatrz, jedna linia, wyrownana do prawej
      // przy promieniu 0.92 (czyli koniec napisu przy krawedzi kola).
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(mid);
      ctx.fillStyle = isHighlighted ? '#1f2937' : '#ffffff';
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      const student = entry.student;
      const fullText = `${student.firstName} ${student.lastName}`;
      const maxWidth = radius * 0.7;
      let label = fullText;
      if (ctx.measureText(fullText).width > maxWidth) {
        label = `${student.firstName} ${student.lastName.charAt(0)}.`;
      }
      ctx.fillText(label, radius * 0.92, 0);
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
  }, [entries, size, highlightKey, spinning]);

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
      className="mx-auto block"
      role="img"
      aria-label="Koło fortuny z uczniami"
    />
  );
}
