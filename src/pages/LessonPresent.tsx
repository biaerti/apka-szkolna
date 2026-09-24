// Ekran projektora - prezentacja lekcji. Poza AppShell, pelny ekran, ciemne tlo.

import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useStore } from '../data/store';
import { SlideView, supportsWritePane } from '../components/slides/SlideView';
import { AnnotationLayer } from '../components/slides/AnnotationLayer';
import { AnnotationToolbar } from '../components/slides/AnnotationToolbar';
import { PresentationBoard } from '../components/slides/PresentationBoard';
import { useSlideAnnotations } from '../components/slides/useSlideAnnotations';
import { PresentProgressBar } from '../components/lessons/PresentProgressBar';
import { PresentClassPanel } from '../components/lessons/PresentClassPanel';
import { PresentClock } from '../components/lessons/PresentClock';
import { TaskWheelDrawer } from '../components/lessons/TaskWheelDrawer';
import { useTaskWheel } from '../components/lessons/useTaskWheel';
import { usePresentKeys } from '../components/lessons/usePresentKeys';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { classesOfGrade, lessonProgress, todayKey } from '../lib/grade';
import { lessonMaterialType } from '../lib/lessonMaterial';
import { classLessonCode } from '../lib/lessonCode';
import { PresentationTimer } from '../components/lessons/PresentationTimer';
import { LessonStartTimer } from '../components/recap/LessonStartTimer';
import { resolveRecapMode } from '../lib/recap';
import type { Slide } from '../data/types';

type PresentationStep =
  | { kind: 'preparation'; id: string }
  | { kind: 'slide'; id: string; slide: Slide };

function buildPresentationSteps(slides: Slide[]): {
  steps: PresentationStep[];
  textbookPage?: { from: number; to?: number };
} {
  const reviewRecap = slides.find((slide) => slide.kind === 'recap' && resolveRecapMode(slide) === 'powtorzeniowe');
  const topic = slides.find((slide) => slide.kind === 'topic');
  const openingRead: Extract<Slide, { kind: 'read' }> | undefined = topic
    ? slides.find(
        (slide): slide is Extract<Slide, { kind: 'read' }> => slide.kind === 'read' && typeof slide.page === 'number',
      )
    : undefined;
  const movedIds = new Set([reviewRecap?.id, topic?.id, openingRead?.id].filter((id): id is string => !!id));
  const ordered = [reviewRecap, topic, ...slides.filter((slide) => !movedIds.has(slide.id))].filter(
    (slide): slide is Slide => !!slide,
  );

  return {
    steps: [
      { kind: 'preparation', id: `preparation:${slides[0]?.id ?? 'lesson'}` },
      ...ordered.map((slide) => ({ kind: 'slide' as const, id: slide.id, slide })),
    ],
    textbookPage:
      openingRead && typeof openingRead.page === 'number'
        ? { from: openingRead.page, to: openingRead.pageTo }
        : undefined,
  };
}

