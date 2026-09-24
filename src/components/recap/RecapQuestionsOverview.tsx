// Ekran startowy kola powtorzeniowego: pytania rundy pod soba (zwykle trzy, po filmiku cztery) (duze, czytelne z
// konca sali), obok stoper na samodzielne zapisanie odpowiedzi - w tym czasie
// nauczyciel sprawdza obecnosc. Do kola prowadzi jeden przycisk, bo i tak
// wszystkie pytania ida przez to samo kolo; kolejne pytanie to N na kole.

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import type { Question } from '../../data/types';
import { formatMmSs } from '../../lib/timer';
import { useCountdown } from '../slides/useCountdown';

const DEFAULT_THINKING_SECONDS = 120;

function pytaniaWord(n: number): string {
  if (n === 1) return 'pytanie';
  const last = n % 10;
  const lastTwo = n % 100;
  return last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14) ? 'pytania' : 'pytań';
}

const LICZBY = ['', 'jedno', 'dwa', 'trzy', 'cztery', 'pięć', 'sześć'];

/** Male ikonki akcji przy pytaniu - zamiast slow "odpowiedz / edytuj / usun". */
function IconButton({ label, onClick, danger, active, children }: { label: string; onClick: () => void; danger?: boolean; active?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={clsx(
        'flex h-10 w-10 items-center justify-center rounded-lg border',
        danger ? 'border-red-700 bg-red-700 text-white hover:bg-red-600' : active ? 'border-accent-400 bg-accent-900/50 text-accent-200' : 'border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-gray-200',
      )}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {children}
      </svg>
    </button>
  );
}

