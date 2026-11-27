// Jedna lekcja kursu "Polski od zera" (45 minut w trybie lekcja):
// 1. Powtórka (fiszki na dzis) -> 2. Nowe (zasady + slowa) -> 3. Ćwiczenia
// -> 4. Zeszyt -> podsumowanie -> 5. Do dzwonka (tylko tryb lekcja).
// Lekcja "Sprawdź się": powtorka -> test dzialu -> zeszyt -> podsumowanie.
// Postep w trakcie lezy w localStorage, wiec po dzwonku mozna wrocic w to samo miejsce.

import clsx from 'clsx';
import { useContext, useMemo, useRef, useState } from 'react';
import type { DzialOZ, LekcjaOZ } from '../../data/odzera';
import {
  POLECENIE_ZESZYT,
  XP_ZA_LEKCJE,
  XP_ZA_ZESZYT,
  audioUrl,
  fiszkiNaDzis,
  gwiazdki,
  kartyLekcji,
  linieZeszytu,
  rng,
  zadaniaCwiczenia,
  zadaniaNowe,
  zadaniaPowtorki,
  zadaniaTestu,
  zadanieDzwonek,
  pulaDo,
  type Fiszka,
} from '../../lib/odzera';
import type { KontoUcznia } from '../portal/konto';
import type { StanKursu, Zapis } from './api';
import { dzwiek } from './audio';
import { Sesja, pustyWynik, polaczWyniki, type WynikSesji } from './Sesja';
import {
  Dol,
  IkBlyskawica,
  IkDzwonek,
  IkGwiazda,
  IkNowe,
  IkPowtorka,
  IkZamknij,
  IkZeszyt,
  JezykCtx,
  Polecenie,
  btnBialy,
  btnGlowny,
  ciemniej,
  jasniej,
  useT,
} from './ui';

type Etap = 'start' | 'powtorka' | 'nowe' | 'cwiczenia' | 'test' | 'zeszyt' | 'koniec' | 'dzwonek';

interface ZapisPostepu {
  etap: Etap;
  idx: number;
  wynik: WynikSesji;
  dzien: string;
}

const kluczPostepu = (id: string, nr: number) => `odzera-postep-${id}-${nr}`;

function wczytajPostep(id: string, nr: number): ZapisPostepu | null {
  try {
    const z = JSON.parse(localStorage.getItem(kluczPostepu(id, nr)) ?? 'null') as ZapisPostepu | null;
    return z && z.etap !== 'start' && z.etap !== 'koniec' ? z : null;
  } catch {
    return null;
  }
}

function zapiszPostep(id: string, nr: number, p: ZapisPostepu | null): void {
  try {
    if (p) localStorage.setItem(kluczPostepu(id, nr), JSON.stringify(p));
    else localStorage.removeItem(kluczPostepu(id, nr));
  } catch {
    // bez zapisu w telefonie
  }
}

interface Props {
  lekcja: LekcjaOZ;
  dzial: DzialOZ;
  konto: KontoUcznia;
  stan: StanKursu;
  dzis: string;
  przesuniecieZegara: number;
  /** Zapis wyniku etapu (do bazy albo do kolejki). */
  onZapisz: (z: Zapis) => void;
  onWyjdz: () => void;
}

