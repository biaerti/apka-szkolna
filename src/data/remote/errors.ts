// Wyciaganie czytelnego komunikatu bledu synchronizacji z czegokolwiek, co wpadnie
// do catch. Supabase (postgrest-js) NIE rzuca instancji Error - w catch ladujemy
// zwykly obiekt PostgrestError ({ message, details, hint, code }). Kod, ktory robil
// `err instanceof Error ? err.message : 'Nieznany blad'` zawsze trafial w fallback,
// bo PostgrestError nigdy nie jest instancja Error - stad "Nieznany blad synchronizacji"
// bez wzgledu na to, co faktycznie poszlo nie tak.

export type SyncOperation = 'upsert' | 'delete';

interface ErrorLike {
  message?: unknown;
  details?: unknown;
  hint?: unknown;
  code?: unknown;
}

function isRecord(value: unknown): value is ErrorLike {
  return typeof value === 'object' && value !== null;
}

function asNonEmptyString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
}

/**
 * Kody, ktorymi Postgres (42703 - undefined_column) i PostgREST (PGRST204 - kolumna
 * nieznaleziona w cache schematu) sygnalizuja brakujaca kolumne w bazie. To najbardziej
 * prawdopodobna realna przyczyna bledu synchronizacji u nauczyciela: baza w Supabase
 * nie ma jeszcze kolumn dodanych przez najnowsza migracje (bo nie zostala uruchomiona
 * recznie w panelu Supabase).
 */
const MISSING_COLUMN_CODES = new Set(['42703', 'PGRST204']);

/** Wyciaga nazwe brakujacej kolumny z tresci bledu Postgresa/PostgRESTa, jesli sie da. */
function extractMissingColumnName(text: string): string | undefined {
  // Postgres, np.: column "register_topic" of relation "lessons" does not exist
  const postgres = /column\s+"([^"]+)"/i.exec(text);
  if (postgres) return postgres[1];
  // PostgREST, np.: Could not find the 'register_topic' column of 'lessons' in the schema cache
  const postgrest = /'([^']+)'\s+column/i.exec(text);
  if (postgrest) return postgrest[1];
  return undefined;
}

/**
 * Wyciaga czytelny komunikat z bledu w dowolnym ksztalcie, jaki moze wpasc do catch:
 * instancja Error, obiekt PostgrestError ({ message, details, hint, code }), zwykly
 * obiekt z polem message, string, albo cos zupelnie innego (wtedy fallback).
 */
export function extractErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    return asNonEmptyString(err.message) ?? 'Nieznany błąd synchronizacji.';
  }
  const asString = asNonEmptyString(err);
  if (asString) return asString;

  if (isRecord(err)) {
    const message = asNonEmptyString(err.message);
    const details = asNonEmptyString(err.details);
    const hint = asNonEmptyString(err.hint);
    const code = asNonEmptyString(err.code);

    if (message || details || hint || code) {
      const parts: string[] = [message ?? 'Błąd bazy danych.'];
      if (code) parts.push(`(kod: ${code})`);
      if (details) parts.push(`- szczegóły: ${details}`);
      if (hint) parts.push(`- podpowiedź: ${hint}`);
      return parts.join(' ');
    }
  }

  return 'Nieznany błąd synchronizacji.';
}

/**
 * Rozpoznaje brak uruchomionej migracji SQL (baza nie ma kolumny, ktorej aplikacja
 * probuje uzyc) i zwraca gotowy, przyjazny komunikat po polsku. Zwraca undefined, gdy
 * blad nie wyglada na brakujaca kolumne - wtedy wolamy zwykle wyciaganie komunikatu.
 */
function missingMigrationMessage(err: unknown): string | undefined {
  if (!isRecord(err)) return undefined;
  const code = asNonEmptyString(err.code);
  if (!code || !MISSING_COLUMN_CODES.has(code)) return undefined;

  const message = asNonEmptyString(err.message) ?? '';
  const details = asNonEmptyString(err.details) ?? '';
  const column = extractMissingColumnName(`${message} ${details}`);
  const columnPart = column ? ` Brakuje kolumny "${column}".` : '';

  return (
    `Baza danych w Supabase nie ma jeszcze wszystkich kolumn, których potrzebuje aplikacja.` +
    `${columnPart} Trzeba uruchomić migracje SQL z katalogu supabase/migrations/ w panelu Supabase ` +
    `(SQL Editor) - najpewniej brakuje najnowszego pliku migracji.`
  );
}

/**
 * Pelny, czytelny opis bledu synchronizacji jednej operacji: co sie stalo (z detekcja
 * brakujacej migracji SQL) plus kontekst - przy ktorej tabeli i operacji (upsert/delete)
 * poszlo zle. Uzywane przez sync.ts, zeby status w UI mowil cos wiecej niz "Nieznany blad".
 */
export function describeSyncError(err: unknown, table: string, operation: SyncOperation): string {
  const operationLabel = operation === 'upsert' ? 'zapisu' : 'usuwania';
  const detail = missingMigrationMessage(err) ?? extractErrorMessage(err);
  return `Błąd ${operationLabel} do tabeli "${table}": ${detail}`;
}
