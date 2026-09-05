// Ilustracja "frazeologizm": ten sam zwrot dwa razy - doslownie (zle) i przenosnie (dobrze).

import { ART_COLORS as C, ART_FONT } from './colors';

const ZWROTY: Array<[string, string]> = [
  ['wziąć nogi za pas', 'szybko uciec'],
  ['mieć muchy w nosie', 'być obrażonym'],
  ['biały kruk', 'rzadka, cenna rzecz'],
];

export function Frazeologizm({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 320"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: zwiazki frazeologiczne i ich znaczenie przenosne"
      style={{ fontFamily: ART_FONT }}
    >
      <text x={240} y={24} textAnchor="middle" fontSize={20} fontWeight={800} fill={C.plus}>
        ZWIĄZEK FRAZEOLOGICZNY
      </text>
      <text x={240} y={48} textAnchor="middle" fontSize={16} fill={C.white}>
        stałe połączenie wyrazów - nie tłumacz go dosłownie
      </text>

      {ZWROTY.map(([zwrot, znaczenie], i) => (
        <g key={zwrot} transform={`translate(0 ${64 + i * 84})`}>
          <rect x={20} y={0} width={440} height={34} rx={9} fill={C.panel} stroke={C.pas} strokeWidth={3} />
          <text x={240} y={24} textAnchor="middle" fontSize={20} fontWeight={700} fill={C.pas}>
            {zwrot}
          </text>
          <path d="M 240 38 l 0 12 l -8 -6 m 8 6 l 8 -6" stroke={C.panelLight} strokeWidth={3} fill="none" />
          <rect x={80} y={52} width={320} height={30} rx={9} fill={C.panel} stroke={C.plus} strokeWidth={2} />
          <text x={240} y={73} textAnchor="middle" fontSize={18} fill={C.plus}>
            {znaczenie}
          </text>
        </g>
      ))}
    </svg>
  );
}
