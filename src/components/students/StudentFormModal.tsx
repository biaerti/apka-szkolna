import { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { Student } from '../../data/types';

export interface StudentFormValue {
  number: number;
  lastName: string;
  firstName: string;
  note: string;
}

function emptyValue(nextNumber: number): StudentFormValue {
  return { number: nextNumber, lastName: '', firstName: '', note: '' };
}

export function StudentFormModal({
  open,
  student,
  nextNumber,
  onClose,
  onSave,
}: {
  open: boolean;
  student: Student | null;
  nextNumber: number;
  onClose: () => void;
  onSave: (value: StudentFormValue) => void;
}) {
  const [value, setValue] = useState<StudentFormValue>(emptyValue(nextNumber));

  useEffect(() => {
    if (!open) return;
    if (student) {
      setValue({
        number: student.number,
        lastName: student.lastName,
        firstName: student.firstName,
        note: student.note ?? '',
      });
    } else {
      setValue(emptyValue(nextNumber));
    }
  }, [open, student, nextNumber]);

  const valid = value.lastName.trim() && value.firstName.trim() && value.number > 0;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={student ? 'Edytuj ucznia' : 'Dodaj ucznia'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Anuluj
          </Button>
          <Button disabled={!valid} onClick={() => valid && onSave(value)}>
            Zapisz
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Nr</label>
            <Input
              type="number"
              min={1}
              value={value.number}
              onChange={(e) => setValue((v) => ({ ...v, number: parseInt(e.target.value, 10) || 0 }))}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Nazwisko</label>
            <Input
              value={value.lastName}
              onChange={(e) => setValue((v) => ({ ...v, lastName: e.target.value }))}
              autoFocus
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Imię</label>
            <Input value={value.firstName} onChange={(e) => setValue((v) => ({ ...v, firstName: e.target.value }))} />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Uwaga (opcjonalnie)</label>
          <Input
            value={value.note}
            onChange={(e) => setValue((v) => ({ ...v, note: e.target.value }))}
            placeholder="np. orzeczenie"
          />
        </div>
      </div>
    </Modal>
  );
}
