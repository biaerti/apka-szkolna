// Ilustracja "pas": tarcza z napisem PAS - "dzis nie odpowiadam" - i licznik na miesiac.

import { ART_COLORS as C, ART_FONT } from './colors';

export function Pas({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 420 300"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: tarcza z napisem PAS - dzis nie odpowiadam - oraz licznik trzech pasow na miesiac"
      style={{ fontFamily: ART_FONT }}
    >
      {/* Tarcza */}
      <path
        d="M100 24 L200 24 L200 130 Q200 200 150 244 Q100 200 100 130 Z"
        fill={C.kropka}
        stroke={C.white}
        strokeWidth={6}
      />
      <text x={150} y={130} textAnchor="middle" fontSize={44} fontWeight={800} fill={C.white}>
        PAS
      </text>
      <text x={150} y={175} textAnchor="middle" fontSize={19} fontWeight={600} fill={C.white}>
        dziś nie
      </text>
      <text x={150} y={198} textAnchor="middle" fontSize={19} fontWeight={600} fill={C.white}>
        odpowiadam
      </text>

      {/* Licznik miesieczny */}
      <rect x={270} y={50} width={120} height={110} rx={12} fill={C.panel} stroke={C.white} strokeWidth={4} />
      <rect x={270} y={50} width={120} height={28} rx={12} fill={C.panelLight} />
      <rect x={296} y={38} width={10} height={24} rx={3} fill={C.panelLight} />
      <rect x={354} y={38} width={10} height={24} rx={3} fill={C.panelLight} />
      <circle cx={296} cy={100} r={13} fill={C.pas} />
      <circle cx={330} cy={100} r={13} fill={C.pas} />
      <circle cx={364} cy={100} r={13} fill={C.pas} />
      <text x={330} y={142} textAnchor="middle" fontSize={16} fontWeight={600} fill={C.white}>
        3 razy
      </text>
      <text x={330} y={200} textAnchor="middle" fontSize={19} fontWeight={700} fill={C.pas}>
        na miesiąc
      </text>
    </svg>
  );
}
