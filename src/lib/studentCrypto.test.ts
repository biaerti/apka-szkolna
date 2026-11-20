import { afterEach, describe, expect, it } from 'vitest';
import {
  ENC_PREFIX,
  decryptStudentBytes,
  decryptStudentRows,
  decryptStudentText,
  encryptStudentBytes,
  decryptText,
  deriveKey,
  encryptStudentRows,
  encryptStudentText,
  encryptText,
  forgetDeviceKey,
  keyMatchesCheck,
  makeCheckValue,
  newSalt,
  rememberStudentKey,
  setStudentCryptoEnabled,
} from './studentCrypto';

const row = { id: 's1', class_id: 'c1', first_name: 'Zofia', last_name: 'Nowak', number: 3, note: null, active: true };

afterEach(() => forgetDeviceKey());

describe('studentCrypto', () => {
  it('szyfruje i odszyfrowuje tekst z polskimi znakami', async () => {
    const key = await deriveKey('tajne-haslo', newSalt());
    const enc = await encryptText(key, 'Łucja Żółć');
    expect(enc.startsWith(ENC_PREFIX)).toBe(true);
    expect(enc).not.toContain('Łucja');
    expect(await decryptText(key, enc)).toBe('Łucja Żółć');
  });

  it('ten sam tekst daje za kazdym razem inny szyfrogram', async () => {
    const key = await deriveKey('tajne-haslo', newSalt());
    expect(await encryptText(key, 'Nowak')).not.toBe(await encryptText(key, 'Nowak'));
  });

  it('probka rozpoznaje zle haslo', async () => {
    const salt = newSalt();
    const check = await makeCheckValue(await deriveKey('dobre-haslo', salt));
    expect(await keyMatchesCheck(await deriveKey('dobre-haslo', salt), check)).toBe(true);
    expect(await keyMatchesCheck(await deriveKey('zle-haslo', salt), check)).toBe(false);
  });

  it('bez wlaczonego szyfrowania wiersze ida bez zmian', async () => {
    expect(await encryptStudentRows([row])).toEqual([row]);
  });

  it('wiersze ucznia w obie strony, reszta pol nietknieta', async () => {
    await rememberStudentKey(await deriveKey('tajne-haslo', newSalt()));
    setStudentCryptoEnabled(true);
    const [enc] = await encryptStudentRows([{ ...row, note: 'dysleksja' }]);
    expect(enc.first_name).not.toContain('Zofia');
    expect(enc.last_name).not.toContain('Nowak');
    expect(enc.note).not.toContain('dysleksja');
    expect(enc.number).toBe(3);
    const [dec] = await decryptStudentRows([enc]);
    expect(dec).toEqual({ ...row, note: 'dysleksja' });
  });

  it('wlaczone szyfrowanie bez klucza nie wysyla jawnych danych', async () => {
    setStudentCryptoEnabled(true);
    await expect(encryptStudentRows([row])).rejects.toThrow(/Brak hasła/);
  });

  it('stare jawne wiersze odczytuje bez klucza', async () => {
    expect(await decryptStudentRows([row])).toEqual([row]);
  });
  it('zdjecie pracy i tekst o uczniu w obie strony', async () => {
    const key = await deriveKey('tajne-haslo', newSalt());
    await rememberStudentKey(key);
    setStudentCryptoEnabled(true);
    const jpg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]);
    const enc = await encryptStudentBytes(jpg);
    expect(Array.from(enc.slice(0, 4))).toEqual([0x45, 0x4e, 0x43, 0x31]);
    expect(Array.from(await decryptStudentBytes(enc))).toEqual(Array.from(jpg));
    // niezaszyfrowany plik przechodzi bez zmian
    expect(Array.from(await decryptStudentBytes(jpg))).toEqual(Array.from(jpg));
    const tekst = await encryptStudentText('{"ocena":"5-"}');
    expect(tekst.startsWith(ENC_PREFIX)).toBe(true);
    expect(await decryptStudentText(tekst)).toBe('{"ocena":"5-"}');
  });
});
