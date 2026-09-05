// Ilustracja "slownik": jak szukac wyrazu w slowniku ortograficznym.

import { ART_COLORS as C, ART_FONT } from './colors';

const KROKI: Array<[string, string]> = [
  ['1', 'patrzę na pierwszą literę: ż'],
  ['2', 'potem na drugą: ż-o'],
  ['3', 'potem na trzecią: ż-o-ł'],
];

export function Slownik({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 320"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: otwarty slownik ortograficzny i trzy kroki szukania wyrazu"
      style={{ fontFamily: ART_FONT }}
    >
      <text x={240} y={24} textAnchor="middle" fontSize={22} fontWeight={800} fill={C.plus}>
        SŁOWNIK ORTOGRAFICZNY
      </text>

      <rect x={40} y={40} width={400} height={130} rx={10} fill={C.paper} stroke={C.ink} strokeWidth={3} />
      <line x1={240} y1={40} x2={240} y2={170} stroke={C.ink} strokeWidth={3} />

      <text x={62} y={70} fontSize={19} fontWeight={800} fill={C.plombaDark}>
        Ż
      </text>
      {['żaba', 'żagiel', 'żeglarz'].map((w, i) => (
        <text key={w} x={62} y={98 + i * 24} fontSize={17} fill={C.ink}>
          {w}
        </text>
      ))}

      <text x={262} y={70} fontSize={19} fontWeight={800} fill={C.plombaDark}>
        ŻO - ŻÓ
      </text>
      {['żołnierz', 'żółty', 'żuraw'].map((w, i) => (
        <text key={w} x={262} y={98 + i * 24} fontSize={17} fill={C.ink}>
          {w}
        </text>
      ))}

      {KROKI.map(([nr, opis], i) => (
        <g key={nr} transform={`translate(40 ${196 + i * 42})`}>
          <circle cx={18} cy={16} r={16} fill={C.kropka} />
          <text x={18} y={23} textAnchor="middle" fontSize={18} fontWeight={800} fill={C.ink}>
            {nr}
          </text>
          <text x={48} y={23} fontSize={19} fill={C.white}>
            {opis}
          </text>
        </g>
      ))}
    </svg>
  );
}
