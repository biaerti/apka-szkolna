// Silnik synchronizacji store zustand <-> Supabase.
// Komponenty NIE importuja tego pliku bezposrednio (poza AuthGate/AppShell/Settings) -
// korzystaja tylko ze store. Logika diffu jest w diff.ts (czysta, testowana jednostkowo).

import { create } from 'zustand';
import { useStore } from '../store';
import { getSupabase } from '../supabase';
import { buildSnapshot, diffCollections, type Snapshot } from './diff';
import {
  classToRow,
  lessonToRow,
  questionSetToRow,
  questionToRow,
  recapEventToRow,
  rowToClass,
  rowToLesson,
  rowToQuestion,
  rowToQuestionSet,
  rowToRecapEvent,
  rowToSettings,
  rowToStudent,
  settingsToRow,
  studentToRow,
  type ClassRow,
  type LessonRow,
  type QuestionRow,
  type QuestionSetRow,
  type RecapEventRow,
  type SettingsRow,
  type StudentRow,
} from './mappers';
import type { Lesson, Question, QuestionSet, RecapEvent, SchoolClass, Settings, Student } from '../types';

const PAGE_SIZE = 1000;
const UPSERT_BATCH_SIZE = 500;
const DEBOUNCE_MS = 400;
const RETRY_DELAYS_MS = [2000, 5000, 15000];
const STEADY_RETRY_MS = 30000;

// --- pobieranie calej bazy z chmury -----------------------------------------

export interface RemoteData {
  classes: SchoolClass[];
  students: Student[];
  questionSets: QuestionSet[];
  questions: Question[];
  lessons: Lesson[];
  recapEvents: RecapEvent[];
  settings: Settings;
}

const DEFAULT_SETTINGS: Settings = { passesPerWeek: 2, hintGivesMinus: true, wheelSpinSec: 4 };

async function fetchAllRows<T>(table: string): Promise<T[]> {
  const supabase = getSupabase();
  const out: T[] = [];
  let from = 0;
  for (;;) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    const rows = (data ?? []) as T[];
    out.push(...rows);
    if (rows.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }
  return out;
}

export async function loadAllFromRemote(): Promise<RemoteData> {
  const [classRows, studentRows, questionSetRows, questionRows, lessonRows, recapEventRows, settingsRows] =
    await Promise.all([
      fetchAllRows<ClassRow>('classes'),
      fetchAllRows<StudentRow>('students'),
      fetchAllRows<QuestionSetRow>('question_sets'),
      fetchAllRows<QuestionRow>('questions'),
      fetchAllRows<LessonRow>('lessons'),
      fetchAllRows<RecapEventRow>('recap_events'),
      fetchAllRows<SettingsRow>('settings'),
    ]);

  return {
    classes: classRows.map(rowToClass),
    students: studentRows.map(rowToStudent),
    questionSets: questionSetRows.map(rowToQuestionSet),
    questions: questionRows.map(rowToQuestion),
    lessons: lessonRows.map(rowToLesson),
    recapEvents: recapEventRows.map(rowToRecapEvent),
    settings: settingsRows[0] ? rowToSettings(settingsRows[0]) : DEFAULT_SETTINGS,
  };
}

// --- status synchronizacji (maly store zustand, czytany przez UI) ----------

export interface SyncStatusState {
  mode: 'local' | 'cloud';
  state: 'idle' | 'syncing' | 'error' | 'offline';
  pending: number;
  lastSyncedAt?: string;
  error?: string;
}

export const useSyncStatus = create<SyncStatusState>(() => ({
  mode: 'local',
  state: 'idle',
  pending: 0,
}));

function setStatus(patch: Partial<SyncStatusState>): void {
  useSyncStatus.setState(patch);
}

// --- konfiguracja kolekcji (kolejnosc zaleznosci) ---------------------------

type CollectionName = 'classes' | 'questionSets' | 'students' | 'questions' | 'lessons' | 'recapEvents' | 'settings';

// Kolejnosc dla upsertow - rodzice przed dziecmi (zgodnie z FK w 0001_init.sql).
const UPSERT_ORDER: CollectionName[] = [
  'classes',
  'questionSets',
  'students',
  'questions',
  'lessons',
  'recapEvents',
  'settings',
];
const DELETE_ORDER: CollectionName[] = [...UPSERT_ORDER].reverse();

