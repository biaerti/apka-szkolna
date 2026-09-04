// Ilustracja "oceny": trzy znaki z kola fortuny - plus, kropka, plomba.

import { ART_COLORS as C, ART_FONT } from './colors';

export function Oceny({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 270"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: trzy oceny odpowiedzi - zielony plus, niebieska kropka, czerwona plomba"
      style={{ fontFamily: ART_FONT }}
    >
      {/* Plus */}
      <g>
        <rect x={40} y={30} width={140} height={140} rx={20} fill={C.panel} stroke={C.plus} strokeWidth={4} />
        <rect x={95} y={55} width={30} height={90} rx={8} fill={C.plus} />
        <rect x={65} y={85} width={90} height={30} rx={8} fill={C.plus} />
        <text x={110} y={200} textAnchor="middle" fontSize={28} fontWeight={800} fill={C.plus}>
          PLUS
        </text>
        <text x={110} y={230} textAnchor="middle" fontSize={17} fill={C.white}>
          bardzo dobra
        </text>
        <text x={110} y={252} textAnchor="middle" fontSize={17} fill={C.white}>
          odpowiedź
        </text>
      </g>

      {/* Kropka */}
      <g>
        <rect x={170} y={30} width={140} height={140} rx={20} fill={C.panel} stroke={C.kropka} strokeWidth={4} />
        <circle cx={240} cy={100} r={38} fill={C.kropka} />
        <text x={240} y={200} textAnchor="middle" fontSize={28} fontWeight={800} fill={C.kropka}>
          KROPKA
        </text>
        <text x={240} y={230} textAnchor="middle" fontSize={17} fill={C.white}>
          odpowiedź
        </text>
        <text x={240} y={252} textAnchor="middle" fontSize={17} fill={C.white}>
          częściowa
        </text>
      </g>

      {/* Plomba */}
      <g>
        <rect x={300} y={30} width={140} height={140} rx={20} fill={C.panel} stroke={C.plomba} strokeWidth={4} />
        <circle cx={370} cy={100} r={38} fill={C.plomba} />
        <path
          d="M352 82 L388 118 M388 82 L352 118"
          stroke={C.plombaDark}
          strokeWidth={7}
          strokeLinecap="round"
        />
        <text x={370} y={200} textAnchor="middle" fontSize={28} fontWeight={800} fill={C.plomba}>
          PLOMBA
        </text>
        <text x={370} y={230} textAnchor="middle" fontSize={17} fill={C.white}>
          zła odpowiedź
        </text>
        <text x={370} y={252} textAnchor="middle" fontSize={17} fill={C.white}>
          albo jej brak
        </text>
      </g>
    </svg>
  );
}
