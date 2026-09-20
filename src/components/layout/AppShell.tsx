import { NavLink, Outlet, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { isSupabaseConfigured } from '../../data/supabase';
import { useAuth } from '../../data/auth';
import { useSyncStatus } from '../../data/remote/sync';
import { CzytankiFab } from '../czytanki/CzytankiFab';
import { UwagiPrzypomnienie, useUwagiDoWpisania } from '../uwagi/UwagiPrzypomnienie';
import { IncomingUwagaToast } from '../uwagi/IncomingUwagaToast';
import { useTodayEventsPull } from '../../data/remote/useTodayEventsPull';

// Krotkie menu - nauczyciel ma nie byc "milionerem na zakladkach, ktorych nie
// bedzie uzywal". Powtorka, Kalendarz i Statystyki zostaly wpiete w inne ekrany
// (lekcje / klasa ucznia) i nie sa juz osobnymi modulami. "Zebrania" to osobna
// pozycja, bo skrypt zebrania z rodzicami nie ma sie gdzie podpiac - nie nalezy
// ani do lekcji, ani do klasy. "Kartkowki" podobnie: kartkowka karna za halas
// i klasowka po dziale to wydarzenia konkretnej klasy, z pytaniami z wielu lekcji.
// "Plan" to tygodniowy plan dzwonkowy nauczyciela - karmi pulpit i zegar na projektorze.
// "Uwagi" to kalendarz tygodnia z uwagami do przepisania do dziennika: uwaga wpisana
// w trakcie lekcji jest przypominajka, a po lekcjach trzeba ja zobaczyc ulozona po
// dniach, a nie rozsypana po uczniach (patrz src/pages/Uwagi.tsx).
// "Dokumenty" to lista wydrukow: zasady lekcji dla dzieci, PSO dla rodzicow,
// plan rozwoju dla dyrektora - jedna zakladka zamiast osobnej na kazdy papier.
const NAV_ITEMS = [
  { to: '/', label: 'Pulpit', end: true },
  { to: '/klasy', label: 'Klasy' },
  { to: '/lekcje', label: 'Lekcje' },
  { to: '/uwagi', label: 'Uwagi' },
  { to: '/kartkowki', label: 'Kartkówki' },
  { to: '/plan', label: 'Plan' },
  { to: '/zebrania', label: 'Zebrania' },
  { to: '/dokumenty', label: 'Dokumenty' },
  { to: '/podstawa', label: 'Podstawa programowa' },
  { to: '/lektury', label: 'Lektury' },
  { to: '/ustawienia', label: 'Ustawienia' },
];

export function AppShell() {
  const doWpisania = useUwagiDoWpisania().length;
  const { pathname } = useLocation();
  // Dzisiejsze zdarzenia z chmury (realtime + polling): uwaga dana z telefonu
  // ma wyskoczyc na komputerze jako popup (IncomingUwagaToast).
  useTodayEventsPull();
  return (
    <div className="flex min-h-screen w-full max-w-full flex-col bg-gray-50 md:flex-row">
      <aside className="flex w-full min-w-0 max-w-full shrink-0 flex-col border-b border-gray-200 bg-white md:w-56 md:border-b-0 md:border-r">
        <div className="px-4 py-3 md:py-5">
          <p className="text-base font-semibold text-gray-900">Apka szkolna</p>
        </div>
        <nav className="app-nav flex min-w-0 max-w-full flex-1 gap-0.5 overflow-x-auto px-2 pb-2 md:flex-col md:overflow-visible md:pb-0">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                clsx(
                  'shrink-0 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive ? 'bg-accent-50 text-accent-700' : 'text-gray-600 hover:bg-gray-100',
                )
              }
            >
              {item.label}
              {item.to === '/uwagi' && doWpisania > 0 && (
                <span className="ml-2 rounded-full bg-amber-100 px-1.5 text-xs font-semibold text-amber-800">{doWpisania}</span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="hidden border-t border-gray-200 py-3 md:block">
          <SyncStatusFooter />
        </div>
      </aside>
      <main className="box-border w-full min-w-0 max-w-full flex-1 overflow-y-auto px-4 py-5 sm:px-6 md:w-auto md:px-8 md:py-6">
        <Outlet />
        <IncomingUwagaToast />
      </main>
      {pathname !== '/dziennik' && <CzytankiFab />}
      <UwagiPrzypomnienie />
    </div>
  );
}

function formatTime(iso?: string): string {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
}

function SyncStatusFooter() {
  if (!isSupabaseConfigured()) {
    return <p className="px-3 text-xs text-gray-400">Dane: tylko ta przeglądarka</p>;
  }
  return <CloudSyncStatusFooter />;
}

function CloudSyncStatusFooter() {
  const { session, signOut } = useAuth();
  const status = useSyncStatus();

  let text: string;
  let textClass = 'text-gray-400';
  if (status.state === 'syncing') {
    text = 'Chmura: zapisywanie...';
  } else if (status.state === 'offline') {
    text = `Chmura: offline, zmiany czekają (${status.pending})`;
  } else if (status.state === 'error') {
    text = `Chmura: błąd - ${status.error ?? 'nieznany błąd'}`;
    textClass = 'text-red-600';
  } else {
    text = status.lastSyncedAt ? `Chmura: zapisano ${formatTime(status.lastSyncedAt)}` : 'Chmura: gotowa';
  }

  return (
    <div className="space-y-1 px-3">
      <p className={clsx('text-xs', textClass)}>{text}</p>
      {session?.user?.email && <p className="truncate text-xs text-gray-400">{session.user.email}</p>}
      <button
        type="button"
        onClick={() => void signOut()}
        className="text-xs font-medium text-accent-700 hover:underline"
      >
        Wyloguj
      </button>
    </div>
  );
}
