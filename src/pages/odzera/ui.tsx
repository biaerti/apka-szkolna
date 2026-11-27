// Klocki wygladu kursu "Polski od zera". Swiat jak w portalu ucznia (src/pages/portal/ui.tsx:
// cieple tlo, duze przyciski z grubym dolem, arkusz "Dobrze!/Prawie" od dolu), do tego
// z wzorcow aplikacji do nauki jezykow (refero.design, 2026-11-27):
// - kazdy dzial ma swoj nasycony kolor, nowe slowo to duzy obrazek na kolorowym polu (Drops),
// - mapa lekcji jako sciezka kolek, seria i XP na gorze (Duolingo),
// - fiszki i kafelki odpowiedzi z wyrazna ramka i dolem (Quizlet, Brilliant).
// Font: Andika (SIL) - kroj dla dzieci, ktore ucza sie czytac: jednopietrowe "a",
// wyrazne polskie znaki i cyrylica w tym samym rysunku.

import clsx from 'clsx';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { JezykOZ } from '../../data/odzera';
import { graj } from './audio';

export const FONT = "'Andika', 'Nunito', system-ui, sans-serif";

/** Wczytuje Andike z Google Fonts (tylko na stronie kursu). */
export function useFont(): void {
  useEffect(() => {
    if (document.getElementById('odzera-font')) return;
    const pre = document.createElement('link');
    pre.rel = 'preconnect';
    pre.href = 'https://fonts.gstatic.com';
    pre.crossOrigin = '';
    document.head.appendChild(pre);
    const l = document.createElement('link');
    l.id = 'odzera-font';
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Andika:wght@400;700&display=swap&subset=latin-ext,cyrillic';
    document.head.appendChild(l);
  }, []);
}

// ------------------------------------------------------------ jezyk podpowiedzi

export const JezykCtx = createContext<JezykOZ>('ru');

/** Tekst w jezyku ucznia. */
export function useT() {
  const j = useContext(JezykCtx);
  return (t: { ru: string; ua: string }) => t[j];
}

// ------------------------------------------------------------ kolory

