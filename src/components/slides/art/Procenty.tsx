// Ilustracja "procenty": pasek 0-100% podzielony progami na oceny ze sprawdzianow.
// Progi (33/50/75/90/98) i cyfry ocen (1-6) musza sie zgadzac z tekstem zasad
// w src/data/zasady.ts (sekcja "Zeszyt i sprawdziany") - to tylko obrazek do tej
// samej tresci, liczby nie sa tu zrodlem prawdy.

import { ART_COLORS as C, ART_FONT } from './colors';

const BAR_X = 20;
const BAR_W = 350;
const BAR_Y = 150;
const BAR_H = 55;

function pctToX(pct: number): number {
  return BAR_X + (pct / 100) * BAR_W;
}

// Granice progow: 0, 33, 50, 75, 90, 98, 100.
const X0 = pctToX(0);
const X33 = pctToX(33);
const X50 = pctToX(50);
const X75 = pctToX(75);
const X90 = pctToX(90);
const X98 = pctToX(98);
const X100 = pctToX(100);

const SEGMENTS = [
  { from: X0, to: X33, fill: C.plomba, grade: '1' },
  { from: X33, to: X50, fill: C.pas, grade: '2' },
  { from: X50, to: X75, fill: C.kropka, grade: '3' },
  { from: X75, to: X90, fill: C.plus, opacity: 0.55, grade: '4' },
  { from: X90, to: X98, fill: C.plus, opacity: 1, grade: '5' },
  { from: X98, to: X100, fill: C.plusDark, opacity: 1, grade: '6' },
];

const DIVIDERS = [X33, X50, X75, X90];

export function Procenty({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 420 280"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: pasek procentowy sprawdzianu podzielony progami 33, 50, 75, 90 i 98 procent na oceny od jedynki do szostki"
      style={{ fontFamily: ART_FONT }}
    >
      {/* Ramka paska */}
      <rect
        x={BAR_X}
        y={BAR_Y}
        width={BAR_W}
        height={BAR_H}
        rx={8}
        fill="none"
        stroke={C.ink}
        strokeWidth={4}
      />

      {/* Kolorowe odcinki */}
      {SEGMENTS.map((seg) => (
        <rect
          key={seg.grade}
          x={seg.from}
          y={BAR_Y}
          width={Math.max(seg.to - seg.from, 0)}
          height={BAR_H}
          fill={seg.fill}
          opacity={seg.opacity ?? 1}
        />
      ))}

      {/* Ramka na wierzchu kolorow, zeby kontur byl czysty */}
      <rect
        x={BAR_X}
        y={BAR_Y}
        width={BAR_W}
        height={BAR_H}
        rx={8}
        fill="none"
        stroke={C.ink}
        strokeWidth={4}
      />

      {/* Linie podzialu progow 33/50/75/90 (98 jest zbyt blisko krawedzi - patrz nizej) */}
      {DIVIDERS.map((x) => (
        <line key={x} x1={x} y1={BAR_Y} x2={x} y2={BAR_Y + BAR_H} stroke={C.ink} strokeWidth={3} />
      ))}
      <line x1={X98} y1={BAR_Y} x2={X98} y2={BAR_Y + BAR_H} stroke={C.ink} strokeWidth={2} />

      {/* Cyfry ocen nad paskiem - dla ocen 1-5 nad srodkiem odcinka */}
      {SEGMENTS.slice(0, 5).map((seg) => (
        <text
          key={seg.grade}
          x={(seg.from + seg.to) / 2}
          y={128}
          textAnchor="middle"
          fontSize={34}
          fontWeight={800}
          fill={seg.fill}
        >
          {seg.grade}
        </text>
      ))}

      {/* Szostka: odcinek 98-100% jest za waski na cyfre i etykiete -
          wyprowadzamy je linia pomocnicza w prawo, zeby nic sie nie nakladalo */}
      <line x1={(X98 + X100) / 2} y1={BAR_Y} x2={402} y2={100} stroke={C.plusDark} strokeWidth={2} />
      <text x={404} y={92} textAnchor="start" fontSize={34} fontWeight={800} fill={C.plusDark}>
        6
      </text>

      {/* Etykiety procentow pod paskiem */}
      <text x={X33} y={228} textAnchor="middle" fontSize={17} fontWeight={600} fill={C.white}>
        33%
      </text>
      <text x={X50} y={228} textAnchor="middle" fontSize={17} fontWeight={600} fill={C.white}>
        50%
      </text>
      <text x={X75} y={228} textAnchor="middle" fontSize={17} fontWeight={600} fill={C.white}>
        75%
      </text>
      <text x={X90} y={228} textAnchor="middle" fontSize={17} fontWeight={600} fill={C.white}>
        90%
      </text>

      {/* 98% jest za blisko 90% i krawedzi paska - wyprowadzone linia pomocnicza w dol-prawo */}
      <line x1={X98} y1={BAR_Y + BAR_H} x2={410} y2={252} stroke={C.plusDark} strokeWidth={2} />
      <text x={410} y={268} textAnchor="end" fontSize={17} fontWeight={600} fill={C.plusDark}>
        98%
      </text>

      {/* Skrajne wartosci 0% i 100% - male i wyciszone, tylko dla orientacji */}
      <text x={X0} y={228} textAnchor="start" fontSize={13} fontWeight={500} fill={C.muted}>
        0%
      </text>
    </svg>
  );
}
