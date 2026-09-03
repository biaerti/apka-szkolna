import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../data/store';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { EmptyState } from '../components/ui/EmptyState';
import { ImportQuestionsModal } from '../components/questions/ImportQuestionsModal';
import { QuestionRow } from '../components/questions/QuestionRow';

export function QuestionSetDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const questionSets = useStore((s) => s.questionSets);
  const questions = useStore((s) => s.questions);
  const classes = useStore((s) => s.classes);
  const updateQuestionSet = useStore((s) => s.updateQuestionSet);
  const addQuestion = useStore((s) => s.addQuestion);
  const updateQuestion = useStore((s) => s.updateQuestion);
  const removeQuestion = useStore((s) => s.removeQuestion);
  const reorderQuestion = useStore((s) => s.reorderQuestion);

  const [importOpen, setImportOpen] = useState(false);
  const [newText, setNewText] = useState('');

  const set = questionSets.find((qs) => qs.id === id);
  const setClass = set ? classes.find((c) => set.classIds.includes(c.id)) : undefined;
  const setQuestions = useMemo(
    () => questions.filter((q) => q.setId === id).sort((a, b) => a.order - b.order),
    [questions, id],
  );

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

  function toggleClass(classId: string) {
    if (!set) return;
    const has = set.classIds.includes(classId);
    updateQuestionSet(set.id, {
      classIds: has ? set.classIds.filter((c) => c !== classId) : [...set.classIds, classId],
    });
  }

  return (
    <div>
      <p className="mb-2 text-sm">
        <Link to="/lekcje" className="text-gray-500 hover:text-accent-700 hover:underline">
          Lekcje
        </Link>
        {setClass && (
          <>
            <span className="mx-1.5 text-gray-400">/</span>
            <span className="text-gray-500">{setClass.name}</span>
          </>
        )}
        <span className="mx-1.5 text-gray-400">/</span>
        <span className="text-gray-700">{set.name}</span>
      </p>
      <PageHeader
        title={set.name}
        description={set.topic}
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => navigate('/lekcje')}>
              Wróć do lekcji
            </Button>
            <Button variant="secondary" onClick={() => setImportOpen(true)}>
              Importuj z tekstu
            </Button>
          </div>
        }
      />

      <div className="mb-5 rounded-lg border border-gray-200 bg-white p-4">
        <p className="mb-2 text-sm font-medium text-gray-700">Przypisz do klas</p>
        <div className="flex flex-wrap gap-3">
          {classes.map((c) => (
            <label key={c.id} className="flex items-center gap-1.5 text-sm text-gray-700">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-accent-600 focus:ring-accent-500"
                checked={set.classIds.includes(c.id)}
                onChange={() => toggleClass(c.id)}
              />
              {c.name}
            </label>
          ))}
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
