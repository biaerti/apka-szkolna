// Kopia lekcji do INNEGO rocznika (np. powtorka klasy 4 przydaje sie tez piatym).
// W obrebie rocznika kopiowanie nie istnieje - lekcja i tak jest wspolna.

import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';

export function CopyLessonModal({
  open,
  onClose,
  grades,
  onCopy,
}: {
  open: boolean;
  onClose: () => void;
  /** Roczniki docelowe (bez biezacego), etykiety typu "klasy V". */
  grades: Array<{ grade: string; label: string }>;
  onCopy: (grade: string) => void;
}) {
  const [target, setTarget] = useState(grades[0]?.grade ?? '');

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Skopiuj lekcję do innego rocznika"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Anuluj
          </Button>
          <Button onClick={() => target && onCopy(target)} disabled={!target}>
            Kopiuj
          </Button>
        </>
      }
    >
      <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="copy-target-grade">
        Rocznik docelowy
      </label>
      <Select id="copy-target-grade" value={target} onChange={(e) => setTarget(e.target.value)}>
        {grades.map((g) => (
          <option key={g.grade} value={g.grade}>
            {g.label}
          </option>
        ))}
      </Select>
      <p className="mt-2 text-xs text-gray-500">Kopia dostaje własne slajdy i własny zestaw pytań - zmiany w jednej nie ruszą drugiej.</p>
    </Modal>
  );
}
