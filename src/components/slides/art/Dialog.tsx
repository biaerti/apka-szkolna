// Ilustracja "dialog": kazda wypowiedz od nowej linii, zaczyna sie myslnikiem.

import { ART_COLORS as C, ART_FONT } from './colors';

// [kto, tekst, czy lewa strona]
const WYPOWIEDZI: Array<[string, boolean]> = [
  ['Idziesz na boisko?', true],
  ['Tak, zaraz po lekcjach.', false],
  ['To czekam przy szatni.', true],
];

export function Dialog({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 320"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: zapis dialogu - kazda wypowiedz od nowej linii z myslnikiem"
      style={{ fontFamily: ART_FONT }}
    >
      <text x={240} y={24} textAnchor="middle" fontSize={22} fontWeight={800} fill={C.plus}>
        DIALOG
      </text>
      <text x={240} y={48} textAnchor="middle" fontSize={16} fill={C.white}>
        rozmowa co najmniej dwóch osób
      </text>

      <rect x={20} y={62} width={440} height={166} rx={12} fill={C.paper} stroke={C.ink} strokeWidth={3} />

      {WYPOWIEDZI.map(([tekst, lewa], i) => (
        <g key={tekst} transform={`translate(0 ${94 + i * 50})`}>
          <text x={44} y={0} fontSize={30} fontWeight={800} fill={lewa ? C.plusDark : C.kropkaDark}>
            -
          </text>
          <text x={70} y={0} fontSize={20} fill={C.ink}>
            {tekst}
          </text>
        </g>
      ))}

      <text x={240} y={262} textAnchor="middle" fontSize={18} fontWeight={700} fill={C.pas}>
        każda wypowiedź: nowa linia + myślnik
      </text>
      <text x={240} y={292} textAnchor="middle" fontSize={17} fill={C.white}>
        monolog = mówi tylko jedna osoba
      </text>
    </svg>
  );
}
