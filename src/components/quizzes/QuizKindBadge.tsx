import clsx from 'clsx';
import type { QuizKind } from '../../data/types';
import { quizKindLabel } from '../../lib/quiz';

// Kartkowka i klasowka roznia sie kolorem, zeby na liscie dalo sie je
// odroznic bez czytania - klasowka (po dziale) jest "powazniejsza".
export function QuizKindBadge({ kind, className }: { kind: QuizKind; className?: string }) {
  return (
    <span
      className={clsx(
        'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
        kind === 'klasowka' ? 'bg-accent-50 text-accent-700' : 'bg-amber-50 text-amber-700',
        className,
      )}
    >
      {quizKindLabel(kind)}
    </span>
  );
}
