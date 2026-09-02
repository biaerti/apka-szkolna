import { describe, expect, it } from 'vitest';
import { createTimerState, formatMmSs, timerReducer } from './timer';

describe('formatMmSs', () => {
  it('formatuje sekundy jako mm:ss', () => {
    expect(formatMmSs(65)).toBe('01:05');
    expect(formatMmSs(5)).toBe('00:05');
    expect(formatMmSs(600)).toBe('10:00');
    expect(formatMmSs(0)).toBe('00:00');
  });
});

describe('createTimerState', () => {
  it('tworzy stan poczatkowy z pelnym czasem', () => {
    const state = createTimerState(60);
    expect(state).toEqual({
      totalSec: 60,
      running: false,
      finished: false,
      startedAt: null,
      accumulatedMs: 0,
      remainingSec: 60,
    });
  });
});

describe('timerReducer', () => {
  it('start ustawia running i startedAt', () => {
    const state = createTimerState(60);
    const next = timerReducer(state, { type: 'start', now: 1000 });
    expect(next.running).toBe(true);
    expect(next.startedAt).toBe(1000);
  });

  it('start nie dziala ponownie gdy juz dziala', () => {
    const state = timerReducer(createTimerState(60), { type: 'start', now: 1000 });
    const next = timerReducer(state, { type: 'start', now: 5000 });
    expect(next.startedAt).toBe(1000);
  });

  it('tick zmniejsza remainingSec na podstawie uplywu czasu', () => {
    let state = createTimerState(10);
    state = timerReducer(state, { type: 'start', now: 0 });
    state = timerReducer(state, { type: 'tick', now: 3000 });
    expect(state.remainingSec).toBe(7);
  });

  it('tick nie zmienia stanu gdy stoper nie dziala', () => {
    const state = createTimerState(10);
    const next = timerReducer(state, { type: 'tick', now: 5000 });
    expect(next).toEqual(state);
  });

  it('pause zatrzymuje i zapamietuje uplynely czas', () => {
    let state = createTimerState(10);
    state = timerReducer(state, { type: 'start', now: 0 });
    state = timerReducer(state, { type: 'tick', now: 4000 });
    state = timerReducer(state, { type: 'pause', now: 4000 });
    expect(state.running).toBe(false);
    expect(state.startedAt).toBeNull();
    expect(state.accumulatedMs).toBe(4000);
    expect(state.remainingSec).toBe(6);
  });

  it('wznowienie po pauzie liczy dalej od zapamietanego czasu', () => {
    let state = createTimerState(10);
    state = timerReducer(state, { type: 'start', now: 0 });
    state = timerReducer(state, { type: 'pause', now: 3000 });
    state = timerReducer(state, { type: 'start', now: 10000 });
    state = timerReducer(state, { type: 'tick', now: 12000 });
    // 3000ms (przed pauza) + 2000ms (po wznowieniu) = 5000ms uplynelo
    expect(state.remainingSec).toBe(5);
  });

  it('tick po przekroczeniu czasu konczy stoper na 0 i finished=true', () => {
    let state = createTimerState(5);
    state = timerReducer(state, { type: 'start', now: 0 });
    state = timerReducer(state, { type: 'tick', now: 6000 });
    expect(state.finished).toBe(true);
    expect(state.running).toBe(false);
    expect(state.remainingSec).toBe(0);
  });

  it('reset przywraca stan poczatkowy z tym samym totalSec', () => {
    let state = createTimerState(10);
    state = timerReducer(state, { type: 'start', now: 0 });
    state = timerReducer(state, { type: 'tick', now: 6000 });
    state = timerReducer(state, { type: 'reset' });
    expect(state).toEqual(createTimerState(10));
  });

  it('setTotal zmienia calkowity czas i resetuje stan', () => {
    let state = createTimerState(10);
    state = timerReducer(state, { type: 'start', now: 0 });
    state = timerReducer(state, { type: 'setTotal', totalSec: 120 });
    expect(state).toEqual(createTimerState(120));
  });

  it('pause gdy stoper nie dziala nic nie zmienia', () => {
    const state = createTimerState(10);
    const next = timerReducer(state, { type: 'pause', now: 1000 });
    expect(next).toEqual(state);
  });
});
