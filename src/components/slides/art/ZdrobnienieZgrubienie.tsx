// Ilustracja "zdrobnienieZgrubienie": maly - zwykly - wielki, na przykladzie domu i psa.

import { ART_COLORS as C, ART_FONT } from './colors';

// [zdrobnienie, wyraz podstawowy, zgrubienie]
const TROJKI: Array<[string, string, string]> = [
  ['domek', 'dom', 'domisko'],
  ['piesek', 'pies', 'psisko'],
  ['nosek', 'nos', 'nochal'],
];

export function ZdrobnienieZgrubienie({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 320"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: zdrobnienie, wyraz podstawowy i zgrubienie"
      style={{ fontFamily: ART_FONT }}
    >
      <text x={90} y={26} textAnchor="middle" fontSize={17} fontWeight={800} fill={C.kropka}>
        ZDROBNIENIE
      </text>
      <text x={240} y={26} textAnchor="middle" fontSize={17} fontWeight={800} fill={C.white}>
        WYRAZ
      </text>
      <text x={392} y={26} textAnchor="middle" fontSize={17} fontWeight={800} fill={C.plomba}>
        ZGRUBIENIE
      </text>

      <text x={90} y={46} textAnchor="middle" fontSize={14} fill={C.panelLight}>
        czule, mniejsze
      </text>
      <text x={240} y={46} textAnchor="middle" fontSize={14} fill={C.panelLight}>
        zwykły
      </text>
      <text x={392} y={46} textAnchor="middle" fontSize={14} fill={C.panelLight}>
        duże, niemiłe
      </text>

      {TROJKI.map(([male, zwykle, duze], i) => (
        <g key={zwykle} transform={`translate(0 ${62 + i * 76})`}>
          <rect x={16} y={8} width={148} height={44} rx={10} fill={C.panel} stroke={C.kropka} strokeWidth={2} />
          <text x={90} y={37} textAnchor="middle" fontSize={19} fill={C.kropka}>
            {male}
          </text>

          <rect x={180} y={2} width={120} height={56} rx={10} fill={C.panel} stroke={C.pas} strokeWidth={3} />
          <text x={240} y={38} textAnchor="middle" fontSize={22} fontWeight={800} fill={C.pas}>
            {zwykle}
          </text>

          <rect x={316} y={8} width={148} height={44} rx={10} fill={C.panel} stroke={C.plomba} strokeWidth={2} />
          <text x={390} y={37} textAnchor="middle" fontSize={19} fill={C.plomba}>
            {duze}
          </text>
        </g>
      ))}
    </svg>
  );
}
