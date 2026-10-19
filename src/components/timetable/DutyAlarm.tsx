// Alarm dyzuru: od dzwonka na przerwe z dyzurem (grafik w src/data/dyzury.ts)
// u gory ekranu miga bursztynowy pasek "Idź na dyżur!" z miejscem - na kazdym
// ekranie apki, tez w prezentacji. Bez dzwieku, to tylko dla nauczyciela.
// Znika po kliknieciu "Idę" albo z koncem przerwy. Klikniete alarmy pamietamy
// w localStorage, zeby po odswiezeniu strony nie wracaly.

import { useState } from 'react';
import { dyzuryNa } from '../../data/dyzury';
import { useStore } from '../../data/store';
import { dutyAlarm } from '../../lib/dyzury';
import { useNow } from './useNow';

const DISMISSED_KEY = 'apka-szkolna-dyzur-alarm-ok';

function readDismissed(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(DISMISSED_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((k): k is string => typeof k === 'string') : [];
  } catch {
    return [];
  }
}

function saveDismissed(keys: string[]) {
  try {
    localStorage.setItem(DISMISSED_KEY, JSON.stringify(keys.slice(-20)));
  } catch {
    // tryb prywatny - alarm po prostu wroci po odswiezeniu
  }
}

export function DutyAlarm() {
  const periods = useStore((s) => s.periods);
  const now = useNow(5000);
  const [dismissed, setDismissed] = useState(readDismissed);

  const alarm = dutyAlarm(dyzuryNa(now), periods, now);
  if (!alarm || dismissed.includes(alarm.key)) return null;
  const key = alarm.key;

  function ok() {
    const next = [...dismissed, key];
    setDismissed(next);
    saveDismissed(next);
  }

  return (
    <div
      role="alert"
      // Prezentacja przewija slajdy klikiem w polowe ekranu - klik w pasek nie moze tam dojsc.
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      className="fixed left-1/2 top-3 z-[100] flex -translate-x-1/2 animate-miga items-center gap-4 rounded-xl border-2 px-5 py-3 text-amber-950 shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
    >
      <div className="leading-tight">
        <div className="text-2xl font-bold">Idź na dyżur!</div>
        <div className="text-base font-semibold">{alarm.duty.place}</div>
      </div>
      <button
        type="button"
        onClick={ok}
        className="rounded-lg bg-amber-700 px-4 py-2 text-lg font-semibold text-white hover:bg-amber-800"
      >
        Idę
      </button>
    </div>
  );
}
