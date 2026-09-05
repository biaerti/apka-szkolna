// Kontrakt: sesja powtorki (kolo fortuny + pytania) uzywana zarowno przez strone
// /powtorka/:classId/:setId, jak i przez slajd `recap` w prezentacji lekcji.
// Implementacja: modul powtorki. Nie zmieniac sygnatury propsow.

import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../../data/store';
import { StudentPicker } from './StudentPicker';
import { QuestionPicker } from './QuestionPicker';
import { StudentSidebar } from './StudentSidebar';
import { RecapToolbar } from './RecapToolbar';
import { RecapWheelPanel } from './RecapWheelPanel';
import { RecapAnswerPanel } from './RecapAnswerPanel';
import { useRecapKeys } from './useRecapKeys';
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
  // 1) query string (?pick=sequential&random=1&grading=0) - RecapScreen przekazuje
  //    URL dalej, wiec da sie wymusic tryb linkiem;
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hintOpen, setHintOpen] = useState(false);
  const [uwagaOpen, setUwagaOpen] = useState(false);
  const [questionPickerOpen, setQuestionPickerOpen] = useState(false);

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

  function handleExit() {
    if (onExit) onExit();
    // Osobnej zakladki "Powtorka" juz nie ma - kolo odpala sie ze slajdu w lekcji,
    // wiec wyjscie bez `onExit` (otwarcie strony wprost z URL) wraca do lekcji, na
    // zakladke tej klasy, ktora to kolo prowadzila.
    else navigate(`/lekcje?klasa=${classId}`);
  }

  function toggleFullscreen() {
    if (embedded) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }

  useRecapKeys(session, embedded, handleExit, toggleFullscreen);

  if (!schoolClass || !questionSet) {
    return (
      <div className="flex h-screen items-center justify-center overflow-hidden bg-gray-950 text-white">
        Nie znaleziono klasy lub zestawu pytań.
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-950 text-white">
      <RecapToolbar
        className={schoolClass.name}
        questionSetName={questionSet.name}
        pickMode={session.pickMode}
        onChangePickMode={session.setPickMode}
        grading={session.grading}
        onChangeGrading={session.setGrading}
        allowRepeats={session.allowRepeats}
        onChangeAllowRepeats={session.setAllowRepeats}
        drawsCompleted={session.drawsCompleted}
        plannedTotal={session.plannedTotal}
        inProgress={!!session.currentStudent && !session.graded}
        canUndo={session.canUndo}
        onUndo={session.undoLast}
        onOpenQuestionPicker={() => setQuestionPickerOpen(true)}
        embedded={embedded}
        onToggleFullscreen={toggleFullscreen}
        onExit={handleExit}
      />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
          <RecapWheelPanel session={session} />
          <RecapAnswerPanel
            session={session}
            onOpenHint={() => setHintOpen(true)}
            onOpenUwaga={() => setUwagaOpen(true)}
          />
        </div>

        <StudentSidebar
          open={sidebarOpen}
          onToggleOpen={() => setSidebarOpen((v) => !v)}
          students={session.classStudents}
          usedCount={session.usedCount}
          warningsFor={session.warningsFor}
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
          ? ' - 1: dobrze - 2: częściowo - 3: źle - 4: pas'
          : ' - Enter: gotowe, następny'}
        {' '}- N: następne pytanie - O: pokaż/ukryj odpowiedź
        {!embedded && ' - F: pełny ekran'} - Esc: zakończ
      </div>

      <StudentPicker
        open={hintOpen}
        title="Kto podpowiadał?"
        students={session.presentStudents}
        excludeStudentId={session.currentStudent?.id ?? null}
        onPick={session.addHint}
        onClose={() => setHintOpen(false)}
      />
      <StudentPicker
        open={uwagaOpen}
        title="Komu wpisać uwagę?"
        students={session.presentStudents}
        onPick={session.addUwaga}
        onClose={() => setUwagaOpen(false)}
      />
      <QuestionPicker
        open={questionPickerOpen}
        questions={session.allQuestions}
        currentQuestionId={session.currentQuestion?.id ?? null}
        askedQuestionIds={session.askedQuestionIds}
        onPick={session.jumpToQuestion}
        onClose={() => setQuestionPickerOpen(false)}
      />
    </div>
  );
}
