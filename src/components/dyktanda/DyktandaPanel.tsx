// Kurs "Polski krok po kroku" (zakladka Zadania domowe) - osobno od zadan calej
// klasy. Od gory: lekcja tego tygodnia (kto zrobil, kto jeszcze nie), co sprawia
// klopot calej grupie (bledy wedlug reguly), postepy kazdego ucznia z rozwijanymi
// szczegolami lekcji i uwaga dla ucznia (gotowe szablony z tlumaczeniem), a na
// dole loginy, hasla, kartki do rozdania i jezyk podpowiedzi.
// Konto ucznia jest jedno (to samo co do zadan domowych) - kurs to flaga `polski`.
// Strona ucznia: /uczen (src/pages/portal/Portal.tsx). Logika: src/lib/dyktandoPostepy.ts.

import clsx from 'clsx';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { getSupabase, isSupabaseConfigured } from '../../data/supabase';
import { useStore } from '../../data/store';
import type { Student } from '../../data/types';
import { JEZYKI, DYKTANDA, type DyktandoLekcja, type Jezyk } from '../../data/dyktanda';
import { toDateKey } from '../../lib/dates';
import {
  INNE,
  POMINIETE,
  SZABLONY_UWAG,
  bledyWgReguly,
  czasProby,
  dzienMiesiac,
  lekcjaTygodnia,
  podpowiedzSzablonu,
  podsumujProby,
  probyPoUwadze,
  procent,
  przekladUwagi,
  szablonUwagi,
  wypelnijSzablon,
  type BladKursu,
  type GrupaBledow,
  type PodsumowanieProb,
} from '../../lib/dyktandoPostepy';
import { decryptStudentText, encryptStudentText, isEncrypted } from '../../lib/studentCrypto';
import { Select } from '../ui/Select';
import { LINK_PORTALU, noweHasloPortalu, nowyLogin } from '../portal/KontaPanel';

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

interface WynikDyktanda {
  id: string;
  uczen_id: string;
  lekcja: string;
  punkty: number;
  maks: number;
  bledy: BladKursu[];
  sekundy: number | null;
  created_at: string;
}

