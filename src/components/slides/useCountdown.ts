// Hook stopera slajdu "task". Odswieza co 250ms, ale liczy uplyw czasu
// na podstawie Date.now() (patrz src/lib/timer.ts), zeby nie dryfowal.

import { useEffect, useReducer, useRef } from 'react';
import { createTimerState, timerReducer } from '../../lib/timer';

export function useCountdown(totalSec: number) {
  const [state, dispatch] = useReducer(timerReducer, totalSec, createTimerState);
  const totalSecRef = useRef(totalSec);

  useEffect(() => {
    if (totalSecRef.current === totalSec) return;
    totalSecRef.current = totalSec;
    dispatch({ type: 'setTotal', totalSec });
  }, [totalSec]);

  useEffect(() => {
    if (!state.running) return;
    const interval = setInterval(() => {
      dispatch({ type: 'tick', now: Date.now() });
    }, 250);
    return () => clearInterval(interval);
  }, [state.running]);

  return {
    remainingSec: state.remainingSec,
    running: state.running,
    finished: state.finished,
    start: () => dispatch({ type: 'start', now: Date.now() }),
    pause: () => dispatch({ type: 'pause', now: Date.now() }),
    reset: () => dispatch({ type: 'reset' }),
  };
}
