// Ilustracja "rodzinaWyrazow": wspolna czastka (rdzen) i wyrazy pokrewne wokol niej.

import { ART_COLORS as C, ART_FONT } from './colors';

// [wyraz, x, y] - cztery karty w rogach, rdzen posrodku
const POKREWNE: Array<[string, number, number]> = [
  ['domek', 34, 54],
  ['domowy', 296, 54],
  ['domownik', 34, 240],
  ['bezdomny', 296, 240],
];

export function RodzinaWyrazow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 320"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: rodzina wyrazow ze wspolna czastka dom"
      style={{ fontFamily: ART_FONT }}
    >
      <text x={240} y={24} textAnchor="middle" fontSize={22} fontWeight={800} fill={C.plus}>
        RODZINA WYRAZÓW
      </text>

      {POKREWNE.map(([w, x, y]) => (
        <line
          key={`l-${w}`}
          x1={x + 75}
          y1={y + 20}
          x2={240}
          y2={162}
          stroke={C.panelLight}
          strokeWidth={2}
        />
      ))}

      <circle cx={240} cy={162} r={56} fill={C.panel} stroke={C.pas} strokeWidth={4} />
      <text x={240} y={158} textAnchor="middle" fontSize={30} fontWeight={800} fill={C.pas}>
        dom
      </text>
      <text x={240} y={183} textAnchor="middle" fontSize={12} fill={C.white}>
        wspólna cząstka
      </text>

      {POKREWNE.map(([w, x, y]) => (
        <g key={w} transform={`translate(${x} ${y})`}>
          <rect width={150} height={40} rx={10} fill={C.panel} stroke={C.kropka} strokeWidth={2} />
          <text x={75} y={27} textAnchor="middle" fontSize={20} fontWeight={700} fill={C.white}>
            {w}
          </text>
        </g>
      ))}
    </svg>
  );
}
