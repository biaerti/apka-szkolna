// Czysta funkcja liczaca diff miedzy ostatnio zsynchronizowanym stanem kolekcji
// a jej biezacym stanem. Uzywana przez sync.ts do wysylania tylko zmienionych
// wierszy (upsert) i usuwania tych, ktorych juz nie ma (delete).

export type Snapshot = Map<string, string>;

export interface DiffResult<T> {
  upserts: T[];
  deletes: string[];
}

/** Buduje snapshot (id -> JSON.stringify(wiersz)) z listy wierszy. */
export function buildSnapshot<T extends { id: string }>(rows: T[]): Snapshot {
  const map: Snapshot = new Map();
  for (const row of rows) {
    map.set(row.id, JSON.stringify(row));
  }
  return map;
}

/**
 * Liczy roznice miedzy poprzednim snapshotem a biezacym stanem kolekcji.
 * - upserts: wiersze nowe lub o zmienionej (wg JSON.stringify) tresci.
 * - deletes: id wierszy obecnych w poprzednim snapshocie, a nieobecnych teraz.
 */
export function diffCollections<T extends { id: string }>(prevSnapshot: Snapshot, next: T[]): DiffResult<T> {
  const upserts: T[] = [];
  const nextIds = new Set<string>();

  for (const row of next) {
    nextIds.add(row.id);
    const serialized = JSON.stringify(row);
    if (prevSnapshot.get(row.id) !== serialized) {
      upserts.push(row);
    }
  }

  const deletes: string[] = [];
  for (const id of prevSnapshot.keys()) {
    if (!nextIds.has(id)) {
      deletes.push(id);
    }
  }

  return { upserts, deletes };
}
