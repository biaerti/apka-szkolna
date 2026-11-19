// Slajd czytanki z lektorem: tekst przewija sie jak napisy i podswietla slowo
// po slowie w rytm nagrania ElevenLabs (czasy slow z audio-czytanki/synchronizuj.py).
// Dzieci czytaja w podreczniku albo z ekranu - kto sie zgubi, widzi, gdzie jestesmy.
//
// Spacja = czytaj / pauza (faza capture, przed klawiszami prezentacji), klik
// w slowo = czytaj od tego miejsca. Strzalki dalej zmieniaja slajdy.
// Kolko myszy przewija tekst recznie (lektor czyta dalej, tekst za nim nie skacze,
// az do "Wroc do lektora" albo kliku w slowo). Z = tryb zaznaczania: klik albo
// przeciagniecie po slowach zakresla je markerem (drugi raz zmazuje), bez
// przewijania nagrania. Zakreslenia zostaja w przegladarce dla tej czytanki,
// tej klasy i tego dnia - kolejna klasa (i kolejny dzien) dostaje czysty tekst.

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent } from 'react';
import type { Slide } from '../../data/types';
import { czytankaById, czytankaUrl, wczytajSynchro, type AkapitCzytanki } from '../../data/czytanki';
import { useSlideFontScale } from './useSlideFontScale';

type CzytankaSlide = Extract<Slide, { kind: 'czytanka' }>;

/** Okno z tekstem na kartce 1280x720 - biezaca linijka stoi na tej wysokosci. */
const OKNO_H = 548;
const LINIA_BIEZACA = 0.3;

/** Ostatnie slowo, ktore juz sie zaczelo (-1 przed pierwszym). */
function indeksSlowa(starty: number[], t: number): number {
  let lo = 0;
  let hi = starty.length - 1;
  let wynik = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (starty[mid] <= t + 0.05) {
      wynik = mid;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return wynik;
}

/** Zakreslacz - kolor pelny (lime-300 na 40% na tle slajdu), bo nachodzace
 *  na siebie polprzezroczyste kawalki dawalyby ciemniejsze paski miedzy slowami. */
const MARKER = 'bg-[#4e6533]';

const PREFIKS_ZAZNACZEN = 'czytanka-zaznaczenia:';

function dzis(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Zakreslenia na jedna lekcje: czytanka + klasa + dzien. */
export function kluczZaznaczen(id: string, klasaId: string | undefined, dzien: string): string {
  return `${PREFIKS_ZAZNACZEN}${id}:${klasaId ?? '-'}:${dzien}`;
}

/** Sprzata zakreslenia z innych dni (i stary zapis bez klasy i daty). */
function sprzatnijStareZaznaczenia(dzien: string) {
  try {
    const stare: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(PREFIKS_ZAZNACZEN) && !k.endsWith(`:${dzien}`)) stare.push(k);
    }
    stare.forEach((k) => localStorage.removeItem(k));
  } catch {
    // brak localStorage (tryb prywatny) - nic do sprzatania
  }
}

function wczytajZaznaczenia(klucz: string): Set<number> {
  try {
    const raw = localStorage.getItem(klucz);
    return new Set(raw ? (JSON.parse(raw) as number[]) : []);
  } catch {
    return new Set();
  }
}

function zapiszZaznaczeniaLS(klucz: string, zbior: Set<number>) {
  if (zbior.size) localStorage.setItem(klucz, JSON.stringify([...zbior]));
  else localStorage.removeItem(klucz);
}

function czas(s: number): string {
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
}

