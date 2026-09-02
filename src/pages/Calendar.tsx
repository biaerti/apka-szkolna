import { useMemo, useState } from 'react';
import { useStore } from '../data/store';
import { PageHeader } from '../components/ui/PageHeader';
import { addDays, formatPl, toDateKey, weekDays } from '../lib/dates';
import { overdue } from '../lib/queue';
import { DayColumn } from '../components/calendar/DayColumn';
import { WeekNav } from '../components/calendar/WeekNav';
import { ScheduleLessonModal } from '../components/calendar/ScheduleLessonModal';
import { QueueSection } from '../components/calendar/QueueSection';
import { OverdueSection } from '../components/calendar/OverdueSection';

export function Calendar() {
  const classes = useStore((s) => s.classes);
  const lessons = useStore((s) => s.lessons);
  const updateLesson = useStore((s) => s.updateLesson);
  const addLesson = useStore((s) => s.addLesson);

  const [anchor, setAnchor] = useState(() => new Date());
  const [showWeekend, setShowWeekend] = useState(false);
  const [scheduleDate, setScheduleDate] = useState<string | null>(null);

  const days = useMemo(() => weekDays(anchor), [anchor]);
  const visibleDays = showWeekend ? days : days.slice(0, 5);
  const today = useMemo(() => new Date(), []);

  const rangeLabel = `${formatPl(days[0])} - ${formatPl(days[days.length - 1])}`;

  function markDone(lessonId: string) {
    updateLesson(lessonId, { status: 'done', doneDate: toDateKey(new Date()) });
  }
  function markSkipped(lessonId: string) {
    updateLesson(lessonId, { status: 'skipped' });
  }
  function moveLesson(lessonId: string, dateKey: string) {
    updateLesson(lessonId, { plannedDate: dateKey, status: 'planned' });
  }
  function unschedule(lessonId: string) {
    updateLesson(lessonId, { plannedDate: undefined });
  }
  function scheduleToday(lessonId: string) {
    updateLesson(lessonId, { plannedDate: toDateKey(new Date()), status: 'planned' });
  }

  return (
    <div>
      <PageHeader title="Kalendarz" description="Planowanie lekcji w widoku tygodnia." />

      <WeekNav
        rangeLabel={rangeLabel}
        onPrev={() => setAnchor((a) => addDays(a, -7))}
        onNext={() => setAnchor((a) => addDays(a, 7))}
        onToday={() => setAnchor(new Date())}
        showWeekend={showWeekend}
        onToggleWeekend={setShowWeekend}
      />

      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${visibleDays.length}, minmax(0, 1fr))` }}
      >
        {visibleDays.map((day) => (
          <DayColumn
            key={toDateKey(day)}
            day={day}
            lessons={lessons}
            classes={classes}
            onAdd={() => setScheduleDate(toDateKey(day))}
            onDone={markDone}
            onSkip={markSkipped}
            onMove={moveLesson}
            onUnschedule={unschedule}
          />
        ))}
      </div>

      <QueueSection classes={classes} lessons={lessons} onScheduleToday={scheduleToday} onSkip={markSkipped} />

      <OverdueSection lessons={overdue(lessons, today)} classes={classes} onMoveToToday={scheduleToday} />

      <ScheduleLessonModal
        open={scheduleDate !== null}
        dateKey={scheduleDate}
        classes={classes}
        lessons={lessons}
        onClose={() => setScheduleDate(null)}
        onScheduleExisting={(lessonId) => {
          if (scheduleDate) moveLesson(lessonId, scheduleDate);
          setScheduleDate(null);
        }}
        onCreateAndSchedule={(classId, title) => {
          if (scheduleDate) {
            addLesson({
              classId,
              title,
              status: 'planned',
              plannedDate: scheduleDate,
              slides: [],
            });
          }
          setScheduleDate(null);
        }}
      />
    </div>
  );
}
