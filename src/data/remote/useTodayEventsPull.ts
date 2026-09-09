// Odswiezanie dzisiejszych zdarzen kola z chmury.
//
// Apka webowa i plywajacy panel to dwa osobne okna (panel chodzi w powloce
// desktopowej), kazde z wlasnym store. Zeby pamiec "kto juz dzis odpowiadal"
// byla wspolna - a o to chodzi w kole na lekcji i w panelu - trzeba co jakis
// czas zajrzec do chmury po zdarzenia zapisane po drugiej stronie.
//
// Odswiezamy tylko dzisiejszy dzien (patrz pullTodayRecapEvents) i tylko tam,
// gdzie kolo naprawde stoi na ekranie. Bez chmury (tryb "tylko ta przegladarka")
// hook nic nie robi.

import { useEffect } from 'react';
import { isSupabaseConfigured } from '../supabase';
import { pullTodayRecapEvents } from './sync';

/** Co ile odswiezac. Losowanie zdarza sie raz na kilka minut - 15 s w zupelnosci wystarcza. */
const INTERVAL_MS = 15000;

export function useTodayEventsPull(intervalMs: number = INTERVAL_MS): void {
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    let stopped = false;
    function tick() {
      if (!stopped && document.visibilityState !== 'hidden') void pullTodayRecapEvents();
    }
    tick();
    const timer = window.setInterval(tick, intervalMs);
    // Powrot do okna to najlepszy moment na odswiezenie - nauczyciel wlasnie
    // przelaczyl sie z drugiego narzedzia.
    window.addEventListener('focus', tick);
    document.addEventListener('visibilitychange', tick);
    return () => {
      stopped = true;
      window.clearInterval(timer);
      window.removeEventListener('focus', tick);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [intervalMs]);
}
