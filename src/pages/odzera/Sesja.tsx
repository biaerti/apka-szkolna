// Sesja zadan: kolejka, arkusz "Dobrze!/Prawie" po kazdym zadaniu, bledne
// zadanie wraca na koniec (tryb nauka), XP i seria dobrych odpowiedzi.
// Tryb "test" - bez powtarzania; tryb "bez-konca" - kolejne zadania z generatora
// az do dzwonka albo do "Koniec" (etap "Do dzwonka").

import clsx from 'clsx';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  XP_ZA_POPRAWKE,
  XP_ZA_ZADANIE,
  audioUrl,
  kartyZadania,
  oceniane,
  tlum,
  type Zadanie,
} from '../../lib/odzera';
import { dzwiek, graj, zatrzymaj } from './audio';
import { ZKafelki, ZNapisz, ZPary, ZPoznaj, ZWybor, ZZasada, type WynikZadania } from './Zadania';
import { IkBlyskawica, IkDzwonek, IkZamknij, JezykCtx, btnBialy, btnGlowny } from './ui';

export interface WynikSesji {
  punkty: number;
  maks: number;
  xp: number;
  sekundy: number;
  bledy: Array<{ pl: string; wpisane?: string }>;
  /** Fiszki: id karty -> umie (pierwsza odpowiedz dobra). */
  fiszki: Record<string, boolean>;
  /** Ile zadan zrobil (do zapisu postepu w trakcie). */
  zrobione: number;
}

export const pustyWynik = (): WynikSesji => ({ punkty: 0, maks: 0, xp: 0, sekundy: 0, bledy: [], fiszki: {}, zrobione: 0 });

export function polaczWyniki(a: WynikSesji, b: WynikSesji): WynikSesji {
  const fiszki = { ...a.fiszki };
  for (const [id, ok] of Object.entries(b.fiszki)) fiszki[id] = (fiszki[id] ?? true) && ok;
  return {
    punkty: a.punkty + b.punkty,
    maks: a.maks + b.maks,
    xp: a.xp + b.xp,
    sekundy: a.sekundy + b.sekundy,
    bledy: [...a.bledy, ...b.bledy],
    fiszki,
    zrobione: a.zrobione + b.zrobione,
  };
}

const POCHWALY = ['Dobrze!', 'Brawo!', 'Super!', 'Świetnie!', 'Tak jest!', 'Doskonale!'];

interface Props {
  zadania: Zadanie[];
  kolor: string;
  tryb: 'nauka' | 'test' | 'bez-konca';
  /** Tryb bez-konca: kolejne zadanie (n = numer). */
  generator?: (n: number) => Zadanie | null;
  /** Tryb bez-konca: kiedy dzwonek (ms, juz poprawione o zegar serwera). */
  dzwonekO?: number | null;
  /** Poprawka zegara: czas serwera - czas telefonu (ms). */
  przesuniecieZegara?: number;
  /** Od ktorego zadania zaczac (powrot do przerwanej lekcji). */
  startIdx?: number;
  /** XP zdobyte wczesniej w tej lekcji (licznik na gorze). */
  xpWczesniej?: number;
  onPostep?: (idx: number, w: WynikSesji) => void;
  onKoniec: (w: WynikSesji, powod: 'koniec' | 'dzwonek' | 'stop') => void;
  onZamknij: (w: WynikSesji) => void;
}

