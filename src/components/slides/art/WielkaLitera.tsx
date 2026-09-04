// Ilustracja "wielkaLitera": poczatek zdania, imie i nazwa miejscowosci.

import { ART_COLORS as C, ART_FONT } from './colors';

export function WielkaLitera({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 300"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: zdanie Ania mieszka w Krakowie z zaznaczonymi wielkimi literami A i K"
      style={{ fontFamily: ART_FONT }}
    >
      <text x={240} y={32} textAnchor="middle" fontSize={23} fontWeight={800} fill={C.white}>
        WIELKA LITERA
      </text>

      {/* Wiersz 1: poczatek zdania, jednoczesnie imie */}
      <g transform="translate(0 54)">
        <rect x={30} y={0} width={54} height={58} rx={10} fill={C.plus} />
        <text x={57} y={44} textAnchor="middle" fontSize={38} fontWeight={800} fill={C.panel}>
          A
        </text>
        <text x={92} y={44} fontSize={32} fontWeight={700} fill={C.white}>
          nia mieszka
        </text>
        <text x={330} y={26} fontSize={17} fontWeight={700} fill={C.plus}>
          początek zdania
        </text>
        <text x={330} y={48} fontSize={17} fontWeight={700} fill={C.plus}>
          i imię
        </text>
      </g>

      {/* Wiersz 2: nazwa miejscowosci */}
      <g transform="translate(0 140)">
        <text x={30} y={44} fontSize={32} fontWeight={700} fill={C.white}>
          w
        </text>
        <rect x={64} y={0} width={54} height={58} rx={10} fill={C.kropka} />
        <text x={91} y={44} textAnchor="middle" fontSize={38} fontWeight={800} fill={C.panel}>
          K
        </text>
        <text x={126} y={44} fontSize={32} fontWeight={700} fill={C.white}>
          rakowie.
        </text>
        <text x={330} y={38} fontSize={17} fontWeight={700} fill={C.kropka}>
          nazwa miasta
        </text>
      </g>

      <text x={240} y={262} textAnchor="middle" fontSize={18} fill={C.panelLight}>
        też: nazwiska, państwa i rzeki
      </text>
      <text x={240} y={288} textAnchor="middle" fontSize={18} fill={C.panelLight}>
        Jan Kowalski, Polska, Wisła
      </text>
    </svg>
  );
}
