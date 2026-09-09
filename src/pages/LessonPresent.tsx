// Ekran projektora - prezentacja lekcji. Poza AppShell, pelny ekran, ciemne tlo.

import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../data/store';
import { SlideView } from '../components/slides/SlideView';
import { AnnotationLayer } from '../components/slides/AnnotationLayer';
import { AnnotationToolbar } from '../components/slides/AnnotationToolbar';
import { useSlideAnnotations } from '../components/slides/useSlideAnnotations';
import { PresentProgressBar } from '../components/lessons/PresentProgressBar';
import { PresentClassPanel } from '../components/lessons/PresentClassPanel';
import { PresentClock } from '../components/lessons/PresentClock';
import { TaskWheelDrawer } from '../components/lessons/TaskWheelDrawer';
import { NoiseMeterBars } from '../components/lessons/NoiseMeterBars';
import { useNoiseMeter } from '../components/lessons/useNoiseMeter';
import { useTaskWheel } from '../components/lessons/useTaskWheel';
import { usePresentKeys } from '../components/lessons/usePresentKeys';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { classesOfGrade, lessonProgress, todayKey } from '../lib/grade';

export function LessonPresent() {
  const { id, classId: classIdParam } = useParams<{ id: string; classId?: string }>();
  const navigate = useNavigate();
  const lessons = useStore((s) => s.lessons);
  const classes = useStore((s) => s.classes);
  const setLessonProgress = useStore((s) => s.setLessonProgress);
  const lesson = lessons.find((l) => l.id === id);

  const classId = classIdParam ?? (lesson ? classesOfGrade(classes, lesson.grade)[0]?.id : undefined);

  const [index, setIndex] = useState(0);
  const [classPanelOpen, setClassPanelOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  // Kolo na lekcji - stan na poziomie prezentacji, zeby przezyl zmiany slajdow.
  const wheel = useTaskWheel({ classId: classId ?? '', lessonCode: lesson?.code });
  // Decybelomierz - stan na poziomie prezentacji, zeby ladowanie kartkowki przezylo zmiany slajdow.
  const noise = useNoiseMeter();

  useEffect(() => {
    if (!lesson || !classId || startedRef.current) return;
    startedRef.current = true;
    if (lessonProgress(lesson, classId).status === 'planned') {
      setLessonProgress(lesson.id, classId, { status: 'in_progress' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson?.id, classId]);

  const total = lesson?.slides.length ?? 0;

  function goTo(next: number) {
    const clamped = Math.max(0, Math.min(total - 1, next));
    // Zmiana slajdu: oceniony uczen znika z ramki kola, nieoceniony zostaje.
    if (clamped !== index) wheel.clearGradedStudent();
    setIndex(clamped);
  }

  const currentSlide = lesson?.slides[index];
  const taskCode = currentSlide?.kind === 'task' ? currentSlide.code : '';
  // Rysowanie po slajdzie - stan trzyma prezentacja, wiec kreski przezywaja
  // przejscie na kolejny slajd i powrot (patrz useSlideAnnotations).
  const ann = useSlideAnnotations(currentSlide?.id);

  usePresentKeys({
    index,
    total,
    onRecap: currentSlide?.kind === 'recap',
    onTask: currentSlide?.kind === 'task',
    classPanelOpen,
    setClassPanelOpen,
    wheelOpen: wheel.open,
    setWheelOpen: wheel.setOpen,
    onSpin: wheel.spin,
    onGrade: (result) => wheel.grade(result, taskCode),
    onUndo: wheel.undoLast,
    goTo,
    toggleFullscreen,
    exit: () => navigate(classId ? `/lekcje?klasa=${classId}` : '/lekcje'),
    drawing: ann.tool !== 'off',
    onToggleDraw: ann.toggleDrawing,
    onTextTool: () => ann.setTool('text'),
    onDrawOff: () => ann.setTool('off'),
    onDrawUndo: ann.undo,
    onToggleNoisePause: noise.togglePause,
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
    navigate(`/lekcje?klasa=${classId}`);
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

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 bg-gray-950 text-gray-200" style={{ height: '100vh' }}>
        <p className="text-2xl">Ta lekcja nie ma jeszcze slajdów.</p>
        <Button variant="secondary" onClick={() => navigate(`/lekcje/${lesson.id}/edytuj?klasa=${classId}`)}>
          Przejdź do edytora
        </Button>
      </div>
    );
  }

  const slide = lesson.slides[index];
  const isRecap = slide.kind === 'recap';
  const isTask = slide.kind === 'task';
  const isLast = index === total - 1;
  const drawerOpen = isTask && wheel.open;

  return (
    <div ref={rootRef} className="relative flex flex-row bg-gray-950" style={{ height: '100vh' }}>
      <div
        className="h-full min-w-0 flex-1"
        onClick={(e) => {
          if (isRecap) return;
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
        <SlideView
          slide={slide}
          classId={classId}
          lessonCode={lesson.code}
          lessonTopic={lesson.registerTopic || lesson.title}
          onRecapExit={() => (isLast ? finishLesson() : goTo(index + 1))}
          overlay={<AnnotationLayer ann={ann} />}
        />
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

      {!isRecap && (
        <PresentClassPanel classId={classId} open={classPanelOpen} onOpenChange={setClassPanelOpen} />
      )}

      {isLast && (
        <div className="absolute bottom-4 left-4" onClick={(e) => e.stopPropagation()}>
          <Button size="sm" onClick={finishLesson}>
            Zakończ lekcję
          </Button>
        </div>
      )}

      {!isRecap && <AnnotationToolbar ann={ann} />}

      {!isRecap && <NoiseMeterBars meter={noise} />}

      <PresentProgressBar index={index} total={total} />
      {/* Na slajdzie kola prawy bok zajmuja pasek RecapToolbar i panel uczniow - zegar idzie w lewy gorny rog. */}
      <PresentClock position={isRecap ? 'top-left' : 'top-right'} />
    </div>
  );
}
