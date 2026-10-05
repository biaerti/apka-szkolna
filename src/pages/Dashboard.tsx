import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../data/store';
import { addDays, toDateKey, weekDays } from '../lib/dates';
import { WeekPlanner } from '../components/dashboard/WeekPlanner';
import { useNow } from '../components/timetable/useNow';
import { WazneInfoPasek } from '../components/wazneinfo/WazneInfoAlarm';

type RefreshState = 'idle' | 'loading' | 'ready' | 'error' | 'missing';
const UPDATED_KEY = 'apka-szkolna-vulcan-plan-updated-at';

export function Dashboard() {
  const classes = useStore((s) => s.classes);
  const lessons = useStore((s) => s.lessons);
  const periods = useStore((s) => s.periods);
  const timetable = useStore((s) => s.timetable);
  const vulcanLessons = useStore((s) => s.vulcanLessons);
  const setLessonProgress = useStore((s) => s.setLessonProgress);
  // Zegar co 30 s: podswietlenie trwajacej lekcji i chipy "teraz" (dyzur, obiad).
  const now = useNow(30_000);
  const [anchor, setAnchor] = useState(() => new Date());
  const [refreshState, setRefreshState] = useState<RefreshState>('idle');
  const [updatedAt, setUpdatedAt] = useState(() => localStorage.getItem(UPDATED_KEY));

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.source !== window || event.data?.source !== 'vulcan-pomocnik') return;
      if (event.data.type === 'VULCAN_BRIDGE_READY') setRefreshState((state) => state === 'missing' ? 'idle' : state);
      if (event.data.type === 'VULCAN_SCHEDULE_RESULT') {
        const stamp = new Date().toISOString();
        localStorage.setItem(UPDATED_KEY, stamp);
        setUpdatedAt(stamp);
        setRefreshState('ready');
      }
      if (event.data.type === 'VULCAN_SCHEDULE_ERROR') setRefreshState('error');
    }
    window.addEventListener('message', onMessage);
    window.postMessage({ source: 'apka-szkolna', type: 'VULCAN_BRIDGE_PING' }, '*');
    return () => window.removeEventListener('message', onMessage);
  }, []);

  function refreshFromVulcan() {
    setRefreshState('loading');
    window.postMessage({ source: 'apka-szkolna', type: 'VULCAN_SCHEDULE_REQUEST' }, '*');
    window.setTimeout(() => setRefreshState((state) => state === 'loading' ? 'missing' : state), 4500);
  }

  const days = weekDays(anchor);
  const rangeLabel = `${days[0].getDate()}.${String(days[0].getMonth() + 1).padStart(2, '0')} - ${days[4].getDate()}.${String(days[4].getMonth() + 1).padStart(2, '0')}`;
  const currentWeek = toDateKey(days[0]) === toDateKey(weekDays(now)[0]);

  return (
    <div className="mx-auto max-w-[104rem]">
      <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-950">Plan lekcji</h1>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => setAnchor((date) => addDays(date, -7))} aria-label="Poprzedni tydzień" className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900">
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m10 3-5 5 5 5" /></svg>
          </button>
          <span className="min-w-[9.5rem] text-center text-sm font-medium tabular-nums text-gray-700">{rangeLabel}</span>
          <button type="button" onClick={() => setAnchor((date) => addDays(date, 7))} aria-label="Następny tydzień" className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900">
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 3 5 5-5 5" /></svg>
          </button>
          {!currentWeek && (
            <button type="button" onClick={() => setAnchor(new Date())} className="ml-1 rounded-md px-2 py-1 text-xs font-medium text-accent-700 hover:bg-accent-50">
              wróć do dziś
            </button>
          )}
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
          {refreshState === 'error' && <span className="text-red-600">Otwórz plan w VULCANIE i spróbuj ponownie.</span>}
          {refreshState === 'missing' && <span className="text-amber-700">Nie widzę dodatku lub otwartej karty VULCANA.</span>}
          <button type="button" onClick={refreshFromVulcan} disabled={refreshState === 'loading'} className="rounded-md px-2 py-1 font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50" title={updatedAt ? `Ostatnio: ${new Date(updatedAt).toLocaleString('pl-PL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}` : 'Jeszcze nie pobrano'}>
            {refreshState === 'loading' ? 'Pobieram z VULCANA…' : 'Odśwież z VULCANA'}
          </button>
          <Link to="/plan" className="rounded-md px-2 py-1 font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900">Edytuj stały plan</Link>
        </div>
      </div>

      <WazneInfoPasek />

      <WeekPlanner anchor={anchor} now={now} classes={classes} lessons={lessons} periods={periods} timetable={timetable} vulcanLessons={vulcanLessons} setLessonProgress={setLessonProgress} />
    </div>
  );
}
