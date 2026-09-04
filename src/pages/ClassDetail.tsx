import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../data/store';
import { PageHeader } from '../components/ui/PageHeader';
import { Table, THead, TBody, TR, TH, TD } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { StudentFormModal, type StudentFormValue } from '../components/students/StudentFormModal';
import { ImportStudentsModal } from '../components/students/ImportStudentsModal';
import { ClassStats } from '../components/stats/ClassStats';
import { Settlements } from '../components/stats/Settlements';
import type { Student } from '../data/types';

/**
 * Widok klasy laczy trzy rzeczy, ktore wczesniej byly rozrzucone po aplikacji:
 * liste uczniow, ich bilans miesiaca (dawna zakladka "Statystyki") i rozliczenia
 * plomb. Nauczyciel chcial jedno miejsce - klasa - zamiast dublujacych sie ekranow.
 */
type ClassTab = 'uczniowie' | 'bilans' | 'rozliczenia';

const TAB_LABELS: Record<ClassTab, string> = {
  uczniowie: 'Uczniowie',
  bilans: 'Bilans miesiąca',
  rozliczenia: 'Do rozliczenia',
};

export function ClassDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const classes = useStore((s) => s.classes);
  const students = useStore((s) => s.students);
  const addStudent = useStore((s) => s.addStudent);
  const updateStudent = useStore((s) => s.updateStudent);
  const removeStudent = useStore((s) => s.removeStudent);
  const setActive = useStore((s) => s.setActive);

  const [showInactive, setShowInactive] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Student | null>(null);
  const [tab, setTab] = useState<ClassTab>('uczniowie');

  const schoolClass = classes.find((c) => c.id === id);

  const classStudents = useMemo(
    () =>
      students
        .filter((s) => s.classId === id)
        .filter((s) => showInactive || s.active)
        .sort((a, b) => a.number - b.number),
    [students, id, showInactive],
  );

  if (!schoolClass) {
    return (
      <EmptyState
        title="Nie znaleziono klasy"
        description="Ta klasa mogła zostać usunięta."
        action={
          <Button variant="secondary" onClick={() => navigate('/klasy')}>
            Wróć do listy klas
          </Button>
        }
      />
    );
  }

  const nextNumber = students.filter((s) => s.classId === id).length + 1;

  function handleSave(value: StudentFormValue) {
    if (editingStudent) {
      updateStudent(editingStudent.id, {
        number: value.number,
        lastName: value.lastName.trim(),
        firstName: value.firstName.trim(),
        note: value.note.trim() || undefined,
      });
    } else if (id) {
      addStudent({
        classId: id,
        number: value.number,
        lastName: value.lastName.trim(),
        firstName: value.firstName.trim(),
        note: value.note.trim() || undefined,
        active: true,
      });
    }
    setFormOpen(false);
    setEditingStudent(null);
  }

  return (
    <div>
      <p className="mb-2 text-sm">
        <Link to="/klasy" className="text-gray-500 hover:text-accent-700 hover:underline">
          Klasy
        </Link>
        <span className="mx-1.5 text-gray-400">/</span>
        <span className="text-gray-700">{schoolClass.name}</span>
      </p>
      <PageHeader
        title={`Uczniowie - ${schoolClass.name}`}
        actions={
          <>
            <Button variant="secondary" onClick={() => setImportOpen(true)}>
              Importuj z tekstu
            </Button>
            <Button
              onClick={() => {
                setEditingStudent(null);
                setFormOpen(true);
              }}
            >
              Dodaj ucznia
            </Button>
          </>
        }
      />

      <div className="mb-4 flex gap-1 border-b border-gray-200">
        {(Object.keys(TAB_LABELS) as ClassTab[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={
              tab === key
                ? '-mb-px border-b-2 border-accent-600 px-3 py-2 text-sm font-medium text-accent-700'
                : '-mb-px border-b-2 border-transparent px-3 py-2 text-sm text-gray-500 hover:text-gray-700'
            }
          >
            {TAB_LABELS[key]}
          </button>
        ))}
      </div>

      {tab === 'bilans' && <ClassStats students={classStudents} />}
      {tab === 'rozliczenia' && id && <Settlements classId={id} />}

      {tab === 'uczniowie' && (
      <>
      <label className="mb-3 flex w-fit items-center gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          className="rounded border-gray-300 text-accent-600 focus:ring-accent-500"
          checked={showInactive}
          onChange={(e) => setShowInactive(e.target.checked)}
        />
        Pokaż nieaktywnych
      </label>

      {classStudents.length === 0 ? (
        <EmptyState title="Brak uczniów" description="Dodaj uczniów ręcznie lub zaimportuj listę z tekstu." />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Nr</TH>
              <TH>Nazwisko</TH>
              <TH>Imię</TH>
              <TH>Uwaga</TH>
              <TH>Aktywny</TH>
              <TH className="text-right">Akcje</TH>
            </TR>
          </THead>
          <TBody>
            {classStudents.map((s) => (
              <TR key={s.id} className={s.active ? '' : 'opacity-50'}>
                <TD>{s.number}</TD>
                <TD className="font-medium text-gray-900">{s.lastName}</TD>
                <TD>{s.firstName}</TD>
                <TD>{s.note ?? ''}</TD>
                <TD>{s.active ? 'Tak' : 'Nie'}</TD>
                <TD className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setEditingStudent(s);
                        setFormOpen(true);
                      }}
                    >
                      Edytuj
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setActive(s.id, !s.active)}>
                      {s.active ? 'Dezaktywuj' : 'Aktywuj'}
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => setToDelete(s)}>
                      Usuń
                    </Button>
                  </div>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
      </>
      )}

      <StudentFormModal
        open={formOpen}
        student={editingStudent}
        nextNumber={nextNumber}
        onClose={() => {
          setFormOpen(false);
          setEditingStudent(null);
        }}
        onSave={handleSave}
      />

      <ImportStudentsModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={(parsed) => {
          if (!id) return;
          let counter = students.filter((s) => s.classId === id).length;
          for (const p of parsed) {
            counter += 1;
            addStudent({
              classId: id,
              number: p.number ?? counter,
              lastName: p.lastName,
              firstName: p.firstName,
              note: p.note,
              active: true,
            });
          }
          setImportOpen(false);
        }}
      />

      <ConfirmDialog
        open={!!toDelete}
        title="Usuń ucznia"
        message={`Czy na pewno trwale usunąć ucznia "${toDelete?.lastName} ${toDelete?.firstName}"? Historia powtórek zostanie zachowana, ale ucznia nie da się odzyskać.`}
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) removeStudent(toDelete.id);
          setToDelete(null);
        }}
      />
    </div>
  );
}
