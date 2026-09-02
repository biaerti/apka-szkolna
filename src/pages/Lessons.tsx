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
import { buildRecap13 } from '../data/recap13';

export function Lessons() {
  const navigate = useNavigate();
  const classes = useStore((s) => s.classes);
  const lessons = useStore((s) => s.lessons);
  const questionSets = useStore((s) => s.questionSets);
  const addLesson = useStore((s) => s.addLesson);
  const updateLesson = useStore((s) => s.updateLesson);
  const removeLesson = useStore((s) => s.removeLesson);
  const reorderLesson = useStore((s) => s.reorderLesson);
  const addQuestionSet = useStore((s) => s.addQuestionSet);
  const addQuestion = useStore((s) => s.addQuestion);

  const sortedClasses = useMemo(() => [...classes].sort((a, b) => a.order - b.order), [classes]);
  const [activeClassId, setActiveClassId] = useState(sortedClasses[0]?.id ?? '');
  const currentClassId = activeClassId || sortedClasses[0]?.id || '';

  const [newOpen, setNewOpen] = useState(false);
  const [copyLesson, setCopyLesson] = useState<Lesson | null>(null);
  const [removeTarget, setRemoveTarget] = useState<Lesson | null>(null);
  const [recapConfirmOpen, setRecapConfirmOpen] = useState(false);

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

  function handleInsertRecap13() {
    if (!currentClassId) return;
    const bundle = buildRecap13(currentClassId);

    // Wstaw zestawy pytan i zapamietaj mapowanie starych id -> nowe id.
    const setIdMap = new Map<string, string>();
    for (const set of bundle.questionSets) {
      const created = addQuestionSet({
        name: set.name,
        topic: set.topic,
        classIds: [currentClassId],
      });
      setIdMap.set(set.id, created.id);
    }

    // Dodaj pytania przypisane do nowych id zestawow (kolejnosc zachowana).
    for (const q of bundle.questions) {
      const newSetId = setIdMap.get(q.setId);
      if (!newSetId) continue;
      addQuestion({ setId: newSetId, text: q.text, answer: q.answer });
    }

    // Wstaw lekcje - podmien identyfikatory zestawow pytan w polu lekcji i w slajdach recap.
    for (const lesson of bundle.lessons) {
      const mappedQuestionSetId = lesson.questionSetId
        ? setIdMap.get(lesson.questionSetId)
        : undefined;
      const mappedSlides = lesson.slides.map((slide) => {
        if (slide.kind === 'recap') {
          const newId = setIdMap.get(slide.questionSetId);
          if (newId) return { ...slide, questionSetId: newId };
        }
        return slide;
      });
      addLesson({
        ...lesson,
        questionSetId: mappedQuestionSetId,
        slides: mappedSlides,
      });
    }
    setRecapConfirmOpen(false);
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
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setRecapConfirmOpen(true)}>
              Wstaw powtórkę klas 1-3
            </Button>
            <Button onClick={() => setNewOpen(true)}>Nowa lekcja</Button>
          </div>
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
        open={recapConfirmOpen}
        title="Wstaw powtórkę klas 1-3"
        message={`Do klasy ${sortedClasses.find((c) => c.id === currentClassId)?.name ?? ''} zostaną dodane 3 lekcje-prezentacje (fonetyka/ortografia, gramatyka/interpunkcja, formy wypowiedzi) i 3 zestawy pytań do koła fortuny. Kontynuować?`}
        confirmLabel="Wstaw"
        danger={false}
        onCancel={() => setRecapConfirmOpen(false)}
        onConfirm={handleInsertRecap13}
      />

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
