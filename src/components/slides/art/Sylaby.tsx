// Ilustracja "sylaby": wyraz te-le-fon rozbity na sylaby, w kazdej jedna samogloska.

import { ART_COLORS as C, ART_FONT } from './colors';

// [sylaba, indeks samogloski w sylabie]
const SYLABY: Array<[string, number]> = [
  ['te', 1],
  ['le', 1],
  ['fon', 1],
];

export function Sylaby({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 300"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: wyraz telefon podzielony na trzy sylaby te-le-fon, w kazdej jedna samogloska"
      style={{ fontFamily: ART_FONT }}
    >
      <text x={240} y={30} textAnchor="middle" fontSize={24} fontWeight={700} fill={C.white}>
        telefon
      </text>

      {SYLABY.map(([sylaba, samogloskaIdx], i) => (
        <g key={sylaba} transform={`translate(${34 + i * 142} 50)`}>
          <rect width={126} height={86} rx={14} fill={C.panel} stroke={C.kropka} strokeWidth={3} />
          <text x={63} y={58} textAnchor="middle" fontSize={38} fontWeight={800} fill={C.white}>
            {sylaba.split('').map((ch, j) => (
              <tspan key={j} fill={j === samogloskaIdx ? C.plus : C.white}>
                {ch}
              </tspan>
            ))}
          </text>
          {/* Klasniecie przy kazdej sylabie */}
          <circle cx={63} cy={120} r={17} fill={C.panel} stroke={C.kropka} strokeWidth={3} />
          <text x={63} y={127} textAnchor="middle" fontSize={18} fontWeight={800} fill={C.kropka}>
            {i + 1}
          </text>
        </g>
      ))}

      <text x={240} y={206} textAnchor="middle" fontSize={21} fill={C.white}>
        3 sylaby = 3 klaśnięcia
      </text>
      <text x={240} y={244} textAnchor="middle" fontSize={21} fontWeight={700} fill={C.plus}>
        każda sylaba ma samogłoskę
      </text>
      <text x={240} y={278} textAnchor="middle" fontSize={18} fill={C.panelLight}>
        ma-ma (2), bi-blio-te-ka (4)
      </text>
    </svg>
  );
}
