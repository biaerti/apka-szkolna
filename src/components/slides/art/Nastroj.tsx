// Ilustracja "nastroj": ten sam tekst moze byc wesoly, smutny albo straszny -
// nastroj poznajemy po slowach, ktore w nim wystepuja.

import { ART_COLORS as C, ART_FONT } from './colors';

// [nazwa nastroju, slowa z tekstu, kolor, ksztalt ust: 1 = usmiech, -1 = smutek, 0 = prosto]
const NASTROJE: Array<[string, string, string, number]> = [
  ['wesoły', 'śmiech, słońce', C.plus, 1],
  ['smutny', 'deszcz, sam', C.kropka, -1],
  ['straszny', 'ciemno, cisza', C.plomba, 0],
];

export function Nastroj({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 300"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: trzy nastroje utworu - wesoly, smutny i straszny - kazdy z przykladowymi slowami z tekstu"
      style={{ fontFamily: ART_FONT }}
    >
      <text x={240} y={28} textAnchor="middle" fontSize={22} fontWeight={800} fill={C.white}>
        JAKI NASTRÓJ MA TEN TEKST?
      </text>

      {NASTROJE.map(([nazwa, slowa, kolor, usta], i) => (
        <g key={nazwa} transform={`translate(${80 + i * 160} 118)`}>
          <circle cx={0} cy={0} r={44} fill={C.panel} stroke={kolor} strokeWidth={4} />
          <circle cx={-16} cy={-12} r={6} fill={kolor} />
          <circle cx={16} cy={-12} r={6} fill={kolor} />
          {usta === 0 ? (
            <path d="M-18 18 H18" stroke={kolor} strokeWidth={5} strokeLinecap="round" />
          ) : (
            <path
              d={usta > 0 ? 'M-20 10 Q0 30 20 10' : 'M-20 24 Q0 4 20 24'}
              fill="none"
              stroke={kolor}
              strokeWidth={5}
              strokeLinecap="round"
            />
          )}
          <text x={0} y={76} textAnchor="middle" fontSize={21} fontWeight={800} fill={kolor}>
            {nazwa}
          </text>
          <text x={0} y={104} textAnchor="middle" fontSize={16} fill={C.white}>
            {slowa}
          </text>
        </g>
      ))}

      <text x={240} y={278} textAnchor="middle" fontSize={19} fill={C.panelLight}>
        nastrój poznajesz po słowach w tekście
      </text>
    </svg>
  );
}
