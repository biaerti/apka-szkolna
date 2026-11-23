// Dyktanda dla uczniow z innym jezykiem ojczystym - widok nauczyciela (zakladka
// Zadania domowe). Kto zrobil ktora lekcje, z jakim wynikiem i jakie byly bledy;
// dodawanie uczniow z dziennika, jezyk podpowiedzi (ukrainski / hiszpanski), nowe
// hasla i kartki z haslami do wydruku. Strona ucznia: /dyktando.

import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { getSupabase, isSupabaseConfigured } from '../../data/supabase';
import { useStore } from '../../data/store';
import { Select } from '../ui/Select';
import type { Student } from '../../data/types';
import { DYKTANDA, JEZYKI, dostepneLekcje, type Jezyk } from '../../data/dyktanda';
import { toDateKey } from '../../lib/dates';
import { copyToClipboard } from '../../lib/clipboard';

export const LINK_DYKTANDA = 'https://szkola.klippi.pl/dyktando';

interface UczenDyktanda {
  id: string;
  imie: string;
  aktywny: boolean;
  /** Kolumny z migracji 0043 - przed nia ich nie ma. */
  jezyk?: Jezyk;
  student_id?: string | null;
  class_id?: string | null;
}

const BRAK_0043 =
  'W bazie brakuje migracji 0043 (język i klasa) - wklej supabase/migrations/0043_dyktanda_jezyk_klasa.sql w Supabase.';

interface WynikDyktanda {
  id: string;
  uczen_id: string;
  lekcja: string;
  punkty: number;
  maks: number;
  bledy: Array<{ wzor: string; wpisane: string | null }>;
  sekundy: number | null;
  created_at: string;
}

// Proste slowa bez polskich znakow - latwo przepisac z kartki na kazdej klawiaturze.
const SLOWA_HASEL = [
  'kot', 'las', 'dom', 'sok', 'lew', 'mak', 'nos', 'ser', 'rak', 'sowa', 'lis', 'kino', 'lato',
  'mapa', 'rower', 'banan', 'zebra', 'tygrys', 'lampa', 'mleko', 'ryba', 'pies', 'sanki', 'okno',
  'kawa', 'zupa', 'arbuz', 'balon', 'motyl', 'kubek', 'tort', 'pizza', 'robot', 'pilot', 'radio',
];

