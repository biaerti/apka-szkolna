// Ilustracja "nieodmienne": przyslowek, przyimek i spojnik - trzy wyrazy bez odmiany.

import { ART_COLORS as C, ART_FONT } from './colors';

// [nazwa, pytania albo rola, przyklady, kolor]
const CZESCI: Array<[string, string, string, string]> = [
  ['PRZYSŁÓWEK', 'jak? gdzie? kiedy?', 'szybko, tutaj, wczoraj', C.plus],
  ['PRZYIMEK', 'wskazuje miejsce i czas', 'w, na, pod, nad, do', C.kropka],
  ['SPÓJNIK', 'łączy wyrazy i zdania', 'i, a, ale, że, bo, więc', C.pas],
];

export function Nieodmienne({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 336"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: trzy nieodmienne czesci mowy - przyslowek, przyimek i spojnik"
      style={{ fontFamily: ART_FONT }}
    >
      <text x={240} y={24} textAnchor="middle" fontSize={21} fontWeight={800} fill={C.white}>
        NIE ODMIENIAJĄ SIĘ
      </text>

      {CZESCI.map(([nazwa, rola, przyklady, kolor], i) => (
        <g key={nazwa} transform={`translate(0 ${40 + i * 88})`}>
          <rect x={20} y={0} width={440} height={74} rx={14} fill={C.panel} stroke={kolor} strokeWidth={3} />
          <text x={40} y={30} fontSize={21} fontWeight={800} fill={kolor}>
            {nazwa}
          </text>
          <text x={40} y={56} fontSize={17} fill={C.white}>
            {rola}
          </text>
          <text x={444} y={44} textAnchor="end" fontSize={17} fontWeight={700} fill={C.panelLight}>
            {przyklady}
          </text>
        </g>
      ))}

      <text x={240} y={326} textAnchor="middle" fontSize={17} fill={C.panelLight}>
        przysłówek tworzymy od przymiotnika: wesoły - wesoło
      </text>
    </svg>
  );
}
