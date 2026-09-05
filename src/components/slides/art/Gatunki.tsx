// Ilustracja "gatunki": basn, legenda, mit i bajka - po czym je poznac.

import { ART_COLORS as C, ART_FONT } from './colors';

// [gatunek, po czym poznac, przyklad, kolor]
const GATUNKI: Array<[string, string, string, string]> = [
  ['BAŚŃ', 'magia, zmyślona', '"Kopciuszek"', C.plus],
  ['LEGENDA', 'tłumaczy prawdziwe miejsce', '"O smoku wawelskim"', C.kropka],
  ['MIT', 'wyjaśnia świat, bogowie', '"O Prometeuszu"', C.pas],
  ['BAJKA', 'zwierzęta i morał', '"Lis i kozioł"', C.plomba],
];

export function Gatunki({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 330"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: basn, legenda, mit i bajka - cechy i przyklady"
      style={{ fontFamily: ART_FONT }}
    >
      <text x={240} y={24} textAnchor="middle" fontSize={21} fontWeight={800} fill={C.white}>
        GATUNKI
      </text>

      {GATUNKI.map(([nazwa, cecha, przyklad, kolor], i) => (
        <g key={nazwa} transform={`translate(16 ${40 + i * 70})`}>
          <rect width={448} height={60} rx={12} fill={C.panel} stroke={kolor} strokeWidth={3} />
          <text x={20} y={27} fontSize={20} fontWeight={800} fill={kolor}>
            {nazwa}
          </text>
          <text x={20} y={49} fontSize={16} fill={C.white}>
            {cecha}
          </text>
          <text x={432} y={40} textAnchor="end" fontSize={16} fontStyle="italic" fill={C.line}>
            {przyklad}
          </text>
        </g>
      ))}
    </svg>
  );
}
