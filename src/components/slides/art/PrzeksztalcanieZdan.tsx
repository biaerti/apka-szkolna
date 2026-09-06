// Ilustracja "przeksztalcanieZdan": to samo zdanie w czterech postaciach -
// oznajmujacej, pytajacej, wykrzyknieniu i jako rownowaznik zdania.

import { ART_COLORS as C, ART_FONT } from './colors';

// [nazwa postaci, zdanie, kolor]
const POSTACIE: Array<[string, string, string]> = [
  ['oznajmujące', 'Ala wraca do domu.', C.plus],
  ['pytające', 'Czy Ala wraca do domu?', C.kropka],
  ['wykrzyknienie', 'Ala wraca do domu!', C.plomba],
  ['równoważnik', 'Powrót Ali do domu.', C.pas],
];

export function PrzeksztalcanieZdan({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 300"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: to samo zdanie jako oznajmujace, pytajace, wykrzyknienie i rownowaznik zdania"
      style={{ fontFamily: ART_FONT }}
    >
      <text x={240} y={24} textAnchor="middle" fontSize={21} fontWeight={800} fill={C.white}>
        TO SAMO, CZTERY SPOSOBY
      </text>

      {POSTACIE.map(([nazwa, zdanie, kolor], i) => (
        <g key={nazwa} transform={`translate(0 ${38 + i * 62})`}>
          <rect x={22} y={0} width={436} height={50} rx={11} fill={C.panel} stroke={kolor} strokeWidth={3} />
          <text x={44} y={32} fontSize={20} fontWeight={700} fill={C.white}>
            {zdanie}
          </text>
          <text x={438} y={31} textAnchor="end" fontSize={15} fontWeight={800} fill={kolor}>
            {nazwa}
          </text>
        </g>
      ))}

      <text x={240} y={292} textAnchor="middle" fontSize={18} fill={C.panelLight}>
        równoważnik nie ma orzeczenia - nic tam nie "robi"
      </text>
    </svg>
  );
}
