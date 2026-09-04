// Ilustracja "rzeczownik": nazywa osoby, zwierzeta i rzeczy - kto? co?

import { ART_COLORS as C, ART_FONT } from './colors';

export function Rzeczownik({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 300"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: rzeczownik odpowiada na pytania kto i co - osoba, zwierze, rzecz"
      style={{ fontFamily: ART_FONT }}
    >
      <rect x={110} y={10} width={260} height={54} rx={16} fill={C.panel} stroke={C.kropka} strokeWidth={4} />
      <text x={240} y={46} textAnchor="middle" fontSize={30} fontWeight={800} fill={C.kropka}>
        kto? co?
      </text>

      {/* Osoba */}
      <g transform="translate(60 100)">
        <circle cx={0} cy={-4} r={20} fill={C.kropka} />
        <path d="M-26 52 A26 34 0 0 1 26 52 Z" fill={C.kropka} />
        <text x={0} y={92} textAnchor="middle" fontSize={19} fill={C.white}>
          mama
        </text>
      </g>

      {/* Zwierze */}
      <g transform="translate(240 100)">
        <circle cx={0} cy={12} r={26} fill={C.kropka} />
        {/* Opadajace uszy - zeby zwierze czytalo sie jako pies, nie kot */}
        <ellipse cx={-27} cy={6} rx={10} ry={20} fill={C.kropka} />
        <ellipse cx={27} cy={6} rx={10} ry={20} fill={C.kropka} />
        <circle cx={-9} cy={8} r={3.5} fill={C.panel} />
        <circle cx={9} cy={8} r={3.5} fill={C.panel} />
        <circle cx={0} cy={22} r={4.5} fill={C.panel} />
        <text x={0} y={92} textAnchor="middle" fontSize={19} fill={C.white}>
          pies
        </text>
      </g>

      {/* Rzecz */}
      <g transform="translate(420 100)">
        <rect x={-26} y={-24} width={52} height={72} rx={6} fill={C.kropka} />
        <path d="M-16 -8 H12 M-16 4 H12 M-16 16 H4" stroke={C.panel} strokeWidth={4} strokeLinecap="round" />
        <text x={0} y={92} textAnchor="middle" fontSize={19} fill={C.white}>
          zeszyt
        </text>
      </g>

      <text x={240} y={248} textAnchor="middle" fontSize={22} fontWeight={800} fill={C.white}>
        RZECZOWNIK
      </text>
      <text x={240} y={280} textAnchor="middle" fontSize={19} fill={C.panelLight}>
        nazywa też uczucia: radość, strach
      </text>
    </svg>
  );
}
