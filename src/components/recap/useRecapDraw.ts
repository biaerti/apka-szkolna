// Silnik losowania i ocen: ktory wpis jest aktualnie "na tapecie", jego ocena
// (plus/kropka/plomba/pas), podpowiedzi, uwagi i cofanie ostatniej akcji.
// Wydzielone z useRecapSession.ts, zeby glowny hook nie przekraczal limitu
// dlugosci pliku - ten hook dostaje pule (PoolEntry[]) i funkcje pomocnicze
// od useAttendance/usePool, a sam zajmuje sie tylko przebiegiem pojedynczego
// losowania.
//
// Uwagi (eskalacja) licza sie z historii RecapEvent w biezacym miesiacu
// (warningsFor przekazane z gory), wiec cofniecie uwagi w undoLast wystarczy
// zalatwic usunieciem zdarzenia - poziom eskalacji obniza sie automatycznie.
//
// Tryb "po kolei" ma isc sam: efekt nizej pilnuje, zeby zawsze byl wybrany
// ktos, gdy nikt aktualnie nie odpowiada (pierwsze wejscie w tryb, start nowej
// rundy, zaraz po ocenie) - bez czekania na klik "nastepny uczen".

import { useCallback, useEffect, useState } from 'react';
import { useStore } from '../../data/store';
import type { RecapEvent, RecapResult, Settings, Student } from '../../data/types';
import {
  canEarnPlus,
  canPass,
  nextSequential,
  passesUsedThisMonth,
  wheelTargetAngle,
  type PoolEntry,
} from '../../lib/recap';

export type PickMode = 'wheel' | 'sequential';

type LastActionKind = 'grade' | 'hint' | 'uwaga';

interface LastAction {
  eventId: string;
  studentId: string;
  kind: LastActionKind;
}

export interface UseRecapDrawArgs {
  classId: string;
  setId: string;
  pool: PoolEntry[];
  warningsFor: (studentId: string) => number;
  bumpUsedCount: (studentId: string) => void;
  undoUsedCount: (studentId: string) => void;
  resetRound: () => void;
  currentQuestionId: string | undefined;
  randomOrder: boolean;
  advanceRandomQuestion: () => void;
  recapEvents: RecapEvent[];
  settings: Settings;
  initialPickMode: PickMode;
  initialGrading: boolean;
}

