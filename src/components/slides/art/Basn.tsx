// Ilustracja "basn": basn jest zmyslona, legenda tlumaczy prawdziwe miejsce.

import { ART_COLORS as C, ART_FONT } from './colors';

function Gwiazdka({ x, y, r }: { x: number; y: number; r: number }) {
  const punkty = Array.from({ length: 10 }, (_, i) => {
    const promien = i % 2 === 0 ? r : r / 2.4;
    const kat = (Math.PI / 5) * i - Math.PI / 2;
    return `${x + promien * Math.cos(kat)},${y + promien * Math.sin(kat)}`;
  }).join(' ');
  return <polygon points={punkty} fill={C.pas} />;
}

export function Basn({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 300"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: basn jest zmyslona i ma magie, legenda tlumaczy pochodzenie prawdziwego miejsca"
      style={{ fontFamily: ART_FONT }}
    >
      {/* Basn */}
      <g>
        <rect x={20} y={16} width={190} height={186} rx={14} fill={C.panel} stroke={C.pas} strokeWidth={4} />
        <Gwiazdka x={80} y={70} r={26} />
        <Gwiazdka x={140} y={104} r={16} />
        <Gwiazdka x={158} y={54} r={11} />
        <text x={115} y={152} textAnchor="middle" fontSize={16} fill={C.white}>
          Dawno, dawno temu...
        </text>
        <text x={115} y={182} textAnchor="middle" fontSize={17} fontWeight={700} fill={C.pas}>
          magia, zmyślona
        </text>
        <text x={115} y={236} textAnchor="middle" fontSize={24} fontWeight={800} fill={C.pas}>
          BAŚŃ
        </text>
      </g>

      {/* Legenda */}
      <g>
        <rect x={270} y={16} width={190} height={186} rx={14} fill={C.panel} stroke={C.kropka} strokeWidth={4} />
        {/* Zamek - prawdziwe miejsce */}
        <g transform="translate(365 96)">
          <rect x={-56} y={-14} width={112} height={62} fill={C.kropka} />
          <rect x={-56} y={-40} width={22} height={26} fill={C.kropka} />
          <rect x={-11} y={-52} width={22} height={38} fill={C.kropka} />
          <rect x={34} y={-40} width={22} height={26} fill={C.kropka} />
          <rect x={-12} y={12} width={24} height={36} rx={12} fill={C.panel} />
        </g>
        <text x={365} y={182} textAnchor="middle" fontSize={17} fontWeight={700} fill={C.kropka}>
          prawdziwe miejsce
        </text>
        <text x={365} y={236} textAnchor="middle" fontSize={24} fontWeight={800} fill={C.kropka}>
          LEGENDA
        </text>
      </g>

      <text x={240} y={278} textAnchor="middle" fontSize={18} fill={C.panelLight}>
        bohater główny - postać, o której jest cała historia
      </text>
    </svg>
  );
}
