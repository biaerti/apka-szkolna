// Kurs "Polski od zera" - szkola.klippi.pl/od-zera. Osobny maly kawalek JS
// (main.tsx omija AuthGate i reszte apki), jak portal ucznia /uczen.
// Logowanie loginem i haslem z kartki - to samo konto co w portalu.
// Tryb na koncie (od_zera): 'lekcja' - lekcje otwieraja sie na godzinach polskiego
// klasy, 'dom' - po kolei bez zegara. Plan kursu: docs/kurs-od-zera-plan.md.

import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { isSupabaseConfigured } from '../../data/supabase';
import { DZIALY, type JezykOZ, type LekcjaOZ } from '../../data/odzera';
import {
  dzienPL,
  fiszkiNaDzis,
  rng,
  seria,
  stanyLekcji,
  sumaXp,
  zadaniaPowtorki,
  type WynikOZ,
} from '../../lib/odzera';
import { usunKonto, wczytajKonto, zapiszKonto, type KontoUcznia } from '../portal/konto';
import { pobierzStan, wyslijZaleglosci, zapisz, zaloguj, zmienFiszki, type StanKursu, type Zapis } from './api';
import { DoDzwonka, Lekcja } from './Lekcja';
import { Sesja } from './Sesja';
import { Start } from './Start';
import { Ekran, JezykCtx, btnBialy, btnGlowny } from './ui';

type Widok = { co: 'start' } | { co: 'lekcja'; nr: number } | { co: 'powtorka' } | { co: 'cwicz' };

const pole =
  'mt-1.5 w-full rounded-2xl border-2 border-[#d6d5cf] bg-white px-4 py-3 text-xl font-bold tracking-wide outline-none focus:border-[#1f8fe0]';

function Logowanie({ onZalogowany }: { onZalogowany: (k: KontoUcznia) => void }) {
  const [login, setLogin] = useState('');
  const [haslo, setHaslo] = useState('');
  const [czekam, setCzekam] = useState(false);
  const [blad, setBlad] = useState<string | null>(null);

  async function wejdz() {
    if (!login.trim() || !haslo.trim()) return;
    setCzekam(true);
    setBlad(null);
    const k = await zaloguj(login, haslo);
    setCzekam(false);
    if (k === 'blad') setBlad('Coś nie działa. Spróbuj za chwilę. · Что-то не работает. · Щось не працює.');
    else if (k === 'zle') setBlad('Zły login albo hasło. · Неверный логин или пароль. · Неправильний логін або пароль.');
    else onZalogowany(k);
  }

  return (
    <div className="pt-6">
      <div className="flex gap-2 text-[3.2rem] leading-none" aria-hidden="true">
        <span>👋</span>
        <span>📚</span>
      </div>
      <h1 className="mt-5 text-[2.4rem] font-bold leading-[1.05]">Polski od zera</h1>
      <p className="mt-1 text-lg text-[#5b5b57]">Польский с нуля · Польська з нуля</p>
      <form
        className="mt-7 rounded-[2rem] bg-white p-6 shadow-[0_1px_0_rgba(0,0,0,0.04),0_10px_30px_-16px_rgba(0,0,0,0.2)]"
        onSubmit={(e) => {
          e.preventDefault();
          void wejdz();
        }}
      >
        <label className="block text-[0.95rem] font-bold text-[#5b5b57]">
          Login <span className="font-normal text-[#8a8a85]">· Логин · Логін</span>
          <input value={login} onChange={(e) => setLogin(e.target.value)} autoComplete="username" autoCapitalize="off" autoCorrect="off" spellCheck={false} className={pole} />
        </label>
        <label className="mt-4 block text-[0.95rem] font-bold text-[#5b5b57]">
          Hasło <span className="font-normal text-[#8a8a85]">· Пароль</span>
          <input value={haslo} onChange={(e) => setHaslo(e.target.value)} autoComplete="current-password" autoCapitalize="off" autoCorrect="off" spellCheck={false} className={pole} />
        </label>
        {blad && (
          <p className="mt-4 rounded-2xl bg-[#fdeceb] px-4 py-3 text-[0.98rem] font-bold text-[#c0362c]" role="alert">
            {blad}
          </p>
        )}
        <button type="submit" disabled={czekam || !login.trim() || !haslo.trim()} className={clsx(btnGlowny, 'mt-6 w-full')}>
          {czekam ? 'Sprawdzam…' : 'Wchodzę'}
        </button>
      </form>
      <p className="mt-5 text-center text-[0.95rem] text-[#6b6a65]">
        Login i hasło są na kartce od nauczyciela.
        <br />
        Логин и пароль - на карточке от учителя.
      </p>
    </div>
  );
}

