// Pula losowania rundy: wpisy PoolEntry (z duplikatami za uwagi - buildPool),
// licznik ilu razy kazdy uczen juz odpowiadal (usedCount) i postep rundy
// (plannedDraws / drawsCompleted). Wydzielone z useRecapSession.ts dla
// czytelnosci i limitu dlugosci pliku.

import { useCallback, useMemo, useState } from 'react';
import type { Student } from '../../data/types';
import { buildPool, plannedDraws, type PoolEntry } from '../../lib/recap';

export function usePool(students: Student[], warningsFor: (studentId: string) => number) {
  const [usedCount, setUsedCount] = useState<Map<string, number>>(new Map());
  const usedFor = useCallback((studentId: string) => usedCount.get(studentId) ?? 0, [usedCount]);
  const [allowRepeats, setAllowRepeats] = useState(false);

  const pool: PoolEntry[] = useMemo(
    () => buildPool({ students, warningsFor, usedFor, allowRepeats }),
    [students, warningsFor, usedFor, allowRepeats],
  );

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
    pool,
    plannedTotal,
    drawsCompleted,
    bumpUsedCount,
    undoUsedCount,
    resetRound,
  };
}
