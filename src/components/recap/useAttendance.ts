// Obecnosc na powtorce: nieobecni odhaczani na starcie (przekazani z ekranu
// wyboru klasy albo przelaczani recznie w pasku bocznym). Pula losowania jest
// liczona wprost z obecnych - bez posredniego ekranu gotowosci (usuniety po
// testach na zywo). Wydzielone z useRecapSession.ts, zeby glowny hook nie
// przekraczal limitu dlugosci pliku.

import { useEffect, useMemo, useState } from 'react';
import type { Student } from '../../data/types';

export function useAttendance(classStudents: Student[], classId: string, absentIds: string[]) {
  const [absentSet, setAbsentSet] = useState<Set<string>>(() => new Set(absentIds));
  useEffect(() => {
    setAbsentSet(new Set(absentIds));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId]);

  function togglePresent(studentId: string) {
    setAbsentSet((cur) => {
      const next = new Set(cur);
      if (next.has(studentId)) next.delete(studentId);
      else next.add(studentId);
      return next;
    });
  }

  const presentStudents = useMemo(
    () => classStudents.filter((st) => !absentSet.has(st.id)),
    [classStudents, absentSet],
  );

  return {
    absentSet,
    togglePresent,
    presentStudents,
  };
}
