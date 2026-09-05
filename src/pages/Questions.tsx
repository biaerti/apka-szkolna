import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../data/store';
import { PageHeader } from '../components/ui/PageHeader';
import { Table, THead, TBody, TR, TH, TD } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';

export function Questions() {
  const questionSets = useStore((s) => s.questionSets);
  const questions = useStore((s) => s.questions);
  const lessons = useStore((s) => s.lessons);
  const addQuestionSet = useStore((s) => s.addQuestionSet);
  const removeQuestionSet = useStore((s) => s.removeQuestionSet);

  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [toDelete, setToDelete] = useState<{ id: string; name: string } | null>(null);

  const sorted = useMemo(
    () => [...questionSets].sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    [questionSets],
  );

  function lessonTitle(setId: string) {
    return lessons.find((l) => l.questionSetId === setId)?.title;
  }

  function questionCount(setId: string) {
    return questions.filter((q) => q.setId === setId).length;
  }

  return (
    <div>
      <PageHeader
        title="Pytania"
        description="Zestawy pytań używane na powtórkach."
        actions={
          <Button
            onClick={() => {
              setNewName('');
              setNewTopic('');
              setAdding(true);
            }}
          >
            Dodaj zestaw
          </Button>
        }
      />

      {sorted.length === 0 ? (
        <EmptyState title="Brak zestawów pytań" description="Dodaj pierwszy zestaw, aby zacząć." />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Nazwa</TH>
              <TH>Temat</TH>
              <TH>Lekcja</TH>
              <TH>Liczba pytań</TH>
              <TH className="text-right">Akcje</TH>
            </TR>
          </THead>
          <TBody>
            {sorted.map((qs) => (
              <TR key={qs.id}>
                <TD className="font-medium text-gray-900">
                  <Link to={`/pytania/${qs.id}`} className="hover:text-accent-700 hover:underline">
                    {qs.name}
                  </Link>
                </TD>
                <TD>{qs.topic ?? ''}</TD>
                <TD>{lessonTitle(qs.id) ?? <span className="text-gray-400">-</span>}</TD>
                <TD>{questionCount(qs.id)}</TD>
                <TD className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link to={`/pytania/${qs.id}`}>
                      <Button size="sm">Pytania</Button>
                    </Link>
                    <Button size="sm" variant="danger" onClick={() => setToDelete({ id: qs.id, name: qs.name })}>
                      Usuń
                    </Button>
                  </div>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}

      <Modal
        open={adding}
        onClose={() => setAdding(false)}
        title="Nowy zestaw pytań"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAdding(false)}>
              Anuluj
            </Button>
            <Button
              disabled={!newName.trim()}
              onClick={() => {
                addQuestionSet({ name: newName.trim(), topic: newTopic.trim() || undefined, classIds: [] });
                setAdding(false);
              }}
            >
              Dodaj
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Nazwa</label>
            <Input value={newName} onChange={(e) => setNewName(e.target.value)} autoFocus />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Temat (opcjonalnie)</label>
            <Input value={newTopic} onChange={(e) => setNewTopic(e.target.value)} />
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        title="Usuń zestaw pytań"
        message={`Czy na pewno usunąć zestaw "${toDelete?.name}" wraz ze wszystkimi pytaniami?`}
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) removeQuestionSet(toDelete.id);
          setToDelete(null);
        }}
      />
    </div>
  );
}
