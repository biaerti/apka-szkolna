// Stan rysowania na slajdach: narzedzie, kolor, grubosc i ksztalty per slajd.
//
// Stan siedzi na poziomie prezentacji (LessonPresent), a nie w samym slajdzie -
// dzieki temu przejscie na kolejny slajd i powrot pokazuje to, co bylo
// narysowane, a wybrany pisak nie resetuje sie co slajd. Nic z tego nie trafia
// do store'u ani do bazy: patrz komentarz w annotations.ts.

import { useCallback, useMemo, useState } from 'react';
import { newId } from '../../data/id';
import {
  ANNOTATION_COLORS,
  ANNOTATION_SIZES,
  strokeWidthFor,
  type AnnotationPoint,
  type AnnotationShape,
  type AnnotationTool,
} from './annotations';

export interface SlideAnnotations {
  tool: AnnotationTool;
  setTool: (tool: AnnotationTool) => void;
  /** Wlacza pioro, gdy nic nie jest wlaczone; wylacza wszystko, gdy cos jest (skrot R). */
  toggleDrawing: () => void;
  color: string;
  setColor: (color: string) => void;
  /** Indeks w ANNOTATION_SIZES. */
  sizeIndex: number;
  cycleSize: () => void;
  /** Grubosc kreski dla biezacego narzedzia, w pikselach kartki 1280x720. */
  strokeWidth: number;
  /** Wielkosc dopisku, w pikselach kartki. */
  textSize: number;
  /** Ksztalty narysowane na biezacym slajdzie. */
  shapes: AnnotationShape[];
  addStroke: (points: AnnotationPoint[]) => void;
  addText: (x: number, y: number, text: string) => void;
  removeShape: (id: string) => void;
  undo: () => void;
  clearSlide: () => void;
}

export function useSlideAnnotations(slideId: string | undefined): SlideAnnotations {
  const [tool, setTool] = useState<AnnotationTool>('off');
  const [color, setColor] = useState(ANNOTATION_COLORS[0].value);
  const [sizeIndex, setSizeIndex] = useState(1);
  const [bySlide, setBySlide] = useState<Record<string, AnnotationShape[]>>({});

  const size = ANNOTATION_SIZES[sizeIndex] ?? ANNOTATION_SIZES[1];
  const shapes = useMemo(() => (slideId ? bySlide[slideId] ?? [] : []), [bySlide, slideId]);

  const push = useCallback(
    (shape: AnnotationShape) => {
      if (!slideId) return;
      setBySlide((prev) => ({ ...prev, [slideId]: [...(prev[slideId] ?? []), shape] }));
    },
    [slideId],
  );

  const addStroke = useCallback(
    (points: AnnotationPoint[]) => {
      if (points.length === 0) return;
      push({
        id: newId(),
        kind: 'stroke',
        color,
        width: strokeWidthFor(tool, size.stroke),
        marker: tool === 'marker',
        points,
      });
    },
    [color, push, size.stroke, tool],
  );

  const addText = useCallback(
    (x: number, y: number, text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      push({ id: newId(), kind: 'text', color, size: size.text, x, y, text: trimmed });
    },
    [color, push, size.text],
  );

  const removeShape = useCallback(
    (id: string) => {
      if (!slideId) return;
      setBySlide((prev) => ({ ...prev, [slideId]: (prev[slideId] ?? []).filter((s) => s.id !== id) }));
    },
    [slideId],
  );

  const undo = useCallback(() => {
    if (!slideId) return;
    setBySlide((prev) => ({ ...prev, [slideId]: (prev[slideId] ?? []).slice(0, -1) }));
  }, [slideId]);

  const clearSlide = useCallback(() => {
    if (!slideId) return;
    setBySlide((prev) => ({ ...prev, [slideId]: [] }));
  }, [slideId]);

  const toggleDrawing = useCallback(() => {
    setTool((t) => (t === 'off' ? 'pen' : 'off'));
  }, []);

  const cycleSize = useCallback(() => {
    setSizeIndex((i) => (i + 1) % ANNOTATION_SIZES.length);
  }, []);

  return {
    tool,
    setTool,
    toggleDrawing,
    color,
    setColor,
    sizeIndex,
    cycleSize,
    strokeWidth: strokeWidthFor(tool, size.stroke),
    textSize: size.text,
    shapes,
    addStroke,
    addText,
    removeShape,
    undo,
    clearSlide,
  };
}