/** Dluzsze pytania schodza nizej, zeby wszystkie zmiescily sie pod soba bez przewijania. */
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
  onAdd,
  onFinish,
  afterVideo = false,
}: {
  questions: Question[];
  completedQuestionIds: Set<string>;
  onStart: () => void;
  onUpdate: (id: string, patch: Partial<Question>) => void;
  onRemove: (id: string) => void;
  /** Plus pod lista: nauczyciel dopisuje wlasne pytanie (i odpowiedz) do zestawu. */
  onAdd?: (text: string, answer?: string) => void;
  onFinish: () => void;
  /** Pytania z filmiku - juz zapisane, wiec stoper stoi na 00:00 i nie rusza sam. */
  afterVideo?: boolean;
}) {
  const [timerSec, setTimerSec] = useState(DEFAULT_THINKING_SECONDS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [questionDraft, setQuestionDraft] = useState('');
  const [answerDraft, setAnswerDraft] = useState('');
  const [answerOpen, setAnswerOpen] = useState<Set<string>>(new Set());
  const [removeId, setRemoveId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const { remainingSec, running, finished, start, pause, reset } = useCountdown(timerSec);

  // Po filmiku stoper nie jest czasem na prace - pokazuje 00:00, dopoki
  // nauczyciel sam go nie wlaczy (klik w stoper albo "od nowa").
  const [timerArmed, setTimerArmed] = useState(!afterVideo);

  useEffect(() => {
    if (!timerArmed) return;
    start();
    // Pierwsze pokazanie trzech pytan od razu uruchamia czas na samodzielna prace.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Enter albo Spacja = przejdz do kola (poza edycja pytania).
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(target.tagName)) return;
      if (editingId || adding || questions.length === 0) return;
      if (e.key === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        onStart();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [editingId, adding, questions.length, onStart]);

  function edit(question: Question) {
    setAdding(false);
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

  function saveNew() {
    const text = questionDraft.trim();
    if (!text || !onAdd) return;
    onAdd(text, answerDraft.trim() || undefined);
    setAdding(false);
    setQuestionDraft('');
    setAnswerDraft('');
  }

  function startAdding() {
    setEditingId(null);
    setRemoveId(null);
    setQuestionDraft('');
    setAnswerDraft('');
    setAdding(true);
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

  return (
    // pt-14: w prezentacji lewy gorny rog zajmuje zegar lekcji.
    <div className="flex min-h-0 flex-1 gap-6 overflow-hidden px-6 pb-5 pt-14">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4">
        <div className="shrink-0">
          <h1 className="text-4xl font-bold text-white">
            Odpowiedz na {LICZBY[questions.length] ?? questions.length} {pytaniaWord(questions.length)}
          </h1>
          <p className="mt-1 text-xl text-gray-300">
            {afterVideo ? 'Pytania z filmu - odpowiedzi macie już w zeszycie.' : 'Każdy zapisuje odpowiedzi. W tym czasie sprawdzamy obecność.'}
          </p>
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
                    <div className="flex shrink-0 items-center gap-1.5">
                      {question.answer && (
                        <IconButton
                          label={answerOpen.has(question.id) ? 'Ukryj odpowiedź' : 'Pokaż odpowiedź'}
                          active={answerOpen.has(question.id)}
                          onClick={() => toggleAnswer(question.id)}
                        >
                          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                          <circle cx="12" cy="12" r="3" />
                        </IconButton>
                      )}
                      <IconButton label="Edytuj pytanie" onClick={() => edit(question)}>
                        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                      </IconButton>
                      {removeId === question.id ? (
                        <>
                          <IconButton label="Nie usuwaj" onClick={() => setRemoveId(null)}>
                            <path d="M18 6 6 18M6 6l12 12" />
                          </IconButton>
                          <IconButton label="Tak, usuń" danger onClick={() => { onRemove(question.id); setRemoveId(null); }}>
                            <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
                          </IconButton>
                        </>
                      ) : (
                        <IconButton label="Usuń pytanie" onClick={() => setRemoveId(question.id)}>
                          <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
                        </IconButton>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        )}

        {onAdd && (adding ? (
          <div className="flex shrink-0 flex-col gap-2 rounded-xl border border-accent-700 bg-gray-900 px-5 py-3">
            <textarea
              rows={2}
              autoFocus
              value={questionDraft}
              onChange={(event) => setQuestionDraft(event.target.value)}
              placeholder="Nowe pytanie"
              aria-label="Nowe pytanie"
              className="block w-full resize-none rounded-lg border border-gray-600 bg-gray-950 px-3 py-2 text-2xl text-white outline-none placeholder:text-gray-500 focus:border-accent-400"
            />
            <textarea
              rows={1}
              value={answerDraft}
              onChange={(event) => setAnswerDraft(event.target.value)}
              placeholder="Odpowiedź (opcjonalnie)"
              aria-label="Odpowiedź do nowego pytania"
              className="block w-full resize-none rounded-lg border border-gray-600 bg-gray-950 px-3 py-2 text-lg text-white outline-none placeholder:text-gray-500 focus:border-accent-400"
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setAdding(false)} className="rounded-lg border border-gray-600 px-3 py-1.5 text-gray-200 hover:bg-gray-800">
                Anuluj
              </button>
              <button type="button" onClick={saveNew} disabled={!questionDraft.trim()} className="rounded-lg bg-accent-600 px-4 py-1.5 font-semibold text-white hover:bg-accent-500 disabled:opacity-30">
                Dodaj pytanie
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={startAdding}
            title="Dodaj pytanie"
            aria-label="Dodaj pytanie"
            className="flex h-12 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-gray-700 text-3xl font-bold text-gray-500 hover:border-accent-500 hover:text-accent-300"
          >
            +
          </button>
        ))}
      </div>

      <div className="flex w-[clamp(300px,26vw,440px)] shrink-0 flex-col gap-4">
        <button
          type="button"
          onClick={() => {
            if (!timerArmed) {
              setTimerArmed(true);
              reset();
              start();
            } else if (running) pause();
            else start();
          }}
          title={running ? 'Zatrzymaj' : 'Wznów'}
          className={clsx(
            'w-full rounded-2xl py-6 font-mono font-bold leading-none tabular-nums focus-visible:outline focus-visible:outline-4 focus-visible:outline-white',
            timerArmed && finished ? 'bg-red-700 text-white' : running ? 'bg-gray-900 text-accent-200 hover:bg-gray-800' : 'bg-gray-900 text-gray-500 hover:bg-gray-800',
          )}
          style={{ fontSize: 'clamp(72px, 8vw, 150px)' }}
        >
          {formatMmSs(timerArmed ? remainingSec : 0)}
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
              setTimerArmed(true);
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
