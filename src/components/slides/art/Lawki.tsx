// Ilustracja "lawki": plan klasy z gory - tablica, przednie lawki zajete
// i wyroznione, tylne przekreslone (nie siadamy tam).

import { ART_COLORS as C, ART_FONT } from './colors';

const COLS = [40, 140, 240];
const ROWS = [80, 150, 220, 290];

function Desk({ x, y, front }: { x: number; y: number; front: boolean }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={80}
        height={50}
        rx={8}
        fill={front ? C.plus : C.panelLight}
        opacity={front ? 1 : 0.45}
        stroke={C.white}
        strokeWidth={3}
      />
      {!front && (
        <path
          d={`M${x + 8} ${y + 8} L${x + 72} ${y + 42} M${x + 72} ${y + 8} L${x + 8} ${y + 42}`}
          stroke={C.plomba}
          strokeWidth={5}
          strokeLinecap="round"
        />
      )}
    </g>
  );
}

export function Lawki({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 380"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: plan klasy z gory, tablica na gorze, przednie lawki zajete i wyroznione na zielono, tylne przekreslone na czerwono"
      style={{ fontFamily: ART_FONT }}
    >
      {/* Tablica */}
      <rect x={60} y={10} width={240} height={30} rx={4} fill={C.panel} stroke={C.white} strokeWidth={3} />
      <text x={180} y={31} textAnchor="middle" fontSize={16} fontWeight={700} fill={C.white}>
        TABLICA
      </text>

      {ROWS.map((y, ri) =>
        COLS.map((x, ci) => <Desk key={`${ri}-${ci}`} x={x} y={y} front={ri < 2} />),
      )}

      <text x={180} y={363} textAnchor="middle" fontSize={17} fontWeight={700} fill={C.plus}>
        siadamy blisko tablicy
      </text>
    </svg>
  );
}
