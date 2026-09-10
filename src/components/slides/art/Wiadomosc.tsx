// Ilustracja "wiadomosc": z czego sklada sie wiadomosc do doroslego (czat,
// komunikator klasowy) i czym rozni sie od wiadomosci wyslanej byle jak.

import { ART_COLORS as C, ART_FONT } from './colors';

const CZESCI: Array<[string, string]> = [
  ['1', 'Dzień dobry, Pani Aniu,'],
  ['2', 'czy mogę oddać pracę jutro?'],
  ['3', 'Dziękuję i pozdrawiam,'],
  ['4', 'Zosia z klasy 4b'],
];

export function Wiadomosc({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 320"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: cztery czesci wiadomosci do doroslego - powitanie, prosba, podziekowanie, podpis"
      style={{ fontFamily: ART_FONT }}
    >
      <text x={240} y={24} textAnchor="middle" fontSize={20} fontWeight={800} fill={C.plus}>
        WIADOMOŚĆ DO DOROSŁEGO
      </text>

      <rect x={26} y={38} width={288} height={186} rx={14} fill={C.paper} stroke={C.ink} strokeWidth={3} />
      {CZESCI.map(([nr, tekst], i) => (
        <g key={nr} transform={`translate(0 ${74 + i * 42})`}>
          <circle cx={54} cy={-6} r={13} fill={C.plusDark} />
          <text x={54} y={0} textAnchor="middle" fontSize={15} fontWeight={800} fill={C.white}>
            {nr}
          </text>
          <text x={78} y={0} fontSize={16} fill={C.ink}>
            {tekst}
          </text>
        </g>
      ))}

      <g transform="translate(326 38)">
        <text x={68} y={16} textAnchor="middle" fontSize={15} fontWeight={700} fill={C.plus}>
          zawsze jest
        </text>
        {['powitanie', 'prośba', 'podziękowanie', 'podpis'].map((slowo, i) => (
          <text key={slowo} x={68} y={46 + i * 42} textAnchor="middle" fontSize={15} fill={C.white}>
            {slowo}
          </text>
        ))}
      </g>

      <rect x={26} y={236} width={428} height={62} rx={12} fill={C.panel} stroke={C.plomba} strokeWidth={3} />
      <text x={46} y={262} fontSize={16} fontWeight={800} fill={C.plomba}>
        NIE:
      </text>
      <text x={92} y={262} fontSize={16} fill={C.muted} textDecoration="line-through">
        „MOGE ODDAC JUTRO???"
      </text>
      <text x={46} y={286} fontSize={14} fill={C.line}>
        wielkie litery to krzyk, brak powitania i podpisu to niedbałość
      </text>
    </svg>
  );
}
