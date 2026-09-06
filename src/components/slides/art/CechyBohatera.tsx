// Ilustracja "cechyBohatera": postac otoczona przymiotnikami, a pod spodem
// ramka "bo w tekscie..." - ocena bohatera musi miec uzasadnienie z tekstu.

import { ART_COLORS as C, ART_FONT } from './colors';

// [przymiotnik, x konca linii, y konca linii, wyrownanie tekstu]
const CECHY: Array<[string, number, number, 'start' | 'end']> = [
  ['odważny', 116, 62, 'end'],
  ['uparty', 364, 62, 'start'],
  ['pomocny', 116, 148, 'end'],
  ['ciekawski', 364, 148, 'start'],
];

export function CechyBohatera({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 320"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: postac bohatera z przymiotnikami opisujacymi jego cechy i ramka z uzasadnieniem z tekstu"
      style={{ fontFamily: ART_FONT }}
    >
      {/* Bohater */}
      <g transform="translate(240 96)">
        <circle cx={0} cy={-14} r={30} fill={C.kropka} />
        <path d="M-38 62 A38 46 0 0 1 38 62 Z" fill={C.kropka} />
      </g>

      {/* Wskazniki z cechami */}
      <g stroke={C.pas} strokeWidth={3} strokeLinecap="round">
        <path d="M204 70 L124 60" />
        <path d="M276 70 L356 60" />
        <path d="M204 130 L124 146" />
        <path d="M276 130 L356 146" />
      </g>
      {CECHY.map(([slowo, x, y, anchor]) => (
        <text key={slowo} x={x} y={y + 6} textAnchor={anchor === 'end' ? 'end' : 'start'} fontSize={20} fontWeight={700} fill={C.pas}>
          {slowo}
        </text>
      ))}

      <text x={240} y={196} textAnchor="middle" fontSize={20} fontWeight={800} fill={C.white}>
        jaki jest bohater?
      </text>

      {/* Uzasadnienie */}
      <rect x={40} y={216} width={400} height={78} rx={14} fill={C.panel} stroke={C.plus} strokeWidth={4} />
      <text x={240} y={248} textAnchor="middle" fontSize={20} fontWeight={800} fill={C.plus}>
        bo w tekście...
      </text>
      <text x={240} y={278} textAnchor="middle" fontSize={17} fill={C.white}>
        każdą cechę pokazuje jakieś zdarzenie
      </text>
    </svg>
  );
}
