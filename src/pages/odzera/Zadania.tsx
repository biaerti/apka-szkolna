// Ekrany zadan kursu "Polski od zera". Kazde zadanie to jeden ekran: polecenie
// (po polsku z nagraniem + tlumaczenie), tresc i przycisk na dole. Ocenione zadania
// wolaja onWynik, a Sesja pokazuje arkusz "Dobrze!/Prawie" i prowadzi dalej.

import clsx from 'clsx';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  POLECENIA,
  audioUrl,
  bezInterpunkcji,
  sprawdzTekst,
  tasuj,
  rng,
  wymowaKarty,
  type Karta,
  type Ocena,
  type Zadanie,
} from '../../lib/odzera';
import { dzwiek, graj, wczytaj } from './audio';
import { Dol, Glosnik, JezykCtx, Podswietl, Polecenie, btnGlowny, ciemniej, jasniej, useT } from './ui';

export interface WynikZadania {
  ok: boolean;
  ocena?: Ocena;
  wpisane?: string;
  /** Pary: id kart, przy ktorych byla pomylka. */
  bledne?: string[];
}

export interface PropsZadania {
  z: Zadanie;
  kolor: string;
  /** Pierwsze zadanie tego typu w sesji - najpierw czytamy polecenie. */
  pierwszyRaz: boolean;
  /** Odpowiedz juz sprawdzona (pokazujemy dobra, blokujemy wybor). */
  sprawdzone: WynikZadania | null;
  onWynik: (w: WynikZadania) => void;
  onDalej: () => void;
}

const urlPolecenia = (typ: Zadanie['typ']) => audioUrl(POLECENIA[typ].pl);

