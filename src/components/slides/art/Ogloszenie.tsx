// Ilustracja "ogloszenie": co, kiedy i gdzie, kto - oraz zapis dialogu myslnikami.

import { ART_COLORS as C, ART_FONT } from './colors';

const PYTANIA: Array<[string, string]> = [
  ['CZEGO DOTYCZY?', 'zbiórka karmy'],
  ['KIEDY I GDZIE?', '10 maja, sala 12'],
  ['KTO OGŁASZA?', 'samorząd szkolny'],
];

export function Ogloszenie({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 330"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: ogloszenie odpowiada na trzy pytania, a dialog zapisujemy myslnikami"
      style={{ fontFamily: ART_FONT }}
    >
      {/* Ogloszenie - kartka */}
      <rect x={22} y={12} width={436} height={158} rx={14} fill={C.paper} stroke={C.kropka} strokeWidth={4} />
      <text x={240} y={44} textAnchor="middle" fontSize={22} fontWeight={800} fill={C.kropkaDark}>
        OGŁOSZENIE
      </text>
      {PYTANIA.map(([pytanie, przyklad], i) => (
        <g key={pytanie} transform={`translate(0 ${74 + i * 32})`}>
          <circle cx={54} cy={-5} r={6} fill={C.kropka} />
          <text x={72} y={0} fontSize={16} fontWeight={800} fill={C.ink}>
            {pytanie}
          </text>
          <text x={244} y={0} fontSize={16} fill={C.muted}>
            {przyklad}
          </text>
        </g>
      ))}

      {/* Dialog - kazda wypowiedz od myslnika */}
      <text x={22} y={204} fontSize={19} fontWeight={800} fill={C.pas}>
        DIALOG - myślnik i nowa linia
      </text>
      <rect x={22} y={218} width={436} height={98} rx={14} fill={C.panel} stroke={C.pas} strokeWidth={3} />

      <text x={46} y={254} fontSize={26} fontWeight={800} fill={C.pas}>
        -
      </text>
      <text x={70} y={254} fontSize={20} fill={C.white}>
        Idziesz na boisko?
      </text>

      <text x={46} y={294} fontSize={26} fontWeight={800} fill={C.pas}>
        -
      </text>
      <text x={70} y={294} fontSize={20} fill={C.white}>
        Tak, zaraz po lekcjach.
      </text>
    </svg>
  );
}
