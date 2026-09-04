// Ilustracja "zadania": kartka z trzema ponumerowanymi zadaniami naprawczymi
// i strzalka pokazujaca, ze oddanie ich usuwa plomby.

import { ART_COLORS as C, ART_FONT } from './colors';

function TaskRow({ y, n }: { y: number; n: number }) {
  return (
    <g>
      <circle cx={44} cy={y} r={14} fill={C.panelLight} />
      <text x={44} y={y + 6} textAnchor="middle" fontSize={16} fontWeight={700} fill={C.white}>
        {n}
      </text>
      <rect x={68} y={y - 6} width={110} height={10} rx={5} fill={C.line} />
    </g>
  );
}

export function Zadania({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 460 300"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: kartka z trzema zadaniami naprawczymi, strzalka pokazuje, ze po ich oddaniu plomby znikaja"
      style={{ fontFamily: ART_FONT }}
    >
      {/* Kartka z zadaniami */}
      <rect x={20} y={26} width={200} height={248} rx={10} fill={C.paper} stroke={C.ink} strokeWidth={5} />
      <text x={120} y={64} textAnchor="middle" fontSize={22} fontWeight={800} fill={C.ink}>
        ZADANIA
      </text>
      <TaskRow y={110} n={1} />
      <TaskRow y={150} n={2} />
      <TaskRow y={190} n={3} />
      <text x={120} y={240} textAnchor="middle" fontSize={15} fill={C.panelLight}>
        z pytań, na które
      </text>
      <text x={120} y={260} textAnchor="middle" fontSize={15} fill={C.panelLight}>
        nie było odpowiedzi
      </text>

      {/* Strzalka */}
      <path d="M240 150 L330 150" stroke={C.white} strokeWidth={6} strokeLinecap="round" />
      <polygon points="330,138 356,150 330,162" fill={C.white} />

      <text x={293} y={124} textAnchor="middle" fontSize={17} fontWeight={700} fill={C.white}>
        oddajesz
      </text>

      {/* Plomby znikaja */}
      <circle cx={400} cy={90} r={22} fill="none" stroke={C.plomba} strokeWidth={4} strokeDasharray="6 6" opacity={0.6} />
      <circle cx={400} cy={90} r={10} fill="none" stroke={C.plomba} strokeWidth={3} strokeDasharray="4 4" opacity={0.4} />
      <text x={400} y={220} textAnchor="middle" fontSize={19} fontWeight={700} fill={C.plomba}>
        plomby
      </text>
      <text x={400} y={244} textAnchor="middle" fontSize={19} fontWeight={700} fill={C.plomba}>
        znikają
      </text>
    </svg>
  );
}
