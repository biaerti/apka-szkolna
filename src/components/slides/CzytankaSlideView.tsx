// Slajd czytanki z lektorem: tekst przewija sie jak napisy i podswietla slowo
// po slowie w rytm nagrania ElevenLabs (czasy slow z audio-czytanki/synchronizuj.py).
// Dzieci czytaja w podreczniku albo z ekranu - kto sie zgubi, widzi, gdzie jestesmy.
//
// Spacja = czytaj / pauza (faza capture, przed klawiszami prezentacji), klik
// w slowo = czytaj od tego miejsca. Strzalki dalej zmieniaja slajdy.

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
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

function czas(s: number): string {
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
}

export function CzytankaSlideView({ slide }: { slide: CzytankaSlide }) {
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

  useEffect(() => {
    let cancelled = false;
    setUrl(null);
    setAkapity(null);
    setError(null);
    setIdx(-1);
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
  }, [czytanka]);

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
    const el = tekstRef.current?.querySelector<HTMLElement>(`[data-i="${Math.max(idx, 0)}"]`);
    if (el) setPrzesuniecie(OKNO_H * LINIA_BIEZACA - el.offsetTop);
  }, [idx, akapity]);

  function przelacz() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) void audio.play();
    else audio.pause();
  }

  function czytajOd(start: number) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = start;
    setIdx(indeksSlowa(starty, start));
    void audio.play();
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== ' ' && e.code !== 'Space') return;
      e.preventDefault();
      e.stopPropagation();
      przelacz();
    }
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, []);

  useEffect(() => () => audioRef.current?.pause(), []);

  const fontSize = Math.round(38 * scale);
  let licznik = 0;

  return (
    <div className="flex h-full flex-col px-16 pt-7">
      {/* Tytul i autor sa w pierwszej linijce czytanki; prawy gorny rog zajmuje zegar prezentacji. */}
      <span className="shrink-0 text-[34px] font-bold text-accent-300">
        {czytanka ? `Podręcznik s. ${czytanka.pages}` : 'Czytanka'}
      </span>

      <div
        className="relative mt-3 shrink-0 overflow-hidden"
        style={{
          height: OKNO_H,
          maskImage: 'linear-gradient(to bottom, transparent 0, #000 14%, #000 80%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, #000 14%, #000 80%, transparent 100%)',
        }}
      >
        {akapity ? (
          <div
            ref={tekstRef}
            className="relative mx-auto max-w-[1080px] font-serif"
            style={{
              fontSize,
              lineHeight: 1.55,
              transform: `translateY(${przesuniecie}px)`,
              transition: 'transform 700ms cubic-bezier(.25,.8,.3,1)',
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
                  const stan = i === idx ? 'bg-amber-300 text-gray-950' : i < idx ? 'text-gray-500' : a === 0 ? '' : 'text-gray-100';
                  return (
                    <span key={i}>
                      <span
                        data-i={i}
                        onClick={(e) => {
                          // Klik w pokaz zmienia slajd (LessonPresent) - tu ma przewinac nagranie.
                          e.stopPropagation();
                          czytajOd(start);
                        }}
                        className={`cursor-pointer rounded-md -mx-[3px] px-[3px] transition-colors duration-150 ${stan}`}
                      >
                        {slowo}
                      </span>{' '}
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
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-800">
            <div ref={paskRef} className="h-full w-0 rounded-full bg-accent-400" />
          </div>
          <span ref={czasRef} className="w-16 text-right text-xl tabular-nums text-gray-400">0:00</span>
          <span className="text-xl text-gray-500">Spacja: czytaj / pauza</span>
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
