// Ilustracja "alfabet": 32 litery alfabetu polskiego i porzadek alfabetyczny.

import { ART_COLORS as C, ART_FONT } from './colors';

const ALFABET = 'aąbcćdeęfghijklłmnńoóprsśtuwyzźż'.split('');
const POLSKIE = new Set(['ą', 'ć', 'ę', 'ł', 'ń', 'ó', 'ś', 'ź', 'ż']);

export function Alfabet({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 330"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: 32 litery alfabetu polskiego i porzadek alfabetyczny wyrazow"
      style={{ fontFamily: ART_FONT }}
    >
      <text x={240} y={24} textAnchor="middle" fontSize={24} fontWeight={800} fill={C.plus}>
        ALFABET - 32 LITERY
      </text>

      {ALFABET.map((litera, i) => {
        const polska = POLSKIE.has(litera);
        return (
          <g key={litera} transform={`translate(${28 + (i % 8) * 54} ${40 + Math.floor(i / 8) * 48})`}>
            <rect
              width={46}
              height={40}
              rx={8}
              fill={C.panel}
              stroke={polska ? C.pas : C.panelLight}
              strokeWidth={polska ? 3 : 2}
            />
            <text
              x={23}
              y={29}
              textAnchor="middle"
              fontSize={23}
              fontWeight={800}
              fill={polska ? C.pas : C.white}
            >
              {litera}
            </text>
          </g>
        );
      })}

      <text x={240} y={256} textAnchor="middle" fontSize={17} fill={C.pas}>
        na żółto: 9 liter tylko polskich
      </text>

      <text x={240} y={286} textAnchor="middle" fontSize={19} fontWeight={700} fill={C.white}>
        porządek alfabetyczny
      </text>
      {['dom', 'domek', 'dworzec', 'dziura'].map((w, i) => (
        <g key={w} transform={`translate(${18 + i * 118} 298)`}>
          <rect width={100} height={30} rx={8} fill={C.panel} stroke={C.kropka} strokeWidth={2} />
          <text x={50} y={21} textAnchor="middle" fontSize={17} fill={C.kropka}>
            {w}
          </text>
        </g>
      ))}
    </svg>
  );
}