const TABLE_NAMES: Record<CollectionName, string> = {
  classes: 'classes',
  questionSets: 'question_sets',
  students: 'students',
  questions: 'questions',
  lessons: 'lessons',
  recapEvents: 'recap_events',
  settings: 'settings',
};

interface StoreSlice {
  classes: SchoolClass[];
  students: Student[];
  questionSets: QuestionSet[];
  questions: Question[];
  lessons: Lesson[];
  recapEvents: RecapEvent[];
  settings: Settings;
}

function rowsFor(collection: CollectionName, state: StoreSlice): Array<{ id: string }> {
  switch (collection) {
    case 'classes':
      return state.classes.map(classToRow);
    case 'students':
      return state.students.map(studentToRow);
    case 'questionSets':
      return state.questionSets.map(questionSetToRow);
    case 'questions':
      return state.questions.map(questionToRow);
    case 'lessons':
      return state.lessons.map(lessonToRow);
    case 'recapEvents':
      return state.recapEvents.map(recapEventToRow);
    case 'settings':
      return [settingsToRow(state.settings)];
  }
}

function emptySnapshots(): Record<CollectionName, Snapshot> {
  return {
    classes: new Map(),
    questionSets: new Map(),
    students: new Map(),
    questions: new Map(),
    lessons: new Map(),
    recapEvents: new Map(),
    settings: new Map(),
  };
}

// --- silnik synchronizacji (stan modulu - jedna instancja w aplikacji) -----

let snapshots: Record<CollectionName, Snapshot> = emptySnapshots();
let applyingRemote = false;
let started = false;
let storeUnsubscribe: (() => void) | null = null;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let retryTimer: ReturnType<typeof setTimeout> | null = null;
let sending = false;
let dirtyDuringSend = false;
let retryAttempt = 0;

function clearTimers(): void {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
  if (retryTimer) {
    clearTimeout(retryTimer);
    retryTimer = null;
  }
}

function isOnline(): boolean {
  return typeof navigator === 'undefined' || navigator.onLine !== false;
}

function scheduleFlush(delay = DEBOUNCE_MS): void {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    void syncNow();
  }, delay);
}

function scheduleRetry(): void {
  if (retryTimer) clearTimeout(retryTimer);
  const delay = RETRY_DELAYS_MS[retryAttempt] ?? STEADY_RETRY_MS;
  retryAttempt = Math.min(retryAttempt + 1, RETRY_DELAYS_MS.length);
  retryTimer = setTimeout(() => {
    retryTimer = null;
    void syncNow();
  }, delay);
}

/** Liczy diff dla kazdej kolekcji wzgledem biezacego stanu store. */
function diffAll(state: StoreSlice): Record<CollectionName, ReturnType<typeof diffCollections>> {
  const result = {} as Record<CollectionName, ReturnType<typeof diffCollections>>;
  for (const c of UPSERT_ORDER) {
    result[c] = diffCollections(snapshots[c], rowsFor(c, state));
  }
  return result;
}

/** Glowna funkcja wysylajaca zmiany do Supabase. Jedna operacja naraz (kolejka przez `sending`). */
async function syncNow(): Promise<void> {
  if (!started) return;

  if (sending) {
    dirtyDuringSend = true;
    return;
  }

  if (!isOnline()) {
    setStatus({ state: 'offline' });
    return;
  }

  sending = true;
  try {
    // Petla: jesli zmiany przyszly w trakcie wysylki (dirtyDuringSend), liczymy diff
    // jeszcze raz zamiast planowac osobny debounce - dzieki temu "jedna operacja naraz"
    // nie gubi zmian dosylanych w trakcie biezacej wysylki.
    for (;;) {
      dirtyDuringSend = false;
      try {
        const state = useStore.getState();
        const diffs = diffAll(state);

        let totalPending = 0;
        for (const c of UPSERT_ORDER) {
          totalPending += diffs[c].upserts.length + diffs[c].deletes.length;
        }

        if (totalPending > 0) {
          setStatus({ state: 'syncing', pending: totalPending, error: undefined });

          const supabase = getSupabase();

          for (const c of UPSERT_ORDER) {
            const rows = diffs[c].upserts;
            for (let i = 0; i < rows.length; i += UPSERT_BATCH_SIZE) {
              const batch = rows.slice(i, i + UPSERT_BATCH_SIZE);
              const { error } = await supabase.from(TABLE_NAMES[c]).upsert(batch, { onConflict: 'id' });
              if (error) throw error;
            }
          }

          for (const c of DELETE_ORDER) {
            const ids = diffs[c].deletes;
            for (let i = 0; i < ids.length; i += UPSERT_BATCH_SIZE) {
              const batch = ids.slice(i, i + UPSERT_BATCH_SIZE);
              const { error } = await supabase.from(TABLE_NAMES[c]).delete().in('id', batch);
              if (error) throw error;
            }
          }

          // Wysylka udana - aktualizujemy snapshoty do stanu w momencie wysylki.
          for (const c of UPSERT_ORDER) {
            snapshots[c] = buildSnapshot(rowsFor(c, state));
          }
        }

        retryAttempt = 0;
        setStatus({ state: 'idle', pending: 0, error: undefined, lastSyncedAt: new Date().toISOString() });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Nieznany błąd synchronizacji.';
        setStatus({ state: 'error', error: message });
        scheduleRetry();
        return;
      }

      if (!dirtyDuringSend) break;
    }
  } finally {
    sending = false;
  }
}

