// Silnik synchronizacji store zustand <-> Supabase.
// Komponenty NIE importuja tego pliku bezposrednio (poza AuthGate/AppShell/Settings) -
// korzystaja tylko ze store. Logika diffu jest w diff.ts (czysta, testowana jednostkowo).

import { create } from 'zustand';
import { useStore } from '../store';
import { getSupabase } from '../supabase';
import { buildSnapshot, diffCollections, type Snapshot } from './diff';
import { describeSyncError, extractErrorMessage, type SyncOperation } from './errors';
import {
  classToRow,
  lessonToRow,
  meetingToRow,
  questionSetToRow,
  questionToRow,
  quizToRow,
  recapEventToRow,
  rowToClass,
  rowToLesson,
  rowToMeeting,
  rowToQuestion,
  rowToQuestionSet,
  rowToQuiz,
  rowToRecapEvent,
  rowToSettings,
  rowToStudent,
  settingsToRow,
  studentToRow,
  type ClassRow,
  type LessonRow,
  type MeetingRow,
  type QuestionRow,
  type QuestionSetRow,
  type QuizRow,
  type RecapEventRow,
  type SettingsRow,
  type StudentRow,
} from './mappers';
import {
  periodToRow,
  rowToPeriod,
  rowToTimetableEntry,
  timetableEntryToRow,
  type LessonPeriodRow,
  type TimetableEntryRow,
} from './timetableMappers';
import { DEFAULT_PERIODS, buildSeedTimetable } from '../timetableSeed';
import type {
  Lesson,
  LessonPeriod,
  Meeting,
  Question,
  QuestionSet,
  Quiz,
  RecapEvent,
  SchoolClass,
  Settings,
  Student,
  TimetableEntry,
} from '../types';

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
  meetings: Meeting[];
  quizzes: Quiz[];
  periods: LessonPeriod[];
  timetable: TimetableEntry[];
  settings: Settings;
}

const DEFAULT_SETTINGS: Settings = {
  passesPerMonth: 2,
  hintGivesMinus: true,
  wheelSpinSec: 4,
  plusesForFive: 3,
  plombyForOne: 3,
  reviewQuestionCount: 5,
  answerTimerSec: 30,
  slideFontPercent: 100,
};

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

interface RemoteLoad {
  data: RemoteData;
  /**
   * true, gdy plan lekcji w chmurze byl PUSTY i data.periods/timetable to seed
   * (patrz nizej) - wtedy snapshoty tych kolekcji musza zostac puste, zeby
   * pierwszy syncNow() wyslal seed do chmury zamiast uznac go za juz zapisany.
   */
  timetableSeeded: boolean;
}

async function fetchRemote(): Promise<RemoteLoad> {
  const [
    classRows,
    studentRows,
    questionSetRows,
    questionRows,
    lessonRows,
    recapEventRows,
    meetingRows,
    quizRows,
    periodRows,
    timetableRows,
    settingsRows,
  ] =
    await Promise.all([
      fetchAllRows<ClassRow>('classes'),
      fetchAllRows<StudentRow>('students'),
      fetchAllRows<QuestionSetRow>('question_sets'),
      fetchAllRows<QuestionRow>('questions'),
      fetchAllRows<LessonRow>('lessons'),
      fetchAllRows<RecapEventRow>('recap_events'),
      fetchAllRows<MeetingRow>('meetings'),
      fetchAllRows<QuizRow>('quizzes'),
      fetchAllRows<LessonPeriodRow>('lesson_periods'),
      fetchAllRows<TimetableEntryRow>('timetable_entries'),
      fetchAllRows<SettingsRow>('settings'),
    ]);

  const classes = classRows.map(rowToClass);
  // Plan lekcji doszedl pozniej niz reszta bazy. Po zalogowaniu chmura
  // "wygrywa" (replaceAll), wiec przy pustych tabelach lokalny plan (z
  // migracji store) zniknalby. Dlatego przy PUSTYCH dzwonkach zwracamy domyslne
  // dzwonki i plan nauczyciela zbudowany z klas z chmury (dopasowanie po
  // nazwach) - sync wysle je do chmury przy pierwszej okazji. Warunkiem jest
  // brak dzwonkow, a nie brak wpisow planu: gdy dzwonki juz sa w chmurze, pusty
  // plan znaczy, ze nauczyciel sam go wyczyscil, i nie ma go wskrzeszac.
  const timetableSeeded = periodRows.length === 0;
  return {
    timetableSeeded,
    data: {
      classes,
      students: studentRows.map(rowToStudent),
      questionSets: questionSetRows.map(rowToQuestionSet),
      questions: questionRows.map(rowToQuestion),
      lessons: lessonRows.map(rowToLesson),
      recapEvents: recapEventRows.map(rowToRecapEvent),
      meetings: meetingRows.map(rowToMeeting),
      quizzes: quizRows.map(rowToQuiz),
      periods: timetableSeeded ? DEFAULT_PERIODS : periodRows.map(rowToPeriod),
      timetable: timetableSeeded ? buildSeedTimetable(classes) : timetableRows.map(rowToTimetableEntry),
      settings: settingsRows[0] ? rowToSettings(settingsRows[0]) : DEFAULT_SETTINGS,
    },
  };
}

