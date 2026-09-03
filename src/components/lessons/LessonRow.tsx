import { useNavigate } from 'react-router-dom';
import type { Lesson } from '../../data/types';
import { Button } from '../ui/Button';
import { TD, TR } from '../ui/Table';
import { STATUS_BADGE_CLASSES, STATUS_LABELS } from './lessonStatus';
import { copyToClipboard } from '../../lib/clipboard';

export function LessonRow({
  lesson,
  index,
  total,
  onMoveUp,
  onMoveDown,
  onSkip,
  onMarkDone,
  onRestore,
  onDuplicate,
  onCopyToClass,
  onRemove,
}: {
  lesson: Lesson;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onSkip: () => void;
  onMarkDone: () => void;
  onRestore: () => void;
  onDuplicate: () => void;
  onCopyToClass: () => void;
  onRemove: () => void;
}) {
  const navigate = useNavigate();
  const registerTopic = lesson.registerTopic || lesson.title;
  const curriculum = lesson.curriculum ?? [];

  async function handleCopyRegister() {
    const text =
      curriculum.length > 0 ? `${registerTopic}\nKody: ${curriculum.join(', ')}` : registerTopic;
    await copyToClipboard(text);
  }

  return (
    <TR>
      <TD className="w-10 text-gray-400">{index + 1}</TD>
      <TD className="font-medium text-gray-900">
        <p>{lesson.title}</p>
        <p className="mt-0.5 flex items-center gap-1.5 text-xs font-normal text-gray-500">
          <span>
            Dziennik: {registerTopic}
            {curriculum.length > 0 ? ` · ${curriculum.join(', ')}` : ''}
          </span>
          <button
            type="button"
            onClick={handleCopyRegister}
            className="text-accent-600 hover:underline"
          >
            Kopiuj
          </button>
        </p>
      </TD>
      <TD className="text-gray-600">{lesson.topic ?? '-'}</TD>
      <TD className="text-gray-600">{lesson.slides.length}</TD>
      <TD className="text-gray-600">{lesson.plannedDate ?? '-'}</TD>
      <TD>
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE_CLASSES[lesson.status]}`}
        >
          {STATUS_LABELS[lesson.status]}
        </span>
      </TD>
      <TD>
        <div className="flex flex-wrap items-center gap-1">
          <Button size="sm" variant="secondary" onClick={() => navigate(`/lekcje/${lesson.id}/pokaz`)}>
            Pokaż
          </Button>
          <Button size="sm" variant="secondary" onClick={() => navigate(`/lekcje/${lesson.id}/edytuj`)}>
            Edytuj
          </Button>
          <Button size="sm" variant="ghost" disabled={index === 0} onClick={onMoveUp}>
            Góra
          </Button>
          <Button size="sm" variant="ghost" disabled={index === total - 1} onClick={onMoveDown}>
            Dół
          </Button>
          {lesson.status !== 'skipped' && lesson.status !== 'done' && (
            <Button size="sm" variant="ghost" onClick={onSkip}>
              Pomiń
            </Button>
          )}
          {lesson.status !== 'done' && (
            <Button size="sm" variant="ghost" onClick={onMarkDone}>
              Zrobione
            </Button>
          )}
          {(lesson.status === 'skipped' || lesson.status === 'done') && (
            <Button size="sm" variant="ghost" onClick={onRestore}>
              Przywróć
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={onDuplicate}>
            Duplikuj
          </Button>
          <Button size="sm" variant="ghost" onClick={onCopyToClass}>
            Skopiuj do innej klasy
          </Button>
          <Button size="sm" variant="danger" onClick={onRemove}>
            Usuń
          </Button>
        </div>
      </TD>
    </TR>
  );
}
