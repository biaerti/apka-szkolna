// Ilustracja "samogloski": osiem samoglosek na tle pozostalych liter alfabetu.

import { ART_COLORS as C, ART_FONT } from './colors';

const SAMOGLOSKI = ['a', 'e', 'i', 'o', 'u', 'y', 'ą', 'ę'];
const SPOLGLOSKI = ['b', 'c', 'd', 'f', 'g', 'h', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'w', 'z'];

export function Samogloski({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 320"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: osiem samoglosek a, e, i, o, u, y, a z ogonkiem i e z ogonkiem, a pod nimi spolgloski"
      style={{ fontFamily: ART_FONT }}
    >
      <text x={240} y={26} textAnchor="middle" fontSize={26} fontWeight={800} fill={C.plus}>
        8 SAMOGŁOSEK
      </text>

      {SAMOGLOSKI.map((litera, i) => (
        <g key={litera} transform={`translate(${28 + i * 54} 42)`}>
          <rect width={48} height={58} rx={10} fill={C.panel} stroke={C.plus} strokeWidth={3} />
          <text x={24} y={42} textAnchor="middle" fontSize={34} fontWeight={800} fill={C.plus}>
            {litera}
          </text>
        </g>
      ))}

      <text x={240} y={132} textAnchor="middle" fontSize={19} fill={C.white}>
        buzia otwarta, powietrze płynie swobodnie
      </text>

      <text x={240} y={180} textAnchor="middle" fontSize={22} fontWeight={700} fill={C.panelLight}>
        reszta liter to spółgłoski
      </text>

      {SPOLGLOSKI.map((litera, i) => (
        <g key={litera} transform={`translate(${34 + (i % 8) * 52} ${196 + Math.floor(i / 8) * 56})`}>
          <rect width={44} height={46} rx={8} fill={C.panel} stroke={C.panelLight} strokeWidth={2} />
          <text x={22} y={33} textAnchor="middle" fontSize={24} fontWeight={700} fill={C.panelLight}>
            {litera}
          </text>
        </g>
      ))}
    </svg>
  );
}
