// Stan KOLA NA LEKCJI (patrz src/lib/recap.ts, sekcja "kolo na lekcji"): po
// kazdym zadaniu ze slajdu `task` nauczyciel kreci kolem, wylosowana osoba
// pokazuje rozwiazanie i dostaje plus (dobrze) albo kropke (slabo albo wcale).
// Hook zyje na poziomie CALEJ prezentacji (LessonPresent), a nie szuflady -
// zmiana slajdu nie moze gubic obecnosci, otwarcia szuflady ani osoby, ktora
// wlasnie odpowiada.
//
// "Kto juz dzis odpowiadal" w prezentacji NIE jest stanem sesji, tylko wynika z
// zapisanych RecapEvent (answeredOnDay): przeladowanie strony nie wraca nikogo
// na kolo, a cofniecie oceny (usuniecie zdarzenia) samo zwalnia sektor. Wlicza
// sie tez kolo powtorzeniowe z poczatku tej samej lekcji. Plywajacy panel ma to
// inaczej - patrz `poolMemory` nizej.
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
  /**
   * Skad bierze sie "kto juz byl" (sektory na czerwono, wypadniete z losowania):
   * - `events` (domyslne, prezentacja) - z zapisanych zdarzen z dzisiaj, wiec
   *   pula jest wspolna z kolem powtorzeniowym i przezywa przeladowanie strony;
   * - `local` (plywajacy panel) - licznik zyje tylko w pamieci panelu i kasuje
   *   go przycisk Reset. Panel chodzi obok apki, czesto przez cala lekcje przy
   *   podreczniku, a nauczyciel sam decyduje, kiedy runda sie konczy - wiazanie
   *   go ze zdarzeniami dnia znaczyloby, ze pol klasy startuje juz skreslone.
   *
   * Same OCENY ida w obu trybach tak samo, do wspolnego store - rozne jest
   * tylko to, kogo kolo jeszcze losuje.
   */
  poolMemory?: 'events' | 'local';
}

export function useTaskWheel({ classId, lessonCode, poolMemory = 'events' }: UseTaskWheelArgs) {
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
  // Ostatnia ocena zapamietana RAZEM z uczniem, nie samo id zdarzenia: po
  // kolejnym krecie `currentEntry` wskazuje juz kogos innego, a Cofnij ma
  // oddac sektor temu, kto te ocene dostal.
  const [lastGrade, setLastGrade] = useState<{ eventId: string; studentId: string } | null>(null);

  // Tryb `local`: ile razy uczen byl losowany OD OSTATNIEGO RESETU (patrz poolMemory).
  const [localUsed, setLocalUsed] = useState<Record<string, number>>({});

  const answered = useMemo(() => answeredOnDay(recapEvents, classId, todayKey()), [recapEvents, classId]);
  const usedFor = useCallback(
    (studentId: string) =>
      poolMemory === 'local' ? localUsed[studentId] ?? 0 : answered.get(studentId) ?? 0,
    [poolMemory, localUsed, answered],
  );
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
  const currentWarnings = currentStudent ? warningsFor(currentStudent.id) : 0;
  const currentCanEarnPlus = currentStudent ? canEarnPlus(currentWarnings) : false;
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
    setLastGrade({ eventId: event.id, studentId });
    setGraded(true);
    if (poolMemory === 'local') {
      setLocalUsed((cur) => ({ ...cur, [studentId]: (cur[studentId] ?? 0) + 1 }));
    }
  }

  /**
   * Cofa ostatnia ocene. W trybie `events` pula odswieza sie sama (liczy sie ze
   * zdarzen), w trybie `local` trzeba jeszcze oddac uczniowi jego sektor.
   */
  function undoLast() {
    if (!lastGrade) return;
    removeRecapEvent(lastGrade.eventId);
    const studentId = lastGrade.studentId;
    if (poolMemory === 'local') {
      setLocalUsed((cur) => {
        const left = (cur[studentId] ?? 0) - 1;
        const next = { ...cur };
        if (left > 0) next[studentId] = left;
        else delete next[studentId];
        return next;
      });
    }
    setLastGrade(null);
    setCurrentEntry(null);
    setGraded(false);
  }

  /**
   * Reset rundy: wszyscy wracaja na kolo. Kasuje TYLKO skreslenia - obecnosc i
   * zapisane plusy/kropki zostaja (te ostatnie sa juz w bilansie miesiaca).
   * Dziala wylacznie w trybie `local`; w `events` skreslenia wynikaja z
   * zapisanych zdarzen i nie ma czego zerowac bez kasowania ocen.
   */
  function resetPool() {
    setLocalUsed({});
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
    currentCanEarnPlus,
    currentWarnings,
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
    canReset: poolMemory === 'local' && (Object.keys(localUsed).length > 0 || allowRepeats),
    canUndo: !!lastGrade,
    clearGradedStudent,
  };
}

export type TaskWheelState = ReturnType<typeof useTaskWheel>;
