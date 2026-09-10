// Ilustracja "czat": ta sama rozmowa zapisana na dwa sposoby - dymki w
// komunikatorze i dialog na kartce (nowa linia + myslnik).

import { ART_COLORS as C, ART_FONT } from './colors';

// [tekst, czy dymek po lewej stronie ekranu]
const DYMKI: Array<[string, boolean]> = [
  ['Idziesz na boisko?', true],
  ['Tak, po lekcjach', false],
  ['To czekam', true],
];

export function Czat({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 320"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: ta sama rozmowa jako czat w telefonie i jako dialog na kartce"
      style={{ fontFamily: ART_FONT }}
    >
      <text x={240} y={24} textAnchor="middle" fontSize={20} fontWeight={800} fill={C.pas}>
        TA SAMA ROZMOWA, DWA ZAPISY
      </text>

      {/* Lewa strona: ekran telefonu z dymkami */}
      <text x={100} y={54} textAnchor="middle" fontSize={17} fontWeight={700} fill={C.kropka}>
        czat
      </text>
      <rect x={30} y={64} width={140} height={200} rx={18} fill={C.panel} stroke={C.kropka} strokeWidth={3} />
      <rect x={78} y={72} width={44} height={6} rx={3} fill={C.panelLight} />
      {DYMKI.map(([tekst, lewa], i) => (
        <g key={tekst} transform={`translate(0 ${92 + i * 54})`}>
          <rect
            x={lewa ? 40 : 62}
            y={0}
            width={98}
            height={40}
            rx={12}
            fill={lewa ? C.panelLight : C.kropkaDark}
          />
          <text
            x={lewa ? 89 : 111}
            y={19}
            textAnchor="middle"
            fontSize={10}
            fill={C.white}
          >
            {tekst}
          </text>
          <text x={lewa ? 89 : 111} y={33} textAnchor="middle" fontSize={10} fill={C.line}>
            {lewa ? 'Ola' : 'ja'}
          </text>
        </g>
      ))}

      {/* Strzalka miedzy zapisami */}
      <path d="M182 164 L212 164" stroke={C.pas} strokeWidth={5} strokeLinecap="round" />
      <path d="M204 156 L214 164 L204 172" fill="none" stroke={C.pas} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />

      {/* Prawa strona: kartka z dialogiem */}
      <text x={350} y={54} textAnchor="middle" fontSize={17} fontWeight={700} fill={C.plus}>
        dialog w zeszycie
      </text>
      <rect x={224} y={64} width={226} height={200} rx={10} fill={C.paper} stroke={C.ink} strokeWidth={3} />
      {DYMKI.map(([tekst], i) => (
        <g key={tekst} transform={`translate(0 ${104 + i * 54})`}>
          <text x={242} y={0} fontSize={26} fontWeight={800} fill={C.plusDark}>
            -
          </text>
          <text x={264} y={0} fontSize={13} fill={C.ink}>
            {tekst.endsWith('?') ? tekst : tekst + '.'}
          </text>
        </g>
      ))}

      <text x={240} y={292} textAnchor="middle" fontSize={17} fontWeight={700} fill={C.white}>
        w zeszycie: nowa linia, myślnik, znak na końcu
      </text>
    </svg>
  );
}
