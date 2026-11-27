// Kurs "Polski od zera" w zakladce Zadania domowe: kto ma kurs (tryb lekcja/dom,
// jezyk podpowiedzi), kartki z loginem i haslem, postep (lekcja, bledy, czas,
// slowa sprawiajace klopot) i reczne przesuwanie lekcji (zastepstwa, wycieczki).
// Konto ucznia jest to samo co w portalu /uczen - kurs to kolumny od_zera* (0046).
// Strona ucznia: szkola.klippi.pl/od-zera (src/pages/odzera/).

import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { getSupabase, isSupabaseConfigured } from '../../data/supabase';
import { useStore } from '../../data/store';
import { LEKCJE, type JezykOZ } from '../../data/odzera';
import { KARTY, lekcjaZrobiona, stanyLekcji, type WynikOZ } from '../../lib/odzera';
import { decryptStudentText } from '../../lib/studentCrypto';
import { Select } from '../ui/Select';
import { noweHasloPortalu, nowyLogin, zapiszKopieHasla } from '../portal/KontaPanel';

export const LINK_OD_ZERA = 'https://szkola.klippi.pl/od-zera';

type Tryb = 'lekcja' | 'dom';

interface KontoOZ {
  id: string;
  login: string | null;
  aktywny: boolean;
  jezyk: string;
  student_id: string | null;
  class_id: string | null;
  haslo_szyfr?: string | null;
  od_zera?: Tryb | null;
  od_zera_jezyk?: JezykOZ | null;
  od_zera_start?: string | null;
  od_zera_przesuniecie?: number;
}

interface WynikRow extends WynikOZ {
  id: string;
  uczen_id: string;
  bledy: Array<{ pl: string; wpisane?: string }>;
}

interface FiszkaRow {
  uczen_id: string;
  item: string;
  box: number;
  bledy: number;
  last_known: boolean | null;
}

