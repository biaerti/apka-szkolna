// Kontrakt: sesja powtorki (kolo fortuny + pytania) uzywana zarowno przez strone
// /powtorka/:classId/:setId, jak i przez slajd `recap` w prezentacji lekcji.
// Implementacja: modul powtorki. Nie zmieniac sygnatury propsow.

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../data/store';
import { Wheel } from './Wheel';
import { QuestionPanel } from './QuestionPanel';
import { ScoreButtons } from './ScoreButtons';
import { HintPicker } from './HintPicker';
import { StudentSidebar } from './StudentSidebar';
import { useRecapSession } from './useRecapSession';

export interface RecapSessionProps {
  classId: string;
  setId: string;
  /** Wywolywane po kliknieciu "Zakoncz" (np. powrot do prezentacji). */
  onExit?: () => void;
  /** true gdy osadzone w prezentacji - bez wlasnego przycisku fullscreen. */
  embedded?: boolean;
  /** Lista id nieobecnych uczniow (przekazana ze strony wyboru). Domyslnie: wszyscy obecni. */
  absentIds?: string[];
}

export function RecapSession({ classId, setId, onExit, embedded, absentIds }: RecapSessionProps) {
  const navigate = useNavigate();
  const schoolClass = useStore((s) => s.classes.find((c) => c.id === classId));
  const questionSet = useStore((s) => s.questionSets.find((qs) => qs.id === setId));

  const session = useRecapSession({ classId, setId, absentIds });
  const sessionRef = useRef(session);
  sessionRef.current = session;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hintOpen, setHintOpen] = useState(false);

  // Ekran projektora: caly ekran ma byc ciemny i nie przewijac sie. Ustawiamy
  // tlo tez na <body>, zeby przy ew. odbiciu (rubber-band scroll) nie bylo
  // widac bialego tla strony. Przywracamy przy odmontowaniu.
  useEffect(() => {
    const prevBg = document.body.style.background;
    document.body.style.background = '#030712';
    return () => {
      document.body.style.background = prevBg;
    };
  }, []);

  const wheelAreaRef = useRef<HTMLDivElement>(null);
  const [wheelSize, setWheelSize] = useState(360);

  useEffect(() => {
    const el = wheelAreaRef.current;
    if (!el) return;
    function recompute(width: number, height: number) {
      const size = Math.max(120, Math.min(width - 16, height - 16));
      setWheelSize(size);
    }
    recompute(el.clientWidth, el.clientHeight);
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        recompute(width, height);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function handleExit() {
    if (onExit) onExit();
    else navigate('/powtorka');
  }

  function toggleFullscreen() {
    if (embedded) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

      const s = sessionRef.current;
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        if (s.canSpin) s.spin();
      } else if (e.key === '1') {
        s.grade('plus');
      } else if (e.key === '2') {
        s.grade('minus');
      } else if (e.key === '3') {
        if (s.currentCanPass) s.grade('pass');
      } else if (e.key === 'n' || e.key === 'N') {
        s.nextQuestion();
      } else if (e.key === 'o' || e.key === 'O') {
        s.setShowAnswer((v) => !v);
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'Escape') {
        handleExit();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [embedded]);

  if (!schoolClass || !questionSet) {
    return (
      <div className="flex h-screen items-center justify-center overflow-hidden bg-gray-950 text-white">
        Nie znaleziono klasy lub zestawu pytań.
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-950 text-white">
      <div className="flex shrink-0 items-center justify-between border-b border-gray-800 px-4 py-1.5 text-xs text-gray-300">
        <div>
          {schoolClass.name} - {questionSet.name}
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={session.allowRepeats}
              onChange={(e) => session.setAllowRepeats(e.target.checked)}
              className="rounded border-gray-500"
            />
            pozwól na powtórki
          </label>
          <button
            type="button"
            onClick={session.undoLast}
            disabled={!session.canUndo}
            className="rounded-md border border-gray-600 px-2.5 py-1 hover:bg-gray-800 disabled:opacity-40"
          >
            cofnij ostatnią ocenę
          </button>
          {!embedded && (
            <button
              type="button"
              onClick={toggleFullscreen}
              className="rounded-md border border-gray-600 px-2.5 py-1 hover:bg-gray-800"
            >
              pełny ekran (F)
            </button>
          )}
          <button
            type="button"
            onClick={handleExit}
            className="rounded-md bg-red-700 px-2.5 py-1 hover:bg-red-600"
          >
            Zakończ
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
          {/* Lewa kolumna: kolo + przycisk kręć. */}
          <div
            className="flex min-h-0 flex-col items-center justify-center gap-2 border-r border-gray-800 px-2 py-2"
            style={{ width: '50%' }}
          >
            <div ref={wheelAreaRef} className="flex min-h-0 w-full flex-1 items-center justify-center">
              {session.pool.length === 0 && !session.currentStudent ? (
                <div className="flex flex-col items-center gap-4">
                  <p className="text-xl text-gray-300">Wszyscy obecni uczniowie już odpowiadali.</p>
                  <button
                    type="button"
                    onClick={session.startNewRound}
                    className="rounded-md bg-accent-600 px-5 py-2.5 text-lg font-medium hover:bg-accent-700"
                  >
                    zacznij nową rundę
                  </button>
                </div>
              ) : (
                <Wheel
                  students={session.pool}
                  spinning={session.spinning}
                  targetAngle={session.wheelTarget}
                  spinToken={session.spinToken}
                  spinSec={session.settings.wheelSpinSec}
                  onSpinEnd={session.handleSpinEnd}
                  size={wheelSize}
                  highlightStudentId={session.currentStudent?.id ?? null}
                />
              )}
            </div>

            <button
              type="button"
              onClick={session.spin}
              disabled={!session.canSpin}
              className="shrink-0 rounded-lg bg-accent-600 px-8 py-2.5 text-xl font-semibold hover:bg-accent-700 disabled:opacity-40"
            >
              Kręć (Spacja)
            </button>
          </div>

          {/* Prawa kolumna: wylosowany uczen, pytanie, oceny. Pytanie widoczne zawsze. */}
          <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2 overflow-hidden px-4 py-2">
            <p
              className="shrink-0 text-center font-bold leading-tight"
              style={{ fontSize: 'clamp(40px, 6vw, 80px)' }}
            >
              {session.currentStudent ? (
                <span className="text-white">
                  {session.currentStudent.firstName} {session.currentStudent.lastName}
                </span>
              ) : (
                <span className="text-gray-400">Kręć kołem</span>
              )}
            </p>

            <div className="min-h-0 flex-1 overflow-hidden">
              <QuestionPanel
                question={session.currentQuestion}
                index={session.questionIndex}
                total={session.orderedQuestions.length}
                onNext={session.nextQuestion}
                onPrev={session.prevQuestion}
                randomOrder={session.randomOrder}
                onToggleRandom={session.setRandomOrder}
                showAnswer={session.showAnswer}
                onToggleShowAnswer={() => session.setShowAnswer((v) => !v)}
              />
            </div>

            <div className="shrink-0">
              <ScoreButtons
                disabled={!session.currentStudent}
                graded={session.graded}
                onGrade={session.grade}
                canPass={session.currentCanPass}
                passesUsed={session.currentPassesUsed}
                passesPerWeek={session.settings.passesPerWeek}
                hintGivesMinus={session.settings.hintGivesMinus}
                onOpenHint={() => setHintOpen(true)}
              />
            </div>
          </div>
        </div>

        <StudentSidebar
          open={sidebarOpen}
          onToggleOpen={() => setSidebarOpen((v) => !v)}
          students={session.classStudents}
          usedIds={session.usedIds}
          absentSet={session.absentSet}
          currentStudentId={session.currentStudent?.id ?? null}
          balanceFor={session.balanceFor}
          onTogglePresent={session.togglePresent}
        />
      </div>

      <div className="shrink-0 border-t border-gray-800 px-4 py-1 text-xs text-gray-500">
        Spacja: kręć - 1: dobrze - 2: źle - 3: pas - N: następne pytanie - O: pokaż odpowiedź
        {!embedded && ' - F: pełny ekran'} - Esc: zakończ
      </div>

      <HintPicker
        open={hintOpen}
        students={session.presentStudents}
        excludeStudentId={session.currentStudent?.id ?? null}
        onPick={session.addHint}
        onClose={() => setHintOpen(false)}
      />
    </div>
  );
}
