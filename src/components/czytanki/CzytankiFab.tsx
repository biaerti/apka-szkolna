// Pływający przycisk "Czytanki" - odtwarzanie mp3 z lektorem czytanek z podręcznika.
// Widoczny w całej aplikacji (montowany w AppShell), nie na ekranach prezentacji.

import { useEffect, useMemo, useRef, useState } from 'react';
import { CZYTANKI, grupujWgLekcji } from '../../data/czytanki';
import { formatCzasu, useCzytankaPlayer } from './useCzytankaPlayer';

function SpeakerIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={20}
      height={20}
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 6.2h2.4L8 3.4v9.2L4.4 9.8H2z" fill="currentColor" stroke="none" />
      <path d="M10.6 5.4a4 4 0 0 1 0 5.2M12.6 3.6a7 7 0 0 1 0 8.8" />
    </svg>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" width={18} height={18} aria-hidden="true" className={className} fill="currentColor">
      <path d="M4 2.6v10.8l9-5.4z" />
    </svg>
  );
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" width={18} height={18} aria-hidden="true" className={className} fill="currentColor">
      <rect x={3.5} y={2.5} width={3} height={11} rx={0.6} />
      <rect x={9.5} y={2.5} width={3} height={11} rx={0.6} />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={16}
      height={16}
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
    >
      <path d="M3 3l10 10M13 3 3 13" />
    </svg>
  );
}

function Seek10Icon({ direction, className }: { direction: 'back' | 'forward'; className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={18}
      height={18}
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={direction === 'back' ? { transform: 'scaleX(-1)' } : undefined}
    >
      <path d="M9.5 2.5A5.5 5.5 0 1 1 4 5.8" />
      <path d="M3.5 2.5v3.3h3.3" />
    </svg>
  );
}

export function CzytankiFab() {
  const [open, setOpen] = useState(false);
  const player = useCzytankaPlayer();
  const { current, playing, loading, currentTime, duration, error } = player;
  const grupy = useMemo(() => grupujWgLekcji(CZYTANKI), []);
  const panelRef = useRef<HTMLDivElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    function onClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      // Klik w sam przycisk obsluguje jego wlasny onClick (toggle) - nie zamykaj tu,
      // bo mousedown+click zamknelyby i zaraz otworzyly panel z powrotem.
      if (fabRef.current?.contains(target)) return;
      if (panelRef.current && !panelRef.current.contains(target)) setOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [open]);

  return (
    <>
      <button
        ref={fabRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Zamknij czytanki' : 'Otwórz czytanki'}
        aria-expanded={open}
        className={`fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-md transition-colors ${
          playing ? 'bg-accent-600 hover:bg-accent-700' : 'bg-gray-900 hover:bg-gray-800'
        }`}
      >
        <SpeakerIcon />
        {playing && (
          <span className="absolute right-1 top-1 h-2 w-2 animate-pulse rounded-full bg-white" aria-hidden="true" />
        )}
      </button>

      {open && (
        <div
          ref={panelRef}
          className="fixed inset-x-0 bottom-0 z-50 max-h-[70vh] overflow-y-auto rounded-t-lg border border-gray-200 bg-white shadow-xl sm:inset-x-auto sm:bottom-20 sm:right-4 sm:w-80 sm:rounded-lg"
        >
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <p className="text-sm font-semibold text-gray-900">Czytanki</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Zamknij"
              className="text-gray-400 hover:text-gray-600"
            >
              <CloseIcon />
            </button>
          </div>

          {current && (
            <div className="border-b border-gray-200 px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-medium text-gray-900">{current.title}</p>
                <button
                  type="button"
                  onClick={player.stop}
                  aria-label="Zatrzymaj"
                  className="shrink-0 text-gray-400 hover:text-gray-600"
                >
                  <CloseIcon />
                </button>
              </div>

              <div
                className="mt-3 h-1.5 cursor-pointer rounded-full bg-gray-200"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  player.seekTo((e.clientX - rect.left) / rect.width);
                }}
              >
                <div
                  className="h-1.5 rounded-full bg-accent-600"
                  style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                />
              </div>

              <div className="mt-1 flex items-center justify-between text-xs text-gray-400">
                <span>{formatCzasu(currentTime)}</span>
                <span>{loading ? 'wczytuję...' : formatCzasu(duration)}</span>
              </div>

              <div className="mt-2 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => player.seekBy(-10)}
                  aria-label="Cofnij 10 sekund"
                  className="text-gray-500 hover:text-gray-800"
                >
                  <Seek10Icon direction="back" />
                </button>
                <button
                  type="button"
                  onClick={player.toggle}
                  aria-label={playing ? 'Pauza' : 'Odtwórz'}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-white hover:bg-gray-800"
                >
                  {playing ? <PauseIcon /> : <PlayIcon />}
                </button>
                <button
                  type="button"
                  onClick={() => player.seekBy(10)}
                  aria-label="Przewiń 10 sekund"
                  className="text-gray-500 hover:text-gray-800"
                >
                  <Seek10Icon direction="forward" />
                </button>
              </div>
            </div>
          )}

          {error && <p className="border-b border-gray-200 px-4 py-2 text-xs text-red-600">{error}</p>}

          {grupy.map((g) => (
            <div key={g.lekcja}>
              <p className="bg-gray-50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                {g.lekcja}. {g.temat}
              </p>
              <ul className="divide-y divide-gray-100">
                {g.czytanki.map((czytanka) => (
                  <li key={czytanka.id}>
                    <button
                      type="button"
                      onClick={() => void player.play(czytanka)}
                      className={`flex w-full items-start justify-between gap-3 px-4 py-3 text-left hover:bg-gray-50 ${
                        current?.id === czytanka.id ? 'bg-accent-50' : ''
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-gray-900">{czytanka.title}</span>
                        {czytanka.author && (
                          <span className="block truncate text-xs text-gray-500">{czytanka.author}</span>
                        )}
                      </span>
                      <span className="shrink-0 text-xs text-gray-400">str. {czytanka.pages}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
