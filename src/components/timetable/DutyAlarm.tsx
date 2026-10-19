// Alarm dyzuru: 3 min przed dzwonkiem na przerwe z dyzurem (grafik w
// src/data/dyzury.ts) gong i duzy bursztynowy pasek u gory ekranu, na kazdym
// ekranie apki, tez w prezentacji. Gong wraca co minute, az nauczyciel kliknie
// "Idę" albo skonczy sie przerwa. Gdy apka jest w tle (np. otwarty VULCAN),
// dodatkowo powiadomienie systemowe. Klikniete alarmy pamietamy w
// localStorage, zeby po odswiezeniu strony nie dzwonily drugi raz.

import { useEffect, useRef, useState } from 'react';
import { dyzuryNa } from '../../data/dyzury';
import { useStore } from '../../data/store';
import { dutyAlarm } from '../../lib/dyzury';
import { formatRemaining } from '../../lib/timetable';
import { useNow } from './useNow';

const DISMISSED_KEY = 'apka-szkolna-dyzur-alarm-ok';
const REPEAT_MS = 60_000;

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
    // tryb prywatny - alarm po prostu zadzwoni jeszcze raz po odswiezeniu
  }
}

let audio: AudioContext | null = null;

function audioContext(): AudioContext | null {
  if (audio) return audio;
  const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  audio = new Ctx();
  return audio;
}

/** Trzy tony w gore, jak szkolny gong. */
function playGong() {
  const ctx = audioContext();
  if (!ctx) return;
  void ctx.resume();
  const t0 = ctx.currentTime + 0.05;
  [660, 830, 990].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    const t = t0 + i * 0.35;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.5, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 1.25);
  });
}

function notify(title: string, body: string) {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
  try {
    new Notification(title, { body, tag: 'dyzur', requireInteraction: true });
  } catch {
    // Android WebView nie ma konstruktora Notification
  }
}

export function DutyAlarm() {
  const periods = useStore((s) => s.periods);
  const now = useNow(5000);
  const [dismissed, setDismissed] = useState(readDismissed);
  const lastRing = useRef<{ key: string; at: number } | null>(null);

  // Przegladarka wpuszcza dzwiek (i pytanie o powiadomienia) dopiero po
  // kliknieciu w strone - przy pierwszym kliknieciu odblokowujemy jedno i drugie.
  useEffect(() => {
    function unlock() {
      void audioContext()?.resume();
      if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
        void Notification.requestPermission();
      }
    }
    window.addEventListener('pointerdown', unlock, { once: true });
    return () => window.removeEventListener('pointerdown', unlock);
  }, []);

  const alarm = dutyAlarm(dyzuryNa(now), periods, now);
  const active = alarm && !dismissed.includes(alarm.key) ? alarm : null;
  const title = active ? (active.phase === 'soon' ? `Dyżur za ${formatRemaining(active.remainingSec)}` : 'Dyżur teraz!') : '';

  useEffect(() => {
    if (!active) return;
    const last = lastRing.current;
    const due = !last || last.key !== active.key || Date.now() - last.at >= REPEAT_MS;
    if (!due) return;
    const firstRing = !last || last.key !== active.key;
    lastRing.current = { key: active.key, at: Date.now() };
    playGong();
    if (firstRing && document.visibilityState !== 'visible') notify(title, active.duty.place);
  }, [active, title]);

  if (!active) return null;

  function ok() {
    if (!active) return;
    const next = [...dismissed, active.key];
    setDismissed(next);
    saveDismissed(next);
  }

  return (
    <div
      role="alert"
      // Prezentacja przewija slajdy klikiem w polowe ekranu - klik w pasek nie moze tam dojsc.
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      className="fixed left-1/2 top-3 z-[100] flex -translate-x-1/2 items-center gap-4 rounded-xl border-2 border-amber-500 bg-amber-100 px-5 py-3 text-amber-950 shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
    >
      <div className="leading-tight">
        <div className="text-2xl font-bold tabular-nums">{title}</div>
        <div className="text-base font-semibold">{active.duty.place}</div>
      </div>
      <button
        type="button"
        onClick={ok}
        className="rounded-lg bg-amber-600 px-4 py-2 text-lg font-semibold text-white hover:bg-amber-700"
      >
        Idę
      </button>
    </div>
  );
}
