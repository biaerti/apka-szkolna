// Panel z tresci biezacego pytania: nawigacja, przelacznik kolejnosci losowej,
// przycisk "pokaz odpowiedz". Uzywany na ekranie projektora (duzy tekst).

import type { Question } from '../../data/types';

export interface QuestionPanelProps {
  question: Question | null;
  index: number;
  total: number;
  onNext: () => void;
  onPrev: () => void;
  randomOrder: boolean;
  onToggleRandom: (value: boolean) => void;
  showAnswer: boolean;
  onToggleShowAnswer: () => void;
}

export function QuestionPanel({
  question,
  index,
  total,
  onNext,
  onPrev,
  randomOrder,
  onToggleRandom,
  showAnswer,
  onToggleShowAnswer,
}: QuestionPanelProps) {
  if (total === 0) {
    return <p className="text-lg text-gray-400">Ten zestaw nie ma jeszcze pytań.</p>;
  }

  return (
    <div className="w-full max-w-3xl rounded-xl border border-gray-700 bg-gray-900/70 p-6">
      <div className="mb-3 flex items-center justify-between text-sm text-gray-400">
        <span>
          pytanie {index + 1}/{total}
        </span>
        <label className="flex items-center gap-1.5">
          <input
            type="checkbox"
            checked={randomOrder}
            onChange={(e) => onToggleRandom(e.target.checked)}
            className="rounded border-gray-500"
          />
          losowo
        </label>
      </div>

      <p className="min-h-[3.5rem] text-[40px] font-semibold leading-tight text-white">
        {question?.text ?? '-'}
      </p>

      {question?.answer && (
        <div className="mt-4">
          {showAnswer ? (
            <p className="rounded-md bg-gray-800 px-4 py-3 text-2xl text-accent-200">{question.answer}</p>
          ) : (
            <button
              type="button"
              onClick={onToggleShowAnswer}
              className="rounded-md border border-gray-600 px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-800"
            >
              pokaż odpowiedź (O)
            </button>
          )}
        </div>
      )}

      <div className="mt-5 flex justify-between">
        <button
          type="button"
          onClick={onPrev}
          disabled={index <= 0}
          className="rounded-md border border-gray-600 px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 disabled:opacity-40"
        >
          poprzednie pytanie
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={index >= total - 1}
          className="rounded-md border border-gray-600 px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 disabled:opacity-40"
        >
          następne pytanie (N)
        </button>
      </div>
    </div>
  );
}