export function LessonPresent() {
  const { id, classId: classIdParam } = useParams<{ id: string; classId?: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const lessons = useStore((s) => s.lessons);
  const classes = useStore((s) => s.classes);
  const setLessonProgress = useStore((s) => s.setLessonProgress);
  const lesson = lessons.find((l) => l.id === id);

  const classId = classIdParam ?? (lesson ? classesOfGrade(classes, lesson.grade)[0]?.id : undefined);
  const materialType = searchParams.get('typ') ?? (lesson ? lessonMaterialType(lesson) : 'textbook');
  const lessonsUrl = classId ? `/lekcje?klasa=${classId}&typ=${materialType}` : '/lekcje';

  const [index, setIndex] = useState(0);
  const [boardOpen, setBoardOpen] = useState(false);
  // Tryb pisania (P): zostaje wlaczony przy przechodzeniu miedzy slajdami,
  // ale dziala tylko na slajdach zadan i tekstowych.
  const [writePane, setWritePane] = useState(false);
  const [classPanelOpen, setClassPanelOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const [globalTimerVisible, setGlobalTimerVisible] = useState(false);
  const startedRef = useRef(false);
  const lessonCode = lesson && classId ? classLessonCode(lessons, lesson, classId) : lesson?.code;
  // Kolo na lekcji - stan na poziomie prezentacji, zeby przezyl zmiany slajdow.
  const wheel = useTaskWheel({ classId: classId ?? '', lessonCode });

  useEffect(() => {
    if (!lesson || !classId || startedRef.current) return;
    startedRef.current = true;
    if (lessonProgress(lesson, classId).status === 'planned') {
      setLessonProgress(lesson.id, classId, { status: 'in_progress' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson?.id, classId]);

  const presentation = useMemo(
    () => buildPresentationSteps(lesson?.slides ?? []),
    [lesson?.slides],
  );
  const total = presentation.steps.length;

  function goTo(next: number) {
    const clamped = Math.max(0, Math.min(total - 1, next));
    // Zmiana slajdu: oceniony uczen znika z ramki kola, nieoceniony zostaje.
    if (clamped !== index) wheel.clearGradedStudent();
    setIndex(clamped);
  }

  const currentStep = presentation.steps[index];
  const currentSlide = currentStep?.kind === 'slide' ? currentStep.slide : undefined;
  // Kolo na lekcji: slajd zadania albo screen zadania z podrecznika (obraz z kodem).
  const taskCode = currentSlide?.kind === 'task' ? currentSlide.code : currentSlide?.kind === 'image' ? (currentSlide.code ?? '') : '';
  // Rysowanie po slajdzie - stan trzyma prezentacja, wiec kreski przezywaja
  // przejscie na kolejny slajd i powrot (patrz useSlideAnnotations).
  const writePaneOn = writePane && !boardOpen && supportsWritePane(currentSlide);
  // Pismo z pola obok tresci trzyma sie osobno od kresek po zwyklym slajdzie -
  // po wyjsciu z trybu pisania nie lezy na ilustracji.
  const ann = useSlideAnnotations(
    boardOpen ? `board:${lesson?.id ?? 'lesson'}` : writePaneOn ? `${currentStep?.id}:pisanie` : currentStep?.id,
  );

  usePresentKeys({
    index,
    total,
    onRecap: !boardOpen && currentSlide?.kind === 'recap',
    onTask: !boardOpen && taskCode !== '',
    classPanelOpen,
    setClassPanelOpen,
    wheelOpen: wheel.open,
    setWheelOpen: wheel.setOpen,
    onSpin: wheel.spin,
    onGrade: (result) => wheel.grade(result, taskCode),
    onUndo: wheel.undoLast,
    goTo,
    toggleFullscreen,
    exit: () => navigate(lessonsUrl),
    drawing: ann.tool !== 'off',
    onToggleDraw: ann.toggleDrawing,
    onTextTool: () => ann.setTool('text'),
    onLineTool: () => ann.setTool('line'),
    onToggleBoard: () => setBoardOpen((open) => !open),
    onDrawOff: () => ann.setTool('off'),
    onDrawUndo: ann.undo,
    onToggleGlobalTimer: () => setGlobalTimerVisible((visible) => !visible),
    onToggleWritePane: () => {
      const next = !writePane;
      setWritePane(next);
      // Wejscie w tryb pisania od razu daje pisak - po to sie go wlacza.
      if (next && ann.tool === 'off') ann.setTool('pen');
      if (!next) ann.setTool('off');
    },
  });

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      rootRef.current?.requestFullscreen();
    }
  }

  function finishLesson() {
    if (!lesson || !classId) return;
    setLessonProgress(lesson.id, classId, { status: 'done', doneDate: todayKey() });
    navigate(lessonsUrl);
  }

  if (!lesson) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-950" style={{ height: '100vh' }}>
        <EmptyState
          title="Nie znaleziono lekcji"
          action={
            <Button variant="secondary" onClick={() => navigate('/lekcje')}>
              Wróć do listy lekcji
            </Button>
          }
        />
      </div>
    );
  }

  if (!classId) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-950" style={{ height: '100vh' }}>
        <EmptyState
          title="Ta lekcja nie ma żadnej klasy"
          action={
            <Button variant="secondary" onClick={() => navigate('/lekcje')}>
              Wróć do lekcji
            </Button>
          }
        />
      </div>
    );
  }

  if (lesson.slides.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 bg-gray-950 text-gray-200" style={{ height: '100vh' }}>
        <p className="text-2xl">Ta lekcja nie ma jeszcze slajdów.</p>
        <Button variant="secondary" onClick={() => navigate(`/lekcje/${lesson.id}/edytuj?klasa=${classId}`)}>
          Przejdź do edytora
        </Button>
      </div>
    );
  }

  const isPreparation = !boardOpen && currentStep.kind === 'preparation';
  const isRecap = !boardOpen && currentSlide?.kind === 'recap';
  const isTask = !boardOpen && taskCode !== '';
  const isLast = index === total - 1;
  const drawerOpen = isTask && wheel.open;

  return (
    <div ref={rootRef} className="relative flex flex-row bg-gray-950" style={{ height: '100vh' }}>
      <div
        className="h-full min-w-0 flex-1"
        onClick={(e) => {
          if (boardOpen) return;
          if (isRecap || isPreparation) return;
          // Przy wlaczonym rysowaniu klik nalezy do pisaka, nie do nawigacji.
          if (ann.tool !== 'off') return;
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          if (clickX < rect.width / 2) {
            goTo(index - 1);
          } else {
            goTo(index + 1);
          }
        }}
      >
        {boardOpen ? (
          <PresentationBoard ann={ann} />
        ) : isPreparation ? (
          <LessonStartTimer onContinue={() => goTo(index + 1)} />
        ) : currentSlide ? (
          <SlideView
            slide={currentSlide}
            classId={classId}
            lessonCode={lessonCode}
            lessonTopic={lesson.registerTopic || lesson.title}
            textbookPage={presentation.textbookPage}
            onRecapExit={() => (isLast ? finishLesson() : goTo(index + 1))}
            overlay={<AnnotationLayer ann={ann} />}
            writePane={writePaneOn}
          />
        ) : null}
      </div>

      {drawerOpen && <TaskWheelDrawer wheel={wheel} taskCode={taskCode} onClose={() => wheel.setOpen(false)} />}

      {isTask && (
        <button
          type="button"
          onClick={() => wheel.setOpen(!wheel.open)}
          aria-label={wheel.open ? 'Zamknij koło na lekcji' : 'Otwórz koło na lekcji'}
          aria-expanded={wheel.open}
          className="fixed right-0 top-1/3 z-40 -translate-y-1/2 rounded-l-md bg-gray-800/60 px-1.5 py-4 text-[11px] tracking-wide text-gray-300 hover:bg-gray-800/90"
          style={{ writingMode: 'vertical-rl' }}
        >
          Koło
        </button>
      )}

      {!isRecap && !isPreparation && !boardOpen && (
        <PresentClassPanel classId={classId} open={classPanelOpen} onOpenChange={setClassPanelOpen} />
      )}

      {isLast && !boardOpen && (
        <div className="absolute bottom-4 left-4" onClick={(e) => e.stopPropagation()}>
          <Button size="sm" onClick={finishLesson}>
            Zakończ lekcję
          </Button>
        </div>
      )}

      {!isRecap && !isPreparation && <AnnotationToolbar ann={ann} />}


      {!isPreparation && <PresentationTimer onRecap={isRecap} visible={globalTimerVisible} onVisibleChange={setGlobalTimerVisible} />}

      {!boardOpen && <PresentProgressBar index={index} total={total} />}
      {/* Na slajdzie kola prawy bok zajmuja pasek RecapToolbar i panel uczniow - zegar idzie w lewy gorny rog. */}
      <PresentClock position={isRecap ? 'top-left' : 'top-right'} />
    </div>
  );
}
