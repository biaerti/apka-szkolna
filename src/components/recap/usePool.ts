// Pula losowania rundy: wpisy PoolEntry (jeden na ucznia - buildRoundEntries),
// informacja, kto juz odpowiadal, i postep rundy. Wydzielone z
// useRecapSession.ts dla czytelnosci i limitu dlugosci pliku.
//
// Dwie listy, jedno zrodlo: `entries` to WSZYSCY na kole (z tymi, ktorzy juz
// odpowiadali - zostaja na kole na czerwono), a `pool` to sami kandydaci do
// losowania. Kolo rysuje `entries`, losowanie bierze z `pool`.
//
// "Kto juz byl" ma DWA zrodla, celowo zlozone razem:
// 1. zapisane zdarzenia z dzisiaj dla tej klasy (answeredOnDay) - dzieki temu
//    pamiec jest wspolna z kolem na lekcji i z plywajacym panelem, przezywa
//    przeladowanie strony i dziala miedzy oknami (useTodayEventsPull);
// 2. licznik w sesji (`localUsed`) - potrzebny dla trybu BEZ OCEN, w ktorym
//    markDoneNoGrade nie zapisuje zadnego zdarzenia, wiec nie ma go z czego
//    odtworzyc.
// "Zacznij nowa runde" nie kasuje zdarzen (te sa juz w bilansie miesiaca) -
// przesuwa tylko moment, od ktorego liczymy skreslenia (`resetAt`).

import { useCallback, useMemo, useState } from 'react';
import { useStore } from '../../data/store';
import type { Student } from '../../data/types';
import { todayKey } from '../../lib/grade';
import { answeredOnDay, buildRoundEntries, drawableEntries, plannedDraws, type PoolEntry } from '../../lib/recap';

export function usePool(students: Student[], classId: string) {
  const recapEvents = useStore((s) => s.recapEvents);
  const [localUsed, setLocalUsed] = useState<Map<string, number>>(new Map());
  const [resetAt, setResetAt] = useState<string | null>(null);
  const [allowRepeats, setAllowRepeats] = useState(false);
  // Ile losowan poszlo W TEJ SESJI - postep rundy w pasku ("losowanie 3 z 20")
  // ma liczyc od otwarcia kola, a nie od poczatku dnia.
  const [drawsCompleted, setDrawsCompleted] = useState(0);

  const answeredToday = useMemo(
    () => answeredOnDay(recapEvents, classId, todayKey(), resetAt ?? undefined),
    [recapEvents, classId, resetAt],
  );

  const usedCount = useMemo(() => {
    const map = new Map<string, number>();
    for (const st of students) {
      const total = (answeredToday.get(st.id) ?? 0) + (localUsed.get(st.id) ?? 0);
      if (total > 0) map.set(st.id, total);
    }
    return map;
  }, [students, answeredToday, localUsed]);

  const usedFor = useCallback((studentId: string) => usedCount.get(studentId) ?? 0, [usedCount]);

  const entries: PoolEntry[] = useMemo(
    () => buildRoundEntries({ students, usedFor, allowRepeats }),
    [students, usedFor, allowRepeats],
  );

  const pool: PoolEntry[] = useMemo(() => drawableEntries(entries), [entries]);

  const plannedTotal = useMemo(() => plannedDraws(students), [students]);

  function bumpUsedCount(studentId: string) {
    setDrawsCompleted((n) => n + 1);
    setLocalUsed((cur) => {
      const next = new Map(cur);
      next.set(studentId, (next.get(studentId) ?? 0) + 1);
      return next;
    });
  }

  function undoUsedCount(studentId: string) {
    setDrawsCompleted((n) => Math.max(0, n - 1));
    setLocalUsed((cur) => {
      const next = new Map(cur);
      const val = Math.max(0, (next.get(studentId) ?? 0) - 1);
      if (val === 0) next.delete(studentId);
      else next.set(studentId, val);
      return next;
    });
  }

  function resetRound() {
    setLocalUsed(new Map());
    setResetAt(new Date().toISOString());
    setDrawsCompleted(0);
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
