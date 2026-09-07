// Modal "Dodaj z pytań lekcji": u gory wybor lekcji rocznika tej klasy, pod nim
// jej material w DWOCH grupach - tak, jak nauczyciel go rozroznia:
//
// - "Zadania z lekcji" (Z1, Z2...) - polecenia ze slajdow, robione na lekcji,
// - "Pytania powtórzeniowe" (PZ1, PZ2...) - zestaw do kola na poczatku
//   nastepnej lekcji.
//
// Pytania juz dodane do kartkowki (po sourceQuestionId) sa zaznaczone i
// wylaczone - widac, co juz jest, i nie da sie dodac dwa razy tego samego.

import { useEffect, useMemo, useState } from 'react';
import type { Lesson, Quiz } from '../../data/types';
import { useStore } from '../../data/store';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import { lessonQuestionOptions } from '../../lib/quiz';
import type { LessonQuestionItem } from '../../lib/lessonQuestions';

export function PickQuestionsModal({
  open,
  quiz,
  onClose,
  onAdd,
}: {
  open: boolean;
  quiz: Quiz;
  onClose: () => void;
  onAdd: (lesson: Lesson, items: LessonQuestionItem[]) => void;
}) {
  const lessons = useStore((s) => s.lessons);
  const questionSets = useStore((s) => s.questionSets);
  const questions = useStore((s) => s.questions);
  const classes = useStore((s) => s.classes);

  const options = useMemo(
    () => lessonQuestionOptions(lessons, questionSets, questions, quiz.classId, classes),
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
  // Kolejnosc dodawania = kolejnosc na ekranie: najpierw zadania, potem powtorka.
  const all = current ? [...current.tasks, ...current.review] : [];
  const selectable = all.filter((q) => !alreadyAdded.has(q.id));
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
    const chosen = all.filter((q) => picked.has(q.id));
    if (!current || chosen.length === 0) return;
    onAdd(current.lesson, chosen);
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
          Żadna lekcja tego rocznika nie ma jeszcze zadań ani pytań. Dodaj je w edytorze lekcji albo wpisz własne.
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
                  {o.lesson.title} ({o.tasks.length + o.review.length})
                </option>
              ))}
            </Select>
          </label>

          {current && (
            <div className="rounded-lg border border-gray-200">
              <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-500">
                <span>
                  {current.tasks.length} z lekcji · {current.review.length} powtórzeniowych
                </span>
                {selectable.length > 0 && (
                  <button type="button" onClick={toggleAll} className="font-medium text-accent-700 hover:underline">
                    {allPicked ? 'Odznacz wszystkie' : 'Zaznacz wszystkie'}
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                <Group
                  title="Zadania z lekcji"
                  hint="Robione na lekcji - kody Z1, Z2..."
                  items={current.tasks}
                  alreadyAdded={alreadyAdded}
                  picked={picked}
                  onToggle={toggle}
                  emptyText="Ta lekcja nie ma slajdów z zadaniami."
                />
                <Group
                  title="Pytania powtórzeniowe"
                  hint="Koło na początku następnej lekcji - kody PZ1, PZ2..."
                  items={current.review}
                  alreadyAdded={alreadyAdded}
                  picked={picked}
                  onToggle={toggle}
                  emptyText="Ta lekcja nie ma pytań powtórzeniowych."
                />
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

function Group({
  title,
  hint,
  items,
  alreadyAdded,
  picked,
  onToggle,
  emptyText,
}: {
  title: string;
  hint: string;
  items: LessonQuestionItem[];
  alreadyAdded: Set<string>;
  picked: Set<string>;
  onToggle: (id: string) => void;
  emptyText: string;
}) {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <div className="bg-gray-50/70 px-3 py-1.5">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{title}</p>
        <p className="text-xs text-gray-400">{hint}</p>
      </div>
      {items.length === 0 ? (
        <p className="px-3 py-3 text-sm text-gray-400">{emptyText}</p>
      ) : (
        <ul>
          {items.map((q) => {
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
                    onChange={() => onToggle(q.id)}
                  />
                  <span className="w-9 shrink-0 text-sm font-semibold text-gray-400">{q.code}</span>
                  <span className="min-w-0 flex-1">
                    {q.title && <span className="block text-xs font-medium text-gray-500">{q.title}</span>}
                    <span className="block whitespace-pre-line text-sm">{q.text}</span>
                    {q.answer && <span className="block text-xs text-gray-400">Odp.: {q.answer}</span>}
                    {added && <span className="block text-xs text-gray-400">Już w kartkówce</span>}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
