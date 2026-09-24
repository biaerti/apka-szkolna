// Gotowe materialy odswiezaja sie same: po starcie apki (dane z chmury juz sa
// w store - AuthGate renderuje App dopiero po initialSync) kazdy rocznik
// porownuje swoje lekcje z wersja w kodzie i podmienia te, dla ktorych kod sie
// zmienil (useReadyMaterials.autoRefresh). Nauczyciel nie musi klikac
// "Odswiez wstawione materialy" - menu zostaje tylko dla lekcji edytowanych
// recznie w edytorze, ktorych automat celowo nie rusza.
//
// Raz na zaladowanie strony i nie w plywajacym panelu (/panel) - panel to drugie
// okno z tym samym kontem, dwa automaty naraz dopisalyby pytania podwojnie.

import { useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useStore } from '../../data/store';
import { allGrades, classesOfGrade, lessonsOfGrade } from '../../lib/grade';
import { useReadyMaterials } from './useReadyMaterials';

function AutoRefreshGrade({ grade }: { grade: string }) {
  const lessons = useStore((s) => s.lessons);
  const classes = useStore((s) => s.classes);
  const classIds = useMemo(() => classesOfGrade(classes, grade).map((c) => c.id), [classes, grade]);
  const gradeLessons = useMemo(() => lessonsOfGrade(lessons, grade), [lessons, grade]);
  const ready = useReadyMaterials(grade, classIds, gradeLessons);
  const done = useRef(false);

  useEffect(() => {
    if (done.current || gradeLessons.length === 0) return;
    done.current = true;
    ready.autoRefresh();
    // Celowo raz: kolejne zmiany lekcji to juz edycje nauczyciela albo samego automatu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gradeLessons.length]);

  return null;
}

export function AutoRefreshMaterials() {
  const classes = useStore((s) => s.classes);
  const grades = useMemo(() => allGrades(classes), [classes]);
  const { pathname } = useLocation();
  if (pathname.startsWith('/panel')) return null;
  return (
    <>
      {grades.map((grade) => (
        <AutoRefreshGrade key={grade} grade={grade} />
      ))}
    </>
  );
}
