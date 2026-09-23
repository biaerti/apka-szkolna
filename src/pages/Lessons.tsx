// Lekcje rocznika ogladane z perspektywy jednej klasy (zakladki). Ta sama lista
// dla IV A, IV B i IV C; osobny jest tylko postep. Zestaw pytan do kola siedzi
// w wierszu lekcji, kolejnosc zmienia sie przeciaganiem, gotowe materialy sa
// w menu obok "Nowa lekcja". Aktywna klasa zyje w adresie (?klasa=), zeby
// powrot z prezentacji trafial z powrotem na wlasciwa zakladke.

import { Fragment, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../data/store';
import type { Lesson, LessonMaterialType, LessonSlot, LessonStatus } from '../data/types';
import { allGrades, classesOfGrade, gradeLabel, gradeOfClass, lessonProgress, lessonsOfGrade, todayKey } from '../lib/grade';
import { classSlotOptions, progressWithoutSlot, slotsFromProgress } from '../lib/lessonSlots';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Table, TBody, TH, THead, TR } from '../components/ui/Table';
import { LessonRow } from '../components/lessons/LessonRow';
import { LessonRegisterModal } from '../components/lessons/LessonRegisterModal';
import { LessonPlanModal } from '../components/lessons/LessonPlanModal';
import { LessonFilmModal } from '../components/lessons/LessonFilmModal';
import { LessonQuestionsModal } from '../components/lessons/LessonQuestionsModal';
import { NewLessonModal } from '../components/lessons/NewLessonModal';
import { CopyLessonModal } from '../components/lessons/CopyLessonModal';
import { ClassTabs } from '../components/lessons/ClassTabs';
import { CurrentLessonBar } from '../components/lessons/CurrentLessonBar';
import { ReadyMaterialsMenu } from '../components/lessons/ReadyMaterialsMenu';
import { useReadyMaterials } from '../components/lessons/useReadyMaterials';
import { duplicateSlide } from '../components/lessons/slideDefaults';
import { newId } from '../data/id';
import { useLessonDrag } from '../components/lessons/useLessonDrag';
import { backfillLessonCodes, classLessonCode } from '../lib/lessonCode';
import { lessonMaterialType } from '../lib/lessonMaterial';
import { MaterialTabs } from '../components/lessons/MaterialTabs';
import { useNow } from '../components/timetable/useNow';
import { LessonMobileCard } from '../components/lessons/LessonMobileCard';

