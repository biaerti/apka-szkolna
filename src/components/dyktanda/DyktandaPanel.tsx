// Kurs "Polski krok po kroku" - wyniki w zakladce Zadania domowe: kto zrobil
// ktora lekcje, z jakim wynikiem i jakie byly bledy, plus jezyk podpowiedzi.
// Konta, hasla i wlaczanie kursu: src/components/portal/KontaPanel.tsx.
// Strona ucznia: /uczen (src/pages/portal/Portal.tsx).

import { Fragment, useCallback, useEffect, useState } from 'react';
import { getSupabase, isSupabaseConfigured } from '../../data/supabase';
import { useStore } from '../../data/store';
import type { Student } from '../../data/types';
import { JEZYKI, dostepneLekcje, DYKTANDA, type Jezyk } from '../../data/dyktanda';
import { toDateKey } from '../../lib/dates';

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

const btnMaly = 'text-xs font-medium text-gray-500 hover:text-gray-900 hover:underline';

/** klasaId - pokazuj tylko uczniow tej klasy (null = wszystkich). */
export function DyktandaPanel({ klasaId = null }: { klasaId?: string | null }) {
  const [uczniowie, setUczniowie] = useState<UczenDyktanda[] | null>(null);
  const [wyniki, setWyniki] = useState<WynikDyktanda[]>([]);
  const [blad, setBlad] = useState<string | null>(null);
  const [otwarte, setOtwarte] = useState<string | null>(null);
  const classes = useStore((s) => s.classes);
  const students = useStore((s) => s.students);

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
    setUczniowie((u.data ?? []) as UczenDyktanda[]);
    setWyniki(((w.data ?? []) as WynikDyktanda[]).filter((x) => !x.lekcja.startsWith('zd:')));
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

  return (
    <section className="max-w-4xl">
      {blad && <p className="mb-3 text-sm text-red-700">{blad}</p>}
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
              </tr>
            </thead>
            <tbody>
              {aktywni.length === 0 && (
                <tr>
                  <td colSpan={lekcje.length + 2} className="px-4 py-4 text-gray-500">
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
                  </tr>
                  {lekcje.map((l) => {
                    if (otwarte !== `${u.id}:${l.id}`) return null;
                    const proby = wyniki.filter((w) => w.uczen_id === u.id && w.lekcja === l.id);
                    return (
                      <tr key={`${l.id}-bledy`} className="border-b border-gray-100 bg-gray-50">
                        <td colSpan={lekcje.length + 2} className="px-4 py-3">
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
