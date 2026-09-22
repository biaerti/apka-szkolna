// SALA - widok lawek klasy na telefonie (dziala tez na komputerze).
//
// Po co: Bartek nie pamieta wszystkich imion, a na lekcji chce jednym tapem
// dac plus / kropke / plombe albo zapisac uwage, bez podchodzenia do
// komputera. Lawki sa ulozone tak, jak widzi sale stojac przy tablicy: tablica
// na dole ekranu, rzad 1 tuz nad nia, kolumna P po prawej rece
// (patrz src/lib/seating.ts), wiec "ten w P1" to
// od razu konkretne nazwisko.
//
// Zapis to zwykle RecapEvent (jak z kola na lekcji) - bilans miesiaca,
// zakladka Uwagi i panel na komputerze widza je bez zadnej dodatkowej pracy.
// Chmura odswieza sie tu co 5 s (useTodayEventsPull), zeby plus dany z
// komputera pojawil sie na telefonie i odwrotnie.
//
// Tryb "Rozsadz" (dwa tapy) - patrz src/components/sala/useSalaSelection.ts.

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { useStore } from '../data/store';
import type { RecapEvent, Student } from '../data/types';
import { useTodayEventsPull } from '../data/remote/useTodayEventsPull';
import { buildDeskGrid, seatLabelByStudent, unseatedStudents, type SeatPosition } from '../lib/seating';
import { warningsByStudent } from '../lib/ostrzezenia';
import { currentOrNextEntry } from '../lib/timetable';
import { resultSymbol } from '../lib/resultSymbol';
import { DeskGrid } from '../components/sala/DeskGrid';
import { StudentActionSheet, type SalaGrade } from '../components/sala/StudentActionSheet';
import { useSalaSelection, type SalaMove } from '../components/sala/useSalaSelection';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';

type View = 'lawki' | 'lista';

const UNDO_MS = 5000;

