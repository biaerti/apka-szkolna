// Ilustracja "stopnie": trzy plusy daja piatke. Kropki sa neutralne.

import { ART_COLORS as C, ART_FONT } from './colors';

function MiniPlus({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={26} fill={C.panel} stroke={C.plus} strokeWidth={3} />
      <rect x={-5} y={-15} width={10} height={30} rx={3} fill={C.plus} />
      <rect x={-15} y={-5} width={30} height={10} rx={3} fill={C.plus} />
    </g>
  );
}

export function Stopnie({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 300"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: trzy plusy zamieniają się w piątkę, kropki są neutralne"
      style={{ fontFamily: ART_FONT }}
    >
      {/* Gorny rzad: plusy -> piatka */}
      <g transform="translate(0 112)">
        <MiniPlus x={50} y={0} />
        <MiniPlus x={116} y={0} />
        <MiniPlus x={182} y={0} />
        <text x={236} y={10} fontSize={40} fontWeight={700} fill={C.white}>
          →
        </text>
        <text x={370} y={22} textAnchor="middle" fontSize={110} fontWeight={800} fill={C.plus}>
          5
        </text>
      </g>

      <text x={240} y={240} textAnchor="middle" fontSize={24} fontWeight={700} fill={C.kropka}>
        Kropki nie obniżają oceny
      </text>
    </svg>
  );
}
