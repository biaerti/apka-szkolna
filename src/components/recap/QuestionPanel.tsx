// Panel z tresci biezacego pytania: nawigacja, przelacznik kolejnosci losowej,
// przycisk "pokaz odpowiedz". Uzywany na ekranie projektora (duzy tekst).
// Uklad wypelnia dostepna wysokosc (h-full flex-col) - bez wlasnego przewijania,
// zeby pasowac do ekranu bez scrolla.

import type { Question } from '../../data/types';

/**
 * Rozmiar pytania dobrany do jego dlugosci: krotkie pytania maja byc OGROMNE
 * (czytelne z ostatniej lawki), dluzsze schodza w dol tylko na tyle, zeby
 * zmiescic sie w panelu bez przewijania. Wczesniej wszystko mialo sztywne
 * maks. 44px i na projektorze ginelo w pustym ekranie.
 */
export function questionFontSize(text: string): string {
  const len = text.trim().length;
  if (len <= 40) return 'clamp(44px, 5.2vw, 104px)';
  if (len <= 80) return 'clamp(40px, 4.2vw, 84px)';
  if (len <= 140) return 'clamp(34px, 3.4vw, 64px)';
  return 'clamp(28px, 2.6vw, 48px)';
}

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
    return <p className="text-2xl text-gray-400">Ten zestaw nie ma jeszcze pytań.</p>;
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-gray-700 bg-gray-900/70 p-3">
      <div className="mb-2 flex shrink-0 items-center justify-between text-sm text-gray-400">
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
        className="flex min-h-0 flex-1 items-center overflow-hidden font-semibold leading-tight text-white"
        style={{ fontSize: questionFontSize(question?.text ?? '') }}
      >
        {question?.text ?? '-'}
      </p>

      {question?.answer && (
        <div className="mt-2 shrink-0">
          {showAnswer && (
            <p
              className="mb-1.5 rounded-md bg-gray-800 px-3 py-2 font-medium text-accent-200"
              style={{ fontSize: 'clamp(22px, 2.2vw, 44px)' }}
            >
              {question.answer}
            </p>
          )}
          <button
            type="button"
            onClick={onToggleShowAnswer}
            className="rounded-md border border-gray-600 px-3 py-1.5 text-base text-gray-300 hover:bg-gray-800"
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
          className="rounded-md border border-gray-600 px-4 py-1.5 text-base text-gray-200 hover:bg-gray-800 disabled:opacity-40"
        >
          poprzednie pytanie
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={index >= total - 1}
          className="rounded-md border border-gray-600 px-4 py-1.5 text-base text-gray-200 hover:bg-gray-800 disabled:opacity-40"
        >
          następne pytanie (N)
        </button>
      </div>
    </div>
  );
}