function onStoreChange(): void {
  if (applyingRemote || !started) return;
  scheduleFlush(DEBOUNCE_MS);
}

function handleOnline(): void {
  if (!started) return;
  if (useSyncStatus.getState().state === 'offline') {
    setStatus({ state: 'idle' });
  }
  scheduleFlush(0);
}

function handleOffline(): void {
  if (!started) return;
  setStatus({ state: 'offline' });
}

/** Wgrywa dane z chmury do store, bez generowania wysylki (applyingRemote). Aktualizuje snapshoty. */
function applyRemoteToStore(data: RemoteData): void {
  applyingRemote = true;
  try {
    useStore.getState().replaceAll(data);
  } finally {
    applyingRemote = false;
  }
  const state = useStore.getState();
  for (const c of UPSERT_ORDER) {
    snapshots[c] = buildSnapshot(rowsFor(c, state));
  }
}

/** Startuje subskrypcje store -> Supabase. Idempotentne. */
export function startSync(): void {
  if (started) return;
  started = true;
  setStatus({ mode: 'cloud', state: 'idle', pending: 0, error: undefined });
  storeUnsubscribe = useStore.subscribe(onStoreChange);
  if (typeof window !== 'undefined') {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
  }
  if (!isOnline()) {
    setStatus({ state: 'offline' });
  }
}

/** Zatrzymuje synchronizacje (np. przy wylogowaniu). */
export function stopSync(): void {
  started = false;
  clearTimers();
  if (storeUnsubscribe) {
    storeUnsubscribe();
    storeUnsubscribe = null;
  }
  if (typeof window !== 'undefined') {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  }
  sending = false;
  dirtyDuringSend = false;
  retryAttempt = 0;
  snapshots = emptySnapshots();
  setStatus({ mode: 'local', state: 'idle', pending: 0, error: undefined, lastSyncedAt: undefined });
}

/**
 * Wywolywana raz po zalogowaniu (przed startSync). Decyduje, ktora strona wygrywa:
 * - chmura ma dane -> wgrywa je do store (chmura wygrywa), needsUpload: false.
 * - chmura pusta, lokalnie sa dane -> nic nie robi automatycznie, zwraca needsUpload: true
 *   (UI ma zapytac uzytkownika i wywolac startSync() po decyzji - snapshot jest juz pusty,
 *   wiec pierwszy syncNow() i tak wyśle lokalne dane do chmury).
 * - oba puste -> laduje seed lokalnie, needsUpload: false (sync i tak wyśle seed).
 */
export async function initialSync(): Promise<{ needsUpload: boolean }> {
  const remote = await loadAllFromRemote();
  const localHasData = useStore.getState().classes.length > 0;

  if (remote.classes.length > 0) {
    applyRemoteToStore(remote);
    return { needsUpload: false };
  }

  if (localHasData) {
    snapshots = emptySnapshots();
    return { needsUpload: true };
  }

  applyingRemote = true;
  try {
    useStore.getState().resetToSeed();
  } finally {
    applyingRemote = false;
  }
  snapshots = emptySnapshots();
  return { needsUpload: false };
}

/** Pelny push - resetuje snapshoty do pustych i wysyla caly biezacy stan store. */
export async function pushAllToRemote(): Promise<void> {
  snapshots = emptySnapshots();
  await syncNow();
}

/** Pelny pull - nadpisuje store zawartoscia chmury (bez generowania wysylki). */
export async function pullAllFromRemote(): Promise<void> {
  const remote = await loadAllFromRemote();
  applyRemoteToStore(remote);
}
