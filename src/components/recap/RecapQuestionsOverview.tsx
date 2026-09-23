// Ekran startowy kola powtorzeniowego: trzy pytania pod soba (duze, czytelne z
// konca sali), obok stoper na samodzielne zapisanie odpowiedzi - w tym czasie
// nauczyciel sprawdza obecnosc. Do kola prowadzi jeden przycisk, bo i tak
// wszystkie pytania ida przez to samo kolo; kolejne pytanie to N na kole.

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import type { Question } from '../../data/types';
import { formatMmSs } from '../../lib/timer';
import { useCountdown } from '../slides/useCountdown';

const DEFAULT_THINKING_SECONDS = 120;

/** Dluzsze pytania schodza nizej, zeby trzy zmiescily sie pod soba bez przewijania. */
function overviewFontSize(text: string): string {
  const len = text.trim().length;
  if (len <= 45) return 'clamp(30px, 3.4vw, 64px)';
  if (len <= 90) return 'clamp(26px, 2.8vw, 52px)';
  return 'clamp(22px, 2.2vw, 40px)';
}

export function RecapQuestionsOverview({
  questions,
  completedQuestionIds,
  onStart,
  onUpdate,
  onRemove,
  onFinish,
}: {
  questions: Question[];
  completedQuestionIds: Set<string>;
  onStart: () => void;
  onUpdate: (id: string, patch: Partial<Question>) => void;
  onRemove: (id: string) => void;
  onFinish: () => void;
}) {
  const [timerSec, setTimerSec] = useState(DEFAULT_THINKING_SECONDS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [questionDraft, setQuestionDraft] = useState('');
  const [answerDraft, setAnswerDraft] = useState('');
  const [answerOpen, setAnswerOpen] = useState<Set<string>>(new Set());
  const [removeId, setRemoveId] = useState<string | null>(null);
  const { remainingSec, running, finished, start, pause, reset } = useCountdown(timerSec);

  useEffect(() => {
    start();
    // Pierwsze pokazanie trzech pytan od razu uruchamia czas na samodzielna prace.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Enter albo Spacja = przejdz do kola (poza edycja pytania).
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(target.tagName)) return;
      if (editingId || questions.length === 0) return;
      if (e.key === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        onStart();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [editingId, questions.length, onStart]);

  function edit(question: Question) {
    setEditingId(question.id);
    setQuestionDraft(question.text);
    setAnswerDraft(question.answer ?? '');
    setRemoveId(null);
  }

  function save(question: Question) {
    const text = questionDraft.trim();
    if (!text) return;
    onUpdate(question.id, { text, answer: answerDraft.trim() || undefined });
    setEditingId(null);
  }

  function adjustTimer(delta: number) {
    setTimerSec((value) => Math.max(30, value + delta));
  }

  function toggleAnswer(id: string) {
    setAnswerOpen((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const allCompleted = questions.length > 0 && questions.every((question) => completedQuestionIds.has(question.id));
  const smallButton = 'rounded-lg border border-gray-700 px-3 py-1.5 text-sm text-gray-400 hover:bg-gray-800 hover:text-gray-200';

  return (
    // pt-14: w prezentacji lewy gorny rog zajmuje zegar lekcji.
    <div className="flex min-h-0 flex-1 gap-6 overflow-hidden px-6 pb-5 pt-14">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4">
        <div className="shrink-0">
          <h1 className="text-4xl font-bold text-white">Odpowiedz na trzy pytania</h1>
          <p className="mt-1 text-xl text-gray-300">Każdy zapisuje odpowiedzi. W tym czasie sprawdzamy obecność.</p>
        </div>

        {questions.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-3xl text-gray-400">Ten zestaw nie ma pytań.</div>
        ) : (
          <ol className="flex min-h-0 flex-1 flex-col gap-3">
            {questions.map((question, index) => {
              const completed = completedQuestionIds.has(question.id);
              const editing = editingId === question.id;
              return (
                <li
                  key={question.id}
                  className={clsx(
                    'flex min-h-0 flex-1 items-center gap-5 rounded-xl border px-5 py-3',
                    completed ? 'border-emerald-800 bg-emerald-950/30' : 'border-gray-800 bg-gray-900',
                  )}
                >
                  <span
                    className={clsx(
                      'shrink-0 font-bold leading-none tabular-nums',
                      completed ? 'text-emerald-400' : 'text-accent-300',
                    )}
                    style={{ fontSize: 'clamp(40px, 4vw, 76px)' }}
                  >
                    {index + 1}
                  </span>

                  {editing ? (
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <textarea
                        rows={2}
                        value={questionDraft}
                        onChange={(event) => setQuestionDraft(event.target.value)}
                        aria-label="Pytanie"
                        className="block w-full resize-none rounded-lg border border-gray-600 bg-gray-950 px-3 py-2 text-2xl text-white outline-none focus:border-accent-400"
                      />
                      <textarea
                        rows={1}
                        value={answerDraft}
                        onChange={(event) => setAnswerDraft(event.target.value)}
                        placeholder="Odpowiedź (opcjonalnie)"
                        aria-label="Odpowiedź"
                        className="block w-full resize-none rounded-lg border border-gray-600 bg-gray-950 px-3 py-2 text-lg text-white outline-none placeholder:text-gray-500 focus:border-accent-400"
                      />
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setEditingId(null)} className="rounded-lg border border-gray-600 px-3 py-1.5 text-gray-200 hover:bg-gray-800">
                          Anuluj
                        </button>
                        <button type="button" onClick={() => save(question)} disabled={!questionDraft.trim()} className="rounded-lg bg-accent-600 px-4 py-1.5 font-semibold text-white hover:bg-accent-500 disabled:opacity-30">
                          Zapisz
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex min-w-0 flex-1 flex-col justify-center overflow-hidden">
                      <p
                        className={clsx('font-semibold leading-tight text-white', completed && 'line-through opacity-55')}
                        style={{ fontSize: overviewFontSize(question.text) }}
                      >
                        {question.text}
                      </p>
                      {answerOpen.has(question.id) && question.answer && (
                        <p className="mt-2 text-xl leading-snug text-accent-200">{question.answer}</p>
                      )}
                    </div>
                  )}

                  {!editing && (
                    <div className="flex shrink-0 flex-col items-end justify-center gap-1.5">
                      {question.answer && (
                        <button type="button" onClick={() => toggleAnswer(question.id)} className={smallButton}>
                          {answerOpen.has(question.id) ? 'ukryj odpowiedź' : 'odpowiedź'}
                        </button>
                      )}
                      <button type="button" onClick={() => edit(question)} className={smallButton}>
                        edytuj
                      </button>
                      {removeId === question.id ? (
                        <span className="flex gap-1.5">
                          <button type="button" onClick={() => setRemoveId(null)} className={smallButton}>
                            nie
                          </button>
                          <button type="button" onClick={() => { onRemove(question.id); setRemoveId(null); }} className="rounded-lg bg-red-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-600">
                            usuń
                          </button>
                        </span>
                      ) : (
                        <button type="button" onClick={() => setRemoveId(question.id)} className={smallButton}>
                          usuń
                        </button>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        )}
      </div>

      <div className="flex w-[clamp(300px,26vw,440px)] shrink-0 flex-col gap-4">
        <button
          type="button"
          onClick={running ? pause : start}
          title={running ? 'Zatrzymaj' : 'Wznów'}
          className={clsx(
            'w-full rounded-2xl py-6 font-mono font-bold leading-none tabular-nums focus-visible:outline focus-visible:outline-4 focus-visible:outline-white',
            finished ? 'bg-red-700 text-white' : running ? 'bg-gray-900 text-accent-200 hover:bg-gray-800' : 'bg-gray-900 text-gray-500 hover:bg-gray-800',
          )}
          style={{ fontSize: 'clamp(72px, 8vw, 150px)' }}
        >
          {formatMmSs(remainingSec)}
        </button>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => adjustTimer(-30)}
            disabled={timerSec <= 30}
            className="rounded-lg border border-gray-600 py-2 text-lg font-semibold text-gray-200 hover:bg-gray-800 disabled:opacity-30"
          >
            -30 s
          </button>
          <button
            type="button"
            onClick={() => adjustTimer(30)}
            className="rounded-lg border border-gray-600 py-2 text-lg font-semibold text-gray-200 hover:bg-gray-800"
          >
            +30 s
          </button>
          <button
            type="button"
            onClick={() => {
              reset();
              start();
            }}
            className="rounded-lg border border-gray-600 py-2 text-lg text-gray-200 hover:bg-gray-800"
          >
            od nowa
          </button>
        </div>

        <div className="flex-1" />

        {allCompleted ? (
          <button type="button" onClick={onFinish} className="rounded-2xl bg-emerald-600 px-6 py-8 text-3xl font-bold text-white hover:bg-emerald-500">
            Zakończ koło
          </button>
        ) : (
          <button
            type="button"
            onClick={onStart}
            disabled={questions.length === 0}
            className="rounded-2xl bg-accent-600 px-6 py-8 text-4xl font-bold text-white hover:bg-accent-500 disabled:opacity-40"
          >
            Przejdź do koła
            <span className="mt-1 block text-base font-normal opacity-75">Enter</span>
          </button>
        )}
      </div>
    </div>
  );
}
