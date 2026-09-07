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
// Wybor ucznia (kolo i "po kolei") jest ZAWSZE efektem akcji nauczyciela
// (Krec/Spacja albo "nastepny uczen") - zaden tryb nie wybiera nikogo sam z
// siebie (np. od razu po wejsciu na slajd, zaraz po ocenie czy po cofnieciu).
// Dawniej tryb "po kolei" mial wlasny efekt auto-wyboru - usuniety, bo
// zaznaczal pierwszego ucznia juz na starcie rundy, zanim ktokolwiek kliknal.
//
// Cofniecie ostatniej akcji (undoLast) dziala takze dla trybu bez ocen
// (markDoneNoGrade nie zapisuje RecapEvent) - lastAction pamieta wtedy tylko
// kogo cofnac z licznika uzyc, bez proby usuwania nieistniejacego zdarzenia.

import { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from '../../data/store';
import type { RecapEvent, RecapResult, Settings, Student } from '../../data/types';
import {
  canEarnPlus,
  canPass,
  nextSequential,
  passesUsedThisMonth,
  wheelTargetAngle,
  type PoolEntry,
  type RecapMode,
} from '../../lib/recap';

export type PickMode = 'wheel' | 'sequential';

type LastActionKind = 'grade' | 'hint' | 'uwaga' | 'pick';

interface LastAction {
  /** Brak dla kind 'pick' - markDoneNoGrade nie zapisuje RecapEvent. */
  eventId?: string;
  studentId: string;
  kind: LastActionKind;
}

export interface UseRecapDrawArgs {
  classId: string;
  setId: string;
  /** Wszystkie wpisy rundy - rowniez te, ktore juz odpowiadaly. To one sa sektorami kola. */
  entries: PoolEntry[];
  /** Wpisy, ktore jeszcze moga byc wylosowane (entries bez `done`). */
  pool: PoolEntry[];
  warningsFor: (studentId: string) => number;
  bumpUsedCount: (studentId: string) => void;
  undoUsedCount: (studentId: string) => void;
  resetRound: () => void;
  currentQuestionId: string | undefined;
  randomOrder: boolean;
  advanceRandomQuestion: () => void;
  /**
   * Czy wylosowanie ucznia ma od razu przerzucic na kolejne pytanie. Domyslnie
   * true (tak dziala zwykla runda z losowymi pytaniami). Lekcja zapoznawcza
   * ustawia false: pytanie zostaje na ekranie po zakreceniu kolem, a zmienia
   * sie dopiero po "nastepne pytanie" (N) - inaczej dzieci nie zdazyly nawet
   * przeczytac pytania, ktore widzialy przed losowaniem.
   */
  advanceQuestionOnPick?: boolean;
  recapEvents: RecapEvent[];
  settings: Settings;
  initialPickMode: PickMode;
  initialGrading: boolean;
  /**
   * Tryb rundy - decyduje o zasadach oceniania (patrz src/lib/recap.ts):
   * 'powtorzeniowe' ocenia w pelni, 'po-lekcji' (stary tryb, tylko dla
   * nieodswiezonych lekcji) pozwalal tylko zyskac. 'demo' (lekcja zapoznawcza /
   * "Przedstaw się") nie korzysta z tego rozroznienia - tam `grading` jest i
   * tak wylaczone wyzej w drzewie.
   */
  recapMode: RecapMode;
}

export function useRecapDraw({
  classId,
  setId,
  entries,
  pool,
  warningsFor,
  bumpUsedCount,
  undoUsedCount,
  resetRound,
  currentQuestionId,
  randomOrder,
  advanceRandomQuestion,
  advanceQuestionOnPick = true,
  recapEvents,
  settings,
  initialPickMode,
  initialGrading,
  recapMode,
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

  // Wpis wylosowany, ale jeszcze nie ujawniony - kolo dopiero sie kreci.
  // Nazwisko ma sie pokazac DOPIERO, gdy kolo stanie (patrz handleSpinEnd),
  // inaczej dzieci czytaja wynik, zanim wskaznik dojedzie do sektora.
  const pendingEntryRef = useRef<PoolEntry | null>(null);

  const now = new Date();
  const currentStudent: Student | null = currentEntry?.student ?? null;
  const currentPassesUsed = currentStudent ? passesUsedThisMonth(recapEvents, currentStudent.id, now) : 0;
  const currentCanPass = currentStudent ? canPass(recapEvents, currentStudent.id, settings, now) : false;
  // Blokada plusa dziala w OBU trybach: uczen z >=2 uwagami w miesiacu traci
  // mozliwosc plusa (canEarnPlus, patrz src/lib/recap.ts) - w kole po lekcji
  // dostaje wtedy tylko "Dalej" (nic), w kole powtorzeniowym - kropke/plombe/pas.
  const currentCanEarnPlus = currentStudent ? canEarnPlus(warningsFor(currentStudent.id)) : false;

  const canSpin = !spinning && (!currentEntry || graded) && pool.length > 0;

  function recordEvent(studentId: string, result: RecapResult) {
    return addRecapEvent({ studentId, classId, questionSetId: setId, questionId: currentQuestionId, result });
  }

  function applyPick(entry: PoolEntry) {
    setGraded(false);
    setCurrentEntry(entry);
    if (randomOrder && advanceQuestionOnPick) advanceRandomQuestion();
  }

  // Zawsze najswiezsza wersja applyPick - handleSpinEnd trafia do <Wheel> raz,
  // na starcie animacji, wiec nie moze zamykac starej kopii funkcji.
  const applyPickRef = useRef(applyPick);
  applyPickRef.current = applyPick;

  function spin() {
    if (!canSpin) return;
    // Losujemy sposrod wpisow, ktore jeszcze nie odpowiadaly (`pool`), ale kat
    // liczymy wzgledem PELNEJ listy sektorow (`entries`) - na kole zostaja tez
    // ci, ktorzy juz byli (na czerwono), wiec indeks z puli nie jest indeksem
    // sektora.
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

  // Bezpiecznik: gdy w trakcie krecenia nauczyciel przelaczy sie na tryb "po
  // kolei", kolo znika z ekranu i nigdy nie zglosi konca animacji - konczymy ja
  // recznie, zeby wylosowana osoba nie utknela w zawieszeniu.
  useEffect(() => {
    if (pickMode === 'wheel' || !spinning) return;
    handleSpinEnd();
  }, [pickMode, spinning, handleSpinEnd]);

  /**
   * Zdejmuje z ekranu ucznia, ktory ma juz wpisana ocene (np. przy przejsciu do
   * kolejnego pytania) - zeby nowe pytanie nie wisialo pod nazwiskiem poprzedniej
   * osoby. Uczen bez oceny zostaje: nauczyciel po prostu zmienil mu pytanie.
   */
  function clearGradedStudent() {
    if (!currentEntry || !graded) return;
    setCurrentEntry(null);
    setGraded(false);
  }

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

  function grade(result: Extract<RecapResult, 'plus' | 'kropka' | 'plomba' | 'pass'>) {
    if (!currentEntry || graded) return;
    // Blokada plusa dziala w OBU trybach - uczen z >=2 uwagami w miesiacu nie
    // moze dostac plusa w zadnym kole (canEarnPlus).
    if (result === 'plus' && !canEarnPlus(warningsFor(currentEntry.student.id))) return;
    // Stary tryb po-lekcji (patrz src/lib/recap.ts): jedyna ocena to plus - nie
    // ma kropki, plomby ani pasa (przycisk "Dalej" zamiast nich - patrz markDoneNoGrade).
    if (recapMode !== 'powtorzeniowe' && result !== 'plus') return;
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
    const studentId = currentEntry.student.id;
    bumpUsedCount(studentId);
    setLastAction({ studentId, kind: 'pick' });
    setCurrentEntry(null);
    setGraded(false);
  }

  function undoLast() {
    if (!lastAction) return;
    if (lastAction.eventId) removeRecapEvent(lastAction.eventId);
    if (lastAction.kind === 'grade' || lastAction.kind === 'pick') {
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
    clearGradedStudent,
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
    recapMode,
  };
}
