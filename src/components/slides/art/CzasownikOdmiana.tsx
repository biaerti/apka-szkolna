// Ilustracja "czasownikOdmiana": czasownik pisac w osobach, liczbach i czasach.

import { ART_COLORS as C, ART_FONT } from './colors';

const OSOBY: Array<[string, string]> = [
  ['ja', 'piszę'],
  ['ty', 'piszesz'],
  ['on, ona', 'pisze'],
  ['my', 'piszemy'],
  ['wy', 'piszecie'],
  ['oni, one', 'piszą'],
];

const CZASY: Array<[string, string, string]> = [
  ['przeszły', 'pisałem', C.pas],
  ['teraźniejszy', 'piszę', C.plus],
  ['przyszły', 'będę pisać', C.kropka],
];

export function CzasownikOdmiana({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 340"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: odmiana czasownika pisac przez osoby oraz trzy czasy"
      style={{ fontFamily: ART_FONT }}
    >
      <text x={240} y={24} textAnchor="middle" fontSize={22} fontWeight={800} fill={C.plus}>
        pisać - bezokolicznik
      </text>

      {/* Odmiana przez osoby, dwie kolumny: liczba pojedyncza i mnoga */}
      {OSOBY.map(([zaimek, forma], i) => {
        const kolumna = i < 3 ? 0 : 1;
        const wiersz = i % 3;
        return (
          <g key={zaimek} transform={`translate(${20 + kolumna * 236} ${44 + wiersz * 46})`}>
            <rect width={220} height={38} rx={9} fill={C.panel} stroke={C.panelLight} strokeWidth={2} />
            <text x={14} y={25} fontSize={17} fill={C.panelLight}>
              {zaimek}
            </text>
            <text x={206} y={25} textAnchor="end" fontSize={19} fontWeight={700} fill={C.white}>
              {forma}
            </text>
          </g>
        );
      })}

      <text x={130} y={204} textAnchor="middle" fontSize={16} fill={C.panelLight}>
        liczba pojedyncza
      </text>
      <text x={366} y={204} textAnchor="middle" fontSize={16} fill={C.panelLight}>
        liczba mnoga
      </text>

      {/* Trzy czasy */}
      <text x={240} y={244} textAnchor="middle" fontSize={20} fontWeight={800} fill={C.white}>
        TRZY CZASY
      </text>
      {CZASY.map(([nazwa, forma, kolor], i) => (
        <g key={nazwa} transform={`translate(${18 + i * 152} 258)`}>
          <rect width={144} height={62} rx={12} fill={C.panel} stroke={kolor} strokeWidth={3} />
          <text x={72} y={26} textAnchor="middle" fontSize={15} fill={kolor}>
            {nazwa}
          </text>
          <text x={72} y={50} textAnchor="middle" fontSize={20} fontWeight={700} fill={C.white}>
            {forma}
          </text>
        </g>
      ))}
    </svg>
  );
}
