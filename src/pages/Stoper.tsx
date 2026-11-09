// STOPER DO GODZINY - trasa /stoper, pelny ekran na projektor (bez paska bocznego).
//
// Po co: na sprawdzianie klasa ma widziec, ile czasu zostalo do konca, a
// nauczyciel ustawia nie "45 minut", tylko godzine ("piszemy do 9:40").
// Liczy zegar scienny, wiec odswiezenie strony nic nie psuje - ustawienie
// lezy w localStorage do konca dnia.
//
// Kolory: ostatnie 5 minut zolte, ostatnia minuta czerwona, potem "Koniec czasu".
// Klawisze: F - pelny ekran, E - zmien godzine.

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { useStore } from '../data/store';
import { useNow } from '../components/timetable/useNow';
import { toDateKey } from '../lib/dates';
import { formatHm, parseHm } from '../lib/timetable';
import { chwilaGodziny, domyslnaGodzina, formatZostalo, sekundyDoGodziny } from '../lib/stoperDoGodziny';

const KLUCZ = 'apka-szkolna:stoper';

interface Ustawienie {
  dzien: string;
  /** Minuty od polnocy. */
  koniec: number;
  napis: string;
  /** Kiedy wystartowano (epoch ms) - do paska postepu. */
  start: number;
}

function wczytaj(now: Date): Ustawienie | null {
  try {
    const u = JSON.parse(localStorage.getItem(KLUCZ) ?? 'null') as Ustawienie | null;
    return u && u.dzien === toDateKey(now) ? u : null;
  } catch {
    return null;
  }
}

