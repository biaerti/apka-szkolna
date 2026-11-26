// Konta uczniow do portalu /uczen (zakladka Zadania domowe). W bazie konto ma
// tylko login, hash hasla i student_id - imie i nazwisko widac wylacznie tutaj,
// bo dziennik w apce jest odszyfrowany kluczem Bartka.
//
// "Załóż konta" daje kazdemu uczniowi klasy login (np. lis27) i haslo. Haslo
// widac tylko raz, zaraz po zalozeniu albo zmianie: wtedy kartki do druku
// i gotowe wiadomosci do rodzicow (do wklejenia w VULCANIE, kazdy rodzic
// dostaje tylko dane swojego dziecka).

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getSupabase, isSupabaseConfigured } from '../../data/supabase';
import { useStore } from '../../data/store';
import { JEZYKI, type Jezyk } from '../../data/dyktanda';
import { copyToClipboard } from '../../lib/clipboard';
import { stanWyzwania, CEL_TYGODNIA } from '../../lib/wyzwanie';
import type { Student } from '../../data/types';

export const LINK_PORTALU = 'https://szkola.klippi.pl/uczen';

export interface KontoPortalu {
  id: string;
  login: string | null;
  imie: string | null;
  aktywny: boolean;
  jezyk: Jezyk;
  polski: boolean;
  student_id: string | null;
  class_id: string | null;
}

interface WynikKonta {
  uczen_id: string;
  lekcja: string;
  punkty: number;
  maks: number;
  created_at: string;
}

interface NoweHaslo {
  uczen: Student;
  login: string;
  haslo: string;
}

const ZWIERZETA = ['lis', 'sowa', 'kot', 'rys', 'foka', 'bobr', 'jez', 'orzel', 'wilk', 'zubr', 'lew', 'zebra', 'panda', 'delfin', 'koala', 'kruk', 'dzik', 'los', 'mors', 'pingwin'];
const SLOWA_HASEL = [
  'kot', 'las', 'dom', 'sok', 'lew', 'mak', 'nos', 'ser', 'rak', 'sowa', 'lis', 'kino', 'lato',
  'mapa', 'rower', 'banan', 'zebra', 'tygrys', 'lampa', 'mleko', 'ryba', 'pies', 'sanki', 'okno',
  'kawa', 'zupa', 'arbuz', 'balon', 'motyl', 'kubek', 'tort', 'pizza', 'robot', 'pilot', 'radio',
];

function losowa(n: number): number {
  const los = new Uint32Array(1);
  crypto.getRandomValues(los);
  return los[0] % n;
}

export function noweHasloPortalu(): string {
  return `${SLOWA_HASEL[losowa(SLOWA_HASEL.length)]}${100 + losowa(900)}`;
}

/** Login, ktorego jeszcze nie ma (zwierze + liczba 10-99). */
export function nowyLogin(zajete: Set<string>): string {
  for (let i = 0; i < 500; i++) {
    const kandydat = `${ZWIERZETA[losowa(ZWIERZETA.length)]}${10 + losowa(90)}`;
    if (!zajete.has(kandydat)) return kandydat;
  }
  throw new Error('Brak wolnych loginów');
}

