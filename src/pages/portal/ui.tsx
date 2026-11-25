// Klocki wygladu portalu ucznia (/uczen). Kierunek z refero.design (2026-11-25):
// Brilliant - bialy ekran, jedno pytanie na raz, cienki pasek postepu u gory,
// duze zaokraglone przyciski z "grubym" dolem, a po "Sprawdź" arkusz od dolu
// (zielony "Dobrze!" / czerwony "Prawie") z przyciskiem "Dlaczego?".
// Kolorowe kafle modulow na stronie startowej jak w LookUp.
// Portal nie ma trybu ciemnego (AppShell go nie wlacza) - kolory wprost.

import clsx from 'clsx';
import type { ReactNode } from 'react';

export const kolory = {
  zielony: '#22a95b',
  zielonyCien: '#17803f',
  tlo: '#f6f5f1',
};

export function Ekran({ children, szeroki = false }: { children: ReactNode; szeroki?: boolean }) {
  return (
    <div className="min-h-screen bg-[#f6f5f1] text-[#1d1d1f]">
      <style>{'@keyframes portalArkusz{from{transform:translateY(100%)}to{transform:none}}'}</style>
      <main className={clsx('mx-auto px-4 pb-40 pt-5 sm:pt-8', szeroki ? 'max-w-3xl' : 'max-w-xl')}>{children}</main>
    </div>
  );
}

export function Karta({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx('rounded-3xl bg-white p-5 shadow-[0_1px_0_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.12)] sm:p-7', className)}>{children}</div>;
}

const przycisk =
  'inline-flex min-h-[3.25rem] select-none items-center justify-center gap-2 rounded-2xl px-6 text-lg font-bold transition-[transform,box-shadow,background-color] active:translate-y-[3px] disabled:cursor-not-allowed disabled:active:translate-y-0 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#7cc8ff]';

export const btnGlowny = clsx(
  przycisk,
  'bg-[#22a95b] text-white shadow-[0_4px_0_#17803f] hover:bg-[#1f9d54] active:shadow-[0_1px_0_#17803f] disabled:bg-[#d9d9d4] disabled:text-[#8a8a85] disabled:shadow-[0_4px_0_#c4c4be]',
);
export const btnDrugi = clsx(
  przycisk,
  'border-2 border-[#e3e2dc] bg-white text-[#1d1d1f] shadow-[0_4px_0_#e3e2dc] hover:bg-[#fafaf7] active:shadow-[0_1px_0_#e3e2dc]',
);
export const btnCichy =
  'inline-flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-[#5b5b57] hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7cc8ff]';

