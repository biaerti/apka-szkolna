// Widok projektora "wszystkie": numerowana lista wszystkich pytan na jednym
// ekranie. Rozmiar czcionki dobieramy do lacznej dlugosci tekstu na "kartce"
// 1280x720 (fitFontSize) i przeliczamy na vw, zeby na rzutniku 1920 wszystko
// bylo proporcjonalnie wieksze - dzieci maja przepisac pytania z ostatniej
// lawki, wiec liczy sie kazdy piksel.

import { useMemo } from 'react';
import type { QuizQuestion } from '../../data/types';
import { SLIDE_W, fitFontSize } from '../slides/fitText';

export function QuizAllView({ questions, showAnswers }: { questions: QuizQuestion[]; showAnswers: boolean }) {
  const fontSize = useMemo(() => {
    const text = questions
      .map((q) => `${q.text}${showAnswers && q.answer ? ` (${q.answer})` : ''}`)
      .join('\n');
    // Szerokosc kolumny bez numeracji i marginesow; wysokosc bez naglowka i stopki.
    return fitFontSize(text, { width: 1120, height: 560, min: 20, max: 64, lineHeight: 1.45 });
  }, [questions, showAnswers]);

  return (
    <ol
      className="mx-auto flex w-full max-w-[92vw] flex-1 flex-col justify-center text-gray-100"
      style={{ fontSize: `${(fontSize / SLIDE_W) * 100}vw`, lineHeight: 1.45 }}
    >
      {questions.map((q, idx) => (
        <li key={q.id} className="flex gap-[0.6em] py-[0.18em]">
          <span className="w-[1.6em] shrink-0 text-right font-semibold text-accent-300">{idx + 1}.</span>
          <span className="min-w-0 flex-1">
            {q.text}
            {showAnswers && q.answer && <span className="text-[0.75em] text-emerald-300"> ({q.answer})</span>}
          </span>
        </li>
      ))}
    </ol>
  );
}
