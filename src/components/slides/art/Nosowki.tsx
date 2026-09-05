// Ilustracja "nosowki": kiedy piszemy a z ogonkiem i e z ogonkiem, a kiedy om, on, em, en.

import { ART_COLORS as C, ART_FONT } from './colors';

const OGONKI = ['wąsy', 'gęś', 'kąt', 'ręka'];
const PRZEZ_N = ['bomba', 'konduktor', 'temperatura', 'sensacja'];

export function Nosowki({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 320"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: pisownia a i e z ogonkiem kontra om, on, em, en"
      style={{ fontFamily: ART_FONT }}
    >
      <rect x={16} y={12} width={200} height={48} rx={10} fill={C.panel} stroke={C.plus} strokeWidth={3} />
      <text x={116} y={46} textAnchor="middle" fontSize={30} fontWeight={800} fill={C.plus}>
        ą, ę
      </text>
      <text x={116} y={82} textAnchor="middle" fontSize={15} fill={C.white}>
        słychać jedną głoskę
      </text>
      {OGONKI.map((w, i) => (
        <text key={w} x={116} y={114 + i * 32} textAnchor="middle" fontSize={22} fill={C.plus}>
          {w}
        </text>
      ))}

      <rect x={264} y={12} width={200} height={48} rx={10} fill={C.panel} stroke={C.kropka} strokeWidth={3} />
      <text x={364} y={44} textAnchor="middle" fontSize={22} fontWeight={800} fill={C.kropka}>
        om on em en
      </text>
      <text x={364} y={82} textAnchor="middle" fontSize={15} fill={C.white}>
        słychać osobne n albo m
      </text>
      {PRZEZ_N.map((w, i) => (
        <text key={w} x={364} y={114 + i * 32} textAnchor="middle" fontSize={20} fill={C.kropka}>
          {w}
        </text>
      ))}

      <rect x={16} y={250} width={448} height={56} rx={10} fill={C.panel} stroke={C.pas} strokeWidth={3} />
      <text x={240} y={275} textAnchor="middle" fontSize={17} fontWeight={700} fill={C.pas}>
        Sprawdzasz uchem: powiedz wyraz powoli.
      </text>
      <text x={240} y={297} textAnchor="middle" fontSize={17} fill={C.white}>
        Słyszysz osobne n lub m? Piszesz dwie litery.
      </text>
    </svg>
  );
}
