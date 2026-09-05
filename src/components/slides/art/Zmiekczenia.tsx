// Ilustracja "zmiekczenia": kreska na koncu wyrazu i przed spolgloska, litera i przed samogloska.

import { ART_COLORS as C, ART_FONT } from './colors';

// [z kreska, przyklad, przez i, przyklad]
const PARY: Array<[string, string, string, string]> = [
  ['ć', 'nić', 'ci', 'ciocia'],
  ['ś', 'coś', 'si', 'siostra'],
  ['ź', 'weź', 'zi', 'zima'],
  ['ń', 'koń', 'ni', 'niebo'],
  ['dź', 'gwóźdź', 'dzi', 'dziadek'],
];

export function Zmiekczenia({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 330"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: zmiekczenia - kreska na koncu wyrazu i przed spolgloska, litera i przed samogloska"
      style={{ fontFamily: ART_FONT }}
    >
      <text x={118} y={22} textAnchor="middle" fontSize={19} fontWeight={800} fill={C.plus}>
        KRESKA
      </text>
      <text x={118} y={42} textAnchor="middle" fontSize={13} fill={C.white}>
        na końcu i przed spółgłoską
      </text>

      <text x={362} y={22} textAnchor="middle" fontSize={19} fontWeight={800} fill={C.kropka}>
        LITERA i
      </text>
      <text x={362} y={42} textAnchor="middle" fontSize={13} fill={C.white}>
        przed samogłoską
      </text>

      <line x1={240} y1={54} x2={240} y2={316} stroke={C.panelLight} strokeWidth={2} />

      {PARY.map(([kreska, p1, przezI, p2], i) => (
        <g key={kreska} transform={`translate(0 ${62 + i * 52})`}>
          <rect x={14} y={0} width={62} height={40} rx={9} fill={C.panel} stroke={C.plus} strokeWidth={3} />
          <text x={45} y={29} textAnchor="middle" fontSize={24} fontWeight={800} fill={C.plus}>
            {kreska}
          </text>
          <text x={86} y={28} fontSize={19} fill={C.white}>
            {p1}
          </text>

          <rect x={254} y={0} width={62} height={40} rx={9} fill={C.panel} stroke={C.kropka} strokeWidth={3} />
          <text x={285} y={29} textAnchor="middle" fontSize={24} fontWeight={800} fill={C.kropka}>
            {przezI}
          </text>
          <text x={326} y={28} fontSize={19} fill={C.white}>
            {p2}
          </text>
        </g>
      ))}
    </svg>
  );
}
