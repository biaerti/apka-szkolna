// Ilustracja wynikow kola: plus albo neutralna kropka.

import { ART_COLORS as C, ART_FONT } from './colors';

export function Oceny({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 270"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: dwa wyniki odpowiedzi - zielony plus albo niebieska, neutralna kropka"
      style={{ fontFamily: ART_FONT }}
    >
      {/* Plus */}
      <g>
        <rect x={65} y={30} width={150} height={140} rx={20} fill={C.panel} stroke={C.plus} strokeWidth={4} />
        <rect x={125} y={55} width={30} height={90} rx={8} fill={C.plus} />
        <rect x={95} y={85} width={90} height={30} rx={8} fill={C.plus} />
        <text x={140} y={200} textAnchor="middle" fontSize={28} fontWeight={800} fill={C.plus}>
          PLUS
        </text>
        <text x={140} y={230} textAnchor="middle" fontSize={17} fill={C.white}>
          bardzo dobra
        </text>
        <text x={140} y={252} textAnchor="middle" fontSize={17} fill={C.white}>
          odpowiedź
        </text>
      </g>

      {/* Kropka */}
      <g>
        <rect x={265} y={30} width={150} height={140} rx={20} fill={C.panel} stroke={C.kropka} strokeWidth={4} />
        <circle cx={340} cy={100} r={38} fill={C.kropka} />
        <text x={340} y={200} textAnchor="middle" fontSize={28} fontWeight={800} fill={C.kropka}>
          KROPKA
        </text>
        <text x={340} y={230} textAnchor="middle" fontSize={17} fill={C.white}>
          bez plusa
        </text>
        <text x={340} y={252} textAnchor="middle" fontSize={17} fill={C.white}>
          bez kary
        </text>
      </g>

    </svg>
  );
}
