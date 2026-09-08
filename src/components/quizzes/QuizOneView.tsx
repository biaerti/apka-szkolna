// Widok projektora "po jednym": jedno pytanie na ekran, ogromne, z licznikiem
// "3/5" - do dyktowania pytan po kolei.

import { useMemo } from 'react';
import type { QuizQuestion } from '../../data/types';
import { SLIDE_W, fitFontSize } from '../slides/fitText';
import { useSlideFontScale } from '../slides/useSlideFontScale';
import { pointsLabel, questionPoints } from '../../lib/quiz';

export function QuizOneView({
  question,
  index,
  total,
  showAnswers,
}: {
  question: QuizQuestion;
  index: number;
  total: number;
  showAnswers: boolean;
}) {
  const scale = useSlideFontScale();
  const fontSize = useMemo(
    () => fitFontSize(question.text, { width: 1100, height: 420, min: 44, max: 104, scale, lineHeight: 1.3 }),
    [question.text, scale],
  );

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-[6vw] text-center text-gray-100">
      <p className="mb-[2vh] text-[2.2vw] font-medium text-accent-300">
        {index + 1} / {total}
        <span className="ml-[1vw] text-gray-500">{pointsLabel(questionPoints(question))}</span>
      </p>
      <p className="whitespace-pre-line" style={{ fontSize: `${(fontSize / SLIDE_W) * 100}vw`, lineHeight: 1.3 }}>
        {question.text}
      </p>
      {showAnswers && question.answer && (
        <p className="mt-[3vh] text-[2.6vw] text-emerald-300">Odp.: {question.answer}</p>
      )}
    </div>
  );
}
