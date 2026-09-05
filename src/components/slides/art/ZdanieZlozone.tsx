// Ilustracja "zdanieZlozone": ile orzeczen, tyle zdan skladowych.

import { ART_COLORS as C, ART_FONT } from './colors';

export function ZdanieZlozone({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 320"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: zdanie pojedyncze ma jedno orzeczenie, zlozone co najmniej dwa"
      style={{ fontFamily: ART_FONT }}
    >
      {/* Zdanie pojedyncze - jedno orzeczenie */}
      <text x={22} y={26} fontSize={19} fontWeight={800} fill={C.plus}>
        POJEDYNCZE - 1 orzeczenie
      </text>
      <rect x={22} y={40} width={436} height={52} rx={12} fill={C.panel} stroke={C.plus} strokeWidth={3} />
      <text x={42} y={73} fontSize={22} fontWeight={700} fill={C.white}>
        Pies
      </text>
      <rect x={98} y={48} width={104} height={36} rx={8} fill={C.pas} />
      <text x={150} y={74} textAnchor="middle" fontSize={22} fontWeight={800} fill={C.panel}>
        szczeka
      </text>
      <text x={212} y={73} fontSize={22} fontWeight={700} fill={C.white}>
        na podwórku.
      </text>

      {/* Zdanie zlozone - dwa orzeczenia, dwa czlony */}
      <text x={22} y={134} fontSize={19} fontWeight={800} fill={C.kropka}>
        ZŁOŻONE - 2 orzeczenia
      </text>
      <rect x={22} y={148} width={436} height={104} rx={12} fill={C.panel} stroke={C.kropka} strokeWidth={3} />

      <text x={42} y={182} fontSize={22} fontWeight={700} fill={C.white}>
        Pies
      </text>
      <rect x={98} y={157} width={104} height={36} rx={8} fill={C.pas} />
      <text x={150} y={183} textAnchor="middle" fontSize={22} fontWeight={800} fill={C.panel}>
        szczeka
      </text>
      <text x={204} y={182} fontSize={22} fontWeight={700} fill={C.pas}>
        , bo
      </text>

      <text x={42} y={230} fontSize={22} fontWeight={700} fill={C.white}>
        wtedy
      </text>
      <rect x={122} y={205} width={86} height={36} rx={8} fill={C.pas} />
      <text x={165} y={231} textAnchor="middle" fontSize={22} fontWeight={800} fill={C.panel}>
        widzi
      </text>
      <text x={218} y={230} fontSize={22} fontWeight={700} fill={C.white}>
        listonosza.
      </text>

      <text x={240} y={288} textAnchor="middle" fontSize={19} fontWeight={700} fill={C.white}>
        ile orzeczeń, tyle zdań składowych
      </text>
      <text x={240} y={312} textAnchor="middle" fontSize={17} fill={C.panelLight}>
        równoważnik zdania nie ma orzeczenia: „Cisza!”
      </text>
    </svg>
  );
}
