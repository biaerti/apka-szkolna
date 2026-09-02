import { useState } from 'react';
import type { QuestionSet, SchoolClass } from '../../data/types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

export interface NewLessonData {
  title: string;
  topic?: string;
  classId: string;
  plannedDate?: string;
  questionSetId?: string;
}

export function NewLessonModal({
  open,
  onClose,
  classes,
  questionSets,
  defaultClassId,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  classes: SchoolClass[];
  questionSets: QuestionSet[];
  defaultClassId: string;
  onCreate: (data: NewLessonData) => void;
}) {
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [classId, setClassId] = useState(defaultClassId);
  const [plannedDate, setPlannedDate] = useState('');
  const [questionSetId, setQuestionSetId] = useState('');

  function reset() {
    setTitle('');
    setTopic('');
    setClassId(defaultClassId);
    setPlannedDate('');
    setQuestionSetId('');
  }

  function handleCreate() {
    if (!title.trim() || !classId) return;
    onCreate({
      title: title.trim(),
      topic: topic.trim() || undefined,
      classId,
      plannedDate: plannedDate || undefined,
      questionSetId: questionSetId || undefined,
    });
    reset();
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      title="Nowa lekcja"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Anuluj
          </Button>
          <Button onClick={handleCreate} disabled={!title.trim() || !classId}>
            Dodaj i przejdź do edytora
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Tytuł</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Temat (opcjonalnie)</label>
          <Input value={topic} onChange={(e) => setTopic(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Klasa</label>
          <Select value={classId} onChange={(e) => setClassId(e.target.value)}>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Planowana data (opcjonalnie)</label>
          <Input type="date" value={plannedDate} onChange={(e) => setPlannedDate(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Zestaw pytań na recap (opcjonalnie)</label>
          <Select value={questionSetId} onChange={(e) => setQuestionSetId(e.target.value)}>
            <option value="">Brak</option>
            {questionSets.map((qs) => (
              <option key={qs.id} value={qs.id}>
                {qs.name}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </Modal>
  );
}
