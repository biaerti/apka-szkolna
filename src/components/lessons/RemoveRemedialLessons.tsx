import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useStore } from '../../data/store';
import { REMEDIAL_SECTION } from '../../data/remedial';

/**
 * Wyrownawcze i "Moj polski od zera" to osobne toki (zakladki obok klas na
 * ekranie Lekcje), a nie dzial rocznika. Usuwa dawne lekcje-zaslepki z dzialu
 * "Wyrównawcze", ktore apka wstawiala kazdemu rocznikowi. Usuniecie idzie
 * przez sklep, wiec synchronizacja skasuje je tez w chmurze.
 */
export function RemoveRemedialLessons() {
  const lessons = useStore((state) => state.lessons);
  const removeLesson = useStore((state) => state.removeLesson);
  const { pathname } = useLocation();
  const done = useRef(false);

  useEffect(() => {
    if (done.current || pathname.startsWith('/panel') || lessons.length === 0) return;
    done.current = true;
    for (const lesson of lessons) {
      if (lesson.dzial === REMEDIAL_SECTION) removeLesson(lesson.id);
    }
  }, [lessons, pathname, removeLesson]);

  return null;
}
