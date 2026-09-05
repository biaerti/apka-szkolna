// Ilustracja "swiatPrzedstawiony": cztery elementy swiata przedstawionego utworu.

import { ART_COLORS as C, ART_FONT } from './colors';

// [nazwa, pytanie, przyklad, kolor]
const ELEMENTY: Array<[string, string, string, string]> = [
  ['CZAS', 'kiedy?', 'dawno temu, latem', C.plus],
  ['MIEJSCE', 'gdzie?', 'las, zamek, szkoła', C.kropka],
  ['BOHATEROWIE', 'kto?', 'główni i drugoplanowi', C.pas],
  ['WYDARZENIA', 'co się dzieje?', 'po kolei, od pierwszego', C.plomba],
];

export function SwiatPrzedstawiony({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 330"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: swiat przedstawiony - czas, miejsce, bohaterowie, wydarzenia"
      style={{ fontFamily: ART_FONT }}
    >
      <text x={240} y={24} textAnchor="middle" fontSize={21} fontWeight={800} fill={C.white}>
        ŚWIAT PRZEDSTAWIONY
      </text>

      {ELEMENTY.map(([nazwa, pytanie, przyklad, kolor], i) => (
        <g key={nazwa} transform={`translate(16 ${40 + i * 70})`}>
          <rect width={448} height={60} rx={12} fill={C.panel} stroke={kolor} strokeWidth={3} />
          <rect width={10} height={60} rx={5} fill={kolor} />
          <text x={28} y={26} fontSize={19} fontWeight={800} fill={kolor}>
            {nazwa}
          </text>
          <text x={28} y={48} fontSize={16} fill={C.white}>
            {przyklad}
          </text>
          <text x={434} y={37} textAnchor="end" fontSize={19} fontWeight={700} fill={C.panelLight}>
            {pytanie}
          </text>
        </g>
      ))}
    </svg>
  );
}
