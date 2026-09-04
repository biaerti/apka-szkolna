// Warstwa skladowania podrecznikow: pliki PDF trzymamy w IndexedDB, bo
// localStorage nie pomiesci kilkudziesieciu megabajtow. Wydzielone ze strony
// /podrecznik, zeby komponent zmiescil sie w limicie 250 linii, a sama obsluga
// bazy dala sie testowac i podmienic niezaleznie od UI.
//
// Ekstrakcja tekstu z PDF to kolejny etap - NIE jest tu zaimplementowana, ale
// ksztalt rekordu jest gotowy na dopisanie np. `extractedPages` bez ruszania UI.

const DB_NAME = 'apka-szkolna-podreczniki';
const DB_VERSION = 1;
const STORE_NAME = 'pliki';

export interface TextbookRecord {
  id: string;
  name: string;
  size: number;
  addedAt: string;
  blob: Blob;
}

export function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('Nie udało się otworzyć bazy plików.'));
  });
}

export async function listTextbooks(): Promise<TextbookRecord[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).getAll();
    req.onsuccess = () => resolve(req.result as TextbookRecord[]);
    req.onerror = () => reject(req.error ?? new Error('Nie udało się wczytać listy podręczników.'));
  });
}

export function putTextbook(record: TextbookRecord): Promise<void> {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).put(record);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error ?? new Error('Nie udało się zapisać pliku.'));
      }),
  );
}

export function deleteTextbook(id: string): Promise<void> {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error ?? new Error('Nie udało się usunąć pliku.'));
      }),
  );
}

export function newId(): string {
  const cryptoObj = typeof crypto !== 'undefined' ? crypto : undefined;
  if (cryptoObj && typeof cryptoObj.randomUUID === 'function') return cryptoObj.randomUUID();
  return `pdf-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function formatSize(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

