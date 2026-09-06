// Ilustracja "bohaterowie": bohater glowny jest w kazdej scenie, drugoplanowy
// tylko w niektorych - pokazane paskiem czterech scen pod postaciami.

import { ART_COLORS as C, ART_FONT } from './colors';

/** Prosta postac: glowa i tulow. */
function Postac({ x, y, r, kolor }: { x: number; y: number; r: number; kolor: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle cx={0} cy={0} r={r} fill={kolor} />
      <path d={`M${-r * 1.3} ${r * 2.9} A${r * 1.3} ${r * 1.8} 0 0 1 ${r * 1.3} ${r * 2.9} Z`} fill={kolor} />
    </g>
  );
}

// [numer sceny, czy jest w niej bohater drugoplanowy]
const SCENY: Array<[number, boolean]> = [
  [1, false],
  [2, true],
  [3, false],
  [4, true],
];

export function Bohaterowie({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 320"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: bohater glowny wystepuje w kazdej scenie, drugoplanowy tylko w niektorych"
      style={{ fontFamily: ART_FONT }}
    >
      <Postac x={130} y={54} r={30} kolor={C.plus} />
      <text x={130} y={176} textAnchor="middle" fontSize={21} fontWeight={800} fill={C.plus}>
        GŁÓWNY
      </text>
      <text x={130} y={200} textAnchor="middle" fontSize={17} fill={C.white}>
        przez cały czas
      </text>

      <Postac x={350} y={78} r={19} kolor={C.pas} />
      <text x={350} y={176} textAnchor="middle" fontSize={21} fontWeight={800} fill={C.pas}>
        DRUGOPLANOWY
      </text>
      <text x={350} y={200} textAnchor="middle" fontSize={17} fill={C.white}>
        tylko czasem
      </text>

      {/* Pasek scen: w kazdej jest glowny, drugoplanowy tylko w dwoch */}
      {SCENY.map(([nr, zDrugoplanowym], i) => (
        <g key={nr} transform={`translate(${34 + i * 110} 250)`}>
          <rect width={96} height={58} rx={10} fill={C.panel} stroke={C.panelLight} strokeWidth={2} />
          <circle cx={34} cy={29} r={11} fill={C.plus} />
          {zDrugoplanowym && <circle cx={64} cy={29} r={7} fill={C.pas} />}
          <text x={48} y={-8} textAnchor="middle" fontSize={15} fill={C.panelLight}>
            scena {nr}
          </text>
        </g>
      ))}
    </svg>
  );
}
