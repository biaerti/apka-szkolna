// Panel z tresci biezacego pytania: nawigacja, przelacznik kolejnosci losowej,
// przycisk "pokaz odpowiedz". Uzywany na ekranie projektora (duzy tekst).
// Uklad wypelnia dostepna wysokosc (h-full flex-col) - bez wlasnego przewijania,
// zeby pasowac do ekranu bez scrolla.
//
// `prompt` to stale polecenie rundy, wazniejsze od wylosowanego pytania (lekcja
// zapoznawcza: "Przedstaw sie", a pytanie z kola jest tylko dodatkiem). Gdy jest
// ustawione, to ono dostaje najwiekszy font, a pytanie schodzi do ramki ponizej.

import { useEffect, useState } from 'react';
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
  showRandomControl?: boolean;
  showAnswer: boolean;
  onToggleShowAnswer: () => void;
  onUpdateQuestion?: (id: string, patch: Partial<Question>) => void;
  onShowOverview?: () => void;
  /** Numerki wszystkich pytan rundy: biezace podswietlone, zamkniete na zielono. */
  questions?: Question[];
  completedQuestionIds?: Set<string>;
  onJumpToQuestion?: (id: string) => void;
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
  showRandomControl = true,
  showAnswer,
  onToggleShowAnswer,
  onUpdateQuestion,
  onShowOverview,
  questions,
  completedQuestionIds,
  onJumpToQuestion,
}: QuestionPanelProps) {
  const [editing, setEditing] = useState(false);
  const [questionDraft, setQuestionDraft] = useState(question?.text ?? '');
  const [answerDraft, setAnswerDraft] = useState(question?.answer ?? '');

  useEffect(() => {
    setEditing(false);
    setQuestionDraft(question?.text ?? '');
    setAnswerDraft(question?.answer ?? '');
  }, [question?.id]);

  function saveQuestion() {
    const text = questionDraft.trim();
    if (!question || !text || !onUpdateQuestion) return;
    onUpdateQuestion(question.id, { text, answer: answerDraft.trim() || undefined });
    setEditing(false);
  }

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
        {questions && questions.length > 1 && onJumpToQuestion ? (
          <div className="flex items-center gap-1.5">
            {questions.map((q, i) => {
              const current = q.id === question?.id;
              const done = completedQuestionIds?.has(q.id);
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => onJumpToQuestion(q.id)}
                  aria-label={`Pytanie ${i + 1}`}
                  className={`h-9 w-9 rounded-lg text-lg font-bold tabular-nums ${
                    current
                      ? 'bg-accent-500 text-white ring-2 ring-accent-200'
                      : done
                        ? 'bg-emerald-900/60 text-emerald-300'
                        : 'border border-gray-600 text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        ) : (
          <span>
            pytanie {index + 1}/{total}
          </span>
        )}
        <div className="flex items-center gap-3">
          {onShowOverview && (
            <button
              type="button"
              onClick={onShowOverview}
              className="rounded-md border border-gray-600 px-2.5 py-1 text-gray-200 hover:bg-gray-800"
            >
              wszystkie pytania
            </button>
          )}
          {question && onUpdateQuestion && (
            <button
              type="button"
              onClick={() => setEditing((value) => !value)}
              className="rounded-md border border-gray-600 px-2.5 py-1 text-gray-200 hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {editing ? 'anuluj edycję' : 'edytuj pytanie'}
            </button>
          )}
          {showRandomControl && (
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={randomOrder}
                onChange={(e) => onToggleRandom(e.target.checked)}
                className="rounded border-gray-500"
              />
              losowo
            </label>
          )}
        </div>
      </div>

      {editing ? (
        <div className="flex min-h-0 flex-1 flex-col justify-center gap-3">
          <label className="text-sm font-medium text-gray-300">
            Pytanie
            <textarea
              value={questionDraft}
              onChange={(event) => setQuestionDraft(event.target.value)}
              rows={3}
              className="mt-1 block w-full resize-none rounded-lg border border-gray-600 bg-gray-950 px-4 py-3 text-2xl leading-snug text-white outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-500/30"
            />
          </label>
          <label className="text-sm font-medium text-gray-300">
            Odpowiedź
            <textarea
              value={answerDraft}
              onChange={(event) => setAnswerDraft(event.target.value)}
              rows={2}
              placeholder="Opcjonalnie"
              className="mt-1 block w-full resize-none rounded-lg border border-gray-600 bg-gray-950 px-4 py-3 text-xl leading-snug text-white outline-none placeholder:text-gray-500 focus:border-accent-400 focus:ring-2 focus:ring-accent-500/30"
            />
          </label>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-md border border-gray-600 px-4 py-2 text-gray-200 hover:bg-gray-800"
            >
              Anuluj
            </button>
            <button
              type="button"
              onClick={saveQuestion}
              disabled={!questionDraft.trim()}
              className="rounded-md bg-accent-600 px-4 py-2 font-semibold text-white hover:bg-accent-500 disabled:opacity-40"
            >
              Zapisz pytanie
            </button>
          </div>
        </div>
      ) : prompt ? (
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

      {!editing && question?.answer && (
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

      {!editing && <div className="mt-2 flex shrink-0 justify-between">
        <button
          type="button"
          onClick={onPrev}
          disabled={index <= 0}
          title="Poprzednie pytanie"
          aria-label="Poprzednie pytanie"
          className="rounded-md border border-gray-600 px-5 py-1 text-2xl leading-none text-gray-200 hover:bg-gray-800 disabled:opacity-40"
        >
          ←
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={index >= total - 1}
          title="Następne pytanie (N)"
          aria-label="Następne pytanie"
          className="rounded-md border border-gray-600 px-5 py-1 text-2xl leading-none text-gray-200 hover:bg-gray-800 disabled:opacity-40"
        >
          →
        </button>
      </div>}
    </div>
  );
}
