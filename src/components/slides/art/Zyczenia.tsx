// Ilustracja "zyczenia": zyczenia i podziekowanie - dwie krotkie formy uzytkowe obok siebie.

import { ART_COLORS as C, ART_FONT } from './colors';

const ZYCZENIA = ['Kochana Babciu!', 'Z okazji urodzin', 'życzę Ci zdrowia', 'i samych radości.', 'Zosia'];
const PODZIEKOWANIE = ['Pani Anno!', 'Dziękujemy za', 'wycieczkę do lasu.', 'Było wspaniale.', 'Klasa IV A'];

function Kartka({
  x,
  tytul,
  kolor,
  linie,
}: {
  x: number;
  tytul: string;
  kolor: string;
  linie: string[];
}) {
  return (
    <g transform={`translate(${x} 44)`}>
      <rect width={212} height={244} rx={12} fill={C.paper} stroke={kolor} strokeWidth={4} />
      <rect width={212} height={40} rx={12} fill={kolor} />
      <text x={106} y={28} textAnchor="middle" fontSize={19} fontWeight={800} fill={C.ink}>
        {tytul}
      </text>
      {linie.map((l, i) => (
        <text
          key={l}
          x={106}
          y={78 + i * 34}
          textAnchor="middle"
          fontSize={16}
          fontWeight={i === 0 || i === linie.length - 1 ? 700 : 400}
          fill={C.ink}
        >
          {l}
        </text>
      ))}
    </g>
  );
}

export function Zyczenia({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 320"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: kartka z zyczeniami i kartka z podziekowaniem"
      style={{ fontFamily: ART_FONT }}
    >
      <text x={240} y={24} textAnchor="middle" fontSize={21} fontWeight={800} fill={C.plus}>
        KRÓTKIE FORMY UŻYTKOWE
      </text>

      <Kartka x={16} tytul="ŻYCZENIA" kolor={C.plus} linie={ZYCZENIA} />
      <Kartka x={252} tytul="PODZIĘKOWANIE" kolor={C.kropka} linie={PODZIEKOWANIE} />

      <text x={240} y={310} textAnchor="middle" fontSize={16} fill={C.white}>
        zawsze: do kogo - za co / z jakiej okazji - podpis
      </text>
    </svg>
  );
}
