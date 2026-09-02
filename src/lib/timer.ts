// Czysta logika stopera (odliczanie w dol) uzywana przez slajd "task".
// Liczy na podstawie Date.now() (znaczniki czasu), a nie licznika tickow,
// zeby licznik nie dryfowal przy nieregularnych odpaleniach setInterval.

export interface TimerState {
  totalSec: number;
  running: boolean;
  finished: boolean;
  /** Czas (epoch ms), w ktorym stoper zostal ostatnio wystartowany/wznowiony. */
  startedAt: number | null;
  /** Suma milisekund odliczonych przed biezacym uruchomieniem. */
  accumulatedMs: number;
  /** Ile sekund pozostalo (zaokraglone w gore), pochodna pozostalych pol. */
  remainingSec: number;
}

export type TimerAction =
  | { type: 'start'; now: number }
  | { type: 'pause'; now: number }
  | { type: 'reset' }
  | { type: 'tick'; now: number }
  | { type: 'setTotal'; totalSec: number };

export function createTimerState(totalSec: number): TimerState {
  return {
    totalSec,
    running: false,
    finished: false,
    startedAt: null,
    accumulatedMs: 0,
    remainingSec: totalSec,
  };
}

function elapsedMs(state: TimerState, now: number): number {
  if (state.running && state.startedAt !== null) {
    return state.accumulatedMs + Math.max(0, now - state.startedAt);
  }
  return state.accumulatedMs;
}

function remainingSecFor(state: TimerState, now: number): number {
  const totalMs = state.totalSec * 1000;
  const remainingMs = totalMs - elapsedMs(state, now);
  return Math.max(0, Math.ceil(remainingMs / 1000));
}

/** Formatuje sekundy jako mm:ss, np. 65 -> "01:05". */
export function formatMmSs(totalSeconds: number): string {
  const clamped = Math.max(0, Math.round(totalSeconds));
  const mm = Math.floor(clamped / 60)
    .toString()
    .padStart(2, '0');
  const ss = (clamped % 60).toString().padStart(2, '0');
  return `${mm}:${ss}`;
}

export function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case 'start': {
      if (state.running || state.finished) return state;
      return { ...state, running: true, startedAt: action.now };
    }
    case 'pause': {
      if (!state.running) return state;
      const accumulatedMs = elapsedMs(state, action.now);
      return {
        ...state,
        running: false,
        startedAt: null,
        accumulatedMs,
        remainingSec: remainingSecFor({ ...state, running: false, accumulatedMs }, action.now),
      };
    }
    case 'reset': {
      return createTimerState(state.totalSec);
    }
    case 'setTotal': {
      return createTimerState(action.totalSec);
    }
    case 'tick': {
      if (!state.running) return state;
      const totalMs = state.totalSec * 1000;
      const elapsed = elapsedMs(state, action.now);
      if (elapsed >= totalMs) {
        return {
          ...state,
          running: false,
          finished: true,
          startedAt: null,
          accumulatedMs: totalMs,
          remainingSec: 0,
        };
      }
      return { ...state, remainingSec: remainingSecFor(state, action.now) };
    }
    default:
      return state;
  }
}
