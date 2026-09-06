// Ilustracja "liczebnikSlownie": cyfra i jej zapis slowny, z pulapkami
// ortograficznymi (szescset, czterysta, dziewiecdziesiat).

import { ART_COLORS as C, ART_FONT } from './colors';

// [cyfra, zapis slowny, czy litery do zapamietania]
const LICZBY: Array<[string, string, boolean]> = [
  ['600', 'sześćset', true],
  ['400', 'czterysta', true],
  ['90', 'dziewięćdziesiąt', true],
  ['15', 'piętnaście', false],
];

export function LiczebnikSlownie({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 300"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: liczby zapisane cyframi i slowami, np. 600 to szescset"
      style={{ fontFamily: ART_FONT }}
    >
      <text x={240} y={26} textAnchor="middle" fontSize={22} fontWeight={800} fill={C.white}>
        CYFRĄ I SŁOWAMI
      </text>

      {LICZBY.map(([cyfra, slowo, trudne], i) => (
        <g key={cyfra} transform={`translate(0 ${44 + i * 60})`}>
          <rect x={26} y={0} width={112} height={48} rx={11} fill={C.panel} stroke={C.panelLight} strokeWidth={3} />
          <text x={82} y={34} textAnchor="middle" fontSize={26} fontWeight={800} fill={C.white}>
            {cyfra}
          </text>

          <text x={152} y={32} fontSize={24} fontWeight={700} fill={C.white}>
            =
          </text>

          <rect
            x={182}
            y={0}
            width={272}
            height={48}
            rx={11}
            fill={C.panel}
            stroke={trudne ? C.plomba : C.panelLight}
            strokeWidth={3}
          />
          <text x={318} y={33} textAnchor="middle" fontSize={23} fontWeight={800} fill={trudne ? C.plomba : C.white}>
            {slowo}
          </text>
        </g>
      ))}

      <text x={240} y={292} textAnchor="middle" fontSize={18} fill={C.plomba}>
        na czerwono: pisownię trzeba zapamiętać
      </text>
    </svg>
  );
}
