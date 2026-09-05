import { Link } from 'react-router-dom';
import type { Lesson, SchoolClass } from '../../data/types';
import { Button } from '../ui/Button';
import { classBadgeClasses } from '../calendar/classColor';
import { classesOfGrade } from '../../lib/grade';

export function TodaySection({ lessons, classes }: { lessons: Lesson[]; classes: SchoolClass[] }) {
  const sortedClasses = [...classes].sort((a, b) => a.order - b.order);
  const byClass = sortedClasses
    .map((cls) => ({
      cls,
      lessons: lessons.filter((l) => classesOfGrade(classes, l.grade).some((c) => c.id === cls.id)),
    }))
    .filter((g) => g.lessons.length > 0);

  if (byClass.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="mb-3 text-lg font-semibold text-gray-900">Dziś</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {byClass.map(({ cls, lessons: classLessons }) => (
          <div key={cls.id} className="rounded-lg border border-gray-200 bg-white p-3">
            <span
              className={`mb-2 inline-block rounded border px-1.5 py-0.5 text-xs font-medium ${classBadgeClasses(cls.order)}`}
            >
              {cls.name}
            </span>
            <ul className="space-y-2">
              {classLessons.map((l) => (
                <li key={l.id} className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm text-gray-800" title={l.title}>
                    {l.title}
                  </span>
                  <span className="flex shrink-0 gap-1.5">
                    <Link to={`/lekcje/${l.id}/pokaz/${cls.id}`}>
                      <Button size="sm" variant="secondary">
                        Pokaż
                      </Button>
                    </Link>
                    {/* Powtorka nie jest juz osobnym modulem - kolo fortuny startuje ze
                        slajdu "recap" wewnatrz prezentacji lekcji, wiec bez wlasnego
                        zestawu pytan nie ma tu czego uruchamiac osobno. */}
                    {l.questionSetId && (
                      <Link to={`/powtorka/${cls.id}/${l.questionSetId}`}>
                        <Button size="sm">Powtórka</Button>
                      </Link>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
