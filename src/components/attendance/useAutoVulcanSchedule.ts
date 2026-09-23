import { useEffect } from 'react';
import { useStore } from '../../data/store';
import type { VulcanScheduleEntry } from '../../lib/vulcan';
import { vulcanLessonsFromSchedule } from '../../lib/vulcanPlan';

const APP_SOURCE = 'apka-szkolna';
const HELPER_SOURCE = 'vulcan-pomocnik';
/** Zastepstwo dochodzi zwykle rano albo na przerwie - 2 min w zupelnosci wystarcza. */
const INTERVAL_MS = 2 * 60 * 1000;

/**
 * Plan dnia z VULCANA -> store (i chmura). Co chwile prosi dodatek o odczyt
 * drzewa lekcji z otwartej karty dziennika (VULCAN_SCHEDULE_REQUEST) i kazdy
 * wynik - takze reczny "Pobierz z VULCANA" w Dzienniku - zapisuje jako
 * VulcanLesson na odczytane dni. Plywajacy panel nie ma dodatku, wiec dostaje
 * to z chmury (pullTodayRecapEvents).
 *
 * Bez dodatku albo bez otwartej karty VULCANA nic sie nie dzieje - zostaje plan
 * tygodniowy. Odczytane sa tylko dni rozwiniete w drzewie VULCANA.
 */
export function useAutoVulcanSchedule(): void {
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.source !== window || !event.data || event.data.source !== HELPER_SOURCE) return;
      if (event.data.type !== 'VULCAN_SCHEDULE_RESULT') return;
      const entries = event.data.detail?.entries;
      if (!Array.isArray(entries) || entries.length === 0) return;
      const state = useStore.getState();
      const lessons = vulcanLessonsFromSchedule(entries as VulcanScheduleEntry[], state.classes);
      const dates = new Set(lessons.map((l) => l.date));
      for (const date of dates) {
        state.setVulcanDay(
          date,
          lessons.filter((l) => l.date === date),
        );
      }
    }
    function request() {
      if (document.visibilityState === 'hidden') return;
      window.postMessage({ source: APP_SOURCE, type: 'VULCAN_SCHEDULE_REQUEST' }, '*');
    }
    window.addEventListener('message', onMessage);
    // Chwila na zaladowanie app-bridge.js dodatku.
    const first = window.setTimeout(request, 3000);
    const timer = window.setInterval(request, INTERVAL_MS);
    window.addEventListener('focus', request);
    return () => {
      window.removeEventListener('message', onMessage);
      window.clearTimeout(first);
      window.clearInterval(timer);
      window.removeEventListener('focus', request);
    };
  }, []);
}
