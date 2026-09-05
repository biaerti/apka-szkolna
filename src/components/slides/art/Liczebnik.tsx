// Ilustracja "liczebnik": glowny odpowiada na pytanie ile?, porzadkowy - ktory z kolei?

import { ART_COLORS as C, ART_FONT } from './colors';

export function Liczebnik({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 320"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: liczebnik glowny piec odpowiada na pytanie ile, porzadkowy piaty na pytanie ktory z kolei"
      style={{ fontFamily: ART_FONT }}
    >
      {/* Liczebnik glowny - piec jablek */}
      <text x={240} y={26} textAnchor="middle" fontSize={22} fontWeight={800} fill={C.plus}>
        ile? - liczebnik główny
      </text>
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={104 + i * 68} cy={70} r={22} fill={C.plus} />
      ))}
      <text x={240} y={122} textAnchor="middle" fontSize={26} fontWeight={800} fill={C.white}>
        pięć
      </text>

      <path d="M40 148 H440" stroke={C.panelLight} strokeWidth={2} />

      {/* Liczebnik porzadkowy - kolejka, piaty wyrozniony */}
      <text x={240} y={184} textAnchor="middle" fontSize={22} fontWeight={800} fill={C.pas}>
        który z kolei? - porządkowy
      </text>
      {[1, 2, 3, 4, 5].map((numer) => {
        const piaty = numer === 5;
        return (
          <g key={numer} transform={`translate(${104 + (numer - 1) * 68} 228)`}>
            <circle r={22} fill={piaty ? C.pas : C.panel} stroke={piaty ? C.pas : C.panelLight} strokeWidth={3} />
            <text
              y={8}
              textAnchor="middle"
              fontSize={20}
              fontWeight={800}
              fill={piaty ? C.panel : C.panelLight}
            >
              {numer}
            </text>
          </g>
        );
      })}
      <text x={240} y={286} textAnchor="middle" fontSize={26} fontWeight={800} fill={C.white}>
        piąty
      </text>
      <text x={240} y={312} textAnchor="middle" fontSize={17} fill={C.panelLight}>
        cyfrą z kropką: 5. miejsce = piąte miejsce
      </text>
    </svg>
  );
}