export async function loadAllFromRemote(): Promise<RemoteData> {
  return (await fetchRemote()).data;
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

type CollectionName =
  | 'classes'
  | 'questionSets'
  | 'students'
  | 'questions'
  | 'lessons'
  | 'recapEvents'
  | 'meetings'
  | 'quizzes'
  | 'periods'
  | 'timetable'
  | 'settings';

// Kolejnosc dla upsertow - rodzice przed dziecmi (zgodnie z FK w 0001_init.sql).
const UPSERT_ORDER: CollectionName[] = [
  'classes',
  'questionSets',
  'students',
  'questions',
  'lessons',
  'recapEvents',
  'meetings',
  'quizzes', // FK do classes - po 'classes'
  'periods',
  'timetable', // FK do classes - po 'classes'
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
  meetings: 'meetings',
  quizzes: 'quizzes',
  periods: 'lesson_periods',
  timetable: 'timetable_entries',
  settings: 'settings',
};

interface StoreSlice {
  classes: SchoolClass[];
  students: Student[];
  questionSets: QuestionSet[];
  questions: Question[];
  lessons: Lesson[];
  recapEvents: RecapEvent[];
  meetings: Meeting[];
  quizzes: Quiz[];
  periods: LessonPeriod[];
  timetable: TimetableEntry[];
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
    case 'meetings':
      return state.meetings.map(meetingToRow);
    case 'quizzes':
      return state.quizzes.map(quizToRow);
    case 'periods':
      return state.periods.map(periodToRow);
    case 'timetable':
      return state.timetable.map(timetableEntryToRow);
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
    meetings: new Map(),
    quizzes: new Map(),
    periods: new Map(),
    timetable: new Map(),
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
      // Zapamietujemy, przy ktorej tabeli i operacji jestesmy - jesli supabase rzuci
      // blad, chcemy pokazac to w komunikacie, a nie tylko "Nieznany blad synchronizacji".
      let failedContext: { table: string; operation: SyncOperation } | null = null;
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
              failedContext = { table: TABLE_NAMES[c], operation: 'upsert' };
              const { error } = await supabase.from(TABLE_NAMES[c]).upsert(batch, { onConflict: 'id' });
              if (error) throw error;
            }
          }

          for (const c of DELETE_ORDER) {
            const ids = diffs[c].deletes;
            for (let i = 0; i < ids.length; i += UPSERT_BATCH_SIZE) {
              const batch = ids.slice(i, i + UPSERT_BATCH_SIZE);
              failedContext = { table: TABLE_NAMES[c], operation: 'delete' };
              const { error } = await supabase.from(TABLE_NAMES[c]).delete().in('id', batch);
              if (error) throw error;
            }
          }

          failedContext = null;

          // Wysylka udana - aktualizujemy snapshoty do stanu w momencie wysylki.
          for (const c of UPSERT_ORDER) {
            snapshots[c] = buildSnapshot(rowsFor(c, state));
          }
        }

        retryAttempt = 0;
        setStatus({ state: 'idle', pending: 0, error: undefined, lastSyncedAt: new Date().toISOString() });
      } catch (err) {
        const message = failedContext
          ? describeSyncError(err, failedContext.table, failedContext.operation)
          : extractErrorMessage(err);
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
function applyRemoteToStore(remote: RemoteLoad): void {
  applyingRemote = true;
  try {
    useStore.getState().replaceAll(remote.data);
  } finally {
    applyingRemote = false;
  }
  const state = useStore.getState();
  for (const c of UPSERT_ORDER) {
    snapshots[c] = buildSnapshot(rowsFor(c, state));
  }
  // Seed planu nie jest w chmurze - pusty snapshot sprawia, ze wyjdzie w
  // pierwszej wysylce (patrz RemoteLoad.timetableSeeded).
  if (remote.timetableSeeded) {
    snapshots.periods = new Map();
    snapshots.timetable = new Map();
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
    return;
  }
  // Od razu wysylamy to, czego chmura jeszcze nie ma (np. seed planu lekcji
  // albo caly stan przegladarki po potwierdzeniu w AuthGate). Gdy roznic nie
  // ma, syncNow tylko odnotuje udana synchronizacje.
  scheduleFlush(0);
}

/**
 * Dociaga z chmury DZISIEJSZE zdarzenia kola i wtapia je w store, bez
 * wysylania czegokolwiek z powrotem.
 *
 * Po co: apka webowa (kolo powtorzeniowe, prezentacja) i plywajacy panel to
 * dwa osobne okna z osobnym store. Bez tego panel nie wiedzialby, kogo kolo
 * powtorzeniowe wylosowalo pol godziny wczesniej - a wlasnie o to chodzi w
 * pamieci "kto juz dzis odpowiadal" (src/lib/recap.ts: answeredOnDay).
 *
 * Bierzemy TYLKO dzisiaj: to jedyny zakres, ktory jest potrzebny do puli kola,
 * a caly dzien to najwyzej kilkadziesiat wierszy.
 *
 * Zasady wtapiania:
 * - zdarzenie, ktorego nie mamy lokalnie, dokladamy;
 * - zdarzenie, ktore mamy lokalnie i ktore BYLO juz wyslane (jest w snapshocie),
 *   a w chmurze go nie ma, kasujemy - ktos cofnal ocene w drugim oknie;
 * - zdarzenia jeszcze niewyslane (poza snapshotem) zostawiamy w spokoju, zeby
 *   odswiezenie nie zjadlo tego, co dopiero czeka na wysylke.
 * Snapshot aktualizujemy punktowo, wiec to wtopienie nie generuje wysylki.
 */
export async function pullTodayRecapEvents(): Promise<void> {
  if (!started || sending || !isOnline()) return;
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const sinceMs = startOfDay.getTime();

  let rows: RecapEventRow[];
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('recap_events')
      .select('*')
      .gte('at', startOfDay.toISOString());
    if (error) throw error;
    rows = (data ?? []) as RecapEventRow[];
  } catch {
    // Odswiezenie w tle - blad sieci nie ma czym straszyc nauczyciela na lekcji.
    return;
  }

  const remote = rows.map(rowToRecapEvent);
  const remoteIds = new Set(remote.map((e) => e.id));
  const local = useStore.getState().recapEvents;
  const localIds = new Set(local.map((e) => e.id));

  const added = remote.filter((e) => !localIds.has(e.id));
  const removedIds = new Set(
    local
      .filter(
        (e) =>
          new Date(e.at).getTime() >= sinceMs &&
          !remoteIds.has(e.id) &&
          snapshots.recapEvents.has(e.id),
      )
      .map((e) => e.id),
  );
  if (added.length === 0 && removedIds.size === 0) return;

  const next = local.filter((e) => !removedIds.has(e.id)).concat(added);
  applyingRemote = true;
  try {
    useStore.setState({ recapEvents: next });
  } finally {
    applyingRemote = false;
  }
  for (const e of added) {
    snapshots.recapEvents.set(e.id, JSON.stringify(recapEventToRow(e)));
  }
  for (const id of removedIds) {
    snapshots.recapEvents.delete(id);
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
  const remote = await fetchRemote();
  const localHasData = useStore.getState().classes.length > 0;

  if (remote.data.classes.length > 0) {
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
  applyRemoteToStore(await fetchRemote());
}
