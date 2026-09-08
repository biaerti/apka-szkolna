import { describe, expect, it } from 'vitest';
import { chargeRatePerSecond } from './useNoiseMeter';

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
