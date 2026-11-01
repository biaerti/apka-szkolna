// Slajd "Przypomnienie" na lekcji powtorkowej: nauczyciel mowi, slajd odslania
// kroki (regula, przyklad z animacja). Tresc w src/data/przypomnienia.ts.
//
// Nawigacja jak w zwyklej prezentacji, tylko najpierw po krokach: strzalka w
// prawo / PageDown / Spacja / klik w prawa polowe odslania nastepny krok, a gdy
// wszystkie sa widoczne - idzie dalej do kolejnego slajdu. W lewo chowa
// ostatni krok. Klawisze lapiemy w fazie capture na window, przed
// usePresentKeys (tak samo jak VideoSlideView ze Spacja).
//
// Wszystkie kroki sa w ukladzie od poczatku (niewidoczne), wiec nic nie
// skacze przy odslanianiu, a calosc skalujemy raz, zeby zmiescila sie na
// kartce 1280x720. Liczba odslonietych krokow zostaje w pamieci na czas
// pokazu - powrot na slajd nie zaczyna od zera.

import clsx from 'clsx';
import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import type { Slide } from '../../data/types';
import { przypomnienieById, type KrokPrzypomnienia } from '../../data/przypomnienia';

type PrzypomnienieSlide = Extract<Slide, { kind: 'przypomnienie' }>;

const pamiec = new Map<string, number>();

const DALEJ = new Set(['ArrowRight', 'ArrowDown', 'PageDown', ' ']);
const WSTECZ = new Set(['ArrowLeft', 'ArrowUp', 'PageUp']);

const KOLORY = [
  'bg-sky-500/20 text-sky-100 ring-sky-400/60',
  'bg-amber-500/20 text-amber-100 ring-amber-400/60',
  'bg-emerald-500/20 text-emerald-100 ring-emerald-400/60',
  'bg-rose-500/20 text-rose-100 ring-rose-400/60',
  'bg-violet-500/20 text-violet-100 ring-violet-400/60',
];

const STYL = `
@keyframes przyp-wejdz { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
@keyframes przyp-pop { 0% { opacity: 0; transform: scale(.6); } 70% { opacity: 1; transform: scale(1.08); } 100% { opacity: 1; transform: scale(1); } }
@keyframes przyp-kreska { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes przyp-tlo { from { background-size: 0% 100%; } to { background-size: 100% 100%; } }
@keyframes przyp-skresl { from { background-size: 0% 5px; } to { background-size: 100% 5px; } }
.przyp-krok:not(.on) { visibility: hidden; }
.przyp-krok.on .a-wejdz { animation: przyp-wejdz .5s ease-out both; }
.przyp-krok.on .a-pop { animation: przyp-pop .45s ease-out both; }
.przyp-krok.on .a-kreska { animation: przyp-kreska .6s ease-in-out both; }
.przyp-krok.on .a-tlo { animation: przyp-tlo .5s ease-out both; }
.przyp-krok.on .a-skresl { animation: przyp-skresl .4s ease-out both; }
.przyp-marker { background: linear-gradient(#facc15, #facc15) no-repeat left / 100% 100%; color: #111827; border-radius: 6px; padding: 0 6px; }
.przyp-skresl { background: linear-gradient(#f87171, #f87171) no-repeat left center / 100% 5px; }
`;

const opoznienie = (s: number) => ({ animationDelay: `${s}s` });

