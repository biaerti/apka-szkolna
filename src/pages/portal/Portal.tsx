// Portal ucznia - szkola.klippi.pl/uczen (stary adres /dyktando prowadzi tutaj).
// Dziala bez logowania nauczyciela (main.tsx omija AuthGate i reszte apki).
// Uczen wpisuje login i haslo z kartki - w bazie nie ma jego imienia ani nazwiska.
//
// Dwa moduly:
// - Zadania domowe: robia sie same z lekcji, ktore klasa ostatnio miala (notatka +
//   przyklady z kart "Ćwiczymy razem"), dla chetnych i dla nieobecnych,
// - Polski krok po kroku: kurs pisowni dla uczniow z innym jezykiem ojczystym
//   (tylko konta z polski = true), co tydzien nowa lekcja (src/pages/Dyktando.tsx).
// Funkcje w Supabase: portal_* i dyktando_* (migracje 0042-0044).

import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import { getSupabase, isSupabaseConfigured } from '../../data/supabase';
import { DYKTANDA, dostepneLekcje, type Jezyk } from '../../data/dyktanda';
import { toDateKey } from '../../lib/dates';
import { kluczZadania, maZadanie, type LekcjaZadania } from '../../lib/zadaniaDomowe';
import { KursPolski } from '../Dyktando';
import { ZadanieDomowe } from './ZadanieDomowe';
import { usunKonto, wczytajKonto, zapiszKonto, type KontoUcznia, type WynikUcznia } from './konto';
import { Ekran, Kafel, Karta, Tydzien, btnCichy, btnGlowny } from './ui';

type Widok = { co: 'start' } | { co: 'zadania' } | { co: 'zadanie'; lekcja: LekcjaZadania } | { co: 'polski' };

const pole =
  'mt-1.5 w-full rounded-2xl border-2 border-[#d6d5cf] bg-white px-4 py-3 text-xl font-semibold tracking-wide outline-none focus:border-[#22a95b]';

function Logowanie({ onZalogowany }: { onZalogowany: (k: KontoUcznia) => void }) {
  const [login, setLogin] = useState('');
  const [haslo, setHaslo] = useState('');
  const [czekam, setCzekam] = useState(false);
  const [blad, setBlad] = useState<string | null>(null);

  async function wejdz() {
    if (!login.trim() || !haslo.trim()) return;
    setCzekam(true);
    setBlad(null);
    const { data, error } = await getSupabase().rpc('portal_zaloguj', { p_login: login, p_haslo: haslo });
    setCzekam(false);
    const konto = (data as Array<{ id: string; jezyk: Jezyk; polski: boolean; klasa: string | null }> | null)?.[0];
    if (error) setBlad('Coś nie działa. Spróbuj za chwilę. · Щось не працює. · Algo no funciona.');
    else if (!konto) setBlad('Zły login albo hasło. · Неправильний логін або пароль. · Usuario o contraseña incorrectos.');
    else
      onZalogowany({
        id: konto.id,
        haslo: haslo.trim().toLowerCase(),
        login: login.trim().toLowerCase(),
        jezyk: konto.jezyk === 'es' ? 'es' : 'ua',
        polski: konto.polski,
        klasa: konto.klasa,
      });
  }

  return (
    <div className="pt-6">
      <p className="text-5xl" aria-hidden="true">📚</p>
      <h1 className="mt-4 text-[2rem] font-extrabold leading-tight">Cześć!</h1>
      <p className="mt-1 text-lg text-[#5b5b57]">Wpisz login i hasło z kartki od nauczyciela.</p>
      <Karta className="mt-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void wejdz();
          }}
        >
          <label className="block text-sm font-bold text-[#5b5b57]">
            Login <span className="font-normal text-[#9a9993]">· Логін · Usuario</span>
            <input value={login} onChange={(e) => setLogin(e.target.value)} autoComplete="username" autoCapitalize="off" autoCorrect="off" spellCheck={false} className={pole} />
          </label>
          <label className="mt-4 block text-sm font-bold text-[#5b5b57]">
            Hasło <span className="font-normal text-[#9a9993]">· Пароль · Contraseña</span>
            <input value={haslo} onChange={(e) => setHaslo(e.target.value)} autoComplete="current-password" autoCapitalize="off" autoCorrect="off" spellCheck={false} className={pole} />
          </label>
          {blad && <p className="mt-4 font-semibold text-[#c0362c]">{blad}</p>}
          <button type="submit" className={clsx(btnGlowny, 'mt-6 w-full')} disabled={czekam || !login.trim() || !haslo.trim()}>
            {czekam ? 'Chwileczkę…' : 'Wejdź'}
          </button>
        </form>
      </Karta>
    </div>
  );
}

const ladnaData = (key: string | null) => {
  if (!key) return '';
  const [, m, d] = key.split('-');
  return `${Number(d)}.${m}`;
};

