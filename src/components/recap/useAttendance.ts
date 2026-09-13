// Obecnosc przy kole: kto jest dzis nieobecny w klasie. Nieobecnosci siedza w
// store (Absence) i sa WSPOLNE dla calego dnia i wszystkich kol - zaznaczenie
// w plywajacym panelu wypisuje ucznia takze z kola powtorzeniowego w apce
// webowej i z szuflady kola w prezentacji (drugie okno dociaga je z chmury,
// patrz pullTodayRecapEvents). Pula losowania liczy sie wprost z obecnych.

import { useMemo } from 'react';
import { useStore } from '../../data/store';
import type { Student } from '../../data/types';
import { absentOnDay } from '../../lib/attendance';
import { toDateKey } from '../../lib/dates';
import { currentEntry } from '../../lib/timetable';

export function useAttendance(classStudents: Student[], classId: string) {
  const absences = useStore((s) => s.absences);
  const setAbsent = useStore((s) => s.setAbsent);
  const date = toDateKey(new Date());

  const absentSet = useMemo(() => absentOnDay(absences, classId, date), [absences, classId, date]);

  function togglePresent(studentId: string) {
    const { timetable, periods } = useStore.getState();
    // Numer lekcji tylko wtedy, gdy plan mowi, ze to wlasnie lekcja tej klasy.
    const lekcja = currentEntry(timetable, periods, new Date());
    setAbsent({
      studentId,
      classId,
      date,
      absent: !absentSet.has(studentId),
      period: lekcja?.classId === classId ? lekcja.period : undefined,
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
