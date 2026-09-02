import { NavLink, Outlet } from 'react-router-dom';
import clsx from 'clsx';

const NAV_ITEMS = [
  { to: '/', label: 'Pulpit', end: true },
  { to: '/klasy', label: 'Klasy' },
  { to: '/pytania', label: 'Pytania' },
  { to: '/powtorka', label: 'Powtórka' },
  { to: '/lekcje', label: 'Lekcje' },
  { to: '/kalendarz', label: 'Kalendarz' },
  { to: '/statystyki', label: 'Statystyki' },
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
      </aside>
      <main className="flex-1 overflow-y-auto px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
}
