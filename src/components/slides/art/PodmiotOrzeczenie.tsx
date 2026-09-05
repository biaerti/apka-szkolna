// Ilustracja "podmiotOrzeczenie": zdanie z zaznaczonym podmiotem i orzeczeniem.

import { ART_COLORS as C, ART_FONT } from './colors';

export function PodmiotOrzeczenie({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 300"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: w zdaniu Mala Zosia czyta ksiazke podmiotem jest Zosia, a orzeczeniem czyta"
      style={{ fontFamily: ART_FONT }}
    >
      {/* Zdanie - podmiot i orzeczenie wyroznione kolorem */}
      <g transform="translate(0 72)">
        <text x={24} y={30} fontSize={26} fontWeight={700} fill={C.panelLight}>
          Mała
        </text>
        <rect x={98} y={-2} width={98} height={44} rx={10} fill={C.plus} />
        <text x={147} y={30} textAnchor="middle" fontSize={26} fontWeight={800} fill={C.panel}>
          Zosia
        </text>
        <rect x={206} y={-2} width={86} height={44} rx={10} fill={C.pas} />
        <text x={249} y={30} textAnchor="middle" fontSize={26} fontWeight={800} fill={C.panel}>
          czyta
        </text>
        <text x={302} y={30} fontSize={26} fontWeight={700} fill={C.panelLight}>
          książkę.
        </text>
      </g>

      {/* Opisy pod wyroznionymi wyrazami */}
      <g stroke={C.panelLight} strokeWidth={2}>
        <path d="M147 122 V150" />
        <path d="M249 122 V150" />
      </g>

      <text x={130} y={176} textAnchor="middle" fontSize={20} fontWeight={800} fill={C.plus}>
        PODMIOT
      </text>
      <text x={130} y={202} textAnchor="middle" fontSize={19} fill={C.white}>
        kto? co?
      </text>

      <text x={290} y={176} textAnchor="middle" fontSize={20} fontWeight={800} fill={C.pas}>
        ORZECZENIE
      </text>
      <text x={290} y={202} textAnchor="middle" fontSize={19} fill={C.white}>
        co robi?
      </text>

      <text x={240} y={252} textAnchor="middle" fontSize={18} fill={C.panelLight}>
        orzeczenie to czasownik w formie osobowej
      </text>
      <text x={240} y={280} textAnchor="middle" fontSize={18} fill={C.panelLight}>
        reszta wyrazów to określenia
      </text>
    </svg>
  );
}
