// Ilustracja "strofa": wers, strofa, rym i refren na schemacie wiersza.

import type { ReactNode } from 'react';
import { ART_COLORS as C, ART_FONT } from './colors';

// Dlugosci wersow w kolejnych strofach - ostatnia strofa to refren.
const STROFY: Array<{ wersy: number[]; refren: boolean }> = [
  { wersy: [150, 122, 150, 114], refren: false },
  { wersy: [138, 150, 126, 142], refren: false },
  { wersy: [130, 130], refren: true },
];

export function Strofa({ className }: { className?: string }) {
  const bloki: ReactNode[] = [];
  let y = 42;
  let gornaStrofa = 0;
  let dolnaStrofa = 0;

  STROFY.forEach((strofa, indeksStrofy) => {
    const gora = y;
    strofa.wersy.forEach((szerokosc, indeksWersu) => {
      bloki.push(
        <rect
          key={`w-${indeksStrofy}-${indeksWersu}`}
          x={54}
          y={y}
          width={szerokosc}
          height={12}
          rx={6}
          fill={strofa.refren ? C.pas : C.line}
        />,
      );
      // Rym - kropki na koncu 1. i 3. wersu pierwszej strofy.
      if (indeksStrofy === 0 && (indeksWersu === 0 || indeksWersu === 2)) {
        bloki.push(
          <circle key={`r-${indeksWersu}`} cx={54 + szerokosc + 12} cy={y + 6} r={7} fill={C.kropka} />,
        );
      }
      y += 24;
    });

    // Klamra spinajaca strofe - po lewej stronie kartki.
    bloki.push(
      <path
        key={`k-${indeksStrofy}`}
        d={`M46 ${gora} L38 ${gora} L38 ${y - 12} L46 ${y - 12}`}
        fill="none"
        stroke={strofa.refren ? C.pas : C.muted}
        strokeWidth={3}
      />,
    );

    if (indeksStrofy === 1) gornaStrofa = gora;
    if (strofa.refren) dolnaStrofa = gora;
    y += 20;
  });

  return (
    <svg
      viewBox="0 0 480 330"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: schemat wiersza z wersami, strofami, rymami i refrenem"
      style={{ fontFamily: ART_FONT }}
    >
      <rect x={26} y={14} width={300} height={300} rx={14} fill={C.paper} />
      {bloki}

      {/* Wers - pierwsza linijka */}
      <path d="M210 48 L346 48" stroke={C.panelLight} strokeWidth={2} />
      <text x={352} y={54} fontSize={17} fontWeight={700} fill={C.white}>
        wers
      </text>

      {/* Rym - kropki przy koncach wersow */}
      <path d="M232 100 L346 100" stroke={C.kropka} strokeWidth={2} />
      <text x={352} y={106} fontSize={17} fontWeight={700} fill={C.kropka}>
        rym
      </text>

      {/* Strofa - klamra drugiej zwrotki */}
      <path d={`M330 ${gornaStrofa + 40} L346 ${gornaStrofa + 40}`} stroke={C.muted} strokeWidth={2} />
      <text x={352} y={gornaStrofa + 46} fontSize={17} fontWeight={700} fill={C.white}>
        strofa
      </text>

      {/* Refren - ostatnia, wyrozniona zwrotka */}
      <path d={`M190 ${dolnaStrofa + 16} L346 ${dolnaStrofa + 16}`} stroke={C.pas} strokeWidth={2} />
      <text x={352} y={dolnaStrofa + 22} fontSize={17} fontWeight={700} fill={C.pas}>
        refren
      </text>

      <text x={176} y={328} textAnchor="middle" fontSize={16} fill={C.panelLight}>
        strofa = zwrotka, refren się powtarza
      </text>
    </svg>
  );
}
