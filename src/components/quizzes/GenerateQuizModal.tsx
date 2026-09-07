// "Wygeneruj zadania" - kartkowka ukladana przez Claude, bez zadnego API w apce.
//
// Krok 1: zaznaczasz lekcje, apka sklada gotowe polecenie z ich materialu
//         (zadania Z1..., pytania PZ1..., temat i kody podstawy) i kopiuje je
//         do schowka.
// Krok 2: wklejasz odpowiedz agenta - apka rozbija ja na zadania z punktami
//         i dopisuje do kartkowki.
//
// Dlaczego tak, a nie klik w apce: klucz do API musialby siedziec w
// przegladarce albo na serwerze i byc osobno oplacany. Schowek dziala wszedzie,
// takze na szkolnym Chrome 109 na http.

import { useEffect, useMemo, useState } from 'react';
import type { Quiz } from '../../data/types';
import { useStore } from '../../data/store';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { Textarea } from '../ui/Textarea';
import { lessonQuestionOptions, pointsLabel } from '../../lib/quiz';
import { buildQuizPrompt, parseGeneratedQuiz, type ParsedQuizQuestion } from '../../lib/quizPrompt';
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
  const [pasted, setPasted] = useState('');
  const [copied, setCopied] = useState(false);

  // Domyslnie ostatnia lekcja z materialem - kartkowka karna jest zwykle
  // "z tego, co bylo teraz", a nie z calego rocznika.
  useEffect(() => {
    if (!open) return;
    setPasted('');
    setCopied(false);
    const last = options[options.length - 1];
    setPicked(new Set(last ? [last.lesson.id] : []));
  }, [open, options]);

  const chosen = options.filter((o) => picked.has(o.lesson.id));
  const prompt =
    chosen.length > 0 ? buildQuizPrompt({ kind: quiz.kind, className, lessons: chosen, count }) : '';
  const parsed = parseGeneratedQuiz(pasted);
  const parsedPoints = parsed.reduce((sum, q) => sum + q.points, 0);

  function toggle(id: string) {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
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
              setPasted('');
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
        <div className="space-y-5">
          <section>
            <p className="mb-1 text-sm font-semibold text-gray-900">1. Z czego ma być kartkówka</p>
            <p className="mb-2 text-xs text-gray-500">
              Zadania będą trudniejsze niż to, co klasa robiła na lekcji - nie przepisane z materiału.
            </p>
            <div className="max-h-44 overflow-y-auto rounded-lg border border-gray-200">
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
            <div className="mt-2 flex flex-wrap items-center gap-3">
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
              <Button variant="secondary" onClick={copyPrompt} disabled={chosen.length === 0}>
                {copied ? 'Skopiowano polecenie' : 'Kopiuj polecenie'}
              </Button>
            </div>
          </section>

          <section>
            <p className="mb-1 text-sm font-semibold text-gray-900">2. Wklej to, co odpisał Claude</p>
            <p className="mb-2 text-xs text-gray-500">
              Format: „[2] treść zadania" w nowej linii, pod spodem „Odp.: ...". Liczba w nawiasie to punkty.
            </p>
            <Textarea rows={7} value={pasted} onChange={(e) => setPasted(e.target.value)} placeholder="[1] ..." />
            {parsed.length > 0 && (
              <div className="mt-2">
                <p className="mb-1.5 text-xs text-gray-500">
                  Rozpoznane: {parsed.length} zadań, razem {pointsLabel(parsedPoints)}
                </p>
                <div className="max-h-48 overflow-y-auto rounded-md border border-gray-200 divide-y divide-gray-100">
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
              </div>
            )}
          </section>
        </div>
      )}
    </Modal>
  );
}
