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

export function Classes() {
  const classes = useStore((s) => s.classes);
  const students = useStore((s) => s.students);
  const lessons = useStore((s) => s.lessons);
  const addClass = useStore((s) => s.addClass);
  const updateClass = useStore((s) => s.updateClass);
  const removeClass = useStore((s) => s.removeClass);

  const [editing, setEditing] = useState<{ id: string; name: string } | null>(null);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [toDelete, setToDelete] = useState<{ id: string; name: string } | null>(null);

  const sorted = useMemo(() => [...classes].sort((a, b) => a.order - b.order), [classes]);

  function activeCount(classId: string) {
    return students.filter((s) => s.classId === classId && s.active).length;
  }

  function canDelete(classId: string) {
    const hasStudents = students.some((s) => s.classId === classId);
    const hasLessons = lessons.some((l) => l.classId === classId);
    return !hasStudents && !hasLessons;
  }

  return (
    <div>
      <PageHeader
        title="Klasy"
        description="Lista klas i liczba aktywnych uczniow."
        actions={
          <Button
            onClick={() => {
              setNewName('');
              setAdding(true);
            }}
          >
            Dodaj klase
          </Button>
        }
      />

      {sorted.length === 0 ? (
        <EmptyState title="Brak klas" description="Dodaj pierwsza klase, aby zaczac." />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Nazwa</TH>
              <TH>Aktywni uczniowie</TH>
              <TH className="text-right">Akcje</TH>
            </TR>
          </THead>
          <TBody>
            {sorted.map((c) => (
              <TR key={c.id}>
                <TD className="font-medium text-gray-900">
                  <Link to={`/klasy/${c.id}`} className="hover:text-accent-700 hover:underline">
                    {c.name}
                  </Link>
                </TD>
                <TD>{activeCount(c.id)}</TD>
                <TD className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="secondary" onClick={() => setEditing({ id: c.id, name: c.name })}>
                      Edytuj
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      disabled={!canDelete(c.id)}
                      title={!canDelete(c.id) ? 'Klasa ma uczniow lub lekcje - nie mozna usunac' : undefined}
                      onClick={() => setToDelete({ id: c.id, name: c.name })}
                    >
                      Usun
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
        title="Nowa klasa"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAdding(false)}>
              Anuluj
            </Button>
            <Button
              disabled={!newName.trim()}
              onClick={() => {
                addClass(newName.trim());
                setAdding(false);
              }}
            >
              Dodaj
            </Button>
          </>
        }
      >
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Nazwa klasy</label>
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="np. IV A"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter' && newName.trim()) {
              addClass(newName.trim());
              setAdding(false);
            }
          }}
        />
      </Modal>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edytuj klase"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditing(null)}>
              Anuluj
            </Button>
            <Button
              disabled={!editing?.name.trim()}
              onClick={() => {
                if (editing) updateClass(editing.id, { name: editing.name.trim() });
                setEditing(null);
              }}
            >
              Zapisz
            </Button>
          </>
        }
      >
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Nazwa klasy</label>
        <Input
          value={editing?.name ?? ''}
          onChange={(e) => setEditing((cur) => (cur ? { ...cur, name: e.target.value } : cur))}
          autoFocus
        />
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        title="Usun klase"
        message={`Czy na pewno usunac klase "${toDelete?.name}"? Tej operacji nie mozna cofnac.`}
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) removeClass(toDelete.id);
          setToDelete(null);
        }}
      />
    </div>
  );
}
