// Modal wyboru ucznia, ktory podpowiadal - dodaje mu zdarzenie hint_minus.

import { Modal } from '../ui/Modal';
import type { Student } from '../../data/types';

export interface HintPickerProps {
  open: boolean;
  students: Student[];
  excludeStudentId: string | null;
  onPick: (studentId: string) => void;
  onClose: () => void;
}

export function HintPicker({ open, students, excludeStudentId, onPick, onClose }: HintPickerProps) {
  const options = students.filter((st) => st.id !== excludeStudentId);

  return (
    <Modal open={open} onClose={onClose} title="Kto podpowiadał?">
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
