// Ilustracja "nazwyWlasne": nazwa pospolita mala litera, nazwa wlasna wielka.

import { ART_COLORS as C, ART_FONT } from './colors';

// [pospolita, wlasna]
const PARY: Array<[string, string]> = [
  ['pies', 'Burek'],
  ['miasto', 'Kraków'],
  ['rzeka', 'Wisła'],
  ['święto', 'Boże Narodzenie'],
  ['książka', '"Akademia pana Kleksa"'],
];

export function NazwyWlasne({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 320"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: nazwy pospolite mala litera, nazwy wlasne wielka litera"
      style={{ fontFamily: ART_FONT }}
    >
      <text x={112} y={24} textAnchor="middle" fontSize={19} fontWeight={800} fill={C.panelLight}>
        POSPOLITE
      </text>
      <text x={112} y={44} textAnchor="middle" fontSize={14} fill={C.white}>
        małą literą
      </text>

      <text x={340} y={24} textAnchor="middle" fontSize={19} fontWeight={800} fill={C.plus}>
        WŁASNE
      </text>
      <text x={340} y={44} textAnchor="middle" fontSize={14} fill={C.white}>
        wielką literą
      </text>

      <line x1={226} y1={54} x2={226} y2={310} stroke={C.panelLight} strokeWidth={2} />

      {PARY.map(([pospolita, wlasna], i) => (
        <g key={pospolita} transform={`translate(0 ${62 + i * 50})`}>
          <rect x={16} y={0} width={196} height={38} rx={9} fill={C.panel} stroke={C.panelLight} strokeWidth={2} />
          <text x={114} y={26} textAnchor="middle" fontSize={19} fill={C.white}>
            {pospolita}
          </text>
          <rect x={240} y={0} width={224} height={38} rx={9} fill={C.panel} stroke={C.plus} strokeWidth={3} />
          <text x={352} y={26} textAnchor="middle" fontSize={18} fontWeight={700} fill={C.plus}>
            {wlasna}
          </text>
        </g>
      ))}
    </svg>
  );
}
