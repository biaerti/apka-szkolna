// Tryb "Audio" panelu - czytanki z lektorem puszczane nad multipodrecznikiem.
// Stan odtwarzacza trzyma Panel (useCzytankaPlayer), tu jest tylko widok:
// odtwarzacz u gory i lista pogrupowana po lekcjach podrecznika.
// Klawisze (w Panel.tsx): spacja = pauza/odtworz, strzalki = -10 s / +10 s.

import { useMemo } from 'react';
import { CZYTANKI, grupujWgLekcji } from '../../data/czytanki';
import { formatCzasu, type CzytankaPlayer } from '../czytanki/useCzytankaPlayer';

export function PanelCzytanki({ player }: { player: CzytankaPlayer }) {
  const grupy = useMemo(() => grupujWgLekcji(CZYTANKI), []);
  const { current, playing, loading, currentTime, duration, error } = player;

  return (
    <section className="flex min-h-0 flex-1 flex-col p-3">
      <div className="mb-3 rounded-lg bg-gray-800 p-3">
        <p className="truncate text-sm font-semibold text-white">{current?.title ?? 'Wybierz czytankę z listy'}</p>
        <p className="mt-0.5 truncate text-xs text-gray-400">
          {current
            ? `Lekcja ${current.lekcja} · s. ${current.pages}${current.author ? ` · ${current.author}` : ''}`
            : 'Spacja - pauza, strzałki - 10 s w tył / w przód'}
        </p>

        <div
          className={`mt-3 h-1.5 rounded-full bg-gray-700 ${duration ? 'cursor-pointer' : ''}`}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            player.seekTo((e.clientX - rect.left) / rect.width);
          }}
        >
          <div
            className="h-1.5 rounded-full bg-accent-500"
            style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
          />
        </div>
        <div className="mt-1 flex justify-between text-[11px] tabular-nums text-gray-500">
          <span>{formatCzasu(currentTime)}</span>
          <span>{loading ? 'wczytuję...' : formatCzasu(duration)}</span>
        </div>

        <div className="mt-2 flex gap-2">
          <button type="button" disabled={!current || loading} onClick={player.toggle} className="min-w-[5.5rem] rounded-md bg-accent-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent-700 disabled:opacity-40">
            {playing ? 'Pauza' : 'Odtwórz'}
          </button>
          <button type="button" disabled={!current} onClick={() => player.seekBy(-10)} className="rounded-md bg-gray-700 px-3 py-1.5 text-xs text-gray-200 hover:bg-gray-600 disabled:opacity-40">-10 s</button>
          <button type="button" disabled={!current} onClick={() => player.seekBy(10)} className="rounded-md bg-gray-700 px-3 py-1.5 text-xs text-gray-200 hover:bg-gray-600 disabled:opacity-40">+10 s</button>
          <button type="button" disabled={!current} onClick={player.stop} className="ml-auto rounded-md px-2 py-1.5 text-xs text-gray-400 hover:bg-gray-700 hover:text-gray-200 disabled:opacity-40">Stop</button>
        </div>
        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {grupy.map((g) => (
          <div key={g.lekcja} className="mb-3">
            <p className="mb-1 px-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              <span className="text-gray-300">{g.lekcja}.</span> {g.temat}
            </p>
            {g.czytanki.map((c) => {
              const wybrana = current?.id === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => (wybrana ? player.toggle() : void player.play(c))}
                  className={`mb-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left ${wybrana ? 'bg-accent-600 text-white' : 'bg-gray-800 text-gray-200 hover:bg-gray-700'}`}
                >
                  <svg viewBox="0 0 16 16" width={12} height={12} aria-hidden className="shrink-0" fill="currentColor">
                    {wybrana && playing ? (
                      <>
                        <rect x={3.5} y={2.5} width={3} height={11} rx={0.6} />
                        <rect x={9.5} y={2.5} width={3} height={11} rx={0.6} />
                      </>
                    ) : (
                      <path d="M4 2.6v10.8l9-5.4z" />
                    )}
                  </svg>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{c.title}</span>
                    <span className={`block truncate text-xs ${wybrana ? 'text-indigo-100' : 'text-gray-400'}`}>
                      s. {c.pages}{c.author ? ` · ${c.author}` : ''}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
