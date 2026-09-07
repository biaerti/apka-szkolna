// Modal "Nowa kartkówka" / "Nowa klasówka": klasa, tytul, data. Tytul
// podpowiada sie z rodzaju i daty (defaultQuizTitle) i przelicza sie, dopoki
// nauczyciel go sam nie nadpisze.

import { useEffect, useState } from 'react';
import type { QuizKind, SchoolClass } from '../../data/types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import { defaultQuizTitle, quizKindTitle } from '../../lib/quiz';
import { todayKey } from '../../lib/grade';

export interface NewQuizValues {
  classId: string;
  title: string;
  date: string;
}

export function NewQuizModal({
  kind,
  classes,
  defaultClassId,
  onClose,
  onCreate,
}: {
  /** null = modal zamkniety. */
  kind: QuizKind | null;
  classes: SchoolClass[];
  defaultClassId?: string;
  onClose: () => void;
  onCreate: (values: NewQuizValues) => void;
}) {
  const [classId, setClassId] = useState('');
  const [date, setDate] = useState(todayKey());
  const [title, setTitle] = useState('');
  const [titleTouched, setTitleTouched] = useState(false);

  // Reset pol przy kazdym otwarciu.
  useEffect(() => {
    if (!kind) return;
    const today = todayKey();
    setClassId(defaultClassId ?? classes[0]?.id ?? '');
    setDate(today);
    setTitle(defaultQuizTitle(kind, today));
    setTitleTouched(false);
  }, [kind, defaultClassId, classes]);

  useEffect(() => {
    if (kind && !titleTouched) setTitle(defaultQuizTitle(kind, date));
  }, [kind, date, titleTouched]);

  if (!kind) return null;
  const canCreate = classId !== '' && title.trim() !== '';

  function submit() {
    if (!canCreate) return;
    onCreate({ classId, title: title.trim(), date });
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={`Nowa ${quizKindTitle(kind).toLowerCase()}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Anuluj
          </Button>
          <Button onClick={submit} disabled={!canCreate}>
            Utwórz
          </Button>
        </>
      }
    >
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Klasa</span>
          <Select value={classId} onChange={(e) => setClassId(e.target.value)}>
            {classes.length === 0 && <option value="">Brak klas</option>}
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Data</span>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Tytuł</span>
          <Input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setTitleTouched(true);
            }}
            autoFocus
          />
        </label>
      </form>
    </Modal>
  );
}