/** Pasek postepu u gory: krzyzyk + kreski (jak w Brilliant). */
export function GornyPasek({
  zrobione,
  wszystkie,
  onZamknij,
  etykietaZamknij = 'Zamknij',
  prawy,
}: {
  zrobione: number;
  wszystkie: number;
  onZamknij: () => void;
  etykietaZamknij?: string;
  prawy?: ReactNode;
}) {
  const procent = wszystkie > 0 ? Math.min(100, (zrobione / wszystkie) * 100) : 0;
  return (
    <div className="mb-5 flex items-center gap-3">
      <button
        type="button"
        onClick={onZamknij}
        aria-label={etykietaZamknij}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#5b5b57] hover:bg-black/5"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      </button>
      <div className="h-3 flex-1 overflow-hidden rounded-full bg-[#e6e5df]" role="progressbar" aria-valuenow={Math.round(procent)} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-[#22a95b] transition-[width] duration-500" style={{ width: `${procent}%` }} />
      </div>
      {prawy}
    </div>
  );
}

/** Arkusz od dolu po sprawdzeniu odpowiedzi. */
export function Arkusz({
  stan,
  tytul,
  children,
  przyciski,
}: {
  stan: 'dobrze' | 'zle' | 'neutralny';
  tytul: ReactNode;
  children?: ReactNode;
  przyciski: ReactNode;
}) {
  return (
    <div
      role="status"
      className={clsx(
        'fixed inset-x-0 bottom-0 z-20 border-t-2 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 animate-[portalArkusz_220ms_ease-out]',
        stan === 'dobrze' && 'border-[#b8e6c8] bg-[#e7f7ec]',
        stan === 'zle' && 'border-[#f5c2c0] bg-[#fdeceb]',
        stan === 'neutralny' && 'border-[#e3e2dc] bg-white',
      )}
    >
      <div className="mx-auto max-w-xl">
        <p className={clsx('flex items-center gap-2 text-xl font-extrabold', stan === 'dobrze' ? 'text-[#17803f]' : stan === 'zle' ? 'text-[#c0362c]' : 'text-[#1d1d1f]')}>
          {tytul}
        </p>
        {children && <div className="mt-1.5 text-[0.95rem] leading-snug text-[#3a3a37]">{children}</div>}
        <div className="mt-3 flex gap-3">{przyciski}</div>
      </div>
    </div>
  );
}

/** Dolny pasek z jednym glownym przyciskiem (zanim uczen sprawdzi). */
export function DolnyPrzycisk({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-10 border-t border-[#e6e5df] bg-[#f6f5f1]/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur">
      <div className="mx-auto flex max-w-xl gap-3">{children}</div>
    </div>
  );
}

/** Kolorowy kafel modulu na stronie startowej. */
export function Kafel({
  kolor,
  ikona,
  tytul,
  opis,
  postep,
  onClick,
}: {
  kolor: 'pomarancz' | 'fiolet';
  ikona: ReactNode;
  tytul: ReactNode;
  opis: ReactNode;
  postep?: { zrobione: number; wszystkie: number };
  onClick: () => void;
}) {
  const style = {
    pomarancz: { tlo: 'bg-[#f39a2d]', cien: 'shadow-[0_6px_0_#c97412]', pasek: 'bg-white/35' },
    fiolet: { tlo: 'bg-[#8b5cf6]', cien: 'shadow-[0_6px_0_#6a3fd1]', pasek: 'bg-white/30' },
  }[kolor];
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'group relative flex w-full flex-col overflow-hidden rounded-3xl p-5 text-left text-white transition-transform active:translate-y-[4px]',
        style.tlo,
        style.cien,
      )}
    >
      <span className="text-4xl" aria-hidden="true">{ikona}</span>
      <span className="mt-3 text-2xl font-extrabold leading-tight">{tytul}</span>
      <span className="mt-1 text-[0.95rem] font-medium text-white/90">{opis}</span>
      {postep && postep.wszystkie > 0 && (
        <span className={clsx('mt-4 block h-2.5 w-full overflow-hidden rounded-full', style.pasek)} aria-hidden="true">
          <span className="block h-full rounded-full bg-white" style={{ width: `${(postep.zrobione / postep.wszystkie) * 100}%` }} />
        </span>
      )}
      <span className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-xl font-bold transition-transform group-hover:translate-x-0.5" aria-hidden="true">
        →
      </span>
    </button>
  );
}

const DNI = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];

/** Ten tydzien: blyskawica w dniach, w ktorych uczen cos zrobil. */
export function Tydzien({ aktywneDni, dzis }: { aktywneDni: Set<string>; dzis: Date }) {
  const poniedzialek = new Date(dzis);
  poniedzialek.setDate(dzis.getDate() - ((dzis.getDay() + 6) % 7));
  const dni = DNI.map((nazwa, i) => {
    const d = new Date(poniedzialek);
    d.setDate(poniedzialek.getDate() + i);
    const klucz = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return { nazwa, aktywny: aktywneDni.has(klucz), dzis: d.toDateString() === dzis.toDateString() };
  });
  return (
    <div className="flex justify-between gap-1">
      {dni.map((d) => (
        <div key={d.nazwa} className="flex flex-col items-center gap-1.5">
          <span
            className={clsx(
              'flex h-10 w-10 items-center justify-center rounded-full text-lg',
              d.aktywny ? 'bg-[#ffd43b] shadow-[0_3px_0_#e0ac00]' : 'bg-[#ecebe5] text-[#b5b4ad]',
              d.dzis && !d.aktywny && 'ring-2 ring-[#ffd43b] ring-offset-2 ring-offset-white',
            )}
            aria-hidden="true"
          >
            {d.aktywny ? '⚡' : ''}
          </span>
          <span className={clsx('text-xs font-bold', d.dzis ? 'text-[#1d1d1f]' : 'text-[#8a8a85]')}>{d.nazwa}</span>
        </div>
      ))}
    </div>
  );
}

export function IkonaGlosnik({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M11 5 6 9H3v6h3l5 4V5Z" strokeLinejoin="round" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" strokeLinecap="round" />
    </svg>
  );
}
