// Panel z tresci biezacego pytania: nawigacja, przelacznik kolejnosci losowej,
// przycisk "pokaz odpowiedz". Uzywany na ekranie projektora (duzy tekst).
// Uklad wypelnia dostepna wysokosc (h-full flex-col) - bez wlasnego przewijania,
// zeby pasowac do ekranu bez scrolla.
//
// `prompt` to stale polecenie rundy, wazniejsze od wylosowanego pytania (lekcja
// zapoznawcza: "Przedstaw sie", a pytanie z kola jest tylko dodatkiem). Gdy jest
// ustawione, to ono dostaje najwiekszy font, a pytanie schodzi do ramki ponizej.

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

/**
 * Rozmiar pytania, gdy jest ono tylko DODATKIEM do polecenia rundy (`prompt`).
 * Musi zmiescic sie w ramce pod poleceniem, wiec dluzsze pytania schodza nizej -
 * inaczej ostatnia linia znikala za krawedzia ramki.
 */
function extraQuestionFontSize(text: string): string {
  const len = text.trim().length;
  if (len <= 40) return 'clamp(22px, 2.4vw, 44px)';
  if (len <= 80) return 'clamp(19px, 2vw, 34px)';
  return 'clamp(17px, 1.7vw, 28px)';
}

export interface QuestionPanelProps {
  question: Question | null;
  /** Stale polecenie rundy pokazywane NAD pytaniem (np. "Przedstaw sie"). */
  prompt?: string | null;
  /** Jedna linia doprecyzowania pod poleceniem (np. co dokladnie powiedziec). */
  promptHint?: string | null;
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
  prompt,
  promptHint,
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
    // Bez pytan wciaz jest co pokazac, jesli runda ma stale polecenie.
    if (!prompt) return <p className="text-2xl text-gray-400">Ten zestaw nie ma jeszcze pytań.</p>;
    return (
      <div className="flex h-full w-full flex-col justify-center rounded-xl border border-gray-700 bg-gray-900/70 p-3">
        <p className="font-bold leading-none text-white" style={{ fontSize: 'clamp(44px, 5.4vw, 112px)' }}>
          {prompt}
        </p>
        {promptHint && (
          <p className="mt-2 text-gray-400" style={{ fontSize: 'clamp(18px, 1.8vw, 34px)' }}>
            {promptHint}
          </p>
        )}
      </div>
    );
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

      {prompt ? (
        /* Polecenie u gory, pytanie z kola w ramce pod nim. Rozmiary sa
           mniejsze niz przy samym pytaniu, bo nad panelem stoi jeszcze ramka z
           nazwiskiem ucznia - przy wiekszych literach tekst uciekal poza panel. */
        <div className="flex min-h-0 flex-1 flex-col justify-center gap-3 overflow-hidden">
          <div className="shrink-0">
            <p className="font-bold leading-none text-white" style={{ fontSize: 'clamp(32px, 4vw, 76px)' }}>
              {prompt}
            </p>
            {promptHint && (
              <p className="mt-2 text-gray-400" style={{ fontSize: 'clamp(15px, 1.5vw, 28px)' }}>
                {promptHint}
              </p>
            )}
          </div>
          <div className="min-h-0 overflow-hidden rounded-lg border border-gray-700 bg-gray-800/60 px-4 py-3">
            <p className="mb-1 text-sm uppercase tracking-widest text-gray-400">dodatkowe pytanie</p>
            <p
              className="font-semibold leading-tight text-white"
              style={{ fontSize: extraQuestionFontSize(question?.text ?? '') }}
            >
              {question?.text ?? '-'}
            </p>
          </div>
        </div>
      ) : (
        <p
          className="flex min-h-0 flex-1 items-center overflow-hidden font-semibold leading-tight text-white"
          style={{ fontSize: questionFontSize(question?.text ?? '') }}
        >
          {question?.text ?? '-'}
        </p>
      )}

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
