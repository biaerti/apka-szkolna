import { useState } from 'react';
import type { SchoolClass } from '../../data/types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';

export function CopyLessonModal({
  open,
  onClose,
  classes,
  excludeClassId,
  onCopy,
}: {
  open: boolean;
  onClose: () => void;
  classes: SchoolClass[];
  excludeClassId: string;
  onCopy: (targetClassId: string) => void;
}) {
  const targets = classes.filter((c) => c.id !== excludeClassId);
  const [targetClassId, setTargetClassId] = useState(targets[0]?.id ?? '');

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Skopiuj lekcję do innej klasy"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Anuluj
          </Button>
          <Button
            onClick={() => {
              if (!targetClassId) return;
              onCopy(targetClassId);
            }}
            disabled={!targetClassId}
          >
            Kopiuj
          </Button>
        </>
      }
    >
      {targets.length === 0 ? (
        <p className="text-sm text-gray-500">Brak innych klas do wyboru.</p>
      ) : (
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Klasa docelowa</label>
          <Select value={targetClassId} onChange={(e) => setTargetClassId(e.target.value)}>
            {targets.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
      )}
    </Modal>
  );
}
