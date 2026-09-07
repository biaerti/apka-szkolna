// Kartkowki i klasowki - lista pogrupowana po klasie. Kartkowka jest per
// klasa (konkretne wydarzenie: kara za halas / termin klasowki), wiec naglowek
// grupy to nazwa klasy, a w grupie najnowsze na gorze.

import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../data/store';
import type { Quiz, QuizKind, SchoolClass } from '../data/types';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { QuizKindBadge } from '../components/quizzes/QuizKindBadge';
import { NewQuizModal } from '../components/quizzes/NewQuizModal';
import { formatQuizDate } from '../lib/quiz';

export function Quizzes() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const classes = useStore((s) => s.classes);
  const quizzes = useStore((s) => s.quizzes);
  const addQuiz = useStore((s) => s.addQuiz);
  const removeQuiz = useStore((s) => s.removeQuiz);

  const [newKind, setNewKind] = useState<QuizKind | null>(null);
  const [toRemove, setToRemove] = useState<Quiz | null>(null);

  const sortedClasses = useMemo(() => [...classes].sort((a, b) => a.order - b.order), [classes]);
  const groups = useMemo(
    () =>
      sortedClasses
        .map((cls) => ({
          cls,
          items: quizzes
            .filter((q) => q.classId === cls.id)
            .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '') || b.createdAt.localeCompare(a.createdAt)),
        }))
        .filter((g) => g.items.length > 0),
    [sortedClasses, quizzes],
  );

  const newButtons = (
    <>
      <Button variant="secondary" onClick={() => setNewKind('klasowka')} disabled={classes.length === 0}>
        Nowa klasówka
      </Button>
      <Button onClick={() => setNewKind('kartkowka')} disabled={classes.length === 0}>
        Nowa kartkówka
      </Button>
    </>
  );

  return (
    <div>
      <PageHeader
        title="Kartkówki"
        description="Kartkówki z bieżącego materiału i klasówki po dziale - pytania z lekcji albo własne, do pokazania na projektorze."
        actions={newButtons}
      />

      {groups.length === 0 ? (
        <EmptyState
          title="Brak kartkówek"
          description="Dodaj kartkówkę dla klasy, wybierz pytania z lekcji i pokaż je na projektorze."
          action={<div className="flex gap-2">{newButtons}</div>}
        />
      ) : (
        <div className="space-y-6">
          {groups.map(({ cls, items }) => (
            <ClassGroup
              key={cls.id}
              cls={cls}
              items={items}
              onOpen={(q) => navigate(`/kartkowki/${q.id}`)}
              onPresent={(q) => navigate(`/kartkowki/${q.id}/pokaz`)}
              onRemove={setToRemove}
            />
          ))}
        </div>
      )}

      <NewQuizModal
        kind={newKind}
        classes={sortedClasses}
        defaultClassId={searchParams.get('klasa') ?? undefined}
        onClose={() => setNewKind(null)}
        onCreate={(values) => {
          if (!newKind) return;
          const created = addQuiz({ ...values, kind: newKind, questions: [] });
          setNewKind(null);
          navigate(`/kartkowki/${created.id}`);
        }}
      />

      <ConfirmDialog
        open={toRemove !== null}
        title={`Usunąć „${toRemove?.title ?? ''}”?`}
        message="Pytania tej kartkówki znikną bezpowrotnie."
        confirmLabel="Usuń"
        onCancel={() => setToRemove(null)}
        onConfirm={() => {
          if (toRemove) removeQuiz(toRemove.id);
          setToRemove(null);
        }}
      />
    </div>
  );
}

function ClassGroup({
  cls,
  items,
  onOpen,
  onPresent,
  onRemove,
}: {
  cls: SchoolClass;
  items: Quiz[];
  onOpen: (q: Quiz) => void;
  onPresent: (q: Quiz) => void;
  onRemove: (q: Quiz) => void;
}) {
  return (
    <section>
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">{cls.name}</h2>
      <div className="rounded-lg border border-gray-200 bg-white">
        {items.map((q) => (
          <div key={q.id} className="flex items-center gap-3 border-b border-gray-100 px-4 py-3 last:border-b-0">
            <QuizKindBadge kind={q.kind} className="w-20 justify-center" />
            <button
              type="button"
              onClick={() => onOpen(q)}
              className="min-w-0 flex-1 text-left text-base font-medium text-gray-900 hover:text-accent-700"
            >
              {q.title}
            </button>
            <span className="w-24 shrink-0 text-sm text-gray-500">{formatQuizDate(q.date)}</span>
            <span className="w-24 shrink-0 text-sm text-gray-500">{questionCountLabel(q.questions.length)}</span>
            <div className="flex shrink-0 items-center gap-1">
              <Button size="sm" variant="ghost" onClick={() => onOpen(q)}>
                Otwórz
              </Button>
              <Button size="sm" variant="secondary" onClick={() => onPresent(q)} disabled={q.questions.length === 0}>
                Pokaż na projektorze
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onRemove(q)}>
                Usuń
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function questionCountLabel(n: number): string {
  if (n === 1) return '1 pytanie';
  const rest = n % 10;
  const tens = n % 100;
  if (rest >= 2 && rest <= 4 && !(tens >= 12 && tens <= 14)) return `${n} pytania`;
  return `${n} pytań`;
}