/** "9:40" -> "09:40" dla <input type="time">. */
function doPolaCzasu(min: number): string {
  return `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
}

export function Stoper() {
  const periods = useStore((s) => s.periods);
  const now = useNow(250);
  const rootRef = useRef<HTMLDivElement>(null);

  const [ustawienie, setUstawienie] = useState<Ustawienie | null>(() => wczytaj(new Date()));
  const [edycja, setEdycja] = useState(ustawienie === null);
  const [godzina, setGodzina] = useState(() =>
    doPolaCzasu(ustawienie?.koniec ?? domyslnaGodzina(periods, new Date())),
  );
  const [napis, setNapis] = useState(ustawienie?.napis ?? 'Sprawdzian');

  // Plan dociaga sie z chmury chwile po starcie - podpowiedz poprawiamy, dopoki
  // nauczyciel niczego nie ustawil.
  const dotkniete = useRef(false);
  useEffect(() => {
    if (!ustawienie && !dotkniete.current) setGodzina(doPolaCzasu(domyslnaGodzina(periods, new Date())));
  }, [periods, ustawienie]);

  useEffect(() => {
    if (ustawienie) localStorage.setItem(KLUCZ, JSON.stringify(ustawienie));
    else localStorage.removeItem(KLUCZ);
  }, [ustawienie]);

  function pelnyEkran() {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else rootRef.current?.requestFullscreen().catch(() => {});
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (edycja || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'f' || e.key === 'F') pelnyEkran();
      if (e.key === 'e' || e.key === 'E') setEdycja(true);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [edycja]);

  const koniecMin = parseHm(godzina);
  const godzinaMinela = !Number.isNaN(koniecMin) && chwilaGodziny(koniecMin, now) <= now.getTime();

  function uruchom(e: React.FormEvent) {
    e.preventDefault();
    if (Number.isNaN(koniecMin) || godzinaMinela) return;
    // Poprawka godziny w trakcie nie zeruje paska postepu.
    const trwa = ustawienie && sekundyDoGodziny(ustawienie.koniec, new Date()) > 0;
    setUstawienie({
      dzien: toDateKey(new Date()),
      koniec: koniecMin,
      napis: napis.trim(),
      start: trwa ? ustawienie.start : Date.now(),
    });
    setEdycja(false);
  }

  if (edycja || !ustawienie) {
    return (
      <div ref={rootRef} className="flex min-h-screen items-center justify-center bg-gray-950 p-6 text-gray-100">
        <form onSubmit={uruchom} className="w-full max-w-md space-y-5">
          <h1 className="text-2xl font-semibold">Stoper do godziny</h1>
          <label className="block">
            <span className="mb-1 block text-sm text-gray-400">Napis nad czasem</span>
            <input
              value={napis}
              onChange={(e) => setNapis(e.target.value)}
              placeholder="np. Sprawdzian"
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-lg"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-gray-400">Do której godziny</span>
            <input
              type="time"
              required
              value={godzina}
              onChange={(e) => {
                dotkniete.current = true;
                setGodzina(e.target.value);
              }}
              className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-4xl tabular-nums [color-scheme:dark]"
            />
            {!Number.isNaN(koniecMin) && (
              <span className={clsx('mt-1 block text-sm', godzinaMinela ? 'text-red-400' : 'text-gray-400')}>
                {godzinaMinela
                  ? 'Ta godzina już minęła'
                  : `To ${formatZostalo(sekundyDoGodziny(koniecMin, now))} od teraz`}
              </span>
            )}
          </label>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={Number.isNaN(koniecMin) || godzinaMinela}
              className="flex-1 rounded-lg bg-accent-600 py-3 text-lg font-semibold text-white hover:bg-accent-700 disabled:opacity-40"
            >
              Start
            </button>
            {ustawienie ? (
              <button
                type="button"
                onClick={() => setEdycja(false)}
                className="rounded-lg bg-gray-800 px-4 text-gray-200 hover:bg-gray-700"
              >
                Anuluj
              </button>
            ) : (
              <Link to="/" className="flex items-center rounded-lg bg-gray-800 px-4 text-gray-200 hover:bg-gray-700">
                Wróć
              </Link>
            )}
          </div>
        </form>
      </div>
    );
  }

  const zostalo = sekundyDoGodziny(ustawienie.koniec, now);
  const koniec = zostalo === 0;
  const calosc = chwilaGodziny(ustawienie.koniec, now) - ustawienie.start;
  const uplynelo = calosc > 0 ? Math.min(1, (now.getTime() - ustawienie.start) / calosc) : 1;
  const tekst = formatZostalo(zostalo);

  return (
    <div ref={rootRef} className="group relative flex h-screen flex-col items-center justify-center overflow-hidden bg-gray-950 text-gray-100">
      {ustawienie.napis && (
        <p className="mb-[2vh] px-6 text-center font-semibold text-gray-300" style={{ fontSize: 'clamp(28px, 6vw, 96px)' }}>
          {ustawienie.napis}
        </p>
      )}

      {koniec ? (
        <p className="animate-pulse font-bold text-red-400" style={{ fontSize: 'clamp(64px, 16vw, 320px)' }}>
          Koniec czasu
        </p>
      ) : (
        <p
          className={clsx(
            'font-bold leading-none tabular-nums',
            zostalo <= 60 ? 'animate-pulse text-red-400' : zostalo <= 300 ? 'text-amber-300' : 'text-white',
          )}
          style={{ fontSize: tekst.length > 5 ? '20vw' : '28vw' }}
        >
          {tekst}
        </p>
      )}

      <p className="mt-[3vh] text-gray-400" style={{ fontSize: 'clamp(20px, 3.5vw, 56px)' }}>
        do {formatHm(ustawienie.koniec)}
        <span className="mx-4 text-gray-600">·</span>
        teraz {now.getHours()}:{String(now.getMinutes()).padStart(2, '0')}
      </p>

      <div className="absolute inset-x-0 bottom-0 h-2 bg-gray-800">
        <div
          className={clsx('h-full transition-[width] duration-1000', koniec ? 'bg-red-500' : 'bg-accent-600')}
          style={{ width: `${uplynelo * 100}%` }}
        />
      </div>

      {/* Sterowanie widac dopiero po najechaniu myszka - klasa ma widziec sam czas. */}
      <div className="absolute right-4 top-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <button type="button" onClick={() => setEdycja(true)} className="rounded-md bg-gray-800 px-3 py-1.5 text-sm hover:bg-gray-700">
          Zmień godzinę (E)
        </button>
        <button type="button" onClick={pelnyEkran} className="rounded-md bg-gray-800 px-3 py-1.5 text-sm hover:bg-gray-700">
          Pełny ekran (F)
        </button>
        <button
          type="button"
          onClick={() => {
            setUstawienie(null);
            setEdycja(true);
          }}
          className="rounded-md bg-gray-800 px-3 py-1.5 text-sm hover:bg-gray-700"
        >
          Zakończ
        </button>
        <Link to="/" className="rounded-md bg-gray-800 px-3 py-1.5 text-sm hover:bg-gray-700">
          Wróć
        </Link>
      </div>
    </div>
  );
}
