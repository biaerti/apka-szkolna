// Warstwa rysowania NA slajdzie. Siedzi wewnatrz kartki 1280x720 ze SlideView,
// wiec skaluje sie razem z trescia - kreska narysowana na rzutniku zostaje w
// tym samym miejscu slajdu takze po zmianie rozdzielczosci albo pelnego ekranu.
//
// Kreski rysujemy w SVG (jeden <path> na pociagniecie), a dopiski jako zwykle
// diwy - HTML sam zawija tekst, czego <text> w SVG nie robi.

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { SLIDE_H, SLIDE_W } from './fitText';
import {
  appendPoint,
  strokePath,
  type AnnotationPoint,
  type StrokeShape,
  type TextShape,
} from './annotations';
import type { SlideAnnotations } from './useSlideAnnotations';

/** Margines na dopisek, zeby tekst pisany przy krawedzi mial gdzie sie zawinac. */
const TEXT_MARGIN = 48;

function cursorFor(tool: string): string {
  if (tool === 'text') return 'text';
  if (tool === 'eraser') return 'pointer';
  return 'crosshair';
}

export function AnnotationLayer({ ann }: { ann: SlideAnnotations }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [draft, setDraft] = useState<AnnotationPoint[] | null>(null);
  const [textAt, setTextAt] = useState<AnnotationPoint | null>(null);
  const [textValue, setTextValue] = useState('');
  const erasingRef = useRef(false);

  // Fokus dopiero po zamontowaniu pola, a nie przez `autoFocus`: przegladarka w
  // ramach obslugi mousedown przenosi fokus na klikniety element (czyli z
  // powrotem na slajd), co natychmiast zamykalo swiezo otwarte pole.
  useEffect(() => {
    if (textAt) textRef.current?.focus();
  }, [textAt]);

  const drawing = ann.tool === 'pen' || ann.tool === 'marker';
  const active = ann.tool !== 'off';

  /** Punkt zdarzenia w pikselach kartki 1280x720 (SVG jest przeskalowany transformem). */
  function pointAt(e: { clientX: number; clientY: number }): AnnotationPoint | null {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return null;
    return {
      x: ((e.clientX - rect.left) / rect.width) * SLIDE_W,
      y: ((e.clientY - rect.top) / rect.height) * SLIDE_H,
    };
  }

  function commitText() {
    if (textAt) ann.addText(textAt.x, textAt.y, textValue);
    setTextAt(null);
    setTextValue('');
  }

  function onPointerDown(e: ReactPointerEvent) {
    e.stopPropagation();
    const p = pointAt(e);
    if (!p) return;
    if (ann.tool === 'eraser') {
      erasingRef.current = true;
      return;
    }
    if (ann.tool === 'text') {
      // Samo pole otwiera dopiero `onClick` (po domyslnej obsludze mousedown) -
      // tu blokujemy tylko przenoszenie fokusu na slajd.
      e.preventDefault();
      return;
    }
    if (!drawing) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDraft([p]);
  }

  function onTextClick(e: ReactPointerEvent | { clientX: number; clientY: number }) {
    const p = pointAt(e);
    if (!p) return;
    // Klik obok otwartego pola najpierw zatwierdza poprzedni dopisek.
    if (textAt) commitText();
    setTextAt({ x: Math.min(p.x, SLIDE_W - TEXT_MARGIN * 2), y: p.y });
    setTextValue('');
  }

  function onPointerMove(e: ReactPointerEvent) {
    if (!draft) return;
    const p = pointAt(e);
    if (!p) return;
    setDraft((prev) => (prev ? appendPoint(prev, p) : prev));
  }

  function endStroke() {
    erasingRef.current = false;
    if (!draft) return;
    ann.addStroke(draft);
    setDraft(null);
  }

  function eraseOnHover(id: string) {
    if (ann.tool === 'eraser' && erasingRef.current) ann.removeShape(id);
  }

  const strokes = ann.shapes.filter((s): s is StrokeShape => s.kind === 'stroke');
  const texts = ann.shapes.filter((s): s is TextShape => s.kind === 'text');

  return (
    <div
      className="absolute left-0 top-0 z-20"
      style={{ width: SLIDE_W, height: SLIDE_H, pointerEvents: active ? 'auto' : 'none' }}
      onClick={(e) => {
        // Klik w warstwe nie moze przewinac slajdu (nawigacja siedzi wyzej).
        if (active) e.stopPropagation();
      }}
    >
      <svg
        ref={svgRef}
        width={SLIDE_W}
        height={SLIDE_H}
        viewBox={`0 0 ${SLIDE_W} ${SLIDE_H}`}
        className="absolute left-0 top-0"
        style={{ pointerEvents: active ? 'auto' : 'none', cursor: cursorFor(ann.tool), touchAction: 'none' }}
        onClick={(e) => {
          if (ann.tool === 'text') onTextClick(e);
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endStroke}
        onPointerLeave={endStroke}
        onPointerCancel={endStroke}
      >
        {strokes.map((s) => (
          <g key={s.id}>
            <path
              d={strokePath(s.points)}
              fill="none"
              stroke={s.color}
              strokeWidth={s.width}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={s.marker ? 0.4 : 1}
              style={{ pointerEvents: 'none' }}
            />
            {ann.tool === 'eraser' && (
              <path
                d={strokePath(s.points)}
                fill="none"
                stroke="transparent"
                strokeWidth={Math.max(s.width, 32)}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ pointerEvents: 'stroke' }}
                onPointerDown={() => ann.removeShape(s.id)}
                onPointerEnter={() => eraseOnHover(s.id)}
              />
            )}
          </g>
        ))}

        {draft && (
          <path
            d={strokePath(draft)}
            fill="none"
            stroke={ann.color}
            strokeWidth={ann.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={ann.tool === 'marker' ? 0.4 : 1}
            style={{ pointerEvents: 'none' }}
          />
        )}
      </svg>

      {texts.map((t) => (
        <div
          key={t.id}
          className="absolute font-semibold leading-tight"
          style={{
            left: t.x,
            top: t.y,
            maxWidth: SLIDE_W - t.x - TEXT_MARGIN,
            color: t.color,
            fontSize: t.size,
            whiteSpace: 'pre-wrap',
            pointerEvents: ann.tool === 'eraser' ? 'auto' : 'none',
            cursor: ann.tool === 'eraser' ? 'pointer' : undefined,
          }}
          onPointerDown={() => ann.tool === 'eraser' && ann.removeShape(t.id)}
          onPointerEnter={() => eraseOnHover(t.id)}
        >
          {t.text}
        </div>
      ))}

      {textAt && (
        <textarea
          ref={textRef}
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          onPointerDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              commitText();
            } else if (e.key === 'Escape') {
              e.preventDefault();
              setTextAt(null);
              setTextValue('');
            }
          }}
          onBlur={commitText}
          placeholder="Wpisz tekst, Enter zatwierdza"
          className="absolute resize-none rounded-md border-2 border-dashed px-2 py-1 font-semibold leading-tight outline-none"
          style={{
            left: textAt.x,
            top: textAt.y,
            width: Math.min(700, SLIDE_W - textAt.x - TEXT_MARGIN),
            height: ann.textSize * 3,
            color: ann.color,
            borderColor: ann.color,
            // Neutralna przymglona podkladka - czytelna i na ciemnym slajdzie, i na jasnej notatce.
            background: 'rgba(128,128,128,0.25)',
            fontSize: ann.textSize,
          }}
        />
      )}
    </div>
  );
}