export function PrzypomnienieSlideView({ slide }: { slide: PrzypomnienieSlide }) {
  const p = przypomnienieById(slide.przypomnienieId);
  const n = p?.kroki.length ?? 0;
  const [widoczne, setWidoczne] = useState(() => Math.min(pamiec.get(slide.id) ?? 0, n));
  const pole = useRef<HTMLDivElement>(null);
  const tresc = useRef<HTMLDivElement>(null);
  const [skala, setSkala] = useState(1);

  useEffect(() => {
    pamiec.set(slide.id, widoczne);
  }, [slide.id, widoczne]);

  // Ref zamiast zaleznosci efektu: listener rejestrujemy raz, a stan czytamy aktualny.
  const stan = useRef({ widoczne, n });
  stan.current = { widoczne, n };
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const t = e.target;
      if (t instanceof HTMLElement && (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName))) return;
      const { widoczne: w, n: ile } = stan.current;
      if (DALEJ.has(e.key) && w < ile) setWidoczne(w + 1);
      else if (WSTECZ.has(e.key) && w > 0) setWidoczne(w - 1);
      else return;
      e.preventDefault();
      e.stopPropagation();
    }
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, []);

  useLayoutEffect(() => {
    const el = tresc.current;
    const box = pole.current;
    if (!el || !box) return;
    const zmierz = () => {
      // clientHeight liczy tez gorny odstep pola - odejmujemy go, inaczej ostatni krok wystaje.
      const miejsce = box.clientHeight - parseFloat(getComputedStyle(box).paddingTop);
      const wysokosc = el.scrollHeight;
      setSkala(wysokosc > miejsce ? miejsce / wysokosc : 1);
    };
    zmierz();
    // Czcionka moze dojsc po pierwszym pomiarze i zawinac tekst - mierzymy przy kazdej zmianie.
    // Szerokosc tresci nie zalezy od skali (transform nie zmienia ukladu), wiec nie ma petli.
    const obserwator = new ResizeObserver(zmierz);
    obserwator.observe(el);
    return () => obserwator.disconnect();
  }, [slide.przypomnienieId]);

  if (!p) {
    return (
      <div className="flex h-full items-center justify-center text-3xl text-gray-400">
        {slide.przypomnienieId ? `Brak przypomnienia „${slide.przypomnienieId}”` : 'Wybierz przypomnienie w edytorze slajdu'}
      </div>
    );
  }

  function klik(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const prawa = e.clientX - rect.left >= rect.width / 2;
    if (prawa && widoczne < n) setWidoczne(widoczne + 1);
    else if (!prawa && widoczne > 0) setWidoczne(widoczne - 1);
    else return;
    e.stopPropagation();
  }

  return (
    <div className="relative flex h-full flex-col px-16 pb-10 pt-10" onClick={klik}>
      <style>{STYL}</style>
      <header className="shrink-0">
        {p.naglowek && (
          <span className="rounded-lg bg-accent-500/25 px-3 py-1 text-lg font-bold uppercase tracking-wider text-accent-200">{p.naglowek}</span>
        )}
        <h2 className="mt-3 text-[56px] font-bold leading-tight text-white">{p.tytul}</h2>
      </header>
      <div ref={pole} className="relative min-h-0 flex-1 overflow-hidden pt-6">
        <div ref={tresc} className="flex flex-col gap-6" style={{ transform: `scale(${skala})`, transformOrigin: 'top left' }}>
          {p.kroki.map((krok, i) => (
            <div key={i} className={clsx('przyp-krok', i < widoczne && 'on')}>
              <Krok krok={krok} />
            </div>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-5 left-16 flex gap-2" aria-hidden="true">
        {p.kroki.map((_, i) => (
          <span key={i} className={clsx('h-2.5 w-2.5 rounded-full', i < widoczne ? 'bg-accent-300' : 'bg-gray-700')} />
        ))}
      </div>
    </div>
  );
}

/** **pogrubienie** i ==zakreslenie== (marker domalowuje sie po odslonieciu). */
function Tekst({ v }: { v: string }) {
  const czesci = v.split(/(\*\*.+?\*\*|==.+?==)/g).filter(Boolean);
  return (
    <>
      {czesci.map((c, i) =>
        c.startsWith('**') ? (
          <strong key={i} className="text-white">{c.slice(2, -2)}</strong>
        ) : c.startsWith('==') ? (
          <span key={i} className="przyp-marker a-tlo font-semibold" style={opoznienie(0.45)}>{c.slice(2, -2)}</span>
        ) : (
          <span key={i}>{c}</span>
        ),
      )}
    </>
  );
}

function Krok({ krok }: { krok: KrokPrzypomnienia }): ReactNode {
  switch (krok.typ) {
    case 'regula':
      return (
        <p className="a-wejdz text-[38px] leading-snug text-gray-200">
          <Tekst v={krok.tekst} />
        </p>
      );
    case 'czesci': {
      // Wiecej niz 4 kafelki (np. 7 przypadkow) - rowne, wezsze, w jednym rzedzie.
      const gesto = krok.czesci.length > 4;
      return (
        <div className={clsx('flex items-stretch', gesto ? 'gap-3' : 'flex-wrap gap-4')}>
          {krok.czesci.map(([t, podpis], i) => (
            <div
              key={i}
              className={clsx(
                'a-wejdz flex flex-col items-center justify-center rounded-2xl py-3 ring-2',
                gesto ? 'min-w-0 flex-1 px-2' : 'min-w-[140px] px-6',
                KOLORY[i % KOLORY.length],
              )}
              style={opoznienie(i * (gesto ? 0.2 : 0.3))}
            >
              <span className="text-[40px] font-bold leading-tight">{t}</span>
              <span className={clsx('mt-1 text-center leading-tight opacity-90', gesto ? 'text-[20px]' : 'text-[22px]')}>{podpis}</span>
            </div>
          ))}
        </div>
      );
    }
    case 'kolejnosc':
      return (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-4">
          {krok.elementy.map((t, i) => (
            <span key={i} className="a-wejdz flex items-center gap-3" style={opoznienie(i * 0.25)}>
              {i > 0 && <span className="text-[34px] text-gray-500">→</span>}
              <span className="flex items-center gap-3 rounded-xl bg-gray-800 px-4 py-2 text-[32px] font-semibold text-white ring-1 ring-gray-600">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-500 text-[24px] font-bold">{i + 1}</span>
                {t}
              </span>
            </span>
          ))}
        </div>
      );
    case 'zamiana':
      return (
        <div>
          <div className="flex flex-wrap items-center gap-x-10 gap-y-3">
            {krok.pary.map(([z, na], i) => (
              <span key={i} className="flex items-center gap-3 text-[40px]">
                <span className="a-wejdz px-1 text-gray-400" style={opoznienie(i * 0.6)}>
                  <span className="przyp-skresl a-skresl" style={opoznienie(i * 0.6 + 0.35)}>{z}</span>
                </span>
                <span className="a-wejdz text-gray-500" style={opoznienie(i * 0.6 + 0.5)}>→</span>
                <span className="a-pop font-bold text-emerald-300" style={opoznienie(i * 0.6 + 0.6)}>{na}</span>
              </span>
            ))}
          </div>
          {krok.podpis && (
            <p className="a-wejdz mt-2 text-[26px] text-gray-400" style={opoznienie(krok.pary.length * 0.6 + 0.3)}>
              {krok.podpis}
            </p>
          )}
        </div>
      );
    case 'para':
      return (
        <div className="flex items-center gap-6 text-[44px]">
          <span className="a-wejdz font-bold text-white">{krok.a}</span>
          <span
            className={clsx(
              'a-pop flex h-16 w-16 items-center justify-center rounded-full text-[40px] font-bold',
              krok.znak === '=' ? 'bg-emerald-500/25 text-emerald-200' : 'bg-rose-500/25 text-rose-200',
            )}
            style={opoznienie(0.35)}
          >
            {krok.znak}
          </span>
          <span className="a-wejdz font-bold text-white" style={opoznienie(0.6)}>{krok.b}</span>
          <span className="a-wejdz ml-4 text-[30px] text-gray-400" style={opoznienie(1)}>{krok.podpis}</span>
        </div>
      );
    case 'pytanie':
      return <Pytanie krok={krok} />;
  }
}

const bezZnakow = (s: string) => s.replace(/[.,!?…:;„”"]/g, '');

/** Zdanie ze strzalka od wyrazu `od` (najczesciej czasownik) do `do`, z pytaniem nad luk. */
function Pytanie({ krok }: { krok: Extract<KrokPrzypomnienia, { typ: 'pytanie' }> }) {
  const wyrazy = krok.zdanie.split(' ');
  const iOd = wyrazy.findIndex((w) => bezZnakow(w) === krok.od);
  const iDo = wyrazy.findIndex((w) => bezZnakow(w) === krok.do);
  const zdanie = useRef<HTMLDivElement>(null);
  const refy = useRef<Array<HTMLSpanElement | null>>([]);
  const [x, setX] = useState<[number, number] | null>(null);

  useLayoutEffect(() => {
    const a = refy.current[iOd];
    const b = refy.current[iDo];
    if (!a || !b) return;
    setX([a.offsetLeft + a.offsetWidth / 2, b.offsetLeft + b.offsetWidth / 2]);
  }, [iOd, iDo, krok.zdanie]);

  const H = 70;
  const [x1, x2] = x ?? [0, 0];
  return (
    <div className="flex items-end gap-8">
      <div ref={zdanie} className="relative" style={{ paddingTop: H }}>
        {x && (
          <svg className="absolute left-0 top-0 overflow-visible" width="100%" height={H} aria-hidden="true">
            <defs>
              <marker id={`grot-${iOd}-${iDo}`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#fbbf24" />
              </marker>
            </defs>
            <path
              className="a-kreska"
              d={`M${x1},${H - 4} C${x1},${H * 0.05} ${x2},${H * 0.05} ${x2},${H - 4}`}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="4"
              pathLength={1}
              strokeDasharray="1"
              markerEnd={`url(#grot-${iOd}-${iDo})`}
              style={opoznienie(0.3)}
            />
          </svg>
        )}
        {x && (
          <span
            className="a-pop absolute whitespace-nowrap rounded-lg bg-amber-400 px-3 text-[28px] font-bold text-gray-900"
            style={{ left: (x1 + x2) / 2, top: -6, transform: 'translateX(-50%)', ...opoznienie(0.8) }}
          >
            {krok.pytanie}
          </span>
        )}
        <p className="a-wejdz whitespace-nowrap text-[42px] text-gray-200">
          {wyrazy.map((w, i) => (
            <span key={i}>
              {i > 0 && ' '}
              <span
                ref={(el) => {
                  refy.current[i] = el;
                }}
                className={clsx(
                  i === iOd && 'font-semibold text-amber-200 underline decoration-amber-400 decoration-4 underline-offset-8',
                  i === iDo && 'a-tlo rounded-lg bg-gradient-to-r from-accent-500/40 to-accent-500/40 bg-no-repeat px-1 font-bold text-white',
                )}
                style={i === iDo ? opoznienie(1.1) : undefined}
              >
                {w}
              </span>
            </span>
          ))}
        </p>
      </div>
      {krok.wynik && (
        <span className="a-pop mb-1 whitespace-nowrap rounded-xl bg-emerald-500/25 px-4 py-1 text-[32px] font-bold text-emerald-200 ring-2 ring-emerald-400/60" style={opoznienie(1.4)}>
          = {krok.wynik}
        </span>
      )}
    </div>
  );
}