function mieszaj(hex: string, z: [number, number, number], ile: number): string {
  const n = parseInt(hex.slice(1), 16);
  const kan = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  const w = kan.map((c, i) => Math.round(c + (z[i] - c) * ile));
  return `#${w.map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}

export const ciemniej = (hex: string, ile = 0.25) => mieszaj(hex, [0, 0, 0], ile);
export const jasniej = (hex: string, ile = 0.86) => mieszaj(hex, [255, 255, 255], ile);

export const K = {
  tlo: '#f6f5f1',
  tekst: '#1d1d1f',
  szary: '#5b5b57',
  jasnySzary: '#8a8a85',
  linia: '#e3e2dc',
  zielony: '#22a95b',
  zielonyCien: '#17803f',
  czerwony: '#c0362c',
  zloty: '#f5b400',
};

// ------------------------------------------------------------ ikony (SVG, jedna grubosc kreski)

type IkonaProps = { className?: string };

const svg = (d: ReactNode, fill = false) =>
  function Ikona({ className = 'h-6 w-6' }: IkonaProps) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill={fill ? 'currentColor' : 'none'} stroke={fill ? 'none' : 'currentColor'} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {d}
      </svg>
    );
  };

export const IkGlosnik = svg(
  <>
    <path d="M11 5 6 9H3v6h3l5 4V5Z" />
    <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
  </>,
);
export const IkZolw = svg(
  <>
    <path d="M4 15c0-4 3.6-7 8-7s8 3 8 7H4Z" />
    <path d="M20 15c1.5 0 2-1 2-2s-.8-1.8-2-1.6" />
    <path d="M7 15v2.5M17 15v2.5M9.5 9.5 12 15l2.5-5.5" />
  </>,
);
export const IkZamknij = svg(<path d="M6 6l12 12M18 6 6 18" />);
export const IkPtaszek = svg(<path d="m5 12.5 4.5 4.5L19 7.5" />);
export const IkKlodka = svg(
  <>
    <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
    <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
  </>,
);
export const IkPlomien = svg(
  <path d="M12 2.5c.6 3.2 4.8 5.3 4.8 10.1A4.8 4.8 0 0 1 12 17.4a4.8 4.8 0 0 1-4.8-4.8c0-1.9.9-3.2 1.8-4.1.2 1.5.9 2.5 1.9 2.8-.5-3.4 1.1-6.4 1.1-8.8Zm0 19.5c-3.9 0-7-2.8-7-6.6 0-.8.1-1.5.4-2.2.5 3.5 3.3 5.8 6.6 5.8s6.1-2.3 6.6-5.8c.3.7.4 1.4.4 2.2 0 3.8-3.1 6.6-7 6.6Z" />,
  true,
);
export const IkBlyskawica = svg(<path d="M13.5 2 4.5 13.5h6.2L9.8 22l9.7-12.2h-6.4L13.5 2Z" />, true);
export const IkGwiazda = svg(
  <path d="m12 2.8 2.8 5.8 6.3.8-4.6 4.4 1.1 6.3L12 17.1l-5.6 3 1.1-6.3-4.6-4.4 6.3-.8L12 2.8Z" />,
  true,
);
export const IkDzwonek = svg(
  <>
    <path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16Z" />
    <path d="M10 20.5a2.2 2.2 0 0 0 4 0" />
  </>,
);
export const IkZeszyt = svg(
  <>
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <path d="M9 3v18M12 8h4M12 12h4" />
  </>,
);
export const IkPowtorka = svg(
  <>
    <path d="M4 12a8 8 0 0 1 13.7-5.6L20 8.5" />
    <path d="M20 3.5v5h-5" />
    <path d="M20 12a8 8 0 0 1-13.7 5.6L4 15.5" />
    <path d="M4 20.5v-5h5" />
  </>,
);
export const IkNowe = svg(
  <>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
    <path d="m6.3 6.3 2.4 2.4M15.3 15.3l2.4 2.4M6.3 17.7l2.4-2.4M15.3 8.7l2.4-2.4" />
  </>,
);
export const IkStrzalka = svg(<path d="M5 12h14M13 6l6 6-6 6" />);
export const IkCofnij = svg(<path d="M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3" />);

// ------------------------------------------------------------ przyciski

const baza =
  'inline-flex min-h-[3.25rem] select-none items-center justify-center gap-2 rounded-2xl px-6 text-lg font-bold transition-[transform,box-shadow,background-color] active:translate-y-[3px] disabled:cursor-not-allowed disabled:active:translate-y-0 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#7cc8ff]';

export const btnGlowny = clsx(
  baza,
  'bg-[#22a95b] text-white shadow-[0_4px_0_#17803f] hover:bg-[#1f9d54] active:shadow-[0_1px_0_#17803f] disabled:bg-[#dcdbd5] disabled:text-[#8a8a85] disabled:shadow-[0_4px_0_#c9c8c1]',
);
export const btnBialy = clsx(
  baza,
  'border-2 border-[#e3e2dc] bg-white text-[#1d1d1f] shadow-[0_4px_0_#e3e2dc] hover:bg-[#fafaf7] active:shadow-[0_1px_0_#e3e2dc]',
);
export const btnCichy =
  'inline-flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-[0.95rem] font-bold text-[#5b5b57] hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7cc8ff]';

/** Okragly przycisk nagrania. Duzy na kartach slow, maly przy przykladach. */
export function Glosnik({
  url,
  wolno = false,
  duzy = false,
  kolor = '#1f8fe0',
  etykieta = 'Posłuchaj',
  className,
}: {
  url: string;
  wolno?: boolean;
  duzy?: boolean;
  kolor?: string;
  etykieta?: string;
  className?: string;
}) {
  const [gra, setGra] = useState(false);
  return (
    <button
      type="button"
      aria-label={etykieta}
      onClick={(e) => {
        e.stopPropagation();
        setGra(true);
        void graj(url, wolno).then(() => setGra(false));
      }}
      className={clsx(
        'inline-flex shrink-0 items-center justify-center rounded-full text-white transition-transform active:translate-y-[3px]',
        duzy ? 'h-20 w-20' : wolno ? 'h-14 w-14' : 'h-11 w-11',
        gra && 'scale-[1.04]',
        className,
      )}
      style={{ background: kolor, boxShadow: `0 ${duzy ? 5 : 3}px 0 ${ciemniej(kolor, 0.3)}` }}
    >
      {wolno ? <IkZolw className={duzy ? 'h-9 w-9' : 'h-8 w-8'} /> : <IkGlosnik className={duzy ? 'h-9 w-9' : 'h-6 w-6'} />}
    </button>
  );
}

/** Ekran kursu: cieple tlo, Andika, waska kolumna jak telefon. */
export function Ekran({ children, tlo = K.tlo }: { children: ReactNode; tlo?: string }) {
  useFont();
  return (
    <div className="min-h-screen text-[#1d1d1f] selection:bg-[#ffe08a]" style={{ background: tlo, fontFamily: FONT }}>
      <style>{`
        @keyframes ozArkusz{from{transform:translateY(100%)}to{transform:none}}
        @keyframes ozWjazd{from{opacity:0}to{opacity:1}}
        @keyframes ozPuls{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}
        @keyframes ozPodskok{0%{transform:scale(.4);opacity:0}60%{transform:scale(1.15);opacity:1}100%{transform:scale(1)}}
        @keyframes ozTrzes{0%,100%{transform:none}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
        @media (prefers-reduced-motion: reduce){*{animation-duration:1ms!important;animation-iteration-count:1!important;transition-duration:1ms!important}}
        .oz-wjazd{animation:ozWjazd .28s ease-out both}
        /* bez transform: kontener z position:fixed w srodku (dolny pasek) nie moze byc przesuwany */
        input,button{font-family:inherit}
      `}</style>
      <main className="mx-auto max-w-xl px-4 pb-40 pt-4 sm:pt-8">{children}</main>
    </div>
  );
}

/** Polecenie zadania: glosnik z nagraniem polecenia, polski tekst i tlumaczenie. */
export function Polecenie({ pl, tlum, url }: { pl: string; tlum: string; url?: string }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      {url && <Glosnik url={url} kolor="#8b8a84" etykieta="Posłuchaj polecenia" />}
      <div>
        <p className="text-[1.35rem] font-bold leading-tight">{pl}</p>
        <p className="text-[0.95rem] leading-snug text-[#5b5b57]">{tlum}</p>
      </div>
    </div>
  );
}

/** Dolny pasek z przyciskiem (zanim uczen sprawdzi). */
export function Dol({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-10 border-t border-[#e6e5df] bg-[#f6f5f1]/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur">
      <div className="mx-auto flex max-w-xl gap-3">{children}</div>
    </div>
  );
}

export const DNI_PL = ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'];
export const DNI = {
  ru: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
  ua: ['неділя', 'понеділок', 'вівторок', 'середа', 'четвер', "п'ятниця", 'субота'],
};

export function godzina(d: Date): string {
  return new Intl.DateTimeFormat('pl-PL', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Warsaw' }).format(d);
}

/** Dzien tygodnia w czasie polskim (0 = niedziela). */
export function dzienTygodnia(d: Date): number {
  const nazwa = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'Europe/Warsaw' }).format(d);
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(nazwa);
}

/** Podswietla litery zasady w slowie (np. "sz" w "szkoła"). */
export function Podswietl({ tekst, litery, kolor }: { tekst: string; litery: string; kolor: string }) {
  const tokeny = litery
    .split(/\s+/)
    .map((t) => t.toLowerCase())
    .filter((t) => t && /^[\p{L}]+$/u.test(t))
    .sort((a, b) => b.length - a.length);
  if (!tokeny.length) return <>{tekst}</>;
  const wzor = new RegExp(`(${tokeny.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  const kawalki = tekst.split(wzor);
  return (
    <>
      {kawalki.map((k, i) =>
        i % 2 === 1 ? (
          <span key={i} className="underline decoration-[3px] underline-offset-[5px]" style={{ color: ciemniej(kolor, 0.1), textDecorationColor: jasniej(kolor, 0.35) }}>
            {k}
          </span>
        ) : (
          <span key={i}>{k}</span>
        ),
      )}
    </>
  );
}
