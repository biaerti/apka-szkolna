// Stan i logika ekranu powtorki: pula uczniow, losowanie, pytania, oceny.
// Czyste obliczenia (limity pasow, losowanie, kat kola) sa w src/lib/recap.ts -
// ten hook spina je ze store'em zustand i stanem lokalnym komponentu.

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useStore } from '../../data/store';
import type { Question, RecapResult, Student } from '../../data/types';
import {
  canPass,
  monthBalance,
  nextRandomIndex,
  nextSequential,
  passesUsedThisWeek,
  shuffle,
  wheelTargetAngle,
} from '../../lib/recap';
import { monthKey } from '../../lib/week';

export type PickMode = 'wheel' | 'sequential';

export interface UseRecapSessionArgs {
  classId: string;
  setId: string;
  absentIds?: string[];
  /** Sposob wyboru ucznia: kolo fortuny albo po kolei wg numeru z dziennika. */
  initialPickMode?: PickMode;
  /** Czy sesja ocenia odpowiedzi (plus/minus/pas). Domyslnie true. */
  initialGrading?: boolean;
  /** Czy pytania sa losowane (zmieniaja sie automatycznie przy kazdym uczniu). */
  initialRandomOrder?: boolean;
}

interface LastAction {
  eventId: string;
  studentId: string;
  wasUsed: boolean;
}

