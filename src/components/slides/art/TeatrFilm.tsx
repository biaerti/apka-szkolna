// Ilustracja "teatrFilm": co tworzy spektakl, a co film - dwie kolumny.

import { ART_COLORS as C, ART_FONT } from './colors';

const TEATR = ['scena i widownia', 'aktorzy na żywo', 'scenografia', 'reżyser', 'kostiumy'];
const FILM = ['ekran', 'kamera i zdjęcia', 'plan filmowy', 'reżyser', 'muzyka, montaż'];

export function TeatrFilm({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 320"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: elementy spektaklu teatralnego i dziela filmowego"
      style={{ fontFamily: ART_FONT }}
    >
      {/* Teatr - kurtyna */}
      <rect x={16} y={12} width={212} height={56} rx={10} fill={C.panel} stroke={C.plomba} strokeWidth={3} />
      <path d="M 30 12 q 22 28 0 56 M 214 12 q -22 28 0 56" stroke={C.plomba} strokeWidth={3} fill="none" />
      <text x={122} y={48} textAnchor="middle" fontSize={24} fontWeight={800} fill={C.plomba}>
        TEATR
      </text>

      {/* Film - klaps */}
      <rect x={252} y={12} width={212} height={56} rx={10} fill={C.panel} stroke={C.kropka} strokeWidth={3} />
      <path d="M 252 26 l 212 0" stroke={C.kropka} strokeWidth={3} />
      <text x={358} y={52} textAnchor="middle" fontSize={24} fontWeight={800} fill={C.kropka}>
        FILM
      </text>

      {TEATR.map((t, i) => (
        <text key={t} x={122} y={104 + i * 40} textAnchor="middle" fontSize={18} fill={C.white}>
          {t}
        </text>
      ))}
      {FILM.map((t, i) => (
        <text key={t} x={358} y={104 + i * 40} textAnchor="middle" fontSize={18} fill={C.white}>
          {t}
        </text>
      ))}

      <line x1={240} y1={82} x2={240} y2={288} stroke={C.panelLight} strokeWidth={2} />

      <text x={240} y={312} textAnchor="middle" fontSize={16} fill={C.pas}>
        adaptacja = książka przerobiona na film albo spektakl
      </text>
    </svg>
  );
}