function Komunikat({ tytul, tekst, przycisk }: { tytul: string; tekst: string; przycisk?: { napis: string; onClick: () => void } }) {
  return (
    <div className="pt-16 text-center">
      <p className="text-[1.9rem] font-bold leading-tight">{tytul}</p>
      <p className="mt-2 text-lg text-[#5b5b57]">{tekst}</p>
      {przycisk && (
        <button type="button" className={clsx(btnBialy, 'mt-8')} onClick={przycisk.onClick}>
          {przycisk.napis}
        </button>
      )}
    </div>
  );
}

export function OdZera() {
  const [konto, setKonto] = useState<KontoUcznia | null>(() => wczytajKonto());
  const [stan, setStan] = useState<StanKursu | null>(null);
  const [blad, setBlad] = useState<'blad' | null>(null);
  const [widok, setWidok] = useState<Widok>({ co: 'start' });
  const [teraz, setTeraz] = useState(Date.now());
  const przesuniecie = useRef(0);
  const juzDzis = useRef<Set<string>>(new Set());

  useEffect(() => {
    document.title = 'Polski od zera';
  }, []);

  const odswiez = useCallback(async (k: KontoUcznia) => {
    await wyslijZaleglosci(k);
    const s = await pobierzStan(k);
    if (s === 'haslo') {
      usunKonto();
      setKonto(null);
      return;
    }
    if (s === 'blad') {
      setBlad('blad');
      return;
    }
    setBlad(null);
    przesuniecie.current = new Date(s.teraz).getTime() - Date.now();
    setStan(s);
  }, []);

  useEffect(() => {
    if (konto && isSupabaseConfigured()) void odswiez(konto);
  }, [konto, odswiez]);

  // zegar ekranu startowego + odswiezanie (lekcja otwiera sie z poczatkiem godziny)
  useEffect(() => {
    if (!konto) return;
    const t = window.setInterval(() => setTeraz(Date.now()), 30000);
    const r = window.setInterval(() => {
      if (widok.co === 'start' && document.visibilityState === 'visible') void odswiez(konto);
    }, 120000);
    const widocznosc = () => {
      if (document.visibilityState === 'visible' && widok.co === 'start') void odswiez(konto);
    };
    const online = () => void wyslijZaleglosci(konto);
    document.addEventListener('visibilitychange', widocznosc);
    window.addEventListener('online', online);
    return () => {
      window.clearInterval(t);
      window.clearInterval(r);
      document.removeEventListener('visibilitychange', widocznosc);
      window.removeEventListener('online', online);
    };
  }, [konto, widok.co, odswiez]);

  const terazSerwer = teraz + przesuniecie.current;
  const dzis = dzienPL(new Date(terazSerwer));
  const jezyk: JezykOZ = stan?.jezyk ?? 'ru';

  const stany = useMemo(() => stanyLekcji(stan?.wyniki ?? [], stan?.tryb === 'lekcja' ? (stan.odblokowane ?? 0) : null), [stan]);
  const xp = useMemo(() => sumaXp(stan?.wyniki ?? []), [stan]);
  const seriaDni = useMemo(() => {
    if (!stan) return 0;
    const aktywne = new Set(stan.wyniki.map((w) => dzienPL(w.created_at)));
    return seria(aktywne, stan.tryb === 'lekcja' ? stan.dni_polskiego : [1, 2, 3, 4, 5], new Date(terazSerwer));
  }, [stan, terazSerwer]);
  const naDzis = useMemo(() => fiszkiNaDzis(stan?.fiszki ?? [], dzis, 20), [stan, dzis]);

  /** Zapis etapu: od razu na ekranie (wyniki, fiszki), potem do bazy. */
  const naZapis = (z: Zapis) => {
    if (!konto) return;
    setStan((s) => {
      if (!s) return s;
      const w: WynikOZ = { lekcja: z.lekcja, czesc: z.czesc, punkty: z.punkty, maks: z.maks, xp: z.xp, sekundy: z.sekundy, ukonczona: z.ukonczona, created_at: new Date().toISOString() };
      return { ...s, wyniki: [...s.wyniki, w], fiszki: zmienFiszki(s.fiszki, z.fiszki, dzis, juzDzis.current) };
    });
    void zapisz(konto, z);
  };

  const wyjdz = () => {
    setWidok({ co: 'start' });
    window.scrollTo(0, 0);
    if (konto) void odswiez(konto);
  };

  if (!isSupabaseConfigured()) {
    return (
      <Ekran>
        <Komunikat tytul="Kurs jest wyłączony" tekst="Brak połączenia z bazą." />
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

  const wyloguj = () => {
    usunKonto();
    setKonto(null);
    setStan(null);
  };

  if (!stan) {
    return (
      <Ekran>
        {blad ? (
          <Komunikat tytul="Brak internetu?" tekst="Нет интернета? · Немає інтернету?" przycisk={{ napis: 'Spróbuj jeszcze raz', onClick: () => void odswiez(konto) }} />
        ) : (
          <div className="flex min-h-[60vh] items-center justify-center" aria-busy="true">
            <span className="text-[3rem]" style={{ animation: 'ozPuls 1s ease-in-out infinite' }} aria-hidden="true">
              👋
            </span>
          </div>
        )}
      </Ekran>
    );
  }

  if (!stan.tryb) {
    return (
      <Ekran>
        <Komunikat
          tytul="Nie masz jeszcze kursu"
          tekst="У тебя ещё нет курса. Попроси учителя. · У тебе ще немає курсу. Попроси вчителя."
          przycisk={{ napis: 'Wyloguj', onClick: wyloguj }}
        />
      </Ekran>
    );
  }

  const lekcjaZWidoku = widok.co === 'lekcja' ? DZIALY.flatMap((d) => d.lekcje.map((l) => ({ l, d }))).find((x) => x.l.nr === widok.nr) : null;
  const ostatnia = [...DZIALY.flatMap((d) => d.lekcje)].reverse().find((l) => stany.get(l.nr) === 'zrobiona') ?? DZIALY[0]?.lekcje[0];
  const kolorOstatniej = DZIALY.find((d) => d.lekcje.some((l) => l.nr === ostatnia?.nr))?.kolor ?? '#1f8fe0';

  return (
    <JezykCtx.Provider value={jezyk}>
      <Ekran>
        {widok.co === 'start' && (
          <Start
            stan={stan}
            login={konto.login || stan.login || ''}
            stany={stany}
            xp={xp}
            seriaDni={seriaDni}
            doPowtorki={naDzis.length}
            teraz={terazSerwer}
            onLekcja={(l: LekcjaOZ) => {
              setWidok({ co: 'lekcja', nr: l.nr });
              window.scrollTo(0, 0);
            }}
            onPowtorka={() => setWidok({ co: 'powtorka' })}
            onCwicz={() => setWidok({ co: 'cwicz' })}
            onWyloguj={wyloguj}
          />
        )}
        {lekcjaZWidoku && (
          <Lekcja
            key={lekcjaZWidoku.l.nr}
            lekcja={lekcjaZWidoku.l}
            dzial={lekcjaZWidoku.d}
            konto={konto}
            stan={stan}
            dzis={dzis}
            przesuniecieZegara={przesuniecie.current}
            onZapisz={naZapis}
            onWyjdz={wyjdz}
          />
        )}
        {widok.co === 'powtorka' && (
          <Sesja
            zadania={zadaniaPowtorki(naDzis, rng(`${konto.id}:powtorka:${dzis}`))}
            kolor="#1f8fe0"
            tryb="nauka"
            onKoniec={(w) => {
              naZapis({ lekcja: 0, czesc: 'powtorka', punkty: w.punkty, maks: w.maks, xp: w.xp, bledy: w.bledy, sekundy: w.sekundy, ukonczona: true, fiszki: Object.entries(w.fiszki).map(([i, k]) => ({ i, k })) });
              wyjdz();
            }}
            onZamknij={(w) => {
              if (w.zrobione > 0) {
                naZapis({ lekcja: 0, czesc: 'powtorka', punkty: w.punkty, maks: Math.max(w.maks, w.punkty), xp: w.xp, bledy: w.bledy, sekundy: w.sekundy, ukonczona: false, fiszki: Object.entries(w.fiszki).map(([i, k]) => ({ i, k })) });
              }
              wyjdz();
            }}
          />
        )}
        {widok.co === 'cwicz' && ostatnia && (
          <DoDzwonka
            lekcja={ostatnia}
            kolor={kolorOstatniej}
            stan={stan}
            przesuniecieZegara={przesuniecie.current}
            limit={stan.tryb === 'lekcja' && stan.lekcja_do ? null : 10}
            seed={`${konto.id}:cwicz:${Date.now()}`}
            onZapisz={naZapis}
            onWyjdz={wyjdz}
          />
        )}
      </Ekran>
    </JezykCtx.Provider>
  );
}
