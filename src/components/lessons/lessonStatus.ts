import type { LessonStatus } from '../../data/types';

export const STATUS_LABELS: Record<LessonStatus, string> = {
  planned: 'Do zrobienia',
  in_progress: 'W trakcie',
  done: 'Zrobiona',
  skipped: 'Pominięta',
};

// Kolor niesie znaczenie tylko tam, gdzie cos sie dzieje (w trakcie) albo
// skonczylo (zrobiona). "Do zrobienia" to stan domyslny wiekszosci wierszy -
// ma byc cichy, inaczej lista swieci sie jak choinka.
export const STATUS_BADGE_CLASSES: Record<LessonStatus, string> = {
  planned: 'bg-gray-100 text-gray-600',
  in_progress: 'bg-amber-100 text-amber-800',
  done: 'bg-emerald-100 text-emerald-800',
  skipped: 'bg-gray-100 text-gray-500 line-through',
};
