// Stan KOLA NA LEKCJI (patrz src/lib/recap.ts, sekcja "kolo na lekcji"): po
// kazdym zadaniu ze slajdu `task` nauczyciel kreci kolem, wylosowana osoba
// pokazuje rozwiazanie i dostaje plus (dobrze) albo kropke (slabo albo wcale).
// Hook zyje na poziomie CALEJ prezentacji (LessonPresent), a nie szuflady -
// zmiana slajdu nie moze gubic obecnosci, otwarcia szuflady ani osoby, ktora
// wlasnie odpowiada.
//
// "Kto juz dzis odpowiadal" NIE jest stanem sesji, tylko wynika z zapisanych
// RecapEvent (answeredOnDay): przeladowanie strony nie wraca nikogo na kolo, a
// cofniecie oceny (usuniecie zdarzenia) samo zwalnia sektor. Wlicza sie tez
// kolo powtorzeniowe z poczatku tej samej lekcji.
//
// Przebieg losowania (spin -> handleSpinEnd -> applyPick) skopiowany z
// useRecapDraw: nazwisko ujawniamy dopiero, gdy kolo stanie.

import { useCallback, useMemo, useRef, useState } from 'react';
import { useStore } from '../../data/store';
import { todayKey } from '../../lib/grade';
import {
  answeredOnDay,
  buildRoundEntries,
  canEarnPlus,
  drawableEntries,
  lessonWheelNote,
  warningsThisMonth,
  wheelTargetAngle,
  type LessonWheelResult,
  type PoolEntry,
} from '../../lib/recap';
import { useAttendance } from '../recap/useAttendance';

export interface UseTaskWheelArgs {
  classId: string;
  lessonCode?: string;
}

export function useTaskWheel({ classId, lessonCode }: UseTaskWheelArgs) {
  const students = useStore((s) => s.students);
  const recapEvents = useStore((s) => s.recapEvents);
  const settings = useStore((s) => s.settings);
  const addRecapEvent = useStore((s) => s.addRecapEvent);
  const removeRecapEvent = useStore((s) => s.removeRecapEvent);

  const classStudents = useMemo(
    () => students.filter((st) => st.classId === classId && st.active).sort((a, b) => a.number - b.number),
    [students, classId],
  );
  const { absentSet, togglePresent, presentStudents } = useAttendance(classStudents, classId, []);

  const [open, setOpen] = useState(false);
  const [allowRepeats, setAllowRepeats] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<PoolEntry | null>(null);
  const [graded, setGraded] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [wheelTarget, setWheelTarget] = useState(0);
  const [spinToken, setSpinToken] = useState(0);
  const [lastEventId, setLastEventId] = useState<string | null>(null);

  const answered = useMemo(() => answeredOnDay(recapEvents, classId, todayKey()), [recapEvents, classId]);
  const usedFor = useCallback((studentId: string) => answered.get(studentId) ?? 0, [answered]);
  const warningsFor = useCallback(
    (studentId: string) => warningsThisMonth(recapEvents, studentId, new Date()),
    [recapEvents],
  );

  const entries = useMemo(
    () => buildRoundEntries({ students: presentStudents, warningsFor, usedFor, allowRepeats }),
    [presentStudents, warningsFor, usedFor, allowRepeats],
  );
  const pool = useMemo(() => drawableEntries(entries), [entries]);

  const currentStudent = currentEntry?.student ?? null;
  const currentCanEarnPlus = currentStudent ? canEarnPlus(warningsFor(currentStudent.id)) : false;
  const canSpin = !spinning && (!currentEntry || graded) && pool.length > 0;

  // Wpis wylosowany, ale jeszcze nie ujawniony - kolo dopiero sie kreci.
  const pendingEntryRef = useRef<PoolEntry | null>(null);

  function applyPick(entry: PoolEntry) {
    setGraded(false);
    setCurrentEntry(entry);
  }
  // handleSpinEnd trafia do <Wheel> raz, na starcie animacji - nie moze
  // zamykac starej kopii applyPick.
  const applyPickRef = useRef(applyPick);
  applyPickRef.current = applyPick;

  function spin() {
    if (!canSpin) return;
    // Losujemy z `pool`, ale kat liczymy wzgledem PELNEJ listy sektorow
    // (`entries`) - ci, ktorzy juz byli, zostaja na kole na czerwono.
    const poolIdx = Math.min(pool.length - 1, Math.floor(Math.random() * pool.length));
    const entry = pool[poolIdx];
    const sectorIdx = entries.findIndex((en) => en.key === entry.key);
    const angle = wheelTargetAngle(Math.max(0, sectorIdx), entries.length, 5, Math.random);
    pendingEntryRef.current = entry;
    setSpinning(true);
    setWheelTarget(angle);
    setSpinToken((t) => t + 1);
  }

  const handleSpinEnd = useCallback(() => {
    setSpinning(false);
    const entry = pendingEntryRef.current;
    pendingEntryRef.current = null;
    if (entry) applyPickRef.current(entry);
  }, []);

  /** Plus albo kropka za zadanie `taskCode` - bez questionSetId/questionId, z adnotacja "4.3 Z2". */
  function grade(result: LessonWheelResult, taskCode: string) {
    if (!currentEntry || graded) return;
    const studentId = currentEntry.student.id;
    if (result === 'plus' && !canEarnPlus(warningsFor(studentId))) return;
    const event = addRecapEvent({ studentId, classId, result, note: lessonWheelNote(lessonCode, taskCode) });
    setLastEventId(event.id);
    setGraded(true);
  }

  /** Cofa ostatnia ocene - pula odswiezy sie sama, bo liczy sie ze zdarzen. */
  function undoLast() {
    if (!lastEventId) return;
    removeRecapEvent(lastEventId);
    setLastEventId(null);
    setCurrentEntry(null);
    setGraded(false);
  }

  /** Przy zmianie slajdu: uczen z ocena znika z ramki, uczen bez oceny zostaje. */
  function clearGradedStudent() {
    if (!currentEntry || !graded) return;
    setCurrentEntry(null);
    setGraded(false);
  }

  return {
    open,
    setOpen,
    settings,
    absentSet,
    togglePresent,
    classStudents,
    usedFor,
    allowRepeats,
    setAllowRepeats,
    entries,
    pool,
    currentEntry,
    currentStudent,
    currentCanEarnPlus,
    graded,
    spinning,
    wheelTarget,
    spinToken,
    canSpin,
    spin,
    handleSpinEnd,
    grade,
    undoLast,
    canUndo: !!lastEventId,
    clearGradedStudent,
  };
}

export type TaskWheelState = ReturnType<typeof useTaskWheel>;
