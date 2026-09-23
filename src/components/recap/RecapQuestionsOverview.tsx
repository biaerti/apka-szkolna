import { useEffect, useState } from 'react';
import clsx from 'clsx';
import type { Question } from '../../data/types';
import { formatMmSs } from '../../lib/timer';
import { useCountdown } from '../slides/useCountdown';

const DEFAULT_THINKING_SECONDS = 120;

export function RecapQuestionsOverview({
  questions,
  completedQuestionIds,
  onSelect,
  onUpdate,
  onRemove,
  onFinish,
}: {
  questions: Question[];
  completedQuestionIds: Set<string>;
  onSelect: (questionId: string) => void;
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

  const allCompleted = questions.length > 0 && questions.every((question) => completedQuestionIds.has(question.id));

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden px-5 py-4">
      <div className="flex shrink-0 items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white">Odpowiedz na trzy pytania</h1>
          <p className="mt-1 text-xl text-gray-300">Każdy zapisuje odpowiedzi. W tym czasie sprawdzamy obecność.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => adjustTimer(-30)}
            disabled={timerSec <= 30}
            className="rounded-lg border border-gray-600 px-3 py-2 text-base font-semibold text-gray-200 hover:bg-gray-800 disabled:opacity-30"
          >
            -30 s
          </button>
          <button
            type="button"
            onClick={running ? pause : start}
            className={clsx(
              'min-w-[220px] rounded-xl px-5 py-2 font-mono text-[76px] font-bold leading-none tabular-nums focus-visible:outline focus-visible:outline-4 focus-visible:outline-white',
              finished ? 'bg-red-700 text-white' : 'bg-gray-900 text-accent-200 hover:bg-gray-800',
            )}
          >
            {formatMmSs(remainingSec)}
          </button>
          <button
            type="button"
            onClick={() => adjustTimer(30)}
            className="rounded-lg border border-gray-600 px-3 py-2 text-base font-semibold text-gray-200 hover:bg-gray-800"
          >
            +30 s
          </button>
          <button
            type="button"
            onClick={() => {
              reset();
              start();
            }}
            className="rounded-lg border border-gray-600 px-3 py-2 text-base text-gray-200 hover:bg-gray-800"
          >
            Od nowa
          </button>
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-3xl text-gray-400">Ten zestaw nie ma pytań.</div>
      ) : (
        <div className="grid min-h-0 flex-1 grid-cols-3 gap-4">
          {questions.map((question, index) => {
            const completed = completedQuestionIds.has(question.id);
            const editing = editingId === question.id;
            const showingAnswer = answerOpen.has(question.id);
            return (
              <section
                key={question.id}
                className={clsx(
                  'flex min-h-0 flex-col rounded-xl border p-4',
                  completed ? 'border-emerald-700 bg-emerald-950/30' : 'border-gray-700 bg-gray-900',
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xl font-bold text-accent-300">Pytanie {index + 1}</span>
                  {completed && <span className="text-base font-semibold text-emerald-300">Sprawdzone</span>}
                </div>

                {editing ? (
                  <div className="mt-3 flex min-h-0 flex-1 flex-col gap-3">
                    <label className="text-sm font-semibold text-gray-300">
                      Pytanie
                      <textarea
                        rows={4}
                        value={questionDraft}
                        onChange={(event) => setQuestionDraft(event.target.value)}
                        className="mt-1 block w-full resize-none rounded-lg border border-gray-600 bg-gray-950 px-3 py-2 text-xl text-white outline-none focus:border-accent-400"
                      />
                    </label>
                    <label className="text-sm font-semibold text-gray-300">
                      Odpowiedź
                      <textarea
                        rows={3}
                        value={answerDraft}
                        onChange={(event) => setAnswerDraft(event.target.value)}
                        className="mt-1 block w-full resize-none rounded-lg border border-gray-600 bg-gray-950 px-3 py-2 text-lg text-white outline-none focus:border-accent-400"
                      />
                    </label>
                    <div className="mt-auto flex justify-end gap-2">
                      <button type="button" onClick={() => setEditingId(null)} className="rounded-lg border border-gray-600 px-3 py-2 text-gray-200 hover:bg-gray-800">
                        Anuluj
                      </button>
                      <button type="button" onClick={() => save(question)} disabled={!questionDraft.trim()} className="rounded-lg bg-accent-600 px-4 py-2 font-semibold text-white hover:bg-accent-500 disabled:opacity-30">
                        Zapisz
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className={clsx('mt-4 flex-1 text-[clamp(22px,2vw,36px)] font-semibold leading-tight text-white', completed && 'line-through opacity-55')}>
                      {question.text}
                    </p>
                    {showingAnswer && question.answer && (
                      <p className="mt-3 rounded-lg bg-gray-800 px-3 py-2 text-lg leading-snug text-accent-200">{question.answer}</p>
                    )}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {question.answer && (
                        <button
                          type="button"
                          onClick={() => setAnswerOpen((current) => {
                            const next = new Set(current);
                            if (next.has(question.id)) next.delete(question.id);
                            else next.add(question.id);
                            return next;
                          })}
                          className="rounded-lg border border-gray-600 px-3 py-2 text-sm text-gray-200 hover:bg-gray-800"
                        >
                          {showingAnswer ? 'Ukryj odpowiedź' : 'Pokaż odpowiedź'}
                        </button>
                      )}
                      <button type="button" onClick={() => edit(question)} className="rounded-lg border border-gray-600 px-3 py-2 text-sm text-gray-200 hover:bg-gray-800">
                        Edytuj
                      </button>
                      {removeId === question.id ? (
                        <>
                          <button type="button" onClick={() => { onRemove(question.id); setRemoveId(null); }} className="rounded-lg bg-red-700 px-3 py-2 text-sm font-semibold text-white hover:bg-red-600">
                            Potwierdź usunięcie
                          </button>
                          <button type="button" onClick={() => setRemoveId(null)} className="rounded-lg border border-gray-600 px-3 py-2 text-sm text-gray-200 hover:bg-gray-800">
                            Anuluj
                          </button>
                        </>
                      ) : (
                        <button type="button" onClick={() => setRemoveId(question.id)} className="rounded-lg border border-red-800 px-3 py-2 text-sm text-red-300 hover:bg-red-950/50">
                          Usuń
                        </button>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => onSelect(question.id)}
                      disabled={completed}
                      className="mt-3 w-full rounded-lg bg-accent-600 px-4 py-3 text-xl font-bold text-white hover:bg-accent-500 disabled:bg-emerald-900 disabled:text-emerald-300"
                    >
                      {completed ? 'Pytanie sprawdzone' : 'Wybierz i kręć kołem'}
                    </button>
                  </>
                )}
              </section>
            );
          })}
        </div>
      )}

      {allCompleted && (
        <button type="button" onClick={onFinish} className="shrink-0 self-end rounded-xl bg-emerald-600 px-8 py-3 text-xl font-bold text-white hover:bg-emerald-500">
          Zakończ koło powtórzeniowe
        </button>
      )}
    </div>
  );
}
