// Ilustracja "list": kartka listu z czterema stalymi elementami.

import { ART_COLORS as C, ART_FONT } from './colors';

export function List({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 330"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: kartka listu z data, naglowkiem, trescia oraz pozegnaniem i podpisem"
      style={{ fontFamily: ART_FONT }}
    >
      <rect x={20} y={12} width={296} height={306} rx={14} fill={C.paper} stroke={C.pas} strokeWidth={4} />

      {/* Miejscowosc i data - prawy gorny rog kartki */}
      <text x={298} y={48} textAnchor="end" fontSize={15} fontWeight={700} fill={C.ink}>
        Warszawa, 5 września
      </text>
      <path d="M320 42 L344 42" stroke={C.pas} strokeWidth={2} />
      <text x={350} y={48} fontSize={15} fontWeight={700} fill={C.pas}>
        data
      </text>

      {/* Naglowek */}
      <text x={44} y={100} fontSize={20} fontWeight={800} fill={C.ink}>
        Droga Aniu!
      </text>
      <path d="M320 94 L344 94" stroke={C.pas} strokeWidth={2} />
      <text x={350} y={100} fontSize={15} fontWeight={700} fill={C.pas}>
        nagłówek
      </text>

      {/* Tresc - linie tekstu */}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={44} y={126 + i * 26} width={i === 4 ? 150 : 248} height={11} rx={5} fill={C.line} />
      ))}
      <path d="M320 178 L344 178" stroke={C.pas} strokeWidth={2} />
      <text x={350} y={184} fontSize={15} fontWeight={700} fill={C.pas}>
        treść
      </text>

      {/* Pozegnanie i podpis */}
      <text x={44} y={274} fontSize={18} fill={C.ink}>
        Pozdrawiam,
      </text>
      <text x={44} y={300} fontSize={19} fontWeight={800} fill={C.ink}>
        Antek
      </text>
      <path d="M320 284 L344 284" stroke={C.pas} strokeWidth={2} />
      <text x={350} y={278} fontSize={15} fontWeight={700} fill={C.pas}>
        pożegnanie
      </text>
      <text x={350} y={298} fontSize={15} fontWeight={700} fill={C.pas}>
        i podpis
      </text>
    </svg>
  );
}
