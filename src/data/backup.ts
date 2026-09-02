// Eksport / import calego stanu aplikacji do/z pliku JSON.

import type { Lesson, Question, QuestionSet, RecapEvent, SchoolClass, Settings, Student } from './types';
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
  settings: Settings;
}

export function buildBackup(): BackupData {
  const s = useStore.getState();
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    classes: s.classes,
    students: s.students,
    questionSets: s.questionSets,
    questions: s.questions,
    lessons: s.lessons,
    recapEvents: s.recapEvents,
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