/** Na start zadania: polecenie (za pierwszym razem), potem nagranie karty. */
function useAutoGraj(klucz: string, pierwszyRaz: boolean, typ: Zadanie['typ'], url: string | null) {
  useEffect(() => {
    let anulowane = false;
    void (async () => {
      if (pierwszyRaz) await graj(urlPolecenia(typ));
      if (!anulowane && url) await graj(url);
    })();
    return () => {
      anulowane = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [klucz]);
}

function PolecenieZadania({ typ }: { typ: Zadanie['typ'] }) {
  const t = useT();
  const p = POLECENIA[typ];
  return <Polecenie pl={p.pl} tlum={t(p)} url={urlPolecenia(typ)} />;
}

// ------------------------------------------------------------------ poznaj

export function ZPoznaj({ z, kolor, onDalej, pierwszyRaz }: PropsZadania & { z: Extract<Zadanie, { typ: 'poznaj' }> }) {
  const t = useT();
  const j = useContext(JezykCtx);
  const k = z.karta;
  useAutoGraj(z.klucz, pierwszyRaz, 'poznaj', audioUrl(k));
  return (
    <div className="oz-wjazd">
      <PolecenieZadania typ="poznaj" />
      <div className="overflow-hidden rounded-[2rem] text-center" style={{ background: jasniej(kolor, 0.82), boxShadow: `0 6px 0 ${jasniej(kolor, 0.55)}` }}>
        <div className="flex items-center justify-center pt-5" aria-hidden="true">
          <span className={clsx('leading-none', k.zdanie ? 'text-[4.2rem]' : 'text-[5.6rem]')} style={{ animation: 'ozPodskok .5s cubic-bezier(.16,1,.3,1) both' }}>
            {k.e}
          </span>
        </div>
        <div className="px-5 pb-5 pt-3">
          <p className={clsx('font-bold leading-tight', k.zdanie ? 'text-[1.8rem]' : 'text-[2.4rem]')} lang="pl">
            {k.pl}
          </p>
          <p className="mt-1 text-lg" style={{ color: ciemniej(kolor, 0.45) }} lang={j === 'ru' ? 'ru' : 'uk'}>
            [{wymowaKarty(k, j)}]
          </p>
          <p className="mt-2 text-xl font-bold leading-snug" style={{ color: ciemniej(kolor, 0.55) }}>
            {t(k)}
          </p>
          <div className="mt-4 flex items-center justify-center gap-4">
            <Glosnik url={audioUrl(k)} duzy kolor={kolor} />
            <Glosnik url={audioUrl(k)} wolno kolor={ciemniej(kolor, 0.2)} etykieta="Posłuchaj wolno" />
          </div>
        </div>
      </div>
      <Dol>
        <button type="button" className={clsx(btnGlowny, 'w-full')} onClick={onDalej}>
          Dalej
        </button>
      </Dol>
    </div>
  );
}

// ------------------------------------------------------------------ zasada

export function ZZasada({ z, kolor, onDalej }: PropsZadania & { z: Extract<Zadanie, { typ: 'zasada' }> }) {
  const t = useT();
  const j = useContext(JezykCtx);
  const zas = z.zasada;
  const akcent = zas.litery.includes('-');
  return (
    <div className="oz-wjazd">
      <PolecenieZadania typ="zasada" />
      <div className="rounded-[2rem] bg-white p-6 shadow-[0_1px_0_rgba(0,0,0,0.04),0_10px_30px_-14px_rgba(0,0,0,0.18)]">
        <div className="flex flex-wrap items-baseline justify-center gap-x-4 gap-y-1 text-center">
          <span className="text-[3.4rem] font-bold leading-none tracking-wide" style={{ color: kolor }} lang="pl">
            {zas.litery}
          </span>
          {!akcent && (
            <>
              <span className="text-[2.2rem] font-bold text-[#b5b4ad]">=</span>
              <span className="text-[2.6rem] font-bold leading-none" lang={j === 'ru' ? 'ru' : 'uk'}>
                {t(zas.dzwiek)}
              </span>
            </>
          )}
        </div>
        {akcent && <p className="mt-2 text-center text-xl font-bold">{t(zas.dzwiek)}</p>}
        <p className="mt-4 text-center text-[1.05rem] leading-snug text-[#3a3a37]">{t(zas.opis)}</p>
        <ul className="mt-5 divide-y divide-[#efeee9]">
          {z.przyklady.map((k) => (
            <li key={k.id} className="flex items-center gap-3 py-2.5">
              <span className="w-12 shrink-0 text-center text-[2.2rem] leading-none" aria-hidden="true">
                {k.e}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[1.6rem] font-bold leading-tight" lang="pl">
                  <Podswietl tekst={k.pl} litery={zas.litery} kolor={kolor} />
                </span>
                <span className="block text-[0.95rem] text-[#6b6a65]">
                  [{wymowaKarty(k, j)}] · {t(k)}
                </span>
              </span>
              <Glosnik url={audioUrl(k)} kolor={kolor} />
            </li>
          ))}
        </ul>
      </div>
      <Dol>
        <button type="button" className={clsx(btnGlowny, 'w-full')} onClick={onDalej}>
          Dalej
        </button>
      </Dol>
    </div>
  );
}

// ------------------------------------------------------------------ wybor (4 typy)

const kafelOdpowiedzi = (wybrany: boolean, stan: 'dobra' | 'zla' | null, kolor: string) => ({
  className: clsx(
    'relative flex items-center justify-center rounded-3xl border-[3px] bg-white transition-[transform,box-shadow,border-color] duration-150 active:translate-y-[3px] disabled:active:translate-y-0',
    stan === 'zla' && 'animate-[ozTrzes_.3s_ease-in-out]',
  ),
  style: {
    borderColor: stan === 'dobra' ? '#22a95b' : stan === 'zla' ? '#e0574c' : wybrany ? kolor : '#e3e2dc',
    background: stan === 'dobra' ? '#e7f7ec' : stan === 'zla' ? '#fdeceb' : wybrany ? jasniej(kolor, 0.88) : '#fff',
    boxShadow: `0 4px 0 ${stan === 'dobra' ? '#9fd9b4' : stan === 'zla' ? '#f1b3ae' : wybrany ? jasniej(kolor, 0.45) : '#e3e2dc'}`,
  },
});

export function ZWybor({ z, kolor, pierwszyRaz, sprawdzone, onWynik }: PropsZadania & { z: Extract<Zadanie, { typ: 'sluchaj' | 'obrazek' | 'czytaj' | 'tlumacz' }> }) {
  const t = useT();
  const [wybor, setWybor] = useState<string | null>(null);
  const k = z.karta;
  const zAudio = z.typ === 'sluchaj' || z.typ === 'tlumacz';
  useAutoGraj(z.klucz, pierwszyRaz, z.typ, zAudio ? audioUrl(k) : null);
  useEffect(() => {
    setWybor(null);
    wczytaj(z.opcje.map(audioUrl));
  }, [z]);
  const obrazki = z.typ === 'sluchaj' || z.typ === 'czytaj';

  const stanOpcji = (o: Karta): 'dobra' | 'zla' | null => {
    if (!sprawdzone) return null;
    if (o.id === k.id) return 'dobra';
    if (o.id === wybor) return 'zla';
    return null;
  };

  return (
    <div className="oz-wjazd">
      <PolecenieZadania typ={z.typ} />
      {/* Pytanie */}
      <div className="mb-6 flex flex-col items-center gap-3 text-center">
        {z.typ === 'sluchaj' && (
          <div className="flex items-center gap-4 py-4">
            <Glosnik url={audioUrl(k)} duzy kolor={kolor} />
            <Glosnik url={audioUrl(k)} wolno kolor={ciemniej(kolor, 0.2)} etykieta="Posłuchaj wolno" />
          </div>
        )}
        {z.typ === 'obrazek' && (
          <span className="flex h-40 w-40 items-center justify-center rounded-full text-[6rem] leading-none" style={{ background: jasniej(kolor, 0.82) }} aria-label="obrazek">
            {k.e}
          </span>
        )}
        {z.typ === 'czytaj' && (
          <p className="rounded-3xl bg-white px-6 py-5 text-[2.4rem] font-bold leading-tight shadow-[0_1px_0_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.14)]" lang="pl">
            {k.pl}
          </p>
        )}
        {z.typ === 'tlumacz' && (
          <div className="flex items-center gap-3">
            <Glosnik url={audioUrl(k)} kolor={kolor} />
            <p className="text-left text-[1.9rem] font-bold leading-tight" lang="pl">
              {k.pl}
            </p>
          </div>
        )}
      </div>
      {/* Odpowiedzi */}
      <div className={clsx(obrazki ? 'grid grid-cols-2 gap-3' : 'flex flex-col gap-3')} role="radiogroup">
        {z.opcje.map((o) => {
          const s = kafelOdpowiedzi(wybor === o.id, stanOpcji(o), kolor);
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={wybor === o.id}
              disabled={Boolean(sprawdzone)}
              onClick={() => {
                dzwiek.klik();
                setWybor(o.id);
              }}
              className={clsx(s.className, obrazki ? 'aspect-square text-[4.2rem] leading-none' : 'min-h-[4rem] px-4 py-3 text-left')}
              style={s.style}
              aria-label={obrazki ? o.pl : undefined}
            >
              {obrazki ? (
                <span aria-hidden="true">{o.e}</span>
              ) : z.typ === 'tlumacz' ? (
                <span className="w-full text-[1.2rem] font-bold leading-snug">{t(o)}</span>
              ) : (
                <span className="w-full text-center text-[1.6rem] font-bold" lang="pl">
                  {o.pl}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {!sprawdzone && (
        <Dol>
          <button type="button" className={clsx(btnGlowny, 'w-full')} disabled={!wybor} onClick={() => onWynik({ ok: wybor === k.id })}>
            Sprawdź
          </button>
        </Dol>
      )}
    </div>
  );
}

// ------------------------------------------------------------------ pary

export function ZPary({ z, kolor, pierwszyRaz, onWynik }: PropsZadania & { z: Extract<Zadanie, { typ: 'pary' }> }) {
  const prawe = useMemo(() => tasuj(z.karty, rng(z.klucz)), [z]);
  const [lewy, setLewy] = useState<string | null>(null);
  const [prawy, setPrawy] = useState<string | null>(null);
  const [gotowe, setGotowe] = useState<Set<string>>(new Set());
  const [zle, setZle] = useState<string | null>(null);
  const bledne = useRef<Set<string>>(new Set());
  useAutoGraj(z.klucz, pierwszyRaz, 'pary', null);

  useEffect(() => {
    if (!lewy || !prawy) return;
    if (lewy === prawy) {
      dzwiek.dobrze();
      const karta = z.karty.find((k) => k.id === lewy)!;
      void graj(audioUrl(karta));
      const nowe = new Set(gotowe).add(lewy);
      setGotowe(nowe);
      setLewy(null);
      setPrawy(null);
      if (nowe.size === z.karty.length) {
        window.setTimeout(() => onWynik({ ok: bledne.current.size === 0, bledne: [...bledne.current] }), 450);
      }
    } else {
      dzwiek.zle();
      bledne.current.add(lewy);
      setZle(`${lewy}|${prawy}`);
      window.setTimeout(() => {
        setZle(null);
        setLewy(null);
        setPrawy(null);
      }, 450);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lewy, prawy]);

  const styl = (id: string, strona: 'l' | 'p') => {
    const zrobione = gotowe.has(id);
    const wybrany = strona === 'l' ? lewy === id : prawy === id;
    const blad = zle && (strona === 'l' ? zle.startsWith(`${id}|`) : zle.endsWith(`|${id}`));
    return kafelOdpowiedzi(wybrany, zrobione ? 'dobra' : blad ? 'zla' : null, kolor);
  };

  return (
    <div className="oz-wjazd">
      <PolecenieZadania typ="pary" />
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-3">
          {z.karty.map((k) => {
            const s = styl(k.id, 'l');
            return (
              <button
                key={k.id}
                type="button"
                disabled={gotowe.has(k.id)}
                onClick={() => {
                  dzwiek.klik();
                  setLewy(k.id);
                }}
                className={clsx(s.className, 'min-h-[4.5rem] px-2 text-[1.35rem] font-bold leading-tight disabled:opacity-60')}
                style={s.style}
                lang="pl"
              >
                {k.pl}
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-3">
          {prawe.map((k) => {
            const s = styl(k.id, 'p');
            return (
              <button
                key={k.id}
                type="button"
                disabled={gotowe.has(k.id)}
                onClick={() => {
                  dzwiek.klik();
                  setPrawy(k.id);
                }}
                className={clsx(s.className, 'min-h-[4.5rem] text-[2.6rem] leading-none disabled:opacity-60')}
                style={s.style}
                aria-label={k.pl}
              >
                <span aria-hidden="true">{k.e}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ ukladanie z kafelkow

export function ZKafelki({ z, kolor, pierwszyRaz, sprawdzone, onWynik }: PropsZadania & { z: Extract<Zadanie, { typ: 'litery' | 'zdanie' }> }) {
  const t = useT();
  const k = z.karta;
  const litery = z.typ === 'litery';
  // indeksy kafelkow w kolejnosci ulozenia
  const [ulozone, setUlozone] = useState<number[]>([]);
  useEffect(() => setUlozone([]), [z]);
  useAutoGraj(z.klucz, pierwszyRaz, z.typ, audioUrl(k));
  const wzor = litery ? bezInterpunkcji(k.pl).toLowerCase() : bezInterpunkcji(k.pl);
  const ileTrzeba = litery ? [...wzor].length : wzor.split(' ').length;
  const tekst = ulozone.map((i) => z.kafelki[i]).join(litery ? '' : ' ');

  return (
    <div className="oz-wjazd">
      <PolecenieZadania typ={z.typ} />
      <div className="mb-5 flex items-center gap-4">
        <Glosnik url={audioUrl(k)} kolor={kolor} duzy={litery} />
        <div className="min-w-0">
          {litery && (
            <span className="mr-2 text-[3rem] leading-none" aria-hidden="true">
              {k.e}
            </span>
          )}
          <p className="text-lg font-bold leading-snug text-[#3a3a37]">{t(k)}</p>
        </div>
      </div>
      {/* Pole odpowiedzi */}
      <div
        className={clsx(
          'flex min-h-[5rem] flex-wrap content-start items-center gap-2 rounded-3xl border-2 border-dashed p-3',
          sprawdzone ? (sprawdzone.ok ? 'border-[#22a95b] bg-[#e7f7ec]' : 'border-[#e0574c] bg-[#fdeceb]') : 'border-[#d6d5cf] bg-white/60',
        )}
        aria-label="Twoja odpowiedź"
      >
        {ulozone.map((i, poz) => (
          <button
            key={`${i}-${poz}`}
            type="button"
            disabled={Boolean(sprawdzone)}
            onClick={() => setUlozone(ulozone.filter((_, p) => p !== poz))}
            className={clsx('rounded-2xl border-2 border-[#e3e2dc] bg-white font-bold shadow-[0_3px_0_#e3e2dc] active:translate-y-[2px]', litery ? 'h-14 w-12 text-[1.7rem]' : 'px-3 py-2 text-[1.35rem]')}
            lang="pl"
          >
            {z.kafelki[i]}
          </button>
        ))}
      </div>
      {/* Bank */}
      <div className="mt-6 flex flex-wrap justify-center gap-2.5">
        {z.kafelki.map((kaf, i) => {
          const uzyty = ulozone.includes(i);
          return (
            <button
              key={i}
              type="button"
              disabled={uzyty || Boolean(sprawdzone)}
              onClick={() => {
                dzwiek.klik();
                setUlozone([...ulozone, i]);
              }}
              className={clsx(
                'rounded-2xl border-2 font-bold transition-[opacity,transform] active:translate-y-[2px]',
                litery ? 'h-14 w-12 text-[1.7rem]' : 'px-3 py-2 text-[1.35rem]',
                uzyty ? 'border-[#e6e5df] bg-[#ecebe5] text-transparent shadow-none' : 'border-[#e3e2dc] bg-white shadow-[0_3px_0_#e3e2dc]',
              )}
              lang="pl"
              aria-hidden={uzyty}
            >
              {kaf}
            </button>
          );
        })}
      </div>
      {!sprawdzone && (
        <Dol>
          <button
            type="button"
            className={clsx(btnGlowny, 'w-full')}
            disabled={ulozone.length < (litery ? ileTrzeba : 1)}
            onClick={() => {
              const ok = litery ? tekst.toLowerCase() === wzor : tekst.toLowerCase() === wzor.toLowerCase();
              onWynik({ ok, wpisane: tekst });
            }}
          >
            Sprawdź
          </button>
        </Dol>
      )}
    </div>
  );
}

// ------------------------------------------------------------------ pisanie ze sluchu

const POLSKIE = ['ą', 'ć', 'ę', 'ł', 'ń', 'ó', 'ś', 'ź', 'ż'];

export function ZNapisz({ z, kolor, pierwszyRaz, sprawdzone, onWynik }: PropsZadania & { z: Extract<Zadanie, { typ: 'napisz' }> }) {
  const k = z.karta;
  const [tekst, setTekst] = useState('');
  const pole = useRef<HTMLInputElement>(null);
  useEffect(() => setTekst(''), [z]);
  useAutoGraj(z.klucz, pierwszyRaz, 'napisz', audioUrl(k));

  const wstaw = (znak: string) => {
    const el = pole.current;
    if (!el) return setTekst((t) => t + znak);
    const a = el.selectionStart ?? tekst.length;
    const b = el.selectionEnd ?? tekst.length;
    const nowy = tekst.slice(0, a) + znak + tekst.slice(b);
    setTekst(nowy);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(a + znak.length, a + znak.length);
    });
  };

  const sprawdz = () => {
    if (!tekst.trim() || sprawdzone) return;
    const ocena = sprawdzTekst(tekst, k.pl);
    onWynik({ ok: ocena === 'dobrze', ocena, wpisane: tekst.trim() });
  };

  return (
    <div className="oz-wjazd">
      <PolecenieZadania typ="napisz" />
      <div className="mb-5 flex items-center justify-center gap-4">
        <span className="text-[3.2rem] leading-none" aria-hidden="true">
          {k.e}
        </span>
        <Glosnik url={audioUrl(k)} duzy kolor={kolor} />
        <Glosnik url={audioUrl(k)} wolno kolor={ciemniej(kolor, 0.2)} etykieta="Posłuchaj wolno" />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sprawdz();
        }}
      >
        <input
          ref={pole}
          value={tekst}
          onChange={(e) => setTekst(e.target.value)}
          disabled={Boolean(sprawdzone)}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="done"
          lang="pl"
          aria-label="Napisz słowo"
          placeholder="Pisz tutaj…"
          className={clsx(
            'w-full rounded-3xl border-[3px] bg-white px-5 py-4 text-[1.8rem] font-bold outline-none placeholder:font-normal placeholder:text-[#b5b4ad]',
            sprawdzone ? (sprawdzone.ok ? 'border-[#22a95b]' : 'border-[#e0574c]') : 'border-[#d6d5cf] focus:border-[#1f8fe0]',
          )}
        />
      </form>
      <div className="mt-3 flex flex-wrap justify-center gap-2" aria-label="Polskie litery">
        {POLSKIE.map((l) => (
          <button
            key={l}
            type="button"
            disabled={Boolean(sprawdzone)}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => wstaw(l)}
            className="h-12 w-11 rounded-xl border-2 border-[#e3e2dc] bg-white text-[1.45rem] font-bold shadow-[0_3px_0_#e3e2dc] active:translate-y-[2px]"
          >
            {l}
          </button>
        ))}
      </div>
      {!sprawdzone && (
        <Dol>
          <button type="button" className={clsx(btnGlowny, 'w-full')} disabled={!tekst.trim()} onClick={sprawdz}>
            Sprawdź
          </button>
        </Dol>
      )}
    </div>
  );
}
