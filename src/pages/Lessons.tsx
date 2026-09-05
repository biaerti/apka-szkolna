// Lekcje rocznika ogladane z perspektywy jednej klasy (zakladki). Ta sama lista
// dla IV A, IV B i IV C; osobny jest tylko postep. Zestaw pytan do kola siedzi
// w wierszu lekcji, kolejnosc zmienia sie przeciaganiem, gotowe materialy sa
// w menu obok "Nowa lekcja". Aktywna klasa zyje w adresie (?klasa=), zeby
// powrot z prezentacji trafial z powrotem na wlasciwa zakladke.

import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../data/store';
import type { Lesson, LessonStatus } from '../data/types';
import { allGrades, classesOfGrade, gradeLabel, gradeOfClass, lessonProgress, lessonsOfGrade, todayKey } from '../lib/grade';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Table, TBody, TH, THead, TR } from '../components/ui/Table';
import { LessonRow } from '../components/lessons/LessonRow';
import { NewLessonModal } from '../components/lessons/NewLessonModal';
import { CopyLessonModal } from '../components/lessons/CopyLessonModal';
import { ClassTabs } from '../components/lessons/ClassTabs';
import { CurrentLessonBar } from '../components/lessons/CurrentLessonBar';
import { ReadyMaterialsMenu } from '../components/lessons/ReadyMaterialsMenu';
import { useReadyMaterials } from '../components/lessons/useReadyMaterials';
import { duplicateSlide } from '../components/lessons/slideDefaults';
import { newId } from '../data/id';
import { useLessonDrag } from '../components/lessons/useLessonDrag';

