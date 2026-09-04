// Stan i logika ekranu powtorki: pula uczniow (z duplikatami za uwagi),
// losowanie, pytania, oceny, eskalacja uwag liczona z historii biezacego
// miesiaca. Czyste obliczenia (limity pasow, losowanie, eskalacja, pula, kat
// kola) sa w src/lib/recap.ts. Sam hook jest tylko kompozycja mniejszych
// hookow (useAttendance/usePool/useQuestionOrder/useRecapDraw), zeby
// zmiescic sie w limicie dlugosci pliku. Bez ekranu gotowosci - pula liczy
// sie wprost z obecnych uczniow (usuniety po testach na zywo).

import { useCallback, useMemo } from 'react';
import { useStore } from '../../data/store';
import { monthBalance, warningsThisMonth } from '../../lib/recap';
import { monthKey } from '../../lib/week';
import { useAttendance } from './useAttendance';
import { usePool } from './usePool';
import { useQuestionOrder } from './useQuestionOrder';
import { useRecapDraw, type PickMode } from './useRecapDraw';

export type { PickMode };

export interface UseRecapSessionArgs {
  classId: string;
  setId: string;
  absentIds?: string[];
  /** Sposob wyboru ucznia: kolo fortuny albo po kolei wg numeru z dziennika. */
  initialPickMode?: PickMode;
  /** Czy sesja ocenia odpowiedzi (plus/kropka/plomba/pas). Domyslnie true. */
  initialGrading?: boolean;
  /** Czy pytania sa losowane (zmieniaja sie automatycznie przy kazdym uczniu). */
  initialRandomOrder?: boolean;
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

  const classStudents = useMemo(
    () =>
      students
        .filter((st) => st.classId === classId && st.active)
        .sort((a, b) => a.number - b.number),
    [students, classId],
  );

  const attendance = useAttendance(classStudents, classId, absentIds);

  // Uwagi rozliczamy pelnymi miesiacami z zapisanych zdarzen (nie ze stanu
  // sesji) - przeladowanie strony w srodku lekcji nie kasuje eskalacji, a
  // cofniecie ostatniej uwagi (usuniecie RecapEvent w undoLast) automatycznie
  // obniza poziom, bo liczba znow wynika wprost z historii.
  const warningsFor = useCallback(
    (studentId: string) => warningsThisMonth(recapEvents, studentId, new Date()),
    [recapEvents],
  );

  const poolState = usePool(attendance.presentStudents, warningsFor);

  const setQuestions = useMemo(
    () => questions.filter((q) => q.setId === setId).sort((a, b) => a.order - b.order),
    [questions, setId],
  );
  const questionOrder = useQuestionOrder(setQuestions, initialRandomOrder);

  const draw = useRecapDraw({
    classId,
    setId,
    pool: poolState.pool,
    warningsFor,
    bumpUsedCount: poolState.bumpUsedCount,
    undoUsedCount: poolState.undoUsedCount,
    resetRound: poolState.resetRound,
    currentQuestionId: questionOrder.currentQuestion?.id,
    randomOrder: questionOrder.randomOrder,
    advanceRandomQuestion: questionOrder.advanceRandomQuestion,
    recapEvents,
    settings,
    initialPickMode,
    initialGrading,
  });

  const currentMonthKey = monthKey(new Date());
  function balanceFor(studentId: string) {
    return monthBalance(recapEvents, studentId, currentMonthKey);
  }

  return {
    classStudents,
    absentSet: attendance.absentSet,
    togglePresent: attendance.togglePresent,
    presentStudents: attendance.presentStudents,
    pool: poolState.pool,
    plannedTotal: poolState.plannedTotal,
    drawsCompleted: poolState.drawsCompleted,
    usedCount: poolState.usedCount,
    warningsFor,
    allowRepeats: poolState.allowRepeats,
    setAllowRepeats: poolState.setAllowRepeats,
    settings,
    // Lista pytan zestawu w stalej kolejnosci (nieprzetasowana) - do panelu
    // "wybierz pytanie", zeby klikanie nie skakalo po ekranie przy losowej
    // kolejnosci wyswietlania.
    allQuestions: setQuestions,
    ...questionOrder,
    ...draw,
    balanceFor,
    recapEvents,
  };
}

export type RecapSessionState = ReturnType<typeof useRecapSession>;
