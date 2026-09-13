// Nowa lekcja: tylko tytul. Rocznik wynika z aktywnej zakladki, reszta (slajdy,
// pytania do kola, wpis do dziennika) robi sie w edytorze - jedno pole zamiast
// piecu, bo nauczyciel i tak zaraz laduje w edytorze.

import { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import type { LessonMaterialType } from '../../data/types';

export function NewLessonModal({
  open,
  onClose,
  classNames,
  onCreate,
  initialType = 'textbook',
}: {
  open: boolean;
  onClose: () => void;
  /** Nazwy klas rocznika, np. "IV A, IV B, IV C" - trafia do zdania pod polem. */
  classNames: string;
  onCreate: (title: string, materialType: LessonMaterialType) => void;
  initialType?: LessonMaterialType;
}) {
  const [title, setTitle] = useState('');
  const [materialType, setMaterialType] = useState<LessonMaterialType>(initialType);
  const canCreate = title.trim().length > 0;

  useEffect(() => {
    if (!open) setMaterialType(initialType);
  }, [initialType, open]);

  function close() {
    setTitle('');
    setMaterialType(initialType);
    onClose();
  }

  function create() {
    if (!canCreate) return;
    onCreate(title.trim(), materialType);
    setTitle('');
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title="Nowa lekcja"
      footer={
        <>
          <Button variant="secondary" onClick={close}>
            Anuluj
          </Button>
          <Button onClick={create} disabled={!canCreate}>
            Utwórz i edytuj
          </Button>
        </>
      }
    >
      <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="new-lesson-title">
        Tytuł
      </label>
      <Input
        id="new-lesson-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            create();
          }
        }}
        autoFocus
        placeholder="np. Rzeczownik - odmiana przez przypadki"
      />
      <label className="mb-1 mt-4 block text-sm font-medium text-gray-700" htmlFor="new-lesson-type">
        Rodzaj materiału
      </label>
      <Select id="new-lesson-type" value={materialType} onChange={(e) => setMaterialType(e.target.value as LessonMaterialType)}>
        <option value="textbook">Lekcja z podręcznika</option>
        <option value="review">Lekcja powtórzeniowa</option>
      </Select>
      <p className="mt-2 text-xs text-gray-500">Lekcja pojawi się w: {classNames}. Postęp każda klasa ma osobny.</p>
    </Modal>
  );
}
