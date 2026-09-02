import type { Lesson } from '../../data/types';

export const STATUS_LABELS: Record<Lesson['status'], string> = {
  planned: 'Planowana',
  in_progress: 'W trakcie',
  done: 'Zrobiona',
  skipped: 'Pominięta',
};

export const STATUS_BADGE_CLASSES: Record<Lesson['status'], string> = {
  planned: 'bg-gray-100 text-gray-700',
  in_progress: 'bg-amber-100 text-amber-800',
  done: 'bg-green-100 text-green-800',
  skipped: 'bg-red-100 text-red-700',
};