export function Lekcja({ lekcja, dzial, konto, stan, dzis, przesuniecieZegara, onZapisz, onWyjdz }: Props) {
  const t = useT();
  const j = useContext(JezykCtx);
  const kolor = dzial.kolor;
  const domowy = stan.tryb !== 'lekcja';
  const zapisany = useMemo(() => wczytajPostep(konto.id, lekcja.nr), [konto.id, lekcja.nr]);
  const [etap, setEtap] = useState<Etap>('start');
  const [startIdx, setStartIdx] = useState(0);
  const lacznie = useRef<WynikSesji>(pustyWynik());
  const [podsumowanie, setPodsumowanie] = useState<WynikSesji | null>(null);
  const proba = useRef(Date.now().toString(36));

  // Zadania (ziarno: uczen + lekcja, zeby po powrocie byly te same)
  const ziarno = `${konto.id}:${lekcja.nr}`;
  const nowe = useMemo(() => zadaniaNowe(lekcja, rng(`${ziarno}:n`)), [lekcja, ziarno]);
  const cwiczenia = useMemo(() => zadaniaCwiczenia(lekcja, rng(`${ziarno}:c`), domowy), [lekcja, ziarno, domowy]);
  const test = useMemo(() => (lekcja.test ? zadaniaTestu(dzial, rng(`${ziarno}:t`)) : []), [lekcja, dzial, ziarno]);
  const kartyTej = useMemo(() => new Set(kartyLekcji(lekcja.nr).map((k) => k.id)), [lekcja.nr]);
  const naDzis = useMemo(() => fiszkiNaDzis(stan.fiszki.filter((f) => !kartyTej.has(f.item)), dzis), [stan.fiszki, kartyTej, dzis]);
  const powtorka = useMemo(() => zadaniaPowtorki(naDzis, rng(`${ziarno}:p:${dzis}`)), [naDzis, ziarno, dzis]);

  const kolejneEtapy: Etap[] = lekcja.test ? ['powtorka', 'test', 'zeszyt', 'koniec'] : ['powtorka', 'nowe', 'cwiczenia', 'zeszyt', 'koniec'];
  const po = (e: Etap): Etap => {
    let i = kolejneEtapy.indexOf(e) + 1;
    let n = kolejneEtapy[i];
    if (n === 'powtorka' && powtorka.length === 0) n = kolejneEtapy[++i];
    return n ?? 'koniec';
  };
  const pierwszy = (): Etap => (powtorka.length ? 'powtorka' : lekcja.test ? 'test' : 'nowe');

  const idzDo = (e: Etap, idx = 0) => {
    setStartIdx(idx);
    setEtap(e);
    if (e === 'koniec' || e === 'dzwonek') zapiszPostep(konto.id, lekcja.nr, null);
    else zapiszPostep(konto.id, lekcja.nr, { etap: e, idx, wynik: lacznie.current, dzien: dzis });
  };

  const fiszkiZ = (w: WynikSesji) => Object.entries(w.fiszki).map(([i, k]) => ({ i, k }));

  const koniecEtapu = (e: Etap, w: WynikSesji) => {
    if (e === 'powtorka') {
      onZapisz({ lekcja: lekcja.nr, czesc: 'powtorka', punkty: w.punkty, maks: w.maks, xp: w.xp, bledy: w.bledy, sekundy: w.sekundy, ukonczona: true, fiszki: fiszkiZ(w) });
      idzDo(po('powtorka'));
      return;
    }
    if (e === 'nowe') {
      lacznie.current = polaczWyniki(lacznie.current, w);
      idzDo('cwiczenia');
      return;
    }
    if (e === 'cwiczenia' || e === 'test') {
      const razem = polaczWyniki(lacznie.current, w);
      lacznie.current = razem;
      const bonus = XP_ZA_LEKCJE;
      onZapisz({
        lekcja: lekcja.nr,
        czesc: 'lekcja',
        punkty: razem.punkty,
        maks: Math.max(razem.maks, razem.punkty),
        xp: razem.xp + bonus,
        bledy: razem.bledy,
        sekundy: razem.sekundy,
        ukonczona: true,
        fiszki: fiszkiZ(razem),
      });
      setPodsumowanie({ ...razem, xp: razem.xp + bonus });
      dzwiek.koniec();
      idzDo('zeszyt');
      return;
    }
  };

  // ----------------------------------------------------------- ekrany

  if (etap === 'start') {
    const etapy = lekcja.test
      ? [
          { ik: <IkPowtorka />, pl: 'Powtórka', tl: { ru: 'Повторение', ua: 'Повторення' }, ile: powtorka.length },
          { ik: <IkGwiazda />, pl: 'Sprawdź się', tl: { ru: 'Проверь себя', ua: 'Перевір себе' }, ile: test.length },
          { ik: <IkZeszyt />, pl: 'Zeszyt', tl: { ru: 'Тетрадь', ua: 'Зошит' }, ile: 0 },
        ]
      : [
          { ik: <IkPowtorka />, pl: 'Powtórka', tl: { ru: 'Повторение', ua: 'Повторення' }, ile: powtorka.length },
          { ik: <IkNowe />, pl: 'Nowe słowa', tl: { ru: 'Новые слова', ua: 'Нові слова' }, ile: lekcja.slowa.length },
          { ik: <IkGwiazda />, pl: 'Ćwiczenia', tl: { ru: 'Упражнения', ua: 'Вправи' }, ile: cwiczenia.length },
          { ik: <IkZeszyt />, pl: 'Zeszyt', tl: { ru: 'Тетрадь', ua: 'Зошит' }, ile: 0 },
          ...(domowy ? [] : [{ ik: <IkDzwonek />, pl: 'Do dzwonka', tl: { ru: 'До звонка', ua: 'До дзвінка' }, ile: 0 }]),
        ].filter((e) => e.pl !== 'Powtórka' || e.ile > 0);
    return (
      <div className="oz-wjazd">
        <button type="button" onClick={onWyjdz} aria-label="Wróć" className="-ml-2 mb-2 flex h-11 w-11 items-center justify-center rounded-full text-[#5b5b57] hover:bg-black/5">
          <IkZamknij />
        </button>
        <div className="rounded-[2rem] px-6 pb-7 pt-6 text-white" style={{ background: kolor, boxShadow: `0 6px 0 ${ciemniej(kolor, 0.25)}` }}>
          <p className="text-[1.05rem] font-bold text-white/85">Lekcja {lekcja.nr}</p>
          <h1 className="mt-1 text-[2.1rem] font-bold leading-[1.1]" lang="pl">
            {lekcja.tytul.pl}
          </h1>
          <p className="mt-1 text-lg text-white/90">{t(lekcja.tytul)}</p>
          <p className="mt-4 text-[1.02rem] leading-snug text-white/95">{t(lekcja.cel)}</p>
        </div>
        <ol className="mt-6 space-y-2">
          {etapy.map((e, i) => (
            <li key={e.pl} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ background: jasniej(kolor, 0.85), color: ciemniej(kolor, 0.2) }}>
                {e.ik}
              </span>
              <span className="flex-1">
                <span className="block font-bold" lang="pl">
                  {i + 1}. {e.pl}
                </span>
                <span className="block text-sm text-[#6b6a65]">{t(e.tl)}</span>
              </span>
              {e.ile > 0 && <span className="text-sm font-bold text-[#8a8a85]">{e.ile}</span>}
            </li>
          ))}
        </ol>
        {!domowy && (
          <p className="mt-4 text-center text-[0.95rem] text-[#6b6a65]">
            {j === 'ru' ? 'Надень наушники. Работай спокойно до звонка.' : 'Надінь навушники. Працюй спокійно до дзвінка.'}
          </p>
        )}
        <Dol>
          {zapisany ? (
            <>
              <button type="button" className={clsx(btnBialy, 'flex-1 whitespace-nowrap px-3')} onClick={() => idzDo(pierwszy())}>
                Od nowa
              </button>
              <button
                type="button"
                className={clsx(btnGlowny, 'flex-[2] px-3')}
                onClick={() => {
                  lacznie.current = zapisany.wynik ?? pustyWynik();
                  idzDo(zapisany.etap, zapisany.idx);
                }}
              >
                Kontynuuj
              </button>
            </>
          ) : (
            <button type="button" className={clsx(btnGlowny, 'w-full')} onClick={() => idzDo(pierwszy())}>
              Zaczynamy!
            </button>
          )}
        </Dol>
      </div>
    );
  }

  const naPostep = (e: Etap) => (idx: number, w: WynikSesji) => {
    zapiszPostep(konto.id, lekcja.nr, { etap: e, idx, wynik: e === 'cwiczenia' || e === 'test' ? polaczWyniki(lacznie.current, w) : lacznie.current, dzien: dzis });
  };
  const zamknij = (e: Etap) => (w: WynikSesji) => {
    // przerwana powtorka/dzwonek - zapisujemy fiszki z tego, co zrobil
    if ((e === 'powtorka' || e === 'dzwonek') && w.zrobione > 0) {
      onZapisz({ lekcja: lekcja.nr, czesc: e, punkty: w.punkty, maks: Math.max(w.maks, w.punkty), xp: w.xp, bledy: w.bledy, sekundy: w.sekundy, ukonczona: false, fiszki: fiszkiZ(w) });
    }
    onWyjdz();
  };

  if (etap === 'powtorka' || etap === 'nowe' || etap === 'cwiczenia' || etap === 'test') {
    const zadania = { powtorka, nowe, cwiczenia, test }[etap];
    return (
      <Sesja
        key={etap}
        zadania={zadania}
        kolor={kolor}
        tryb={etap === 'test' ? 'test' : 'nauka'}
        startIdx={startIdx}
        xpWczesniej={etap === 'cwiczenia' ? lacznie.current.xp : 0}
        onPostep={naPostep(etap)}
        onKoniec={(w) => koniecEtapu(etap, w)}
        onZamknij={zamknij(etap)}
      />
    );
  }

  if (etap === 'zeszyt') {
    const linie = linieZeszytu(lekcja, j);
    return (
      <div className="oz-wjazd">
        <Polecenie pl={POLECENIE_ZESZYT.pl} tlum={t(POLECENIE_ZESZYT)} url={audioUrl(POLECENIE_ZESZYT.pl)} />
        <div
          className="rounded-[1.5rem] border border-[#e6e1d3] bg-[#fffdf6] px-5 pb-6 pt-4 shadow-[0_10px_30px_-16px_rgba(0,0,0,0.25)]"
          style={{ backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0, transparent 2.45rem, #dfe7f3 2.45rem, #dfe7f3 2.5rem)', backgroundPosition: '0 0.6rem' }}
        >
          <p className="text-[0.95rem] font-bold leading-[2.5rem] text-[#c0362c]">
            Lekcja {lekcja.nr}. {lekcja.tytul.pl}
          </p>
          {linie.map((l, i) => (
            <p key={i} className="text-[1.3rem] leading-[2.5rem]">
              <span className="font-bold" lang="pl">
                {l.pl}
              </span>
              {l.tlum && <span className="text-[#5b5b57]"> - {l.tlum}</span>}
            </p>
          ))}
        </div>
        <p className="mt-4 text-center text-[0.95rem] text-[#6b6a65]">
          {j === 'ru' ? 'Пиши аккуратно. Учитель посмотрит тетрадь.' : 'Пиши акуратно. Учитель подивиться зошит.'}
        </p>
        <Dol>
          {domowy && (
            <button type="button" className={clsx(btnBialy, 'flex-1 whitespace-nowrap px-3')} onClick={() => idzDo('koniec')}>
              Pomiń
            </button>
          )}
          <button
            type="button"
            className={clsx(btnGlowny, domowy ? 'flex-[2] px-3' : 'w-full')}
            onClick={() => {
              onZapisz({ lekcja: lekcja.nr, czesc: 'zeszyt', punkty: 1, maks: 1, xp: XP_ZA_ZESZYT, bledy: [], sekundy: 0, ukonczona: true, fiszki: [] });
              setPodsumowanie((p) => (p ? { ...p, xp: p.xp + XP_ZA_ZESZYT } : p));
              idzDo('koniec');
            }}
          >
            Przepisałem ✓
          </button>
        </Dol>
      </div>
    );
  }

  if (etap === 'koniec') {
    const w = podsumowanie ?? lacznie.current;
    const g = gwiazdki(w.punkty, w.maks);
    const minuty = Math.max(1, Math.round(w.sekundy / 60));
    const dzwonekO = stan.lekcja_do ? new Date(stan.lekcja_do).getTime() : null;
    const przedDzwonkiem = !domowy && dzwonekO !== null && dzwonekO > Date.now() + przesuniecieZegara;
    return (
      <div className="oz-wjazd flex min-h-[75vh] flex-col items-center pt-8 text-center">
        <div className="flex items-end gap-2" aria-label={`${g} z 3 gwiazdek`}>
          {[1, 2, 3].map((n) => (
            <span
              key={n}
              className={clsx(n <= g ? 'text-[#f5b400]' : 'text-[#dddcd6]', n === 2 && '-translate-y-3')}
              style={{ animation: n <= g ? `ozPodskok .5s ${n * 0.18}s cubic-bezier(.16,1,.3,1) both` : undefined }}
            >
              <IkGwiazda className={n === 2 ? 'h-24 w-24' : 'h-[4.5rem] w-[4.5rem]'} />
            </span>
          ))}
        </div>
        <h1 className="mt-6 text-[2.3rem] font-bold leading-tight">{g === 3 ? 'Świetnie!' : g === 2 ? 'Dobra robota!' : 'Brawo, dalej!'}</h1>
        <p className="mt-1 text-lg text-[#5b5b57]">
          {j === 'ru' ? `Урок ${lekcja.nr} пройден.` : `Урок ${lekcja.nr} пройдено.`}
        </p>
        <div className="mt-7 grid w-full grid-cols-3 gap-3">
          <div className="rounded-2xl bg-white px-2 py-4">
            <p className="flex items-center justify-center gap-1 text-[1.6rem] font-bold text-[#c78a00]">
              <IkBlyskawica className="h-6 w-6" />
              {w.xp}
            </p>
            <p className="text-sm text-[#6b6a65]">XP</p>
          </div>
          <div className="rounded-2xl bg-white px-2 py-4">
            <p className="text-[1.6rem] font-bold" style={{ color: kolor }}>
              {w.punkty}/{w.maks}
            </p>
            <p className="text-sm text-[#6b6a65]">{j === 'ru' ? 'с первого раза' : 'з першого разу'}</p>
          </div>
          <div className="rounded-2xl bg-white px-2 py-4">
            <p className="text-[1.6rem] font-bold">{minuty}</p>
            <p className="text-sm text-[#6b6a65]">min</p>
          </div>
        </div>
        {!lekcja.test && (
          <div className="mt-6 w-full rounded-3xl bg-white px-4 py-4 text-left">
            <p className="text-sm font-bold text-[#6b6a65]">{j === 'ru' ? 'Новые слова' : 'Нові слова'}</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {kartyLekcji(lekcja.nr)
                .filter((k) => !k.zdanie)
                .map((k) => (
                  <li key={k.id} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[1.05rem] font-bold" style={{ background: jasniej(kolor, 0.86) }} lang="pl">
                    <span aria-hidden="true">{k.e}</span>
                    {k.pl}
                  </li>
                ))}
            </ul>
          </div>
        )}
        <Dol>
          {przedDzwonkiem ? (
            <>
              <button type="button" className={clsx(btnBialy, 'flex-1 whitespace-nowrap px-3')} onClick={onWyjdz}>
                Mapa
              </button>
              <button type="button" className={clsx(btnGlowny, 'flex-[2] px-3')} onClick={() => idzDo('dzwonek')}>
                Ćwiczę dalej
              </button>
            </>
          ) : (
            <>
              <button type="button" className={clsx(btnBialy, 'flex-1 whitespace-nowrap px-3')} onClick={() => idzDo('dzwonek')}>
                Jeszcze trochę
              </button>
              <button type="button" className={clsx(btnGlowny, 'flex-[2] px-3')} onClick={onWyjdz}>
                Gotowe
              </button>
            </>
          )}
        </Dol>
      </div>
    );
  }

  // etap 'dzwonek': zadania z tej i wczesniejszych lekcji, najpierw slabe
  return <DoDzwonka lekcja={lekcja} kolor={kolor} stan={stan} przesuniecieZegara={przesuniecieZegara} limit={domowy || !stan.lekcja_do ? 8 : null} seed={`${ziarno}:${proba.current}`} onZapisz={onZapisz} onWyjdz={onWyjdz} />;
}

/** Etap "Do dzwonka" (tez osobno z mapy: "Ćwicz"). `limit` - ile zadan, gdy nie ma dzwonka. */
export function DoDzwonka({
  lekcja,
  kolor,
  stan,
  przesuniecieZegara,
  limit,
  seed,
  onZapisz,
  onWyjdz,
}: {
  lekcja: LekcjaOZ;
  kolor: string;
  stan: StanKursu;
  przesuniecieZegara: number;
  limit: number | null;
  seed: string;
  onZapisz: (z: Zapis) => void;
  onWyjdz: () => void;
}) {
  const pula = useMemo(() => pulaDo(lekcja.nr), [lekcja.nr]);
  const fiszki = useMemo(() => new Map<string, Fiszka>(stan.fiszki.map((f) => [f.item, f])), [stan.fiszki]);
  const r = useMemo(() => rng(seed), [seed]);
  const ostatnie = useRef<string[]>([]);
  const dzwonekO = limit === null && stan.lekcja_do ? new Date(stan.lekcja_do).getTime() : null;
  const generator = (n: number) => {
    if (limit !== null && n >= limit) return null;
    const z = zadanieDzwonek(pula, fiszki, r, ostatnie.current, n);
    if (z && 'karta' in z) ostatnie.current = [z.karta.id, ...ostatnie.current].slice(0, 4);
    return z;
  };
  const zapisz = (w: WynikSesji) => {
    if (w.zrobione === 0) return;
    onZapisz({
      lekcja: lekcja.nr,
      czesc: 'dzwonek',
      punkty: w.punkty,
      maks: Math.max(w.maks, w.punkty),
      xp: w.xp,
      bledy: w.bledy,
      sekundy: w.sekundy,
      ukonczona: true,
      fiszki: Object.entries(w.fiszki).map(([i, k]) => ({ i, k })),
    });
  };
  return (
    <Sesja
      zadania={[]}
      kolor={kolor}
      tryb="bez-konca"
      generator={generator}
      dzwonekO={dzwonekO}
      przesuniecieZegara={przesuniecieZegara}
      onKoniec={(w) => {
        zapisz(w);
        onWyjdz();
      }}
      onZamknij={(w) => {
        zapisz(w);
        onWyjdz();
      }}
    />
  );
}

