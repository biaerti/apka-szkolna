// Ilustracja "wieloznaczne": jeden wyraz - trzy znaczenia (zamek).

import { ART_COLORS as C, ART_FONT } from './colors';

const ZNACZENIA: Array<[string, string]> = [
  ['budowla', 'Zamek w Malborku'],
  ['w kurtce', 'Zepsuł mi się zamek'],
  ['w drzwiach', 'Przekręć zamek'],
];

export function Wieloznaczne({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 320"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: wyraz wieloznaczny zamek i jego trzy znaczenia"
      style={{ fontFamily: ART_FONT }}
    >
      <text x={240} y={24} textAnchor="middle" fontSize={21} fontWeight={800} fill={C.plus}>
        WYRAZ WIELOZNACZNY
      </text>

      <rect x={160} y={40} width={160} height={56} rx={12} fill={C.panel} stroke={C.pas} strokeWidth={4} />
      <text x={240} y={78} textAnchor="middle" fontSize={32} fontWeight={800} fill={C.pas}>
        zamek
      </text>

      {ZNACZENIA.map(([co, przyklad], i) => (
        <g key={co} transform={`translate(0 ${118 + i * 66})`}>
          <line x1={240} y1={-16} x2={240} y2={0} stroke={C.panelLight} strokeWidth={2} />
          <rect x={26} y={0} width={428} height={54} rx={10} fill={C.panel} stroke={C.kropka} strokeWidth={2} />
          <text x={46} y={23} fontSize={18} fontWeight={700} fill={C.kropka}>
            {co}
          </text>
          <text x={46} y={44} fontSize={17} fill={C.white}>
            {przyklad}
          </text>
        </g>
      ))}
    </svg>
  );
}
