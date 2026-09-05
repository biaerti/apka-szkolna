// Ilustracja "narrator": kto mowi w wierszu, a kto w opowiadaniu.

import { ART_COLORS as C, ART_FONT } from './colors';

function Postac({ kolor }: { kolor: string }) {
  return (
    <g>
      <circle cx={0} cy={0} r={16} fill={kolor} />
      <path d="M-22 42 A22 28 0 0 1 22 42 Z" fill={kolor} />
    </g>
  );
}

export function Narrator({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 320"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: w wierszu mowi podmiot liryczny, w opowiadaniu narrator pierwszo- lub trzecioosobowy"
      style={{ fontFamily: ART_FONT }}
    >
      {/* Wiersz - podmiot liryczny */}
      <rect x={18} y={14} width={210} height={148} rx={14} fill={C.panel} stroke={C.kropka} strokeWidth={3} />
      <text x={123} y={42} textAnchor="middle" fontSize={18} fontWeight={800} fill={C.kropka}>
        WIERSZ
      </text>
      <g transform="translate(123 82)">
        <Postac kolor={C.kropka} />
      </g>
      <text x={123} y={148} textAnchor="middle" fontSize={17} fontWeight={700} fill={C.white}>
        podmiot liryczny
      </text>

      {/* Opowiadanie - narrator */}
      <rect x={252} y={14} width={210} height={148} rx={14} fill={C.panel} stroke={C.plus} strokeWidth={3} />
      <text x={357} y={42} textAnchor="middle" fontSize={18} fontWeight={800} fill={C.plus}>
        OPOWIADANIE
      </text>
      <g transform="translate(357 82)">
        <Postac kolor={C.plus} />
      </g>
      <text x={357} y={148} textAnchor="middle" fontSize={17} fontWeight={700} fill={C.white}>
        narrator
      </text>

      {/* Dwa rodzaje narracji */}
      <rect x={18} y={180} width={444} height={62} rx={12} fill={C.panel} stroke={C.panelLight} strokeWidth={2} />
      <text x={38} y={208} fontSize={18} fontWeight={800} fill={C.pas}>
        1. osoba
      </text>
      <text x={140} y={208} fontSize={17} fill={C.white}>
        „Poszedłem do lasu” - narrator jest
      </text>
      <text x={140} y={230} fontSize={17} fill={C.white}>
        bohaterem, sam brał udział
      </text>

      <rect x={18} y={252} width={444} height={62} rx={12} fill={C.panel} stroke={C.panelLight} strokeWidth={2} />
      <text x={38} y={280} fontSize={18} fontWeight={800} fill={C.pas}>
        3. osoba
      </text>
      <text x={140} y={280} fontSize={17} fill={C.white}>
        „Poszedł do lasu” - narrator
      </text>
      <text x={140} y={302} fontSize={17} fill={C.white}>
        opowiada z zewnątrz
      </text>
    </svg>
  );
}
