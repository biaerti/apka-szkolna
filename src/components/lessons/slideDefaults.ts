// Fabryka domyslnych wartosci dla nowych slajdow + pomocnicze etykiety.

import { newId } from '../../data/id';
import type { Slide } from '../../data/types';

export type SlideKind = Slide['kind'];

export const SLIDE_KIND_LABELS: Record<SlideKind, string> = {
  title: 'Tytuł',
  text: 'Tekst',
  task: 'Zadanie',
  recap: 'Powtórka',
  image: 'Obraz',
};

export function slideSummary(slide: Slide): string {
  switch (slide.kind) {
    case 'title':
      return slide.title || '(bez tytułu)';
    case 'text':
      return slide.title || slide.body.slice(0, 60) || '(pusty tekst)';
    case 'task':
      return `${slide.code}${slide.title ? ' - ' + slide.title : ''}`;
    case 'recap':
      return 'Powtórka';
    case 'image':
      return slide.caption || slide.url || '(bez obrazu)';
    default:
      return '';
  }
}

/** Proponuje kolejny kod zadania na podstawie istniejacych slajdow "task", np. Z1, Z2, Z3. */
export function suggestNextTaskCode(slides: Slide[]): string {
  let max = 0;
  for (const s of slides) {
    if (s.kind !== 'task') continue;
    const match = /^Z(\d+)$/i.exec(s.code.trim());
    if (match) max = Math.max(max, parseInt(match[1], 10));
  }
  return `Z${max + 1}`;
}

export function createSlide(kind: SlideKind, existingSlides: Slide[]): Slide {
  const id = newId();
  switch (kind) {
    case 'title':
      return { id, kind: 'title', title: '' };
    case 'text':
      return { id, kind: 'text', title: '', body: '' };
    case 'task':
      return { id, kind: 'task', code: suggestNextTaskCode(existingSlides), title: '', body: '' };
    case 'recap':
      return { id, kind: 'recap', questionSetId: '' };
    case 'image':
      return { id, kind: 'image', url: '', caption: '' };
    default:
      throw new Error(`Nieznany typ slajdu: ${kind}`);
  }
}

export function duplicateSlide(slide: Slide): Slide {
  return { ...slide, id: newId() };
}
