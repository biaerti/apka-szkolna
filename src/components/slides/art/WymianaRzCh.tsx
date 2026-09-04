// Ilustracja "wymianaRzCh": rz wymienia sie na r, z z kropka na g lub z, ch na sz.

import { ART_COLORS as C, ART_FONT } from './colors';

// [wyraz, wyraz po wymianie, opis wymiany]
const PARY: Array<[string, string, string]> = [
  ['morze', 'morski', 'rz : r'],
  ['nóżka', 'noga', 'ż : g'],
  ['mucha', 'muszka', 'ch : sz'],
];

export function WymianaRzCh({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 300"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: pary wyrazow pokazujace wymiane rz na r, z z kropka na g oraz ch na sz"
      style={{ fontFamily: ART_FONT }}
    >
      <text x={240} y={28} textAnchor="middle" fontSize={25} fontWeight={800} fill={C.kropka}>
        RZ, Ż i CH też się wymieniają
      </text>

      {PARY.map(([przed, po, opis], i) => (
        <g key={przed} transform={`translate(0 ${52 + i * 74})`}>
          <rect x={14} y={0} width={162} height={54} rx={12} fill={C.panel} stroke={C.kropka} strokeWidth={3} />
          <text x={95} y={37} textAnchor="middle" fontSize={26} fontWeight={800} fill={C.kropka}>
            {przed}
          </text>

          <text x={208} y={37} textAnchor="middle" fontSize={30} fontWeight={700} fill={C.white}>
            →
          </text>

          <rect x={240} y={0} width={162} height={54} rx={12} fill={C.panel} stroke={C.panelLight} strokeWidth={2} />
          <text x={321} y={37} textAnchor="middle" fontSize={26} fontWeight={700} fill={C.white}>
            {po}
          </text>

          <text x={441} y={34} textAnchor="middle" fontSize={17} fontWeight={700} fill={C.plus}>
            {opis}
          </text>
        </g>
      ))}

      <text x={240} y={290} textAnchor="middle" fontSize={18} fill={C.panelLight}>
        H piszemy w wyrazach obcych: hotel, herbata
      </text>
    </svg>
  );
}
