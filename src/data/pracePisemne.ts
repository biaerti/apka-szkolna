// Prace pisemne uczniow - tabela prace_pisemne i prywatny bucket "prace"
// (0041_prace_pisemne.sql). Poza store i silnikiem sync: prace czyta sie dopiero
// na zakladce "Pisanie" w klasie, a zdjecia pobiera na zadanie.
//
// Szyfrowanie: `dane` (JSON) i bajty zdjec ida przez src/lib/studentCrypto.ts -
// chmura widzi tylko id klasy/ucznia, temat zadania, date i losowe nazwy plikow.

import { newId } from './id';
import { getSupabase, isSupabaseConfigured } from './supabase';
import {
  decryptStudentBytes,
  decryptStudentText,
  encryptStudentBytes,
  encryptStudentText,
} from '../lib/studentCrypto';
import type { PracaDane, PracaPisemna } from '../lib/pracePisemne';

const BUCKET = 'prace';

interface PracaRow {
  id: string;
  class_id: string;
  student_id: string | null;
  zadanie: string;
  tytul: string;
  data: string;
  dane: string;
  zdjecia: string[];
}

function wymagajChmury() {
  if (!isSupabaseConfigured()) throw new Error('Prace pisemne wymagają połączenia z Supabase.');
}

async function rowToPraca(r: PracaRow): Promise<PracaPisemna> {
  const dane = JSON.parse(await decryptStudentText(r.dane)) as PracaDane;
  return {
    id: r.id,
    classId: r.class_id,
    studentId: r.student_id,
    zadanie: r.zadanie,
    tytul: r.tytul,
    data: r.data,
    dane,
    zdjecia: r.zdjecia ?? [],
  };
}

async function pracaToRow(p: PracaPisemna): Promise<PracaRow> {
  return {
    id: p.id,
    class_id: p.classId,
    student_id: p.studentId,
    zadanie: p.zadanie,
    tytul: p.tytul,
    data: p.data,
    dane: await encryptStudentText(JSON.stringify(p.dane)),
    zdjecia: p.zdjecia,
  };
}

export async function wczytajPraceKlasy(classId: string): Promise<PracaPisemna[]> {
  wymagajChmury();
  const { data, error } = await getSupabase()
    .from('prace_pisemne')
    .select('id, class_id, student_id, zadanie, tytul, data, dane, zdjecia')
    .eq('class_id', classId)
    .order('data', { ascending: false });
  if (error) throw error;
  return Promise.all((data as PracaRow[]).map(rowToPraca));
}

export async function zapiszPrace(p: PracaPisemna): Promise<void> {
  wymagajChmury();
  const { error } = await getSupabase().from('prace_pisemne').upsert(await pracaToRow(p));
  if (error) throw error;
}

export async function usunPrace(p: PracaPisemna): Promise<void> {
  wymagajChmury();
  if (p.zdjecia.length > 0) await getSupabase().storage.from(BUCKET).remove(p.zdjecia);
  const { error } = await getSupabase().from('prace_pisemne').delete().eq('id', p.id);
  if (error) throw error;
}

/** Szyfruje i wysyla zdjecie; zwraca sciezke w buckecie. */
export async function wyslijZdjecie(plik: Blob): Promise<string> {
  wymagajChmury();
  const bajty = await encryptStudentBytes(new Uint8Array(await plik.arrayBuffer()));
  const sciezka = `${newId()}.bin`;
  const { error } = await getSupabase()
    .storage.from(BUCKET)
    .upload(sciezka, new Blob([bajty], { type: 'application/octet-stream' }), {
      contentType: 'application/octet-stream',
    });
  if (error) throw error;
  return sciezka;
}

const cacheZdjec = new Map<string, Promise<string>>();

/** Pobiera i odszyfrowuje zdjecie; zwraca adres blob: do <img>. Wynik zostaje w pamieci karty. */
export function adresZdjecia(sciezka: string): Promise<string> {
  let p = cacheZdjec.get(sciezka);
  if (!p) {
    p = (async () => {
      const { data, error } = await getSupabase().storage.from(BUCKET).download(sciezka);
      if (error || !data) throw error ?? new Error('Nie udało się pobrać zdjęcia.');
      const jawne = await decryptStudentBytes(new Uint8Array(await data.arrayBuffer()));
      return URL.createObjectURL(new Blob([jawne], { type: 'image/jpeg' }));
    })();
    p.catch(() => cacheZdjec.delete(sciezka));
    cacheZdjec.set(sciezka, p);
  }
  return p;
}

/** Id prac danego zadania, ktore juz sa w chmurze (zeby powtorny import ich nie dublowal). */
export async function idPracZadania(zadanie: string): Promise<Set<string>> {
  wymagajChmury();
  const { data, error } = await getSupabase().from('prace_pisemne').select('id').eq('zadanie', zadanie);
  if (error) throw error;
  return new Set((data as Array<{ id: string }>).map((r) => r.id));
}
