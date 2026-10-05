import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../data/store';
import { addDays, toDateKey, weekDays } from '../lib/dates';
import { Button } from '../components/ui/Button';
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
  const rangeLabel = `${days[0].toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' })} - ${days[4].toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' })}`;
  const currentWeek = toDateKey(days[0]) === toDateKey(weekDays(now)[0]);

  return (
    <div className="mx-auto max-w-[104rem]">
      <div className="mb-5 flex flex-col gap-4 border-b border-gray-200 pb-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-950">Plan lekcji</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-600">Wybierz dział i temat przy konkretnej godzinie, a potem przejdź prosto do obecności. Ten sam temat wybrany ponownie dostanie „cz. 2”.</p>
        </div>
        <div className="flex flex-col items-start gap-2 xl:items-end">
          <div className="text-left text-xs text-gray-500 xl:text-right">
            <p>{updatedAt ? `VULCAN: zaktualizowano ${new Date(updatedAt).toLocaleString('pl-PL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}` : 'VULCAN: jeszcze nie pobrano'}</p>
            {refreshState === 'error' && <p className="text-red-600">Otwórz plan w VULCANIE i spróbuj ponownie.</p>}
            {refreshState === 'missing' && <p className="text-amber-700">Nie widzę dodatku lub otwartej karty VULCANA.</p>}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={refreshFromVulcan} disabled={refreshState === 'loading'}>{refreshState === 'loading' ? 'Pobieram…' : 'Aktualizuj z VULCANA'}</Button>
            <Link to="/plan"><Button variant="secondary">Edytuj stały plan</Button></Link>
          </div>
        </div>
      </div>

      <WazneInfoPasek />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => setAnchor((date) => addDays(date, -7))} aria-label="Poprzedni tydzień">
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m10 3-5 5 5 5" /></svg>
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setAnchor(new Date())} disabled={currentWeek}>Dzisiaj</Button>
          <Button variant="secondary" size="sm" onClick={() => setAnchor((date) => addDays(date, 7))} aria-label="Następny tydzień">
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 3 5 5-5 5" /></svg>
          </Button>
        </div>
        <p className="text-sm font-semibold capitalize text-gray-800">{rangeLabel}</p>
      </div>

      <WeekPlanner anchor={anchor} now={now} classes={classes} lessons={lessons} periods={periods} timetable={timetable} vulcanLessons={vulcanLessons} setLessonProgress={setLessonProgress} />
    </div>
  );
}