export function Sesja({ zadania, kolor, tryb, generator, dzwonekO, przesuniecieZegara = 0, startIdx = 0, xpWczesniej = 0, onPostep, onKoniec, onZamknij }: Props) {
  const j = useContext(JezykCtx);
  const [kolejka, setKolejka] = useState<Zadanie[]>(() => (tryb === 'bez-konca' && generator ? [generator(0)].filter((x): x is Zadanie => Boolean(x)) : zadania));
  const [idx, setIdx] = useState(Math.min(startIdx, Math.max(0, zadania.length - 1)));
  const [odp, setOdp] = useState<WynikZadania | null>(null);
  const [zRzedu, setZRzedu] = useState(0);
  const [teraz, setTeraz] = useState(Date.now());
  const [koniecDzwonek, setKoniecDzwonek] = useState(false);
  const wynik = useRef<WynikSesji>({ ...pustyWynik(), maks: tryb === 'bez-konca' ? 0 : zadania.slice(startIdx).filter(oceniane).length });
  const proby = useRef<Map<string, number>>(new Map());
  const typyWidziane = useRef<Set<string>>(new Set());
  const start = useRef(Date.now());
  const pochwala = useMemo(() => POCHWALY[Math.floor(Math.random() * POCHWALY.length)], [idx, odp]);

  const z = kolejka[idx];
  const pierwszyRaz = z ? !typyWidziane.current.has(z.typ) : false;
  useEffect(() => {
    if (z) typyWidziane.current.add(z.typ);
    window.scrollTo(0, 0);
    // podglad w trybie deweloperskim: biezace zadanie (do testow w przegladarce)
    if (import.meta.env.DEV) (window as unknown as { __ozZadanie?: Zadanie }).__ozZadanie = z;
  }, [z]);

  // zegar do dzwonka
  useEffect(() => {
    if (!dzwonekO) return;
    const t = window.setInterval(() => setTeraz(Date.now()), 5000);
    return () => window.clearInterval(t);
  }, [dzwonekO]);
  const zostalo = dzwonekO ? Math.max(0, dzwonekO - (teraz + przesuniecieZegara)) : null;

  useEffect(() => () => zatrzymaj(), []);

  const zakoncz = (powod: 'koniec' | 'dzwonek' | 'stop') => {
    wynik.current.sekundy = (Date.now() - start.current) / 1000;
    onKoniec({ ...wynik.current }, powod);
  };

  const naWynik = (w: WynikZadania) => {
    if (!z) return;
    const bazowy = z.klucz.replace(/:r\d+$/, '');
    const proba = proby.current.get(bazowy) ?? 0;
    proby.current.set(bazowy, proba + 1);
    const pierwsza = proba === 0;
    const W = wynik.current;
    if (tryb === 'bez-konca') W.maks += 1;
    if (w.ok) {
      dzwiek.dobrze();
      if (pierwsza) W.punkty += 1;
      W.xp += pierwsza ? XP_ZA_ZADANIE : XP_ZA_POPRAWKE;
      setZRzedu((n) => n + 1);
    } else {
      dzwiek.zle();
      setZRzedu(0);
      const karty = kartyZadania(z);
      const pl = z.typ === 'pary' ? karty.filter((k) => w.bledne?.includes(k.id)).map((k) => k.pl).join(', ') : karty[0]?.pl ?? '';
      W.bledy.push({ pl, ...(w.wpisane ? { wpisane: w.wpisane } : {}) });
    }
    // fiszki: pierwsza odpowiedz decyduje; "ogonki" = umie slowo
    for (const k of kartyZadania(z)) {
      const umie = z.typ === 'pary' ? !w.bledne?.includes(k.id) : w.ok || w.ocena === 'ogonki';
      if (pierwsza || !(k.id in W.fiszki)) W.fiszki[k.id] = (W.fiszki[k.id] ?? true) && umie;
    }
    // nagranie dobrej odpowiedzi (utrwala brzmienie)
    if (z.typ !== 'pary' && z.typ !== 'sluchaj' && 'karta' in z) {
      window.setTimeout(() => void graj(audioUrl(z.karta)), 250);
    }
    // bledne wraca na koniec (najwyzej 2 razy)
    if (!w.ok && tryb === 'nauka' && proba < 2) {
      setKolejka((q) => [...q, { ...z, klucz: `${bazowy}:r${proba + 1}` } as Zadanie]);
    }
    if (w.ok && z.typ === 'pary') {
      // pary bez bledow - od razu dalej, bez arkusza
      setOdp(w);
      return;
    }
    setOdp(w);
  };

  const dalej = () => {
    zatrzymaj();
    const W = wynik.current;
    W.zrobione += 1;
    setOdp(null);
    const n = idx + 1;
    onPostep?.(n, { ...W, sekundy: (Date.now() - start.current) / 1000 });
    if (tryb === 'bez-konca') {
      if (zostalo !== null && zostalo <= 0) {
        setKoniecDzwonek(true);
        dzwiek.koniec();
        return;
      }
      const nowe = generator?.(n);
      if (!nowe) return zakoncz('koniec');
      setKolejka((q) => [...q, nowe]);
      setIdx(n);
      return;
    }
    if (n >= kolejka.length) {
      zakoncz('koniec');
      return;
    }
    setIdx(n);
  };

  // dzwonek w trakcie zadania - konczymy po biezacym
  useEffect(() => {
    if (tryb === 'bez-konca' && zostalo === 0 && !odp && !koniecDzwonek && wynik.current.zrobione > 0) {
      setKoniecDzwonek(true);
      dzwiek.koniec();
    }
  }, [zostalo, odp, tryb, koniecDzwonek]);

  if (koniecDzwonek) {
    return (
      <div className="oz-wjazd flex min-h-[70vh] flex-col items-center justify-center text-center">
        <span className="flex h-28 w-28 items-center justify-center rounded-full bg-[#fff4c2] text-[#c78a00]" style={{ animation: 'ozPuls 1s ease-in-out 3' }}>
          <IkDzwonek className="h-16 w-16" />
        </span>
        <h1 className="mt-6 text-[2.2rem] font-bold">Dzwonek!</h1>
        <p className="mt-1 text-lg text-[#5b5b57]">{j === 'ru' ? 'Урок закончился. Молодец!' : 'Урок закінчився. Молодець!'}</p>
        <button type="button" className={clsx(btnGlowny, 'mt-8 w-full max-w-xs')} onClick={() => zakoncz('dzwonek')}>
          Koniec
        </button>
      </div>
    );
  }

  if (!z) return null;

  const wszystkie = tryb === 'bez-konca' ? 0 : kolejka.length;
  const procent = wszystkie ? (idx / wszystkie) * 100 : 0;
  const minuty = zostalo !== null ? Math.ceil(zostalo / 60000) : null;

  const props = {
    kolor,
    pierwszyRaz,
    sprawdzone: odp,
    onWynik: naWynik,
    onDalej: dalej,
  };

  const karta = 'karta' in z ? z.karta : null;

  return (
    <div>
      {/* Gorny pasek: zamknij, postep, XP / dzwonek */}
      <div className="sticky top-0 z-10 -mx-4 mb-4 flex items-center gap-3 bg-[#f6f5f1]/95 px-4 pb-2 pt-2 backdrop-blur">
        <button
          type="button"
          onClick={() => {
            zatrzymaj();
            wynik.current.sekundy = (Date.now() - start.current) / 1000;
            onZamknij({ ...wynik.current });
          }}
          aria-label="Zamknij"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#5b5b57] hover:bg-black/5"
        >
          <IkZamknij />
        </button>
        {tryb === 'bez-konca' ? (
          <div className="flex flex-1 items-center gap-2 text-[1.05rem] font-bold">
            {minuty !== null ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-[0_2px_0_#e3e2dc]">
                <IkDzwonek className="h-5 w-5 text-[#c78a00]" />
                {minuty} min
              </span>
            ) : (
              <span className="text-[#5b5b57]">{wynik.current.zrobione} zadań</span>
            )}
          </div>
        ) : (
          <div className="h-3.5 flex-1 overflow-hidden rounded-full bg-[#e6e5df]" role="progressbar" aria-valuenow={Math.round(procent)} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${procent}%`, background: kolor }} />
          </div>
        )}
        <span className="inline-flex shrink-0 items-center gap-1 text-[1.05rem] font-bold text-[#c78a00]" aria-label={`${xpWczesniej + wynik.current.xp} XP`}>
          <IkBlyskawica className="h-5 w-5" />
          {xpWczesniej + wynik.current.xp}
        </span>
        {tryb === 'bez-konca' && (
          <button type="button" className="rounded-xl px-2 py-1 text-[0.95rem] font-bold text-[#5b5b57] hover:bg-black/5" onClick={() => zakoncz('stop')}>
            Koniec
          </button>
        )}
      </div>

      <div key={z.klucz}>
        {z.typ === 'poznaj' && <ZPoznaj z={z} {...props} />}
        {z.typ === 'zasada' && <ZZasada z={z} {...props} />}
        {(z.typ === 'sluchaj' || z.typ === 'obrazek' || z.typ === 'czytaj' || z.typ === 'tlumacz') && <ZWybor z={z} {...props} />}
        {z.typ === 'pary' && <ZPary z={z} {...props} />}
        {(z.typ === 'litery' || z.typ === 'zdanie') && <ZKafelki z={z} {...props} />}
        {z.typ === 'napisz' && <ZNapisz z={z} {...props} />}
      </div>

      {odp && (
        <div
          role="status"
          className={clsx(
            'fixed inset-x-0 bottom-0 z-20 border-t-2 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4',
            odp.ok ? 'border-[#b8e6c8] bg-[#e7f7ec]' : 'border-[#f5c2c0] bg-[#fdeceb]',
          )}
          style={{ animation: 'ozArkusz 220ms cubic-bezier(.16,1,.3,1)' }}
        >
          <div className="mx-auto max-w-xl">
            <p className={clsx('flex items-center gap-2 text-[1.6rem] font-bold', odp.ok ? 'text-[#17803f]' : 'text-[#c0362c]')}>
              {odp.ok ? pochwala : odp.ocena === 'ogonki' ? 'Prawie! Zobacz kreski.' : 'Prawie!'}
              {odp.ok && zRzedu >= 3 && (
                <span className="ml-auto rounded-full bg-white/70 px-3 py-0.5 text-base text-[#c2410c]" style={{ animation: 'ozPodskok .4s both' }}>
                  {zRzedu} z rzędu!
                </span>
              )}
            </p>
            {karta && (
              <p className="mt-1 text-[1.15rem] leading-snug text-[#2b2b28]">
                {!odp.ok && <span className="text-[#6b6a65]">{j === 'ru' ? 'Правильно: ' : 'Правильно: '}</span>}
                <span className="font-bold" lang="pl">
                  {karta.e} {karta.pl}
                </span>
                <span className="text-[#5b5b57]"> - {tlum(karta, j)}</span>
              </p>
            )}
            {!odp.ok && odp.wpisane && (
              <p className="mt-0.5 text-[0.95rem] text-[#6b6a65]">
                {j === 'ru' ? 'Ты написал(а): ' : 'Ти написав(ла): '}
                <span className="line-through">{odp.wpisane}</span>
              </p>
            )}
            {!odp.ok && tryb === 'nauka' && (
              <p className="mt-0.5 text-[0.9rem] text-[#8a5a55]">{j === 'ru' ? 'Это задание вернётся в конце.' : 'Це завдання повернеться в кінці.'}</p>
            )}
            <div className="mt-3 flex gap-3">
              <button type="button" autoFocus className={clsx(odp.ok ? btnGlowny : btnBialy, 'w-full')} onClick={dalej}>
                Dalej
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
