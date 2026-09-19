// Logika trybu "Rozsadz" w widoku Sala: dwa tapy zamiast przeciagania, bo na
// telefonie drag and drop jest niewygodny, a w Chrome 109 zawodny.
//
// Zaznaczenie to albo miejsce w lawce (puste lub zajete), albo uczen z listy
// "Bez lawki". Drugi tap domyka ruch:
// - miejsce -> miejsce: siedzacy z pierwszego przechodzi na drugie (zamiana,
//   gdy oba zajete), a gdy pierwsze puste, a drugie zajete - w druga strone;
// - miejsce -> uczen z listy (albo odwrotnie): uczen siada na tym miejscu,
//   dotychczasowy siedzacy schodzi do "Bez lawki";
// - to samo miejsce drugi raz: zajete zwalnia sie, puste - nic.
// Sam zapis robi placeStudent (src/lib/seating.ts), tu jest tylko maszyna
// stanow zaznaczenia. Czysta funkcja `nextSelection` jest osobno, zeby dalo
// sie ja przetestowac bez Reacta.

import { useCallback, useState } from 'react';
import type { SeatPosition } from '../../lib/seating';
import { samePosition } from '../../lib/seating';

export type SalaSelection =
  | { kind: 'place'; pos: SeatPosition; studentId?: string }
  | { kind: 'student'; studentId: string };

export type SalaMove = { type: 'seat'; studentId: string; pos: SeatPosition } | { type: 'unseat'; studentId: string };

export type SalaTap = { kind: 'place'; pos: SeatPosition; occupantId?: string } | { kind: 'student'; studentId: string };

/** Nowe zaznaczenie i ewentualny ruch do zapisania po tapie. */
export function nextSelection(sel: SalaSelection | null, tap: SalaTap): { selection: SalaSelection | null; move?: SalaMove } {
  if (tap.kind === 'student') {
    if (sel?.kind === 'place') return { selection: null, move: { type: 'seat', studentId: tap.studentId, pos: sel.pos } };
    if (sel?.kind === 'student' && sel.studentId === tap.studentId) return { selection: null };
    return { selection: { kind: 'student', studentId: tap.studentId } };
  }
  const { pos, occupantId } = tap;
  if (!sel) return { selection: { kind: 'place', pos, studentId: occupantId } };
  if (sel.kind === 'student') return { selection: null, move: { type: 'seat', studentId: sel.studentId, pos } };
  if (samePosition(sel.pos, pos)) {
    return occupantId ? { selection: null, move: { type: 'unseat', studentId: occupantId } } : { selection: null };
  }
  if (sel.studentId) return { selection: null, move: { type: 'seat', studentId: sel.studentId, pos } };
  if (occupantId) return { selection: null, move: { type: 'seat', studentId: occupantId, pos: sel.pos } };
  // Dwa puste miejsca - zaznaczenie przechodzi na drugie.
  return { selection: { kind: 'place', pos } };
}

export function useSalaSelection(onMove: (move: SalaMove) => void) {
  const [selection, setSelection] = useState<SalaSelection | null>(null);

  const tap = useCallback(
    (t: SalaTap) => {
      const result = nextSelection(selection, t);
      if (result.move) onMove(result.move);
      setSelection(result.selection);
    },
    [selection, onMove],
  );

  const clear = useCallback(() => setSelection(null), []);

  return { selection, tap, clear };
}
