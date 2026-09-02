import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { parseQuestionsText, type ParsedQuestion } from '../../lib/parseQuestions';

export function ImportQuestionsModal({
  open,
  onClose,
  onImport,
}: {
  open: boolean;
  onClose: () => void;
  onImport: (questions: ParsedQuestion[]) => void;
}) {
  const [text, setText] = useState('');
  const parsed = parseQuestionsText(text);

  function handleClose() {
    setText('');
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Importuj pytania z tekstu"
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
            Wklej pytania (jedno na linie, opcjonalnie "pytanie | odpowiedz")
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
                      <td className="px-3 py-1.5 text-gray-900">{p.text}</td>
                      <td className="px-3 py-1.5 text-gray-500">{p.answer ?? ''}</td>
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
