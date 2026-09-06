// Ilustracja "przeproszenie": trzy czesci, ktore musi miec przeprosiny -
// za co konkretnie, przykro mi, co zrobie inaczej.

import { ART_COLORS as C, ART_FONT } from './colors';

// [numer, czego dotyczy czesc, przyklad]
const CZESCI: Array<[string, string]> = [
  ['za co konkretnie', '"Przepraszam, że zniszczyłem Twój rysunek."'],
  ['że jest mi przykro', '"Jest mi bardzo głupio."'],
  ['co zrobię inaczej', '"Narysuję Ci nowy."'],
];

export function Przeproszenie({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 300"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: przeprosiny maja trzy czesci - za co konkretnie, ze jest mi przykro i co zrobie inaczej"
      style={{ fontFamily: ART_FONT }}
    >
      <text x={240} y={26} textAnchor="middle" fontSize={23} fontWeight={800} fill={C.pas}>
        PRZEPROSZENIE
      </text>

      {CZESCI.map(([czego, przyklad], i) => (
        <g key={czego} transform={`translate(0 ${44 + i * 78})`}>
          <rect x={22} y={0} width={436} height={64} rx={12} fill={C.panel} stroke={C.pas} strokeWidth={3} />
          <circle cx={60} cy={32} r={19} fill={C.pas} />
          <text x={60} y={40} textAnchor="middle" fontSize={21} fontWeight={800} fill={C.panel}>
            {i + 1}
          </text>
          <text x={94} y={27} fontSize={19} fontWeight={800} fill={C.pas}>
            {czego}
          </text>
          <text x={94} y={50} fontSize={15} fill={C.white}>
            {przyklad}
          </text>
        </g>
      ))}

      <text x={240} y={294} textAnchor="middle" fontSize={18} fill={C.panelLight}>
        samo "przepraszam" to za mało
      </text>
    </svg>
  );
}
