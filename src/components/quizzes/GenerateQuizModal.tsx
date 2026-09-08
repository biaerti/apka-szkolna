// "Wygeneruj zadania" - kartkowka ukladana przez Claude (Sonnet 5) na
// OpenRouterze.
//
// Zaznaczasz lekcje, apka sklada z ich materialu polecenie (zadania Z1...,
// pytania PZ1..., temat i kody podstawy, punktacja) i wysyla je do funkcji
// "generuj-kartkowke" na Supabase - to ona trzyma klucz do OpenRoutera, bo
// wszystko, co apka ma przez VITE_*, jest publiczne w bundlu JS.
//
// Wygenerowany tekst laduje w polu, ktore mozna poprawic przed dodaniem -
// i ktore dziala tez jako droga zapasowa: gdy generowanie nie wypali (brak
// internetu, brak klucza, tryb lokalny), kopiujesz polecenie, pytasz Claude
// gdzie indziej i wklejasz odpowiedz recznie.

import { useEffect, useMemo, useState } from 'react';
import type { Quiz } from '../../data/types';
import { useStore } from '../../data/store';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { Textarea } from '../ui/Textarea';
import { lessonQuestionOptions, pointsLabel } from '../../lib/quiz';
import { buildQuizPrompt, parseGeneratedQuiz, type ParsedQuizQuestion } from '../../lib/quizPrompt';
import { canGenerateQuiz, generateQuizText } from '../../data/generateQuiz';
import { copyToClipboard } from '../../lib/clipboard';

export function GenerateQuizModal({
  open,
  quiz,
  onClose,
  onAdd,
}: {
  open: boolean;
  quiz: Quiz;
  onClose: () => void;
  onAdd: (questions: ParsedQuizQuestion[]) => void;
}) {
  const lessons = useStore((s) => s.lessons);
  const questionSets = useStore((s) => s.questionSets);
  const questions = useStore((s) => s.questions);
  const classes = useStore((s) => s.classes);
  const className = classes.find((c) => c.id === quiz.classId)?.name ?? '';

  const options = useMemo(
    () => lessonQuestionOptions(lessons, questionSets, questions, quiz.classId, classes),
    [lessons, questionSets, questions, quiz.classId, classes],
  );

  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [count, setCount] = useState(5);
  const [result, setResult] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [manual, setManual] = useState(false);

  // Domyslnie ostatnia lekcja z materialem - kartkowka karna jest zwykle
  // "z tego, co bylo teraz", a nie z calego rocznika.
  useEffect(() => {
    if (!open) return;
    setResult('');
    setError(null);
    setCopied(false);
    setManual(false);
    setBusy(false);
    const last = options[options.length - 1];
    setPicked(new Set(last ? [last.lesson.id] : []));
  }, [open, options]);

  const chosen = options.filter((o) => picked.has(o.lesson.id));
  const prompt = chosen.length > 0 ? buildQuizPrompt({ kind: quiz.kind, className, lessons: chosen, count }) : '';
  const parsed = parseGeneratedQuiz(result);
  const parsedPoints = parsed.reduce((sum, q) => sum + q.points, 0);
  const online = canGenerateQuiz();

  function toggle(id: string) {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function generate() {
    if (!prompt || busy) return;
    setBusy(true);
    setError(null);
    try {
      const out = await generateQuizText(prompt);
      setResult(out.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Nie udało się wygenerować zadań.');
      setManual(true);
    } finally {
      setBusy(false);
    }
  }

  async function copyPrompt() {
    if (!prompt) return;
    const ok = await copyToClipboard(prompt);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Wygeneruj zadania"
      widthClassName="max-w-3xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Anuluj
          </Button>
          <Button
            disabled={parsed.length === 0}
            onClick={() => {
              onAdd(parsed);
              setResult('');
            }}
          >
            Dodaj do kartkówki ({parsed.length})
          </Button>
        </>
      }
    >
      {options.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-500">
          Żadna lekcja tego rocznika nie ma jeszcze zadań ani pytań - nie ma z czego generować.
        </p>
      ) : (
        <div className="space-y-4">
          <section>
            <p className="mb-1 text-sm font-semibold text-gray-900">Z czego ma być kartkówka</p>
            <p className="mb-2 text-xs text-gray-500">
              Zadania będą trudniejsze niż to, co klasa robiła na lekcji - nie przepisane z materiału.
            </p>
            <div className="max-h-40 overflow-y-auto rounded-lg border border-gray-200">
              {options.map((o) => (
                <label
                  key={o.lesson.id}
                  className="flex cursor-pointer items-start gap-3 border-b border-gray-100 px-3 py-2 last:border-b-0 hover:bg-gray-50"
                >
                  <input type="checkbox" className="mt-1" checked={picked.has(o.lesson.id)} onChange={() => toggle(o.lesson.id)} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm text-gray-900">
                      {o.lesson.code && <span className="mr-1.5 font-semibold tabular-nums text-gray-500">{o.lesson.code}</span>}
                      {o.lesson.title}
                    </span>
                    <span className="block text-xs text-gray-400">
                      {o.tasks.length} zadań z lekcji · {o.review.length} powtórzeniowych
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              Liczba zadań
              <Input
                type="number"
                min={1}
                max={15}
                value={count}
                onChange={(e) => setCount(Math.min(15, Math.max(1, Number(e.target.value) || 1)))}
                className="w-20"
              />
            </label>
            <Button onClick={generate} disabled={chosen.length === 0 || busy || !online}>
              {busy ? 'Układam zadania...' : result ? 'Wygeneruj jeszcze raz' : 'Wygeneruj'}
            </Button>
            {!manual && (
              <button
                type="button"
                onClick={() => setManual(true)}
                className="text-xs text-gray-500 hover:text-accent-700 hover:underline"
              >
                albo wklej ręcznie
              </button>
            )}
          </section>

          {!online && (
            <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Generowanie działa tylko po zalogowaniu (tryb lokalny nie ma dostępu do Supabase). Skopiuj polecenie
              i wklej odpowiedź ręcznie.
            </p>
          )}
          {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

          {(manual || result) && (
            <section>
              <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-gray-900">Zadania</p>
                <Button size="sm" variant="ghost" onClick={copyPrompt} disabled={chosen.length === 0}>
                  {copied ? 'Skopiowano polecenie' : 'Kopiuj polecenie'}
                </Button>
              </div>
              <p className="mb-2 text-xs text-gray-500">
                Format: „[2] treść zadania" w nowej linii, pod spodem „Odp.: ...". Liczba w nawiasie to punkty.
                Możesz tu poprawić treść przed dodaniem.
              </p>
              <Textarea rows={8} value={result} onChange={(e) => setResult(e.target.value)} placeholder="[1] ..." />
            </section>
          )}

          {parsed.length > 0 && (
            <section>
              <p className="mb-1.5 text-xs text-gray-500">
                Rozpoznane: {parsed.length} zadań, razem {pointsLabel(parsedPoints)}
              </p>
              <div className="max-h-48 divide-y divide-gray-100 overflow-y-auto rounded-md border border-gray-200">
                {parsed.map((q, idx) => (
                  <div key={idx} className="px-3 py-2">
                    <p className="whitespace-pre-line text-sm text-gray-900">
                      <span className="mr-2 font-semibold text-gray-400">{pointsLabel(q.points)}</span>
                      {q.text}
                    </p>
                    {q.answer && <p className="mt-0.5 whitespace-pre-line text-xs text-gray-500">Odp.: {q.answer}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </Modal>
  );
}
