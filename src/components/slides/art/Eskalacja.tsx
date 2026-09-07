// Ilustracja "eskalacja": dwa stopnie konsekwencji za przeszkadzanie.
// 1. ostrzezenie, 2. (i kazdy kolejny raz) bez plusow do konca miesiaca - w
// zadnym kole. Bez motywu dodatkowych miejsc w kole - ta konsekwencja juz nie
// istnieje (patrz src/data/zasady.ts i src/lib/recap.ts).

import { ART_COLORS as C, ART_FONT } from './colors';

export function Eskalacja({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 300"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: dwa stopnie eskalacji za przeszkadzanie - ostrzezenie, potem brak plusow do konca miesiaca"
      style={{ fontFamily: ART_FONT }}
    >
      {/* Schodki - tylko dwa */}
      <rect x={80} y={190} width={150} height={80} fill={C.panelLight} stroke={C.white} strokeWidth={3} />
      <rect x={250} y={124} width={150} height={146} fill={C.panelLight} stroke={C.white} strokeWidth={3} />

      <text x={155} y={236} textAnchor="middle" fontSize={34} fontWeight={800} fill={C.white}>
        1
      </text>
      <text x={325} y={182} textAnchor="middle" fontSize={34} fontWeight={800} fill={C.white}>
        2+
      </text>

      {/* Krok 1: ostrzezenie */}
      <text x={155} y={168} textAnchor="middle" fontSize={18} fontWeight={700} fill={C.pas}>
        ostrzeżenie
      </text>

      {/* Krok 2+: bez plusow - przekreslony plus */}
      <g transform="translate(325 92)">
        <circle r={28} fill={C.panel} stroke={C.plus} strokeWidth={3} />
        <rect x={-5} y={-16} width={10} height={32} rx={3} fill={C.plus} />
        <rect x={-16} y={-5} width={32} height={10} rx={3} fill={C.plus} />
        <line x1={-26} y1={-26} x2={26} y2={26} stroke={C.plomba} strokeWidth={6} strokeLinecap="round" />
      </g>
      <text x={325} y={106} textAnchor="middle" fontSize={15} fontWeight={700} fill={C.plomba}>
        bez plusów do końca miesiąca
      </text>
    </svg>
  );
}
