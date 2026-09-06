// Pula losowania rundy: wpisy PoolEntry (z duplikatami za uwagi -
// buildRoundEntries), licznik ilu razy kazdy uczen juz odpowiadal (usedCount)
// i postep rundy (plannedDraws / drawsCompleted). Wydzielone z
// useRecapSession.ts dla czytelnosci i limitu dlugosci pliku.
//
// Dwie listy, jedno zrodlo: `entries` to WSZYSCY na kole (z tymi, ktorzy juz
// odpowiadali - zostaja na kole na czerwono), a `pool` to sami kandydaci do
// losowania. Kolo rysuje `entries`, losowanie bierze z `pool`.

import { useCallback, useMemo, useState } from 'react';
import type { Student } from '../../data/types';
import { buildRoundEntries, drawableEntries, plannedDraws, type PoolEntry } from '../../lib/recap';

export function usePool(students: Student[], warningsFor: (studentId: string) => number) {
  const [usedCount, setUsedCount] = useState<Map<string, number>>(new Map());
  const usedFor = useCallback((studentId: string) => usedCount.get(studentId) ?? 0, [usedCount]);
  const [allowRepeats, setAllowRepeats] = useState(false);

  const entries: PoolEntry[] = useMemo(
    () => buildRoundEntries({ students, warningsFor, usedFor, allowRepeats }),
    [students, warningsFor, usedFor, allowRepeats],
  );

  const pool: PoolEntry[] = useMemo(() => drawableEntries(entries), [entries]);

  const plannedTotal = useMemo(() => plannedDraws(students, warningsFor), [students, warningsFor]);
  const drawsCompleted = useMemo(
    () => students.reduce((sum, st) => sum + usedFor(st.id), 0),
    [students, usedFor],
  );

  function bumpUsedCount(studentId: string) {
    setUsedCount((cur) => {
      const next = new Map(cur);
      next.set(studentId, (next.get(studentId) ?? 0) + 1);
      return next;
    });
  }

  function undoUsedCount(studentId: string) {
    setUsedCount((cur) => {
      const next = new Map(cur);
      const val = Math.max(0, (next.get(studentId) ?? 0) - 1);
      next.set(studentId, val);
      return next;
    });
  }

  function resetRound() {
    setUsedCount(new Map());
  }

  return {
    usedCount,
    allowRepeats,
    setAllowRepeats,
    entries,
    pool,
    plannedTotal,
    drawsCompleted,
    bumpUsedCount,
    undoUsedCount,
    resetRound,
  };
}