/** `klasaId` - zakreslenia osobno dla kazdej klasy (inaczej 4c widzi markery z 4b). */
export function CzytankaSlideView({ slide, klasaId }: { slide: CzytankaSlide; klasaId?: string }) {
  const czytanka = czytankaById(slide.czytankaId);
  const scale = useSlideFontScale();
  const audioRef = useRef<HTMLAudioElement>(null);
  const tekstRef = useRef<HTMLDivElement>(null);
  const paskRef = useRef<HTMLDivElement>(null);
  const czasRef = useRef<HTMLSpanElement>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [akapity, setAkapity] = useState<AkapitCzytanki[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [gra, setGra] = useState(false);
  const [idx, setIdx] = useState(-1);
  const [przesuniecie, setPrzesuniecie] = useState(OKNO_H * LINIA_BIEZACA);
  // Tekst przewiniety kolkiem - nie wraca sam do biezacego slowa.
  const [reczne, setReczne] = useState(false);
  const [zaznaczanie, setZaznaczanie] = useState(false);
  const [zaznaczone, setZaznaczone] = useState<Set<number>>(() => new Set());
  // Trwajace przeciaganie markerem: od ktorego slowa, do ktorego, czy zmazuje.
  const [przeciag, setPrzeciag] = useState<{ od: number; do: number; zmaz: boolean } | null>(null);
  const przeciagRef = useRef(przeciag);
  przeciagRef.current = przeciag;
  const czytankaId = czytanka?.id;
  const kluczZ = czytankaId ? kluczZaznaczen(czytankaId, klasaId, dzis()) : undefined;

  useEffect(() => {
    let cancelled = false;
    setUrl(null);
    setAkapity(null);
    setError(null);
    setIdx(-1);
    setReczne(false);
    sprzatnijStareZaznaczenia(dzis());
    setZaznaczone(czytanka ? wczytajZaznaczenia(kluczZaznaczen(czytanka.id, klasaId, dzis())) : new Set());
    if (!czytanka) return;
    Promise.all([czytankaUrl(czytanka), wczytajSynchro(czytanka)])
      .then(([nextUrl, nextAkapity]) => {
        if (cancelled) return;
        setUrl(nextUrl);
        setAkapity(nextAkapity);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [czytanka, klasaId]);

  const starty = useMemo(() => (akapity ?? []).flatMap((a) => a.slowa.map((s) => s[1])), [akapity]);

  // timeupdate przychodzi ~4 razy na sekunde - za rzadko na slowa, wiec w czasie
  // grania liczymy co klatke. timeupdate zostaje jako zapas, gdy przegladarka
  // dlawi klatki (karta w tle). Stan zmienia sie tylko przy nowym slowie.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !gra) return;
    let raf = 0;
    const odswiez = () => {
      setIdx(indeksSlowa(starty, audio.currentTime));
      if (paskRef.current && audio.duration) {
        paskRef.current.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
      }
      if (czasRef.current) czasRef.current.textContent = czas(audio.currentTime);
    };
    const krok = () => {
      odswiez();
      raf = requestAnimationFrame(krok);
    };
    raf = requestAnimationFrame(krok);
    audio.addEventListener('timeupdate', odswiez);
    return () => {
      cancelAnimationFrame(raf);
      audio.removeEventListener('timeupdate', odswiez);
    };
  }, [gra, starty]);

  // Biezaca linijka zawsze na tej samej wysokosci - tekst plynie do gory jak napisy.
  useLayoutEffect(() => {
    if (reczne) return;
    const el = tekstRef.current?.querySelector<HTMLElement>(`[data-i="${Math.max(idx, 0)}"]`);
    if (el) setPrzesuniecie(OKNO_H * LINIA_BIEZACA - el.offsetTop);
  }, [idx, akapity, reczne]);

  // Kolko: gora tekstu nie schodzi nizej niz linijka czytania, koniec nie ucieka nad srodek okna.
  function przewinKolkiem(dy: number) {
    const wys = tekstRef.current?.offsetHeight ?? 0;
    const max = OKNO_H * LINIA_BIEZACA;
    const min = Math.min(max, OKNO_H * 0.6 - wys);
    setReczne(true);
    setPrzesuniecie((p) => Math.max(min, Math.min(max, p - dy)));
  }

  // Koniec przeciagania (takze poza tekstem) - zakres trafia do zaznaczen.
  const ciagnie = przeciag !== null;
  useEffect(() => {
    if (!ciagnie) return;
    function koniec() {
      const p = przeciagRef.current;
      if (!p) return;
      setPrzeciag(null);
      setZaznaczone((stare) => {
        const next = new Set(stare);
        for (let i = Math.min(p.od, p.do); i <= Math.max(p.od, p.do); i++) {
          if (p.zmaz) next.delete(i);
          else next.add(i);
        }
        if (kluczZ) zapiszZaznaczeniaLS(kluczZ, next);
        return next;
      });
    }
    window.addEventListener('pointerup', koniec);
    window.addEventListener('pointercancel', koniec);
    return () => {
      window.removeEventListener('pointerup', koniec);
      window.removeEventListener('pointercancel', koniec);
    };
  }, [ciagnie, kluczZ]);

  function przelacz() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      setReczne(false);
      void audio.play();
    } else audio.pause();
  }

  function czytajOd(start: number) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = start;
    setIdx(indeksSlowa(starty, start));
    setReczne(false);
    void audio.play();
  }

  // Klik albo przeciagniecie po pasku: przewija nagranie, nie zmienia grania/pauzy.
  function przewinPaskiem(e: PointerEvent<HTMLDivElement>) {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration) || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ulamek = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const t = ulamek * audio.duration;
    audio.currentTime = t;
    setIdx(indeksSlowa(starty, t));
    setReczne(false);
    if (paskRef.current) paskRef.current.style.width = `${ulamek * 100}%`;
    if (czasRef.current) czasRef.current.textContent = czas(t);
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.key === 'z' || e.key === 'Z') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        e.stopPropagation();
        setZaznaczanie((on) => !on);
        return;
      }
      if (e.key !== ' ' && e.code !== 'Space') return;
      e.preventDefault();
      e.stopPropagation();
      przelacz();
    }
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, []);

  useEffect(() => () => audioRef.current?.pause(), []);

  function jestZakreslone(i: number): boolean {
    if (przeciag && i >= Math.min(przeciag.od, przeciag.do) && i <= Math.max(przeciag.od, przeciag.do)) return !przeciag.zmaz;
    return zaznaczone.has(i);
  }

  const fontSize = Math.round(38 * scale);
  let licznik = 0;

  return (
    <div className="flex h-full flex-col px-16 pt-7">
      {/* Tytul i autor sa w pierwszej linijce czytanki; prawy gorny rog zajmuje zegar prezentacji. */}
      <span className="shrink-0 text-[34px] font-bold text-accent-300">
        {czytanka ? (czytanka.rozdzial ? `Lektura, rozdz. ${czytanka.rozdzial}` : `Podręcznik s. ${czytanka.pages}`) : 'Czytanka'}
      </span>

      <div
        className="relative mt-3 shrink-0 overflow-hidden"
        onWheel={(e) => {
          if (akapity) przewinKolkiem(e.deltaMode === 1 ? e.deltaY * 40 : e.deltaY);
        }}
        // W trybie zaznaczania klik w tekst nie zmienia slajdu.
        onClick={zaznaczanie ? (e) => e.stopPropagation() : undefined}
        style={{
          height: OKNO_H,
          maskImage: 'linear-gradient(to bottom, transparent 0, #000 14%, #000 80%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, #000 14%, #000 80%, transparent 100%)',
        }}
      >
        {akapity ? (
          <div
            ref={tekstRef}
            className={`relative mx-auto max-w-[1080px] font-serif ${zaznaczanie ? 'select-none' : ''}`}
            style={{
              fontSize,
              lineHeight: 1.55,
              transform: `translateY(${przesuniecie}px)`,
              transition: reczne ? 'transform 150ms ease-out' : 'transform 700ms cubic-bezier(.25,.8,.3,1)',
            }}
          >
            {akapity.map((akapit, a) => (
              <p
                key={a}
                className={a === 0 ? 'mb-6 font-sans font-bold text-accent-300' : ''}
                style={{ marginTop: akapit.odstep ? fontSize * 0.7 : 0 }}
              >
                {akapit.slowa.map(([slowo, start]) => {
                  const i = licznik++;
                  const zakreslone = jestZakreslone(i);
                  // Marker idzie tez przez spacje, gdy nastepne slowo jest zakreslone.
                  const ciaglyMarker = zakreslone && jestZakreslone(i + 1);
                  const stan =
                    i === idx
                      ? 'bg-amber-300 text-gray-950'
                      : zakreslone
                        ? `${MARKER} text-white`
                        : i < idx
                          ? 'text-gray-500'
                          : a === 0
                            ? ''
                            : 'text-gray-100';
                  return (
                    <span key={i}>
                      <span
                        data-i={i}
                        onClick={(e) => {
                          // Klik w pokaz zmienia slajd (LessonPresent) - tu ma przewinac nagranie.
                          e.stopPropagation();
                          if (!zaznaczanie) czytajOd(start);
                        }}
                        onPointerDown={
                          zaznaczanie
                            ? (e) => {
                                e.preventDefault();
                                // Bez tego dotyk/pioro trzyma capture na pierwszym slowie
                                // i pointerenter na kolejnych nie przychodzi.
                                if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                                  e.currentTarget.releasePointerCapture(e.pointerId);
                                }
                                setPrzeciag({ od: i, do: i, zmaz: zaznaczone.has(i) });
                              }
                            : undefined
                        }
                        onPointerEnter={
                          zaznaczanie
                            ? () => {
                                if (przeciagRef.current) setPrzeciag({ ...przeciagRef.current, do: i });
                              }
                            : undefined
                        }
                        className={`${zaznaczanie ? 'cursor-text' : 'cursor-pointer'} ${zakreslone && i !== idx ? 'rounded-sm' : 'rounded-md'} -mx-[3px] px-[3px] transition-colors duration-150 ${stan}`}
                      >
                        {slowo}
                      </span>
                      <span className={ciaglyMarker ? MARKER : undefined}> </span>
                    </span>
                  );
                })}
              </p>
            ))}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-3xl text-gray-400">
            {!czytanka ? 'Nie wybrano czytanki' : (error ?? 'Ładuję czytankę...')}
          </div>
        )}
      </div>

      {url && (
        <footer className="mt-auto flex shrink-0 items-center gap-5 pb-6 pr-24">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              przelacz();
            }}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-500 text-white"
            aria-label={gra ? 'Pauza' : 'Czytaj'}
          >
            {gra ? (
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6" fill="currentColor"><path d="M7 4.5v15l12-7.5z" /></svg>
            )}
          </button>
          <div
            className="flex h-8 flex-1 cursor-pointer touch-none items-center"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => {
              e.stopPropagation();
              e.currentTarget.setPointerCapture(e.pointerId);
              przewinPaskiem(e);
            }}
            onPointerMove={(e) => {
              if (e.currentTarget.hasPointerCapture(e.pointerId)) przewinPaskiem(e);
            }}
          >
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800">
              <div ref={paskRef} className="h-full w-0 rounded-full bg-accent-400" />
            </div>
          </div>
          <span ref={czasRef} className="w-16 text-right text-xl tabular-nums text-gray-400">0:00</span>
          {reczne && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setReczne(false);
              }}
              className="shrink-0 rounded-full border border-gray-600 px-4 py-1.5 text-lg text-gray-200 hover:bg-gray-800"
            >
              Wróć do lektora
            </button>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setZaznaczanie((on) => !on);
            }}
            className={`shrink-0 rounded-full px-4 py-1.5 text-lg ${
              zaznaczanie ? 'bg-lime-300 font-semibold text-gray-950' : 'border border-gray-600 text-gray-200 hover:bg-gray-800'
            }`}
            aria-pressed={zaznaczanie}
          >
            Zaznaczanie (Z)
          </button>
          {zaznaczone.size > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setZaznaczone(new Set());
                if (kluczZ) zapiszZaznaczeniaLS(kluczZ, new Set());
              }}
              className="shrink-0 rounded-full border border-gray-600 px-4 py-1.5 text-lg text-gray-400 hover:bg-gray-800"
            >
              Wyczyść
            </button>
          )}
          <span className="shrink-0 text-xl text-gray-500">Spacja: czytaj / pauza</span>
        </footer>
      )}
      {url && (
        <audio
          ref={audioRef}
          src={url}
          preload="auto"
          onPlay={() => setGra(true)}
          onPause={() => setGra(false)}
          onEnded={() => setGra(false)}
        />
      )}
    </div>
  );
}
