// Tabela student_crypto (migracja 0027): sol i probka hasla do danych uczniow.
// Wiersz istnieje = szyfrowanie wlaczone. Samo haslo i klucz nigdy tu nie trafiaja.

import { getSupabase } from '../supabase';
import {
  deriveKey,
  keyMatchesCheck,
  loadDeviceKey,
  makeCheckValue,
  newSalt,
  rememberStudentKey,
  setStudentCryptoEnabled,
} from '../../lib/studentCrypto';

export interface StudentCryptoMeta {
  salt: string;
  check_value: string;
}

export async function fetchStudentCryptoMeta(): Promise<StudentCryptoMeta | null> {
  const { data, error } = await getSupabase()
    .from('student_crypto')
    .select('salt, check_value')
    .eq('id', 'default')
    .maybeSingle();
  if (error) throw error;
  return (data as StudentCryptoMeta | null) ?? null;
}

export type StudentCryptoState = 'off' | 'unlocked' | 'locked';

/**
 * Po zalogowaniu: czy szyfrowanie jest wlaczone i czy to urzadzenie ma pasujacy klucz.
 * 'locked' = trzeba zapytac o haslo (unlockStudentData) przed pobraniem danych.
 */
export async function resolveStudentCryptoState(): Promise<StudentCryptoState> {
  const meta = await fetchStudentCryptoMeta();
  setStudentCryptoEnabled(meta !== null);
  if (!meta) return 'off';
  const key = await loadDeviceKey();
  if (key && (await keyMatchesCheck(key, meta.check_value))) return 'unlocked';
  return 'locked';
}

/** Sprawdza haslo; gdy pasuje, zapamietuje klucz na urzadzeniu. Zwraca false przy zlym hasle. */
export async function unlockStudentData(password: string): Promise<boolean> {
  const meta = await fetchStudentCryptoMeta();
  if (!meta) return true;
  const key = await deriveKey(password, meta.salt);
  if (!(await keyMatchesCheck(key, meta.check_value))) return false;
  await rememberStudentKey(key);
  setStudentCryptoEnabled(true);
  return true;
}

/**
 * Wlacza szyfrowanie: nowa sol, klucz z hasla, probka do chmury, klucz na urzadzenie.
 * Wywolujacy musi potem wyslac uczniow od nowa (pushAllStudentsToRemote).
 */
export async function enableStudentCrypto(password: string): Promise<void> {
  const salt = newSalt();
  const key = await deriveKey(password, salt);
  const check_value = await makeCheckValue(key);
  const { error } = await getSupabase().from('student_crypto').insert({ id: 'default', salt, check_value });
  if (error) throw error;
  await rememberStudentKey(key);
  setStudentCryptoEnabled(true);
}