export function useRecapDraw({
  classId,
  setId,
  pool,
  warningsFor,
  bumpUsedCount,
  undoUsedCount,
  resetRound,
  currentQuestionId,
  randomOrder,
  advanceRandomQuestion,
  recapEvents,
  settings,
  initialPickMode,
  initialGrading,
}: UseRecapDrawArgs) {
  const addRecapEvent = useStore((s) => s.addRecapEvent);
  const removeRecapEvent = useStore((s) => s.removeRecapEvent);

  const [currentEntry, setCurrentEntry] = useState<PoolEntry | null>(null);
  const [graded, setGraded] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [wheelTarget, setWheelTarget] = useState(0);
  const [spinToken, setSpinToken] = useState(0);
  const [lastAction, setLastAction] = useState<LastAction | null>(null);
  const [pickMode, setPickMode] = useState<PickMode>(initialPickMode);
  const [grading, setGrading] = useState(initialGrading);

  // Migawka puli z ostatniego losowania. Kolo/lista maja pokazywac wylosowana
  // osobe wyraznie az do KOLEJNEGO losowania - ale po ocenie uczen znika z
  // zywej puli `pool` (juz odpowiadal), wiec bez tej migawki sektor na kole
  // gaslby natychmiast po kliknieciu oceny. Aktualizuje sie tylko, gdy nikt
  // aktualnie nie jest wylosowany, czyli dokladnie w momencie nowego losowania.
  const [displayPool, setDisplayPool] = useState<PoolEntry[]>(pool);
  useEffect(() => {
    if (!currentEntry) setDisplayPool(pool);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool, currentEntry]);

  const now = new Date();
  const currentStudent: Student | null = currentEntry?.student ?? null;
  const currentPassesUsed = currentStudent ? passesUsedThisMonth(recapEvents, currentStudent.id, now) : 0;
  const currentCanPass = currentStudent ? canPass(recapEvents, currentStudent.id, settings, now) : false;
  const currentCanEarnPlus = currentStudent ? canEarnPlus(warningsFor(currentStudent.id)) : false;

  const canSpin = !spinning && (!currentEntry || graded) && pool.length > 0;

  function recordEvent(studentId: string, result: RecapResult) {
    return addRecapEvent({ studentId, classId, questionSetId: setId, questionId: currentQuestionId, result });
  }

  function applyPick(entry: PoolEntry) {
    setGraded(false);
    setCurrentEntry(entry);
    if (randomOrder) advanceRandomQuestion();
  }

  function spin() {
    if (!canSpin) return;
    const idx = Math.min(pool.length - 1, Math.floor(Math.random() * pool.length));
    const entry = pool[idx];
    const angle = wheelTargetAngle(idx, pool.length, 5, Math.random);
    setSpinning(true);
    setWheelTarget(angle);
    setSpinToken((t) => t + 1);
    applyPick(entry);
  }

  const handleSpinEnd = useCallback(() => {
    setSpinning(false);
  }, []);

  /** Wybiera kolejny wpis wg numeru z dziennika (tryb "po kolei") - bez animacji. */
  function pickSequentialStudent() {
    if (!canSpin) return;
    const entry = nextSequential(pool);
    if (!entry) return;
    applyPick(entry);
  }

  /** Wybiera kolejny wpis zgodnie z aktualnym trybem (kolo / po kolei). */
  function pickNext() {
    if (pickMode === 'sequential') pickSequentialStudent();
    else spin();
  }

  // Tryb "po kolei" ma po prostu isc po kolei: gdy nikt aktualnie nie
  // odpowiada (start, przelaczenie na ten tryb, zaraz po ocenie, po cofnieciu,
  // po nowej rundzie), a w puli ktos jeszcze jest - wybierz go automatycznie.
  useEffect(() => {
    if (pickMode !== 'sequential' || spinning) return;
    if (currentEntry && !graded) return;
    if (pool.length === 0) return;
    const next = nextSequential(pool);
    if (!next) return;
    applyPick(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickMode, pool, currentEntry, graded, spinning]);

  function grade(result: Extract<RecapResult, 'plus' | 'kropka' | 'plomba' | 'pass'>) {
    if (!currentEntry || graded) return;
    if (result === 'plus' && !canEarnPlus(warningsFor(currentEntry.student.id))) return;
    const studentId = currentEntry.student.id;
    const event = recordEvent(studentId, result);
    setLastAction({ eventId: event.id, studentId, kind: 'grade' });
    bumpUsedCount(studentId);
    setGraded(true);
  }

  /** Uczen inny niz aktualnie losowany podpowiadal - plomba dla niego. */
  function addHint(otherStudentId: string) {
    const event = recordEvent(otherStudentId, 'hint_plomba');
    setLastAction({ eventId: event.id, studentId: otherStudentId, kind: 'hint' });
  }

  /** Uwaga dla wskazanego ucznia: zapis do statystyk - eskalacja liczy sie z historii. */
  function addUwaga(studentId: string) {
    const event = recordEvent(studentId, 'uwaga');
    setLastAction({ eventId: event.id, studentId, kind: 'uwaga' });
  }

  /**
   * Tryb bez ocen ("Oceniaj: nie"): przenosi wpis do puli "juz byl" BEZ zapisu
   * RecapEvent i od razu odblokowuje wybor nastepnego ucznia.
   */
  function markDoneNoGrade() {
    if (!currentEntry) return;
    bumpUsedCount(currentEntry.student.id);
    setCurrentEntry(null);
    setGraded(false);
  }

  function undoLast() {
    if (!lastAction) return;
    removeRecapEvent(lastAction.eventId);
    if (lastAction.kind === 'grade') {
      undoUsedCount(lastAction.studentId);
      setCurrentEntry(null);
      setGraded(false);
    }
    // 'uwaga' i 'hint' nie potrzebuja nic wiecej - usuniecie zdarzenia
    // wystarczy (poziom eskalacji uwag wynika wprost z historii zdarzen).
    setLastAction(null);
  }

  function startNewRound() {
    // Uwagi (eskalacja) zostaja - licza sie z historii zdarzen w biezacym
    // miesiacu, nie z rundy.
    resetRound();
    setCurrentEntry(null);
    setGraded(false);
  }

  return {
    currentEntry,
    currentStudent,
    displayPool,
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
    addUwaga,
    undoLast,
    canUndo: !!lastAction,
    startNewRound,
    currentPassesUsed,
    currentCanPass,
    currentCanEarnPlus,
  };
}
