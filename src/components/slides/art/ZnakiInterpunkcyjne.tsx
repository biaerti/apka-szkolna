// Ilustracja "znakiInterpunkcyjne": szesc znakow i co kazdy z nich robi w zdaniu.

import { ART_COLORS as C, ART_FONT } from './colors';

// [znak, nazwa, do czego]
const ZNAKI: Array<[string, string, string]> = [
  ['.', 'kropka', 'koniec zdania'],
  ['?', 'pytajnik', 'pytanie'],
  ['!', 'wykrzyknik', 'rozkaz, emocja'],
  [',', 'przecinek', 'wyliczenie, że, ale, bo'],
  [':', 'dwukropek', 'przed wyliczeniem'],
  ['-', 'myślnik', 'wypowiedź w dialogu'],
];

export function ZnakiInterpunkcyjne({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 330"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: kropka, pytajnik, wykrzyknik, przecinek, dwukropek i myslnik z opisami"
      style={{ fontFamily: ART_FONT }}
    >
      <text x={240} y={24} textAnchor="middle" fontSize={22} fontWeight={800} fill={C.plus}>
        ZNAKI INTERPUNKCYJNE
      </text>

      {ZNAKI.map(([znak, nazwa, opis], i) => (
        <g key={nazwa} transform={`translate(14 ${40 + i * 48})`}>
          <rect width={54} height={40} rx={9} fill={C.paper} stroke={C.ink} strokeWidth={2} />
          <text x={27} y={31} textAnchor="middle" fontSize={30} fontWeight={800} fill={C.ink}>
            {znak}
          </text>
          <text x={76} y={20} fontSize={19} fontWeight={700} fill={C.kropka}>
            {nazwa}
          </text>
          <text x={76} y={38} fontSize={16} fill={C.white}>
            {opis}
          </text>
        </g>
      ))}
    </svg>
  );
}
