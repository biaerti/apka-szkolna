// Ilustracja "przypadki": siedem przypadkow z pytaniami i odmiana rzeczownika kot.

import { ART_COLORS as C, ART_FONT } from './colors';

// [skrot, pytania, forma wyrazu "kot"]
const PRZYPADKI: Array<[string, string, string]> = [
  ['M.', 'kto? co?', 'kot'],
  ['D.', 'kogo? czego?', 'kota'],
  ['C.', 'komu? czemu?', 'kotu'],
  ['B.', 'kogo? co?', 'kota'],
  ['N.', '(z) kim? (z) czym?', 'kotem'],
  ['Ms.', '(o) kim? (o) czym?', 'kocie'],
  ['W.', 'o!', 'kocie!'],
];

export function Przypadki({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 340"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: siedem przypadkow z pytaniami i odmiana rzeczownika kot"
      style={{ fontFamily: ART_FONT }}
    >
      <text x={240} y={24} textAnchor="middle" fontSize={23} fontWeight={800} fill={C.plus}>
        7 PRZYPADKÓW
      </text>

      {PRZYPADKI.map(([skrot, pytania, forma], i) => (
        <g key={skrot} transform={`translate(0 ${40 + i * 42})`}>
          <rect x={14} y={0} width={52} height={34} rx={8} fill={C.panel} stroke={C.plus} strokeWidth={2} />
          <text x={40} y={24} textAnchor="middle" fontSize={18} fontWeight={800} fill={C.plus}>
            {skrot}
          </text>
          <text x={80} y={24} fontSize={18} fill={C.white}>
            {pytania}
          </text>
          <text x={356} y={24} fontSize={19} fontWeight={700} fill={C.kropka}>
            {forma}
          </text>
        </g>
      ))}
    </svg>
  );
}