function najlepszy(wyniki: WynikUcznia[] | null, klucz: string): WynikUcznia | undefined {
  return (wyniki ?? []).filter((w) => w.lekcja === klucz).sort((a, b) => b.punkty / b.maks - a.punkty / a.maks)[0];
}

function ListaZadan({
  zadania,
  wyniki,
  onOtworz,
  onWroc,
}: {
  zadania: LekcjaZadania[] | null;
  wyniki: WynikUcznia[] | null;
  onOtworz: (l: LekcjaZadania) => void;
  onWroc: () => void;
}) {
  const doZrobienia = (zadania ?? []).filter((l) => !najlepszy(wyniki, kluczZadania(l.lekcja_id)));
  const zrobione = (zadania ?? []).filter((l) => najlepszy(wyniki, kluczZadania(l.lekcja_id)));

  const pozycja = (l: LekcjaZadania) => {
    const w = najlepszy(wyniki, kluczZadania(l.lekcja_id));
    return (
      <li key={l.lekcja_id}>
        <button
          type="button"
          onClick={() => onOtworz(l)}
          className="flex w-full items-center gap-4 rounded-3xl bg-white p-4 text-left shadow-[0_3px_0_#e3e2dc] transition-transform active:translate-y-[2px]"
        >
          <span className={clsx('flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl', w ? 'bg-[#e7f7ec]' : 'bg-[#fff1dc]')} aria-hidden="true">
            {w ? '✓' : '✏️'}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[1.05rem] font-extrabold leading-snug">{l.tytul}</span>
            <span className="block text-sm text-[#8a8a85]">lekcja {ladnaData(l.data)}</span>
          </span>
          {w ? (
            <span className="shrink-0 font-extrabold text-[#17803f]">{w.punkty}/{w.maks}</span>
          ) : (
            <span className="shrink-0 rounded-full bg-[#f39a2d] px-3.5 py-1.5 text-sm font-bold text-white">Zrób</span>
          )}
        </button>
      </li>
    );
  };

  return (
    <div>
      <button type="button" onClick={onWroc} className={clsx(btnCichy, '-ml-3 mb-2')}>← Start</button>
      <h1 className="text-[1.75rem] font-extrabold leading-tight">Zadania domowe</h1>
      <p className="mt-1 text-[#5b5b57]">Z ostatnich lekcji. Dla chętnych i dla tych, których nie było.</p>
      {zadania === null && <p className="mt-6 text-[#8a8a85]">Chwileczkę…</p>}
      {zadania && zadania.length === 0 && (
        <Karta className="mt-6 text-center">
          <p className="text-4xl" aria-hidden="true">🌤️</p>
          <p className="mt-2 font-bold">Na razie nic nowego.</p>
          <p className="text-sm text-[#5b5b57]">Zadania pojawiają się same po lekcjach.</p>
        </Karta>
      )}
      {doZrobienia.length > 0 && (
        <>
          <h2 className="mt-7 text-xs font-bold uppercase tracking-[0.08em] text-[#8a8a85]">Do zrobienia</h2>
          <ul className="mt-3 space-y-3">{doZrobienia.map(pozycja)}</ul>
        </>
      )}
      {zrobione.length > 0 && (
        <>
          <h2 className="mt-7 text-xs font-bold uppercase tracking-[0.08em] text-[#8a8a85]">Zrobione - możesz powtórzyć</h2>
          <ul className="mt-3 space-y-3">{zrobione.map(pozycja)}</ul>
        </>
      )}
    </div>
  );
}

