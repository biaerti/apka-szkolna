// Stan przeciagania wierszy listy lekcji (HTML5 drag and drop): kto jest
// niesiony, nad ktorym wierszem i czy nad jego gorna czy dolna polowa.
// Wydzielone z Lessons.tsx, zeby strona miescila sie w limicie 250 linii.

import { useState } from 'react';
import type { Lesson } from '../../data/types';

export type DropPosition = 'above' | 'below';
type DropTarget = { index: number; position: DropPosition } | null;

export function useLessonDrag(gradeLessons: Lesson[], moveLesson: (id: string, toIndex: number) => void) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [drop, setDrop] = useState<DropTarget>(null);

  function reset() {
    setDragId(null);
    setDrop(null);
  }

  function finishDrop() {
    if (dragId && drop) {
      const from = gradeLessons.findIndex((l) => l.id === dragId);
      let to = drop.position === 'above' ? drop.index : drop.index + 1;
      if (from < to) to -= 1;
      moveLesson(dragId, to);
    }
    reset();
  }

  /** Wskaznik "tu upadnie" dla wiersza `index`; nad samym niesionym wierszem nic nie rysujemy. */
  function indicatorFor(index: number, lessonId: string): DropPosition | null {
    return drop && drop.index === index && dragId !== lessonId ? drop.position : null;
  }

  return {
    start: (id: string) => setDragId(id),
    over: (index: number, position: DropPosition) => setDrop({ index, position }),
    finishDrop,
    reset,
    indicatorFor,
  };
}
