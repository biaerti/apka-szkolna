import { describe, expect, it } from 'vitest';
import { advanceCharge, chargeRatePerSecond, ChargeState } from './useNoiseMeter';

function simulate(steps: Array<{ over: number; seconds: number; paused?: boolean }>): ChargeState {
  let s: ChargeState = { charge: 0, overTime: 0, belowTime: 0 };
  for (const step of steps) {
    for (let t = 0; t < step.seconds; t += 0.1) {
      s = advanceCharge(s, step.over, 0.1, step.paused ?? false);
    }
  }
  return s;
}

describe('chargeRatePerSecond', () => {
  it('przy +10 dB nad progiem laduje pelna kartkowke w ~60 s', () => {
    expect(1 / chargeRatePerSecond(10)).toBeCloseTo(60, 0);
  });

  it('lekko nad progiem laduje wyraznie wolniej niz mocno nad progiem', () => {
    const light = chargeRatePerSecond(2);
    const heavy = chargeRatePerSecond(15);
    expect(light).toBeGreaterThan(0);
    expect(heavy / light).toBeGreaterThan(10);
  });

  it('rosnie monotonicznie z glosnoscia', () => {
    expect(chargeRatePerSecond(5)).toBeLessThan(chargeRatePerSecond(6));
    expect(chargeRatePerSecond(6)).toBeLessThan(chargeRatePerSecond(12));
  });
});

describe('advanceCharge', () => {
  it('nie laduje przez pierwsze 3 s halasu (pojedyncze zdanie nauczyciela)', () => {
    expect(simulate([{ over: 10, seconds: 2.5 }]).charge).toBe(0);
  });

  it('po 3 s ciaglego halasu laduje normalnie', () => {
    const s = simulate([{ over: 10, seconds: 10 }]);
    // 10 s halasu = 3 s rozbiegu + 7 s ladowania przy +10 dB (1/60 na sekunde).
    expect(s.charge).toBeGreaterThan(0.09);
    expect(s.charge).toBeLessThan(0.14);
  });

  it('krotki dip pod prog nie zeruje rozbiegu, dluzsza cisza tak', () => {
    const afterDip = simulate([
      { over: 10, seconds: 2.5 },
      { over: -1, seconds: 0.5 },
      { over: 10, seconds: 1 },
    ]);
    expect(afterDip.charge).toBeGreaterThan(0); // rozbieg przezyl dip

    const afterSilence = simulate([
      { over: 10, seconds: 2.5 },
      { over: -1, seconds: 2 },
      { over: 10, seconds: 2.5 },
    ]);
    expect(afterSilence.charge).toBe(0); // cisza >1 s zresetowala rozbieg
  });

  it('pauza zamraza ladowanie i opadanie', () => {
    const loud = simulate([
      { over: 10, seconds: 10 },
      { over: 10, seconds: 60, paused: true },
    ]);
    const reference = simulate([{ over: 10, seconds: 10 }]);
    expect(loud.charge).toBeCloseTo(reference.charge, 5);

    const quiet = simulate([
      { over: 10, seconds: 10 },
      { over: -5, seconds: 60, paused: true },
    ]);
    expect(quiet.charge).toBeCloseTo(reference.charge, 5);
  });

  it('w ciszy bez pauzy ladunek powoli opada', () => {
    const s = simulate([
      { over: 10, seconds: 10 },
      { over: -5, seconds: 60 },
    ]);
    const reference = simulate([{ over: 10, seconds: 10 }]);
    expect(s.charge).toBeLessThan(reference.charge);
  });
});
