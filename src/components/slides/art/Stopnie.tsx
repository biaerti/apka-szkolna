// Ilustracja "stopnie": trzy plusy daja piatke, trzy plomby daja jedynke.

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

function MiniPlomba({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={26} fill={C.panel} stroke={C.plomba} strokeWidth={3} />
      <circle r={14} fill={C.plomba} />
    </g>
  );
}

export function Stopnie({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 300"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: trzy plusy zamieniaja sie na piatke, trzy plomby zamieniaja sie na jedynke"
      style={{ fontFamily: ART_FONT }}
    >
      {/* Gorny rzad: plusy -> piatka */}
      <g transform="translate(0 68)">
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

      {/* Dolny rzad: plomby -> jedynka */}
      <g transform="translate(0 224)">
        <MiniPlomba x={50} y={0} />
        <MiniPlomba x={116} y={0} />
        <MiniPlomba x={182} y={0} />
        <text x={236} y={10} fontSize={40} fontWeight={700} fill={C.white}>
          →
        </text>
        <text x={370} y={22} textAnchor="middle" fontSize={110} fontWeight={800} fill={C.plomba}>
          1
        </text>
      </g>
    </svg>
  );
}
