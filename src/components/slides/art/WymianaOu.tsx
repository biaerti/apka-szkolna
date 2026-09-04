// Ilustracja "wymianaOu": o kreskowane wymienia sie na o, e albo a.

import { ART_COLORS as C, ART_FONT } from './colors';

// [wyraz z o kreskowanym, wyraz po wymianie, opis wymiany]
const PARY: Array<[string, string, string]> = [
  ['stół', 'stoły', 'ó : o'],
  ['siódmy', 'siedem', 'ó : e'],
  ['skrócić', 'skracać', 'ó : a'],
];

export function WymianaOu({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 300"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: pary wyrazow pokazujace wymiane o kreskowanego na o, e oraz a"
      style={{ fontFamily: ART_FONT }}
    >
      <text x={240} y={28} textAnchor="middle" fontSize={25} fontWeight={800} fill={C.plus}>
        Ó wymienia się na O, E, A
      </text>

      {PARY.map(([przed, po, opis], i) => (
        <g key={przed} transform={`translate(0 ${52 + i * 74})`}>
          <rect x={14} y={0} width={162} height={54} rx={12} fill={C.panel} stroke={C.plus} strokeWidth={3} />
          <text x={95} y={37} textAnchor="middle" fontSize={26} fontWeight={800} fill={C.plus}>
            {przed}
          </text>

          <text x={208} y={37} textAnchor="middle" fontSize={30} fontWeight={700} fill={C.white}>
            →
          </text>

          <rect x={240} y={0} width={162} height={54} rx={12} fill={C.panel} stroke={C.panelLight} strokeWidth={2} />
          <text x={321} y={37} textAnchor="middle" fontSize={26} fontWeight={700} fill={C.white}>
            {po}
          </text>

          <text x={441} y={34} textAnchor="middle" fontSize={17} fontWeight={700} fill={C.kropka}>
            {opis}
          </text>
        </g>
      ))}

      <text x={240} y={290} textAnchor="middle" fontSize={18} fill={C.panelLight}>
        bez wymiany zapamiętujemy: ogórek, wróbel
      </text>
    </svg>
  );
}