export function Lessons() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const classes = useStore((s) => s.classes);
  const lessons = useStore((s) => s.lessons);
  const timetable = useStore((s) => s.timetable);
  const periods = useStore((s) => s.periods);
  const questions = useStore((s) => s.questions);
  const addLesson = useStore((s) => s.addLesson);
  const updateLesson = useStore((s) => s.updateLesson);
  const removeLesson = useStore((s) => s.removeLesson);
  const moveLesson = useStore((s) => s.moveLesson);
  const setLessonProgress = useStore((s) => s.setLessonProgress);
  const addQuestionSet = useStore((s) => s.addQuestionSet);
  // Edycja z okien "Kody podstawy programowej" i "Zestaw pytań" to reczna
  // zmiana nauczyciela, wiec idzie przez updateLessonFromEditor - inaczej
  // "Odśwież wstawione materiały" nadpisaloby ja po cichu.
  const updateLessonManually = useStore((s) => s.updateLessonFromEditor);
  const addQuestion = useStore((s) => s.addQuestion);
  const updateQuestion = useStore((s) => s.updateQuestion);
  const removeQuestion = useStore((s) => s.removeQuestion);
  const reorderQuestion = useStore((s) => s.reorderQuestion);

  const sortedClasses = useMemo(() => [...classes].sort((a, b) => a.order - b.order), [classes]);
  const requested = params.get('klasa');
  const classId = sortedClasses.some((c) => c.id === requested) ? (requested as string) : sortedClasses[0]?.id ?? '';
  const grade = gradeOfClass(classes, classId) ?? '';
  const gradeClasses = useMemo(() => classesOfGrade(classes, grade), [classes, grade]);
  // Konkretne nazwy klas zamiast odmiany "klas IV / klasy IV" - czytelniej i bez bledow gramatycznych.
  const classNames = gradeClasses.map((c) => c.name).join(', ');
  const gradeLessons = useMemo(() => lessonsOfGrade(lessons, grade), [lessons, grade]);
  const requestedType = params.get('typ');
  const hasTextbookLessons = gradeLessons.some((lesson) => lessonMaterialType(lesson) === 'textbook');
  const materialType: LessonMaterialType = requestedType === 'review' || requestedType === 'textbook'
    ? requestedType
    : hasTextbookLessons
      ? 'textbook'
      : 'review';
  const visibleLessons = useMemo(
    () => gradeLessons.filter((lesson) => lessonMaterialType(lesson) === materialType),
    [gradeLessons, materialType],
  );
  const materialCounts = useMemo(
    () => ({
      textbook: gradeLessons.filter((lesson) => lessonMaterialType(lesson) === 'textbook').length,
      review: gradeLessons.filter((lesson) => lessonMaterialType(lesson) === 'review').length,
    }),
    [gradeLessons],
  );
  const otherGrades = allGrades(classes).filter((g) => g !== grade);
  const now = useNow(30_000);
  const slotOptions = useMemo(
    () => classSlotOptions({ timetable, periods, classId, now }),
    [timetable, periods, classId, now],
  );
  const slotOwnerById = useMemo(() => {
    const owners = new Map<string, string>();
    for (const lesson of gradeLessons) {
      for (const slot of slotsFromProgress(lessonProgress(lesson, classId))) {
        // Zachowujemy pierwszego wlasciciela także dla dawnych, zdublowanych danych.
        // Nowe przypisania nie mogą już utworzyć drugiego właściciela.
        if (!owners.has(slot.id)) owners.set(slot.id, lesson.id);
      }
    }
    return owners;
  }, [gradeLessons, classId]);
  const currentSlotId = slotOptions.find((option) => option.isNow)?.id;
  const currentLessonId = currentSlotId
    ? visibleLessons.find((lesson) => slotsFromProgress(lessonProgress(lesson, classId)).some((slot) => slot.id === currentSlotId))?.id
    : undefined;
  const suggestedLessonId = visibleLessons.find((lesson) => lessonProgress(lesson, classId).status === 'in_progress')?.id
    ?? visibleLessons.find((lesson) => lessonProgress(lesson, classId).status === 'planned')?.id;

  const [newOpen, setNewOpen] = useState(false);
  const [copyLesson, setCopyLesson] = useState<Lesson | null>(null);
  const [removeTarget, setRemoveTarget] = useState<Lesson | null>(null);
  // Okna podgladu z menu wiersza - trzymamy id, nie cala lekcje, zeby zawartosc
  // odswiezala sie przy kazdej edycji w oknie.
  const [registerLessonId, setRegisterLessonId] = useState<string | null>(null);
  const [questionsLessonId, setQuestionsLessonId] = useState<string | null>(null);
  const registerLesson = gradeLessons.find((l) => l.id === registerLessonId) ?? null;
  const questionsLesson = gradeLessons.find((l) => l.id === questionsLessonId) ?? null;
  const [planLessonId, setPlanLessonId] = useState<string | null>(null);
  const planLesson = gradeLessons.find((l) => l.id === planLessonId) ?? null;
  const [filmLessonId, setFilmLessonId] = useState<string | null>(null);
  const filmLesson = gradeLessons.find((l) => l.id === filmLessonId) ?? null;

  const ready = useReadyMaterials(grade, gradeClasses.map((c) => c.id), gradeLessons);
  const visibleMaterials = ready.materials.filter((material) =>
    materialType === 'textbook' ? material.key.startsWith('textbook') : !material.key.startsWith('textbook'),
  );
  const firstVisibleIndex = gradeLessons.findIndex((lesson) => visibleLessons[0]?.id === lesson.id);
  const drag = useLessonDrag(visibleLessons, (lessonId, toIndex) => moveLesson(lessonId, Math.max(0, firstVisibleIndex) + toIndex));

  // Lekcje sprzed wprowadzenia kodow do zeszytu dostaja je przy pierwszym
  // wejsciu na liste - wg kolejnosci w roczniku. Nadane kody juz sie nie zmieniaja.
  useEffect(() => {
    for (const { id, code } of backfillLessonCodes(lessons)) {
      updateLesson(id, { code });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessons]);


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
    setParams({ klasa: id, typ: materialType }, { replace: true });
  }

  function selectMaterial(type: LessonMaterialType) {
    setParams({ klasa: classId, typ: type }, { replace: true });
  }

  function questionCountFor(lesson: Lesson): number | null {
    if (!lesson.questionSetId) return null;
    return questions.filter((q) => q.setId === lesson.questionSetId).length;
  }

  function handleCreate(title: string, type: LessonMaterialType) {
    const lesson = addLesson({ grade, title, materialType: type, progress: {}, slides: [] });
    setNewOpen(false);
    navigate(`/lekcje/${lesson.id}/edytuj?klasa=${classId}`);
  }

  // Zestaw pytan powstaje z lekcji i dostaje jej nazwe; jesli lekcja nie ma jeszcze
  // slajdu kola, dokladamy go na koniec - tam kolo sprawdza nowy temat.
  function createQuestionSetFor(lesson: Lesson): string {
    const set = addQuestionSet({ name: lesson.title, classIds: gradeClasses.map((c) => c.id) });
    const hasRecap = lesson.slides.some((s) => s.kind === 'recap');
    updateLesson(lesson.id, {
      questionSetId: set.id,
      slides: hasRecap ? lesson.slides : [...lesson.slides, { id: newId(), kind: 'recap', questionSetId: set.id }],
    });
    return set.id;
  }

  function handleAddQuestions(lesson: Lesson) {
    const setId = createQuestionSetFor(lesson);
    navigate(`/pytania/${setId}?lekcja=${lesson.id}`);
  }

  function copyLessonTo(lesson: Lesson, targetGrade: string, title: string) {
    addLesson({
      grade: targetGrade,
      title,
      topic: lesson.topic,
      materialType: lesson.materialType,
      textbookPage: lesson.textbookPage,
      exercisePage: lesson.exercisePage,
      notebookNote: lesson.notebookNote,
      teacherPlan: lesson.teacherPlan,
      dzial: lesson.dzial,
      questionSetId: lesson.questionSetId,
      registerTopic: lesson.registerTopic,
      curriculum: lesson.curriculum,
      progress: {},
      slides: lesson.slides.map(duplicateSlide),
    });
  }

  function setStatus(lesson: Lesson, status: LessonStatus) {
    const current = lessonProgress(lesson, classId);
    const lessonDate = status === 'in_progress' || status === 'done' ? current.lessonDate ?? todayKey() : current.lessonDate;
    setLessonProgress(lesson.id, classId, { ...current, status, lessonDate, doneDate: status === 'done' ? todayKey() : undefined });
  }

  function addSlot(lesson: Lesson, slot: LessonSlot) {
    const ownerId = slotOwnerById.get(slot.id);
    if (ownerId && ownerId !== lesson.id) {
      const previousOwner = gradeLessons.find((item) => item.id === ownerId);
      if (previousOwner) {
        setLessonProgress(
          previousOwner.id,
          classId,
          progressWithoutSlot(lessonProgress(previousOwner, classId), slot.id),
        );
      }
    }
    const current = lessonProgress(lesson, classId);
    const existing = slotsFromProgress(current);
    if (existing.some((item) => item.id === slot.id)) return;
    const lessonSlots = [...existing, slot].sort((a, b) => a.date.localeCompare(b.date) || a.period - b.period);
    const first = lessonSlots[0];
    setLessonProgress(lesson.id, classId, {
      ...current,
      status: slot.id === currentSlotId ? 'in_progress' : current.status,
      lessonSlots,
      lessonDate: first.date,
      lessonPeriod: first.period,
    });
  }

  function removeSlot(lesson: Lesson, slotId: string) {
    setLessonProgress(lesson.id, classId, progressWithoutSlot(lessonProgress(lesson, classId), slotId));
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

      <div className="flex flex-wrap items-center justify-between gap-3">
        <MaterialTabs active={materialType} counts={materialCounts} onSelect={selectMaterial} />
        {visibleLessons.length > 0 && materialType !== 'textbook' && (
          <p className="mb-4 text-xs text-gray-500">
            <span className="font-semibold tabular-nums text-gray-700">
              {visibleLessons.filter((lesson) => lessonProgress(lesson, classId).status === 'done').length}/{visibleLessons.length}
            </span>{' '}
            zrobionych w {classes.find((schoolClass) => schoolClass.id === classId)?.name}
          </p>
        )}
      </div>

      <CurrentLessonBar classId={classId} classes={classes} lessons={visibleLessons} currentLessonId={currentLessonId} />

      {visibleLessons.length === 0 ? (
        <EmptyState
          title={materialType === 'textbook' ? 'Brak lekcji z podręcznika' : 'Brak lekcji powtórzeniowych'}
          description={materialType === 'textbook' ? 'Wstaw gotowy spis tematów „Między nami 4” albo utwórz własną lekcję.' : 'Wstaw gotową powtórkę albo utwórz własną.'}
          action={
            <div className="flex flex-col items-center gap-3">
              <ReadyMaterialsMenu
                variant="buttons"
                classNames={classNames}
                materials={visibleMaterials}
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
        <>
        <div className="space-y-3 md:hidden">
          {visibleLessons.map((lesson) => (
            <LessonMobileCard
              key={lesson.id}
              lesson={lesson}
              classId={classId}
              progress={lessonProgress(lesson, classId)}
              displayCode={classLessonCode(lessons, lesson, classId)}
              slots={slotsFromProgress(lessonProgress(lesson, classId))}
              slotOptions={slotOptions}
              periods={periods}
              now={now}
              currentSlotId={currentSlotId}
              suggestCurrentSlot={lesson.id === suggestedLessonId}
              onAddSlot={(slot) => addSlot(lesson, slot)}
              onRemoveSlot={(slotId) => removeSlot(lesson, slotId)}
              onSetStatus={(status) => setStatus(lesson, status)}
              onShowPlan={() => setPlanLessonId(lesson.id)}
              onShowFilm={() => setFilmLessonId(lesson.id)}
            />
          ))}
        </div>
        <div className="hidden md:block">
        <Table fixed>
          <THead>
            <TR>
              <TH className="w-9 !px-1">
                <span className="sr-only">Kolejność</span>
              </TH>
              {/* Kod lekcji - ten sam, ktory dzieci maja w zeszytach. */}
              <TH className="w-14 !px-1">Kod</TH>
              <TH>Lekcja</TH>
              <TH className="w-72">Sloty</TH>
              <TH className="w-32">Status</TH>
              <TH className="w-64 text-right">
                <span className="sr-only">Akcje</span>
              </TH>
            </TR>
          </THead>
          <TBody>
            {visibleLessons.map((lesson, idx) => (
              <Fragment key={lesson.id}>
                {/* Naglowek dzialu nad pierwsza lekcja danej grupy (np. "Powtorka 1-3") -
                    lekcje bez dzialu (wlasne, tematyczne) nie dostaja naglowka. */}
                {lesson.dzial && lesson.dzial !== visibleLessons[idx - 1]?.dzial && (
                  <TR className="bg-gray-50/70">
                    <td colSpan={6} className="border-t border-gray-200 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {lesson.dzial}
                    </td>
                  </TR>
                )}
                <LessonRow
                  lesson={lesson}
                  classId={classId}
                  progress={lessonProgress(lesson, classId)}
                  index={idx}
                  total={visibleLessons.length}
                  questionCount={questionCountFor(lesson)}
                  displayCode={classLessonCode(lessons, lesson, classId)}
                  dropIndicator={drag.indicatorFor(idx, lesson.id)}
                  onDragStart={() => drag.start(lesson.id)}
                  onDragOver={(position) => drag.over(idx, position)}
                  onDrop={drag.finishDrop}
                  onDragEnd={drag.reset}
                  onMove={(dir) => moveLesson(lesson.id, Math.max(0, firstVisibleIndex) + (dir === 'up' ? idx - 1 : idx + 1))}
                  onSetStatus={(status) => setStatus(lesson, status)}
                  slots={slotsFromProgress(lessonProgress(lesson, classId))}
                  slotOptions={slotOptions}
                  periods={periods}
                  now={now}
                  currentSlotId={currentSlotId}
                  suggestCurrentSlot={lesson.id === suggestedLessonId}
                  onAddSlot={(slot) => addSlot(lesson, slot)}
                  onRemoveSlot={(slotId) => removeSlot(lesson, slotId)}
                  onShowRegister={() => setRegisterLessonId(lesson.id)}
                  onShowPlan={() => setPlanLessonId(lesson.id)}
                  onShowFilm={() => setFilmLessonId(lesson.id)}
                  onShowQuestions={() => setQuestionsLessonId(lesson.id)}
                  onAddQuestions={() => handleAddQuestions(lesson)}
                  onDuplicate={() => copyLessonTo(lesson, grade, `${lesson.title} (kopia)`)}
                  onCopyToGrade={otherGrades.length > 0 ? () => setCopyLesson(lesson) : null}
                  onRemove={() => setRemoveTarget(lesson)}
                />
              </Fragment>
            ))}
          </TBody>
        </Table>
        </div>
        </>
      )}

      <NewLessonModal open={newOpen} onClose={() => setNewOpen(false)} classNames={classNames} onCreate={handleCreate} initialType={materialType} />

      {planLesson && <LessonPlanModal lesson={planLesson} onClose={() => setPlanLessonId(null)} />}

      {filmLesson && <LessonFilmModal lesson={filmLesson} onClose={() => setFilmLessonId(null)} />}

      {registerLesson && (
        <LessonRegisterModal
          lesson={registerLesson}
          classNames={classNames}
          onClose={() => setRegisterLessonId(null)}
          onChange={(patch) => updateLessonManually(registerLesson.id, patch)}
        />
      )}

      {questionsLesson && (
        <LessonQuestionsModal
          lesson={questionsLesson}
          questions={questions}
          classNames={classNames}
          onClose={() => setQuestionsLessonId(null)}
          onChangeSlides={(slides) => updateLessonManually(questionsLesson.id, { slides })}
          onChangeQuestion={(qid, patch) => updateQuestion(qid, patch)}
          onMoveQuestion={(qid, direction) => reorderQuestion(qid, direction)}
          onRemoveQuestion={(qid) => removeQuestion(qid)}
          onAddQuestion={(text) => {
            if (questionsLesson.questionSetId) addQuestion({ setId: questionsLesson.questionSetId, text });
          }}
          onCreateQuestionSet={() => createQuestionSetFor(questionsLesson)}
        />
      )}

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
        message={`Lekcja „${removeTarget?.title}” zniknie z: ${classNames}, razem z postępem. Jeżeli następna lekcja powtarza ten temat, jej powtórka wróci do poprzedniego pozostawionego tematu. Tej operacji nie można cofnąć.`}
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