export function Lessons() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const classes = useStore((s) => s.classes);
  const lessons = useStore((s) => s.lessons);
  const questions = useStore((s) => s.questions);
  const addLesson = useStore((s) => s.addLesson);
  const updateLesson = useStore((s) => s.updateLesson);
  const removeLesson = useStore((s) => s.removeLesson);
  const moveLesson = useStore((s) => s.moveLesson);
  const setLessonProgress = useStore((s) => s.setLessonProgress);
  const addQuestionSet = useStore((s) => s.addQuestionSet);

  const sortedClasses = useMemo(() => [...classes].sort((a, b) => a.order - b.order), [classes]);
  const requested = params.get('klasa');
  const classId = sortedClasses.some((c) => c.id === requested) ? (requested as string) : sortedClasses[0]?.id ?? '';
  const grade = gradeOfClass(classes, classId) ?? '';
  const gradeClasses = useMemo(() => classesOfGrade(classes, grade), [classes, grade]);
  const label = gradeLabel(classes, grade);
  // Konkretne nazwy klas zamiast odmiany "klas IV / klasy IV" - czytelniej i bez bledow gramatycznych.
  const classNames = gradeClasses.map((c) => c.name).join(', ');
  const gradeLessons = useMemo(() => lessonsOfGrade(lessons, grade), [lessons, grade]);
  const otherGrades = allGrades(classes).filter((g) => g !== grade);

  const [newOpen, setNewOpen] = useState(false);
  const [copyLesson, setCopyLesson] = useState<Lesson | null>(null);
  const [removeTarget, setRemoveTarget] = useState<Lesson | null>(null);

  const ready = useReadyMaterials(grade, gradeClasses.map((c) => c.id), gradeLessons);
  const drag = useLessonDrag(gradeLessons, moveLesson);

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

  function selectClass(id: string) {
    setParams({ klasa: id }, { replace: true });
  }

  function questionCountFor(lesson: Lesson): number | null {
    if (!lesson.questionSetId) return null;
    return questions.filter((q) => q.setId === lesson.questionSetId).length;
  }

  function handleCreate(title: string) {
    const lesson = addLesson({ grade, title, progress: {}, slides: [] });
    setNewOpen(false);
    navigate(`/lekcje/${lesson.id}/edytuj?klasa=${classId}`);
  }

  // Zestaw pytan powstaje z lekcji i dostaje jej nazwe; jesli lekcja nie ma jeszcze
  // slajdu kola, dokladamy go na koniec - tam kolo sprawdza nowy temat.
  function handleAddQuestions(lesson: Lesson) {
    const set = addQuestionSet({ name: lesson.title, classIds: gradeClasses.map((c) => c.id) });
    const hasRecap = lesson.slides.some((s) => s.kind === 'recap');
    updateLesson(lesson.id, {
      questionSetId: set.id,
      slides: hasRecap ? lesson.slides : [...lesson.slides, { id: newId(), kind: 'recap', questionSetId: set.id }],
    });
    navigate(`/pytania/${set.id}?lekcja=${lesson.id}`);
  }

  function copyLessonTo(lesson: Lesson, targetGrade: string, title: string) {
    addLesson({
      grade: targetGrade,
      title,
      topic: lesson.topic,
      questionSetId: lesson.questionSetId,
      registerTopic: lesson.registerTopic,
      curriculum: lesson.curriculum,
      progress: {},
      slides: lesson.slides.map(duplicateSlide),
    });
  }

  function setStatus(lesson: Lesson, status: LessonStatus) {
    setLessonProgress(lesson.id, classId, status === 'done' ? { status, doneDate: todayKey() } : { status });
  }

  return (
    <div>
      <PageHeader
        title="Lekcje"
        actions={
          <>
            <ReadyMaterialsMenu
              variant="menu"
              classNames={classNames}
              materials={ready.materials}
              refreshMatches={ready.refreshMatches}
              onRefresh={ready.refresh}
            />
            <Button onClick={() => setNewOpen(true)}>Nowa lekcja</Button>
          </>
        }
      />

      <ClassTabs classes={sortedClasses} activeId={classId} onSelect={selectClass} />

      {gradeClasses.length > 1 && (
        <p className="-mt-1 mb-4 text-xs text-gray-500">
          Lekcje są wspólne dla {classNames}. Postęp każdej klasy liczy się osobno.
        </p>
      )}

      <CurrentLessonBar classId={classId} classes={classes} lessons={lessons} />

      {gradeLessons.length === 0 ? (
        <EmptyState
          title={gradeClasses.length > 1 ? `${capitalize(label)} nie mają jeszcze lekcji` : `${capitalize(label)} nie ma jeszcze lekcji`}
          description="Zacznij od gotowych materiałów albo utwórz własną lekcję."
          action={
            <div className="flex flex-col items-center gap-3">
              <ReadyMaterialsMenu
                variant="buttons"
                classNames={classNames}
                materials={ready.materials}
                refreshMatches={ready.refreshMatches}
                onRefresh={ready.refresh}
              />
              <Button variant="ghost" onClick={() => setNewOpen(true)}>
                Nowa lekcja
              </Button>
            </div>
          }
        />
      ) : (
        <Table fixed>
          <THead>
            <TR>
              <TH className="w-9 !px-1">
                <span className="sr-only">Kolejność</span>
              </TH>
              <TH className="w-9 !px-1">Nr</TH>
              <TH>Lekcja</TH>
              <TH className="w-32">Status</TH>
              <TH className="w-52 text-right">
                <span className="sr-only">Akcje</span>
              </TH>
            </TR>
          </THead>
          <TBody>
            {gradeLessons.map((lesson, idx) => (
              <LessonRow
                key={lesson.id}
                lesson={lesson}
                classId={classId}
                progress={lessonProgress(lesson, classId)}
                index={idx}
                total={gradeLessons.length}
                questionCount={questionCountFor(lesson)}
                dropIndicator={drag.indicatorFor(idx, lesson.id)}
                onDragStart={() => drag.start(lesson.id)}
                onDragOver={(position) => drag.over(idx, position)}
                onDrop={drag.finishDrop}
                onDragEnd={drag.reset}
                onMove={(dir) => moveLesson(lesson.id, dir === 'up' ? idx - 1 : idx + 1)}
                onSetStatus={(status) => setStatus(lesson, status)}
                onAddQuestions={() => handleAddQuestions(lesson)}
                onDuplicate={() => copyLessonTo(lesson, grade, `${lesson.title} (kopia)`)}
                onCopyToGrade={otherGrades.length > 0 ? () => setCopyLesson(lesson) : null}
                onRemove={() => setRemoveTarget(lesson)}
              />
            ))}
          </TBody>
        </Table>
      )}

      <NewLessonModal open={newOpen} onClose={() => setNewOpen(false)} classNames={classNames} onCreate={handleCreate} />

      {copyLesson && (
        <CopyLessonModal
          open
          onClose={() => setCopyLesson(null)}
          grades={otherGrades.map((g) => ({ grade: g, label: gradeLabel(classes, g) }))}
          onCopy={(target) => {
            copyLessonTo(copyLesson, target, copyLesson.title);
            setCopyLesson(null);
          }}
        />
      )}

      <ConfirmDialog
        open={!!removeTarget}
        title="Usuń lekcję"
        message={`Lekcja „${removeTarget?.title}" zniknie z: ${classNames}, razem z postępem. Tej operacji nie można cofnąć.`}
        confirmLabel="Usuń"
        onCancel={() => setRemoveTarget(null)}
        onConfirm={() => {
          if (removeTarget) removeLesson(removeTarget.id);
          setRemoveTarget(null);
        }}
      />
    </div>
  );
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
