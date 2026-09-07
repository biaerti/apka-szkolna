// Ekran projektora - kartkowka / klasowka. Poza AppShell, pelny ekran, ciemne
// tlo. Dzieci przepisuja pytania z ekranu na kartki, wiec domyslnie widac
// WSZYSTKIE pytania naraz (widok "wszystkie"); klawisz W przelacza na "po
// jednym" (do dyktowania). Odpowiedzi domyslnie ukryte - klawisz O pokazuje
// je tylko wtedy, gdy nauczyciel sam tego chce (np. przy omawianiu).

import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../data/store';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { QuizAllView } from '../components/quizzes/QuizAllView';
import { QuizOneView } from '../components/quizzes/QuizOneView';
import { formatQuizDate, quizKindLabel, quizKindTitle, renumber } from '../lib/quiz';

type View = 'all' | 'one';

function isTypingTarget(el: EventTarget | null): boolean {
  return el instanceof HTMLElement && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
}

export function QuizPresent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const quiz = useStore((s) => s.quizzes.find((q) => q.id === id));
  const cls = useStore((s) => s.classes.find((c) => c.id === quiz?.classId));

  const [view, setView] = useState<View>('all');
  const [index, setIndex] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const questions = quiz ? renumber(quiz.questions) : [];
  const total = questions.length;

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else rootRef.current?.requestFullscreen();
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (isTypingTarget(e.target)) return;
      const key = e.key;
      if (key === 'w' || key === 'W') {
        e.preventDefault();
        setView((v) => (v === 'all' ? 'one' : 'all'));
      } else if (key === 'o' || key === 'O') {
        e.preventDefault();
        setShowAnswers((v) => !v);
      } else if (key === 'f' || key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (key === 'ArrowRight' || key === ' ' || key === 'PageDown') {
        e.preventDefault();
        setIndex((i) => Math.min(total - 1, i + 1));
      } else if (key === 'ArrowLeft' || key === 'PageUp') {
        e.preventDefault();
        setIndex((i) => Math.max(0, i - 1));
      } else if (key === 'Home') {
        setIndex(0);
      } else if (key === 'End') {
        setIndex(Math.max(0, total - 1));
      } else if (key === 'Escape') {
        if (!document.fullscreenElement) navigate('/kartkowki');
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [total, navigate]);

  if (!quiz) {
    return (
      <div className="flex items-center justify-center bg-gray-950" style={{ height: '100vh' }}>
        <EmptyState
          title="Nie znaleziono kartkówki"
          action={
            <Button variant="secondary" onClick={() => navigate('/kartkowki')}>
              Wróć do listy
            </Button>
          }
        />
      </div>
    );
  }

  // Domyslny tytul ("Kartkówka 07.09.2026") ma juz rodzaj i date - nie
  // dublujemy ich w naglowku, dopisujemy tylko to, czego w tytule nie ma.
  const date = formatQuizDate(quiz.date);
  const header = [
    quiz.title.toLowerCase().includes(quizKindLabel(quiz.kind)) ? '' : quizKindTitle(quiz.kind),
    quiz.title,
    cls?.name ?? '',
    date && !quiz.title.includes(date) ? date : '',
  ]
    .filter((part) => part !== '')
    .join(' - ');

  return (
    <div ref={rootRef} className="relative flex flex-col bg-gray-950 px-[3vw] py-[2vh]" style={{ height: '100vh' }}>
      <p className="shrink-0 truncate text-[1.6vw] text-gray-400">{header}</p>

      {total === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-gray-200">
          <p className="text-2xl">Ta kartkówka nie ma jeszcze pytań.</p>
          <Button variant="secondary" onClick={() => navigate(`/kartkowki/${quiz.id}`)}>
            Dodaj pytania
          </Button>
        </div>
      ) : view === 'all' ? (
        <QuizAllView questions={questions} showAnswers={showAnswers} />
      ) : (
        <div
          className="flex flex-1 flex-col"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const left = e.clientX - rect.left < rect.width / 2;
            setIndex((i) => (left ? Math.max(0, i - 1) : Math.min(total - 1, i + 1)));
          }}
        >
          <QuizOneView question={questions[Math.min(index, total - 1)]} index={Math.min(index, total - 1)} total={total} showAnswers={showAnswers} />
        </div>
      )}

      <p className="shrink-0 text-center text-[1.1vw] text-gray-500">
        W: {view === 'all' ? 'po jednym pytaniu' : 'wszystkie pytania'}
        {view === 'one' && ' - strzałki / Spacja: następne, poprzednie'}
        {' - O: '}
        {showAnswers ? 'ukryj odpowiedzi' : 'pokaż odpowiedzi'} - F: pełny ekran - Esc: wyjście
      </p>
    </div>
  );
}
