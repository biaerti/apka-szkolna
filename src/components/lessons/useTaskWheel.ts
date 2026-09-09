// Stan KOLA NA LEKCJI (patrz src/lib/recap.ts, sekcja "kolo na lekcji"): po
// kazdym zadaniu ze slajdu `task` nauczyciel kreci kolem, wylosowana osoba
// pokazuje rozwiazanie i dostaje plus (dobrze) albo kropke (slabo albo wcale).
// Hook zyje na poziomie CALEJ prezentacji (LessonPresent), a nie szuflady -
// zmiana slajdu nie moze gubic obecnosci, otwarcia szuflady ani osoby, ktora
// wlasnie odpowiada. Ten sam hook napedza plywajacy panel (src/pages/Panel.tsx).
//
// "Kto juz dzis odpowiadal" NIE jest stanem sesji, tylko wynika z zapisanych
// RecapEvent (answeredOnDay): przeladowanie strony nie wraca nikogo na kolo,
// cofniecie oceny samo zwalnia sektor, a pamiec jest WSPOLNA dla calego dnia i
// calej klasy - kolo powtorzeniowe z apki webowej, kolo na slajdzie zadania i
// kolo w plywajacym panelu widza te sama liste "juz byl". Zdarzenia z innego
// okna dociagamy z chmury (useTodayEventsPull).
//
// Przebieg losowania (spin -> handleSpinEnd -> applyPick) skopiowany z
// useRecapDraw: nazwisko ujawniamy dopiero, gdy kolo stanie.

import { useCallback, useMemo, useRef, useState } from 'react';
import { useStore } from '../../data/store';
import { useTodayEventsPull } from '../../data/remote/useTodayEventsPull';
import { todayKey } from '../../lib/grade';
import {
  answeredOnDay,
  buildRoundEntries,
  drawableEntries,
  lessonWheelNote,
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

  // Zdarzenia z dzisiaj zapisane w drugim oknie (apka webowa <-> plywajacy
  // panel) - bez tego panel nie wiedzialby, kogo wylosowalo kolo powtorzeniowe.
  useTodayEventsPull();

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
  // Ostatnia ocena zapamietana RAZEM z uczniem, nie samo id zdarzenia: po
  // kolejnym krecie `currentEntry` wskazuje juz kogos innego, a Cofnij ma
  // oddac sektor temu, kto te ocene dostal.
  const [lastGrade, setLastGrade] = useState<{ eventId: string; studentId: string } | null>(null);

  // "Reset skreslen": od tej chwili liczymy, kto juz byl. Wczesniejsze
  // odpowiedzi zostaja w bilansie miesiaca, tylko przestaja skreslac ludzi z
  // kola (patrz answeredOnDay: sinceIso).
  const [resetAt, setResetAt] = useState<string | null>(null);

  const answered = useMemo(
    () => answeredOnDay(recapEvents, classId, todayKey(), resetAt ?? undefined),
    [recapEvents, classId, resetAt],
  );
  const usedFor = useCallback((studentId: string) => answered.get(studentId) ?? 0, [answered]);

  const entries = useMemo(
    () => buildRoundEntries({ students: presentStudents, usedFor, allowRepeats }),
    [presentStudents, usedFor, allowRepeats],
  );
  const pool = useMemo(() => drawableEntries(entries), [entries]);

  const currentStudent = currentEntry?.student ?? null;
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
    const event = addRecapEvent({ studentId, classId, result, note: lessonWheelNote(lessonCode, taskCode) });
    setLastGrade({ eventId: event.id, studentId });
    setGraded(true);
  }

  /** Cofa ostatnia ocene - pula odswieza sie sama, bo liczy sie ze zdarzen. */
  function undoLast() {
    if (!lastGrade) return;
    removeRecapEvent(lastGrade.eventId);
    setLastGrade(null);
    setCurrentEntry(null);
    setGraded(false);
  }

  /**
   * Reset rundy: wszyscy wracaja na kolo. Kasuje TYLKO skreslenia - obecnosc i
   * zapisane plusy/kropki zostaja (te ostatnie sa juz w bilansie miesiaca).
   */
  function resetPool() {
    setResetAt(new Date().toISOString());
    setAllowRepeats(false);
    setCurrentEntry(null);
    setGraded(false);
    setLastGrade(null);
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
    graded,
    spinning,
    wheelTarget,
    spinToken,
    canSpin,
    spin,
    handleSpinEnd,
    grade,
    undoLast,
    resetPool,
    /** Czy jest co resetowac - do wyszarzenia przycisku. */
    canReset: entries.some((e) => e.done) || allowRepeats,
    canUndo: !!lastGrade,
    clearGradedStudent,
  };
}

export type TaskWheelState = ReturnType<typeof useTaskWheel>;
