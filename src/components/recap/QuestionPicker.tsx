// Panel "wybierz pytanie": lista wszystkich pytan zestawu, z ktorej nauczyciel
// bierze konkretne pytanie zamiast czekac, az wypadnie po kolei albo losowo.
// Pytania, ktore juz padly w tej sesji, sa wygaszone i podpisane - zeby nie
// pytac dwa razy o to samo.
//
// Wysuwany panel, a nie stala kolumna: ekran powtorki idzie na projektor i
// pytanie musi miec cala szerokosc.

import type { Question } from '../../data/types';

export interface QuestionPickerProps {
  open: boolean;
  questions: Question[];
  currentQuestionId: string | null;
  askedQuestionIds: Set<string>;
  onPick: (questionId: string) => void;
  onClose: () => void;
}

export function QuestionPicker({
  open,
  questions,
  currentQuestionId,
  askedQuestionIds,
  onPick,
  onClose,
}: QuestionPickerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-30 flex justify-end bg-black/60">
      {/* Klikniecie w tlo zamyka panel. */}
      <button
        type="button"
        aria-label="Zamknij wybór pytania"
        onClick={onClose}
        className="flex-1 cursor-default"
      />

      <div className="flex h-full w-full max-w-2xl flex-col border-l border-gray-700 bg-gray-900 text-gray-100">
        <div className="flex shrink-0 items-center justify-between border-b border-gray-700 px-5 py-3">
          <div>
            <p className="text-lg font-semibold">Wybierz pytanie</p>
            <p className="text-xs text-gray-400">
              {questions.length} pytań w zestawie, zadane w tej sesji: {askedQuestionIds.size}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-600 px-3 py-1.5 text-sm hover:bg-gray-800"
          >
            zamknij
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {questions.map((question, index) => {
            const asked = askedQuestionIds.has(question.id);
            const current = question.id === currentQuestionId;
            return (
              <button
                key={question.id}
                type="button"
                onClick={() => {
                  onPick(question.id);
                  onClose();
                }}
                className={`flex w-full items-start gap-3 border-b border-gray-800 px-5 py-3 text-left hover:bg-gray-800 ${
                  current ? 'bg-accent-900/50' : ''
                }`}
              >
                <span className="w-7 shrink-0 pt-0.5 text-sm text-gray-500">{index + 1}.</span>
                <span className="flex-1">
                  <span className={`block text-base ${asked && !current ? 'text-gray-500' : 'text-gray-100'}`}>
                    {question.text}
                  </span>
                  {(current || asked) && (
                    <span className="mt-0.5 block text-xs text-gray-400">
                      {current ? 'teraz na ekranie' : 'już było w tej sesji'}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
