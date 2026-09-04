// Ilustracja "rodzajeZdan": oznajmujace, pytajace i rozkazujace - znak na koncu zdania.

import { ART_COLORS as C, ART_FONT } from './colors';

// [zdanie bez znaku, znak konca, nazwa rodzaju, kolor]
const ZDANIA: Array<[string, string, string, string]> = [
  ['Pada deszcz', '.', 'oznajmujące', C.plus],
  ['Czy pada deszcz', '?', 'pytające', C.kropka],
  ['Zamknij okno', '!', 'rozkazujące', C.pas],
];

export function RodzajeZdan({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 300"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: trzy rodzaje zdan - oznajmujace z kropka, pytajace ze znakiem zapytania, rozkazujace z wykrzyknikiem"
      style={{ fontFamily: ART_FONT }}
    >
      {ZDANIA.map(([zdanie, znak, nazwa, kolor], i) => (
        <g key={nazwa} transform={`translate(0 ${14 + i * 96})`}>
          <rect x={14} y={0} width={310} height={70} rx={14} fill={C.panel} stroke={kolor} strokeWidth={3} />
          <text x={34} y={44} fontSize={24} fontWeight={700} fill={C.white}>
            {zdanie}
          </text>

          {/* Znak konca zdania - duzy, osobno */}
          <rect x={336} y={0} width={70} height={70} rx={14} fill={kolor} />
          {/* Kropka jako kolo - w tym rozmiarze znak "." bylby ledwo widoczny */}
          {znak === '.' ? (
            <circle cx={371} cy={35} r={13} fill={C.panel} />
          ) : (
            <text x={371} y={54} textAnchor="middle" fontSize={48} fontWeight={800} fill={C.panel}>
              {znak}
            </text>
          )}

          <text x={169} y={88} textAnchor="middle" fontSize={17} fill={kolor}>
            {nazwa}
          </text>
        </g>
      ))}
    </svg>
  );
}
