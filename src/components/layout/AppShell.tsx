import { NavLink, Outlet } from 'react-router-dom';
import clsx from 'clsx';
import { isSupabaseConfigured } from '../../data/supabase';
import { useAuth } from '../../data/auth';
import { useSyncStatus } from '../../data/remote/sync';

// Dokladnie szesc pozycji menu - nauczyciel ma nie byc "milionerem na zakladkach,
// ktorych nie bedzie uzywal". Powtorka, Kalendarz i Statystyki zostaly wpiete w
// inne ekrany (lekcje / klasa ucznia) i nie sa juz osobnymi modulami.
const NAV_ITEMS = [
  { to: '/', label: 'Pulpit', end: true },
  { to: '/klasy', label: 'Klasy' },
  { to: '/lekcje', label: 'Lekcje' },
  { to: '/podrecznik', label: 'Podręcznik' },
  { to: '/zasady/druk', label: 'Zasady' },
  { to: '/ustawienia', label: 'Ustawienia' },
];

export function AppShell() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="flex w-56 shrink-0 flex-col border-r border-gray-200 bg-white">
        <div className="px-4 py-5">
          <p className="text-base font-semibold text-gray-900">Apka szkolna</p>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 px-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                clsx(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive ? 'bg-accent-50 text-accent-700' : 'text-gray-600 hover:bg-gray-100',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-gray-200 py-3">
          <SyncStatusFooter />
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto px-8 py-6">
        <Outlet />
      </main>
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
