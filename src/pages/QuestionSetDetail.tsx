import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useStore } from '../data/store';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { EmptyState } from '../components/ui/EmptyState';
import { ImportQuestionsModal } from '../components/questions/ImportQuestionsModal';
import { QuestionRow } from '../components/questions/QuestionRow';

export function QuestionSetDetail() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const questionSets = useStore((s) => s.questionSets);
  const questions = useStore((s) => s.questions);
  const lessons = useStore((s) => s.lessons);
  const updateQuestionSet = useStore((s) => s.updateQuestionSet);
  const addQuestion = useStore((s) => s.addQuestion);
  const updateQuestion = useStore((s) => s.updateQuestion);
  const removeQuestion = useStore((s) => s.removeQuestion);
  const reorderQuestion = useStore((s) => s.reorderQuestion);

  const [importOpen, setImportOpen] = useState(false);
  const [newText, setNewText] = useState('');

  const set = questionSets.find((qs) => qs.id === id);
  const lessonIdParam = searchParams.get('lekcja');
  const lesson = lessonIdParam
    ? lessons.find((l) => l.id === lessonIdParam)
    : lessons.find((l) => l.questionSetId === set?.id);
  const setQuestions = useMemo(
    () => questions.filter((q) => q.setId === id).sort((a, b) => a.order - b.order),
    [questions, id],
  );

  const [nameDraft, setNameDraft] = useState(set?.name ?? '');
  useEffect(() => {
    setNameDraft(set?.name ?? '');
  }, [set?.id, set?.name]);

  if (!set) {
    return (
      <EmptyState
        title="Nie znaleziono zestawu"
        description="Ten zestaw pytań mógł zostać usunięty."
        action={
          <Button variant="secondary" onClick={() => navigate('/pytania')}>
            Wróć do listy zestawów
          </Button>
        }
      />
    );
  }

  function addNewQuestion() {
    const text = newText.trim();
    if (!text || !id) return;
    addQuestion({ setId: id, text });
    setNewText('');
  }

  function saveName(value: string) {
    if (!set) return;
    updateQuestionSet(set.id, { name: value });
  }

  return (
    <div>
      <p className="mb-2 text-sm">
        <Link to="/lekcje" className="text-gray-500 hover:text-accent-700 hover:underline">
          Lekcje
        </Link>
        {lesson && (
          <>
            <span className="mx-1.5 text-gray-400">/</span>
            <Link to={`/lekcje/${lesson.id}/edytuj`} className="text-gray-500 hover:text-accent-700 hover:underline">
              {lesson.title}
            </Link>
          </>
        )}
        <span className="mx-1.5 text-gray-400">/</span>
        <span className="text-gray-700">{set.name}</span>
      </p>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <input
          value={nameDraft}
          onChange={(e) => {
            setNameDraft(e.target.value);
            if (e.target.value.trim()) saveName(e.target.value);
          }}
          onBlur={(e) => {
            const trimmed = e.target.value.trim();
            if (trimmed) {
              if (trimmed !== e.target.value) {
                setNameDraft(trimmed);
                saveName(trimmed);
              }
            } else {
              setNameDraft(set.name);
            }
          }}
          className="min-w-0 flex-1 rounded border border-transparent bg-transparent px-1 text-2xl font-semibold text-gray-900 hover:border-gray-300 focus:border-accent-500 focus:outline-none"
        />
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="secondary" onClick={() => navigate(lesson ? `/lekcje/${lesson.id}/edytuj` : '/lekcje')}>
            Wróć do lekcji
          </Button>
          <Button variant="secondary" onClick={() => setImportOpen(true)}>
            Importuj z tekstu
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white">
        {setQuestions.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-gray-500">Brak pytań w tym zestawie.</div>
        ) : (
          setQuestions.map((q, idx) => (
            <QuestionRow
              key={q.id}
              question={q}
              index={idx}
              total={setQuestions.length}
              onChangeText={(text) => updateQuestion(q.id, { text })}
              onChangeAnswer={(answer) => updateQuestion(q.id, { answer: answer || undefined })}
              onMoveUp={() => reorderQuestion(q.id, 'up')}
              onMoveDown={() => reorderQuestion(q.id, 'down')}
              onRemove={() => removeQuestion(q.id)}
            />
          ))
        )}
        <div className="flex items-center gap-2 border-t border-gray-200 px-4 py-3">
          <Input
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Nowe pytanie - Enter, aby dodać"
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addNewQuestion();
              }
            }}
          />
          <Button onClick={addNewQuestion} disabled={!newText.trim()}>
            Dodaj
          </Button>
        </div>
      </div>

      <ImportQuestionsModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={(parsed) => {
          if (!id) return;
          for (const p of parsed) {
            addQuestion({ setId: id, text: p.text, answer: p.answer });
          }
          setImportOpen(false);
        }}
      />
    </div>
  );
}
