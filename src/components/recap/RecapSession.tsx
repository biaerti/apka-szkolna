// Kontrakt: sesja powtorki (kolo fortuny + pytania) uzywana zarowno przez strone
// /powtorka/:classId/:setId, jak i przez slajd `recap` w prezentacji lekcji.
// Implementacja: modul powtorki. Nie zmieniac sygnatury propsow.

import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../../data/store';
import { INTRO_PROMPT, INTRO_PROMPT_HINT, INTRO_SET_TOPIC } from '../../data/intro';
import { answersByQuestion, type RecapMode } from '../../lib/recap';
import { QuestionPicker } from './QuestionPicker';
import { StudentSidebar } from './StudentSidebar';
import { RecapToolbar } from './RecapToolbar';
import { RecapWheelPanel } from './RecapWheelPanel';
import { RecapAnswerPanel } from './RecapAnswerPanel';
import { useRecapKeys } from './useRecapKeys';
import { useRecapSession, type PickMode } from './useRecapSession';
import { RecapQuestionsOverview } from './RecapQuestionsOverview';

const REVIEW_QUESTION_COUNT = 3;

export interface RecapSessionProps {
  classId: string;
  setId: string;
  /** Wywolywane po kliknieciu "Zakoncz" (np. powrot do prezentacji). */
  onExit?: () => void;
  /** true gdy osadzone w prezentacji - bez wlasnego przycisku fullscreen. */
  embedded?: boolean;
  /** Domyslny sposob wyboru ucznia, gdy brak parametrow w query string. */
  initialPickMode?: PickMode;
  /** Domyslnie: czy sesja ocenia odpowiedzi, gdy brak parametrow w query string. */
  initialGrading?: boolean;
  /** Domyslnie: czy pytania sa losowe, gdy brak parametrow w query string. */
  initialRandomQuestions?: boolean;
  /**
   * Slajd 'recap' z variant: 'demo' (pierwsze pokazanie kola w lekcji
   * zapoznawczej) - dziala jak zwykla runda: bez naglowka "Przedstaw się" i
   * bez "dodatkowego pytania", mimo ze zestaw ma topic lekcji zapoznawczej.
   */
  demoVariant?: boolean;
  /**
   * Tryb rundy - "koło powtórzeniowe" (pelne ocenianie) albo stary tryb
   * po-lekcji (mozna bylo tylko zyskac; zostaje domyslnym fallbackiem dla
   * starych danych - patrz src/lib/recap.ts). Nadpisywany
   * query stringiem `?tryb=` na trasie /powtorka/:classId/:setId (patrz
   * RecapScreen) - dzieki temu ten sam link dziala tez spoza slajdu recap.
   */
  recapMode?: RecapMode;
  /** Ile pytan z zestawu na kole powtorzeniowym (domyslnie REVIEW_QUESTION_COUNT). */
  questionCount?: number;
  /** Kolo zaraz po filmiku - bez stopera na ekranie pytan (patrz Slide recap.afterVideo). */
  afterVideo?: boolean;
}

