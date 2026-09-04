// Ilustracja "dwuznak": wyraz szafa - piec liter, cztery gloski.

import { ART_COLORS as C, ART_FONT } from './colors';

const LITERY = ['s', 'z', 'a', 'f', 'a'];

export function Dwuznak({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 300"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: wyraz szafa ma piec liter i cztery gloski, bo sz to jeden dwuznak"
      style={{ fontFamily: ART_FONT }}
    >
      {/* Klamra spinajaca dwuznak sz */}
      <text x={96} y={22} textAnchor="middle" fontSize={19} fontWeight={800} fill={C.kropka}>
        1 głoska
      </text>
      <path
        d="M40 52 L40 36 L152 36 L152 52 M96 36 L96 28"
        fill="none"
        stroke={C.kropka}
        strokeWidth={3}
        strokeLinecap="round"
      />

      {LITERY.map((litera, i) => {
        const dwuznak = i < 2;
        return (
          <g key={i} transform={`translate(${40 + i * 84} 58)`}>
            <rect
              width={72}
              height={78}
              rx={12}
              fill={C.panel}
              stroke={dwuznak ? C.kropka : C.panelLight}
              strokeWidth={3}
            />
            <text
              x={36}
              y={56}
              textAnchor="middle"
              fontSize={40}
              fontWeight={800}
              fill={dwuznak ? C.kropka : C.white}
            >
              {litera}
            </text>
          </g>
        );
      })}

      <text x={240} y={182} textAnchor="middle" fontSize={26} fontWeight={800} fill={C.white}>
        szafa
      </text>
      <text x={150} y={224} textAnchor="middle" fontSize={22} fill={C.white}>
        5 liter
      </text>
      <text x={330} y={224} textAnchor="middle" fontSize={22} fontWeight={800} fill={C.kropka}>
        4 głoski
      </text>

      <text x={240} y={266} textAnchor="middle" fontSize={19} fill={C.panelLight}>
        dwuznaki: sz, cz, rz, ch, dz, dż, dź
      </text>
      <text x={240} y={292} textAnchor="middle" fontSize={18} fill={C.panelLight}>
        dwie litery, jedna głoska
      </text>
    </svg>
  );
}
