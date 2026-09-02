import type { Lesson, SchoolClass } from '../../data/types';
import { Button } from '../ui/Button';
import { classBadgeClasses } from './classColor';

export function OverdueSection({
  lessons,
  classes,
  onMoveToToday,
}: {
  lessons: Lesson[];
  classes: SchoolClass[];
  onMoveToToday: (lessonId: string) => void;
}) {
  if (lessons.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="mb-3 text-lg font-semibold text-gray-900">Zaległe</h2>
      <div className="rounded-lg border border-red-200 bg-red-50">
        <ul className="divide-y divide-red-100">
          {lessons.map((l) => {
            const cls = classes.find((c) => c.id === l.classId);
            return (
              <li key={l.id} className="flex items-center justify-between gap-3 px-3 py-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className={`shrink-0 rounded border px-1.5 py-0.5 text-xs font-medium ${classBadgeClasses(cls?.order ?? 0)}`}
                  >
                    {cls?.name ?? '?'}
                  </span>
                  <span className="truncate text-sm text-gray-800">{l.title}</span>
                  <span className="shrink-0 text-xs text-red-600">{l.plannedDate}</span>
                </div>
                <Button size="sm" variant="secondary" onClick={() => onMoveToToday(l.id)}>
                  Przenieś na dziś
                </Button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
