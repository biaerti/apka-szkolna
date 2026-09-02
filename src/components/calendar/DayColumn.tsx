import clsx from 'clsx';
import type { Lesson, SchoolClass } from '../../data/types';
import { formatPl, isToday, toDateKey } from '../../lib/dates';
import { LessonCard } from './LessonCard';

export function DayColumn({
  day,
  lessons,
  classes,
  onAdd,
  onDone,
  onSkip,
  onMove,
  onUnschedule,
}: {
  day: Date;
  lessons: Lesson[];
  classes: SchoolClass[];
  onAdd: () => void;
  onDone: (lessonId: string) => void;
  onSkip: (lessonId: string) => void;
  onMove: (lessonId: string, dateKey: string) => void;
  onUnschedule: (lessonId: string) => void;
}) {
  const dateKey = toDateKey(day);
  const dayLessons = lessons
    .filter((l) => l.plannedDate === dateKey)
    .sort((a, b) => a.order - b.order);
  const today = isToday(day);

  return (
    <div className={clsx('flex min-h-[220px] flex-col rounded-lg border', today ? 'border-accent-300 bg-accent-50/40' : 'border-gray-200 bg-white')}>
      <div className="flex items-center justify-between border-b border-gray-200 px-2.5 py-2">
        <span className={clsx('text-sm font-medium', today ? 'text-accent-700' : 'text-gray-700')}>
          {formatPl(day)}
        </span>
        <button
          type="button"
          onClick={onAdd}
          title="Zaplanuj lekcję"
          className="flex h-6 w-6 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-800"
        >
          +
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-2">
        {dayLessons.length === 0 ? (
          <p className="px-1 py-2 text-xs text-gray-400">Brak lekcji</p>
        ) : (
          dayLessons.map((lesson) => {
            const cls = classes.find((c) => c.id === lesson.classId);
            return (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                className={cls?.name ?? '?'}
                classOrder={cls?.order ?? 0}
                onDone={() => onDone(lesson.id)}
                onSkip={() => onSkip(lesson.id)}
                onMove={(dk) => onMove(lesson.id, dk)}
                onUnschedule={() => onUnschedule(lesson.id)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
