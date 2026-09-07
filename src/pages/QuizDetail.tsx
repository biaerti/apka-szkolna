// Jedna kartkowka / klasowka: naglowek (tytul edytowalny, klasa, rodzaj,
// data), lista pytan z numeracja i dwa sposoby dodawania - z zestawow lekcji
// rocznika tej klasy (PickQuestionsModal) albo wlasne (OwnQuestionForm).
// Pytania z lekcji sa KOPIAMI (patrz types.ts: QuizQuestion).

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../data/store';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { QuizKindBadge } from '../components/quizzes/QuizKindBadge';
import { QuizQuestionRow } from '../components/quizzes/QuizQuestionRow';
import { OwnQuestionForm } from '../components/quizzes/OwnQuestionForm';
import { PickQuestionsModal } from '../components/quizzes/PickQuestionsModal';
import { moveQuizQuestion, ownQuizQuestion, quizQuestionFromQuestion, renumber } from '../lib/quiz';

export function QuizDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const quiz = useStore((s) => s.quizzes.find((q) => q.id === id));
  const cls = useStore((s) => s.classes.find((c) => c.id === quiz?.classId));
  const updateQuiz = useStore((s) => s.updateQuiz);
  const removeQuiz = useStore((s) => s.removeQuiz);

  const [pickOpen, setPickOpen] = useState(false);
  const [ownOpen, setOwnOpen] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);

  if (!quiz) {
    return (
      <EmptyState
        title="Nie znaleziono kartkówki"
        description="Ta kartkówka mogła zostać usunięta."
        action={
          <Button variant="secondary" onClick={() => navigate('/kartkowki')}>
            Wróć do listy
          </Button>
        }
      />
    );
  }

  const questions = renumber(quiz.questions);
  const quizId = quiz.id;

  function setQuestions(next: typeof questions) {
    updateQuiz(quizId, { questions: renumber(next) });
  }

  return (
    <div className="mx-auto max-w-4xl">
      <button
        type="button"
        onClick={() => navigate('/kartkowki')}
        className="mb-4 text-sm font-medium text-gray-500 hover:text-gray-900"
      >
        &larr; Kartkówki
      </button>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2 text-sm text-gray-500">
            <QuizKindBadge kind={quiz.kind} />
            <span>{cls?.name ?? 'Klasa usunięta'}</span>
          </div>
          <input
            value={quiz.title}
            onChange={(e) => updateQuiz(quizId, { title: e.target.value })}
            onBlur={(e) => {
              if (!e.target.value.trim()) updateQuiz(quizId, { title: 'Bez tytułu' });
            }}
            className="w-full rounded border border-transparent bg-transparent px-1 text-2xl font-semibold text-gray-900 hover:border-gray-300 focus:border-accent-500 focus:outline-none"
          />
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              Data
              <Input
                type="date"
                value={quiz.date ?? ''}
                onChange={(e) => updateQuiz(quizId, { date: e.target.value || undefined })}
                className="w-auto"
              />
            </label>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="secondary" onClick={() => navigate('/kartkowki')}>
            Wróć
          </Button>
          <Button onClick={() => navigate(`/kartkowki/${quizId}/pokaz`)} disabled={questions.length === 0}>
            Pokaż na projektorze
          </Button>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Button variant="secondary" onClick={() => setPickOpen(true)}>
          Dodaj z pytań lekcji
        </Button>
        <Button variant="secondary" onClick={() => setOwnOpen(true)}>
          Dodaj własne pytanie
        </Button>
        <span className="ml-auto text-sm text-gray-500">
          {questions.length === 0 ? 'Brak pytań' : `Pytań: ${questions.length}`}
        </span>
      </div>

      {ownOpen && (
        <div className="mb-3">
          <OwnQuestionForm
            onAdd={(text, answer) => setQuestions([...questions, ownQuizQuestion(text, answer, questions.length)])}
            onClose={() => setOwnOpen(false)}
          />
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white">
        {questions.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-gray-500">
            Jeszcze nie ma pytań - dodaj je z zestawów lekcji albo wpisz własne.
          </div>
        ) : (
          questions.map((q, idx) => (
            <QuizQuestionRow
              key={q.id}
              question={q}
              index={idx}
              total={questions.length}
              onSave={(patch) => setQuestions(questions.map((x) => (x.id === q.id ? { ...x, ...patch } : x)))}
              onMoveUp={() => setQuestions(moveQuizQuestion(questions, q.id, 'up'))}
              onMoveDown={() => setQuestions(moveQuizQuestion(questions, q.id, 'down'))}
              onRemove={() => setQuestions(questions.filter((x) => x.id !== q.id))}
            />
          ))
        )}
      </div>

      <label className="mt-6 block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Notatka (tylko dla Ciebie)</span>
        <Textarea
          value={quiz.note ?? ''}
          onChange={(e) => updateQuiz(quizId, { note: e.target.value || undefined })}
          rows={3}
          placeholder="np. za hałas na lekcji 12.09, próg na 4 - 8 pkt"
        />
      </label>

      <div className="mt-6 flex justify-end">
        <Button variant="danger" onClick={() => setConfirmRemove(true)}>
          Usuń kartkówkę
        </Button>
      </div>

      <PickQuestionsModal
        open={pickOpen}
        quiz={quiz}
        onClose={() => setPickOpen(false)}
        onAdd={(picked) => {
          const start = questions.length;
          setQuestions([...questions, ...picked.map((q, i) => quizQuestionFromQuestion(q, start + i))]);
          setPickOpen(false);
        }}
      />

      <ConfirmDialog
        open={confirmRemove}
        title={`Usunąć „${quiz.title}”?`}
        message="Pytania tej kartkówki znikną bezpowrotnie."
        confirmLabel="Usuń"
        onCancel={() => setConfirmRemove(false)}
        onConfirm={() => {
          removeQuiz(quizId);
          navigate('/kartkowki');
        }}
      />
    </div>
  );
}
