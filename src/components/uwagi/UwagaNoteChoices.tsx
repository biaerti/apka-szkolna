// Wybor tresci uwagi: gotowe zdania jednym klikiem plus pole na wlasne.
//
// Uwage wpisuje sie w trakcie lekcji, miedzy jednym a drugim zadaniem - dlatego
// gotowce (UWAGA_PRESETS) sa pierwsze i konczy je jedno klikniecie. Wlasna
// tresc jest pod nimi, dla sytuacji, ktorych lista nie przewiduje.
//
// Ten sam komponent stoi na trzech ekranach o roznych tlach (kolo powtorzeniowe
// w jasnym modalu, prezentacja i plywajacy panel na ciemnym) - stad `tone`.

import { useState } from 'react';
import { UWAGA_PRESETS } from '../../lib/uwagi';

export interface UwagaNoteChoicesProps {
  /** Nazwisko ucznia do naglowka - zeby na ciemnym ekranie bylo widac, komu wpisujemy. */
  title?: string;
  tone?: 'light' | 'dark';
  onPick: (note: string) => void;
  onCancel: () => void;
}

export function UwagaNoteChoices({ title, tone = 'light', onPick, onCancel }: UwagaNoteChoicesProps) {
  const [wlasna, setWlasna] = useState('');
  const dark = tone === 'dark';

  const presetClass = dark
    ? 'w-full rounded-md bg-gray-800 px-2.5 py-1.5 text-left text-sm text-gray-100 hover:bg-gray-700'
    : 'w-full rounded-md border border-gray-200 px-3 py-2 text-left text-sm text-gray-800 hover:bg-gray-100';
  const inputClass = dark
    ? 'min-w-0 flex-1 rounded-md bg-gray-800 px-2 py-1.5 text-sm text-gray-100 placeholder:text-gray-500'
    : 'min-w-0 flex-1 rounded-md border border-gray-300 px-2 py-1.5 text-sm text-gray-800';

  return (
    <div className="space-y-1.5">
      {title && (
        <p className={`text-sm font-medium ${dark ? 'text-gray-200' : 'text-gray-900'}`}>{title}</p>
      )}
      {UWAGA_PRESETS.map((preset) => (
        <button key={preset} type="button" onClick={() => onPick(preset)} className={presetClass}>
          {preset}
        </button>
      ))}
      <div className="flex items-center gap-1.5 pt-1">
        <input
          value={wlasna}
          onChange={(e) => setWlasna(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && wlasna.trim()) {
              e.preventDefault();
              onPick(wlasna.trim());
            }
          }}
          placeholder="Własna treść"
          className={inputClass}
        />
        <button
          type="button"
          disabled={!wlasna.trim()}
          onClick={() => onPick(wlasna.trim())}
          className="shrink-0 rounded-md bg-amber-600 px-2.5 py-1.5 text-sm font-medium text-white hover:bg-amber-500 disabled:opacity-40"
        >
          Zapisz
        </button>
      </div>
      <button
        type="button"
        onClick={onCancel}
        className={`text-xs ${dark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-800'}`}
      >
        Anuluj
      </button>
    </div>
  );
}
