// Warstwa rysowania NA slajdzie. Siedzi wewnatrz kartki 1280x720 ze SlideView,
// wiec skaluje sie razem z trescia - kreska narysowana na rzutniku zostaje w
// tym samym miejscu slajdu takze po zmianie rozdzielczosci albo pelnego ekranu.
//
// Kreski rysujemy w SVG (jeden <path> na pociagniecie), a dopiski jako zwykle
// diwy - HTML sam zawija tekst, czego <text> w SVG nie robi.

import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { SLIDE_H, SLIDE_W } from './fitText';
import {
  appendPoint,
  strokePath,
  type AnnotationPoint,
  type LineShape,
  type StrokeShape,
  type TextShape,
} from './annotations';
import { AnnotationTextBox } from './AnnotationTextBox';
import { AnnotationTexts, TEXT_MARGIN, textWidth } from './AnnotationTexts';
import type { SlideAnnotations } from './useSlideAnnotations';

/**
 * Otwarte pole tekstowe. `id` jest, gdy poprawiamy dopisek juz stojacy na
 * slajdzie (klikniety narzedziem "Tekst") - wtedy zatwierdzenie go zmienia,
 * a nie dodaje drugiego.
 */
interface TextDraft {
  id?: string;
  x: number;
  y: number;
  text: string;
  size: number;
  width: number;
  color: string;
}

function cursorFor(tool: string): string {
  if (tool === 'text') return 'text';
  if (tool === 'eraser') return 'pointer';
  return 'crosshair';
}

export function AnnotationLayer({ ann }: { ann: SlideAnnotations }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [draft, setDraft] = useState<AnnotationPoint[] | null>(null);
  const [text, setText] = useState<TextDraft | null>(null);
  const erasingRef = useRef(false);

  const drawing = ann.tool === 'pen' || ann.tool === 'marker' || ann.tool === 'line';
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

  /** Ile pikseli ekranu przypada na jeden piksel kartki - kartka jest przeskalowana transformem. */
  function slideScale(): number {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return 1;
    return rect.width / SLIDE_W;
  }

  function commitText() {
    if (text) {
      // Nastepny dopisek otwiera sie taki sam jak ten - patrz rememberTextBox.
      if (text.text.trim()) ann.rememberTextBox({ width: text.width, size: text.size });
      if (text.id && !text.text.trim()) ann.removeShape(text.id);
      else if (text.id) ann.updateText(text.id, { text: text.text.trim(), size: text.size, width: text.width, x: text.x, y: text.y, color: text.color });
      else ann.addText({ x: text.x, y: text.y, text: text.text, size: text.size, width: text.width });
    }
    setText(null);
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
    if (text) commitText();
    const x = Math.min(p.x, SLIDE_W - TEXT_MARGIN * 2);
    setText({
      x,
      y: p.y,
      text: '',
      size: ann.textSize,
      width: Math.min(ann.textBoxWidth, SLIDE_W - x - TEXT_MARGIN),
      color: ann.color,
    });
  }

  /** Klik w gotowy dopisek narzedziem "Tekst" - poprawiamy tresc albo wielkosc. */
  function editText(shape: TextShape) {
    if (text) commitText();
    setText({ id: shape.id, x: shape.x, y: shape.y, text: shape.text, size: shape.size, width: textWidth(shape), color: shape.color });
  }

  function onPointerMove(e: ReactPointerEvent) {
    if (!draft) return;
    const p = pointAt(e);
    if (!p) return;
    setDraft((prev) => {
      if (!prev) return prev;
      if (ann.tool === 'line') return [prev[0], p];
      return appendPoint(prev, p);
    });
  }

  function endStroke() {
    erasingRef.current = false;
    if (!draft) return;
    if (ann.tool === 'line' && draft.length > 1) ann.addLine(draft[0], draft[draft.length - 1]);
    else ann.addStroke(draft);
    setDraft(null);
  }

  function eraseOnHover(id: string) {
    if (ann.tool === 'eraser' && erasingRef.current) ann.removeShape(id);
  }

  const strokes = ann.shapes.filter((s): s is StrokeShape => s.kind === 'stroke');
  const lines = ann.shapes.filter((s): s is LineShape => s.kind === 'line');
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

        {lines.map((line) => (
          <g key={line.id}>
            <line
              x1={line.start.x}
              y1={line.start.y}
              x2={line.end.x}
              y2={line.end.y}
              stroke={line.color}
              strokeWidth={line.width}
              strokeLinecap="round"
              style={{ pointerEvents: 'none' }}
            />
            {ann.tool === 'eraser' && (
              <line
                x1={line.start.x}
                y1={line.start.y}
                x2={line.end.x}
                y2={line.end.y}
                stroke="transparent"
                strokeWidth={Math.max(line.width, 32)}
                strokeLinecap="round"
                style={{ pointerEvents: 'stroke' }}
                onPointerDown={() => ann.removeShape(line.id)}
                onPointerEnter={() => eraseOnHover(line.id)}
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

      <AnnotationTexts
        texts={texts}
        tool={ann.tool}
        hiddenId={text?.id}
        onErase={ann.removeShape}
        onEraseHover={eraseOnHover}
        onEdit={editText}
      />

      {text && (
        <AnnotationTextBox
          x={text.x}
          y={text.y}
          value={text.text}
          color={text.color}
          size={text.size}
          width={text.width}
          maxWidth={SLIDE_W - text.x - TEXT_MARGIN}
          scale={slideScale()}
          onValue={(value) => setText((cur) => (cur ? { ...cur, text: value } : cur))}
          onSize={(next) => setText((cur) => (cur ? { ...cur, ...next } : cur))}
          onMove={(next) =>
            setText((cur) =>
              cur
                ? {
                    ...cur,
                    x: Math.max(TEXT_MARGIN, Math.min(SLIDE_W - cur.width - TEXT_MARGIN, next.x)),
                    y: Math.max(TEXT_MARGIN, Math.min(SLIDE_H - cur.size * 2 - TEXT_MARGIN, next.y)),
                  }
                : cur,
            )
          }
          onCommit={commitText}
          onCancel={() => setText(null)}
          onDelete={() => {
            // Kosz w pasku pola: wyrzuca dopisek razem z tym, co juz na slajdzie
            // stalo (pole otwiera sie tez klikiem w gotowy dopisek).
            if (text.id) ann.removeShape(text.id);
            setText(null);
          }}
        />
      )}

    </div>
  );
}
