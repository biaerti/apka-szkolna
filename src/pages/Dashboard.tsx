import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../data/store';
import { formatPl, toDateKey } from '../lib/dates';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { TodaySection } from '../components/dashboard/TodaySection';
import { QueuePreview } from '../components/dashboard/QueuePreview';
import { StatTiles } from '../components/dashboard/StatTiles';
import { QuickStart } from '../components/dashboard/QuickStart';
import { classesOfGrade, lessonProgress } from '../lib/grade';

export function Dashboard() {
  const classes = useStore((s) => s.classes);
  const students = useStore((s) => s.students);
  const questionSets = useStore((s) => s.questionSets);
  const lessons = useStore((s) => s.lessons);

  const today = useMemo(() => new Date(), []);
  const todayKey = toDateKey(today);

  const todayLessons = useMemo(
    () => lessons.filter((l) => l.plannedDate === todayKey),
    [lessons, todayKey],
  );

  if (lessons.length === 0) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-semibold text-gray-900">{formatPl(today)}</h1>
        <EmptyState
          title="Brak lekcji"
          description="Dodaj pierwszą lekcję, aby zobaczyć ją na pulpicie."
          action={
            <Link to="/lekcje">
              <Button>Przejdź do lekcji</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">{formatPl(today)}</h1>

      <TodaySection lessons={todayLessons} classes={classes} />

      <QueuePreview classes={classes} lessons={lessons} />

      <StatTiles
        classCount={classes.length}
        activeStudentCount={students.filter((s) => s.active).length}
        questionSetCount={questionSets.length}
        plannedLessonCount={
          lessons.filter((l) =>
            classesOfGrade(classes, l.grade).some((c) => {
              const status = lessonProgress(l, c.id).status;
              return status !== 'done' && status !== 'skipped';
            }),
          ).length
        }
      />

      <QuickStart />
    </div>
  );
}
