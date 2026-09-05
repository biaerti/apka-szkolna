// Ilustracja "skroty": popularne skroty i to, kiedy stawiamy w nich kropke.

import { ART_COLORS as C, ART_FONT } from './colors';

// [skrot, rozwiniecie, czy z kropka]
const SKROTY: Array<[string, string, boolean]> = [
  ['np.', 'na przykład', true],
  ['itd.', 'i tak dalej', true],
  ['ul.', 'ulica', true],
  ['godz.', 'godzina', true],
  ['s.', 'strona', true],
  ['dr', 'doktor', false],
];

export function Skroty({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 330"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: skroty np., itd., ul., godz., s., dr i zasada kropki"
      style={{ fontFamily: ART_FONT }}
    >
      <text x={240} y={24} textAnchor="middle" fontSize={22} fontWeight={800} fill={C.plus}>
        SKRÓTY
      </text>

      {SKROTY.map(([skrot, rozwiniecie, zKropka], i) => (
        <g key={skrot} transform={`translate(0 ${40 + i * 42})`}>
          <rect
            x={16}
            y={0}
            width={112}
            height={34}
            rx={9}
            fill={C.panel}
            stroke={zKropka ? C.plus : C.pas}
            strokeWidth={3}
          />
          <text
            x={72}
            y={24}
            textAnchor="middle"
            fontSize={21}
            fontWeight={800}
            fill={zKropka ? C.plus : C.pas}
          >
            {skrot}
          </text>
          <text x={146} y={24} fontSize={19} fill={C.white}>
            {rozwiniecie}
          </text>
        </g>
      ))}

      <rect x={16} y={296} width={448} height={28} rx={8} fill={C.panel} stroke={C.pas} strokeWidth={2} />
      <text x={240} y={315} textAnchor="middle" fontSize={15} fill={C.pas}>
        bez kropki, gdy skrót kończy się ostatnią literą wyrazu (dr, mgr)
      </text>
    </svg>
  );
}
