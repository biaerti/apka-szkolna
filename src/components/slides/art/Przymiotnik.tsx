// Ilustracja "przymiotnik": okresla, jaki jest ktos albo cos.

import { ART_COLORS as C, ART_FONT } from './colors';

export function Przymiotnik({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 300"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: przymiotnik odpowiada na pytania jaki, jaka, jakie - czerwona, duza, okragla pilka"
      style={{ fontFamily: ART_FONT }}
    >
      <rect x={70} y={10} width={340} height={54} rx={16} fill={C.panel} stroke={C.pas} strokeWidth={4} />
      <text x={240} y={46} textAnchor="middle" fontSize={30} fontWeight={800} fill={C.pas}>
        jaki? jaka? jakie?
      </text>

      {/* Pilka opisywana przymiotnikami */}
      <circle cx={240} cy={168} r={58} fill={C.plomba} stroke={C.plombaDark} strokeWidth={4} />
      <path d="M182 168 H298 M240 110 V226" stroke={C.plombaDark} strokeWidth={4} />

      {/* Wskazniki z przymiotnikami */}
      <g stroke={C.pas} strokeWidth={3} strokeLinecap="round">
        <path d="M186 126 L118 100" />
        <path d="M294 126 L362 100" />
        <path d="M240 226 L240 254" />
      </g>
      <text x={112} y={94} textAnchor="end" fontSize={21} fontWeight={700} fill={C.pas}>
        czerwona
      </text>
      <text x={368} y={94} fontSize={21} fontWeight={700} fill={C.pas}>
        okrągła
      </text>
      <text x={240} y={278} textAnchor="middle" fontSize={21} fontWeight={700} fill={C.pas}>
        duża
      </text>
    </svg>
  );
}
