// Ilustracja "wiersz": wiersz zapisany w wersach i rymujacy sie, obok proza.

import { ART_COLORS as C, ART_FONT } from './colors';

// Dlugosci wersow wiersza - krotkie linie roznej dlugosci
const WERSY = [110, 96, 118, 88];
// Proza - pelne linie tekstu
const LINIE_PROZY = [140, 140, 140, 140, 140, 96];

export function Wiersz({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 300"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: wiersz zapisany w krotkich wersach z rymami, obok proza pisana pelnymi zdaniami"
      style={{ fontFamily: ART_FONT }}
    >
      {/* Wiersz */}
      <g>
        <rect x={20} y={16} width={180} height={200} rx={12} fill={C.paper} stroke={C.kropka} strokeWidth={4} />
        {WERSY.map((szer, i) => (
          <rect key={i} x={40} y={44 + i * 30} width={szer} height={10} rx={5} fill={C.line} />
        ))}
        {/* Zaznaczone koncowki rymow */}
        <circle cx={166} cy={49} r={9} fill={C.kropka} />
        <circle cx={166} cy={139} r={9} fill={C.kropka} />
        <text x={110} y={196} textAnchor="middle" fontSize={17} fontWeight={700} fill={C.ink}>
          kot - płot
        </text>
        <text x={110} y={244} textAnchor="middle" fontSize={23} fontWeight={800} fill={C.kropka}>
          WIERSZ
        </text>
        <text x={110} y={270} textAnchor="middle" fontSize={16} fill={C.white}>
          wersy i rymy
        </text>
      </g>

      {/* Proza */}
      <g>
        <rect x={280} y={16} width={180} height={200} rx={12} fill={C.paper} stroke={C.panelLight} strokeWidth={4} />
        {LINIE_PROZY.map((szer, i) => (
          <rect key={i} x={300} y={44 + i * 26} width={szer} height={10} rx={5} fill={C.line} />
        ))}
        <text x={370} y={244} textAnchor="middle" fontSize={23} fontWeight={800} fill={C.panelLight}>
          PROZA
        </text>
        <text x={370} y={270} textAnchor="middle" fontSize={16} fill={C.white}>
          zwykłe zdania
        </text>
      </g>
    </svg>
  );
}
