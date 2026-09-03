// Kontrakt: sesja powtorki (kolo fortuny + pytania) uzywana zarowno przez strone
// /powtorka/:classId/:setId, jak i przez slajd `recap` w prezentacji lekcji.
// Implementacja: modul powtorki. Nie zmieniac sygnatury propsow.

import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../../data/store';
import { Wheel } from './Wheel';
import { QuestionPanel } from './QuestionPanel';
import { ScoreButtons } from './ScoreButtons';
import { HintPicker } from './HintPicker';
import { StudentSidebar } from './StudentSidebar';
import { SequentialPicker } from './SequentialPicker';
import { useRecapSession, type PickMode } from './useRecapSession';

export interface RecapSessionProps {
  classId: string;
  setId: string;
  /** Wywolywane po kliknieciu "Zakoncz" (np. powrot do prezentacji). */
  onExit?: () => void;
  /** true gdy osadzone w prezentacji - bez wlasnego przycisku fullscreen. */
  embedded?: boolean;
  /** Lista id nieobecnych uczniow (przekazana ze strony wyboru). Domyslnie: wszyscy obecni. */
  absentIds?: string[];
  /** Domyslny sposob wyboru ucznia, gdy brak parametrow w query string. */
  initialPickMode?: PickMode;
  /** Domyslnie: czy sesja ocenia odpowiedzi, gdy brak parametrow w query string. */
  initialGrading?: boolean;
  /** Domyslnie: czy pytania sa losowe, gdy brak parametrow w query string. */
  initialRandomQuestions?: boolean;
}

export function RecapSession({
  classId,
  setId,
  onExit,
  embedded,
  absentIds,
  initialPickMode,
  initialGrading,
  initialRandomQuestions,
}: RecapSessionProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const schoolClass = useStore((s) => s.classes.find((c) => c.id === classId));
  const questionSet = useStore((s) => s.questionSets.find((qs) => qs.id === setId));

  // Ustawienia trybow (wybor ucznia / pytania / ocenianie) czytane w kolejnosci:
  // 1) query string (?pick=sequential&random=1&grading=0) - uzywane przez strone
  //    /powtorka (RecapScreen po prostu przekazuje URL dalej);
  // 2) propsy initial* (przekazywane np. przez inny embed);
  // 3) heurystyka: lekcja zapoznawcza ("Poznajmy się", topic zestawu === 'Lekcja
  //    zapoznawcza') bez jawnych parametrow startuje od razu w trybie po kolei,
  //    z losowymi pytaniami i bez ocen - tak, zeby slajd recap w prezentacji tej
  //    lekcji dzialal "z automatu";
  // 4) wartosci domyslne modulu powtorki (kolo, pytania po kolei, ocenianie wl.).
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const queryPick = searchParams.get('pick');
  const explicitPick: PickMode | undefined =
    queryPick === 'sequential' || queryPick === 'wheel' ? queryPick : undefined;
  const explicitRandom = searchParams.has('random') ? searchParams.get('random') === '1' : undefined;
  const explicitGrading = searchParams.has('grading') ? searchParams.get('grading') === '1' : undefined;

  const hasExplicitSettings =
    explicitPick !== undefined ||
    explicitRandom !== undefined ||
    explicitGrading !== undefined ||
    initialPickMode !== undefined ||
    initialGrading !== undefined ||
    initialRandomQuestions !== undefined;

  const isIntroLesson = questionSet?.topic === 'Lekcja zapoznawcza';
  const introDefaultPick: PickMode = 'sequential';

  const resolvedPickMode: PickMode =
    explicitPick ?? initialPickMode ?? (!hasExplicitSettings && isIntroLesson ? introDefaultPick : 'wheel');
  const resolvedRandomOrder =
    explicitRandom ?? initialRandomQuestions ?? (!hasExplicitSettings && isIntroLesson ? true : false);
  const resolvedGrading =
    explicitGrading ?? initialGrading ?? (!hasExplicitSettings && isIntroLesson ? false : true);

  const session = useRecapSession({
    classId,
    setId,
    absentIds,
    initialPickMode: resolvedPickMode,
    initialGrading: resolvedGrading,
    initialRandomOrder: resolvedRandomOrder,
  });
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
        if (s.canSpin) s.pickNext();
      } else if (e.key === 'Enter') {
        if (!s.grading && s.currentStudent) s.markDoneNoGrade();
      } else if (e.key === '1') {
        if (s.grading) s.grade('plus');
      } else if (e.key === '2') {
        if (s.grading) s.grade('minus');
      } else if (e.key === '3') {
        if (s.grading && s.currentCanPass) s.grade('pass');
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
            wybór ucznia:
            <select
              value={session.pickMode}
              onChange={(e) => session.setPickMode(e.target.value as 'wheel' | 'sequential')}
              className="rounded border-gray-600 bg-gray-800 px-1.5 py-0.5 text-xs text-gray-200"
            >
              <option value="wheel">koło</option>
              <option value="sequential">po kolei</option>
            </select>
          </label>
          <label className="flex items-center gap-1.5">
            <input
              type="checkbox"
              checked={session.grading}
              onChange={(e) => session.setGrading(e.target.checked)}
              className="rounded border-gray-500"
            />
            oceniaj
          </label>
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
              ) : session.pickMode === 'sequential' ? (
                <SequentialPicker
                  students={session.presentStudents}
                  usedIds={session.usedIds}
                  nextStudentId={session.pool[0]?.id ?? null}
                  currentStudentId={session.currentStudent?.id ?? null}
                />
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
              onClick={session.pickNext}
              disabled={!session.canSpin}
              className="shrink-0 rounded-lg bg-accent-600 px-8 py-2.5 text-xl font-semibold hover:bg-accent-700 disabled:opacity-40"
            >
              {session.pickMode === 'sequential' ? 'Następny uczeń (Spacja)' : 'Kręć (Spacja)'}
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
                <span className="text-gray-400">
                  {session.pickMode === 'sequential' ? 'Wybierz następnego ucznia' : 'Kręć kołem'}
                </span>
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
              {session.grading ? (
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
              ) : (
                <button
                  type="button"
                  onClick={session.markDoneNoGrade}
                  disabled={!session.currentStudent}
                  className="w-full rounded-lg bg-accent-600 px-4 py-4 text-2xl font-semibold text-white hover:bg-accent-700 disabled:opacity-40"
                >
                  Gotowe, następny (Enter)
                </button>
              )}
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
          showBalance={session.grading}
        />
      </div>

      <div className="shrink-0 border-t border-gray-800 px-4 py-1 text-xs text-gray-500">
        {session.pickMode === 'sequential' ? 'Spacja: następny uczeń' : 'Spacja: kręć'}
        {session.grading
          ? ' - 1: dobrze - 2: źle - 3: pas'
          : ' - Enter: gotowe, następny'}
        {' '}- N: następne pytanie - O: pokaż odpowiedź
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
