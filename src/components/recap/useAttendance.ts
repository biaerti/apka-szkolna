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
import { matchVulcanAttendance, requestVulcanAttendance } from '../../lib/vulcanAttendance';

export function useAttendance(classStudents: Student[], classId: string) {
  const absences = useStore((s) => s.absences);
  const setAbsent = useStore((s) => s.setAbsent);
  const date = toDateKey(new Date());

  const { timetable, periods } = useStore.getState();
  const currentLesson = currentEntry(timetable, periods, new Date());
  const period = currentLesson?.classId === classId ? currentLesson.period : undefined;
  const absentSet = useMemo(() => absentOnDay(absences, classId, date, period), [absences, classId, date, period]);

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

  /**
   * Dociaga frekwencje z otwartej karty VULCANA (dodatek Chrome) i nanosi ja
   * na dzisiejsza godzine - nieobecni od razu wypadaja z kola. Dziala tylko w
   * czasie lekcji tej klasy wg planu (dodatek musi wiedziec, ktora kolumne
   * czytac). Zwraca krotkie podsumowanie do pokazania przy przycisku.
   */
  async function pullFromVulcan(): Promise<string> {
    const { timetable, periods, setAttendance } = useStore.getState();
    const lekcja = currentEntry(timetable, periods, new Date());
    if (lekcja?.classId !== classId) {
      throw new Error('Wg planu nie trwa teraz lekcja tej klasy - nie wiem, którą godzinę odczytać.');
    }
    const rows = await requestVulcanAttendance(lekcja.period);
    const { matched, unmatched } = matchVulcanAttendance(rows, classStudents);
    for (const item of matched) {
      setAttendance({ studentId: item.studentId, classId, date, period: lekcja.period, status: item.status });
    }
    const absent = matched.filter((m) => m.status === 'absent').length;
    const late = matched.filter((m) => m.status === 'late').length;
    const tail = unmatched.length > 0 ? ` · bez pary: ${unmatched.join(', ')}` : '';
    return `Nieobecni: ${absent}, spóźnieni: ${late}${tail}`;
  }

  return {
    absentSet,
    togglePresent,
    presentStudents,
    pullFromVulcan,
  };
}
