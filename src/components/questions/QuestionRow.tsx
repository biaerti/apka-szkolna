import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { Question } from '../../data/types';

export function QuestionRow({
  question,
  index,
  total,
  onChangeText,
  onChangeAnswer,
  onMoveUp,
  onMoveDown,
  onRemove,
}: {
  question: Question;
  index: number;
  total: number;
  onChangeText: (text: string) => void;
  onChangeAnswer: (answer: string) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-start gap-2 border-b border-gray-100 px-4 py-2.5 last:border-b-0">
      <span className="mt-2 w-6 shrink-0 text-sm text-gray-400">{index + 1}.</span>
      <div className="flex flex-1 flex-col gap-2 sm:flex-row">
        <Input
          value={question.text}
          onChange={(e) => onChangeText(e.target.value)}
          placeholder="Tresc pytania"
          className="flex-1"
        />
        <Input
          value={question.answer ?? ''}
          onChange={(e) => onChangeAnswer(e.target.value)}
          placeholder="Odpowiedz (opcjonalnie)"
          className="flex-1"
        />
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Button size="sm" variant="ghost" disabled={index === 0} onClick={onMoveUp} title="Przesun w gore">
          Gora
        </Button>
        <Button size="sm" variant="ghost" disabled={index === total - 1} onClick={onMoveDown} title="Przesun w dol">
          Dol
        </Button>
        <Button size="sm" variant="danger" onClick={onRemove}>
          Usun
        </Button>
      </div>
    </div>
  );
}
