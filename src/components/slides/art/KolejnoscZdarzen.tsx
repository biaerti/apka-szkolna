// Ilustracja "kolejnoscZdarzen": os czasu z czterema wydarzeniami i slowami porzadkujacymi.

import { ART_COLORS as C, ART_FONT } from './colors';

// [numer, slowo porzadkujace, wydarzenie]
const ZDARZENIA: Array<[string, string, string]> = [
  ['1', 'najpierw', 'Ala znalazła kota'],
  ['2', 'potem', 'zaniosła go do domu'],
  ['3', 'nagle', 'kot uciekł przez okno'],
  ['4', 'na koniec', 'wrócił sam wieczorem'],
];

export function KolejnoscZdarzen({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 320"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: kolejnosc zdarzen na osi - najpierw, potem, nagle, na koniec"
      style={{ fontFamily: ART_FONT }}
    >
      <text x={240} y={24} textAnchor="middle" fontSize={21} fontWeight={800} fill={C.plus}>
        KOLEJNOŚĆ ZDARZEŃ
      </text>

      <line x1={44} y1={56} x2={44} y2={286} stroke={C.panelLight} strokeWidth={3} />

      {ZDARZENIA.map(([nr, slowo, tekst], i) => (
        <g key={nr} transform={`translate(0 ${56 + i * 62})`}>
          <circle cx={44} cy={22} r={20} fill={C.panel} stroke={C.plus} strokeWidth={3} />
          <text x={44} y={29} textAnchor="middle" fontSize={19} fontWeight={800} fill={C.plus}>
            {nr}
          </text>
          <text x={80} y={16} fontSize={17} fontWeight={700} fill={C.pas}>
            {slowo}
          </text>
          <text x={80} y={38} fontSize={18} fill={C.white}>
            {tekst}
          </text>
        </g>
      ))}
    </svg>
  );
}
