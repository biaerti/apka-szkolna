// Jeden wiersz pytania kartkowki: numer, tresc, odpowiedz (szarym - tylko dla
// nauczyciela), przyciski gora/dol/edytuj/usun. Edycja inline: te same pola
// zamieniaja sie w inputy, zapis przyciskiem "Zapisz" (nie przy kazdej
// literze - kartkowka to zamkniety dokument, nie notatka).

import { useState } from 'react';
import type { QuizQuestion } from '../../data/types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export function QuizQuestionRow({
  question,
  index,
  total,
  onSave,
  onMoveUp,
  onMoveDown,
  onRemove,
}: {
  question: QuizQuestion;
  index: number;
  total: number;
  onSave: (patch: { text: string; answer?: string }) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(question.text);
  const [answer, setAnswer] = useState(question.answer ?? '');

  function startEdit() {
    setText(question.text);
    setAnswer(question.answer ?? '');
    setEditing(true);
  }

  function save() {
    const t = text.trim();
    if (!t) return;
    const a = answer.trim();
    onSave({ text: t, answer: a || undefined });
    setEditing(false);
  }

  return (
    <div className="flex items-start gap-3 border-b border-gray-100 px-4 py-3 last:border-b-0">
      <span className="mt-0.5 w-7 shrink-0 text-right text-sm font-medium text-gray-400">{index + 1}.</span>
      <div className="min-w-0 flex-1">
        {editing ? (
          <form
            className="space-y-2"
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
          >
            <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Treść pytania" autoFocus />
            <Input value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Odpowiedź (opcjonalnie)" />
            <div className="flex gap-2">
              <Button size="sm" type="submit" disabled={!text.trim()}>
                Zapisz
              </Button>
              <Button size="sm" variant="ghost" type="button" onClick={() => setEditing(false)}>
                Anuluj
              </Button>
            </div>
          </form>
        ) : (
          <>
            <p className="whitespace-pre-line text-base text-gray-900">{question.text}</p>
            {question.answer && <p className="mt-0.5 text-sm text-gray-500">Odp.: {question.answer}</p>}
            {/* Skad pytanie przyszlo: "4.2 Z1" = zadanie robione na lekcji,
                "4.2 PZ3" = pytanie powtorzeniowe z zestawu tej lekcji. */}
            {question.sourceLabel ? (
              <p className="mt-0.5 text-xs text-gray-400">{question.sourceLabel}</p>
            ) : (
              question.sourceQuestionId === undefined && <p className="mt-0.5 text-xs text-gray-400">Pytanie własne</p>
            )}
          </>
        )}
      </div>
      {!editing && (
        <div className="flex shrink-0 items-center gap-1">
          <Button size="sm" variant="ghost" disabled={index === 0} onClick={onMoveUp} title="Przesuń w górę">
            Góra
          </Button>
          <Button size="sm" variant="ghost" disabled={index === total - 1} onClick={onMoveDown} title="Przesuń w dół">
            Dół
          </Button>
          <Button size="sm" variant="ghost" onClick={startEdit}>
            Edytuj
          </Button>
          <Button size="sm" variant="danger" onClick={onRemove}>
            Usuń
          </Button>
        </div>
      )}
    </div>
  );
}
