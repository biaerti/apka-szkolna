import { describe, expect, it } from 'vitest';
import { describeSyncError, extractErrorMessage } from './errors';

describe('extractErrorMessage', () => {
  it('instancja Error - zwraca .message', () => {
    expect(extractErrorMessage(new Error('Siec padla'))).toBe('Siec padla');
  });

  it('string - zwraca go wprost', () => {
    expect(extractErrorMessage('Cos poszlo nie tak')).toBe('Cos poszlo nie tak');
  });

  it('pusty string - fallback', () => {
    expect(extractErrorMessage('')).toBe('Nieznany błąd synchronizacji.');
  });

  it('obiekt PostgrestError z message, details, hint i code - wszystko w komunikacie', () => {
    const err = {
      message: 'null value in column "class_id" violates not-null constraint',
      details: 'Failing row contains (s1, null, ...).',
      hint: 'Sprawdz dane wejsciowe.',
      code: '23502',
    };
    const msg = extractErrorMessage(err);
    expect(msg).toContain('null value in column "class_id"');
    expect(msg).toContain('23502');
    expect(msg).toContain('Failing row contains');
    expect(msg).toContain('Sprawdz dane wejsciowe.');
  });

  it('obiekt tylko z message (bez details/hint/code)', () => {
    expect(extractErrorMessage({ message: 'Brak polaczenia' })).toBe('Brak polaczenia');
  });

  it('obiekt bez zadnego rozpoznawalnego pola - fallback', () => {
    expect(extractErrorMessage({ foo: 'bar' })).toBe('Nieznany błąd synchronizacji.');
  });

  it('null/undefined/liczba - fallback', () => {
    expect(extractErrorMessage(null)).toBe('Nieznany błąd synchronizacji.');
    expect(extractErrorMessage(undefined)).toBe('Nieznany błąd synchronizacji.');
    expect(extractErrorMessage(42)).toBe('Nieznany błąd synchronizacji.');
  });

  it('kod bez message - i tak buduje komunikat z kodem', () => {
    const msg = extractErrorMessage({ code: '42703' });
    expect(msg).toContain('42703');
  });
});

describe('describeSyncError', () => {
  it('dodaje kontekst tabeli i operacji upsert do komunikatu', () => {
    const msg = describeSyncError(new Error('Timeout'), 'lessons', 'upsert');
    expect(msg).toContain('lessons');
    expect(msg).toContain('zapisu');
    expect(msg).toContain('Timeout');
  });

  it('dodaje kontekst tabeli i operacji delete do komunikatu', () => {
    const msg = describeSyncError(new Error('Timeout'), 'students', 'delete');
    expect(msg).toContain('students');
    expect(msg).toContain('usuwania');
  });

  it('kod 42703 (undefined_column) - rozpoznaje brak migracji i nazywa kolumne', () => {
    const err = {
      message: 'column "register_topic" of relation "lessons" does not exist',
      code: '42703',
    };
    const msg = describeSyncError(err, 'lessons', 'upsert');
    expect(msg).toContain('migrac');
    expect(msg).toContain('supabase/migrations');
    expect(msg).toContain('register_topic');
  });

  it('kod PGRST204 (kolumna nieznaleziona w cache schematu) - tez rozpoznaje brak migracji', () => {
    const err = {
      message: "Could not find the 'pluses_for_five' column of 'settings' in the schema cache",
      code: 'PGRST204',
    };
    const msg = describeSyncError(err, 'settings', 'upsert');
    expect(msg).toContain('migrac');
    expect(msg).toContain('pluses_for_five');
  });

  it('inny kod bledu (np. 23502) - nie sugeruje migracji, pokazuje zwykly opis', () => {
    const err = { message: 'null value in column "class_id"', code: '23502' };
    const msg = describeSyncError(err, 'students', 'upsert');
    expect(msg).not.toContain('migrac');
    expect(msg).toContain('null value in column "class_id"');
  });

  it('PostgrestError bez instancji Error (typowy przypadek Supabase) - dziala poprawnie', () => {
    // To jest ksztalt, jaki naprawde rzuca postgrest-js - zwykly obiekt, NIE Error.
    const postgrestError = {
      message: 'permission denied for table classes',
      details: null,
      hint: null,
      code: '42501',
    };
    expect(postgrestError instanceof Error).toBe(false);
    const msg = describeSyncError(postgrestError, 'classes', 'upsert');
    expect(msg).toContain('permission denied for table classes');
    expect(msg).not.toBe('Błąd zapisu do tabeli "classes": Nieznany błąd synchronizacji.');
  });
});
