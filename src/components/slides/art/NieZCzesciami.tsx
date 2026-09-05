// Ilustracja "nieZCzesciami": nie z czasownikiem osobno, z rzeczownikiem
// i przymiotnikiem razem.

import { ART_COLORS as C, ART_FONT } from './colors';

export function NieZCzesciami({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 320"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: nie z czasownikiem piszemy osobno, z rzeczownikiem i przymiotnikiem razem"
      style={{ fontFamily: ART_FONT }}
    >
      {/* Osobno - z czasownikiem */}
      <rect x={20} y={16} width={440} height={116} rx={14} fill={C.panel} stroke={C.plomba} strokeWidth={3} />
      <text x={40} y={46} fontSize={20} fontWeight={800} fill={C.plomba}>
        OSOBNO - z czasownikiem
      </text>

      <rect x={40} y={62} width={72} height={44} rx={10} fill={C.plomba} />
      <text x={76} y={92} textAnchor="middle" fontSize={24} fontWeight={800} fill={C.panel}>
        nie
      </text>
      <text x={128} y={92} fontSize={24} fontWeight={700} fill={C.white}>
        wiem
      </text>

      <rect x={244} y={62} width={72} height={44} rx={10} fill={C.plomba} />
      <text x={280} y={92} textAnchor="middle" fontSize={24} fontWeight={800} fill={C.panel}>
        nie
      </text>
      <text x={332} y={92} fontSize={24} fontWeight={700} fill={C.white}>
        pójdę
      </text>

      {/* Razem - z rzeczownikiem i przymiotnikiem */}
      <rect x={20} y={148} width={440} height={116} rx={14} fill={C.panel} stroke={C.plus} strokeWidth={3} />
      <text x={40} y={178} fontSize={20} fontWeight={800} fill={C.plus}>
        RAZEM - z rzeczownikiem i przymiotnikiem
      </text>

      <rect x={40} y={194} width={176} height={44} rx={10} fill={C.plus} />
      <text x={128} y={224} textAnchor="middle" fontSize={24} fontWeight={800} fill={C.panel}>
        nieprawda
      </text>

      <rect x={244} y={194} width={196} height={44} rx={10} fill={C.plus} />
      <text x={342} y={224} textAnchor="middle" fontSize={24} fontWeight={800} fill={C.panel}>
        niegrzeczny
      </text>

      <text x={240} y={294} textAnchor="middle" fontSize={19} fontWeight={700} fill={C.white}>
        najczęstszy błąd: „niewiem”
      </text>
      <text x={240} y={316} textAnchor="middle" fontSize={17} fill={C.panelLight}>
        przy czasowniku „nie” stoi zawsze osobno
      </text>
    </svg>
  );
}
