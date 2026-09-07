// Eksport / import calego stanu aplikacji do/z pliku JSON.

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
} from './types';
import { useStore } from './store';

export interface BackupData {
  version: number;
  exportedAt: string;
  classes: SchoolClass[];
  students: Student[];
  questionSets: QuestionSet[];
  questions: Question[];
  lessons: Lesson[];
  recapEvents: RecapEvent[];
  /** Doszlo w wersji 2 backupu - starsze pliki tego pola nie maja. */
  meetings?: Meeting[];
  /** Doszlo w wersji 3 backupu (kartkowki) - starsze pliki tego pola nie maja. */
  quizzes?: Quiz[];
  /** Doszly w wersji 4 backupu (plan lekcji) - starsze pliki tych pol nie maja. */
  periods?: LessonPeriod[];
  timetable?: TimetableEntry[];
  settings: Settings;
}

export function buildBackup(): BackupData {
  const s = useStore.getState();
  return {
    version: 4,
    exportedAt: new Date().toISOString(),
    classes: s.classes,
    students: s.students,
    questionSets: s.questionSets,
    questions: s.questions,
    lessons: s.lessons,
    recapEvents: s.recapEvents,
    meetings: s.meetings,
    quizzes: s.quizzes,
    periods: s.periods,
    timetable: s.timetable,
    settings: s.settings,
  };
}

export function downloadBackup(): void {
  const data = buildBackup();
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const stamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `apka-szkolna-backup-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function isValidBackup(data: unknown): data is BackupData {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  return (
    Array.isArray(d.classes) &&
    Array.isArray(d.students) &&
    Array.isArray(d.questionSets) &&
    Array.isArray(d.questions) &&
    Array.isArray(d.lessons) &&
    Array.isArray(d.recapEvents) &&
    typeof d.settings === 'object' &&
    d.settings !== null
  );
}

export function applyBackup(data: BackupData): void {
  useStore.getState().replaceAll({
    classes: data.classes,
    students: data.students,
    questionSets: data.questionSets,
    questions: data.questions,
    lessons: data.lessons,
    recapEvents: data.recapEvents,
    // Backup sprzed zakladki "Zebrania" nie ma tego pola - wtedy zostawiamy
    // biezace zebrania zamiast kasowac je przy odtwarzaniu starego pliku.
    meetings: data.meetings ?? useStore.getState().meetings,
    // Tak samo backup sprzed zakladki "Kartkowki" - stare pliki nie maja pola.
    quizzes: data.quizzes ?? useStore.getState().quizzes,
    // I backup sprzed zakladki "Plan" - zostawiamy biezace dzwonki i plan.
    periods: data.periods ?? useStore.getState().periods,
    timetable: data.timetable ?? useStore.getState().timetable,
    settings: data.settings,
  });
}

export async function importBackupFromFile(file: File): Promise<void> {
  const text = await file.text();
  const parsed: unknown = JSON.parse(text);
  if (!isValidBackup(parsed)) {
    throw new Error('Plik nie jest poprawnym backupem apki szkolnej.');
  }
  applyBackup(parsed);
}
