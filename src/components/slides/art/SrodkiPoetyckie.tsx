// Ilustracja "srodkiPoetyckie": epitet, porownanie, przenosnia i wyraz dzwiekonasladowczy.

import { ART_COLORS as C, ART_FONT } from './colors';

// [nazwa, jak poznac, przyklad, kolor]
const SRODKI: Array<[string, string, string, string]> = [
  ['EPITET', 'określa rzeczownik', 'zielona łąka', C.plus],
  ['PORÓWNANIE', 'jak, niby, niczym', 'silny jak tur', C.kropka],
  ['PRZENOŚNIA', 'znaczenie nie wprost', 'złote serce', C.pas],
  ['DŹWIĘKONAŚLADOWCZY', 'naśladuje dźwięk', 'bzyk, plum, tik-tak', C.plomba],
];

export function SrodkiPoetyckie({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 330"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: epitet, porownanie, przenosnia i wyraz dzwiekonasladowczy z przykladami"
      style={{ fontFamily: ART_FONT }}
    >
      {SRODKI.map(([nazwa, jakPoznac, przyklad, kolor], i) => (
        <g key={nazwa} transform={`translate(0 ${12 + i * 80})`}>
          <rect x={20} y={0} width={440} height={66} rx={14} fill={C.panel} stroke={kolor} strokeWidth={3} />
          {/* Najdluzsza nazwa ("dźwiękonaśladowczy") wchodzilaby na przyklad po prawej. */}
          <text x={40} y={28} fontSize={nazwa.length > 14 ? 15 : 18} fontWeight={800} fill={kolor}>
            {nazwa}
          </text>
          <text x={40} y={52} fontSize={16} fill={C.panelLight}>
            {jakPoznac}
          </text>
          <text x={444} y={42} textAnchor="end" fontSize={19} fontWeight={700} fill={C.white}>
            {przyklad}
          </text>
        </g>
      ))}
    </svg>
  );
}
