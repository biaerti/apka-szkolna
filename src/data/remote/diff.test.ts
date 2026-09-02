import { describe, expect, it } from 'vitest';
import { buildSnapshot, diffCollections } from './diff';

interface Row {
  id: string;
  value: string;
}

describe('buildSnapshot', () => {
  it('tworzy mape id -> JSON.stringify(wiersz)', () => {
    const rows: Row[] = [
      { id: 'a', value: '1' },
      { id: 'b', value: '2' },
    ];
    const snap = buildSnapshot(rows);
    expect(snap.size).toBe(2);
    expect(snap.get('a')).toBe(JSON.stringify(rows[0]));
    expect(snap.get('b')).toBe(JSON.stringify(rows[1]));
  });

  it('pusta lista -> pusta mapa', () => {
    expect(buildSnapshot([]).size).toBe(0);
  });
});

describe('diffCollections', () => {
  it('wszystko nowe, gdy poprzedni snapshot jest pusty', () => {
    const next: Row[] = [{ id: 'a', value: '1' }, { id: 'b', value: '2' }];
    const result = diffCollections(new Map(), next);
    expect(result.upserts).toEqual(next);
    expect(result.deletes).toEqual([]);
  });

  it('brak zmian -> brak upsertow i deletow', () => {
    const rows: Row[] = [{ id: 'a', value: '1' }];
    const snap = buildSnapshot(rows);
    const result = diffCollections(snap, rows);
    expect(result.upserts).toEqual([]);
    expect(result.deletes).toEqual([]);
  });

  it('zmieniony wiersz trafia do upsertow', () => {
    const prev: Row[] = [{ id: 'a', value: '1' }];
    const snap = buildSnapshot(prev);
    const next: Row[] = [{ id: 'a', value: '2' }];
    const result = diffCollections(snap, next);
    expect(result.upserts).toEqual(next);
    expect(result.deletes).toEqual([]);
  });

  it('nowy wiersz trafia do upsertow', () => {
    const prev: Row[] = [{ id: 'a', value: '1' }];
    const snap = buildSnapshot(prev);
    const next: Row[] = [
      { id: 'a', value: '1' },
      { id: 'b', value: '2' },
    ];
    const result = diffCollections(snap, next);
    expect(result.upserts).toEqual([{ id: 'b', value: '2' }]);
    expect(result.deletes).toEqual([]);
  });

  it('usuniety wiersz trafia do deletes', () => {
    const prev: Row[] = [
      { id: 'a', value: '1' },
      { id: 'b', value: '2' },
    ];
    const snap = buildSnapshot(prev);
    const next: Row[] = [{ id: 'a', value: '1' }];
    const result = diffCollections(snap, next);
    expect(result.upserts).toEqual([]);
    expect(result.deletes).toEqual(['b']);
  });

  it('mieszany przypadek: upsert nowego, zmiana istniejacego, usuniecie innego', () => {
    const prev: Row[] = [
      { id: 'a', value: '1' },
      { id: 'b', value: '2' },
      { id: 'c', value: '3' },
    ];
    const snap = buildSnapshot(prev);
    const next: Row[] = [
      { id: 'a', value: '1' }, // bez zmian
      { id: 'b', value: 'zmienione' }, // zmiana
      { id: 'd', value: 'nowy' }, // nowy
      // 'c' usuniete
    ];
    const result = diffCollections(snap, next);
    expect(result.upserts).toEqual([
      { id: 'b', value: 'zmienione' },
      { id: 'd', value: 'nowy' },
    ]);
    expect(result.deletes).toEqual(['c']);
  });

  it('caly poprzedni stan usuniety, gdy next jest puste', () => {
    const prev: Row[] = [{ id: 'a', value: '1' }];
    const snap = buildSnapshot(prev);
    const result = diffCollections(snap, []);
    expect(result.upserts).toEqual([]);
    expect(result.deletes).toEqual(['a']);
  });
});
