// Ilustracja "zleZachowania": co liczy sie jako przeszkadzanie, a co nigdy nim nie jest.
// Zielony pas na dole jest tu najwazniejszy - dziecko ma zobaczyc, ze za nieumiejetnosc
// nie ma konsekwencji; uwagi sa wylacznie za zachowanie.

import { ART_COLORS as C, ART_FONT } from './colors';

const PRZESZKADZANIE = [
  'krzyk i gadanie',
  'przekrzykiwanie',
  'podpowiadanie',
  'ściągawki',
  'telefon',
  'śmianie się z kolegi',
];

const BEZ_UWAGI = ['zła odpowiedź', '"nie wiem"', 'pytanie do mnie'];

export function ZleZachowania({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 350"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: co liczy sie jako przeszkadzanie, a za co nigdy nie ma uwagi"
      style={{ fontFamily: ART_FONT }}
    >
      <text x={240} y={22} textAnchor="middle" fontSize={21} fontWeight={800} fill={C.plomba}>
        TO JEST PRZESZKADZANIE
      </text>

      {PRZESZKADZANIE.map((tekst, i) => (
        <g key={tekst} transform={`translate(16 ${34 + i * 38})`}>
          <rect width={448} height={32} rx={9} fill={C.panel} stroke={C.plomba} strokeWidth={2} />
          <circle cx={26} cy={16} r={10} fill="none" stroke={C.plomba} strokeWidth={3} />
          <line x1={19} y1={9} x2={33} y2={23} stroke={C.plomba} strokeWidth={3} strokeLinecap="round" />
          <text x={50} y={23} fontSize={19} fill={C.white}>
            {tekst}
          </text>
        </g>
      ))}

      <rect x={16} y={272} width={448} height={70} rx={12} fill={C.panel} stroke={C.plus} strokeWidth={4} />
      <text x={240} y={296} textAnchor="middle" fontSize={17} fontWeight={800} fill={C.plus}>
        ZA TO NIGDY NIE MA UWAGI
      </text>
      {BEZ_UWAGI.map((tekst, i) => (
        <text key={tekst} x={82 + i * 150} y={325} textAnchor="middle" fontSize={17} fill={C.white}>
          {tekst}
        </text>
      ))}
    </svg>
  );
}
