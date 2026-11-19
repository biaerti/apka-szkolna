// Ilustracja "zdrada" (lektura, lekcja o Gerebie): co psuje zdrada w grupie.
// Gora: PRZED - chlopcy i Gereb stoja na wspolnym fundamencie (zaufanie),
// nad nimi luk sympatii. PO zdradzie fundament peka pod Gerebem, a luk
// sympatii zostaje. Dol: kazdy zly czyn ma motyw - motyw (zazdrosc) -> czyn
// (zdrada). Malo tekstu, nauczyciel omawia na glos.
//
// Grupy z `data-krok` wchodza po kolei strzalkami na slajdzie `krokowo`
// (src/components/slides/useKrokiListy.ts).

import { ART_COLORS as C, ART_FONT } from './colors';

const FIOLET = '#a78bfa';

function Postac({ x, y, kolor, s = 1 }: { x: number; y: number; kolor: string; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx={0} cy={-62} r={17} fill={kolor} />
      <path d="M-24 0 A24 34 0 0 1 24 0 Z" transform="translate(0 -6)" fill={kolor} />
    </g>
  );
}

function Serce({ x, y, r = 1 }: { x: number; y: number; r?: number }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${r})`}
      d="M0 12 C-22 -4 -16 -22 -4 -18 C0 -17 0 -14 0 -12 C0 -14 0 -17 4 -18 C16 -22 22 -4 0 12 Z"
      fill={C.plomba}
      stroke={C.white}
      strokeWidth={1.5}
    />
  );
}

function Klodka({ x, y, otwarta = false, kolor = C.kropka }: { x: number; y: number; otwarta?: boolean; kolor?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d={otwarta ? 'M-9 -4 V-14 A9 9 0 0 1 9 -14 V-20' : 'M-9 -4 V-14 A9 9 0 0 1 9 -14 V-4'}
        fill="none"
        stroke={kolor}
        strokeWidth={4}
        strokeLinecap="round"
        transform={otwarta ? 'translate(0 -6)' : undefined}
      />
      <rect x={-14} y={-5} width={28} height={22} rx={4} fill={kolor} />
      <circle cx={0} cy={5} r={3} fill={C.panel} />
    </g>
  );
}

function Napis({ x, y, children, kolor = C.white, size = 26, anchor = 'middle' as const }: {
  x: number; y: number; children: string; kolor?: string; size?: number; anchor?: 'start' | 'middle' | 'end';
}) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={800} fill={kolor}>
      {children}
    </text>
  );
}

/** Grupa: trzech chlopcow z Placu (zieloni) i Gereb (bursztynowy) na fundamencie zaufania. */
function Grupa({ x, po = false }: { x: number; po?: boolean }) {
  const ziemia = 236;
  return (
    <g transform={`translate(${x} 0)`}>
      {/* luk sympatii nad wszystkimi */}
      <path d="M70 110 Q215 30 360 110" fill="none" stroke={C.plomba} strokeWidth={5} strokeDasharray={po ? '10 9' : undefined} />
      <Serce x={215} y={66} r={1.3} />

      <Postac x={60} y={ziemia} kolor={C.plus} />
      <Postac x={125} y={ziemia} kolor={C.plus} />
      <Postac x={190} y={ziemia} kolor={C.plus} />

      {po ? (
        <g>
          {/* fundament pekniety: kawalek pod Gerebem odpada i opada */}
          <path d={`M15 ${ziemia} H262 L272 ${ziemia + 10} L258 ${ziemia + 20} L268 ${ziemia + 30} H15 Z`} fill={C.kropka} />
          <g transform="translate(18 28) rotate(9 340 250)">
            <path d={`M286 ${ziemia} H405 V${ziemia + 30} H292 L282 ${ziemia + 20} L296 ${ziemia + 10} Z`} fill={C.kropkaDark} />
            <Postac x={345} y={ziemia} kolor={C.pas} />
          </g>
          <Klodka x={248} y={ziemia + 70} otwarta kolor={C.muted} />
        </g>
      ) : (
        <g>
          <rect x={15} y={ziemia} width={390} height={30} rx={4} fill={C.kropka} />
          <Postac x={345} y={ziemia} kolor={C.pas} />
          <Klodka x={210} y={ziemia + 70} />
        </g>
      )}
    </g>
  );
}

export function Zdrada({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 600"
      className={className ?? 'h-auto w-full'}
      role="img"
      aria-label="Ilustracja: przed zdrada grupa ma sympatie i zaufanie, po zdradzie zaufanie peka, sympatia moze zostac; motyw zazdrosc prowadzi do czynu zdrady"
      style={{ fontFamily: ART_FONT }}
    >
      {/* 1. PRZED */}
      <g data-krok="1">
        <Napis x={235} y={30} kolor={C.line} size={28}>PRZED</Napis>
        <Grupa x={25} />
        <Napis x={235} y={348} kolor={C.kropka} size={24}>zaufanie = fundament</Napis>
      </g>

      {/* 2. ZDRADA -> PO */}
      <g data-krok="2">
        <path d="M478 170 H690" stroke={C.pas} strokeWidth={8} strokeLinecap="round" />
        <path d="M690 170 l-26 -18 v36 Z" fill={C.pas} />
        <Napis x={584} y={150} kolor={C.pas} size={30}>zdrada</Napis>
        <Napis x={940} y={30} kolor={C.line} size={28}>PO</Napis>
        <Grupa x={730} po />
        <Napis x={940} y={348} kolor={C.muted} size={24}>zaufanie zerwane</Napis>
        <Napis x={940} y={384} kolor={C.plomba} size={24}>sympatia może zostać</Napis>
      </g>

      {/* 3. MOTYW -> CZYN */}
      <g data-krok="3">
        <rect x={190} y={440} width={330} height={130} rx={18} fill={C.panel} stroke={FIOLET} strokeWidth={5} />
        <Napis x={355} y={490} kolor={FIOLET} size={34}>MOTYW</Napis>
        <Napis x={355} y={540} size={30}>zazdrość</Napis>
        <path d="M540 505 H650" stroke={C.white} strokeWidth={7} strokeLinecap="round" />
        <path d="M672 505 l-28 -18 v36 Z" fill={C.white} />
        <rect x={690} y={440} width={330} height={130} rx={18} fill={C.panel} stroke={C.plomba} strokeWidth={5} />
        <Napis x={855} y={490} kolor={C.plomba} size={34}>CZYN</Napis>
        <Napis x={855} y={540} size={30}>zdrada</Napis>
      </g>
    </svg>
  );
}
