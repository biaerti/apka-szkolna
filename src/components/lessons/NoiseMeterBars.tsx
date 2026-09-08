// Dwa pionowe paski na lewym boku prezentacji: aktualny halas i ladowanie
// karnej kartkowki. Kreska na pasku halasu to prog - powyzej niej kartkowka
// sie laduje, im glosniej tym szybciej. Klik w paski otwiera ustawienia.

import { useState } from 'react';
import { DB_MIN, DB_MAX, NoiseMeter } from './useNoiseMeter';

function frac(db: number): number {
  return Math.max(0, Math.min(1, (db - DB_MIN) / (DB_MAX - DB_MIN)));
}

export function NoiseMeterBars({ meter }: { meter: NoiseMeter }) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  if (!meter.supported) return null;

  // Wylaczony: dyskretny wlacznik na srodku lewej krawedzi.
  if (!meter.running) {
    return (
      <button
        type="button"
        onClick={() => meter.start()}
        aria-label="Włącz decybelomierz"
        title={meter.error ?? 'Włącz decybelomierz'}
        className="fixed left-0 top-1/2 z-40 -translate-y-1/2 rounded-r-md bg-gray-800/60 px-1.5 py-4 text-[11px] tracking-wide text-gray-300 hover:bg-gray-800/90"
        style={{ writingMode: 'vertical-rl' }}
      >
        {meter.error ? 'Brak mikrofonu' : 'Decybele'}
      </button>
    );
  }

  const levelFrac = frac(meter.level);
  const threshFrac = frac(meter.threshold);
  const over = meter.level >= meter.threshold;
  const levelColor = over ? 'bg-red-500' : meter.level >= meter.threshold - 5 ? 'bg-amber-400' : 'bg-emerald-500';

  return (
    <div
      className="fixed left-2 top-1/2 z-40 -translate-y-1/2 select-none"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-end gap-1.5" style={{ height: '55vh' }}>
        {/* Pasek aktualnego halasu z kreska progu */}
        <button
          type="button"
          onClick={() => setSettingsOpen(!settingsOpen)}
          aria-label="Ustawienia decybelomierza"
          className="relative h-full w-5 overflow-hidden rounded-full bg-gray-800/70"
        >
          <div
            className={`absolute inset-x-0 bottom-0 ${levelColor}`}
            style={{ height: `${levelFrac * 100}%`, transition: 'height 80ms linear' }}
          />
          <div
            className="absolute inset-x-0 h-0.5 bg-white shadow-[0_0_4px_rgba(255,255,255,0.9)]"
            style={{ bottom: `${threshFrac * 100}%` }}
          />
        </button>

        {/* Pasek ladowania kartkowki */}
        <button
          type="button"
          onClick={() => setSettingsOpen(!settingsOpen)}
          aria-label="Ustawienia decybelomierza"
          className={`relative h-full w-5 overflow-hidden rounded-full bg-gray-800/70 ${meter.full ? 'animate-pulse ring-2 ring-red-500' : ''}`}
        >
          <div
            className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-amber-500 to-red-600"
            style={{ height: `${meter.charge * 100}%`, transition: 'height 150ms linear' }}
          />
        </button>
      </div>

      <div className="mt-1.5 flex flex-col items-start gap-0.5 text-[11px] leading-tight text-gray-400">
        <span>{Math.round(meter.level)} dB</span>
        {meter.full ? (
          <span className="animate-pulse font-bold text-red-400">KARTKÓWKA!</span>
        ) : (
          <span>kartkówka {Math.round(meter.charge * 100)}%</span>
        )}
      </div>

      {settingsOpen && (
        <div className="absolute left-14 top-0 z-50 w-56 rounded-lg bg-gray-900/95 p-3 text-sm text-gray-200 shadow-xl">
          <label className="block text-xs text-gray-400">
            Próg: {meter.threshold} dB
            <input
              type="range"
              min={DB_MIN + 5}
              max={DB_MAX - 5}
              value={meter.threshold}
              onChange={(e) => meter.setThreshold(Number(e.target.value))}
              className="mt-1 w-full"
            />
          </label>
          <label className="mt-2 block text-xs text-gray-400">
            Kalibracja (dopasuj do miernika): {meter.calibration - 100 >= 0 ? '+' : ''}
            {meter.calibration - 100} dB
            <input
              type="range"
              min={70}
              max={130}
              value={meter.calibration}
              onChange={(e) => meter.setCalibration(Number(e.target.value))}
              className="mt-1 w-full"
            />
          </label>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => meter.resetCharge()}
              className="rounded-md bg-gray-800 px-2 py-1 text-xs hover:bg-gray-700"
            >
              Wyzeruj kartkówkę
            </button>
            <button
              type="button"
              onClick={() => {
                setSettingsOpen(false);
                meter.stop();
              }}
              className="rounded-md bg-gray-800 px-2 py-1 text-xs hover:bg-gray-700"
            >
              Wyłącz
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