export function RecapSession({
  classId,
  setId,
  onExit,
  embedded,
  initialPickMode,
  initialGrading,
  initialRandomQuestions,
  demoVariant,
  recapMode,
  questionCount,
  afterVideo,
}: RecapSessionProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const schoolClass = useStore((s) => s.classes.find((c) => c.id === classId));
  const questionSet = useStore((s) => s.questionSets.find((qs) => qs.id === setId));
  const updateQuestion = useStore((s) => s.updateQuestion);
  const removeQuestion = useStore((s) => s.removeQuestion);
  const addQuestion = useStore((s) => s.addQuestion);
  // Pytania dopisane w trakcie (plus na liscie pytan) wchodza ponad limit zestawu.
  const [addedCount, setAddedCount] = useState(0);
  const reviewCount = (questionCount ?? REVIEW_QUESTION_COUNT) + addedCount;

  // Ustawienia trybow (wybor ucznia / pytania / ocenianie) czytane w kolejnosci:
  // 1) query string (?pick=sequential&random=1&grading=0) - RecapScreen przekazuje
  //    URL dalej, wiec da sie wymusic tryb linkiem;
  // 2) propsy initial* (przekazywane np. przez inny embed);
  // 3) heurystyka: lekcja zapoznawcza ("Poznajmy się", topic zestawu === 'Lekcja
  //    zapoznawcza') bez jawnych parametrow startuje od razu z losowymi pytaniami
  //    i bez ocen - tak, zeby slajd recap w prezentacji tej lekcji dzialal
  //    "z automatu" (wybor ucznia zawsze domyslnie kolem - patrz punkt 4);
  // 4) wartosci domyslne modulu powtorki (kolo, pytania po kolei, ocenianie wl.).
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const queryPick = searchParams.get('pick');
  const explicitPick: PickMode | undefined =
    queryPick === 'sequential' || queryPick === 'wheel' || queryPick === 'sala' ? queryPick : undefined;
  const explicitRandom = searchParams.has('random') ? searchParams.get('random') === '1' : undefined;
  const explicitGrading = searchParams.has('grading') ? searchParams.get('grading') === '1' : undefined;
  const queryTryb = searchParams.get('tryb');
  const explicitRecapMode: RecapMode | undefined =
    queryTryb === 'powtorzeniowe' || queryTryb === 'po-lekcji' ? queryTryb : undefined;
  // Kolejnosc jak przy pickMode/grading: query string > prop > domyslne 'po-lekcji'
  // (stary tryb - fallback dla starych danych, patrz src/lib/recap.ts).
  const resolvedRecapMode: RecapMode = explicitRecapMode ?? recapMode ?? 'po-lekcji';

  const hasExplicitSettings =
    explicitPick !== undefined ||
    explicitRandom !== undefined ||
    explicitGrading !== undefined ||
    initialPickMode !== undefined ||
    initialGrading !== undefined ||
    initialRandomQuestions !== undefined;

  // Topic decyduje o domyslnych ustawieniach rundy (kolo, losowe pytania, bez
  // ocen) - dotyczy zarowno slajdu demo, jak i wlasciwej rundy "Przedstaw się".
  // Naglowek "Przedstaw się" natomiast NIE pojawia sie w wariancie demo - patrz
  // isIntroLesson nizej.
  const isIntroTopic = questionSet?.topic === INTRO_SET_TOPIC;
  // Tryb intro (przedstawianie) = topic zestawu ORAZ brak variant: 'demo'.
  const isIntroLesson = isIntroTopic && !demoVariant;

  const resolvedPickMode: PickMode = explicitPick ?? initialPickMode ?? 'wheel';
  const resolvedRandomOrder =
    explicitRandom ?? initialRandomQuestions ?? (!hasExplicitSettings && isIntroTopic ? true : false);
  const resolvedGrading =
    explicitGrading ?? initialGrading ?? (!hasExplicitSettings && isIntroTopic ? false : true);

  const session = useRecapSession({
    classId,
    setId,
    initialPickMode: resolvedPickMode,
    initialGrading: resolvedGrading,
    initialRandomOrder: resolvedRandomOrder,
    recapMode: resolvedRecapMode,
    // Lekcja zapoznawcza: po zakreceniu kolem pytanie ZOSTAJE takie samo -
    // zmienia je dopiero nauczyciel ("nastepne pytanie" / N). W zwyklych
    // rundach z losowymi pytaniami kazdy nowy uczen dostaje nowe pytanie.
    advanceQuestionOnPick: !isIntroTopic,
    questionLimit: resolvedRecapMode === 'powtorzeniowe' ? reviewCount : undefined,
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [questionPickerOpen, setQuestionPickerOpen] = useState(false);
  const [overviewOpen, setOverviewOpen] = useState(resolvedRecapMode === 'powtorzeniowe');
  const [completedQuestionIds, setCompletedQuestionIds] = useState<Set<string>>(new Set());
  const reviewQuestions = session.allQuestions.slice(0, reviewCount);

  // Historia odpowiedzi tej klasy per pytanie - do panelu "wybierz pytanie".
  const answersMap = useMemo(
    () => answersByQuestion(session.recapEvents, classId),
    [session.recapEvents, classId],
  );

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

  // Plus i plomba zamykaja pytanie (przy plombie nauczyciel sam mowi odpowiedz),
  // kropka = odpowiedz czesciowa, wiec mozna krecic dalej przy tym samym pytaniu.
  // Na nastepne pytanie przechodzi nauczyciel klawiszem N albo numerem pytania.
  function gradeAndTrack(result: Parameters<typeof session.grade>[0]) {
    const questionId = session.currentQuestion?.id;
    if (!questionId || !session.currentStudent || session.graded) return;
    session.grade(result);
    if (result === 'plus' || result === 'plomba') setCompletedQuestionIds((current) => new Set(current).add(questionId));
  }

  useRecapKeys({ ...session, grade: gradeAndTrack }, embedded, handleExit, toggleFullscreen, overviewOpen);

  function selectQuestion(questionId: string) {
    session.jumpToQuestion(questionId);
    setOverviewOpen(false);
  }

  // Jeden przycisk "Przejdz do kola" - startuje od pierwszego pytania bez plusa.
  function startWheel() {
    const next = reviewQuestions.find((question) => !completedQuestionIds.has(question.id)) ?? reviewQuestions[0];
    if (next) session.jumpToQuestion(next.id);
    setOverviewOpen(false);
  }

  function completeWithoutGrade() {
    if (!session.currentQuestion || !session.currentStudent) return;
    session.markDoneNoGrade();
  }

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
        // Etykieta trybu tylko dla "prawdziwych" rund - demo/"Przedstaw się"
        // maja grading wylaczone i nie korzystaja z tego rozroznienia (A.4).
        recapMode={session.grading && !isIntroTopic ? session.recapMode : undefined}
        pickMode={session.pickMode}
        onChangePickMode={session.setPickMode}
        grading={session.grading}
        onChangeGrading={session.setGrading}
        allowRepeats={session.allowRepeats}
        onChangeAllowRepeats={session.setAllowRepeats}
        drawsCompleted={session.drawsCompleted}
        plannedTotal={session.recapMode === 'powtorzeniowe' ? reviewQuestions.length : session.plannedTotal}
        inProgress={!!session.currentStudent && !session.graded}
        reviewQuestionCount={reviewQuestions.length}
        canUndo={session.canUndo}
        onUndo={session.undoLast}
        onOpenQuestionPicker={() => setQuestionPickerOpen(true)}
        embedded={embedded}
        onToggleFullscreen={toggleFullscreen}
        onExit={handleExit}
      />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
          {overviewOpen ? (
            <RecapQuestionsOverview
              questions={reviewQuestions}
              completedQuestionIds={completedQuestionIds}
              onStart={startWheel}
              onUpdate={updateQuestion}
              onRemove={removeQuestion}
              onAdd={(text, answer) => {
                addQuestion({ setId, text, answer });
                setAddedCount((n) => n + 1);
              }}
              onFinish={handleExit}
              afterVideo={afterVideo}
            />
          ) : (
            <>
              <RecapWheelPanel session={session} />
              <RecapAnswerPanel
                session={session}
                onUpdateQuestion={updateQuestion}
                onGrade={gradeAndTrack}
                onSkip={completeWithoutGrade}
                onShowOverview={() => setOverviewOpen(true)}
                questions={reviewQuestions}
                completedQuestionIds={completedQuestionIds}
                onJumpToQuestion={session.jumpToQuestion}
                /* Lekcja zapoznawcza: na ekranie rzadzi "Przedstaw sie", a wylosowane
                   pytanie jest dodatkiem. */
                prompt={isIntroLesson ? INTRO_PROMPT : null}
                promptHint={isIntroLesson ? INTRO_PROMPT_HINT : null}
              />
            </>
          )}
        </div>

        <StudentSidebar
          open={sidebarOpen}
          onToggleOpen={() => setSidebarOpen((v) => !v)}
          students={session.classStudents}
          usedCount={session.usedCount}
          absentSet={session.absentSet}
          currentStudentId={session.currentStudent?.id ?? null}
          balanceFor={session.balanceFor}
          onTogglePresent={session.togglePresent}
          showBalance={session.grading}
        />
      </div>

      <div className="flex shrink-0 items-center gap-4 border-t border-gray-800 px-4 py-1 text-sm text-gray-500">
        {/* Legenda symboli - te same znaki widac na przyciskach i w liscie uczniow. */}
        <span className="shrink-0 space-x-3">
          <span>
            <span className="font-bold text-emerald-400">+</span> dobrze
          </span>
          <span>
            <span className="font-bold text-sky-400">•</span> kropka - bez plusa
          </span>
          <span>
            <span className="font-bold text-red-300">▣</span> plomba - brak odpowiedzi
          </span>
        </span>
        <span className="min-w-0 flex-1 truncate">
        {session.pickMode === 'sequential' ? 'Spacja: następny uczeń' : session.pickMode === 'sala' ? 'Spacja: losuj' : 'Spacja: kręć'}
        {session.grading
          ? session.recapMode === 'powtorzeniowe'
            ? ' - 1: dobrze - 2: kropka - 3: plomba'
            : ' - 1: dobrze - 2: dalej'
          : ' - Enter: gotowe, następny'}
        {' '}- N: następne pytanie - O: pokaż/ukryj odpowiedź
        {!embedded && ' - F: pełny ekran'} - Esc: zakończ
        </span>
      </div>

      <QuestionPicker
        open={questionPickerOpen}
        questions={reviewQuestions}
        currentQuestionId={session.currentQuestion?.id ?? null}
        askedQuestionIds={session.askedQuestionIds}
        answersFor={(questionId) => answersMap.get(questionId) ?? []}
        students={session.classStudents}
        onPick={selectQuestion}
        onClose={() => setQuestionPickerOpen(false)}
      />
    </div>
  );
}
