import { useMemo, useState } from 'react';
import type { Lesson, SchoolClass } from '../../data/types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';

const NEW_LESSON_VALUE = '__new__';

export function ScheduleLessonModal({
  open,
  dateKey,
  classes,
  lessons,
  onClose,
  onScheduleExisting,
  onCreateAndSchedule,
}: {
  open: boolean;
  dateKey: string | null;
  classes: SchoolClass[];
  lessons: Lesson[];
  onClose: () => void;
  onScheduleExisting: (lessonId: string) => void;
  onCreateAndSchedule: (classId: string, title: string) => void;
}) {
  const [classId, setClassId] = useState('');
  const [lessonChoice, setLessonChoice] = useState('');
  const [newTitle, setNewTitle] = useState('');

  const sortedClasses = useMemo(() => [...classes].sort((a, b) => a.order - b.order), [classes]);

  const unscheduled = useMemo(
    () =>
      lessons
        .filter((l) => l.classId === classId && l.status === 'planned' && !l.plannedDate)
        .sort((a, b) => a.order - b.order),
    [lessons, classId],
  );

  function reset() {
    setClassId('');
    setLessonChoice('');
    setNewTitle('');
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleSubmit() {
    if (!classId) return;
    if (lessonChoice === NEW_LESSON_VALUE) {
      if (!newTitle.trim()) return;
      onCreateAndSchedule(classId, newTitle.trim());
    } else if (lessonChoice) {
      onScheduleExisting(lessonChoice);
    } else {
      return;
    }
    reset();
  }

  const canSubmit = classId && (lessonChoice === NEW_LESSON_VALUE ? newTitle.trim().length > 0 : !!lessonChoice);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={`Zaplanuj lekcję${dateKey ? ` – ${dateKey}` : ''}`}
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Anuluj
          </Button>
          <Button disabled={!canSubmit} onClick={handleSubmit}>
            Zaplanuj
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Klasa</label>
          <Select
            value={classId}
            onChange={(e) => {
              setClassId(e.target.value);
              setLessonChoice('');
            }}
            autoFocus
          >
            <option value="">Wybierz klasę</option>
            {sortedClasses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>

        {classId && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Lekcja</label>
            <Select value={lessonChoice} onChange={(e) => setLessonChoice(e.target.value)}>
              <option value="">Wybierz lekcję</option>
              {unscheduled.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title}
                </option>
              ))}
              <option value={NEW_LESSON_VALUE}>+ Nowa lekcja</option>
            </Select>
          </div>
        )}

        {lessonChoice === NEW_LESSON_VALUE && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Tytuł nowej lekcji</label>
            <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="np. Rozdział 3" />
          </div>
        )}
      </div>
    </Modal>
  );
}
