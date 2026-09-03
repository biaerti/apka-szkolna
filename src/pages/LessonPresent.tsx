// Ekran projektora - prezentacja lekcji. Poza AppShell, pelny ekran, ciemne tlo.

import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../data/store';
import { SlideView } from '../components/slides/SlideView';
import { PresentProgressBar } from '../components/lessons/PresentProgressBar';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';

function isTypingTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
}

export function LessonPresent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const lessons = useStore((s) => s.lessons);
  const updateLesson = useStore((s) => s.updateLesson);
  const lesson = lessons.find((l) => l.id === id);

  const [index, setIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!lesson || startedRef.current) return;
    startedRef.current = true;
    if (lesson.status === 'planned') {
      updateLesson(lesson.id, { status: 'in_progress' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson?.id]);

  const total = lesson?.slides.length ?? 0;

  function goTo(next: number) {
    setIndex(Math.max(0, Math.min(total - 1, next)));
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (isTypingTarget(e.target)) return;
      const onRecap = lesson?.slides[index]?.kind === 'recap';
      if (onRecap && (e.key === ' ' || e.key === 'Escape')) return;

      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        goTo(index + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        goTo(index - 1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        goTo(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goTo(total - 1);
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'Escape') {
        if (!document.fullscreenElement) {
          navigate('/lekcje');
        }
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, total, lesson]);

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      rootRef.current?.requestFullscreen();
    }
  }

  function finishLesson() {
    if (!lesson) return;
    updateLesson(lesson.id, { status: 'done', doneDate: new Date().toISOString().slice(0, 10) });
    navigate('/lekcje');
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

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 bg-gray-950 text-gray-200" style={{ height: '100vh' }}>
        <p className="text-2xl">Ta lekcja nie ma jeszcze slajdów.</p>
        <Button variant="secondary" onClick={() => navigate(`/lekcje/${lesson.id}/edytuj`)}>
          Przejdź do edytora
        </Button>
      </div>
    );
  }

  const slide = lesson.slides[index];
  const isRecap = slide.kind === 'recap';
  const isLast = index === total - 1;

  return (
    <div ref={rootRef} className="relative bg-gray-950" style={{ height: '100vh' }}>
      <div
        className="h-full w-full"
        onClick={(e) => {
          if (isRecap) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          if (clickX < rect.width / 2) {
            goTo(index - 1);
          } else {
            goTo(index + 1);
          }
        }}
      >
        <SlideView slide={slide} classId={lesson.classId} onRecapExit={() => (isLast ? finishLesson() : goTo(index + 1))} />
      </div>

      {isLast && (
        <div className="absolute bottom-4 left-4" onClick={(e) => e.stopPropagation()}>
          <Button size="sm" onClick={finishLesson}>
            Zakończ lekcję
          </Button>
        </div>
      )}

      <PresentProgressBar index={index} total={total} />
    </div>
  );
}
