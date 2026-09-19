import { describe, expect, it } from 'vitest';
import { nextSelection } from './useSalaSelection';

const P1 = { column: 'P' as const, row: 1, side: 1 as const };
const L2 = { column: 'L' as const, row: 2, side: 2 as const };

describe('nextSelection (tryb Rozsadz)', () => {
  it('pierwszy tap w miejsce tylko zaznacza', () => {
    expect(nextSelection(null, { kind: 'place', pos: P1, occupantId: 's1' })).toEqual({
      selection: { kind: 'place', pos: P1, studentId: 's1' },
    });
  });

  it('miejsce zajete -> inne miejsce: siedzacy sie przenosi', () => {
    const r = nextSelection({ kind: 'place', pos: P1, studentId: 's1' }, { kind: 'place', pos: L2, occupantId: 's2' });
    expect(r).toEqual({ selection: null, move: { type: 'seat', studentId: 's1', pos: L2 } });
  });

  it('miejsce puste -> miejsce zajete: siedzacy idzie na puste', () => {
    const r = nextSelection({ kind: 'place', pos: P1 }, { kind: 'place', pos: L2, occupantId: 's2' });
    expect(r).toEqual({ selection: null, move: { type: 'seat', studentId: 's2', pos: P1 } });
  });

  it('dwa puste miejsca przenosza zaznaczenie', () => {
    expect(nextSelection({ kind: 'place', pos: P1 }, { kind: 'place', pos: L2 })).toEqual({
      selection: { kind: 'place', pos: L2 },
    });
  });

  it('to samo zajete miejsce drugi raz zwalnia je', () => {
    const r = nextSelection({ kind: 'place', pos: P1, studentId: 's1' }, { kind: 'place', pos: P1, occupantId: 's1' });
    expect(r).toEqual({ selection: null, move: { type: 'unseat', studentId: 's1' } });
  });

  it('miejsce -> uczen z listy sadza go tam', () => {
    const r = nextSelection({ kind: 'place', pos: P1 }, { kind: 'student', studentId: 's3' });
    expect(r).toEqual({ selection: null, move: { type: 'seat', studentId: 's3', pos: P1 } });
  });

  it('uczen z listy -> miejsce sadza go tam', () => {
    const r = nextSelection({ kind: 'student', studentId: 's3' }, { kind: 'place', pos: L2, occupantId: 's2' });
    expect(r).toEqual({ selection: null, move: { type: 'seat', studentId: 's3', pos: L2 } });
  });

  it('ten sam uczen drugi raz odznacza', () => {
    expect(nextSelection({ kind: 'student', studentId: 's3' }, { kind: 'student', studentId: 's3' })).toEqual({ selection: null });
  });
});
