// Ilustracja "opowiadanie": wstep - rozwiniecie - zakonczenie i slowa planu wydarzen.

import { ART_COLORS as C, ART_FONT } from './colors';

// [nazwa czesci, slowa, ktorych uzywamy, kolor]
const CZESCI: Array<[string, string, string]> = [
  ['WSTĘP', 'najpierw', C.plus],
  ['ROZWINIĘCIE', 'potem, nagle', C.kropka],
  ['ZAKOŃCZENIE', 'na koniec', C.pas],
];

export function Opowiadanie({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 300"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: opowiadanie ma trzy czesci - wstep, rozwiniecie i zakonczenie"
      style={{ fontFamily: ART_FONT }}
    >
      {CZESCI.map(([nazwa, slowa, kolor], i) => (
        <g key={nazwa} transform={`translate(0 ${i * 92})`}>
          <rect x={26} y={8} width={428} height={62} rx={14} fill={C.panel} stroke={kolor} strokeWidth={3} />
          <circle cx={72} cy={39} r={20} fill={kolor} />
          <text x={72} y={47} textAnchor="middle" fontSize={22} fontWeight={800} fill={C.panel}>
            {i + 1}
          </text>
          <text x={108} y={34} fontSize={22} fontWeight={800} fill={kolor}>
            {nazwa}
          </text>
          <text x={108} y={58} fontSize={17} fill={C.white}>
            {slowa}
          </text>

          {/* Strzalka do nastepnej czesci */}
          {i < CZESCI.length - 1 && (
            <path
              d="M240 74 L240 92 M228 84 L240 96 L252 84"
              fill="none"
              stroke={C.panelLight}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </g>
      ))}

      <text x={240} y={292} textAnchor="middle" fontSize={18} fill={C.panelLight}>
        plan wydarzeń: punkty w kolejności zdarzeń
      </text>
    </svg>
  );
}
