// Ilustracja "przebieg": poziomy schemat przebiegu lekcji.
// powtorka -> kolo -> nowy temat -> kolo -> notatka.
//
// Kroki z kolem fortuny nie sa prostokatem z napisem, tylko malym podgladem
// samego kola (sektory, wskaznik, jeden wylosowany sektor). Dziecko widzi na
// schemacie DOKLADNIE to, co za chwile zobaczy na ekranie, i nie musi
// zgadywac, co znaczy slowo "kolo" w ramce.

import { ART_COLORS as C, ART_FONT } from './colors';

const STEPS: { label: string; color: string; wheel?: boolean }[] = [
  { label: 'powtórka', color: C.kropka },
  { label: 'koło', color: C.pas, wheel: true },
  { label: 'nowy temat', color: C.plus },
  { label: 'koło', color: C.pas, wheel: true },
  { label: 'notatka', color: C.kropka },
];

const BOX_W = 140;
const BOX_H = 90;
const GAP = 40;
const START_X = 20;
const Y = 60;

// Mini kolo: promien tak dobrany, zeby zmiescic sie w wysokosci ramki, plus
// miejsce na wskaznik nad nim.
const WHEEL_R = 40;
const WHEEL_SECTORS = 8;
const WHEEL_HIGHLIGHT = 1;

function sectorPath(cx: number, cy: number, index: number) {
  const angle = (deg: number) => ((deg - 90) * Math.PI) / 180;
  const step = 360 / WHEEL_SECTORS;
  const a1 = angle(step * index);
  const a2 = angle(step * (index + 1));
  const x1 = cx + WHEEL_R * Math.cos(a1);
  const y1 = cy + WHEEL_R * Math.sin(a1);
  const x2 = cx + WHEEL_R * Math.cos(a2);
  const y2 = cy + WHEEL_R * Math.sin(a2);
  return `M ${cx} ${cy} L ${x1} ${y1} A ${WHEEL_R} ${WHEEL_R} 0 0 1 ${x2} ${y2} Z`;
}

/** Podglad kola fortuny w rozmiarze kroku schematu, z podpisem pod spodem. */
function MiniWheel({ cx, cy, label, color }: { cx: number; cy: number; label: string; color: string }) {
  return (
    <g>
      <polygon points={`${cx - 9},${cy - WHEEL_R - 14} ${cx + 9},${cy - WHEEL_R - 14} ${cx},${cy - WHEEL_R + 6}`} fill={color} />
      {Array.from({ length: WHEEL_SECTORS }, (_, i) => (
        <path
          key={i}
          d={sectorPath(cx, cy, i)}
          fill={i === WHEEL_HIGHLIGHT ? color : i % 2 === 0 ? C.panel : C.panelLight}
          stroke={C.white}
          strokeWidth={2}
        />
      ))}
      <circle cx={cx} cy={cy} r={WHEEL_R} fill="none" stroke={color} strokeWidth={4} />
      <circle cx={cx} cy={cy} r={8} fill={C.ink} stroke={C.white} strokeWidth={3} />
      <text x={cx} y={cy + WHEEL_R + 28} textAnchor="middle" fontSize={22} fontWeight={700} fill={C.white}>
        {label}
      </text>
    </g>
  );
}

export function Przebieg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 900 210"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: przebieg lekcji - powtorka, kolo fortuny, nowy temat, kolo fortuny, notatka"
      style={{ fontFamily: ART_FONT }}
    >
      {STEPS.map((step, i) => {
        const x = START_X + i * (BOX_W + GAP);
        return (
          <g key={i}>
            {step.wheel ? (
              <MiniWheel cx={x + BOX_W / 2} cy={Y + BOX_H / 2} label={step.label} color={step.color} />
            ) : (
              <>
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
                <text
                  x={x + BOX_W / 2}
                  y={Y + BOX_H / 2 + 8}
                  textAnchor="middle"
                  fontSize={22}
                  fontWeight={700}
                  fill={C.white}
                >
                  {step.label}
                </text>
              </>
            )}
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
