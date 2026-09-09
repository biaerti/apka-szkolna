// Modal "Komu wpisać uwagę?" na ekranie kola powtorzeniowego: najpierw uczen,
// potem tresc uwagi. Dwa kroki w jednym oknie - nauczyciel klika nazwisko i od
// razu widzi gotowce, bez wracania do listy.
//
// Zastapil sam StudentPicker: uwaga bez tresci nie jest przypominajka, tylko
// zagadka przy wpisywaniu do dziennika wieczorem (patrz src/pages/Uwagi.tsx).

import { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal';
import type { Student } from '../../data/types';
import { UwagaNoteChoices } from './UwagaNoteChoices';

export interface UwagaPickerProps {
  open: boolean;
  students: Student[];
  onPick: (studentId: string, note: string) => void;
  onClose: () => void;
}

export function UwagaPicker({ open, students, onPick, onClose }: UwagaPickerProps) {
  const [student, setStudent] = useState<Student | null>(null);

  // Kazde otwarcie zaczyna od listy uczniow, a nie od poprzedniego wyboru.
  useEffect(() => {
    if (open) setStudent(null);
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} title={student ? 'Za co uwaga?' : 'Komu wpisać uwagę?'}>
      {student ? (
        <UwagaNoteChoices
          title={`${student.lastName} ${student.firstName}`}
          onPick={(note) => {
            onPick(student.id, note);
            onClose();
          }}
          onCancel={() => setStudent(null)}
        />
      ) : students.length === 0 ? (
        <p className="text-sm text-gray-500">Brak uczniów do wyboru.</p>
      ) : (
        <div className="max-h-80 space-y-1 overflow-y-auto">
          {students.map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => setStudent(st)}
              className="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-800 hover:bg-gray-100"
            >
              {st.lastName} {st.firstName}
            </button>
          ))}
        </div>
      )}
    </Modal>
  );
}
