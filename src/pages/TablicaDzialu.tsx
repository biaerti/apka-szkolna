// Tablica dzialu na projektor: Excalidraw z mapa wiedzy rocznika.
// "Co nas czeka" przed dzialem, "Czego sie nauczylismy" po dziale, "Pusta tablica"
// do rysowania. Kazdy tryb ma osobna scene, zapisywana sama w chmurze.
// Adres: /tablica?klasa=IV&dzial=<Lesson.dzial>&tryb=przed

import { Suspense, lazy, useCallback, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import { mapaWiedzy, numerDzialu } from '../data/mapaWiedzy';
import { TRYBY_TABLICY, idTablicy, szkicTablicy, type TrybTablicy } from '../lib/tablicaDzialu';
import type { StanZapisu } from '../components/tablica/TablicaCanvas';

const TablicaCanvas = lazy(() => import('../components/tablica/TablicaCanvas'));

const OPIS_STANU: Record<StanZapisu, string> = {
  wczytuje: 'Wczytuję…',
  zapisuje: 'Zapisuję…',
  zapisane: 'Zapisane',
  lokalnie: 'Zapisane w tej przeglądarce',
  blad: 'Nie udało się zapisać',
};

export function TablicaDzialu() {
  const [params, setParams] = useSearchParams();
  const grade = (params.get('klasa') ?? '').toUpperCase();
  const dzial = params.get('dzial') ?? '';
  const trybParam = params.get('tryb');
  const tryb: TrybTablicy = TRYBY_TABLICY.some((t) => t.id === trybParam) ? (trybParam as TrybTablicy) : 'przed';
  const [stan, setStan] = useState<StanZapisu>('wczytuje');
  const [resetToken, setResetToken] = useState(0);

  const id = idTablicy(grade, dzial, tryb);
  const szkic = useCallback(
    () => szkicTablicy({ klasa: `Klasa ${grade}`, dzial, numer: numerDzialu(dzial) ?? 0, tryb, punkty: mapaWiedzy(grade) }),
    [grade, dzial, tryb],
  );

  function wybierz(nowy: TrybTablicy) {
    const next = new URLSearchParams(params);
    next.set('tryb', nowy);
    setParams(next, { replace: true });
  }

  function nowaMapa() {
    const pytanie = tryb === 'pusta' ? 'Wyczyścić tablicę? Rysunek zniknie.' : 'Wstawić mapę od nowa? Rysunki na tej tablicy znikną.';
    if (window.confirm(pytanie)) setResetToken((token) => token + 1);
  }

  if (!grade || !dzial) {
    return <div className="p-8 text-sm text-gray-600">Brak działu. <Link to="/lekcje" className="text-accent-700 underline">Wróć do lekcji</Link></div>;
  }

  return (
    <div className="flex h-screen flex-col bg-white">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-gray-200 px-4 py-2 text-sm">
        <Link to="/lekcje" className="text-gray-500 hover:text-gray-800">← Lekcje</Link>
        <span className="font-medium text-gray-800">Klasa {grade} · {dzial}</span>
        <div className="flex rounded-md border border-gray-200 p-0.5">
          {TRYBY_TABLICY.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => wybierz(t.id)}
              className={clsx('rounded px-2.5 py-1', t.id === tryb ? 'bg-gray-900 text-white' : 'text-gray-600 hover:text-gray-900')}
            >
              {t.nazwa}
            </button>
          ))}
        </div>
        <button type="button" onClick={nowaMapa} className="text-gray-500 hover:text-gray-800">
          {tryb === 'pusta' ? 'Wyczyść' : 'Nowa mapa'}
        </button>
        <span className={clsx('ml-auto text-xs', stan === 'blad' ? 'text-red-600' : 'text-gray-400')}>{OPIS_STANU[stan]}</span>
      </div>
      <div className="relative min-h-0 flex-1">
        <Suspense fallback={<div className="flex h-full items-center justify-center text-sm text-gray-500">Wczytuję tablicę…</div>}>
          <TablicaCanvas key={id} id={id} szkic={szkic} resetToken={resetToken} onStan={setStan} />
        </Suspense>
      </div>
    </div>
  );
}
