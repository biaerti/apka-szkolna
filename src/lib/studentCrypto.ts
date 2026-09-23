// Szyfrowanie danych uczniow przed wyslaniem do Supabase. W chmurze imie,
// nazwisko i notatka ucznia leza jako "enc1:<base64(iv + szyfrogram)>"; w
// przegladarce (store, localStorage) sa jawne. Klucz AES-GCM powstaje z hasla
// nauczyciela (PBKDF2) i jest trzymany tylko na urzadzeniu - chmura ma sol i
// probke do sprawdzenia hasla (tabela student_crypto, migracja 0027).
//
// Uzywa WebCrypto (Chrome 109 ok; wymaga https albo localhost).

export const ENC_PREFIX = 'enc1:';
const CHECK_PLAINTEXT = 'apka-szkolna:klucz-ok';
const PBKDF2_ITERATIONS = 310_000;
const DEVICE_KEY_STORAGE = 'apka.studentKey';

// --- base64 ----------------------------------------------------------------

function toB64(bytes: Uint8Array): string {
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}

function fromB64(b64: string): Uint8Array<ArrayBuffer> {
  const s = atob(b64);
  const out = new Uint8Array(new ArrayBuffer(s.length));
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
  return out;
}

// --- klucz i szyfrowanie ------------------------------------------------------

export function newSalt(): string {
  return toB64(crypto.getRandomValues(new Uint8Array(16)));
}

export async function deriveKey(password: string, salt: string): Promise<CryptoKey> {
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, [
    'deriveKey',
  ]);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: fromB64(salt), iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    base,
    { name: 'AES-GCM', length: 256 },
    true, // eksportowalny, zeby zapamietac go na urzadzeniu
    ['encrypt', 'decrypt'],
  );
}

export function isEncrypted(value: string | null | undefined): boolean {
  return typeof value === 'string' && value.startsWith(ENC_PREFIX);
}

export async function encryptText(key: CryptoKey, text: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(text)));
  const buf = new Uint8Array(iv.length + ct.length);
  buf.set(iv);
  buf.set(ct, iv.length);
  return ENC_PREFIX + toB64(buf);
}

/** Odszyfrowuje wartosc z prefiksem; jawny tekst (sprzed wlaczenia szyfrowania) zwraca bez zmian. */
export async function decryptText(key: CryptoKey, value: string): Promise<string> {
  if (!isEncrypted(value)) return value;
  const buf = fromB64(value.slice(ENC_PREFIX.length));
  const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: buf.slice(0, 12) }, key, buf.slice(12));
  return new TextDecoder().decode(pt);
}

export async function makeCheckValue(key: CryptoKey): Promise<string> {
  return encryptText(key, CHECK_PLAINTEXT);
}

/** true, gdy klucz otwiera probke z chmury (czyli haslo bylo poprawne). */
export async function keyMatchesCheck(key: CryptoKey, checkValue: string): Promise<boolean> {
  try {
    return (await decryptText(key, checkValue)) === CHECK_PLAINTEXT;
  } catch {
    return false;
  }
}

// --- stan w aplikacji (jedna instancja) --------------------------------------

let enabled = false;
let activeKey: CryptoKey | null = null;

/** Ustawiane po zalogowaniu na podstawie tabeli student_crypto. */
export function setStudentCryptoEnabled(value: boolean): void {
  enabled = value;
}

export async function rememberStudentKey(key: CryptoKey): Promise<void> {
  activeKey = key;
  const raw = new Uint8Array(await crypto.subtle.exportKey('raw', key));
  try {
    localStorage.setItem(DEVICE_KEY_STORAGE, toB64(raw));
  } catch {
    // Bez localStorage klucz dziala do zamkniecia karty - haslo trzeba bedzie podac ponownie.
  }
}

/** Klucz zapamietany na tym urzadzeniu albo null. */
export async function loadDeviceKey(): Promise<CryptoKey | null> {
  if (activeKey) return activeKey;
  let stored: string | null = null;
  try {
    stored = localStorage.getItem(DEVICE_KEY_STORAGE);
  } catch {
    return null;
  }
  if (!stored) return null;
  try {
    activeKey = await crypto.subtle.importKey('raw', fromB64(stored), { name: 'AES-GCM' }, true, [
      'encrypt',
      'decrypt',
    ]);
    return activeKey;
  } catch {
    return null;
  }
}

/** Przy wylogowaniu - klucz znika z urzadzenia (np. wspolny komputer w szkole). */
export function forgetDeviceKey(): void {
  activeKey = null;
  enabled = false;
  try {
    localStorage.removeItem(DEVICE_KEY_STORAGE);
  } catch {
    // nic
  }
}

// --- wiersze uczniow ------------------------------------------------------------

interface NamedRow {
  first_name: string;
  last_name: string;
  note: string | null;
}

function requireKey(): CryptoKey {
  if (!activeKey) {
    throw new Error('Brak hasła do danych uczniów na tym urządzeniu - dane uczniów nie zostaną wysłane jawnie.');
  }
  return activeKey;
}

/** Przed wysylka: szyfruje imie, nazwisko i notatke (gdy szyfrowanie wlaczone). */
export async function encryptStudentRows<T extends NamedRow>(rows: T[]): Promise<T[]> {
  if (!enabled) return rows;
  const key = requireKey();
  return Promise.all(
    rows.map(async (r) => ({
      ...r,
      first_name: await encryptText(key, r.first_name),
      last_name: await encryptText(key, r.last_name),
      note: r.note == null ? null : await encryptText(key, r.note),
    })),
  );
}

/** Po pobraniu: odszyfrowuje wiersze; jawne (stare) zostawia bez zmian. */
export async function decryptStudentRows<T extends NamedRow>(rows: T[]): Promise<T[]> {
  const anyEncrypted = rows.some((r) => isEncrypted(r.first_name) || isEncrypted(r.last_name) || isEncrypted(r.note));
  if (!anyEncrypted) return rows;
  const key = requireKey();
  return Promise.all(
    rows.map(async (r) => ({
      ...r,
      first_name: await decryptText(key, r.first_name),
      last_name: await decryptText(key, r.last_name),
      note: r.note == null ? null : await decryptText(key, r.note),
    })),
  );
}
