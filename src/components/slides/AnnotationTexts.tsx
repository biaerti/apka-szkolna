// Gotowe dopiski lezace na slajdzie (bez tego, ktory jest wlasnie edytowany -
// na jego miejscu stoi pole z AnnotationTextBox).
//
// Rysujemy je jako zwykle diwy, a nie <text> w SVG: HTML sam zawija tekst.
// Wydzielone z AnnotationLayer.tsx, zeby ta zmiescila sie w limicie 250 linii.

import type { AnnotationTool, TextShape } from './annotations';
import { TEXT_BOX_WIDTH } from './annotations';
import { SLIDE_W } from './fitText';

/** Margines na dopisek, zeby tekst pisany przy krawedzi mial gdzie sie zawinac. */
export const TEXT_MARGIN = 48;

/** Szerokosc dopisku: wlasna (po skalowaniu uchwytem) albo domyslna, przycieta do kartki. */
export function textWidth(shape: TextShape): number {
  const available = SLIDE_W - shape.x - TEXT_MARGIN;
  return Math.min(available, shape.width ?? TEXT_BOX_WIDTH);
}

export interface AnnotationTextsProps {
  texts: TextShape[];
  tool: AnnotationTool;
  /** Dopisek chwilowo ukryty, bo jest otwarty do poprawki. */
  hiddenId?: string;
  onErase: (id: string) => void;
  onEraseHover: (id: string) => void;
  onEdit: (shape: TextShape) => void;
}

export function AnnotationTexts({ texts, tool, hiddenId, onErase, onEraseHover, onEdit }: AnnotationTextsProps) {
  const clickable = tool === 'eraser' || tool === 'text';

  return (
    <>
      {texts.map((t) =>
        t.id === hiddenId ? null : (
          <div
            key={t.id}
            className="absolute font-semibold leading-tight"
            style={{
              left: t.x,
              top: t.y,
              width: textWidth(t),
              color: t.color,
              fontSize: t.size,
              whiteSpace: 'pre-wrap',
              pointerEvents: clickable ? 'auto' : 'none',
              cursor: tool === 'eraser' ? 'pointer' : tool === 'text' ? 'text' : undefined,
            }}
            onPointerDown={(e) => {
              if (tool === 'eraser') onErase(t.id);
              // Klik w gotowy dopisek narzedziem "Tekst" otwiera go z powrotem -
              // razem z uchwytem wielkosci, wiec da sie go potem powiekszyc albo zmniejszyc.
              else if (tool === 'text') {
                e.stopPropagation();
                e.preventDefault();
                onEdit(t);
              }
            }}
            onPointerEnter={() => onEraseHover(t.id)}
          >
            {t.text}
          </div>
        ),
      )}
    </>
  );
}
