// Panel z tresci biezacego pytania: nawigacja, przelacznik kolejnosci losowej,
// przycisk "pokaz odpowiedz". Uzywany na ekranie projektora (duzy tekst).
// Uklad wypelnia dostepna wysokosc (h-full flex-col) - bez wlasnego przewijania,
// zeby pasowac do ekranu bez scrolla.

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
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-gray-700 bg-gray-900/70 p-3">
      <div className="mb-2 flex shrink-0 items-center justify-between text-xs text-gray-400">
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

      <p
        className="min-h-0 flex-1 overflow-hidden font-semibold leading-tight text-white"
        style={{ fontSize: 'clamp(36px, 3.2vw, 44px)' }}
      >
        {question?.text ?? '-'}
      </p>

      {question?.answer && (
        <div className="mt-2 shrink-0">
          {showAnswer && (
            <p className="mb-1.5 rounded-md bg-gray-800 px-3 py-2 text-xl text-accent-200">{question.answer}</p>
          )}
          <button
            type="button"
            onClick={onToggleShowAnswer}
            className="rounded-md border border-gray-600 px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-800"
          >
            {showAnswer ? 'ukryj odpowiedź (O)' : 'pokaż odpowiedź (O)'}
          </button>
        </div>
      )}

      <div className="mt-2 flex shrink-0 justify-between">
        <button
          type="button"
          onClick={onPrev}
          disabled={index <= 0}
          className="rounded-md border border-gray-600 px-4 py-1.5 text-sm text-gray-200 hover:bg-gray-800 disabled:opacity-40"
        >
          poprzednie pytanie
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={index >= total - 1}
          className="rounded-md border border-gray-600 px-4 py-1.5 text-sm text-gray-200 hover:bg-gray-800 disabled:opacity-40"
        >
          następne pytanie (N)
        </button>
      </div>
    </div>
  );
}
