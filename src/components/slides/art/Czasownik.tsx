// Ilustracja "czasownik": nazywa czynnosc albo stan - co robi?

import { ART_COLORS as C, ART_FONT } from './colors';

export function Czasownik({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 300"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: czasownik odpowiada na pytanie co robi - biegnie, spiewa, spi"
      style={{ fontFamily: ART_FONT }}
    >
      <rect x={90} y={10} width={300} height={54} rx={16} fill={C.panel} stroke={C.plus} strokeWidth={4} />
      <text x={240} y={46} textAnchor="middle" fontSize={30} fontWeight={800} fill={C.plus}>
        co robi?
      </text>

      {/* Biegnie - postac w ruchu z liniami predkosci */}
      <g transform="translate(150 108)">
        <path d="M-70 4 H-40 M-70 22 H-48 M-70 40 H-40" stroke={C.plusDark} strokeWidth={5} strokeLinecap="round" />
        <circle cx={0} cy={-6} r={16} fill={C.plus} />
        <path d="M-4 8 L6 40" stroke={C.plus} strokeWidth={10} strokeLinecap="round" />
        <path d="M6 40 L-14 62 M6 40 L26 60" stroke={C.plus} strokeWidth={9} strokeLinecap="round" />
        <path d="M-2 16 L-24 26 M-2 16 L24 8" stroke={C.plus} strokeWidth={8} strokeLinecap="round" />
        <text x={-8} y={96} textAnchor="middle" fontSize={21} fontWeight={700} fill={C.white}>
          biegnie
        </text>
      </g>

      {/* Spiewa - nuty */}
      <g transform="translate(330 108)">
        <circle cx={-14} cy={30} r={11} fill={C.plus} />
        <path d="M-3 30 V-8 H26 V26" stroke={C.plus} strokeWidth={6} fill="none" strokeLinecap="round" />
        <circle cx={15} cy={26} r={11} fill={C.plus} />
        <text x={0} y={96} textAnchor="middle" fontSize={21} fontWeight={700} fill={C.white}>
          śpiewa
        </text>
      </g>

      <text x={240} y={248} textAnchor="middle" fontSize={22} fontWeight={800} fill={C.white}>
        CZASOWNIK
      </text>
      <text x={240} y={280} textAnchor="middle" fontSize={19} fill={C.panelLight}>
        albo stan: śpi, choruje, czeka
      </text>
    </svg>
  );
}
