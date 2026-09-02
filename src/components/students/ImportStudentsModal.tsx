import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { parseStudentsText, type ParsedStudent } from '../../lib/parseStudents';

export function ImportStudentsModal({
  open,
  onClose,
  onImport,
}: {
  open: boolean;
  onClose: () => void;
  onImport: (students: ParsedStudent[]) => void;
}) {
  const [text, setText] = useState('');
  const parsed = parseStudentsText(text);

  function handleClose() {
    setText('');
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Importuj uczniow z tekstu"
      widthClassName="max-w-2xl"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Anuluj
          </Button>
          <Button
            disabled={parsed.length === 0}
            onClick={() => {
              onImport(parsed);
              setText('');
            }}
          >
            Zatwierdz ({parsed.length})
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Wklej liste (jedna osoba na linie, np. "1. Nazwisko Imie - uwaga")
          </label>
          <Textarea rows={8} value={text} onChange={(e) => setText(e.target.value)} autoFocus />
        </div>
        {parsed.length > 0 && (
          <div>
            <p className="mb-1.5 text-sm font-medium text-gray-700">Podglad ({parsed.length})</p>
            <div className="max-h-56 overflow-y-auto rounded-md border border-gray-200">
              <table className="min-w-full text-sm">
                <tbody className="divide-y divide-gray-100">
                  {parsed.map((p, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-1.5 text-gray-500">{p.number ?? idx + 1}</td>
                      <td className="px-3 py-1.5 text-gray-900">{p.lastName}</td>
                      <td className="px-3 py-1.5 text-gray-900">{p.firstName}</td>
                      <td className="px-3 py-1.5 text-gray-500">{p.note ?? ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
