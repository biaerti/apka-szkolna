// Ilustracja "tematTekstu": kartka z tekstem, lupa nad zdaniem z odpowiedzia i
// ramka "TEMAT" - jedno zdanie o czym tekst jest.

import { ART_COLORS as C, ART_FONT } from './colors';

// Dlugosci linii tekstu na kartce; indeks 3 to linia z szukana informacja.
const LINIE = [186, 200, 170, 200, 194, 140];

export function TematTekstu({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 320"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: kartka z tekstem, lupa nad zdaniem z szukana informacja i ramka z tematem tekstu"
      style={{ fontFamily: ART_FONT }}
    >
      {/* Kartka z tekstem */}
      <rect x={26} y={12} width={230} height={196} rx={12} fill={C.paper} stroke={C.panelLight} strokeWidth={4} />
      {LINIE.map((szer, i) => (
        <rect
          key={i}
          x={48}
          y={38 + i * 27}
          width={szer}
          height={11}
          rx={5}
          fill={i === 3 ? C.pas : C.line}
        />
      ))}

      {/* Lupa nad podswietlona linia */}
      <g transform="translate(206 146)">
        <circle cx={0} cy={0} r={34} fill="none" stroke={C.kropka} strokeWidth={7} />
        <circle cx={0} cy={0} r={30} fill={C.kropka} opacity={0.14} />
        <path d="M24 24 L48 48" stroke={C.kropka} strokeWidth={9} strokeLinecap="round" />
      </g>

      <text x={141} y={236} textAnchor="middle" fontSize={17} fill={C.white}>
        słowa z pytania znajdziesz w tekście
      </text>

      {/* Ramka z tematem */}
      <rect x={288} y={52} width={168} height={116} rx={14} fill={C.panel} stroke={C.plus} strokeWidth={4} />
      <text x={372} y={86} textAnchor="middle" fontSize={22} fontWeight={800} fill={C.plus}>
        TEMAT
      </text>
      <text x={372} y={116} textAnchor="middle" fontSize={17} fill={C.white}>
        o czym ten
      </text>
      <text x={372} y={140} textAnchor="middle" fontSize={17} fill={C.white}>
        tekst jest
      </text>

      <text x={372} y={236} textAnchor="middle" fontSize={19} fontWeight={700} fill={C.plus}>
        jedno zdanie
      </text>

      <text x={240} y={294} textAnchor="middle" fontSize={18} fill={C.panelLight}>
        nie czytaj wszystkiego od nowa
      </text>
    </svg>
  );
}
