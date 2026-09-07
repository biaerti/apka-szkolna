// Modal "Dodaj z pytań lekcji": u gory wybor lekcji rocznika tej klasy (tylko
// te z niepustym zestawem), pod nim pytania zestawu z checkboxami. Pytania
// juz dodane do kartkowki (po sourceQuestionId) sa zaznaczone i wylaczone -
// widac, co juz jest, i nie da sie dodac dwa razy tego samego.

import { useEffect, useMemo, useState } from 'react';
import type { Question, Quiz } from '../../data/types';
import { useStore } from '../../data/store';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import { lessonsWithQuestionSets } from '../../lib/quiz';

export function PickQuestionsModal({
  open,
  quiz,
  onClose,
  onAdd,
}: {
  open: boolean;
  quiz: Quiz;
  onClose: () => void;
  onAdd: (questions: Question[]) => void;
}) {
  const lessons = useStore((s) => s.lessons);
  const questionSets = useStore((s) => s.questionSets);
  const questions = useStore((s) => s.questions);
  const classes = useStore((s) => s.classes);

  const options = useMemo(
    () => lessonsWithQuestionSets(lessons, questionSets, questions, quiz.classId, classes),
    [lessons, questionSets, questions, quiz.classId, classes],
  );
  const alreadyAdded = useMemo(
    () => new Set(quiz.questions.map((q) => q.sourceQuestionId).filter((id): id is string => id !== undefined)),
    [quiz.questions],
  );

  const [lessonId, setLessonId] = useState('');
  const [picked, setPicked] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!open) return;
    setPicked(new Set());
    setLessonId((current) => (options.some((o) => o.lesson.id === current) ? current : options[0]?.lesson.id ?? ''));
  }, [open, options]);

  const current = options.find((o) => o.lesson.id === lessonId);
  const selectable = current ? current.questions.filter((q) => !alreadyAdded.has(q.id)) : [];
  const allPicked = selectable.length > 0 && selectable.every((q) => picked.has(q.id));

  function toggle(id: string) {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setPicked((prev) => {
      const next = new Set(prev);
      for (const q of selectable) {
        if (allPicked) next.delete(q.id);
        else next.add(q.id);
      }
      return next;
    });
  }

  function submit() {
    // Zachowujemy kolejnosc zestawu, nie kolejnosc klikania.
    const chosen = current ? current.questions.filter((q) => picked.has(q.id)) : [];
    if (chosen.length === 0) return;
    onAdd(chosen);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Dodaj pytania z lekcji"
      widthClassName="max-w-2xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Anuluj
          </Button>
          <Button onClick={submit} disabled={picked.size === 0}>
            Dodaj zaznaczone ({picked.size})
          </Button>
        </>
      }
    >
      {options.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-500">
          Żadna lekcja tego rocznika nie ma jeszcze zestawu pytań. Dodaj pytania w edytorze lekcji albo wpisz własne.
        </p>
      ) : (
        <div className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Lekcja</span>
            <Select
              value={lessonId}
              onChange={(e) => {
                setLessonId(e.target.value);
                setPicked(new Set());
              }}
            >
              {options.map((o) => (
                <option key={o.lesson.id} value={o.lesson.id}>
                  {o.lesson.code ? `${o.lesson.code} ` : ''}
                  {o.lesson.title} ({o.questions.length})
                </option>
              ))}
            </Select>
          </label>

          {current && (
            <div className="rounded-lg border border-gray-200">
              <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-500">
                <span>{current.set.name}</span>
                {selectable.length > 0 && (
                  <button type="button" onClick={toggleAll} className="font-medium text-accent-700 hover:underline">
                    {allPicked ? 'Odznacz wszystkie' : 'Zaznacz wszystkie'}
                  </button>
                )}
              </div>
              <ul className="max-h-80 overflow-y-auto">
                {current.questions.map((q, idx) => {
                  const added = alreadyAdded.has(q.id);
                  return (
                    <li key={q.id} className="border-b border-gray-100 last:border-b-0">
                      <label
                        className={`flex cursor-pointer items-start gap-3 px-3 py-2 ${added ? 'text-gray-400' : 'hover:bg-gray-50'}`}
                      >
                        <input
                          type="checkbox"
                          className="mt-1"
                          checked={added || picked.has(q.id)}
                          disabled={added}
                          onChange={() => toggle(q.id)}
                        />
                        <span className="w-6 shrink-0 text-sm text-gray-400">{idx + 1}.</span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm">{q.text}</span>
                          {q.answer && <span className="block text-xs text-gray-400">Odp.: {q.answer}</span>}
                          {added && <span className="block text-xs text-gray-400">Już w kartkówce</span>}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
