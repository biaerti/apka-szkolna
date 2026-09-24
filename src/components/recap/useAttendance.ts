// Obecnosc przy kole: kto jest dzis nieobecny w klasie. Nieobecnosci siedza w
// store (Absence) i sa WSPOLNE dla calego dnia i wszystkich kol - zaznaczenie
// w plywajacym panelu wypisuje ucznia takze z kola powtorzeniowego w apce
// webowej i z szuflady kola w prezentacji (drugie okno dociaga je z chmury,
// patrz pullTodayRecapEvents). Pula losowania liczy sie wprost z obecnych.

import { useEffect, useMemo } from 'react';
import { useStore } from '../../data/store';
import type { Student } from '../../data/types';
import { absentOnDay, attendanceForLesson } from '../../lib/attendance';
import { toDateKey } from '../../lib/dates';
import { classPeriodToday } from '../../lib/timetable';
import { matchVulcanAttendance, requestVulcanAttendance } from '../../lib/vulcanAttendance';

/** Co ile automat dociaga frekwencje z VULCANA, gdy kolo jest otwarte. */
const AUTO_PULL_MS = 60_000;
/** Kolo w prezentacji i kolo powtorzeniowe moga byc zamontowane naraz - jeden odczyt na raz wystarczy. */
let lastAutoPullAt = 0;

export function useAttendance(classStudents: Student[], classId: string) {
  const absences = useStore((s) => s.absences);
  const setAbsent = useStore((s) => s.setAbsent);
  const date = toDateKey(new Date());

  const { timetable, periods } = useStore.getState();
  // Godzina tej klasy dzis - trwajaca albo ostatnia, ktora sie zaczela (kolo
  // po dzwonku nadal widzi nieobecnych z tej lekcji).
  const period = classPeriodToday(timetable, periods, classId, new Date());
  const absentSet = useMemo(() => absentOnDay(absences, classId, date, period), [absences, classId, date, period]);

  function togglePresent(studentId: string) {
    const { timetable, periods } = useStore.getState();
    setAbsent({
      studentId,
      classId,
      date,
      absent: !absentSet.has(studentId),
      period: classPeriodToday(timetable, periods, classId, new Date()),
    });
  }

  const presentStudents = useMemo(
    () => classStudents.filter((st) => !absentSet.has(st.id)),
    [classStudents, absentSet],
  );

  /**
   * Dociaga frekwencje z otwartej karty VULCANA (dodatek Chrome) i nanosi ja
   * na dzisiejsza godzine tej klasy - nieobecni od razu wypadaja z kola.
   * `auto` = cichy odczyt automatu: tylko po nazwisku i tylko zmiany.
   * Zwraca krotkie podsumowanie do pokazania przy przycisku.
   */
  async function pullFromVulcan(auto = false): Promise<string> {
    const { timetable, periods, setAttendance, absences } = useStore.getState();
    const lessonPeriod = classPeriodToday(timetable, periods, classId, new Date());
    if (lessonPeriod === undefined) {
      throw new Error('Wg planu ta klasa nie ma dziś lekcji - nie wiem, którą godzinę odczytać.');
    }
    const rows = await requestVulcanAttendance(lessonPeriod);
    const { matched, unmatched } = matchVulcanAttendance(rows, classStudents, { byNameOnly: auto });
    const before = attendanceForLesson(absences, classId, date, lessonPeriod);
    for (const item of matched) {
      if (auto && (before.get(item.studentId) ?? 'present') === item.status) continue;
      setAttendance({ studentId: item.studentId, classId, date, period: lessonPeriod, status: item.status });
    }
    const absent = matched.filter((m) => m.status === 'absent').length;
    const late = matched.filter((m) => m.status === 'late').length;
    const tail = unmatched.length > 0 ? ` · bez pary: ${unmatched.join(', ')}` : '';
    return `Nieobecni: ${absent}, spóźnieni: ${late}${tail}`;
  }

  // Automat: frekwencja wpisana w VULCANIE (recznie albo z telefonu) sama
  // trafia na kolo - przy otwarciu kola i potem co minute. Bez dodatku albo
  // bez karty VULCANA odczyt po cichu sie nie udaje i nic sie nie zmienia.
  useEffect(() => {
    if (!classId || classStudents.length === 0) return;
    function tick() {
      if (Date.now() - lastAutoPullAt < AUTO_PULL_MS / 2) return;
      lastAutoPullAt = Date.now();
      pullFromVulcan(true).catch(() => undefined);
    }
    tick();
    const timer = window.setInterval(tick, AUTO_PULL_MS);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId, classStudents.length]);

  return {
    absentSet,
    togglePresent,
    presentStudents,
    pullFromVulcan,
  };
}
