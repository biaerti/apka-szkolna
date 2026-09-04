// Ilustracja "opis": plecak i przymiotniki, ktore mowia, jaki on jest.

import { ART_COLORS as C, ART_FONT } from './colors';

export function Opis({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 300"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: opis plecaka przymiotnikami - granatowy, duzy, wygodny"
      style={{ fontFamily: ART_FONT }}
    >
      <text x={240} y={30} textAnchor="middle" fontSize={23} fontWeight={800} fill={C.white}>
        OPIS: jaki? jaka? jakie?
      </text>

      {/* Plecak */}
      <g transform="translate(240 168)">
        {/* Szelki wystajace zza korpusu */}
        <rect x={-64} y={-46} width={16} height={80} rx={8} fill={C.panelLight} />
        <rect x={48} y={-46} width={16} height={80} rx={8} fill={C.panelLight} />
        {/* Korpus */}
        <rect x={-52} y={-58} width={104} height={116} rx={20} fill={C.kropkaDark} stroke={C.kropka} strokeWidth={4} />
        {/* Klapa i kieszen */}
        <path d="M-52 -18 H52" stroke={C.kropka} strokeWidth={4} />
        <rect x={-28} y={4} width={56} height={38} rx={8} fill={C.kropka} />
      </g>

      {/* Przymiotniki na wskaznikach */}
      <g stroke={C.pas} strokeWidth={3} strokeLinecap="round">
        <path d="M188 130 L124 108" />
        <path d="M292 130 L356 108" />
        <path d="M240 226 L240 250" />
      </g>
      <text x={118} y={102} textAnchor="end" fontSize={20} fontWeight={700} fill={C.pas}>
        granatowy
      </text>
      <text x={362} y={102} fontSize={20} fontWeight={700} fill={C.pas}>
        duży
      </text>
      <text x={240} y={274} textAnchor="middle" fontSize={20} fontWeight={700} fill={C.pas}>
        wygodny
      </text>
    </svg>
  );
}
