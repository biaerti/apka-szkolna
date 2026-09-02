import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../data/store';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Table, TBody, TH, THead, TR } from '../components/ui/Table';
import { LessonRow } from '../components/lessons/LessonRow';
import { NewLessonModal, type NewLessonData } from '../components/lessons/NewLessonModal';
import { CopyLessonModal } from '../components/lessons/CopyLessonModal';
import { duplicateSlide } from '../components/lessons/slideDefaults';
import type { Lesson } from '../data/types';

export function Lessons() {
  const navigate = useNavigate();
  const classes = useStore((s) => s.classes);
  const lessons = useStore((s) => s.lessons);
  const questionSets = useStore((s) => s.questionSets);
  const addLesson = useStore((s) => s.addLesson);
  const updateLesson = useStore((s) => s.updateLesson);
  const removeLesson = useStore((s) => s.removeLesson);
  const reorderLesson = useStore((s) => s.reorderLesson);

  const sortedClasses = useMemo(() => [...classes].sort((a, b) => a.order - b.order), [classes]);
  const [activeClassId, setActiveClassId] = useState(sortedClasses[0]?.id ?? '');
  const currentClassId = activeClassId || sortedClasses[0]?.id || '';

  const [newOpen, setNewOpen] = useState(false);
  const [copyLesson, setCopyLesson] = useState<Lesson | null>(null);
  const [removeTarget, setRemoveTarget] = useState<Lesson | null>(null);

  const classLessons = useMemo(
    () => lessons.filter((l) => l.classId === currentClassId).sort((a, b) => a.order - b.order),
    [lessons, currentClassId],
  );

  if (sortedClasses.length === 0) {
    return (
      <EmptyState
        title="Brak klas"
        description="Żeby dodać lekcję, najpierw utwórz przynajmniej jedną klasę."
        action={
          <Button variant="secondary" onClick={() => navigate('/klasy')}>
            Przejdź do klas
          </Button>
        }
      />
    );
  }

  function handleCreate(data: NewLessonData) {
    const lesson = addLesson({
      classId: data.classId,
      title: data.title,
      topic: data.topic,
      plannedDate: data.plannedDate,
      questionSetId: data.questionSetId,
      status: 'planned',
      slides: [],
    });
    setNewOpen(false);
    navigate(`/lekcje/${lesson.id}/edytuj`);
  }

  function handleDuplicate(lesson: Lesson) {
    addLesson({
      classId: lesson.classId,
      title: `${lesson.title} (kopia)`,
      topic: lesson.topic,
      plannedDate: lesson.plannedDate,
      questionSetId: lesson.questionSetId,
      status: 'planned',
      slides: lesson.slides.map(duplicateSlide),
    });
  }

  function handleCopyToClass(lesson: Lesson, targetClassId: string) {
    addLesson({
      classId: targetClassId,
      title: lesson.title,
      topic: lesson.topic,
      questionSetId: lesson.questionSetId,
      status: 'planned',
      slides: lesson.slides.map(duplicateSlide),
    });
    setCopyLesson(null);
  }

  return (
    <div>
      <PageHeader
        title="Lekcje"
        actions={
          <Button onClick={() => setNewOpen(true)}>Nowa lekcja</Button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {sortedClasses.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActiveClassId(c.id)}
            className={
              c.id === currentClassId
                ? 'rounded-md bg-accent-600 px-3 py-1.5 text-sm font-medium text-white'
                : 'rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50'
            }
          >
            {c.name}
          </button>
        ))}
      </div>

      {classLessons.length === 0 ? (
        <EmptyState title="Brak lekcji w tej klasie" description="Dodaj pierwszą lekcję przyciskiem powyżej." />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Nr</TH>
              <TH>Tytuł</TH>
              <TH>Temat</TH>
              <TH>Slajdy</TH>
              <TH>Planowana data</TH>
              <TH>Status</TH>
              <TH>Akcje</TH>
            </TR>
          </THead>
          <TBody>
            {classLessons.map((lesson, idx) => (
              <LessonRow
                key={lesson.id}
                lesson={lesson}
                index={idx}
                total={classLessons.length}
                onMoveUp={() => reorderLesson(lesson.id, 'up')}
                onMoveDown={() => reorderLesson(lesson.id, 'down')}
                onSkip={() => updateLesson(lesson.id, { status: 'skipped' })}
                onMarkDone={() =>
                  updateLesson(lesson.id, { status: 'done', doneDate: new Date().toISOString().slice(0, 10) })
                }
                onRestore={() => updateLesson(lesson.id, { status: 'planned', doneDate: undefined })}
                onDuplicate={() => handleDuplicate(lesson)}
                onCopyToClass={() => setCopyLesson(lesson)}
                onRemove={() => setRemoveTarget(lesson)}
              />
            ))}
          </TBody>
        </Table>
      )}

      <NewLessonModal
        open={newOpen}
        onClose={() => setNewOpen(false)}
        classes={sortedClasses}
        questionSets={questionSets}
        defaultClassId={currentClassId}
        onCreate={handleCreate}
      />

      {copyLesson && (
        <CopyLessonModal
          open={!!copyLesson}
          onClose={() => setCopyLesson(null)}
          classes={sortedClasses}
          excludeClassId={copyLesson.classId}
          onCopy={(targetClassId) => handleCopyToClass(copyLesson, targetClassId)}
        />
      )}

      <ConfirmDialog
        open={!!removeTarget}
        title="Usuń lekcję"
        message={`Czy na pewno usunąć lekcję "${removeTarget?.title}"? Tej operacji nie można cofnąć.`}
        onCancel={() => setRemoveTarget(null)}
        onConfirm={() => {
          if (removeTarget) removeLesson(removeTarget.id);
          setRemoveTarget(null);
        }}
      />
    </div>
  );
}
