// Ilustracja "przebieg": poziomy schemat przebiegu lekcji.
// powtorka -> kolo -> nowy temat -> kolo -> notatka.

import { ART_COLORS as C, ART_FONT } from './colors';

const STEPS: { label: string; color: string }[] = [
  { label: 'powtórka', color: C.kropka },
  { label: 'koło', color: C.pas },
  { label: 'nowy temat', color: C.plus },
  { label: 'koło', color: C.pas },
  { label: 'notatka', color: C.kropka },
];

const BOX_W = 140;
const BOX_H = 90;
const GAP = 40;
const START_X = 20;
const Y = 60;

export function Przebieg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 900 210"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: przebieg lekcji - powtorka, kolo, nowy temat, kolo, notatka"
      style={{ fontFamily: ART_FONT }}
    >
      {STEPS.map((step, i) => {
        const x = START_X + i * (BOX_W + GAP);
        return (
          <g key={i}>
            <rect
              x={x}
              y={Y}
              width={BOX_W}
              height={BOX_H}
              rx={14}
              fill={C.panel}
              stroke={step.color}
              strokeWidth={5}
            />
            <text x={x + BOX_W / 2} y={Y + BOX_H / 2 + 8} textAnchor="middle" fontSize={22} fontWeight={700} fill={C.white}>
              {step.label}
            </text>
            {i < STEPS.length - 1 && (
              <>
                <line
                  x1={x + BOX_W}
                  y1={Y + BOX_H / 2}
                  x2={x + BOX_W + GAP - 10}
                  y2={Y + BOX_H / 2}
                  stroke={C.white}
                  strokeWidth={5}
                />
                <polygon
                  points={`${x + BOX_W + GAP - 10},${Y + BOX_H / 2 - 10} ${x + BOX_W + GAP + 8},${Y + BOX_H / 2} ${x + BOX_W + GAP - 10},${Y + BOX_H / 2 + 10}`}
                  fill={C.white}
                />
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}