function Start({
  konto,
  zadania,
  wyniki,
  onWidok,
  onWyloguj,
}: {
  konto: KontoUcznia;
  zadania: LekcjaZadania[] | null;
  wyniki: WynikUcznia[] | null;
  onWidok: (w: Widok) => void;
  onWyloguj: () => void;
}) {
  const aktywneDni = new Set((wyniki ?? []).map((w) => toDateKey(new Date(w.created_at))));
  const nowe = (zadania ?? []).filter((l) => !najlepszy(wyniki, kluczZadania(l.lekcja_id)));
  const zrobionePolski = DYKTANDA.filter((l) => najlepszy(wyniki, l.id)).length;
  const { dostepne } = dostepneLekcje(toDateKey(new Date()));
  const czekaPolski = dostepne.filter((l) => !najlepszy(wyniki, l.id)).length;
  const tlum = (ua: string, es: string) => (konto.polski ? <span className="block text-sm font-medium text-white/80">{konto.jezyk === 'es' ? es : ua}</span> : null);

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="rounded-full bg-white px-3 py-1 text-sm font-bold text-[#5b5b57] shadow-[0_2px_0_#e3e2dc]">
          {konto.login || 'uczeń'}
          {konto.klasa && <span className="font-normal text-[#9a9993]"> · {konto.klasa}</span>}
        </p>
        <button type="button" onClick={onWyloguj} className={btnCichy}>Wyloguj</button>
      </div>
      <h1 className="mt-5 text-[2rem] font-extrabold leading-tight">Dla ciebie</h1>
      <Karta className="mt-4">
        <p className="mb-3 text-sm font-bold text-[#5b5b57]">Ten tydzień</p>
        <Tydzien aktywneDni={aktywneDni} dzis={new Date()} />
      </Karta>
      <div className="mt-6 space-y-5">
        <Kafel
          kolor="pomarancz"
          ikona="✏️"
          tytul={<>Zadania domowe{tlum('Домашні завдання', 'Tareas')}</>}
          opis={zadania === null ? 'Chwileczkę…' : nowe.length ? `${nowe.length} do zrobienia z ostatnich lekcji` : 'Wszystko zrobione - możesz powtórzyć'}
          postep={zadania && zadania.length ? { zrobione: zadania.length - nowe.length, wszystkie: zadania.length } : undefined}
          onClick={() => onWidok({ co: 'zadania' })}
        />
        {konto.polski && (
          <Kafel
            kolor="fiolet"
            ikona="🇵🇱"
            tytul={<>Polski krok po kroku{tlum('Польська крок за кроком', 'Polaco paso a paso')}</>}
            opis={czekaPolski ? `Nowa lekcja czeka · ${zrobionePolski}/${DYKTANDA.length}` : `Zrobione ${zrobionePolski}/${DYKTANDA.length} - nowa w poniedziałek`}
            postep={{ zrobione: zrobionePolski, wszystkie: DYKTANDA.length }}
            onClick={() => onWidok({ co: 'polski' })}
          />
        )}
      </div>
    </div>
  );
}

export function Portal() {
  const [konto, setKonto] = useState<KontoUcznia | null>(wczytajKonto);
  const [widok, setWidok] = useState<Widok>({ co: 'start' });
  const [wyniki, setWyniki] = useState<WynikUcznia[] | null>(null);
  const [zadania, setZadania] = useState<LekcjaZadania[] | null>(null);

  useEffect(() => {
    document.title = 'Zadania domowe';
  }, []);

  const wyloguj = useCallback(() => {
    usunKonto();
    setKonto(null);
    setWidok({ co: 'start' });
    setWyniki(null);
    setZadania(null);
  }, []);

  const odswiez = useCallback(async () => {
    if (!konto) return;
    const sb = getSupabase();
    const [w, z, k] = await Promise.all([
      sb.rpc('dyktando_moje_wyniki', { p_id: konto.id, p_haslo: konto.haslo }),
      sb.rpc('portal_zadania', { p_id: konto.id, p_haslo: konto.haslo }),
      sb.rpc('portal_konto', { p_id: konto.id, p_haslo: konto.haslo }),
    ]);
    // Haslo zmienione przez nauczyciela - trzeba wpisac nowe z kartki.
    if (w.error?.code === '28P01' || k.error?.code === '28P01') return wyloguj();
    setWyniki((w.data ?? []) as WynikUcznia[]);
    setZadania(((z.data ?? []) as LekcjaZadania[]).filter(maZadanie));
    const dane = (k.data as Array<{ login: string; jezyk: Jezyk; polski: boolean; klasa: string | null }> | null)?.[0];
    if (dane) {
      const nowe: KontoUcznia = { ...konto, login: dane.login ?? konto.login, jezyk: dane.jezyk === 'es' ? 'es' : 'ua', polski: dane.polski, klasa: dane.klasa };
      if (JSON.stringify(nowe) !== JSON.stringify(konto)) {
        zapiszKonto(nowe);
        setKonto(nowe);
      }
    }
  }, [konto, wyloguj]);

  useEffect(() => {
    void odswiez();
  }, [konto?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isSupabaseConfigured()) {
    return (
      <Ekran>
        <Karta>Strona nie jest skonfigurowana.</Karta>
      </Ekran>
    );
  }

  if (!konto) {
    return (
      <Ekran>
        <Logowanie
          onZalogowany={(k) => {
            zapiszKonto(k);
            setKonto(k);
          }}
        />
      </Ekran>
    );
  }

  return (
    <Ekran>
      {widok.co === 'start' && <Start konto={konto} zadania={zadania} wyniki={wyniki} onWidok={setWidok} onWyloguj={wyloguj} />}
      {widok.co === 'zadania' && (
        <ListaZadan zadania={zadania} wyniki={wyniki} onOtworz={(lekcja) => setWidok({ co: 'zadanie', lekcja })} onWroc={() => setWidok({ co: 'start' })} />
      )}
      {widok.co === 'zadanie' && (
        <ZadanieDomowe
          lekcja={widok.lekcja}
          konto={konto}
          onKoniec={() => {
            setWidok({ co: 'zadania' });
            void odswiez();
          }}
        />
      )}
      {widok.co === 'polski' && (
        <KursPolski konto={konto} wyniki={wyniki} onWroc={() => setWidok({ co: 'start' })} onZapisano={() => void odswiez()} />
      )}
    </Ekran>
  );
}