export function noweHaslo(): string {
  const los = new Uint32Array(2);
  crypto.getRandomValues(los);
  return `${SLOWA_HASEL[los[0] % SLOWA_HASEL.length]}${100 + (los[1] % 900)}`;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/** Kartki A4 do przeciecia (2 x 4), otwiera okno wydruku. */
export function drukujKartki(kartki: Array<{ imie: string; haslo: string }>): void {
  const okno = window.open('', '_blank');
  if (!okno) return;
  const html = kartki
    .map(
      (k) => `<div class="k">
  <div class="t">Dyktanda · Диктанти</div>
  <div class="r"><span>1. Wejdź na · Зайди на:</span><b>${LINK_DYKTANDA.replace('https://', '')}</b></div>
  <div class="r"><span>2. Wybierz imię · Обери ім’я:</span><b>${escapeHtml(k.imie)}</b></div>
  <div class="r"><span>3. Hasło · Пароль:</span><b class="h">${escapeHtml(k.haslo)}</b></div>
  <div class="s">Co poniedziałek nowa lekcja - zrób ją w domu.<br>Щопонеділка новий урок - зроби його вдома.</div>
</div>`,
    )
    .join('');
  okno.document.write(`<!DOCTYPE html><html lang="pl"><head><meta charset="utf-8"><title>Kartki - dyktanda</title>
<style>
@page { size: A4; margin: 10mm; }
body { font-family: Arial, sans-serif; margin: 0; }
.siatka { display: grid; grid-template-columns: 1fr 1fr; }
.k { border: 1px dashed #999; padding: 6mm; height: 62mm; box-sizing: border-box; break-inside: avoid; }
.t { font-size: 15pt; font-weight: bold; margin-bottom: 3mm; }
.r { font-size: 10.5pt; margin: 2mm 0; display: flex; flex-direction: column; }
.r b { font-size: 13pt; }
.r b.h { font-size: 18pt; letter-spacing: 1px; font-family: 'Courier New', monospace; }
.s { margin-top: 3mm; font-size: 9pt; color: #444; }
</style></head><body><div class="siatka">${html}</div>
<script>window.onload = () => window.print();</script></body></html>`);
  okno.document.close();
}

/**
 * Imie na publicznej liscie /dyktando: samo imie, a przy tym samym imieniu
 * w klasie albo na liscie - z pierwsza litera nazwiska ("Daniel K.").
 */
export function imieNaListe(uczen: Student, klasa: Student[], naLiscie: string[]): string {
  const imie = uczen.firstName.trim();
  const powtarza =
    klasa.some((s) => s.id !== uczen.id && s.firstName.trim() === imie) || naLiscie.includes(imie);
  const litera = uczen.lastName.trim().charAt(0).toUpperCase();
  return powtarza && litera ? `${imie} ${litera}.` : imie;
}

const krotkaData = (iso: string) => {
  const d = new Date(iso);
  return `${d.getDate()}.${String(d.getMonth() + 1).padStart(2, '0')}`;
};

const btn =
  'inline-flex min-h-10 items-center justify-center rounded-md border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500 disabled:cursor-not-allowed disabled:opacity-50';
const btnMaly = 'text-xs font-medium text-gray-500 hover:text-gray-900 hover:underline';

/** klasaId - pokazuj tylko uczniow tej klasy (null = wszystkich). */
export function DyktandaPanel({ klasaId = null }: { klasaId?: string | null }) {
  const [uczniowie, setUczniowie] = useState<UczenDyktanda[] | null>(null);
  const [wyniki, setWyniki] = useState<WynikDyktanda[]>([]);
  const [blad, setBlad] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [otwarte, setOtwarte] = useState<string | null>(null);
  const [dodawanie, setDodawanie] = useState(false);
  const classes = useStore((s) => s.classes);
  const students = useStore((s) => s.students);
  const domyslnaKlasa = classes.find((c) => c.name.replace(/\s/g, '').toUpperCase() === 'VA')?.id ?? classes[0]?.id ?? '';
  const [klasaFormularza, setKlasaFormularza] = useState('');
  const [uczenId, setUczenId] = useState('');
  const [jezykNowego, setJezykNowego] = useState<Jezyk>('ua');
  const wybranaKlasa = klasaFormularza || (klasaId ?? domyslnaKlasa);
  const uczniowieKlasy = useMemo(
    () =>
      students
        .filter((s) => s.classId === wybranaKlasa && s.active)
        .sort((a, b) => a.number - b.number),
    [students, wybranaKlasa],
  );

  const wczytaj = useCallback(async () => {
    const sb = getSupabase();
    const [u, w] = await Promise.all([
      sb.from('dyktando_uczniowie').select('*').order('imie'),
      sb.from('dyktando_wyniki').select('*').order('created_at', { ascending: false }),
    ]);
    if (u.error || w.error) {
      setBlad('Nie udało się wczytać dyktand (czy migracja 0042 jest w bazie?).');
      return;
    }
    setBlad(null);
    setUczniowie((u.data ?? []) as UczenDyktanda[]);
    setWyniki((w.data ?? []) as WynikDyktanda[]);
  }, []);

  useEffect(() => {
    if (isSupabaseConfigured()) void wczytaj();
  }, [wczytaj]);

  // Uczniowie dodani przed migracja 0043 nie maja klasy - dopasowujemy po imieniu
  // z dziennika (tylko jednoznaczne trafienia) i zapisujemy raz.
  useEffect(() => {
    if (!uczniowie || students.length === 0) return;
    const bezKlasy = uczniowie.filter((u) => u.aktywny && 'student_id' in u && !u.student_id);
    if (bezKlasy.length === 0) return;
    void (async () => {
      let zmiana = false;
      for (const u of bezKlasy) {
        const trafienia = students.filter((s) => {
          if (!s.active) return false;
          const klasa = students.filter((x) => x.classId === s.classId && x.active);
          return imieNaListe(s, klasa, []) === u.imie || s.firstName.trim() === u.imie;
        });
        if (trafienia.length !== 1) continue;
        const { error } = await getSupabase()
          .from('dyktando_uczniowie')
          .update({ student_id: trafienia[0].id, class_id: trafienia[0].classId })
          .eq('id', u.id);
        if (!error) zmiana = true;
      }
      if (zmiana) await wczytaj();
    })();
  }, [uczniowie, students, wczytaj]);

  if (!isSupabaseConfigured()) return null;

  const nazwaKlasy = (id?: string | null) => classes.find((c) => c.id === id)?.name ?? '';
  const aktywni = (uczniowie ?? []).filter((u) => u.aktywny && (!klasaId || u.class_id === klasaId));
  const { dostepne } = dostepneLekcje(toDateKey(new Date()));
  const lekcje = dostepne.length ? dostepne : DYKTANDA.slice(0, 1);

  async function dodaj() {
    const uczen = uczniowieKlasy.find((x) => x.id === uczenId);
    if (!uczen) return;
    const imie = imieNaListe(uczen, uczniowieKlasy, aktywni.map((u) => u.imie));
    const haslo = noweHaslo();
    const { data: nowyId, error } = await getSupabase().rpc('dyktando_dodaj_ucznia', { p_imie: imie, p_haslo: haslo });
    if (error) return setInfo('Nie udało się dodać ucznia.');
    const { error: bladKlasy } = await getSupabase()
      .from('dyktando_uczniowie')
      .update({ jezyk: jezykNowego, student_id: uczen.id, class_id: uczen.classId })
      .eq('id', nowyId as string);
    setUczenId('');
    setInfo(bladKlasy ? `Dodano: ${imie}. ${BRAK_0043}` : `Dodano: ${imie}.`);
    await wczytaj();
    drukujKartki([{ imie, haslo }]);
  }

  async function haslaDla(lista: UczenDyktanda[]) {
    const kartki: Array<{ imie: string; haslo: string }> = [];
    for (const u of lista) {
      const haslo = noweHaslo();
      const { error } = await getSupabase().rpc('dyktando_ustaw_haslo', { p_id: u.id, p_haslo: haslo });
      if (error) return setInfo(`Nie udało się zmienić hasła: ${u.imie}.`);
      kartki.push({ imie: u.imie, haslo });
    }
    drukujKartki(kartki);
  }

  async function wszystkieKartki() {
    if (!window.confirm('Każdy uczeń dostanie NOWE hasło (stare przestanie działać). Wydrukować kartki?')) return;
    await haslaDla(aktywni);
  }

  async function zmienImie(u: UczenDyktanda) {
    const imie = window.prompt('Nowe imię na liście:', u.imie)?.trim();
    if (!imie || imie === u.imie) return;
    const { error } = await getSupabase().from('dyktando_uczniowie').update({ imie }).eq('id', u.id);
    if (error) setInfo('Nie udało się zmienić imienia.');
    await wczytaj();
  }

  async function ustawJezyk(u: UczenDyktanda, jezyk: Jezyk) {
    const { error } = await getSupabase().from('dyktando_uczniowie').update({ jezyk }).eq('id', u.id);
    if (error) setInfo(BRAK_0043);
    await wczytaj();
  }

  async function usun(u: UczenDyktanda) {
    if (!window.confirm(`Zdjąć ${u.imie} z listy? Wyniki zostają w bazie.`)) return;
    await getSupabase().from('dyktando_uczniowie').update({ aktywny: false }).eq('id', u.id);
    await wczytaj();
  }

  async function kopiuj() {
    const ok = await copyToClipboard(LINK_DYKTANDA);
    setInfo(ok ? 'Link skopiowany.' : LINK_DYKTANDA);
  }

  return (
    <section aria-labelledby="dyktanda-heading" className="max-w-4xl">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h3 id="dyktanda-heading" className="text-base font-semibold text-gray-900">
            Dyktanda online
          </h3>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Co poniedziałek nowa lekcja pisowni pod{' '}
            <a href="/dyktando" target="_blank" rel="noreferrer" className="font-medium text-accent-700 underline">
              szkola.klippi.pl/dyktando
            </a>
            : wstęp z lektorką, ćwiczenie, słowa, dyktando zdań i test na koniec. Podpowiedzi po ukraińsku albo hiszpańsku, według języka ucznia.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button type="button" className={btn} onClick={kopiuj}>Kopiuj link</button>
          <button type="button" className={btn} onClick={() => setDodawanie((v) => !v)} aria-expanded={dodawanie}>
            Dodaj ucznia
          </button>
          <button type="button" className={btn} onClick={wszystkieKartki} disabled={aktywni.length === 0}>
            Kartki z hasłami
          </button>
        </div>
      </div>
      {dodawanie && (
        <div className="mb-4 flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-end">
          <label className="text-sm text-gray-700 sm:w-32">
            Klasa
            <Select
              className="mt-1"
              value={wybranaKlasa}
              onChange={(e) => {
                setKlasaFormularza(e.target.value);
                setUczenId('');
              }}
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </label>
          <label className="flex-1 text-sm text-gray-700">
            Uczeń
            <Select className="mt-1" value={uczenId} onChange={(e) => setUczenId(e.target.value)}>
              <option value="">- wybierz -</option>
              {uczniowieKlasy.map((s) => {
                const juz = aktywni.some((u) => u.imie === imieNaListe(s, uczniowieKlasy, []));
                return (
                  <option key={s.id} value={s.id} disabled={juz}>
                    {s.number}. {s.lastName} {s.firstName}{juz ? ' (już jest)' : ''}
                  </option>
                );
              })}
            </Select>
          </label>
          <label className="text-sm text-gray-700 sm:w-36">
            Podpowiedzi
            <Select className="mt-1" value={jezykNowego} onChange={(e) => setJezykNowego(e.target.value as Jezyk)}>
              {JEZYKI.map((j) => (
                <option key={j.id} value={j.id}>{j.nazwa}</option>
              ))}
            </Select>
          </label>
          <button type="button" className={btn} onClick={dodaj} disabled={!uczenId}>
            Dodaj i drukuj kartkę
          </button>
        </div>
      )}
      {blad && <p className="mb-3 text-sm text-red-700">{blad}</p>}
      {info && <p className="mb-3 text-sm text-gray-600">{info}</p>}

      {uczniowie && (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-4 py-2">Uczeń</th>
                <th className="px-3 py-2">Podpowiedzi</th>
                {lekcje.map((l) => (
                  <th key={l.id} className="px-3 py-2">
                    {l.nr}. {l.temat}
                  </th>
                ))}
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {aktywni.length === 0 && (
                <tr>
                  <td colSpan={lekcje.length + 3} className="px-4 py-4 text-gray-500">
                    {klasaId ? 'Nikt z tej klasy nie robi dyktand.' : 'Nikogo jeszcze nie ma - dodaj uczniów.'}
                  </td>
                </tr>
              )}
              {aktywni.map((u) => (
                <Fragment key={u.id}>
                  <tr className="border-b border-gray-100 last:border-b-0">
                    <td className="px-4 py-2.5 font-medium text-gray-900">
                      {u.imie}
                      {!klasaId && u.class_id && (
                        <span className="ml-2 text-xs font-normal text-gray-500">{nazwaKlasy(u.class_id)}</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      <select
                        aria-label={`Język podpowiedzi: ${u.imie}`}
                        value={u.jezyk ?? 'ua'}
                        onChange={(e) => void ustawJezyk(u, e.target.value as Jezyk)}
                        className="rounded-md border border-gray-200 bg-white px-1.5 py-1 text-xs text-gray-700"
                      >
                        {JEZYKI.map((j) => (
                          <option key={j.id} value={j.id}>{j.nazwa}</option>
                        ))}
                      </select>
                    </td>
                    {lekcje.map((l) => {
                      const proby = wyniki.filter((w) => w.uczen_id === u.id && w.lekcja === l.id);
                      const klucz = `${u.id}:${l.id}`;
                      if (proby.length === 0) {
                        return (
                          <td key={l.id} className="px-3 py-2.5 text-gray-400">
                            nie zrobił(a)
                          </td>
                        );
                      }
                      const najlepsza = [...proby].sort((a, b) => b.punkty / b.maks - a.punkty / a.maks)[0];
                      const procent = najlepsza.punkty / najlepsza.maks;
                      return (
                        <td key={l.id} className="px-3 py-2.5">
                          <button
                            type="button"
                            onClick={() => setOtwarte(otwarte === klucz ? null : klucz)}
                            className={`rounded-md px-2 py-1 text-left font-semibold ${procent >= 0.8 ? 'bg-green-50 text-green-800' : 'bg-amber-50 text-amber-800'} hover:ring-1 hover:ring-gray-300`}
                          >
                            {najlepsza.punkty}/{najlepsza.maks}
                            <span className="ml-1.5 text-xs font-normal text-gray-500">
                              {krotkaData(proby[0].created_at)}
                              {proby.length > 1 ? ` · ${proby.length}×` : ''}
                            </span>
                          </button>
                        </td>
                      );
                    })}
                    <td className="space-x-3 whitespace-nowrap px-3 py-2.5 text-right">
                      <button type="button" className={btnMaly} onClick={() => haslaDla([u])}>Nowe hasło</button>
                      <button type="button" className={btnMaly} onClick={() => zmienImie(u)}>Imię</button>
                      <button type="button" className={btnMaly} onClick={() => usun(u)}>Usuń</button>
                    </td>
                  </tr>
                  {lekcje.map((l) => {
                    if (otwarte !== `${u.id}:${l.id}`) return null;
                    const proby = wyniki.filter((w) => w.uczen_id === u.id && w.lekcja === l.id);
                    return (
                      <tr key={`${l.id}-bledy`} className="border-b border-gray-100 bg-gray-50">
                        <td colSpan={lekcje.length + 3} className="px-4 py-3">
                          {proby.map((p) => (
                            <div key={p.id} className="mb-2 last:mb-0">
                              <p className="text-xs font-semibold text-gray-600">
                                {krotkaData(p.created_at)} · {p.punkty}/{p.maks}
                                {p.sekundy ? ` · ${Math.round(p.sekundy / 60)} min` : ''}
                              </p>
                              <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                                {p.bledy.length === 0 && <span className="text-green-700">bez błędów</span>}
                                {p.bledy.map((b, i) => (
                                  <span key={i}>
                                    <span className="text-red-700 line-through">{b.wpisane ?? '(pominięte)'}</span>{' '}
                                    → <span className="font-medium text-gray-900">{b.wzor}</span>
                                  </span>
                                ))}
                              </p>
                            </div>
                          ))}
                        </td>
                      </tr>
                    );
                  })}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
