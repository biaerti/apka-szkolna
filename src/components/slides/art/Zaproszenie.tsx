// Ilustracja "zaproszenie": kartka z polami kogo, na co, kiedy, dokad, kto zaprasza.

import { ART_COLORS as C, ART_FONT } from './colors';

// [pytanie, przykladowa odpowiedz]
const POLA: Array<[string, string]> = [
  ['KOGO?', 'Zosię'],
  ['NA CO?', 'na urodziny'],
  ['KIEDY?', '12 maja, godz. 16'],
  ['DOKĄD?', 'do mnie do domu'],
  ['KTO ZAPRASZA?', 'Antek'],
];

export function Zaproszenie({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 320"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: kartka zaproszenia z polami kogo, na co, kiedy, dokad i kto zaprasza"
      style={{ fontFamily: ART_FONT }}
    >
      <rect x={26} y={10} width={428} height={300} rx={16} fill={C.paper} stroke={C.pas} strokeWidth={5} />

      <text x={240} y={54} textAnchor="middle" fontSize={28} fontWeight={800} fill={C.pasDark}>
        ZAPROSZENIE
      </text>
      <path d="M150 66 H330" stroke={C.pas} strokeWidth={3} strokeLinecap="round" />

      {POLA.map(([pytanie, przyklad], i) => (
        <g key={pytanie} transform={`translate(0 ${96 + i * 42})`}>
          <circle cx={62} cy={-6} r={7} fill={C.pas} />
          <text x={82} y={0} fontSize={17} fontWeight={800} fill={C.ink}>
            {pytanie}
          </text>
          <text x={246} y={0} fontSize={17} fill={C.muted}>
            {przyklad}
          </text>
        </g>
      ))}
    </svg>
  );
}
