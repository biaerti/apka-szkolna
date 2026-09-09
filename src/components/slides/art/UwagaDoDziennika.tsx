// Ilustracja "uwaga za zachowanie": przeszkadzanie idzie WPROST do dziennika.
// Bez schodkow, bez ostrzezenia, bez przekreslonego plusa - dawna eskalacja
// (1. ostrzezenie, 2. bez plusow do konca miesiaca) jest wycofana i nie ma jej
// wracac na slajd (patrz src/data/zasady.ts i src/lib/recap.ts).
//
// Drugi komunikat obrazka jest rownie wazny jak pierwszy: plus zostaje caly,
// bo uwaga nie zabiera niczego z gry o oceny.

import { ART_COLORS as C, ART_FONT } from './colors';

export function UwagaDoDziennika({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 300"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: przeszkadzanie na lekcji to uwaga wpisana do dziennika, bez ostrzezen"
      style={{ fontFamily: ART_FONT }}
    >
      {/* Przeszkadzanie - dymek z krzykiem */}
      <g transform="translate(30 60)">
        <rect x={0} y={0} width={150} height={92} rx={16} fill={C.panelLight} stroke={C.white} strokeWidth={3} />
        <path d="M 40 92 L 40 118 L 68 92 Z" fill={C.panelLight} stroke={C.white} strokeWidth={3} />
        <text x={75} y={44} textAnchor="middle" fontSize={30} fontWeight={800} fill={C.plomba}>
          BLA BLA
        </text>
        <text x={75} y={72} textAnchor="middle" fontSize={17} fontWeight={700} fill={C.white}>
          przeszkadzasz
        </text>
      </g>

      {/* Strzalka - od razu, bez posrednich stopni */}
      <g stroke={C.pas} strokeWidth={7} strokeLinecap="round">
        <line x1={195} y1={106} x2={258} y2={106} />
        <line x1={240} y1={90} x2={258} y2={106} />
        <line x1={240} y1={122} x2={258} y2={106} />
      </g>
      <text x={226} y={82} textAnchor="middle" fontSize={15} fontWeight={700} fill={C.pas}>
        od razu
      </text>

      {/* Dziennik - kartka z wpisem */}
      <g transform="translate(280 40)">
        <rect x={0} y={0} width={170} height={132} rx={10} fill={C.paper} stroke={C.ink} strokeWidth={3} />
        <text x={85} y={30} textAnchor="middle" fontSize={19} fontWeight={800} fill={C.ink}>
          DZIENNIK
        </text>
        <line x1={16} y1={46} x2={154} y2={46} stroke={C.line} strokeWidth={3} />
        <text x={16} y={74} fontSize={17} fontWeight={700} fill={C.plombaDark}>
          Uwaga
        </text>
        <line x1={16} y1={92} x2={154} y2={92} stroke={C.line} strokeWidth={3} />
        <line x1={16} y1={114} x2={120} y2={114} stroke={C.line} strokeWidth={3} />
      </g>

      {/* Plus zostaje caly - uwaga nie rusza gry o oceny */}
      <g transform="translate(60 236)">
        <circle r={26} fill={C.panel} stroke={C.plus} strokeWidth={3} />
        <rect x={-5} y={-15} width={10} height={30} rx={3} fill={C.plus} />
        <rect x={-15} y={-5} width={30} height={10} rx={3} fill={C.plus} />
      </g>
      <text x={100} y={232} fontSize={17} fontWeight={700} fill={C.plus}>
        Plusy zostają.
      </text>
      <text x={100} y={256} fontSize={17} fontWeight={700} fill={C.white}>
        Uwaga niczego w grze
      </text>
      <text x={100} y={278} fontSize={17} fontWeight={700} fill={C.white}>
        nie zabiera.
      </text>
    </svg>
  );
}
