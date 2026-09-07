// "Kody podstawy programowej" z menu wiersza lekcji: temat do dziennika Vulcan
// i kody podstawy - do przejrzenia, uzupelnienia i SKOPIOWANIA, bez wchodzenia
// w edytor lekcji. Oba pola sa zwyklymi polami tekstowymi (da sie zaznaczyc
// myszka), a obok kazdego jest przycisk kopiowania z fallbackiem dla Chrome 109
// na http (patrz src/lib/clipboard.ts).
//
// Lekcja nalezy do ROCZNIKA, wiec zmiana dotyczy wszystkich jego klas naraz.

import { useState } from 'react';
import type { Lesson } from '../../data/types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { CurriculumPicker } from './CurriculumPicker';
import { copyToClipboard } from '../../lib/clipboard';

type CopyTarget = 'topic' | 'codes';

export function LessonRegisterModal({
  lesson,
  classNames,
  onClose,
  onChange,
}: {
  lesson: Lesson;
  classNames: string;
  onClose: () => void;
  onChange: (patch: Partial<Lesson>) => void;
}) {
  const [copied, setCopied] = useState<CopyTarget | null>(null);
  const registerTopic = lesson.registerTopic ?? '';
  const codes = lesson.curriculum ?? [];
  const codesText = codes.join(', ');

  async function copy(target: CopyTarget, text: string) {
    if (!text) return;
    const ok = await copyToClipboard(text);
    if (!ok) return;
    setCopied(target);
    window.setTimeout(() => setCopied((c) => (c === target ? null : c)), 1500);
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Kody podstawy programowej"
      widthClassName="max-w-2xl"
      footer={<Button onClick={onClose}>Gotowe</Button>}
    >
      <p className="mb-4 text-sm text-gray-500">
        {lesson.code && <span className="mr-1.5 font-semibold tabular-nums text-gray-600">{lesson.code}</span>}
        {lesson.title}
      </p>

      <label className="mb-1 block text-sm font-medium text-gray-700">Temat do wpisania w dzienniku</label>
      <div className="mb-4 flex items-start gap-2">
        <Input
          value={registerTopic}
          onChange={(e) => onChange({ registerTopic: e.target.value || undefined })}
          placeholder={lesson.title}
          className="flex-1"
        />
        <Button
          variant="secondary"
          onClick={() => copy('topic', registerTopic || lesson.title)}
          className="shrink-0"
        >
          {copied === 'topic' ? 'Skopiowano' : 'Kopiuj'}
        </Button>
      </div>

      <label className="mb-1 block text-sm font-medium text-gray-700">Kody podstawy programowej</label>
      <div className="mb-3 flex items-start gap-2">
        {/* Pole tylko do odczytu, ale zaznaczalne - kody zmienia sie ponizej,
            checkboxami; tutaj sa po to, zeby dalo sie je wziac do dziennika. */}
        <Input
          readOnly
          value={codesText}
          placeholder="Jeszcze bez kodów - zaznacz je poniżej"
          className="flex-1 bg-gray-50"
          onFocus={(e) => e.currentTarget.select()}
        />
        <Button variant="secondary" onClick={() => copy('codes', codesText)} disabled={codes.length === 0} className="shrink-0">
          {copied === 'codes' ? 'Skopiowano' : 'Kopiuj'}
        </Button>
      </div>

      <CurriculumPicker
        selected={codes}
        onChange={(next) => onChange({ curriculum: next.length > 0 ? next : undefined })}
      />

      <p className="mt-3 text-xs text-gray-500">Zmiany dotyczą wszystkich klas rocznika: {classNames}.</p>
    </Modal>
  );
}