export function Sala() {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const classes = useStore((s) => s.classes);
  const students = useStore((s) => s.students);
  const seats = useStore((s) => s.seats);
  const recapEvents = useStore((s) => s.recapEvents);
  const timetable = useStore((s) => s.timetable);
  const periods = useStore((s) => s.periods);
  const addRecapEvent = useStore((s) => s.addRecapEvent);
  const removeRecapEvent = useStore((s) => s.removeRecapEvent);
  const setSeat = useStore((s) => s.setSeat);
  const clearSeat = useStore((s) => s.clearSeat);
  const clearSeating = useStore((s) => s.clearSeating);

  useTodayEventsPull(5000);

  // Bez klasy w adresie: trwajaca (albo najblizsza) lekcja z planu, a poza
  // planem - pierwsza klasa. Telefon otwiera /sala z ikony na ekranie glownym.
  useEffect(() => {
    if (classId) return;
    const entry = currentOrNextEntry(timetable, periods, new Date());
    const fallback = entry?.classId ?? [...classes].sort((a, b) => a.order - b.order)[0]?.id;
    if (fallback) navigate(`/sala/${fallback}`, { replace: true });
  }, [classId, classes, timetable, periods, navigate]);

  const schoolClass = classes.find((c) => c.id === classId);
  const [view, setView] = useState<View>('lawki');
  const [editing, setEditing] = useState(false);
  const [picked, setPicked] = useState<Student | null>(null);
  const [flashId, setFlashId] = useState<string | null>(null);
  const [undo, setUndo] = useState<{ event: RecapEvent; label: string } | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const classmates = useMemo(
    () =>
      students
        .filter((st) => st.classId === classId && st.active)
        .sort((a, b) => a.lastName.localeCompare(b.lastName, 'pl') || a.firstName.localeCompare(b.firstName, 'pl')),
    [students, classId],
  );
  const grid = useMemo(() => (classId ? buildDeskGrid(seats, students, classId) : []), [seats, students, classId]);
  const labels = useMemo(() => (classId ? seatLabelByStudent(seats, classId) : new Map<string, string>()), [seats, classId]);
  const unseated = useMemo(() => (classId ? unseatedStudents(seats, students, classId) : []), [seats, students, classId]);

  const recentByStudent = useMemo(() => {
    const out = new Map<string, RecapEvent[]>();
    for (const e of recapEvents) {
      if (e.classId !== classId || e.result === 'ostrzezenie') continue;
      const list = out.get(e.studentId) ?? [];
      list.push(e);
      out.set(e.studentId, list);
    }
    for (const [studentId, list] of out) {
      list.sort((a, b) => b.at.localeCompare(a.at));
      out.set(studentId, list.slice(0, 8));
    }
    return out;
  }, [recapEvents, classId]);

  // Ostrzezenia sa POZA historia: zostaja przy uczniu z lekcji na lekcje,
  // wiec filtr po dzisiejszej dacie by je gubil (patrz src/lib/ostrzezenia.ts).
  const ostrzezenia = useMemo(
    () => (classId ? warningsByStudent(recapEvents, classId) : new Map<string, RecapEvent[]>()),
    [recapEvents, classId],
  );

  const onMove = useCallback(
    (move: SalaMove) => {
      if (!classId) return;
      if (move.type === 'unseat') clearSeat(move.studentId);
      else setSeat({ classId, studentId: move.studentId, ...move.pos });
    },
    [classId, setSeat, clearSeat],
  );
  const selection = useSalaSelection(onMove);

  // Pasek "Cofnij" znika sam po chwili - zostaje tylko ostatni zapis.
  useEffect(() => {
    if (!undo) return;
    const t = window.setTimeout(() => setUndo(null), UNDO_MS);
    return () => window.clearTimeout(t);
  }, [undo]);

  function flash(studentId: string) {
    setFlashId(studentId);
    window.setTimeout(() => setFlashId((id) => (id === studentId ? null : id)), 600);
  }

  function handleGrade(student: Student, result: SalaGrade) {
    if (!classId) return;
    const event = addRecapEvent({ studentId: student.id, classId, result });
    setUndo({ event, label: `${resultSymbol(result).symbol} ${student.firstName} ${student.lastName}` });
    flash(student.id);
  }

  function handleUwaga(student: Student, note: string) {
    if (!classId) return;
    const event = addRecapEvent({ studentId: student.id, classId, result: 'uwaga', note });
    // Uwaga zastepuje ostrzezenia - po co maja wisiec dalej, skoro jest juz wpis.
    for (const wisiace of ostrzezenia.get(student.id) ?? []) removeRecapEvent(wisiace.id);
    setUndo({ event, label: `Uwaga: ${student.firstName} ${student.lastName}` });
    flash(student.id);
  }

  function handleOstrzezenie(student: Student) {
    if (!classId) return;
    const event = addRecapEvent({ studentId: student.id, classId, result: 'ostrzezenie' });
    setUndo({ event, label: `Ostrzeżenie: ${student.firstName} ${student.lastName}` });
    flash(student.id);
  }

  function handleZdejmijOstrzezenie(student: Student) {
    // Zdejmujemy najnowsze; kolejne tapy schodza dalej, az nic nie wisi.
    const wisiace = ostrzezenia.get(student.id) ?? [];
    const last = wisiace[wisiace.length - 1];
    if (last) removeRecapEvent(last.id);
  }

  function handleTapPlace(pos: SeatPosition, student?: Student) {
    if (editing) selection.tap({ kind: 'place', pos, occupantId: student?.id });
    else if (student) setPicked(student);
  }

  function handleTapListed(student: Student) {
    if (editing) selection.tap({ kind: 'student', studentId: student.id });
    else setPicked(student);
  }

  if (!classId) return null;
  if (!schoolClass) {
    return <EmptyState title="Nie ma takiej klasy" description="Wybierz klasę z listy." action={<Link to="/klasy">Klasy</Link>} />;
  }

  const selectedPos = selection.selection?.kind === 'place' ? selection.selection.pos : undefined;
  const selectedStudentId = selection.selection?.kind === 'student' ? selection.selection.studentId : undefined;

  return (
    <div className="mx-auto max-w-lg pb-24">
      <div className="mb-3 flex items-center gap-2">
        <select
          value={classId}
          onChange={(e) => {
            selection.clear();
            navigate(`/sala/${e.target.value}`);
          }}
          aria-label="Klasa"
          className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-base font-semibold text-gray-900"
        >
          {[...classes]
            .sort((a, b) => a.order - b.order)
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
        </select>
        <div className="ml-auto flex rounded-md border border-gray-300 bg-white p-0.5 text-sm" role="tablist" aria-label="Widok">
          {(['lawki', 'lista'] as View[]).map((v) => (
            <button
              key={v}
              type="button"
              role="tab"
              aria-selected={view === v}
              onClick={() => setView(v)}
              className={clsx('rounded px-3 py-1 font-medium', view === v ? 'bg-accent-600 text-white' : 'text-gray-600')}
            >
              {v === 'lawki' ? 'Ławki' : 'Lista'}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            selection.clear();
            setEditing((e) => !e);
          }}
          aria-pressed={editing}
          className={clsx(
            'rounded-md border px-3 py-1.5 text-sm font-medium',
            editing ? 'border-accent-600 bg-accent-600 text-white' : 'border-gray-300 bg-white text-gray-700',
          )}
        >
          {editing ? 'Gotowe' : 'Rozsadź'}
        </button>
      </div>

      {editing && (
        <p className="mb-3 rounded-md bg-accent-50 px-3 py-2 text-sm text-accent-800">
          {selection.selection
            ? 'Teraz wskaż, gdzie ma usiąść. Ten sam kafelek drugi raz zwalnia miejsce.'
            : 'Wskaż miejsce albo ucznia, potem drugie z nich. Zajęte miejsce to zamiana.'}
        </p>
      )}

      {view === 'lawki' || editing ? (
        <DeskGrid
          grid={grid}
          classmates={classmates}
          ostrzezenia={ostrzezenia}
          editing={editing}
          selectedPos={selectedPos}
          flashStudentId={flashId}
          onTapPlace={handleTapPlace}
        />
      ) : (
        <StudentList
          students={classmates}
          labels={labels}
          ostrzezenia={ostrzezenia}
          flashId={flashId}
          onTap={handleTapListed}
        />
      )}

      {(editing || view === 'lawki') && unseated.length > 0 && (
        <div className="mt-4">
          <h2 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">Bez ławki ({unseated.length})</h2>
          <StudentList
            students={unseated}
            labels={labels}
            ostrzezenia={ostrzezenia}
            flashId={flashId}
            selectedId={selectedStudentId}
            onTap={handleTapListed}
          />
        </div>
      )}

      {editing && (
        <div className="mt-6 text-center">
          <button type="button" onClick={() => setConfirmClear(true)} className="text-sm text-red-600 underline-offset-2 hover:underline">
            Wyczyść rozsadzenie klasy
          </button>
        </div>
      )}

      {!editing && (
        <StudentActionSheet
          student={picked}
          seatLabel={picked ? labels.get(picked.id) : undefined}
          ostrzezenia={picked ? ostrzezenia.get(picked.id)?.length ?? 0 : 0}
          recentEvents={picked ? recentByStudent.get(picked.id) ?? [] : []}
          onGrade={handleGrade}
          onOstrzezenie={handleOstrzezenie}
          onZdejmijOstrzezenie={handleZdejmijOstrzezenie}
          onUwaga={handleUwaga}
          onClose={() => setPicked(null)}
        />
      )}

      {undo && (
        <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
          <div className="flex w-full max-w-lg items-center justify-between gap-3 rounded-lg bg-gray-900 px-4 py-2.5 text-sm text-white shadow-lg">
            <span className="truncate">Zapisano: {undo.label}</span>
            <button
              type="button"
              onClick={() => {
                removeRecapEvent(undo.event.id);
                setUndo(null);
              }}
              className="shrink-0 font-semibold text-amber-300"
            >
              Cofnij
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmClear}
        title="Wyczyścić rozsadzenie?"
        message={`Wszyscy uczniowie klasy ${schoolClass.name} trafią do "Bez ławki". Plusy i uwagi zostają.`}
        confirmLabel="Wyczyść"
        onConfirm={() => {
          clearSeating(classId);
          selection.clear();
          setConfirmClear(false);
        }}
        onCancel={() => setConfirmClear(false)}
      />
    </div>
  );
}

function StudentList({
  students,
  labels,
  ostrzezenia,
  flashId,
  selectedId,
  onTap,
}: {
  students: Student[];
  labels: Map<string, string>;
  ostrzezenia: Map<string, RecapEvent[]>;
  flashId: string | null;
  selectedId?: string;
  onTap: (student: Student) => void;
}) {
  if (students.length === 0) {
    return <p className="text-sm text-gray-500">Brak uczniów w tej klasie.</p>;
  }
  return (
    <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
      {students.map((st) => {
        return (
          <li key={st.id}>
            <button
              type="button"
              onClick={() => onTap(st)}
              aria-pressed={selectedId ? selectedId === st.id : undefined}
              className={clsx(
                'flex w-full items-center gap-3 px-3 py-2.5 text-left text-base active:bg-accent-50',
                selectedId === st.id && 'bg-accent-50 ring-2 ring-inset ring-accent-500',
                flashId === st.id && 'bg-emerald-100',
              )}
            >
              <span className="w-6 shrink-0 text-right text-sm tabular-nums text-gray-400">{st.number}</span>
              <span className="min-w-0 flex-1 truncate text-gray-900">
                <span className="font-medium">{st.lastName}</span> {st.firstName}
              </span>
              {(ostrzezenia.get(st.id)?.length ?? 0) > 0 && (
                <span title="ostrzeżenie" className="shrink-0 text-xs font-black text-amber-600">
                  {resultSymbol('ostrzezenie').symbol}
                  {(ostrzezenia.get(st.id)?.length ?? 0) > 1 && ostrzezenia.get(st.id)?.length}
                </span>
              )}
              <span className="w-7 shrink-0 text-right text-xs font-semibold tabular-nums text-gray-400">{labels.get(st.id) ?? ''}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
