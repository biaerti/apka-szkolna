// Frekwencja z telefonu do VULCANA.
//
// Telefon (Sala -> Obecnosc) sprawdza obecnosc i wstawia do chmury zlecenie
// (tabela vulcan_frekwencja, migracja 0030). W chmurze sa tylko id uczniow i
// statusy - nazwiska sa zaszyfrowane (patrz studentCrypto.ts), wiec komputer
// z dodatkiem "pomocnik VULCAN" dokleja je lokalnie, dopiero w paczce dla
// dodatku. Dodatek otwiera lekcje w drzewie, w razie potrzeby ja tworzy
// (temat z telefonu), ustawia obecnosc i klika Zapisz. Wynik wraca do
// zlecenia (status + krotki komunikat bez nazwisk), a lista klasy odczytana
// z VULCANA poprawia numery z dziennika w apce.

import type { SchoolClass, Student } from '../data/types';
import type { AttendanceStatus } from './attendance';
import { vulcanClassName } from './vulcan';

export type FrekwencjaJobStatus = 'pending' | 'sending' | 'done' | 'error';

export interface FrekwencjaMark {
  studentId: string;
  status: AttendanceStatus;
}

export interface FrekwencjaJob {
  id: string;
  date: string;
  period: number;
  classId: string;
  marks: FrekwencjaMark[];
  topic: string;
  status: FrekwencjaJobStatus;
  message?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface FrekwencjaJobRow {
  id: string;
  date: string;
  period: number;
  class_id: string | null;
  marks: FrekwencjaMark[] | null;
  topic: string | null;
  status: string;
  message: string | null;
  created_at: string;
  updated_at?: string | null;
}

export function frekwencjaJobId(date: string, period: number, classId: string): string {
  return `vf-${date}-${period}-${classId}`;
}

export function rowToFrekwencjaJob(row: FrekwencjaJobRow): FrekwencjaJob {
  const status = (['pending', 'sending', 'done', 'error'] as const).find((s) => s === row.status) ?? 'pending';
  return {
    id: row.id,
    date: row.date,
    period: row.period,
    classId: row.class_id ?? '',
    marks: Array.isArray(row.marks) ? row.marks : [],
    topic: row.topic ?? '',
    status,
    ...(row.message ? { message: row.message } : {}),
    createdAt: row.created_at,
    ...(row.updated_at ? { updatedAt: row.updated_at } : {}),
  };
}

/** Nazwa pozycji w legendzie VULCANA ("Zmień frekwencję" -> tabela Sym./Nazwa). */
export type VulcanLegendName = 'obecność' | 'nieobecność' | 'spóźnienie' | 'nauczanie indywidualne';

export function legendNameFor(status: AttendanceStatus): VulcanLegendName {
  return status === 'absent' ? 'nieobecność' : status === 'late' ? 'spóźnienie' : 'obecność';
}

/** Paczka dla dodatku - zyje tylko lokalnie (postMessage), nigdy w chmurze. */
export interface VulcanFrekwencjaTransfer {
  version: 1;
  kind: 'frekwencja';
  jobId: string;
  date: string;
  period: number;
  vulcanClassName: string;
  topic: string;
  students: { number: number; lastName: string; firstName: string; legend: VulcanLegendName }[];
  background: true;
}

/**
 * Nauczanie indywidualne: uczen wylaczony w apce (nie ma go na liscie w
 * telefonie), ale wciaz w dzienniku klasy. Rozpoznajemy go po notatce ucznia
 * ("nauczanie indywidualne", "NI") - bot wpisuje mu wtedy "ni".
 */
export function isIndividual(st: Pick<Student, 'active' | 'note'>): boolean {
  return !st.active && /indywidualn|^\s*ni\s*$/i.test(st.note ?? '');
}

export function buildFrekwencjaTransfer(job: FrekwencjaJob, schoolClass: SchoolClass, students: Student[]): VulcanFrekwencjaTransfer {
  const statusById = new Map(job.marks.map((m) => [m.studentId, m.status]));
  return {
    version: 1,
    kind: 'frekwencja',
    jobId: job.id,
    date: job.date,
    period: job.period,
    vulcanClassName: vulcanClassName(schoolClass.name),
    topic: job.topic.trim(),
    students: students
      .filter((st) => st.classId === schoolClass.id && ((st.active && statusById.has(st.id)) || isIndividual(st)))
      .sort((a, b) => a.number - b.number)
      .map((st) => ({
        number: st.number,
        lastName: st.lastName,
        firstName: st.firstName,
        legend: isIndividual(st) ? 'nauczanie indywidualne' : legendNameFor(statusById.get(st.id) ?? 'present'),
      })),
    background: true,
  };
}

function norm(value: string): string {
  return value.replace(/\s+/g, ' ').trim().toLocaleLowerCase('pl');
}

/**
 * Czy wiersz VULCANA ("Staroń Oliwia Julia" - z drugim imieniem, czasem
 * uciety wielokropkiem) to ten uczen. Nazwisko + pierwsze imie od poczatku.
 */
export function rowMatchesStudent(rowName: string, st: Pick<Student, 'firstName' | 'lastName'>): boolean {
  const row = norm(rowName);
  const wanted = norm(`${st.lastName} ${st.firstName}`);
  return row === wanted || row.startsWith(`${wanted} `);
}

export interface RosterRow {
  number: number;
  name: string;
}

export interface RosterCheck {
  /** Uczen apki ma w VULCANIE inny numer - do poprawienia. */
  numberFixes: { studentId: string; from: number; to: number }[];
  /** Numery z VULCANA, ktorych nie ma w apce (nazwiska zostaja lokalnie). */
  missingInApp: RosterRow[];
  /** Aktywni uczniowie apki, ktorych nie ma w VULCANIE. */
  missingInVulcan: Student[];
}

/** Porownuje liste klasy z VULCANA z aktywnymi uczniami klasy w apce. */
export function checkRoster(rows: RosterRow[], classStudents: Student[]): RosterCheck {
  const active = classStudents.filter((st) => st.active);
  // Nauczanie indywidualne: wylaczony w apce, ale jest w VULCANIE - to nie brak.
  const known = [...active, ...classStudents.filter(isIndividual)];
  const used = new Set<string>();
  const numberFixes: RosterCheck['numberFixes'] = [];
  const missingInApp: RosterRow[] = [];
  for (const row of rows) {
    const st = known.find((candidate) => !used.has(candidate.id) && rowMatchesStudent(row.name, candidate));
    if (!st) {
      missingInApp.push(row);
      continue;
    }
    used.add(st.id);
    if (Number.isInteger(row.number) && row.number > 0 && row.number !== st.number) {
      numberFixes.push({ studentId: st.id, from: st.number, to: row.number });
    }
  }
  const missingInVulcan = active.filter((st) => !used.has(st.id));
  return { numberFixes, missingInApp, missingInVulcan };
}

/** Krotki komunikat do chmury - same numery, bez nazwisk. */
export function rosterSummary(check: RosterCheck): string {
  const parts: string[] = [];
  if (check.numberFixes.length > 0) parts.push(`poprawione numery: ${check.numberFixes.map((f) => `${f.from}→${f.to}`).join(', ')}`);
  if (check.missingInApp.length > 0) parts.push(`w VULCANIE, brak w apce: nr ${check.missingInApp.map((r) => r.number).join(', ')}`);
  if (check.missingInVulcan.length > 0) parts.push(`w apce, brak w VULCANIE: nr ${check.missingInVulcan.map((s) => s.number).join(', ')}`);
  return parts.join('; ');
}
