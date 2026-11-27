// Kurs "Polski krok po kroku" (zakladka Zadania domowe) - osobno od zadan calej
// klasy: kto jest na kursie, login i haslo, kartki do rozdania (po polsku i w
// jezyku ucznia), dodawanie ucznia, jezyk podpowiedzi, a pod spodem wyniki
// lekcji i bledy. Konto ucznia jest jedno (to samo co do zadan domowych) -
// kurs to tylko flaga `polski`. Strona ucznia: /uczen (src/pages/portal/Portal.tsx).

import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { getSupabase, isSupabaseConfigured } from '../../data/supabase';
import { useStore } from '../../data/store';
import type { Student } from '../../data/types';
import { JEZYKI, dostepneLekcje, DYKTANDA, type Jezyk } from '../../data/dyktanda';
import { toDateKey } from '../../lib/dates';
import { decryptStudentText } from '../../lib/studentCrypto';
import { Select } from '../ui/Select';
import { LINK_PORTALU, noweHasloPortalu, nowyLogin, zapiszKopieHasla } from '../portal/KontaPanel';

interface UczenDyktanda {
  id: string;
  /** Imie z czasow przed portalem (0042) - po dopasowaniu do dziennika czyscimy je. */
  imie: string | null;
  login?: string | null;
  polski?: boolean;
  aktywny: boolean;
  jezyk?: Jezyk;
  student_id?: string | null;
  class_id?: string | null;
  haslo_szyfr?: string | null;
}

