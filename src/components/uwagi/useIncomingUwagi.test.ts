import { describe, expect, it } from 'vitest';
import type { RecapEvent } from '../../data/types';
import { isIncomingUwaga } from './useIncomingUwagi';

const today = '2026-09-19';
const base: RecapEvent = {
  id: 'e1',
  studentId: 's1',
  classId: 'c1',
  result: 'uwaga',
  note: 'Telefon na lekcji',
  deviceId: 'telefon',
  at: '2026-09-19T09:15:00.000Z',
};

describe('isIncomingUwaga', () => {
  it('uwaga z dzisiaj z innego urzadzenia przechodzi', () => {
    expect(isIncomingUwaga(base, 'komputer', today)).toBe(true);
  });

  it('wlasne urzadzenie, brak deviceId, inny wynik, wpisana albo z innego dnia odpadaja', () => {
    expect(isIncomingUwaga(base, 'telefon', today)).toBe(false);
    expect(isIncomingUwaga({ ...base, deviceId: undefined }, 'komputer', today)).toBe(false);
    expect(isIncomingUwaga({ ...base, result: 'plus' }, 'komputer', today)).toBe(false);
    expect(isIncomingUwaga({ ...base, wpisane: true }, 'komputer', today)).toBe(false);
    expect(isIncomingUwaga(base, 'komputer', '2026-09-18')).toBe(false);
  });
});