/** Uwaga nauczyciela do lekcji ucznia (tabela dyktando_uwagi, migracja 0047). */
interface UwagaDyktanda {
  id: string;
  uczen_id: string;
  lekcja: string;
  tresc: string;
  przeklad: string | null;
  created_at: string;
  przeczytana_at: string | null;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const NAPISY_KARTKI: Record<Jezyk, { tytul: string; wejdz: string; login: string; haslo: string; stopka: string }> = {
  ua: {
    tytul: 'Польська крок за кроком',
    wejdz: 'Зайди на',
    login: 'Логін',
    haslo: 'Пароль',
    stopka: 'Щопонеділка новий урок - зроби його до неділі.',
  },
  es: {
    tytul: 'Polaco paso a paso',
    wejdz: 'Entra en',
    login: 'Usuario',
    haslo: 'Contraseña',
    stopka: 'Cada lunes una lección nueva: hazla antes del domingo.',
  },
};

/** HTML kartek kursu A4 (2 x 4): po polsku i w jezyku ucznia. */
export function htmlKartekKursu(kartki: KartkaKursu[]): string {
  const html = kartki
    .map((k) => {
      const t = NAPISY_KARTKI[k.jezyk];
      return `<div class="k">
  <div class="n">${escapeHtml(k.imie)}</div>
  <div class="t">Polski krok po kroku<span>${t.tytul}</span></div>
  <div class="r"><span>Wejdź na · ${t.wejdz}:</span><b>${LINK_PORTALU.replace('https://', '')}</b></div>
  <div class="r"><span>Login · ${t.login}:</span><b class="h">${escapeHtml(k.login)}</b></div>
  <div class="r"><span>Hasło · ${t.haslo}:</span><b class="h">${escapeHtml(k.haslo)}</b></div>
  <div class="s">Co poniedziałek nowa lekcja - zrób ją do niedzieli.<br>${t.stopka}</div>
</div>`;
    })
    .join('');
  return `<!DOCTYPE html><html lang="pl"><head><meta charset="utf-8"><title>Kartki - Polski krok po kroku</title>
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
<script>window.onload = () => window.print();</script></body></html>`;
}

/**
 * Kopia nowego hasla w bazie (zaszyfrowana kluczem Bartka). Zwraca false, gdy sie
 * nie udalo - wtedy haslo jest tylko na wydrukowanej kartce i w tej karcie przegladarki.
 */
async function zapiszKopieHaslaKursu(kontoId: string, haslo: string): Promise<boolean> {
  try {
    const szyfr = await encryptStudentText(haslo);
    if (!isEncrypted(szyfr)) return false;
    const { error } = await getSupabase().from('dyktando_uczniowie').update({ haslo_szyfr: szyfr }).eq('id', kontoId);
    return !error;
  } catch {
    return false;
  }
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

const dataZIso = (iso: string) => dzienMiesiac(toDateKey(new Date(iso)));

const btnMaly =
  'rounded text-xs font-medium text-gray-500 hover:text-gray-900 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-500 disabled:opacity-50';
const btn =
  'inline-flex min-h-10 items-center justify-center rounded-md border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500 disabled:cursor-not-allowed disabled:opacity-50';
const btnAkcent =
  'inline-flex min-h-10 items-center justify-center rounded-md bg-accent-600 px-3 text-sm font-semibold text-white transition-colors hover:bg-accent-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500 disabled:cursor-not-allowed disabled:opacity-50';
const naglowekSekcji = 'text-xs font-semibold uppercase tracking-wide text-gray-500';

/** Kolor wyniku: zielony od 90%, bursztyn od 60%, czerwony nizej. */
function kolorWyniku(p: number): string {
  if (p >= 0.9) return 'bg-green-100 text-green-900';
  if (p >= 0.6) return 'bg-amber-100 text-amber-900';
  return 'bg-red-100 text-red-900';
}

const wynikTekst = (w: Pick<WynikDyktanda, 'punkty' | 'maks'>) => `${w.punkty}/${w.maks}`;

const POCHWALY = new Set(['brawo', 'postep', 'poprawki']);

/** Co uczen zrobil z uwaga: poprawil (najlepszy wynik po uwadze), przeczytal, czy jeszcze nie widzial. */
function reakcjaNaUwage(uwaga: UwagaDyktanda, proby: WynikDyktanda[]): { tekst: string; kolor: string } {
  const po = probyPoUwadze(
    proby.filter((p) => p.lekcja === uwaga.lekcja),
    uwaga,
  );
  if (po.length) {
    const best = po.reduce((a, b) => (procent(b) >= procent(a) ? b : a));
    return { tekst: `po uwadze: ${po.length === 1 ? '1 próba' : `${po.length} ${po.length < 5 ? 'próby' : 'prób'}`}, ${wynikTekst(best)}`, kolor: 'text-green-700' };
  }
  const pochwala = POCHWALY.has(szablonUwagi(uwaga.tresc) ?? '');
  if (uwaga.przeczytana_at) {
    return pochwala
      ? { tekst: `✓ przeczytana ${dataZIso(uwaga.przeczytana_at)}`, kolor: 'text-green-700' }
      : { tekst: `przeczytana ${dataZIso(uwaga.przeczytana_at)}, jeszcze nie poprawił(a)`, kolor: 'text-amber-800' };
  }
  return { tekst: `wysłana ${dataZIso(uwaga.created_at)}, jeszcze nie otworzył(a)`, kolor: 'text-gray-500' };
}

/** Grupa do szablonu "Popraw {litery}" - pierwsza prawdziwa regula (bez "pominiete" i "inne"). */
function regulaDoUwagi(grupy: GrupaBledow[]): string {
  return grupy.find((g) => g.grupa !== POMINIETE && g.grupa !== INNE)?.grupa ?? '';
}

// ---------- uwaga dla ucznia ----------

function EdytorUwagi({
  uczen,
  lekcja,
  podsumowanie,
  grupy,
  uwaga,
  dzialaja,
  onZapisano,
}: {
  uczen: UczenDyktanda;
  lekcja: DyktandoLekcja;
  podsumowanie: PodsumowanieProb<WynikDyktanda> | null;
  grupy: GrupaBledow[];
  uwaga: UwagaDyktanda | undefined;
  /** false = brak tabeli (migracja 0047 niewklejona). */
  dzialaja: boolean;
  onZapisano: () => Promise<void>;
}) {
  const litery = regulaDoUwagi(grupy);
  const [tresc, setTresc] = useState(uwaga?.tresc ?? '');
  const [zapis, setZapis] = useState<'nic' | 'trwa' | 'blad'>('nic');
  const podpowiedz = podpowiedzSzablonu(podsumowanie);
  const jezyk = uczen.jezyk ?? 'ua';
  const zmieniona = tresc.trim() !== (uwaga?.tresc ?? '');
  const przeklad = przekladUwagi(tresc, jezyk, litery);

  useEffect(() => setTresc(uwaga?.tresc ?? ''), [uwaga?.tresc]);

  async function zapisz() {
    const t = tresc.trim();
    if (!t) return;
    setZapis('trwa');
    const { error } = await getSupabase()
      .from('dyktando_uwagi')
      .upsert(
        { uczen_id: uczen.id, lekcja: lekcja.id, tresc: t, przeklad, created_at: new Date().toISOString(), przeczytana_at: null },
        { onConflict: 'uczen_id,lekcja' },
      );
    if (error) {
      setZapis('blad');
      return;
    }
    setZapis('nic');
    await onZapisano();
  }

  async function usun() {
    if (!uwaga || !window.confirm('Usunąć uwagę? Uczeń przestanie ją widzieć.')) return;
    setZapis('trwa');
    const { error } = await getSupabase().from('dyktando_uwagi').delete().eq('id', uwaga.id);
    setZapis(error ? 'blad' : 'nic');
    if (!error) {
      setTresc('');
      await onZapisano();
    }
  }

  if (!dzialaja) {
    return <p className="text-sm text-gray-500">Uwagi zadziałają po wklejeniu migracji 0047 w Supabase.</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className={naglowekSekcji}>Uwaga dla ucznia</p>
        {uwaga && (
          <p className="text-xs text-gray-500">
            wysłana {dataZIso(uwaga.created_at)} ·{' '}
            {(() => {
              const r = reakcjaNaUwage(uwaga, podsumowanie?.proby ?? []);
              return <span className={clsx('font-medium', r.kolor)}>{r.tekst}</span>;
            })()}
          </p>
        )}
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Gotowe uwagi">
        {SZABLONY_UWAG.map((s) => {
          const brak = s.zBledem && !litery;
          const tekst = wypelnijSzablon(s, litery).pl;
          return (
            <button
              key={s.id}
              type="button"
              disabled={brak}
              title={brak ? 'Brak błędów w tej lekcji' : tekst}
              onClick={() => setTresc(tekst)}
              className={clsx(
                'rounded-full border px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-500 disabled:cursor-not-allowed disabled:opacity-40',
                tresc.trim() === tekst
                  ? 'border-accent-500 bg-accent-50 text-accent-800'
                  : s.id === podpowiedz
                    ? 'border-accent-300 bg-white text-accent-800 hover:bg-accent-50'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
              )}
            >
              {s.id === 'popraw' && litery ? `Popraw ${litery}` : s.etykieta}
            </button>
          );
        })}
      </div>
      <label className="mt-2 block">
        <span className="sr-only">Treść uwagi</span>
        <textarea
          value={tresc}
          onChange={(e) => setTresc(e.target.value.slice(0, 400))}
          rows={2}
          placeholder="Kliknij gotową uwagę albo napisz własną (krótko, po polsku)."
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
        />
      </label>
      <p className="text-xs text-gray-500">
        {tresc.trim()
          ? przeklad
            ? `Uczeń zobaczy też tłumaczenie (${jezyk === 'es' ? 'hiszpański' : 'ukraiński'}): ${przeklad}`
            : 'Własny tekst - uczeń zobaczy go tylko po polsku.'
          : 'Uczeń zobaczy uwagę przy tej lekcji i na stronie startowej.'}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button type="button" className={btnAkcent} disabled={!tresc.trim() || !zmieniona || zapis === 'trwa'} onClick={() => void zapisz()}>
          {uwaga ? 'Zapisz zmianę' : 'Wyślij uwagę'}
        </button>
        {uwaga && (
          <button type="button" className={btn} disabled={zapis === 'trwa'} onClick={() => void usun()}>
            Usuń
          </button>
        )}
        {zapis === 'blad' && <span className="text-sm text-red-700">Nie udało się zapisać. Spróbuj jeszcze raz.</span>}
      </div>
    </div>
  );
}

// ---------- szczegoly ucznia ----------

function ListaBledow({ grupy }: { grupy: GrupaBledow[] }) {
  if (grupy.length === 0) return <p className="text-sm text-green-700">Bez błędów.</p>;
  return (
    <ul className="space-y-1.5">
      {grupy.map((g) => (
        <li key={g.grupa} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
          <span className="min-w-24 font-semibold text-gray-900">
            {g.grupa} <span className="font-normal tabular-nums text-gray-500">×{g.ile}</span>
          </span>
          <span className="flex flex-wrap gap-x-3 gap-y-0.5">
            {g.przyklady.map((p, i) => (
              <span key={i}>
                <span className="text-red-700 line-through">{p.wpisane ?? '(pominięte)'}</span> → <span className="font-medium text-gray-900">{p.wzor}</span>
              </span>
            ))}
          </span>
        </li>
      ))}
    </ul>
  );
}

function SzczegolyLekcji({
  uczen,
  lekcja,
  wyniki,
  uwaga,
  uwagiDzialaja,
  tygodnia,
  onZapisano,
}: {
  uczen: UczenDyktanda;
  lekcja: DyktandoLekcja;
  wyniki: WynikDyktanda[];
  uwaga: UwagaDyktanda | undefined;
  uwagiDzialaja: boolean;
  tygodnia: boolean;
  onZapisano: () => Promise<void>;
}) {
  const [wszystkieProby, setWszystkieProby] = useState(false);
  const p = podsumujProby(wyniki, lekcja.id);
  // Bledy z ostatniej proby - to one sa aktualne (po poprawie znikaja).
  const grupy = useMemo(() => bledyWgReguly(p?.ostatnia.bledy ?? []), [p?.ostatnia]);
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h4 className="font-semibold text-gray-900">
          {lekcja.nr}. {lekcja.temat}
          {tygodnia && <span className="ml-2 rounded-full bg-accent-50 px-2 py-0.5 text-xs font-semibold text-accent-800">ten tydzień</span>}
        </h4>
        {p ? (
          <p className="text-sm text-gray-600">
            {p.ile === 1 ? '1 próba' : `${p.ile} ${p.ile < 5 ? 'próby' : 'prób'}`}
            {' · '}najlepszy <b className="tabular-nums text-gray-900">{wynikTekst(p.najlepsza)}</b>
            {p.ile > 1 && (
              <>
                {' · '}ostatni <b className="tabular-nums text-gray-900">{wynikTekst(p.ostatnia)}</b>
              </>
            )}
            {czasProby(p.ostatnia.sekundy) && ` · ${czasProby(p.ostatnia.sekundy)}`}
            {` · ${dataZIso(p.ostatnia.created_at)}`}
          </p>
        ) : (
          <p className="text-sm font-medium text-amber-800">jeszcze nie zrobił(a)</p>
        )}
      </div>
      {p && (
        <div className="mt-3">
          <p className={naglowekSekcji}>Błędy w ostatniej próbie</p>
          <div className="mt-1.5">
            <ListaBledow grupy={grupy} />
          </div>
          {p.ile > 1 && (
            <>
              <button type="button" className={clsx(btnMaly, 'mt-2')} onClick={() => setWszystkieProby((x) => !x)} aria-expanded={wszystkieProby}>
                {wszystkieProby ? 'Ukryj wcześniejsze próby' : 'Pokaż wszystkie próby'}
              </button>
              {wszystkieProby && (
                <ol className="mt-2 space-y-1 text-sm text-gray-600">
                  {p.proby.map((x, i) => (
                    <li key={x.id} className="tabular-nums">
                      {i + 1}. {dataZIso(x.created_at)} · <b className="text-gray-900">{wynikTekst(x)}</b>
                      {czasProby(x.sekundy) && ` · ${czasProby(x.sekundy)}`} · błędów: {x.bledy.length}
                    </li>
                  ))}
                </ol>
              )}
            </>
          )}
        </div>
      )}
      <div className="mt-4 border-t border-gray-100 pt-3">
        <EdytorUwagi
          uczen={uczen}
          lekcja={lekcja}
          podsumowanie={p}
          grupy={grupy}
          uwaga={uwaga}
          dzialaja={uwagiDzialaja}
          onZapisano={onZapisano}
        />
      </div>
    </div>
  );
}

// ---------- panel ----------

/** klasaId - pokazuj tylko uczniow tej klasy (null = wszystkich). */
export function DyktandaPanel({ klasaId = null }: { klasaId?: string | null }) {
  const [uczniowie, setUczniowie] = useState<UczenDyktanda[] | null>(null);
  const [wyniki, setWyniki] = useState<WynikDyktanda[]>([]);
  const [uwagi, setUwagi] = useState<UwagaDyktanda[]>([]);
  const [uwagiDzialaja, setUwagiDzialaja] = useState(true);
  const [blad, setBlad] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [otwarty, setOtwarty] = useState<string | null>(null);
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
    const [u, w, n] = await Promise.all([
      sb.from('dyktando_uczniowie').select('*'),
      sb.from('dyktando_wyniki').select('*').order('created_at', { ascending: false }),
      sb.from('dyktando_uwagi').select('*'),
    ]);
    if (u.error || w.error) {
      setBlad('Nie udało się wczytać wyników kursu.');
      return;
    }
    setBlad(null);
    const lista = (u.data ?? []) as UczenDyktanda[];
    setUczniowie(lista);
    setWyniki(((w.data ?? []) as WynikDyktanda[]).filter((x) => !x.lekcja.startsWith('zd:')));
    setUwagiDzialaja(!n.error);
    setUwagi(n.error ? [] : ((n.data ?? []) as UwagaDyktanda[]));
    const odszyfrowane: Record<string, string> = {};
    for (const konto of lista) {
      if (!konto.haslo_szyfr) continue;
      try {
        odszyfrowane[konto.id] = await decryptStudentText(konto.haslo_szyfr);
      } catch {
        // inny klucz - hasla nie pokazujemy
      }
    }
    // Hasla z tej sesji (np. kopia nie zapisala sie w bazie) zostaja do zamkniecia karty.
    setHasla((stare) => ({ ...stare, ...odszyfrowane }));
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

  const aktywni = useMemo(
    () =>
      (uczniowie ?? [])
        .filter((u) => u.aktywny && u.polski !== false && (!klasaId || u.class_id === klasaId))
        .sort((a, b) => {
          const sa = students.find((x) => x.id === a.student_id);
          const sb = students.find((x) => x.id === b.student_id);
          return (sa?.lastName ?? a.login ?? '').localeCompare(sb?.lastName ?? b.login ?? '', 'pl');
        }),
    [uczniowie, klasaId, students],
  );
  const idAktywnych = useMemo(() => new Set(aktywni.map((u) => u.id)), [aktywni]);
  const wynikiAktywnych = useMemo(() => wyniki.filter((w) => idAktywnych.has(w.uczen_id)), [wyniki, idAktywnych]);

  const dzis = toDateKey(new Date());
  const tydzien = lekcjaTygodnia(dzis);
  const otwarteLekcje = DYKTANDA.filter((l) => l.od <= dzis);

  // Co sprawia klopot grupie: bledy z ostatniej proby kazdej lekcji kazdego ucznia.
  const bledyKlasy = useMemo(() => {
    const bledy: Array<BladKursu & { uczenId: string }> = [];
    for (const u of aktywni) {
      for (const l of DYKTANDA) {
        const p = podsumujProby(
          wynikiAktywnych.filter((w) => w.uczen_id === u.id),
          l.id,
        );
        for (const b of p?.ostatnia.bledy ?? []) bledy.push({ ...b, uczenId: u.id });
      }
    }
    return bledyWgReguly(bledy, 3);
  }, [aktywni, wynikiAktywnych]);

  /** Najczestsze bledy ucznia we wszystkich lekcjach (ostatnie proby). */
  const bledyUcznia = useCallback(
    (uczenId: string) => {
      const moje = wynikiAktywnych.filter((w) => w.uczen_id === uczenId);
      const bledy = DYKTANDA.flatMap((l) => podsumujProby(moje, l.id)?.ostatnia.bledy ?? []);
      return bledyWgReguly(bledy, 2);
    },
    [wynikiAktywnych],
  );

  if (!isSupabaseConfigured()) return null;

  const nazwaKlasy = (id?: string | null) => classes.find((c) => c.id === id)?.name ?? '';
  const uczenZDziennika = (u: UczenDyktanda) => students.find((x) => x.id === u.student_id);
  const nazwa = (u: UczenDyktanda) => {
    const s = uczenZDziennika(u);
    return s ? `${s.firstName} ${s.lastName}` : u.imie ?? u.login ?? '?';
  };
  const krotkaNazwa = (u: UczenDyktanda) => {
    const s = uczenZDziennika(u);
    return s ? `${s.firstName} ${s.lastName.charAt(0)}.` : u.imie ?? u.login ?? '?';
  };
  const imie = (u: UczenDyktanda) => uczenZDziennika(u)?.firstName ?? '';
  const probyUcznia = (u: UczenDyktanda) => wynikiAktywnych.filter((w) => w.uczen_id === u.id);
  const uwagaDo = (u: UczenDyktanda, lekcjaId: string) => uwagi.find((x) => x.uczen_id === u.id && x.lekcja === lekcjaId);

  async function ustawJezyk(u: UczenDyktanda, jezyk: Jezyk) {
    const { error } = await getSupabase().from('dyktando_uczniowie').update({ jezyk }).eq('id', u.id);
    if (error) setBlad('Nie udało się zmienić języka.');
    await wczytaj();
  }

  /** Kartki: znane hasla drukujemy, a kto ma haslo tylko na starej kartce - dostaje nowe. */
  async function kartki(lista: UczenDyktanda[]) {
    const bezHasla = lista.filter((u) => !hasla[u.id]);
    if (
      bezHasla.length &&
      !window.confirm(
        `Nowe hasło dostanie ${bezHasla.length} os. Ich stare kartki przestaną działać, a zalogowani uczniowie będą musieli wpisać nowe hasło. Drukować?`,
      )
    )
      return;
    // Okno otwieramy od razu (w kliknieciu) - po czekaniu na baze przegladarka by je zablokowala.
    const okno = window.open('', '_blank');
    if (!okno) {
      setBlad('Przeglądarka zablokowała okno z kartkami - zezwól na wyskakujące okna dla tej strony i kliknij jeszcze raz.');
      return;
    }
    okno.document.write('<p style="font-family: Arial, sans-serif">Przygotowuję kartki…</p>');
    setPracuje(true);
    setBlad(null);
    setInfo(null);
    const znane = { ...hasla };
    const bezKopii: string[] = [];
    for (const u of bezHasla) {
      const haslo = noweHasloPortalu();
      const { error } = await getSupabase().rpc('dyktando_ustaw_haslo', { p_id: u.id, p_haslo: haslo });
      if (error) {
        setBlad(`Nie udało się zmienić hasła: ${nazwa(u)}. Kartki nie zostały wydrukowane.`);
        setPracuje(false);
        okno.close();
        setHasla(znane);
        return;
      }
      znane[u.id] = haslo;
      if (!(await zapiszKopieHaslaKursu(u.id, haslo))) bezKopii.push(krotkaNazwa(u));
    }
    setHasla(znane);
    setPracuje(false);
    if (bezKopii.length) {
      setInfo(
        `Hasła działają, ale kopia nie zapisała się w bazie (brak klucza do danych uczniów na tym komputerze): ${bezKopii.join(', ')} - zachowaj wydrukowane kartki.`,
      );
    }
    const doDruku = lista
      .filter((u) => u.login && znane[u.id])
      .map((u) => ({ imie: imie(u), login: u.login!, haslo: znane[u.id], jezyk: u.jezyk ?? 'ua' }));
    okno.document.open();
    okno.document.write(htmlKartekKursu(doDruku));
    okno.document.close();
    await wczytaj();
  }

  /** Dodaje ucznia do kursu: wlacza kurs na jego koncie albo zaklada konto. */
  async function dodajDoKursu() {
    const uczen = uczniowieKlasy.find((s) => s.id === nowyUczen);
    if (!uczen) return;
    setPracuje(true);
    const istniejace = (uczniowie ?? []).find((u) => u.student_id === uczen.id && u.aktywny);
    if (istniejace) {
      const { error } = await getSupabase().from('dyktando_uczniowie').update({ polski: true, jezyk: nowyJezyk }).eq('id', istniejace.id);
      if (error) setBlad('Nie udało się włączyć kursu.');
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
      else {
        setHasla((h) => ({ ...h, [id as string]: haslo }));
        if (!(await zapiszKopieHaslaKursu(id as string, haslo))) {
          setInfo(`Konto założone. Kopia hasła nie zapisała się w bazie - wydrukuj kartkę teraz (hasło: ${haslo}).`);
        }
      }
    }
    setNowyUczen('');
    setPracuje(false);
    await wczytaj();
  }

  /** Jednym kliknieciem: uwaga "Zrob lekcje tego tygodnia do niedzieli" (z tlumaczeniem). */
  async function przypomnij(u: UczenDyktanda, lekcja: DyktandoLekcja) {
    const s = SZABLONY_UWAG.find((x) => x.id === 'zrob')!;
    const t = wypelnijSzablon(s);
    const { error } = await getSupabase()
      .from('dyktando_uwagi')
      .upsert(
        { uczen_id: u.id, lekcja: lekcja.id, tresc: t.pl, przeklad: t[u.jezyk ?? 'ua'], created_at: new Date().toISOString(), przeczytana_at: null },
        { onConflict: 'uczen_id,lekcja' },
      );
    if (error) setBlad(`Nie udało się wysłać przypomnienia: ${krotkaNazwa(u)}.`);
    await wczytaj();
  }

  async function usunZKursu(u: UczenDyktanda) {
    if (!window.confirm(`Wyłączyć kurs dla: ${nazwa(u)}? Konto do zadań domowych i wyniki zostają.`)) return;
    await getSupabase().from('dyktando_uczniowie').update({ polski: false }).eq('id', u.id);
    await wczytaj();
  }

  // ---------- widok ----------

  const zrobiliTydzien = tydzien ? aktywni.filter((u) => podsumujProby(probyUcznia(u), tydzien.lekcja.id)) : [];
  const nieZrobiliTydzien = tydzien ? aktywni.filter((u) => !podsumujProby(probyUcznia(u), tydzien.lekcja.id)) : [];
  const maxBledow = Math.max(1, ...bledyKlasy.map((g) => g.ile));

  return (
    <section className="max-w-5xl">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
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
          {pracuje ? 'Przygotowuję…' : `Kartki dla kursu (${aktywni.length})`}
        </button>
      </div>
      {blad && <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">{blad}</p>}
      {info && <p className="mb-3 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900" role="status">{info}</p>}

      {uczniowie && aktywni.length === 0 && (
        <p className="rounded-xl border border-gray-200 bg-white px-4 py-4 text-sm text-gray-500">
          {klasaId ? 'Nikt z tej klasy nie ma kursu - dodaj ucznia powyżej.' : 'Nikt nie ma jeszcze kursu.'}
        </p>
      )}

      {uczniowie && aktywni.length > 0 && (
        <>
          {/* Lekcja tego tygodnia */}
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              {tydzien ? (
                <>
                  <p className={naglowekSekcji}>Ten tydzień · {dzienMiesiac(tydzien.od)}-{dzienMiesiac(tydzien.termin)}</p>
                  <div className="mt-1 flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Lekcja {tydzien.lekcja.nr}: {tydzien.lekcja.temat}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {tydzien.dniDoTerminu <= 1 ? 'dziś ostatni dzień' : `do niedzieli, zostało ${tydzien.dniDoTerminu} dni`}
                    </p>
                  </div>
                  <p className="mt-3 text-3xl font-semibold tabular-nums text-gray-900">
                    {zrobiliTydzien.length}
                    <span className="text-lg font-normal text-gray-500"> z {aktywni.length} zrobiło</span>
                  </p>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100" aria-hidden="true">
                    <div className="h-full rounded-full bg-green-500" style={{ width: `${(zrobiliTydzien.length / aktywni.length) * 100}%` }} />
                  </div>
                  {nieZrobiliTydzien.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700">Jeszcze nie:</p>
                      <ul className="mt-1.5 flex flex-wrap gap-1.5">
                        {nieZrobiliTydzien.map((u) => {
                          const przypomniane = uwagaDo(u, tydzien.lekcja.id);
                          return (
                            <li key={u.id} className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 py-1 pl-2.5 pr-1 text-sm text-amber-900 ring-1 ring-inset ring-amber-200">
                              {krotkaNazwa(u)}
                              {przypomniane ? (
                                <span className="rounded-full px-2 py-0.5 text-xs text-amber-800" title={przypomniane.tresc}>
                                  {przypomniane.przeczytana_at ? 'uwaga przeczytana' : 'uwaga wysłana'}
                                </span>
                              ) : uwagiDzialaja ? (
                                <button
                                  type="button"
                                  onClick={() => void przypomnij(u, tydzien.lekcja)}
                                  title="Wyślij uwagę: Zrób lekcję tego tygodnia do niedzieli."
                                  className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-amber-900 ring-1 ring-inset ring-amber-300 hover:bg-amber-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-500"
                                >
                                  Przypomnij
                                </button>
                              ) : null}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                  {zrobiliTydzien.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700">Zrobili:</p>
                      <ul className="mt-1.5 flex flex-wrap gap-1.5">
                        {zrobiliTydzien.map((u) => {
                          const p = podsumujProby(probyUcznia(u), tydzien.lekcja.id)!;
                          return (
                            <li key={u.id} className={clsx('rounded-full px-2.5 py-1 text-sm', kolorWyniku(procent(p.najlepsza)))}>
                              {krotkaNazwa(u)} <b className="tabular-nums">{wynikTekst(p.najlepsza)}</b>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-600">
                  {otwarteLekcje.length === 0 ? `Kurs startuje ${dzienMiesiac(DYKTANDA[0].od)}.` : 'Kurs zakończony - wszystkie lekcje są otwarte do powtórki.'}
                </p>
              )}
            </div>

            {/* Co sprawia klopot grupie */}
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <p className={naglowekSekcji}>Co sprawia kłopot grupie</p>
              {bledyKlasy.length === 0 ? (
                <p className="mt-2 text-sm text-gray-500">{wynikiAktywnych.length ? 'Bez błędów w ostatnich próbach.' : 'Jeszcze nikt nie zrobił lekcji.'}</p>
              ) : (
                <ul className="mt-3 space-y-2.5">
                  {bledyKlasy.slice(0, 6).map((g) => (
                    <li key={g.grupa}>
                      <div className="flex items-baseline justify-between gap-2 text-sm">
                        <span className="font-semibold text-gray-900">{g.grupa}</span>
                        <span className="tabular-nums text-gray-600">
                          {g.ile} {g.ile === 1 ? 'błąd' : g.ile % 10 >= 2 && g.ile % 10 <= 4 && (g.ile < 10 || g.ile > 20) ? 'błędy' : 'błędów'} · {g.uczniowie}/{aktywni.length} uczn.
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-100" aria-hidden="true">
                        <div className="h-full rounded-full bg-amber-400" style={{ width: `${(g.ile / maxBledow) * 100}%` }} />
                      </div>
                      <p className="mt-0.5 truncate text-xs text-gray-500">
                        {g.przyklady.map((p) => `${p.wpisane ?? '(pominięte)'} → ${p.wzor}`).join(' · ')}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-3 text-xs text-gray-500">Pasek = liczba błędów. Liczone z ostatniej próby każdej lekcji, więc po poprawie błąd znika.</p>
            </div>
          </div>

          {/* Postepy uczniow */}
          <h3 className="mb-2 mt-7 text-base font-semibold text-gray-900">Postępy uczniów</h3>
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <th className="px-4 py-2">Uczeń</th>
                  {tydzien && <th className="px-3 py-2">Lekcja {tydzien.lekcja.nr} (ten tydzień)</th>}
                  <th className="px-3 py-2">Lekcje 1-{DYKTANDA.length}</th>
                  <th className="px-3 py-2">Najczęstsze błędy</th>
                  <th className="px-3 py-2">Uwaga</th>
                  <th className="px-3 py-2"><span className="sr-only">Szczegóły</span></th>
                </tr>
              </thead>
              <tbody>
                {aktywni.map((u) => {
                  const moje = probyUcznia(u);
                  const pt = tydzien ? podsumujProby(moje, tydzien.lekcja.id) : null;
                  const otwartyTen = otwarty === u.id;
                  const ostatniaUwaga = uwagi
                    .filter((x) => x.uczen_id === u.id)
                    .sort((a, b) => b.created_at.localeCompare(a.created_at))[0];
                  const bledy = bledyUcznia(u.id);
                  const kolumny = tydzien ? 6 : 5;
                  return (
                    <Fragment key={u.id}>
                      <tr className={clsx('border-b border-gray-100', otwartyTen && 'bg-gray-50')}>
                        <td className="px-4 py-2.5 font-medium text-gray-900">
                          {nazwa(u)}
                          {!klasaId && u.class_id && <span className="ml-2 text-xs font-normal text-gray-500">{nazwaKlasy(u.class_id)}</span>}
                        </td>
                        {tydzien && (
                          <td className="px-3 py-2.5">
                            {pt ? (
                              <span className="inline-flex flex-wrap items-baseline gap-x-2">
                                <span className={clsx('rounded px-1.5 py-0.5 font-semibold tabular-nums', kolorWyniku(procent(pt.najlepsza)))}>
                                  {wynikTekst(pt.najlepsza)}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {pt.ile > 1 ? `${pt.ile}× · ost. ${wynikTekst(pt.ostatnia)}` : '1×'}
                                  {czasProby(pt.ostatnia.sekundy) && ` · ${czasProby(pt.ostatnia.sekundy)}`}
                                </span>
                              </span>
                            ) : (
                              <span className="text-amber-800">jeszcze nie</span>
                            )}
                          </td>
                        )}
                        <td className="px-3 py-2.5">
                          <ol className="flex gap-1" aria-label="Wyniki lekcji">
                            {DYKTANDA.map((l) => {
                              const p = podsumujProby(moje, l.id);
                              const otwarta = l.od <= dzis;
                              const opis = p ? `${l.nr}. ${l.temat}: ${wynikTekst(p.najlepsza)}` : `${l.nr}. ${l.temat}: ${otwarta ? 'nie zrobił(a)' : `od ${dzienMiesiac(l.od)}`}`;
                              return (
                                <li
                                  key={l.id}
                                  title={opis}
                                  aria-label={opis}
                                  className={clsx(
                                    'flex h-6 w-6 items-center justify-center rounded text-[0.65rem] font-semibold tabular-nums',
                                    p ? kolorWyniku(procent(p.najlepsza)) : otwarta ? 'bg-white text-gray-500 ring-1 ring-inset ring-gray-300' : 'bg-gray-100 text-gray-300',
                                    tydzien?.lekcja.id === l.id && 'ring-2 ring-accent-500',
                                  )}
                                >
                                  {l.nr}
                                </li>
                              );
                            })}
                          </ol>
                        </td>
                        <td className="px-3 py-2.5">
                          {bledy.length ? (
                            <span className="flex flex-wrap gap-1">
                              {bledy.slice(0, 3).map((g) => (
                                <span key={g.grupa} className="whitespace-nowrap rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-700">
                                  {g.grupa} <span className="tabular-nums text-gray-500">×{g.ile}</span>
                                </span>
                              ))}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-3 py-2.5 text-xs">
                          {ostatniaUwaga ? (
                            (() => {
                              const r = reakcjaNaUwage(ostatniaUwaga, moje);
                              const l = DYKTANDA.find((x) => x.id === ostatniaUwaga.lekcja);
                              return (
                                <span className={r.kolor}>
                                  {l && <span className="text-gray-500">L{l.nr}: </span>}
                                  {r.tekst}
                                </span>
                              );
                            })()
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-right">
                          <button
                            type="button"
                            className={clsx(btn, 'min-h-8 px-2.5 text-xs')}
                            aria-expanded={otwartyTen}
                            onClick={() => setOtwarty(otwartyTen ? null : u.id)}
                          >
                            {otwartyTen ? 'Zwiń' : 'Szczegóły'}
                          </button>
                        </td>
                      </tr>
                      {otwartyTen && (
                        <tr className="border-b border-gray-200 bg-gray-50">
                          <td colSpan={kolumny} className="px-4 py-4">
                            <div className="space-y-3">
                              {[...otwarteLekcje]
                                .reverse()
                                .filter((l) => tydzien?.lekcja.id === l.id || podsumujProby(moje, l.id))
                                .map((l) => (
                                  <SzczegolyLekcji
                                    key={l.id}
                                    uczen={u}
                                    lekcja={l}
                                    wyniki={moje}
                                    uwaga={uwagaDo(u, l.id)}
                                    uwagiDzialaja={uwagiDzialaja}
                                    tygodnia={tydzien?.lekcja.id === l.id}
                                    onZapisano={wczytaj}
                                  />
                                ))}
                              {otwarteLekcje
                                .filter((l) => tydzien?.lekcja.id !== l.id && !podsumujProby(moje, l.id))
                                .map((l) => l.nr).length > 0 && (
                                <p className="text-sm text-amber-800">
                                  Do nadrobienia: lekcja{' '}
                                  {otwarteLekcje
                                    .filter((l) => tydzien?.lekcja.id !== l.id && !podsumujProby(moje, l.id))
                                    .map((l) => `${l.nr} (${l.temat})`)
                                    .join(', ')}
                                </p>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Konta */}
          <details className="mt-6 rounded-xl border border-gray-200 bg-white">
            <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-gray-900">
              Loginy, hasła i język podpowiedzi <span className="font-normal text-gray-500">({aktywni.length})</span>
            </summary>
            <div className="overflow-x-auto border-t border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th className="px-4 py-2">Uczeń</th>
                    <th className="px-3 py-2">Login</th>
                    <th className="px-3 py-2">Hasło</th>
                    <th className="px-3 py-2">Podpowiedzi</th>
                    <th className="px-3 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {aktywni.map((u) => (
                    <tr key={u.id} className="border-b border-gray-100 last:border-b-0">
                      <td className="px-4 py-2.5 font-medium text-gray-900">{nazwa(u)}</td>
                      <td className="px-3 py-2.5 font-mono text-gray-700">{u.login ?? '-'}</td>
                      <td className="px-3 py-2.5 font-mono text-gray-700">
                        {hasla[u.id] ?? <span className="font-sans text-xs text-gray-500">stara kartka - „Kartka” da nowe hasło</span>}
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
                      <td className="space-x-3 whitespace-nowrap px-3 py-2.5 text-right">
                        <button type="button" className={btnMaly} disabled={pracuje} onClick={() => void kartki([u])}>
                          Kartka
                        </button>
                        <button type="button" className={btnMaly} onClick={() => void usunZKursu(u)}>
                          Usuń z kursu
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </>
      )}
      <p className="mt-2 text-xs text-gray-500">
        <button type="button" className={btnMaly} onClick={() => void wczytaj()}>Odśwież</button>
      </p>
    </section>
  );
}
