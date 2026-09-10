// Ilustracja "email": pola wiadomosci e-mail - do kogo, temat, tresc, podpis,
// zalacznik. Odpowiednik listu, tylko na ekranie.

import { ART_COLORS as C, ART_FONT } from './colors';

const POLA: Array<[string, string]> = [
  ['Do:', 'a.kowalska@sp97.edu.pl'],
  ['Temat:', 'Prośba o termin oddania pracy'],
];

export function Email({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 320"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: budowa wiadomosci e-mail - adres, temat, zwrot, tresc, podpis, zalacznik"
      style={{ fontFamily: ART_FONT }}
    >
      <text x={240} y={24} textAnchor="middle" fontSize={20} fontWeight={800} fill={C.kropka}>
        E-MAIL TO LIST NA EKRANIE
      </text>

      <rect x={24} y={38} width={432} height={230} rx={12} fill={C.paper} stroke={C.ink} strokeWidth={3} />

      {POLA.map(([etykieta, wartosc], i) => (
        <g key={etykieta} transform={`translate(0 ${70 + i * 36})`}>
          <text x={44} y={0} fontSize={16} fontWeight={800} fill={C.kropkaDark}>
            {etykieta}
          </text>
          <text x={116} y={0} fontSize={16} fill={C.ink}>
            {wartosc}
          </text>
          <line x1={44} y1={12} x2={436} y2={12} stroke={C.line} strokeWidth={2} />
        </g>
      ))}

      <text x={44} y={158} fontSize={16} fill={C.ink}>
        Dzień dobry, Pani Aniu,
      </text>
      <text x={44} y={184} fontSize={16} fill={C.ink}>
        czy mogę oddać opowiadanie w piątek?
      </text>
      <text x={44} y={210} fontSize={16} fill={C.ink}>
        Z wyrazami szacunku
      </text>
      <text x={44} y={234} fontSize={16} fontWeight={700} fill={C.ink}>
        Zofia Nowak, klasa 5b
      </text>

      <g transform="translate(300 216)">
        <rect x={-16} y={-16} width={168} height={30} rx={8} fill={C.panelLight} />
        <text x={68} y={5} textAnchor="middle" fontSize={14} fill={C.white}>
          załącznik: praca.pdf
        </text>
      </g>

      <text x={240} y={294} textAnchor="middle" fontSize={16} fontWeight={700} fill={C.pas}>
        temat nigdy nie zostaje pusty
      </text>
    </svg>
  );
}
