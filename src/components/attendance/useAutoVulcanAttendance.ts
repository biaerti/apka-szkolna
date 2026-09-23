import { useEffect, useRef } from 'react';
import { useStore } from '../../data/store';
import { toDateKey } from '../../lib/dates';
import { currentEntry } from '../../lib/timetable';
import { effectiveTimetable } from '../../lib/vulcanPlan';
import { matchVulcanAttendance, requestVulcanAttendance } from '../../lib/vulcanAttendance';

const APP_SOURCE = 'apka-szkolna';
const HELPER_SOURCE = 'vulcan-pomocnik';
const LAST_APPLIED_KEY = 'vulcan-attendance-last-applied';

function lastApplied(): number {
  try {
    return Number(localStorage.getItem(LAST_APPLIED_KEY) || 0);
  } catch {
    return 0;
  }
}

function rememberApplied(changedAt: number): void {
  try {
    localStorage.setItem(LAST_APPLIED_KEY, String(changedAt));
  } catch {
    // Prywatny tryb może blokować localStorage. Sam zapis frekwencji nadal działa.
  }
}

/**
 * Globalna synchronizacja VULCAN -> aplikacja. Działa na każdej trasie,
 * również podczas prezentacji i na kole. Powiadomienie jest tylko sygnałem -
 * źródłem prawdy pozostaje odczytana tabela frekwencji VULCANA.
 */
export function useAutoVulcanAttendance(): void {
  const timer = useRef<number>();
  const newestChange = useRef(0);
  const syncing = useRef(false);

  useEffect(() => {
    async function sync(changedAt: number, attempt = 0): Promise<void> {
      if (changedAt <= lastApplied() || syncing.current) return;
      const state = useStore.getState();
      const now = new Date();
      const lesson = currentEntry(effectiveTimetable(state.timetable, state.vulcanLessons, now), state.periods, now);
      if (!lesson?.classId) return;
      const classId = lesson.classId;
      const classmates = state.students.filter((student) => student.classId === classId && student.active);
      if (classmates.length === 0) return;

      syncing.current = true;
      try {
        const rows = await requestVulcanAttendance(lesson.period);
        const { matched } = matchVulcanAttendance(rows, classmates);
        if (matched.length === 0) throw new Error('Nie udało się dopasować uczniów z frekwencji.');
        const date = toDateKey(new Date());
        for (const item of matched) {
          useStore.getState().setAttendance({
            studentId: item.studentId,
            classId,
            date,
            period: lesson.period,
            status: item.status,
          });
        }
        rememberApplied(changedAt);
      } catch {
        // Tabela ExtJS bywa przebudowywana chwilę po zapisie. Krótkie ponowienia
        // usuwają wyścig bez wymagania drugiego kliknięcia przez nauczyciela.
        if (attempt < 2) {
          window.setTimeout(() => void sync(changedAt, attempt + 1), 1400 * (attempt + 1));
        }
      } finally {
        syncing.current = false;
      }
    }

    function schedule(changedAt: number): void {
      if (!Number.isFinite(changedAt) || changedAt <= lastApplied()) return;
      newestChange.current = Math.max(newestChange.current, changedAt);
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => void sync(newestChange.current), 900);
    }

    function onMessage(event: MessageEvent): void {
      if (event.source !== window || event.data?.source !== HELPER_SOURCE) return;
      if (event.data.type !== 'VULCAN_ATTENDANCE_CHANGED') return;
      schedule(Number(event.data.detail?.changedAt || Date.now()));
    }

    const ping = () => window.postMessage({ source: APP_SOURCE, type: 'VULCAN_BRIDGE_PING' }, '*');
    const onVisibility = () => {
      if (document.visibilityState === 'visible') ping();
    };
    window.addEventListener('message', onMessage);
    window.addEventListener('focus', ping);
    document.addEventListener('visibilitychange', onVisibility);
    ping();
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
      window.removeEventListener('message', onMessage);
      window.removeEventListener('focus', ping);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);
}
