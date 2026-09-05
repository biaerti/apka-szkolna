// Ilustracja "stopniowanie": trzy stopnie przymiotnika jako rosnace slupki
// plus trzy sposoby stopniowania.

import { ART_COLORS as C, ART_FONT } from './colors';

// [nazwa stopnia, forma, wysokosc slupka]
const STOPNIE: Array<[string, string, number]> = [
  ['równy', 'miły', 50],
  ['wyższy', 'milszy', 82],
  ['najwyższy', 'najmilszy', 114],
];

// [sposob, przyklad]
const SPOSOBY: Array<[string, string]> = [
  ['regularnie', 'miły - milszy - najmilszy'],
  ['opisowo', 'bardziej - najbardziej kolorowy'],
  ['nieregularnie', 'dobry - lepszy - najlepszy'],
];

export function Stopniowanie({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 330"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: trzy stopnie przymiotnika mily, milszy, najmilszy i trzy sposoby stopniowania"
      style={{ fontFamily: ART_FONT }}
    >
      {/* Rosnace slupki - stopien rowny, wyzszy, najwyzszy */}
      {STOPNIE.map(([nazwa, forma, wysokosc], i) => (
        <g key={nazwa} transform={`translate(${44 + i * 140} 0)`}>
          <rect x={0} y={154 - wysokosc} width={112} height={wysokosc} rx={10} fill={C.plus} />
          <text x={56} y={154 - wysokosc - 12} textAnchor="middle" fontSize={20} fontWeight={800} fill={C.plus}>
            {forma}
          </text>
          <text x={56} y={178} textAnchor="middle" fontSize={16} fill={C.white}>
            stopień
          </text>
          <text x={56} y={198} textAnchor="middle" fontSize={17} fontWeight={700} fill={C.white}>
            {nazwa}
          </text>
        </g>
      ))}

      {/* Trzy sposoby stopniowania */}
      {SPOSOBY.map(([sposob, przyklad], i) => (
        <g key={sposob} transform={`translate(0 ${232 + i * 34})`}>
          <circle cx={30} cy={-5} r={6} fill={C.kropka} />
          <text x={48} y={0} fontSize={17} fontWeight={700} fill={C.kropka}>
            {sposob}
          </text>
          <text x={172} y={0} fontSize={16} fill={C.white}>
            {przyklad}
          </text>
        </g>
      ))}
    </svg>
  );
}
