// Sekcja "Zestawy pytań tej klasy" pod zakladka klasy na stronie /lekcje.
// Logika reuzywa wzorca z Questions.tsx, ale ograniczona do zestawow danej klasy.

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../data/store';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { Table, THead, TBody, TR, TH, TD } from '../ui/Table';

export function ClassQuestionSets({ classId }: { classId: string }) {
  const navigate = useNavigate();
  const questionSets = useStore((s) => s.questionSets);
  const questions = useStore((s) => s.questions);
  const addQuestionSet = useStore((s) => s.addQuestionSet);
  const updateQuestionSet = useStore((s) => s.updateQuestionSet);
  const removeQuestionSet = useStore((s) => s.removeQuestionSet);

  const [editing, setEditing] = useState<{ id: string; name: string; topic: string } | null>(null);
  const [toDelete, setToDelete] = useState<{ id: string; name: string } | null>(null);

  const classSets = useMemo(
    () =>
      questionSets
        .filter((qs) => qs.classIds.includes(classId))
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    [questionSets, classId],
  );

  function questionCount(setId: string) {
    return questions.filter((q) => q.setId === setId).length;
  }

  function handleNewSet() {
    const created = addQuestionSet({ name: 'Nowy zestaw', classIds: [classId] });
    navigate(`/pytania/${created.id}`);
  }

  return (
    <div className="mt-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Zestawy pytań tej klasy</h2>
        <Button variant="secondary" onClick={handleNewSet}>
          Nowy zestaw
        </Button>
      </div>

      {classSets.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-300 bg-white px-4 py-6 text-center text-sm text-gray-500">
          Brak zestawów pytań dla tej klasy.
        </p>
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Nazwa</TH>
              <TH>Temat</TH>
              <TH>Liczba pytań</TH>
              <TH className="text-right">Akcje</TH>
            </TR>
          </THead>
          <TBody>
            {classSets.map((qs) => (
              <TR key={qs.id}>
                <TD className="font-medium text-gray-900">{qs.name}</TD>
                <TD>{qs.topic ?? '-'}</TD>
                <TD>{questionCount(qs.id)}</TD>
                <TD className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" onClick={() => navigate(`/pytania/${qs.id}`)}>
                      Pytania
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setEditing({ id: qs.id, name: qs.name, topic: qs.topic ?? '' })}
                    >
                      Zmień nazwę
                    </Button>
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
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edytuj zestaw"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditing(null)}>
              Anuluj
            </Button>
            <Button
              disabled={!editing?.name.trim()}
              onClick={() => {
                if (editing) {
                  updateQuestionSet(editing.id, { name: editing.name.trim(), topic: editing.topic.trim() || undefined });
                }
                setEditing(null);
              }}
            >
              Zapisz
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Nazwa</label>
            <Input
              value={editing?.name ?? ''}
              onChange={(e) => setEditing((cur) => (cur ? { ...cur, name: e.target.value } : cur))}
              autoFocus
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Temat (opcjonalnie)</label>
            <Input
              value={editing?.topic ?? ''}
              onChange={(e) => setEditing((cur) => (cur ? { ...cur, topic: e.target.value } : cur))}
            />
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