export function wiadomoscDoRodzica(uczen: Pick<Student, 'firstName'>, login: string, haslo: string): string {
  return [
    'Dzień dobry,',
    '',
    `${uczen.firstName.trim()} może robić w domu krótkie zadania z lekcji polskiego. Są nieobowiązkowe: to powtórka tego, co było na lekcji, przydaje się też po nieobecności. Zadania pojawiają się same po każdej lekcji i sprawdzają się od razu.`,
    '',
    `Strona: ${LINK_PORTALU.replace('https://', '')}`,
    `Login: ${login}`,
    `Hasło: ${haslo}`,
    '',
    'Pozdrawiam',
  ].join('\n');
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/** Kartki A4 do przeciecia (2 x 4). Na kartce bez nazwiska - imie tylko do rozdania. */
function drukujKartki(kartki: NoweHaslo[]): void {
  const okno = window.open('', '_blank');
  if (!okno) return;
  const html = kartki
    .map(
      (k) => `<div class="k">
  <div class="n">${escapeHtml(k.uczen.firstName)}</div>
  <div class="t">Zadania domowe z polskiego</div>
  <div class="r"><span>Wejdź na:</span><b>${LINK_PORTALU.replace('https://', '')}</b></div>
  <div class="r"><span>Login:</span><b class="h">${escapeHtml(k.login)}</b></div>
  <div class="r"><span>Hasło:</span><b class="h">${escapeHtml(k.haslo)}</b></div>
  <div class="s">Zadania z każdej lekcji - dla chętnych i po nieobecności.</div>
</div>`,
    )
    .join('');
  okno.document.write(`<!DOCTYPE html><html lang="pl"><head><meta charset="utf-8"><title>Kartki - zadania domowe</title>
<style>
@page { size: A4; margin: 10mm; }
body { font-family: Arial, sans-serif; margin: 0; }
.siatka { display: grid; grid-template-columns: 1fr 1fr; }
.k { border: 1px dashed #999; padding: 6mm; height: 62mm; box-sizing: border-box; break-inside: avoid; position: relative; }
.n { position: absolute; right: 6mm; top: 6mm; font-size: 9pt; color: #666; }
.t { font-size: 14pt; font-weight: bold; margin-bottom: 3mm; }
.r { font-size: 10.5pt; margin: 2mm 0; display: flex; gap: 3mm; align-items: baseline; }
.r b { font-size: 13pt; }
.r b.h { font-size: 18pt; letter-spacing: 1px; font-family: 'Courier New', monospace; }
.s { margin-top: 3mm; font-size: 9pt; color: #444; }
</style></head><body><div class="siatka">${html}</div>
<script>window.onload = () => window.print();</script></body></html>`);
  okno.document.close();
}

const btn =
  'inline-flex min-h-10 items-center justify-center rounded-md border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500 disabled:cursor-not-allowed disabled:opacity-50';
const btnMaly = 'text-xs font-medium text-gray-500 hover:text-gray-900 hover:underline';

export function KontaPanel({ klasaId }: { klasaId: string | null }) {
  const [konta, setKonta] = useState<KontoPortalu[] | null>(null);
  const [wyniki, setWyniki] = useState<WynikKonta[]>([]);
  const [blad, setBlad] = useState<string | null>(null);
  const [nowe, setNowe] = useState<NoweHaslo[]>([]);
  const [pracuje, setPracuje] = useState(false);
  const [skopiowane, setSkopiowane] = useState<string | null>(null);
  const classes = useStore((s) => s.classes);
  const students = useStore((s) => s.students);

  const uczniowie = useMemo(
    () => students.filter((s) => s.classId === klasaId && s.active).sort((a, b) => a.number - b.number),
    [students, klasaId],
  );

  const wczytaj = useCallback(async () => {
    const sb = getSupabase();
    const [k, w] = await Promise.all([
      sb.from('dyktando_uczniowie').select('*'),
      sb.from('dyktando_wyniki').select('uczen_id, lekcja, punkty, maks, created_at'),
    ]);
    if (k.error || w.error) {
      setBlad('Nie udało się wczytać kont.');
      return;
    }
    const lista = (k.data ?? []) as KontoPortalu[];
    if (lista.length && !('login' in lista[0])) {
      setBlad('W bazie brakuje migracji 0044 (portal ucznia) - wklej supabase/migrations/0044_portal_ucznia.sql w Supabase.');
    } else setBlad(null);
    setKonta(lista);
    setWyniki((w.data ?? []) as WynikKonta[]);
  }, []);

  useEffect(() => {
    if (isSupabaseConfigured()) void wczytaj();
  }, [wczytaj]);

  if (!isSupabaseConfigured()) return null;
  if (!klasaId) {
    return <p className="rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-600">Wybierz klasę na górze, żeby zobaczyć i założyć konta uczniów.</p>;
  }

  const aktywne = (konta ?? []).filter((k) => k.aktywny);
  const kontoUcznia = (s: Student) => aktywne.find((k) => k.student_id === s.id);
  const bezKonta = uczniowie.filter((s) => !kontoUcznia(s));
  const zajete = new Set((konta ?? []).map((k) => (k.login ?? '').toLowerCase()).filter(Boolean));
  const nazwaKlasy = classes.find((c) => c.id === klasaId)?.name ?? '';

  async function zalozKonta(lista: Student[]) {
    setPracuje(true);
    const utworzone: NoweHaslo[] = [];
    for (const uczen of lista) {
      const login = nowyLogin(zajete);
      zajete.add(login);
      const haslo = noweHasloPortalu();
      const { error } = await getSupabase().rpc('portal_dodaj_konto', {
        p_login: login,
        p_haslo: haslo,
        p_student_id: uczen.id,
        p_class_id: uczen.classId,
        p_jezyk: 'ua',
        p_polski: false,
      });
      if (error) {
        setBlad(`Nie udało się założyć konta: ${uczen.firstName} ${uczen.lastName}. Czy migracja 0044 jest w bazie?`);
        break;
      }
      utworzone.push({ uczen, login, haslo });
    }
    setNowe(utworzone);
    setPracuje(false);
    await wczytaj();
  }

  async function noweHasla(lista: Array<{ uczen: Student; konto: KontoPortalu }>) {
    setPracuje(true);
    const zmienione: NoweHaslo[] = [];
    for (const { uczen, konto } of lista) {
      const haslo = noweHasloPortalu();
      let login = konto.login;
      if (!login) {
        login = nowyLogin(zajete);
        zajete.add(login);
        await getSupabase().from('dyktando_uczniowie').update({ login }).eq('id', konto.id);
      }
      const { error } = await getSupabase().rpc('dyktando_ustaw_haslo', { p_id: konto.id, p_haslo: haslo });
      if (error) {
        setBlad(`Nie udało się zmienić hasła: ${uczen.firstName} ${uczen.lastName}.`);
        break;
      }
      zmienione.push({ uczen, login, haslo });
    }
    setNowe(zmienione);
    setPracuje(false);
    await wczytaj();
  }

  async function ustaw(konto: KontoPortalu, zmiana: Partial<Pick<KontoPortalu, 'polski' | 'jezyk'>>) {
    const { error } = await getSupabase().from('dyktando_uczniowie').update(zmiana).eq('id', konto.id);
    if (error) setBlad('Nie udało się zapisać zmiany.');
    await wczytaj();
  }

  async function kopiuj(tekst: string, klucz: string) {
    if (await copyToClipboard(tekst)) setSkopiowane(klucz);
  }

  const zKontem = uczniowie.flatMap((uczen) => {
    const konto = kontoUcznia(uczen);
    return konto ? [{ uczen, konto }] : [];
  });

  return (
    <section aria-labelledby="konta-heading" className="max-w-4xl">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h3 id="konta-heading" className="text-base font-semibold text-gray-900">
            Konta uczniów {nazwaKlasy}
          </h3>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Uczeń wchodzi na{' '}
            <a href="/uczen" target="_blank" rel="noreferrer" className="font-medium text-accent-700 underline">
              szkola.klippi.pl/uczen
            </a>{' '}
            loginem i hasłem. W bazie nie ma imion ani nazwisk. Hasło widać tylko raz - zaraz po założeniu konta albo zmianie hasła.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button type="button" className={btn} disabled={pracuje || bezKonta.length === 0 || !konta} onClick={() => void zalozKonta(bezKonta)}>
            {bezKonta.length ? `Załóż konta (${bezKonta.length})` : 'Wszyscy mają konta'}
          </button>
          <button
            type="button"
            className={btn}
            disabled={pracuje || zKontem.length === 0}
            onClick={() => {
              if (window.confirm(`Nowe hasła dla całej klasy ${nazwaKlasy} (${zKontem.length})? Stare przestaną działać.`)) void noweHasla(zKontem);
            }}
          >
            Nowe hasła dla klasy
          </button>
        </div>
      </div>
      {blad && <p className="mb-3 text-sm text-red-700">{blad}</p>}

      {nowe.length > 0 && (
        <div className="mb-5 rounded-xl border border-amber-300 bg-amber-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-amber-900">
              Nowe hasła ({nowe.length}) - zapisz albo roześlij teraz, potem nie będzie ich widać.
            </p>
            <div className="flex flex-wrap gap-2">
              <button type="button" className={btn} onClick={() => drukujKartki(nowe)}>Drukuj kartki</button>
              <button type="button" className={btn} onClick={() => setNowe([])}>Zamknij</button>
            </div>
          </div>
          <ul className="mt-3 divide-y divide-amber-200">
            {nowe.map((n) => (
              <li key={n.uczen.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-2 text-sm">
                <span className="w-56 font-medium text-gray-900">{n.uczen.number}. {n.uczen.lastName} {n.uczen.firstName}</span>
                <span className="font-mono">{n.login}</span>
                <span className="font-mono">{n.haslo}</span>
                <button type="button" className={btnMaly} onClick={() => void kopiuj(wiadomoscDoRodzica(n.uczen, n.login, n.haslo), n.uczen.id)}>
                  {skopiowane === n.uczen.id ? '✓ skopiowane' : 'Kopiuj wiadomość do rodzica'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {konta && (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-4 py-2">Uczeń</th>
                <th className="px-3 py-2">Login</th>
                <th className="px-3 py-2">Ten tydzień</th>
                <th className="px-3 py-2">Poziom</th>
                <th className="px-3 py-2">Polski krok po kroku</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {uczniowie.map((uczen) => {
                const konto = kontoUcznia(uczen);
                const stan = konto ? stanWyzwania(wyniki.filter((w) => w.uczen_id === konto.id)) : null;
                return (
                  <tr key={uczen.id} className="border-b border-gray-100 last:border-b-0">
                    <td className="px-4 py-2 font-medium text-gray-900">
                      {uczen.number}. {uczen.lastName} {uczen.firstName}
                    </td>
                    <td className="px-3 py-2 font-mono text-gray-700">{konto ? konto.login ?? '-' : <span className="font-sans text-gray-400">brak konta</span>}</td>
                    <td className="px-3 py-2">
                      {stan && (
                        <span className={stan.teraz >= CEL_TYGODNIA ? 'font-semibold text-green-700' : 'text-gray-700'}>
                          {stan.teraz}/{CEL_TYGODNIA}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-gray-700">{stan ? stan.zaliczone + 1 : ''}</td>
                    <td className="px-3 py-2">
                      {konto && (
                        <span className="flex items-center gap-2">
                          <input type="checkbox" checked={konto.polski} onChange={(e) => void ustaw(konto, { polski: e.target.checked })} aria-label={`Kurs polskiego: ${uczen.firstName}`} />
                          {konto.polski && (
                            <select
                              aria-label={`Język podpowiedzi: ${uczen.firstName}`}
                              value={konto.jezyk}
                              onChange={(e) => void ustaw(konto, { jezyk: e.target.value as Jezyk })}
                              className="rounded-md border border-gray-200 bg-white px-1.5 py-1 text-xs text-gray-700"
                            >
                              {JEZYKI.map((j) => (
                                <option key={j.id} value={j.id}>{j.nazwa}</option>
                              ))}
                            </select>
                          )}
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-right">
                      {konto ? (
                        <button type="button" className={btnMaly} disabled={pracuje} onClick={() => void noweHasla([{ uczen, konto }])}>Nowe hasło</button>
                      ) : (
                        <button type="button" className={btnMaly} disabled={pracuje} onClick={() => void zalozKonta([uczen])}>Załóż konto</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
