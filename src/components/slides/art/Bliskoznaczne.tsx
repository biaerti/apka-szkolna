// Ilustracja "bliskoznaczne": wyrazy bliskoznaczne (to samo) i przeciwstawne (odwrotnie).

import { ART_COLORS as C, ART_FONT } from './colors';

const BLISKIE: Array<[string, string]> = [
  ['ładny', 'piękny'],
  ['iść', 'kroczyć'],
  ['duży', 'ogromny'],
];
const PRZECIWNE: Array<[string, string]> = [
  ['ciepły', 'zimny'],
  ['dzień', 'noc'],
  ['mądry', 'głupi'],
];

export function Bliskoznaczne({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 330"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: wyrazy bliskoznaczne i wyrazy o znaczeniu przeciwnym"
      style={{ fontFamily: ART_FONT }}
    >
      <text x={240} y={24} textAnchor="middle" fontSize={22} fontWeight={800} fill={C.plus}>
        BLISKOZNACZNE
      </text>
      <text x={240} y={48} textAnchor="middle" fontSize={17} fill={C.white}>
        znaczą prawie to samo
      </text>

      {BLISKIE.map(([a, b], i) => (
        <g key={a} transform={`translate(0 ${62 + i * 40})`}>
          <rect x={30} y={0} width={170} height={32} rx={8} fill={C.panel} stroke={C.plus} strokeWidth={2} />
          <text x={115} y={22} textAnchor="middle" fontSize={19} fill={C.white}>
            {a}
          </text>
          <text x={240} y={24} textAnchor="middle" fontSize={22} fontWeight={800} fill={C.plus}>
            =
          </text>
          <rect x={280} y={0} width={170} height={32} rx={8} fill={C.panel} stroke={C.plus} strokeWidth={2} />
          <text x={365} y={22} textAnchor="middle" fontSize={19} fill={C.white}>
            {b}
          </text>
        </g>
      ))}

      <text x={240} y={212} textAnchor="middle" fontSize={22} fontWeight={800} fill={C.plomba}>
        PRZECIWSTAWNE
      </text>

      {PRZECIWNE.map(([a, b], i) => (
        <g key={a} transform={`translate(0 ${226 + i * 34})`}>
          <rect x={30} y={0} width={170} height={28} rx={8} fill={C.panel} stroke={C.plomba} strokeWidth={2} />
          <text x={115} y={20} textAnchor="middle" fontSize={18} fill={C.white}>
            {a}
          </text>
          <text x={240} y={21} textAnchor="middle" fontSize={20} fontWeight={800} fill={C.plomba}>
            &#8596;
          </text>
          <rect x={280} y={0} width={170} height={28} rx={8} fill={C.panel} stroke={C.plomba} strokeWidth={2} />
          <text x={365} y={20} textAnchor="middle" fontSize={18} fill={C.white}>
            {b}
          </text>
        </g>
      ))}
    </svg>
  );
}
