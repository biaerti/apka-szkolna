// Ilustracja "eskalacja": rosnace stopnie konsekwencji za przeszkadzanie.
// 1. ostrzezenie, 2. bez plusow do konca miesiaca, 3. i kazdy kolejny raz =
// dodatkowe miejsce w kole (wiecej sektorow tej samej osoby, wiec i wieksza
// szansa na losowanie).

import { ART_COLORS as C, ART_FONT } from './colors';

export function Eskalacja({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 300"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: rosnace schodki eskalacji za przeszkadzanie - ostrzezenie, brak plusow, coraz wiecej miejsc w kole"
      style={{ fontFamily: ART_FONT }}
    >
      {/* Schodki */}
      <rect x={20} y={220} width={130} height={50} fill={C.panelLight} stroke={C.white} strokeWidth={3} />
      <rect x={175} y={172} width={130} height={98} fill={C.panelLight} stroke={C.white} strokeWidth={3} />
      <rect x={330} y={124} width={130} height={146} fill={C.panelLight} stroke={C.white} strokeWidth={3} />

      <text x={85} y={256} textAnchor="middle" fontSize={30} fontWeight={800} fill={C.white}>
        1
      </text>
      <text x={240} y={230} textAnchor="middle" fontSize={30} fontWeight={800} fill={C.white}>
        2
      </text>
      <text x={395} y={182} textAnchor="middle" fontSize={30} fontWeight={800} fill={C.white}>
        3+
      </text>

      {/* Krok 1: ostrzezenie */}
      <text x={85} y={200} textAnchor="middle" fontSize={17} fontWeight={700} fill={C.pas}>
        ostrzeżenie
      </text>

      {/* Krok 2: bez plusow - przekreslony plus */}
      <g transform="translate(240 140)">
        <circle r={26} fill={C.panel} stroke={C.plus} strokeWidth={3} />
        <rect x={-5} y={-15} width={10} height={30} rx={3} fill={C.plus} />
        <rect x={-15} y={-5} width={30} height={10} rx={3} fill={C.plus} />
        <line x1={-24} y1={-24} x2={24} y2={24} stroke={C.plomba} strokeWidth={6} strokeLinecap="round" />
      </g>
      <text x={240} y={152} textAnchor="middle" fontSize={17} fontWeight={700} fill={C.plomba}>
        bez plusów
      </text>

      {/* Krok 3+: mini kolo z rosnaca liczba sektorow tej samej osoby (tu: cztery) */}
      <g transform="translate(395 88)">
        <path d="M0 0 L0 -34 A34 34 0 0 1 24.04 -24.04 Z" fill={C.pas} stroke={C.white} strokeWidth={2} />
        <path d="M0 0 L24.04 -24.04 A34 34 0 0 1 34 0 Z" fill={C.panel} stroke={C.white} strokeWidth={2} />
        <path d="M0 0 L34 0 A34 34 0 0 1 24.04 24.04 Z" fill={C.panelLight} stroke={C.white} strokeWidth={2} />
        <path d="M0 0 L24.04 24.04 A34 34 0 0 1 0 34 Z" fill={C.pas} stroke={C.white} strokeWidth={2} />
        <path d="M0 0 L0 34 A34 34 0 0 1 -24.04 24.04 Z" fill={C.panel} stroke={C.white} strokeWidth={2} />
        <path d="M0 0 L-24.04 24.04 A34 34 0 0 1 -34 0 Z" fill={C.panelLight} stroke={C.white} strokeWidth={2} />
        <path d="M0 0 L-34 0 A34 34 0 0 1 -24.04 -24.04 Z" fill={C.pas} stroke={C.white} strokeWidth={2} />
        <path d="M0 0 L-24.04 -24.04 A34 34 0 0 1 0 -34 Z" fill={C.panel} stroke={C.white} strokeWidth={2} />
      </g>
      <text x={395} y={112} textAnchor="middle" fontSize={17} fontWeight={700} fill={C.pas}>
        coraz więcej miejsc w kole
      </text>
    </svg>
  );
}
