// Odczyt frekwencji Z VULCANA do apki (kierunek odwrotny niz vulcan.ts, ktory
// WYSYLA paczke do dziennika). Nauczyciel sprawdza obecnosc w VULCANIE na
// poczatku lekcji, a apka dociaga stamtad, kogo nie ma - kolo na lekcji i
// dziennik maja nieobecnych zaznaczonych od razu, bez drugiego klikania.
//
// Dodatek (vulcan-extension) czyta z otwartej karty VULCANA tabele frekwencji:
// wiersz ucznia + symbol w kolumnie wskazanej godziny. Tu jest czysta logika
// dopasowania tych wierszy do uczniow apki oraz rozmowa z mostkiem
// (postMessage, jak VULCAN_SCHEDULE_REQUEST w Journal.tsx).

import type { Student } from '../data/types';
import type { AttendanceStatus } from './attendance';

/** Wiersz odczytany z tabeli frekwencji VULCANA. */
export interface VulcanGridRow {
  /** Numer z dziennika, jesli tabela go pokazuje. */
  number?: number;
  /** "Nazwisko Imię" - tak, jak stoi w tabeli. */
  name: string;
  /** Symbol z komorki godziny, znormalizowany do malych liter. */
  symbol: string;
}

/**
 * Status apki dla symbolu VULCANA. Nieznany symbol (np. "?" - frekwencja
 * jeszcze niesprawdzona) daje undefined i taki wiersz jest pomijany - lepiej
 * nie ruszac obecnosci, niz zgadywac.
 */
export function statusFromVulcanSymbol(symbol: string): AttendanceStatus | undefined {
  const s = symbol.replace(/\s+/g, '').toLocaleLowerCase('pl');
  if (s === '-' || s === '−' || s === '–' || s === 'nb') return 'absent';
  if (s === 's' || s === 'sp') return 'late';
  if (s === '.' || s === '∙' || s === '•' || s === '●') return 'present';
  // "u" (usprawiedliwiona) i "ns" to tez nieobecnosc na lekcji.
  if (s === 'u' || s === 'ns') return 'absent';
  return undefined;
}

function nameKey(value: string): string {
  return value.replace(/\s+/g, ' ').trim().toLocaleLowerCase('pl');
}

export interface MatchedAttendance {
  studentId: string;
  status: AttendanceStatus;
}

export interface MatchResult {
  matched: MatchedAttendance[];
  /** Wiersze VULCANA bez pasujacego ucznia w apce (np. inna pisownia). */
  unmatched: string[];
}

/**
 * Dopasowuje wiersze z VULCANA do uczniow apki: najpierw po "Nazwisko Imię"
 * (w obu kolejnosciach), a gdy nazwiska nie ma - po numerze z dziennika.
 * Wiersze z nieznanym symbolem sa pomijane w calosci.
 */
export function matchVulcanAttendance(rows: VulcanGridRow[], students: Student[]): MatchResult {
  const byName = new Map<string, Student>();
  for (const st of students) {
    byName.set(nameKey(`${st.lastName} ${st.firstName}`), st);
    byName.set(nameKey(`${st.firstName} ${st.lastName}`), st);
  }
  const byNumber = new Map(students.map((st) => [st.number, st]));

  const matched: MatchedAttendance[] = [];
  const unmatched: string[] = [];
  for (const row of rows) {
    const status = statusFromVulcanSymbol(row.symbol);
    if (!status) continue;
    const student = byName.get(nameKey(row.name)) ?? (row.number !== undefined ? byNumber.get(row.number) : undefined);
    if (!student) {
      unmatched.push(row.name);
      continue;
    }
    matched.push({ studentId: student.id, status });
  }
  return { matched, unmatched };
}

/**
 * Prosi dodatek Chrome o odczyt frekwencji z otwartej karty VULCANA - kolumna
 * godziny `period`. Odrzuca po `timeoutMs`, gdy dodatku nie ma albo nie
 * odpowiada (ten sam mechanizm, co pasek mostka w Journal.tsx).
 */
export function requestVulcanAttendance(period: number, timeoutMs = 6000): Promise<VulcanGridRow[]> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      window.removeEventListener('message', onMessage);
      reject(new Error('Pomocnik VULCAN nie odpowiedział. Sprawdź dodatek Chrome i otwartą kartę VULCANA.'));
    }, timeoutMs);
    function onMessage(event: MessageEvent) {
      if (event.source !== window || !event.data || event.data.source !== 'vulcan-pomocnik') return;
      if (event.data.type === 'VULCAN_ATTENDANCE_RESULT') {
        window.clearTimeout(timer);
        window.removeEventListener('message', onMessage);
        resolve(Array.isArray(event.data.detail?.rows) ? (event.data.detail.rows as VulcanGridRow[]) : []);
      }
      if (event.data.type === 'VULCAN_ATTENDANCE_ERROR') {
        window.clearTimeout(timer);
        window.removeEventListener('message', onMessage);
        reject(new Error(String(event.data.detail || 'Nie udało się odczytać frekwencji.')));
      }
    }
    window.addEventListener('message', onMessage);
    window.postMessage({ source: 'apka-szkolna', type: 'VULCAN_ATTENDANCE_REQUEST', period }, '*');
  });
}
