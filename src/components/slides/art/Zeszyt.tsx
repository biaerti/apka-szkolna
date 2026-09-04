// Ilustracja "zeszyt": otwarty zeszyt w liniature z dlugopisem.

import { ART_COLORS as C, ART_FONT } from './colors';

const LINE_YS = [80, 108, 136, 164, 192, 220];

export function Zeszyt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 420 280"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: otwarty zeszyt w liniature z dlugopisem - notatka do zeszytu"
      style={{ fontFamily: ART_FONT }}
    >
      {/* Dwie strony zeszytu */}
      <rect x={30} y={30} width={170} height={220} rx={8} fill={C.paper} stroke={C.ink} strokeWidth={4} />
      <rect x={210} y={30} width={170} height={220} rx={8} fill={C.paper} stroke={C.ink} strokeWidth={4} />
      <line x1={200} y1={30} x2={200} y2={250} stroke={C.ink} strokeWidth={3} />

      {/* Margines */}
      <line x1={55} y1={40} x2={55} y2={240} stroke={C.plomba} strokeWidth={2} opacity={0.5} />

      {/* Liniatura */}
      {LINE_YS.map((y) => (
        <g key={y}>
          <line x1={62} y1={y} x2={190} y2={y} stroke={C.line} strokeWidth={2} />
          <line x1={220} y1={y} x2={370} y2={y} stroke={C.line} strokeWidth={2} />
        </g>
      ))}

      {/* Zapisany naglowek "Temat" na lewej stronie */}
      <line x1={62} y1={56} x2={150} y2={56} stroke={C.panelLight} strokeWidth={4} strokeLinecap="round" />

      {/* Dlugopis po przekatnej nad zeszytem */}
      <g transform="rotate(38 300 90)">
        <rect x={260} y={84} width={140} height={14} rx={7} fill={C.kropka} stroke={C.ink} strokeWidth={2} />
        <polygon points="260,84 260,98 236,91" fill={C.panelLight} stroke={C.ink} strokeWidth={2} />
      </g>
    </svg>
  );
}
