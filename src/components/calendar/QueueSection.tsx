import { useMemo } from 'react';
import type { Lesson, SchoolClass } from '../../data/types';
import { nextLessons } from '../../lib/queue';
import { Button } from '../ui/Button';
import { classBadgeClasses } from './classColor';

export function QueueSection({
  classes,
  lessons,
  onScheduleToday,
  onSkip,
}: {
  classes: SchoolClass[];
  lessons: Lesson[];
  onScheduleToday: (lessonId: string) => void;
  onSkip: (lessonId: string) => void;
}) {
  const sortedClasses = useMemo(() => [...classes].sort((a, b) => a.order - b.order), [classes]);

  return (
    <section className="mt-8">
      <h2 className="mb-3 text-lg font-semibold text-gray-900">Kolejka per klasa</h2>
      {sortedClasses.length === 0 ? (
        <p className="text-sm text-gray-500">Brak klas.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sortedClasses.map((c) => {
            const upcoming = nextLessons(lessons, c.id, 3);
            return (
              <div key={c.id} className="rounded-lg border border-gray-200 bg-white p-3">
                <span
                  className={`mb-2 inline-block rounded border px-1.5 py-0.5 text-xs font-medium ${classBadgeClasses(c.order)}`}
                >
                  {c.name}
                </span>
                {upcoming.length === 0 ? (
                  <p className="text-xs text-gray-400">Brak zaplanowanych lekcji</p>
                ) : (
                  <ul className="space-y-1.5">
                    {upcoming.map((l) => (
                      <li key={l.id} className="flex items-center justify-between gap-2 text-sm">
                        <span className="truncate text-gray-800" title={l.title}>
                          {l.title}
                        </span>
                        <span className="flex shrink-0 gap-1">
                          <Button size="sm" variant="secondary" onClick={() => onScheduleToday(l.id)}>
                            Dziś
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => onSkip(l.id)}>
                            Pomiń
                          </Button>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