interface Przeglad {
  id: string;
  odblokowane: number | null;
  nastepna: string | null;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const NAPISY: Record<JezykOZ, { tytul: string; wejdz: string; login: string; haslo: string; lekcja: string; dom: string }> = {
  ru: {
    tytul: 'Польский с нуля',
    wejdz: 'Зайди на',
    login: 'Логин',
    haslo: 'Пароль',
    lekcja: 'На каждом уроке польского - в телефоне, с наушниками.',
    dom: 'Дома, когда хочешь - урок за уроком.',
  },
  ua: {
    tytul: 'Польська з нуля',
    wejdz: 'Зайди на',
    login: 'Логін',
    haslo: 'Пароль',
    lekcja: 'На кожному уроці польської - у телефоні, з навушниками.',
    dom: 'Вдома, коли хочеш - урок за уроком.',
  },
};

/** Kartki A4 (2 x 4): po polsku i w jezyku ucznia. */
function drukujKartki(kartki: Array<{ imie: string; login: string; haslo: string; jezyk: JezykOZ; tryb: Tryb }>): void {
  const okno = window.open('', '_blank');
  if (!okno) return;
  const html = kartki
    .map((k) => {
      const t = NAPISY[k.jezyk];
      return `<div class="k">
  <div class="n">${escapeHtml(k.imie)}</div>
  <div class="t">Polski od zera <span>${t.tytul}</span></div>
  <div class="r"><span>Wejdź na · ${t.wejdz}:</span><b>${LINK_OD_ZERA.replace('https://', '')}</b></div>
  <div class="r"><span>Login · ${t.login}:</span><b class="h">${escapeHtml(k.login)}</b></div>
  <div class="r"><span>Hasło · ${t.haslo}:</span><b class="h">${escapeHtml(k.haslo)}</b></div>
  <div class="s">${k.tryb === 'lekcja' ? 'Na każdej lekcji polskiego - w telefonie, ze słuchawkami.' : 'W domu, kiedy chcesz - lekcja po lekcji.'}<br>${k.tryb === 'lekcja' ? t.lekcja : t.dom}</div>
</div>`;
    })
    .join('');
  okno.document.write(`<!DOCTYPE html><html lang="pl"><head><meta charset="utf-8"><title>Kartki - Polski od zera</title>
<style>
@page { size: A4; margin: 10mm; }
body { font-family: Arial, sans-serif; margin: 0; }
.siatka { display: grid; grid-template-columns: 1fr 1fr; }
.k { border: 1px dashed #999; padding: 6mm; height: 66mm; box-sizing: border-box; break-inside: avoid; position: relative; }
.n { position: absolute; right: 6mm; top: 6mm; font-size: 9pt; color: #666; }
.t { font-size: 15pt; font-weight: bold; margin-bottom: 3mm; }
.t span { display: block; font-size: 10.5pt; font-weight: normal; color: #444; }
.r { font-size: 10pt; margin: 1.8mm 0; display: flex; gap: 3mm; align-items: baseline; }
.r b { font-size: 12pt; }
.r b.h { font-size: 17pt; letter-spacing: 1px; font-family: 'Courier New', monospace; }
.s { margin-top: 2mm; font-size: 8.5pt; color: #444; }
</style></head><body><div class="siatka">${html}</div>
<script>window.onload = () => window.print();</script></body></html>`);
  okno.document.close();
}

const btn =
  'inline-flex min-h-10 items-center justify-center rounded-md border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500 disabled:cursor-not-allowed disabled:opacity-50';
const btnMaly = 'text-xs font-medium text-gray-500 hover:text-gray-900 hover:underline disabled:opacity-50';
const btnKwadrat =
  'inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40';

const krotkaData = (iso: string) => {
  const d = new Date(iso);
  return `${d.getDate()}.${String(d.getMonth() + 1).padStart(2, '0')}`;
};

const dzienGodzina = (iso: string) =>
  new Intl.DateTimeFormat('pl-PL', { weekday: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Warsaw' }).format(new Date(iso));

/** Domyslny start kursu: dzis, a w piatek i w weekend - najblizszy poniedzialek. */
function domyslnyStart(): string {
  const d = new Date();
  const dow = d.getDay();
  if (dow === 5 || dow === 6 || dow === 0) d.setDate(d.getDate() + ((8 - dow) % 7 || 7));
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Warsaw' }).format(d);
}

export function OdZeraPanel({ klasaId = null }: { klasaId?: string | null }) {
  const [konta, setKonta] = useState<KontoOZ[] | null>(null);
  const [wyniki, setWyniki] = useState<WynikRow[]>([]);
  const [fiszki, setFiszki] = useState<FiszkaRow[]>([]);
  const [przeglad, setPrzeglad] = useState<Map<string, Przeglad>>(new Map());
  const [hasla, setHasla] = useState<Record<string, string>>({});
  const [blad, setBlad] = useState<string | null>(null);
  const [brakMigracji, setBrakMigracji] = useState(false);
  const [pracuje, setPracuje] = useState(false);
  const [otwarte, setOtwarte] = useState<string | null>(null);
  const [nowyUczen, setNowyUczen] = useState('');
  const [nowyTryb, setNowyTryb] = useState<Tryb>('lekcja');
  const [nowyJezyk, setNowyJezyk] = useState<JezykOZ>('ru');
  const classes = useStore((s) => s.classes);
  const students = useStore((s) => s.students);
  const uczniowieKlasy = useMemo(
    () => students.filter((s) => s.classId === klasaId && s.active).sort((a, b) => a.number - b.number),
    [students, klasaId],
  );

  const wczytaj = useCallback(async () => {
    const sb = getSupabase();
    const k = await sb.from('dyktando_uczniowie').select('*');
    if (k.error) {
      setBlad('Nie udało się wczytać kont.');
      return;
    }
    const lista = (k.data ?? []) as KontoOZ[];
    setKonta(lista);
    const maKolumny = lista.length === 0 || lista.some((x) => 'od_zera' in x);
    setBrakMigracji(!maKolumny);
    if (!maKolumny) return;
    const [w, f, p] = await Promise.all([
      sb.from('od_zera_wyniki').select('*').order('created_at', { ascending: true }),
      sb.from('od_zera_fiszki').select('uczen_id,item,box,bledy,last_known'),
      sb.rpc('od_zera_przeglad'),
    ]);
    if (w.error || f.error || p.error) setBlad('Nie udało się wczytać wyników kursu.');
    else setBlad(null);
    setWyniki((w.data ?? []) as WynikRow[]);
    setFiszki((f.data ?? []) as FiszkaRow[]);
    setPrzeglad(new Map(((p.data ?? []) as Przeglad[]).map((x) => [x.id, x])));
    const odszyfrowane: Record<string, string> = {};
    for (const konto of lista.filter((x) => x.od_zera)) {
      if (!konto.haslo_szyfr) continue;
      try {
        odszyfrowane[konto.id] = await decryptStudentText(konto.haslo_szyfr);
      } catch {
        // inny klucz - hasla nie pokazujemy
      }
    }
    setHasla(odszyfrowane);
  }, []);

  useEffect(() => {
    if (isSupabaseConfigured()) void wczytaj();
  }, [wczytaj]);

  if (!isSupabaseConfigured()) return null;

  const nazwa = (u: KontoOZ) => {
    const s = students.find((x) => x.id === u.student_id);
    return s ? `${s.firstName} ${s.lastName}` : (u.login ?? '?');
  };
  const imie = (u: KontoOZ) => students.find((x) => x.id === u.student_id)?.firstName ?? '';
  const nazwaKlasy = (id?: string | null) => classes.find((c) => c.id === id)?.name ?? '';
  const naKursie = (konta ?? []).filter((u) => u.aktywny && u.od_zera && (!klasaId || u.class_id === klasaId));

  async function zmien(u: KontoOZ, zmiany: Partial<KontoOZ>) {
    const { error } = await getSupabase().from('dyktando_uczniowie').update(zmiany).eq('id', u.id);
    if (error) setBlad('Nie udało się zapisać zmiany.');
    await wczytaj();
  }

  async function dodaj() {
    const uczen = uczniowieKlasy.find((s) => s.id === nowyUczen);
    if (!uczen) return;
    setPracuje(true);
    const zmiany = { od_zera: nowyTryb, od_zera_jezyk: nowyJezyk, od_zera_start: domyslnyStart(), od_zera_przesuniecie: 0 };
    const istniejace = (konta ?? []).find((u) => u.student_id === uczen.id && u.aktywny);
    if (istniejace) {
      const { error } = await getSupabase()
        .from('dyktando_uczniowie')
        .update({ ...zmiany, od_zera_start: istniejace.od_zera_start ?? zmiany.od_zera_start })
        .eq('id', istniejace.id);
      if (error) setBlad('Nie udało się włączyć kursu.');
    } else {
      const zajete = new Set((konta ?? []).map((u) => (u.login ?? '').toLowerCase()).filter(Boolean));
      const login = nowyLogin(zajete);
      const haslo = noweHasloPortalu();
      const { data: id, error } = await getSupabase().rpc('portal_dodaj_konto', {
        p_login: login,
        p_haslo: haslo,
        p_student_id: uczen.id,
        p_class_id: uczen.classId,
        p_jezyk: 'ua',
        p_polski: false,
      });
      if (error) setBlad('Nie udało się założyć konta.');
      else {
        await zapiszKopieHasla(id as string, haslo);
        await getSupabase().from('dyktando_uczniowie').update(zmiany).eq('id', id as string);
      }
    }
    setNowyUczen('');
    setPracuje(false);
    await wczytaj();
  }

  /** Kartki: znane hasla drukujemy, kto ma haslo tylko na starej kartce - dostaje nowe. */
  async function kartki(lista: KontoOZ[]) {
    const bezHasla = lista.filter((u) => !hasla[u.id]);
    if (
      bezHasla.length &&
      !window.confirm(`Nowe hasło dostanie ${bezHasla.length} os. Stare kartki (także do portalu /uczen) przestaną działać. Drukować?`)
    )
      return;
    setPracuje(true);
    const znane = { ...hasla };
    for (const u of bezHasla) {
      const haslo = noweHasloPortalu();
      const { error } = await getSupabase().rpc('dyktando_ustaw_haslo', { p_id: u.id, p_haslo: haslo });
      if (error) {
        setBlad(`Nie udało się zmienić hasła: ${nazwa(u)}.`);
        setPracuje(false);
        return;
      }
      await zapiszKopieHasla(u.id, haslo);
      znane[u.id] = haslo;
    }
    setHasla(znane);
    setPracuje(false);
    drukujKartki(
      lista
        .filter((u) => u.login && znane[u.id])
        .map((u) => ({ imie: imie(u), login: u.login!, haslo: znane[u.id], jezyk: u.od_zera_jezyk ?? 'ru', tryb: u.od_zera ?? 'lekcja' })),
    );
    await wczytaj();
  }

  return (
    <section className="max-w-5xl">
      {brakMigracji && (
        <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Kurs czeka na migrację 0046 w Supabase (SQL Editor). Po jej wklejeniu odśwież stronę.
        </p>
      )}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        {klasaId ? (
          <div className="flex flex-wrap items-end gap-2">
            <label className="text-sm text-gray-700">
              Dodaj ucznia
              <Select className="mt-1 min-w-56" value={nowyUczen} onChange={(e) => setNowyUczen(e.target.value)}>
                <option value="">- wybierz ucznia -</option>
                {uczniowieKlasy.map((s) => {
                  const juz = naKursie.some((u) => u.student_id === s.id);
                  return (
                    <option key={s.id} value={s.id} disabled={juz}>
                      {s.number}. {s.lastName} {s.firstName}
                      {juz ? ' (już jest)' : ''}
                    </option>
                  );
                })}
              </Select>
            </label>
            <label className="text-sm text-gray-700">
              Tryb
              <Select className="mt-1" value={nowyTryb} onChange={(e) => setNowyTryb(e.target.value as Tryb)}>
                <option value="lekcja">na lekcjach (wg planu)</option>
                <option value="dom">w domu (bez zegara)</option>
              </Select>
            </label>
            <label className="text-sm text-gray-700">
              Podpowiedzi
              <Select className="mt-1" value={nowyJezyk} onChange={(e) => setNowyJezyk(e.target.value as JezykOZ)}>
                <option value="ru">rosyjski</option>
                <option value="ua">ukraiński</option>
              </Select>
            </label>
            <button type="button" className={btn} disabled={!nowyUczen || pracuje || brakMigracji} onClick={() => void dodaj()}>
              Dodaj
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Wybierz klasę na górze, żeby dodać ucznia do kursu.</p>
        )}
        <button type="button" className={btn} disabled={pracuje || naKursie.length === 0} onClick={() => void kartki(naKursie)}>
          Kartki dla kursu ({naKursie.length})
        </button>
      </div>
      {blad && <p className="mb-3 text-sm text-red-700">{blad}</p>}
      {konta && (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-4 py-2">Uczeń</th>
                <th className="px-3 py-2">Login / hasło</th>
                <th className="px-3 py-2">Tryb</th>
                <th className="px-3 py-2">Lekcja</th>
                <th className="px-3 py-2">Wyniki</th>
                <th className="px-3 py-2">Kłopot sprawiają</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {naKursie.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-4 text-gray-500">
                    {klasaId ? 'Nikt z tej klasy nie ma kursu.' : 'Nikt nie ma jeszcze kursu.'}
                  </td>
                </tr>
              )}
              {naKursie.map((u) => {
                const moje = wyniki.filter((w) => w.uczen_id === u.id);
                const p = przeglad.get(u.id);
                const odbl = u.od_zera === 'lekcja' ? (p?.odblokowane ?? 0) : null;
                const stany = stanyLekcji(moje, odbl);
                const teraz = LEKCJE.find((l) => stany.get(l.nr) === 'teraz');
                const zrobione = LEKCJE.filter((l) => lekcjaZrobiona(l.nr, moje)).length;
                const lekcyjne = moje.filter((w) => w.czesc === 'lekcja' && w.ukonczona);
                const pkt = lekcyjne.reduce((s, w) => s + w.punkty, 0);
                const maks = lekcyjne.reduce((s, w) => s + w.maks, 0);
                const minuty = Math.round(moje.reduce((s, w) => s + (w.sekundy ?? 0), 0) / 60);
                const ostatnio = moje.length ? moje[moje.length - 1].created_at : null;
                const klopoty = fiszki
                  .filter((f) => f.uczen_id === u.id && f.bledy > 0 && KARTY.has(f.item))
                  .sort((a, b) => b.bledy - a.bledy || a.box - b.box)
                  .slice(0, 5);
                return (
                  <Fragment key={u.id}>
                    <tr className="border-b border-gray-100 align-top last:border-b-0">
                      <td className="px-4 py-2.5">
                        <span className="font-medium text-gray-900">{nazwa(u)}</span>
                        {!klasaId && u.class_id && <span className="ml-2 text-xs text-gray-500">{nazwaKlasy(u.class_id)}</span>}
                        <div className="mt-1">
                          <select
                            aria-label={`Język podpowiedzi: ${nazwa(u)}`}
                            value={u.od_zera_jezyk ?? 'ru'}
                            onChange={(e) => void zmien(u, { od_zera_jezyk: e.target.value as JezykOZ })}
                            className="rounded-md border border-gray-200 bg-white px-1.5 py-0.5 text-xs text-gray-600"
                          >
                            <option value="ru">podpowiedzi: rosyjski</option>
                            <option value="ua">podpowiedzi: ukraiński</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 font-mono text-gray-700">
                        {u.login ?? '-'}
                        <div className="text-xs">{hasla[u.id] ?? <span className="font-sans text-gray-400">hasło na kartce</span>}</div>
                      </td>
                      <td className="px-3 py-2.5">
                        <select
                          aria-label={`Tryb kursu: ${nazwa(u)}`}
                          value={u.od_zera ?? 'lekcja'}
                          onChange={(e) => void zmien(u, { od_zera: e.target.value as Tryb })}
                          className="rounded-md border border-gray-200 bg-white px-1.5 py-1 text-xs text-gray-700"
                        >
                          <option value="lekcja">na lekcjach</option>
                          <option value="dom">w domu</option>
                        </select>
                        {u.od_zera === 'lekcja' && (
                          <label className="mt-1 block text-xs text-gray-500">
                            od{' '}
                            <input
                              type="date"
                              value={u.od_zera_start ?? ''}
                              onChange={(e) => void zmien(u, { od_zera_start: e.target.value || null })}
                              className="rounded border border-gray-200 px-1 py-0.5 text-xs text-gray-700"
                            />
                          </label>
                        )}
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="font-medium text-gray-900">
                          {teraz ? (
                            <>
                              {teraz.nr}. {teraz.tytul.pl}
                            </>
                          ) : zrobione === LEKCJE.length ? (
                            'wszystko zrobione'
                          ) : (
                            <span className="text-gray-500">czeka na godzinę polskiego</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          zrobione {zrobione}
                          {odbl !== null && <> · otwarte {odbl}</>}
                          {u.od_zera === 'lekcja' && p?.nastepna && <> · następna {dzienGodzina(p.nastepna)}</>}
                        </div>
                        {u.od_zera === 'lekcja' && (
                          <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                            <button
                              type="button"
                              className={btnKwadrat}
                              title="Zamknij jedną lekcję (np. lekcji polskiego nie było)"
                              aria-label="Jedna lekcja mniej"
                              onClick={() => void zmien(u, { od_zera_przesuniecie: (u.od_zera_przesuniecie ?? 0) - 1 })}
                            >
                              −
                            </button>
                            <button
                              type="button"
                              className={btnKwadrat}
                              title="Otwórz następną lekcję teraz"
                              aria-label="Odblokuj lekcję"
                              onClick={() => void zmien(u, { od_zera_przesuniecie: (u.od_zera_przesuniecie ?? 0) + 1 })}
                            >
                              +
                            </button>
                            <span>
                              przesunięcie {(u.od_zera_przesuniecie ?? 0) > 0 ? '+' : ''}
                              {u.od_zera_przesuniecie ?? 0}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2.5">
                        {lekcyjne.length ? (
                          <button
                            type="button"
                            onClick={() => setOtwarte(otwarte === u.id ? null : u.id)}
                            className={`rounded-md px-2 py-1 text-left font-semibold hover:ring-1 hover:ring-gray-300 ${maks && pkt / maks >= 0.8 ? 'bg-green-50 text-green-800' : 'bg-amber-50 text-amber-800'}`}
                          >
                            {maks ? Math.round((pkt / maks) * 100) : 0}% od razu
                            <span className="block text-xs font-normal text-gray-500">
                              {minuty} min{ostatnio ? ` · ostatnio ${krotkaData(ostatnio)}` : ''}
                            </span>
                          </button>
                        ) : (
                          <span className="text-gray-400">jeszcze nic</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5">
                        {klopoty.length ? (
                          <span className="flex flex-wrap gap-1">
                            {klopoty.map((f) => {
                              const k = KARTY.get(f.item)!;
                              return (
                                <span key={f.item} className="rounded bg-red-50 px-1.5 py-0.5 text-xs text-red-800" title={`${f.bledy} błędów`}>
                                  {k.e} {k.pl}
                                </span>
                              );
                            })}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="space-x-3 whitespace-nowrap px-3 py-2.5 text-right">
                        <button type="button" className={btnMaly} disabled={pracuje} onClick={() => void kartki([u])}>
                          Kartka
                        </button>
                        <button
                          type="button"
                          className={btnMaly}
                          onClick={() => {
                            if (window.confirm(`Wyłączyć kurs dla: ${nazwa(u)}? Wyniki zostają.`)) void zmien(u, { od_zera: null });
                          }}
                        >
                          Usuń z kursu
                        </button>
                      </td>
                    </tr>
                    {otwarte === u.id && (
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <td colSpan={7} className="px-4 py-3">
                          {lekcyjne.map((w) => {
                            const l = LEKCJE.find((x) => x.nr === w.lekcja);
                            return (
                              <div key={w.id} className="mb-2 last:mb-0">
                                <p className="text-xs font-semibold text-gray-600">
                                  {krotkaData(w.created_at)} · lekcja {w.lekcja}
                                  {l ? ` (${l.tytul.pl})` : ''} · {w.punkty}/{w.maks}
                                  {w.sekundy ? ` · ${Math.max(1, Math.round(w.sekundy / 60))} min` : ''}
                                </p>
                                <p className="mt-0.5 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                                  {w.bledy.length === 0 && <span className="text-green-700">bez błędów</span>}
                                  {w.bledy.map((b, i) => (
                                    <span key={i}>
                                      {b.wpisane && <span className="text-red-700 line-through">{b.wpisane}</span>} {b.wpisane ? '→ ' : ''}
                                      <span className="font-medium text-gray-900">{b.pl}</span>
                                    </span>
                                  ))}
                                </p>
                              </div>
                            );
                          })}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-2 text-xs text-gray-500">
        <button type="button" className={btnMaly} onClick={() => void wczytaj()}>
          Odśwież
        </button>
      </p>
    </section>
  );
}
