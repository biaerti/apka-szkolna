import { useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import type { Lesson } from '../../data/types';
import { classBadgeClasses } from './classColor';

const STATUS_LABELS: Record<Lesson['status'], string> = {
  planned: 'Zaplanowana',
  in_progress: 'W trakcie',
  done: 'Zrobiona',
  skipped: 'Pominięta',
};

export function LessonCard({
  lesson,
  className,
  classOrder,
  onDone,
  onSkip,
  onMove,
  onUnschedule,
}: {
  lesson: Lesson;
  className: string;
  classOrder: number;
  onDone: () => void;
  onSkip: () => void;
  onMove: (dateKey: string) => void;
  onUnschedule: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [movingTo, setMovingTo] = useState<string | null>(null);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full rounded-md border border-gray-200 bg-white p-2 text-left shadow-sm hover:border-accent-300 hover:shadow"
      >
        <span
          className={clsx(
            'mb-1 inline-block rounded border px-1.5 py-0.5 text-xs font-medium',
            classBadgeClasses(classOrder),
          )}
        >
          {className}
        </span>
        <p className="text-sm font-medium text-gray-900">{lesson.title}</p>
        <p className="text-xs text-gray-500">{STATUS_LABELS[lesson.status]}</p>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 w-56 rounded-md border border-gray-200 bg-white p-1 shadow-lg">
          <Link
            to={`/lekcje/${lesson.id}/pokaz`}
            className="block rounded px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            Pokaż
          </Link>
          <Link
            to={`/lekcje/${lesson.id}/edytuj`}
            className="block rounded px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            Edytuj
          </Link>
          <button
            type="button"
            className="block w-full rounded px-2 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => {
              onDone();
              setOpen(false);
            }}
          >
            Zrobione
          </button>
          <button
            type="button"
            className="block w-full rounded px-2 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => {
              onSkip();
              setOpen(false);
            }}
          >
            Pomiń
          </button>

          {movingTo === null ? (
            <button
              type="button"
              className="block w-full rounded px-2 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setMovingTo('')}
            >
              Przesuń na...
            </button>
          ) : (
            <div className="flex items-center gap-1 px-2 py-1.5">
              <input
                type="date"
                autoFocus
                value={movingTo}
                onChange={(e) => setMovingTo(e.target.value)}
                className="w-full rounded border border-gray-300 px-1.5 py-1 text-xs"
              />
              <button
                type="button"
                disabled={!movingTo}
                className="rounded bg-accent-600 px-2 py-1 text-xs font-medium text-white disabled:bg-accent-300"
                onClick={() => {
                  if (movingTo) onMove(movingTo);
                  setMovingTo(null);
                  setOpen(false);
                }}
              >
                OK
              </button>
            </div>
          )}

          <button
            type="button"
            className="block w-full rounded px-2 py-1.5 text-left text-sm text-red-600 hover:bg-red-50"
            onClick={() => {
              onUnschedule();
              setOpen(false);
            }}
          >
            Zdejmij z kalendarza
          </button>
        </div>
      )}
    </div>
  );
}
