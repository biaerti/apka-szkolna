// Ilustracja "kolo": schemat kola fortuny podzielonego na sektory,
// ze wskaznikiem u gory i jednym wyroznionym sektorem (wylosowana osoba).

import { ART_COLORS as C, ART_FONT } from './colors';

const CX = 150;
const CY = 172;
const R = 118;
const SECTORS = 8;
const HIGHLIGHT_INDEX = 2;

function point(angleDeg: number, radius: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CX + radius * Math.cos(a), y: CY + radius * Math.sin(a) };
}

function sectorPath(index: number) {
  const start = (360 / SECTORS) * index;
  const end = (360 / SECTORS) * (index + 1);
  const p1 = point(start, R);
  const p2 = point(end, R);
  return `M ${CX} ${CY} L ${p1.x} ${p1.y} A ${R} ${R} 0 0 1 ${p2.x} ${p2.y} Z`;
}

export function Kolo({ className }: { className?: string }) {
  const sectors = Array.from({ length: SECTORS }, (_, i) => i);

  return (
    <svg
      viewBox="0 0 300 320"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: kolo fortuny podzielone na sektory z imionami, wskaznik u gory wskazuje wylosowana osobe"
      style={{ fontFamily: ART_FONT }}
    >
      {/* Wskaznik */}
      <polygon
        points={`${CX - 16},${CY - R - 30} ${CX + 16},${CY - R - 30} ${CX},${CY - R - 4}`}
        fill={C.white}
        stroke={C.ink}
        strokeWidth={3}
      />

      {sectors.map((i) => {
        const isHighlight = i === HIGHLIGHT_INDEX;
        const fill = isHighlight ? C.pas : i % 2 === 0 ? C.panel : C.panelLight;
        const midAngle = (360 / SECTORS) * (i + 0.5);
        const labelPos = point(midAngle, R * 0.62);
        return (
          <g key={i}>
            <path d={sectorPath(i)} fill={fill} stroke={C.white} strokeWidth={3} />
            {(i === 0 || i === 3 || i === 5) && (
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                fontSize={16}
                fontWeight={600}
                fill={C.white}
                transform={`rotate(${midAngle} ${labelPos.x} ${labelPos.y})`}
              >
                imię
              </text>
            )}
            {isHighlight && (
              <text
                x={labelPos.x}
                y={labelPos.y + 6}
                textAnchor="middle"
                fontSize={26}
                fontWeight={800}
                fill={C.ink}
                transform={`rotate(${midAngle} ${labelPos.x} ${labelPos.y})`}
              >
                Ty?
              </text>
            )}
          </g>
        );
      })}

      <circle cx={CX} cy={CY} r={R} fill="none" stroke={C.white} strokeWidth={5} />
      <circle cx={CX} cy={CY} r={16} fill={C.ink} stroke={C.white} strokeWidth={4} />
    </svg>
  );
}
