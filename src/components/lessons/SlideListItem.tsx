import clsx from 'clsx';
import type { Slide } from '../../data/types';
import { Button } from '../ui/Button';
import { SLIDE_KIND_LABELS, slideSummary } from './slideDefaults';

export function SlideListItem({
  slide,
  index,
  total,
  selected,
  onSelect,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onRemove,
}: {
  slide: Slide;
  index: number;
  total: number;
  selected: boolean;
  onSelect: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onRemove: () => void;
}) {
  return (
    <div
      className={clsx(
        'cursor-pointer border-b border-gray-100 px-3 py-2.5 last:border-b-0',
        selected ? 'bg-accent-50' : 'hover:bg-gray-50',
      )}
      onClick={onSelect}
    >
      <div className="flex items-center gap-2">
        <span className="w-5 shrink-0 text-xs text-gray-400">{index + 1}</span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-900">{slideSummary(slide)}</p>
          <p className="text-xs text-gray-500">{SLIDE_KIND_LABELS[slide.kind]}</p>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        <Button size="sm" variant="ghost" disabled={index === 0} onClick={onMoveUp} title="Przesuń w górę">
          Góra
        </Button>
        <Button size="sm" variant="ghost" disabled={index === total - 1} onClick={onMoveDown} title="Przesuń w dół">
          Dół
        </Button>
        <Button size="sm" variant="ghost" onClick={onDuplicate}>
          Duplikuj
        </Button>
        <Button size="sm" variant="danger" onClick={onRemove}>
          Usuń
        </Button>
      </div>
    </div>
  );
}
