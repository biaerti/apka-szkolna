// Ilustracja "koperta": adres nadawcy w lewym gornym rogu, adres odbiorcy
// w prawym dolnym, znaczek w prawym gornym.

import { ART_COLORS as C, ART_FONT } from './colors';

const NADAWCA = ['Antek Nowak', 'ul. Polna 5', '01-234 Warszawa'];
const ODBIORCA = ['Zosia Kowalska', 'ul. Leśna 12', '05-678 Piaseczno'];

export function Koperta({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 300"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: koperta z adresem nadawcy w lewym gornym rogu, znaczkiem i adresem odbiorcy w prawym dolnym"
      style={{ fontFamily: ART_FONT }}
    >
      <rect x={20} y={22} width={440} height={230} rx={10} fill={C.paper} stroke={C.pas} strokeWidth={4} />

      {/* Znaczek */}
      <rect x={382} y={40} width={56} height={62} rx={4} fill={C.pas} opacity={0.35} stroke={C.pasDark} strokeWidth={3} />
      <text x={410} y={78} textAnchor="middle" fontSize={16} fontWeight={700} fill={C.pasDark}>
        znaczek
      </text>

      {/* Nadawca */}
      <text x={44} y={58} fontSize={15} fontWeight={800} fill={C.pasDark}>
        NADAWCA
      </text>
      {NADAWCA.map((linia, i) => (
        <text key={linia} x={44} y={82 + i * 22} fontSize={17} fill={C.ink}>
          {linia}
        </text>
      ))}

      {/* Odbiorca */}
      <text x={198} y={158} fontSize={15} fontWeight={800} fill={C.pasDark}>
        ODBIORCA
      </text>
      {ODBIORCA.map((linia, i) => (
        <text key={linia} x={198} y={184 + i * 24} fontSize={20} fontWeight={700} fill={C.ink}>
          {linia}
        </text>
      ))}

      <text x={240} y={288} textAnchor="middle" fontSize={18} fill={C.panelLight}>
        odbiorca większymi literami, na środku
      </text>
    </svg>
  );
}
