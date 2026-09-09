// Stan i logika ekranu powtorki: pula uczniow, losowanie, pytania i oceny.
// Czyste obliczenia (limity pasow, losowanie, pula, kat kola) sa w
// src/lib/recap.ts. Sam hook jest tylko kompozycja mniejszych
// hookow (useAttendance/usePool/useQuestionOrder/useRecapDraw), zeby
// zmiescic sie w limicie dlugosci pliku. Bez ekranu gotowosci - pula liczy
// sie wprost z obecnych uczniow (usuniety po testach na zywo).

import { useMemo } from 'react';
import { useStore } from '../../data/store';
import { useTodayEventsPull } from '../../data/remote/useTodayEventsPull';
import { monthBalance, type RecapMode } from '../../lib/recap';
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
  /** Czy sesja ocenia odpowiedzi. Domyslnie true. */
  initialGrading?: boolean;
  /** Czy pytania sa losowane (zmieniaja sie automatycznie przy kazdym uczniu). */
  initialRandomOrder?: boolean;
  /**
   * Tryb rundy - decyduje o zasadach oceniania (patrz src/lib/recap.ts).
   * Domyslnie 'po-lekcji' - stary tryb, zostaje jako fallback dla starych danych.
   */
  recapMode?: RecapMode;
  /**
   * Czy wylosowanie ucznia zmienia od razu pytanie (przy losowych pytaniach).
   * Domyslnie true; lekcja zapoznawcza daje false - patrz useRecapDraw.
   */
  advanceQuestionOnPick?: boolean;
}

export function useRecapSession({
  classId,
  setId,
  absentIds = [],
  initialPickMode = 'wheel',
  initialGrading = true,
  initialRandomOrder = false,
  recapMode = 'po-lekcji',
  advanceQuestionOnPick = true,
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

  // Zdarzenia zapisane w drugim oknie (plywajacy panel) - zeby kolo nie
  // losowalo kogos, kto przed chwila odpowiadal przy podreczniku.
  useTodayEventsPull();

  const attendance = useAttendance(classStudents, classId, absentIds);

  // Pamiec "kto juz dzis odpowiadal" jest wspolna dla calej klasy i calego dnia
  // (patrz usePool) - kolo powtorzeniowe, kolo na lekcji i plywajacy panel nie
  // losuja tej samej osoby drugi raz, dopoki reszta klasy nie byla.
  const poolState = usePool(attendance.presentStudents, classId);

  const setQuestions = useMemo(
    () => questions.filter((q) => q.setId === setId).sort((a, b) => a.order - b.order),
    [questions, setId],
  );
  const questionOrder = useQuestionOrder(setQuestions, initialRandomOrder);

  const draw = useRecapDraw({
    classId,
    setId,
    entries: poolState.entries,
    pool: poolState.pool,
    bumpUsedCount: poolState.bumpUsedCount,
    undoUsedCount: poolState.undoUsedCount,
    resetRound: poolState.resetRound,
    currentQuestionId: questionOrder.currentQuestion?.id,
    randomOrder: questionOrder.randomOrder,
    advanceRandomQuestion: questionOrder.advanceRandomQuestion,
    advanceQuestionOnPick,
    recapEvents,
    settings,
    initialPickMode,
    initialGrading,
    recapMode,
  });

  const currentMonthKey = monthKey(new Date());
  function balanceFor(studentId: string) {
    return monthBalance(recapEvents, studentId, currentMonthKey);
  }

  // Zmiana pytania zdejmuje z ekranu ucznia, ktory ma juz ocene - inaczej nowe
  // pytanie wisi pod nazwiskiem poprzedniej osoby i klasa mysli, ze to wciaz
  // ona odpowiada. Uczen bez oceny zostaje (nauczyciel tylko zmienil mu pytanie).
  function nextQuestion() {
    draw.clearGradedStudent();
    questionOrder.nextQuestion();
  }
  function prevQuestion() {
    draw.clearGradedStudent();
    questionOrder.prevQuestion();
  }
  function jumpToQuestion(questionId: string) {
    draw.clearGradedStudent();
    questionOrder.jumpToQuestion(questionId);
  }

  return {
    classStudents,
    absentSet: attendance.absentSet,
    togglePresent: attendance.togglePresent,
    presentStudents: attendance.presentStudents,
    // Sektory kola: wszyscy z rundy, razem z tymi, ktorzy juz odpowiadali.
    entries: poolState.entries,
    // Kandydaci do losowania: `entries` bez tych, ktorzy juz byli.
    pool: poolState.pool,
    plannedTotal: poolState.plannedTotal,
    drawsCompleted: poolState.drawsCompleted,
    usedCount: poolState.usedCount,
    allowRepeats: poolState.allowRepeats,
    setAllowRepeats: poolState.setAllowRepeats,
    settings,
    // Lista pytan zestawu w stalej kolejnosci (nieprzetasowana) - do panelu
    // "wybierz pytanie", zeby klikanie nie skakalo po ekranie przy losowej
    // kolejnosci wyswietlania.
    allQuestions: setQuestions,
    ...questionOrder,
    ...draw,
    nextQuestion,
    prevQuestion,
    jumpToQuestion,
    balanceFor,
    recapEvents,
  };
}

export type RecapSessionState = ReturnType<typeof useRecapSession>;