interface KartkaKursu {
  imie: string;
  login: string;
  haslo: string;
  jezyk: Jezyk;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const NAPISY_KARTKI: Record<Jezyk, { tytul: string; wejdz: string; login: string; haslo: string; stopka: string }> = {
  ua: {
    tytul: 'Польська крок за кроком',
    wejdz: 'Зайди на',
    login: 'Логін',
    haslo: 'Пароль',
    stopka: 'Щопонеділка новий урок - зроби його вдома.',
  },
  es: {
    tytul: 'Polaco paso a paso',
    wejdz: 'Entra en',
    login: 'Usuario',
    haslo: 'Contraseña',
    stopka: 'Cada lunes una lección nueva: hazla en casa.',
  },
};

/** Kartki kursu A4 (2 x 4): po polsku i w jezyku ucznia. */
function drukujKartkiKursu(kartki: KartkaKursu[]): void {
  const okno = window.open('', '_blank');
  if (!okno) return;
  const html = kartki
    .map((k) => {
      const t = NAPISY_KARTKI[k.jezyk];
      return `<div class="k">
  <div class="n">${escapeHtml(k.imie)}</div>
  <div class="t">Polski krok po kroku<span>${t.tytul}</span></div>
  <div class="r"><span>Wejdź na · ${t.wejdz}:</span><b>${LINK_PORTALU.replace('https://', '')}</b></div>
  <div class="r"><span>Login · ${t.login}:</span><b class="h">${escapeHtml(k.login)}</b></div>
  <div class="r"><span>Hasło · ${t.haslo}:</span><b class="h">${escapeHtml(k.haslo)}</b></div>
  <div class="s">Co poniedziałek nowa lekcja - zrób ją w domu.<br>${t.stopka}</div>
</div>`;
    })
    .join('');
  okno.document.write(`<!DOCTYPE html><html lang="pl"><head><meta charset="utf-8"><title>Kartki - Polski krok po kroku</title>
<style>
@page { size: A4; margin: 10mm; }
body { font-family: Arial, sans-serif; margin: 0; }
.siatka { display: grid; grid-template-columns: 1fr 1fr; }
.k { border: 1px dashed #999; padding: 6mm; height: 66mm; box-sizing: border-box; break-inside: avoid; position: relative; }
.n { position: absolute; right: 6mm; top: 6mm; font-size: 9pt; color: #666; }
.t { font-size: 14pt; font-weight: bold; margin-bottom: 3mm; }
.t span { display: block; font-size: 10pt; font-weight: normal; color: #444; }
.r { font-size: 10pt; margin: 1.8mm 0; display: flex; gap: 3mm; align-items: baseline; }
.r b { font-size: 12pt; }
.r b.h { font-size: 17pt; letter-spacing: 1px; font-family: 'Courier New', monospace; }
.s { margin-top: 2mm; font-size: 8.5pt; color: #444; }
</style></head><body><div class="siatka">${html}</div>
<script>window.onload = () => window.print();</script></body></html>`);
  okno.document.close();
}

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

/**
 * Imie na dawnej liscie /dyktando: samo imie, a przy tym samym imieniu
 * w klasie albo na liscie - z pierwsza litera nazwiska ("Daniel K.").
 * Zostaje do dopasowania starych kont do dziennika.
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

const btnMaly = 'text-xs font-medium text-gray-500 hover:text-gray-900 hover:underline disabled:opacity-50';
const btn =
  'inline-flex min-h-10 items-center justify-center rounded-md border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500 disabled:cursor-not-allowed disabled:opacity-50';

/** klasaId - pokazuj tylko uczniow tej klasy (null = wszystkich). */
export function DyktandaPanel({ klasaId = null }: { klasaId?: string | null }) {
  const [uczniowie, setUczniowie] = useState<UczenDyktanda[] | null>(null);
  const [wyniki, setWyniki] = useState<WynikDyktanda[]>([]);
  const [blad, setBlad] = useState<string | null>(null);
  const [otwarte, setOtwarte] = useState<string | null>(null);
  const [hasla, setHasla] = useState<Record<string, string>>({});
  const [pracuje, setPracuje] = useState(false);
  const [nowyUczen, setNowyUczen] = useState('');
  const [nowyJezyk, setNowyJezyk] = useState<Jezyk>('ua');
  const classes = useStore((s) => s.classes);
  const students = useStore((s) => s.students);
  const uczniowieKlasy = useMemo(
    () => students.filter((s) => s.classId === klasaId && s.active).sort((a, b) => a.number - b.number),
    [students, klasaId],
  );

  const wczytaj = useCallback(async () => {
    const sb = getSupabase();
    const [u, w] = await Promise.all([
      sb.from('dyktando_uczniowie').select('*'),
      sb.from('dyktando_wyniki').select('*').order('created_at', { ascending: false }),
    ]);
    if (u.error || w.error) {
      setBlad('Nie udało się wczytać wyników kursu.');
      return;
    }
    setBlad(null);
    const lista = (u.data ?? []) as UczenDyktanda[];
    setUczniowie(lista);
    setWyniki(((w.data ?? []) as WynikDyktanda[]).filter((x) => !x.lekcja.startsWith('zd:')));
    const odszyfrowane: Record<string, string> = {};
    for (const konto of lista) {
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

  // Konta sprzed portalu maja tylko imie - dopasowujemy je do dziennika (tylko
  // jednoznaczne trafienia), a potem kasujemy imie z bazy.
  useEffect(() => {
    if (!uczniowie || students.length === 0) return;
    const bezUcznia = uczniowie.filter((u) => u.aktywny && u.imie && !u.student_id);
    const doWyczyszczenia = uczniowie.filter((u) => u.imie && u.student_id && 'login' in u);
    if (bezUcznia.length === 0 && doWyczyszczenia.length === 0) return;
    void (async () => {
      let zmiana = false;
      const sb = getSupabase();
      for (const u of bezUcznia) {
        const trafienia = students.filter((s) => {
          if (!s.active) return false;
          const klasa = students.filter((x) => x.classId === s.classId && x.active);
          return imieNaListe(s, klasa, []) === u.imie || s.firstName.trim() === u.imie;
        });
        if (trafienia.length !== 1) continue;
        const zmiany: Record<string, string | null> = { student_id: trafienia[0].id, class_id: trafienia[0].classId };
        // Po migracji 0044 imie moze byc puste - wtedy je kasujemy.
        if ('login' in u) zmiany.imie = null;
        const { error } = await sb.from('dyktando_uczniowie').update(zmiany).eq('id', u.id);
        if (!error) zmiana = true;
      }
      for (const u of doWyczyszczenia) {
        const { error } = await sb.from('dyktando_uczniowie').update({ imie: null }).eq('id', u.id);
        if (!error) zmiana = true;
      }
      if (zmiana) await wczytaj();
    })();
  }, [uczniowie, students, wczytaj]);

  if (!isSupabaseConfigured()) return null;

  const nazwaKlasy = (id?: string | null) => classes.find((c) => c.id === id)?.name ?? '';
  const nazwa = (u: UczenDyktanda) => {
    const s = students.find((x) => x.id === u.student_id);
    return s ? `${s.firstName} ${s.lastName}` : u.imie ?? u.login ?? '?';
  };
  const aktywni = (uczniowie ?? []).filter((u) => u.aktywny && u.polski !== false && (!klasaId || u.class_id === klasaId));
  const { dostepne } = dostepneLekcje(toDateKey(new Date()));
  const lekcje = dostepne.length ? dostepne : DYKTANDA.slice(0, 1);

  async function ustawJezyk(u: UczenDyktanda, jezyk: Jezyk) {
    const { error } = await getSupabase().from('dyktando_uczniowie').update({ jezyk }).eq('id', u.id);
    if (error) setBlad('Nie udało się zmienić języka.');
    await wczytaj();
  }

  const imie = (u: UczenDyktanda) => students.find((x) => x.id === u.student_id)?.firstName ?? '';

  /** Kartki: znane hasla drukujemy, a kto ma haslo tylko na starej kartce - dostaje nowe. */
  async function kartki(lista: UczenDyktanda[]) {
    const bezHasla = lista.filter((u) => !hasla[u.id]);
    if (bezHasla.length && !window.confirm(`Nowe hasło dostanie ${bezHasla.length} os. (stare kartki przestaną działać). Drukować?`)) return;
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
    drukujKartkiKursu(
      lista
        .filter((u) => u.login && znane[u.id])
        .map((u) => ({ imie: imie(u), login: u.login!, haslo: znane[u.id], jezyk: u.jezyk ?? 'ua' })),
    );
    await wczytaj();
  }

  /** Dodaje ucznia do kursu: wlacza kurs na jego koncie albo zaklada konto. */
  async function dodajDoKursu() {
    const uczen = uczniowieKlasy.find((s) => s.id === nowyUczen);
    if (!uczen) return;
    setPracuje(true);
    const istniejace = (uczniowie ?? []).find((u) => u.student_id === uczen.id && u.aktywny);
    if (istniejace) {
      await getSupabase().from('dyktando_uczniowie').update({ polski: true, jezyk: nowyJezyk }).eq('id', istniejace.id);
    } else {
      const zajete = new Set((uczniowie ?? []).map((u) => (u.login ?? '').toLowerCase()).filter(Boolean));
      const login = nowyLogin(zajete);
      const haslo = noweHasloPortalu();
      const { data: id, error } = await getSupabase().rpc('portal_dodaj_konto', {
        p_login: login,
        p_haslo: haslo,
        p_student_id: uczen.id,
        p_class_id: uczen.classId,
        p_jezyk: nowyJezyk,
        p_polski: true,
      });
      if (error) setBlad('Nie udało się założyć konta.');
      else await zapiszKopieHasla(id as string, haslo);
    }
    setNowyUczen('');
    setPracuje(false);
    await wczytaj();
  }

  async function usunZKursu(u: UczenDyktanda) {
    if (!window.confirm(`Wyłączyć kurs dla: ${nazwa(u)}? Konto do zadań domowych i wyniki zostają.`)) return;
    await getSupabase().from('dyktando_uczniowie').update({ polski: false }).eq('id', u.id);
    await wczytaj();
  }

  return (
    <section className="max-w-4xl">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        {klasaId ? (
          <div className="flex flex-wrap items-end gap-2">
            <label className="text-sm text-gray-700">
              Dodaj do kursu
              <Select className="mt-1 min-w-56" value={nowyUczen} onChange={(e) => setNowyUczen(e.target.value)}>
                <option value="">- wybierz ucznia -</option>
                {uczniowieKlasy.map((s) => {
                  const juz = aktywni.some((u) => u.student_id === s.id);
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
              Podpowiedzi
              <Select className="mt-1" value={nowyJezyk} onChange={(e) => setNowyJezyk(e.target.value as Jezyk)}>
                {JEZYKI.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.nazwa}
                  </option>
                ))}
              </Select>
            </label>
            <button type="button" className={btn} disabled={!nowyUczen || pracuje} onClick={() => void dodajDoKursu()}>
              Dodaj
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Wybierz klasę na górze, żeby dodać ucznia do kursu.</p>
        )}
        <button type="button" className={btn} disabled={pracuje || aktywni.length === 0} onClick={() => void kartki(aktywni)}>
          Kartki dla kursu ({aktywni.length})
        </button>
      </div>
      {blad && <p className="mb-3 text-sm text-red-700">{blad}</p>}
      {uczniowie && (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-4 py-2">Uczeń</th>
                <th className="px-3 py-2">Login</th>
                <th className="px-3 py-2">Hasło</th>
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
                  <td colSpan={lekcje.length + 5} className="px-4 py-4 text-gray-500">
                    {klasaId ? 'Nikt z tej klasy nie ma kursu - włącz go przy koncie ucznia.' : 'Nikt nie ma jeszcze kursu.'}
                  </td>
                </tr>
              )}
              {aktywni.map((u) => (
                <Fragment key={u.id}>
                  <tr className="border-b border-gray-100 last:border-b-0">
                    <td className="px-4 py-2.5 font-medium text-gray-900">
                      {nazwa(u)}
                      {!klasaId && u.class_id && <span className="ml-2 text-xs font-normal text-gray-500">{nazwaKlasy(u.class_id)}</span>}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-gray-700">{u.login ?? '-'}</td>
                    <td className="px-3 py-2.5 font-mono text-gray-700">
                      {hasla[u.id] ?? <span className="font-sans text-xs text-gray-400">stara kartka</span>}
                    </td>
                    <td className="px-3 py-2.5">
                      <select
                        aria-label={`Język podpowiedzi: ${nazwa(u)}`}
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
                      <button type="button" className={btnMaly} disabled={pracuje} onClick={() => void kartki([u])}>
                        Kartka
                      </button>
                      <button type="button" className={btnMaly} onClick={() => void usunZKursu(u)}>
                        Usuń z kursu
                      </button>
                    </td>
                  </tr>
                  {lekcje.map((l) => {
                    if (otwarte !== `${u.id}:${l.id}`) return null;
                    const proby = wyniki.filter((w) => w.uczen_id === u.id && w.lekcja === l.id);
                    return (
                      <tr key={`${l.id}-bledy`} className="border-b border-gray-100 bg-gray-50">
                        <td colSpan={lekcje.length + 5} className="px-4 py-3">
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
      <p className="mt-2 text-xs text-gray-500">
        <button type="button" className={btnMaly} onClick={() => void wczytaj()}>Odśwież</button>
      </p>
    </section>
  );
}