export function useRecapSession({
  classId,
  setId,
  absentIds = [],
  initialPickMode = 'wheel',
  initialGrading = true,
  initialRandomOrder = false,
}: UseRecapSessionArgs) {
  const students = useStore((s) => s.students);
  const questions = useStore((s) => s.questions);
  const recapEvents = useStore((s) => s.recapEvents);
  const settings = useStore((s) => s.settings);
  const addRecapEvent = useStore((s) => s.addRecapEvent);
  const removeRecapEvent = useStore((s) => s.removeRecapEvent);

  const classStudents = useMemo(
    () =>
      students
        .filter((st) => st.classId === classId && st.active)
        .sort((a, b) => a.number - b.number),
    [students, classId],
  );

  const [absentSet, setAbsentSet] = useState<Set<string>>(() => new Set(absentIds));
  useEffect(() => {
    setAbsentSet(new Set(absentIds));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId]);

  function togglePresent(studentId: string) {
    setAbsentSet((cur) => {
      const next = new Set(cur);
      if (next.has(studentId)) next.delete(studentId);
      else next.add(studentId);
      return next;
    });
  }

  const presentStudents = useMemo(
    () => classStudents.filter((st) => !absentSet.has(st.id)),
    [classStudents, absentSet],
  );

  const [usedIds, setUsedIds] = useState<Set<string>>(new Set());
  const [allowRepeats, setAllowRepeats] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);
  const [graded, setGraded] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [wheelTarget, setWheelTarget] = useState(0);
  const [spinToken, setSpinToken] = useState(0);
  const [lastAction, setLastAction] = useState<LastAction | null>(null);
  const [pickMode, setPickMode] = useState<PickMode>(initialPickMode);
  const [grading, setGrading] = useState(initialGrading);

  const pool = useMemo(
    () => presentStudents.filter((st) => allowRepeats || !usedIds.has(st.id)),
    [presentStudents, allowRepeats, usedIds],
  );

  const setQuestions = useMemo(
    () => questions.filter((q) => q.setId === setId).sort((a, b) => a.order - b.order),
    [questions, setId],
  );

  const [randomOrder, setRandomOrder] = useState(initialRandomOrder);
  const [shuffledIds, setShuffledIds] = useState<string[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    if (randomOrder) {
      const ids = setQuestions.map((q) => q.id);
      for (let i = ids.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ids[i], ids[j]] = [ids[j], ids[i]];
      }
      setShuffledIds(ids);
    }
    setQuestionIndex(0);
    setShowAnswer(false);
  }, [randomOrder, setQuestions]);

  const orderedQuestions: Question[] = useMemo(() => {
    if (!randomOrder) return setQuestions;
    const byId = new Map(setQuestions.map((q) => [q.id, q]));
    return shuffledIds.map((id) => byId.get(id)).filter((q): q is Question => !!q);
  }, [randomOrder, setQuestions, shuffledIds]);

  const currentQuestion = orderedQuestions[questionIndex] ?? null;

  function nextQuestion() {
    setShowAnswer(false);
    setQuestionIndex((i) => Math.min(orderedQuestions.length - 1, i + 1));
  }
  function prevQuestion() {
    setShowAnswer(false);
    setQuestionIndex((i) => Math.max(0, i - 1));
  }

  /**
   * Przechodzi do kolejnego pytania z potasowanej listy (tryb losowy). Wywolywana
   * automatycznie przy kazdym nowym uczniu - gdy lista zostanie wyczerpana, tasuje
   * ja ponownie od nowa (zeby pytania sie nie powtarzaly az do konca zestawu).
   */
  function advanceRandomQuestion() {
    setShowAnswer(false);
    const { index, reshuffle } = nextRandomIndex(questionIndex, shuffledIds.length);
    if (reshuffle) {
      setShuffledIds(shuffle(setQuestions.map((q) => q.id)));
    }
    setQuestionIndex(index);
  }

  const now = new Date();
  const currentMonthKey = monthKey(now);

  function balanceFor(studentId: string) {
    return monthBalance(recapEvents, studentId, currentMonthKey);
  }

  const currentStudent: Student | null = classStudents.find((st) => st.id === currentStudentId) ?? null;
  const currentPassesUsed = currentStudentId ? passesUsedThisWeek(recapEvents, currentStudentId, now) : 0;
  const currentCanPass = currentStudentId ? canPass(recapEvents, currentStudentId, settings, now) : false;

  const canSpin = !spinning && (!currentStudentId || graded) && pool.length > 0;

  function spin() {
    if (!canSpin) return;
    const idx = Math.min(pool.length - 1, Math.floor(Math.random() * pool.length));
    const student = pool[idx];
    const angle = wheelTargetAngle(idx, pool.length, 5, Math.random);
    setSpinning(true);
    setGraded(false);
    setCurrentStudentId(student.id);
    setWheelTarget(angle);
    setSpinToken((t) => t + 1);
    if (randomOrder) advanceRandomQuestion();
  }

  const handleSpinEnd = useCallback(() => {
    setSpinning(false);
  }, []);

  /** Wybiera kolejnego ucznia wg numeru z dziennika (tryb "po kolei") - bez animacji. */
  function pickSequentialStudent() {
    if (!canSpin) return;
    const student = nextSequential(pool);
    if (!student) return;
    setGraded(false);
    setCurrentStudentId(student.id);
    if (randomOrder) advanceRandomQuestion();
  }

  /** Wybiera kolejnego ucznia zgodnie z aktualnym trybem (kolo / po kolei). */
  function pickNext() {
    if (pickMode === 'sequential') pickSequentialStudent();
    else spin();
  }

  function grade(result: RecapResult) {
    if (!currentStudentId || graded) return;
    const event = addRecapEvent({
      studentId: currentStudentId,
      classId,
      questionSetId: setId,
      questionId: currentQuestion?.id,
      result,
    });
    setLastAction({ eventId: event.id, studentId: currentStudentId, wasUsed: usedIds.has(currentStudentId) });
    setUsedIds((cur) => new Set(cur).add(currentStudentId));
    setGraded(true);
  }

  function addHint(otherStudentId: string) {
    const event = addRecapEvent({
      studentId: otherStudentId,
      classId,
      questionSetId: setId,
      questionId: currentQuestion?.id,
      result: 'hint_minus',
    });
    setLastAction({ eventId: event.id, studentId: otherStudentId, wasUsed: usedIds.has(otherStudentId) });
  }

  /**
   * Tryb bez ocen ("Oceniaj: nie"): przenosi ucznia do puli "juz byl" BEZ zapisu
   * RecapEvent i od razu odblokowuje wybor nastepnego ucznia.
   */
  function markDoneNoGrade() {
    if (!currentStudentId) return;
    setUsedIds((cur) => new Set(cur).add(currentStudentId));
    setCurrentStudentId(null);
    setGraded(false);
  }

  function readyForNext() {
    setCurrentStudentId(null);
    setGraded(false);
  }

  function undoLast() {
    if (!lastAction) return;
    removeRecapEvent(lastAction.eventId);
    if (!lastAction.wasUsed) {
      setUsedIds((cur) => {
        const next = new Set(cur);
        next.delete(lastAction.studentId);
        return next;
      });
    }
    setLastAction(null);
    setCurrentStudentId(null);
    setGraded(false);
  }

  function startNewRound() {
    setUsedIds(new Set());
    setCurrentStudentId(null);
    setGraded(false);
  }

  return {
    classStudents,
    absentSet,
    togglePresent,
    presentStudents,
    pool,
    usedIds,
    allowRepeats,
    setAllowRepeats,
    currentStudent,
    graded,
    spinning,
    wheelTarget,
    spinToken,
    canSpin,
    spin,
    pickMode,
    setPickMode,
    pickSequentialStudent,
    pickNext,
    grading,
    setGrading,
    markDoneNoGrade,
    handleSpinEnd,
    grade,
    addHint,
    readyForNext,
    undoLast,
    canUndo: !!lastAction,
    startNewRound,
    settings,
    currentPassesUsed,
    currentCanPass,
    orderedQuestions,
    currentQuestion,
    questionIndex,
    nextQuestion,
    prevQuestion,
    randomOrder,
    setRandomOrder,
    showAnswer,
    setShowAnswer,
    balanceFor,
    recapEvents,
  };
}

export type RecapSessionState = ReturnType<typeof useRecapSession>;
