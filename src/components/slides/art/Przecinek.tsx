// Ilustracja "przecinek": przecinek zawsze przed spojnikami ze, ale, bo.

import { ART_COLORS as C, ART_FONT } from './colors';

const SPOJNIKI = ['że', 'ale', 'bo'];

export function Przecinek({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 300"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: przecinek stawiamy zawsze przed spojnikami ze, ale i bo"
      style={{ fontFamily: ART_FONT }}
    >
      <text x={240} y={32} textAnchor="middle" fontSize={23} fontWeight={800} fill={C.white}>
        PRZECINEK PRZED
      </text>

      {SPOJNIKI.map((spojnik, i) => (
        <g key={spojnik} transform={`translate(${28 + i * 150} 52)`}>
          {/* Duzy przecinek przed spojnikiem */}
          <text x={20} y={62} fontSize={72} fontWeight={800} fill={C.pas}>
            ,
          </text>
          <rect x={44} y={8} width={80} height={66} rx={14} fill={C.panel} stroke={C.pas} strokeWidth={3} />
          <text x={84} y={54} textAnchor="middle" fontSize={30} fontWeight={800} fill={C.pas}>
            {spojnik}
          </text>
        </g>
      ))}

      {/* Przyklad zdania */}
      <rect x={26} y={172} width={428} height={62} rx={14} fill={C.panel} stroke={C.panelLight} strokeWidth={2} />
      <text x={46} y={212} fontSize={26} fontWeight={700} fill={C.white}>
        Wiem
      </text>
      <text x={116} y={220} fontSize={42} fontWeight={800} fill={C.pas}>
        ,
      </text>
      <text x={136} y={212} fontSize={26} fontWeight={700} fill={C.pas}>
        że
      </text>
      <text x={178} y={212} fontSize={26} fontWeight={700} fill={C.white}>
        przyjdziesz.
      </text>

      <text x={240} y={274} textAnchor="middle" fontSize={18} fill={C.panelLight}>
        Chciałem wyjść, ale padał deszcz.
      </text>
    </svg>
  );
}
