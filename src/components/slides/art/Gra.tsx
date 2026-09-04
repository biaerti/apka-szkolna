// Ilustracja "gra": kostka, pionki i kartka z zasadami.
// Sens: w kazdej grze sa zasady, mozna wygrac, mozna przegrac.

import { ART_COLORS as C, ART_FONT } from './colors';

export function Gra({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 420 300"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: gra ma zasady, kartka z zasadami, kostka do gry i dwa pionki"
      style={{ fontFamily: ART_FONT }}
    >
      {/* Kartka z zasadami */}
      <rect x={20} y={26} width={150} height={230} rx={10} fill={C.paper} stroke={C.ink} strokeWidth={5} />
      <rect x={20} y={26} width={150} height={44} rx={10} fill={C.panelLight} />
      <rect x={20} y={52} width={150} height={18} fill={C.panelLight} />
      <text x={95} y={55} textAnchor="middle" fontSize={22} fontWeight={700} fill={C.white}>
        ZASADY
      </text>
      <rect x={38} y={92} width={114} height={10} rx={5} fill={C.line} />
      <rect x={38} y={116} width={94} height={10} rx={5} fill={C.line} />
      <rect x={38} y={140} width={104} height={10} rx={5} fill={C.line} />
      <rect x={38} y={164} width={80} height={10} rx={5} fill={C.line} />
      <text x={95} y={220} textAnchor="middle" fontSize={19} fontWeight={700} fill={C.ink}>
        BEZ ZASAD
      </text>
      <text x={95} y={244} textAnchor="middle" fontSize={19} fontWeight={700} fill={C.ink}>
        NIE MA GRY
      </text>

      {/* Kostka do gry, lekko obrocona */}
      <g transform="rotate(-9 262 132)">
        <rect x={206} y={76} width={112} height={112} rx={20} fill={C.paper} stroke={C.ink} strokeWidth={6} />
        <circle cx={230} cy={100} r={9} fill={C.ink} />
        <circle cx={294} cy={100} r={9} fill={C.ink} />
        <circle cx={262} cy={132} r={9} fill={C.ink} />
        <circle cx={230} cy={164} r={9} fill={C.ink} />
        <circle cx={294} cy={164} r={9} fill={C.ink} />
      </g>

      {/* Torek/sciezka i pionki */}
      <rect x={230} y={222} width={38} height={22} rx={4} fill={C.panelLight} stroke={C.white} strokeWidth={2} />
      <rect x={272} y={222} width={38} height={22} rx={4} fill={C.panelLight} stroke={C.white} strokeWidth={2} />
      <rect x={314} y={222} width={38} height={22} rx={4} fill={C.panelLight} stroke={C.white} strokeWidth={2} />
      <rect x={356} y={222} width={38} height={22} rx={4} fill={C.panelLight} stroke={C.white} strokeWidth={2} />

      <g>
        <path d="M239 218 L259 218 L253 196 Q249 186 249 196 Z" fill={C.plus} stroke={C.ink} strokeWidth={3} />
        <circle cx={249} cy={188} r={11} fill={C.plus} stroke={C.ink} strokeWidth={3} />
      </g>
      <g>
        <path d="M331 218 L351 218 L345 196 Q341 186 341 196 Z" fill={C.kropka} stroke={C.ink} strokeWidth={3} />
        <circle cx={341} cy={188} r={11} fill={C.kropka} stroke={C.ink} strokeWidth={3} />
      </g>

      {/* Wygrana / przegrana */}
      <text x={95} y={288} textAnchor="middle" fontSize={24} fontWeight={700} fill={C.plus}>
        można wygrać
      </text>
      <text x={330} y={288} textAnchor="middle" fontSize={24} fontWeight={700} fill={C.plomba}>
        można przegrać
      </text>
    </svg>
  );
}
