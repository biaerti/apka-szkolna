// Modal wyboru ucznia - uzywany zarowno przy "kto podpowiadal" (hint_plomba dla
// wybranego ucznia), jak i przy "komu wpisac uwage" (result: uwaga). Tresc
// naglowka podaje wywolujacy przez prop `title`.

import { Modal } from '../ui/Modal';
import type { Student } from '../../data/types';

export interface StudentPickerProps {
  open: boolean;
  title: string;
  students: Student[];
  excludeStudentId?: string | null;
  onPick: (studentId: string) => void;
  onClose: () => void;
}

export function StudentPicker({ open, title, students, excludeStudentId, onPick, onClose }: StudentPickerProps) {
  const options = students.filter((st) => st.id !== excludeStudentId);

  return (
    <Modal open={open} onClose={onClose} title={title}>
      {options.length === 0 ? (
        <p className="text-sm text-gray-500">Brak innych uczniów do wyboru.</p>
      ) : (
        <div className="max-h-80 space-y-1 overflow-y-auto">
          {options.map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => {
                onPick(st.id);
                onClose();
              }}
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
