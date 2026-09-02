import type { Lesson, SchoolClass } from '../../data/types';
import { nextLessons } from '../../lib/queue';
import { classBadgeClasses } from '../calendar/classColor';

export function QueuePreview({ classes, lessons }: { classes: SchoolClass[]; lessons: Lesson[] }) {
  const sortedClasses = [...classes].sort((a, b) => a.order - b.order);

  return (
    <section className="mb-8">
      <h2 className="mb-3 text-lg font-semibold text-gray-900">Następne w kolejce</h2>
      {sortedClasses.length === 0 ? (
        <p className="text-sm text-gray-500">Brak klas.</p>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white">
          <ul className="divide-y divide-gray-100">
            {sortedClasses.map((c) => {
              const [next] = nextLessons(lessons, c.id, 1);
              return (
                <li key={c.id} className="flex items-center gap-3 px-3 py-2.5">
                  <span
                    className={`shrink-0 rounded border px-1.5 py-0.5 text-xs font-medium ${classBadgeClasses(c.order)}`}
                  >
                    {c.name}
                  </span>
                  <span className="truncate text-sm text-gray-800">
                    {next ? next.title : <span className="text-gray-400">Brak zaplanowanych lekcji</span>}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
