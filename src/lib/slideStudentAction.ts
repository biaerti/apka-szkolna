// Plakietka "co robi uczen" (Do zeszytu / Ustnie / ...) na slajdach zadan,
// ramek i tekstu. Nauczyciel moze ja przestawic w prezentacji jednym klikiem,
// gdy na lekcji zmieni zdanie ("jednak robimy to w zeszycie"). Taki wybor
// dostaje flage studentActionManual i przezywa automatyczne odswiezenie
// lekcji z kodu (keepManualStudentActions w useReadyMaterials.applyRefresh).

import type { Slide, StudentAction } from '../data/types';

export const STUDENT_ACTION_OPTIONS: Array<{ action: StudentAction; text: string }> = [
  { action: 'write-answer', text: 'Do zeszytu' },
  { action: 'oral', text: 'Ustnie' },
  { action: 'textbook', text: 'W podręczniku' },
  { action: 'copy', text: 'Przepisz' },
  { action: 'look', text: 'Patrz' },
];

type WithStudentAction = Extract<Slide, { kind: 'image' | 'task' | 'text' }>;

export function hasStudentAction(slide: Slide): slide is WithStudentAction {
  return slide.kind === 'image' || slide.kind === 'task' || slide.kind === 'text';
}

/** Ten sam slajd w starej i nowej wersji lekcji - id sie zmieniaja, kod/obraz nie. */
function slideKey(slide: WithStudentAction): string {
  if (slide.kind === 'image') return `image|${slide.code ?? slide.url}`;
  if (slide.kind === 'task') return `task|${slide.code}`;
  return `text|${slide.title ?? slide.body}`;
}

export function withStudentAction(slide: Slide, action: StudentAction, text: string): Slide {
  if (!hasStudentAction(slide)) return slide;
  return { ...slide, studentAction: action, studentActionText: text, studentActionManual: true };
}

/** Przenosi recznie ustawione plakietki ze starych slajdow na nowe (z kodu). */
export function keepManualStudentActions(fresh: Slide[], old: Slide[]): Slide[] {
  const manual = new Map<string, WithStudentAction>();
  for (const s of old) if (hasStudentAction(s) && s.studentActionManual) manual.set(slideKey(s), s);
  if (manual.size === 0) return fresh;
  return fresh.map((s) => {
    if (!hasStudentAction(s)) return s;
    const kept = manual.get(slideKey(s));
    return kept?.studentAction ? withStudentAction(s, kept.studentAction, kept.studentActionText ?? '') : s;
  });
}
