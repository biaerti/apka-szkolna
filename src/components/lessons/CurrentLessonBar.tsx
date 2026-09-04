// Lekki pasek "gdzie aktualnie jestem" zamiast pelnego kalendarza (nauczyciel:
// "wolalbym widok kalendarza miec po prostu w widoku lekcji" - bez siatki
// tygodnia i planowania dat, jedna linijka: biezaca lekcja + co dalej w kolejce).

import { Link } from 'react-router-dom';
import type { Lesson } from '../../data/types';
import { nextLessons } from '../../lib/queue';

export function CurrentLessonBar({ classId, lessons }: { classId: string; lessons: Lesson[] }) {
  const [current, next] = nextLessons(lessons, classId, 2);

  if (!current) {
    return (
      <p className="mb-4 rounded-md border border-dashed border-gray-300 bg-white px-3 py-2 text-sm text-gray-500">
        Brak zaplanowanych lekcji w tej klasie.
      </p>
    );
  }

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm">
      <span className="text-gray-500">Teraz:</span>
      <span className="font-medium text-gray-900">{current.title}</span>
      <Link to={`/lekcje/${current.id}/pokaz`} className="text-accent-600 hover:underline">
        Pokaż
      </Link>
      {next && (
        <>
          <span className="text-gray-300">|</span>
          <span className="text-gray-500">Dalej:</span>
          <span className="text-gray-700">{next.title}</span>
        </>
      )}
    </div>
  );
}
