// "Gdzie jestem z ta klasa": biezaca lekcja + nastepna w kolejce. Jedna linijka
// zamiast kalendarza - nauczyciel nie planuje dat, prowadzi lekcje po kolei.

import { Link } from 'react-router-dom';
import type { Lesson, SchoolClass } from '../../data/types';
import { nextLessons } from '../../lib/queue';

export function CurrentLessonBar({
  classId,
  classes,
  lessons,
}: {
  classId: string;
  classes: SchoolClass[];
  lessons: Lesson[];
}) {
  const [current, next] = nextLessons(lessons, classes, classId, 2);
  if (!current) return null;

  return (
    <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-lg border border-accent-100 bg-accent-50 px-4 py-2.5 text-sm">
      <span className="text-accent-700">Teraz</span>
      <Link
        to={`/lekcje/${current.id}/pokaz/${classId}`}
        className="font-medium text-gray-900 underline-offset-2 hover:text-accent-700 hover:underline"
      >
        {current.title}
      </Link>
      {next && (
        <>
          <span className="ml-auto text-gray-500">Dalej</span>
          <span className="text-gray-700">{next.title}</span>
        </>
      )}
    </div>
  );
}
