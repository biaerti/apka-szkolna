import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useStore } from '../../data/store';
import { buildRemedialMaterials } from '../../data/remedial';
import { allGrades, lessonsOfGrade } from '../../lib/grade';
import { findOldLesson } from './refreshMaterials';

/**
 * Wyrównawcze są wspólnym działem, więc muszą istnieć w każdym roczniku bez
 * ręcznego wstawiania z menu materiałów. Postęp nadal zapisuje się osobno dla
 * każdej klasy, tak jak przy pozostałych lekcjach rocznika.
 */
export function EnsureRemedialMaterials() {
  const classes = useStore((state) => state.classes);
  const lessons = useStore((state) => state.lessons);
  const addLesson = useStore((state) => state.addLesson);
  const { pathname } = useLocation();
  const done = useRef(false);

  useEffect(() => {
    if (done.current || pathname.startsWith('/panel') || classes.length === 0 || lessons.length === 0) return;
    done.current = true;
    for (const grade of allGrades(classes)) {
      const bundle = buildRemedialMaterials(grade, []);
      for (const lesson of bundle.lessons) {
        const current = lessonsOfGrade(useStore.getState().lessons, grade);
        if (!findOldLesson(current, lesson)) addLesson(lesson);
      }
    }
  }, [addLesson, classes, lessons.length, pathname]);

  return null;
}
